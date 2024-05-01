import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { TestOrigin } from './test-origin';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

const account = process.env.CDK_INTEG_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT;
const hostedZoneId = process.env.CDK_INTEG_HOSTED_ZONE_ID ?? process.env.HOSTED_ZONE_ID;
if (!hostedZoneId) throw new Error('For this test you must provide your own HostedZoneId as an env var "HOSTED_ZONE_ID". See framework-integ/README.md for details.');
const hostedZoneName = process.env.CDK_INTEG_HOSTED_ZONE_NAME ?? process.env.HOSTED_ZONE_NAME;
if (!hostedZoneName) throw new Error('For this test you must provide your own HostedZoneName as an env var "HOSTED_ZONE_NAME". See framework-integ/README.md for details.');
const domainName = process.env.CDK_INTEG_DOMAIN_NAME ?? process.env.DOMAIN_NAME;
if (!domainName) throw new Error('For this test you must provide your own DomainName as an env var "DOMAIN_NAME". See framework-integ/README.md for details.');

const app = new cdk.App({
  treeMetadata: false,
});
const acmStack = new cdk.Stack(app, 'integ-acm-stack', {
  env: {
    region: 'us-east-1',
    account,
  },
  crossRegionReferences: true,
});

const cloudFrontStack = new cdk.Stack(app, 'integ-cloudfront-stack', {
  env: {
    region: 'us-east-2',
    account,
  },
  crossRegionReferences: true,
});

const hostedZone = route53.PublicHostedZone.fromHostedZoneAttributes(acmStack, 'HostedZone', {
  hostedZoneId,
  zoneName: hostedZoneName,
});

const cert = new acm.Certificate(acmStack, 'Cert', {
  domainName,
  validation: acm.CertificateValidation.fromDns(hostedZone),
});

new cloudfront.Distribution(cloudFrontStack, 'Distro', {
  defaultBehavior: { origin: new TestOrigin(domainName) },
  certificate: cert,
  domainNames: [domainName],
});

new IntegTest(app, 'integ-cloudfront-cross-region-acm', {
  testCases: [cloudFrontStack],
  diffAssets: true,
  enableLookups: true,
});
