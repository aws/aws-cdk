import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { BedrockFoundationModel, VectorType } from '../models';

describe('BedrockFoundationModel', () => {
  test('creates model with default properties', () => {
    // GIVEN
    const model = new BedrockFoundationModel('test.model-v1');

    // THEN
    expect(model.modelId).toBe('test.model-v1');
    expect(model.supportsAgents).toBe(false);
    expect(model.supportsCrossRegion).toBe(false);
    expect(model.supportsKnowledgeBase).toBe(false);
    expect(model.vectorDimensions).toBeUndefined();
    expect(model.supportedVectorType).toBeUndefined();
  });

  test('creates model with custom properties', () => {
    // GIVEN
    const model = new BedrockFoundationModel('test.model-v1', {
      supportsAgents: true,
      supportsCrossRegion: true,
      supportsKnowledgeBase: true,
      vectorDimensions: 1024,
      supportedVectorType: [VectorType.FLOATING_POINT, VectorType.BINARY],
    });

    // THEN
    expect(model.modelId).toBe('test.model-v1');
    expect(model.supportsAgents).toBe(true);
    expect(model.supportsCrossRegion).toBe(true);
    expect(model.supportsKnowledgeBase).toBe(true);
    expect(model.vectorDimensions).toBe(1024);
    expect(model.supportedVectorType).toEqual([VectorType.FLOATING_POINT, VectorType.BINARY]);
  });

  test('formats model ARN correctly', () => {
    // GIVEN
    const model = new BedrockFoundationModel('test.model-v1');

    // THEN
    expect(model.asArn()).toMatch(/arn:aws:bedrock:\w+::foundation-model\/test\.model-v1/);
  });

  test('grants invoke permissions', () => {
    // GIVEN
    const stack = new Stack();
    const role = new Role(stack, 'TestRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });
    const model = new BedrockFoundationModel('test.model-v1');

    // WHEN
    model.grantInvoke(role);

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'bedrock:InvokeModel*',
              'bedrock:GetFoundationModel',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':bedrock:',
                  { Ref: 'AWS::Region' },
                  '::foundation-model/test.model-v1',
                ],
              ],
            },
          },
        ],
      },
    });
  });

  test('grants invoke permissions for all regions', () => {
    // GIVEN
    const stack = new Stack();
    const role = new Role(stack, 'TestRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });
    const model = new BedrockFoundationModel('test.model-v1');

    // WHEN
    model.grantInvokeAllRegions(role);

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'bedrock:InvokeModel*',
              'bedrock:GetFoundationModel',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':bedrock:*::foundation-model/test.model-v1',
                ],
              ],
            },
          },
        ],
      },
    });
  });

  test('static model instances are configured correctly', () => {
    // Test a few representative models
    expect(BedrockFoundationModel.AMAZON_TITAN_TEXT_EXPRESS_V1.modelId).toBe('amazon.titan-text-express-v1');
    expect(BedrockFoundationModel.AMAZON_TITAN_TEXT_EXPRESS_V1.supportsAgents).toBe(true);

    expect(BedrockFoundationModel.ANTHROPIC_CLAUDE_V2.modelId).toBe('anthropic.claude-v2');
    expect(BedrockFoundationModel.ANTHROPIC_CLAUDE_V2.supportsAgents).toBe(true);

    expect(BedrockFoundationModel.COHERE_EMBED_ENGLISH_V3.modelId).toBe('cohere.embed-english-v3');
    expect(BedrockFoundationModel.COHERE_EMBED_ENGLISH_V3.supportsKnowledgeBase).toBe(true);
    expect(BedrockFoundationModel.COHERE_EMBED_ENGLISH_V3.vectorDimensions).toBe(1024);
    expect(BedrockFoundationModel.COHERE_EMBED_ENGLISH_V3.supportedVectorType).toEqual([
      VectorType.FLOATING_POINT,
      VectorType.BINARY,
    ]);
  });
});
