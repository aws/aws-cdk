import { expect, haveResourceLike } from '@aws-cdk/assert';
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import codepipeline = require('../lib');
import { FakeBuildAction } from './fake-build-action';
import { FakeSourceAction } from './fake-source-action';

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

    'that is cross-account': {
      'does not allow passing a dynamic value in the Action account property'(test: Test) {
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'PipelineStack', { env: { account: '123456789012' }});
        const sourceOutput = new codepipeline.Artifact();
        const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
          stages: [
            {
              stageName: 'Source',
              actions: [new FakeSourceAction({ actionName: 'Source', output: sourceOutput })],
            },
          ],
        });
        const buildStage = pipeline.addStage({ stageName: 'Build' });

        test.throws(() => {
          buildStage.addAction(new FakeBuildAction({
            actionName: 'FakeBuild',
            input: sourceOutput,
            account: cdk.Aws.ACCOUNT_ID,
          }));
        }, /The 'account' property must be a concrete value \(action: 'FakeBuild'\)/);

        test.done();
      },

      'does not allow an env-agnostic Pipeline Stack if an Action account has been provided'(test: Test) {
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'PipelineStack');
        const sourceOutput = new codepipeline.Artifact();
        const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
          stages: [
            {
              stageName: 'Source',
              actions: [new FakeSourceAction({ actionName: 'Source', output: sourceOutput })],
            },
          ],
        });
        const buildStage = pipeline.addStage({ stageName: 'Build' });

        test.throws(() => {
          buildStage.addAction(new FakeBuildAction({
            actionName: 'FakeBuild',
            input: sourceOutput,
            account: '123456789012',
          }));
        }, /Pipeline stack which uses cross-environment actions must have an explicitly set account/);

        test.done();
      },
    },
  },
};
