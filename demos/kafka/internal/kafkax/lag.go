package kafkax

import (
	"fmt"

	"github.com/IBM/sarama"
)

// PartitionLag describes how far behind a consumer group is on one partition.
type PartitionLag struct {
	Partition int32
	Committed int64 // -1 means the group never committed an offset here
	End       int64 // log end offset (LEO) of the partition
	Lag       int64 // records not consumed yet
}

// GroupLag computes the lag of a consumer group on a topic.
//
// The committed offset comes from __consumer_offsets (OffsetFetch) and the end
// offset comes from ListOffsets(Newest); their difference is the backlog.
func GroupLag(client sarama.Client, admin sarama.ClusterAdmin, group, topic string) ([]PartitionLag, error) {
	// A newly created topic is not in the client cache yet: without a refresh
	// the end offset request fails with "not the leader for this partition".
	if err := refreshTopic(client, topic); err != nil {
		return nil, err
	}

	partitions, err := client.Partitions(topic)
	if err != nil {
		return nil, wrap(fmt.Sprintf("list partitions of topic %q", topic), "", err)
	}

	offsets, err := admin.ListConsumerGroupOffsets(group, map[string][]int32{topic: partitions})
	if err != nil {
		return nil, wrap(fmt.Sprintf("fetch offsets of group %q", group), "", err)
	}

	result := make([]PartitionLag, 0, len(partitions))
	for _, p := range partitions {
		committed := int64(-1)
		// GetBlock works for both OffsetFetch v0-7 (Blocks) and v8+ (Groups).
		if block := offsets.GetBlock(topic, p); block != nil {
			committed = block.Offset
		}

		end, err := client.GetOffset(topic, p, sarama.OffsetNewest)
		if err != nil {
			return nil, wrap(fmt.Sprintf("fetch end offset of topic %q partition %d", topic, p), "", err)
		}

		lag := int64(0)
		switch {
		case committed < 0:
			lag = end // never committed: the whole partition is unconsumed
		case end > committed:
			lag = end - committed
		}

		result = append(result, PartitionLag{Partition: p, Committed: committed, End: end, Lag: lag})
	}
	return result, nil
}

// TotalLag sums the backlog of all partitions.
func TotalLag(lags []PartitionLag) int64 {
	var total int64
	for _, l := range lags {
		total += l.Lag
	}
	return total
}
