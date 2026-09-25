import { Annotations, Match, Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib/core';
import * as bedrock from '../../../bedrock';

const KB_ARN = 'arn:aws:bedrock:us-east-1:123456789012:knowledge-base/KB123';

describe('imported knowledge base', () => {
  describe('fromVectorKnowledgeBaseId', () => {
    test('formats the ARN in the stack environment and exposes the id', () => {
      const stack = new cdk.Stack(undefined, 'Stack', { env: { account: '123456789012', region: 'us-east-1' } });
      const kb = bedrock.VectorKnowledgeBase.fromVectorKnowledgeBaseId(stack, 'KB', 'KB123');

      expect(kb.knowledgeBaseId).toBe('KB123');
      expect(stack.resolve(kb.knowledgeBaseArn)).toEqual({
        'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':bedrock:us-east-1:123456789012:knowledge-base/KB123']],
      });
    });
  });

  describe('fromVectorKnowledgeBaseArn', () => {
    test('exposes the ARN, id, type and environment from the ARN', () => {
      const stack = new cdk.Stack();
      const kb = bedrock.VectorKnowledgeBase.fromVectorKnowledgeBaseArn(stack, 'KB', KB_ARN);

      expect(kb.knowledgeBaseArn).toBe(KB_ARN);
      expect(kb.knowledgeBaseId).toBe('KB123');
      expect(kb.knowledgeBaseRef).toEqual({ knowledgeBaseId: 'KB123', knowledgeBaseArn: KB_ARN });
      expect(kb.type).toBe(bedrock.KnowledgeBaseType.VECTOR);
      expect(kb.env.account).toBe('123456789012');
      expect(kb.env.region).toBe('us-east-1');
    });

    test('without a role: role is undefined, grantPrincipal is an UnknownPrincipal and addToRolePolicy emits a warning', () => {
      const stack = new cdk.Stack();
      const kb = bedrock.VectorKnowledgeBase.fromVectorKnowledgeBaseArn(stack, 'KB', KB_ARN);

      expect(kb.role).toBeUndefined();
      expect(kb.grantPrincipal).toBeInstanceOf(iam.UnknownPrincipal);

      kb.addToRolePolicy(new iam.PolicyStatement({ actions: ['s3:GetObject'], resources: ['*'] }));

      Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 0);
      Annotations.fromStack(stack).hasWarning('/Default/KB', Match.stringLikeRegexp("Add statement to this resource's role"));
    });
  });

  describe('fromVectorKnowledgeBaseAttributes', () => {
    test('uses the provided role as role and grantPrincipal and addToRolePolicy adds to it', () => {
      const stack = new cdk.Stack();
      const role = new iam.Role(stack, 'Role', { assumedBy: new iam.ServicePrincipal('bedrock.amazonaws.com') });
      const kb = bedrock.VectorKnowledgeBase.fromVectorKnowledgeBaseAttributes(stack, 'KB', { knowledgeBaseArn: KB_ARN, role });

      expect(kb.role).toBe(role);
      expect(kb.grantPrincipal).toBe(role.grantPrincipal);

      kb.addToRolePolicy(new iam.PolicyStatement({ actions: ['s3:GetObject'], resources: ['arn:aws:s3:::bucket/*'] }));

      const template = Template.fromStack(stack);
      template.resourceCountIs('AWS::IAM::Policy', 1);
      template.hasResourceProperties('AWS::IAM::Policy', {
        Roles: [{ Ref: 'Role1ABCC5F0' }],
        PolicyDocument: {
          Statement: [{
            Action: 's3:GetObject',
            Effect: 'Allow',
            Resource: 'arn:aws:s3:::bucket/*',
          }],
        },
      });
    });
  });

  describe('grants', () => {
    test('grants.retrieve grants bedrock:Retrieve on the imported ARN', () => {
      const stack = new cdk.Stack();
      const kb = bedrock.VectorKnowledgeBase.fromVectorKnowledgeBaseArn(stack, 'KB', KB_ARN);
      const role = new iam.Role(stack, 'Reader', { assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com') });

      kb.grants.retrieve(role);

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        Roles: [{ Ref: 'ReaderF7BF189D' }],
        PolicyDocument: {
          Statement: [{
            Action: 'bedrock:Retrieve',
            Effect: 'Allow',
            Resource: KB_ARN,
          }],
        },
      });
    });
  });
});
