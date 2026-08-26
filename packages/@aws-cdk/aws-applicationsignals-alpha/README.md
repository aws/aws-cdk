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

1. Configure `instrumentation` to instrument the application with the ADOT SDK Agent.
2. Specify `cloudWatchAgentSidecar` to configure the CloudWatch Agent as a sidecar container.

```ts
import { Construct } from 'constructs';
import * as appsignals from '@aws-cdk/aws-applicationsignals-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';

class MyStack extends cdk.Stack {
  public constructor(scope?: Construct, id?: string, props: cdk.StackProps = {}) {
    super();
    const vpc = new ec2.Vpc(this, 'TestVpc', {});
    const cluster = new ecs.Cluster(this, 'TestCluster', { vpc });

    const fargateTaskDefinition = new ecs.FargateTaskDefinition(this, 'SampleAppTaskDefinition', {
      cpu: 2048,
      memoryLimitMiB: 4096,
    });

    fargateTaskDefinition.addContainer('app', {
      image: ecs.ContainerImage.fromRegistry('test/sample-app'),
    });

    new appsignals.ApplicationSignalsIntegration(this, 'ApplicationSignalsIntegration', {
      taskDefinition: fargateTaskDefinition,
      instrumentation: {
        sdkVersion: appsignals.JavaInstrumentationVersion.V2_10_0,
      },
      serviceName: 'sample-app',
      cloudWatchAgentSidecar: {
        containerName: 'cloudwatch-agent',
        enableLogging: true,
        cpu: 256,
        memoryLimitMiB: 512,
      }
    });

    new ecs.FargateService(this, 'MySampleApp', {
      cluster: cluster,
      taskDefinition: fargateTaskDefinition,
      desiredCount: 1,
    });
  }
}
```

#### Enable Application Signals on ECS with daemon mode

Note: Since the daemon deployment strategy is not supported on ECS Fargate, this mode is only supported on ECS on EC2.

1. Run CloudWatch Agent as a daemon service with HOST network mode.
1. Configure `instrumentation` to instrument the application with the ADOT Python Agent.
1. Override environment variables by configuring `overrideEnvironments` to use service connect endpoints to communicate to the CloudWatch agent server

```ts
import { Construct } from 'constructs';
import * as appsignals from '@aws-cdk/aws-applicationsignals-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';

class MyStack extends cdk.Stack {
  public constructor(scope?: Construct, id?: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'TestVpc', {});
    const cluster = new ecs.Cluster(this, 'TestCluster', { vpc });

    // Define Task Definition for CloudWatch agent (Daemon)
    const cwAgentTaskDefinition = new ecs.Ec2TaskDefinition(this, 'CloudWatchAgentTaskDefinition', {
      networkMode: ecs.NetworkMode.HOST,
    });

    new appsignals.CloudWatchAgentIntegration(this, 'CloudWatchAgentIntegration', {
      taskDefinition: cwAgentTaskDefinition,
      containerName: 'ecs-cwagent',
      enableLogging: false,
      cpu: 128,
      memoryLimitMiB: 64,
      portMappings: [
        {
          containerPort: 4316,
          hostPort: 4316,
        },
        {
          containerPort: 2000,
          hostPort: 2000,
        },
      ],
    });

    // Create the CloudWatch Agent daemon service
    new ecs.Ec2Service(this, 'CloudWatchAgentDaemon', {
      cluster,
      taskDefinition: cwAgentTaskDefinition,
      daemon: true,  // Runs one container per EC2 instance
    });

    // Define Task Definition for user application
    const sampleAppTaskDefinition = new ecs.Ec2TaskDefinition(this, 'SampleAppTaskDefinition', {
      networkMode: ecs.NetworkMode.HOST,
    });

    sampleAppTaskDefinition.addContainer('app', {
      image: ecs.ContainerImage.fromRegistry('test/sample-app'),
      cpu: 0,
      memoryLimitMiB: 512,
    });

    // No CloudWatch Agent side car is needed as application container communicates to CloudWatch Agent daemon through host network
    new appsignals.ApplicationSignalsIntegration(this, 'ApplicationSignalsIntegration', {
      taskDefinition: sampleAppTaskDefinition,
      instrumentation: {
        sdkVersion: appsignals.PythonInstrumentationVersion.V0_8_0
      },
      serviceName: 'sample-app'
    });

    new ecs.Ec2Service(this, 'MySampleApp', {
      cluster,
      taskDefinition: sampleAppTaskDefinition,
      desiredCount: 1,
    });
  }
}
```

#### Enable Application Signals on ECS with replica mode

**Note**
*Running CloudWatch Agent service using replica mode requires specific security group configurations to enable communication with other services.
For Application Signals functionality, configure the security group with the following minimum inbound rules: Port 2000 (HTTP) and Port 4316 (HTTP).
This configuration ensures proper connectivity between the CloudWatch Agent and dependent services.*

1. Run CloudWatch Agent as a replica service with service connect.
1. Configure `instrumentation` to instrument the application with the ADOT Python Agent.
1. Override environment variables by configuring `overrideEnvironments` to use service connect endpoints to communicate to the CloudWatch agent server

```ts
import { Construct } from 'constructs';
import * as appsignals from '@aws-cdk/aws-applicationsignals-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { PrivateDnsNamespace } from 'aws-cdk-lib/aws-servicediscovery';

class MyStack extends cdk.Stack {
  public constructor(scope?: Construct, id?: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'TestVpc', {});
    const cluster = new ecs.Cluster(this, 'TestCluster', { vpc });
    const dnsNamespace = new PrivateDnsNamespace(this, 'Namespace', {
      vpc,
      name: 'local',
    });
    const securityGroup = new ec2.SecurityGroup(this, 'ECSSG', { vpc });
    securityGroup.addIngressRule(securityGroup, ec2.Port.tcpRange(0, 65535));

    // Define Task Definition for CloudWatch agent (Replica)
    const cwAgentTaskDefinition = new ecs.FargateTaskDefinition(this, 'CloudWatchAgentTaskDefinition', {});

    new appsignals.CloudWatchAgentIntegration(this, 'CloudWatchAgentIntegration', {
      taskDefinition: cwAgentTaskDefinition,
      containerName: 'ecs-cwagent',
      enableLogging: false,
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
    });

    // Create the CloudWatch Agent replica service with service connect
    new ecs.FargateService(this, 'CloudWatchAgentService', {
      cluster: cluster,
      taskDefinition: cwAgentTaskDefinition,
      securityGroups: [securityGroup],
      serviceConnectConfiguration: {
        namespace: dnsNamespace.namespaceArn,
        services: [
          {
            portMappingName: 'cwagent-4316',
            dnsName: 'cwagent-4316-http',
            port: 4316,
          },
          {
            portMappingName: 'cwagent-2000',
            dnsName: 'cwagent-2000-http',
            port: 2000,
          },
        ],
      },
      desiredCount: 1,
    });

    // Define Task Definition for user application
    const sampleAppTaskDefinition = new ecs.FargateTaskDefinition(this, 'SampleAppTaskDefinition', {});

    sampleAppTaskDefinition.addContainer('app', {
      image: ecs.ContainerImage.fromRegistry('test/sample-app'),
      cpu: 0,
      memoryLimitMiB: 512,
    });

    // Overwrite environment variables to connect to the CloudWatch Agent service just created
    new appsignals.ApplicationSignalsIntegration(this, 'ApplicationSignalsIntegration', {
      taskDefinition: sampleAppTaskDefinition,
      instrumentation: {
        sdkVersion: appsignals.PythonInstrumentationVersion.V0_8_0,
      },
      serviceName: 'sample-app',
      overrideEnvironments: [
        {
          name: appsignals.CommonExporting.OTEL_AWS_APPLICATION_SIGNALS_EXPORTER_ENDPOINT,
          value: 'http://cwagent-4316-http:4316/v1/metrics',
        },
        {
          name: appsignals.TraceExporting.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT,
          value: 'http://cwagent-4316-http:4316/v1/traces',
        },
        {
          name: appsignals.TraceExporting.OTEL_TRACES_SAMPLER_ARG,
          value: 'endpoint=http://cwagent-2000-http:2000',
        },
      ],
    });

    // Create ECS Service with service connect configuration
    new ecs.FargateService(this, 'MySampleApp', {
      cluster: cluster,
      taskDefinition: sampleAppTaskDefinition,
      serviceConnectConfiguration: {
        namespace: dnsNamespace.namespaceArn,
      },
      desiredCount: 1,
    });
  }
}
```
