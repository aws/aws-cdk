import { PublicHostedZone } from '@aws-cdk/aws-route53';
import { Stack, App } from '@aws-cdk/core';
// import { ROUTE53_PATTERNS_USE_CERTIFICATE } from '@aws-cdk/cx-api';
import { IntegTest } from '@aws-cdk/integ-tests';
import { HttpsRedirect } from '../lib';
const hostedZoneId = process.env.CDK_INTEG_HOSTED_ZONE_ID ?? process.env.HOSTED_ZONE_ID;
if (!hostedZoneId) throw new Error('For this test you must provide your own HostedZoneId as an env var "HOSTED_ZONE_ID"');
const hostedZoneName = process.env.CDK_INTEG_HOSTED_ZONE_NAME ?? process.env.HOSTED_ZONE_NAME;
if (!hostedZoneName) throw new Error('For this test you must provide your own HostedZoneName as an env var "HOSTED_ZONE_NAME"');
const domainName = process.env.CDK_INTEG_DOMAIN_NAME ?? process.env.DOMAIN_NAME;
if (!domainName) throw new Error('For this test you must provide your own Domain Name as an env var "DOMAIN_NAME"');

const app = new App({
  // uncomment this to test the old behavior
  // postCliContext: {
  //   [ROUTE53_PATTERNS_USE_CERTIFICATE]: false,
  // },
});
const testCase = new Stack(app, 'integ-https-redirect', {
  crossRegionReferences: true,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-2', // specifying region to test cross region functionality
  },
});

const hostedZone = PublicHostedZone.fromHostedZoneAttributes(testCase, 'HostedZone', {
  hostedZoneId,
  zoneName: hostedZoneName,
});
new HttpsRedirect(testCase, 'redirect', {
  zone: hostedZone,
  recordNames: [`integ.${hostedZoneName}`],
  targetDomain: 'aws.amazon.com',
});

new IntegTest(app, 'integ-test', {
  testCases: [testCase],
  enableLookups: true,
  stackUpdateWorkflow: false,
});

