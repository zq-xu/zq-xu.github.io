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

func newListCommand(g *kafkax.Options) *cobra.Command {
	return &cobra.Command{
		Use:   "list",
		Short: "List all topics (partitions / replicas / internal or not)",
		Long: `List the topics of the cluster. Names starting with __ are internal Kafka
topics; the most common one is __consumer_offsets, which stores consumer group
offsets and has 50 partitions by default.`,
		Example: "  kafka-demo topic list",
		RunE: func(*cobra.Command, []string) error {
			return runList(g)
		},
	}
}

func runList(g *kafkax.Options) error {
	return cli.WithAdmin(g, func(_ sarama.Client, admin sarama.ClusterAdmin) error {
		topics, err := kafkax.ListTopics(admin)
		if err != nil {
			return err
		}
		fmt.Println("\n== Topics ==")
		return printTopics(topics)
	})
}

func printTopics(topics []kafkax.TopicSummary) error {
	w := tabwriter.NewWriter(os.Stdout, 0, 0, 2, ' ', 0)
	if _, err := fmt.Fprintln(w, "  TOPIC\tPARTITIONS\tREPLICAS\tINTERNAL"); err != nil {
		return err
	}
	for _, t := range topics {
		if _, err := fmt.Fprintf(w, "  %s\t%d\t%d\t%v\n", t.Name, t.Partitions, t.Replicas, t.Internal); err != nil {
			return err
		}
	}
	return w.Flush()
}
