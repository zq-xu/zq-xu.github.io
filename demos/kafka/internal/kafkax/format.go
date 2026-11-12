package kafkax

import (
	"fmt"
	"io"
	"strconv"
	"strings"

	"github.com/IBM/sarama"
)

// WriteMessage renders one message in a human readable form: partition,
// offset, key, headers and the payload itself.
func WriteMessage(w io.Writer, msg *sarama.ConsumerMessage) {
	headers := make([]string, 0, len(msg.Headers))
	for _, h := range msg.Headers {
		headers = append(headers, fmt.Sprintf("%s=%s", h.Key, h.Value))
	}

	fmt.Fprintf(w, "  partition=%d offset=%d key=%q ts=%s headers=[%s]\n    value=%s\n",
		msg.Partition,
		msg.Offset,
		string(msg.Key),
		msg.Timestamp.Format("15:04:05.000"),
		strings.Join(headers, " "),
		string(msg.Value),
	)
}

// ParseOffset translates a CLI value into a sarama offset:
//   - oldest / earliest -> OffsetOldest(-2), the earliest retained record
//   - newest / latest   -> OffsetNewest(-1), only records produced afterwards
//   - non-negative int  -> start from that absolute offset
func ParseOffset(s string) (int64, error) {
	switch strings.ToLower(strings.TrimSpace(s)) {
	case "oldest", "earliest":
		return sarama.OffsetOldest, nil
	case "newest", "latest":
		return sarama.OffsetNewest, nil
	}

	v, err := strconv.ParseInt(s, 10, 64)
	if err != nil || v < 0 {
		return 0, fmt.Errorf("cannot parse offset=%q, want oldest / newest / non-negative integer", s)
	}
	return v, nil
}
