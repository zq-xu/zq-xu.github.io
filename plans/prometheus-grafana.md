---
description: Prometheus 与 Grafana 系列写作计划：可观测底座、集群总览面板与告警链路。
date: 2026-11-21
stage: P1
---

# Prometheus + Grafana

**目标目录**：`docs/zh/open-source/prometheus-grafana/`，英文对应 `docs/en/open-source/prometheus-grafana/`，demos 放 `docs/public/demos/prometheus-grafana/`。

## 定位

Kubernetes 集群的可观测底座。数据源分三层：node-exporter 采节点，kube-state-metrics 采 API 对象状态，应用自身暴露 `/metrics`。Prometheus 拉取并存储，Grafana 呈现，Alertmanager 负责判定与分发。

## 为什么排在第一位

后面三个系列的验证都要看指标。先建好这一层，其余系列不必各自搭一套观测。

它同时是 Prometheus Operator 的完整落地样本：ServiceMonitor 这类 CRD 如何被 Operator 转成抓取配置，比空讲 Operator 机制具体得多，可以反哺 Argo CD 与 KEDA 里各自的控制器行为。

## 版本基准

kube-prometheus-stack 92.x（当前补丁线 92.7.0 与 92.11.0），内含 Prometheus v3.15、Alertmanager v0.34、Grafana 13.x、Prometheus Operator v0.94、kube-state-metrics 2.20、node-exporter 1.12。

写作时锁定 chart 版本，正文与 `values.yaml` 保持一致；升级只改一处并同步全部引用。

## 篇目

| 篇目 | 内容 | 依赖 |
| --- | --- | --- |
| `introduction.md` | 四种指标类型、pull 抓取模型、三层数据源的分工、PromQL 表达式模型、Exporter 生态 | 无 |
| `installation.md` | Helm 安装 chart 92.x、组件逐个验证、资源与容量规划、kind 上的最低配置 | kind 集群 |
| `service-monitor.md` | ServiceMonitor 与 PodMonitor 的选取逻辑、relabel 正确写法、Recording Rule、应用接入的三步 | 上一篇 |
| `cluster-dashboard.md` | 集群总览面板：容量、节点状态、Pod 异常、API 延迟、etcd、调度队列；datasource 与变量设计，附可直接导入的 dashboard JSON | 前两篇 |
| `alerting.md` | 告警规则分层（可用性、容量、SLO）、Alertmanager 路由与抑制、告警送达 | 前两篇 |

`cluster-dashboard.md` 是这一系列的重点篇目，要交付一个能替代“逐个看 `kubectl get`”的整体视图，而不是照搬 chart 自带的 29 个面板。

## demos

`docs/public/demos/prometheus-grafana/` 下分三块：

- `installation/`：`yaml/` 与 `scripts/` 同级，含 `values.local.yaml` 的渲染模板与安装、验证、清理脚本。
- `dashboards/`：自建 dashboard 的 JSON 与导入说明。
- `app/`：暴露 `/metrics` 的 Go 服务，附 ServiceMonitor 清单，用于验证应用指标从采集到面板的完整链路。

## 验收

- 节点、Pod、应用三类指标都能在面板上看到，不依赖 `kubectl top`。
- 删掉一个 Pod 后，kube-state-metrics 的相关指标按预期变化。
- 自建 dashboard 的变量切换不报错，数据源切换后面板不空白。
- 告警从规则触发到送达可复现一次，抑制规则生效一次。
