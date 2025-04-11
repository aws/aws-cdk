import { App } from 'aws-cdk-lib/core';
import * as core from 'aws-cdk-lib/core';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as bedrock from '../../../lib';

describe('ApiSchema', () => {
  let stack: core.Stack;

  beforeEach(() => {
    const app = new App();
    stack = new core.Stack(app, 'test-stack');
  });

  test('creates schema from inline content', () => {
    const schema = bedrock.ApiSchema.fromInline(JSON.stringify({
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      paths: {
        '/test': {
          get: {
            responses: {
              '200': {
                description: 'OK',
              },
            },
          },
        },
      },
    }));

    expect(schema._render()).toEqual({
      payload: JSON.stringify({
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/test': {
            get: {
              responses: {
                '200': {
                  description: 'OK',
                },
              },
            },
          },
        },
      }),
    });
  });

  test('creates schema from S3 location', () => {
    const bucket = new s3.Bucket(stack, 'TestBucket');
    const schema = bedrock.ApiSchema.fromS3File(bucket, 'schema.json');

    const agent = new bedrock.Agent(stack, 'TestAgent', {
      instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
      foundationModel: {
        invokableArn: 'arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-v2',
        grantInvoke: (grantee) => {
          return iam.Grant.addToPrincipal({
            grantee,
            actions: ['bedrock:InvokeModel*', 'bedrock:GetFoundationModel'],
            resourceArns: ['arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-v2'],
          });
        },
      },
    });

    const actionGroup = new bedrock.AgentActionGroup({
      name: 'CustomAction',
      enabled: true,
      apiSchema: schema,
    });

    agent.addActionGroup(actionGroup);

    expect(schema._render()).toEqual({
      s3: {
        s3BucketName: bucket.bucketName,
        s3ObjectKey: 'schema.json',
      },
    });
  });

  test('creates schema from inline content with minimal OpenAPI schema', () => {
    const minimalSchema = {
      openapi: '3.0.0',
      info: { title: 'Minimal API', version: '1.0.0' },
      paths: {},
    };

    const schema = bedrock.ApiSchema.fromInline(JSON.stringify(minimalSchema));
    expect(schema._render()).toEqual({
      payload: JSON.stringify(minimalSchema),
    });
  });

  test('grants read permissions to agent role', () => {
    const bucket = new s3.Bucket(stack, 'TestBucket');
    const schema = bedrock.ApiSchema.fromS3File(bucket, 'schema.json');

    const agent = new bedrock.Agent(stack, 'TestAgent', {
      instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
      foundationModel: {
        invokableArn: 'arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-v2',
        grantInvoke: (grantee) => {
          return iam.Grant.addToPrincipal({
            grantee,
            actions: ['bedrock:InvokeModel*', 'bedrock:GetFoundationModel'],
            resourceArns: ['arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-v2'],
          });
        },
      },
    });

    const actionGroup = new bedrock.AgentActionGroup({
      name: 'CustomAction',
      enabled: true,
      apiSchema: schema,
    });

    agent.addActionGroup(actionGroup);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      'PolicyDocument': {
        'Statement': Match.arrayWith([
          Match.objectLike({
            'Action': ['bedrock:InvokeModel*', 'bedrock:GetFoundationModel'],
            'Effect': 'Allow',
            'Resource': 'arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-v2',
          }),
        ]),
      },
    });
  });
});
