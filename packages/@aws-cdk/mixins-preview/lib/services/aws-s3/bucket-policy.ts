import type { IConstruct } from 'constructs/lib/construct';
import { Mixin } from 'aws-cdk-lib/core';
import type { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { PolicyDocument } from 'aws-cdk-lib/aws-iam';
import { CfnBucketPolicy } from 'aws-cdk-lib/aws-s3';

/**
 * Adds statements to a bucket policy
 * @mixin true
 */
export class BucketPolicyStatementsMixin extends Mixin {
  private readonly statements: PolicyStatement[];

  public constructor(statements: PolicyStatement[]) {
    super();
    this.statements = statements;
  }

  public supports(construct: IConstruct): construct is CfnBucketPolicy {
    return CfnBucketPolicy.isCfnBucketPolicy(construct);
  }

  public applyTo(policy: IConstruct): void {
    if (!this.supports(policy)) {
      return;
    }

    const policyDocument = this.getPolicyDocument(policy);
    policyDocument.addStatements(...this.statements);

    policy.policyDocument = policyDocument;
  }

  /**
   * CfnBucketPolicy.policyDocument sometimes is a PolicyDocument object
   * and sometimes is a plain object. We need to handle both cases.
   */
  private getPolicyDocument(policy: CfnBucketPolicy): PolicyDocument {
    if (policy.policyDocument instanceof PolicyDocument) {
      return policy.policyDocument;
    }
    return PolicyDocument.fromJson(policy.policyDocument);
  }
}
