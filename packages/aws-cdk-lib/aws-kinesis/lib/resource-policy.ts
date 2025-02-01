import { Construct } from 'constructs';
import { CfnResourcePolicy } from './kinesis.generated';
import { IStream } from './stream';
import { PolicyDocument } from '../../aws-iam';
import { Resource } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';

/**
 * Properties to associate a data stream with a policy
 */
export interface ResourcePolicyProps {
  /**
   * The stream this policy applies to.
   */
  readonly stream: IStream;

  /**
   * IAM policy document to apply to a data stream.
   *
   * @default - empty policy document
   */
  readonly policyDocument?: PolicyDocument;
}

/**
 * The policy for a data stream or registered consumer.
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
 * Prefer to use `addToResourcePolicy()` instead.
 */
export class ResourcePolicy extends Resource {
  /**
   * The IAM policy document for this policy.
   */
  public readonly document = new PolicyDocument();

  constructor(scope: Construct, id: string, props: ResourcePolicyProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.document = props.policyDocument ?? this.document;

    new CfnResourcePolicy(this, 'Resource', {
      resourcePolicy: this.document,
      resourceArn: props.stream.streamArn,
    });
  }
}
