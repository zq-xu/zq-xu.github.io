package verify

import (
	"fmt"
	"time"

	"github.com/zq-xu/kafka-demo/internal/kafkax"
)

// prepareTopic makes sure the topic exists and is describable, then records the
// backlog that existed before this run.
func (r *run) prepareTopic() error {
	if err := r.ensureTopic(); err != nil {
		return err
	}

	// Creation is asynchronous: a successful create does not mean the topic
	// can be described yet.
	partitions, err := kafkax.WaitTopicVisible(r.admin, r.opts.Topic, 10*time.Second)
	if err != nil {
		return err
	}
	if !r.check.check("topic visible", partitions > 0, "partitions=%d", partitions) {
		return fmt.Errorf("topic %q is not usable", r.opts.Topic)
	}

	return r.loadBaseline()
}

func (r *run) ensureTopic() error {
	topics, err := kafkax.ListTopics(r.admin)
	if err != nil {
		return err
	}
	for _, t := range topics {
		if t.Name == r.opts.Topic {
			fmt.Printf("  topic already exists, reusing it (%d partitions)\n", t.Partitions)
			return nil
		}
	}

	err = kafkax.CreateTopic(r.admin, kafkax.TopicSpec{
		Name:       r.opts.Topic,
		Partitions: e2ePartitions,
		Replicas:   1,
		Retention:  time.Hour,
		Cleanup:    "delete",
	})
	if err != nil {
		return err
	}
	fmt.Printf("  created topic with %d partitions, replication factor 1\n", e2ePartitions)
	return nil
}

// loadBaseline records the backlog that this run did not produce. On a reused
// topic the historical records must not be counted as this run's work, so step
// 6 asserts "back to baseline" instead of "zero".
func (r *run) loadBaseline() error {
	lags, err := kafkax.GroupLag(r.client, r.admin, r.groupID, r.opts.Topic)
	if err != nil {
		return err
	}

	r.baseline = kafkax.TotalLag(lags)
	if r.baseline > 0 {
		fmt.Printf("  %d historical records used as baseline (excluded from this run)\n", r.baseline)
	}
	return nil
}
