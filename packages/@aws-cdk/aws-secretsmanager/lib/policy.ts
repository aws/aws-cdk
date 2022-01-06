import * as iam from '@aws-cdk/aws-iam';
import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { ISecret } from './secret';
import { CfnResourcePolicy } from './secretsmanager.generated';

/**
 * Construction properties for a ResourcePolicy
 */
export interface ResourcePolicyProps {
  /**
   * The secret to attach a resource-based permissions policy
   */
  readonly secret: ISecret;
}

/**
 * Resource Policy for SecretsManager Secrets
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
  public readonly document = new iam.PolicyDocument();

  constructor(scope: Construct, id: string, props: ResourcePolicyProps) {
    super(scope, id);

    new CfnResourcePolicy(this, 'Resource', {
      resourcePolicy: this.document,
      secretId: props.secret.secretArn,
    });
  }
}
