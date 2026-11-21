package cmd

import (
	"fmt"
	"strings"
	"time"

	"github.com/IBM/sarama"
	"github.com/spf13/cobra"

	"github.com/zq-xu/kafka-demo/internal/cli"
	"github.com/zq-xu/kafka-demo/internal/kafkax"
)

func newHealthCommand(g *kafkax.Options) *cobra.Command {
	return &cobra.Command{
		Use:   "health",
		Short: "Check cluster connectivity (brokers / controller / topic count)",
		Long: `Connect to a broker and pull metadata to verify:

  - brokers are discoverable and the metadata API works
  - the controller is ready (in KRaft mode a broker also acts as controller)
  - total topic count, including internal topics such as __consumer_offsets

If this layer fails, there is no point trying produce or consume.

Note: sarama dials lazily, so a successful metadata refresh is the real proof
of connectivity. The time it takes is printed as evidence.`,
		Example: "  kafka-demo health\n  kafka-demo health --brokers 127.0.0.1:9092",
		RunE: func(*cobra.Command, []string) error {
			return runHealth(g)
		},
	}
}

func runHealth(g *kafkax.Options) error {
	return cli.WithClient(g, nil, func(client sarama.Client) error {
		// Force one metadata round trip: it proves the broker answers and the
		// negotiated protocol version works.
		start := time.Now()
		if err := client.RefreshMetadata(); err != nil {
			return fmt.Errorf("refresh metadata: %w", err)
		}
		elapsed := time.Since(start)

		controller, err := client.Controller()
		if err != nil {
			return fmt.Errorf("get controller: %w", err)
		}
		topics, err := client.Topics()
		if err != nil {
			return fmt.Errorf("list topics: %w", err)
		}

		printHealth(g, client, controller, topics, elapsed)
		return nil
	})
}

func printHealth(g *kafkax.Options, client sarama.Client, controller *sarama.Broker, topics []string, elapsed time.Duration) {
	fmt.Println("\n== Cluster health ==")
	fmt.Printf("  client addresses   : %s\n", strings.Join(g.Brokers, ","))
	fmt.Printf("  negotiated version : %s\n", client.Config().Version)
	fmt.Printf("  metadata refresh   : OK (%s)\n", elapsed.Round(time.Millisecond))
	fmt.Printf("  brokers            : %d\n", len(client.Brokers()))
	for _, broker := range client.Brokers() {
		fmt.Printf("    - broker#%d  %s\n", broker.ID(), broker.Addr())
	}
	fmt.Printf("  controller         : broker#%d %s\n", controller.ID(), controller.Addr())
	fmt.Printf("  topics             : %d (including internal topics like __consumer_offsets)\n", len(topics))
}
