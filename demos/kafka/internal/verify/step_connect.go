package verify

import "fmt"

// connect proves the cluster is reachable and has a working controller. Every
// later step depends on metadata, so this is verified first and on its own.
func (r *run) connect() error {
	brokers := r.client.Brokers()
	if !r.check.check("brokers discovered", len(brokers) > 0, "%d found, addresses %v", len(brokers), r.base.Brokers) {
		return fmt.Errorf("no usable broker")
	}

	controller, err := r.client.Controller()
	if err != nil {
		return fmt.Errorf("get controller: %w", err)
	}
	r.check.check("controller available", controller != nil, "broker#%d %s", controller.ID(), controller.Addr())
	return nil
}
