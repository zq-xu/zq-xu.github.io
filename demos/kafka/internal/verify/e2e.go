// Package verify implements the end-to-end flow behind `kafka-demo e2e`.
//
// It knows nothing about CLI parsing: it receives "which cluster, which topic,
// how many records" and runs seven assertions. The first hard failure is
// returned as an error, so the command can be used as a smoke test.
package verify

import (
	"fmt"
	"time"

	"github.com/zq-xu/kafka-demo/internal/kafkax"
)

const (
	defaultTimeout = 30 * time.Second
	stepCount      = 7
	e2ePartitions  = 3
	e2eKeys        = 3
	e2eKeyPrefix   = "user"
)

// Options is the input of an e2e run.
type Options struct {
	Topic    string // which topic to verify
	Messages int    // records to produce and consume
	Keep     bool   // keep the topic afterwards
	Timeout  time.Duration
}

// Run executes the steps in order and stops at the first hard failure.
func Run(base *kafkax.Options, o Options) error {
	r, err := newRun(base, o)
	if err != nil {
		return err
	}
	defer r.close()

	for i, s := range r.steps() {
		if i > 0 {
			fmt.Println()
		}
		fmt.Printf("Step %d/%d %s\n", i+1, stepCount, s.title)
		if err := s.run(); err != nil {
			return err
		}
	}
	return r.check.result()
}
