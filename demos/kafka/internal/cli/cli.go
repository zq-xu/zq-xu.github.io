// Package cli holds the plumbing shared by every subcommand: binding the global
// flags, resolving the effective topic, and opening short-lived clients.
//
// It keeps the command files free of copy-pasted connection boilerplate, so a
// subcommand only contains what makes it different.
package cli

import (
	"github.com/IBM/sarama"
	"github.com/spf13/cobra"

	"github.com/zq-xu/kafka-demo/internal/kafkax"
)

// Defaults used when the user passes no flag.
const (
	DefaultBroker = "localhost:9092"
	DefaultTopic  = "demo-topic"
	DefaultGroup  = "demo-group"
)

// Bind registers the persistent flags that every subcommand inherits.
func Bind(root *cobra.Command, o *kafkax.Options) {
	fs := root.PersistentFlags()
	fs.StringSliceVar(&o.Brokers, "brokers", o.Brokers, "broker addresses, comma separated")
	fs.StringVar(&o.Topic, "topic", o.Topic, "default topic")
	fs.StringVar(&o.Group, "group", o.Group, "default consumer group ID")
	fs.BoolVar(&o.Debug, "debug", false, "log the sarama protocol layer (connections and retries)")
}

// TopicName returns the topic of a command: a positional argument wins over
// --topic, e.g. `topic describe my-topic`.
func TopicName(o *kafkax.Options, args []string) string {
	if len(args) > 0 && args[0] != "" {
		return args[0]
	}
	return o.Topic
}

// WithClient connects, runs fn and closes the connection afterwards. tweak may
// be nil; it adjusts the default config for this command only.
func WithClient(o *kafkax.Options, tweak func(*sarama.Config), fn func(sarama.Client) error) error {
	client, err := kafkax.NewClientWith(o, tweak)
	if err != nil {
		return err
	}
	defer client.Close()
	return fn(client)
}

// WithAdmin also opens a ClusterAdmin for topic and group management. Closing
// the admin closes the underlying client as well, so only one defer is needed.
func WithAdmin(o *kafkax.Options, fn func(sarama.Client, sarama.ClusterAdmin) error) error {
	client, err := kafkax.NewClient(o)
	if err != nil {
		return err
	}
	admin, err := kafkax.NewAdmin(client)
	if err != nil {
		client.Close()
		return err
	}
	defer admin.Close()
	return fn(client, admin)
}
