import type { IConstruct } from 'constructs';
import type {
  AddToResourcePolicyResult,
  GrantOnKeyResult,
  IEncryptedResource,
  IEncryptedResourceFactory,
  IGrantable,
  IResourcePolicyFactory,
  IResourceWithPolicyV2,
  PolicyStatement,
} from '../../../aws-iam';
import { DefaultEncryptedResourceFactories, DefaultPolicyFactories, PolicyDocument } from '../../../aws-iam';
import type { CfnKey } from '../../../aws-kms';
import { KeyGrants } from '../../../aws-kms';
import type { CfnResource } from '../../../core';
import { ValidationError } from '../../../core';
import { findClosestRelatedResource } from '../../../core/lib/helpers-internal';
import type { ResourceEnvironment } from '../../../interfaces';
import { CfnTopic, CfnTopicPolicy } from '../sns.generated';

/**
 * Factory to create a resource policy for a Topic.
 */
class TopicWithPolicyFactory implements IResourcePolicyFactory {
  public forResource(resource: CfnResource): IResourceWithPolicyV2 {
    return ifCfnTopic(resource, (r) => new CfnTopicWithPolicy(r));
  }
}

class CfnTopicWithPolicy implements IResourceWithPolicyV2 {
  public readonly env: ResourceEnvironment;
  private policy?: CfnTopicPolicy;
  private policyDocument?: PolicyDocument;

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

    if (!this.policyDocument) {
      this.policyDocument = PolicyDocument.fromJson(this.policy.policyDocument ?? { Statement: [] });
    }

    this.policyDocument.addStatements(statement);
    this.policy.policyDocument = this.policyDocument.toJSON();

    return { statementAdded: true, policyDependable: this.policy };
  }
}

/**
 * Factory for creating encrypted SNS Topic wrappers
 */
class EncryptedTopicFactory implements IEncryptedResourceFactory {
  public forResource(resource: CfnResource): IEncryptedResource {
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

DefaultPolicyFactories.set('AWS::SNS::Topic', new TopicWithPolicyFactory());
DefaultEncryptedResourceFactories.set('AWS::SNS::Topic', new EncryptedTopicFactory());
