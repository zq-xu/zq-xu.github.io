// Package kafkax wraps every sarama interaction used by this demo: connection
// options, the config template, topic operations, produce/consume helpers and
// lag computation.
//
// Design rule: this package returns data and errors only, it never formats
// output. Printing belongs to the cmd layer, which keeps the same capability
// reusable by every subcommand.
package kafkax

import (
	"log"
	"os"
	"strings"
	"time"

	"github.com/IBM/sarama"
)

const clientID = "kafka-demo"

// Options holds the global connection settings, filled by cobra persistent flags.
type Options struct {
	Brokers []string // broker addresses
	Topic   string   // default topic
	Group   string   // default consumer group
	Debug   bool     // enable sarama protocol logging
}

// SaramaConfig returns a config aligned with Kafka 3.9 and biased towards
// safety, so the happy path never loses messages.
func (o *Options) SaramaConfig() *sarama.Config {
	if o.Debug {
		sarama.Logger = log.New(os.Stdout, "[sarama] ", log.LstdFlags|log.Lmicroseconds)
	}

	cfg := sarama.NewConfig()
	cfg.Version = sarama.V3_9_0_0 // must match the broker, otherwise the protocol silently downgrades
	cfg.ClientID = clientID

	configureNetwork(cfg)
	configureProducer(cfg)
	configureConsumer(cfg)
	return cfg
}

func configureNetwork(cfg *sarama.Config) {
	cfg.Net.DialTimeout = 10 * time.Second
	cfg.Net.ReadTimeout = 10 * time.Second
	cfg.Net.WriteTimeout = 10 * time.Second
	cfg.Metadata.Full = true
	cfg.Metadata.Retry.Max = 5
	cfg.Metadata.Retry.Backoff = 500 * time.Millisecond
}

func configureProducer(cfg *sarama.Config) {
	cfg.Producer.RequiredAcks = sarama.WaitForAll // leader + all in-sync replicas must persist the record
	cfg.Producer.Return.Successes = true
	cfg.Producer.Return.Errors = true
	cfg.Producer.Retry.Max = 5
	cfg.Producer.Retry.Backoff = 100 * time.Millisecond
	cfg.Producer.Partitioner = sarama.NewHashPartitioner // same key -> same partition
	cfg.Producer.Compression = sarama.CompressionSnappy
	cfg.Producer.Idempotent = true
	cfg.Net.MaxOpenRequests = 1 // hard requirement of the idempotent producer
}

func configureConsumer(cfg *sarama.Config) {
	cfg.Consumer.Return.Errors = true
	cfg.Consumer.Offsets.Initial = sarama.OffsetOldest
	cfg.Consumer.Group.Rebalance.GroupStrategies = []sarama.BalanceStrategy{sarama.NewBalanceStrategyRange()}
	cfg.Consumer.Group.Session.Timeout = 15 * time.Second
	cfg.Consumer.Group.Heartbeat.Interval = 3 * time.Second
}

// NewClient dials the cluster. It discovers brokers and pulls metadata, it
// does not subscribe to any topic.
func NewClient(o *Options) (sarama.Client, error) {
	return NewClientWith(o, nil)
}

// NewClientWith lets callers adjust the default config locally (disable
// auto-commit, shorten the commit interval, ...) instead of assembling a full
// sarama.Config in every subcommand.
func NewClientWith(o *Options, tweak func(*sarama.Config)) (sarama.Client, error) {
	cfg := o.SaramaConfig()
	if tweak != nil {
		tweak(cfg)
	}

	client, err := sarama.NewClient(o.Brokers, cfg)
	if err != nil {
		return nil, wrap("connect to Kafka (%s)", strings.Join(o.Brokers, ","), err)
	}
	return client, nil
}

// NewAdmin creates the management client (topics, consumer groups, configs)
// on top of an existing connection.
//
// Note: admin.Close() also closes the client it was built from, so never
// close both.
func NewAdmin(client sarama.Client) (sarama.ClusterAdmin, error) {
	admin, err := sarama.NewClusterAdminFromClient(client)
	if err != nil {
		return nil, wrap("create ClusterAdmin", "", err)
	}
	return admin, nil
}

// StringPtr is a helper for building *string topic config entries.
func StringPtr(s string) *string { return &s }
