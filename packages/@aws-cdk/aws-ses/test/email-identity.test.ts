import { Template } from '@aws-cdk/assertions';
import * as route53 from '@aws-cdk/aws-route53';
import { SecretValue, Stack } from '@aws-cdk/core';
import { ConfigurationSet, DkimIdentity, EmailIdentity, Identity, MailFromBehaviorOnMxFailure } from '../lib';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('default email identity for a domain', () => {
  new EmailIdentity(stack, 'Identity', {
    identity: Identity.domain('cdk.dev'),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::SES::EmailIdentity', {
    EmailIdentity: 'cdk.dev',
  });
});

test('email identity from a hosted zone with easy dkim', () => {
  const hostedZone = new route53.PublicHostedZone(stack, 'HostedZone', {
    zoneName: 'cdk.dev',
  });

  new EmailIdentity(stack, 'Identity', {
    identity: Identity.publicHostedZone(hostedZone),
    configurationSet: new ConfigurationSet(stack, 'ConfigurationSet'),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::SES::EmailIdentity', {
    EmailIdentity: 'cdk.dev',
    ConfigurationSetAttributes: {
      ConfigurationSetName: {
        Ref: 'ConfigurationSet3DD38186',
      },
    },
  });

  Template.fromStack(stack).resourceCountIs('AWS::Route53::RecordSet', 3);

  Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
    Name: {
      'Fn::GetAtt': [
        'Identity2D60E2CC',
        'DkimDNSTokenName1',
      ],
    },
    Type: 'CNAME',
    HostedZoneId: {
      Ref: 'HostedZoneDB99F866',
    },
    ResourceRecords: [
      {
        'Fn::GetAtt': [
          'Identity2D60E2CC',
          'DkimDNSTokenValue1',
        ],
      },
    ],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
    Name: {
      'Fn::GetAtt': [
        'Identity2D60E2CC',
        'DkimDNSTokenName2',
      ],
    },
    Type: 'CNAME',
    HostedZoneId: {
      Ref: 'HostedZoneDB99F866',
    },
    ResourceRecords: [
      {
        'Fn::GetAtt': [
          'Identity2D60E2CC',
          'DkimDNSTokenValue2',
        ],
      },
    ],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
    Name: {
      'Fn::GetAtt': [
        'Identity2D60E2CC',
        'DkimDNSTokenName3',
      ],
    },
    Type: 'CNAME',
    HostedZoneId: {
      Ref: 'HostedZoneDB99F866',
    },
    ResourceRecords: [
      {
        'Fn::GetAtt': [
          'Identity2D60E2CC',
          'DkimDNSTokenValue3',
        ],
      },
    ],
  });
});

test('email identity from a hosted zone with BYO dkim', () => {
  const hostedZone = new route53.PublicHostedZone(stack, 'HostedZone', {
    zoneName: 'cdk.dev',
  });

  new EmailIdentity(stack, 'Identity', {
    identity: Identity.publicHostedZone(hostedZone),
    dkimIdentity: DkimIdentity.byoDkim({
      privateKey: SecretValue.secretsManager('my-secret'),
      selector: 'selector',
      publicKey: 'public-key',
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::SES::EmailIdentity', {
    EmailIdentity: 'cdk.dev',
    DkimSigningAttributes: {
      DomainSigningPrivateKey: '{{resolve:secretsmanager:my-secret:SecretString:::}}',
      DomainSigningSelector: 'selector',
    },
  });

  Template.fromStack(stack).resourceCountIs('AWS::Route53::RecordSet', 1);

  Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
    Name: 'selector._domainkey.cdk.dev.',
    Type: 'TXT',
    HostedZoneId: {
      Ref: 'HostedZoneDB99F866',
    },
    ResourceRecords: [
      '"p=public-key"',
    ],
  });
});

test('with mail from and hosted zone', () => {
  const hostedZone = new route53.PublicHostedZone(stack, 'HostedZone', {
    zoneName: 'cdk.dev',
  });

  new EmailIdentity(stack, 'Identity', {
    identity: Identity.publicHostedZone(hostedZone),
    mailFromDomain: 'mail.cdk.dev',
    mailFromBehaviorOnMxFailure: MailFromBehaviorOnMxFailure.REJECT_MESSAGE,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::SES::EmailIdentity', {
    MailFromAttributes: {
      BehaviorOnMxFailure: 'REJECT_MESSAGE',
      MailFromDomain: 'mail.cdk.dev',
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
    Name: 'mail.cdk.dev.',
    Type: 'MX',
    HostedZoneId: {
      Ref: 'HostedZoneDB99F866',
    },
    ResourceRecords: [
      {
        'Fn::Join': [
          '',
          [
            '10 feedback-smtp.',
            {
              Ref: 'AWS::Region',
            },
            '.amazonses.com',
          ],
        ],
      },
    ],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
    Name: 'mail.cdk.dev.',
    Type: 'TXT',
    HostedZoneId: {
      Ref: 'HostedZoneDB99F866',
    },
    ResourceRecords: [
      '"v=spf1 include:amazonses.com ~all"',
    ],
  });
});

