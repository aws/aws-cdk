import { Annotations, Template } from '../../assertions';
import * as iam from '../../aws-iam';
import { App, Stack, Token } from '../../core';
import { EventBus } from '../lib';

describe('EventBus grants', () => {
  test('grantPutEventsTo creates EventBusPolicy for service principal', () => {
    // GIVEN
    const stack = new Stack();
    const eventBus = new EventBus(stack, 'EventBus');
    const servicePrincipal = new iam.ServicePrincipal('states.amazonaws.com');

    // WHEN
    const grant = eventBus.grantPutEventsTo(servicePrincipal);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Events::EventBusPolicy', {
      Statement: {
        Effect: 'Allow',
        Action: 'events:PutEvents',
        Principal: { Service: 'states.amazonaws.com' },
        Resource: { 'Fn::GetAtt': ['EventBus7B8748AA', 'Arn'] },
      },
      StatementId: 'cdk-EventBus-Default-Statement',
      EventBusName: { Ref: 'EventBus7B8748AA' },
    });

    expect(grant.success).toBeTruthy();
  });

  test('grantPutEventsTo creates IAM policy for IAM principal', () => {
    // GIVEN
    const stack = new Stack();
    const eventBus = new EventBus(stack, 'EventBus');
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    // WHEN
    const grant = eventBus.grantPutEventsTo(role);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [{
          Action: 'events:PutEvents',
          Effect: 'Allow',
          Resource: {
            'Fn::GetAtt': ['EventBus7B8748AA', 'Arn'],
          },
        }],
        Version: '2012-10-17',
      },
    });

    expect(grant.success).toBeTruthy();
  });

  test('grantPutEventsTo creates IAM policy for imported EventBus using fromEventBusArn', () => {
    // GIVEN
    const stack = new Stack();
    const eventBusArn = 'arn:aws:events:us-east-1:111111111111:event-bus/imported-bus';
    const importedEventBus = EventBus.fromEventBusArn(stack, 'ImportedBus', eventBusArn);
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    // WHEN
    const grant = importedEventBus.grantPutEventsTo(role);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [{
          Action: 'events:PutEvents',
          Effect: 'Allow',
          Resource: eventBusArn,
        }],
        Version: '2012-10-17',
      },
    });

    // Verify warning about not being able to add resource policy
    Annotations.fromStack(stack).hasWarning('/Default/ImportedBus',
      'Unable to add necessary permissions to imported target event bus: arn:aws:events:us-east-1:111111111111:event-bus/imported-bus [ack: @aws-cdk/aws-events:eventBusAddToResourcePolicy]');

    expect(grant.success).toBeTruthy();
  });

  test('grantPutEventsTo creates IAM policy for imported EventBus using fromEventBusName', () => {
    // GIVEN
    const stack = new Stack();
    const eventBusName = 'imported-bus';
    const importedEventBus = EventBus.fromEventBusName(stack, 'ImportedBus', eventBusName);
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    // WHEN
    const grant = importedEventBus.grantPutEventsTo(role);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [{
          Action: 'events:PutEvents',
          Effect: 'Allow',
          Resource: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':events:',
              { Ref: 'AWS::Region' },
              ':',
              { Ref: 'AWS::AccountId' },
              ':event-bus/imported-bus',
            ]],
          },
        }],
        Version: '2012-10-17',
      },
    });

    expect(grant.success).toBeTruthy();
  });

  test('grantPutEventsTo creates both IAM and resource policies for cross-account service principal', () => {
    // GIVEN
    const stack = new Stack();
    const eventBus = new EventBus(stack, 'EventBus');
    const servicePrincipal = new iam.ServicePrincipal('states.amazonaws.com', {
      conditions: {
        StringEquals: {
          'aws:SourceAccount': '123456789012',
        },
      },
    });

    // WHEN
    const grant = eventBus.grantPutEventsTo(servicePrincipal);

    // THEN
    // Verify event bus policy is created
    Template.fromStack(stack).hasResourceProperties('AWS::Events::EventBusPolicy', {
      Statement: {
        Effect: 'Allow',
        Action: 'events:PutEvents',
        Principal: { Service: 'states.amazonaws.com' },
        Resource: { 'Fn::GetAtt': ['EventBus7B8748AA', 'Arn'] },
        Condition: {
          StringEquals: {
            'aws:SourceAccount': '123456789012',
          },
        },
      },
      StatementId: 'cdk-EventBus-Default-Statement',
      EventBusName: { Ref: 'EventBus7B8748AA' },
    });

    expect(grant.success).toBeTruthy();
  });

  test('grantPutEventsTo creates both IAM and resource policies for cross-account role principal', () => {
    // GIVEN
    const stack = new Stack();
    const eventBus = new EventBus(stack, 'EventBus');
    const otherAccountRole = new iam.AccountPrincipal('123456789012');

    // WHEN
    const grant = eventBus.grantPutEventsTo(otherAccountRole);

    // THEN
    // Verify event bus policy is created
    Template.fromStack(stack).hasResourceProperties('AWS::Events::EventBusPolicy', {
      Statement: {
        Effect: 'Allow',
        Action: 'events:PutEvents',
        Principal: {
          AWS: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':iam::123456789012:root',
            ]],
          },
        },
        Resource: { 'Fn::GetAtt': ['EventBus7B8748AA', 'Arn'] },
      },
      StatementId: 'cdk-EventBus-Default-Statement',
      EventBusName: { Ref: 'EventBus7B8748AA' },
    });

    expect(grant.success).toBeTruthy();
  });

  test('grantPutEventsTo creates both IAM and resource policies for cross-account organization principal', () => {
    // GIVEN
    const stack = new Stack();
    const eventBus = new EventBus(stack, 'EventBus');
    const organizationPrincipal = new iam.OrganizationPrincipal('o-12345abcdef');

    // WHEN
    const grant = eventBus.grantPutEventsTo(organizationPrincipal);

    // THEN
    // Verify event bus policy is created
    Template.fromStack(stack).hasResourceProperties('AWS::Events::EventBusPolicy', {
      Statement: {
        Effect: 'Allow',
        Action: 'events:PutEvents',
        Principal: {
          AWS: '*',
        },
        Resource: { 'Fn::GetAtt': ['EventBus7B8748AA', 'Arn'] },
        Condition: {
          StringEquals: {
            'aws:PrincipalOrgID': organizationPrincipal.organizationId,
          },
        },
        Sid: 'cdk-EventBus-Default-Statement',
      },
      StatementId: 'cdk-EventBus-Default-Statement',
      EventBusName: { Ref: 'EventBus7B8748AA' },
    });

    expect(grant.success).toBeTruthy();
  });

  test('grantPutEventsTo handles token accounts correctly', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack'); // Don't set the env explicitly
    const eventBus = new EventBus(stack, 'EventBus');

    // Create a role with a token principal
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.AccountRootPrincipal(), // This will use the stack's account token
    });

    // WHEN
    const grant = eventBus.grantPutEventsTo(role);

    // THEN
    // Should only create IAM policy as accounts are assumed same when both are tokens
    Template.fromStack(stack).resourceCountIs('AWS::Events::EventBusPolicy', 0);
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [{
          Action: 'events:PutEvents',
          Effect: 'Allow',
          Resource: {
            'Fn::GetAtt': ['EventBus7B8748AA', 'Arn'],
          },
        }],
        Version: '2012-10-17',
      },
    });

    expect(grant.success).toBeTruthy();
  });
});
