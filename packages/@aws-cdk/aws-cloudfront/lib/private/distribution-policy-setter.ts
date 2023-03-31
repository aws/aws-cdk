import * as path from 'path';
import { ArnPrincipal, PolicyStatement, Effect } from '@aws-cdk/aws-iam';
import { IKey } from '@aws-cdk/aws-kms';
import { IBucket } from '@aws-cdk/aws-s3';
import { CustomResource, CustomResourceProvider, CustomResourceProviderRuntime, Lazy, Resource, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Distribution } from '..';

const POLICY_SETTER_RESOURCE_TYPE = 'Custom::CDKCloudFrontDistributionPolicySetter';

function getOrCreateProvider(scope: Construct) {
  const uniqueId = 'PolicySetterProvider1eb96ce4e233406d91df225115785bdc';
  return CustomResourceProvider.getOrCreateProvider(scope, uniqueId, {
    codeDirectory: path.join(__dirname, 'distribution-policy-setter-handler'),
    runtime: CustomResourceProviderRuntime.NODEJS_16_X,
    policyStatements: [
      {
        Effect: 'Allow',
        Resource: '*',
        Action: [
          'kms:GetKeyPolicy',
          'kms:PutKeyPolicy',
          's3:GetBucketPolicy',
          's3:PutBucketPolicy',
        ],
      },
    ],
  });
}

export class DistributionPolicySetter extends Construct {

  public static configureBucket(scope: Distribution, bucket: IBucket, writeAccess: boolean): boolean {
    if (!Resource.isOwnedResource(bucket)) {
      return false;
    }

    const provider = getOrCreateProvider(bucket);
    const added = bucket.addToResourcePolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      principals: [new ArnPrincipal(provider.roleArn)],
      actions: ['s3:GetBucketPolicy', 's3:PutBucketPolicy'],
      resources: [bucket.bucketArn],
    }));
    if (!added.statementAdded) {
      return false;
    }

    const setter = DistributionPolicySetter.getOrCreate(scope, bucket.stack);
    if (writeAccess) {
      setter.readWriteArns.push(bucket.bucketArn);
    } else {
      setter.readOnlyArns.push(bucket.bucketArn);
    }
    setter.node.addDependency(bucket);
    if (bucket.policy) {
      setter.node.addDependency(bucket.policy);
    }
    return true;
  };

  public static configureKey(scope: Distribution, key: IKey, writeAccess: boolean): boolean {
    if (!Resource.isOwnedResource(key)) {
      return false;
    }

    const provider = getOrCreateProvider(key);
    const added = key.addToResourcePolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      principals: [new ArnPrincipal(provider.roleArn)],
      actions: ['kms:GetKeyPolicy', 'kms:PutKeyPolicy'],
      resources: ['*'],
    }));
    if (!added.statementAdded) {
      return false;
    }

    const setter = DistributionPolicySetter.getOrCreate(scope, key.stack);
    if (writeAccess) {
      setter.readWriteArns.push(key.keyArn);
    } else {
      setter.readOnlyArns.push(key.keyArn);
    }
    setter.node.addDependency(key);
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

  private constructor(scope: Distribution, id: string, resourceStack: Stack) {
    super(scope, id);

    this.resourceStack = resourceStack;
    this.readOnlyArns = [];
    this.readWriteArns = [];

    const customResource = new CustomResource(this, 'CustomResource', {
      resourceType: POLICY_SETTER_RESOURCE_TYPE,
      serviceToken: getOrCreateProvider(resourceStack).serviceToken,
      properties: {
        distribution: Lazy.string({ produce: () => scope.distributionArn }),
        readOnlyArns: Lazy.list({ produce: () => this.readOnlyArns }),
        readWriteArns: Lazy.list({ produce: () => this.readWriteArns }),
      },
    });
    customResource.node.addDependency(this);
  }
}
