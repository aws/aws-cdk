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
    const model = bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_OPUS_V1_0;

    // WHEN
    new bedrock.ModelAccessValidator(stack, 'TestValidator', {
      model: model,
    });

    // THEN
    const template = Template.fromStack(stack);
    template.hasResource('Custom::ModelAccessValidator', {});
    template.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'index.handler',
      Timeout: 120,
    });
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
    template.resourceCountIs('AWS::Lambda::Function', 0);
  });

  test('grants limited bedrock permissions for foundation model', () => {
    // GIVEN
    const model = bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_OPUS_V1_0;

    // WHEN
    new bedrock.ModelAccessValidator(stack, 'TestValidator', {
      model: model,
    });

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [{
          Effect: 'Allow',
          Action: ['bedrock:InvokeModel*', 'bedrock:GetFoundationModel'],
          Resource: {
            'Fn::Join': [
              '',
              [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':bedrock:',
                { Ref: 'AWS::Region' },
                '::foundation-model/anthropic.claude-3-opus-20240229-v1:0',
              ],
            ],
          },
        }],
        Version: '2012-10-17',
      },
    });
  });

  test('creates separate validators for different foundation models', () => {
    // GIVEN
    const model1 = bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_OPUS_V1_0;
    const model2 = bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_SONNET_V1_0;

    // WHEN
    new bedrock.ModelAccessValidator(stack, 'Validator1', { model: model1 });
    new bedrock.ModelAccessValidator(stack, 'Validator2', { model: model2 });

    // THEN
    const template = Template.fromStack(stack);
    template.resourceCountIs('Custom::ModelAccessValidator', 2);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Effect: 'Allow',
            Action: ['bedrock:InvokeModel*', 'bedrock:GetFoundationModel'],
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':bedrock:',
                  { Ref: 'AWS::Region' },
                  '::foundation-model/anthropic.claude-3-opus-20240229-v1:0',
                ],
              ],
            },
          },
          {
            Effect: 'Allow',
            Action: ['bedrock:InvokeModel*', 'bedrock:GetFoundationModel'],
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':bedrock:',
                  { Ref: 'AWS::Region' },
                  '::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0',
                ],
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('handles cross-region inference profile', () => {
    // GIVEN
    const inferenceProfile = bedrock.CrossRegionInferenceProfile.fromConfig({
      geoRegion: bedrock.CrossRegionInferenceProfileRegion.US,
      model: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_SONNET_V1_0,
    });

    // WHEN
    new bedrock.ModelAccessValidator(stack, 'TestValidator', {
      model: inferenceProfile,
    });

    // THEN
    const template = Template.fromStack(stack);
    template.hasResource('Custom::ModelAccessValidator', {});
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Effect: 'Allow',
            Action: ['bedrock:InvokeModel*', 'bedrock:GetFoundationModel'],
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':bedrock:*::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0',
                ],
              ],
            },
          },
          {
            Effect: 'Allow',
            Action: ['bedrock:GetInferenceProfile', 'bedrock:InvokeModel*'],
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':bedrock:',
                  { Ref: 'AWS::Region' },
                  ':',
                  { Ref: 'AWS::AccountId' },
                  ':inference-profile/us.anthropic.claude-3-sonnet-20240229-v1:0',
                ],
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
    });
  });
});
