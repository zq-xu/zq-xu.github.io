package kafkax

import "fmt"

// wrap adds a consistent prefix to an error so the message always tells which
// step failed. subject may be empty when the format string needs no argument.
func wrap(format, subject string, err error) error {
	if subject == "" {
		return fmt.Errorf(format+": %w", err)
	}
	return fmt.Errorf(format+": %w", subject, err)
}
