import '@aws-cdk/assert/jest';
import { Certificate } from '@aws-cdk/aws-certificatemanager';
import { HostedZone } from '@aws-cdk/aws-route53';
import { App, Stack } from '@aws-cdk/core';
import { HTTPSRedirect } from '../lib';

test('create HTTPS redirect', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'test', {env: {region: 'us-east-1'}});

  // WHEN
  new HTTPSRedirect(stack, 'Redirect', {
    domainName: 'foo.example.com',
    redirectTarget: 'bar.example.com',
    zone: HostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
      hostedZoneId: 'ID',
      zoneName: 'example.com',
    })
  });

  // THEN
  expect(stack).toHaveResource('AWS::S3::Bucket', {
    WebsiteConfiguration: {
      RedirectAllRequestsTo: {
        HostName: "bar.example.com",
        Protocol: "https"
      }
    }
  });
  expect(stack).toHaveResource('AWS::Route53::RecordSet', {
    Name: 'foo.example.com.',
    HostedZoneId: 'ID',
  });
});

test('create HTTPS redirect for apex', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'test', {env: {region: 'us-east-1'}});

  // WHEN
  new HTTPSRedirect(stack, 'Redirect', {
    redirectTarget: 'bar.example.com',
    zone: HostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
      hostedZoneId: 'ID',
      zoneName: 'example.com',
    })
  });

  // THEN
  expect(stack).toHaveResource('AWS::S3::Bucket', {
    WebsiteConfiguration: {
      RedirectAllRequestsTo: {
        HostName: "bar.example.com",
        Protocol: "https"
      }
    }
  });
  expect(stack).toHaveResource('AWS::Route53::RecordSet', {
    Name: 'example.com.',
  });
});

test('create HTTPS redirect with existing cert', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'test', {env: {region: 'us-east-1'}});

  // WHEN
  new HTTPSRedirect(stack, 'Redirect', {
    domainName: 'foo.example.com',
    certificate: Certificate.fromCertificateArn(stack, 'Certificate', 'someArn'),
    redirectTarget: 'bar.example.com',
    zone: HostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
      hostedZoneId: 'ID',
      zoneName: 'example.com',
    })
  });

  // THEN
  expect(stack).toHaveResource('AWS::S3::Bucket', {
    WebsiteConfiguration: {
      RedirectAllRequestsTo: {
        HostName: "bar.example.com",
        Protocol: "https"
      }
    }
  });
  expect(stack).toHaveResourceLike('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      ViewerCertificate: {
        AcmCertificateArn: "someArn"
      }
    }
  });
});
