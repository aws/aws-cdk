import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import type { Construct } from 'constructs';
import * as cloudmap from 'aws-cdk-lib/aws-servicediscovery';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as logs from 'aws-cdk-lib/aws-logs';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';

class ServiceConnect extends cdk.Stack {
  public readonly clusterName: string;
  public readonly serviceNameWithAccessLog: string;
  public readonly serviceConnectProxyLogGroupName: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);
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

// Verify that the service connect proxy (Envoy) emits logs to CloudWatch when
// both accessLogConfiguration and logDriver (logConfiguration) are configured.
// The Envoy proxy writes startup and operational logs to the configured log group
// even without HTTP traffic, confirming that logConfiguration is required to
// capture any logs from the proxy.
const filterLogEventsCall = test.assertions.awsApiCall('CloudWatchLogs', 'filterLogEvents', {
  logGroupName: stack.serviceConnectProxyLogGroupName,
  limit: 1,
});
filterLogEventsCall.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: ['logs:FilterLogEvents'],
  Resource: ['*'],
});
filterLogEventsCall.assertAtPath(
  'events.0.message',
  integ.ExpectedResult.stringLikeRegexp('.+'),
).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(5),
  interval: cdk.Duration.seconds(30),
});
