import { expect, haveResourceLike } from '@aws-cdk/assert';
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import codepipeline = require('../lib');

// tslint:disable:object-literal-key-quotes

export = {
  'Pipeline': {
    'can be passed an IAM role during pipeline creation'(test: Test) {
      const stack = new cdk.Stack();
      const role = new iam.Role(stack, 'Role', {
        assumedBy: new iam.ServicePrincipal('codepipeline.amazonaws.com')
      });
      new codepipeline.Pipeline(stack, 'Pipeline', {
        role
      });

      expect(stack, true).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
        "RoleArn": {
          "Fn::GetAtt": [
            "Role1ABCC5F0",
            "Arn",
          ]
        }
      }));

      test.done();
    },

    'can be imported by ARN'(test: Test) {
      const stack = new cdk.Stack();

      const pipeline = codepipeline.Pipeline.fromPipelineArn(stack, 'Pipeline',
        'arn:aws:codepipeline:us-east-1:123456789012:MyPipeline');

      test.equal(pipeline.pipelineArn, 'arn:aws:codepipeline:us-east-1:123456789012:MyPipeline');
      test.equal(pipeline.pipelineName, 'MyPipeline');

      test.done();
    },
  },
};
