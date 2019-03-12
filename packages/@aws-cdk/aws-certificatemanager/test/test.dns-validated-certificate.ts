import { expect, haveResource } from '@aws-cdk/assert';
import { PublicHostedZone } from '@aws-cdk/aws-route53';
import { Stack } from '@aws-cdk/cdk';
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

  'export and import'(test: Test) {
    const stack = new Stack();

    const helloDotComZone = new PublicHostedZone(stack, 'HelloDotCom', {
      zoneName: 'hello.com'
    });

    const refProps = new DnsValidatedCertificate(stack, 'Cert', {
      domainName: 'hello.com',
      hostedZone: helloDotComZone,
    }).export();

    test.ok('certificateArn' in refProps);
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
};
