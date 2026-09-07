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
import { DefaultEncryptedResourceFactories, DefaultPolicyFactories } from '../../../aws-iam';
import { KeyGrants } from '../../../aws-kms';
import type { CfnResource, ResourceEnvironment } from '../../../core';
import { ValidationError } from '../../../core';
import { lit } from '../../../core/lib/private/literal-string';
import { BucketReflection } from '../bucket-reflection';
import { BucketPolicyStatements } from '../mixins/bucket-policy';
import { CfnBucket, CfnBucketPolicy } from '../s3.generated';

/**
 * Factory to create an encrypted resource for a Bucket.
 */
class EncryptedBucketFactory implements IEncryptedResourceFactory {
  public forResource(resource: CfnResource): IEncryptedResource {
    return ifCfnBucket(resource, (r) => new EncryptedCfnBucket(r));
  }
}

class EncryptedCfnBucket implements IEncryptedResource {
  public readonly env: ResourceEnvironment;

  constructor(private readonly bucket: CfnBucket) {
    this.env = bucket.env;
  }

  public grantOnKey(grantee: IGrantable, ...actions: string[]): GrantOnKeyResult {
    const key = BucketReflection.of(this.bucket).encryptionKey;
    return {
      grant: key ? KeyGrants.fromKey(key).actions(grantee, ...actions) : undefined,
    };
  }
}

/**
 * Factory to create a resource policy for a Bucket.
 */
class BucketWithPolicyFactory implements IResourcePolicyFactory {
  public forResource(resource: CfnResource): IResourceWithPolicyV2 {
    return ifCfnBucket(resource, (r) => new CfnBucketWithPolicy(r));
  }
}

class CfnBucketWithPolicy implements IResourceWithPolicyV2 {
  public readonly env: ResourceEnvironment;
  private policy?: CfnBucketPolicy;

  constructor(private readonly bucket: CfnBucket) {
    this.env = bucket.env;
  }

  public addToResourcePolicy(statement: PolicyStatement): AddToResourcePolicyResult {
    if (!this.policy) {
      this.policy = BucketReflection.of(this.bucket)?.policy ?? new CfnBucketPolicy(this.bucket, 'S3BucketPolicy', {
        bucket: this.bucket.ref,
        policyDocument: { Statement: [] },
      });
    }

    this.policy.with(new BucketPolicyStatements([statement]));

    return { statementAdded: true, policyDependable: this.policy };
  }
}

function ifCfnBucket<A>(resource: IConstruct, factory: (r: CfnBucket) => A): A {
  if (!CfnBucket.isCfnBucket(resource)) {
    throw new ValidationError(lit`Construct`, `Construct ${resource.node.path} is not of type CfnBucket`, resource);
  }

  return factory(resource);
}

DefaultEncryptedResourceFactories.set('AWS::S3::Bucket', new EncryptedBucketFactory());
DefaultPolicyFactories.set('AWS::S3::Bucket', new BucketWithPolicyFactory());
