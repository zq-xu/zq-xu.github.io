package verify

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/IBM/sarama"

	"github.com/zq-xu/kafka-demo/internal/kafkax"
)

// consume joins the temporary group and waits until every record of this run
// has been collected.
func (r *run) consume() error {
	session, err := r.startGroupSession()
	if err != nil {
		return err
	}
	defer session.close()

	if err := session.waitFor(r.opts.Messages); err != nil {
		return err
	}
	if session.handler.Count() >= r.opts.Messages {
		fmt.Printf("  collected all %d records\n", session.handler.Count())
	}
	return r.reportConsumption()
}

func (r *run) reportConsumption() error {
	snap := r.stats.snapshot()
	r.check.check("records consumed", snap.Count == r.opts.Messages, "got %d, want %d", snap.Count, r.opts.Messages)
	r.check.check("offsets monotonic", snap.Ordered, "last offset per partition %v", snap.LastOffset)

	fmt.Println("  records per partition:")
	for _, partition := range snap.partitions() {
		fmt.Printf("    partition %d -> %d records\n", partition, snap.PerPartition[partition])
	}
	return nil
}

// groupSession owns everything that lives only for step 5: its own connection
// (so the produce connection is untouched), the group, the handler and the
// goroutine running ConsumeGroup.
type groupSession struct {
	group    sarama.ConsumerGroup
	client   sarama.Client
	handler  *kafkax.GroupHandler
	stats    *consumeStats
	cancel   context.CancelFunc
	done     chan error
	timeout  time.Duration
	finished bool
}

func (r *run) startGroupSession() (*groupSession, error) {
	client, err := kafkax.NewClientWith(&r.base, func(c *sarama.Config) {
		// Commits run in the background; a shorter interval makes lag settle
		// sooner, which is what step 6 asserts.
		c.Consumer.Offsets.AutoCommit.Interval = time.Second
	})
	if err != nil {
		return nil, fmt.Errorf("create connection for the consumer group: %w", err)
	}

	group, err := sarama.NewConsumerGroupFromClient(r.groupID, client)
	if err != nil {
		client.Close()
		return nil, fmt.Errorf("create consumer group: %w", err)
	}

	stats := newConsumeStats()
	ctx, cancel := context.WithCancel(context.Background())
	handler := &kafkax.GroupHandler{
		Limit:     r.opts.Messages,
		OnMessage: stats.record,
		OnLimit:   cancel,
	}
	session := &groupSession{
		group:   group,
		client:  client,
		handler: handler,
		stats:   stats,
		cancel:  cancel,
		done:    make(chan error, 1),
		timeout: r.opts.Timeout,
	}
	r.stats = stats

	go func() { session.done <- kafkax.ConsumeGroup(ctx, group, r.opts.Topic, handler) }()
	return session, nil
}

// waitFor polls the counter instead of waiting on the context: the limit only
// fires when the next record arrives, so once the topic is drained OnLimit is
// never called.
func (s *groupSession) waitFor(want int) error {
	deadline := time.Now().Add(s.timeout)
	for s.handler.Count() < want {
		select {
		case err := <-s.done:
			s.finished = true
			return s.exitError(err, want)
		case <-time.After(100 * time.Millisecond):
		}
		if time.Now().After(deadline) {
			fmt.Printf("  timed out after %s, received %d records\n", s.timeout, s.handler.Count())
			return fmt.Errorf("timed out waiting for %d records, received %d", want, s.handler.Count())
		}
	}
	return nil
}

func (s *groupSession) exitError(err error, want int) error {
	if err != nil {
		return fmt.Errorf("consumer group failed: %w", err)
	}
	if s.handler.Count() < want {
		return fmt.Errorf("consumer group exited before collecting all records (%d received)", s.handler.Count())
	}
	return nil
}

func (s *groupSession) close() {
	s.cancel()
	if !s.finished {
		select {
		case <-s.done:
		case <-time.After(5 * time.Second):
			fmt.Println("  warning: consume loop did not stop within 5s")
		}
	}
	if err := s.group.Close(); err != nil {
		fmt.Fprintf(os.Stderr, "  close consumer group: %v\n", err)
	}
	s.client.Close()
}
