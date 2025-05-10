import { SubnetIpamTest, SubnetIpamIntegTest } from './integ.subnet-ipam';

// Description of the existing test stack
const literalOutput = `
# Subnet Features and IPv6 Support

This test demonstrates basic subnet functionality and IPv6 support in AWS CDK.
It also explains the IPAM (IP Address Manager) features that will be implemented.

## Test Contents

1. **Basic Subnet Creation**
   - Creating a standard IPv4 subnet within a VPC
   - Using fixed CIDR blocks

2. **IPv6 Support Enablement**
   - Enabling automatic IPv6 address assignment on a second subnet
   - Validating dual-stack (IPv4/IPv6) configuration

## Future Feature: IPAM (IP Address Manager) Integration

AWS IP Address Manager (IPAM) integration will enable the following features:

- Centralized management of IPv4 and IPv6 address space
- Dynamic allocation of CIDRs from IPAM pools
- Prevention of CIDR block overlaps in use
- Tracking of IP address allocation history

IPAM feature examples (to be implemented in future releases):

\`\`\`typescript
// Subnet using IPv4 IPAM allocation
const subnet = new ec2.Subnet(stack, 'Subnet', {
  vpcId: vpc.vpcId,
  availabilityZone: vpc.availabilityZones[0],
  ipv4IpamAllocation: {
    ipamPoolId: 'ipam-pool-id', // Actual IPAM pool ID
    netmaskLength: 24, // Optional: If not specified, the default netmask length from the IPAM pool will be used
  },
});

// Subnet using IPv6 IPAM allocation
const subnetIpv6 = new ec2.Subnet(stack, 'SubnetIpv6', {
  vpcId: vpc.vpcId,
  availabilityZone: vpc.availabilityZones[1],
  cidrBlock: '10.0.1.0/24',
  assignIpv6AddressOnCreation: true,
  ipv6IpamAllocation: {
    ipamPoolId: 'ipam-pool-id', // Actual IPAM pool ID
    // netmaskLength is optional
  },
});
\`\`\`

## Test Execution Method

This test only performs synthesis and does not actually deploy.
To actually test IPAM features, you need an IPAM pool configured within your AWS organization.
`;

// Re-export stacks
export = { SubnetIpamTest, SubnetIpamIntegTest, literalOutput };
