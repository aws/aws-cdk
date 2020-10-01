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
 * Secret Resource Policy
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
