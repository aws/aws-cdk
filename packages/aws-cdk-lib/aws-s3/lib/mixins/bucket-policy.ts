import type { IConstruct } from 'constructs';
import type { PolicyStatement } from '../../../aws-iam';
import { PolicyDocument } from '../../../aws-iam';
import { Mixin } from '../../../core/lib/mixins';
import { CfnBucketPolicy } from '../s3.generated';

/**
 * Adds statements to a bucket policy.
 */
export class BucketPolicyStatements extends Mixin {
  private readonly statements: PolicyStatement[];

  public constructor(statements: PolicyStatement[]) {
    super();
    this.statements = statements;
  }

  public supports(construct: IConstruct): construct is CfnBucketPolicy {
    return CfnBucketPolicy.isCfnBucketPolicy(construct);
  }

  public applyTo(policy: IConstruct): void {
    if (!this.supports(policy)) return;

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
