import type {
  AddToResourcePolicyResult,
  IResourcePolicyFactory,
  IResourceWithPolicyV2,
  PolicyStatement,
} from '../../../aws-iam';
import {
  DefaultPolicyFactories,
  PolicyDocument,
} from '../../../aws-iam';
import type { CfnResource } from '../../../core';
import { Token, ValidationError } from '../../../core';
import type { ResourceEnvironment } from '../../../interfaces';
import { CfnKey } from '../kms.generated';

/**
 * Factory to create a resource policy for a KMS Key.
 */
class KeyWithPolicyFactory implements IResourcePolicyFactory {
  public forResource(resource: CfnResource): IResourceWithPolicyV2 {
    if (!CfnKey.isCfnKey(resource)) {
      throw new ValidationError(`Construct ${resource.node.path} is not of type CfnKey`, resource);
    }

    return new CfnKeyWithPolicy(resource);
  }
}

class CfnKeyWithPolicy implements IResourceWithPolicyV2 {
  public readonly env: ResourceEnvironment;
  private policyDocument?: PolicyDocument;

  constructor(private readonly key: CfnKey) {
    this.env = key.env;
  }

  public addToResourcePolicy(statement: PolicyStatement): AddToResourcePolicyResult {
    if (Token.isResolved(this.key.keyPolicy)) {
      if (this.policyDocument == null) {
        this.policyDocument = PolicyDocument.fromJson(this.key.keyPolicy ?? { Statement: [] });
      }

      this.policyDocument.addStatements(statement);
      this.key.keyPolicy = this.policyDocument.toJSON();

      return { statementAdded: true, policyDependable: this.policyDocument };
    }
    return { statementAdded: false };
  }
}

DefaultPolicyFactories.set('AWS::KMS::Key', new KeyWithPolicyFactory());
