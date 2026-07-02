/**
 * This test requires a valid ACM certificate in us-east-1.
 * CloudFront rejects certificates in PENDING_VALIDATION state,
 * so DNS validation against a real domain you control is needed.
 * Replace the acmCertRef and names below with your own values.
 */
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-cloudfront-custom');

const certificate = acm.Certificate.fromCertificateArn(
  stack, 'Cert',
  'arn:aws:acm:us-east-1:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d',
);

new cloudfront.Distribution(stack, 'AnAmazingWebsiteProbably', {
  defaultBehavior: {
    origin: new origins.HttpOrigin('brelandm.a2z.com', {
      customHeaders: { 'X-Custom-Header': 'somevalue' },
    }),
  },
  certificate,
  domainNames: ['test.test.com'],
  sslSupportMethod: cloudfront.SSLMethod.SNI,
  minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1,
});

app.synth();
