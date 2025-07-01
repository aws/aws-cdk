import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import { ArnFormat, CustomResource, Stack } from 'aws-cdk-lib';
import * as cr from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';
import * as rds from 'aws-cdk-lib/aws-rds';

interface ClusterSnapshoterProps {
  readonly cluster: rds.IDatabaseCluster;
  readonly snapshotIdentifier: string;
}

export class ClusterSnapshoter extends Construct {
  public readonly snapshotArn: string;

  constructor(scope: Construct, id: string, props: ClusterSnapshoterProps) {
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

    const code = lambda.Code.fromAsset(path.join(__dirname, 'snapshot-handler'), { exclude: ['*.ts'] });
    const onEventHandler = new lambda.Function(this, 'OnEventHandler', {
      code,
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.onEventHandler',
      initialPolicy: [
        new iam.PolicyStatement({
          actions: ['rds:CreateDBClusterSnapshot', 'rds:AddTagsToResource', 'rds:DeleteDBClusterSnapshot'],
          resources: [clusterArn, snapshotArn],
        }),
      ],
    });

    const isCompleteHandler = new lambda.Function(this, 'IsCompleteHandler', {
      code,
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.isCompleteHandler',
      initialPolicy: [
        new iam.PolicyStatement({
          actions: ['rds:DescribeDBClusterSnapshots'],
          resources: [clusterArn, snapshotArn],
        }),
      ],
    });

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

interface InstanceSnapshoterProps {
  readonly instance: rds.IDatabaseInstance;
  readonly snapshotIdentifier: string;
}

export class InstanceSnapshoter extends Construct {
  public readonly snapshotArn: string;

  constructor(scope: Construct, id: string, props: InstanceSnapshoterProps) {
    super(scope, id);

    const instanceArn = Stack.of(this).formatArn({
      service: 'rds',
      resource: 'db',
      resourceName: props.instance.instanceIdentifier,
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    });

    const snapshotArn = Stack.of(this).formatArn({
      service: 'rds',
      resource: 'snapshot',
      resourceName: props.snapshotIdentifier,
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    });

    const code = lambda.Code.fromAsset(path.join(__dirname, 'instance-snapshot-handler'), { exclude: ['*.ts'] });
    const onEventHandler = new lambda.Function(this, 'OnEventHandler', {
      code,
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.onEventHandler',
      initialPolicy: [
        new iam.PolicyStatement({
          actions: ['rds:CreateDBSnapshot', 'rds:AddTagsToResource', 'rds:DeleteDBSnapshot'],
          resources: [instanceArn, snapshotArn],
        }),
      ],
    });

    const isCompleteHandler = new lambda.Function(this, 'IsCompleteHandler', {
      code,
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.isCompleteHandler',
      initialPolicy: [
        new iam.PolicyStatement({
          actions: ['rds:DescribeDBSnapshots'],
          resources: [instanceArn, snapshotArn],
        }),
      ],
    });

    const provider = new cr.Provider(this, 'SnapshotProvider', {
      onEventHandler,
      isCompleteHandler,
    });

    const customResource = new CustomResource(this, 'Snapshot', {
      resourceType: 'Custom::Snapshoter',
      serviceToken: provider.serviceToken,
      properties: {
        DBInstanceIdentifier: props.instance.instanceIdentifier,
        DBSnapshotIdentifier: props.snapshotIdentifier,
      },
    });
    this.snapshotArn = customResource.getAttString('DBSnapshotArn');
  }
}
