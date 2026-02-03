import { PublicHostedZone } from 'aws-cdk-lib/aws-route53';
import { App, Stack, RemovalPolicy, CfnOutput, Fn } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { DnsValidatedCertificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';

/**
 * In order to test this you need to have a valid public hosted zone that you can use
 * to request certificates for. Currently there is not a great way to test scenarios that involve
 * multiple deploys so this is what I did to test these scenarios.
 *
 * 1. comment out the `cert.applyRemovalPolicy` line to create the certificate
 * 2. Run `yarn integ --update-on-failed --no-clean`
 * 3. uncomment the line to apply the removal policy
 * 4. Run `yarn integ --update-on-failed --no-clean` to validate that changing
 *    that property does not cause a new certificate to be created
 * 5. Run `yarn integ --force` to run the test again. Since we didn't pass `--no-clean`
 *    the stack will be deleted
 * 6. Validate that the certificate was not deleted.
 * 7. Delete the certificate manually.
 */

const hostedZoneId = process.env.CDK_INTEG_HOSTED_ZONE_ID ?? process.env.HOSTED_ZONE_ID;
if (!hostedZoneId) throw new Error('For this test you must provide your own HostedZoneId as an env var "HOSTED_ZONE_ID". See framework-integ/README.md for details.');
const hostedZoneName = process.env.CDK_INTEG_HOSTED_ZONE_NAME ?? process.env.HOSTED_ZONE_NAME;
if (!hostedZoneName) throw new Error('For this test you must provide your own HostedZoneName as an env var "HOSTED_ZONE_NAME". See framework-integ/README.md for details.');
const domainName = process.env.CDK_INTEG_DOMAIN_NAME ?? process.env.DOMAIN_NAME;
if (!domainName) throw new Error('For this test you must provide your own DomainName as an env var "DOMAIN_NAME". See framework-integ/README.md for details.');

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new Stack(app, 'integ-dns-validated-certificate');
const hostedZone = PublicHostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
  hostedZoneId,
  zoneName: hostedZoneName,
});

const cert = new DnsValidatedCertificate(stack, 'Certificate', {
  domainName,
  hostedZone,
  validation: CertificateValidation.fromDns(hostedZone),
});
cert.applyRemovalPolicy(RemovalPolicy.RETAIN);
new CfnOutput(stack, 'CertificateArn', {
  value: `https://${stack.region}.console.aws.amazon.com/acm/home?region=${stack.region}#/certificates/${Fn.select(1, Fn.split('/', cert.certificateArn))}`,
});

new IntegTest(app, 'integ-test', {
  testCases: [stack],
  diffAssets: true,
  enableLookups: true,
});
