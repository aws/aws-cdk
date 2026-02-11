import type { IConstruct } from 'constructs';
import { CfnLogGroup, CfnResourcePolicy } from './logs.generated';
import type {
  AddToResourcePolicyResult,
  IResourcePolicyFactory,
  IResourceWithPolicyV2,
  PolicyStatement,
} from '../../aws-iam';
import {
  DefaultPolicyFactories,
  PolicyDocument,
} from '../../aws-iam';
import { Names, ValidationError } from '../../core';
import type { ResourceEnvironment } from '../../interfaces';

/**
 * Factory to create a resource policy for a Bucket.
 */
export class LogGroupWithPolicyFactory implements IResourcePolicyFactory {
  static {
    DefaultPolicyFactories.set('AWS::Logs::LogGroup', new LogGroupWithPolicyFactory());
  }

  public forConstruct(resource: IConstruct): IResourceWithPolicyV2 {
    return ifCfnLogGroup(resource, (r) => new CfnLogGroupWithPolicy(r));
  }
}

class CfnLogGroupWithPolicy implements IResourceWithPolicyV2 {
  public readonly env: ResourceEnvironment;
  private policy?: CfnResourcePolicy;
  private policyDocument?: PolicyDocument;

  constructor(private readonly logGroup: CfnLogGroup) {
    this.env = logGroup.env;
  }

  public addToResourcePolicy(statement: PolicyStatement): AddToResourcePolicyResult {
    if (!this.policy) {
      this.policy = new CfnResourcePolicy(this.logGroup, 'LogGroupPolicy', {
        policyDocument: JSON.stringify({ Statement: [] }),
        policyName: Names.uniqueId(this.logGroup),
      });
    }

    if (!this.policyDocument) {
      this.policyDocument = PolicyDocument.fromJson(JSON.parse(this.policy.policyDocument) ?? { Statement: [] });
    }

    this.policyDocument.addStatements(statement);
    this.policy.policyDocument = JSON.stringify(this.policyDocument.toJSON());

    return { statementAdded: true, policyDependable: this.policy };
  }
}

function ifCfnLogGroup<A>(resource: IConstruct, factory: (r: CfnLogGroup) => A): A {
  if (!CfnLogGroup.isCfnLogGroup(resource)) {
    throw new ValidationError(`Construct ${resource.node.path} is not of type CfnLogGroup`, resource);
  }

  return factory(resource);
}

