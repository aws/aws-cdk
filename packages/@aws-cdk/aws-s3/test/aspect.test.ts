import '@aws-cdk/assert-internal/jest';
import { SynthUtils } from '@aws-cdk/assert-internal';
import * as cdk from '@aws-cdk/core';
import { IConstruct } from 'constructs';
import * as s3 from '../lib';

describe('aspect', () => {
  test('bucket must have versioning: failure', () => {
    // GIVEN
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'MyBucket');

    // WHEN
    cdk.Aspects.of(stack).add(new BucketVersioningChecker());

    // THEN
    const assembly = SynthUtils.synthesize(stack);
    const errorMessage = assembly.messages.find(m => m.entry.data === 'Bucket versioning is not enabled');
    expect(errorMessage).toBeDefined();


  });

  test('bucket must have versioning: success', () => {
    // GIVEN
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'MyBucket', {
      versioned: true,
    });

    // WHEN
    cdk.Aspects.of(stack).add(new BucketVersioningChecker());

    // THEN
    const assembly = SynthUtils.synthesize(stack);
    expect(assembly.messages.length).toEqual(0);


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
