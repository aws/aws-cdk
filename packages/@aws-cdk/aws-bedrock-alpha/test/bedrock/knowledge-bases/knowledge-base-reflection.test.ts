import * as aws_bedrock from 'aws-cdk-lib/aws-bedrock';
import * as opensearchserverless from 'aws-cdk-lib/aws-opensearchserverless';
import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as bedrock from '../../../bedrock';

const ROLE_ARN = 'arn:aws:iam::123456789012:role/kb-role';
const EMBEDDING_MODEL_ARN = 'arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-embed-text-v2:0';

function newCfnKnowledgeBase(scope: Construct, id: string): aws_bedrock.CfnKnowledgeBase {
  return new aws_bedrock.CfnKnowledgeBase(scope, id, {
    name: id,
    roleArn: ROLE_ARN,
    knowledgeBaseConfiguration: {
      type: 'VECTOR',
      vectorKnowledgeBaseConfiguration: { embeddingModelArn: EMBEDDING_MODEL_ARN },
    },
  });
}

describe('KnowledgeBaseReflection', () => {
  test('resolves the L1 of a KnowledgeBase L2', () => {
    const stack = new cdk.Stack();
    const kb = new bedrock.KnowledgeBase(stack, 'KB', {
      type: bedrock.KnowledgeBaseType.vector({
        embeddingsModel: bedrock.BedrockFoundationModel.TITAN_EMBED_TEXT_V2_1024,
        vectorStore: bedrock.VectorStore.openSearchServerless({
          collection: opensearchserverless.CfnCollection.fromCollectionArn(stack, 'Collection', 'arn:aws:aoss:us-east-1:123456789012:collection/abc123'),
          vectorIndexName: 'my-index',
          vectorField: 'vector',
          textField: 'text',
          metadataField: 'metadata',
        }),
      }),
    });

    expect(kb.reflections.knowledgeBase).toBe(kb.node.defaultChild);
    const logicalId = stack.getLogicalId(kb.reflections.knowledgeBase);
    expect(stack.resolve(kb.reflections.knowledgeBase.attrStatus)).toEqual({ 'Fn::GetAtt': [logicalId, 'Status'] });
  });

  test('resolves a CfnKnowledgeBase to itself', () => {
    const stack = new cdk.Stack();
    const cfnKb = newCfnKnowledgeBase(stack, 'KB');

    expect(bedrock.KnowledgeBaseReflection.of(cfnKb).knowledgeBase).toBe(cfnKb);
  });

  test('resolves the matching L1 inside a custom construct that is not its default child', () => {
    const stack = new cdk.Stack();
    class Wrapper extends Construct implements aws_bedrock.IKnowledgeBaseRef {
      public readonly other = newCfnKnowledgeBase(this, 'Other');
      public readonly target = newCfnKnowledgeBase(this, 'Target');
      public get knowledgeBaseRef() { return this.target.knowledgeBaseRef; }
      public get env() { return this.target.env; }
    }
    const wrapper = new Wrapper(stack, 'Wrapper');

    expect(bedrock.KnowledgeBaseReflection.of(wrapper).knowledgeBase).toBe(wrapper.target);
  });

  test('fails to resolve the L1 of an imported knowledge base', () => {
    const stack = new cdk.Stack();
    const imported = bedrock.KnowledgeBase.fromKnowledgeBaseArn(stack, 'Imported', 'arn:aws:bedrock:us-east-1:123456789012:knowledge-base/KB123');

    expect(() => bedrock.KnowledgeBaseReflection.of(imported).knowledgeBase).toThrow(/Unable to find underlying resource for Default\/Imported/);
  });
});
