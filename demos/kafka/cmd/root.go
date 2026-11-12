// Package cmd defines the command tree of kafka-demo.
//
// Convention: root only wires subcommands and binds the global flags; each
// subcommand has its own file; a group of subcommands lives in its own package
// (see cmd/topic). The command layer owns flags, output and exit codes, while
// the Kafka work itself lives in internal/kafkax.
package cmd

import (
	"os"

	"github.com/spf13/cobra"

	"github.com/zq-xu/kafka-demo/cmd/topic"
	"github.com/zq-xu/kafka-demo/internal/cli"
	"github.com/zq-xu/kafka-demo/internal/kafkax"
)

// settings is filled by the global flags and shared by every subcommand.
var settings = kafkax.Options{
	Brokers: []string{cli.DefaultBroker},
	Topic:   cli.DefaultTopic,
	Group:   cli.DefaultGroup,
}

// Execute is the single entry point used by main.
func Execute() {
	if err := newRootCommand().Execute(); err != nil {
		os.Exit(1)
	}
}

func newRootCommand() *cobra.Command {
	root := &cobra.Command{
		Use:   "kafka-demo",
		Short: "Local Kafka verification kit: health / topic / produce / consume / group / lag / e2e",
		Long: `kafka-demo verifies the basic capabilities of Kafka locally.

It uses sarama as the client and covers the whole path:
  health check -> topic management -> produce -> partition consume / group consume -> lag -> end-to-end assertions

The cluster defaults to localhost:9092 (override with --brokers). Start Kafka first:
  ./scripts/kafka.sh start`,
		SilenceUsage: true,
	}

	cli.Bind(root, &settings)
	root.AddCommand(
		newHealthCommand(&settings),
		topic.New(&settings),
		newProduceCommand(&settings),
		newConsumeCommand(&settings),
		newGroupCommand(&settings),
		newLagCommand(&settings),
		newGroupsCommand(&settings),
		newE2ECommand(&settings),
	)
	return root
}
