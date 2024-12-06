import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { AuroraPostgresEngineVersion, ClusterScailabilityType, DatabaseCluster, DatabaseClusterEngine, DBClusterStorageType, PerformanceInsightRetention } from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc');

    new DatabaseCluster(this, 'DatabaseCluster', {
      engine: DatabaseClusterEngine.auroraPostgres({
        version: AuroraPostgresEngineVersion.VER_16_4_LIMITLESS,
      }),
      vpc,
      clusterScailabilityType: ClusterScailabilityType.LIMITLESS,
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
