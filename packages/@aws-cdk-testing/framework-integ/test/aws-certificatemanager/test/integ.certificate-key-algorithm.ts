import { PublicHostedZone } from 'aws-cdk-lib/aws-route53';
import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Certificate, CertificateValidation, KeyAlgorithm } from 'aws-cdk-lib/aws-certificatemanager';

/**
 * In order to test this you need
 * to have a valid public hosted zone that you can use
 * to request certificates for.
 *
 */
const hostedZoneId = process.env.CDK_INTEG_HOSTED_ZONE_ID ?? process.env.HOSTED_ZONE_ID;
if (!hostedZoneId) throw new Error('For this test you must provide your own HostedZoneId as an env var "HOSTED_ZONE_ID". See framework-integ/README.md for details.');
const hostedZoneName = process.env.CDK_INTEG_HOSTED_ZONE_NAME ?? process.env.HOSTED_ZONE_NAME;
if (!hostedZoneName) throw new Error('For this test you must provide your own HostedZoneName as an env var "HOSTED_ZONE_NAME". See framework-integ/README.md for details.');
const domainName = process.env.CDK_INTEG_DOMAIN_NAME ?? process.env.DOMAIN_NAME;
if (!domainName) throw new Error('For this test you must provide your own DomainName as an env var "DOMAIN_NAME". See framework-integ/README.md for details.');

const app = new App();
const stack = new Stack(app, 'integ-key-algorithm');
const hostedZone = PublicHostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
  hostedZoneId,
  zoneName: hostedZoneName,
});

const validation = CertificateValidation.fromDns(hostedZone);

new Certificate(stack, 'EC_prime256v1', {
  domainName,
  keyAlgorithm: KeyAlgorithm.EC_PRIME256V1,
  validation,
});

new Certificate(stack, 'EC_secp384r1', {
  domainName,
  keyAlgorithm: KeyAlgorithm.EC_SECP384R1,
  validation,
});

new Certificate(stack, 'RSA_2048', {
  domainName,
  keyAlgorithm: KeyAlgorithm.RSA_2048,
  validation,
});

new IntegTest(app, 'integ-test', {
  testCases: [stack],
  diffAssets: true,
  enableLookups: true,
});
