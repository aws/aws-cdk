import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import { ClusterInstance } from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';

interface TestCaseProps extends Pick<rds.DatabaseClusterProps, 'writer' | 'readers' | 'vpc' | 'vpcSubnets'> {
}

class TestCase extends Construct {
  constructor(scope: Construct, id: string, props: TestCaseProps) {
    super(scope, id);
    const cluster = new rds.DatabaseCluster(this, 'Integ-Cluster', {
      engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_3_03_0 }),
      writer: props.writer,
      readers: props.readers,
      removalPolicy: RemovalPolicy.DESTROY,
      vpc: props.vpc,
      vpcSubnets: props.vpcSubnets,
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
      new TestCase(this, `integ-aurora-serverlessv2-${i}`, {
        ...p,
        vpc,
        vpcSubnets: {
          subnetType: SubnetType.PUBLIC,
        },
      }),
    );
  }
}

const app = new App();
new IntegTest(app, 'integ-test', {
  testCases: [new TestStack(app, 'integ-aurora-pub-sn-cluster')],
});
