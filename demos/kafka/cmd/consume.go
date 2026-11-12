package cmd

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/IBM/sarama"
	"github.com/spf13/cobra"

	"github.com/zq-xu/kafka-demo/internal/cli"
	"github.com/zq-xu/kafka-demo/internal/kafkax"
)

// consumeFlags holds the flags of `consume` only.
type consumeFlags struct {
	partition int
	offset    string
	limit     int
}

func newConsumeCommand(g *kafkax.Options) *cobra.Command {
	f := &consumeFlags{partition: -1, offset: "oldest", limit: 0}

	cmd := &cobra.Command{
		Use:   "consume",
		Short: "Read partitions directly from a chosen offset, without joining a group",
		Long: `Subscribe to partitions and pick the starting point yourself. No consumer
group is involved, therefore:

  - no offset is committed: a restart reads again from the offset you pass;
  - several processes reading the same partition each get their own copy,
    nothing is shared or balanced.

--offset accepts oldest / newest / a non-negative integer.
--partition -1 subscribes to every partition of the topic and merges their
records into one stream.

Stop with Ctrl+C; the total count is printed at the end.`,
		Example: `  kafka-demo consume --limit 10
  kafka-demo consume --partition 1 --offset oldest --limit 5
  kafka-demo consume --offset newest`,
		RunE: func(*cobra.Command, []string) error {
			return runConsume(g, f)
		},
	}

	cmd.Flags().IntVar(&f.partition, "partition", f.partition, "partition number, -1 means all partitions")
	cmd.Flags().StringVar(&f.offset, "offset", f.offset, "start offset: oldest / newest / non-negative integer")
	cmd.Flags().IntVar(&f.limit, "limit", f.limit, "stop after N records, 0 means keep reading")
	return cmd
}

func runConsume(g *kafkax.Options, f *consumeFlags) error {
	start, err := kafkax.ParseOffset(f.offset)
	if err != nil {
		return err
	}
	return cli.WithClient(g, nil, func(client sarama.Client) error {
		return consumeWith(client, g, f, start)
	})
}

func consumeWith(client sarama.Client, g *kafkax.Options, f *consumeFlags, start int64) error {
	consumer, err := sarama.NewConsumerFromClient(client)
	if err != nil {
		return fmt.Errorf("create partition consumer: %w", err)
	}
	defer consumer.Close()

	targets, err := partitionTargets(client, g.Topic, f.partition)
	if err != nil {
		return err
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	fmt.Printf("\n== Partition consume topic=%s offset=%s partitions=%v ==\n", g.Topic, f.offset, targets)
	result, err := kafkax.ConsumePartitions(ctx, consumer, kafkax.PartitionOptions{
		Topic:      g.Topic,
		Partitions: targets,
		Start:      start,
		Limit:      f.limit,
		OnMessage:  func(msg *sarama.ConsumerMessage) { kafkax.WriteMessage(os.Stdout, msg) },
	})
	if err != nil {
		return err
	}

	fmt.Printf("\nsummary: read %d records in %s (no offset committed, a restart re-reads from the same start)\n",
		result.Count, result.Elapsed.Round(time.Millisecond))
	return nil
}

func partitionTargets(client sarama.Client, topic string, partition int) ([]int32, error) {
	if partition >= 0 {
		return []int32{int32(partition)}, nil
	}
	partitions, err := client.Partitions(topic)
	if err != nil {
		return nil, fmt.Errorf("list partitions: %w", err)
	}
	return partitions, nil
}
