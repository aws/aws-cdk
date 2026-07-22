import { App } from 'aws-cdk-lib';
import { INTEG_TEST_LATEST_AURORA_MYSQL } from './db-versions';
import { InstanceClass, InstanceSize, InstanceType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { ClusterInstance, DatabaseCluster, DatabaseClusterEngine, DatabaseInsightsMode, PerformanceInsightRetention } from 'aws-cdk-lib/aws-rds';
import { IntegTestBaseStack } from './integ-test-base-stack';

const app = new App();
const stack = new IntegTestBaseStack(app, 'aws-cdk-rds-cluster-database-insights');
const vpc = new Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

new DatabaseCluster(stack, 'Cluster', {
  engine: DatabaseClusterEngine.auroraMysql({
    version: INTEG_TEST_LATEST_AURORA_MYSQL,
  }),
  writer: ClusterInstance.provisioned('writer', {
    instanceType: InstanceType.of(InstanceClass.R7G, InstanceSize.LARGE),
  }),
  vpc,
  databaseInsightsMode: DatabaseInsightsMode.ADVANCED,
  performanceInsightRetention: PerformanceInsightRetention.MONTHS_15,
});

new IntegTest(app, 'cluster-database-insights-integ-test', {
  testCases: [stack],
});

