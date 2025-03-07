import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import { ClusterInstance } from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';

export class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const vpc = new Vpc(this, 'Integ-VPC');
    new rds.DatabaseCluster(this, 'Integ-Cluster', {
      engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_3_07_1 }),
      serverlessV2MaxCapacity: 256,
      serverlessV2MinCapacity: 256,
      writer: ClusterInstance.serverlessV2('writer'),
      removalPolicy: RemovalPolicy.DESTROY,
      vpc: vpc,
    });
  }
}

const app = new App();
new IntegTest(app, 'integ-test-acu', {
  testCases: [new TestStack(app, 'integ-aurora-serverlessv2-cluster-acu')],
});
