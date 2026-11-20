---
description: KEDA 系列写作计划：事件驱动伸缩的架构、ScaledObject 用法与 Go worker 从 0 到 N 的完整验证。
date: 2026-11-21
stage: P3
---

# KEDA

**目标目录**：`docs/zh/open-source/keda/`，英文对应 `docs/en/open-source/keda/`，demos 放 `docs/public/demos/keda/`。

## 定位

调度面的事件驱动伸缩。解决 HPA 的两个固有短板：只能看 CPU 与内存，且不能把副本缩到 0。

## 架构要点

KEDA Operator 负责 ScaledObject 与 ScaledJob 的 reconcile；Metrics Server 作为 external metrics adapter，把 scaler 采集到的指标交给 HPA；HPA 仍是真正执行伸缩的组件，KEDA 不替换它。

这一点是理解 KEDA 的关键：它不接管伸缩决策，只负责把“外部事件”翻译成 HPA 能读的指标。多数误用都源于把 KEDA 当成独立的 autoscaler。

## 版本基准

KEDA v2.20.2（2026 年 7 月发布，CNCF 毕业项目）。

## 篇目

| 篇目 | 内容 | 依赖 |
| --- | --- | --- |
| `introduction.md` | HPA 的边界、KEDA 三个组件的分工、从 0 到 N 的完整链路、内置 scaler 分类 | 无 |
| `installation.md` | Helm 安装 operator 与 metrics server、CRD 清单、kind 上的验证 | kind 集群 |
| `scaledobject.md` | ScaledObject 字段（`scaleTargetRef`、`minReplicaCount`、`pollingInterval`、`cooldownPeriod`、`advanced`）、ScaledJob、TriggerAuthentication | 上一篇 |
| `golang-scaling-demo.md` | Go worker 消费 Redis List，按积压量在 0 → N → 0 之间伸缩，附逐段断言与日志 | 前三篇 + Redis 系列 |
| `troubleshooting.md` | HPA 不接管、指标恒为 0、缩容不归零、冷启动延迟与 `stabilizationWindow` 的关系 | 全部 |

`golang-scaling-demo.md` 的触发源默认用 Redis List，与 P2 的成果复用。若改为 Kafka topic，需要额外说明与 kafka 系列的衔接，但不重新部署 Kafka。

## demos

`docs/public/demos/keda/` 下分两块：

- `installation/`：`yaml/` 与 `scripts/` 同级，含 Helm values 的渲染模板与安装、验证、清理脚本。
- `app/`：Go worker，消费 Redis List 并打印处理进度，供观察副本数随积压变化。
- `scalers/`：ScaledObject 与 TriggerAuthentication 清单，按场景拆分为多个文档。

## 验收

- 积压上升后副本数在可预期时间内增长，`kubectl describe hpa` 中的指标来源指向 KEDA。
- 积压清空后副本回到 0，回收过程无 Pod 残留。
- 冷启动期间不丢任务，逻辑上有明确的处理边界。
- 清理脚本执行后，ScaledObject、HPA 与工作负载全部移除。
