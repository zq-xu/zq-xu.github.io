package kafkax

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/IBM/sarama"
)

// ErrSampleLimit is how many error samples async produce keeps for display.
const ErrSampleLimit = 5

// ProduceOptions describes one produce run.
type ProduceOptions struct {
	Topic     string
	Count     int
	Keys      int    // how many distinct keys to rotate
	KeyPrefix string // key namespace, e.g. user
}

// RecordKey builds the record key of sequence number seq. The same key always
// lands on the same partition through the hash partitioner, which is the
// foundation of per-key ordering.
func RecordKey(prefix string, seq, distinct int) string {
	if distinct <= 0 {
		distinct = 1
	}
	return fmt.Sprintf("%s-%d", prefix, seq%distinct)
}

func (o ProduceOptions) key(seq int) string {
	return RecordKey(o.KeyPrefix, seq, o.Keys)
}

// payload is the record body; JSON keeps it parseable for consumers.
type payload struct {
	Seq int    `json:"seq"`
	Msg string `json:"msg"`
	At  string `json:"at"`
}

func buildMessage(topic, key string, seq int) *sarama.ProducerMessage {
	now := time.Now()
	body, _ := json.Marshal(payload{
		Seq: seq,
		Msg: fmt.Sprintf("hello kafka #%d", seq),
		At:  now.Format(time.RFC3339),
	})

	return &sarama.ProducerMessage{
		Topic:     topic,
		Key:       sarama.StringEncoder(key),
		Value:     sarama.ByteEncoder(body),
		Timestamp: now,
		Headers: []sarama.RecordHeader{
			{Key: []byte("source"), Value: []byte("kafka-demo")},
			{Key: []byte("seq"), Value: []byte(fmt.Sprint(seq))},
		},
	}
}

// SentMessage is one record confirmed by the broker in sync mode.
type SentMessage struct {
	Seq       int
	Key       string
	Partition int32
	Offset    int64
}

// ProduceSync sends records one by one and waits for the ACK, returning the
// real partition and offset of every record.
//
// Use it when the write result must be known; throughput is bounded by the
// network round trip.
func ProduceSync(client sarama.Client, o ProduceOptions) ([]SentMessage, error) {
	producer, err := sarama.NewSyncProducerFromClient(client)
	if err != nil {
		return nil, wrap("create sync producer", "", err)
	}
	defer producer.Close()

	sent := make([]SentMessage, 0, o.Count)
	for seq := 1; seq <= o.Count; seq++ {
		msg, err := sendOne(producer, o, seq)
		if err != nil {
			return nil, err
		}
		sent = append(sent, msg)
	}
	return sent, nil
}

func sendOne(producer sarama.SyncProducer, o ProduceOptions, seq int) (SentMessage, error) {
	key := o.key(seq)
	partition, offset, err := producer.SendMessage(buildMessage(o.Topic, key, seq))
	if err != nil {
		return SentMessage{}, wrap(fmt.Sprintf("send record %d", seq), "", err)
	}
	return SentMessage{Seq: seq, Key: key, Partition: partition, Offset: offset}, nil
}

// ProduceReport summarizes an async produce run.
type ProduceReport struct {
	Success      int
	Failed       int
	Elapsed      time.Duration
	PerPartition map[int32]int
	ErrSamples   []error
}

// ProduceAsync pushes records into Input() and lets the producer batch them
// internally.
//
// Both Successes() and Errors() must be drained, otherwise the internal
// channels block and memory grows.
func ProduceAsync(client sarama.Client, o ProduceOptions) (ProduceReport, error) {
	producer, err := sarama.NewAsyncProducerFromClient(client)
	if err != nil {
		return ProduceReport{}, wrap("create async producer", "", err)
	}

	report := ProduceReport{PerPartition: make(map[int32]int)}
	done := make(chan struct{}, 2)
	go drainSuccesses(producer, &report, done)
	go drainErrors(producer, &report, done)

	start := time.Now()
	for seq := 1; seq <= o.Count; seq++ {
		producer.Input() <- buildMessage(o.Topic, o.key(seq), seq)
	}
	// AsyncClose closes Input, flushes the remaining records, then closes
	// Successes()/Errors() so both drain goroutines can exit.
	producer.AsyncClose()
	<-done
	<-done

	report.Elapsed = time.Since(start)
	if report.Failed > 0 {
		return report, fmt.Errorf("%d records failed to send", report.Failed)
	}
	return report, nil
}

func drainSuccesses(producer sarama.AsyncProducer, report *ProduceReport, done chan<- struct{}) {
	defer func() { done <- struct{}{} }()
	for msg := range producer.Successes() {
		report.Success++
		report.PerPartition[msg.Partition]++
	}
}

func drainErrors(producer sarama.AsyncProducer, report *ProduceReport, done chan<- struct{}) {
	defer func() { done <- struct{}{} }()
	for perr := range producer.Errors() {
		report.Failed++
		if len(report.ErrSamples) < ErrSampleLimit {
			report.ErrSamples = append(report.ErrSamples, perr.Err)
		}
	}
}
