// kafka-demo verifies Kafka locally; every capability is exposed as a cobra
// subcommand.
//
// Usage:
//
//	./scripts/kafka.sh start        # start the cluster
//	go run . health                 # check connectivity
//	go run . e2e                    # end-to-end verification
//
// Layers:
//
//	cmd/              command line: flags, output format, exit code
//	internal/kafkax   Kafka client wrapper: connection, topics, produce, consume, lag
//	internal/verify   the assertion flow behind `e2e`
package main

import "github.com/zq-xu/kafka-demo/cmd"

func main() {
	cmd.Execute()
}
