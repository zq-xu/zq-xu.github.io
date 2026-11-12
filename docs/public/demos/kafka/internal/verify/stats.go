package verify

import (
	"sort"
	"sync"

	"github.com/IBM/sarama"
)

// consumeStats records what the group consumer saw and whether offsets stayed
// monotonic inside every partition.
type consumeStats struct {
	mu           sync.Mutex
	count        int
	perPartition map[int32]int
	lastOffset   map[int32]int64
	ordered      bool
}

// consumeSnapshot is an immutable view of consumeStats, safe to read after the
// consume loop has stopped.
type consumeSnapshot struct {
	Count        int
	PerPartition map[int32]int
	LastOffset   map[int32]int64
	Ordered      bool
}

func newConsumeStats() *consumeStats {
	return &consumeStats{
		perPartition: make(map[int32]int),
		lastOffset:   make(map[int32]int64),
		ordered:      true,
	}
}

func (s *consumeStats) record(msg *sarama.ConsumerMessage) {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.count++
	s.perPartition[msg.Partition]++
	if last, seen := s.lastOffset[msg.Partition]; seen && msg.Offset <= last {
		s.ordered = false
	}
	s.lastOffset[msg.Partition] = msg.Offset
}

func (s *consumeStats) snapshot() consumeSnapshot {
	s.mu.Lock()
	defer s.mu.Unlock()

	perPartition := make(map[int32]int, len(s.perPartition))
	lastOffset := make(map[int32]int64, len(s.lastOffset))
	for k, v := range s.perPartition {
		perPartition[k] = v
	}
	for k, v := range s.lastOffset {
		lastOffset[k] = v
	}
	return consumeSnapshot{
		Count:        s.count,
		PerPartition: perPartition,
		LastOffset:   lastOffset,
		Ordered:      s.ordered,
	}
}

// partitions returns the touched partitions in ascending order for printing.
func (s consumeSnapshot) partitions() []int32 {
	parts := make([]int32, 0, len(s.PerPartition))
	for p := range s.PerPartition {
		parts = append(parts, p)
	}
	sort.Slice(parts, func(i, j int) bool { return parts[i] < parts[j] })
	return parts
}
