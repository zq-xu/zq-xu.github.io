package cmd

import (
	"fmt"
	"os"
	"sort"
	"text/tabwriter"

	"github.com/IBM/sarama"
	"github.com/spf13/cobra"

	"github.com/zq-xu/kafka-demo/internal/cli"
	"github.com/zq-xu/kafka-demo/internal/kafkax"
)

func newGroupsCommand(g *kafkax.Options) *cobra.Command {
	return &cobra.Command{
		Use:   "groups",
		Short: "List the consumer groups of the cluster with state and member count",
		Long: `List all consumer groups (their offsets live in __consumer_offsets).

  Stable     members are stable, partition assignment is complete
  Empty      the group exists but has no active member (offsets are kept)
  PreparingRebalance / CompletingRebalance   partitions are being reassigned

Empty is normal: after a consumer exits, the group is retained for a while
(governed by offsets.retention.minutes, 7 days by default) and the offsets do
not disappear immediately.`,
		Example: "  kafka-demo groups",
		RunE: func(*cobra.Command, []string) error {
			return runGroups(g)
		},
	}
}

func runGroups(g *kafkax.Options) error {
	return cli.WithAdmin(g, func(_ sarama.Client, admin sarama.ClusterAdmin) error {
		groups, err := admin.ListConsumerGroups()
		if err != nil {
			return fmt.Errorf("list consumer groups: %w", err)
		}
		if len(groups) == 0 {
			fmt.Println("\n== Consumer groups ==\n  none yet (run `group` or `e2e` first)")
			return nil
		}

		descriptions, err := admin.DescribeConsumerGroups(sortedIDs(groups))
		if err != nil {
			return fmt.Errorf("describe consumer groups: %w", err)
		}

		fmt.Printf("\n== Consumer groups (%d) ==\n", len(descriptions))
		return printGroups(descriptions)
	})
}

func sortedIDs(groups map[string]string) []string {
	ids := make([]string, 0, len(groups))
	for id := range groups {
		ids = append(ids, id)
	}
	sort.Strings(ids)
	return ids
}

func printGroups(descriptions []*sarama.GroupDescription) error {
	w := tabwriter.NewWriter(os.Stdout, 0, 0, 2, ' ', 0)
	if _, err := fmt.Fprintln(w, "  GROUP\tSTATE\tPROTOCOL\tMEMBERS"); err != nil {
		return err
	}
	for _, d := range descriptions {
		protocol := d.ProtocolType
		if d.State == "Empty" {
			protocol = "-"
		}
		if _, err := fmt.Fprintf(w, "  %s\t%s\t%s\t%d\n", d.GroupId, d.State, protocol, len(d.Members)); err != nil {
			return err
		}
	}
	return w.Flush()
}
