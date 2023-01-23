import { Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import { HostedZone, PublicHostedZone } from '@aws-cdk/aws-route53';
import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import { App, Stack, Token, Tags, RemovalPolicy, Aws } from '@aws-cdk/core';
import { DnsValidatedCertificate } from '../lib/dns-validated-certificate';

testDeprecated('creates CloudFormation Custom Resource', () => {
  const stack = new Stack();

  const exampleDotComZone = new PublicHostedZone(stack, 'ExampleDotCom', {
    zoneName: 'example.com',
  });

  new DnsValidatedCertificate(stack, 'Certificate', {
    domainName: 'test.example.com',
    hostedZone: exampleDotComZone,
    subjectAlternativeNames: ['test2.example.com'],
    cleanupRoute53Records: true,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::CustomResource', {
    DomainName: 'test.example.com',
    SubjectAlternativeNames: ['test2.example.com'],
    ServiceToken: {
      'Fn::GetAtt': [
        'CertificateCertificateRequestorFunction5E845413',
        'Arn',
      ],
    },
    HostedZoneId: {
      Ref: 'ExampleDotCom4D1B83AA',
    },
    CleanupRecords: 'true',
  });
  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
    Handler: 'index.certificateRequestHandler',
    Runtime: 'nodejs14.x',
    Timeout: 900,
  });
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
            'acm:AddTagsToCertificate',
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
          Condition: {
            'ForAllValues:StringEquals': {
              'route53:ChangeResourceRecordSetsRecordTypes': ['CNAME'],
              'route53:ChangeResourceRecordSetsActions': ['UPSERT', 'DELETE'],
            },
            'ForAllValues:StringLike': {
              'route53:ChangeResourceRecordSetsNormalizedRecordNames': [
                '*.test.example.com',
                '*.test2.example.com',
              ],
            },
          },
        },
      ],
    },
  });
});

testDeprecated('adds validation error on domain mismatch', () => {
  const stack = new Stack();

  const helloDotComZone = new PublicHostedZone(stack, 'HelloDotCom', {
    zoneName: 'hello.com',
  });

  new DnsValidatedCertificate(stack, 'Cert', {
    domainName: 'example.com',
    hostedZone: helloDotComZone,
  });

  expect(() => {
    Template.fromStack(stack);
  }).toThrow(/DNS zone hello.com is not authoritative for certificate domain name example.com/);
});

testDeprecated('does not try to validate unresolved tokens', () => {
  const stack = new Stack();

  const helloDotComZone = new PublicHostedZone(stack, 'HelloDotCom', {
    zoneName: Token.asString('hello.com'),
  });

  new DnsValidatedCertificate(stack, 'Cert', {
    domainName: 'hello.com',
    hostedZone: helloDotComZone,
  });

  Template.fromStack(stack); // does not throw
});

testDeprecated('test root certificate', () => {
  const stack = new Stack();

  const exampleDotComZone = new PublicHostedZone(stack, 'ExampleDotCom', {
    zoneName: 'example.com',
  });

  new DnsValidatedCertificate(stack, 'Cert', {
    domainName: 'example.com',
    hostedZone: exampleDotComZone,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::CustomResource', {
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

testDeprecated('test tags are passed to customresource', () => {
  const stack = new Stack();
  Tags.of(stack).add('Key1', 'Value1');

  const exampleDotComZone = new PublicHostedZone(stack, 'ExampleDotCom', {
    zoneName: 'example.com',
  });

  new DnsValidatedCertificate(stack, 'Cert', {
    domainName: 'example.com',
    hostedZone: exampleDotComZone,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::CustomResource', {
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
    Tags: {
      Key1: 'Value1',
    },
  });
});

testDeprecated('works with imported zone', () => {
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
  Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::CustomResource', {
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

testDeprecated('works with imported role', () => {
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
  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
    Role: 'arn:aws:iam::account-id:role/role-name',
  });
});


testDeprecated('throws when domain name is longer than 64 characters', () => {
  const stack = new Stack();

  const exampleDotComZone = new PublicHostedZone(stack, 'ExampleDotCom', {
    zoneName: 'example.com',
  });
  expect(() => {
    new DnsValidatedCertificate(stack, 'Cert', {
      domainName: 'example.com'.repeat(7),
      hostedZone: exampleDotComZone,
    });
  }).toThrow(/Domain name must be 64 characters or less/);
}),

testDeprecated('does not throw when domain name is longer than 64 characters with tokens', () => {
  const stack = new Stack();
  const zoneName = 'example.com';
  const exampleDotComZone = new PublicHostedZone(stack, 'ExampleDotCom', {
    zoneName,
  });
  const embededToken = Aws.REGION;
  const baseSubDomain = 'a'.repeat(65 - embededToken.length -1 -zoneName.length);
  const domainName = `${embededToken}${baseSubDomain}.${zoneName}`;

  new DnsValidatedCertificate(stack, 'Cert', {
    domainName,
    hostedZone: exampleDotComZone,
    transparencyLoggingEnabled: false,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::CustomResource', {
    ServiceToken: {
      'Fn::GetAtt': [
        'CertCertificateRequestorFunction98FDF273',
        'Arn',
      ],
    },
    DomainName: {
      'Fn::Join': [
        '',
        [
          {
            Ref: 'AWS::Region',
          },
          `${baseSubDomain}.${zoneName}`,
        ],
      ],
    },
    HostedZoneId: {
      Ref: 'ExampleDotCom4D1B83AA',
    },
    CertificateTransparencyLoggingPreference: 'DISABLED',
  });
});

testDeprecated('test transparency logging settings is passed to the custom resource', () => {
  const stack = new Stack();

  const exampleDotComZone = new PublicHostedZone(stack, 'ExampleDotCom', {
    zoneName: 'example.com',
  });

  new DnsValidatedCertificate(stack, 'Cert', {
    domainName: 'example.com',
    hostedZone: exampleDotComZone,
    transparencyLoggingEnabled: false,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::CustomResource', {
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
    CertificateTransparencyLoggingPreference: 'DISABLED',
  });
});

testDeprecated('can set removal policy', () => {
  const stack = new Stack();

  const exampleDotComZone = new PublicHostedZone(stack, 'ExampleDotCom', {
    zoneName: 'example.com',
  });

  const cert = new DnsValidatedCertificate(stack, 'Certificate', {
    domainName: 'test.example.com',
    hostedZone: exampleDotComZone,
    subjectAlternativeNames: ['test2.example.com'],
    cleanupRoute53Records: true,
  });
  cert.applyRemovalPolicy(RemovalPolicy.RETAIN);

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::CustomResource', {
    DomainName: 'test.example.com',
    SubjectAlternativeNames: ['test2.example.com'],
    RemovalPolicy: 'retain',
    ServiceToken: {
      'Fn::GetAtt': [
        'CertificateCertificateRequestorFunction5E845413',
        'Arn',
      ],
    },
    HostedZoneId: {
      Ref: 'ExampleDotCom4D1B83AA',
    },
    CleanupRecords: 'true',
  });
});
