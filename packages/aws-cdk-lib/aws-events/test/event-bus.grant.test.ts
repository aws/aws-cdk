import { Annotations, Template, Match } from '../../assertions';
import * as iam from '../../aws-iam';
import { App, Stack, Token } from '../../core';
import * as cxapi from '../../cx-api';
import { EventBus } from '../lib';

describe('EventBus grants', () => {
  describe('with feature flag EVENTBUS_POLICY_SID_REQUIRED enabled', () => {
    let app: App;
    let stack: Stack;
    let eventBus: EventBus;
    const defaultSid = 'DefaultSid';

    beforeEach(() => {
      app = new App({
        context: {
          [cxapi.EVENTBUS_POLICY_SID_REQUIRED]: true,
        },
      });
      stack = new Stack(app, 'Stack1');
      eventBus = new EventBus(stack, 'EventBus');
    });

    describe('same-account scenarios', () => {
      test('grantPutEventsTo creates IAM policy for IAM principal', () => {
        // GIVEN
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
        Template.fromStack(stack).resourceCountIs('AWS::Events::EventBusPolicy', 0); // Verify no resource policy
        Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 1); // Verify exactly one IAM policy
        expect(grant.principalStatement).toBeDefined(); // Verify principal policy was created
        expect(grant.resourceStatement).toBeUndefined(); // Verify no resource policy was created
        expect(grant.success).toBeTruthy();
      });

      test('grantPutEventsTo creates EventBusPolicy for service principal even with same account', () => {
        // GIVEN
        const servicePrincipal = new iam.ServicePrincipal('states.amazonaws.com', {
          conditions: {
            StringEquals: {
              'aws:SourceAccount': Stack.of(stack).account,
            },
          },
        });

        // WHEN
        const grant = eventBus.grantPutEventsTo(servicePrincipal, defaultSid);

        // THEN
        // Service principals always get resource policy, regardless of account
        Template.fromStack(stack).resourceCountIs('AWS::Events::EventBusPolicy', 1);
        Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 0);
        expect(grant.success).toBeTruthy();
        expect(grant.principalStatement).toBeUndefined();
        expect(grant.resourceStatement).toBeDefined();
      });

      test('imported EventBus grants create IAM policy and no warnings', () => {
        // GIVEN
        const importedEventBus = EventBus.fromEventBusArn(stack, 'ImportedBus', eventBus.eventBusArn);
        const role = new iam.Role(stack, 'Role', {
          assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        });

        // WHEN
        const grant = importedEventBus.grantPutEventsTo(role);

        // THEN
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

        // Verify no warnings were created
        const warnings = Annotations.fromStack(stack).findWarning('*', Match.anyValue());
        expect(warnings).toHaveLength(0);

        expect(grant.success).toBeTruthy();
      });
    });

    describe('cross-account scenarios', () => {
      test('grantPutEventsTo creates EventBusPolicy for service principal without conditions', () => {
        // GIVEN
        const servicePrincipal = new iam.ServicePrincipal('states.amazonaws.com');

        // WHEN
        const grant = eventBus.grantPutEventsTo(servicePrincipal, defaultSid);

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::Events::EventBusPolicy', {
          Statement: {
            Effect: 'Allow',
            Action: 'events:PutEvents',
            Principal: { Service: 'states.amazonaws.com' },
            Resource: { 'Fn::GetAtt': ['EventBus7B8748AA', 'Arn'] },
          },
          StatementId: `cdk-${defaultSid}`,
          EventBusName: { Ref: 'EventBus7B8748AA' },
        });

        expect(grant.success).toBeTruthy();

        Template.fromStack(stack).resourceCountIs('AWS::Events::EventBusPolicy', 1); // Verify exactly one resource policy
        Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 0); // Verify no IAM policy

        // Verify no unexpected properties in the policy
        Template.fromStack(stack).hasResourceProperties('AWS::Events::EventBusPolicy', {
          Statement: Match.objectLike({
            Effect: 'Allow',
            Action: 'events:PutEvents',
            Principal: { Service: 'states.amazonaws.com' },
            Resource: Match.anyValue(),
            Condition: Match.absent(),
          }),
        });
      });

      test('grantPutEventsTo creates both IAM and resource policies for cross-account service principal', () => {
        // GIVEN
        const servicePrincipal = new iam.ServicePrincipal('states.amazonaws.com', {
          conditions: {
            StringEquals: {
              'aws:SourceAccount': '123456789012',
            },
          },
        });

        // WHEN
        const grant = eventBus.grantPutEventsTo(servicePrincipal, defaultSid);

        // THEN
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
          StatementId: `cdk-${defaultSid}`,
          EventBusName: { Ref: 'EventBus7B8748AA' },
        });

        expect(grant.success).toBeTruthy();
      });

      test('grantPutEventsTo creates both IAM and resource policies for cross-account role principal', () => {
        // GIVEN
        const otherAccountRole = new iam.AccountPrincipal('123456789012');

        // WHEN
        const grant = eventBus.grantPutEventsTo(otherAccountRole, defaultSid);

        // THEN
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
          StatementId: `cdk-${defaultSid}`,
          EventBusName: { Ref: 'EventBus7B8748AA' },
        });

        expect(grant.success).toBeTruthy();
      });

      test('grantPutEventsTo creates both IAM and resource policies for cross-account organization principal', () => {
        // GIVEN
        const organizationPrincipal = new iam.OrganizationPrincipal('o-12345abcdef');

        // WHEN
        const grant = eventBus.grantPutEventsTo(organizationPrincipal, defaultSid);

        // THEN
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
            Sid: `cdk-${defaultSid}`,
          },
          StatementId: `cdk-${defaultSid}`,
          EventBusName: { Ref: 'EventBus7B8748AA' },
        });

        expect(grant.success).toBeTruthy();

        Template.fromStack(stack).resourceCountIs('AWS::Events::EventBusPolicy', 1);
        Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 0);

        // Verify all required parts of the organization policy
        Template.fromStack(stack).hasResourceProperties('AWS::Events::EventBusPolicy', {
          Statement: Match.objectLike({
            Effect: 'Allow',
            Action: 'events:PutEvents',
            Principal: { AWS: '*' },
            Resource: Match.anyValue(),
            Condition: {
              StringEquals: {
                'aws:PrincipalOrgID': Match.exact('o-12345abcdef'),
              },
            },
          }),
        });
      });
    });

    describe('imported event bus scenarios', () => {
      test('grantPutEventsTo handles imported bus with service principal', () => {
        // GIVEN
        const importedEventBus = EventBus.fromEventBusName(stack, 'ImportedBus', 'external-bus');
        const servicePrincipal = new iam.ServicePrincipal('states.amazonaws.com');

        // WHEN
        const grant = importedEventBus.grantPutEventsTo(servicePrincipal);

        // THEN
        // No policies created since we can't add resource policy to imported bus
        Template.fromStack(stack).resourceCountIs('AWS::Events::EventBusPolicy', 0);

        // Warning is added because service principals require resource policy
        // and we can't add it to imported bus
        Annotations.fromStack(stack).hasWarning('/Stack1/ImportedBus',
          Match.stringLikeRegexp('Unable to add necessary permissions to imported target event bus: arn:\\${Token\\[AWS\\.Partition\\.[0-9]+\\]}:events:\\${Token\\[AWS\\.Region\\.[0-9]+\\]}:\\${Token\\[AWS\\.AccountId\\.[0-9]+\\]}:event-bus/external-bus \\[ack: @aws-cdk/aws-events:eventBusAddToResourcePolicy\\]'),
        );

        // Grant still succeeds
        expect(grant.success).toBeTruthy();
      });

      test('grantPutEventsTo creates IAM policy for imported EventBus using fromEventBusName', () => {
        // GIVEN
        const importedEventBus = EventBus.fromEventBusName(stack, 'ImportedBus', eventBus.eventBusName);
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
                  ':event-bus/',
                  { Ref: 'EventBus7B8748AA' },
                ]],
              },
            }],
            Version: '2012-10-17',
          },
        });

        expect(grant.success).toBeTruthy();
      });
    });

    describe('token handling', () => {
      test('grantPutEventsTo handles token accounts correctly', () => {
        // GIVEN
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
        Template.fromStack(stack).resourceCountIs('AWS::Events::EventBusPolicy', 0);
        Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 1);

        // Verify the grant details
        expect(grant.principalStatement).toBeDefined();
        expect(grant.resourceStatement).toBeUndefined();
        expect(grant.success).toBeTruthy();

        // Verify no warnings were created
        const warnings = Annotations.fromStack(stack).findWarning('*', Match.anyValue());
        expect(warnings).toHaveLength(0);
      });
    });

    describe('cross-stack scenarios', () => {
      test('grantPutEventsTo works across stacks', () => {
        // GIVEN
        const stack2 = new Stack(app, 'Stack2');
        const role = new iam.Role(stack2, 'Role', {
          assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        });

        // WHEN
        const grant = eventBus.grantPutEventsTo(role, defaultSid);

        // THEN
        // Only IAM policy is needed, no resource policy required for same account
        Template.fromStack(stack).resourceCountIs('AWS::Events::EventBusPolicy', 0);

        Template.fromStack(stack2).hasResourceProperties('AWS::IAM::Policy', {
          PolicyDocument: {
            Statement: [{
              Action: 'events:PutEvents',
              Effect: 'Allow',
              Resource: {
                'Fn::ImportValue': Match.stringLikeRegexp('Stack1:ExportsOutput.*'),
              },
            }],
            Version: '2012-10-17',
          },
        });

        expect(grant.success).toBeTruthy();
      });

      test('grantPutEventsTo works across stacks with imported event bus', () => {
        // GIVEN
        const stack2 = new Stack(app, 'Stack2');
        const importedBus = EventBus.fromEventBusArn(stack2, 'ImportedBus', eventBus.eventBusArn);
        const role = new iam.Role(stack2, 'Role', {
          assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        });

        // WHEN
        const grant = importedBus.grantPutEventsTo(role);

        // THEN
        Template.fromStack(stack2).hasResourceProperties('AWS::IAM::Policy', {
          PolicyDocument: {
            Statement: [{
              Action: 'events:PutEvents',
              Effect: 'Allow',
              Resource: {
                'Fn::ImportValue': Match.stringLikeRegexp('Stack1:ExportsOutputFnGetAtt.*'),
              },
            }],
            Version: '2012-10-17',
          },
        });

        expect(grant.success).toBeTruthy();
      });
    });

    describe('multiple grants', () => {
      test('multiple grantPutEventsTo calls to different types of principals', () => {
        // GIVEN
        const servicePrincipal = new iam.ServicePrincipal('states.amazonaws.com');
        const role = new iam.Role(stack, 'Role', {
          assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        });
        const accountPrincipal = new iam.AccountPrincipal('123456789012');

        // WHEN
        const grant1 = eventBus.grantPutEventsTo(servicePrincipal, `${defaultSid}-1`);
        const grant2 = eventBus.grantPutEventsTo(role, `${defaultSid}-2`);
        const grant3 = eventBus.grantPutEventsTo(accountPrincipal, `${defaultSid}-3`);

        // THEN
        // Verify policies are created
        const template = Template.fromStack(stack);

        // Verify service principal gets resource policy
        template.hasResourceProperties('AWS::Events::EventBusPolicy', {
          Statement: Match.objectLike({
            Effect: 'Allow',
            Action: 'events:PutEvents',
            Principal: { Service: 'states.amazonaws.com' },
          }),
        });

        // Verify role gets IAM policy
        template.hasResourceProperties('AWS::IAM::Policy', {
          PolicyDocument: {
            Statement: [{
              Action: 'events:PutEvents',
              Effect: 'Allow',
              Resource: {
                'Fn::GetAtt': ['EventBus7B8748AA', 'Arn'],
              },
            }],
          },
        });

        // Verify cross-account principal gets resource policy
        template.hasResourceProperties('AWS::Events::EventBusPolicy', {
          Statement: Match.objectLike({
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
          }),
        });

        // Count total policies
        template.resourceCountIs('AWS::Events::EventBusPolicy', 2); // Service principal and account principal
        template.resourceCountIs('AWS::IAM::Policy', 1); // Role

        // Verify all grants succeeded
        expect(grant1.success && grant2.success && grant3.success).toBeTruthy();
      });

      test('multiple grantPutEventsTo calls to different IAM principals create separate policies', () => {
        // GIVEN
        const role1 = new iam.Role(stack, 'Role1', {
          assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        });
        const role2 = new iam.Role(stack, 'Role2', {
          assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        });

        // WHEN
        const grant1 = eventBus.grantPutEventsTo(role1, `${defaultSid}-1`);
        const grant2 = eventBus.grantPutEventsTo(role2, `${defaultSid}-2`);

        // THEN
        Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 2);
        expect(grant1.success).toBeTruthy();
        expect(grant2.success).toBeTruthy();
      });
    });
  });

  describe('with feature flag EVENTBUS_POLICY_SID_REQUIRED disabled', () => {
    let app: App;
    let stack: Stack;
    let eventBus: EventBus;

    beforeEach(() => {
      app = new App({
        context: {
          [cxapi.EVENTBUS_POLICY_SID_REQUIRED]: false,
        },
      });
      stack = new Stack(app, 'Stack1');
      eventBus = new EventBus(stack, 'EventBus');
    });

    describe('feature flag behavior', () => {
      test('service principals get warning and dropped grant', () => {
        // GIVEN
        const servicePrincipal = new iam.ServicePrincipal('states.amazonaws.com');

        // WHEN
        const grant = eventBus.grantPutEventsTo(servicePrincipal);

        // THEN
        Template.fromStack(stack).resourceCountIs('AWS::Events::EventBusPolicy', 0);
        Annotations.fromStack(stack).hasWarning('/Stack1/EventBus',
          'Unable to grant PutEvents to service principal: Statement ID is required for EventBus resource policies. Either provide a \'sid\' parameter or enable the \'@aws-cdk/aws-events:requireEventBusPolicySid\' feature flag. [ack: @aws-cdk/aws-events:eventBusServicePrincipalGrant]');
        expect(grant.success).toBeFalsy();
      });

      test('providing sid still results in warning and dropped grant when feature flag is disabled', () => {
        // GIVEN
        const servicePrincipal = new iam.ServicePrincipal('states.amazonaws.com');
        const explicitSid = 'MyCustomSid';

        // WHEN
        const grant = eventBus.grantPutEventsTo(servicePrincipal, explicitSid);

        // THEN
        // Verify no resource policy is created
        Template.fromStack(stack).resourceCountIs('AWS::Events::EventBusPolicy', 0);

        // Verify warning is still issued even with sid
        Annotations.fromStack(stack).hasWarning('/Stack1/EventBus',
          'Unable to grant PutEvents to service principal: Statement ID is required for EventBus resource policies. Either provide a \'sid\' parameter or enable the \'@aws-cdk/aws-events:requireEventBusPolicySid\' feature flag. [ack: @aws-cdk/aws-events:eventBusServicePrincipalGrant]');

        expect(grant.success).toBeFalsy();
      });
    });
  });
});
