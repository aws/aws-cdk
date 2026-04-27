import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import { WorkloadIdentity, WorkloadIdentityPerms } from '../../../lib';

describe('WorkloadIdentity', () => {
  test('synthesizes expected CloudFormation resource', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    new WorkloadIdentity(stack, 'Wi', {
      workloadIdentityName: 'my_workload_identity',
      allowedResourceOauth2ReturnUrls: ['https://example.com/callback'],
      tags: { team: 'agents' },
    });

    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::BedrockAgentCore::WorkloadIdentity', 1);
    template.hasResourceProperties('AWS::BedrockAgentCore::WorkloadIdentity', {
      Name: 'my_workload_identity',
      AllowedResourceOauth2ReturnUrls: ['https://example.com/callback'],
      Tags: Match.arrayWith([{ Key: 'team', Value: 'agents' }]),
    });
  });

  test('auto-generates physical name when not specified', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    new WorkloadIdentity(stack, 'Wi');

    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::BedrockAgentCore::WorkloadIdentity', 1);
    template.hasResourceProperties('AWS::BedrockAgentCore::WorkloadIdentity', {
      Name: Match.anyValue(),
    });
  });

  test('empty tags produce no Tags property', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    new WorkloadIdentity(stack, 'Wi', {
      workloadIdentityName: 'empty-tags-test',
      tags: {},
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::WorkloadIdentity', {
      Name: 'empty-tags-test',
      Tags: Match.absent(),
    });
  });

  test('grantRead combines resource and list permissions', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    const wi = new WorkloadIdentity(stack, 'Wi', {
      workloadIdentityName: 'wi-read-test',
    });
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    wi.grantRead(role);

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'bedrock-agentcore:GetWorkloadIdentity',
            Resource: { 'Fn::GetAtt': [Match.anyValue(), 'WorkloadIdentityArn'] },
          }),
          Match.objectLike({
            Action: 'bedrock-agentcore:ListWorkloadIdentities',
            Resource: '*',
          }),
        ]),
      },
    });
  });

  test('grantAdmin grants control plane permissions', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    const wi = new WorkloadIdentity(stack, 'Wi', {
      workloadIdentityName: 'wi-admin-test',
    });
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    wi.grantAdmin(role);

    const serialized = JSON.stringify(Template.fromStack(stack).findResources('AWS::IAM::Policy'));
    for (const action of WorkloadIdentityPerms.ADMIN_PERMS) {
      expect(serialized).toContain(action);
    }
  });

  test('grantFullAccess scopes List to * and other actions to resource ARN', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    const wi = new WorkloadIdentity(stack, 'Wi', {
      workloadIdentityName: 'wi-full-test',
    });
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    wi.grantFullAccess(role);

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: Match.arrayWith([
              'bedrock-agentcore:GetWorkloadIdentity',
              'bedrock-agentcore:CreateWorkloadIdentity',
            ]),
            Resource: { 'Fn::GetAtt': [Match.anyValue(), 'WorkloadIdentityArn'] },
          }),
          Match.objectLike({
            Action: 'bedrock-agentcore:ListWorkloadIdentities',
            Resource: '*',
          }),
        ]),
      },
    });
  });

  test('grantRead on imported construct uses literal ARN', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    const imported = WorkloadIdentity.fromWorkloadIdentityAttributes(stack, 'Imp', {
      workloadIdentityArn:
        'arn:aws:bedrock-agentcore:us-east-1:123456789012:workload-identity-directory/default/workload-identity/existing',
      workloadIdentityName: 'existing',
    });
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    imported.grantRead(role);

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'bedrock-agentcore:GetWorkloadIdentity',
            Resource: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:workload-identity-directory/default/workload-identity/existing',
          }),
          Match.objectLike({
            Action: 'bedrock-agentcore:ListWorkloadIdentities',
            Resource: '*',
          }),
        ]),
      },
    });
  });

  test('fromWorkloadIdentityAttributes exposes ref shape', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    const imported = WorkloadIdentity.fromWorkloadIdentityAttributes(stack, 'Imp', {
      workloadIdentityArn:
        'arn:aws:bedrock-agentcore:us-east-1:123456789012:workload-identity-directory/default/workload-identity/existing',
      workloadIdentityName: 'existing',
    });

    expect(imported.workloadIdentityRef.workloadIdentityName).toBe('existing');
    expect(imported.workloadIdentityRef.workloadIdentityArn).toContain('workload-identity/existing');
  });

  test('fromWorkloadIdentityAttributes exposes optional timestamps when provided', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    const imported = WorkloadIdentity.fromWorkloadIdentityAttributes(stack, 'Imp', {
      workloadIdentityArn:
        'arn:aws:bedrock-agentcore:us-east-1:123456789012:workload-identity-directory/default/workload-identity/existing',
      workloadIdentityName: 'existing',
      createdTime: '2025-01-01T00:00:00Z',
      lastUpdatedTime: '2025-06-01T00:00:00Z',
    });

    expect(imported.createdTime).toBe('2025-01-01T00:00:00Z');
    expect(imported.lastUpdatedTime).toBe('2025-06-01T00:00:00Z');
  });

  test('fromWorkloadIdentityAttributes timestamps are undefined when not provided', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    const imported = WorkloadIdentity.fromWorkloadIdentityAttributes(stack, 'Imp', {
      workloadIdentityArn:
        'arn:aws:bedrock-agentcore:us-east-1:123456789012:workload-identity-directory/default/workload-identity/existing',
      workloadIdentityName: 'existing',
    });

    expect(imported.createdTime).toBeUndefined();
    expect(imported.lastUpdatedTime).toBeUndefined();
  });
});

describe('WorkloadIdentity validation', () => {
  test.each(['ab', 'x'])('fails for name shorter than 3 characters: %s', (name) => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    expect(() =>
      new WorkloadIdentity(stack, 'Wi', {
        workloadIdentityName: name,
      }),
    ).toThrow(/Workload identity name/);
  });

  test.each(['has spaces', 'has!bang', 'has@at'])('fails for name with invalid characters: %s', (name) => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    expect(() =>
      new WorkloadIdentity(stack, 'Wi', {
        workloadIdentityName: name,
      }),
    ).toThrow(/Workload identity name/);
  });

  test('accepts name at minimum length (3 chars)', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    expect(() =>
      new WorkloadIdentity(stack, 'Wi', {
        workloadIdentityName: 'abc',
      }),
    ).not.toThrow();
  });

  test('fails for empty allowedResourceOauth2ReturnUrls', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    expect(() =>
      new WorkloadIdentity(stack, 'Wi', {
        workloadIdentityName: 'wi-empty-urls',
        allowedResourceOauth2ReturnUrls: [],
      }),
    ).toThrow(/at least one URL/);
  });

  test('tokenized tags skip validation', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    const tokenKey = cdk.Lazy.string({ produce: () => 'resolved-key' });

    expect(() =>
      new WorkloadIdentity(stack, 'Wi', {
        workloadIdentityName: 'wi-token-tags',
        tags: { [tokenKey]: 'value' },
      }),
    ).not.toThrow();
  });
});
