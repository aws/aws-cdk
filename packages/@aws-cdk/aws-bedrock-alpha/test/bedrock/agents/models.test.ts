import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { FoundationModel, FoundationModelIdentifier } from 'aws-cdk-lib/aws-bedrock';
import { BedrockFoundationModel, VectorType } from '../../../bedrock/models';

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

  test('toString returns modelId', () => {
    // GIVEN
    const model = new BedrockFoundationModel('test.model-v1');

    // THEN
    expect(model.toString()).toBe('test.model-v1');
  });

  test('asIModel returns self', () => {
    // GIVEN
    const model = new BedrockFoundationModel('test.model-v1');

    // THEN
    expect(model.asIModel()).toBe(model);
  });

  test('fromCdkFoundationModelId creates model correctly', () => {
    // GIVEN
    const modelId = new FoundationModelIdentifier('test.model-v1');

    // WHEN
    const model = BedrockFoundationModel.fromCdkFoundationModelId(modelId, {
      supportsAgents: true,
      supportsCrossRegion: true,
    });

    // THEN
    expect(model.modelId).toBe('test.model-v1');
    expect(model.supportsAgents).toBe(true);
    expect(model.supportsCrossRegion).toBe(true);
  });

  test('fromCdkFoundationModelId creates model with default properties', () => {
    // GIVEN
    const modelId = new FoundationModelIdentifier('test.model-v1');

    // WHEN
    const model = BedrockFoundationModel.fromCdkFoundationModelId(modelId);

    // THEN
    expect(model.modelId).toBe('test.model-v1');
    expect(model.supportsAgents).toBe(false);
    expect(model.supportsCrossRegion).toBe(false);
    expect(model.supportsKnowledgeBase).toBe(false);
    expect(model.vectorDimensions).toBeUndefined();
    expect(model.supportedVectorType).toBeUndefined();
  });

  test('fromCdkFoundationModel creates model correctly', () => {
    // GIVEN
    const modelId = new FoundationModelIdentifier('test.model-v1');
    const stack = new Stack();
    const foundationModel = FoundationModel.fromFoundationModelId(stack, 'TestModel', modelId);

    // WHEN
    const model = BedrockFoundationModel.fromCdkFoundationModel(foundationModel, {
      supportsAgents: true,
      supportsCrossRegion: true,
    });

    // THEN
    expect(model.modelId).toBe(modelId.modelId);
    expect(model.supportsAgents).toBe(true);
    expect(model.supportsCrossRegion).toBe(true);
  });

  test('fromCdkFoundationModel creates model with default properties', () => {
    // GIVEN
    const modelId = new FoundationModelIdentifier('test.model-v1');
    const stack = new Stack();
    const foundationModel = FoundationModel.fromFoundationModelId(stack, 'TestModel', modelId);

    // WHEN
    const model = BedrockFoundationModel.fromCdkFoundationModel(foundationModel);

    // THEN
    expect(model.modelId).toBe(modelId.modelId);
    expect(model.supportsAgents).toBe(false);
    expect(model.supportsCrossRegion).toBe(false);
    expect(model.supportsKnowledgeBase).toBe(false);
    expect(model.vectorDimensions).toBeUndefined();
    expect(model.supportedVectorType).toBeUndefined();
  });

  describe('static model instances', () => {
    test('AI21 models are configured correctly', () => {
      expect(BedrockFoundationModel.AI21_JAMBA_1_5_LARGE_V1.modelId).toBe('ai21.jamba-1-5-large-v1:0');
      expect(BedrockFoundationModel.AI21_JAMBA_1_5_LARGE_V1.supportsAgents).toBe(true);

      expect(BedrockFoundationModel.AI21_JAMBA_1_5_MINI_V1.modelId).toBe('ai21.jamba-1-5-mini-v1:0');
      expect(BedrockFoundationModel.AI21_JAMBA_1_5_MINI_V1.supportsAgents).toBe(true);

      expect(BedrockFoundationModel.AI21_JAMBA_INSTRUCT_V1.modelId).toBe('ai21.jamba-instruct-v1:0');
      expect(BedrockFoundationModel.AI21_JAMBA_INSTRUCT_V1.supportsAgents).toBe(true);
    });

    test('Amazon models are configured correctly', () => {
      expect(BedrockFoundationModel.AMAZON_TITAN_TEXT_EXPRESS_V1.modelId).toBe('amazon.titan-text-express-v1');
      expect(BedrockFoundationModel.AMAZON_TITAN_TEXT_EXPRESS_V1.supportsAgents).toBe(true);

      expect(BedrockFoundationModel.AMAZON_NOVA_MICRO_V1.modelId).toBe('amazon.nova-micro-v1:0');
      expect(BedrockFoundationModel.AMAZON_NOVA_MICRO_V1.supportsAgents).toBe(true);
      expect(BedrockFoundationModel.AMAZON_NOVA_MICRO_V1.supportsCrossRegion).toBe(true);

      expect(BedrockFoundationModel.TITAN_EMBED_TEXT_V1.modelId).toBe('amazon.titan-embed-text-v1');
      expect(BedrockFoundationModel.TITAN_EMBED_TEXT_V1.supportsKnowledgeBase).toBe(true);
      expect(BedrockFoundationModel.TITAN_EMBED_TEXT_V1.vectorDimensions).toBe(1536);
      expect(BedrockFoundationModel.TITAN_EMBED_TEXT_V1.supportedVectorType).toEqual([VectorType.FLOATING_POINT]);
    });

    test('Anthropic models are configured correctly', () => {
      expect(BedrockFoundationModel.ANTHROPIC_CLAUDE_3_7_SONNET_V1_0.modelId).toBe('anthropic.claude-3-7-sonnet-20250219-v1:0');
      expect(BedrockFoundationModel.ANTHROPIC_CLAUDE_3_7_SONNET_V1_0.supportsAgents).toBe(true);
      expect(BedrockFoundationModel.ANTHROPIC_CLAUDE_3_7_SONNET_V1_0.supportsCrossRegion).toBe(true);

      expect(BedrockFoundationModel.ANTHROPIC_CLAUDE_V2.modelId).toBe('anthropic.claude-v2');
      expect(BedrockFoundationModel.ANTHROPIC_CLAUDE_V2.supportsAgents).toBe(true);
    });

    test('Cohere models are configured correctly', () => {
      expect(BedrockFoundationModel.COHERE_EMBED_ENGLISH_V3.modelId).toBe('cohere.embed-english-v3');
      expect(BedrockFoundationModel.COHERE_EMBED_ENGLISH_V3.supportsKnowledgeBase).toBe(true);
      expect(BedrockFoundationModel.COHERE_EMBED_ENGLISH_V3.vectorDimensions).toBe(1024);
      expect(BedrockFoundationModel.COHERE_EMBED_ENGLISH_V3.supportedVectorType).toEqual([
        VectorType.FLOATING_POINT,
        VectorType.BINARY,
      ]);

      expect(BedrockFoundationModel.COHERE_EMBED_MULTILINGUAL_V3.modelId).toBe('cohere.embed-multilingual-v3');
      expect(BedrockFoundationModel.COHERE_EMBED_MULTILINGUAL_V3.supportsKnowledgeBase).toBe(true);
      expect(BedrockFoundationModel.COHERE_EMBED_MULTILINGUAL_V3.vectorDimensions).toBe(1024);
    });

    test('Meta models are configured correctly', () => {
      expect(BedrockFoundationModel.META_LLAMA_3_1_8B_INSTRUCT_V1.modelId).toBe('meta.llama3-1-8b-instruct-v1:0');
      expect(BedrockFoundationModel.META_LLAMA_3_1_8B_INSTRUCT_V1.supportsAgents).toBe(true);
      expect(BedrockFoundationModel.META_LLAMA_3_1_8B_INSTRUCT_V1.supportsCrossRegion).toBe(true);

      expect(BedrockFoundationModel.META_LLAMA_4_MAVERICK_17B_INSTRUCT_V1.modelId).toBe('meta.llama4-maverick-17b-instruct-v1:0');
      expect(BedrockFoundationModel.META_LLAMA_4_MAVERICK_17B_INSTRUCT_V1.supportsAgents).toBe(true);
      expect(BedrockFoundationModel.META_LLAMA_4_MAVERICK_17B_INSTRUCT_V1.supportsCrossRegion).toBe(true);
    });

    test('Mistral models are configured correctly', () => {
      expect(BedrockFoundationModel.MISTRAL_7B_INSTRUCT_V0.modelId).toBe('mistral.mistral-7b-instruct-v0:2');
      expect(BedrockFoundationModel.MISTRAL_7B_INSTRUCT_V0.supportsAgents).toBe(true);
      expect(BedrockFoundationModel.MISTRAL_7B_INSTRUCT_V0.supportsCrossRegion).toBe(false);

      expect(BedrockFoundationModel.MISTRAL_LARGE_2402_V1.modelId).toBe('mistral.mistral-large-2402-v1:0');
      expect(BedrockFoundationModel.MISTRAL_LARGE_2402_V1.supportsAgents).toBe(true);
      expect(BedrockFoundationModel.MISTRAL_LARGE_2402_V1.supportsCrossRegion).toBe(false);
    });
  });
});
