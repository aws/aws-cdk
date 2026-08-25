/**
 * This test verifies that CloudFront distributions can be created with
 * mutual TLS (mTLS) authentication configured on custom origins.
 *
 * This test requires manual setup:
 * - An ACM certificate with Extended Key Usage (EKU) set to "TLS Web Client Authentication"
 *   (OID 1.3.6.1.5.5.7.3.2) imported into ACM in us-east-1.
 *   Standard ACM-issued certificates only have "TLS Web Server Authentication" and will be
 *   rejected by CloudFront. You must issue a client certificate from your own CA and import
 *   it into ACM.
 *
 * Set the environment variable:
 *   - CDK_INTEG_ACM_CERT_ARN or ACM_CERT_ARN: ARN of the imported ACM client certificate
 *
 * To create a suitable certificate:
 *   1. Generate a CA: openssl req -x509 -new -days 365 -keyout ca.key -out ca.pem
 *   2. Create a CSR with EKU clientAuth and generate the client cert
 *   3. Import into ACM: aws acm import-certificate --certificate fileb://client.pem --private-key fileb://client.key --certificate-chain fileb://ca.pem --region us-east-1
 */
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

const certArn = process.env.CDK_INTEG_ACM_CERT_ARN ?? process.env.ACM_CERT_ARN;
if (!certArn) throw new Error('For this test you must provide an ACM client certificate ARN (with EKU clientAuth) as env var "ACM_CERT_ARN". See the test file comments for details.');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-cloudfront-http-origin-mtls');

const certificate = acm.Certificate.fromCertificateArn(stack, 'Certificate', certArn);

new cloudfront.Distribution(stack, 'Distribution', {
  defaultBehavior: {
    origin: new origins.HttpOrigin('www.example.com', {
      originMtlsConfig: {
        clientCertificate: certificate,
      },
    }),
  },
});

new IntegTest(app, 'http-origin-mtls-integ', {
  testCases: [stack],
  stackUpdateWorkflow: false,
});
