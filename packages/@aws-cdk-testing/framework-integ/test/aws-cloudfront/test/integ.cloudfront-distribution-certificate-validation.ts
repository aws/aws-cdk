import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Match } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'cloudfront-distribution-certificate-validation');

const bucket = new s3.Bucket(stack, 'Bucket');
const origin = new origins.S3Origin(bucket);

// Distribution without certificate - should generate warnings when minimumProtocolVersion is specified
const distWithoutCert = new cloudfront.Distribution(stack, 'DistributionWithoutCert', {
  defaultBehavior: { origin },
  minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
});

// Distribution with custom certificate - should work without warnings
const certificate = acm.Certificate.fromCertificateArn(
  stack,
  'Certificate', 
  'arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012',
);

const distWithCert = new cloudfront.Distribution(stack, 'DistributionWithCert', {
  defaultBehavior: { origin },
  domainNames: ['example.com'],
  certificate,
  minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
  sslSupportMethod: cloudfront.SSLMethod.SNI,
});

const integ = new IntegTest(app, 'cloudfront-distribution-certificate-validation-test', {
  testCases: [stack],
});

// Assert that the distribution without certificate doesn't have ViewerCertificate with MinimumProtocolVersion
integ.assertions.awsApiCall('CloudFront', 'getDistribution', {
  Id: distWithoutCert.distributionId,
}).expect('Distribution.DistributionConfig.ViewerCertificate.MinimumProtocolVersion', Match.absent());

// Assert that the distribution with certificate has the correct ViewerCertificate configuration
integ.assertions.awsApiCall('CloudFront', 'getDistribution', {
  Id: distWithCert.distributionId,
}).expect('Distribution.DistributionConfig.ViewerCertificate.MinimumProtocolVersion', 'TLSv1.2_2021');

app.synth();