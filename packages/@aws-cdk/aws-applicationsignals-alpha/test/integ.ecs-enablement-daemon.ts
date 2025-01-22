
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import { PrivateDnsNamespace } from 'aws-cdk-lib/aws-servicediscovery';
import * as appsignals from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'ecs-enablement-integration');

const vpc = new ec2.Vpc(stack, 'TestVpc', {});
const cluster = new ecs.Cluster(stack, 'TestCluster', { vpc });
const namespace = new PrivateDnsNamespace(stack, 'Namespace', {
  vpc,
  name: 'local',
});

// Define Task Definition for CloudWatch agent (Daemon)
const cwAgentTaskDefinition = new ecs.Ec2TaskDefinition(stack, 'CwAgentDaemonTaskDef');

// Add the CloudWatch agent container
cwAgentTaskDefinition.addContainer('ecs-cwagent', {
  image: ecs.ContainerImage.fromRegistry('public.ecr.aws/cloudwatch-agent/cloudwatch-agent:latest'),
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
    logGroup: new LogGroup(stack, 'CwAgentLogGroup', {
      logGroupName: '/ecs/ecs-cwagent-cdk-daemon',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    }),
  }),
  environment: {
    CW_CONFIG_CONTENT: '{"agent": {"debug": true}, "traces": {"traces_collected": {"application_signals": {"enabled": true}}}, "logs": {"metrics_collected": {"application_signals": {"enabled": true}}}}',
  },
});

new ecs.Ec2Service(stack, 'CwAgentDaemonService', {
  cluster,
  taskDefinition: cwAgentTaskDefinition,
  daemon: true, // Runs one container per EC2 instance
  serviceConnectConfiguration: {
    namespace: namespace.namespaceArn,
    services: [{
      portMappingName: 'cwagent-4316',
      dnsName: 'cwagent-4316-http',
      port: 4316,
    }, {
      portMappingName: 'cwagent-2000',
      dnsName: 'cwagent-2000-http',
      port: 2000,
    }],
  },
});

const ec2TaskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDefinition', {
  networkMode: ecs.NetworkMode.HOST,
});

ec2TaskDefinition.addContainer('app', {
  image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
  cpu: 0,
  memoryLimitMiB: 512,
});

new appsignals.ApplicationSignalsIntegration(stack, 'TestEc2TaskDefinitionIntegration', {
  taskDefinition: ec2TaskDefinition,
  instrumentation: {
    sdkVersion: appsignals.PythonInstrumentationVersion.V0_8_0,
  },
  serviceName: 'demo',
  overrideEnvironments: [
    {
      name: appsignals.CommonExporting.OTEL_AWS_APPLICATION_SIGNALS_EXPORTER_ENDPOINT,
      value: 'http://cwagent-4316-http:4316/v1/metrics',
    }, {
      name: appsignals.TraceExporting.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT,
      value: 'hhttp://cwagent-4316-http:4316/v1/traces',
    }, {
      name: appsignals.TraceExporting.OTEL_TRACES_SAMPLER_ARG,
      value: 'endpoint=http://cwagent-2000-http:2000',
    },
  ],
  cloudWatchAgent: {
    enableSidecar: false,
  },
});

new integ.IntegTest(app, 'ApplicationSignalsIntegrationECSDaemon', {
  testCases: [stack],
});

app.synth();
