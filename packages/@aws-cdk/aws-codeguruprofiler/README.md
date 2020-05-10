## AWS::CodeGuruProfiler Construct Library
<!--BEGIN STABILITY BANNER-->
---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib)) are always stable and safe to use.

---
<!--END STABILITY BANNER-->

Amazon CodeGuru Profiler collects runtime performance data from your live applications, and provides recommendations that can help you fine-tune your application performance. Using machine learning algorithms, CodeGuru Profiler can help you find your most expensive lines of code and suggest ways you can improve efficiency and remove CPU bottlenecks. Amazon CodeGuru Profiler provides different visualizations of profiling data to help you identify what code is running on the CPU, see how much time is consumed, and suggest ways to reduce CPU utilization.

### Installation

Import to your project:

```ts
import * as codeguruprofiler from '@aws-cdk/aws-codeguruprofiler';
```

### Basic usage

Here's how to setup a profiling group and give your compute role permissions to publish to the profiling group to the profiling agent can publish profiling information:

```ts
const profilingGroup = new ProfilingGroup(stack, 'MyProfilingGroup', {
  profilingGroupName: 'MyAwesomeProfilingGroup',
});

const publishAppRole = new Role(stack, 'PublishAppRole', {
  assumedBy: new AccountRootPrincipal(),
});

profilingGroup.grantPublish(publishAppRole);
```
