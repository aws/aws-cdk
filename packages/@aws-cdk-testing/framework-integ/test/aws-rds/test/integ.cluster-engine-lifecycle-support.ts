import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { INTEG_TEST_LATEST_AURORA_MYSQL } from './db-versions';
import * as cdk from 'aws-cdk-lib';
import { IntegTestBaseStack } from './integ-test-base-stack';
import { ClusterInstance, DatabaseCluster, DatabaseClusterEngine, EngineLifecycleSupport } from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends IntegTestBaseStack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 2 });

    new DatabaseCluster(this, 'Database', {
      engine: DatabaseClusterEngine.auroraMysql({
        version: INTEG_TEST_LATEST_AURORA_MYSQL,
      }),
      vpc,
      engineLifecycleSupport: EngineLifecycleSupport.OPEN_SOURCE_RDS_EXTENDED_SUPPORT,
      writer: ClusterInstance.provisioned('writer', {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.R7G, ec2.InstanceSize.LARGE),
      }),
    });
  }
}

const app = new cdk.App();
const stack = new TestStack(app, 'RdsClusterEngineLifecycleSupportStack');

new IntegTest(app, 'RdsClusterEngineLifecycleSupportInteg', {
  testCases: [stack],
});
