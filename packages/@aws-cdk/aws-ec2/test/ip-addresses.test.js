"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('Cidr vpc allocation', () => {
    test('Default Cidr returns the correct vpc cidr', () => {
        const ipAddresses = lib_1.IpAddresses.cidr('10.0.0.0/16');
        expect(ipAddresses.allocateVpcCidr().cidrBlock).toEqual('10.0.0.0/16');
    });
    test('Default Cidr returns ipv4IpamPoolId as undefined', () => {
        const ipAddresses = lib_1.IpAddresses.cidr('10.0.0.0/16');
        expect(ipAddresses.allocateVpcCidr().ipv4IpamPoolId).toBeUndefined;
    });
    test('Default Cidr returns ipv4NetmaskLength as undefined', () => {
        const ipAddresses = lib_1.IpAddresses.cidr('10.0.0.0/16');
        expect(ipAddresses.allocateVpcCidr().ipv4NetmaskLength).toBeUndefined;
    });
});
describe('IpAddresses.cidr subnets allocation', () => {
    const cidrProps = '10.0.0.0/16';
    test('Default Cidr returns the correct subnet allocations, when you do not give a cidr for the subnets', () => {
        const ipAddresses = lib_1.IpAddresses.cidr(cidrProps);
        expect(ipAddresses.allocateSubnetsCidr({
            requestedSubnets: [{
                    availabilityZone: 'dummyAz1',
                    configuration: {
                        name: 'public',
                        subnetType: lib_1.SubnetType.PUBLIC,
                    },
                    subnetConstructId: 'public',
                }, {
                    availabilityZone: 'dummyAz1',
                    configuration: {
                        name: 'private-with-egress',
                        subnetType: lib_1.SubnetType.PRIVATE_WITH_EGRESS,
                    },
                    subnetConstructId: 'public',
                }],
            vpcCidr: '10.0.0.0/16',
        }).allocatedSubnets).toEqual([{ cidr: '10.0.0.0/17' }, { cidr: '10.0.128.0/17' }]);
    });
    test('Default Cidr returns the correct subnet allocations, when you provide a cidr for the subnets', () => {
        const ipAddresses = lib_1.IpAddresses.cidr(cidrProps);
        expect(ipAddresses.allocateSubnetsCidr({
            requestedSubnets: [{
                    availabilityZone: 'dummyAz1',
                    configuration: {
                        name: 'public',
                        subnetType: lib_1.SubnetType.PUBLIC,
                        cidrMask: 24,
                    },
                    subnetConstructId: 'public',
                }, {
                    availabilityZone: 'dummyAz1',
                    configuration: {
                        name: 'private-with-egress',
                        subnetType: lib_1.SubnetType.PRIVATE_WITH_EGRESS,
                        cidrMask: 24,
                    },
                    subnetConstructId: 'public',
                }],
            vpcCidr: '10.0.0.0/16',
        }).allocatedSubnets).toEqual([{ cidr: '10.0.0.0/24' }, { cidr: '10.0.1.0/24' }]);
    });
    test('Default Cidr returns the correct subnet allocations, when you mix provided and non provided cidr for the subnets', () => {
        const ipAddresses = lib_1.IpAddresses.cidr(cidrProps);
        expect(ipAddresses.allocateSubnetsCidr({
            requestedSubnets: [{
                    availabilityZone: 'dummyAz1',
                    configuration: {
                        name: 'public',
                        subnetType: lib_1.SubnetType.PUBLIC,
                    },
                    subnetConstructId: 'public',
                }, {
                    availabilityZone: 'dummyAz1',
                    configuration: {
                        name: 'private-with-egress',
                        subnetType: lib_1.SubnetType.PRIVATE_WITH_EGRESS,
                        cidrMask: 24,
                    },
                    subnetConstructId: 'public',
                }],
            vpcCidr: '10.0.0.0/16',
        }).allocatedSubnets).toEqual([{ cidr: '10.0.128.0/17' }, { cidr: '10.0.0.0/24' }]);
    });
});
describe('AwsIpam vpc allocation', () => {
    const awsIpamProps = {
        ipv4IpamPoolId: 'ipam-pool-0111222333444',
        ipv4NetmaskLength: 22,
    };
    test('AwsIpam returns cidrBlock as undefined', () => {
        const ipAddresses = lib_1.IpAddresses.awsIpamAllocation(awsIpamProps);
        expect(ipAddresses.allocateVpcCidr().cidrBlock).toBeUndefined;
    });
    test('AwsIpam returns the correct vpc ipv4IpamPoolId', () => {
        const ipAddresses = lib_1.IpAddresses.awsIpamAllocation(awsIpamProps);
        expect(ipAddresses.allocateVpcCidr().ipv4IpamPoolId).toEqual('ipam-pool-0111222333444');
    });
    test('AwsIpam returns the correct vpc ipv4NetmaskLength', () => {
        const ipAddresses = lib_1.IpAddresses.awsIpamAllocation(awsIpamProps);
        expect(ipAddresses.allocateVpcCidr().ipv4NetmaskLength).toEqual(22);
    });
});
describe('AwsIpam subnets allocation', () => {
    const awsIpamProps = {
        ipv4IpamPoolId: 'ipam-pool-0111222333444',
        ipv4NetmaskLength: 22,
    };
    test('AwsIpam returns subnet allocations as 2x TOKEN, when you do not give a cidr for the subnets', () => {
        const ipAddresses = lib_1.IpAddresses.awsIpamAllocation({ defaultSubnetIpv4NetmaskLength: 24, ...awsIpamProps });
        const allocations = ipAddresses.allocateSubnetsCidr({
            requestedSubnets: [{
                    availabilityZone: 'dummyAz1',
                    configuration: {
                        name: 'public',
                        subnetType: lib_1.SubnetType.PUBLIC,
                    },
                    subnetConstructId: 'public',
                }, {
                    availabilityZone: 'dummyAz1',
                    configuration: {
                        name: 'private-with-egress',
                        subnetType: lib_1.SubnetType.PRIVATE_WITH_EGRESS,
                    },
                    subnetConstructId: 'public',
                }],
            vpcCidr: '10.0.0.0/16',
        });
        expect(allocations.allocatedSubnets.length).toBe(2);
        expect(allocations.allocatedSubnets[0].cidr).toContain('TOKEN');
        expect(allocations.allocatedSubnets[1].cidr).toContain('TOKEN');
    });
    test('AwsIpam returns subnet allocations as 2x TOKEN, when you provide a cidr for the subnets', () => {
        const ipAddresses = lib_1.IpAddresses.awsIpamAllocation(awsIpamProps);
        const allocations = ipAddresses.allocateSubnetsCidr({
            requestedSubnets: [{
                    availabilityZone: 'dummyAz1',
                    configuration: {
                        name: 'public',
                        subnetType: lib_1.SubnetType.PUBLIC,
                        cidrMask: 24,
                    },
                    subnetConstructId: 'public',
                }, {
                    availabilityZone: 'dummyAz1',
                    configuration: {
                        name: 'private-with-egress',
                        subnetType: lib_1.SubnetType.PRIVATE_WITH_EGRESS,
                        cidrMask: 24,
                    },
                    subnetConstructId: 'public',
                }],
            vpcCidr: '10.0.0.0/16',
        });
        expect(allocations.allocatedSubnets.length).toBe(2);
        expect(allocations.allocatedSubnets[0].cidr).toContain('TOKEN');
        expect(allocations.allocatedSubnets[1].cidr).toContain('TOKEN');
    });
    test('AwsIpam returns subnet allocations as 2x TOKEN, when you mix provide and non provided cidr for the subnets', () => {
        const ipAddresses = lib_1.IpAddresses.awsIpamAllocation({ defaultSubnetIpv4NetmaskLength: 24, ...awsIpamProps });
        const allocations = ipAddresses.allocateSubnetsCidr({
            requestedSubnets: [{
                    availabilityZone: 'dummyAz1',
                    configuration: {
                        name: 'public',
                        subnetType: lib_1.SubnetType.PUBLIC,
                    },
                    subnetConstructId: 'public',
                }, {
                    availabilityZone: 'dummyAz1',
                    configuration: {
                        name: 'private-with-egress',
                        subnetType: lib_1.SubnetType.PRIVATE_WITH_EGRESS,
                        cidrMask: 24,
                    },
                    subnetConstructId: 'public',
                }],
            vpcCidr: '10.0.0.0/16',
        });
        expect(allocations.allocatedSubnets.length).toBe(2);
        expect(allocations.allocatedSubnets[0].cidr).toContain('TOKEN');
        expect(allocations.allocatedSubnets[1].cidr).toContain('TOKEN');
    });
});
describe('IpAddresses.cidr Vpc Integration', () => {
    test('IpAddresses.cidr provides the correct Cidr allocation to the Vpc ', () => {
        const stack = new core_1.Stack();
        const cidrProps = '10.0.0.0/16';
        const ipAddresses = lib_1.IpAddresses.cidr(cidrProps);
        new lib_1.Vpc(stack, 'VpcNetwork', { ipAddresses: ipAddresses });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPC', {
            CidrBlock: cidrProps,
        });
    });
    test('IpAddresses.cidr provides the correct Subnet allocation to the Vpc', () => {
        const stack = new core_1.Stack();
        const cidrProps = '10.0.0.0/16';
        const ipAddresses = lib_1.IpAddresses.cidr(cidrProps);
        new lib_1.Vpc(stack, 'VpcNetwork', { ipAddresses: ipAddresses });
        const template = assertions_1.Template.fromStack(stack);
        template.hasResourceProperties('AWS::EC2::Subnet', {
            CidrBlock: '10.0.0.0/18',
        });
        template.hasResourceProperties('AWS::EC2::Subnet', {
            CidrBlock: '10.0.64.0/18',
        });
        template.hasResourceProperties('AWS::EC2::Subnet', {
            CidrBlock: '10.0.128.0/18',
        });
        template.hasResourceProperties('AWS::EC2::Subnet', {
            CidrBlock: '10.0.192.0/18',
        });
    });
});
describe('AwsIpam Vpc Integration', () => {
    test('Should throw if there are subnets without explicit Cidr and no defaultCidr given', () => {
        const stack = new core_1.Stack();
        const awsIpamProps = {
            ipv4IpamPoolId: 'ipam-pool-0111222333444',
            ipv4NetmaskLength: 22,
        };
        const ipAddresses = lib_1.IpAddresses.awsIpamAllocation(awsIpamProps);
        expect(() => { new lib_1.Vpc(stack, 'VpcNetwork', { ipAddresses: ipAddresses }); }).toThrow(/If you have not set a cidr for all subnets in this case you must set a defaultCidrMask in AwsIpam Options/);
        ;
    });
    test('AwsIpam provides the correct Cidr allocation to the Vpc ', () => {
        const stack = new core_1.Stack();
        const awsIpamProps = {
            ipv4IpamPoolId: 'ipam-pool-0111222333444',
            ipv4NetmaskLength: 22,
            defaultSubnetIpv4NetmaskLength: 24,
        };
        const ipAddresses = lib_1.IpAddresses.awsIpamAllocation(awsIpamProps);
        new lib_1.Vpc(stack, 'VpcNetwork', { ipAddresses: ipAddresses });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPC', {
            Ipv4IpamPoolId: awsIpamProps.ipv4IpamPoolId,
            Ipv4NetmaskLength: awsIpamProps.ipv4NetmaskLength,
        });
    });
    test('AwsIpam provides the correct Subnet allocation to the Vpc', () => {
        const stack = new core_1.Stack();
        const awsIpamProps = {
            ipv4IpamPoolId: 'ipam-pool-0111222333444',
            ipv4NetmaskLength: 22,
            defaultSubnetIpv4NetmaskLength: 24,
        };
        const ipAddresses = lib_1.IpAddresses.awsIpamAllocation(awsIpamProps);
        new lib_1.Vpc(stack, 'VpcNetwork', { ipAddresses: ipAddresses });
        const template = assertions_1.Template.fromStack(stack);
        template.hasResourceProperties('AWS::EC2::Subnet', {
            CidrBlock: {
                'Fn::Select': [0, {
                        'Fn::Cidr': [{
                                'Fn::GetAtt': ['VpcNetworkB258E83A', 'CidrBlock'],
                            }, 4, '8'],
                    }],
            },
        });
        template.hasResourceProperties('AWS::EC2::Subnet', {
            CidrBlock: {
                'Fn::Select': [1, {
                        'Fn::Cidr': [{
                                'Fn::GetAtt': ['VpcNetworkB258E83A', 'CidrBlock'],
                            }, 4, '8'],
                    }],
            },
        });
        template.hasResourceProperties('AWS::EC2::Subnet', {
            CidrBlock: {
                'Fn::Select': [2, {
                        'Fn::Cidr': [{
                                'Fn::GetAtt': ['VpcNetworkB258E83A', 'CidrBlock'],
                            }, 4, '8'],
                    }],
            },
        });
        template.hasResourceProperties('AWS::EC2::Subnet', {
            CidrBlock: {
                'Fn::Select': [3, {
                        'Fn::Cidr': [{
                                'Fn::GetAtt': ['VpcNetworkB258E83A', 'CidrBlock'],
                            }, 4, '8'],
                    }],
            },
        });
    });
    test('Should throw if ipv4NetmaskLength not big enough to allocate subnets', () => {
        const stack = new core_1.Stack();
        const awsIpamProps = {
            ipv4IpamPoolId: 'ipam-pool-0111222333444',
            ipv4NetmaskLength: 18,
            defaultSubnetIpv4NetmaskLength: 17,
        };
        const ipAddresses = lib_1.IpAddresses.awsIpamAllocation(awsIpamProps);
        expect(() => { new lib_1.Vpc(stack, 'VpcNetwork', { ipAddresses: ipAddresses }); }).toThrow('IP space of size /18 not big enough to allocate subnets of sizes /17,/17,/17,/17');
        ;
    });
    test('Should be able to allocate subnets from a SubnetConfiguration in Vpc Constructor', () => {
        const stack = new core_1.Stack();
        const awsIpamProps = {
            ipv4IpamPoolId: 'ipam-pool-0111222333444',
            ipv4NetmaskLength: 18,
            defaultSubnetIpv4NetmaskLength: 17,
        };
        const ipAddresses = lib_1.IpAddresses.awsIpamAllocation(awsIpamProps);
        new lib_1.Vpc(stack, 'VpcNetwork', {
            ipAddresses: ipAddresses,
            subnetConfiguration: [{
                    name: 'public',
                    subnetType: lib_1.SubnetType.PUBLIC,
                    cidrMask: 24,
                }],
            maxAzs: 2,
        });
        const template = assertions_1.Template.fromStack(stack);
        template.hasResourceProperties('AWS::EC2::Subnet', {
            CidrBlock: {
                'Fn::Select': [0, {
                        'Fn::Cidr': [{
                                'Fn::GetAtt': ['VpcNetworkB258E83A', 'CidrBlock'],
                            }, 64, '8'],
                    }],
            },
        });
        template.hasResourceProperties('AWS::EC2::Subnet', {
            CidrBlock: {
                'Fn::Select': [1, {
                        'Fn::Cidr': [{
                                'Fn::GetAtt': ['VpcNetworkB258E83A', 'CidrBlock'],
                            }, 64, '8'],
                    }],
            },
        });
        template.resourceCountIs('AWS::EC2::Subnet', 2);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXAtYWRkcmVzc2VzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpcC1hZGRyZXNzZXMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLG9EQUErQztBQUMvQyx3Q0FBc0M7QUFDdEMsZ0NBQXNEO0FBRXRELFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7SUFFbkMsSUFBSSxDQUFDLDJDQUEyQyxFQUFFLEdBQUcsRUFBRTtRQUNyRCxNQUFNLFdBQVcsR0FBRyxpQkFBVyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNwRCxNQUFNLENBQUMsV0FBVyxDQUFDLGVBQWUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUN6RSxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxrREFBa0QsRUFBRSxHQUFHLEVBQUU7UUFDNUQsTUFBTSxXQUFXLEdBQUcsaUJBQVcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDcEQsTUFBTSxDQUFDLFdBQVcsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxhQUFhLENBQUM7SUFDckUsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMscURBQXFELEVBQUUsR0FBRyxFQUFFO1FBQy9ELE1BQU0sV0FBVyxHQUFHLGlCQUFXLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3BELE1BQU0sQ0FBQyxXQUFXLENBQUMsZUFBZSxFQUFFLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxhQUFhLENBQUM7SUFDeEUsQ0FBQyxDQUFDLENBQUM7QUFFTCxDQUFDLENBQUMsQ0FBQztBQUVILFFBQVEsQ0FBQyxxQ0FBcUMsRUFBRSxHQUFHLEVBQUU7SUFFbkQsTUFBTSxTQUFTLEdBQUcsYUFBYSxDQUFDO0lBRWhDLElBQUksQ0FBQyxrR0FBa0csRUFBRSxHQUFHLEVBQUU7UUFDNUcsTUFBTSxXQUFXLEdB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QztvQkFDcEIsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsVUFBVSxFQUFFLGdCQUFVLENBQUMsTUFBTTtvQkFDN0IsUUFBUSxFQUFFLEVBQUU7aUJBQ2IsQ0FBQztZQUNGLE1BQU0sRUFBRSxDQUFDO1NBQ1YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxRQUFRLEdBQUcscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFM0MsUUFBUSxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixFQUFFO1lBQ2pELFNBQVMsRUFBRTtnQkFDVCxZQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUU7d0JBQ2hCLFVBQVUsRUFBRSxDQUFDO2dDQUNYLFlBQVksRUFBRSxDQUFDLG9CQUFvQixFQUFFLFdBQVcsQ0FBQzs2QkFDbEQsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDO3FCQUNaLENBQUM7YUFDSDtTQUNGLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxrQkFBa0IsRUFBRTtZQUNqRCxTQUFTLEVBQUU7Z0JBQ1QsWUFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFO3dCQUNoQixVQUFVLEVBQUUsQ0FBQztnQ0FDWCxZQUFZLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxXQUFXLENBQUM7NkJBQ2xELEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQztxQkFDWixDQUFDO2FBQ0g7U0FDRixDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsZUFBZSxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRWxELENBQUMsQ0FBQyxDQUFDO0FBRUwsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgSXBBZGRyZXNzZXMsIFN1Ym5ldFR5cGUsIFZwYyB9IGZyb20gJy4uL2xpYic7XG5cbmRlc2NyaWJlKCdDaWRyIHZwYyBhbGxvY2F0aW9uJywgKCkgPT4ge1xuXG4gIHRlc3QoJ0RlZmF1bHQgQ2lkciByZXR1cm5zIHRoZSBjb3JyZWN0IHZwYyBjaWRyJywgKCkgPT4ge1xuICAgIGNvbnN0IGlwQWRkcmVzc2VzID0gSXBBZGRyZXNzZXMuY2lkcignMTAuMC4wLjAvMTYnKTtcbiAgICBleHBlY3QoaXBBZGRyZXNzZXMuYWxsb2NhdGVWcGNDaWRyKCkuY2lkckJsb2NrKS50b0VxdWFsKCcxMC4wLjAuMC8xNicpO1xuICB9KTtcblxuICB0ZXN0KCdEZWZhdWx0IENpZHIgcmV0dXJucyBpcHY0SXBhbVBvb2xJZCBhcyB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgY29uc3QgaXBBZGRyZXNzZXMgPSBJcEFkZHJlc3Nlcy5jaWRyKCcxMC4wLjAuMC8xNicpO1xuICAgIGV4cGVjdChpcEFkZHJlc3Nlcy5hbGxvY2F0ZVZwY0NpZHIoKS5pcHY0SXBhbVBvb2xJZCkudG9CZVVuZGVmaW5lZDtcbiAgfSk7XG5cbiAgdGVzdCgnRGVmYXVsdCBDaWRyIHJldHVybnMgaXB2NE5ldG1hc2tMZW5ndGggYXMgdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgIGNvbnN0IGlwQWRkcmVzc2VzID0gSXBBZGRyZXNzZXMuY2lkcignMTAuMC4wLjAvMTYnKTtcbiAgICBleHBlY3QoaXBBZGRyZXNzZXMuYWxsb2NhdGVWcGNDaWRyKCkuaXB2NE5ldG1hc2tMZW5ndGgpLnRvQmVVbmRlZmluZWQ7XG4gIH0pO1xuXG59KTtcblxuZGVzY3JpYmUoJ0lwQWRkcmVzc2VzLmNpZHIgc3VibmV0cyBhbGxvY2F0aW9uJywgKCkgPT4ge1xuXG4gIGNvbnN0IGNpZHJQcm9wcyA9ICcxMC4wLjAuMC8xNic7XG5cbiAgdGVzdCgnRGVmYXVsdCBDaWRyIHJldHVybnMgdGhlIGNvcnJlY3Qgc3VibmV0IGFsbG9jYXRpb25zLCB3aGVuIHlvdSBkbyBub3QgZ2l2ZSBhIGNpZHIgZm9yIHRoZSBzdWJuZXRzJywgKCkgPT4ge1xuICAgIGNvbnN0IGlwQWRkcmVzc2VzID0gSXBBZGRyZXNzZXMuY2lkcihjaWRyUHJvcHMpO1xuICAgIGV4cGVjdChpcEFkZHJlc3Nlcy5hbGxvY2F0ZVN1Ym5ldHNDaWRyKHtcbiAgICAgIHJlcXVlc3RlZFN1Ym5ldHM6IFt7XG4gICAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICdkdW1teUF6MScsXG4gICAgICAgIGNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICBuYW1lOiAncHVibGljJyxcbiAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBVQkxJQyxcbiAgICAgICAgfSxcbiAgICAgICAgc3VibmV0Q29uc3RydWN0SWQ6ICdwdWJsaWMnLFxuICAgICAgfSwge1xuICAgICAgICBhdmFpbGFiaWxpdHlab25lOiAnZHVtbXlBejEnLFxuICAgICAgICBjb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgbmFtZTogJ3ByaXZhdGUtd2l0aC1lZ3Jlc3MnLFxuICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX0VHUkVTUyxcbiAgICAgICAgfSxcbiAgICAgICAgc3VibmV0Q29uc3RydWN0SWQ6ICdwdWJsaWMnLFxuICAgICAgfV0sXG4gICAgICB2cGNDaWRyOiAnMTAuMC4wLjAvMTYnLFxuICAgIH0pLmFsbG9jYXRlZFN1Ym5ldHMpLnRvRXF1YWwoW3sgY2lkcjogJzEwLjAuMC4wLzE3JyB9LCB7IGNpZHI6ICcxMC4wLjEyOC4wLzE3JyB9XSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0RlZmF1bHQgQ2lkciByZXR1cm5zIHRoZSBjb3JyZWN0IHN1Ym5ldCBhbGxvY2F0aW9ucywgd2hlbiB5b3UgcHJvdmlkZSBhIGNpZHIgZm9yIHRoZSBzdWJuZXRzJywgKCkgPT4ge1xuICAgIGNvbnN0IGlwQWRkcmVzc2VzID0gSXBBZGRyZXNzZXMuY2lkcihjaWRyUHJvcHMpO1xuICAgIGV4cGVjdChpcEFkZHJlc3Nlcy5hbGxvY2F0ZVN1Ym5ldHNDaWRyKHtcbiAgICAgIHJlcXVlc3RlZFN1Ym5ldHM6IFt7XG4gICAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICdkdW1teUF6MScsXG4gICAgICAgIGNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICBuYW1lOiAncHVibGljJyxcbiAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBVQkxJQyxcbiAgICAgICAgICBjaWRyTWFzazogMjQsXG4gICAgICAgIH0sXG4gICAgICAgIHN1Ym5ldENvbnN0cnVjdElkOiAncHVibGljJyxcbiAgICAgIH0sIHtcbiAgICAgICAgYXZhaWxhYmlsaXR5Wm9uZTogJ2R1bW15QXoxJyxcbiAgICAgICAgY29uZmlndXJhdGlvbjoge1xuICAgICAgICAgIG5hbWU6ICdwcml2YXRlLXdpdGgtZWdyZXNzJyxcbiAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9FR1JFU1MsXG4gICAgICAgICAgY2lkck1hc2s6IDI0LFxuICAgICAgICB9LFxuICAgICAgICBzdWJuZXRDb25zdHJ1Y3RJZDogJ3B1YmxpYycsXG4gICAgICB9XSxcbiAgICAgIHZwY0NpZHI6ICcxMC4wLjAuMC8xNicsXG4gICAgfSkuYWxsb2NhdGVkU3VibmV0cykudG9FcXVhbChbeyBjaWRyOiAnMTAuMC4wLjAvMjQnIH0sIHsgY2lkcjogJzEwLjAuMS4wLzI0JyB9XSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0RlZmF1bHQgQ2lkciByZXR1cm5zIHRoZSBjb3JyZWN0IHN1Ym5ldCBhbGxvY2F0aW9ucywgd2hlbiB5b3UgbWl4IHByb3ZpZGVkIGFuZCBub24gcHJvdmlkZWQgY2lkciBmb3IgdGhlIHN1Ym5ldHMnLCAoKSA9PiB7XG4gICAgY29uc3QgaXBBZGRyZXNzZXMgPSBJcEFkZHJlc3Nlcy5jaWRyKGNpZHJQcm9wcyk7XG4gICAgZXhwZWN0KGlwQWRkcmVzc2VzLmFsbG9jYXRlU3VibmV0c0NpZHIoe1xuICAgICAgcmVxdWVzdGVkU3VibmV0czogW3tcbiAgICAgICAgYXZhaWxhYmlsaXR5Wm9uZTogJ2R1bW15QXoxJyxcbiAgICAgICAgY29uZmlndXJhdGlvbjoge1xuICAgICAgICAgIG5hbWU6ICdwdWJsaWMnLFxuICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgICB9LFxuICAgICAgICBzdWJuZXRDb25zdHJ1Y3RJZDogJ3B1YmxpYycsXG4gICAgICB9LCB7XG4gICAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICdkdW1teUF6MScsXG4gICAgICAgIGNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICBuYW1lOiAncHJpdmF0ZS13aXRoLWVncmVzcycsXG4gICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfRUdSRVNTLFxuICAgICAgICAgIGNpZHJNYXNrOiAyNCxcbiAgICAgICAgfSxcbiAgICAgICAgc3VibmV0Q29uc3RydWN0SWQ6ICdwdWJsaWMnLFxuICAgICAgfV0sXG4gICAgICB2cGNDaWRyOiAnMTAuMC4wLjAvMTYnLFxuICAgIH0pLmFsbG9jYXRlZFN1Ym5ldHMpLnRvRXF1YWwoW3sgY2lkcjogJzEwLjAuMTI4LjAvMTcnIH0sIHsgY2lkcjogJzEwLjAuMC4wLzI0JyB9XSk7XG4gIH0pO1xuXG59KTtcblxuZGVzY3JpYmUoJ0F3c0lwYW0gdnBjIGFsbG9jYXRpb24nLCAoKSA9PiB7XG5cbiAgY29uc3QgYXdzSXBhbVByb3BzID0ge1xuICAgIGlwdjRJcGFtUG9vbElkOiAnaXBhbS1wb29sLTAxMTEyMjIzMzM0NDQnLFxuICAgIGlwdjROZXRtYXNrTGVuZ3RoOiAyMixcbiAgfTtcblxuICB0ZXN0KCdBd3NJcGFtIHJldHVybnMgY2lkckJsb2NrIGFzIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgICBjb25zdCBpcEFkZHJlc3NlcyA9IElwQWRkcmVzc2VzLmF3c0lwYW1BbGxvY2F0aW9uKGF3c0lwYW1Qcm9wcyk7XG4gICAgZXhwZWN0KGlwQWRkcmVzc2VzLmFsbG9jYXRlVnBjQ2lkcigpLmNpZHJCbG9jaykudG9CZVVuZGVmaW5lZDtcbiAgfSk7XG5cbiAgdGVzdCgnQXdzSXBhbSByZXR1cm5zIHRoZSBjb3JyZWN0IHZwYyBpcHY0SXBhbVBvb2xJZCcsICgpID0+IHtcbiAgICBjb25zdCBpcEFkZHJlc3NlcyA9IElwQWRkcmVzc2VzLmF3c0lwYW1BbGxvY2F0aW9uKGF3c0lwYW1Qcm9wcyk7XG4gICAgZXhwZWN0KGlwQWRkcmVzc2VzLmFsbG9jYXRlVnBjQ2lkcigpLmlwdjRJcGFtUG9vbElkKS50b0VxdWFsKCdpcGFtLXBvb2wtMDExMTIyMjMzMzQ0NCcpO1xuICB9KTtcblxuICB0ZXN0KCdBd3NJcGFtIHJldHVybnMgdGhlIGNvcnJlY3QgdnBjIGlwdjROZXRtYXNrTGVuZ3RoJywgKCkgPT4ge1xuICAgIGNvbnN0IGlwQWRkcmVzc2VzID0gSXBBZGRyZXNzZXMuYXdzSXBhbUFsbG9jYXRpb24oYXdzSXBhbVByb3BzKTtcbiAgICBleHBlY3QoaXBBZGRyZXNzZXMuYWxsb2NhdGVWcGNDaWRyKCkuaXB2NE5ldG1hc2tMZW5ndGgpLnRvRXF1YWwoMjIpO1xuICB9KTtcblxufSk7XG5cbmRlc2NyaWJlKCdBd3NJcGFtIHN1Ym5ldHMgYWxsb2NhdGlvbicsICgpID0+IHtcblxuICBjb25zdCBhd3NJcGFtUHJvcHMgPSB7XG4gICAgaXB2NElwYW1Qb29sSWQ6ICdpcGFtLXBvb2wtMDExMTIyMjMzMzQ0NCcsXG4gICAgaXB2NE5ldG1hc2tMZW5ndGg6IDIyLFxuICB9O1xuXG4gIHRlc3QoJ0F3c0lwYW0gcmV0dXJucyBzdWJuZXQgYWxsb2NhdGlvbnMgYXMgMnggVE9LRU4sIHdoZW4geW91IGRvIG5vdCBnaXZlIGEgY2lkciBmb3IgdGhlIHN1Ym5ldHMnLCAoKSA9PiB7XG4gICAgY29uc3QgaXBBZGRyZXNzZXMgPSBJcEFkZHJlc3Nlcy5hd3NJcGFtQWxsb2NhdGlvbih7IGRlZmF1bHRTdWJuZXRJcHY0TmV0bWFza0xlbmd0aDogMjQsIC4uLmF3c0lwYW1Qcm9wcyB9KTtcbiAgICBjb25zdCBhbGxvY2F0aW9ucyA9IGlwQWRkcmVzc2VzLmFsbG9jYXRlU3VibmV0c0NpZHIoe1xuICAgICAgcmVxdWVzdGVkU3VibmV0czogW3tcbiAgICAgICAgYXZhaWxhYmlsaXR5Wm9uZTogJ2R1bW15QXoxJyxcbiAgICAgICAgY29uZmlndXJhdGlvbjoge1xuICAgICAgICAgIG5hbWU6ICdwdWJsaWMnLFxuICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgICB9LFxuICAgICAgICBzdWJuZXRDb25zdHJ1Y3RJZDogJ3B1YmxpYycsXG4gICAgICB9LCB7XG4gICAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICdkdW1teUF6MScsXG4gICAgICAgIGNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICBuYW1lOiAncHJpdmF0ZS13aXRoLWVncmVzcycsXG4gICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfRUdSRVNTLFxuICAgICAgICB9LFxuICAgICAgICBzdWJuZXRDb25zdHJ1Y3RJZDogJ3B1YmxpYycsXG4gICAgICB9XSxcbiAgICAgIHZwY0NpZHI6ICcxMC4wLjAuMC8xNicsXG4gICAgfSk7XG5cbiAgICBleHBlY3QgKGFsbG9jYXRpb25zLmFsbG9jYXRlZFN1Ym5ldHMubGVuZ3RoKS50b0JlKDIpO1xuICAgIGV4cGVjdCAoYWxsb2NhdGlvbnMuYWxsb2NhdGVkU3VibmV0c1swXS5jaWRyKS50b0NvbnRhaW4oJ1RPS0VOJyk7XG4gICAgZXhwZWN0IChhbGxvY2F0aW9ucy5hbGxvY2F0ZWRTdWJuZXRzWzFdLmNpZHIpLnRvQ29udGFpbignVE9LRU4nKTtcbiAgfSk7XG5cbiAgdGVzdCgnQXdzSXBhbSByZXR1cm5zIHN1Ym5ldCBhbGxvY2F0aW9ucyBhcyAyeCBUT0tFTiwgd2hlbiB5b3UgcHJvdmlkZSBhIGNpZHIgZm9yIHRoZSBzdWJuZXRzJywgKCkgPT4ge1xuICAgIGNvbnN0IGlwQWRkcmVzc2VzID0gSXBBZGRyZXNzZXMuYXdzSXBhbUFsbG9jYXRpb24oYXdzSXBhbVByb3BzKTtcbiAgICBjb25zdCBhbGxvY2F0aW9ucyA9IGlwQWRkcmVzc2VzLmFsbG9jYXRlU3VibmV0c0NpZHIoe1xuICAgICAgcmVxdWVzdGVkU3VibmV0czogW3tcbiAgICAgICAgYXZhaWxhYmlsaXR5Wm9uZTogJ2R1bW15QXoxJyxcbiAgICAgICAgY29uZmlndXJhdGlvbjoge1xuICAgICAgICAgIG5hbWU6ICdwdWJsaWMnLFxuICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgICAgIGNpZHJNYXNrOiAyNCxcbiAgICAgICAgfSxcbiAgICAgICAgc3VibmV0Q29uc3RydWN0SWQ6ICdwdWJsaWMnLFxuICAgICAgfSwge1xuICAgICAgICBhdmFpbGFiaWxpdHlab25lOiAnZHVtbXlBejEnLFxuICAgICAgICBjb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgbmFtZTogJ3ByaXZhdGUtd2l0aC1lZ3Jlc3MnLFxuICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX0VHUkVTUyxcbiAgICAgICAgICBjaWRyTWFzazogMjQsXG4gICAgICAgIH0sXG4gICAgICAgIHN1Ym5ldENvbnN0cnVjdElkOiAncHVibGljJyxcbiAgICAgIH1dLFxuICAgICAgdnBjQ2lkcjogJzEwLjAuMC4wLzE2JyxcbiAgICB9KTtcblxuICAgIGV4cGVjdCAoYWxsb2NhdGlvbnMuYWxsb2NhdGVkU3VibmV0cy5sZW5ndGgpLnRvQmUoMik7XG4gICAgZXhwZWN0IChhbGxvY2F0aW9ucy5hbGxvY2F0ZWRTdWJuZXRzWzBdLmNpZHIpLnRvQ29udGFpbignVE9LRU4nKTtcbiAgICBleHBlY3QgKGFsbG9jYXRpb25zLmFsbG9jYXRlZFN1Ym5ldHNbMV0uY2lkcikudG9Db250YWluKCdUT0tFTicpO1xuICB9KTtcblxuICB0ZXN0KCdBd3NJcGFtIHJldHVybnMgc3VibmV0IGFsbG9jYXRpb25zIGFzIDJ4IFRPS0VOLCB3aGVuIHlvdSBtaXggcHJvdmlkZSBhbmQgbm9uIHByb3ZpZGVkIGNpZHIgZm9yIHRoZSBzdWJuZXRzJywgKCkgPT4ge1xuICAgIGNvbnN0IGlwQWRkcmVzc2VzID0gSXBBZGRyZXNzZXMuYXdzSXBhbUFsbG9jYXRpb24oeyBkZWZhdWx0U3VibmV0SXB2NE5ldG1hc2tMZW5ndGg6IDI0LCAuLi5hd3NJcGFtUHJvcHMgfSk7XG4gICAgY29uc3QgYWxsb2NhdGlvbnMgPSBpcEFkZHJlc3Nlcy5hbGxvY2F0ZVN1Ym5ldHNDaWRyKHtcbiAgICAgIHJlcXVlc3RlZFN1Ym5ldHM6IFt7XG4gICAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICdkdW1teUF6MScsXG4gICAgICAgIGNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICBuYW1lOiAncHVibGljJyxcbiAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBVQkxJQyxcbiAgICAgICAgfSxcbiAgICAgICAgc3VibmV0Q29uc3RydWN0SWQ6ICdwdWJsaWMnLFxuICAgICAgfSwge1xuICAgICAgICBhdmFpbGFiaWxpdHlab25lOiAnZHVtbXlBejEnLFxuICAgICAgICBjb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgbmFtZTogJ3ByaXZhdGUtd2l0aC1lZ3Jlc3MnLFxuICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX0VHUkVTUyxcbiAgICAgICAgICBjaWRyTWFzazogMjQsXG4gICAgICAgIH0sXG4gICAgICAgIHN1Ym5ldENvbnN0cnVjdElkOiAncHVibGljJyxcbiAgICAgIH1dLFxuICAgICAgdnBjQ2lkcjogJzEwLjAuMC4wLzE2JyxcbiAgICB9KTtcblxuICAgIGV4cGVjdCAoYWxsb2NhdGlvbnMuYWxsb2NhdGVkU3VibmV0cy5sZW5ndGgpLnRvQmUoMik7XG4gICAgZXhwZWN0IChhbGxvY2F0aW9ucy5hbGxvY2F0ZWRTdWJuZXRzWzBdLmNpZHIpLnRvQ29udGFpbignVE9LRU4nKTtcbiAgICBleHBlY3QgKGFsbG9jYXRpb25zLmFsbG9jYXRlZFN1Ym5ldHNbMV0uY2lkcikudG9Db250YWluKCdUT0tFTicpO1xuICB9KTtcblxufSk7XG5cbmRlc2NyaWJlKCdJcEFkZHJlc3Nlcy5jaWRyIFZwYyBJbnRlZ3JhdGlvbicsICgpID0+IHtcbiAgdGVzdCgnSXBBZGRyZXNzZXMuY2lkciBwcm92aWRlcyB0aGUgY29ycmVjdCBDaWRyIGFsbG9jYXRpb24gdG8gdGhlIFZwYyAnLCAoKSA9PiB7XG5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3QgY2lkclByb3BzID0gJzEwLjAuMC4wLzE2JztcbiAgICBjb25zdCBpcEFkZHJlc3NlcyA9IElwQWRkcmVzc2VzLmNpZHIoY2lkclByb3BzKTtcblxuICAgIG5ldyBWcGMoc3RhY2ssICdWcGNOZXR3b3JrJywgeyBpcEFkZHJlc3NlczogaXBBZGRyZXNzZXMgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlZQQycsIHtcbiAgICAgIENpZHJCbG9jazogY2lkclByb3BzLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdJcEFkZHJlc3Nlcy5jaWRyIHByb3ZpZGVzIHRoZSBjb3JyZWN0IFN1Ym5ldCBhbGxvY2F0aW9uIHRvIHRoZSBWcGMnLCAoKSA9PiB7XG5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3QgY2lkclByb3BzID0gJzEwLjAuMC4wLzE2JztcbiAgICBjb25zdCBpcEFkZHJlc3NlcyA9IElwQWRkcmVzc2VzLmNpZHIoY2lkclByb3BzKTtcblxuICAgIG5ldyBWcGMoc3RhY2ssICdWcGNOZXR3b3JrJywgeyBpcEFkZHJlc3NlczogaXBBZGRyZXNzZXMgfSk7XG5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG5cbiAgICB0ZW1wbGF0ZS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTdWJuZXQnLCB7XG4gICAgICBDaWRyQmxvY2s6ICcxMC4wLjAuMC8xOCcsXG4gICAgfSk7XG4gICAgdGVtcGxhdGUuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U3VibmV0Jywge1xuICAgICAgQ2lkckJsb2NrOiAnMTAuMC42NC4wLzE4JyxcbiAgICB9KTtcbiAgICB0ZW1wbGF0ZS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTdWJuZXQnLCB7XG4gICAgICBDaWRyQmxvY2s6ICcxMC4wLjEyOC4wLzE4JyxcbiAgICB9KTtcbiAgICB0ZW1wbGF0ZS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTdWJuZXQnLCB7XG4gICAgICBDaWRyQmxvY2s6ICcxMC4wLjE5Mi4wLzE4JyxcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ0F3c0lwYW0gVnBjIEludGVncmF0aW9uJywgKCkgPT4ge1xuXG4gIHRlc3QoJ1Nob3VsZCB0aHJvdyBpZiB0aGVyZSBhcmUgc3VibmV0cyB3aXRob3V0IGV4cGxpY2l0IENpZHIgYW5kIG5vIGRlZmF1bHRDaWRyIGdpdmVuJywgKCkgPT4ge1xuXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IGF3c0lwYW1Qcm9wcyA9IHtcbiAgICAgIGlwdjRJcGFtUG9vbElkOiAnaXBhbS1wb29sLTAxMTEyMjIzMzM0NDQnLFxuICAgICAgaXB2NE5ldG1hc2tMZW5ndGg6IDIyLFxuICAgIH07XG5cbiAgICBjb25zdCBpcEFkZHJlc3NlcyA9IElwQWRkcmVzc2VzLmF3c0lwYW1BbGxvY2F0aW9uKGF3c0lwYW1Qcm9wcyk7XG5cbiAgICBleHBlY3QoKCkgPT4ge25ldyBWcGMoc3RhY2ssICdWcGNOZXR3b3JrJywgeyBpcEFkZHJlc3NlczogaXBBZGRyZXNzZXMgfSk7fSkudG9UaHJvdygvSWYgeW91IGhhdmUgbm90IHNldCBhIGNpZHIgZm9yIGFsbCBzdWJuZXRzIGluIHRoaXMgY2FzZSB5b3UgbXVzdCBzZXQgYSBkZWZhdWx0Q2lkck1hc2sgaW4gQXdzSXBhbSBPcHRpb25zLyk7O1xuXG4gIH0pO1xuXG4gIHRlc3QoJ0F3c0lwYW0gcHJvdmlkZXMgdGhlIGNvcnJlY3QgQ2lkciBhbGxvY2F0aW9uIHRvIHRoZSBWcGMgJywgKCkgPT4ge1xuXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IGF3c0lwYW1Qcm9wcyA9IHtcbiAgICAgIGlwdjRJcGFtUG9vbElkOiAnaXBhbS1wb29sLTAxMTEyMjIzMzM0NDQnLFxuICAgICAgaXB2NE5ldG1hc2tMZW5ndGg6IDIyLFxuICAgICAgZGVmYXVsdFN1Ym5ldElwdjROZXRtYXNrTGVuZ3RoOiAyNCxcbiAgICB9O1xuXG4gICAgY29uc3QgaXBBZGRyZXNzZXMgPSBJcEFkZHJlc3Nlcy5hd3NJcGFtQWxsb2NhdGlvbihhd3NJcGFtUHJvcHMpO1xuXG4gICAgbmV3IFZwYyhzdGFjaywgJ1ZwY05ldHdvcmsnLCB7IGlwQWRkcmVzc2VzOiBpcEFkZHJlc3NlcyB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6VlBDJywge1xuICAgICAgSXB2NElwYW1Qb29sSWQ6IGF3c0lwYW1Qcm9wcy5pcHY0SXBhbVBvb2xJZCxcbiAgICAgIElwdjROZXRtYXNrTGVuZ3RoOiBhd3NJcGFtUHJvcHMuaXB2NE5ldG1hc2tMZW5ndGgsXG4gICAgfSk7XG4gIH0pO1xuXG5cbiAgdGVzdCgnQXdzSXBhbSBwcm92aWRlcyB0aGUgY29ycmVjdCBTdWJuZXQgYWxsb2NhdGlvbiB0byB0aGUgVnBjJywgKCkgPT4ge1xuXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IGF3c0lwYW1Qcm9wcyA9IHtcbiAgICAgIGlwdjRJcGFtUG9vbElkOiAnaXBhbS1wb29sLTAxMTEyMjIzMzM0NDQnLFxuICAgICAgaXB2NE5ldG1hc2tMZW5ndGg6IDIyLFxuICAgICAgZGVmYXVsdFN1Ym5ldElwdjROZXRtYXNrTGVuZ3RoOiAyNCxcbiAgICB9O1xuXG4gICAgY29uc3QgaXBBZGRyZXNzZXMgPSBJcEFkZHJlc3Nlcy5hd3NJcGFtQWxsb2NhdGlvbihhd3NJcGFtUHJvcHMpO1xuXG4gICAgbmV3IFZwYyhzdGFjaywgJ1ZwY05ldHdvcmsnLCB7IGlwQWRkcmVzc2VzOiBpcEFkZHJlc3NlcyB9KTtcblxuICAgIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcblxuICAgIHRlbXBsYXRlLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlN1Ym5ldCcsIHtcbiAgICAgIENpZHJCbG9jazoge1xuICAgICAgICAnRm46OlNlbGVjdCc6IFswLCB7XG4gICAgICAgICAgJ0ZuOjpDaWRyJzogW3tcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogWydWcGNOZXR3b3JrQjI1OEU4M0EnLCAnQ2lkckJsb2NrJ10sXG4gICAgICAgICAgfSwgNCwgJzgnXSxcbiAgICAgICAgfV0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIHRlbXBsYXRlLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlN1Ym5ldCcsIHtcbiAgICAgIENpZHJCbG9jazoge1xuICAgICAgICAnRm46OlNlbGVjdCc6IFsxLCB7XG4gICAgICAgICAgJ0ZuOjpDaWRyJzogW3tcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogWydWcGNOZXR3b3JrQjI1OEU4M0EnLCAnQ2lkckJsb2NrJ10sXG4gICAgICAgICAgfSwgNCwgJzgnXSxcbiAgICAgICAgfV0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIHRlbXBsYXRlLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlN1Ym5ldCcsIHtcbiAgICAgIENpZHJCbG9jazoge1xuICAgICAgICAnRm46OlNlbGVjdCc6IFsyLCB7XG4gICAgICAgICAgJ0ZuOjpDaWRyJzogW3tcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogWydWcGNOZXR3b3JrQjI1OEU4M0EnLCAnQ2lkckJsb2NrJ10sXG4gICAgICAgICAgfSwgNCwgJzgnXSxcbiAgICAgICAgfV0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIHRlbXBsYXRlLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlN1Ym5ldCcsIHtcbiAgICAgIENpZHJCbG9jazoge1xuICAgICAgICAnRm46OlNlbGVjdCc6IFszLCB7XG4gICAgICAgICAgJ0ZuOjpDaWRyJzogW3tcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogWydWcGNOZXR3b3JrQjI1OEU4M0EnLCAnQ2lkckJsb2NrJ10sXG4gICAgICAgICAgfSwgNCwgJzgnXSxcbiAgICAgICAgfV0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdTaG91bGQgdGhyb3cgaWYgaXB2NE5ldG1hc2tMZW5ndGggbm90IGJpZyBlbm91Z2ggdG8gYWxsb2NhdGUgc3VibmV0cycsICgpID0+IHtcblxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjb25zdCBhd3NJcGFtUHJvcHMgPSB7XG4gICAgICBpcHY0SXBhbVBvb2xJZDogJ2lwYW0tcG9vbC0wMTExMjIyMzMzNDQ0JyxcbiAgICAgIGlwdjROZXRtYXNrTGVuZ3RoOiAxOCxcbiAgICAgIGRlZmF1bHRTdWJuZXRJcHY0TmV0bWFza0xlbmd0aDogMTcsXG4gICAgfTtcblxuICAgIGNvbnN0IGlwQWRkcmVzc2VzID0gSXBBZGRyZXNzZXMuYXdzSXBhbUFsbG9jYXRpb24oYXdzSXBhbVByb3BzKTtcblxuICAgIGV4cGVjdCgoKSA9PiB7bmV3IFZwYyhzdGFjaywgJ1ZwY05ldHdvcmsnLCB7IGlwQWRkcmVzc2VzOiBpcEFkZHJlc3NlcyB9KTt9KS50b1Rocm93KCdJUCBzcGFjZSBvZiBzaXplIC8xOCBub3QgYmlnIGVub3VnaCB0byBhbGxvY2F0ZSBzdWJuZXRzIG9mIHNpemVzIC8xNywvMTcsLzE3LC8xNycpOztcblxuICB9KTtcblxuICB0ZXN0KCdTaG91bGQgYmUgYWJsZSB0byBhbGxvY2F0ZSBzdWJuZXRzIGZyb20gYSBTdWJuZXRDb25maWd1cmF0aW9uIGluIFZwYyBDb25zdHJ1Y3RvcicsICgpID0+IHtcblxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjb25zdCBhd3NJcGFtUHJvcHMgPSB7XG4gICAgICBpcHY0SXBhbVBvb2xJZDogJ2lwYW0tcG9vbC0wMTExMjIyMzMzNDQ0JyxcbiAgICAgIGlwdjROZXRtYXNrTGVuZ3RoOiAxOCxcbiAgICAgIGRlZmF1bHRTdWJuZXRJcHY0TmV0bWFza0xlbmd0aDogMTcsXG4gICAgfTtcblxuICAgIGNvbnN0IGlwQWRkcmVzc2VzID0gSXBBZGRyZXNzZXMuYXdzSXBhbUFsbG9jYXRpb24oYXdzSXBhbVByb3BzKTtcblxuICAgIG5ldyBWcGMoc3RhY2ssICdWcGNOZXR3b3JrJywge1xuICAgICAgaXBBZGRyZXNzZXM6IGlwQWRkcmVzc2VzLFxuICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW3tcbiAgICAgICAgbmFtZTogJ3B1YmxpYycsXG4gICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgICBjaWRyTWFzazogMjQsXG4gICAgICB9XSxcbiAgICAgIG1heEF6czogMixcbiAgICB9KTtcblxuICAgIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcblxuICAgIHRlbXBsYXRlLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlN1Ym5ldCcsIHtcbiAgICAgIENpZHJCbG9jazoge1xuICAgICAgICAnRm46OlNlbGVjdCc6IFswLCB7XG4gICAgICAgICAgJ0ZuOjpDaWRyJzogW3tcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogWydWcGNOZXR3b3JrQjI1OEU4M0EnLCAnQ2lkckJsb2NrJ10sXG4gICAgICAgICAgfSwgNjQsICc4J10sXG4gICAgICAgIH1dLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRlbXBsYXRlLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlN1Ym5ldCcsIHtcbiAgICAgIENpZHJCbG9jazoge1xuICAgICAgICAnRm46OlNlbGVjdCc6IFsxLCB7XG4gICAgICAgICAgJ0ZuOjpDaWRyJzogW3tcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogWydWcGNOZXR3b3JrQjI1OEU4M0EnLCAnQ2lkckJsb2NrJ10sXG4gICAgICAgICAgfSwgNjQsICc4J10sXG4gICAgICAgIH1dLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRlbXBsYXRlLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6OlN1Ym5ldCcsIDIpO1xuXG4gIH0pO1xuXG59KTtcbiJdfQ==