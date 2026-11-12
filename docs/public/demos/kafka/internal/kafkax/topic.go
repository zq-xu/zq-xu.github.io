package kafkax

import (
	"fmt"
	"sort"
	"strings"
	"time"

	"github.com/IBM/sarama"
)

// TopicSummary is one row of `topic list`.
type TopicSummary struct {
	Name       string
	Partitions int32
	Replicas   int16
	Internal   bool
}

// PartitionInfo is one row of `topic describe`: replicas, ISR and offset range.
type PartitionInfo struct {
	ID       int32
	Leader   int32
	Replicas []int32
	ISR      []int32
	Earliest int64
	Latest   int64
}

// Count returns how many records the partition currently holds.
func (p PartitionInfo) Count() int64 { return p.Latest - p.Earliest }

// ConfigItem is one topic config entry. Source tells whether the value was
// set on the topic or inherited from the broker default.
type ConfigItem struct {
	Name   string
	Value  string
	Source string
}

// DefaultConfigKeys is the subset `topic config` prints when no key is given.
var DefaultConfigKeys = []string{
	"cleanup.policy",
	"retention.ms",
	"retention.bytes",
	"min.insync.replicas",
	"segment.bytes",
	"max.message.bytes",
	"compression.type",
	"unclean.leader.election.enable",
}

// TopicSpec describes the topic to create: partitions, replicas and the
// topic-level configs this demo cares about.
type TopicSpec struct {
	Name       string
	Partitions int32
	Replicas   int16
	Retention  time.Duration
	Cleanup    string
}

// ListTopics returns all topics sorted by name.
func ListTopics(admin sarama.ClusterAdmin) ([]TopicSummary, error) {
	topics, err := admin.ListTopics()
	if err != nil {
		return nil, wrap("ListTopics", "", err)
	}

	result := make([]TopicSummary, 0, len(topics))
	for name, d := range topics {
		result = append(result, TopicSummary{
			Name:       name,
			Partitions: d.NumPartitions,
			Replicas:   d.ReplicationFactor,
			Internal:   strings.HasPrefix(name, "__"),
		})
	}
	sort.Slice(result, func(i, j int) bool { return result[i].Name < result[j].Name })
	return result, nil
}

// CreateTopic creates a topic and fails when it already exists, so a rerun of
// a script does not silently reuse an old topic.
func CreateTopic(admin sarama.ClusterAdmin, spec TopicSpec) error {
	exists, err := topicExists(admin, spec.Name)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("topic %q already exists", spec.Name)
	}

	detail := &sarama.TopicDetail{
		NumPartitions:     spec.Partitions,
		ReplicationFactor: spec.Replicas,
		ConfigEntries:     specConfigs(spec),
	}
	if err := admin.CreateTopic(spec.Name, detail, false); err != nil {
		return wrap(fmt.Sprintf("CreateTopic(%q)", spec.Name), "", err)
	}
	return nil
}

func topicExists(admin sarama.ClusterAdmin, name string) (bool, error) {
	topics, err := admin.ListTopics()
	if err != nil {
		return false, wrap("ListTopics", "", err)
	}
	_, ok := topics[name]
	return ok, nil
}

func specConfigs(spec TopicSpec) map[string]*string {
	return map[string]*string{
		"retention.ms":        StringPtr(fmt.Sprint(spec.Retention.Milliseconds())),
		"cleanup.policy":      StringPtr(spec.Cleanup),
		"min.insync.replicas": StringPtr("1"),
	}
}

// WaitTopicVisible waits until the topic metadata shows up in the cluster.
//
// Topic creation is asynchronous: a successful CreateTopic does not mean the
// topic can be described right away.
func WaitTopicVisible(admin sarama.ClusterAdmin, name string, timeout time.Duration) (int32, error) {
	deadline := time.Now().Add(timeout)
	for {
		metadatas, err := admin.DescribeTopics([]string{name})
		if err == nil && len(metadatas) == 1 && metadatas[0].Err == sarama.ErrNoError {
			return int32(len(metadatas[0].Partitions)), nil
		}
		if time.Now().After(deadline) {
			if err != nil {
				return 0, wrap(fmt.Sprintf("wait for topic %q to become visible", name), "", err)
			}
			return 0, fmt.Errorf("timeout waiting for topic %q to become visible (%s)", name, timeout)
		}
		time.Sleep(500 * time.Millisecond)
	}
}

// DescribeTopic returns leader, replicas, ISR and offset range per partition.
func DescribeTopic(client sarama.Client, admin sarama.ClusterAdmin, name string) ([]PartitionInfo, error) {
	// Refresh first: a freshly created topic may be missing from the client
	// cache, and GetOffset would then fail with "not the leader".
	if err := refreshTopic(client, name); err != nil {
		return nil, err
	}

	md, err := topicMetadata(admin, name)
	if err != nil {
		return nil, err
	}

	// DescribeTopics does not guarantee partition order, sort for a stable table.
	sort.Slice(md.Partitions, func(i, j int) bool { return md.Partitions[i].ID < md.Partitions[j].ID })

	infos := make([]PartitionInfo, 0, len(md.Partitions))
	for _, p := range md.Partitions {
		info, err := describePartition(client, name, p)
		if err != nil {
			return nil, err
		}
		infos = append(infos, info)
	}
	return infos, nil
}

// refreshTopic pulls the metadata of one topic into the client cache. Reading
// offsets of a topic that was just created fails with "not the leader" until
// the cache knows its partitions.
func refreshTopic(client sarama.Client, topic string) error {
	if err := client.RefreshMetadata(topic); err != nil {
		return wrap(fmt.Sprintf("refresh metadata of topic %q", topic), "", err)
	}
	return nil
}

func topicMetadata(admin sarama.ClusterAdmin, name string) (*sarama.TopicMetadata, error) {
	metadatas, err := admin.DescribeTopics([]string{name})
	if err != nil {
		return nil, wrap(fmt.Sprintf("DescribeTopics(%q)", name), "", err)
	}
	if len(metadatas) != 1 {
		return nil, fmt.Errorf("topic %q does not exist", name)
	}
	if md := metadatas[0]; md.Err != sarama.ErrNoError {
		return nil, fmt.Errorf("topic %q returned error: %v", name, md.Err)
	}
	return metadatas[0], nil
}

func describePartition(client sarama.Client, topic string, p *sarama.PartitionMetadata) (PartitionInfo, error) {
	earliest, err := client.GetOffset(topic, p.ID, sarama.OffsetOldest)
	if err != nil {
		return PartitionInfo{}, wrap(fmt.Sprintf("fetch earliest offset of partition %d", p.ID), "", err)
	}
	latest, err := client.GetOffset(topic, p.ID, sarama.OffsetNewest)
	if err != nil {
		return PartitionInfo{}, wrap(fmt.Sprintf("fetch latest offset of partition %d", p.ID), "", err)
	}

	return PartitionInfo{
		ID:       p.ID,
		Leader:   p.Leader,
		Replicas: p.Replicas,
		ISR:      p.Isr,
		Earliest: earliest,
		Latest:   latest,
	}, nil
}

// DeleteTopic deletes a topic and its data. Deletion is asynchronous.
func DeleteTopic(admin sarama.ClusterAdmin, name string) error {
	if err := admin.DeleteTopic(name); err != nil {
		return wrap(fmt.Sprintf("DeleteTopic(%q)", name), "", err)
	}
	return nil
}

// TopicConfig returns the config in effect for the given keys; an empty key
// list means DefaultConfigKeys.
func TopicConfig(admin sarama.ClusterAdmin, name string, keys []string) ([]ConfigItem, error) {
	if len(keys) == 0 {
		keys = DefaultConfigKeys
	}
	return configItems(admin, name, keys, false)
}

// AllTopicConfig returns every config entry of the topic, sorted by name.
func AllTopicConfig(admin sarama.ClusterAdmin, name string) ([]ConfigItem, error) {
	return configItems(admin, name, nil, true)
}

func configItems(admin sarama.ClusterAdmin, name string, keys []string, all bool) ([]ConfigItem, error) {
	entries, err := admin.DescribeConfig(sarama.ConfigResource{Type: sarama.TopicResource, Name: name})
	if err != nil {
		return nil, wrap(fmt.Sprintf("DescribeConfig(%q)", name), "", err)
	}

	wanted := keySet(keys)
	items := make([]ConfigItem, 0, len(entries))
	for _, e := range entries {
		if !all && !wanted[e.Name] {
			continue
		}
		items = append(items, ConfigItem{Name: e.Name, Value: e.Value, Source: configSource(e.Default)})
	}

	sortConfigItems(items, keys, all)
	return items, nil
}

func keySet(keys []string) map[string]bool {
	set := make(map[string]bool, len(keys))
	for _, k := range keys {
		set[k] = true
	}
	return set
}

func configSource(defaulted bool) string {
	if defaulted {
		return "broker default"
	}
	return "topic override"
}

// sortConfigItems keeps the output stable: requested key order for a key
// query, name order when everything is printed.
func sortConfigItems(items []ConfigItem, keys []string, all bool) {
	if all {
		sort.Slice(items, func(i, j int) bool { return items[i].Name < items[j].Name })
		return
	}
	index := make(map[string]int, len(keys))
	for i, k := range keys {
		index[k] = i
	}
	sort.Slice(items, func(i, j int) bool { return index[items[i].Name] < index[items[j].Name] })
}
