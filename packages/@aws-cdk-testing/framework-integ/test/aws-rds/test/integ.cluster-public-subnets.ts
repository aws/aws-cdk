import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { INTEG_TEST_LATEST_AURORA_MYSQL } from './db-versions';
import type { StackProps } from 'aws-cdk-lib';
import { App } from 'aws-cdk-lib';
import { SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import { ClusterInstance } from 'aws-cdk-lib/aws-rds';
import type { Construct } from 'constructs';
import { IntegTestBaseStack } from './integ-test-base-stack';

interface TestCaseProps extends Pick<rds.DatabaseClusterProps, 'writer'> { }

const testCases: TestCaseProps[] = [
  {
    writer: ClusterInstance.serverlessV2('writer'),
  },
  {
    writer: ClusterInstance.serverlessV2('writer', {
      publiclyAccessible: true,
    }),
  },
  {
    writer: ClusterInstance.serverlessV2('writer', {
      publiclyAccessible: false,
    }),
  },
];

export class TestStack extends IntegTestBaseStack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const vpc = new Vpc(this, 'Integ-VPC');

    testCases.forEach((p: TestCaseProps, i) =>
      new rds.DatabaseCluster(this, `Integ-Cluster-${i}`, {
        engine: rds.DatabaseClusterEngine.auroraMysql({ version: INTEG_TEST_LATEST_AURORA_MYSQL }),
        writer: p.writer,
        vpc,
        vpcSubnets: {
          subnetType: SubnetType.PUBLIC,
        },
      }));
  }
}

const app = new App();

const stack = new TestStack(app, 'integ-aurora-pub-sn-cluster');

new IntegTest(app, 'test-aurora-pub-sn-cluster', {
  testCases: [stack],
});

