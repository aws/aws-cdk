/**
 * This test requires environment variables for a real Route53 hosted zone:
 * - HOSTED_ZONE_ID / CDK_INTEG_HOSTED_ZONE_ID
 * - HOSTED_ZONE_NAME / CDK_INTEG_HOSTED_ZONE_NAME
 * - DOMAIN_NAME / CDK_INTEG_DOMAIN_NAME
 *
 * The ACM certificate is validated via DNS against the hosted zone, so you must own the
 * domain. A custom certificate is required because CloudFront only applies the viewer
 * security policy when one is set, and it rejects certificates still in PENDING_VALIDATION.
 */
import * as cdk from 'aws-cdk-lib';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import { TestOrigin } from './test-origin';

const account = process.env.CDK_INTEG_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT;
const hostedZoneId = process.env.CDK_INTEG_HOSTED_ZONE_ID ?? process.env.HOSTED_ZONE_ID;
if (!hostedZoneId) throw new Error('For this test you must provide your own HostedZoneId as an env var "HOSTED_ZONE_ID". See framework-integ/README.md for details.');
const hostedZoneName = process.env.CDK_INTEG_HOSTED_ZONE_NAME ?? process.env.HOSTED_ZONE_NAME;
if (!hostedZoneName) throw new Error('For this test you must provide your own HostedZoneName as an env var "HOSTED_ZONE_NAME". See framework-integ/README.md for details.');
const domainName = process.env.CDK_INTEG_DOMAIN_NAME ?? process.env.DOMAIN_NAME;
if (!domainName) throw new Error('For this test you must provide your own DomainName as an env var "DOMAIN_NAME". See framework-integ/README.md for details.');

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-cloudfront:defaultSecurityPolicyTLSv1.2_2025': true,
  },
});

// The certificate must live in us-east-1 for CloudFront to accept it.
const env = { region: 'us-east-1', account };

const stack = new cdk.Stack(app, 'integ-distribution-default-security-policy', { env });

const hostedZone = route53.PublicHostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
  hostedZoneId,
  zoneName: hostedZoneName,
});

const certificate = new acm.Certificate(stack, 'Cert', {
  domainName,
  validation: acm.CertificateValidation.fromDns(hostedZone),
});

// No minimumProtocolVersion: the feature flag above should select TLSv1.2_2025.
const distribution = new cloudfront.Distribution(stack, 'Distribution', {
  defaultBehavior: { origin: new TestOrigin(domainName) },
  domainNames: [domainName],
  certificate,
});

// The assertion stack needs the same explicit region as the stack under test, otherwise
// reading the distribution id from it would be an unsupported cross-region reference.
const integ = new IntegTest(app, 'DistributionDefaultSecurityPolicy', {
  testCases: [stack],
  assertionStack: new cdk.Stack(app, 'integ-distribution-default-security-policy-assertions', { env }),
});

integ.assertions.awsApiCall('CloudFront', 'getDistributionConfig', {
  Id: distribution.distributionId,
}).expect(
  ExpectedResult.objectLike({
    DistributionConfig: Match.objectLike({
      ViewerCertificate: Match.objectLike({
        MinimumProtocolVersion: 'TLSv1.2_2025',
      }),
    }),
  }),
);
