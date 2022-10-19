import { PublicHostedZone } from '@aws-cdk/aws-route53';
import { App, Stack } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { Certificate, CertificateValidation } from '../lib';

/**
 * In order to test this you need to have a valid public hosted zone that you can use
 * to request certificates for.
 *
*/
const hostedZoneId = process.env.CDK_INTEG_HOSTED_ZONE_ID ?? process.env.HOSTED_ZONE_ID;
if (!hostedZoneId) throw new Error('For this test you must provide your own HostedZoneId as an env var "HOSTED_ZONE_ID"');
const hostedZoneName = process.env.CDK_INTEG_HOSTED_ZONE_NAME ?? process.env.HOSTED_ZONE_NAME;
if (!hostedZoneName) throw new Error('For this test you must provide your own HostedZoneName as an env var "HOSTED_ZONE_NAME"');
const domainName = process.env.CDK_INTEG_DOMAIN_NAME ?? process.env.DOMAIN_NAME;
if (!domainName) throw new Error('For this test you must provide your own Domain Name as an env var "DOMAIN_NAME"');

const app = new App();
const stack = new Stack(app, 'integ-certificate-name');
const hostedZone = PublicHostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
  hostedZoneId,
  zoneName: hostedZoneName,
});

new Certificate(stack, 'Certificate', {
  domainName,
  certificateName: 'This is a test name',
  validation: CertificateValidation.fromDns(hostedZone),
});

new IntegTest(app, 'integ-test', {
  testCases: [stack],
  diffAssets: true,
  enableLookups: true,
});
