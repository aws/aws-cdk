// import { expect, haveResource, haveResourceLike, SynthUtils } from '@aws-cdk/assert';
import { SynthUtils } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as s3 from '../lib';

export = {
  'bucket must have versioning: failure'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'MyBucket');

    // WHEN
    stack.node.applyAspect(new BucketVersioningChecker());

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
      versioned: true
    });

    // WHEN
    stack.node.applyAspect(new BucketVersioningChecker());

    // THEN
    const assembly = SynthUtils.synthesize(stack);
    test.deepEqual(assembly.messages, []);

    test.done();
  },
};

class BucketVersioningChecker implements cdk.IAspect {
  public visit(node: cdk.IConstruct): void {
    if (node instanceof s3.CfnBucket) {
      if (!node.versioningConfiguration ||
        (!cdk.Tokenization.isResolvable(node.versioningConfiguration) && node.versioningConfiguration.status !== 'Enabled')) {
        node.node.addError('Bucket versioning is not enabled');
      }
    }
  }
}
