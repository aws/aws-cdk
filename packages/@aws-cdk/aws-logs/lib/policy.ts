import { PolicyDocument, PolicyStatement } from '@aws-cdk/aws-iam';
import { Resource, Lazy, Names } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnResourcePolicy } from './logs.generated';

/**
 * Properties to define Cloudwatch log group resource policy
 */
export interface ResourcePolicyProps {
  /**
   * Name of the log group resource policy
   * @default - Uses a unique id based on the construct path
   */
  readonly resourcePolicyName?: string;

  /**
   * Initial statements to add to the resource policy
   *
   * @default - No statements
   */
  readonly policyStatements?: PolicyStatement[];
}

/**
 * Resource Policy for CloudWatch Log Groups
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
   * The IAM policy document for this resource policy.
   */
  public readonly document = new PolicyDocument();

  constructor(scope: Construct, id: string, props?: ResourcePolicyProps) {
    super(scope, id, {
      physicalName: props?.resourcePolicyName,
    });

    const l1 = new CfnResourcePolicy(this, 'ResourcePolicy', {
      policyName: Lazy.string({
        produce: () => props?.resourcePolicyName ?? Names.uniqueId(this),
      }),
      policyDocument: Lazy.string({
        produce: () => JSON.stringify(this.document),
      }),
    });

    this.node.defaultChild = l1;

    if (props?.policyStatements) {
      this.document.addStatements(...props.policyStatements);
    }
  }
}
