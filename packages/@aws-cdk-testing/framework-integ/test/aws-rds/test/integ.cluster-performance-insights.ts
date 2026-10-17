import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { INTEG_TEST_LATEST_AURORA_MYSQL } from './db-versions';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as cdk from 'aws-cdk-lib';
import { IntegTestBaseStack } from './integ-test-base-stack';
import { ClusterInstance, DatabaseCluster, DatabaseClusterEngine, PerformanceInsightRetention } from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends IntegTestBaseStack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

    const kmsKey = new kms.Key(this, 'DbSecurity');

    new DatabaseCluster(this, 'Database', {
      engine: DatabaseClusterEngine.auroraMysql({
        version: INTEG_TEST_LATEST_AURORA_MYSQL,
      }),
      vpc,
      enablePerformanceInsights: true,
      performanceInsightRetention: PerformanceInsightRetention.LONG_TERM,
      performanceInsightEncryptionKey: kmsKey,
      writer: ClusterInstance.provisioned('writer', {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.R7G, ec2.InstanceSize.LARGE),
      }),
      readers: [ClusterInstance.provisioned('reader', {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.R7G, ec2.InstanceSize.LARGE),
      })],
    });
  }
}

const app = new cdk.App();
const stack = new TestStack(app, 'aws-cdk-rds-integ-cluster-performance-insights');

new IntegTest(app, 'integ-cluster-performance-insights', {
  testCases: [stack],
});

