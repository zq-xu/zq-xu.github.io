// Package topic implements the `topic` command group.
//
// `topic` is a parent command: it documents the group and holds one file per
// subcommand (create / list / describe / config / delete). Keeping the group in
// its own package stops the root command from growing with every new option.
package topic

import (
	"github.com/spf13/cobra"

	"github.com/zq-xu/kafka-demo/internal/kafkax"
)

// New builds the `topic` command together with all of its subcommands.
func New(g *kafkax.Options) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "topic",
		Short: "Topic management: create / list / describe / config / delete",
		Long: `Create, inspect and delete topics. Things worth knowing:

  - creation is asynchronous: a successful create does not mean the topic can
    be described immediately, the metadata needs to become visible;
  - a single-broker setup only supports replication factor 1;
  - partitions can only be added, never removed, and adding partitions changes
    the key-to-partition mapping.`,
	}

	cmd.AddCommand(
		newCreateCommand(g),
		newListCommand(g),
		newDescribeCommand(g),
		newConfigCommand(g),
		newDeleteCommand(g),
	)
	return cmd
}
