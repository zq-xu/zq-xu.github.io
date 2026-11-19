---
description: "The Kafka series on a local machine: concepts and selection, a single-node KRaft cluster started with one docker run, and a Golang project verifying produce, consume, consumer groups and offsets."
date: 2026-11-12
recommend: 1
tag:
 - Kafka
tags:
 - Kafka
 - Golang
 - Docker
categories:
 - Open Source
---

# Kafka

This series walks through Kafka on a real local setup: what it is and why it is designed that way, when to use it; how to bring up a working single-node cluster with one `docker run`; and finally how to verify the basics with a Golang project.

* [Kafka Concepts and When to Use It](./introduction.md): one end-to-end diagram tying together producer → topic → partition → offset → consumer group, replica roles, log storage and `acks` write acknowledgement, plus core capabilities, typical uses, performance and when to choose Kafka.
* [Running Kafka Locally](./local-deployment.md): the full `docker run` for a single-node KRaft (Kafka Raft) cluster, every setting explained, script management, a smoke test, data persistence and troubleshooting.
* [Kafka Verification with a Golang Project](./golang-verification.md): a cobra CLI (command-line interface), one subcommand per capability, covering topic management, sync/async producing, direct partition reads, an exact consumer-group limit, lag, and seven end-to-end assertions.

Read them in order: concepts first, then get the cluster running, then verify it. If you already have a cluster, jump straight to the Golang verification page.
