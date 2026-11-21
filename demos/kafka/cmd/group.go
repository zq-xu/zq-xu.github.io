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

	"github.com/zq-xu/kafka-demo/internal/kafkax"
)

// groupFlags holds the flags of `group` only.
type groupFlags struct {
	limit        int
	manualCommit bool
	commitEvery  int
}

func newGroupCommand(g *kafkax.Options) *cobra.Command {
	f := &groupFlags{commitEvery: 5}

	cmd := &cobra.Command{
		Use:   "group",
		Short: "Consume as a consumer group (automatic partition assignment and offset commits)",
		Long: `Join a consumer group and let Kafka assign partitions to members.

Compared to ` + "`consume`" + `: this consumes as a *group*, commits offsets to
__consumer_offsets, resumes from the last commit on restart, and balances
partitions across instances of the same group.

  --limit          stop after N records (0 means keep going). The limit is
                   enforced by a locked counter, so it is exact; a partition
                   that cannot take a slot does not advance its offset and the
                   record can be read again later.
  --manual-commit  disable auto-commit and commit every --commit-every records,
                   plus a final commit on shutdown so the tail is not lost.

To watch a rebalance, run this command again in another terminal.`,
		Example: `  kafka-demo group --limit 20
  kafka-demo group --limit 20 --manual-commit --commit-every 5`,
		RunE: func(*cobra.Command, []string) error {
			return runGroup(g, f)
		},
	}

	cmd.Flags().IntVar(&f.limit, "limit", f.limit, "stop after N records, 0 means keep consuming")
	cmd.Flags().BoolVar(&f.manualCommit, "manual-commit", f.manualCommit, "disable auto-commit and commit manually")
	cmd.Flags().IntVar(&f.commitEvery, "commit-every", f.commitEvery, "commit every N records in manual mode")
	return cmd
}

func runGroup(g *kafkax.Options, f *groupFlags) error {
	client, err := kafkax.NewClientWith(g, groupConfig(f))
	if err != nil {
		return err
	}
	defer client.Close()

	group, err := sarama.NewConsumerGroupFromClient(g.Group, client)
	if err != nil {
		return fmt.Errorf("create consumer group: %w", err)
	}
	defer closeGroup(group)

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	handler := &kafkax.GroupHandler{
		Limit:        f.limit,
		ManualCommit: f.manualCommit,
		CommitEvery:  f.commitEvery,
		OnMessage:    func(msg *sarama.ConsumerMessage) { kafkax.WriteMessage(os.Stdout, msg) },
		OnLimit:      stop,
	}

	fmt.Printf("\n== Group consume group=%s topic=%s limit=%d manual-commit=%v ==\n",
		g.Group, g.Topic, f.limit, f.manualCommit)
	if err := kafkax.ConsumeGroup(ctx, group, g.Topic, handler); err != nil {
		return fmt.Errorf("consume: %w", err)
	}

	fmt.Printf("\nsummary: this instance consumed %d records and committed its offsets on exit\n", handler.Count())
	return nil
}

// groupConfig returns the tweak applied to the default config: a shorter
// auto-commit interval, or auto-commit disabled in manual mode.
func groupConfig(f *groupFlags) func(*sarama.Config) {
	return func(c *sarama.Config) {
		c.Consumer.Offsets.AutoCommit.Interval = time.Second
		if f.manualCommit {
			c.Consumer.Offsets.AutoCommit.Enable = false
		}
	}
}

func closeGroup(group sarama.ConsumerGroup) {
	if err := group.Close(); err != nil {
		fmt.Fprintf(os.Stderr, "close consumer group: %v\n", err)
	}
}
