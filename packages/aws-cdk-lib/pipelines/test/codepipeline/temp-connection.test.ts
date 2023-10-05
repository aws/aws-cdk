import * as cdk from '../../../core';
import { Stack } from '../../../core';
import { CodeBuildStep, CodePipeline, CodePipelineSource } from '../../../pipelines';

let app: cdk.App = new cdk.App();

const stack = new Stack(app, 'PipeStack', {});

const connectionPipeline = new CodePipeline(stack, 'ConnectionPipeline', {
  pipelineName: 'ConnectionPipeline1',
  synth: new CodeBuildStep('SynthStep1', {
    input: CodePipelineSource.connection('me/rep', 'b1', {
      connectionArn: 'arn:aws:codestar-connections:us-east-1:123456789012:connection/01234567-abcd-12ab-34cdef5678gh',
      actionName: 'branch1',
    }),
    additionalInputs: {
      'source-test-branch': CodePipelineSource.connection('me/rep', 'b2', {
        connectionArn: 'arn:aws:codestar-connections:us-east-1:123456789012:connection/01234568-abcd-12ab-34cdef5678gh',
        actionName: 'branch2',
      }),
      'other-branch': CodePipelineSource.connection('me/rep', 'b3', {
        connectionArn: 'arn:aws:codestar-connections:us-east-1:123456789012:connection/90123456-abcd-12ab-34cdef5678gh',
        actionName: 'branch3',
      }),
    },
    installCommands: [
      'npm install -g aws-cdk',
    ],
    commands: [
      'npm ci',
      'npm run build',
      'cdk synth',
    ],
  }),
});

test('connection synths', () => {
  const assembly = app.synth();
  expect(assembly.stacks.length).toEqual(1);
});
