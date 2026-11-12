package kafkax

import (
	"context"
	"fmt"
	"log"
	"strings"
	"sync"

	"github.com/IBM/sarama"
)

// GroupHandler is a reusable sarama.ConsumerGroupHandler.
//
// It takes care of three things a consumer group always needs: rebalance
// logging, an exact record limit, and the offset/commit policy. Callers only
// receive records through OnMessage and learn about the limit through OnLimit.
type GroupHandler struct {
	Limit        int  // stop after Limit records when > 0
	ManualCommit bool // when true the handler commits explicitly
	CommitEvery  int  // commit every N records in manual mode

	OnMessage func(*sarama.ConsumerMessage)
	OnLimit   func()

	mu    sync.Mutex
	count int
}

// Setup runs after every rebalance and before consuming: the assigned
// partitions are visible here.
func (h *GroupHandler) Setup(session sarama.ConsumerGroupSession) error {
	log.Printf("[rebalance] joined member=%s generation=%d claims=%s",
		session.MemberID(), session.GenerationID(), describeClaims(session.Claims()))
	return nil
}

// Cleanup runs after all ConsumeClaim calls returned. In manual mode it commits
// one last time, otherwise the tail records (< CommitEvery) would be replayed
// after a restart.
func (h *GroupHandler) Cleanup(session sarama.ConsumerGroupSession) error {
	if h.ManualCommit {
		session.Commit()
	}
	log.Printf("[rebalance] left member=%s generation=%d", session.MemberID(), session.GenerationID())
	return nil
}

// ConsumeClaim is the real consume loop; sarama starts one goroutine per
// assigned partition.
func (h *GroupHandler) ConsumeClaim(session sarama.ConsumerGroupSession, claim sarama.ConsumerGroupClaim) error {
	for {
		select {
		case msg, ok := <-claim.Messages():
			if !ok {
				// A closed channel means the session ended (rebalance or shutdown).
				return nil
			}
			if !h.handle(session, msg) {
				return nil
			}
		case <-session.Context().Done():
			return nil
		}
	}
}

// handle processes one record and returns false when this partition must stop.
func (h *GroupHandler) handle(session sarama.ConsumerGroupSession, msg *sarama.ConsumerMessage) bool {
	// Take a slot before processing: no slot means the limit is reached. The
	// record is deliberately not marked, so its offset does not advance and it
	// can be read again later.
	if !h.tryAcquire() {
		return false
	}
	if h.OnMessage != nil {
		h.OnMessage(msg)
	}

	// MarkMessage is MarkOffset(offset+1): it marks the *next* offset.
	session.MarkMessage(msg, "")

	if h.ManualCommit && h.CommitEvery > 0 && h.Count()%h.CommitEvery == 0 {
		session.Commit()
	}
	return true
}

// Count returns how many records this handler consumed.
func (h *GroupHandler) Count() int {
	h.mu.Lock()
	defer h.mu.Unlock()
	return h.count
}

func (h *GroupHandler) reachedLimit() bool {
	return h.Limit > 0 && h.Count() >= h.Limit
}

// tryAcquire makes "check the limit" and "increment the counter" a single
// atomic operation, so the limit stays exact under concurrent partitions.
func (h *GroupHandler) tryAcquire() bool {
	h.mu.Lock()
	defer h.mu.Unlock()

	if h.Limit > 0 && h.count >= h.Limit {
		if h.OnLimit != nil {
			h.OnLimit()
		}
		return false
	}
	h.count++
	return true
}

// ConsumeGroup keeps consuming until the context is cancelled or the handler
// limit is reached.
//
// Consume returns normally on every rebalance, so calling it once is not enough:
// the consumer would look "stuck" as soon as another member joins.
func ConsumeGroup(ctx context.Context, group sarama.ConsumerGroup, topic string, h *GroupHandler) error {
	for {
		if err := group.Consume(ctx, []string{topic}, h); err != nil {
			return err
		}
		if ctx.Err() != nil || h.reachedLimit() {
			return nil
		}
	}
}

func describeClaims(claims map[string][]int32) string {
	parts := make([]string, 0, len(claims))
	for topic, partitions := range claims {
		parts = append(parts, fmt.Sprintf("%s%v", topic, partitions))
	}
	return strings.Join(parts, ", ")
}
