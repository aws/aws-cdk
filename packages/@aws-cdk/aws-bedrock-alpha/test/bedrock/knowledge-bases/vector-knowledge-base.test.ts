import { Match, Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as opensearchserverless from 'aws-cdk-lib/aws-opensearchserverless';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib/core';
import * as bedrock from '../../../bedrock';

const COLLECTION_ARN = 'arn:aws:aoss:us-east-1:123456789012:collection/abc123';

function importedCollection(scope: cdk.Stack, id: string = 'Collection'): opensearchserverless.ICollectionRef {
  return opensearchserverless.CfnCollection.fromCollectionArn(scope, id, COLLECTION_ARN);
}

function defaultVectorStore(scope: cdk.Stack, id: string = 'Collection'): bedrock.VectorStore {
  return bedrock.VectorStore.openSearchServerless({
    collection: importedCollection(scope, id),
    vectorIndexName: 'my-index',
    vectorField: 'vector',
    textField: 'text',
    metadataField: 'metadata',
  });
}

function newKnowledgeBase(stack: cdk.Stack, props: Partial<bedrock.VectorKnowledgeBaseProps> = {}): bedrock.VectorKnowledgeBase {
  return new bedrock.VectorKnowledgeBase(stack, 'KB', {
    embeddingsModel: bedrock.BedrockFoundationModel.TITAN_EMBED_TEXT_V2_1024,
    vectorStore: defaultVectorStore(stack),
    ...props,
  });
}

const TITAN_V2_MODEL_ARN = {
  'Fn::Join': ['', [
    'arn:',
    { Ref: 'AWS::Partition' },
    ':bedrock:',
    { Ref: 'AWS::Region' },
    '::foundation-model/amazon.titan-embed-text-v2:0',
  ]],
};

describe('VectorKnowledgeBase', () => {
  describe('defaults', () => {
    test('creates a vector knowledge base with a generated name and no description', () => {
      const stack = new cdk.Stack();
      newKnowledgeBase(stack);

      const template = Template.fromStack(stack);
      template.resourceCountIs('AWS::Bedrock::KnowledgeBase', 1);
      template.resourceCountIs('AWS::IAM::Role', 1);
      template.resourceCountIs('AWS::IAM::Policy', 1);
      template.hasResourceProperties('AWS::Bedrock::KnowledgeBase', {
        Name: Match.stringLikeRegexp('^KB'),
        Description: Match.absent(),
        RoleArn: { 'Fn::GetAtt': ['KBRole081DC46D', 'Arn'] },
        KnowledgeBaseConfiguration: {
          Type: 'VECTOR',
          VectorKnowledgeBaseConfiguration: {
            EmbeddingModelArn: TITAN_V2_MODEL_ARN,
            EmbeddingModelConfiguration: {
              BedrockEmbeddingModelConfiguration: { Dimensions: 1024, EmbeddingDataType: 'FLOAT32' },
            },
            SupplementalDataStorageConfiguration: Match.absent(),
          },
        },
        StorageConfiguration: {
          Type: 'OPENSEARCH_SERVERLESS',
          OpensearchServerlessConfiguration: {
            CollectionArn: COLLECTION_ARN,
            VectorIndexName: 'my-index',
            FieldMapping: {
              VectorField: 'vector',
              TextField: 'text',
              MetadataField: 'metadata',
            },
          },
        },
        Tags: Match.absent(),
      });

      const longIdStack = new cdk.Stack(undefined, 'MyStack');
      const longConstructId = 'VectorKnowledgeBase'.repeat(6);
      new bedrock.VectorKnowledgeBase(longIdStack, longConstructId, {
        embeddingsModel: bedrock.BedrockFoundationModel.TITAN_EMBED_TEXT_V2_1024,
        vectorStore: defaultVectorStore(longIdStack),
      });
      const [longName] = Object.values(Template.fromStack(longIdStack).findResources('AWS::Bedrock::KnowledgeBase'))
        .map(r => r.Properties.Name as string);
      expect(longName.length).toBeLessThanOrEqual(100);
      expect(longName).toMatch(/^([0-9a-zA-Z][_-]?){1,100}$/);
    });
  });

  describe('props', () => {
    test('wires all props through to the template, grants the provided role the required permissions and addToRolePolicy adds to it', () => {
      const stack = new cdk.Stack();
      const role = new iam.Role(stack, 'Role', { assumedBy: new iam.ServicePrincipal('bedrock.amazonaws.com') });
      const kb = newKnowledgeBase(stack, {
        knowledgeBaseName: 'my-kb_1',
        description: 'A knowledge base',
        role,
        tags: { env: 'test', team: 'ml' },
      });

      expect(kb.role).toBe(role);
      expect(kb.grantPrincipal).toBe(role.grantPrincipal);

      kb.addToRolePolicy(new iam.PolicyStatement({ actions: ['s3:GetObject'], resources: ['arn:aws:s3:::my-bucket/*'] }));

      const template = Template.fromStack(stack);
      template.resourceCountIs('AWS::IAM::Role', 1);
      template.resourceCountIs('AWS::IAM::Policy', 1);
      template.hasResourceProperties('AWS::Bedrock::KnowledgeBase', {
        Name: 'my-kb_1',
        Description: 'A knowledge base',
        RoleArn: { 'Fn::GetAtt': ['Role1ABCC5F0', 'Arn'] },
        Tags: { env: 'test', team: 'ml' },
      });
      template.hasResourceProperties('AWS::IAM::Policy', {
        Roles: [{ Ref: 'Role1ABCC5F0' }],
        PolicyDocument: {
          Statement: Match.arrayWith([{
            Action: 's3:GetObject',
            Effect: 'Allow',
            Resource: 'arn:aws:s3:::my-bucket/*',
          }]),
        },
      });
    });
  });

  describe('embedding model configuration', () => {
    const customModel = (props: bedrock.BedrockFoundationModelProps) => new bedrock.BedrockFoundationModel('custom.embed-model-v1', props);

    test.each<[string, bedrock.BedrockFoundationModel, bedrock.VectorType | undefined, unknown]>([
      ['configurable-dimension model', bedrock.BedrockFoundationModel.TITAN_EMBED_TEXT_V2_1024, undefined, { Dimensions: 1024, EmbeddingDataType: 'FLOAT32' }],
      ['fixed-dimension model', bedrock.BedrockFoundationModel.COHERE_EMBED_ENGLISH_V3, undefined, { Dimensions: Match.absent(), EmbeddingDataType: 'FLOAT32' }],
      ['configurable-dimension model with vector type', bedrock.BedrockFoundationModel.TITAN_EMBED_TEXT_V2_1024, bedrock.VectorType.BINARY, { Dimensions: 1024, EmbeddingDataType: 'BINARY' }],
      ['fixed-dimension model with vector type', bedrock.BedrockFoundationModel.COHERE_EMBED_ENGLISH_V3, bedrock.VectorType.FLOATING_POINT, { Dimensions: Match.absent(), EmbeddingDataType: 'FLOAT32' }],
      ['model without supportedVectorType with vector type', customModel({ supportsKnowledgeBase: true }), bedrock.VectorType.BINARY, { Dimensions: Match.absent(), EmbeddingDataType: 'BINARY' }],
    ])('renders BedrockEmbeddingModelConfiguration for a %s', (_label, embeddingsModel, vectorType, expected) => {
      const stack = new cdk.Stack();
      newKnowledgeBase(stack, { embeddingsModel, vectorType });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::KnowledgeBase', {
        KnowledgeBaseConfiguration: {
          Type: 'VECTOR',
          VectorKnowledgeBaseConfiguration: {
            EmbeddingModelArn: {
              'Fn::Join': ['', Match.arrayWith([`::foundation-model/${embeddingsModel.modelId}`])],
            },
            EmbeddingModelConfiguration: { BedrockEmbeddingModelConfiguration: expected },
          },
        },
      });
    });
  });

  describe('supplemental data storage', () => {
    test('configures the S3 bucket and grants the service role access to it', () => {
      const stack = new cdk.Stack();
      const bucket = s3.Bucket.fromBucketName(stack, 'Bucket', 'my-multimodal-bucket');
      newKnowledgeBase(stack, { supplementalDataStorageBucket: bucket });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Bedrock::KnowledgeBase', {
        KnowledgeBaseConfiguration: {
          VectorKnowledgeBaseConfiguration: {
            SupplementalDataStorageConfiguration: {
              SupplementalDataStorageLocations: [{
                SupplementalDataStorageLocationType: 'S3',
                S3Location: { URI: 's3://my-multimodal-bucket/' },
              }],
            },
          },
        },
      });
      template.hasResourceProperties('AWS::IAM::Policy', {
        Roles: [{ Ref: 'KBRole081DC46D' }],
        PolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Action: ['s3:ListBucket', 's3:GetObject', 's3:PutObject', 's3:DeleteObject'],
              Resource: [
                { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':s3:::my-multimodal-bucket']] },
                { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':s3:::my-multimodal-bucket/*']] },
              ],
            }),
          ]),
        },
      });
    });
  });

  describe('default role', () => {
    test('is trusted by bedrock.amazonaws.com scoped to this account, is granted model and collection access, and the knowledge base depends on that policy', () => {
      const stack = new cdk.Stack();
      newKnowledgeBase(stack);

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Role', {
        AssumeRolePolicyDocument: {
          Statement: [{
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: { Service: 'bedrock.amazonaws.com' },
            Condition: {
              StringEquals: { 'aws:SourceAccount': { Ref: 'AWS::AccountId' } },
              ArnLike: {
                'aws:SourceArn': {
                  'Fn::Join': ['', [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':bedrock:',
                    { Ref: 'AWS::Region' },
                    ':',
                    { Ref: 'AWS::AccountId' },
                    ':knowledge-base/*',
                  ]],
                },
              },
            },
          }],
        },
      });
      template.hasResourceProperties('AWS::IAM::Policy', {
        Roles: [{ Ref: 'KBRole081DC46D' }],
        PolicyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Action: ['bedrock:InvokeModel*', 'bedrock:GetFoundationModel'],
              Effect: 'Allow',
              Resource: TITAN_V2_MODEL_ARN,
            },
            {
              Action: 'aoss:APIAccessAll',
              Effect: 'Allow',
              Resource: COLLECTION_ARN,
            },
          ],
        },
      });
      const [policyLogicalId] = Object.keys(template.findResources('AWS::IAM::Policy'));
      template.hasResource('AWS::Bedrock::KnowledgeBase', { DependsOn: [policyLogicalId] });
    });
  });

  describe('validation', () => {
    test.each<[string, RegExp | undefined, (stack: cdk.Stack) => Partial<bedrock.VectorKnowledgeBaseProps>]>([
      ['embeddingsModel that does not support knowledge bases', /embeddingsModel "anthropic.claude-3-5-sonnet-20240620-v1:0" cannot be used with knowledge bases/,
        () => ({ embeddingsModel: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0 })],
      ['vectorType not supported by the embeddingsModel', /vectorType "BINARY" is not supported by embeddingsModel "amazon.titan-embed-text-v1"; supported vector types are "FLOAT32"/,
        () => ({ embeddingsModel: bedrock.BedrockFoundationModel.TITAN_EMBED_TEXT_V1, vectorType: bedrock.VectorType.BINARY })],
      ['omitted vectorType when the embeddingsModel does not support the floating-point default', /vectorType "FLOAT32" is not supported by embeddingsModel "custom.binary-only-v1"/,
        () => ({ embeddingsModel: new bedrock.BedrockFoundationModel('custom.binary-only-v1', { supportsKnowledgeBase: true, supportedVectorType: [bedrock.VectorType.BINARY] }) })],
      ['empty knowledgeBaseName', /knowledgeBaseName .* must be 1-100 characters/, () => ({ knowledgeBaseName: '' })],
      ['knowledgeBaseName with consecutive hyphens', /knowledgeBaseName .* must be 1-100 characters/, () => ({ knowledgeBaseName: 'my--kb' })],
      ['knowledgeBaseName with a leading hyphen', /knowledgeBaseName .* must be 1-100 characters/, () => ({ knowledgeBaseName: '-mykb' })],
      ['knowledgeBaseName with a special character', /knowledgeBaseName .* must be 1-100 characters/, () => ({ knowledgeBaseName: 'my.kb' })],
      ['knowledgeBaseName of 101 characters', /knowledgeBaseName .* must be 1-100 characters/, () => ({ knowledgeBaseName: 'a'.repeat(101) })],
      ['knowledgeBaseName of 100 characters', undefined, () => ({ knowledgeBaseName: 'a'.repeat(100) })],
      ['knowledgeBaseName with a trailing hyphen', undefined, () => ({ knowledgeBaseName: 'mykb-' })],
      ['knowledgeBaseName token', undefined, (stack) => ({ knowledgeBaseName: new cdk.CfnParameter(stack, 'NameParam').valueAsString })],
      ['empty description', /description must be 1-200 characters, got 0/, () => ({ description: '' })],
      ['description of 201 characters', /description must be 1-200 characters, got 201/, () => ({ description: 'a'.repeat(201) })],
      ['description of 200 characters', undefined, () => ({ description: 'a'.repeat(200) })],
      ['description token', undefined, (stack) => ({ description: new cdk.CfnParameter(stack, 'DescParam').valueAsString })],
    ])('%s throws %p', (_label, error, props) => {
      const stack = new cdk.Stack();
      const create = () => newKnowledgeBase(stack, props(stack));
      if (error) {
        expect(create).toThrow(error);
      } else {
        expect(create).not.toThrow();
      }
    });
  });

  describe('type guard', () => {
    test.each<[string, boolean, (stack: cdk.Stack) => unknown]>([
      ['a VectorKnowledgeBase', true, (stack) => newKnowledgeBase(stack)],
      ['an imported knowledge base', false, (stack) => bedrock.VectorKnowledgeBase.fromVectorKnowledgeBaseArn(stack, 'Imported', 'arn:aws:bedrock:us-east-1:123456789012:knowledge-base/KB123')],
      ['null', false, () => null],
      ['a plain object', false, () => ({})],
    ])('isVectorKnowledgeBase(%s) is %p', (_label, expected, value) => {
      expect(bedrock.VectorKnowledgeBase.isVectorKnowledgeBase(value(new cdk.Stack()))).toBe(expected);
    });
  });

  describe('grants', () => {
    const KB_ARN_ATTR = { 'Fn::GetAtt': ['KBE030CEEB', 'KnowledgeBaseArn'] };

    test.each<[string, (grants: bedrock.IKnowledgeBase['grants'], grantee: iam.IGrantable) => iam.Grant, string | string[], unknown]>([
      ['retrieve', (grants, grantee) => grants.retrieve(grantee), 'bedrock:Retrieve', KB_ARN_ATTR],
      ['retrieveAndGenerate', (grants, grantee) => grants.retrieveAndGenerate(grantee), 'bedrock:RetrieveAndGenerate', '*'],
      ['getDocumentContent', (grants, grantee) => grants.getDocumentContent(grantee), ['bedrock:Retrieve', 'bedrock:GetDocumentContent'], KB_ARN_ATTR],
    ])('grants.%s grants the expected actions and resource', (_name, grant, actions, resource) => {
      const stack = new cdk.Stack();
      const kb = newKnowledgeBase(stack);
      const role = new iam.Role(stack, 'Reader', { assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com') });

      grant(kb.grants, role);

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        Roles: [{ Ref: 'ReaderF7BF189D' }],
        PolicyDocument: {
          Statement: [{
            Action: actions,
            Effect: 'Allow',
            Resource: resource,
          }],
        },
      });
    });

    test.each<[string, (stack: cdk.Stack) => iam.IGrantable, Record<string, unknown> | undefined]>([
      ['an imported role', (stack) => iam.Role.fromRoleArn(stack, 'Reader', 'arn:aws:iam::123456789012:role/reader'), { Roles: ['reader'] }],
      ['a user', (stack) => new iam.User(stack, 'User'), { Users: [{ Ref: 'User00B015A1' }] }],
      ['a service principal', () => new iam.ServicePrincipal('lambda.amazonaws.com'), undefined],
    ])('grants.retrieve works with %s', (_label, grantee, attachment) => {
      const stack = new cdk.Stack();
      const kb = newKnowledgeBase(stack);

      const grant = kb.grants.retrieve(grantee(stack));

      const template = Template.fromStack(stack);
      if (attachment === undefined) {
        expect(grant.success).toBe(false);
        template.resourceCountIs('AWS::IAM::Policy', 1);
        return;
      }
      expect(grant.success).toBe(true);
      template.hasResourceProperties('AWS::IAM::Policy', {
        ...attachment,
        PolicyDocument: {
          Statement: [{
            Action: 'bedrock:Retrieve',
            Effect: 'Allow',
            Resource: KB_ARN_ATTR,
          }],
        },
      });
    });
  });
});
