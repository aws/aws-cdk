import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { TestOrigin } from './test-origin';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-distribution-tenant-mode-with-config');

new cloudfront.Distribution(stack, 'Dist', {
  defaultBehavior: { origin: new TestOrigin('www.example.com') },
  connectionMode: cloudfront.ConnectionMode.TENANT_ONLY,
  tenantConfig: {
    parameterDefinitions: [
      {
        definition: {
          stringSchema: {
            required: false,
            comment: 'tenantName',
            defaultValue: 'root',
          },
        },
        name: 'tenantName',
      },
    ],
  },
  comment: 'Multi-tenant distribution using regular Distribution class',
  enableLogging: true,
  geoRestriction: cloudfront.GeoRestriction.allowlist('US', 'GB'),
});

new IntegTest(app, 'distribution-tenant-mode-with-config-test', {
  testCases: [stack],
});
