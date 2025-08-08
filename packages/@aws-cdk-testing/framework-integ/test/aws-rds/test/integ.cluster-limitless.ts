import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { AuroraPostgresEngineVersion, ClusterScalabilityType, DatabaseCluster, DatabaseClusterEngine, DBClusterStorageType, PerformanceInsightRetention } from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const versions = [
  AuroraPostgresEngineVersion.VER_16_4_LIMITLESS,
  AuroraPostgresEngineVersion.VER_16_8_LIMITLESS,
];

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc');

    versions.forEach(version => {
      new DatabaseCluster(this, `DatabaseCluster${version.auroraPostgresFullVersion}`, {
        engine: DatabaseClusterEngine.auroraPostgres({
          version,
        }),
        vpc,
        clusterScalabilityType: ClusterScalabilityType.LIMITLESS,
        enablePerformanceInsights: true,
        performanceInsightRetention: PerformanceInsightRetention.MONTHS_1,
        monitoringInterval: cdk.Duration.minutes(1),
        enableClusterLevelEnhancedMonitoring: true,
        storageType: DBClusterStorageType.AURORA_IOPT1,
        cloudwatchLogsExports: ['postgresql'],
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      });
    });
  }
}

const app = new cdk.App();
const stack = new TestStack(app, 'LimitlessClusterStack');

new IntegTest(app, 'LimitlessClusterInteg', {
  testCases: [stack],
});
