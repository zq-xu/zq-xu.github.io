package topic

import (
	"fmt"
	"os"
	"text/tabwriter"

	"github.com/IBM/sarama"
	"github.com/spf13/cobra"

	"github.com/zq-xu/kafka-demo/internal/cli"
	"github.com/zq-xu/kafka-demo/internal/kafkax"
)

func newDescribeCommand(g *kafkax.Options) *cobra.Command {
	return &cobra.Command{
		Use:   "describe [topic]",
		Short: "Show partitions, leaders, replicas, ISR and offset ranges of a topic",
		Long: `Print one row per partition:

  Leader     the broker that currently owns the partition
  Replicas   all replicas of the partition ([1] on a single broker)
  ISR        replicas in sync with the leader (empty means the leader is not ready)
  Earliest   earliest retained offset
  Latest     log end offset (the next offset to be written)
  Records    Latest - Earliest, i.e. how many records are readable now

This is the most direct way to tell whether a record was really written and
whether a partition is healthy.`,
		Example: "  kafka-demo topic describe\n  kafka-demo topic describe demo-topic",
		Args:    cobra.MaximumNArgs(1),
		RunE: func(_ *cobra.Command, args []string) error {
			return runDescribe(g, cli.TopicName(g, args))
		},
	}
}

func runDescribe(g *kafkax.Options, name string) error {
	return cli.WithAdmin(g, func(client sarama.Client, admin sarama.ClusterAdmin) error {
		infos, err := kafkax.DescribeTopic(client, admin, name)
		if err != nil {
			return err
		}
		fmt.Printf("\n== Topic detail  %s ==\n", name)
		return printPartitions(infos)
	})
}

func printPartitions(infos []kafkax.PartitionInfo) error {
	w := tabwriter.NewWriter(os.Stdout, 0, 0, 2, ' ', 0)
	if _, err := fmt.Fprintln(w, "  PARTITION\tLEADER\tREPLICAS\tISR\tEARLIEST\tLATEST\tRECORDS"); err != nil {
		return err
	}
	for _, p := range infos {
		if _, err := fmt.Fprintf(w, "  %d\t%d\t%v\t%v\t%d\t%d\t%d\n",
			p.ID, p.Leader, p.Replicas, p.ISR, p.Earliest, p.Latest, p.Count()); err != nil {
			return err
		}
	}
	return w.Flush()
}
