import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { AuroraMysqlEngineVersion, ClusterInstance, DatabaseCluster, DatabaseClusterEngine, DatabaseInsightsMode, PerformanceInsightRetention } from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

    new DatabaseCluster(this, 'Database', {
      engine: DatabaseClusterEngine.auroraMysql({
        version: AuroraMysqlEngineVersion.VER_3_08_0,
      }),
      vpc,
      writer: ClusterInstance.provisioned('writer', {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.R7G, ec2.InstanceSize.LARGE),
      }),
      databaseInsightsMode: DatabaseInsightsMode.ADVANCED,
      performanceInsightRetention: PerformanceInsightRetention.MONTHS_15,
    });
  }
}

const app = new cdk.App();
const stack = new TestStack(app, 'aws-cdk-rds-integ-cluster-database-insights');

new IntegTest(app, 'integ-cluster-database-insights', {
  testCases: [stack],
});

app.synth();
