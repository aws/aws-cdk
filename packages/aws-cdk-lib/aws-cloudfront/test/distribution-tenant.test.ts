import { Template } from '../../assertions';
import { App, Stack } from '../../core';
import { DistributionTenant } from '../lib';

let app: App;
let stack: Stack;

beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'Stack', {
    env: { account: '1234', region: 'testregion' },
  });
});

test('minimal example renders correctly', () => {
  const tenant = new DistributionTenant(stack, 'MyTenant', {
    distributionId: 'TestID',
    domains: ['example.com'],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::DistributionTenant', {
    DistributionId: 'TestID',
    Domains: ['example.com'],
    Name: 'StackMyTenant',
    Enabled: true,
  });

  expect(tenant.distributionTenantName).toBeDefined();
  expect(tenant.domains).toEqual(['example.com']);
  expect(tenant.distributionId).toEqual('TestID');
});

test('with custom name', () => {
  new DistributionTenant(stack, 'MyTenant', {
    distributionId: 'EDFDVBD6EXAMPLE',
    domains: ['example.com'],
    distributionTenantName: 'custom-tenant',
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::DistributionTenant', {
    Name: 'custom-tenant',
  });
});

test('with all properties', () => {
  new DistributionTenant(stack, 'MyTenant', {
    distributionId: 'EDFDVBD6EXAMPLE',
    domains: ['example.com', 'www.example.com'],
    distributionTenantName: 'test-tenant',
    connectionGroupId: 'CG123456',
    enabled: false,
    customizations: {
      certificate: {
        arn: 'arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012',
      },
      geoRestrictions: {
        locations: ['US', 'CA'],
        restrictionType: 'whitelist',
      },
      webAcl: {
        arn: 'arn:aws:wafv2:us-east-1:123456789012:global/webacl/ExampleWebACL/a1b2c3d4-5678-90ab-cdef-EXAMPLE11111',
      },
    },
    managedCertificateRequest: {
      primaryDomainName: 'example.com',
      validationTokenHost: 'cloudfront',
      certificateTransparencyLoggingPreference: 'enabled',
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

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::DistributionTenant', {
    DistributionId: 'EDFDVBD6EXAMPLE',
    Domains: ['example.com', 'www.example.com'],
    Name: 'test-tenant',
    ConnectionGroupId: 'CG123456',
    Enabled: false,
    Customizations: {
      Certificate: {
        Arn: 'arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012',
      },
      GeoRestrictions: {
        Locations: ['US', 'CA'],
        RestrictionType: 'whitelist',
      },
      WebAcl: {
        Arn: 'arn:aws:wafv2:us-east-1:123456789012:global/webacl/ExampleWebACL/a1b2c3d4-5678-90ab-cdef-EXAMPLE11111',
      },
    },
    ManagedCertificateRequest: {
      PrimaryDomainName: 'example.com',
      ValidationTokenHost: 'cloudfront',
      CertificateTransparencyLoggingPreference: 'enabled',
    },
    Parameters: [
      {
        Name: 'tenantId',
        Value: 'tenant-123',
      },
    ],
    Tags: [
      { Key: 'Environment', Value: 'test' },
    ],
  });
});

test('can import existing distribution tenant', () => {
  const imported = DistributionTenant.fromDistributionTenantAttributes(stack, 'ImportedTenant', {
    distributionId: 'EDFDVBD6EXAMPLE',
    distributionTenantName: 'imported-tenant',
    domains: ['imported.com'],
    connectionGroupId: 'CG123456',
  });

  expect(imported.distributionId).toEqual('EDFDVBD6EXAMPLE');
  expect(imported.distributionTenantName).toEqual('imported-tenant');
  expect(imported.domains).toEqual(['imported.com']);
  expect(imported.connectionGroupId).toEqual('CG123456');
});
