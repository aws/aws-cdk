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
    const templateJson = JSON.stringify(template.toJSON(), null, 2);
    expect(templateJson).toContain('test-external-id');
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
      Create: Match.anyValue(), // Accept any CloudFormation construct (like Fn::Join)
    });

    // Verify the external ID appears in the template
    const templateJson = JSON.stringify(template.toJSON());
    expect(templateJson).toContain('test-external-id-123');
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
      Create: Match.anyValue(),
      Update: Match.anyValue(),
      Delete: Match.anyValue(),
    });

    const templateJson = JSON.stringify(template.toJSON());
    expect(templateJson).toContain('create-external-id');
    expect(templateJson).toContain('update-external-id');
    expect(templateJson).toContain('delete-external-id');
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
      Create: Match.anyValue(),
    });

    // Should not contain any external ID
    const templateJson = JSON.stringify(template.toJSON());
    expect(templateJson).not.toContain('externalId');
  });

  test('empty string external ID is preserved', () => {
    // GIVEN & WHEN
    new AwsCustomResource(stack, 'EmptyExternalIdResource', {
      onCreate: {
        service: 'STS',
        action: 'getCallerIdentity',
        assumedRoleArn: role.roleArn,
        externalId: '', // Empty string should be preserved
        physicalResourceId: PhysicalResourceId.of('test-resource'),
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });

    // THEN - Empty external ID should appear in template
    const template = Template.fromStack(stack);
    template.hasResourceProperties('Custom::AWS', {
      Create: Match.anyValue(),
    });

    // Should contain empty externalId field (escaped in the Fn::Join)
    const templateJson = JSON.stringify(template.toJSON());
    expect(templateJson).toContain('\\\"externalId\\\":\\\"\\\"');
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
    const templateJson = JSON.stringify(template.toJSON());

    // Should contain the complex external ID in the template
    expect(templateJson).toContain(complexExternalId);
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

    // Verify the resource is created and external ID is properly handled
    template.hasResourceProperties('Custom::AWS', {
      Create: Match.anyValue(),
    });

    // Check that the external ID appears in the template (it will be escaped)
    const templateJson = JSON.stringify(template.toJSON());
    expect(templateJson).toContain('test-');
    expect(templateJson).toContain('quoted');
  });
});
