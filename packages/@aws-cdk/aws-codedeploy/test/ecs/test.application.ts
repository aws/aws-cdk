import { expect, haveResource } from '@aws-cdk/assert-internal';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as codedeploy from '../../lib';

export = {
  'CodeDeploy ECS Application': {
    'can be created'(test: Test) {
      const stack = new cdk.Stack();
      new codedeploy.EcsApplication(stack, 'MyApp');

      expect(stack).to(haveResource('AWS::CodeDeploy::Application', {
        ComputePlatform: 'ECS',
      }));

      test.done();
    },

    'can be created with explicit name'(test: Test) {
      const stack = new cdk.Stack();
      new codedeploy.EcsApplication(stack, 'MyApp', {
        applicationName: 'my-name',
      });

      expect(stack).to(haveResource('AWS::CodeDeploy::Application', {
        ApplicationName: 'my-name',
        ComputePlatform: 'ECS',
      }));

      test.done();
    },
  },
};
