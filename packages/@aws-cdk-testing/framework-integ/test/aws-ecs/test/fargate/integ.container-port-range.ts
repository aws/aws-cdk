import * as constructs from 'constructs';
import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ecs from 'aws-cdk-lib/aws-ecs';

class EcsContainerPortRangeStack extends cdk.Stack {
  readonly cluster: ecs.Cluster;

  constructor(scope: constructs.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.cluster = new ecs.Cluster(this, 'EcsCluster');

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'FargateTaskDef');

    taskDefinition.addContainer('web', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      portMappings: [{ containerPortRange: '8080-8081' }],
    });

    new ecs.FargateService(this, 'FargateService', {
      cluster: this.cluster,
      taskDefinition,
    });
  }
}

const app = new cdk.App();
const stack = new EcsContainerPortRangeStack(app, 'aws-ecs-container-port-range');

new integ.IntegTest(app, 'EcsContainerPortRange', {
  testCases: [stack],
});

app.synth();
