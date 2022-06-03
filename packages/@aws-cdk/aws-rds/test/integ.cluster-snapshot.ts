import * as path from 'path';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { App, ArnFormat, CustomResource, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';
import * as cr from '@aws-cdk/custom-resources';
import { Construct } from 'constructs';
import * as rds from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2, natGateways: 1 });

    const cluster = new rds.DatabaseCluster(this, 'Cluster', {
      engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_2_10_2 }),
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL),
        vpc,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const snapshoter = new Snapshoter(this, 'Snapshoter', {
      cluster,
      snapshotIdentifier: 'cdk-integ-cluster-snapshot',
    });

    const fromSnapshot = new rds.DatabaseClusterFromSnapshot(this, 'FromSnapshot', {
      snapshotIdentifier: snapshoter.snapshotArn,
      snapshotCredentials: rds.SnapshotCredentials.fromGeneratedSecret('admin'),
      engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_2_10_2 }),
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL),
        vpc,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });
    fromSnapshot.addRotationSingleUser();
  }
}

interface SnapshoterProps {
  readonly cluster: rds.IDatabaseCluster;
  readonly snapshotIdentifier: string;
}

class Snapshoter extends Construct {
  public readonly snapshotArn: string;

  constructor(scope: Construct, id: string, props: SnapshoterProps) {
    super(scope, id);

    const clusterArn = Stack.of(this).formatArn({
      service: 'rds',
      resource: 'cluster',
      resourceName: props.cluster.clusterIdentifier,
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    });

    const snapshotArn = Stack.of(this).formatArn({
      service: 'rds',
      resource: 'cluster-snapshot',
      resourceName: props.snapshotIdentifier,
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    });

    const code = lambda.Code.fromAsset(path.join(__dirname, 'snapshot-handler'));
    const onEventHandler = new lambda.Function(this, 'OnEventHandler', {
      code,
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'index.onEventHandler',
    });
    onEventHandler.addToRolePolicy(new iam.PolicyStatement({
      actions: ['rds:CreateDBClusterSnapshot', 'rds:DeleteDBClusterSnapshot'],
      resources: [clusterArn, snapshotArn],
    }));

    const isCompleteHandler = new lambda.Function(this, 'IsCompleteHandler', {
      code,
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'index.isCompleteHandler',
    });
    isCompleteHandler.addToRolePolicy(new iam.PolicyStatement({
      actions: ['rds:DescribeDBClusterSnapshots'],
      resources: [clusterArn, snapshotArn],
    }));

    const provider = new cr.Provider(this, 'SnapshotProvider', {
      onEventHandler,
      isCompleteHandler,
    });

    const customResource = new CustomResource(this, 'Snapshot', {
      resourceType: 'Custom::Snapshoter',
      serviceToken: provider.serviceToken,
      properties: {
        DBClusterIdentifier: props.cluster.clusterIdentifier,
        DBClusterSnapshotIdentifier: props.snapshotIdentifier,
      },
    });
    this.snapshotArn = customResource.getAttString('DBClusterSnapshotArn');
  }
}

const app = new App();
new TestStack(app, 'cdk-integ-cluster-snapshot');
app.synth();
