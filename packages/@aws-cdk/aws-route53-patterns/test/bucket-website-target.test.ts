import { Template } from '@aws-cdk/assertions';
import { Certificate } from '@aws-cdk/aws-certificatemanager';
import { HostedZone } from '@aws-cdk/aws-route53';
import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import { App, Stack } from '@aws-cdk/core';
import { ROUTE53_PATTERNS_USE_CERTIFICATE } from '@aws-cdk/cx-api';
import { HttpsRedirect } from '../lib';

testDeprecated('create HTTPS redirect', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'test', { env: { region: 'us-east-1' } });

  // WHEN
  new HttpsRedirect(stack, 'Redirect', {
    recordNames: ['foo.example.com', 'baz.example.com'],
    targetDomain: 'bar.example.com',
    zone: HostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
      hostedZoneId: 'ID',
      zoneName: 'example.com',
    }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
    WebsiteConfiguration: {
      RedirectAllRequestsTo: {
        HostName: 'bar.example.com',
        Protocol: 'https',
      },
    },
    PublicAccessBlockConfiguration: {
      BlockPublicAcls: true,
      BlockPublicPolicy: true,
      IgnorePublicAcls: true,
      RestrictPublicBuckets: true,
    },
  });
  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      Aliases: ['foo.example.com', 'baz.example.com'],
      DefaultRootObject: '',
    },
  });
  Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
    Type: 'A',
    Name: 'foo.example.com.',
    HostedZoneId: 'ID',
  });
  Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
    Type: 'AAAA',
    Name: 'foo.example.com.',
    HostedZoneId: 'ID',
  });
  Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
    Type: 'A',
    Name: 'baz.example.com.',
    HostedZoneId: 'ID',
  });
  Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
    Type: 'AAAA',
    Name: 'baz.example.com.',
    HostedZoneId: 'ID',
  });
});

testDeprecated('create HTTPS redirect for apex', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'test', { env: { region: 'us-east-1' } });

  // WHEN
  new HttpsRedirect(stack, 'Redirect', {
    targetDomain: 'bar.example.com',
    zone: HostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
      hostedZoneId: 'ID',
      zoneName: 'example.com',
    }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
    WebsiteConfiguration: {
      RedirectAllRequestsTo: {
        HostName: 'bar.example.com',
        Protocol: 'https',
      },
    },
  });
  Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
    Type: 'A',
    Name: 'example.com.',
  });
  Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
    Type: 'AAAA',
    Name: 'example.com.',
  });
});

testDeprecated('create HTTPS redirect with existing cert', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'test', { env: { region: 'us-east-1' } });

  // WHEN
  new HttpsRedirect(stack, 'Redirect', {
    recordNames: ['foo.example.com'],
    certificate: Certificate.fromCertificateArn(
      stack, 'Certificate', 'arn:aws:acm:us-east-1:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d',
    ),
    targetDomain: 'bar.example.com',
    zone: HostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
      hostedZoneId: 'ID',
      zoneName: 'example.com',
    }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
    WebsiteConfiguration: {
      RedirectAllRequestsTo: {
        HostName: 'bar.example.com',
        Protocol: 'https',
      },
    },
  });
  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      ViewerCertificate: {
        AcmCertificateArn: 'arn:aws:acm:us-east-1:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d',
      },
    },
  });
});

test('throws when certificate in region other than us-east-1 is supplied', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'test', { env: { region: 'us-east-1' } });
  const certificate = Certificate.fromCertificateArn(
    stack, 'Certificate', 'arn:aws:acm:us-east-2:123456789012:certificate/11-3336f1-44483d-adc7-9cd375c5169d',
  );

  // WHEN / THEN
  expect(() => {
    new HttpsRedirect(stack, 'Redirect', {
      recordNames: ['foo.example.com'],
      certificate,
      targetDomain: 'bar.example.com',
      zone: HostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
        hostedZoneId: 'ID',
        zoneName: 'example.com',
      }),
    });
  }).toThrow(/The certificate must be in the us-east-1 region and the certificate you provided is in us-east-2./);
});

describe('Uses Certificate when @aws-cdk/aws-route53-patters:useCertificate=true', () => {
  test('explicit different region', () => {
    // GIVEN
    const app = new App({
      context: {
        [ROUTE53_PATTERNS_USE_CERTIFICATE]: true,
      },
    });

    // WHEN
    const stack = new Stack(app, 'test', { env: { region: 'us-east-2' }, crossRegionReferences: true });
    new HttpsRedirect(stack, 'Redirect', {
      recordNames: ['foo.example.com'],
      targetDomain: 'bar.example.com',
      zone: HostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
        hostedZoneId: 'ID',
        zoneName: 'example.com',
      }),
    });

    // THEN
    const certStack = app.node.findChild(`certificate-redirect-stack-${stack.node.addr}`) as Stack;
    Template.fromStack(certStack).hasResourceProperties('AWS::CertificateManager::Certificate', {
      DomainName: 'foo.example.com',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        ViewerCertificate: {
          AcmCertificateArn: {
            'Fn::GetAtt': [
              'ExportsReader8B249524',
              '/cdk/exports/test/certificateredirectstackc8e2763df63c0f7e0c9afe0394e299bb731e281e8euseast1RefRedirectCertificatec8693e36481e135aa76e35c2db892ec6a33a94c7461E1B6E15A36EB7DA',
            ],
          },
        },
      },
    });
  });

  test('explicit same region', () => {
    // GIVEN
    const app = new App({
      context: {
        [ROUTE53_PATTERNS_USE_CERTIFICATE]: true,
      },
    });

    // WHEN
    const stack = new Stack(app, 'test', { env: { region: 'us-east-1' }, crossRegionReferences: true });
    new HttpsRedirect(stack, 'Redirect', {
      recordNames: ['foo.example.com'],
      targetDomain: 'bar.example.com',
      zone: HostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
        hostedZoneId: 'ID',
        zoneName: 'example.com',
      }),
    });

    // THEN
    const certStack = app.node.tryFindChild(`certificate-redirect-stack-${stack.node.addr}`);
    expect(certStack).toBeUndefined();
    Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::Certificate', {
      DomainName: 'foo.example.com',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        ViewerCertificate: {
          AcmCertificateArn: {
            Ref: 'RedirectRedirectCertificateB4F2F130',
          },
        },
      },
    });
  });

  test('same support stack used for multiple certificates', () => {
    // GIVEN
    const app = new App({
      context: {
        [ROUTE53_PATTERNS_USE_CERTIFICATE]: true,
      },
    });

    // WHEN
    const stack = new Stack(app, 'test', { env: { region: 'us-east-2' }, crossRegionReferences: true });
    new HttpsRedirect(stack, 'Redirect', {
      recordNames: ['foo.example.com'],
      targetDomain: 'bar.example.com',
      zone: HostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
        hostedZoneId: 'ID',
        zoneName: 'example.com',
      }),
    });

    new HttpsRedirect(stack, 'Redirect2', {
      recordNames: ['foo2.example.com'],
      targetDomain: 'bar2.example.com',
      zone: HostedZone.fromHostedZoneAttributes(stack, 'HostedZone2', {
        hostedZoneId: 'ID',
        zoneName: 'example.com',
      }),
    });

    // THEN
    const certStack = app.node.tryFindChild(`certificate-redirect-stack-${stack.node.addr}`) as Stack;
    Template.fromStack(certStack).hasResourceProperties('AWS::CertificateManager::Certificate', {
      DomainName: 'foo.example.com',
    });
    Template.fromStack(certStack).hasResourceProperties('AWS::CertificateManager::Certificate', {
      DomainName: 'foo2.example.com',
    });
  });

  test('unresolved region throws', () => {
    // GIVEN
    const app = new App({
      context: {
        [ROUTE53_PATTERNS_USE_CERTIFICATE]: true,
      },
    });

    // WHEN
    const stack = new Stack(app, 'test');

    // THEN
    expect(() => {
      new HttpsRedirect(stack, 'Redirect', {
        recordNames: ['foo.example.com'],
        targetDomain: 'bar.example.com',
        zone: HostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
          hostedZoneId: 'ID',
          zoneName: 'example.com',
        }),
      });

    }).toThrow(/When @aws-cdk\/aws-route53-patters:useCertificate is enabled, a region must be defined on the Stack/);
  });
});
