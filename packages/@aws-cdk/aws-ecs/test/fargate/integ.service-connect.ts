import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as ecs from '../../lib';


class ServiceConnect extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    new ecs.Cluster(this, 'EcsCluster', {
      defaultCloudMapNamespace: {
        name: 'scorekeep.com',
        useAsServiceConnectDefault: true,
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
          appProtocol: ecs.AppProtocol.HTTP2,
        },
      ],
    });
  }
}

const app = new cdk.App();
const stack = new ServiceConnect(app, 'aws-ecs-service-connect');

new integ.IntegTest(app, 'ServiceConnect', {
  testCases: [stack],
});

app.synth();