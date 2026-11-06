import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as integ from '@aws-cdk/integ-tests-alpha';
import type { Construct } from 'constructs';
import * as cloudmap from 'aws-cdk-lib/aws-servicediscovery';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as logs from 'aws-cdk-lib/aws-logs';

class ServiceConnect extends cdk.Stack {
  public readonly clusterName: string;
  public readonly serviceNameWithAccessLog: string;
  public readonly serviceConnectProxyLogGroupName: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const cluster = new ecs.Cluster(this, 'EcsCluster', {
      defaultCloudMapNamespace: {
        name: 'scorekeep.com',
        useForServiceConnect: true,
      },
    });

    this.clusterName = cluster.clusterName;

    const td = new ecs.FargateTaskDefinition(this, 'TaskDef', {
      cpu: 1024,
      memoryLimitMiB: 2048,
    });

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
      }),
    });

    new ecs.FargateService(this, 'Svc', {
      taskDefinition: td,
      cluster,
      serviceConnectConfiguration: {
        services: [
          {
            portMappingName: 'api',
            dnsName: 'api',
            port: 80,
          },
        ],
        logDriver: ecs.LogDrivers.awsLogs({
          streamPrefix: 'sc',
        }),
      },
    });

    const ns = new cloudmap.HttpNamespace(this, 'Ns', {
      name: 'whistler.com',
    });

    const svc2 = new ecs.FargateService(this, 'SvcTwo', {
      taskDefinition: td,
      cluster,
    });

    svc2.node.addDependency(ns);

    // Explicit log group so the log group name is referenceable in assertions
    const scProxyLogGroup = new logs.LogGroup(this, 'ServiceConnectProxyLogGroup', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    this.serviceConnectProxyLogGroupName = scProxyLogGroup.logGroupName;

    svc2.enableServiceConnect({
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
      logDriver: ecs.LogDrivers.awsLogs({
        streamPrefix: 'sc-svc2',
        logGroup: scProxyLogGroup,
      }),
      accessLogConfiguration: {
        format: ecs.ServiceConnectAccessLogFormat.JSON,
        includeQueryParameters: true,
      },
    });

    this.serviceNameWithAccessLog = svc2.serviceName;

    // Traffic generator: a client-only service connect service that continuously
    // sends HTTP requests to SvcTwo via the whistler.com namespace.
    // This generates access logs through the SvcTwo service connect proxy,
    // which are captured in scProxyLogGroup.
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
    // Allow the generator's service connect proxy to reach SvcTwo's proxy.
    // Without this, the TCP connection to SvcTwo's inbound port is blocked by
    // the default security group rules, causing 504 timeouts on the generator side
    // and no traffic (and no access logs) reaching SvcTwo.
    // Service connect proxy ingress ports are dynamically allocated (TCP only).
    // Note: addDependency(svc2) is intentionally omitted here — combining it with
    // allowTo would create a circular CloudFormation dependency between the services'
    // security groups. The generator's wget loop handles any startup ordering naturally.
    generatorSvc.connections.allowTo(svc2, ec2.Port.allTcp());
  }
}

const app = new cdk.App();
const stack = new ServiceConnect(app, 'aws-ecs-service-connect');

cdk.RemovalPolicies.of(stack).apply(cdk.RemovalPolicy.DESTROY);

const test = new integ.IntegTest(app, 'ServiceConnect', {
  testCases: [stack],
});
const listNamespaceCall = test.assertions.awsApiCall('ServiceDiscovery', 'listNamespaces');
listNamespaceCall.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: ['servicediscovery:ListNamespaces'],
  Resource: ['*'],
});
listNamespaceCall.expect(integ.ExpectedResult.objectLike({
  Namespaces: integ.Match.arrayWith([
    integ.Match.objectLike({
      Name: 'scorekeep.com',
      Type: 'DNS_PRIVATE',
    }),
  ]),
}));
listNamespaceCall.expect(integ.ExpectedResult.objectLike({
  Namespaces: integ.Match.arrayWith([
    integ.Match.objectLike({
      Name: 'whistler.com',
      Type: 'HTTP',
    }),
  ]),
}));

// Verify that JSON access logs are emitted to CloudWatch when both
// accessLogConfiguration and logDriver (logConfiguration) are configured.
// The GeneratorSvc continuously hits SvcTwo via service connect, causing the
// Envoy proxy to write JSON access log entries (containing response_code) to
// scProxyLogGroup. This confirms that logConfiguration is required for
// access log delivery.
const filterLogEventsCall = test.assertions.awsApiCall('CloudWatchLogs', 'filterLogEvents', {
  logGroupName: stack.serviceConnectProxyLogGroupName,
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
  totalTimeout: cdk.Duration.minutes(10),
  interval: cdk.Duration.seconds(30),
});
