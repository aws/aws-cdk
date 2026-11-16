import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Duration } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import { ClusterInstance } from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';
import { INTEG_TEST_LATEST_AURORA_MYSQL } from './db-versions';
import { IntegTestBaseStack } from './integ-test-base-stack';

interface TestCaseProps extends Pick<rds.DatabaseClusterProps, 'writer' | 'readers' | 'vpc'> {
}

class TestCase extends Construct {
  constructor(scope: Construct, id: string, props: TestCaseProps) {
    super(scope, id);
    const cluster = new rds.DatabaseCluster(this, 'Integ-Cluster', {
      engine: rds.DatabaseClusterEngine.auroraMysql({ version: INTEG_TEST_LATEST_AURORA_MYSQL }),
      writer: props.writer,
      readers: props.readers,
      vpc: props.vpc,
    });
    cluster.metricServerlessDatabaseCapacity({
      period: Duration.minutes(10),
    }).createAlarm(this, 'capacity', {
      threshold: 1.5,
      evaluationPeriods: 3,
    });
    cluster.metricACUUtilization({
      period: Duration.minutes(10),
    }).createAlarm(this, 'alarm', {
      evaluationPeriods: 3,
      threshold: 90,
    });
  }
}

const testCases: TestCaseProps[] = [
  {
    writer: ClusterInstance.serverlessV2('writer'),
  },
  {
    writer: ClusterInstance.provisioned('writer'),
    readers: [
      ClusterInstance.serverlessV2('FailoverReader', { scaleWithWriter: true }),
      ClusterInstance.serverlessV2('OtherReader'),
    ],
  },
  {
    writer: ClusterInstance.serverlessV2('writer'),
    readers: [
      ClusterInstance.provisioned('FailoverReader', { promotionTier: 1 }),
      ClusterInstance.serverlessV2('OtherReader'),
    ],
  },
];

export class TestStack extends IntegTestBaseStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const vpc = new Vpc(this, 'Integ-VPC');
    testCases.forEach((p: TestCaseProps, i) =>
      new TestCase(this, `integ-aurora-serverlessv2-${i}`, {
        ...p,
        vpc,
      }),
    );
  }
}

const app = new App();
new IntegTest(app, 'integ-test', {
  testCases: [new TestStack(app, 'integ-aurora-serverlessv2-cluster')],
});
