import { Annotations } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import { IConstruct } from 'constructs';
import * as s3 from '../lib';

describe('aspect', () => {
  test('bucket must have versioning: failure', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app);
    new s3.Bucket(stack, 'MyBucket');

    // WHEN
    cdk.Aspects.of(stack).add(new BucketVersioningChecker());

    // THEN
    Annotations.fromStack(stack).hasError('/Default/MyBucket/Resource', 'Bucket versioning is not enabled');
  });

  test('bucket must have versioning: success', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app);
    new s3.Bucket(stack, 'MyBucket', {
      versioned: true,
    });

    // WHEN
    cdk.Aspects.of(stack).add(new BucketVersioningChecker());

    // THEN
    Annotations.fromStack(stack).hasNoError('/Default/MyBucket/Resource', 'Bucket versioning is not enabled');
  });
});

class BucketVersioningChecker implements cdk.IAspect {
  public visit(node: IConstruct): void {
    if (node instanceof s3.CfnBucket) {
      if (!node.versioningConfiguration ||
        (!cdk.Tokenization.isResolvable(node.versioningConfiguration) && node.versioningConfiguration.status !== 'Enabled')) {
        cdk.Annotations.of(node).addError('Bucket versioning is not enabled');
      }
    }
  }
}
