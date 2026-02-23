import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import type { Construct } from 'constructs';
import * as cloudmap from 'aws-cdk-lib/aws-servicediscovery';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';

class ServiceConnect extends cdk.Stack {
  public readonly clusterName: string;
  public readonly serviceNameWithAccessLog: string;

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
      }),
      accessLogConfiguration: {
        format: ecs.ServiceConnectAccessLogFormat.JSON,
        includeQueryParameters: true,
      },
    });

    this.serviceNameWithAccessLog = svc2.serviceName;
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-ecs:removeDefaultDeploymentAlarm': false,
  },
});
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
