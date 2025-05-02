import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

/**
 * Test stack - Examples of using IPAM features with Subnets
 * テストスタック - サブネットでIPAM機能を使用する例
 */
export class SubnetIpamTestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a VPC first
    // まず、VPCを作成
    const vpc = new ec2.Vpc(this, 'TestVpc', {
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [],
    });

    // Basic IPv4 subnet with CIDR block
    // 基本的なIPv4 CIDRブロックを使用したサブネット
    const subnetWithIpv4 = new ec2.Subnet(this, 'SubnetWithIpv4', {
      vpcId: vpc.vpcId,
      availabilityZone: vpc.availabilityZones[0],
      cidrBlock: '10.0.0.0/24',
    });

    // IPv4 subnet with public IP mapping enabled
    // パブリックIPマッピングを有効にしたIPv4サブネット
    const subnetWithPublicIp = new ec2.Subnet(this, 'SubnetWithPublicIp', {
      vpcId: vpc.vpcId,
      availabilityZone: vpc.availabilityZones[0],
      cidrBlock: '10.0.1.0/24',
      mapPublicIpOnLaunch: true,
    });

    // IPv4 subnet with IPv6 CIDR block
    // IPv6 CIDRブロックを追加したIPv4サブネット
    const subnetWithIpv6 = new ec2.Subnet(this, 'SubnetWithIpv6', {
      vpcId: vpc.vpcId,
      availabilityZone: vpc.availabilityZones[1],
      cidrBlock: '10.0.2.0/24',
      ipv6CidrBlock: `${vpc.vpcId}00::/64`, // Using a template for example
      assignIpv6AddressOnCreation: true,
    });

    // Test IPAM allocation using CloudFormation intrinsic functions
    // CloudFormation組み込み関数を使用してIPAM割り当てをテスト
    // IPv4 IPAM allocation - using token to simulate an IPAM pool ID
    // IPv4 IPAM割り当て - トークンを使用してIPAMプールIDをシミュレート
    const ipamPoolIdIpv4 = new cdk.CfnParameter(this, 'IpamPoolIdIpv4', {
      type: 'String',
      default: 'ipam-pool-0example0123456789',
      description: 'ID of an existing IPv4 IPAM pool (not actually used in real deployment)',
    });

    const subnetWithIpv4IpamAllocation = new ec2.Subnet(this, 'SubnetWithIpv4IpamAllocation', {
      vpcId: vpc.vpcId,
      availabilityZone: vpc.availabilityZones[0],
      ipv4IpamAllocation: {
        ipamPoolId: ipamPoolIdIpv4.valueAsString,
        netmaskLength: 24,
      },
    });

    // IPv6 IPAM allocation - using token to simulate an IPAM pool ID
    // IPv6 IPAM割り当て - トークンを使用してIPAMプールIDをシミュレート
    const ipamPoolIdIpv6 = new cdk.CfnParameter(this, 'IpamPoolIdIpv6', {
      type: 'String',
      default: 'ipam-pool-0example9876543210',
      description: 'ID of an existing IPv6 IPAM pool (not actually used in real deployment)',
    });

    const subnetWithIpv6IpamAllocation = new ec2.Subnet(this, 'SubnetWithIpv6IpamAllocation', {
      vpcId: vpc.vpcId,
      availabilityZone: vpc.availabilityZones[1],
      cidrBlock: '10.0.3.0/24',
      ipv6IpamAllocation: {
        ipamPoolId: ipamPoolIdIpv6.valueAsString,
        netmaskLength: 64,
      },
      assignIpv6AddressOnCreation: true,
    });

    // Combined IPv4 and IPv6 IPAM allocations
    // IPv4とIPv6の両方のIPAM割り当て
    const subnetWithBothIpamAllocations = new ec2.Subnet(this, 'SubnetWithBothIpamAllocations', {
      vpcId: vpc.vpcId,
      availabilityZone: vpc.availabilityZones[0],
      ipv4IpamAllocation: {
        ipamPoolId: ipamPoolIdIpv4.valueAsString,
        netmaskLength: 24,
      },
      ipv6IpamAllocation: {
        ipamPoolId: ipamPoolIdIpv6.valueAsString,
        netmaskLength: 64,
      },
      assignIpv6AddressOnCreation: true,
    });

    // Output the subnet IDs for reference
    // 参照用にサブネットIDを出力
    // Basic IPv4 subnet
    new cdk.CfnOutput(this, 'IPv4SubnetId', {
      value: subnetWithIpv4.subnetId,
      description: 'The subnet ID of the basic IPv4 subnet',
    });

    // Public IP mapping subnet
    new cdk.CfnOutput(this, 'PublicIpSubnetId', {
      value: subnetWithPublicIp.subnetId,
      description: 'The subnet ID of the IPv4 subnet with public IP mapping',
    });

    // IPv6 subnet
    new cdk.CfnOutput(this, 'IPv6SubnetId', {
      value: subnetWithIpv6.subnetId,
      description: 'The subnet ID of the subnet with IPv6 CIDR block',
    });

    // IPv4 IPAM allocation subnet
    new cdk.CfnOutput(this, 'IPv4IpamSubnetId', {
      value: subnetWithIpv4IpamAllocation.subnetId,
      description: 'The subnet ID of the subnet with IPv4 IPAM allocation',
    });

    // IPv6 IPAM allocation subnet
    new cdk.CfnOutput(this, 'IPv6IpamSubnetId', {
      value: subnetWithIpv6IpamAllocation.subnetId,
      description: 'The subnet ID of the subnet with IPv6 IPAM allocation',
    });

    // Combined IPAM allocations subnet
    new cdk.CfnOutput(this, 'BothIpamSubnetId', {
      value: subnetWithBothIpamAllocations.subnetId,
      description: 'The subnet ID of the subnet with both IPv4 and IPv6 IPAM allocations',
    });
  }
}

// Create an instance of the test stack
// テストスタックのインスタンスを作成
export const SubnetIpamTest = new SubnetIpamTestStack(app, 'SubnetIpamTest');

// Create an IntegTest (for CDK Integration Test framework)
// IntegTestを作成（CDKのIntegration Testフレームワーク用）
export const SubnetIpamIntegTest = new IntegTest(app, 'SubnetIpamIntegTest', {
  testCases: [SubnetIpamTest],
  // This test only performs synthesis and does not actually deploy
  // このテストは合成のみを行い、実際のデプロイは実行しない
  cdkCommandOptions: {
    deploy: {
      enabled: false,
    },
  },
});

app.synth();
