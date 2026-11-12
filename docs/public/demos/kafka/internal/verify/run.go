package verify

import (
	"fmt"
	"time"

	"github.com/IBM/sarama"

	"github.com/zq-xu/kafka-demo/internal/kafkax"
)

// run carries the state every step shares: the connection, the run parameters
// and the facts collected along the way.
type run struct {
	base  kafkax.Options
	opts  Options
	check *checker

	client sarama.Client
	admin  sarama.ClusterAdmin

	groupID  string
	baseline int64 // backlog before this run, 0 for a new topic
	sent     []kafkax.SentMessage
	stats    *consumeStats
}

// step is one printable unit of the flow.
type step struct {
	title string
	run   func() error
}

func newRun(base *kafkax.Options, o Options) (*run, error) {
	r := &run{base: *base, opts: o, check: &checker{}}
	if r.opts.Timeout <= 0 {
		r.opts.Timeout = defaultTimeout
	}
	r.groupID = fmt.Sprintf("demo-e2e-group-%d", time.Now().UnixNano())

	client, err := kafkax.NewClient(&r.base)
	if err != nil {
		return nil, err
	}
	admin, err := kafkax.NewAdmin(client)
	if err != nil {
		client.Close()
		return nil, err
	}
	r.client, r.admin = client, admin
	return r, nil
}

func (r *run) close() {
	r.admin.Close() // also closes r.client
}

// steps declares the flow; titles are built from the run parameters.
func (r *run) steps() []step {
	return []step{
		{"connect to the cluster", r.connect},
		{fmt.Sprintf("prepare topic (%s)", r.opts.Topic), r.prepareTopic},
		{fmt.Sprintf("produce %d records (%d rotating keys)", r.opts.Messages, e2eKeys), r.produce},
		{"verify the same key maps to the same partition", r.checkOrdering},
		{fmt.Sprintf("consume with group %s", r.groupID), r.consume},
		{"verify offsets are committed and lag is back to baseline", r.checkOffsets},
		{"cleanup", r.cleanup},
	}
}
