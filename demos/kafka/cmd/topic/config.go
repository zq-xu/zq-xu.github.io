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

// configFlags holds the flags of `topic config` only.
type configFlags struct {
	keys []string
}

func newConfigCommand(g *kafkax.Options) *cobra.Command {
	f := &configFlags{}

	cmd := &cobra.Command{
		Use:   "config [topic]",
		Short: "Show the effective topic config (with its source: topic override / broker default)",
		Long: `Read the config currently in effect for a topic. By default only the keys
this demo watches are printed; for everything use:
  kafka-demo topic config --keys all

The source column matters: it tells whether the value was set on the topic or
inherited from the broker default, which is the first thing to check when a
config change "does not seem to apply".`,
		Example: `  kafka-demo topic config
  kafka-demo topic config demo-topic --keys retention.ms,cleanup.policy`,
		Args: cobra.MaximumNArgs(1),
		RunE: func(_ *cobra.Command, args []string) error {
			return runConfig(g, f, cli.TopicName(g, args))
		},
	}

	cmd.Flags().StringSliceVar(&f.keys, "keys", nil, "only show these config keys, comma separated; all means everything")
	return cmd
}

func runConfig(g *kafkax.Options, f *configFlags, name string) error {
	return cli.WithAdmin(g, func(_ sarama.Client, admin sarama.ClusterAdmin) error {
		items, err := topicConfig(admin, name, f.keys)
		if err != nil {
			return err
		}
		fmt.Printf("\n== Topic config  %s ==\n", name)
		return printConfig(items)
	})
}

func topicConfig(admin sarama.ClusterAdmin, name string, keys []string) ([]kafkax.ConfigItem, error) {
	if len(keys) == 1 && keys[0] == "all" {
		return kafkax.AllTopicConfig(admin, name)
	}
	return kafkax.TopicConfig(admin, name, keys)
}

func printConfig(items []kafkax.ConfigItem) error {
	w := tabwriter.NewWriter(os.Stdout, 0, 0, 2, ' ', 0)
	if _, err := fmt.Fprintln(w, "  CONFIG\tVALUE\tSOURCE"); err != nil {
		return err
	}
	for _, item := range items {
		if _, err := fmt.Fprintf(w, "  %s\t%s\t%s\n", item.Name, item.Value, item.Source); err != nil {
			return err
		}
	}
	return w.Flush()
}
