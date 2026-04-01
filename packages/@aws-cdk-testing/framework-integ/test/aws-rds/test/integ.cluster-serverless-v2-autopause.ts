import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { INTEG_TEST_LATEST_AURORA_MYSQL } from './db-versions';
import type { StackProps } from 'aws-cdk-lib';
import { App, Duration } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import { ClusterInstance } from 'aws-cdk-lib/aws-rds';
import type { Construct } from 'constructs';
import { IntegTestBaseStack } from './integ-test-base-stack';

export class TestStack extends IntegTestBaseStack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const vpc = new Vpc(this, 'Integ-VPC');
    new rds.DatabaseCluster(this, 'Integ-Cluster', {
      engine: rds.DatabaseClusterEngine.auroraMysql({ version: INTEG_TEST_LATEST_AURORA_MYSQL }),
      serverlessV2MaxCapacity: 1,
      serverlessV2MinCapacity: 0,
      serverlessV2AutoPauseDuration: Duration.hours(1),
      writer: ClusterInstance.serverlessV2('writer'),
      vpc: vpc,
    });
  }
}

const app = new App();
new IntegTest(app, 'integ-test-autopause', {
  testCases: [new TestStack(app, 'integ-aurora-serverlessv2-cluster-autopause')],
});
