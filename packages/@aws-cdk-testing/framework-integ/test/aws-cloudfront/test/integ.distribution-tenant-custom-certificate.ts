import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { TestOrigin } from './test-origin';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as wafv2 from 'aws-cdk-lib/aws-wafv2';

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
const stack = new cdk.Stack(app, 'integ-distribution-tenant-custom-certificate', {
  env: {
    region: 'us-east-1',
    account,
  },
});

const hostedZone = route53.PublicHostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
  hostedZoneId,
  zoneName: hostedZoneName,
});

const cert = new acm.Certificate(stack, 'Cert', {
  domainName,
  validation: acm.CertificateValidation.fromDns(hostedZone),
});

const distribution = new cloudfront.Distribution(stack, 'Dist', {
  defaultBehavior: { origin: new TestOrigin('www.example.com') },
  connectionMode: cloudfront.ConnectionMode.TENANT_ONLY,
});
const connectionGroup = new cloudfront.ConnectionGroup(stack, 'connection-group');
const webAcl = new wafv2.CfnWebACL(stack, 'web-acl', {
  defaultAction: {
    allow: {
      customRequestHandling: {
        insertHeaders: [
          {
            name: 'X-WebACL-Test',
            value: 'test',
          },
        ],
      },
    },
  },
  scope: 'CLOUDFRONT',
  visibilityConfig: {
    cloudWatchMetricsEnabled: false,
    metricName: 'test',
    sampledRequestsEnabled: false,
  },
});

new cloudfront.DistributionTenant(stack, 'dist-tenant', {
  distributionId: distribution.distributionId,
  domains: [domainName],
  distributionTenantName: 'test-tenant',
  connectionGroupId: connectionGroup.connectionGroupId,
  enabled: true,
  customizations: {
    certificate: {
      arn: cert.certificateArn,
    },
    geoRestrictions: {
      locations: ['US', 'CA'],
      restrictionType: 'whitelist',
    },
    webAcl: {
      arn: webAcl.attrArn,
      action: 'override',
    },
  },
  parameters: [
    {
      name: 'tenantId',
      value: 'tenant-123',
    },
  ],
  tags: [
    { key: 'Environment', value: 'test' },
  ],
});

new IntegTest(app, 'distribution-tenant-custom-certificate-test', {
  testCases: [stack],
  diffAssets: true,
  enableLookups: true,
});
