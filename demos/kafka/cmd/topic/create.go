package topic

import (
	"fmt"
	"time"

	"github.com/IBM/sarama"
	"github.com/spf13/cobra"

	"github.com/zq-xu/kafka-demo/internal/cli"
	"github.com/zq-xu/kafka-demo/internal/kafkax"
)

// createFlags holds the flags of `topic create` only.
type createFlags struct {
	partitions int
	replicas   int
	retention  time.Duration
	cleanup    string
}

func newCreateCommand(g *kafkax.Options) *cobra.Command {
	f := &createFlags{
		partitions: 3,
		replicas:   1,
		retention:  7 * 24 * time.Hour,
		cleanup:    "delete",
	}

	cmd := &cobra.Command{
		Use:   "create [topic]",
		Short: "Create a topic (partitions / replicas / retention / cleanup policy)",
		Long: `Create a topic and apply the topic-level configs this demo cares about:

  retention              how long records are kept before being cleaned up
  cleanup.policy         delete (drop by age) / compact (keep the latest per key)
  min.insync.replicas    how many in-sync replicas acks=all needs

Note: a single local broker means --replicas can only be 1.`,
		Example: `  kafka-demo topic create --topic order-events --partitions 6
  kafka-demo topic create order-events --retention 24h
  kafka-demo topic create --topic user-state --cleanup compact`,
		Args: cobra.MaximumNArgs(1),
		RunE: func(_ *cobra.Command, args []string) error {
			return runCreate(g, f, cli.TopicName(g, args))
		},
	}

	cmd.Flags().IntVar(&f.partitions, "partitions", f.partitions, "number of partitions")
	cmd.Flags().IntVar(&f.replicas, "replicas", f.replicas, "replication factor (1 on a single broker)")
	cmd.Flags().DurationVar(&f.retention, "retention", f.retention, "retention.ms as a duration, e.g. 168h")
	cmd.Flags().StringVar(&f.cleanup, "cleanup", f.cleanup, "cleanup.policy: delete / compact / compact,delete")
	return cmd
}

func runCreate(g *kafkax.Options, f *createFlags, name string) error {
	return cli.WithAdmin(g, func(_ sarama.Client, admin sarama.ClusterAdmin) error {
		spec := kafkax.TopicSpec{
			Name:       name,
			Partitions: int32(f.partitions),
			Replicas:   int16(f.replicas),
			Retention:  f.retention,
			Cleanup:    f.cleanup,
		}
		if err := kafkax.CreateTopic(admin, spec); err != nil {
			return err
		}

		// Creation is asynchronous: wait until the metadata is visible, so a
		// following describe does not report "topic does not exist".
		partitions, err := kafkax.WaitTopicVisible(admin, name, 10*time.Second)
		if err != nil {
			return err
		}

		fmt.Println("\n== Topic created ==")
		fmt.Printf("  topic=%s partitions=%d replicas=%d retention.ms=%d cleanup.policy=%s (visible)\n",
			name, partitions, f.replicas, f.retention.Milliseconds(), f.cleanup)
		return nil
	})
}
