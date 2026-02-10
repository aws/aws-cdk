import type { IConstruct } from 'constructs';
import { CfnTopic, CfnTopicPolicy } from './sns.generated';
import type {
  AddToResourcePolicyResult,
  GrantOnKeyResult,
  IEncryptedResource,
  IEncryptedResourceFactory,
  IGrantable,
  IResourcePolicyFactory,
  IResourceWithPolicyV2,
  PolicyStatement,
} from '../../aws-iam';
import {
  DefaultEncryptedResourceFactories,
  DefaultPolicyFactories,
  PolicyDocument,
} from '../../aws-iam';
import type { CfnKey } from '../../aws-kms';
import { KeyGrants } from '../../aws-kms';
import { Token, ValidationError } from '../../core';
import { findClosestRelatedResource } from '../../core/lib/helpers-internal';
import type { ResourceEnvironment } from '../../interfaces';

/**
 * Factory to create a resource policy for a Topic.
 */
export class TopicWithPolicyFactory implements IResourcePolicyFactory {
  static {
    DefaultPolicyFactories.set('AWS::SNS::Topic', new TopicWithPolicyFactory());
  }

  public forConstruct(resource: IConstruct): IResourceWithPolicyV2 {
    return ifCfnTopic(resource, (r) => new CfnTopicWithPolicy(r));
  }
}

class CfnTopicWithPolicy implements IResourceWithPolicyV2 {
  public readonly env: ResourceEnvironment;
  private policy?: CfnTopicPolicy;

  constructor(private readonly topic: CfnTopic) {
    this.env = topic.env;
  }

  public addToResourcePolicy(statement: PolicyStatement): AddToResourcePolicyResult {
    if (!this.policy) {
      this.policy = new CfnTopicPolicy(this.topic, 'TopicPolicy', {
        topics: [this.topic.ref],
        policyDocument: { Statement: [] },
      });
    }

    if (Token.isResolved(this.policy.policyDocument)) {
      const policyDocument = PolicyDocument.fromJson(this.policy.policyDocument ?? { Statement: [] });
      policyDocument.addStatements(statement);
      this.policy.policyDocument = policyDocument.toJSON();

      return { statementAdded: true, policyDependable: this.policy };
    }
    return { statementAdded: false };
  }
}

/**
 * Factory for creating encrypted SNS Topic wrappers
 */
export class EncryptedTopicFactory implements IEncryptedResourceFactory {
  static {
    DefaultEncryptedResourceFactories.set('AWS::SNS::Topic', new EncryptedTopicFactory());
  }

  public forConstruct(resource: IConstruct): IEncryptedResource {
    return ifCfnTopic(resource, (r) => new EncryptedCfnTopic(r));
  }
}

class EncryptedCfnTopic implements IEncryptedResource {
  public readonly env: ResourceEnvironment;

  constructor(private readonly topic: CfnTopic) {
    this.env = topic.env;
  }

  public grantOnKey(grantee: IGrantable, ...actions: string[]): GrantOnKeyResult {
    const key = tryFindKmsKeyForTopic(this.topic);
    return {
      grant: key ? KeyGrants.fromKey(key).actions(grantee, ...actions) : undefined,
    };
  }
}

function ifCfnTopic<A>(resource: IConstruct, factory: (r: CfnTopic) => A): A {
  if (!CfnTopic.isCfnTopic(resource)) {
    throw new ValidationError(`Construct ${resource.node.path} is not of type CfnTopic`, resource);
  }

  return factory(resource);
}

function tryFindKmsKeyForTopic(topic: CfnTopic): CfnKey | undefined {
  const kmsMasterKeyId = topic.kmsMasterKeyId;
  if (!kmsMasterKeyId) {
    return undefined;
  }
  return findClosestRelatedResource<IConstruct, CfnKey>(
    topic,
    'AWS::KMS::Key',
    (_, key) => key.ref === kmsMasterKeyId || key.attrKeyId === kmsMasterKeyId || key.attrArn === kmsMasterKeyId,
  );
}
