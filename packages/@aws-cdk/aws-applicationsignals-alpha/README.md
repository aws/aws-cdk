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

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

```ts nofixture
import * as appsignals from '@aws-cdk/aws-applicationsignals-alpha';
```

## Enable Application Signals on ECS with sidecar mode

```ts
new appsignals.ApplicationSignalsIntegration(this, 'ApplicationSignalsIntegration', {
  taskDefinition,
  instrumentation: {
    language: appsignals.InstrumentationLanguage.JAVA,
    sdkVersion: appsignals.Instrumentation.JAVA_1_32_6
  },
  serviceName: 'sample-app',
  cloudWatchAgent: {
    enableSidecar: true,
  }
});
```

## Enable Application Signals on ECS with daemon mode

Since the daemon deployment strategy is not supported on ECS Fargate, this mode is only supported on ECS on EC2.

```ts
import * as ecs from 'aws-cdk-lib/aws-ecs';

// create CloudWatch agent daemon service
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
        logGroup: new LogGroup(this, 'CwAgentLogGroup', {
            logGroupName: '/ecs/ecs-cwagent-cdk-daemon',
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        }),
    }),
    environment: {
        CW_CONFIG_CONTENT: '{"traces": {"traces_collected": {"application_signals": {}}}, "logs": {"metrics_collected":{"application_signals": {}}}}'
    }
});

const cwAgentService = new ecs.Ec2Service(this, 'CwAgentDaemonService', {
    cluster,
    taskDefinition: cwAgentTaskDefinition,
    daemon: true,
    serviceConnectConfiguration: {
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

// configure ApplicationSignalsIntegration to use Service Connect to communicate to the CloudWatch agent server
new appsignals.ApplicationSignalsIntegration(this, 'ApplicationSignalsIntegration', taskDefinition, {
  instrumentation: {
    language: appsignals.InstrumentationLanguage.PYTHON,
    sdkVersion: appsignals.Instrumentation.PYTHON_V0_7_0
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
})
```
