import '@aws-cdk/assert-internal/jest';
import { SynthUtils } from '@aws-cdk/assert-internal';
import * as iam from '@aws-cdk/aws-iam';
import { HostedZone, PublicHostedZone } from '@aws-cdk/aws-route53';
import { App, Stack, Token } from '@aws-cdk/core';
import { DnsValidatedCertificate } from '../lib/dns-validated-certificate';

test('creates CloudFormation Custom Resource', () => {
  const stack = new Stack();

  const exampleDotComZone = new PublicHostedZone(stack, 'ExampleDotCom', {
    zoneName: 'example.com',
  });

  new DnsValidatedCertificate(stack, 'Certificate', {
    domainName: 'test.example.com',
    hostedZone: exampleDotComZone,
  });

  expect(stack).toHaveResource('AWS::CloudFormation::CustomResource', {
    DomainName: 'test.example.com',
    ServiceToken: {
      'Fn::GetAtt': [
        'CertificateCertificateRequestorFunction5E845413',
        'Arn',
      ],
    },
    HostedZoneId: {
      Ref: 'ExampleDotCom4D1B83AA',
    },
  });
  expect(stack).toHaveResource('AWS::Lambda::Function', {
    Handler: 'index.certificateRequestHandler',
    Runtime: 'nodejs14.x',
    Timeout: 900,
  });
  expect(stack).toHaveResource('AWS::IAM::Policy', {
    PolicyName: 'CertificateCertificateRequestorFunctionServiceRoleDefaultPolicy3C8845BC',
    Roles: [
      {
        Ref: 'CertificateCertificateRequestorFunctionServiceRoleC04C13DA',
      },
    ],
    PolicyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: [
            'acm:RequestCertificate',
            'acm:DescribeCertificate',
            'acm:DeleteCertificate',
          ],
          Effect: 'Allow',
          Resource: '*',
        },
        {
          Action: 'route53:GetChange',
          Effect: 'Allow',
          Resource: '*',
        },
        {
          Action: 'route53:changeResourceRecordSets',
          Effect: 'Allow',
          Resource: {
            'Fn::Join': [
              '',
              [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':route53:::hostedzone/',
                { Ref: 'ExampleDotCom4D1B83AA' },
              ],
            ],
          },
        },
      ],
    },
  });
});

test('adds validation error on domain mismatch', () => {
  const stack = new Stack();

  const helloDotComZone = new PublicHostedZone(stack, 'HelloDotCom', {
    zoneName: 'hello.com',
  });

  new DnsValidatedCertificate(stack, 'Cert', {
    domainName: 'example.com',
    hostedZone: helloDotComZone,
  });

  expect(() => {
    SynthUtils.synthesize(stack);
  }).toThrow(/DNS zone hello.com is not authoritative for certificate domain name example.com/);
});

test('does not try to validate unresolved tokens', () => {
  const stack = new Stack();

  const helloDotComZone = new PublicHostedZone(stack, 'HelloDotCom', {
    zoneName: Token.asString('hello.com'),
  });

  new DnsValidatedCertificate(stack, 'Cert', {
    domainName: 'hello.com',
    hostedZone: helloDotComZone,
  });

  SynthUtils.synthesize(stack); // does not throw
});

test('test root certificate', () => {
  const stack = new Stack();

  const exampleDotComZone = new PublicHostedZone(stack, 'ExampleDotCom', {
    zoneName: 'example.com',
  });

  new DnsValidatedCertificate(stack, 'Cert', {
    domainName: 'example.com',
    hostedZone: exampleDotComZone,
  });

  expect(stack).toHaveResource('AWS::CloudFormation::CustomResource', {
    ServiceToken: {
      'Fn::GetAtt': [
        'CertCertificateRequestorFunction98FDF273',
        'Arn',
      ],
    },
    DomainName: 'example.com',
    HostedZoneId: {
      Ref: 'ExampleDotCom4D1B83AA',
    },
  });
});

test('works with imported zone', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    env: { account: '12345678', region: 'us-blue-5' },
  });
  const imported = HostedZone.fromLookup(stack, 'ExampleDotCom', {
    domainName: 'mydomain.com',
  });

  // WHEN
  new DnsValidatedCertificate(stack, 'Cert', {
    domainName: 'mydomain.com',
    hostedZone: imported,
    route53Endpoint: 'https://api.route53.xxx.com',
  });

  // THEN
  expect(stack).toHaveResource('AWS::CloudFormation::CustomResource', {
    ServiceToken: {
      'Fn::GetAtt': [
        'CertCertificateRequestorFunction98FDF273',
        'Arn',
      ],
    },
    DomainName: 'mydomain.com',
    HostedZoneId: 'DUMMY',
    Route53Endpoint: 'https://api.route53.xxx.com',
  });
});

test('works with imported role', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    env: { account: '12345678', region: 'us-blue-5' },
  });
  const helloDotComZone = new PublicHostedZone(stack, 'HelloDotCom', {
    zoneName: 'hello.com',
  });
  const role = iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::account-id:role/role-name');

  // WHEN
  new DnsValidatedCertificate(stack, 'Cert', {
    domainName: 'hello.com',
    hostedZone: helloDotComZone,
    customResourceRole: role,
  });

  // THEN
  expect(stack).toHaveResource('AWS::Lambda::Function', {
    Role: 'arn:aws:iam::account-id:role/role-name',
  });
});
