# kafka-demo: local Kafka verification kit
#
# The cluster is started with a single `docker run` (see scripts/kafka.sh),
# docker compose is intentionally not used. Every capability is a cobra
# subcommand; these targets are just shortcuts for the common ones.

BIN   := kafka-demo
KAFKA := ./scripts/kafka.sh

.DEFAULT_GOAL := help

.PHONY: help build fmt vet check clean \
        kafka-up kafka-down kafka-restart kafka-reset kafka-status kafka-logs \
        health topics create list describe config delete \
        produce produce-async consume group lag groups e2e demo

help: ## Show all targets
	@printf "kafka-demo targets:\n\n"
	@printf "  Cluster\n"
	@printf "    make kafka-up        start the single-node Kafka (docker run)\n"
	@printf "    make kafka-down      stop and remove the container (data volume kept)\n"
	@printf "    make kafka-reset     remove the container and the data volume\n"
	@printf "    make kafka-status    container status\n"
	@printf "    make kafka-logs      follow the broker log\n\n"
	@printf "  Verification\n"
	@printf "    make health          cluster connectivity\n"
	@printf "    make topics          topic list\n"
	@printf "    make create          create demo-topic\n"
	@printf "    make describe        partitions and offsets of demo-topic\n"
	@printf "    make config          demo-topic config\n"
	@printf "    make produce         sync produce, 10 records\n"
	@printf "    make produce-async   async produce, 200 records\n"
	@printf "    make consume         partition consume, 10 records\n"
	@printf "    make group           group consume, 10 records\n"
	@printf "    make lag             consumer lag\n"
	@printf "    make groups          consumer group list\n"
	@printf "    make e2e             end-to-end, 7 assertions\n"
	@printf "    make demo            produce + consume + lag in one go\n\n"
	@printf "  Code\n"
	@printf "    make build / fmt / vet / check / clean\n"

build: ## Build into ./bin
	go build -o bin/$(BIN) .

fmt: ## Format
	gofmt -l -w .

vet: ## Static checks
	go vet ./...

check: fmt vet build ## Format + vet + build

clean: ## Remove build output
	rm -rf bin

# ---------- Cluster ----------
kafka-up: ## Start Kafka
	$(KAFKA) start

kafka-down: ## Stop Kafka
	$(KAFKA) stop

kafka-restart: ## Restart Kafka
	$(KAFKA) restart

kafka-reset: ## Remove the container and the data volume
	$(KAFKA) reset

kafka-status: ## Container status
	$(KAFKA) status

kafka-logs: ## Follow the broker log
	$(KAFKA) logs

# ---------- Verification ----------
health: ## Cluster connectivity
	go run . health

topics: ## Topic list
	go run . topic list

create: ## Create demo-topic
	go run . topic create --topic demo-topic --partitions 3 --retention 1h

list: topics

describe: ## Topic detail
	go run . topic describe demo-topic

config: ## Topic config
	go run . topic config demo-topic

delete: ## Delete demo-topic
	go run . topic delete demo-topic

produce: ## Sync produce, 10 records
	go run . produce --count 10 --keys 3

produce-async: ## Async produce, 200 records
	go run . produce --async --count 200 --keys 6

consume: ## Partition consume, 10 records
	go run . consume --limit 10

group: ## Group consume, 10 records
	go run . group --limit 10

lag: ## Consumer lag
	go run . lag

groups: ## Consumer group list
	go run . groups

e2e: ## End-to-end verification
	go run . e2e

demo: ## Produce + consume + lag
	go run . produce --count 20 --keys 4
	go run . group --limit 20
	go run . lag
