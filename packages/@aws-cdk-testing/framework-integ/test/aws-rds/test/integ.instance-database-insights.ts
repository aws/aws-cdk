import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import {
  DatabaseInstance,
  DatabaseInsightsMode,
  PerformanceInsightRetention,
  PostgresEngineVersion,
  DatabaseInstanceEngine,
} from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

    new DatabaseInstance(this, 'PostgresInstanceAdvanced', {
      engine: DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_16_9 }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.R5, ec2.InstanceSize.LARGE),
      vpc,
      allocatedStorage: 100,
      databaseInsightsMode: DatabaseInsightsMode.ADVANCED,
      performanceInsightRetention: PerformanceInsightRetention.MONTHS_15,
    });

    new DatabaseInstance(this, 'PostgresInstanceStandard', {
      engine: DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_16_9 }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.R5, ec2.InstanceSize.LARGE),
      vpc,
      allocatedStorage: 100,
      databaseInsightsMode: DatabaseInsightsMode.STANDARD,
      enablePerformanceInsights: true,
    });
  }
}

const app = new cdk.App();
const stack = new TestStack(app, 'aws-cdk-rds-integ-instance-database-insights');

new IntegTest(app, 'integ-instance-database-insights', {
  testCases: [stack],
});
