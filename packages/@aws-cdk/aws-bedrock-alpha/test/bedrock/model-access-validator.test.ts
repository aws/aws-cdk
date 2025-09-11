import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as bedrock from '../../bedrock';

describe('ModelAccessValidator', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack');
  });

  test('creates custom resource for model validation', () => {
    // GIVEN
    const model: bedrock.IBedrockInvokable = {
      invokableArn: 'arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-opus-20240229-v1:0',
      grantInvoke: () => ({} as any),
    };

    // WHEN
    new bedrock.ModelAccessValidator(stack, 'TestValidator', {
      model: model,
    });

    // THEN
    const template = Template.fromStack(stack);
    template.resourceCountIs('Custom::ModelAccessValidator', 1);
  });

  test('skips validation when validateOnDeploy is false', () => {
    // GIVEN
    const model = bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_OPUS_V1_0;

    // WHEN
    new bedrock.ModelAccessValidator(stack, 'TestValidator', {
      model: model,
      validateOnDeploy: false,
    });

    // THEN
    const template = Template.fromStack(stack);
    template.resourceCountIs('Custom::ModelAccessValidator', 0);
  });
});
