import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as rds from 'aws-cdk-lib/aws-rds';
import { ClusterInstance } from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { ClusterSnapshoter } from './snapshoter';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2, natGateways: 1, restrictDefaultSecurityGroup: false });

    const instanceProps = {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
      isFromLegacyInstanceProps: true,
    };
    const cluster = new rds.DatabaseCluster(this, 'Cluster', {
      engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_3_04_0 }),
      writer: ClusterInstance.provisioned('Instance1', {
        ...instanceProps,
      }),
      readers: [
        ClusterInstance.provisioned('Instance2', {
          ...instanceProps,
        }),
      ],
      vpc,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const snapshoter = new ClusterSnapshoter(this, 'Snapshoter', {
      cluster,
      snapshotIdentifier: 'cdk-integ-cluster-snapshot',
    });

    const fromSnapshot = new rds.DatabaseClusterFromSnapshot(this, 'FromSnapshot', {
      snapshotIdentifier: snapshoter.snapshotArn,
      snapshotCredentials: rds.SnapshotCredentials.fromGeneratedSecret('admin'),
      engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_3_04_0 }),
      writer: ClusterInstance.provisioned('Instance1', {
        ...instanceProps,
      }),
      readers: [
        ClusterInstance.provisioned('Instance2', {
          ...instanceProps,
        }),
      ],
      vpc,
      removalPolicy: RemovalPolicy.DESTROY,
    });
    fromSnapshot.addRotationSingleUser();
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});
const stack = new TestStack(app, 'cdk-integ-cluster-snapshot');

new IntegTest(app, 'ClusterSnapshotInteg', {
  testCases: [stack],
  diffAssets: true,
});
