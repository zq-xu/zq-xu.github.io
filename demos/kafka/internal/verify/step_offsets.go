package verify

import (
	"fmt"
	"time"

	"github.com/zq-xu/kafka-demo/internal/kafkax"
)

const (
	lagPollAttempts = 10
	lagPollInterval = 500 * time.Millisecond
)

// checkOffsets asserts that the commits moved the lag back to the baseline
// recorded before the run, which proves the offsets were persisted.
func (r *run) checkOffsets() error {
	total, err := r.waitForBaseline()
	if err != nil {
		return err
	}
	r.check.check("lag back to baseline", total == r.baseline, "total lag %d (baseline %d)", total, r.baseline)
	return nil
}

// waitForBaseline polls the group lag until it matches the baseline; commits
// are asynchronous, so a short settle time is allowed.
func (r *run) waitForBaseline() (int64, error) {
	var lastErr error
	for attempt := 1; attempt <= lagPollAttempts; attempt++ {
		lags, err := kafkax.GroupLag(r.client, r.admin, r.groupID, r.opts.Topic)
		if err != nil {
			lastErr = err
		} else {
			total := kafkax.TotalLag(lags)
			if total == r.baseline || attempt == lagPollAttempts {
				return total, nil
			}
		}
		time.Sleep(lagPollInterval)
	}
	return 0, fmt.Errorf("query lag: %w", lastErr)
}
