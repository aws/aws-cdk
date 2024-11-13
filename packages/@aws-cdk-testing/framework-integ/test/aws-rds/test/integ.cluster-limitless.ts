import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { AuroraPostgresEngineVersion, ClusterInstance, ClusterScailabilityType, DatabaseCluster, DatabaseClusterEngine, PerformanceInsightRetention } from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc');

    new DatabaseCluster(this, 'Database', {
      engine: DatabaseClusterEngine.auroraPostgres({
        version: AuroraPostgresEngineVersion.VER_16_4,
      }),
      vpc,
      clusterScailabilityType: ClusterScailabilityType.LIMITLESS,
      writer: ClusterInstance.provisioned('writer', {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.R7G, ec2.InstanceSize.LARGE),
      }),
    });
  }
}

const app = new cdk.App();
const stack = new TestStack(app, 'LimitlessClusterStack');

new IntegTest(app, 'LimitlessClusterInteg', {
  testCases: [stack],
});
