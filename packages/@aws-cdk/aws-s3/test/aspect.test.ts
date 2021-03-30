// import { expect, haveResource, haveResourceLike, SynthUtils } from '@aws-cdk/assert-internal';
import { SynthUtils } from '@aws-cdk/assert-internal';
import * as cdk from '@aws-cdk/core';
import { IConstruct } from 'constructs';
import { nodeunitShim, Test } from 'nodeunit-shim';
import * as s3 from '../lib';

nodeunitShim({
  'bucket must have versioning: failure'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'MyBucket');

    // WHEN
    cdk.Aspects.of(stack).add(new BucketVersioningChecker());

    // THEN
    const assembly = SynthUtils.synthesize(stack);
    const errorMessage = assembly.messages.find(m => m.entry.data === 'Bucket versioning is not enabled');
    test.ok(errorMessage, 'Error message not reported');

    test.done();
  },

  'bucket must have versioning: success'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'MyBucket', {
      versioned: true,
    });

    // WHEN
    cdk.Aspects.of(stack).add(new BucketVersioningChecker());

    // THEN
    const assembly = SynthUtils.synthesize(stack);
    test.deepEqual(assembly.messages, []);

    test.done();
  },
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
