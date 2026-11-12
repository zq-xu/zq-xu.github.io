# Kafka Verification with a Golang Project

Continuing from [part one: Kafka in brief, and running it locally](./introduction.md) — or back to the
[series index](./index.md). The cluster is up;
this page answers a different question: **how do we prove it really works, not just that the port
accepts connections?**

The demo lives at
[`public/demos/kafka`](https://github.com/zq-xu/zq-xu.github.io/tree/master/public/demos/kafka) in
this site's repository. It is a cobra CLI: every basic capability has its own subcommand, every
subcommand runs and asserts on its own, and `e2e` chains seven steps into one regression command.

## The idea behind the checks

"Connects successfully" is only the first layer. The interesting parts are the things that break
quietly:

| Capability | Command | Evidence |
|---|---|---|
| Cluster metadata and controller readiness | `health` | Measured `RefreshMetadata` latency, broker count, controller ID |
| A created topic becomes visible | `topic create` + `describe` | Polled partition count, leader and ISR readable |
| Records actually reach disk | `produce` (sync) | Partition and offset returned by the broker |
| Key-to-partition mapping is stable | `produce` + `describe` | The same key lands on the same partition every time |
| Reading by offset without a group | `consume` | Records read from `--partition` / `--offset`, no offsets committed |
| Group assignment and offset commits | `group` + `lag` | Lag drops after the commit |
| The limit is exact, not approximate | `group --limit N` | Exactly N offsets committed |
| The whole chain is repeatable | `e2e` | Seven assertions all `[PASS]` |

**Why a Go project instead of a few CLI commands**: CLI tools cannot verify *when* offsets are
committed, whether consumption continues after a rebalance, or how the limit interacts with
`MarkMessage`. Code turns those into assertions that can be re-run after every change with one
command.

## Prerequisites

| Item | Requirement |
|---|---|
| Kafka | Started as described in part one; `docker ps` shows `kafka-demo` as `healthy` |
| Go | 1.25+ (the module declares `go 1.25.0`) |
| Dependencies | `github.com/IBM/sarama v1.60.2`, `github.com/spf13/cobra v1.10.2` |

```bash
git clone https://github.com/zq-xu/zq-xu.github.io.git
cd zq-xu.github.io/public/demos/kafka

go mod download
go build ./...
```

All commands below run in that directory.

## Quick start

```bash
./scripts/kafka.sh start     # if it is not running yet (waits for healthy)
go run . health              # connectivity
go run . produce --messages 9
go run . e2e                 # seven end-to-end assertions
```

Or use the Make shortcuts: `make kafka-up`, `make health`, `make produce`, `make e2e`, `make help`.

## Project layout

```
public/demos/kafka/
├── main.go                     # entry point, only calls cmd.Execute()
├── cmd/                        # command layer, one file per subcommand
│   ├── root.go                 #   root: binds global flags + wires the tree
│   ├── health.go  produce.go  consume.go
│   ├── group.go   lag.go  groups.go  e2e.go
│   └── topic/                  #   the topic group lives in its own package
│       ├── topic.go            #   parent command: wiring only
│       ├── create.go  list.go  describe.go  config.go  delete.go
├── internal/
│   ├── cli/                    # command plumbing: flags, topic resolution, clients
│   │   └── cli.go
│   ├── kafkax/                 # Kafka client wrapper, no printing
│   │   ├── config.go           #   Options / SaramaConfig / NewClient(With) / NewAdmin
│   │   ├── error.go            #   wrap: consistent error prefixes
│   │   ├── topic.go            #   list/create/wait/describe/delete/config
│   │   ├── produce.go          #   ProduceOptions, message builder, sync/async produce
│   │   ├── consumer.go         #   GroupHandler, ConsumeGroup
│   │   ├── partition_consume.go#   direct partition reads (no group)
│   │   ├── lag.go              #   per-partition and total lag
│   │   └── format.go           #   message printing, offset parsing
│   └── verify/                 # the 7 assertions, one file per step
│       ├── e2e.go              #   Run: executes the steps in order
│       ├── run.go              #   shared state + step list
│       ├── checker.go          #   assertion tally and [PASS]/[FAIL]
│       ├── stats.go            #   consume statistics snapshot
│       ├── step_connect.go  step_topic.go  step_produce.go
│       ├── step_consume.go  step_offsets.go  step_cleanup.go
├── scripts/kafka.sh            # docker run cluster management
├── Makefile
├── go.mod                      # go 1.25.0 + sarama v1.60.2 + cobra v1.10.2
└── go.sum
```

Directories and responsibilities line up one to one:

| Directory | Owns | Does not |
|---|---|---|
| `cmd/` (including `cmd/topic/`) | Flag parsing, output format, exit codes; one file per subcommand | Touch Kafka protocol details, assert anything |
| `internal/cli/` | Command plumbing: global flag binding, client helpers (`WithClient` / `WithAdmin`), topic name resolution | Hold business logic, print |
| `internal/kafkax/` | All Kafka interaction: config, produce, consume, topics, lag; returns data and errors only | Print, decide exit codes |
| `internal/verify/` | The seven-step assertion flow: state, assertion tally, one file per step | Call sarama directly; goes through `kafkax` only |

Why this pays off: changing the output format touches only `cmd`; reusing a capability means calling
`kafkax` directly; and `e2e` uses exactly the same wrappers as the subcommands — so **e2e passing
means every capability the subcommands rely on passes.**

Some deliberate conventions:

- **one file per subcommand**; a command with children (`topic`) becomes its own package `cmd/topic`,
  so the parent only wires and root does not grow with every feature;
- **each command keeps its flags in its own struct** (`produceFlags`, ...) instead of package-level
  variables, so commands cannot leak state into each other;
- **no function longer than 50 lines**: long flows are split per step;
- **no repeated connection boilerplate**: `cli.WithClient` / `cli.WithAdmin` open and close clients;
- **local config through a tweak function**: `NewClientWith(g, func(c *sarama.Config){...})` changes
  only the line it needs.

## Command overview

| Command | Purpose |
|---|---|
| `health` | Connectivity: brokers / controller / topic count |
| `topic create [name]` | Create a topic (partitions, replicas, retention, cleanup policy) |
| `topic list` | Topic list (partitions, replicas, internal or not) |
| `topic describe [name]` | Partition leaders / replicas / ISR / offset ranges / record count |
| `topic config [name]` | Effective config plus its source (`--keys all` for everything) |
| `topic delete [name]` | Delete a topic |
| `produce` | Produce records; `--async` for async, `--keys` to control key rotation |
| `consume` | Read directly by `--partition` / `--offset`, without joining a group |
| `group` | Consume as a group; exact `--limit`, `--manual-commit` for manual commits |
| `lag` | Per-partition and total lag |
| `groups` | Group list with state and member count |
| `e2e` | Seven end-to-end assertions |

## What each subcommand verifies and why

### `health`

Verifies that brokers are discoverable, the metadata API works (evidenced by the measured
`RefreshMetadata` latency), the controller is ready, and how many topics exist.

**Why**: every other command depends on metadata; checking it separately immediately separates
"cannot connect" from "the code has a bug".

> Trap: sarama connects lazily, so `Broker.Connected()` stays `false` until a request has been sent.
> Printing it directly would mislead. Hence the evidence is "metadata refresh succeeded, and how long
> it took".

### `topic create / list / describe / config / delete`

| Subcommand | Verifies | Why |
|---|---|---|
| `create` | Creation works and the topic is **really visible** | Creation is asynchronous: `CreateTopic` succeeding does not mean it can be described, so `WaitTopicVisible` polls |
| `create` | Duplicate creation is rejected | Idempotence guard, so re-running scripts does not mislead |
| `list` | Topics with partition and replica counts | Answers "which topic do I produce to" and "does it already exist" |
| `describe` | Partitions, leaders, ISR, earliest/latest offsets | **Tells whether records really landed**: only a rising latest offset proves it |
| `describe` | Record count = latest − earliest | Shows volume and whether partitions are balanced |
| `config` | Effective values and their source | Debugs "why did my config change not apply": topic override or broker default |
| `delete` | Deletion works and leaves other topics alone | Cleans up, and verifies the request path |

An empty ISR in `describe` is a strong signal: the leader has no in-sync replica and writes will
fail — in production that is the eve of an incident.

Three details on `create` and `describe`:

- `--retention` takes a Go duration (`24h`, `168h` = 7 days by default) and still writes
  `retention.ms` underneath;
- `--cleanup` accepts `delete` / `compact` / `compact,delete`;
- before reading offsets, `describe` refreshes the topic metadata: a topic created a moment ago has
  no partition leader in the client cache yet, and the request would fail with "not the leader".

### `produce`

Verifies: writes succeed (in sync mode the broker-returned partition/offset is hard evidence); the
same key keeps the same partition; whether partitions are balanced; the throughput difference
between sync and async.

**Why**: counting "how many I sent" means nothing; only `Successes()` means the broker accepted
them. Key-to-partition mapping is the basis of ordering — if the same key jumps partitions, "ordered
by order ID" is broken. Comparing sync and async on the same payload shows what batching buys.

Three keys may land on only two partitions (hashing is not uniform); `partition 2 -> 0 records` is
normal.

### `consume`

Verifies reading by partition and from a chosen position, printing partition/offset/key/headers/value
to check order, stopping at the limit without committing offsets.

**Why it exists**: proves reading does not depend on a consumer group — an offset is just a number,
and any position can be read; it is the tool for "is this record there?"; and because it commits
nothing, it is a **read-only safe operation** that can be repeated without changing state.

### `group`

Verifies: a rebalance really happens (log line `[rebalance] joined ... claims=demo-topic[0 1 2]`);
offsets are committed (`lag` drops accordingly); the limit is exact; manual commits work.

**Why the limit must be exact**: this is a real bug scene. The first version checked `count < limit`
per partition; with three partitions in parallel, `--limit 6` consumed 9. The fix puts "check and
increment" under one lock (`tryAcquire`); a partition that cannot get a slot returns immediately
**without `MarkMessage`**, so its offset does not advance and the record can be read again. "Consumed
less" never becomes "lost data": after `--limit 6` the committed offsets are 2+3+1=6, and lag drops
by exactly 6.

**Why `Consume` must sit in a loop**: it returns normally on every rebalance. Calling it once means
the first instance "stops consuming" as soon as another member joins — the classic consumer group
trap. The loop lives in `kafkax.ConsumeGroup`, so the command layer calls it once and cannot forget
it.

### `lag`

```
== Consumer lag group=demo-group topic=demo-topic ==
  PARTITION  COMMITTED  END  LAG
  0          3          217  214
  1          2          73   71
  2          1          102  101
  total lag: 386 records
```

`Committed` comes from `OffsetFetch`, `End` from `ListOffsets(Newest)`; the difference is the
backlog. `Committed = -1` means nothing was ever committed.

**Why it matters**: "is consumption keeping up" has exactly one reliable signal. Logs tell you what
was processed, not how much is left.

Implementation trap: after `OffsetFetch` v8 the response structure changed from `Blocks` to `Groups`;
you must use `resp.GetBlock(topic, partition)`.

### `groups`

Verifies whether a group exists, its state (`Stable` / `Empty` / `PreparingRebalance` /
`CompletingRebalance`), and member count.

**Why**: `Empty` is normal — offsets survive the process (7 days by default,
`offsets.retention.minutes`). Knowing this prevents the wrong conclusion "the group is gone, so the
offsets are gone too".

### `e2e`

```
go run . e2e                          # create a temporary topic, delete it afterwards
go run . e2e --messages 500           # more data
go run . e2e --topic my-topic --keep  # reuse a topic you name, and keep it
```

It is a **smoke test**: any failing step exits non-zero, so it fits CI. Topic selection: without
`--topic` it generates `demo-e2e-<nanotimestamp>` and deletes it; with `--topic` it reuses yours and
**does not delete it** (so it cannot destroy your data).

## The seven e2e assertions

| Step | Assertion | Why it must be there |
|---|---|---|
| 1 connect | Brokers discoverable, controller available | Without metadata nothing else matters |
| 2 topic | Metadata visible after create (or reuse) | Covers the asynchronous creation timing trap |
| 3 produce | All N records acknowledged | Covers compression, idempotence and `acks=all` end to end |
| 4 partition | The same key maps to the same partition | The premise of ordering holds |
| 5 consume | All N records received, per-partition offsets strictly increasing | No duplicates, no gaps, no reordering |
| 6 offsets | Lag back to baseline (0 for a new topic) | Offsets were really committed; using a baseline instead of a hard-coded 0 allows reuse on a non-empty topic |
| 7 cleanup | Temporary group deleted; topic kept or deleted by `--keep` | Repeatable without polluting the cluster |

Two details in step 5:

- Ordering: each partition remembers "the previous offset" and the next record must be strictly
  greater — a duplicate or a reorder fails immediately;
- Completion: the check **cannot rely on the context alone**; the limit only fires when "the next
  record arrives", so once N are received with no further records `OnLimit` never triggers — hence
  polling the consumed count instead.

## Code walkthrough

Paths are relative to `public/demos/kafka/`.

**Safety switches set from the start**: `Version=3.9.0.0` aligned with the broker;
`RequiredAcks=WaitForAll`; `Idempotent=true` together with `MaxOpenRequests=1` (a hard requirement);
`Offsets.Initial=OffsetOldest`.

**Headers on every record**: `source` and `seq`, proving headers survive the round trip — a step many
pipeline checks forget.

**Async production must drain both channels**: `Successes()` and `Errors()`. Not reading them blocks
the internal channels and grows memory.

**Offset semantics**: `MarkMessage` only marks locally; durability comes from the commit. Auto-commit
plus a failed handler can lose records; manual commit after success gives at-least-once, with possible
duplicates that need idempotent handling.

**Commit once more before exiting**: with `--commit-every 5` and only 7 records consumed, the last 2
are consumed again unless committed; `Cleanup` commits once more.

**Output and parsing in one place**: `WriteMessage` / `ParseOffset` translate `oldest` to `-2` and
`newest` to `-1`, so the command layer never remembers magic numbers.

## Measured run

Real output on this machine (single Docker broker, Go 1.25, small records):

```
== Cluster health ==
  client addresses   : localhost:9092
  negotiated version : 3.9.0
  metadata refresh   : OK (4ms)
  brokers            : 1
  controller         : broker#1 localhost:9092
  topics             : 2 (including internal topics like __consumer_offsets)
```

```
========== End-to-end verification  topic=demo-e2e-... messages=30 ==========
Step 1/7 connect to the cluster
  [PASS] brokers discovered       1 found, addresses [localhost:9092]
  [PASS] controller available     broker#1 localhost:9092
Step 2/7 prepare topic (demo-e2e-...)
  created topic with 3 partitions, replication factor 1
  [PASS] topic visible            partitions=3
Step 3/7 produce 30 records (3 rotating keys)
  [PASS] records acked            30/30 records, took 56ms
Step 4/7 verify the same key maps to the same partition
  [PASS] key-partition stable     mapping map[user-0:1 user-1:0 user-2:0]
Step 5/7 consume with group demo-e2e-group-...
  collected all 30 records
  [PASS] records consumed         got 30, want 30
  [PASS] offsets monotonic        last offset per partition map[0:19 1:9]
Step 6/7 verify offsets are committed and lag is back to baseline
  [PASS] lag back to baseline     total lag 0 (baseline 0)
Step 7/7 cleanup
  deleted group demo-e2e-group-...
  deleted topic demo-e2e-...
```

The produce side shows the sync/async gap too:

```bash
go run . produce --messages 9              # sync, around 400 records/s
go run . produce --async --messages 200    # async, around 13,000 records/s
```

## Troubleshooting

| Symptom | Likely cause | How to check |
|---|---|---|
| Every command cannot connect | Container not running / port not published | `./scripts/kafka.sh status` |
| Connects but hangs forever | `ADVERTISED_LISTENERS` points inside the container | See the advertised settings in part one |
| `create` succeeds but `describe` says it does not exist | Asynchronous creation | The project polls with `WaitTopicVisible`; check `topic list` manually |
| `NOT_LEADER_FOR_PARTITION` | Stale metadata | The project refreshes metadata per topic first; `Metadata.Retry.Max=5` is the fallback |
| A group suddenly "stops consuming" | `Consume` not called again after a rebalance | Confirm the loop inside `ConsumeGroup` |
| `lag` shows `none` | The group never committed on that partition | Normal; the whole partition counts as unconsumed |
| Fewer records than expected | Keys hash into few partitions | `topic describe` shows the distribution |
| Records repeat after manual commits | The tail was never committed | Check whether `Cleanup` commits once more |
| `e2e` fails on an existing topic | It asserted 0 while the baseline was non-zero | Assert "back to baseline", not "lag=0" |

## Production checklist

| Item | Demo | Production |
|---|---|---|
| Replication factor | 1 | 3 (`min.insync.replicas=2`) |
| Auto topic creation | true | false; created by the platform |
| acks | all | all |
| Idempotence / transactions | Idempotence on | Transactions when atomic writes span partitions |
| Security | PLAINTEXT | SASL_SSL / mTLS |
| Monitoring | None | Lag, ISR shrinkage, UnderReplicatedPartitions, disk usage |
| Partitions | 3 | Planned from peak throughput and parallelism; resizing later breaks the key mapping |
| Retention | 7 days | Based on value and capacity; tiered storage when needed |

Reliability is the combination of "replicas + acks + idempotence/transactions + consumer-side
idempotence"; leave one out and "no loss, no duplicates" does not hold.

## Cleanup

```bash
./scripts/kafka.sh stop     # stop the container, keep the data volume
./scripts/kafka.sh reset    # remove the container and the volume
rm -rf bin                  # build output
```

## References

- [Apache Kafka documentation](https://kafka.apache.org/documentation/)
- [KRaft mode (no ZooKeeper)](https://kafka.apache.org/documentation/#kraft)
- [sarama: the Go client used here](https://github.com/IBM/sarama)
- [franz-go: another popular Go client](https://github.com/twmb/franz-go)
- [cobra: the CLI framework](https://github.com/spf13/cobra)

Code and scripts: [public/demos/kafka](https://github.com/zq-xu/zq-xu.github.io/tree/master/public/demos/kafka)
· Back to [part one: Kafka in brief, and running it locally](./introduction.md) · [series index](./index.md)
