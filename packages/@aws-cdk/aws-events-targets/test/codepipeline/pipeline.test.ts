import { expect, haveResource } from '@aws-cdk/assert';
import codepipeline = require('@aws-cdk/aws-codepipeline');
import events = require('@aws-cdk/aws-events');
import { Construct, Stack } from '@aws-cdk/core';
import targets = require('../../lib');

test('use codebuild project as an eventrule target', () => {
  // GIVEN
  const stack = new Stack();
  const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');

  const srcArtifact = new codepipeline.Artifact('Src');
  const buildArtifact = new codepipeline.Artifact('Bld');
  pipeline.addStage({
    stageName: 'Source',
    actions: [new TestAction({
      actionName: 'Hello',
      category: codepipeline.ActionCategory.SOURCE,
      provider: 'x',
      artifactBounds: { minInputs: 0, maxInputs: 0 , minOutputs: 1, maxOutputs: 1, },
      outputs: [srcArtifact]})]
  });
  pipeline.addStage({
    stageName: 'Build',
    actions: [new TestAction({
      actionName: 'Hello',
      category: codepipeline.ActionCategory.BUILD,
      provider: 'y',
      inputs: [srcArtifact],
      outputs: [buildArtifact],
      artifactBounds: { minInputs: 1, maxInputs: 1 , minOutputs: 1, maxOutputs: 1, }})]
  });

  const rule = new events.Rule(stack, 'rule', {
    schedule: events.Schedule.expression('rate(1 minute)'),
  });

  // WHEN
  rule.addTarget(new targets.CodePipeline(pipeline));

  const pipelineArn = {
    "Fn::Join": [ "", [
      "arn:",
      { Ref: "AWS::Partition" },
      ":codepipeline:",
      { Ref: "AWS::Region" },
      ":",
      { Ref: "AWS::AccountId" },
      ":",
      { Ref: "PipelineC660917D" }]
    ]
  };

  // THEN
  expect(stack).to(haveResource('AWS::Events::Rule', {
    Targets: [
      {
        Arn: pipelineArn,
        Id: "Pipeline",
        RoleArn: { "Fn::GetAtt": [ "PipelineEventsRole46BEEA7C", "Arn" ] }
      }
    ]
  }));

  expect(stack).to(haveResource('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: "codepipeline:StartPipelineExecution",
          Effect: "Allow",
          Resource: pipelineArn,
        }
      ],
      Version: "2012-10-17"
    }
  }));
});

class TestAction implements codepipeline.IAction {
  constructor(public readonly actionProperties: codepipeline.ActionProperties) {
    // nothing to do
  }

  public bind(_scope: Construct, _stage: codepipeline.IStage, _options: codepipeline.ActionBindOptions):
      codepipeline.ActionConfig {
    return {};
  }

  public onStateChange(_name: string, _target?: events.IRuleTarget, _options?: events.RuleProps): events.Rule {
    throw new Error('onStateChange() is not available on MockAction');
  }
}
