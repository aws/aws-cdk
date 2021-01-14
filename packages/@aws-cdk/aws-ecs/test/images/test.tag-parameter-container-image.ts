import { SynthUtils } from '@aws-cdk/assert';
import * as ecr from '@aws-cdk/aws-ecr';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as ecs from '../../lib';

export = {
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
  },
};
