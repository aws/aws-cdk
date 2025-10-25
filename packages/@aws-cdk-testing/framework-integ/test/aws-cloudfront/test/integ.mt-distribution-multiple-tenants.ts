import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { TestOrigin } from './test-origin';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

const account = process.env.CDK_INTEG_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT;
const certificateArn = process.env.CDK_INTEG_CERT_ARN ?? process.env.CERT_ARN;
if (!certificateArn) throw new Error('For this test you must provide your own CertificateArn as an env var "CERT_ARN". See framework-integ/README.md for details.');
const hostedZoneId = process.env.CDK_INTEG_HOSTED_ZONE_ID ?? process.env.HOSTED_ZONE_ID;
if (!hostedZoneId) throw new Error('For this test you must provide your own HostedZoneId as an env var "HOSTED_ZONE_ID". See framework-integ/README.md for details.');
const hostedZoneName = process.env.CDK_INTEG_HOSTED_ZONE_NAME ?? process.env.HOSTED_ZONE_NAME;
if (!hostedZoneName) throw new Error('For this test you must provide your own HostedZoneName as an env var "HOSTED_ZONE_NAME". See framework-integ/README.md for details.');

const app = new cdk.App({
  treeMetadata: false,
});
const stack = new cdk.Stack(app, 'integ-mt-distribution-multiple-tenants', {
  env: {
    region: 'us-east-1',
    account,
  },
});

const connectionGroup = new cloudfront.ConnectionGroup(stack, 'ConnectionGroup', {
  connectionGroupName: 'connection-group',
  enabled: true,
  ipv6Enabled: true,
});

const hostedZone = route53.PublicHostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
  hostedZoneId: hostedZoneId,
  zoneName: hostedZoneName,
});

const cert = new acm.Certificate(stack, 'Cert', {
  domainName: `*.${hostedZoneName}`,
  validation: acm.CertificateValidation.fromDns(hostedZone),
});

const cnameRecord1 = new route53.CnameRecord(stack, 'Record1', {
  domainName: connectionGroup.routingEndpoint,
  zone: hostedZone,
  recordName: `integ1.${hostedZoneName}`,
});

const cnameRecord2 = new route53.CnameRecord(stack, 'Record2', {
  domainName: connectionGroup.routingEndpoint,
  zone: hostedZone,
  recordName: `integ2.${hostedZoneName}`,
});

const distribution = new cloudfront.MTDistribution(stack, 'Dist', {
  defaultBehavior: { origin: new TestOrigin('www.example.com') },
  certificate: cert,
});

const tenant1 = new cloudfront.DistributionTenant(stack, 'Tenant1', {
  distributionId: distribution.distributionId,
  connectionGroupId: connectionGroup.connectionGroupId,
  domains: [cnameRecord1.domainName],
  distributionTenantName: 'tenant-1',
});

const tenant2 = new cloudfront.DistributionTenant(stack, 'Tenant2', {
  distributionId: distribution.distributionId,
  connectionGroupId: connectionGroup.connectionGroupId,
  domains: [cnameRecord2.domainName],
  distributionTenantName: 'tenant-2',
});

cnameRecord1.node.addDependency(cert);
cnameRecord2.node.addDependency(cert);
distribution.node.addDependency(cnameRecord1);
distribution.node.addDependency(cnameRecord2);
tenant1.node.addDependency(distribution);
tenant2.node.addDependency(distribution);

new IntegTest(app, 'mt-distribution-multiple-tenants', {
  testCases: [stack],
});
