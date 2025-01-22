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

CloudWatch Application Signals is an auto-instrumentation solution built on OpenTelemetry that enables zero-code collection of monitoring data, such
as traces and metrics, from applications running across multiple platforms. It also supports topology auto-discovery based on collected monitoring data
and includes a new feature for managing service-level objectives (SLOs).

It supports Java, Python, .NET, and Node.js on platforms including EKS (and native Kubernetes), Lambda, ECS, and EC2. For more details, visit
[Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html) on the AWS
public website.

## Application Signals Enablement L2 Constructs

A collection of L2 constructs which leverages native L1 CFN resources, simplifying the enablement steps and the creation of Application
Signals resources.

### ApplicationSignalsIntegration

`ApplicationSignalsIntegration` aims to address key challenges in the current CDK enablement process, which requires complex manual configurations for
ECS customers. Application Signals is designed to be flexible and is supported for other platforms as well. However, the initial focus is on supporting
ECS, with plans to potentially extend support to other platforms in the future.

#### Enable Application Signals on ECS with sidecar mode

1. Configure `instrumentation` to instrument the application with the ADOT Java Agent.
2. Setting `enableSidecar` to true to add the CloudWatch Agent as a sidecar container.

```ts
import { Construct } from 'constructs';
import * as appsignals from '@aws-cdk/aws-applicationsignals-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';

class MyStack extends cdk.Stack {
    public constructor(scope?: Construct, id?: string, props: cdk.StackProps = {}) {
        super();
        const fargateTaskDefinition = new ecs.FargateTaskDefinition(this, 'FargateTaskDefinition', {
            cpu: 2048,
            memoryLimitMiB: 4096
        });

        fargateTaskDefinition.addContainer('app', {
            image: ecs.ContainerImage.fromRegistry('test/sample-app'),
        });

        new appsignals.ApplicationSignalsIntegration(this, 'ApplicationSignalsIntegration', {
            taskDefinition: fargateTaskDefinition,
            instrumentation: {
                sdkVersion: appsignals.JavaInstrumentationVersion.V1_32_6
            },
            serviceName: 'sample-app',
            cloudWatchAgentSidecar: {
              containerName: 'cloudwatch-agent',
              cpu: 256,
              memoryLimitMiB: 512
          }
        });
    }
}
```

#### Enable Application Signals on ECS with daemon mode

Note: Since the daemon deployment strategy is not supported on ECS Fargate, this mode is only supported on ECS on EC2.

1. Run CloudWatch Agent as a daemon service with service connect.
1. Configure `instrumentation` to instrument the application with the ADOT Python Agent.
1. Set `enableSidecar` to false to disable running CloudWatch agent as a sidecar.
1. Override environment variables by configuring `overrideEnvironments` to use service connect endpoints to communicate to the CloudWatch agent server

```ts
import { Construct } from 'constructs';
import * as appsignals from '@aws-cdk/aws-applicationsignals-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as logs from 'aws-cdk-lib/aws-logs';

class MyStack extends cdk.Stack {
  public constructor(scope?: Construct, id?: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'TestVpc', {});
    const cluster = new ecs.Cluster(this, 'TestCluster', { vpc });
    // Create a task definition for CloudWatch agent
    const cwAgentTaskDefinition = new ecs.Ec2TaskDefinition(this, 'CloudWatchAgentTaskDefinition');

    new appsignals.CloudWatchAgentIntegration(this, 'CloudWatchAgent',
      {
        taskDefinition: cwAgentTaskDefinition,
        containerName: 'ecs-cwagent',
        enableLogging: true,
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
      }
    )

    // Create the CloudWatch agent daemon service
    new ecs.Ec2Service(this, 'CloudWatchAgentDaemon', {
      cluster,
      taskDefinition: cwAgentTaskDefinition,
      daemon: true,  // Runs one container per EC2 instance
      serviceConnectConfiguration: {
        namespace: 'namespace-arn',
        services: [
          {
              portMappingName: 'cwagent-4316',
              dnsName: 'cwagent-4316-http',
              port: 4316
          },
          {
              portMappingName: 'cwagent-2000',
              dnsName: 'cwagent-2000-http',
              port: 2000
          }
        ]
      }
    });

    const ec2TaskDefinition = new ecs.Ec2TaskDefinition(this, 'Ec2TaskDefinition', {
      networkMode: ecs.NetworkMode.HOST,
    });

    ec2TaskDefinition.addContainer('app', {
      image: ecs.ContainerImage.fromRegistry('test/sample-app'),
      cpu: 0,
      memoryLimitMiB: 512,
    });

    new appsignals.ApplicationSignalsIntegration(this, 'ApplicationSignalsIntegration', {
      taskDefinition: ec2TaskDefinition,
      instrumentation: {
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
      serviceName: 'sample-app'
    });
  }
}
```
