import { Template, Match } from '../../../assertions';
import * as iam from '../../../aws-iam';
import * as cdk from '../../../core';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from '../../lib';

describe('AwsCustomResource External ID Support', () => {
  let stack: cdk.Stack;
  let role: iam.Role;

  beforeEach(() => {
    stack = new cdk.Stack();
    role = new iam.Role(stack, 'AssumedRole', {
      assumedBy: new iam.AccountRootPrincipal(),
      externalIds: ['test-external-id-123'],
    });
  });

  test('externalId is passed through to Lambda function when specified', () => {
    // GIVEN & WHEN
    new AwsCustomResource(stack, 'CustomResource', {
      onCreate: {
        service: 'STS',
        action: 'GetCallerIdentity',
        assumedRoleArn: role.roleArn,
        externalId: 'test-external-id-123',
        physicalResourceId: PhysicalResourceId.of('test-resource'),
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('Custom::AWS', {
      ServiceToken: {
        'Fn::GetAtt': [
          Match.anyValue(),
          'Arn',
        ],
      },
      Create: JSON.stringify({
        service: 'STS',
        action: 'GetCallerIdentity',
        assumedRoleArn: { 'Fn::GetAtt': [Match.anyValue(), 'Arn'] },
        externalId: 'test-external-id-123',
        physicalResourceId: { id: 'test-resource' },
        logApiResponseData: true,
      }),
    });
  });

  test('externalId works with all lifecycle operations', () => {
    // GIVEN & WHEN
    new AwsCustomResource(stack, 'CustomResource', {
      onCreate: {
        service: 'STS',
        action: 'GetCallerIdentity',
        assumedRoleArn: role.roleArn,
        externalId: 'create-external-id',
        physicalResourceId: PhysicalResourceId.of('test-resource'),
      },
      onUpdate: {
        service: 'STS',
        action: 'GetCallerIdentity',
        assumedRoleArn: role.roleArn,
        externalId: 'update-external-id',
      },
      onDelete: {
        service: 'STS',
        action: 'GetCallerIdentity',
        assumedRoleArn: role.roleArn,
        externalId: 'delete-external-id',
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('Custom::AWS', {
      Create: JSON.stringify({
        service: 'STS',
        action: 'GetCallerIdentity',
        assumedRoleArn: { 'Fn::GetAtt': [Match.anyValue(), 'Arn'] },
        externalId: 'create-external-id',
        physicalResourceId: { id: 'test-resource' },
        logApiResponseData: true,
      }),
      Update: JSON.stringify({
        service: 'STS',
        action: 'GetCallerIdentity',
        assumedRoleArn: { 'Fn::GetAtt': [Match.anyValue(), 'Arn'] },
        externalId: 'update-external-id',
        logApiResponseData: true,
      }),
      Delete: JSON.stringify({
        service: 'STS',
        action: 'GetCallerIdentity',
        assumedRoleArn: { 'Fn::GetAtt': [Match.anyValue(), 'Arn'] },
        externalId: 'delete-external-id',
        logApiResponseData: true,
      }),
    });
  });

  test('externalId without assumedRoleArn is ignored', () => {
    // GIVEN & WHEN
    new AwsCustomResource(stack, 'CustomResource', {
      onCreate: {
        service: 'STS',
        action: 'GetCallerIdentity',
        externalId: 'test-external-id-123', // This should be ignored without assumedRoleArn
        physicalResourceId: PhysicalResourceId.of('test-resource'),
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('Custom::AWS', {
      Create: JSON.stringify({
        service: 'STS',
        action: 'GetCallerIdentity',
        externalId: 'test-external-id-123', // Still included in the call, but won't be used by Lambda
        physicalResourceId: { id: 'test-resource' },
        logApiResponseData: true,
      }),
    });
  });

  test('generates proper IAM policy for assumeRole with external ID', () => {
    // GIVEN & WHEN
    new AwsCustomResource(stack, 'CustomResource', {
      onCreate: {
        service: 'STS',
        action: 'GetCallerIdentity',
        assumedRoleArn: role.roleArn,
        externalId: 'test-external-id-123',
        physicalResourceId: PhysicalResourceId.of('test-resource'),
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });

    // THEN - Should include sts:AssumeRole permission for the specified role
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [Match.anyValue(), 'Arn'],
            },
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('different external IDs for different operations', () => {
    // GIVEN
    const role1 = new iam.Role(stack, 'Role1', {
      assumedBy: new iam.AccountRootPrincipal(),
      externalIds: ['external-1'],
    });

    const role2 = new iam.Role(stack, 'Role2', {
      assumedBy: new iam.AccountRootPrincipal(),
      externalIds: ['external-2'],
    });

    // WHEN
    new AwsCustomResource(stack, 'CustomResource', {
      onCreate: {
        service: 'STS',
        action: 'GetCallerIdentity',
        assumedRoleArn: role1.roleArn,
        externalId: 'external-1',
        physicalResourceId: PhysicalResourceId.of('test-resource'),
      },
      onUpdate: {
        service: 'STS',
        action: 'GetCallerIdentity',
        assumedRoleArn: role2.roleArn,
        externalId: 'external-2',
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('Custom::AWS', {
      Create: JSON.stringify({
        service: 'STS',
        action: 'GetCallerIdentity',
        assumedRoleArn: { 'Fn::GetAtt': [Match.anyValue(), 'Arn'] },
        externalId: 'external-1',
        physicalResourceId: { id: 'test-resource' },
        logApiResponseData: true,
      }),
      Update: JSON.stringify({
        service: 'STS',
        action: 'GetCallerIdentity',
        assumedRoleArn: { 'Fn::GetAtt': [Match.anyValue(), 'Arn'] },
        externalId: 'external-2',
        logApiResponseData: true,
      }),
    });
  });

  test('backward compatibility: works without external ID', () => {
    // GIVEN & WHEN
    new AwsCustomResource(stack, 'CustomResource', {
      onCreate: {
        service: 'STS',
        action: 'GetCallerIdentity',
        assumedRoleArn: role.roleArn,
        // No externalId specified
        physicalResourceId: PhysicalResourceId.of('test-resource'),
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('Custom::AWS', {
      Create: JSON.stringify({
        service: 'STS',
        action: 'GetCallerIdentity',
        assumedRoleArn: { 'Fn::GetAtt': [Match.anyValue(), 'Arn'] },
        physicalResourceId: { id: 'test-resource' },
        logApiResponseData: true,
      }),
    });
  });

  test('empty string external ID is preserved', () => {
    // GIVEN & WHEN
    new AwsCustomResource(stack, 'CustomResource', {
      onCreate: {
        service: 'STS',
        action: 'GetCallerIdentity',
        assumedRoleArn: role.roleArn,
        externalId: '', // Empty string should be preserved
        physicalResourceId: PhysicalResourceId.of('test-resource'),
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('Custom::AWS', {
      Create: JSON.stringify({
        service: 'STS',
        action: 'GetCallerIdentity',
        assumedRoleArn: { 'Fn::GetAtt': [Match.anyValue(), 'Arn'] },
        externalId: '',
        physicalResourceId: { id: 'test-resource' },
        logApiResponseData: true,
      }),
    });
  });

  test('UUID external ID pattern', () => {
    // GIVEN & WHEN
    const uuidExternalId = '550e8400-e29b-41d4-a716-446655440000';

    new AwsCustomResource(stack, 'CustomResource', {
      onCreate: {
        service: 'STS',
        action: 'GetCallerIdentity',
        assumedRoleArn: role.roleArn,
        externalId: uuidExternalId,
        physicalResourceId: PhysicalResourceId.of('test-resource'),
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('Custom::AWS', {
      Create: JSON.stringify({
        service: 'STS',
        action: 'GetCallerIdentity',
        assumedRoleArn: { 'Fn::GetAtt': [Match.anyValue(), 'Arn'] },
        externalId: uuidExternalId,
        physicalResourceId: { id: 'test-resource' },
        logApiResponseData: true,
      }),
    });
  });

  test('complex cross-account scenario with external ID', () => {
    // GIVEN
    const crossAccountRoleArn = 'arn:aws:iam::123456789012:role/CrossAccountRole';
    const secretExternalId = 'MySecretExternalId-2023';

    // WHEN
    new AwsCustomResource(stack, 'CrossAccountCustomResource', {
      onCreate: {
        service: 'EC2',
        action: 'DescribeVpcs',
        assumedRoleArn: crossAccountRoleArn,
        externalId: secretExternalId,
        region: 'us-west-2',
        physicalResourceId: PhysicalResourceId.of('cross-account-vpc-list'),
      },
      onUpdate: {
        service: 'EC2',
        action: 'DescribeVpcs',
        assumedRoleArn: crossAccountRoleArn,
        externalId: secretExternalId,
        region: 'us-west-2',
      },
      policy: AwsCustomResourcePolicy.fromStatements([
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['sts:AssumeRole'],
          resources: [crossAccountRoleArn],
        }),
      ]),
    });

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('Custom::AWS', {
      Create: JSON.stringify({
        service: 'EC2',
        action: 'DescribeVpcs',
        assumedRoleArn: crossAccountRoleArn,
        externalId: secretExternalId,
        region: 'us-west-2',
        physicalResourceId: { id: 'cross-account-vpc-list' },
        logApiResponseData: true,
      }),
      Update: JSON.stringify({
        service: 'EC2',
        action: 'DescribeVpcs',
        assumedRoleArn: crossAccountRoleArn,
        externalId: secretExternalId,
        region: 'us-west-2',
        logApiResponseData: true,
      }),
    });
  });
});
