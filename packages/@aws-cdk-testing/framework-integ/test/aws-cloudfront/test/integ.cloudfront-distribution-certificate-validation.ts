import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'cloudfront-distribution-certificate-validation');

const bucket = new s3.Bucket(stack, 'Bucket');
const origin = new origins.S3Origin(bucket);

// This should work - no certificate validation required
new cloudfront.Distribution(stack, 'DistributionWithoutCert', {
  defaultBehavior: { origin },
});

// This should work - custom certificate with minimumProtocolVersion and sslSupportMethod
const certificate = acm.Certificate.fromCertificateArn(
  stack,
  'Certificate', 
  'arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012',
);

new cloudfront.Distribution(stack, 'DistributionWithCert', {
  defaultBehavior: { origin },
  domainNames: ['example.com'],
  certificate,
  minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
  sslSupportMethod: cloudfront.SSLMethod.SNI,
});

new IntegTest(app, 'cloudfront-distribution-certificate-validation-test', {
  testCases: [stack],
});

app.synth();