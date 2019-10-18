import '@aws-cdk/assert/jest';
import { Certificate } from '@aws-cdk/aws-certificatemanager';
import { HostedZone } from '@aws-cdk/aws-route53';
import { App, Stack } from '@aws-cdk/core';
import { HttpsRedirect } from '../lib';

test('create HTTPS redirect', () => {
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
      Aliases: ['foo.example.com', 'baz.example.com']
    }
  });
  expect(stack).toHaveResource('AWS::Route53::RecordSet', {
    Name: 'foo.example.com.',
    HostedZoneId: 'ID',
  });
  expect(stack).toHaveResource('AWS::Route53::RecordSet', {
    Name: 'baz.example.com.',
    HostedZoneId: 'ID',
  });
});

test('create HTTPS redirect for apex', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'test', { env: { region: 'us-east-1' } });

  // WHEN
  new HttpsRedirect(stack, 'Redirect', {
    targetDomain: 'bar.example.com',
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
  const stack = new Stack(app, 'test', { env: { region: 'us-east-1' } });

  // WHEN
  new HttpsRedirect(stack, 'Redirect', {
    recordNames: ['foo.example.com'],
    certificate: Certificate.fromCertificateArn(
      stack, 'Certificate', 'arn:aws:acm:us-east-2:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d'
    ),
    targetDomain: 'bar.example.com',
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
        AcmCertificateArn: "arn:aws:acm:us-east-2:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d"
      }
    }
  });
});
