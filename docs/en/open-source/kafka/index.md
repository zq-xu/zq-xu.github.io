# Kafka

This series walks through Kafka on a real local setup: what it is and why it is designed that way,
when to use it, how to bring up a working single-node cluster with one `docker run`, and finally how
to verify the basics with a Golang project.

* [Kafka in brief, and running it locally](./introduction.md): the core model
  (topic / partition / offset / replicas / consumer groups), typical uses, performance and when to
  choose Kafka, plus the full `docker run`, every setting explained, a smoke test and troubleshooting.
* [Kafka verification with a Golang project](./golang-verification.md): a cobra CLI, one subcommand per
  capability, covering topic management, sync/async producing, direct partition reads, an exact
  consumer-group limit, lag, and seven end-to-end assertions.

Read them in order: get the cluster running first, then verify it. If you already have a cluster, jump
straight to part two.
