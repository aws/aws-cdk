/**
 * This test verifies that CloudFront distributions can be created with
 * mutual TLS (mTLS) authentication configured on Lambda Function URL origins,
 * including both standard and OAC variants.
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
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { FunctionUrlOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';

const certArn = process.env.CDK_INTEG_ACM_CERT_ARN ?? process.env.ACM_CERT_ARN;
if (!certArn) throw new Error('For this test you must provide an ACM client certificate ARN (with EKU clientAuth) as env var "ACM_CERT_ARN". See the test file comments for details.');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-cloudfront-function-url-origin-mtls');

const certificate = acm.Certificate.fromCertificateArn(stack, 'Certificate', certArn);

const fn = new lambda.Function(stack, 'MyFunction', {
  code: lambda.Code.fromInline('exports.handler = async () => ({ statusCode: 200, body: "Hello" });'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_20_X,
});

// Standard FunctionUrlOrigin with mTLS
const fnUrl = fn.addFunctionUrl({
  authType: lambda.FunctionUrlAuthType.NONE,
});

new cloudfront.Distribution(stack, 'DistributionStandard', {
  defaultBehavior: {
    origin: new FunctionUrlOrigin(fnUrl, {
      originMtlsConfig: {
        clientCertificate: certificate,
      },
    }),
  },
});

// FunctionUrlOrigin with OAC and mTLS
const fnOac = new lambda.Function(stack, 'MyFunctionOAC', {
  code: lambda.Code.fromInline('exports.handler = async () => ({ statusCode: 200, body: "Hello OAC" });'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_20_X,
});
const fnUrlOac = fnOac.addFunctionUrl({
  authType: lambda.FunctionUrlAuthType.AWS_IAM,
});

new cloudfront.Distribution(stack, 'DistributionOAC', {
  defaultBehavior: {
    origin: FunctionUrlOrigin.withOriginAccessControl(fnUrlOac, {
      originMtlsConfig: {
        clientCertificate: certificate,
      },
    }),
  },
});

new IntegTest(app, 'function-url-origin-mtls-integ', {
  testCases: [stack],
  stackUpdateWorkflow: false,
});
