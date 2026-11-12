package cmd

import (
	"fmt"
	"time"

	"github.com/spf13/cobra"

	"github.com/zq-xu/kafka-demo/internal/kafkax"
	"github.com/zq-xu/kafka-demo/internal/verify"
)

// e2eFlags holds the flags of `e2e` only.
type e2eFlags struct {
	messages int
	keep     bool
}

func newE2ECommand(g *kafkax.Options) *cobra.Command {
	f := &e2eFlags{messages: 30}

	cmd := &cobra.Command{
		Use:   "e2e",
		Short: "End-to-end verification: 7 assertions, the link is healthy only if all pass",
		Long: `Run the whole path once and assert every step. Use it as a smoke test after
changing code or restarting the cluster:

  1. connection: brokers are discovered and the controller is found
  2. topic: created (or reused) and its metadata becomes visible
  3. produce: all N records are acknowledged
  4. partitions: the same key lands on the same partition (hash partitioner)
  5. consume: the group collects all N records and per-partition offsets
     increase monotonically (no duplicates, no reordering)
  6. offsets: committed, so lag is back to baseline (baseline is 0 for a new topic)
  7. cleanup: the temporary group is deleted; the topic depends on --keep

Topic selection: without --topic a demo-e2e-<timestamp> topic is generated and
deleted afterwards; with --topic the existing topic is reused and never
deleted, so your data is safe.`,
		Example: `  kafka-demo e2e
  kafka-demo e2e --messages 500
  kafka-demo e2e --topic my-topic --messages 100 --keep`,
		RunE: func(cmd *cobra.Command, _ []string) error {
			return runE2E(cmd, g, f)
		},
	}

	cmd.Flags().IntVar(&f.messages, "messages", f.messages, "number of records to produce and consume")
	cmd.Flags().BoolVar(&f.keep, "keep", f.keep, "keep the topic (the group is always deleted) for further inspection")
	return cmd
}

func runE2E(cmd *cobra.Command, g *kafkax.Options, f *e2eFlags) error {
	topic, generated := e2eTopic(cmd, g)
	fmt.Printf("\n========== End-to-end verification  topic=%s messages=%d ==========\n", topic, f.messages)

	// A topic given by the user is always kept; a generated one follows --keep.
	// The temporary group is always deleted by the verify flow.
	return verify.Run(g, verify.Options{
		Topic:    topic,
		Messages: f.messages,
		Keep:     f.keep || !generated,
		Timeout:  30 * time.Second,
	})
}

// e2eTopic returns the topic to verify and whether this run generated it: an
// explicit --topic is reused, otherwise a throwaway topic is created.
func e2eTopic(cmd *cobra.Command, g *kafkax.Options) (string, bool) {
	if cmd.Flags().Changed("topic") {
		return g.Topic, false
	}
	return fmt.Sprintf("demo-e2e-%d", time.Now().UnixNano()), true
}
