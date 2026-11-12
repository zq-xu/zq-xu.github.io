package verify

import (
	"fmt"

	"github.com/zq-xu/kafka-demo/internal/kafkax"
)

// cleanup removes what this run created: the temporary group always, the topic
// only when the caller does not want to keep it.
func (r *run) cleanup() error {
	r.deleteGroup()
	r.deleteTopic()
	return nil
}

func (r *run) deleteGroup() {
	if err := r.admin.DeleteConsumerGroup(r.groupID); err != nil {
		fmt.Printf("  delete group %s failed (ignorable): %v\n", r.groupID, err)
		return
	}
	fmt.Printf("  deleted group %s\n", r.groupID)
}

func (r *run) deleteTopic() {
	if r.opts.Keep {
		fmt.Printf("  keeping topic=%s (inspect it with topic describe / produce)\n", r.opts.Topic)
		return
	}
	if err := kafkax.DeleteTopic(r.admin, r.opts.Topic); err != nil {
		fmt.Printf("  delete topic %s failed (ignorable): %v\n", r.opts.Topic, err)
		return
	}
	fmt.Printf("  deleted topic %s\n", r.opts.Topic)
}
