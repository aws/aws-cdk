import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cr from 'aws-cdk-lib/custom-resources';
import { CustomResource } from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import * as path from 'path';

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
    const fn = new NodejsFunction(this, 'Handler', {
      runtime: Runtime.NODEJS_LATEST,
      handler: 'handler',
      timeout: cdk.Duration.minutes(10),
      entry: path.join(__dirname, 'handler.ts'),
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
