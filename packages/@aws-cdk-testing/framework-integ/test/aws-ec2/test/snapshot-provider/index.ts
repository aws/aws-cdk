import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cr from 'aws-cdk-lib/custom-resources';
import { CustomResource } from 'aws-cdk-lib';
import { Construct } from 'constructs';

/**
 * Properties for SnapshotProvider
 */
export interface SnapshotProviderProps {
  /**
   * The availability zone where the temporary volume will be created
   */
  readonly availabilityZone: string;

  /**
   * Size of the temporary volume in GiB
   * @default 1
   */
  readonly volumeSize?: number;

  /**
   * Volume type for the temporary volume
   * @default gp3
   */
  readonly volumeType?: string;
}

/**
 * A construct that creates an EBS snapshot dynamically during stack deployment.
 * 
 * This is useful for integration tests that need a real snapshot ID but cannot
 * hardcode one (since snapshot IDs are region/account-specific).
 * 
 * @example
 * ```typescript
 * const snapshotProvider = new SnapshotProvider(stack, 'SnapshotProvider', {
 *   availabilityZone: stack.availabilityZones[0],
 * });
 * 
 * new ec2.Volume(stack, 'Volume', {
 *   availabilityZone: stack.availabilityZones[0],
 *   snapshotId: snapshotProvider.snapshotId,
 * });
 * ```
 */
export class SnapshotProvider extends Construct {
  /**
   * The ID of the created snapshot
   */
  public readonly snapshotId: string;

  constructor(scope: Construct, id: string, props: SnapshotProviderProps) {
    super(scope, id);

    const volumeSize = props.volumeSize ?? 1;
    const volumeType = props.volumeType ?? 'gp3';

    // Lambda function that creates a volume, snapshots it, and cleans up the volume
    const fn = new lambda.Function(this, 'Handler', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      timeout: cdk.Duration.minutes(10),
      code: lambda.Code.fromInline(`
const { EC2Client, CreateVolumeCommand, CreateSnapshotCommand, DeleteVolumeCommand, DeleteSnapshotCommand, DescribeSnapshotsCommand, DescribeVolumesCommand } = require('@aws-sdk/client-ec2');
const ec2 = new EC2Client();
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  // On DELETE, clean up the snapshot created during CREATE
  if (event.RequestType === 'Delete') {
    const snapshotId = event.PhysicalResourceId;
    try {
      console.log('Deleting snapshot:', snapshotId);
      await ec2.send(new DeleteSnapshotCommand({ SnapshotId: snapshotId }));
      console.log('Snapshot deleted successfully');
    } catch (e) {
      // Ignore errors - snapshot may have been manually deleted
      console.log('Error deleting snapshot (may already be deleted):', e.message);
    }
    return { PhysicalResourceId: snapshotId };
  }

  // Extract properties passed from CloudFormation
  const az = event.ResourceProperties.AvailabilityZone;
  const size = parseInt(event.ResourceProperties.VolumeSize);
  const volumeType = event.ResourceProperties.VolumeType;

  // Step 1: Create a temporary EBS volume
  console.log(\`Creating volume: AZ=\${az}, Size=\${size}GiB, Type=\${volumeType}\`);
  const vol = await ec2.send(new CreateVolumeCommand({
    AvailabilityZone: az,
    Size: size,
    VolumeType: volumeType,
  }));
  console.log('Volume created:', vol.VolumeId);

  // Step 2: Wait for volume to become available (required before snapshotting)
  console.log('Waiting for volume to become available...');
  for (let i = 0; i < 60; i++) {
    const desc = await ec2.send(new DescribeVolumesCommand({ VolumeIds: [vol.VolumeId] }));
    const state = desc.Volumes[0].State;
    console.log(\`Volume state: \${state}\`);
    if (state === 'available') break;
    if (i === 59) throw new Error('Volume did not become available within 5 minutes');
    await sleep(5000); // Poll every 5 seconds
  }

  // Step 3: Create snapshot from the volume
  console.log('Creating snapshot from volume:', vol.VolumeId);
  const snap = await ec2.send(new CreateSnapshotCommand({ VolumeId: vol.VolumeId }));
  console.log('Snapshot created:', snap.SnapshotId);

  // Step 4: Wait for snapshot to complete (snapshots are created asynchronously)
  console.log('Waiting for snapshot to complete...');
  for (let i = 0; i < 60; i++) {
    const desc = await ec2.send(new DescribeSnapshotsCommand({ SnapshotIds: [snap.SnapshotId] }));
    const state = desc.Snapshots[0].State;
    const progress = desc.Snapshots[0].Progress;
    console.log(\`Snapshot state: \${state}, Progress: \${progress}\`);
    if (state === 'completed') break;
    if (i === 59) throw new Error('Snapshot did not complete within 10 minutes');
    await sleep(10000); // Poll every 10 seconds
  }

  // Step 5: Delete the temporary volume (snapshot persists independently)
  console.log('Deleting temporary volume:', vol.VolumeId);
  await ec2.send(new DeleteVolumeCommand({ VolumeId: vol.VolumeId }));
  console.log('Volume deleted successfully');

  // Return the snapshot ID as both PhysicalResourceId and in Data attributes
  // PhysicalResourceId is used for DELETE operations
  // Data.SnapshotId is accessible via Fn::GetAtt in CloudFormation
  return {
    PhysicalResourceId: snap.SnapshotId,
    Data: { SnapshotId: snap.SnapshotId },
  };
};
`),
    });

    // Grant permissions to create/delete volumes and snapshots
    fn.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'ec2:CreateVolume',
        'ec2:DeleteVolume',
        'ec2:CreateSnapshot',
        'ec2:DeleteSnapshot',
        'ec2:DescribeSnapshots',
        'ec2:DescribeVolumes',
      ],
      resources: ['*'],
    }));

    // Create custom resource provider
    const provider = new cr.Provider(this, 'Provider', {
      onEventHandler: fn,
    });

    // Create the custom resource
    const resource = new CustomResource(this, 'Resource', {
      serviceToken: provider.serviceToken,
      properties: {
        AvailabilityZone: props.availabilityZone,
        VolumeSize: volumeSize.toString(),
        VolumeType: volumeType,
      },
    });

    this.snapshotId = resource.getAttString('SnapshotId');
  }
}
