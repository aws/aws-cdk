import { AccountRootPrincipal, PolicyDocument, PolicyStatement, Role } from '@aws-cdk/aws-iam';
import { PublicHostedZone } from '@aws-cdk/aws-route53';
import { App, Stack, CfnOutput, Fn } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { DnsValidatedCertificate, CertificateValidation } from '../lib';

const hostedZoneId = process.env.CDK_INTEG_HOSTED_ZONE_ID ?? process.env.HOSTED_ZONE_ID;
if (!hostedZoneId) throw new Error('For this test you must provide your own HostedZoneId as an env var "HOSTED_ZONE_ID"');
const hostedZoneName = process.env.CDK_INTEG_HOSTED_ZONE_NAME ?? process.env.HOSTED_ZONE_NAME;
if (!hostedZoneName) throw new Error('For this test you must provide your own HostedZoneName as an env var "HOSTED_ZONE_NAME"');
const domainName = process.env.CDK_INTEG_DOMAIN_NAME ?? process.env.DOMAIN_NAME;
if (!domainName) throw new Error('For this test you must provide your own Domain Name as an env var "DOMAIN_NAME"');

const app = new App();
const stack = new Stack(app, 'integ-dns-validated-certificate');
const hostedZone = PublicHostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
  hostedZoneId,
  zoneName: hostedZoneName,
});

const dnsRole = new Role(stack, 'Role', {
  roleName: 'DNSRole',
  assumedBy: new AccountRootPrincipal(),
  inlinePolicies: {
    delegation: new PolicyDocument({
      statements: [
        new PolicyStatement({
          actions: ['route53:ChangeResourceRecordSets'],
          resources: [hostedZone.hostedZoneArn],
        }),
        new PolicyStatement({
          actions: ['route53:ListHostedZonesByName'],
          resources: [hostedZone.hostedZoneArn],
        }),
        new PolicyStatement({
          actions: ['route53:GetChange'],
          resources: ['*'],
        }),
      ],
    }),
  },
});

const cert= new DnsValidatedCertificate(stack, 'Certificate', {
  domainName,
  hostedZone,
  validation: CertificateValidation.fromDns(hostedZone),
  dnsRole,
});
new CfnOutput(stack, 'CertificateArn', {
  value: `https://${stack.region}.console.aws.amazon.com/acm/home?region=${stack.region}#/certificates/${Fn.select(1, Fn.split('/', cert.certificateArn))}`,
});

new IntegTest(app, 'integ-test', {
  testCases: [stack],
  diffAssets: true,
  enableLookups: true,
});
