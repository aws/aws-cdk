import { createHash } from 'crypto';
import * as path from 'path';
import { ArnPrincipal, PolicyStatement, Effect } from '@aws-cdk/aws-iam';
import { CfnKey, IKey } from '@aws-cdk/aws-kms';
import { CfnBucket, IBucket } from '@aws-cdk/aws-s3';
import { CustomResource, CustomResourceProvider, CustomResourceProviderRuntime, Lazy, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnDistribution, Distribution } from '..';

const CUSTOM_RESOURCE_TYPE = 'Custom::CDKCloudFrontDistributionPolicySetter';

function computeStackPairHash(distribution: Distribution, resourceStack: Stack) {
  const uniqueStackPair = `${CUSTOM_RESOURCE_TYPE}|${distribution.stack.stackName}|${resourceStack.stackName}`;
  return createHash('sha256').update(uniqueStackPair).digest('hex').slice(-32);
}

function computePolicySetterTagName(distribution: Distribution, resourceStack: Stack) {
  const uniqueHash = computeStackPairHash(distribution, resourceStack);
  return `aws-cdk:allow-policy-setter:${uniqueHash}`;
}

function computeSafetyCheckTagName(distribution: Distribution, resourceStack: Stack, writeAccess: boolean) {
  // NOTE: This logic must be duplicated exactly in the lamda function implementation.
  // We use a lazy evaluation because we want to defer getLogicalId, in case of renaming.
  return Lazy.string({
    produce: () => {
      let distLogicalId = distribution.stack.getLogicalId(distribution.node.defaultChild as CfnDistribution);
      let verificationText = computeStackPairHash(distribution, resourceStack) + '|' + distLogicalId;
      let verificationHash = createHash('sha256').update(verificationText).digest('hex').slice(-32);
      return `aws-cdk:grant-distribution-${writeAccess ? 'rw' : 'ro'}:${verificationHash}`;
    },
  });
}

function getOrCreateProvider(distribution: Distribution, resourceStack: Stack) {
  const uniqueHash = computeStackPairHash(distribution, resourceStack);
  const providerId = 'PolicySetterProvider' + uniqueHash.toUpperCase();
  const roleParentId = 'PolicySetterRole' + uniqueHash.toUpperCase();

  // Create a unique singleton construct in the resource stack to hold the Lambda
  // execution role, which allows the resource stack to grant permissions to our
  // custom resource function without creating a circular cross-stack dependency.
  let roleParent = resourceStack.node.tryFindChild(roleParentId);
  if (!(roleParent instanceof Construct)) {
    roleParent = new Construct(resourceStack, roleParentId);
  }

  const tagName = computePolicySetterTagName(distribution, resourceStack);
  const conditionStringEquals: any = { };
  conditionStringEquals['aws:ResourceTag/' + tagName] = '1';

  return CustomResourceProvider.getOrCreateProvider(
    distribution.stack,
    providerId,
    {
      codeDirectory: path.join(__dirname, 'distribution-policy-setter-handler'),
      runtime: CustomResourceProviderRuntime.NODEJS_16_X,
      roleParent: roleParent,
      policyStatements: [
        {
          Effect: 'Allow',
          Resource: '*',
          Action: [
            'kms:GetKeyPolicy',
            'kms:PutKeyPolicy',
            'kms:ListResourceTags',
            's3:GetBucketPolicy',
            's3:PutBucketPolicy',
            's3:GetBucketTagging',
          ],
          Condition: { StringEquals: conditionStringEquals },
        },
      ],
    },
  );
}

export class DistributionPolicySetter extends Construct {

  public static configureBucket(scope: Distribution, bucket: IBucket, writeAccess: boolean, invalidatePath?: string): boolean {
    let cfnbucket: CfnBucket;
    if (bucket.node.defaultChild instanceof CfnBucket) {
      cfnbucket = bucket.node.defaultChild as CfnBucket;
    } else if (bucket.node.id.startsWith('@FromCfn') && bucket.node.scope instanceof CfnBucket) {
      cfnbucket = bucket.node.scope as CfnBucket;
    } else {
      return false;
    }

    const tagNameForDistribution = computeSafetyCheckTagName(scope, bucket.stack, writeAccess);
    const tagNameForLambdaPermission = computePolicySetterTagName(scope, bucket.stack);

    if (cfnbucket.tags.tagValues()[tagNameForDistribution]) {
      return true; // already tagged, permissions already granted to this distribution
    }

    // If the necessary cross-resource policy has not already been added, add it.
    const lazyArn = Lazy.string({ produce: () => getOrCreateProvider(scope, bucket.stack).roleArn });
    const added = bucket.addToResourcePolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      principals: [new ArnPrincipal(lazyArn)],
      actions: ['s3:GetBucketPolicy', 's3:PutBucketPolicy'],
      resources: [bucket.bucketArn],
    }));
    if (!added.statementAdded) {
      // This CDK does not own this bucket policy and cannot modify it.
      return false;
    }

    // Configure an invocation of the lambda function to add permissions for the distribution
    const setter = DistributionPolicySetter.getOrCreate(scope, bucket.stack);
    if (writeAccess) {
      setter.readWriteArns.push(bucket.bucketArn);
    } else {
      setter.readOnlyArns.push(bucket.bucketArn);
    }
    if (invalidatePath && !setter.invalidatePaths.includes(invalidatePath)) {
      setter.invalidatePaths.push(invalidatePath);
    }
    setter.node.addDependency(cfnbucket);
    setter.node.addDependency(bucket.policy!);

    // Make sure that the lambda role has permission to access this resource
    cfnbucket.tags.setTag(tagNameForLambdaPermission, '1');

    // Make sure the check-tag is set, or the lambda will refuse to modify the policy
    cfnbucket.tags.setTag(tagNameForDistribution, '1');

    return true;
  };

  public static configureKey(scope: Distribution, key: IKey, writeAccess: boolean, invalidatePath?: string): boolean {
    let cfnkey: CfnKey;
    if (key.node.defaultChild instanceof CfnKey) {
      cfnkey = key.node.defaultChild as CfnKey;
    } else if (key.node.id.startsWith('@FromCfn') && key.node.scope instanceof CfnKey) {
      cfnkey = key.node.scope as CfnKey;
    } else {
      return false;
    }

    const tagNameForDistribution = computeSafetyCheckTagName(scope, key.stack, writeAccess);
    const tagNameForLambdaPermission = computePolicySetterTagName(scope, key.stack);

    if (cfnkey.tags.tagValues()[tagNameForDistribution]) {
      return true; // already tagged, permissions already granted to this distribution
    }

    const lazyArn = Lazy.string({ produce: () => getOrCreateProvider(scope, key.stack).roleArn });
    const added = key.addToResourcePolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      principals: [new ArnPrincipal(lazyArn)],
      actions: ['kms:GetKeyPolicy', 'kms:PutKeyPolicy'],
      resources: ['*'],
    }));
    if (!added.statementAdded) {
      // This CDK does not own this key policy and cannot modify it.
      return false;
    }

    const setter = DistributionPolicySetter.getOrCreate(scope, key.stack);
    if (writeAccess) {
      setter.readWriteArns.push(key.keyArn);
    } else {
      setter.readOnlyArns.push(key.keyArn);
    }
    if (invalidatePath && !setter.invalidatePaths.includes(invalidatePath)) {
      setter.invalidatePaths.push(invalidatePath);
    }
    setter.node.addDependency(cfnkey);

    // Make sure that the lambda role has permission to access this resource
    cfnkey.tags.setTag(tagNameForLambdaPermission, '1');

    // Make sure the check-tag is set, or the lambda will refuse to modify the policy
    cfnkey.tags.setTag(tagNameForDistribution, '1');

    return true;
  };

  protected static getOrCreate(scope: Distribution, resourceStack: Stack) {
    let counter = 1;
    for (const child of scope.node.children) {
      if (child instanceof DistributionPolicySetter) {
        if (child.resourceStack == resourceStack) {
          return child;
        }
        ++counter;
      }
    }
    return new DistributionPolicySetter(scope, 'PolicySetter' + counter, resourceStack);
  }

  private resourceStack : Stack;
  private readOnlyArns : string[];
  private readWriteArns : string[];
  private invalidatePaths: string[];

  private constructor(scope: Distribution, id: string, resourceStack: Stack) {
    super(scope, id);

    this.resourceStack = resourceStack;
    this.readOnlyArns = [];
    this.readWriteArns = [];
    this.invalidatePaths = [];

    const customResource = new CustomResource(this, 'CustomResource', {
      resourceType: CUSTOM_RESOURCE_TYPE,
      serviceToken: getOrCreateProvider(scope, resourceStack).serviceToken,
      properties: {
        distribution: Lazy.string({ produce: () => scope.distributionArn }),
        readOnlyArns: Lazy.list({ produce: () => this.readOnlyArns }),
        readWriteArns: Lazy.list({ produce: () => this.readWriteArns }),
      },
    });
    customResource.node.addDependency(this);
  }
}
