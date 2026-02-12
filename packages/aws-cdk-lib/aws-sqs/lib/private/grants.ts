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
import { CfnQueue, CfnQueuePolicy } from '../sqs.generated';

/**
 * Factory to create a resource policy for a Queue.
 */
class QueueWithPolicyFactory implements IResourcePolicyFactory {
  public forResource(resource: CfnResource): IResourceWithPolicyV2 {
    return ifCfnQueue(resource, (r) => new CfnQueueWithPolicy(r));
  }
}

class CfnQueueWithPolicy implements IResourceWithPolicyV2 {
  public readonly env: ResourceEnvironment;
  private policy?: CfnQueuePolicy;
  private policyDocument?: PolicyDocument;

  constructor(private readonly queue: CfnQueue) {
    this.env = queue.env;
  }

  public addToResourcePolicy(statement: PolicyStatement): AddToResourcePolicyResult {
    if (!this.policy) {
      this.policy = new CfnQueuePolicy(this.queue, 'QueuePolicy', {
        queues: [this.queue.ref],
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
 * Factory for creating encrypted SQS Queue wrappers
 */
class EncryptedQueueFactory implements IEncryptedResourceFactory {
  public forResource(resource: CfnResource): IEncryptedResource {
    return ifCfnQueue(resource, (r) => new EncryptedCfnQueue(r));
  }
}

class EncryptedCfnQueue implements IEncryptedResource {
  public readonly env: ResourceEnvironment;

  constructor(private readonly queue: CfnQueue) {
    this.env = queue.env;
  }

  public grantOnKey(grantee: IGrantable, ...actions: string[]): GrantOnKeyResult {
    const key = tryFindKmsKeyForQueue(this.queue);
    return {
      grant: key ? KeyGrants.fromKey(key).actions(grantee, ...actions) : undefined,
    };
  }
}

function ifCfnQueue<A>(resource: IConstruct, factory: (r: CfnQueue) => A): A {
  if (!CfnQueue.isCfnQueue(resource)) {
    throw new ValidationError(`Construct ${resource.node.path} is not of type CfnQueue`, resource);
  }

  return factory(resource);
}

function tryFindKmsKeyForQueue(queue: CfnQueue): CfnKey | undefined {
  const kmsMasterKeyId = queue.kmsMasterKeyId;
  if (!kmsMasterKeyId) {
    return undefined;
  }
  return findClosestRelatedResource<IConstruct, CfnKey>(
    queue,
    'AWS::KMS::Key',
    (_, key) => key.ref === kmsMasterKeyId || key.attrKeyId === kmsMasterKeyId || key.attrArn === kmsMasterKeyId,
  );
}

DefaultPolicyFactories.set('AWS::SQS::Queue', new QueueWithPolicyFactory());
DefaultEncryptedResourceFactories.set('AWS::SQS::Queue', new EncryptedQueueFactory());
