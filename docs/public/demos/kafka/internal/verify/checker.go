package verify

import "fmt"

// checker counts assertions and prints one aligned line per assertion.
type checker struct {
	passed int
	failed int
}

func (c *checker) check(name string, ok bool, format string, args ...any) bool {
	status := "[PASS]"
	if ok {
		c.passed++
	} else {
		c.failed++
		status = "[FAIL]"
	}
	fmt.Printf("  %s %-24s %s\n", status, name, fmt.Sprintf(format, args...))
	return ok
}

// result turns the accumulated failures into the error returned by Run.
func (c *checker) result() error {
	if c.failed > 0 {
		return fmt.Errorf("%d assertions failed", c.failed)
	}
	return nil
}
