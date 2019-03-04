import { expect, haveResource } from '@aws-cdk/assert';
import { PublicHostedZone } from '@aws-cdk/aws-route53';
import { Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { DNSValidatedCertificate } from '../lib/dns-validated-certificate';

export = {
  'creates CloudFormation Custom Resource'(test: Test) {
    const stack = new Stack();

    const exampleDotComZone = new PublicHostedZone(stack, 'ExampleDotCom', {
      zoneName: 'example.com'
    });

    const cert = new DNSValidatedCertificate(stack, 'Certificate', {
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

    const errors = cert.validate();
    test.equal(errors.length, 0);

    test.done();
  },

  'export and import'(test: Test) {
    const stack = new Stack();

    const helloDotComZone = new PublicHostedZone(stack, 'HelloDotCom', {
      zoneName: 'hello.com'
    });

    const refProps = new DNSValidatedCertificate(stack, 'Cert', {
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

    const cert = new DNSValidatedCertificate(stack, 'Cert', {
      domainName: 'example.com',
      hostedZone: helloDotComZone,
    });

    const errors = cert.validate();
    test.equal(errors.length, 1);

    test.done();
  },
};
