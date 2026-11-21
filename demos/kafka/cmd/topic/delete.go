package topic

import (
	"fmt"

	"github.com/IBM/sarama"
	"github.com/spf13/cobra"

	"github.com/zq-xu/kafka-demo/internal/cli"
	"github.com/zq-xu/kafka-demo/internal/kafkax"
)

func newDeleteCommand(g *kafkax.Options) *cobra.Command {
	return &cobra.Command{
		Use:   "delete [topic]",
		Short: "Delete a topic together with its data",
		Long: `Submit a delete request. Deletion is asynchronous: it may take a few seconds
before the data is actually removed, and ` + "`list`" + ` can still show the topic in
the meantime.

Note: deleting a topic does not delete consumer group offsets, but those
offsets lose their topic. If a topic with the same name is recreated later, an
old group may resume from its previous offsets.`,
		Example: "  kafka-demo topic delete demo-topic",
		Args:    cobra.MaximumNArgs(1),
		RunE: func(_ *cobra.Command, args []string) error {
			return runDelete(g, cli.TopicName(g, args))
		},
	}
}

func runDelete(g *kafkax.Options, name string) error {
	return cli.WithAdmin(g, func(_ sarama.Client, admin sarama.ClusterAdmin) error {
		if err := kafkax.DeleteTopic(admin, name); err != nil {
			return err
		}
		fmt.Println("\n== Topic deleted ==")
		fmt.Printf("  delete request submitted for topic=%s (data is removed asynchronously)\n", name)
		return nil
	})
}
