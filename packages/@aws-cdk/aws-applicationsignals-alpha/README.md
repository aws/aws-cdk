# AWS::ApplicationSignals Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

## Application Signals

CloudWatch Application Signals is an auto-instrumentation solution built on OpenTelemetry that enables zero-code collection of monitoring data, such
as traces and metrics, from applications running across multiple platforms. It also supports topology auto-discovery based on collected monitoring
data and includes a new feature for managing service-level objectives (SLOs).

It supports Java, Python, .NET, and Node.js on platforms including EKS (and native Kubernetes), Lambda, ECS, and EC2. For more details, visit
[Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html) on the AWS
public website.

## Application Signals L2 CDK for enablement

This module is a collection of L2 constructs which leverages native L1 CFN resources, simplifying the enablement steps and the creation of Application
Signals resources.

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

```ts nofixture
import * as appsignals from '@aws-cdk/aws-applicationsignals-alpha';
```

### ApplicationSignalsIntegration

`ApplicationSignalsIntegration` aims to address key challenges in the current CDK enablement process, which requires complex manual configurations for
ECS customers. Application Signals is designed to be flexible and is supported for other platforms as well. However, the initial focus is on supporting
ECS, with plans to potentially extend support to other platforms in the future.

#### 1. Enable Application Signals on ECS with sidecar mode

##### 1.1. Create a TaskDefinition for application

```ts
import * as ecs from 'aws-cdk-lib/aws-ecs';

const fargateTaskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDefinition', {
  taskRole: taskRole,
  cpu: 2048,
  memoryLimitMiB: 4096
});

fargateTaskDefinition.addContainer('app', {
  image: ...,
  ...
});
```

##### 1.2. Configure ApplicationSignalsIntegration

Key steps:

1. Configure `instrumentation` to instrument the application with the ADOT Java Agent.
2. Setting `enableSidecar` to true to add the CloudWatch Agent as a sidecar container.

```ts
new appsignals.ApplicationSignalsIntegration(this, 'ApplicationSignalsIntegration', {
  taskDefinition,
  instrumentation: {
    language: appsignals.InstrumentationLanguage.JAVA,
    sdkVersion: appsignals.JavaInstrumentationVersion.V1_32_6
  },
  serviceName: 'sample-app',
  cloudWatchAgent: {
    enableSidecar: true,
  }
});
```

#### 2. Enable Application Signals on ECS with daemon mode

Note: Since the daemon deployment strategy is not supported on ECS Fargate, this mode is only supported on ECS on EC2.

##### 2.1. Run CloudWatch Agent as a daemon service

```ts
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as logs from 'aws-cdk-lib/aws-logs';

// Create a task definition for CloudWatch agent
const cwAgentTaskDefinition = new ecs.Ec2TaskDefinition(this, 'CloudWatchAgentTaskDefinition');

// Add CloudWatch agent container
const cwAgentContainer = cwAgentTaskDefinition.addContainer('ecs-cwagent', {
    image: ecs.ContainerImage.fromRegistry("public.ecr.aws/cloudwatch-agent/cloudwatch-agent:latest"),
    cpu: 128,
    memoryLimitMiB: 64,
    portMappings: [
    {
        name: 'cwagent-4316',
        containerPort: 4316,
        hostPort: 4316,
    },
    {
        name: 'cwagent-2000',
        containerPort: 2000,
        hostPort: 2000,
    },
    ],
    logging: new ecs.AwsLogDriver({
        streamPrefix: 'ecs',
        logGroup: new logs.LogGroup(this, 'CwAgentLogGroup', {
            logGroupName: '/ecs/ecs-cwagent-cdk-daemon',
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        }),
    }),
    environment: {
        CW_CONFIG_CONTENT: '{"traces": {"traces_collected": {"application_signals": {}}}, "logs": {"metrics_collected":{"application_signals": {}}}}'
    }
});

// Create the CloudWatch agent daemon service
new ecs.Ec2Service(this, 'CloudWatchAgentDaemon', {
  cluster,
  taskDefinition: cwAgentTaskDefinition,
  daemon: true,  // Runs one container per EC2 instance
  serviceConnectConfiguration: { // Create service connect
    namespace: namespace.namespaceArn,
    services: [{
      portMappingName: 'cwagent-4316',
      dnsName: 'cwagent-4316-http',
      port: 4316
    }, {
      portMappingName: 'cwagent-2000',
      dnsName: 'cwagent-2000-http',
      port: 2000
    }]
  }
});
```

##### 2.2. Create a TaskDefinition for application

```ts
import * as ecs from 'aws-cdk-lib/aws-ecs';

const ec2TaskDefinition = new ecs.Ec2TaskDefinition(this, 'EC2TaskDefinition', {
  taskRole: taskRole,
  ...
});

ec2TaskDefinition.addContainer('app', {
  image: ...,
  ...
});
```

##### 2.3. Configure ApplicationSignalsIntegration

Key steps:

1. Configure `instrumentation` to instrument the application with the ADOT Python Agent.
2. Set `enableSidecar` to false to disable running CloudWatch agent as a sidecar.
3. Override environment variables by configuring `overrideEnvironments` to use Service Connect to communicate to the CloudWatch agent server

```ts
new appsignals.ApplicationSignalsIntegration(this, 'ApplicationSignalsIntegration', ec2TaskDefinition, {
  instrumentation: {
    language: appsignals.InstrumentationLanguage.PYTHON,
    sdkVersion: appsignals.PythonInstrumentationVersion.V0_8_0
  },
  overrideEnvironments: [{
    name: appsignals.CommonExporting.OTEL_AWS_APPLICATION_SIGNALS_EXPORTER_ENDPOINT,
    // overwrite the endpoint to point to the created Service Connect
    value: "http://cwagent-4316-http:4316/v1/metrics"
  }, {
    name: appsignals.TraceExporting.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT,
    // overwrite the endpoint to point to the created Service Connect
    value: "http://cwagent-4316-http:4316/v1/traces"
  }, {
    name: appsignals.TraceExporting.OTEL_TRACES_SAMPLER_ARG,
    // overwrite the endpoint to point to the created Service Connect
    value: "endpoint=http://cwagent-2000-http:2000"
  }],
  serviceName: 'sample-app',
  cloudWatchAgent: {
    // disable sidecar mode
    enableSidecar: false,
  }
});
```
