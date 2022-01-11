# AWS::APS Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources]) are always stable and safe to use.
>
> [CFN Resources]: https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

```ts nofixture
import * as aps from '@aws-cdk/aws-aps';
```

## Introduction

Amazon Managed Service for Prometheus is a Prometheus-compatible monitoring and alerting service that makes it easy to monitor containerized applications and infrastructure at scale. The Cloud Native Computing Foundation’s Prometheus project is a popular open source monitoring and alerting solution optimized for container environments. With Amazon Managed Service for Prometheus, you can use the open source Prometheus query language (PromQL) to monitor and alert on the performance of containerized workloads, without having to scale and operate the underlying infrastructure. Amazon Managed Service for Prometheus automatically scales the ingestion, storage, alerting, and querying of operational metrics as workloads grow or shrink, and is integrated with AWS security services to enable fast and secure access to data. The service is integrated with Amazon Elastic Kubernetes Service (Amazon EKS), Amazon Elastic Container Service (Amazon ECS), and AWS Distro for OpenTelemetry.

## Workspace

The `Workspace` construct allows you to create Amazon Managed Service for Prometheus workspace: 
> This is the bare minimum to get going

```ts
const workspace = new Workspace(stack, 'workspace');
```

## RuleGroupsNamespace

The `RuleGroupsNamespace` construct allows you to add namespace into Amazon Managed Service for Prometheus(AMP) workspace:

```ts
const workspace = new Workspace(stack, 'workspace');

const ruleGroupsNamespace = new RuleGroupsNamespace(stack, 'DemoWorkspace', {
    name: 'DemoRuleGroupsNamespace',
    workspace,
    data: `groups:
  - name: test
    rules:
    - record: metric:recording_rule
      expr: avg(rate(container_cpu_usage_seconds_total[5m]))
  - name: alert-test
    rules:
    - alert: metric:alerting_rule
      expr: avg(rate(container_cpu_usage_seconds_total[5m])) > 0
      for: 2m`});

```
