---
description: "Kind (Kubernetes in Docker) for local Kubernetes clusters: project positioning, architecture, single-node and multi-node deployment, and a sample project workflow."
date: 2026-11-16
recommend: 1
tag:
 - Kind
tags:
 - Kubernetes
 - Docker
 - Kind
categories:
 - Open Source
---

# Kind

Kind is a local cluster tool that uses Docker containers as Kubernetes nodes. Maintained by Kubernetes SIG Testing, it creates single-node or multi-node clusters on one host while preserving the behaviour of upstream Kubernetes.

## Documentation

- [Kind overview](./introduction): project positioning, architecture, cluster creation flow, networking and image mechanics, limitations, and comparison with similar tools.
- [Single-node deployment](./single-node-deployment): install Kind, create a single-node cluster, verify core components, with a one-shot script.
- [Multi-node deployment](./multi-node-deployment): one control plane with two workers, and a three-control-plane HA layout.
- [Deploying a simple project](./deploy-simple-app): image build and loading, Deployment, Service, probes, resource limits and a one-shot deployment script.

The sample service, Dockerfile, Kubernetes manifests and scripts live at [`docs/public/demos/kind`](https://github.com/zq-xu/zq-xu.github.io/tree/master/docs/public/demos/kind).
