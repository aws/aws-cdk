import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { TestOrigin } from './test-origin';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as wafv2 from 'aws-cdk-lib/aws-wafv2';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-distribution-tenant-extensive');

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
  domains: ['integtest.codyzhao.people.aws.dev'],
  distributionTenantName: 'test-tenant',
  connectionGroupId: connectionGroup.connectionGroupId,
  enabled: true,
  customizations: {
    certificate: {
      arn: 'arn:aws:acm:us-east-1:034727219234:certificate/8b6f2b30-d8ae-410d-bbaa-c0820d14b9e0',
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

new IntegTest(app, 'distribution-tenant-extensive-test', {
  testCases: [stack],
});
