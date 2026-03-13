import { Resource } from 'aws-cdk-lib';
import { PolicyDocument } from 'aws-cdk-lib/aws-iam';
import { CfnChannelPolicy } from 'aws-cdk-lib/aws-mediapackagev2';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type { Construct } from 'constructs';
import type { IChannel } from './channel';

/**
 * Properties for the Channel Policy
 */
export interface ChannelPolicyProps {
  /**
   * Channel to apply the Channel Policy to.
   */
  readonly channel: IChannel;
}

/**
 * The channel policy for an AWS Elemental MediaPackage V2 channel
 *
 * Policies define the operations that are allowed on this resource.
 *
 * You almost never need to define this construct directly.
 *
 * All AWS resources that support resource policies have a method called
 * `addToResourcePolicy()`, which will automatically create a new resource
 * policy if one doesn't exist yet, otherwise it will add to the existing
 * policy.
 *
 * The channel policy method is implemented differently than `addToResourcePolicy()`
 * as `ChannelPolicy` creates a new policy without knowing one earlier existed.
 * This will cause a resource conflict if both are invoked (or even multiple channel
 * policies are defined), so care is to be taken to ensure only 1 channel policy
 * is created per channel.
 *
 * Hence it's strongly recommended to use `addToResourcePolicy()`.
 */
@propertyInjectable
export class ChannelPolicy extends Resource {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-mediapackagev2-alpha.ChannelPolicy';

  /**
   * A policy document containing permissions to add to the specified channel.
   */
  public readonly document = new PolicyDocument({
    statements: [],
  });

  constructor(scope: Construct, id: string, props: ChannelPolicyProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    new CfnChannelPolicy(this, 'Resource', {
      channelGroupName: props.channel.channelGroupName,
      channelName: props.channel.channelName,
      policy: this.document,
    });
  }
}
