import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { InstanceClass, InstanceSize, InstanceType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import {
  AuroraMysqlEngineVersion,
  ClusterInstance,
  DatabaseCluster,
  DatabaseClusterEngine,
  DatabaseInsightsMode,
  PerformanceInsightRetention,
} from 'aws-cdk-lib/aws-rds';

const app = new App();
const stack = new Stack(app, 'aws-cdk-rds-cluster-database-insights');
const vpc = new Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

new DatabaseCluster(stack, 'Cluster', {
  engine: DatabaseClusterEngine.auroraMysql({
    version: AuroraMysqlEngineVersion.VER_3_11_1,
  }),
  writer: ClusterInstance.provisioned('writer', {
    instanceType: InstanceType.of(InstanceClass.R7G, InstanceSize.LARGE),
  }),
  vpc,
  databaseInsightsMode: DatabaseInsightsMode.ADVANCED,
  performanceInsightRetention: PerformanceInsightRetention.MONTHS_15,
  removalPolicy: RemovalPolicy.DESTROY,
});

new IntegTest(app, 'cluster-database-insights-integ-test', {
  testCases: [stack],
});

app.synth();
