import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as ecs from '../../lib';


class ServiceConnect extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
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
      cluster: cluster,
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
  }
}

const app = new cdk.App();
const stack = new ServiceConnect(app, 'aws-ecs-service-connect');

new integ.IntegTest(app, 'ServiceConnect', {
  testCases: [stack],
});

app.synth();