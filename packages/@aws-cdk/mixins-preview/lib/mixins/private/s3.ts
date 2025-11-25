import type { IConstruct } from 'constructs/lib/construct';
import { Mixin } from '../../core';
import type { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { PolicyDocument } from 'aws-cdk-lib/aws-iam';
import type { CfnBucketPolicy } from 'aws-cdk-lib/aws-s3';
import { makeIsCfnResource } from './utils';

/**
 * Adds statements to a bucket policy
 * @mixin true
 */
export class BucketPolicyStatementsMixins extends Mixin {
  private readonly statements: PolicyStatement[];

  public constructor(statements: PolicyStatement[]) {
    super();
    this.statements = statements;
  }

  public supports(construct: IConstruct): construct is CfnBucketPolicy {
    return makeIsCfnResource('AWS::S3::BucketPolicy')(construct);
  }

  public applyTo(policy: IConstruct): IConstruct {
    if (!this.supports(policy)) {
      return policy;
    }

    const policyDocument = this.getPolicyDocument(policy);
    policyDocument.addStatements(...this.statements);

    policy.policyDocument = policyDocument;

    return policy;
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
