import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { INTEG_TEST_LATEST_AURORA_POSTGRES_LIMITLESS } from './db-versions';
import * as cdk from 'aws-cdk-lib';
import { IntegTestBaseStack } from './integ-test-base-stack';
import { ClusterScalabilityType, DatabaseCluster, DatabaseClusterEngine, DBClusterStorageType, PerformanceInsightRetention } from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends IntegTestBaseStack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc');

    new DatabaseCluster(this, `DatabaseCluster${INTEG_TEST_LATEST_AURORA_POSTGRES_LIMITLESS.auroraPostgresFullVersion}`, {
      engine: DatabaseClusterEngine.auroraPostgres({
        version: INTEG_TEST_LATEST_AURORA_POSTGRES_LIMITLESS,
      }),
      vpc,
      clusterScalabilityType: ClusterScalabilityType.LIMITLESS,
      enablePerformanceInsights: true,
      performanceInsightRetention: PerformanceInsightRetention.MONTHS_1,
      monitoringInterval: cdk.Duration.minutes(1),
      enableClusterLevelEnhancedMonitoring: true,
      storageType: DBClusterStorageType.AURORA_IOPT1,
      cloudwatchLogsExports: ['postgresql'],
    });
  }
}

const app = new cdk.App();
const stack = new TestStack(app, 'LimitlessClusterStack');

new IntegTest(app, 'LimitlessClusterInteg', {
  testCases: [stack],
});
