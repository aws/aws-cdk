import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});

class BaseEcsStack extends cdk.Stack {
  protected createBaseResources() {
    const vpc = new ec2.Vpc(this, 'VPC', { restrictDefaultSecurityGroup: false });
    const cluster = new ecs.Cluster(this, 'EcsCluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
    });
    const taskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef');
    taskDefinition.addContainer('web', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      memoryLimitMiB: 256,
    });
    return { vpc, cluster, taskDefinition };
  }
}

// Test service with multiple placement strategies
class EcsWithStrategiesStack extends BaseEcsStack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const { cluster, taskDefinition } = this.createBaseResources();

    new ecs.Ec2Service(this, 'Service', {
      cluster,
      taskDefinition,
      placementStrategies: [
        ecs.PlacementStrategy.packedByCpu(),
        ecs.PlacementStrategy.packedByMemory(),
      ],
    });
  }
}

// Test service with empty placement strategies
class EcsWithEmptyStrategiesStack extends BaseEcsStack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const { cluster, taskDefinition } = this.createBaseResources();

    new ecs.Ec2Service(this, 'Service', {
      cluster,
      taskDefinition,
      placementStrategies: [],
    });
  }
}
new integ.IntegTest(app, 'LambdaTest', {
  testCases: [
    new EcsWithStrategiesStack(app, 'ecs-placement-strategies-with-strategies'),
    new EcsWithEmptyStrategiesStack(app, 'ecs-placement-strategies-empty'),
  ],
});

app.synth();
