import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as cloudmap from 'aws-cdk-lib/aws-servicediscovery';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';

class ServiceConnect extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);
    const cluster = new ecs.Cluster(this, 'EcsCluster', {
      defaultCloudMapNamespace: {
        name: 'scorekeep.com',
        useForServiceConnect: true,
      },
    });

    const td = new ecs.FargateTaskDefinition(this, 'TaskDef', {
      cpu: 1024,
      memoryLimitMiB: 2048,
    });

    td.addContainer('container', {
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

    new ecs.FargateService(this, 'svc', {
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

    const ns = new cloudmap.HttpNamespace(this, 'ns', {
      name: 'whistler.com',
    });

    const svc2 = new ecs.FargateService(this, 'svc-two', {
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
    });
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-ecs:removeDefaultDeploymentAlarm': false,
  },
});
const stack = new ServiceConnect(app, 'aws-ecs-service-connect');

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

app.synth();
