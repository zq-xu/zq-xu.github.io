package cmd

import (
	"fmt"
	"sort"
	"time"

	"github.com/IBM/sarama"
	"github.com/spf13/cobra"

	"github.com/zq-xu/kafka-demo/internal/cli"
	"github.com/zq-xu/kafka-demo/internal/kafkax"
)

// sampleLimit is how many sent records are printed one by one.
const sampleLimit = 20

// produceFlags holds the flags of `produce` only.
type produceFlags struct {
	count     int
	async     bool
	keys      int
	keyPrefix string
}

func newProduceCommand(g *kafkax.Options) *cobra.Command {
	f := &produceFlags{count: 10, keys: 5, keyPrefix: "user"}

	cmd := &cobra.Command{
		Use:   "produce",
		Short: "Produce records (sync or async) and verify the key-to-partition mapping",
		Long: `Write records to a topic. The body is JSON and carries two headers,
source and seq.

  --async  async producer: records go into Input() and are batched internally,
           which gives much higher throughput. Delivery results are read from
           Successes()/Errors() and never block the main loop.

  Sync mode waits for the broker ACK on every record, so it returns the exact
  partition and offset, but throughput is bounded by the round trip.

  --keys   how many distinct keys to rotate. The key drives the partition
           through the hash partitioner, so the same key always lands on the
           same partition: that is the basis of per-key ordering.`,
		Example: `  kafka-demo produce --count 100
  kafka-demo produce --count 100 --async
  kafka-demo produce --count 30 --keys 3`,
		RunE: func(*cobra.Command, []string) error {
			return runProduce(g, f)
		},
	}

	cmd.Flags().IntVar(&f.count, "count", f.count, "number of records to send")
	cmd.Flags().BoolVar(&f.async, "async", f.async, "use the async producer")
	cmd.Flags().IntVar(&f.keys, "keys", f.keys, "number of distinct keys to rotate")
	cmd.Flags().StringVar(&f.keyPrefix, "key-prefix", f.keyPrefix, "prefix of the record key")
	return cmd
}

func runProduce(g *kafkax.Options, f *produceFlags) error {
	return cli.WithClient(g, nil, func(client sarama.Client) error {
		if f.async {
			return produceAsync(client, g, f)
		}
		return produceSync(client, g, f)
	})
}

func (f *produceFlags) options(g *kafkax.Options) kafkax.ProduceOptions {
	return kafkax.ProduceOptions{
		Topic:     g.Topic,
		Count:     f.count,
		Keys:      f.keys,
		KeyPrefix: f.keyPrefix,
	}
}

func produceSync(client sarama.Client, g *kafkax.Options, f *produceFlags) error {
	o := f.options(g)
	fmt.Printf("\n== Sync produce %d records -> %s ==\n", o.Count, o.Topic)

	start := time.Now()
	sent, err := kafkax.ProduceSync(client, o)
	if err != nil {
		return err
	}
	elapsed := time.Since(start)

	printSentSample(sent)
	printPartitionCounts(partitionCounts(sent))
	fmt.Printf("summary: %d succeeded, took %s, ~%.0f records/sec (one ACK per record, bounded by RTT)\n",
		len(sent), elapsed.Round(time.Millisecond), throughput(len(sent), elapsed))
	return nil
}

func produceAsync(client sarama.Client, g *kafkax.Options, f *produceFlags) error {
	o := f.options(g)
	fmt.Printf("\n== Async produce %d records -> %s ==\n", o.Count, o.Topic)

	report, err := kafkax.ProduceAsync(client, o)
	for _, sample := range report.ErrSamples {
		fmt.Printf("  error sample: %v\n", sample)
	}
	printPartitionCounts(report.PerPartition)
	fmt.Printf("summary: %d succeeded, %d failed, took %s, ~%.0f records/sec (batched, higher than sync)\n",
		report.Success, report.Failed, report.Elapsed.Round(time.Millisecond),
		throughput(report.Success, report.Elapsed))
	return err
}

func printSentSample(sent []kafkax.SentMessage) {
	shown := len(sent)
	if shown > sampleLimit {
		shown = sampleLimit
	}
	for _, m := range sent[:shown] {
		fmt.Printf("  #%03d key=%-10s -> partition=%d offset=%d\n", m.Seq, m.Key, m.Partition, m.Offset)
	}
	if len(sent) > shown {
		fmt.Printf("  ... %d more records omitted\n", len(sent)-shown)
	}
}

func partitionCounts(sent []kafkax.SentMessage) map[int32]int {
	counts := make(map[int32]int, 3)
	for _, m := range sent {
		counts[m.Partition]++
	}
	return counts
}

// printPartitionCounts prints records per partition in partition order, so it
// is obvious whether partitions were used evenly.
func printPartitionCounts(counts map[int32]int) {
	if len(counts) == 0 {
		return
	}

	partitions := make([]int32, 0, len(counts))
	for partition := range counts {
		partitions = append(partitions, partition)
	}
	sort.Slice(partitions, func(i, j int) bool { return partitions[i] < partitions[j] })

	fmt.Println("records per partition:")
	for _, partition := range partitions {
		fmt.Printf("  partition %d -> %d records\n", partition, counts[partition])
	}
}

func throughput(count int, elapsed time.Duration) float64 {
	if elapsed <= 0 {
		return 0
	}
	return float64(count) / elapsed.Seconds()
}
