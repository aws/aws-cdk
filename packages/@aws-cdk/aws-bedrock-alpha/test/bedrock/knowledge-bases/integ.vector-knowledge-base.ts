/*
 * Integration test for the Bedrock VectorKnowledgeBase construct and the
 * knowledge base mixins
 */

/// !cdk-integ aws-cdk-bedrock-vector-knowledge-base

import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as bedrockCfn from 'aws-cdk-lib/aws-bedrock';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as opensearchserverless from 'aws-cdk-lib/aws-opensearchserverless';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as bedrock from '../../../bedrock';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-bedrock-vector-knowledge-base');

const collectionName = 'cdk-integ-kb-vectors';
const indexName = 'bedrock-knowledge-base-default-index';

const vectorField = 'bedrock-knowledge-base-default-vector';
const textField = 'AMAZON_BEDROCK_TEXT_CHUNK';
const metadataField = 'AMAZON_BEDROCK_METADATA';
const embeddingsModel = bedrock.BedrockFoundationModel.TITAN_EMBED_TEXT_V2_1024;

const encryptionPolicy = new opensearchserverless.CfnSecurityPolicy(stack, 'EncryptionPolicy', {
  name: `${collectionName}-enc`,
  type: 'encryption',
  policy: JSON.stringify({
    Rules: [{ ResourceType: 'collection', Resource: [`collection/${collectionName}`] }],
    AWSOwnedKey: true,
  }),
});

const networkPolicy = new opensearchserverless.CfnSecurityPolicy(stack, 'NetworkPolicy', {
  name: `${collectionName}-net`,
  type: 'network',
  policy: JSON.stringify([{
    Rules: [{ ResourceType: 'collection', Resource: [`collection/${collectionName}`] }],
    AllowFromPublic: true,
  }]),
});

const collection = new opensearchserverless.CfnCollection(stack, 'Collection', {
  name: collectionName,
  type: 'VECTORSEARCH',
});
collection.addResourceDependency(encryptionPolicy);
collection.addResourceDependency(networkPolicy);

// Supplemental data storage for both knowledge bases.
const supplementalBucket = new s3.Bucket(stack, 'SupplementalDataBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  enforceSSL: true,
});

const vectorStore = bedrock.VectorStore.openSearchServerless({
  collection,
  vectorIndexName: indexName,
  vectorField,
  textField,
  metadataField,
});

const knowledgeBase = new bedrock.VectorKnowledgeBase(stack, 'KnowledgeBase', {
  knowledgeBaseName: 'cdk-integ-vector-kb',
  description: 'Integration test knowledge base created with the L2 construct',
  embeddingsModel,
  vectorType: bedrock.VectorType.FLOATING_POINT,
  vectorStore,
  supplementalDataStorageBucket: supplementalBucket,
});

const mixinRole = new iam.Role(stack, 'MixinKnowledgeBaseRole', {
  assumedBy: new iam.ServicePrincipal('bedrock.amazonaws.com', {
    conditions: {
      StringEquals: { 'aws:SourceAccount': stack.account },
      ArnLike: {
        'aws:SourceArn': stack.formatArn({
          service: 'bedrock',
          resource: 'knowledge-base',
          resourceName: '*',
          arnFormat: cdk.ArnFormat.SLASH_RESOURCE_NAME,
        }),
      },
    },
  }),
});

const mixinKnowledgeBase = new bedrockCfn.CfnKnowledgeBase(stack, 'MixinKnowledgeBase', {
  name: 'cdk-integ-vector-kb-mixin',
  description: 'Integration test knowledge base created with the L1 and the storage mixins',
  roleArn: mixinRole.roleArn,
  knowledgeBaseConfiguration: {
    type: 'VECTOR',
    vectorKnowledgeBaseConfiguration: {
      embeddingModelArn: embeddingsModel.modelArn,
      embeddingModelConfiguration: {
        bedrockEmbeddingModelConfiguration: { dimensions: embeddingsModel.vectorDimensions },
      },
    },
  },
});
embeddingsModel.grantInvoke(mixinRole).applyBefore(mixinKnowledgeBase);
mixinKnowledgeBase
  .with(new bedrock.mixins.KnowledgeBaseOpenSearchServerlessStorage({
    collection,
    vectorIndexName: indexName,
    vectorField,
    textField,
    metadataField,
    role: mixinRole,
  }))
  .with(new bedrock.mixins.KnowledgeBaseSupplementalDataStorage({
    bucket: supplementalBucket,
    role: mixinRole,
  }));

// The CloudFormation execution role creates the index through the data plane; the
// knowledge base roles get only the permissions Bedrock documents for its service role.
const dataAccessPolicy = new opensearchserverless.CfnAccessPolicy(stack, 'DataAccessPolicy', {
  name: `${collectionName}-data`,
  type: 'data',
  policy: stack.toJsonString([
    {
      Description: 'CloudFormation execution role manages the vector index',
      Rules: [
        {
          ResourceType: 'index',
          Resource: [`index/${collectionName}/*`],
          Permission: ['aoss:CreateIndex', 'aoss:DescribeIndex', 'aoss:UpdateIndex', 'aoss:DeleteIndex'],
        },
        {
          ResourceType: 'collection',
          Resource: [`collection/${collectionName}`],
          Permission: ['aoss:DescribeCollectionItems', 'aoss:CreateCollectionItems', 'aoss:UpdateCollectionItems'],
        },
      ],
      Principal: [cdk.Fn.sub(stack.synthesizer.cloudFormationExecutionRole!)],
    },
    {
      Description: 'Knowledge base service roles read and write documents',
      Rules: [{
        ResourceType: 'index',
        Resource: [`index/${collectionName}/*`],
        Permission: ['aoss:DescribeIndex', 'aoss:ReadDocument', 'aoss:WriteDocument'],
      }],
      Principal: [
        knowledgeBase.role!.roleRef.roleArn,
        mixinRole.roleArn,
      ],
    },
  ]),
});

const index = new opensearchserverless.CfnIndex(stack, 'VectorIndex', {
  collectionEndpoint: collection.attrCollectionEndpoint,
  indexName,
  settings: {
    index: { knn: true, knnAlgoParamEfSearch: 512 },
  },
  mappings: {
    properties: {
      [vectorField]: {
        type: 'knn_vector',
        dimension: embeddingsModel.vectorDimensions,
        method: {
          name: 'hnsw',
          engine: 'faiss',
          spaceType: 'l2',
          parameters: { efConstruction: 512, m: 16 },
        },
      },
      [textField]: { type: 'text' },
      [metadataField]: { type: 'text', index: false },
    },
  },
});
index.addResourceDependency(dataAccessPolicy);

// Bedrock validates the index when it creates the knowledge base.
(knowledgeBase.node.defaultChild as cdk.CfnResource).addResourceDependency(index);
mixinKnowledgeBase.addResourceDependency(index);

new integ.IntegTest(app, 'BedrockVectorKnowledgeBase', {
  testCases: [stack],
  regions: ['us-east-1'],
});
