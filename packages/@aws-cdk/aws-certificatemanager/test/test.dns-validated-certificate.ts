import { expect, haveResource } from '@aws-cdk/assert';
import iam = require('@aws-cdk/aws-iam');
import { HostedZone, PublicHostedZone } from '@aws-cdk/aws-route53';
import { App, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { DnsValidatedCertificate } from '../lib/dns-validated-certificate';

export = {
  'creates CloudFormation Custom Resource'(test: Test) {
    const stack = new Stack();

    const exampleDotComZone = new PublicHostedZone(stack, 'ExampleDotCom', {
      zoneName: 'example.com'
    });

    new DnsValidatedCertificate(stack, 'Certificate', {
      domainName: 'test.example.com',
      hostedZone: exampleDotComZone,
    });

    expect(stack).to(haveResource('AWS::CloudFormation::CustomResource', {
      DomainName: 'test.example.com',
      ServiceToken: {
        'Fn::GetAtt': [
          'CertificateCertificateRequestorFunction5E845413',
          'Arn'
        ]
      },
      HostedZoneId: {
        Ref: 'ExampleDotCom4D1B83AA',
      }
    }));
    expect(stack).to(haveResource('AWS::Lambda::Function', {
      Handler: 'index.certificateRequestHandler',
      Runtime: 'nodejs8.10',
      Timeout: 900,
    }));
    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyName: 'CertificateCertificateRequestorFunctionServiceRoleDefaultPolicy3C8845BC',
      Roles: [
        {
          Ref: 'CertificateCertificateRequestorFunctionServiceRoleC04C13DA',
        }
      ],
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: [
              'acm:RequestCertificate',
              'acm:DescribeCertificate',
              'acm:DeleteCertificate'
            ],
            Effect: 'Allow',
            Resource: '*'
          },
          {
            Action: 'route53:GetChange',
            Effect: 'Allow',
            Resource: '*'
          },
          {
            Action: 'route53:changeResourceRecordSets',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:aws:route53:::hostedzone/',
                  {
                    Ref: 'ExampleDotCom4D1B83AA'
                  }
                ]
              ]
            }
          },
        ],
      }
    }));

    test.done();
  },

  'adds validation error on domain mismatch'(test: Test) {
    const stack = new Stack();

    const helloDotComZone = new PublicHostedZone(stack, 'HelloDotCom', {
      zoneName: 'hello.com'
    });

    new DnsValidatedCertificate(stack, 'Cert', {
      domainName: 'example.com',
      hostedZone: helloDotComZone,
    });

    // a bit of a hack: expect(stack) will trigger validation.
    test.throws(() => expect(stack), /DNS zone hello.com is not authoritative for certificate domain name example.com/);
    test.done();
  },

  'test root certificate'(test: Test) {
    const stack = new Stack();

    const exampleDotComZone = new PublicHostedZone(stack, 'ExampleDotCom', {
      zoneName: 'example.com'
    });

    new DnsValidatedCertificate(stack, 'Cert', {
      domainName: 'example.com',
      hostedZone: exampleDotComZone,
    });

    expect(stack).to(haveResource('AWS::CloudFormation::CustomResource', {
        ServiceToken: {
        'Fn::GetAtt': [
          'CertCertificateRequestorFunction98FDF273',
          'Arn'
          ]
        },
        DomainName: 'example.com',
        HostedZoneId: {
          Ref: 'ExampleDotCom4D1B83AA'
        }
      }));
    test.done();
  },

  'works with imported zone'(test: Test) {
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
    });

    // THEN
    expect(stack).to(haveResource('AWS::CloudFormation::CustomResource', {
        ServiceToken: {
        'Fn::GetAtt': [
          'CertCertificateRequestorFunction98FDF273',
          'Arn'
          ]
        },
        DomainName: 'mydomain.com',
        HostedZoneId: 'DUMMY'
      }));

    test.done();
  },

  'works with imported role'(test: Test) {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'Stack', {
      env: { account: '12345678', region: 'us-blue-5' },
    });
    const helloDotComZone = new PublicHostedZone(stack, 'HelloDotCom', {
      zoneName: 'hello.com'
    });
    const role = iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::account-id:role/role-name');

    // WHEN
    new DnsValidatedCertificate(stack, 'Cert', {
      domainName: 'hello.com',
      hostedZone: helloDotComZone,
      customResourceRole: role
    });

    // THEN
    expect(stack).to(haveResource('AWS::Lambda::Function', {
      Role: 'arn:aws:iam::account-id:role/role-name'
    }));

    test.done();
  },
};
