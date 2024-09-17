import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import { ClusterInstance } from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';

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

export class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const vpc = new Vpc(this, 'Integ-VPC');

    testCases.forEach((p: TestCaseProps, i) =>
      new rds.DatabaseCluster(this, `Integ-Cluster-${i}`, {
        engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_3_07_1 }),
        writer: p.writer,
        removalPolicy: RemovalPolicy.DESTROY,
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

app.synth();
