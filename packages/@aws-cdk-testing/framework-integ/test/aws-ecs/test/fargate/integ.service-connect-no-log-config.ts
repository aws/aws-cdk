/**
 * Diagnostic integ test: accessLogConfiguration WITHOUT logDriver (logConfiguration).
 *
 * Purpose: Verify that a service with accessLogConfiguration but without logDriver
 * deploys successfully (no CloudFormation/ECS error), and observe whether any logs
 * appear in CloudWatch Logs.
 *
 * Background: The AWS docs state that accessLogConfiguration requires logConfiguration
 * for logs to be delivered. This test investigates the runtime behaviour when
 * logConfiguration is absent — specifically, whether the Envoy proxy emits any logs
 * to the app container's log group or simply drops them.
 *
 * Expected result: The service deploys successfully. The filterLogEvents assertion
 * on the container log group with a service-connect stream prefix should time out
 * with no events if ECS does NOT route proxy logs to the app container's log driver,
 * confirming that logConfiguration is required for log delivery.
 */
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as integ from '@aws-cdk/integ-tests-alpha';
import type { Construct } from 'constructs';
import * as cloudmap from 'aws-cdk-lib/aws-servicediscovery';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as logs from 'aws-cdk-lib/aws-logs';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';

class ServiceConnectNoLogConfig extends cdk.Stack {
  public readonly clusterName: string;
  public readonly serviceName: string;
  public readonly containerLogGroupName: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);
    const cluster = new ecs.Cluster(this, 'EcsCluster', {
      defaultCloudMapNamespace: {
        name: 'no-log-cfg.scorekeep.com',
        useForServiceConnect: true,
      },
    });

    this.clusterName = cluster.clusterName;

    const td = new ecs.FargateTaskDefinition(this, 'TaskDef', {
      cpu: 1024,
      memoryLimitMiB: 2048,
    });

    // Explicit log group for the app container so we can check whether the
    // Envoy proxy routes its logs here when no service connect logDriver is set.
    const containerLogGroup = new logs.LogGroup(this, 'ContainerLogGroup', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    this.containerLogGroupName = containerLogGroup.logGroupName;

    td.addContainer('Container', {
      containerName: 'web',
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      portMappings: [
        {
          name: 'api',
          containerPort: 80,
          appProtocol: ecs.AppProtocol.http2,
        },
      ],
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: 'web',
        logGroup: containerLogGroup,
      }),
    });

    const ns = new cloudmap.HttpNamespace(this, 'Ns', {
      name: 'no-log-cfg.whistler.com',
    });

    const svc = new ecs.FargateService(this, 'Svc', {
      taskDefinition: td,
      cluster,
    });

    svc.node.addDependency(ns);

    // Enable service connect with accessLogConfiguration but intentionally WITHOUT logDriver.
    // This mirrors the configuration the PR reviewer asked about.
    svc.enableServiceConnect({
      services: [
        {
          portMappingName: 'api',
          dnsName: 'api',
          port: 80,
          idleTimeout: cdk.Duration.seconds(30),
          perRequestTimeout: cdk.Duration.seconds(30),
        },
      ],
      namespace: ns.namespaceArn,
      // No logDriver here — accessLogConfiguration without logConfiguration
      accessLogConfiguration: {
        format: ecs.ServiceConnectAccessLogFormat.JSON,
        includeQueryParameters: true,
      },
    });

    this.serviceName = svc.serviceName;

    // Traffic generator: a client-only service connect service that continuously
    // sends HTTP requests to Svc via the no-log-cfg.whistler.com namespace.
    // This would normally generate access logs through the Svc service connect proxy,
    // but since no logDriver is configured, we can check whether any JSON access
    // log entries appear anywhere (e.g., in the container log group).
    const generatorTd = new ecs.FargateTaskDefinition(this, 'GeneratorTaskDef', {
      cpu: 256,
      memoryLimitMiB: 512,
    });
    generatorTd.addContainer('Generator', {
      containerName: 'generator',
      image: ecs.ContainerImage.fromRegistry('public.ecr.aws/docker/library/alpine:latest'),
      command: ['sh', '-c', 'while true; do wget -qO /dev/null http://api:80 2>&1 || true; sleep 5; done'],
      essential: true,
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: 'gen' }),
    });
    const generatorSvc = new ecs.FargateService(this, 'GeneratorSvc', {
      taskDefinition: generatorTd,
      cluster,
      serviceConnectConfiguration: {
        namespace: ns.namespaceArn,
      },
    });
    // Service connect proxy ingress ports are dynamically allocated (TCP only).
    // addDependency(svc) is intentionally omitted to avoid circular CloudFormation
    // dependencies with the allowTo security group rule.
    generatorSvc.connections.allowTo(svc, ec2.Port.allTcp());
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-ecs:removeDefaultDeploymentAlarm': false,
  },
});
const stack = new ServiceConnectNoLogConfig(app, 'aws-ecs-service-connect-no-log-config');

cdk.RemovalPolicies.of(stack).apply(cdk.RemovalPolicy.DESTROY);

const test = new integ.IntegTest(app, 'ServiceConnectNoLogConfig', {
  testCases: [stack],
});

// 1. Verify the service deployed successfully with accessLogConfiguration (no CFN error).
const describeServicesCall = test.assertions.awsApiCall('ECS', 'describeServices', {
  cluster: stack.clusterName,
  services: [stack.serviceName],
});
describeServicesCall.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: ['ecs:DescribeServices'],
  Resource: ['*'],
});
describeServicesCall.expect(integ.ExpectedResult.objectLike({
  services: integ.Match.arrayWith([
    integ.Match.objectLike({ status: 'ACTIVE' }),
  ]),
}));

// 2. Check whether JSON access logs (response_code field) appear anywhere when
//    no logDriver is configured for service connect.
//    The GeneratorSvc is generating HTTP traffic through the Svc proxy, so if
//    access logs are being emitted, they would appear as JSON events with
//    response_code in the container log group.
//    If this assertion PASSES  → access logs appear without logDriver (surprising).
//    If this assertion FAILS   → access logs are dropped, confirming logDriver is required.
const filterLogEventsCall = test.assertions.awsApiCall('CloudWatchLogs', 'filterLogEvents', {
  logGroupName: stack.containerLogGroupName,
  filterPattern: '{ $.response_code >= 200 }',
  limit: 1,
});
filterLogEventsCall.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: ['logs:FilterLogEvents'],
  Resource: ['*'],
});
filterLogEventsCall.assertAtPath(
  'events.0.message.user_agent',
  integ.ExpectedResult.stringLikeRegexp('.+'),
).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(2),
  interval: cdk.Duration.seconds(30),
});
