package cmd

import (
	"fmt"
	"os"
	"text/tabwriter"

	"github.com/IBM/sarama"
	"github.com/spf13/cobra"

	"github.com/zq-xu/kafka-demo/internal/cli"
	"github.com/zq-xu/kafka-demo/internal/kafkax"
)

func newLagCommand(g *kafkax.Options) *cobra.Command {
	return &cobra.Command{
		Use:   "lag",
		Short: "Show consumer group lag (committed offset vs partition end)",
		Long: `Lag = partition end offset - committed offset of the group, i.e. how many
records are not consumed yet.

  Committed = none    this group never committed on that partition, so the whole
                      partition counts as unconsumed
  lag keeps growing   consumption cannot keep up: add consumers or partitions
  lag stays near zero consumption keeps up

This is the only reliable indicator of a consumer falling behind; logs alone
never tell you how much is left.`,
		Example: `  kafka-demo lag
  kafka-demo lag --group demo-group --topic demo-topic`,
		RunE: func(*cobra.Command, []string) error {
			return runLag(g)
		},
	}
}

func runLag(g *kafkax.Options) error {
	return cli.WithAdmin(g, func(client sarama.Client, admin sarama.ClusterAdmin) error {
		lags, err := kafkax.GroupLag(client, admin, g.Group, g.Topic)
		if err != nil {
			return err
		}

		fmt.Printf("\n== Consumer lag group=%s topic=%s ==\n", g.Group, g.Topic)
		if err := printLags(lags); err != nil {
			return err
		}
		fmt.Printf("  total lag: %d records\n", kafkax.TotalLag(lags))
		return nil
	})
}

func printLags(lags []kafkax.PartitionLag) error {
	w := tabwriter.NewWriter(os.Stdout, 0, 0, 2, ' ', 0)
	if _, err := fmt.Fprintln(w, "  PARTITION\tCOMMITTED\tEND\tLAG"); err != nil {
		return err
	}
	for _, l := range lags {
		committed := fmt.Sprint(l.Committed)
		if l.Committed < 0 {
			committed = "none"
		}
		if _, err := fmt.Fprintf(w, "  %d\t%s\t%d\t%d\n", l.Partition, committed, l.End, l.Lag); err != nil {
			return err
		}
	}
	return w.Flush()
}
