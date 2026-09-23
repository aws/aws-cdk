import { Match, Template } from 'aws-cdk-lib/assertions';
import * as aws_bedrock from 'aws-cdk-lib/aws-bedrock';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as opensearchserverless from 'aws-cdk-lib/aws-opensearchserverless';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as bedrock from '../../../bedrock';

const COLLECTION_ARN = 'arn:aws:aoss:us-east-1:123456789012:collection/abc123';
const ROLE_ARN = 'arn:aws:iam::123456789012:role/kb-role';
const EMBEDDING_MODEL_ARN = 'arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-embed-text-v2:0';
const BUCKET_NAME = 'my-multimodal-bucket';

class TestConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
  }
}

/**
 * The knowledge base service role, imported by ARN
 */
function importedRole(scope: Construct): iam.IRole {
  return (scope.node.tryFindChild('KbRole') as iam.IRole | undefined) ?? iam.Role.fromRoleArn(scope, 'KbRole', ROLE_ARN);
}

function storageProps(
  scope: Construct,
  overrides: Partial<bedrock.mixins.KnowledgeBaseOpenSearchServerlessStorageProps> = {},
  collectionId: string = 'Collection',
): bedrock.mixins.KnowledgeBaseOpenSearchServerlessStorageProps {
  return {
    collection: opensearchserverless.CfnCollection.fromCollectionArn(scope, collectionId, COLLECTION_ARN),
    vectorIndexName: 'my-index',
    vectorField: 'vector',
    textField: 'text',
    metadataField: 'metadata',
    role: importedRole(scope),
    ...overrides,
  };
}

function bucket(scope: Construct, id: string = 'Bucket'): s3.IBucketRef {
  return s3.Bucket.fromBucketName(scope, id, BUCKET_NAME);
}

function supplementalProps(
  scope: Construct,
  overrides: Partial<bedrock.mixins.KnowledgeBaseSupplementalDataStorageProps> = {},
): bedrock.mixins.KnowledgeBaseSupplementalDataStorageProps {
  return { bucket: overrides.bucket ?? bucket(scope), role: importedRole(scope), ...overrides };
}

function newCfnKnowledgeBase(
  stack: cdk.Stack,
  overrides: Partial<aws_bedrock.CfnKnowledgeBaseProps> = {},
): aws_bedrock.CfnKnowledgeBase {
  return new aws_bedrock.CfnKnowledgeBase(stack, 'KB', {
    name: 'my-kb',
    roleArn: ROLE_ARN,
    knowledgeBaseConfiguration: {
      type: 'VECTOR',
      vectorKnowledgeBaseConfiguration: { embeddingModelArn: EMBEDDING_MODEL_ARN },
    },
    ...overrides,
  });
}

const KENDRA_CONFIGURATION: aws_bedrock.CfnKnowledgeBaseProps['knowledgeBaseConfiguration'] = {
  type: 'KENDRA',
  kendraKnowledgeBaseConfiguration: { kendraIndexArn: 'arn:aws:kendra:us-east-1:123456789012:index/abc' },
};

const EXPECTED_STORAGE_CONFIGURATION = {
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
};

function supplementalLocation(uri: string) {
  return {
    SupplementalDataStorageLocations: [{
      SupplementalDataStorageLocationType: 'S3',
      S3Location: { URI: uri },
    }],
  };
}

const bucketArn = (suffix: string = '') => ({
  'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, `:s3:::${BUCKET_NAME}${suffix}`]],
});

const MIXINS: Array<[string, (stack: cdk.Stack) => cdk.Mixin, RegExp]> = [
  ['KnowledgeBaseOpenSearchServerlessStorage', (stack) => new bedrock.mixins.KnowledgeBaseOpenSearchServerlessStorage(storageProps(stack)),
    /a vector store can only be configured on a knowledge base of type VECTOR, got "KENDRA"/],
  ['KnowledgeBaseSupplementalDataStorage', (stack) => new bedrock.mixins.KnowledgeBaseSupplementalDataStorage(supplementalProps(stack)),
    /supplemental data storage can only be configured on a knowledge base of type VECTOR, got "KENDRA"/],
];

describe('knowledge base mixins', () => {
  test.each(MIXINS)('%s supports CfnKnowledgeBase and does not support unrelated constructs', (_name, mixinFactory) => {
    const stack = new cdk.Stack();
    const mixin = mixinFactory(stack);

    expect(mixin.supports(newCfnKnowledgeBase(stack))).toBe(true);
    expect(mixin.supports(new TestConstruct(stack, 'Test'))).toBe(false);
    expect(mixin.supports(new s3.CfnBucket(stack, 'CfnBucket'))).toBe(false);
  });

  test.each(MIXINS)('%s validates the knowledge base type at synthesis time, so fixing the type after it is applied succeeds', (_name, mixinFactory, message) => {
    const stack = new cdk.Stack();
    const kb = newCfnKnowledgeBase(stack, { knowledgeBaseConfiguration: KENDRA_CONFIGURATION });

    expect(() => kb.with(mixinFactory(stack))).not.toThrow();
    expect(() => Template.fromStack(stack)).toThrow(message);

    kb.knowledgeBaseConfiguration = {
      type: 'VECTOR',
      vectorKnowledgeBaseConfiguration: { embeddingModelArn: EMBEDDING_MODEL_ARN },
    };

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::KnowledgeBase', {
      KnowledgeBaseConfiguration: Match.objectLike({ Type: 'VECTOR' }),
    });
  });

  test('can be applied retrospectively to a VectorKnowledgeBase L2', () => {
    const stack = new cdk.Stack();
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.ServicePrincipal('bedrock.amazonaws.com') });
    const kb = new bedrock.VectorKnowledgeBase(stack, 'L2', {
      embeddingsModel: bedrock.BedrockFoundationModel.TITAN_EMBED_TEXT_V2_1024,
      vectorStore: bedrock.VectorStore.openSearchServerless(storageProps(stack)),
      role,
    });

    expect(() => kb.with(new bedrock.mixins.KnowledgeBaseOpenSearchServerlessStorage(storageProps(stack, {}, 'Other'))))
      .toThrow(/the knowledge base already has a storage configuration; only one vector store can be configured/);

    kb.with(new bedrock.mixins.KnowledgeBaseSupplementalDataStorage({ bucket: bucket(stack), role }));

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::Bedrock::KnowledgeBase', {
      KnowledgeBaseConfiguration: {
        VectorKnowledgeBaseConfiguration: Match.objectLike({
          SupplementalDataStorageConfiguration: supplementalLocation(`s3://${BUCKET_NAME}/`),
        }),
      },
    });
    template.hasResourceProperties('AWS::IAM::Policy', {
      Roles: [{ Ref: 'Role1ABCC5F0' }],
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({ Action: ['s3:ListBucket', 's3:GetObject', 's3:PutObject', 's3:DeleteObject'] }),
        ]),
      },
    });
  });

  test('both mixins grant to the same role and the knowledge base depends on both policies', () => {
    const stack = new cdk.Stack();
    const role = new iam.Role(stack, 'ServiceRole', { assumedBy: new iam.ServicePrincipal('bedrock.amazonaws.com') });
    newCfnKnowledgeBase(stack, { roleArn: role.roleArn })
      .with(new bedrock.mixins.KnowledgeBaseOpenSearchServerlessStorage(storageProps(stack, { role })))
      .with(new bedrock.mixins.KnowledgeBaseSupplementalDataStorage(supplementalProps(stack, { role })));

    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::IAM::Policy', 1);
    template.hasResourceProperties('AWS::IAM::Policy', {
      Roles: [{ Ref: 'ServiceRole4288B192' }],
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({ Action: 'aoss:APIAccessAll' }),
          Match.objectLike({ Action: ['s3:ListBucket', 's3:GetObject', 's3:PutObject', 's3:DeleteObject'] }),
        ]),
      },
    });
    template.hasResourceProperties('AWS::Bedrock::KnowledgeBase', {
      StorageConfiguration: EXPECTED_STORAGE_CONFIGURATION,
      KnowledgeBaseConfiguration: {
        VectorKnowledgeBaseConfiguration: { SupplementalDataStorageConfiguration: Match.anyValue() },
      },
    });
    template.hasResource('AWS::Bedrock::KnowledgeBase', { DependsOn: ['ServiceRoleDefaultPolicy94CF55F6', 'ServiceRole4288B192'] });
  });
});

describe('KnowledgeBaseOpenSearchServerlessStorage', () => {
  test('sets the storage configuration on the L1, grants aoss:APIAccessAll to the role and the knowledge base depends on that policy', () => {
    const stack = new cdk.Stack();
    newCfnKnowledgeBase(stack).with(new bedrock.mixins.KnowledgeBaseOpenSearchServerlessStorage(storageProps(stack)));

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::Bedrock::KnowledgeBase', {
      StorageConfiguration: EXPECTED_STORAGE_CONFIGURATION,
    });
    template.resourceCountIs('AWS::IAM::Role', 0);
    template.resourceCountIs('AWS::IAM::Policy', 1);
    template.hasResourceProperties('AWS::IAM::Policy', {
      Roles: ['kb-role'],
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [{
          Action: 'aoss:APIAccessAll',
          Effect: 'Allow',
          Resource: COLLECTION_ARN,
        }],
      },
    });
    const [policyLogicalId] = Object.keys(template.findResources('AWS::IAM::Policy'));
    template.hasResource('AWS::Bedrock::KnowledgeBase', { DependsOn: [policyLogicalId] });
  });

  test('throws when the knowledge base already has a storage configuration', () => {
    const stack = new cdk.Stack();
    const kb = newCfnKnowledgeBase(stack, {
      storageConfiguration: {
        type: 'PINECONE',
        pineconeConfiguration: {
          connectionString: 'https://example.pinecone.io',
          credentialsSecretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:pinecone',
          fieldMapping: { textField: 'text', metadataField: 'metadata' },
        },
      },
    });

    expect(() => kb.with(new bedrock.mixins.KnowledgeBaseOpenSearchServerlessStorage(storageProps(stack))))
      .toThrow(/the knowledge base already has a storage configuration; only one vector store can be configured/);
  });

  test.each<[string, (stack: cdk.Stack) => aws_bedrock.CfnKnowledgeBaseProps['knowledgeBaseConfiguration'], unknown]>([
    ['the type is a token', (stack) => ({
      type: new cdk.CfnParameter(stack, 'TypeParam').valueAsString,
      vectorKnowledgeBaseConfiguration: { embeddingModelArn: EMBEDDING_MODEL_ARN },
    }), { Ref: 'TypeParam' }],
    ['the configuration is resolvable', () => cdk.Lazy.any({
      produce: () => ({
        type: 'VECTOR',
        vectorKnowledgeBaseConfiguration: { embeddingModelArn: EMBEDDING_MODEL_ARN },
      }),
    }), 'VECTOR'],
  ])('skips the type validation when %s', (_label, configuration, expectedType) => {
    const stack = new cdk.Stack();
    newCfnKnowledgeBase(stack, { knowledgeBaseConfiguration: configuration(stack) })
      .with(new bedrock.mixins.KnowledgeBaseOpenSearchServerlessStorage(storageProps(stack)));

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::KnowledgeBase', {
      KnowledgeBaseConfiguration: { Type: expectedType },
      StorageConfiguration: EXPECTED_STORAGE_CONFIGURATION,
    });
  });
});

describe('KnowledgeBaseSupplementalDataStorage', () => {
  test('sets the S3 location, grants access to the bucket and its objects and the knowledge base depends on the policy', () => {
    const stack = new cdk.Stack();
    newCfnKnowledgeBase(stack).with(new bedrock.mixins.KnowledgeBaseSupplementalDataStorage(supplementalProps(stack)));

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::Bedrock::KnowledgeBase', {
      KnowledgeBaseConfiguration: {
        Type: 'VECTOR',
        VectorKnowledgeBaseConfiguration: {
          EmbeddingModelArn: EMBEDDING_MODEL_ARN,
          SupplementalDataStorageConfiguration: supplementalLocation(`s3://${BUCKET_NAME}/`),
        },
      },
    });
    template.resourceCountIs('AWS::IAM::Role', 0);
    template.resourceCountIs('AWS::IAM::Policy', 1);
    template.hasResourceProperties('AWS::IAM::Policy', {
      Roles: ['kb-role'],
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [{
          Action: ['s3:ListBucket', 's3:GetObject', 's3:PutObject', 's3:DeleteObject'],
          Effect: 'Allow',
          Resource: [bucketArn(), bucketArn('/*')],
        }],
      },
    });
    const [policyLogicalId] = Object.keys(template.findResources('AWS::IAM::Policy'));
    template.hasResource('AWS::Bedrock::KnowledgeBase', { DependsOn: [policyLogicalId] });
  });

  test.each<[string, (stack: cdk.Stack) => void, unknown]>([
    ['preserves the existing embedding model configuration', (stack) => newCfnKnowledgeBase(stack, {
      knowledgeBaseConfiguration: {
        type: 'VECTOR',
        vectorKnowledgeBaseConfiguration: {
          embeddingModelArn: EMBEDDING_MODEL_ARN,
          embeddingModelConfiguration: { bedrockEmbeddingModelConfiguration: { dimensions: 1024 } },
        },
      },
    }).with(new bedrock.mixins.KnowledgeBaseSupplementalDataStorage(supplementalProps(stack))), {
      EmbeddingModelArn: EMBEDDING_MODEL_ARN,
      EmbeddingModelConfiguration: { BedrockEmbeddingModelConfiguration: { Dimensions: 1024 } },
      SupplementalDataStorageConfiguration: supplementalLocation(`s3://${BUCKET_NAME}/`),
    }],
    ['replaces a supplemental data storage location that is already configured', (stack) => newCfnKnowledgeBase(stack)
      .with(new bedrock.mixins.KnowledgeBaseSupplementalDataStorage(supplementalProps(stack)))
      .with(new bedrock.mixins.KnowledgeBaseSupplementalDataStorage(supplementalProps(stack, { bucket: s3.Bucket.fromBucketName(stack, 'Other', 'other-bucket') }))), {
      EmbeddingModelArn: EMBEDDING_MODEL_ARN,
      SupplementalDataStorageConfiguration: supplementalLocation('s3://other-bucket/'),
    }],
  ])('%s', (_label, setup, expectedVectorConfiguration) => {
    const stack = new cdk.Stack();
    setup(stack);

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::KnowledgeBase', {
      KnowledgeBaseConfiguration: {
        Type: 'VECTOR',
        VectorKnowledgeBaseConfiguration: expectedVectorConfiguration,
      },
    });
  });

  test.each<[string, () => aws_bedrock.CfnKnowledgeBaseProps['knowledgeBaseConfiguration']]>([
    ['the configuration', () => cdk.Lazy.any({
      produce: () => ({ type: 'VECTOR', vectorKnowledgeBaseConfiguration: { embeddingModelArn: EMBEDDING_MODEL_ARN } }),
    })],
    ['the vector configuration', () => ({
      type: 'VECTOR',
      vectorKnowledgeBaseConfiguration: cdk.Lazy.any({ produce: () => ({ embeddingModelArn: EMBEDDING_MODEL_ARN }) }),
    })],
    ['a sibling embedding model configuration', () => ({
      type: 'VECTOR',
      vectorKnowledgeBaseConfiguration: {
        embeddingModelArn: EMBEDDING_MODEL_ARN,
        embeddingModelConfiguration: cdk.Lazy.any({ produce: () => ({ bedrockEmbeddingModelConfiguration: { dimensions: 1024 } }) }),
      },
    })],
  ])('fails when %s is a deploy-time value', (_, configuration) => {
    const stack = new cdk.Stack();
    const kb = newCfnKnowledgeBase(stack, { knowledgeBaseConfiguration: configuration() });

    expect(() => kb.with(new bedrock.mixins.KnowledgeBaseSupplementalDataStorage(supplementalProps(stack))))
      .toThrow(/configuration contains deploy-time object values/);
  });
});
