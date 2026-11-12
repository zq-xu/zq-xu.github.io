package verify

import (
	"fmt"
	"time"

	"github.com/zq-xu/kafka-demo/internal/kafkax"
)

// produce writes the records and asserts that the broker acknowledged all of
// them: a "sent" count proves nothing, only the ACK does.
func (r *run) produce() error {
	start := time.Now()
	sent, err := kafkax.ProduceSync(r.client, kafkax.ProduceOptions{
		Topic:     r.opts.Topic,
		Count:     r.opts.Messages,
		Keys:      e2eKeys,
		KeyPrefix: e2eKeyPrefix,
	})
	if err != nil {
		return err
	}
	r.sent = sent

	r.check.check("records acked", len(sent) == r.opts.Messages, "%d/%d records, took %s",
		len(sent), r.opts.Messages, time.Since(start).Round(time.Millisecond))
	return nil
}

// checkOrdering asserts that the hash partitioner kept every key on a single
// partition; without that, "ordered per key" would be impossible.
func (r *run) checkOrdering() error {
	mapping, stable := keyPartitions(r.sent)
	r.check.check("key-partition stable", stable, "mapping %v", mapping)
	for key, partition := range mapping {
		fmt.Printf("  key=%s -> partition=%d\n", key, partition)
	}
	return nil
}

func keyPartitions(sent []kafkax.SentMessage) (map[string]int32, bool) {
	mapping := make(map[string]int32, len(sent))
	stable := true
	for _, m := range sent {
		if partition, seen := mapping[m.Key]; seen && partition != m.Partition {
			stable = false
		}
		mapping[m.Key] = m.Partition
	}
	return mapping, stable
}
