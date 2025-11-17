import { Match, Template } from '../../../assertions';
import { Role, ServicePrincipal, PolicyStatement } from '../../../aws-iam';
import { Stack } from '../../../core';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from '../../lib';

describe('AwsCustomResource externalId', () => {
  let stack: Stack;
  let role: Role;

  beforeEach(() => {
    stack = new Stack();
    role = new Role(stack, 'Role', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });
  });

  test('should include externalId in CloudFormation template', () => {
    new AwsCustomResource(stack, 'TestResource2', {
      onCreate: {
        service: 'STS',
        action: 'getCallerIdentity',
        assumedRoleArn: role.roleArn,
        externalId: 'test-external-id',
        physicalResourceId: PhysicalResourceId.of('test-resource'),
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('Custom::AWS', {
      Create: Match.objectLike({
        'Fn::Join': [
          '',
          [
            '{"service":"STS","action":"getCallerIdentity","assumedRoleArn":"',
            {
              'Fn::GetAtt': ['Role1ABCC5F0', 'Arn'],
            },
            '","externalId":"test-external-id","physicalResourceId":{"id":"test-resource"}}',
          ],
        ],
      }),
    });
  });

  test('externalId is passed through to Lambda function when specified', () => {
    // GIVEN & WHEN
    new AwsCustomResource(stack, 'CustomResource', {
      onCreate: {
        service: 'STS',
        action: 'getCallerIdentity',
        assumedRoleArn: role.roleArn,
        externalId: 'test-external-id-123',
        physicalResourceId: PhysicalResourceId.of('test-resource'),
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });

    // THEN - The Custom::AWS resource should have Create property containing external ID
    const template = Template.fromStack(stack);
    template.hasResourceProperties('Custom::AWS', {
      Create: Match.objectLike({
        'Fn::Join': [
          '',
          Match.arrayWith([
            Match.stringLikeRegexp('"externalId":"test-external-id-123"'),
          ]),
        ],
      }),
    });
  });

  test('externalId works with all lifecycle operations', () => {
    // GIVEN & WHEN
    new AwsCustomResource(stack, 'LifecycleResource', {
      onCreate: {
        service: 'STS',
        action: 'getCallerIdentity',
        assumedRoleArn: role.roleArn,
        externalId: 'create-external-id',
        physicalResourceId: PhysicalResourceId.of('test-resource'),
      },
      onUpdate: {
        service: 'STS',
        action: 'getCallerIdentity',
        assumedRoleArn: role.roleArn,
        externalId: 'update-external-id',
      },
      onDelete: {
        service: 'STS',
        action: 'getCallerIdentity',
        assumedRoleArn: role.roleArn,
        externalId: 'delete-external-id',
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });

    // THEN - All three external IDs should appear in the template
    const template = Template.fromStack(stack);
    template.hasResourceProperties('Custom::AWS', {
      Create: Match.objectLike({
        'Fn::Join': [
          '',
          Match.arrayWith([
            Match.stringLikeRegexp('"externalId":"create-external-id"'),
          ]),
        ],
      }),
      Update: Match.objectLike({
        'Fn::Join': [
          '',
          Match.arrayWith([
            Match.stringLikeRegexp('"externalId":"update-external-id"'),
          ]),
        ],
      }),
      Delete: Match.objectLike({
        'Fn::Join': [
          '',
          Match.arrayWith([
            Match.stringLikeRegexp('"externalId":"delete-external-id"'),
          ]),
        ],
      }),
    });
  });

  test('backward compatibility: works without external ID', () => {
    // GIVEN - Clean stack for this test
    const cleanStack = new Stack();
    const cleanRole = new Role(cleanStack, 'CleanRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });

    // WHEN
    new AwsCustomResource(cleanStack, 'BackwardCompatResource', {
      onCreate: {
        service: 'STS',
        action: 'getCallerIdentity',
        assumedRoleArn: cleanRole.roleArn,
        // No externalId specified
        physicalResourceId: PhysicalResourceId.of('test-resource'),
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });

    // THEN - Should work normally without external ID
    const template = Template.fromStack(cleanStack);
    template.hasResourceProperties('Custom::AWS', {
      Create: Match.objectLike({
        'Fn::Join': [
          '',
          Match.arrayWith([
            Match.not(Match.stringLikeRegexp('externalId')),
          ]),
        ],
      }),
    });
  });

  test('complex external ID values are handled correctly', () => {
    // Test various external ID formats that are commonly used
    const testStack = new Stack();
    const testRole = new Role(testStack, 'Role', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });

    const complexExternalId = 'arn:aws:organizations::123456789012:account/o-example123456/123456789012';

    new AwsCustomResource(testStack, 'ComplexExternalIdResource', {
      onCreate: {
        service: 'STS',
        action: 'getCallerIdentity',
        assumedRoleArn: testRole.roleArn,
        externalId: complexExternalId,
        physicalResourceId: PhysicalResourceId.of('test-resource'),
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
    });

    const template = Template.fromStack(testStack);
    template.hasResourceProperties('Custom::AWS', {
      Create: Match.objectLike({
        'Fn::Join': [
          '',
          Match.arrayWith([
            Match.stringLikeRegexp('"externalId":"arn:aws:organizations::123456789012:account/o-example123456/123456789012"'),
          ]),
        ],
      }),
    });
  });

  test('external ID with special characters is properly escaped', () => {
    // Test external ID with quotes and special characters
    const testStack = new Stack();
    const testRole = new Role(testStack, 'Role', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });

    const specialExternalId = 'test-"quoted"-&-special-chars';

    new AwsCustomResource(testStack, 'SpecialExternalIdResource', {
      onCreate: {
        service: 'STS',
        action: 'getCallerIdentity',
        assumedRoleArn: testRole.roleArn,
        externalId: specialExternalId,
        physicalResourceId: PhysicalResourceId.of('test-resource'),
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
    });

    const template = Template.fromStack(testStack);
    template.hasResourceProperties('Custom::AWS', {
      Create: Match.objectLike({
        'Fn::Join': [
          '',
          Match.arrayWith([
            Match.stringLikeRegexp('"externalId":"test-.*quoted.*-&-special-chars"'),
          ]),
        ],
      }),
    });
  });
});
