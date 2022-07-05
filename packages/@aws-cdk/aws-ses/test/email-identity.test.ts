import { Template } from '@aws-cdk/assertions';
import { SecretValue, Stack } from '@aws-cdk/core';
import { ConfigurationSet, DkimIdentity, EmailIdentity, MailFromBehaviorOnMxFailure } from '../lib';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('default email identity', () => {
  new EmailIdentity(stack, 'Identity', {
    identity: 'cdk.dev',
  });

  Template.fromStack(stack).hasResourceProperties('AWS::SES::EmailIdentity', {
    EmailIdentity: 'cdk.dev',
  });
});

test('email identity with options', () => {
  new EmailIdentity(stack, 'Identity', {
    identity: 'cdk.dev',
    configurationSet: new ConfigurationSet(stack, 'ConfigurationSet'),
    dkimIdentity: DkimIdentity.byodDkim(SecretValue.secretsManager('my-secret'), 'selector'),
    mailFromDomain: 'mail.cdk.dev',
    mailFromBehaviorOnMxFailure: MailFromBehaviorOnMxFailure.REJECT_MESSAGE,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::SES::EmailIdentity', {
    EmailIdentity: 'cdk.dev',
    ConfigurationSetAttributes: {
      ConfigurationSetName: {
        Ref: 'ConfigurationSet3DD38186',
      },
    },
    DkimSigningAttributes: {
      DomainSigningPrivateKey: '{{resolve:secretsmanager:my-secret:SecretString:::}}',
      DomainSigningSelector: 'selector',
    },
    MailFromAttributes: {
      BehaviorOnMxFailure: 'REJECT_MESSAGE',
      MailFromDomain: 'mail.cdk.dev',
    },
  });
});

