# AWS::CodeGuruProfiler Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---

<!--END STABILITY BANNER-->

Amazon CodeGuru Profiler collects runtime performance data from your live applications, and provides recommendations that can help you fine-tune your application performance.

## Installation

Import to your project:

```ts nofixture
import * as codeguruprofiler from '@aws-cdk/aws-codeguruprofiler';
```

## Basic usage

Here's how to setup a profiling group and give your compute role permissions to publish to the profiling group to the profiling agent can publish profiling information:

```ts
// The execution role of your application that publishes to the ProfilingGroup via CodeGuru Profiler Profiling Agent. (the following is merely an example)
const publishAppRole = new iam.Role(this, 'PublishAppRole', {
  assumedBy: new iam.AccountRootPrincipal(),
});

const profilingGroup = new codeguruprofiler.ProfilingGroup(this, 'MyProfilingGroup');
profilingGroup.grantPublish(publishAppRole);
```

## Compute Platform configuration

Code Guru Profiler supports multiple compute environments.
They can be configured when creating a Profiling Group by using the `computePlatform` property:

```ts
const profilingGroup = new codeguruprofiler.ProfilingGroup(this, 'MyProfilingGroup', {
  computePlatform: codeguruprofiler.ComputePlatform.AWS_LAMBDA,
});
```
