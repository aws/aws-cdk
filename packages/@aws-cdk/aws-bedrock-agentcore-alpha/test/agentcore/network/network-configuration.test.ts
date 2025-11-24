import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { RuntimeNetworkConfiguration } from '../../../lib/network/network-configuration';

describe('RuntimeNetworkConfiguration', () => {
  let app: cdk.App;
  let stack: cdk.Stack;
  let vpc: ec2.Vpc;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });
    vpc = new ec2.Vpc(stack, 'TestVpc', {
      maxAzs: 2,
    });
  });

  describe('usingPublicNetwork', () => {
    test('Should create public network configuration', () => {
      const config = RuntimeNetworkConfiguration.usingPublicNetwork();
      expect(config.networkMode).toBe('PUBLIC');
      expect(config.connections).toBeUndefined();
      expect(config.vpcSubnets).toBeUndefined();
    });

    test('Should render public network configuration correctly', () => {
      const config = RuntimeNetworkConfiguration.usingPublicNetwork();
      const rendered = config._render();
      expect(rendered).toEqual({
        networkMode: 'PUBLIC',
      });
    });
  });

  describe('usingVpc', () => {
    test('Should create VPC network configuration with default settings', () => {
      const config = RuntimeNetworkConfiguration.usingVpc(stack, {
        vpc: vpc,
      });
      expect(config.networkMode).toBe('VPC');
      expect(config.connections).toBeDefined();
      expect(config.vpcSubnets).toBeDefined();
      expect(config.connections?.securityGroups).toHaveLength(1);
    });

    test('Should create VPC network configuration with custom security groups', () => {
      const sg1 = new ec2.SecurityGroup(stack, 'SG1', { vpc });
      const sg2 = new ec2.SecurityGroup(stack, 'SG2', { vpc });
      const config = RuntimeNetworkConfiguration.usingVpc(stack, {
        vpc: vpc,
        securityGroups: [sg1, sg2],
      });
      expect(config.networkMode).toBe('VPC');
      expect(config.connections).toBeDefined();
      expect(config.connections?.securityGroups).toHaveLength(2);
      expect(config.connections?.securityGroups).toContain(sg1);
      expect(config.connections?.securityGroups).toContain(sg2);
    });

    test('Should create VPC network configuration with specific subnets', () => {
      const config = RuntimeNetworkConfiguration.usingVpc(stack, {
        vpc: vpc,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
      });
      expect(config.networkMode).toBe('VPC');
      expect(config.vpcSubnets).toBeDefined();
      expect(config.vpcSubnets?.subnets).toBeDefined();
    });

    test('Should create VPC network configuration with allowAllOutbound false', () => {
      const config = RuntimeNetworkConfiguration.usingVpc(stack, {
        vpc: vpc,
        allowAllOutbound: false,
      });
      expect(config.networkMode).toBe('VPC');
      expect(config.connections).toBeDefined();
      // Check that a security group was created
      const securityGroups = config.connections?.securityGroups;
      expect(securityGroups).toHaveLength(1);
    });

    test('Should create VPC network configuration with allowAllOutbound true', () => {
      const config = RuntimeNetworkConfiguration.usingVpc(stack, {
        vpc: vpc,
        allowAllOutbound: true,
      });
      expect(config.networkMode).toBe('VPC');
      expect(config.connections).toBeDefined();
    });

    test('Should render VPC network configuration correctly', () => {
      const config = RuntimeNetworkConfiguration.usingVpc(stack, {
        vpc: vpc,
      });
      const rendered = config._render();
      expect(rendered).toEqual({
        networkMode: 'VPC',
      });
    });

    test('Should throw error when security groups provided without VPC', () => {
      const sg = new ec2.SecurityGroup(stack, 'SG', {
        vpc: vpc,
      });
      expect(() => {
        RuntimeNetworkConfiguration.usingVpc(stack, {
          vpc: undefined as any,
          securityGroups: [sg],
        });
      }).toThrow('Cannot configure \'securityGroups\' or \'allowAllOutbound\' without configuring a VPC');
    });

    test('Should throw error when allowAllOutbound provided without VPC', () => {
      expect(() => {
        RuntimeNetworkConfiguration.usingVpc(stack, {
          vpc: undefined as any,
          allowAllOutbound: false,
        });
      }).toThrow('Cannot configure \'securityGroups\' or \'allowAllOutbound\' without configuring a VPC');
    });

    test('Should throw error when both security groups and allowAllOutbound are provided', () => {
      const sg = new ec2.SecurityGroup(stack, 'SG', { vpc });
      expect(() => {
        RuntimeNetworkConfiguration.usingVpc(stack, {
          vpc: vpc,
          securityGroups: [sg],
          allowAllOutbound: false,
        });
      }).toThrow('Configure \'allowAllOutbound\' directly on the supplied SecurityGroups');
    });

    test('Should work with empty security groups array and create default', () => {
      const config = RuntimeNetworkConfiguration.usingVpc(stack, {
        vpc: vpc,
        securityGroups: [],
      });
      expect(config.networkMode).toBe('VPC');
      expect(config.connections).toBeDefined();
      // Should create a default security group when empty array is provided
      expect(config.connections?.securityGroups).toHaveLength(1);
    });

    test('Should select default subnets when vpcSubnets not provided', () => {
      const config = RuntimeNetworkConfiguration.usingVpc(stack, {
        vpc: vpc,
      });
      expect(config.vpcSubnets).toBeDefined();
      expect(config.vpcSubnets?.subnets?.length).toBeGreaterThan(0);
    });

    test('Should select specific subnets when vpcSubnets provided', () => {
      const config = RuntimeNetworkConfiguration.usingVpc(stack, {
        vpc: vpc,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PUBLIC,
        },
      });
      expect(config.vpcSubnets).toBeDefined();
      expect(config.vpcSubnets?.subnets?.length).toBeGreaterThan(0);
    });

    test('Should work with multiple subnet selection criteria', () => {
      const config = RuntimeNetworkConfiguration.usingVpc(stack, {
        vpc: vpc,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          availabilityZones: ['us-east-1a'],
        },
      });
      expect(config.vpcSubnets).toBeDefined();
    });

    test('Should create connections with provided security groups', () => {
      const sg1 = new ec2.SecurityGroup(stack, 'CustomSG1', {
        vpc,
        description: 'Custom security group 1',
      });
      const sg2 = new ec2.SecurityGroup(stack, 'CustomSG2', {
        vpc,
        description: 'Custom security group 2',
      });
      const config = RuntimeNetworkConfiguration.usingVpc(stack, {
        vpc: vpc,
        securityGroups: [sg1, sg2],
      });
      expect(config.connections).toBeDefined();
      expect(config.connections?.securityGroups).toEqual([sg1, sg2]);
    });

    test('Should handle VPC with custom CIDR', () => {
      const customVpc = new ec2.Vpc(stack, 'CustomVpc', {
        ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
        maxAzs: 2,
      });
      const config = RuntimeNetworkConfiguration.usingVpc(stack, {
        vpc: customVpc,
      });
      expect(config.networkMode).toBe('VPC');
      expect(config.vpcSubnets).toBeDefined();
    });

    test('Should handle imported VPC', () => {
      const importedVpc = ec2.Vpc.fromLookup(stack, 'ImportedVpc', {
        vpcId: 'vpc-12345',
      });
      const config = RuntimeNetworkConfiguration.usingVpc(stack, {
        vpc: importedVpc,
      });
      expect(config.networkMode).toBe('VPC');
      expect(config.connections).toBeDefined();
    });
  });

  describe('Edge cases', () => {
    test('Should handle undefined scope for public network', () => {
      // Public network doesn't need scope
      const config = RuntimeNetworkConfiguration.usingPublicNetwork();
      expect(config.scope).toBeUndefined();
      expect(config.networkMode).toBe('PUBLIC');
    });

    test('Should require scope for VPC network', () => {
      // VPC network requires scope
      const config = RuntimeNetworkConfiguration.usingVpc(stack, {
        vpc: vpc,
      });
      expect(config.scope).toBe(stack);
      expect(config.networkMode).toBe('VPC');
    });

    test('Should handle VPC with no explicit subnet configuration', () => {
      const simpleVpc = new ec2.Vpc(stack, 'SimpleVpc');
      const config = RuntimeNetworkConfiguration.usingVpc(stack, {
        vpc: simpleVpc,
      });
      expect(config.vpcSubnets).toBeDefined();
      expect(config.vpcSubnets?.subnets).toBeDefined();
    });

    test('Should handle VPC with isolated subnets', () => {
      const isolatedVpc = new ec2.Vpc(stack, 'IsolatedVpc', {
        subnetConfiguration: [
          {
            name: 'Isolated',
            subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
            cidrMask: 24,
          },
        ],
      });
      const config = RuntimeNetworkConfiguration.usingVpc(stack, {
        vpc: isolatedVpc,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      });
      expect(config.networkMode).toBe('VPC');
      expect(config.vpcSubnets).toBeDefined();
    });

    test('Should pass connections to render method', () => {
      const config = RuntimeNetworkConfiguration.usingVpc(stack, {
        vpc: vpc,
      });
      const mockConnections = new ec2.Connections();
      const rendered = config._render(mockConnections);
      // When connections are passed, networkModeConfig is included
      expect(rendered.networkMode).toBe('VPC');
      expect(rendered.networkModeConfig).toBeDefined();
      // Type assertion to handle the union type
      const networkConfig = rendered.networkModeConfig as any;
      expect(networkConfig.subnets).toHaveLength(2);
      expect(networkConfig.securityGroups).toEqual([]);
    });

    test('Should render without connections parameter', () => {
      const config = RuntimeNetworkConfiguration.usingVpc(stack, {
        vpc: vpc,
      });
      const rendered = config._render();
      expect(rendered).toEqual({
        networkMode: 'VPC',
      });
    });

    test('Should handle VPC with NAT gateways', () => {
      const natVpc = new ec2.Vpc(stack, 'NatVpc', {
        natGateways: 2,
        maxAzs: 2,
      });
      const config = RuntimeNetworkConfiguration.usingVpc(stack, {
        vpc: natVpc,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
      });
      expect(config.networkMode).toBe('VPC');
      expect(config.vpcSubnets).toBeDefined();
    });

    test('Should handle VPC with custom security group and no outbound', () => {
      const customSg = new ec2.SecurityGroup(stack, 'CustomSG', {
        vpc: vpc,
        allowAllOutbound: false,
        description: 'Custom security group with no outbound',
      });
      const config = RuntimeNetworkConfiguration.usingVpc(stack, {
        vpc: vpc,
        securityGroups: [customSg],
      });
      expect(config.connections).toBeDefined();
      expect(config.connections?.securityGroups).toContain(customSg);
    });
  });
});
