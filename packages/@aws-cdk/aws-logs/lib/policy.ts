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
  readonly policyName?: string;

  /**
   * Initial statements to add to the resource policy
   *
   * @default - No statements
   */
  readonly policyStatements?: PolicyStatement[];
}

/**
 * Creates Cloudwatch log group resource policies
 */
export class ResourcePolicy extends Resource {
  /**
   * The IAM policy document for this resource policy.
   */
  public readonly document = new PolicyDocument();

  constructor(scope: Construct, id: string, props?: ResourcePolicyProps) {
    super(scope, id);
    new CfnResourcePolicy(this, 'Resource', {
      policyName: Lazy.string({
        produce: () => props?.policyName ?? Names.uniqueId(this),
      }),
      policyDocument: Lazy.string({
        produce: () => JSON.stringify(this.document),
      }),
    });
    if (props?.policyStatements) {
      this.document.addStatements(...props.policyStatements);
    }
  }
}
