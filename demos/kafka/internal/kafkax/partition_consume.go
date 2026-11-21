package kafkax

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/IBM/sarama"
)

// PartitionOptions describes a direct partition read: no consumer group and
// therefore no committed offset.
type PartitionOptions struct {
	Topic      string
	Partitions []int32
	Start      int64 // OffsetOldest / OffsetNewest / an absolute offset
	Limit      int   // stop after N records, 0 means "until cancelled"
	OnMessage  func(*sarama.ConsumerMessage)
}

// PartitionResult is what a partition read produced.
type PartitionResult struct {
	Count   int
	Elapsed time.Duration
}

// ConsumePartitions reads the given partitions directly.
//
// Nothing is committed, so a restart reads again from the same start point and
// several processes each get their own copy of the data.
func ConsumePartitions(ctx context.Context, consumer sarama.Consumer, o PartitionOptions) (PartitionResult, error) {
	runCtx, cancel := context.WithCancel(ctx)
	merged, stop, err := subscribe(runCtx, consumer, o)
	if err != nil {
		cancel()
		return PartitionResult{}, err
	}
	defer func() {
		cancel()
		stop()
		drain(merged)
	}()

	start := time.Now()
	count := collect(runCtx, merged, o)
	return PartitionResult{Count: count, Elapsed: time.Since(start)}, nil
}

// subscribe starts one partition consumer per target and merges their records
// into a single channel. Closing the returned channel lets the callers exit.
func subscribe(ctx context.Context, consumer sarama.Consumer, o PartitionOptions) (<-chan *sarama.ConsumerMessage, func(), error) {
	merged := make(chan *sarama.ConsumerMessage, 256)
	pcs := make([]sarama.PartitionConsumer, 0, len(o.Partitions))

	for _, partition := range o.Partitions {
		pc, err := consumer.ConsumePartition(o.Topic, partition, o.Start)
		if err != nil {
			closePartitions(pcs)
			return nil, nil, fmt.Errorf("subscribe partition %d: %w", partition, err)
		}
		pcs = append(pcs, pc)
	}

	var wg sync.WaitGroup
	wg.Add(len(pcs))
	for _, pc := range pcs {
		go func(pc sarama.PartitionConsumer) {
			defer wg.Done()
			forward(ctx, pc, merged)
		}(pc)
	}
	go func() {
		wg.Wait()
		close(merged)
	}()

	return merged, func() { closePartitions(pcs) }, nil
}

// forward copies one partition stream into the merged channel. It exits when
// the partition ends or the context is cancelled.
func forward(ctx context.Context, pc sarama.PartitionConsumer, out chan<- *sarama.ConsumerMessage) {
	for {
		select {
		case msg, ok := <-pc.Messages():
			if !ok {
				return
			}
			select {
			case out <- msg:
			case <-ctx.Done():
				return
			}
		case <-ctx.Done():
			return
		}
	}
}

// collect reads the merged stream until the limit is reached, the context is
// cancelled or all partitions are drained.
func collect(ctx context.Context, merged <-chan *sarama.ConsumerMessage, o PartitionOptions) int {
	count := 0
	for {
		select {
		case msg, ok := <-merged:
			if !ok {
				return count
			}
			if o.OnMessage != nil {
				o.OnMessage(msg)
			}
			count++
			if o.Limit > 0 && count >= o.Limit {
				return count
			}
		case <-ctx.Done():
			return count
		}
	}
}

func closePartitions(pcs []sarama.PartitionConsumer) {
	for _, pc := range pcs {
		pc.AsyncClose()
	}
}

// drain lets the forwarding goroutines finish after the context is cancelled.
func drain(merged <-chan *sarama.ConsumerMessage) {
	for range merged {
	}
}
