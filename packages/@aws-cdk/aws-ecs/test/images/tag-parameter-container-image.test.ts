import { SynthUtils } from '@aws-cdk/assert';
import * as ecr from '@aws-cdk/aws-ecr';
import * as cdk from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import * as ecs from '../../lib';

nodeunitShim({
  'TagParameter container image': {
    'throws an error when tagParameterName() is used without binding the image'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const repository = new ecr.Repository(stack, 'Repository');
      const tagParameterContainerImage = new ecs.TagParameterContainerImage(repository);
      new cdk.CfnOutput(stack, 'Output', {
        value: tagParameterContainerImage.tagParameterName,
      });

      test.throws(() => {
        SynthUtils.synthesize(stack);
      }, /TagParameterContainerImage must be used in a container definition when using tagParameterName/);

      test.done();
    },

    'throws an error when tagParameterValue() is used without binding the image'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const repository = new ecr.Repository(stack, 'Repository');
      const tagParameterContainerImage = new ecs.TagParameterContainerImage(repository);
      new cdk.CfnOutput(stack, 'Output', {
        value: tagParameterContainerImage.tagParameterValue,
      });

      test.throws(() => {
        SynthUtils.synthesize(stack);
      }, /TagParameterContainerImage must be used in a container definition when using tagParameterValue/);

      test.done();
    },
  },
});
