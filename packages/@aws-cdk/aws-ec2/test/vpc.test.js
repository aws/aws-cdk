"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('vpc', () => {
    describe('When creating a VPC', () => {
        (0, cdk_build_tools_1.testDeprecated)('SubnetType.PRIVATE_WITH_NAT is equivalent to SubnetType.PRIVATE_WITH_EGRESS', () => {
            const stack1 = getTestStack();
            const stack2 = getTestStack();
            new lib_1.Vpc(stack1, 'TheVPC', {
                subnetConfiguration: [
                    {
                        subnetType: lib_1.SubnetType.PRIVATE_WITH_NAT,
                        name: 'subnet',
                    },
                    {
                        subnetType: lib_1.SubnetType.PUBLIC,
                        name: 'public',
                    },
                ],
            });
            new lib_1.Vpc(stack2, 'TheVPC', {
                subnetConfiguration: [
                    {
                        subnetType: lib_1.SubnetType.PRIVATE_WITH_EGRESS,
                        name: 'subnet',
                    },
                    {
                        subnetType: lib_1.SubnetType.PUBLIC,
                        name: 'public',
                    },
                ],
            });
            const t1 = assertions_1.Template.fromStack(stack1);
            const t2 = assertions_1.Template.fromStack(stack2);
            expect(t1.toJSON()).toEqual(t2.toJSON());
        });
        (0, cdk_build_tools_1.testDeprecated)('SubnetType.PRIVATE is equivalent to SubnetType.PRIVATE_WITH_NAT', () => {
            const stack1 = getTestStack();
            const stack2 = getTestStack();
            new lib_1.Vpc(stack1, 'TheVPC', {
                subnetConfiguration: [
                    {
                        subnetType: lib_1.SubnetType.PRIVATE,
                        name: 'subnet',
                    },
                    {
                        subnetType: lib_1.SubnetType.PUBLIC,
                        name: 'public',
                    },
                ],
            });
            new lib_1.Vpc(stack2, 'TheVPC', {
                subnetConfiguration: [
                    {
                        subnetType: lib_1.SubnetType.PRIVATE_WITH_NAT,
                        name: 'subnet',
                    },
                    {
                        subnetType: lib_1.SubnetType.PUBLIC,
                        name: 'public',
                    },
                ],
            });
            const t1 = assertions_1.Template.fromStack(stack1);
            const t2 = assertions_1.Template.fromStack(stack2);
            expect(t1.toJSON()).toEqual(t2.toJSON());
        });
        (0, cdk_build_tools_1.testDeprecated)('SubnetType.ISOLATED is equivalent to SubnetType.PRIVATE_ISOLATED', () => {
            const stack1 = getTestStack();
            const stack2 = getTestStack();
            new lib_1.Vpc(stack1, 'TheVPC', {
                subnetConfiguration: [
                    {
                        subnetType: lib_1.SubnetType.ISOLATED,
                        name: 'subnet',
                    },
                ],
            });
            new lib_1.Vpc(stack2, 'TheVPC', {
                subnetConfiguration: [
                    {
                        subnetType: lib_1.SubnetType.PRIVATE_ISOLATED,
                        name: 'subnet',
                    },
                ],
            });
            const t1 = assertions_1.Template.fromStack(stack1);
            const t2 = assertions_1.Template.fromStack(stack2);
            expect(t1.toJSON()).toEqual(t2.toJSON());
        });
        describe('with the default CIDR range', () => {
            test('vpc.vpcId returns a token to the VPC ID', () => {
                const stack = getTestStack();
                const vpc = new lib_1.Vpc(stack, 'TheVPC');
                expect(stack.resolve(vpc.vpcId)).toEqual({ Ref: 'TheVPC92636AB0' });
            });
            test('vpc.vpcArn returns a token to the VPC ID', () => {
                const stack = getTestStack();
                const vpc = new lib_1.Vpc(stack, 'TheVPC');
                expect(stack.resolve(vpc.vpcArn)).toEqual({ 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ec2:us-east-1:123456789012:vpc/', { Ref: 'TheVPC92636AB0' }]] });
            });
            test('it uses the correct network range', () => {
                const stack = getTestStack();
                new lib_1.Vpc(stack, 'TheVPC');
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPC', {
                    CidrBlock: lib_1.Vpc.DEFAULT_CIDR_RANGE,
                    EnableDnsHostnames: true,
                    EnableDnsSupport: true,
                    InstanceTenancy: lib_1.DefaultInstanceTenancy.DEFAULT,
                });
            });
            test('the Name tag is defaulted to path', () => {
                const stack = getTestStack();
                new lib_1.Vpc(stack, 'TheVPC');
                assertions_1.Template.fromStack(stack).hasResource('AWS::EC2::VPC', hasTags([{ Key: 'Name', Value: 'TestStack/TheVPC' }]));
                assertions_1.Template.fromStack(stack).hasResource('AWS::EC2::InternetGateway', hasTags([{ Key: 'Name', Value: 'TestStack/TheVPC' }]));
            });
        });
        test('with all of the properties set, it successfully sets the correct VPC properties', () => {
            const stack = getTestStack();
            new lib_1.Vpc(stack, 'TheVPC', {
                ipAddresses: lib_1.IpAddresses.cidr('192.168.0.0/16'),
                enableDnsHostnames: false,
                enableDnsSupport: false,
                defaultInstanceTenancy: lib_1.DefaultInstanceTenancy.DEDICATED,
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPC', {
                CidrBlock: '192.168.0.0/16',
                EnableDnsHostnames: false,
                EnableDnsSupport: false,
                InstanceTenancy: lib_1.DefaultInstanceTenancy.DEDICATED,
            });
        });
        describe('dns getters correspond to CFN properties', () => {
            const inputs = [
                { dnsSupport: false, dnsHostnames: false },
                // {dnsSupport: false, dnsHostnames: true} - this configuration is illegal so its not part of the permutations.
                { dnsSupport: true, dnsHostnames: false },
                { dnsSupport: true, dnsHostnames: true },
            ];
            for (const input of inputs) {
                test(`[dnsSupport=${input.dnsSupport},dnsHostnames=${input.dnsHostnames}]`, () => {
                    const stack = getTestStack();
                    const vpc = new lib_1.Vpc(stack, 'TheVPC', {
                        ipAddresses: lib_1.IpAddresses.cidr('192.168.0.0/16'),
                        enableDnsHostnames: input.dnsHostnames,
                        enableDnsSupport: input.dnsSupport,
                        defaultInstanceTenancy: lib_1.DefaultInstanceTenancy.DEDICATED,
                    });
                    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPC', {
                        CidrBlock: '192.168.0.0/16',
                        EnableDnsHostnames: input.dnsHostnames,
                        EnableDnsSupport: input.dnsSupport,
                        InstanceTenancy: lib_1.DefaultInstanceTenancy.DEDICATED,
                    });
                    expect(input.dnsSupport).toEqual(vpc.dnsSupportEnabled);
                    expect(input.dnsHostnames).toEqual(vpc.dnsHostnamesEnabled);
                });
            }
        });
        test('contains the correct number of subnets', () => {
            const stack = getTestStack();
            const vpc = new lib_1.Vpc(stack, 'TheVPC');
            const zones = stack.availabilityZones.length;
            expect(vpc.publicSubnets.length).toEqual(zones);
            expect(vpc.privateSubnets.length).toEqual(zones);
            expect(stack.resolve(vpc.vpcId)).toEqual({ Ref: 'TheVPC92636AB0' });
        });
        test('can refer to the internet gateway', () => {
            const stack = getTestStack();
            const vpc = new lib_1.Vpc(stack, 'TheVPC');
            expect(stack.resolve(vpc.internetGatewayId)).toEqual({ Ref: 'TheVPCIGWFA25CC08' });
        });
        test('with only isolated subnets, the VPC should not contain an IGW or NAT Gateways', () => {
            const stack = getTestStack();
            new lib_1.Vpc(stack, 'TheVPC', {
                subnetConfiguration: [
                    {
                        subnetType: lib_1.SubnetType.PRIVATE_ISOLATED,
                        name: 'Isolated',
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::InternetGateway', 0);
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::NatGateway', 0);
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Subnet', {
                MapPublicIpOnLaunch: false,
            });
        });
        test('with no private subnets, the VPC should have an IGW but no NAT Gateways', () => {
            const stack = getTestStack();
            new lib_1.Vpc(stack, 'TheVPC', {
                subnetConfiguration: [
                    {
                        subnetType: lib_1.SubnetType.PUBLIC,
                        name: 'Public',
                    },
                    {
                        subnetType: lib_1.SubnetType.PRIVATE_ISOLATED,
                        name: 'Isolated',
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::InternetGateway', 1);
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::NatGateway', 0);
        });
        test('with private subnets and custom networkAcl.', () => {
            const stack = getTestStack();
            const vpc = new lib_1.Vpc(stack, 'TheVPC', {
                subnetConfiguration: [
                    {
                        subnetType: lib_1.SubnetType.PUBLIC,
                        name: 'Public',
                    },
                    {
                        subnetType: lib_1.SubnetType.PRIVATE_WITH_EGRESS,
                        name: 'private',
                    },
                ],
            });
            const nacl1 = new lib_1.NetworkAcl(stack, 'myNACL1', {
                vpc,
                subnetSelection: { subnetType: lib_1.SubnetType.PRIVATE_WITH_EGRESS },
            });
            new lib_1.NetworkAclEntry(stack, 'AllowDNSEgress', {
                networkAcl: nacl1,
                ruleNumber: 100,
                traffic: lib_1.AclTraffic.udpPort(53),
                direction: lib_1.TrafficDirection.EGRESS,
                cidr: lib_1.AclCidr.ipv4('10.0.0.0/16'),
            });
            new lib_1.NetworkAclEntry(stack, 'AllowDNSIngress', {
                networkAcl: nacl1,
                ruleNumber: 100,
                traffic: lib_1.AclTraffic.udpPort(53),
                direction: lib_1.TrafficDirection.INGRESS,
                cidr: lib_1.AclCidr.anyIpv4(),
            });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::NetworkAcl', 1);
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::NetworkAclEntry', 2);
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::SubnetNetworkAclAssociation', 3);
        });
        test('with no subnets defined, the VPC should have an IGW, and a NAT Gateway per AZ', () => {
            const stack = getTestStack();
            const zones = stack.availabilityZones.length;
            new lib_1.Vpc(stack, 'TheVPC', {});
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::InternetGateway', 1);
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::NatGateway', zones);
        });
        test('with isolated and public subnet, should be able to use the internet gateway to define routes', () => {
            const stack = getTestStack();
            const vpc = new lib_1.Vpc(stack, 'TheVPC', {
                subnetConfiguration: [
                    {
                        subnetType: lib_1.SubnetType.PRIVATE_ISOLATED,
                        name: 'isolated',
                    },
                    {
                        subnetType: lib_1.SubnetType.PUBLIC,
                        name: 'public',
                    },
                ],
            });
            vpc.isolatedSubnets[0].addRoute('TheRoute', {
                routerId: vpc.internetGatewayId,
                routerType: lib_1.RouterType.GATEWAY,
                destinationCidrBlock: '8.8.8.8/32',
            });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::InternetGateway', 1);
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Route', {
                DestinationCidrBlock: '8.8.8.8/32',
                GatewayId: {},
            });
        });
        test('with subnets and reserved subnets defined, VPC subnet count should not contain reserved subnets ', () => {
            const stack = getTestStack();
            new lib_1.Vpc(stack, 'TheVPC', {
                ipAddresses: lib_1.IpAddresses.cidr('10.0.0.0/16'),
                subnetConfiguration: [
                    {
                        cidrMask: 24,
                        subnetType: lib_1.SubnetType.PUBLIC,
                        name: 'Public',
                    },
                    {
                        cidrMask: 24,
                        name: 'reserved',
                        subnetType: lib_1.SubnetType.PRIVATE_WITH_EGRESS,
                        reserved: true,
                    },
                    {
                        cidrMask: 28,
                        name: 'rds',
                        subnetType: lib_1.SubnetType.PRIVATE_ISOLATED,
                    },
                ],
                maxAzs: 3,
            });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::Subnet', 6);
        });
        test('with reserved subnets, any other subnets should not have cidrBlock from within reserved space', () => {
            const stack = getTestStack();
            new lib_1.Vpc(stack, 'TheVPC', {
                ipAddresses: lib_1.IpAddresses.cidr('10.0.0.0/16'),
                subnetConfiguration: [
                    {
                        cidrMask: 24,
                        name: 'ingress',
                        subnetType: lib_1.SubnetType.PUBLIC,
                    },
                    {
                        cidrMask: 24,
                        name: 'reserved',
                        subnetType: lib_1.SubnetType.PRIVATE_WITH_EGRESS,
                        reserved: true,
                    },
                    {
                        cidrMask: 24,
                        name: 'rds',
                        subnetType: lib_1.SubnetType.PRIVATE_WITH_EGRESS,
                    },
                ],
                maxAzs: 3,
            });
            const template = assertions_1.Template.fromStack(stack);
            for (let i = 0; i < 3; i++) {
                template.hasResourceProperties('AWS::EC2::Subnet', {
                    CidrBlock: `10.0.${i}.0/24`,
                });
            }
            for (let i = 3; i < 6; i++) {
                const matchingSubnets = template.findResources('AWS::EC2::Subnet', {
                    CidrBlock: `10.0.${i}.0/24`,
                });
                expect(Object.keys(matchingSubnets).length).toBe(0);
            }
            for (let i = 6; i < 9; i++) {
                template.hasResourceProperties('AWS::EC2::Subnet', {
                    CidrBlock: `10.0.${i}.0/24`,
                });
            }
        });
        test('with custom subnets, the VPC should have the right number of subnets, an IGW, and a NAT Gateway per AZ', () => {
            const stack = getTestStack();
            const zones = stack.availabilityZones.length;
            new lib_1.Vpc(stack, 'TheVPC', {
                ipAddresses: lib_1.IpAddresses.cidr('10.0.0.0/21'),
                subnetConfiguration: [
                    {
                        cidrMask: 24,
                        name: 'ingress',
                        subnetType: lib_1.SubnetType.PUBLIC,
                    },
                    {
                        cidrMask: 24,
                        name: 'application',
                        subnetType: lib_1.SubnetType.PRIVATE_WITH_EGRESS,
                    },
                    {
                        cidrMask: 28,
                        name: 'rds',
                        subnetType: lib_1.SubnetType.PRIVATE_ISOLATED,
                    },
                ],
                maxAzs: 3,
            });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::InternetGateway', 1);
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::NatGateway', zones);
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::Subnet', 9);
            for (let i = 0; i < 6; i++) {
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Subnet', {
                    CidrBlock: `10.0.${i}.0/24`,
                });
            }
            for (let i = 0; i < 3; i++) {
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Subnet', {
                    CidrBlock: `10.0.6.${i * 16}/28`,
                });
            }
        });
        test('with custom subnets and natGateways = 2 there should be only two NATGW', () => {
            const stack = getTestStack();
            new lib_1.Vpc(stack, 'TheVPC', {
                ipAddresses: lib_1.IpAddresses.cidr('10.0.0.0/21'),
                natGateways: 2,
                subnetConfiguration: [
                    {
                        cidrMask: 24,
                        name: 'ingress',
                        subnetType: lib_1.SubnetType.PUBLIC,
                    },
                    {
                        cidrMask: 24,
                        name: 'application',
                        subnetType: lib_1.SubnetType.PRIVATE_WITH_EGRESS,
                    },
                    {
                        cidrMask: 28,
                        name: 'rds',
                        subnetType: lib_1.SubnetType.PRIVATE_ISOLATED,
                    },
                ],
                maxAzs: 3,
            });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::InternetGateway', 1);
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::NatGateway', 2);
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::Subnet', 9);
            for (let i = 0; i < 6; i++) {
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Subnet', {
                    CidrBlock: `10.0.${i}.0/24`,
                });
            }
            for (let i = 0; i < 3; i++) {
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Subnet', {
                    CidrBlock: `10.0.6.${i * 16}/28`,
                });
            }
        });
        test('with enableDnsHostnames enabled but enableDnsSupport disabled, should throw an Error', () => {
            const stack = getTestStack();
            expect(() => new lib_1.Vpc(stack, 'TheVPC', {
                enableDnsHostnames: true,
                enableDnsSupport: false,
            })).toThrow();
        });
        test('with public subnets MapPublicIpOnLaunch is true', () => {
            const stack = getTestStack();
            new lib_1.Vpc(stack, 'VPC', {
                maxAzs: 1,
                subnetConfiguration: [
                    {
                        cidrMask: 24,
                        name: 'ingress',
                        subnetType: lib_1.SubnetType.PUBLIC,
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::Subnet', 1);
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::NatGateway', 0);
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Subnet', {
                MapPublicIpOnLaunch: true,
            });
        });
        test('with public subnets MapPublicIpOnLaunch is true if parameter mapPublicIpOnLaunch is true', () => {
            const stack = getTestStack();
            new lib_1.Vpc(stack, 'VPC', {
                maxAzs: 1,
                subnetConfiguration: [
                    {
                        cidrMask: 24,
                        name: 'ingress',
                        subnetType: lib_1.SubnetType.PUBLIC,
                        mapPublicIpOnLaunch: true,
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::Subnet', 1);
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::NatGateway', 0);
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Subnet', {
                MapPublicIpOnLaunch: true,
            });
        });
        test('with public subnets MapPublicIpOnLaunch is false if parameter mapPublicIpOnLaunch is false', () => {
            const stack = getTestStack();
            new lib_1.Vpc(stack, 'VPC', {
                maxAzs: 1,
                subnetConfiguration: [
                    {
                        cidrMask: 24,
                        name: 'ingress',
                        subnetType: lib_1.SubnetType.PUBLIC,
                        mapPublicIpOnLaunch: false,
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::Subnet', 1);
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::NatGateway', 0);
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Subnet', {
                MapPublicIpOnLaunch: false,
            });
        });
        test('with private subnets throw exception if parameter mapPublicIpOnLaunch is defined', () => {
            const stack = getTestStack();
            expect(() => {
                new lib_1.Vpc(stack, 'VPC', {
                    maxAzs: 1,
                    subnetConfiguration: [
                        {
                            name: 'public',
                            subnetType: lib_1.SubnetType.PUBLIC,
                        },
                        {
                            name: 'private',
                            subnetType: lib_1.SubnetType.PRIVATE_WITH_EGRESS,
                            mapPublicIpOnLaunch: true,
                        },
                    ],
                });
            }).toThrow(/subnet cannot include mapPublicIpOnLaunch parameter/);
        });
        test('with isolated subnets throw exception if parameter mapPublicIpOnLaunch is defined', () => {
            const stack = getTestStack();
            expect(() => {
                new lib_1.Vpc(stack, 'VPC', {
                    maxAzs: 1,
                    subnetConfiguration: [
                        {
                            name: 'public',
                            subnetType: lib_1.SubnetType.PUBLIC,
                        },
                        {
                            name: 'private',
                            subnetType: lib_1.SubnetType.PRIVATE_ISOLATED,
                            mapPublicIpOnLaunch: true,
                        },
                    ],
                });
            }).toThrow(/subnet cannot include mapPublicIpOnLaunch parameter/);
        });
        test('verify the Default VPC name', () => {
            const stack = getTestStack();
            const tagName = { Key: 'Name', Value: `${stack.node.path}/VPC` };
            new lib_1.Vpc(stack, 'VPC', {
                maxAzs: 1,
                subnetConfiguration: [
                    {
                        name: 'public',
                        subnetType: lib_1.SubnetType.PUBLIC,
                    },
                    {
                        name: 'private',
                        subnetType: lib_1.SubnetType.PRIVATE_WITH_EGRESS,
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::Subnet', 2);
            assertions_1.Template.fromStack(stack).hasResource('AWS::EC2::NatGateway', assertions_1.Match.anyValue());
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Subnet', {
                MapPublicIpOnLaunch: true,
            });
            assertions_1.Template.fromStack(stack).hasResource('AWS::EC2::VPC', hasTags([tagName]));
        });
        test('verify the assigned VPC name passing the "vpcName" prop', () => {
            const stack = getTestStack();
            const tagName = { Key: 'Name', Value: 'CustomVPCName' };
            new lib_1.Vpc(stack, 'VPC', {
                maxAzs: 1,
                subnetConfiguration: [
                    {
                        name: 'public',
                        subnetType: lib_1.SubnetType.PUBLIC,
                    },
                    {
                        name: 'private',
                        subnetType: lib_1.SubnetType.PRIVATE_WITH_EGRESS,
                    },
                ],
                vpcName: 'CustomVPCName',
            });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::Subnet', 2);
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::NatGateway', assertions_1.Match.anyValue());
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Subnet', {
                MapPublicIpOnLaunch: true,
            });
            assertions_1.Template.fromStack(stack).hasResource('AWS::EC2::VPC', hasTags([tagName]));
        });
        test('maxAZs defaults to 3 if unset', () => {
            const stack = getTestStack();
            new lib_1.Vpc(stack, 'VPC');
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::Subnet', 6);
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::Route', 6);
            for (let i = 0; i < 6; i++) {
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Subnet', {
                    CidrBlock: `10.0.${i * 32}.0/19`,
                });
            }
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Route', {
                DestinationCidrBlock: '0.0.0.0/0',
                NatGatewayId: {},
            });
        });
        test('with maxAZs set to 2', () => {
            const stack = getTestStack();
            new lib_1.Vpc(stack, 'VPC', { maxAzs: 2 });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::Subnet', 4);
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::Route', 4);
            for (let i = 0; i < 4; i++) {
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Subnet', {
                    CidrBlock: `10.0.${i * 64}.0/18`,
                });
            }
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Route', {
                DestinationCidrBlock: '0.0.0.0/0',
                NatGatewayId: {},
            });
        });
        test('throws error when both availabilityZones and maxAzs are set', () => {
            const stack = getTestStack();
            expect(() => {
                new lib_1.Vpc(stack, 'VPC', {
                    availabilityZones: stack.availabilityZones,
                    maxAzs: 1,
                });
            }).toThrow(/Vpc supports 'availabilityZones' or 'maxAzs', but not both./);
        });
        test('with availabilityZones set correctly', () => {
            const stack = getTestStack();
            const specificAz = stack.availabilityZones[1]; // not the first item
            new lib_1.Vpc(stack, 'VPC', {
                availabilityZones: [specificAz],
            });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::Subnet', 2);
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Subnet', {
                AvailabilityZone: specificAz,
            });
        });
        test('with availabilityZones set to zones different from stack', () => {
            const stack = getTestStack();
            expect(() => {
                new lib_1.Vpc(stack, 'VPC', {
                    availabilityZones: [stack.availabilityZones[0] + 'invalid'],
                });
            }).toThrow(/must be a subset of the stack/);
        });
        test('with natGateway set to 1', () => {
            const stack = getTestStack();
            new lib_1.Vpc(stack, 'VPC', {
                natGateways: 1,
            });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::Subnet', 6);
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::Route', 6);
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::NatGateway', 1);
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Route', {
                DestinationCidrBlock: '0.0.0.0/0',
                NatGatewayId: {},
            });
        });
        test('with natGateway subnets defined', () => {
            const stack = getTestStack();
            new lib_1.Vpc(stack, 'VPC', {
                subnetConfiguration: [
                    {
                        cidrMask: 24,
                        name: 'ingress',
                        subnetType: lib_1.SubnetType.PUBLIC,
                    },
                    {
                        cidrMask: 24,
                        name: 'egress',
                        subnetType: lib_1.SubnetType.PUBLIC,
                    },
                    {
                        cidrMask: 24,
                        name: 'private',
                        subnetType: lib_1.SubnetType.PRIVATE_WITH_EGRESS,
                    },
                ],
                natGatewaySubnets: {
                    subnetGroupName: 'egress',
                },
            });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::NatGateway', 3);
            for (let i = 1; i < 4; i++) {
                assertions_1.Template.fromStack(stack).hasResource('AWS::EC2::Subnet', hasTags([{
                        Key: 'aws-cdk:subnet-name',
                        Value: 'egress',
                    }, {
                        Key: 'Name',
                        Value: `TestStack/VPC/egressSubnet${i}`,
                    }]));
            }
        });
        (0, cdk_build_tools_1.testDeprecated)('natGateways = 0 throws if PRIVATE_WITH_NAT subnets configured', () => {
            const stack = getTestStack();
            expect(() => {
                new lib_1.Vpc(stack, 'VPC', {
                    natGateways: 0,
                    subnetConfiguration: [
                        {
                            name: 'public',
                            subnetType: lib_1.SubnetType.PUBLIC,
                        },
                        {
                            name: 'private',
                            subnetType: lib_1.SubnetType.PRIVATE_WITH_NAT,
                        },
                    ],
                });
            }).toThrow(/make sure you don't configure any PRIVATE/);
        });
        test('natGateways = 0 succeeds if PRIVATE_WITH_EGRESS subnets configured', () => {
            const stack = getTestStack();
            new lib_1.Vpc(stack, 'VPC', {
                natGateways: 0,
                subnetConfiguration: [
                    {
                        name: 'public',
                        subnetType: lib_1.SubnetType.PUBLIC,
                    },
                    {
                        name: 'private',
                        subnetType: lib_1.SubnetType.PRIVATE_WITH_EGRESS,
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::InternetGateway', 1);
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::NatGateway', 0);
        });
        test('natGateway = 0 defaults with ISOLATED subnet', () => {
            const stack = getTestStack();
            new lib_1.Vpc(stack, 'VPC', {
                natGateways: 0,
            });
            assertions_1.Template.fromStack(stack).hasResource('AWS::EC2::Subnet', hasTags([{
                    Key: 'aws-cdk:subnet-type',
                    Value: 'Isolated',
                }]));
        });
        test('unspecified natGateways constructs with PRIVATE subnet', () => {
            const stack = getTestStack();
            new lib_1.Vpc(stack, 'VPC');
            assertions_1.Template.fromStack(stack).hasResource('AWS::EC2::Subnet', hasTags([{
                    Key: 'aws-cdk:subnet-type',
                    Value: 'Private',
                }]));
        });
        test('natGateways = 0 allows RESERVED PRIVATE subnets', () => {
            const stack = getTestStack();
            new lib_1.Vpc(stack, 'VPC', {
                ipAddresses: lib_1.IpAddresses.cidr('10.0.0.0/16'),
                subnetConfiguration: [
                    {
                        name: 'ingress',
                        subnetType: lib_1.SubnetType.PUBLIC,
                    },
                    {
                        name: 'private',
                        subnetType: lib_1.SubnetType.PRIVATE_WITH_EGRESS,
                        reserved: true,
                    },
                ],
                natGateways: 0,
            });
            assertions_1.Template.fromStack(stack).hasResource('AWS::EC2::Subnet', hasTags([{
                    Key: 'aws-cdk:subnet-name',
                    Value: 'ingress',
                }]));
        });
        test('EIP passed with NAT gateway does not create duplicate EIP', () => {
            const stack = getTestStack();
            new lib_1.Vpc(stack, 'VPC', {
                ipAddresses: lib_1.IpAddresses.cidr('10.0.0.0/16'),
                subnetConfiguration: [
                    {
                        cidrMask: 24,
                        name: 'ingress',
                        subnetType: lib_1.SubnetType.PUBLIC,
                    },
                    {
                        cidrMask: 24,
                        name: 'application',
                        subnetType: lib_1.SubnetType.PRIVATE_WITH_EGRESS,
                    },
                ],
                natGatewayProvider: lib_1.NatProvider.gateway({ eipAllocationIds: ['b'] }),
                natGateways: 1,
            });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::EIP', 0);
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::NatGateway', {
                AllocationId: 'b',
            });
        });
        test('with mis-matched nat and subnet configs it throws', () => {
            const stack = getTestStack();
            expect(() => new lib_1.Vpc(stack, 'VPC', {
                subnetConfiguration: [
                    {
                        cidrMask: 24,
                        name: 'ingress',
                        subnetType: lib_1.SubnetType.PUBLIC,
                    },
                    {
                        cidrMask: 24,
                        name: 'private',
                        subnetType: lib_1.SubnetType.PRIVATE_WITH_EGRESS,
                    },
                ],
                natGatewaySubnets: {
                    subnetGroupName: 'notthere',
                },
            })).toThrow();
        });
        test('with a vpn gateway', () => {
            const stack = getTestStack();
            new lib_1.Vpc(stack, 'VPC', {
                vpnGateway: true,
                vpnGatewayAsn: 65000,
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPNGateway', {
                AmazonSideAsn: 65000,
                Type: 'ipsec.1',
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCGatewayAttachment', {
                VpcId: {
                    Ref: 'VPCB9E5F0B4',
                },
                VpnGatewayId: {
                    Ref: 'VPCVpnGatewayB5ABAE68',
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPNGatewayRoutePropagation', {
                RouteTableIds: [
                    {
                        Ref: 'VPCPrivateSubnet1RouteTableBE8A6027',
                    },
                    {
                        Ref: 'VPCPrivateSubnet2RouteTable0A19E10E',
                    },
                    {
                        Ref: 'VPCPrivateSubnet3RouteTable192186F8',
                    },
                ],
                VpnGatewayId: {
                    Ref: 'VPCVpnGatewayB5ABAE68',
                },
            });
        });
        test('with a vpn gateway and route propagation on isolated subnets', () => {
            const stack = getTestStack();
            new lib_1.Vpc(stack, 'VPC', {
                subnetConfiguration: [
                    { subnetType: lib_1.SubnetType.PUBLIC, name: 'Public' },
                    { subnetType: lib_1.SubnetType.PRIVATE_ISOLATED, name: 'Isolated' },
                ],
                vpnGateway: true,
                vpnRoutePropagation: [
                    {
                        subnetType: lib_1.SubnetType.PRIVATE_ISOLATED,
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPNGatewayRoutePropagation', {
                RouteTableIds: [
                    {
                        Ref: 'VPCIsolatedSubnet1RouteTableEB156210',
                    },
                    {
                        Ref: 'VPCIsolatedSubnet2RouteTable9B4F78DC',
                    },
                    {
                        Ref: 'VPCIsolatedSubnet3RouteTableCB6A1FDA',
                    },
                ],
                VpnGatewayId: {
                    Ref: 'VPCVpnGatewayB5ABAE68',
                },
            });
        });
        test('with a vpn gateway and route propagation on private and isolated subnets', () => {
            const stack = getTestStack();
            new lib_1.Vpc(stack, 'VPC', {
                subnetConfiguration: [
                    { subnetType: lib_1.SubnetType.PUBLIC, name: 'Public' },
                    { subnetType: lib_1.SubnetType.PRIVATE_WITH_EGRESS, name: 'Private' },
                    { subnetType: lib_1.SubnetType.PRIVATE_ISOLATED, name: 'Isolated' },
                ],
                vpnGateway: true,
                vpnRoutePropagation: [
                    {
                        subnetType: lib_1.SubnetType.PRIVATE_WITH_EGRESS,
                    },
                    {
                        subnetType: lib_1.SubnetType.PRIVATE_ISOLATED,
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPNGatewayRoutePropagation', {
                RouteTableIds: [
                    {
                        Ref: 'VPCPrivateSubnet1RouteTableBE8A6027',
                    },
                    {
                        Ref: 'VPCPrivateSubnet2RouteTable0A19E10E',
                    },
                    {
                        Ref: 'VPCPrivateSubnet3RouteTable192186F8',
                    },
                    {
                        Ref: 'VPCIsolatedSubnet1RouteTableEB156210',
                    },
                    {
                        Ref: 'VPCIsolatedSubnet2RouteTable9B4F78DC',
                    },
                    {
                        Ref: 'VPCIsolatedSubnet3RouteTableCB6A1FDA',
                    },
                ],
                VpnGatewayId: {
                    Ref: 'VPCVpnGatewayB5ABAE68',
                },
            });
        });
        test('route propagation defaults to isolated subnets when there are no private subnets', () => {
            const stack = getTestStack();
            new lib_1.Vpc(stack, 'VPC', {
                subnetConfiguration: [
                    { subnetType: lib_1.SubnetType.PUBLIC, name: 'Public' },
                    { subnetType: lib_1.SubnetType.PRIVATE_ISOLATED, name: 'Isolated' },
                ],
                vpnGateway: true,
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPNGatewayRoutePropagation', {
                RouteTableIds: [
                    {
                        Ref: 'VPCIsolatedSubnet1RouteTableEB156210',
                    },
                    {
                        Ref: 'VPCIsolatedSubnet2RouteTable9B4F78DC',
                    },
                    {
                        Ref: 'VPCIsolatedSubnet3RouteTableCB6A1FDA',
                    },
                ],
                VpnGatewayId: {
                    Ref: 'VPCVpnGatewayB5ABAE68',
                },
            });
        });
        test('route propagation defaults to public subnets when there are no private/isolated subnets', () => {
            const stack = getTestStack();
            new lib_1.Vpc(stack, 'VPC', {
                subnetConfiguration: [
                    { subnetType: lib_1.SubnetType.PUBLIC, name: 'Public' },
                ],
                vpnGateway: true,
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPNGatewayRoutePropagation', {
                RouteTableIds: [
                    {
                        Ref: 'VPCPublicSubnet1RouteTableFEE4B781',
                    },
                    {
                        Ref: 'VPCPublicSubnet2RouteTable6F1A15F1',
                    },
                    {
                        Ref: 'VPCPublicSubnet3RouteTable98AE0E14',
                    },
                ],
                VpnGatewayId: {
                    Ref: 'VPCVpnGatewayB5ABAE68',
                },
            });
        });
        test('fails when specifying vpnConnections with vpnGateway set to false', () => {
            // GIVEN
            const stack = new core_1.Stack();
            expect(() => new lib_1.Vpc(stack, 'VpcNetwork', {
                vpnGateway: false,
                vpnConnections: {
                    VpnConnection: {
                        asn: 65000,
                        ip: '192.0.2.1',
                    },
                },
            })).toThrow(/`vpnConnections`.+`vpnGateway`.+false/);
        });
        test('fails when specifying vpnGatewayAsn with vpnGateway set to false', () => {
            // GIVEN
            const stack = new core_1.Stack();
            expect(() => new lib_1.Vpc(stack, 'VpcNetwork', {
                vpnGateway: false,
                vpnGatewayAsn: 65000,
            })).toThrow(/`vpnGatewayAsn`.+`vpnGateway`.+false/);
        });
        test('Subnets have a defaultChild', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new lib_1.Vpc(stack, 'VpcNetwork');
            expect(vpc.publicSubnets[0].node.defaultChild instanceof lib_1.CfnSubnet).toEqual(true);
        });
        test('CIDR cannot be a Token', () => {
            const stack = new core_1.Stack();
            expect(() => {
                new lib_1.Vpc(stack, 'Vpc', {
                    ipAddresses: lib_1.IpAddresses.cidr(core_1.Lazy.string({ produce: () => 'abc' })),
                });
            }).toThrow(/property must be a concrete CIDR string/);
        });
        test('Default NAT gateway provider', () => {
            const stack = new core_1.Stack();
            const natGatewayProvider = lib_1.NatProvider.gateway();
            new lib_1.Vpc(stack, 'VpcNetwork', { natGatewayProvider });
            expect(natGatewayProvider.configuredGateways.length).toBeGreaterThan(0);
        });
        test('NAT gateway provider with EIP allocations', () => {
            const stack = new core_1.Stack();
            const natGatewayProvider = lib_1.NatProvider.gateway({
                eipAllocationIds: ['a', 'b', 'c', 'd'],
            });
            new lib_1.Vpc(stack, 'VpcNetwork', { natGatewayProvider });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::NatGateway', {
                AllocationId: 'a',
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::NatGateway', {
                AllocationId: 'b',
            });
        });
        test('NAT gateway provider with insufficient EIP allocations', () => {
            const stack = new core_1.Stack();
            const natGatewayProvider = lib_1.NatProvider.gateway({ eipAllocationIds: ['a'] });
            expect(() => new lib_1.Vpc(stack, 'VpcNetwork', { natGatewayProvider }))
                .toThrow(/Not enough NAT gateway EIP allocation IDs \(1 provided\) for the requested subnet count \(\d+ needed\)/);
        });
        test('NAT gateway provider with token EIP allocations', () => {
            const stack = new core_1.Stack();
            const eipAllocationIds = core_1.Fn.split(',', core_1.Fn.importValue('myVpcId'));
            const natGatewayProvider = lib_1.NatProvider.gateway({ eipAllocationIds });
            new lib_1.Vpc(stack, 'VpcNetwork', { natGatewayProvider });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::NatGateway', {
                AllocationId: stack.resolve(core_1.Fn.select(0, eipAllocationIds)),
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::NatGateway', {
                AllocationId: stack.resolve(core_1.Fn.select(1, eipAllocationIds)),
            });
        });
        test('Can add an IPv6 route', () => {
            // GIVEN
            const stack = getTestStack();
            // WHEN
            const vpc = new lib_1.Vpc(stack, 'VPC');
            vpc.publicSubnets[0].addRoute('SomeRoute', {
                destinationIpv6CidrBlock: '2001:4860:4860::8888/32',
                routerId: 'router-1',
                routerType: lib_1.RouterType.NETWORK_INTERFACE,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Route', {
                DestinationIpv6CidrBlock: '2001:4860:4860::8888/32',
                NetworkInterfaceId: 'router-1',
            });
        });
        test('Can add an IPv4 route', () => {
            // GIVEN
            const stack = getTestStack();
            // WHEN
            const vpc = new lib_1.Vpc(stack, 'VPC');
            vpc.publicSubnets[0].addRoute('SomeRoute', {
                destinationCidrBlock: '0.0.0.0/0',
                routerId: 'router-1',
                routerType: lib_1.RouterType.NETWORK_INTERFACE,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Route', {
                DestinationCidrBlock: '0.0.0.0/0',
                NetworkInterfaceId: 'router-1',
            });
        });
    });
    describe('fromVpcAttributes', () => {
        test('passes region correctly', () => {
            // GIVEN
            const stack = getTestStack();
            const vpcId = core_1.Fn.importValue('myVpcId');
            // WHEN
            const vpc = lib_1.Vpc.fromVpcAttributes(stack, 'VPC', {
                vpcId,
                availabilityZones: ['region-12345a', 'region-12345b', 'region-12345c'],
                region: 'region-12345',
            });
            // THEN
            expect(vpc.env.region).toEqual('region-12345');
        });
        test('passes subnet IPv4 CIDR blocks correctly', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = lib_1.Vpc.fromVpcAttributes(stack, 'VPC', {
                vpcId: 'vpc-1234',
                availabilityZones: ['dummy1a', 'dummy1b', 'dummy1c'],
                publicSubnetIds: ['pub-1', 'pub-2', 'pub-3'],
                publicSubnetIpv4CidrBlocks: ['10.0.0.0/18', '10.0.64.0/18', '10.0.128.0/18'],
                privateSubnetIds: ['pri-1', 'pri-2', 'pri-3'],
                privateSubnetIpv4CidrBlocks: ['10.10.0.0/18', '10.10.64.0/18', '10.10.128.0/18'],
                isolatedSubnetIds: ['iso-1', 'iso-2', 'iso-3'],
                isolatedSubnetIpv4CidrBlocks: ['10.20.0.0/18', '10.20.64.0/18', '10.20.128.0/18'],
            });
            // WHEN
            const public1 = vpc.publicSubnets.find(({ subnetId }) => subnetId === 'pub-1');
            const public2 = vpc.publicSubnets.find(({ subnetId }) => subnetId === 'pub-2');
            const public3 = vpc.publicSubnets.find(({ subnetId }) => subnetId === 'pub-3');
            const private1 = vpc.privateSubnets.find(({ subnetId }) => subnetId === 'pri-1');
            const private2 = vpc.privateSubnets.find(({ subnetId }) => subnetId === 'pri-2');
            const private3 = vpc.privateSubnets.find(({ subnetId }) => subnetId === 'pri-3');
            const isolated1 = vpc.isolatedSubnets.find(({ subnetId }) => subnetId === 'iso-1');
            const isolated2 = vpc.isolatedSubnets.find(({ subnetId }) => subnetId === 'iso-2');
            const isolated3 = vpc.isolatedSubnets.find(({ subnetId }) => subnetId === 'iso-3');
            // THEN
            expect(public1?.ipv4CidrBlock).toEqual('10.0.0.0/18');
            expect(public2?.ipv4CidrBlock).toEqual('10.0.64.0/18');
            expect(public3?.ipv4CidrBlock).toEqual('10.0.128.0/18');
            expect(private1?.ipv4CidrBlock).toEqual('10.10.0.0/18');
            expect(private2?.ipv4CidrBlock).toEqual('10.10.64.0/18');
            expect(private3?.ipv4CidrBlock).toEqual('10.10.128.0/18');
            expect(isolated1?.ipv4CidrBlock).toEqual('10.20.0.0/18');
            expect(isolated2?.ipv4CidrBlock).toEqual('10.20.64.0/18');
            expect(isolated3?.ipv4CidrBlock).toEqual('10.20.128.0/18');
        });
        test('throws on incorrect number of subnet names', () => {
            const stack = new core_1.Stack();
            expect(() => lib_1.Vpc.fromVpcAttributes(stack, 'VPC', {
                vpcId: 'vpc-1234',
                availabilityZones: ['us-east-1a', 'us-east-1b', 'us-east-1c'],
                publicSubnetIds: ['s-12345', 's-34567', 's-56789'],
                publicSubnetNames: ['Public 1', 'Public 2'],
            })).toThrow(/publicSubnetNames must have an entry for every corresponding subnet group/);
        });
        test('throws on incorrect number of route table ids', () => {
            const stack = new core_1.Stack();
            expect(() => lib_1.Vpc.fromVpcAttributes(stack, 'VPC', {
                vpcId: 'vpc-1234',
                availabilityZones: ['us-east-1a', 'us-east-1b', 'us-east-1c'],
                publicSubnetIds: ['s-12345', 's-34567', 's-56789'],
                publicSubnetRouteTableIds: ['rt-12345'],
            })).toThrow('Number of publicSubnetRouteTableIds (1) must be equal to the amount of publicSubnetIds (3).');
        });
        test('throws on incorrect number of subnet IPv4 CIDR blocks', () => {
            const stack = new core_1.Stack();
            expect(() => lib_1.Vpc.fromVpcAttributes(stack, 'VPC', {
                vpcId: 'vpc-1234',
                availabilityZones: ['us-east-1a', 'us-east-1b', 'us-east-1c'],
                publicSubnetIds: ['s-12345', 's-34567', 's-56789'],
                publicSubnetIpv4CidrBlocks: ['10.0.0.0/18', '10.0.64.0/18'],
            })).toThrow('Number of publicSubnetIpv4CidrBlocks (2) must be equal to the amount of publicSubnetIds (3).');
        });
    });
    describe('NAT instances', () => {
        test('Can configure NAT instances instead of NAT gateways', () => {
            // GIVEN
            const stack = getTestStack();
            // WHEN
            const natGatewayProvider = lib_1.NatProvider.instance({
                instanceType: new lib_1.InstanceType('q86.mega'),
                machineImage: new lib_1.GenericLinuxImage({
                    'us-east-1': 'ami-1',
                }),
            });
            new lib_1.Vpc(stack, 'TheVPC', { natGatewayProvider });
            // THEN
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::Instance', 3);
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
                ImageId: 'ami-1',
                InstanceType: 'q86.mega',
                SourceDestCheck: false,
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Route', {
                RouteTableId: { Ref: 'TheVPCPrivateSubnet1RouteTableF6513BC2' },
                DestinationCidrBlock: '0.0.0.0/0',
                InstanceId: { Ref: 'TheVPCPublicSubnet1NatInstanceCC514192' },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
                SecurityGroupEgress: [
                    {
                        CidrIp: '0.0.0.0/0',
                        Description: 'Allow all outbound traffic by default',
                        IpProtocol: '-1',
                    },
                ],
                SecurityGroupIngress: [
                    {
                        CidrIp: '0.0.0.0/0',
                        Description: 'from 0.0.0.0/0:ALL TRAFFIC',
                        IpProtocol: '-1',
                    },
                ],
            });
        });
        test('natGateways controls amount of NAT instances', () => {
            // GIVEN
            const stack = getTestStack();
            // WHEN
            new lib_1.Vpc(stack, 'TheVPC', {
                natGatewayProvider: lib_1.NatProvider.instance({
                    instanceType: new lib_1.InstanceType('q86.mega'),
                    machineImage: new lib_1.GenericLinuxImage({
                        'us-east-1': 'ami-1',
                    }),
                }),
                natGateways: 1,
            });
            // THEN
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::Instance', 1);
        });
        (0, cdk_build_tools_1.testDeprecated)('can configure Security Groups of NAT instances with allowAllTraffic false', () => {
            // GIVEN
            const stack = getTestStack();
            // WHEN
            const provider = lib_1.NatProvider.instance({
                instanceType: new lib_1.InstanceType('q86.mega'),
                machineImage: new lib_1.GenericLinuxImage({
                    'us-east-1': 'ami-1',
                }),
                allowAllTraffic: false,
            });
            new lib_1.Vpc(stack, 'TheVPC', {
                natGatewayProvider: provider,
            });
            provider.connections.allowFrom(lib_1.Peer.ipv4('1.2.3.4/32'), lib_1.Port.tcp(86));
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
                SecurityGroupEgress: [
                    {
                        CidrIp: '0.0.0.0/0',
                        Description: 'Allow all outbound traffic by default',
                        IpProtocol: '-1',
                    },
                ],
                SecurityGroupIngress: [
                    {
                        CidrIp: '1.2.3.4/32',
                        Description: 'from 1.2.3.4/32:86',
                        FromPort: 86,
                        IpProtocol: 'tcp',
                        ToPort: 86,
                    },
                ],
            });
        });
        test('can configure Security Groups of NAT instances with defaultAllowAll INBOUND_AND_OUTBOUND', () => {
            // GIVEN
            const stack = getTestStack();
            // WHEN
            const provider = lib_1.NatProvider.instance({
                instanceType: new lib_1.InstanceType('q86.mega'),
                machineImage: new lib_1.GenericLinuxImage({
                    'us-east-1': 'ami-1',
                }),
                defaultAllowedTraffic: lib_1.NatTrafficDirection.INBOUND_AND_OUTBOUND,
            });
            new lib_1.Vpc(stack, 'TheVPC', {
                natGatewayProvider: provider,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
                SecurityGroupEgress: [
                    {
                        CidrIp: '0.0.0.0/0',
                        Description: 'Allow all outbound traffic by default',
                        IpProtocol: '-1',
                    },
                ],
                SecurityGroupIngress: [
                    {
                        CidrIp: '0.0.0.0/0',
                        Description: 'from 0.0.0.0/0:ALL TRAFFIC',
                        IpProtocol: '-1',
                    },
                ],
            });
        });
        test('can configure Security Groups of NAT instances with defaultAllowAll OUTBOUND_ONLY', () => {
            // GIVEN
            const stack = getTestStack();
            // WHEN
            const provider = lib_1.NatProvider.instance({
                instanceType: new lib_1.InstanceType('q86.mega'),
                machineImage: new lib_1.GenericLinuxImage({
                    'us-east-1': 'ami-1',
                }),
                defaultAllowedTraffic: lib_1.NatTrafficDirection.OUTBOUND_ONLY,
            });
            new lib_1.Vpc(stack, 'TheVPC', {
                natGatewayProvider: provider,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
                SecurityGroupEgress: [
                    {
                        CidrIp: '0.0.0.0/0',
                        Description: 'Allow all outbound traffic by default',
                        IpProtocol: '-1',
                    },
                ],
            });
        });
        test('can configure Security Groups of NAT instances with defaultAllowAll NONE', () => {
            // GIVEN
            const stack = getTestStack();
            // WHEN
            const provider = lib_1.NatProvider.instance({
                instanceType: new lib_1.InstanceType('q86.mega'),
                machineImage: new lib_1.GenericLinuxImage({
                    'us-east-1': 'ami-1',
                }),
                defaultAllowedTraffic: lib_1.NatTrafficDirection.NONE,
            });
            new lib_1.Vpc(stack, 'TheVPC', {
                natGatewayProvider: provider,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
                SecurityGroupEgress: [
                    {
                        CidrIp: '255.255.255.255/32',
                        Description: 'Disallow all traffic',
                        FromPort: 252,
                        IpProtocol: 'icmp',
                        ToPort: 86,
                    },
                ],
            });
        });
    });
    describe('Network ACL association', () => {
        test('by default uses default ACL reference', () => {
            // GIVEN
            const stack = getTestStack();
            // WHEN
            const vpc = new lib_1.Vpc(stack, 'TheVPC', { ipAddresses: lib_1.IpAddresses.cidr('192.168.0.0/16') });
            new core_1.CfnOutput(stack, 'Output', {
                value: vpc.publicSubnets[0].subnetNetworkAclAssociationId,
            });
            assertions_1.Template.fromStack(stack).templateMatches({
                Outputs: {
                    Output: {
                        Value: { 'Fn::GetAtt': ['TheVPCPublicSubnet1Subnet770D4FF2', 'NetworkAclAssociationId'] },
                    },
                },
            });
        });
        test('if ACL is replaced new ACL reference is returned', () => {
            // GIVEN
            const stack = getTestStack();
            const vpc = new lib_1.Vpc(stack, 'TheVPC', { ipAddresses: lib_1.IpAddresses.cidr('192.168.0.0/16') });
            // WHEN
            new core_1.CfnOutput(stack, 'Output', {
                value: vpc.publicSubnets[0].subnetNetworkAclAssociationId,
            });
            new lib_1.NetworkAcl(stack, 'ACL', {
                vpc,
                subnetSelection: { subnetType: lib_1.SubnetType.PUBLIC },
            });
            assertions_1.Template.fromStack(stack).templateMatches({
                Outputs: {
                    Output: {
                        Value: { Ref: 'ACLDBD1BB49' },
                    },
                },
            });
        });
    });
    describe('When creating a VPC with a custom CIDR range', () => {
        test('vpc.vpcCidrBlock is the correct network range', () => {
            const stack = getTestStack();
            new lib_1.Vpc(stack, 'TheVPC', { ipAddresses: lib_1.IpAddresses.cidr('192.168.0.0/16') });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPC', {
                CidrBlock: '192.168.0.0/16',
            });
        });
    });
    describe('When tagging', () => {
        test('VPC propagated tags will be on subnet, IGW, routetables, NATGW', () => {
            const stack = getTestStack();
            const tags = {
                VpcType: 'Good',
            };
            const noPropTags = {
                BusinessUnit: 'Marketing',
            };
            const allTags = { ...noPropTags, ...tags };
            const vpc = new lib_1.Vpc(stack, 'TheVPC');
            // overwrite to set propagate
            core_1.Tags.of(vpc).add('BusinessUnit', 'Marketing', { includeResourceTypes: [lib_1.CfnVPC.CFN_RESOURCE_TYPE_NAME] });
            core_1.Tags.of(vpc).add('VpcType', 'Good');
            assertions_1.Template.fromStack(stack).hasResource('AWS::EC2::VPC', hasTags(toCfnTags(allTags)));
            const taggables = ['Subnet', 'InternetGateway', 'NatGateway', 'RouteTable'];
            const propTags = toCfnTags(tags);
            const noProp = toCfnTags(noPropTags);
            for (const resource of taggables) {
                assertions_1.Template.fromStack(stack).hasResourceProperties(`AWS::EC2::${resource}`, {
                    Tags: assertions_1.Match.arrayWith(propTags),
                });
                const matchingResources = assertions_1.Template.fromStack(stack).findResources(`AWS::EC2::${resource}`, hasTags(noProp));
                expect(Object.keys(matchingResources).length).toBe(0);
            }
        });
        test('Subnet Name will propagate to route tables and NATGW', () => {
            const stack = getTestStack();
            const vpc = new lib_1.Vpc(stack, 'TheVPC');
            for (const subnet of vpc.publicSubnets) {
                const tag = { Key: 'Name', Value: subnet.node.path };
                assertions_1.Template.fromStack(stack).hasResource('AWS::EC2::NatGateway', hasTags([tag]));
                assertions_1.Template.fromStack(stack).hasResource('AWS::EC2::RouteTable', hasTags([tag]));
            }
            for (const subnet of vpc.privateSubnets) {
                const tag = { Key: 'Name', Value: subnet.node.path };
                assertions_1.Template.fromStack(stack).hasResource('AWS::EC2::RouteTable', hasTags([tag]));
            }
        });
        test('Tags can be added after the Vpc is created with `vpc.tags.setTag(...)`', () => {
            const stack = getTestStack();
            const vpc = new lib_1.Vpc(stack, 'TheVPC');
            const tag = { Key: 'Late', Value: 'Adder' };
            core_1.Tags.of(vpc).add(tag.Key, tag.Value);
            assertions_1.Template.fromStack(stack).hasResource('AWS::EC2::VPC', hasTags([tag]));
        });
    });
    describe('subnet selection', () => {
        test('selecting default subnets returns the private ones', () => {
            // GIVEN
            const stack = getTestStack();
            const vpc = new lib_1.Vpc(stack, 'VPC');
            // WHEN
            const { subnetIds } = vpc.selectSubnets();
            // THEN
            expect(subnetIds).toEqual(vpc.privateSubnets.map(s => s.subnetId));
        });
        test('can select public subnets', () => {
            // GIVEN
            const stack = getTestStack();
            const vpc = new lib_1.Vpc(stack, 'VPC');
            // WHEN
            const { subnetIds } = vpc.selectSubnets({ subnetType: lib_1.SubnetType.PUBLIC });
            // THEN
            expect(subnetIds).toEqual(vpc.publicSubnets.map(s => s.subnetId));
        });
        test('can select isolated subnets', () => {
            // GIVEN
            const stack = getTestStack();
            const vpc = new lib_1.Vpc(stack, 'VPC', {
                subnetConfiguration: [
                    { subnetType: lib_1.SubnetType.PUBLIC, name: 'Public' },
                    { subnetType: lib_1.SubnetType.PRIVATE_ISOLATED, name: 'Isolated' },
                ],
            });
            // WHEN
            const { subnetIds } = vpc.selectSubnets({ subnetType: lib_1.SubnetType.PRIVATE_ISOLATED });
            // THEN
            expect(subnetIds).toEqual(vpc.isolatedSubnets.map(s => s.subnetId));
        });
        test('can select subnets by name', () => {
            // GIVEN
            const stack = getTestStack();
            const vpc = new lib_1.Vpc(stack, 'VPC', {
                subnetConfiguration: [
                    { subnetType: lib_1.SubnetType.PUBLIC, name: 'BlaBla' },
                    { subnetType: lib_1.SubnetType.PRIVATE_WITH_EGRESS, name: 'DontTalkToMe' },
                    { subnetType: lib_1.SubnetType.PRIVATE_ISOLATED, name: 'DontTalkAtAll' },
                ],
            });
            // WHEN
            const { subnetIds } = vpc.selectSubnets({ subnetGroupName: 'DontTalkToMe' });
            // THEN
            expect(subnetIds).toEqual(vpc.privateSubnets.map(s => s.subnetId));
        });
        test('subnetName is an alias for subnetGroupName (backwards compat)', () => {
            // GIVEN
            const stack = getTestStack();
            const vpc = new lib_1.Vpc(stack, 'VPC', {
                subnetConfiguration: [
                    { subnetType: lib_1.SubnetType.PUBLIC, name: 'BlaBla' },
                    { subnetType: lib_1.SubnetType.PRIVATE_WITH_EGRESS, name: 'DontTalkToMe' },
                    { subnetType: lib_1.SubnetType.PRIVATE_ISOLATED, name: 'DontTalkAtAll' },
                ],
            });
            // WHEN
            const { subnetIds } = vpc.selectSubnets({ subnetName: 'DontTalkToMe' });
            // THEN
            expect(subnetIds).toEqual(vpc.privateSubnets.map(s => s.subnetId));
        });
        test('selecting default subnets in a VPC with only isolated subnets returns the isolateds', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = lib_1.Vpc.fromVpcAttributes(stack, 'VPC', {
                vpcId: 'vpc-1234',
                availabilityZones: ['dummy1a', 'dummy1b', 'dummy1c'],
                isolatedSubnetIds: ['iso-1', 'iso-2', 'iso-3'],
                isolatedSubnetRouteTableIds: ['rt-1', 'rt-2', 'rt-3'],
            });
            // WHEN
            const subnets = vpc.selectSubnets();
            // THEN
            expect(subnets.subnetIds).toEqual(['iso-1', 'iso-2', 'iso-3']);
        });
        test('selecting default subnets in a VPC with only public subnets returns the publics', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = lib_1.Vpc.fromVpcAttributes(stack, 'VPC', {
                vpcId: 'vpc-1234',
                availabilityZones: ['dummy1a', 'dummy1b', 'dummy1c'],
                publicSubnetIds: ['pub-1', 'pub-2', 'pub-3'],
                publicSubnetRouteTableIds: ['rt-1', 'rt-2', 'rt-3'],
            });
            // WHEN
            const subnets = vpc.selectSubnets();
            // THEN
            expect(subnets.subnetIds).toEqual(['pub-1', 'pub-2', 'pub-3']);
        });
        test('selecting subnets by name fails if the name is unknown', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new lib_1.Vpc(stack, 'VPC');
            expect(() => {
                vpc.selectSubnets({ subnetGroupName: 'Toot' });
            }).toThrow(/There are no subnet groups with name 'Toot' in this VPC. Available names: Public,Private/);
        });
        test('select subnets with az restriction', () => {
            // GIVEN
            const stack = getTestStack();
            const vpc = new lib_1.Vpc(stack, 'VpcNetwork', {
                maxAzs: 1,
                subnetConfiguration: [
                    { name: 'lb', subnetType: lib_1.SubnetType.PUBLIC },
                    { name: 'app', subnetType: lib_1.SubnetType.PRIVATE_WITH_EGRESS },
                    { name: 'db', subnetType: lib_1.SubnetType.PRIVATE_WITH_EGRESS },
                ],
            });
            // WHEN
            const { subnetIds } = vpc.selectSubnets({ onePerAz: true });
            // THEN
            expect(subnetIds.length).toEqual(1);
            expect(subnetIds[0]).toEqual(vpc.privateSubnets[0].subnetId);
        });
        test('fromVpcAttributes using unknown-length list tokens', () => {
            // GIVEN
            const stack = getTestStack();
            const vpcId = core_1.Fn.importValue('myVpcId');
            const availabilityZones = core_1.Fn.split(',', core_1.Fn.importValue('myAvailabilityZones'));
            const publicSubnetIds = core_1.Fn.split(',', core_1.Fn.importValue('myPublicSubnetIds'));
            // WHEN
            const vpc = lib_1.Vpc.fromVpcAttributes(stack, 'VPC', {
                vpcId,
                availabilityZones,
                publicSubnetIds,
            });
            new core_1.CfnResource(stack, 'Resource', {
                type: 'Some::Resource',
                properties: {
                    subnetIds: vpc.selectSubnets().subnetIds,
                },
            });
            // THEN - No exception
            assertions_1.Template.fromStack(stack).hasResourceProperties('Some::Resource', {
                subnetIds: { 'Fn::Split': [',', { 'Fn::ImportValue': 'myPublicSubnetIds' }] },
            });
            assertions_1.Annotations.fromStack(stack).hasWarning('/TestStack/VPC', "fromVpcAttributes: 'availabilityZones' is a list token: the imported VPC will not work with constructs that require a list of subnets at synthesis time. Use 'Vpc.fromLookup()' or 'Fn.importListValue' instead.");
        });
        test('fromVpcAttributes using fixed-length list tokens', () => {
            // GIVEN
            const stack = getTestStack();
            const vpcId = core_1.Fn.importValue('myVpcId');
            const availabilityZones = core_1.Fn.importListValue('myAvailabilityZones', 2);
            const publicSubnetIds = core_1.Fn.importListValue('myPublicSubnetIds', 2);
            // WHEN
            const vpc = lib_1.Vpc.fromVpcAttributes(stack, 'VPC', {
                vpcId,
                availabilityZones,
                publicSubnetIds,
            });
            new core_1.CfnResource(stack, 'Resource', {
                type: 'Some::Resource',
                properties: {
                    subnetIds: vpc.selectSubnets().subnetIds,
                },
            });
            // THEN - No exception
            const publicSubnetList = { 'Fn::Split': [',', { 'Fn::ImportValue': 'myPublicSubnetIds' }] };
            assertions_1.Template.fromStack(stack).hasResourceProperties('Some::Resource', {
                subnetIds: [
                    { 'Fn::Select': [0, publicSubnetList] },
                    { 'Fn::Select': [1, publicSubnetList] },
                ],
            });
        });
        test('select explicitly defined subnets', () => {
            // GIVEN
            const stack = getTestStack();
            const vpc = lib_1.Vpc.fromVpcAttributes(stack, 'VPC', {
                vpcId: 'vpc-1234',
                availabilityZones: ['dummy1a', 'dummy1b', 'dummy1c'],
                publicSubnetIds: ['pub-1', 'pub-2', 'pub-3'],
                publicSubnetRouteTableIds: ['rt-1', 'rt-2', 'rt-3'],
            });
            const subnet = new lib_1.PrivateSubnet(stack, 'Subnet', {
                availabilityZone: vpc.availabilityZones[0],
                cidrBlock: '10.0.0.0/28',
                vpcId: vpc.vpcId,
            });
            // WHEN
            const { subnetIds } = vpc.selectSubnets({ subnets: [subnet] });
            // THEN
            expect(subnetIds.length).toEqual(1);
            expect(subnetIds[0]).toEqual(subnet.subnetId);
        });
        test('subnet created from subnetId', () => {
            // GIVEN
            const stack = getTestStack();
            // WHEN
            const subnet = lib_1.Subnet.fromSubnetId(stack, 'subnet1', 'pub-1');
            // THEN
            expect(subnet.subnetId).toEqual('pub-1');
        });
        test('Referencing AZ throws error when subnet created from subnetId', () => {
            // GIVEN
            const stack = getTestStack();
            // WHEN
            const subnet = lib_1.Subnet.fromSubnetId(stack, 'subnet1', 'pub-1');
            // THEN
            // eslint-disable-next-line max-len
            expect(() => subnet.availabilityZone).toThrow("You cannot reference a Subnet's availability zone if it was not supplied. Add the availabilityZone when importing using Subnet.fromSubnetAttributes()");
        });
        test('Referencing AZ throws error when subnet created from attributes without az', () => {
            // GIVEN
            const stack = getTestStack();
            // WHEN
            const subnet = lib_1.Subnet.fromSubnetAttributes(stack, 'subnet1', { subnetId: 'pub-1', availabilityZone: '' });
            // THEN
            expect(subnet.subnetId).toEqual('pub-1');
            // eslint-disable-next-line max-len
            expect(() => subnet.availabilityZone).toThrow("You cannot reference a Subnet's availability zone if it was not supplied. Add the availabilityZone when importing using Subnet.fromSubnetAttributes()");
        });
        test('AZ have value when subnet created from attributes with az', () => {
            // GIVEN
            const stack = getTestStack();
            // WHEN
            const subnet = lib_1.Subnet.fromSubnetAttributes(stack, 'subnet1', { subnetId: 'pub-1', availabilityZone: 'az-1234' });
            // THEN
            expect(subnet.subnetId).toEqual('pub-1');
            expect(subnet.availabilityZone).toEqual('az-1234');
        });
        test('Can select subnets by type and AZ', () => {
            // GIVEN
            const stack = getTestStack();
            const vpc = new lib_1.Vpc(stack, 'VPC', {
                maxAzs: 3,
            });
            // WHEN
            new lib_1.InterfaceVpcEndpoint(stack, 'VPC Endpoint', {
                vpc,
                privateDnsEnabled: false,
                service: new lib_1.InterfaceVpcEndpointService('com.amazonaws.vpce.us-east-1.vpce-svc-uuddlrlrbastrtsvc', 443),
                subnets: {
                    subnetType: lib_1.SubnetType.PRIVATE_WITH_EGRESS,
                    availabilityZones: ['dummy1a', 'dummy1c'],
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
                ServiceName: 'com.amazonaws.vpce.us-east-1.vpce-svc-uuddlrlrbastrtsvc',
                SubnetIds: [
                    {
                        Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
                    },
                    {
                        Ref: 'VPCPrivateSubnet3Subnet3EDCD457',
                    },
                ],
            });
        });
        test('SubnetSelection filtered on az uses default subnetType when no subnet type specified', () => {
            // GIVEN
            const stack = getTestStack();
            const vpc = new lib_1.Vpc(stack, 'VPC', {
                maxAzs: 3,
            });
            // WHEN
            new lib_1.InterfaceVpcEndpoint(stack, 'VPC Endpoint', {
                vpc,
                service: new lib_1.InterfaceVpcEndpointService('com.amazonaws.vpce.us-east-1.vpce-svc-uuddlrlrbastrtsvc', 443),
                subnets: {
                    availabilityZones: ['dummy1a', 'dummy1c'],
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
                ServiceName: 'com.amazonaws.vpce.us-east-1.vpce-svc-uuddlrlrbastrtsvc',
                SubnetIds: [
                    {
                        Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
                    },
                    {
                        Ref: 'VPCPrivateSubnet3Subnet3EDCD457',
                    },
                ],
            });
        });
        test('SubnetSelection doesnt throw error when selecting imported subnets', () => {
            // GIVEN
            const stack = getTestStack();
            // WHEN
            const vpc = new lib_1.Vpc(stack, 'VPC');
            // THEN
            expect(() => vpc.selectSubnets({
                subnets: [
                    lib_1.Subnet.fromSubnetId(stack, 'Subnet', 'sub-1'),
                ],
            })).not.toThrow();
        });
        test('can filter by single IP address', () => {
            // GIVEN
            const stack = getTestStack();
            // IP space is split into 6 pieces, one public/one private per AZ
            const vpc = new lib_1.Vpc(stack, 'VPC', {
                ipAddresses: lib_1.IpAddresses.cidr('10.0.0.0/16'),
                maxAzs: 3,
            });
            // WHEN
            // We want to place this bastion host in the same subnet as this IPv4
            // address.
            new lib_1.BastionHostLinux(stack, 'Bastion', {
                vpc,
                subnetSelection: {
                    subnetFilters: [lib_1.SubnetFilter.containsIpAddresses(['10.0.160.0'])],
                },
            });
            // THEN
            // 10.0.160.0/19 is the third subnet, sequentially, if you split
            // 10.0.0.0/16 into 6 pieces
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
                SubnetId: {
                    Ref: 'VPCPrivateSubnet3Subnet3EDCD457',
                },
            });
        });
        test('can filter by multiple IP addresses', () => {
            // GIVEN
            const stack = getTestStack();
            // IP space is split into 6 pieces, one public/one private per AZ
            const vpc = new lib_1.Vpc(stack, 'VPC', {
                ipAddresses: lib_1.IpAddresses.cidr('10.0.0.0/16'),
                maxAzs: 3,
            });
            // WHEN
            // We want to place this endpoint in the same subnets as these IPv4
            // address.
            // WHEN
            new lib_1.InterfaceVpcEndpoint(stack, 'VPC Endpoint', {
                vpc,
                service: new lib_1.InterfaceVpcEndpointService('com.amazonaws.vpce.us-east-1.vpce-svc-uuddlrlrbastrtsvc', 443),
                subnets: {
                    subnetFilters: [lib_1.SubnetFilter.containsIpAddresses(['10.0.96.0', '10.0.160.0'])],
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
                ServiceName: 'com.amazonaws.vpce.us-east-1.vpce-svc-uuddlrlrbastrtsvc',
                SubnetIds: [
                    {
                        Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
                    },
                    {
                        Ref: 'VPCPrivateSubnet3Subnet3EDCD457',
                    },
                ],
            });
        });
        test('can filter by Subnet Ids', () => {
            // GIVEN
            const stack = getTestStack();
            const vpc = lib_1.Vpc.fromVpcAttributes(stack, 'VPC', {
                vpcId: 'vpc-1234',
                vpcCidrBlock: '192.168.0.0/16',
                availabilityZones: ['dummy1a', 'dummy1b', 'dummy1c'],
                privateSubnetIds: ['priv-1', 'priv-2', 'priv-3'],
            });
            // WHEN
            new lib_1.InterfaceVpcEndpoint(stack, 'VPC Endpoint', {
                vpc,
                service: new lib_1.InterfaceVpcEndpointService('com.amazonaws.vpce.us-east-1.vpce-svc-uuddlrlrbastrtsvc', 443),
                subnets: {
                    subnetFilters: [lib_1.SubnetFilter.byIds(['priv-1', 'priv-2'])],
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
                ServiceName: 'com.amazonaws.vpce.us-east-1.vpce-svc-uuddlrlrbastrtsvc',
                SubnetIds: ['priv-1', 'priv-2'],
            });
        });
        test('can filter by Subnet Ids via selectSubnets', () => {
            // GIVEN
            const stack = getTestStack();
            const vpc = lib_1.Vpc.fromVpcAttributes(stack, 'VPC', {
                vpcId: 'vpc-1234',
                vpcCidrBlock: '192.168.0.0/16',
                availabilityZones: ['dummy1a', 'dummy1b', 'dummy1c'],
                privateSubnetIds: ['subnet-1', 'subnet-2', 'subnet-3'],
            });
            // WHEN
            const subnets = vpc.selectSubnets({
                subnetFilters: [lib_1.SubnetFilter.byIds(['subnet-1'])],
            });
            // THEN
            expect(subnets.subnetIds.length).toEqual(1);
        });
        test('can filter by Cidr Netmask', () => {
            // GIVEN
            const stack = getTestStack();
            const vpc = new lib_1.Vpc(stack, 'VpcNetwork', {
                maxAzs: 1,
                subnetConfiguration: [
                    { name: 'normalSn1', subnetType: lib_1.SubnetType.PUBLIC, cidrMask: 20 },
                    { name: 'normalSn2', subnetType: lib_1.SubnetType.PUBLIC, cidrMask: 20 },
                    { name: 'smallSn', subnetType: lib_1.SubnetType.PUBLIC, cidrMask: 28 },
                ],
            });
            // WHEN
            const { subnetIds } = vpc.selectSubnets({ subnetFilters: [lib_1.SubnetFilter.byCidrMask(20)] });
            // THEN
            expect(subnetIds.length).toEqual(2);
            const expected = vpc.publicSubnets.filter(s => s.ipv4CidrBlock.endsWith('/20'));
            expect(subnetIds).toEqual(expected.map(s => s.subnetId));
        });
        test('tests router types', () => {
            // GIVEN
            const stack = getTestStack();
            const vpc = new lib_1.Vpc(stack, 'Vpc');
            // WHEN
            vpc.publicSubnets[0].addRoute('TransitRoute', {
                routerType: lib_1.RouterType.TRANSIT_GATEWAY,
                routerId: 'transit-id',
            });
            vpc.publicSubnets[0].addRoute('CarrierRoute', {
                routerType: lib_1.RouterType.CARRIER_GATEWAY,
                routerId: 'carrier-gateway-id',
            });
            vpc.publicSubnets[0].addRoute('LocalGatewayRoute', {
                routerType: lib_1.RouterType.LOCAL_GATEWAY,
                routerId: 'local-gateway-id',
            });
            vpc.publicSubnets[0].addRoute('VpcEndpointRoute', {
                routerType: lib_1.RouterType.VPC_ENDPOINT,
                routerId: 'vpc-endpoint-id',
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Route', {
                TransitGatewayId: 'transit-id',
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Route', {
                LocalGatewayId: 'local-gateway-id',
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Route', {
                CarrierGatewayId: 'carrier-gateway-id',
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Route', {
                VpcEndpointId: 'vpc-endpoint-id',
            });
        });
    });
    describe('Using reserved azs', () => {
        test.each([
            [{ maxAzs: 2, reservedAzs: 1 }, { maxAzs: 3 }],
            [{ maxAzs: 2, reservedAzs: 2 }, { maxAzs: 3, reservedAzs: 1 }],
            [{ maxAzs: 2, reservedAzs: 1, subnetConfiguration: [{ cidrMask: 22, name: 'Public', subnetType: lib_1.SubnetType.PUBLIC }, { cidrMask: 23, name: 'Private', subnetType: lib_1.SubnetType.PRIVATE_WITH_EGRESS }] },
                { maxAzs: 3, subnetConfiguration: [{ cidrMask: 22, name: 'Public', subnetType: lib_1.SubnetType.PUBLIC }, { cidrMask: 23, name: 'Private', subnetType: lib_1.SubnetType.PRIVATE_WITH_EGRESS }] }],
            [{ maxAzs: 2, reservedAzs: 1, subnetConfiguration: [{ cidrMask: 22, name: 'Public', subnetType: lib_1.SubnetType.PUBLIC }, { cidrMask: 23, name: 'Private', subnetType: lib_1.SubnetType.PRIVATE_WITH_EGRESS, reserved: true }] },
                { maxAzs: 3, subnetConfiguration: [{ cidrMask: 22, name: 'Public', subnetType: lib_1.SubnetType.PUBLIC }, { cidrMask: 23, name: 'Private', subnetType: lib_1.SubnetType.PRIVATE_WITH_EGRESS, reserved: true }] }],
            [{ maxAzs: 2, reservedAzs: 1, ipAddresses: lib_1.IpAddresses.cidr('192.168.0.0/16') }, { maxAzs: 3, ipAddresses: lib_1.IpAddresses.cidr('192.168.0.0/16') }],
            [{ availabilityZones: ['dummy1a', 'dummy1b'], reservedAzs: 1 }, { availabilityZones: ['dummy1a', 'dummy1b', 'dummy1c'] }],
        ])('subnets should remain the same going from %p to %p', (propsWithReservedAz, propsWithUsedReservedAz) => {
            const stackWithReservedAz = getTestStack();
            const stackWithUsedReservedAz = getTestStack();
            new lib_1.Vpc(stackWithReservedAz, 'Vpc', propsWithReservedAz);
            new lib_1.Vpc(stackWithUsedReservedAz, 'Vpc', propsWithUsedReservedAz);
            const templateWithReservedAz = assertions_1.Template.fromStack(stackWithReservedAz);
            const templateWithUsedReservedAz = assertions_1.Template.fromStack(stackWithUsedReservedAz);
            const subnetsOfTemplateWithReservedAz = templateWithReservedAz.findResources('AWS::EC2::Subnet');
            const subnetsOfTemplateWithUsedReservedAz = templateWithUsedReservedAz.findResources('AWS::EC2::Subnet');
            for (const [logicalId, subnetOfTemplateWithReservedAz] of Object.entries(subnetsOfTemplateWithReservedAz)) {
                const subnetOfTemplateWithUsedReservedAz = subnetsOfTemplateWithUsedReservedAz[logicalId];
                expect(subnetOfTemplateWithUsedReservedAz).toEqual(subnetOfTemplateWithReservedAz);
            }
        });
    });
    describe('can reference vpcEndpointDnsEntries across stacks', () => {
        test('can reference an actual string list across stacks', () => {
            const app = new core_1.App();
            const stack1 = new core_1.Stack(app, 'Stack1');
            const vpc = new lib_1.Vpc(stack1, 'Vpc');
            const endpoint = new lib_1.InterfaceVpcEndpoint(stack1, 'interfaceVpcEndpoint', {
                vpc,
                service: lib_1.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
            });
            const stack2 = new core_1.Stack(app, 'Stack2');
            new core_1.CfnOutput(stack2, 'endpoint', {
                value: core_1.Fn.select(0, endpoint.vpcEndpointDnsEntries),
            });
            const assembly = app.synth();
            const template1 = assembly.getStackByName(stack1.stackName).template;
            const template2 = assembly.getStackByName(stack2.stackName).template;
            // THEN
            expect(template1).toMatchObject({
                Outputs: {
                    ExportsOutputFnGetAttinterfaceVpcEndpoint89C99945DnsEntriesB1872F7A: {
                        Value: {
                            'Fn::Join': [
                                '||', {
                                    'Fn::GetAtt': [
                                        'interfaceVpcEndpoint89C99945',
                                        'DnsEntries',
                                    ],
                                },
                            ],
                        },
                        Export: { Name: 'Stack1:ExportsOutputFnGetAttinterfaceVpcEndpoint89C99945DnsEntriesB1872F7A' },
                    },
                },
            });
            expect(template2).toMatchObject({
                Outputs: {
                    endpoint: {
                        Value: {
                            'Fn::Select': [
                                0,
                                {
                                    'Fn::Split': [
                                        '||',
                                        {
                                            'Fn::ImportValue': 'Stack1:ExportsOutputFnGetAttinterfaceVpcEndpoint89C99945DnsEntriesB1872F7A',
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                },
            });
        });
    });
});
function getTestStack() {
    return new core_1.Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'us-east-1' } });
}
function toCfnTags(tags) {
    return Object.keys(tags).map(key => {
        return { Key: key, Value: tags[key] };
    });
}
function hasTags(expectedTags) {
    return {
        Properties: {
            Tags: assertions_1.Match.arrayWith(expectedTags),
        },
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnBjLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ2cGMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUFtRTtBQUNuRSw4REFBMEQ7QUFDMUQsd0NBQW1GO0FBQ25GLGdDQTJCZ0I7QUFFaEIsUUFBUSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUU7SUFDbkIsUUFBUSxDQUFDLHFCQUFxQixFQUFFLEdBQUcsRUFBRTtRQUVuQyxJQUFBLGdDQUFjLEVBQUMsNkVBQTZFLEVBQUUsR0FBRyxFQUFFO1lBRWpHLE1BQU0sTUFBTSxHQUFHLFlBQVksRUFBRSxDQUFDO1lBQzlCLE1BQU0sTUFBTSxHQUFHLFlBQVksRUFBRSxDQUFDO1lBQzlCLElBQUksU0FBRyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUU7Z0JBQ3hCLG1CQUFtQixFQUFFO29CQUNuQjt3QkFDRSxVQUFVLEVBQUUsZ0JBQVUsQ0FBQyxnQkFBZ0I7d0JBQ3ZDLElBQUksRUFBRSxRQUFRO3FCQUNmO29CQUNEO3dCQUNFLFVBQVUsRUFBRSxnQkFBVSxDQUFDLE1BQU07d0JBQzdCLElBQUksRUFBRSxRQUFRO3FCQUNmO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsSUFBSSxTQUFHLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRTtnQkFDeEIsbUJBQW1CLEVBQUU7b0JBQ25CO3dCQUNFLFVBQVUsRUFBRSxnQkFBVSxDQUFDLG1CQUFtQjt3QkFDMUMsSUFBSSxFQUFFLFFBQVE7cUJBQ2Y7b0JBQ0Q7d0JBQ0UsVUFBVSxFQUFFLGdCQUFVLENBQUMsTUFBTTt3QkFDN0IsSUFBSSxFQUFFLFFBQVE7cUJBQ2Y7aUJBQ0Y7YUFDRixDQUFDLENBQUM7WUFFSCxNQUFNLEVBQUUsR0FBRyxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN0QyxNQUFNLEVBQUUsR0FBRyxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUV0QyxNQUFNLENB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QUFLLE9BQU8sQ0FBQyxDQUFDO1lBQy9FLE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQUMsUUFBUSxLQUFLLE9BQU8sQ0FBQyxDQUFDO1lBQy9FLE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQUMsUUFBUSxLQUFLLE9BQU8sQ0FBQyxDQUFDO1lBQ2pGLE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQUMsUUFBUSxLQUFLLE9BQU8sQ0FBQyxDQUFDO1lBQ2pGLE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQUMsUUFBUSxLQUFLLE9BQU8sQ0FBQyxDQUFDO1lBQ2pGLE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQUMsUUFBUSxLQUFLLE9BQU8sQ0FBQyxDQUFDO1lBQ25GLE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQUMsUUFBUSxLQUFLLE9BQU8sQ0FBQyxDQUFDO1lBQ25GLE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQUMsUUFBUSxLQUFLLE9BQU8sQ0FBQyxDQUFDO1lBRW5GLE9BQU87WUFDUCxNQUFNLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUN0RCxNQUFNLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUN2RCxNQUFNLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUN4RCxNQUFNLENBQUMsUUFBUSxFQUFFLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUN4RCxNQUFNLENBQUMsUUFBUSxFQUFFLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUN6RCxNQUFNLENBQUMsUUFBUSxFQUFFLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQzFELE1BQU0sQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ3pELE1BQU0sQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQzFELE1BQU0sQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFFN0QsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsNENBQTRDLEVBQUUsR0FBRyxFQUFFO1lBQ3RELE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFFMUIsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUNWLFNBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO2dCQUNsQyxLQUFLLEVBQUUsVUFBVTtnQkFDakIsaUJBQWlCLEVBQUUsQ0FBQyxZQUFZLEVBQUUsWUFBWSxFQUFFLFlBQVksQ0FBQztnQkFDN0QsZUFBZSxFQUFFLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUM7Z0JBQ2xELGlCQUFpQixFQUFFLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQzthQUM1QyxDQUFDLENBQ0gsQ0FBQyxPQUFPLENBQUMsMkVBQTJFLENBQUMsQ0FBQztRQUN6RixDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQywrQ0FBK0MsRUFBRSxHQUFHLEVBQUU7WUFDekQsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUUxQixNQUFNLENBQUMsR0FBRyxFQUFFLENBQ1YsU0FBRyxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7Z0JBQ2xDLEtBQUssRUFBRSxVQUFVO2dCQUNqQixpQkFBaUIsRUFBRSxDQUFDLFlBQVksRUFBRSxZQUFZLEVBQUUsWUFBWSxDQUFDO2dCQUM3RCxlQUFlLEVBQUUsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQztnQkFDbEQseUJBQXlCLEVBQUUsQ0FBQyxVQUFVLENBQUM7YUFDeEMsQ0FBQyxDQUNILENBQUMsT0FBTyxDQUFDLDZGQUE2RixDQUFDLENBQUM7UUFDM0csQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsdURBQXVELEVBQUUsR0FBRyxFQUFFO1lBQ2pFLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFFMUIsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUNWLFNBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO2dCQUNsQyxLQUFLLEVBQUUsVUFBVTtnQkFDakIsaUJBQWlCLEVBQUUsQ0FBQyxZQUFZLEVBQUUsWUFBWSxFQUFFLFlBQVksQ0FBQztnQkFDN0QsZUFBZSxFQUFFLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUM7Z0JBQ2xELDBCQUEwQixFQUFFLENBQUMsYUFBYSxFQUFFLGNBQWMsQ0FBQzthQUM1RCxDQUFDLENBQ0gsQ0FBQyxPQUFPLENBQUMsOEZBQThGLENBQUMsQ0FBQztRQUM1RyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGVBQWUsRUFBRSxHQUFHLEVBQUU7UUFDN0IsSUFBSSxDQUFDLHFEQUFxRCxFQUFFLEdBQUcsRUFBRTtZQUMvRCxRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsWUFBWSxFQUFFLENBQUM7WUFFN0IsT0FBTztZQUNQLE1BQU0sa0JBQWtCLEdBQUcsaUJBQVcsQ0FBQyxRQUFRLENBQUM7Z0JBQzlDLFlBQVksRUFBRSxJQUFJLGtCQUFZLENBQUMsVUFBVSxDQUFDO2dCQUMxQyxZQUFZLEVBQUUsSUFBSSx1QkFBaUIsQ0FBQztvQkFDbEMsV0FBVyxFQUFFLE9BQU87aUJBQ3JCLENBQUM7YUFDSCxDQUFDLENBQUM7WUFDSCxJQUFJLFNBQUcsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLEVBQUUsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDO1lBRWpELE9BQU87WUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxlQUFlLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbkUscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsb0JBQW9CLEVBQUU7Z0JBQ3BFLE9BQU8sRUFBRSxPQUFPO2dCQUNoQixZQUFZLEVBQUUsVUFBVTtnQkFDeEIsZUFBZSxFQUFFLEtBQUs7YUFDdkIsQ0FBQyxDQUFDO1lBQ0gscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsaUJBQWlCLEVBQUU7Z0JBQ2pFLFlBQVksRUFBRSxFQUFFLEdBQUcsRUFBRSx3Q0FBd0MsRUFBRTtnQkFDL0Qsb0JBQW9CLEVBQUUsV0FBVztnQkFDakMsVUFBVSxFQUFFLEVBQUUsR0FBRyxFQUFFLHdDQUF3QyxFQUFFO2FBQzlELENBQUMsQ0FBQztZQUNILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHlCQUF5QixFQUFFO2dCQUN6RSxtQkFBbUIsRUFBRTtvQkFDbkI7d0JBQ0UsTUFBTSxFQUFFLFdBQVc7d0JBQ25CLFdBQVcsRUFBRSx1Q0FBdUM7d0JBQ3BELFVBQVUsRUFBRSxJQUFJO3FCQUNqQjtpQkFDRjtnQkFDRCxvQkFBb0IsRUFBRTtvQkFDcEI7d0JBQ0UsTUFBTSxFQUFFLFdBQVc7d0JBQ25CLFdBQVcsRUFBRSw0QkFBNEI7d0JBQ3pDLFVBQVUsRUFBRSxJQUFJO3FCQUNqQjtpQkFDRjthQUNGLENBQUMsQ0FBQztRQUdMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLDhDQUE4QyxFQUFFLEdBQUcsRUFBRTtZQUN4RCxRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsWUFBWSxFQUFFLENBQUM7WUFFN0IsT0FBTztZQUNQLElBQUksU0FBRyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7Z0JBQ3ZCLGtCQUFrQixFQUFFLGlCQUFXLENBQUMsUUFBUSxDQUFDO29CQUN2QyxZQUFZLEVBQUUsSUFBSSxrQkFBWSxDQUFDLFVBQVUsQ0FBQztvQkFDMUMsWUFBWSxFQUFFLElBQUksdUJBQWlCLENBQUM7d0JBQ2xDLFdBQVcsRUFBRSxPQUFPO3FCQUNyQixDQUFDO2lCQUNILENBQUM7Z0JBQ0YsV0FBVyxFQUFFLENBQUM7YUFDZixDQUFDLENBQUM7WUFFSCxPQUFPO1lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsZUFBZSxDQUFDLG9CQUFvQixFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBQSxnQ0FBYyxFQUFDLDJFQUEyRSxFQUFFLEdBQUcsRUFBRTtZQUMvRixRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsWUFBWSxFQUFFLENBQUM7WUFFN0IsT0FBTztZQUNQLE1BQU0sUUFBUSxHQUFHLGlCQUFXLENBQUMsUUFBUSxDQUFDO2dCQUNwQyxZQUFZLEVBQUUsSUFBSSxrQkFBWSxDQUFDLFVBQVUsQ0FBQztnQkFDMUMsWUFBWSxFQUFFLElBQUksdUJBQWlCLENBQUM7b0JBQ2xDLFdBQVcsRUFBRSxPQUFPO2lCQUNyQixDQUFDO2dCQUNGLGVBQWUsRUFBRSxLQUFLO2FBQ3ZCLENBQUMsQ0FBQztZQUNILElBQUksU0FBRyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7Z0JBQ3ZCLGtCQUFrQixFQUFFLFFBQVE7YUFDN0IsQ0FBQyxDQUFDO1lBQ0gsUUFBUSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsVUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxVQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFFdEUsT0FBTztZQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHlCQUF5QixFQUFFO2dCQUN6RSxtQkFBbUIsRUFBRTtvQkFDbkI7d0JBQ0UsTUFBTSxFQUFFLFdBQVc7d0JBQ25CLFdBQVcsRUFBRSx1Q0FBdUM7d0JBQ3BELFVBQVUsRUFBRSxJQUFJO3FCQUNqQjtpQkFDRjtnQkFDRCxvQkFBb0IsRUFBRTtvQkFDcEI7d0JBQ0UsTUFBTSxFQUFFLFlBQVk7d0JBQ3BCLFdBQVcsRUFBRSxvQkFBb0I7d0JBQ2pDLFFBQVEsRUFBRSxFQUFFO3dCQUNaLFVBQVUsRUFBRSxLQUFLO3dCQUNqQixNQUFNLEVBQUUsRUFBRTtxQkFDWDtpQkFDRjthQUNGLENBQUMsQ0FBQztRQUdMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLDBGQUEwRixFQUFFLEdBQUcsRUFBRTtZQUNwRyxRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsWUFBWSxFQUFFLENBQUM7WUFFN0IsT0FBTztZQUNQLE1BQU0sUUFBUSxHQUFHLGlCQUFXLENBQUMsUUFBUSxDQUFDO2dCQUNwQyxZQUFZLEVBQUUsSUFBSSxrQkFBWSxDQUFDLFVBQVUsQ0FBQztnQkFDMUMsWUFBWSxFQUFFLElBQUksdUJBQWlCLENBQUM7b0JBQ2xDLFdBQVcsRUFBRSxPQUFPO2lCQUNyQixDQUFDO2dCQUNGLHFCQUFxQixFQUFFLHlCQUFtQixDQUFDLG9CQUFvQjthQUNoRSxDQUFDLENBQUM7WUFDSCxJQUFJLFNBQUcsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFO2dCQUN2QixrQkFBa0IsRUFBRSxRQUFRO2FBQzdCLENBQUMsQ0FBQztZQUVILE9BQU87WUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx5QkFBeUIsRUFBRTtnQkFDekUsbUJBQW1CLEVBQUU7b0JBQ25CO3dCQUNFLE1BQU0sRUFBRSxXQUFXO3dCQUNuQixXQUFXLEVBQUUsdUNBQXVDO3dCQUNwRCxVQUFVLEVBQUUsSUFBSTtxQkFDakI7aUJBQ0Y7Z0JBQ0Qsb0JBQW9CLEVBQUU7b0JBQ3BCO3dCQUNFLE1BQU0sRUFBRSxXQUFXO3dCQUNuQixXQUFXLEVBQUUsNEJBQTRCO3dCQUN6QyxVQUFVLEVBQUUsSUFBSTtxQkFDakI7aUJBQ0Y7YUFDRixDQUFDLENBQUM7UUFHTCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxtRkFBbUYsRUFBRSxHQUFHLEVBQUU7WUFDN0YsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLFlBQVksRUFBRSxDQUFDO1lBRTdCLE9BQU87WUFDUCxNQUFNLFFBQVEsR0FBRyxpQkFBVyxDQUFDLFFBQVEsQ0FBQztnQkFDcEMsWUFBWSxFQUFFLElBQUksa0JBQVksQ0FBQyxVQUFVLENBQUM7Z0JBQzFDLFlBQVksRUFBRSxJQUFJLHVCQUFpQixDQUFDO29CQUNsQyxXQUFXLEVBQUUsT0FBTztpQkFDckIsQ0FBQztnQkFDRixxQkFBcUIsRUFBRSx5QkFBbUIsQ0FBQyxhQUFhO2FBQ3pELENBQUMsQ0FBQztZQUNILElBQUksU0FBRyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7Z0JBQ3ZCLGtCQUFrQixFQUFFLFFBQVE7YUFDN0IsQ0FBQyxDQUFDO1lBRUgsT0FBTztZQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHlCQUF5QixFQUFFO2dCQUN6RSxtQkFBbUIsRUFBRTtvQkFDbkI7d0JBQ0UsTUFBTSxFQUFFLFdBQVc7d0JBQ25CLFdBQVcsRUFBRSx1Q0FBdUM7d0JBQ3BELFVBQVUsRUFBRSxJQUFJO3FCQUNqQjtpQkFDRjthQUNGLENBQUMsQ0FBQztRQUdMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLDBFQUEwRSxFQUFFLEdBQUcsRUFBRTtZQUNwRixRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsWUFBWSxFQUFFLENBQUM7WUFFN0IsT0FBTztZQUNQLE1BQU0sUUFBUSxHQUFHLGlCQUFXLENBQUMsUUFBUSxDQUFDO2dCQUNwQyxZQUFZLEVBQUUsSUFBSSxrQkFBWSxDQUFDLFVBQVUsQ0FBQztnQkFDMUMsWUFBWSxFQUFFLElBQUksdUJBQWlCLENBQUM7b0JBQ2xDLFdBQVcsRUFBRSxPQUFPO2lCQUNyQixDQUFDO2dCQUNGLHFCQUFxQixFQUFFLHlCQUFtQixDQUFDLElBQUk7YUFDaEQsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxTQUFHLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRTtnQkFDdkIsa0JBQWtCLEVBQUUsUUFBUTthQUM3QixDQUFDLENBQUM7WUFFSCxPQUFPO1lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMseUJBQXlCLEVBQUU7Z0JBQ3pFLG1CQUFtQixFQUFFO29CQUNuQjt3QkFDRSxNQUFNLEVBQUUsb0JBQW9CO3dCQUM1QixXQUFXLEVBQUUsc0JBQXNCO3dCQUNuQyxRQUFRLEVBQUUsR0FBRzt3QkFDYixVQUFVLEVBQUUsTUFBTTt3QkFDbEIsTUFBTSxFQUFFLEVBQUU7cUJBQ1g7aUJBQ0Y7YUFDRixDQUFDLENBQUM7UUFHTCxDQUFDLENBQUMsQ0FBQztJQUVMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLHlCQUF5QixFQUFFLEdBQUcsRUFBRTtRQUN2QyxJQUFJLENBQUMsdUNBQXVDLEVBQUUsR0FBRyxFQUFFO1lBQ2pELFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxZQUFZLEVBQUUsQ0FBQztZQUU3QixPQUFPO1lBQ1AsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFHLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxFQUFFLFdBQVcsRUFBRSxpQkFBVyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUMxRixJQUFJLGdCQUFTLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRTtnQkFDN0IsS0FBSyxFQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFZLENBQUMsNkJBQTZCO2FBQ3RFLENBQUMsQ0FBQztZQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLGVBQWUsQ0FBQztnQkFDeEMsT0FBTyxFQUFFO29CQUNQLE1BQU0sRUFBRTt3QkFDTixLQUFLLEVBQUUsRUFBRSxZQUFZLEVBQUUsQ0FBQyxtQ0FBbUMsRUFBRSx5QkFBeUIsQ0FBQyxFQUFFO3FCQUMxRjtpQkFDRjthQUNGLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGtEQUFrRCxFQUFFLEdBQUcsRUFBRTtZQUM1RCxRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsWUFBWSxFQUFFLENBQUM7WUFDN0IsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFHLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxFQUFFLFdBQVcsRUFBRSxpQkFBVyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUUxRixPQUFPO1lBQ1AsSUFBSSxnQkFBUyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7Z0JBQzdCLEtBQUssRUFBRyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBWSxDQUFDLDZCQUE2QjthQUN0RSxDQUFDLENBQUM7WUFDSCxJQUFJLGdCQUFVLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtnQkFDM0IsR0FBRztnQkFDSCxlQUFlLEVBQUUsRUFBRSxVQUFVLEVBQUUsZ0JBQVUsQ0FBQyxNQUFNLEVBQUU7YUFDbkQsQ0FBQyxDQUFDO1lBRUgscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsZUFBZSxDQUFDO2dCQUN4QyxPQUFPLEVBQUU7b0JBQ1AsTUFBTSxFQUFFO3dCQUNOLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxhQUFhLEVBQUU7cUJBQzlCO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyw4Q0FBOEMsRUFBRSxHQUFHLEVBQUU7UUFDNUQsSUFBSSxDQUFDLCtDQUErQyxFQUFFLEdBQUcsRUFBRTtZQUN6RCxNQUFNLEtBQUssR0FBRyxZQUFZLEVBQUUsQ0FBQztZQUM3QixJQUFJLFNBQUcsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLEVBQUUsV0FBVyxFQUFFLGlCQUFXLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzlFLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGVBQWUsRUFBRTtnQkFDL0QsU0FBUyxFQUFFLGdCQUFnQjthQUM1QixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0gsUUFBUSxDQUFDLGNBQWMsRUFBRSxHQUFHLEVBQUU7UUFDNUIsSUFBSSxDQUFDLGdFQUFnRSxFQUFFLEdBQUcsRUFBRTtZQUMxRSxNQUFNLEtBQUssR0FBRyxZQUFZLEVBQUUsQ0FBQztZQUM3QixNQUFNLElBQUksR0FBRztnQkFDWCxPQUFPLEVBQUUsTUFBTTthQUNoQixDQUFDO1lBQ0YsTUFBTSxVQUFVLEdBQUc7Z0JBQ2pCLFlBQVksRUFBRSxXQUFXO2FBQzFCLENBQUM7WUFDRixNQUFNLE9BQU8sR0FBRyxFQUFFLEdBQUcsVUFBVSxFQUFFLEdBQUcsSUFBSSxFQUFFLENBQUM7WUFFM0MsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFHLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3JDLDZCQUE2QjtZQUM3QixXQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsV0FBVyxFQUFFLEVBQUUsb0JBQW9CLEVBQUUsQ0FBQyxZQUFNLENBQUMsc0JBQXNCLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDekcsV0FBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3BDLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBQyxlQUFlLEVBQUUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEYsTUFBTSxTQUFTLEdBQUcsQ0FBQyxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsWUFBWSxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQzVFLE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNqQyxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDckMsS0FBSyxNQUFNLFFBQVEsSUFBSSxTQUFTLEVBQUU7Z0JBQ2hDLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGFBQWEsUUFBUSxFQUFFLEVBQUU7b0JBQ3ZFLElBQUksRUFBRSxrQkFBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7aUJBQ2hDLENBQUMsQ0FBQztnQkFDSCxNQUFNLGlCQUFpQixHQUFHLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxhQUFhLFFBQVEsRUFBRSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUM1RyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN2RDtRQUVILENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLHNEQUFzRCxFQUFFLEdBQUcsRUFBRTtZQUNoRSxNQUFNLEtBQUssR0FBRyxZQUFZLEVBQUUsQ0FBQztZQUM3QixNQUFNLEdBQUcsR0FBRyxJQUFJLFNBQUcsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDckMsS0FBSyxNQUFNLE1BQU0sSUFBSSxHQUFHLENBQUMsYUFBYSxFQUFFO2dCQUN0QyxNQUFNLEdBQUcsR0FBRyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3JELHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBQyxzQkFBc0IsRUFBRSxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlFLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBQyxzQkFBc0IsRUFBRSxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDL0U7WUFDRCxLQUFLLE1BQU0sTUFBTSxJQUFJLEdBQUcsQ0FBQyxjQUFjLEVBQUU7Z0JBQ3ZDLE1BQU0sR0FBRyxHQUFHLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDckQscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxDQUFDLHNCQUFzQixFQUFFLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUMvRTtRQUVILENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLHdFQUF3RSxFQUFFLEdBQUcsRUFBRTtZQUNsRixNQUFNLEtBQUssR0FBRyxZQUFZLEVBQUUsQ0FBQztZQUU3QixNQUFNLEdBQUcsR0FBRyxJQUFJLFNBQUcsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDckMsTUFBTSxHQUFHLEdBQUcsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsQ0FBQztZQUM1QyxXQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNyQyxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV6RSxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRTtRQUNoQyxJQUFJLENBQUMsb0RBQW9ELEVBQUUsR0FBRyxFQUFFO1lBQzlELFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxZQUFZLEVBQUUsQ0FBQztZQUM3QixNQUFNLEdBQUcsR0FBRyxJQUFJLFNBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFFbEMsT0FBTztZQUNQLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7WUFFMUMsT0FBTztZQUNQLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUVyRSxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQywyQkFBMkIsRUFBRSxHQUFHLEVBQUU7WUFDckMsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLFlBQVksRUFBRSxDQUFDO1lBQzdCLE1BQU0sR0FBRyxHQUFHLElBQUksU0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztZQUVsQyxPQUFPO1lBQ1AsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsRUFBRSxVQUFVLEVBQUUsZ0JBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1lBRTNFLE9BQU87WUFDUCxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFHcEUsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxFQUFFO1lBQ3ZDLFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxZQUFZLEVBQUUsQ0FBQztZQUM3QixNQUFNLEdBQUcsR0FBRyxJQUFJLFNBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO2dCQUNoQyxtQkFBbUIsRUFBRTtvQkFDbkIsRUFBRSxVQUFVLEVBQUUsZ0JBQVUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtvQkFDakQsRUFBRSxVQUFVLEVBQUUsZ0JBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFO2lCQUM5RDthQUNGLENBQUMsQ0FBQztZQUVILE9BQU87WUFDUCxNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxFQUFFLFVBQVUsRUFBRSxnQkFBVSxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQztZQUVyRixPQUFPO1lBQ1AsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBR3RFLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLDRCQUE0QixFQUFFLEdBQUcsRUFBRTtZQUN0QyxRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsWUFBWSxFQUFFLENBQUM7WUFDN0IsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtnQkFDaEMsbUJBQW1CLEVBQUU7b0JBQ25CLEVBQUUsVUFBVSxFQUFFLGdCQUFVLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7b0JBQ2pELEVBQUUsVUFBVSxFQUFFLGdCQUFVLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRTtvQkFDcEUsRUFBRSxVQUFVLEVBQUUsZ0JBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFO2lCQUNuRTthQUNGLENBQUMsQ0FBQztZQUVILE9BQU87WUFDUCxNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxFQUFFLGVBQWUsRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDO1lBRTdFLE9BQU87WUFDUCxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFFckUsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsK0RBQStELEVBQUUsR0FBRyxFQUFFO1lBQ3pFLFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxZQUFZLEVBQUUsQ0FBQztZQUM3QixNQUFNLEdBQUcsR0FBRyxJQUFJLFNBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO2dCQUNoQyxtQkFBbUIsRUFBRTtvQkFDbkIsRUFBRSxVQUFVLEVBQUUsZ0JBQVUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtvQkFDakQsRUFBRSxVQUFVLEVBQUUsZ0JBQVUsQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFO29CQUNwRSxFQUFFLFVBQVUsRUFBRSxnQkFBVSxDQUFDLGdCQUFnQixFQUFFLElBQUksRUFBRSxlQUFlLEVBQUU7aUJBQ25FO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsT0FBTztZQUNQLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUM7WUFFeEUsT0FBTztZQUNQLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUVyRSxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxxRkFBcUYsRUFBRSxHQUFHLEVBQUU7WUFDL0YsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsTUFBTSxHQUFHLEdBQUcsU0FBRyxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLEtBQUssRUFBRSxVQUFVO2dCQUNqQixpQkFBaUIsRUFBRSxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDO2dCQUNwRCxpQkFBaUIsRUFBRSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDO2dCQUM5QywyQkFBMkIsRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDO2FBQ3RELENBQUMsQ0FBQztZQUVILE9BQU87WUFDUCxNQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7WUFFcEMsT0FBTztZQUNQLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBRWpFLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGlGQUFpRixFQUFFLEdBQUcsRUFBRTtZQUMzRixRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUMxQixNQUFNLEdBQUcsR0FBRyxTQUFHLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtnQkFDOUMsS0FBSyxFQUFFLFVBQVU7Z0JBQ2pCLGlCQUFpQixFQUFFLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUM7Z0JBQ3BELGVBQWUsRUFBRSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDO2dCQUM1Qyx5QkFBeUIsRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDO2FBQ3BELENBQUMsQ0FBQztZQUVILE9BQU87WUFDUCxNQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7WUFFcEMsT0FBTztZQUNQLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBRWpFLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLHdEQUF3RCxFQUFFLEdBQUcsRUFBRTtZQUNsRSxRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUMxQixNQUFNLEdBQUcsR0FBRyxJQUFJLFNBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFFbEMsTUFBTSxDQUFDLEdBQUcsRUFBRTtnQkFDVixHQUFHLENBQUMsYUFBYSxDQUFDLEVBQUUsZUFBZSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7WUFDakQsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLDBGQUEwRixDQUFDLENBQUM7UUFHekcsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsb0NBQW9DLEVBQUUsR0FBRyxFQUFFO1lBQzlDLFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxZQUFZLEVBQUUsQ0FBQztZQUM3QixNQUFNLEdBQUcsR0FBRyxJQUFJLFNBQUcsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO2dCQUN2QyxNQUFNLEVBQUUsQ0FBQztnQkFDVCxtQkFBbUIsRUFBRTtvQkFDbkIsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxnQkFBVSxDQUFDLE1BQU0sRUFBRTtvQkFDN0MsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxnQkFBVSxDQUFDLG1CQUFtQixFQUFFO29CQUMzRCxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLGdCQUFVLENBQUMsbUJBQW1CLEVBQUU7aUJBQzNEO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsT0FBTztZQUNQLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7WUFFNUQsT0FBTztZQUNQLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUUvRCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxvREFBb0QsRUFBRSxHQUFHLEVBQUU7WUFDOUQsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLFlBQVksRUFBRSxDQUFDO1lBRTdCLE1BQU0sS0FBSyxHQUFHLFNBQUUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDeEMsTUFBTSxpQkFBaUIsR0FBRyxTQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxTQUFFLENBQUMsV0FBVyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQztZQUMvRSxNQUFNLGVBQWUsR0FBRyxTQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxTQUFFLENBQUMsV0FBVyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztZQUUzRSxPQUFPO1lBQ1AsTUFBTSxHQUFHLEdBQUcsU0FBRyxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLEtBQUs7Z0JBQ0wsaUJBQWlCO2dCQUNqQixlQUFlO2FBQ2hCLENBQUMsQ0FBQztZQUVILElBQUksa0JBQVcsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFO2dCQUNqQyxJQUFJLEVBQUUsZ0JBQWdCO2dCQUN0QixVQUFVLEVBQUU7b0JBQ1YsU0FBUyxFQUFFLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxTQUFTO2lCQUN6QzthQUNGLENBQUMsQ0FBQztZQUVILHNCQUFzQjtZQUN0QixxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDaEUsU0FBUyxFQUFFLEVBQUUsV0FBVyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsbUJBQW1CLEVBQUUsQ0FBQyxFQUFFO2FBQzlFLENBQUMsQ0FBQztZQUVILHdCQUFXLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxrTkFBa04sQ0FBQyxDQUFDO1FBQ2hSLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGtEQUFrRCxFQUFFLEdBQUcsRUFBRTtZQUM1RCxRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsWUFBWSxFQUFFLENBQUM7WUFFN0IsTUFBTSxLQUFLLEdBQUcsU0FBRSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN4QyxNQUFNLGlCQUFpQixHQUFHLFNBQUUsQ0FBQyxlQUFlLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdkUsTUFBTSxlQUFlLEdBQUcsU0FBRSxDQUFDLGVBQWUsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUVuRSxPQUFPO1lBQ1AsTUFBTSxHQUFHLEdBQUcsU0FBRyxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLEtBQUs7Z0JBQ0wsaUJBQWlCO2dCQUNqQixlQUFlO2FBQ2hCLENBQUMsQ0FBQztZQUVILElBQUksa0JBQVcsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFO2dCQUNqQyxJQUFJLEVBQUUsZ0JBQWdCO2dCQUN0QixVQUFVLEVBQUU7b0JBQ1YsU0FBUyxFQUFFLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxTQUFTO2lCQUN6QzthQUNGLENBQUMsQ0FBQztZQUVILHNCQUFzQjtZQUV0QixNQUFNLGdCQUFnQixHQUFHLEVBQUUsV0FBVyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsbUJBQW1CLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDNUYscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsZ0JBQWdCLEVBQUU7Z0JBQ2hFLFNBQVMsRUFBRTtvQkFDVCxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxFQUFFO29CQUN2QyxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxFQUFFO2lCQUN4QzthQUNGLENBQUMsQ0FBQztRQUdMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLG1DQUFtQyxFQUFFLEdBQUcsRUFBRTtZQUM3QyxRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsWUFBWSxFQUFFLENBQUM7WUFDN0IsTUFBTSxHQUFHLEdBQUcsU0FBRyxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLEtBQUssRUFBRSxVQUFVO2dCQUNqQixpQkFBaUIsRUFBRSxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDO2dCQUNwRCxlQUFlLEVBQUUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQztnQkFDNUMseUJBQXlCLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQzthQUNwRCxDQUFDLENBQUM7WUFDSCxNQUFNLE1BQU0sR0FBRyxJQUFJLG1CQUFhLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRTtnQkFDaEQsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztnQkFDMUMsU0FBUyxFQUFFLGFBQWE7Z0JBQ3hCLEtBQUssRUFBRSxHQUFHLENBQUMsS0FBSzthQUNqQixDQUFDLENBQUM7WUFFSCxPQUFPO1lBQ1AsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7WUFFL0QsT0FBTztZQUNQLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRWhELENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLDhCQUE4QixFQUFFLEdBQUcsRUFBRTtZQUN4QyxRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsWUFBWSxFQUFFLENBQUM7WUFFN0IsT0FBTztZQUNQLE1BQU0sTUFBTSxHQUFHLFlBQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUU5RCxPQUFPO1lBQ1AsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFM0MsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsK0RBQStELEVBQUUsR0FBRyxFQUFFO1lBQ3pFLFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxZQUFZLEVBQUUsQ0FBQztZQUU3QixPQUFPO1lBQ1AsTUFBTSxNQUFNLEdBQUcsWUFBTSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBRTlELE9BQU87WUFDUCxtQ0FBbUM7WUFDbkMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyx1SkFBdUosQ0FBQyxDQUFDO1FBRXpNLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLDRFQUE0RSxFQUFFLEdBQUcsRUFBRTtZQUN0RixRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsWUFBWSxFQUFFLENBQUM7WUFFN0IsT0FBTztZQUNQLE1BQU0sTUFBTSxHQUFHLFlBQU0sQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBRTFHLE9BQU87WUFDUCxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN6QyxtQ0FBbUM7WUFDbkMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyx1SkFBdUosQ0FBQyxDQUFDO1FBRXpNLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLDJEQUEyRCxFQUFFLEdBQUcsRUFBRTtZQUNyRSxRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsWUFBWSxFQUFFLENBQUM7WUFFN0IsT0FBTztZQUNQLE1BQU0sTUFBTSxHQUFHLFlBQU0sQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDO1lBRWpILE9BQU87WUFDUCxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN6QyxNQUFNLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRXJELENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLG1DQUFtQyxFQUFFLEdBQUcsRUFBRTtZQUM3QyxRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsWUFBWSxFQUFFLENBQUM7WUFDN0IsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtnQkFDaEMsTUFBTSxFQUFFLENBQUM7YUFDVixDQUFDLENBQUM7WUFFSCxPQUFPO1lBQ1AsSUFBSSwwQkFBb0IsQ0FBQyxLQUFLLEVBQUUsY0FBYyxFQUFFO2dCQUM5QyxHQUFHO2dCQUNILGlCQUFpQixFQUFFLEtBQUs7Z0JBQ3hCLE9BQU8sRUFBRSxJQUFJLGlDQUEyQixDQUFDLHlEQUF5RCxFQUFFLEdBQUcsQ0FBQztnQkFDeEcsT0FBTyxFQUFFO29CQUNQLFVBQVUsRUFBRSxnQkFBVSxDQUFDLG1CQUFtQjtvQkFDMUMsaUJBQWlCLEVBQUUsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDO2lCQUMxQzthQUNGLENBQUMsQ0FBQztZQUVILE9BQU87WUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx1QkFBdUIsRUFBRTtnQkFDdkUsV0FBVyxFQUFFLHlEQUF5RDtnQkFDdEUsU0FBUyxFQUFFO29CQUNUO3dCQUNFLEdBQUcsRUFBRSxpQ0FBaUM7cUJBQ3ZDO29CQUNEO3dCQUNFLEdBQUcsRUFBRSxpQ0FBaUM7cUJBQ3ZDO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1FBRUwsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsc0ZBQXNGLEVBQUUsR0FBRyxFQUFFO1lBQ2hHLFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxZQUFZLEVBQUUsQ0FBQztZQUM3QixNQUFNLEdBQUcsR0FBRyxJQUFJLFNBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO2dCQUNoQyxNQUFNLEVBQUUsQ0FBQzthQUNWLENBQUMsQ0FBQztZQUVILE9BQU87WUFDUCxJQUFJLDBCQUFvQixDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUU7Z0JBQzlDLEdBQUc7Z0JBQ0gsT0FBTyxFQUFFLElBQUksaUNBQTJCLENBQUMseURBQXlELEVBQUUsR0FBRyxDQUFDO2dCQUN4RyxPQUFPLEVBQUU7b0JBQ1AsaUJBQWlCLEVBQUUsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDO2lCQUMxQzthQUNGLENBQUMsQ0FBQztZQUVILE9BQU87WUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx1QkFBdUIsRUFBRTtnQkFDdkUsV0FBVyxFQUFFLHlEQUF5RDtnQkFDdEUsU0FBUyxFQUFFO29CQUNUO3dCQUNFLEdBQUcsRUFBRSxpQ0FBaUM7cUJBQ3ZDO29CQUNEO3dCQUNFLEdBQUcsRUFBRSxpQ0FBaUM7cUJBQ3ZDO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1FBRUwsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsb0VBQW9FLEVBQUUsR0FBRyxFQUFFO1lBQzlFLFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxZQUFZLEVBQUUsQ0FBQztZQUU3QixPQUFPO1lBQ1AsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRWxDLE9BQU87WUFDUCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQztnQkFDN0IsT0FBTyxFQUFFO29CQUNQLFlBQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUM7aUJBQzlDO2FBQ0YsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRXBCLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGlDQUFpQyxFQUFFLEdBQUcsRUFBRTtZQUMzQyxRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsWUFBWSxFQUFFLENBQUM7WUFFN0IsaUVBQWlFO1lBQ2pFLE1BQU0sR0FBRyxHQUFHLElBQUksU0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7Z0JBQ2hDLFdBQVcsRUFBRSxpQkFBVyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7Z0JBQzVDLE1BQU0sRUFBRSxDQUFDO2FBQ1YsQ0FBQyxDQUFDO1lBRUgsT0FBTztZQUNQLHFFQUFxRTtZQUNyRSxXQUFXO1lBQ1gsSUFBSSxzQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO2dCQUNyQyxHQUFHO2dCQUNILGVBQWUsRUFBRTtvQkFDZixhQUFhLEVBQUUsQ0FBQyxrQkFBWSxDQUFDLG1CQUFtQixDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztpQkFDbEU7YUFDRixDQUFDLENBQUM7WUFFSCxPQUFPO1lBQ1AsZ0VBQWdFO1lBQ2hFLDRCQUE0QjtZQUM1QixxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxvQkFBb0IsRUFBRTtnQkFDcEUsUUFBUSxFQUFFO29CQUNSLEdBQUcsRUFBRSxpQ0FBaUM7aUJBQ3ZDO2FBQ0YsQ0FBQyxDQUFDO1FBRUwsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMscUNBQXFDLEVBQUUsR0FBRyxFQUFFO1lBQy9DLFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxZQUFZLEVBQUUsQ0FBQztZQUU3QixpRUFBaUU7WUFDakUsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtnQkFDaEMsV0FBVyxFQUFFLGlCQUFXLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztnQkFDNUMsTUFBTSxFQUFFLENBQUM7YUFDVixDQUFDLENBQUM7WUFFSCxPQUFPO1lBQ1AsbUVBQW1FO1lBQ25FLFdBQVc7WUFDWCxPQUFPO1lBQ1AsSUFBSSwwQkFBb0IsQ0FBQyxLQUFLLEVBQUUsY0FBYyxFQUFFO2dCQUM5QyxHQUFHO2dCQUNILE9BQU8sRUFBRSxJQUFJLGlDQUEyQixDQUFDLHlEQUF5RCxFQUFFLEdBQUcsQ0FBQztnQkFDeEcsT0FBTyxFQUFFO29CQUNQLGFBQWEsRUFBRSxDQUFDLGtCQUFZLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQztpQkFDL0U7YUFDRixDQUFDLENBQUM7WUFFSCxPQUFPO1lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsdUJBQXVCLEVBQUU7Z0JBQ3ZFLFdBQVcsRUFBRSx5REFBeUQ7Z0JBQ3RFLFNBQVMsRUFBRTtvQkFDVDt3QkFDRSxHQUFHLEVBQUUsaUNBQWlDO3FCQUN2QztvQkFDRDt3QkFDRSxHQUFHLEVBQUUsaUNBQWlDO3FCQUN2QztpQkFDRjthQUNGLENBQUMsQ0FBQztRQUVMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRTtZQUNwQyxRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsWUFBWSxFQUFFLENBQUM7WUFFN0IsTUFBTSxHQUFHLEdBQUcsU0FBRyxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLEtBQUssRUFBRSxVQUFVO2dCQUNqQixZQUFZLEVBQUUsZ0JBQWdCO2dCQUM5QixpQkFBaUIsRUFBRSxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDO2dCQUNwRCxnQkFBZ0IsRUFBRSxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDO2FBQ2pELENBQUMsQ0FBQztZQUVILE9BQU87WUFDUCxJQUFJLDBCQUFvQixDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUU7Z0JBQzlDLEdBQUc7Z0JBQ0gsT0FBTyxFQUFFLElBQUksaUNBQTJCLENBQUMseURBQXlELEVBQUUsR0FBRyxDQUFDO2dCQUN4RyxPQUFPLEVBQUU7b0JBQ1AsYUFBYSxFQUFFLENBQUMsa0JBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztpQkFDMUQ7YUFDRixDQUFDLENBQUM7WUFFSCxPQUFPO1lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsdUJBQXVCLEVBQUU7Z0JBQ3ZFLFdBQVcsRUFBRSx5REFBeUQ7Z0JBQ3RFLFNBQVMsRUFBRSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUM7YUFDaEMsQ0FBQyxDQUFDO1FBRUwsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsNENBQTRDLEVBQUUsR0FBRyxFQUFFO1lBQ3RELFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxZQUFZLEVBQUUsQ0FBQztZQUU3QixNQUFNLEdBQUcsR0FBRyxTQUFHLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtnQkFDOUMsS0FBSyxFQUFFLFVBQVU7Z0JBQ2pCLFlBQVksRUFBRSxnQkFBZ0I7Z0JBQzlCLGlCQUFpQixFQUFFLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUM7Z0JBQ3BELGdCQUFnQixFQUFFLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUM7YUFDdkQsQ0FBQyxDQUFDO1lBRUgsT0FBTztZQUNQLE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUM7Z0JBQ2hDLGFBQWEsRUFBRSxDQUFDLGtCQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQzthQUNsRCxDQUFDLENBQUM7WUFFSCxPQUFPO1lBQ1AsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTlDLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLDRCQUE0QixFQUFFLEdBQUcsRUFBRTtZQUN0QyxRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsWUFBWSxFQUFFLENBQUM7WUFDN0IsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFHLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtnQkFDdkMsTUFBTSxFQUFFLENBQUM7Z0JBQ1QsbUJBQW1CLEVBQUU7b0JBQ25CLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsZ0JBQVUsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRTtvQkFDbEUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxnQkFBVSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFO29CQUNsRSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLGdCQUFVLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUU7aUJBQ2pFO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsT0FBTztZQUNQLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUNyQyxFQUFFLGFBQWEsRUFBRSxDQUFDLGtCQUFZLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FDakQsQ0FBQztZQUVGLE9BQU87WUFDUCxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQyxNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDaEYsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFFM0QsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsb0JBQW9CLEVBQUUsR0FBRyxFQUFFO1lBQzlCLFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxZQUFZLEVBQUUsQ0FBQztZQUM3QixNQUFNLEdBQUcsR0FBRyxJQUFJLFNBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFFbEMsT0FBTztZQUNOLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFZLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRTtnQkFDeEQsVUFBVSxFQUFFLGdCQUFVLENBQUMsZUFBZTtnQkFDdEMsUUFBUSxFQUFFLFlBQVk7YUFDdkIsQ0FBQyxDQUFDO1lBQ0YsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQVksQ0FBQyxRQUFRLENBQUMsY0FBYyxFQUFFO2dCQUN4RCxVQUFVLEVBQUUsZ0JBQVUsQ0FBQyxlQUFlO2dCQUN0QyxRQUFRLEVBQUUsb0JBQW9CO2FBQy9CLENBQUMsQ0FBQztZQUNGLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFZLENBQUMsUUFBUSxDQUFDLG1CQUFtQixFQUFFO2dCQUM3RCxVQUFVLEVBQUUsZ0JBQVUsQ0FBQyxhQUFhO2dCQUNwQyxRQUFRLEVBQUUsa0JBQWtCO2FBQzdCLENBQUMsQ0FBQztZQUNGLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFZLENBQUMsUUFBUSxDQUFDLGtCQUFrQixFQUFFO2dCQUM1RCxVQUFVLEVBQUUsZ0JBQVUsQ0FBQyxZQUFZO2dCQUNuQyxRQUFRLEVBQUUsaUJBQWlCO2FBQzVCLENBQUMsQ0FBQztZQUVILE9BQU87WUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxpQkFBaUIsRUFBRTtnQkFDakUsZ0JBQWdCLEVBQUUsWUFBWTthQUMvQixDQUFDLENBQUM7WUFDSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxpQkFBaUIsRUFBRTtnQkFDakUsY0FBYyxFQUFFLGtCQUFrQjthQUNuQyxDQUFDLENBQUM7WUFDSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxpQkFBaUIsRUFBRTtnQkFDakUsZ0JBQWdCLEVBQUUsb0JBQW9CO2FBQ3ZDLENBQUMsQ0FBQztZQUNILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGlCQUFpQixFQUFFO2dCQUNqRSxhQUFhLEVBQUUsaUJBQWlCO2FBQ2pDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsb0JBQW9CLEVBQUUsR0FBRyxFQUFFO1FBQ2xDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDUixDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDOUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsV0FBVyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDOUQsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsV0FBVyxFQUFFLENBQUMsRUFBRSxtQkFBbUIsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxnQkFBVSxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxnQkFBVSxDQUFDLG1CQUFtQixFQUFFLENBQUMsRUFBRTtnQkFDbk0sRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLG1CQUFtQixFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLGdCQUFVLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLGdCQUFVLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDdkwsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsV0FBVyxFQUFFLENBQUMsRUFBRSxtQkFBbUIsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxnQkFBVSxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxnQkFBVSxDQUFDLG1CQUFtQixFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFO2dCQUNuTixFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsbUJBQW1CLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsZ0JB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QUMxQixPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFFLEdBQUcsQ0FBQyxFQUFFO1FBQ2xDLE9BQU8sRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztJQUN4QyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCxTQUFTLE9BQU8sQ0FBQyxZQUFpRDtJQUNoRSxPQUFPO1FBQ0wsVUFBVSxFQUFFO1lBQ1YsSUFBSSxFQUFFLGtCQUFLLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQztTQUNwQztLQUNGLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQW5ub3RhdGlvbnMsIE1hdGNoLCBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0IHsgdGVzdERlcHJlY2F0ZWQgfSBmcm9tICdAYXdzLWNkay9jZGstYnVpbGQtdG9vbHMnO1xuaW1wb3J0IHsgQXBwLCBDZm5PdXRwdXQsIENmblJlc291cmNlLCBGbiwgTGF6eSwgU3RhY2ssIFRhZ3MgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7XG4gIEFjbENpZHIsXG4gIEFjbFRyYWZmaWMsXG4gIEJhc3Rpb25Ib3N0TGludXgsXG4gIENmblN1Ym5ldCxcbiAgQ2ZuVlBDLFxuICBTdWJuZXRGaWx0ZXIsXG4gIERlZmF1bHRJbnN0YW5jZVRlbmFuY3ksXG4gIEdlbmVyaWNMaW51eEltYWdlLFxuICBJbnN0YW5jZVR5cGUsXG4gIEludGVyZmFjZVZwY0VuZHBvaW50LFxuICBJbnRlcmZhY2VWcGNFbmRwb2ludFNlcnZpY2UsXG4gIE5hdFByb3ZpZGVyLFxuICBOYXRUcmFmZmljRGlyZWN0aW9uLFxuICBOZXR3b3JrQWNsLFxuICBOZXR3b3JrQWNsRW50cnksXG4gIFBlZXIsXG4gIFBvcnQsXG4gIFByaXZhdGVTdWJuZXQsXG4gIFB1YmxpY1N1Ym5ldCxcbiAgUm91dGVyVHlwZSxcbiAgU3VibmV0LFxuICBTdWJuZXRUeXBlLFxuICBUcmFmZmljRGlyZWN0aW9uLFxuICBWcGMsXG4gIElwQWRkcmVzc2VzLFxuICBJbnRlcmZhY2VWcGNFbmRwb2ludEF3c1NlcnZpY2UsXG59IGZyb20gJy4uL2xpYic7XG5cbmRlc2NyaWJlKCd2cGMnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdXaGVuIGNyZWF0aW5nIGEgVlBDJywgKCkgPT4ge1xuXG4gICAgdGVzdERlcHJlY2F0ZWQoJ1N1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX05BVCBpcyBlcXVpdmFsZW50IHRvIFN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX0VHUkVTUycsICgpID0+IHtcblxuICAgICAgY29uc3Qgc3RhY2sxID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBjb25zdCBzdGFjazIgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIG5ldyBWcGMoc3RhY2sxLCAnVGhlVlBDJywge1xuICAgICAgICBzdWJuZXRDb25maWd1cmF0aW9uOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfTkFULFxuICAgICAgICAgICAgbmFtZTogJ3N1Ym5ldCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBVQkxJQyxcbiAgICAgICAgICAgIG5hbWU6ICdwdWJsaWMnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgbmV3IFZwYyhzdGFjazIsICdUaGVWUEMnLCB7XG4gICAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9FR1JFU1MsXG4gICAgICAgICAgICBuYW1lOiAnc3VibmV0JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgICAgICAgbmFtZTogJ3B1YmxpYycsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCB0MSA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjazEpO1xuICAgICAgY29uc3QgdDIgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2syKTtcblxuICAgICAgZXhwZWN0KHQxLnRvSlNPTigpKS50b0VxdWFsKHQyLnRvSlNPTigpKTtcblxuICAgIH0pO1xuXG4gICAgdGVzdERlcHJlY2F0ZWQoJ1N1Ym5ldFR5cGUuUFJJVkFURSBpcyBlcXVpdmFsZW50IHRvIFN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX05BVCcsICgpID0+IHtcblxuICAgICAgY29uc3Qgc3RhY2sxID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBjb25zdCBzdGFjazIgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIG5ldyBWcGMoc3RhY2sxLCAnVGhlVlBDJywge1xuICAgICAgICBzdWJuZXRDb25maWd1cmF0aW9uOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFLFxuICAgICAgICAgICAgbmFtZTogJ3N1Ym5ldCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBVQkxJQyxcbiAgICAgICAgICAgIG5hbWU6ICdwdWJsaWMnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgbmV3IFZwYyhzdGFjazIsICdUaGVWUEMnLCB7XG4gICAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9OQVQsXG4gICAgICAgICAgICBuYW1lOiAnc3VibmV0JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgICAgICAgbmFtZTogJ3B1YmxpYycsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCB0MSA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjazEpO1xuICAgICAgY29uc3QgdDIgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2syKTtcblxuICAgICAgZXhwZWN0KHQxLnRvSlNPTigpKS50b0VxdWFsKHQyLnRvSlNPTigpKTtcblxuICAgIH0pO1xuXG4gICAgdGVzdERlcHJlY2F0ZWQoJ1N1Ym5ldFR5cGUuSVNPTEFURUQgaXMgZXF1aXZhbGVudCB0byBTdWJuZXRUeXBlLlBSSVZBVEVfSVNPTEFURUQnLCAoKSA9PiB7XG5cbiAgICAgIGNvbnN0IHN0YWNrMSA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgY29uc3Qgc3RhY2syID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBuZXcgVnBjKHN0YWNrMSwgJ1RoZVZQQycsIHtcbiAgICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuSVNPTEFURUQsXG4gICAgICAgICAgICBuYW1lOiAnc3VibmV0JyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIG5ldyBWcGMoc3RhY2syLCAnVGhlVlBDJywge1xuICAgICAgICBzdWJuZXRDb25maWd1cmF0aW9uOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFX0lTT0xBVEVELFxuICAgICAgICAgICAgbmFtZTogJ3N1Ym5ldCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgdDEgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2sxKTtcbiAgICAgIGNvbnN0IHQyID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrMik7XG5cbiAgICAgIGV4cGVjdCh0MS50b0pTT04oKSkudG9FcXVhbCh0Mi50b0pTT04oKSk7XG5cbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCd3aXRoIHRoZSBkZWZhdWx0IENJRFIgcmFuZ2UnLCAoKSA9PiB7XG5cbiAgICAgIHRlc3QoJ3ZwYy52cGNJZCByZXR1cm5zIGEgdG9rZW4gdG8gdGhlIFZQQyBJRCcsICgpID0+IHtcbiAgICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1RoZVZQQycpO1xuICAgICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZSh2cGMudnBjSWQpKS50b0VxdWFsKHsgUmVmOiAnVGhlVlBDOTI2MzZBQjAnIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ3ZwYy52cGNBcm4gcmV0dXJucyBhIHRva2VuIHRvIHRoZSBWUEMgSUQnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdUaGVWUEMnKTtcbiAgICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUodnBjLnZwY0FybikpLnRvRXF1YWwoeyAnRm46OkpvaW4nOiBbJycsIFsnYXJuOicsIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sICc6ZWMyOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6dnBjLycsIHsgUmVmOiAnVGhlVlBDOTI2MzZBQjAnIH1dXSB9KTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCdpdCB1c2VzIHRoZSBjb3JyZWN0IG5ldHdvcmsgcmFuZ2UnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICAgIG5ldyBWcGMoc3RhY2ssICdUaGVWUEMnKTtcbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpWUEMnLCB7XG4gICAgICAgICAgQ2lkckJsb2NrOiBWcGMuREVGQVVMVF9DSURSX1JBTkdFLFxuICAgICAgICAgIEVuYWJsZURuc0hvc3RuYW1lczogdHJ1ZSxcbiAgICAgICAgICBFbmFibGVEbnNTdXBwb3J0OiB0cnVlLFxuICAgICAgICAgIEluc3RhbmNlVGVuYW5jeTogRGVmYXVsdEluc3RhbmNlVGVuYW5jeS5ERUZBVUxULFxuICAgICAgICB9KTtcblxuICAgICAgfSk7XG4gICAgICB0ZXN0KCd0aGUgTmFtZSB0YWcgaXMgZGVmYXVsdGVkIHRvIHBhdGgnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICAgIG5ldyBWcGMoc3RhY2ssICdUaGVWUEMnKTtcbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpFQzI6OlZQQycsXG4gICAgICAgICAgaGFzVGFncyhbeyBLZXk6ICdOYW1lJywgVmFsdWU6ICdUZXN0U3RhY2svVGhlVlBDJyB9XSksXG4gICAgICAgICk7XG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6RUMyOjpJbnRlcm5ldEdhdGV3YXknLFxuICAgICAgICAgIGhhc1RhZ3MoW3sgS2V5OiAnTmFtZScsIFZhbHVlOiAnVGVzdFN0YWNrL1RoZVZQQycgfV0pLFxuICAgICAgICApO1xuICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3dpdGggYWxsIG9mIHRoZSBwcm9wZXJ0aWVzIHNldCwgaXQgc3VjY2Vzc2Z1bGx5IHNldHMgdGhlIGNvcnJlY3QgVlBDIHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgbmV3IFZwYyhzdGFjaywgJ1RoZVZQQycsIHtcbiAgICAgICAgaXBBZGRyZXNzZXM6IElwQWRkcmVzc2VzLmNpZHIoJzE5Mi4xNjguMC4wLzE2JyksXG4gICAgICAgIGVuYWJsZURuc0hvc3RuYW1lczogZmFsc2UsXG4gICAgICAgIGVuYWJsZURuc1N1cHBvcnQ6IGZhbHNlLFxuICAgICAgICBkZWZhdWx0SW5zdGFuY2VUZW5hbmN5OiBEZWZhdWx0SW5zdGFuY2VUZW5hbmN5LkRFRElDQVRFRCxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlZQQycsIHtcbiAgICAgICAgQ2lkckJsb2NrOiAnMTkyLjE2OC4wLjAvMTYnLFxuICAgICAgICBFbmFibGVEbnNIb3N0bmFtZXM6IGZhbHNlLFxuICAgICAgICBFbmFibGVEbnNTdXBwb3J0OiBmYWxzZSxcbiAgICAgICAgSW5zdGFuY2VUZW5hbmN5OiBEZWZhdWx0SW5zdGFuY2VUZW5hbmN5LkRFRElDQVRFRCxcbiAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZG5zIGdldHRlcnMgY29ycmVzcG9uZCB0byBDRk4gcHJvcGVydGllcycsICgpID0+IHtcblxuXG4gICAgICBjb25zdCBpbnB1dHMgPSBbXG4gICAgICAgIHsgZG5zU3VwcG9ydDogZmFsc2UsIGRuc0hvc3RuYW1lczogZmFsc2UgfSxcbiAgICAgICAgLy8ge2Ruc1N1cHBvcnQ6IGZhbHNlLCBkbnNIb3N0bmFtZXM6IHRydWV9IC0gdGhpcyBjb25maWd1cmF0aW9uIGlzIGlsbGVnYWwgc28gaXRzIG5vdCBwYXJ0IG9mIHRoZSBwZXJtdXRhdGlvbnMuXG4gICAgICAgIHsgZG5zU3VwcG9ydDogdHJ1ZSwgZG5zSG9zdG5hbWVzOiBmYWxzZSB9LFxuICAgICAgICB7IGRuc1N1cHBvcnQ6IHRydWUsIGRuc0hvc3RuYW1lczogdHJ1ZSB9LFxuICAgICAgXTtcblxuICAgICAgZm9yIChjb25zdCBpbnB1dCBvZiBpbnB1dHMpIHtcblxuICAgICAgICB0ZXN0KGBbZG5zU3VwcG9ydD0ke2lucHV0LmRuc1N1cHBvcnR9LGRuc0hvc3RuYW1lcz0ke2lucHV0LmRuc0hvc3RuYW1lc31dYCwgKCkgPT4ge1xuXG4gICAgICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVGhlVlBDJywge1xuICAgICAgICAgICAgaXBBZGRyZXNzZXM6IElwQWRkcmVzc2VzLmNpZHIoJzE5Mi4xNjguMC4wLzE2JyksXG4gICAgICAgICAgICBlbmFibGVEbnNIb3N0bmFtZXM6IGlucHV0LmRuc0hvc3RuYW1lcyxcbiAgICAgICAgICAgIGVuYWJsZURuc1N1cHBvcnQ6IGlucHV0LmRuc1N1cHBvcnQsXG4gICAgICAgICAgICBkZWZhdWx0SW5zdGFuY2VUZW5hbmN5OiBEZWZhdWx0SW5zdGFuY2VUZW5hbmN5LkRFRElDQVRFRCxcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6VlBDJywge1xuICAgICAgICAgICAgQ2lkckJsb2NrOiAnMTkyLjE2OC4wLjAvMTYnLFxuICAgICAgICAgICAgRW5hYmxlRG5zSG9zdG5hbWVzOiBpbnB1dC5kbnNIb3N0bmFtZXMsXG4gICAgICAgICAgICBFbmFibGVEbnNTdXBwb3J0OiBpbnB1dC5kbnNTdXBwb3J0LFxuICAgICAgICAgICAgSW5zdGFuY2VUZW5hbmN5OiBEZWZhdWx0SW5zdGFuY2VUZW5hbmN5LkRFRElDQVRFRCxcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGV4cGVjdChpbnB1dC5kbnNTdXBwb3J0KS50b0VxdWFsKHZwYy5kbnNTdXBwb3J0RW5hYmxlZCk7XG4gICAgICAgICAgZXhwZWN0KGlucHV0LmRuc0hvc3RuYW1lcykudG9FcXVhbCh2cGMuZG5zSG9zdG5hbWVzRW5hYmxlZCk7XG5cblxuICAgICAgICB9KTtcbiAgICAgIH1cblxuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjb250YWlucyB0aGUgY29ycmVjdCBudW1iZXIgb2Ygc3VibmV0cycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVGhlVlBDJyk7XG4gICAgICBjb25zdCB6b25lcyA9IHN0YWNrLmF2YWlsYWJpbGl0eVpvbmVzLmxlbmd0aDtcbiAgICAgIGV4cGVjdCh2cGMucHVibGljU3VibmV0cy5sZW5ndGgpLnRvRXF1YWwoem9uZXMpO1xuICAgICAgZXhwZWN0KHZwYy5wcml2YXRlU3VibmV0cy5sZW5ndGgpLnRvRXF1YWwoem9uZXMpO1xuICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUodnBjLnZwY0lkKSkudG9FcXVhbCh7IFJlZjogJ1RoZVZQQzkyNjM2QUIwJyB9KTtcblxuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIHJlZmVyIHRvIHRoZSBpbnRlcm5ldCBnYXRld2F5JywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdUaGVWUEMnKTtcbiAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHZwYy5pbnRlcm5ldEdhdGV3YXlJZCkpLnRvRXF1YWwoeyBSZWY6ICdUaGVWUENJR1dGQTI1Q0MwOCcgfSk7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3dpdGggb25seSBpc29sYXRlZCBzdWJuZXRzLCB0aGUgVlBDIHNob3VsZCBub3QgY29udGFpbiBhbiBJR1cgb3IgTkFUIEdhdGV3YXlzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIG5ldyBWcGMoc3RhY2ssICdUaGVWUEMnLCB7XG4gICAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfSVNPTEFURUQsXG4gICAgICAgICAgICBuYW1lOiAnSXNvbGF0ZWQnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkVDMjo6SW50ZXJuZXRHYXRld2F5JywgMCk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6Ok5hdEdhdGV3YXknLCAwKTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U3VibmV0Jywge1xuICAgICAgICBNYXBQdWJsaWNJcE9uTGF1bmNoOiBmYWxzZSxcbiAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCd3aXRoIG5vIHByaXZhdGUgc3VibmV0cywgdGhlIFZQQyBzaG91bGQgaGF2ZSBhbiBJR1cgYnV0IG5vIE5BVCBHYXRld2F5cycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBuZXcgVnBjKHN0YWNrLCAnVGhlVlBDJywge1xuICAgICAgICBzdWJuZXRDb25maWd1cmF0aW9uOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QVUJMSUMsXG4gICAgICAgICAgICBuYW1lOiAnUHVibGljJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFJJVkFURV9JU09MQVRFRCxcbiAgICAgICAgICAgIG5hbWU6ICdJc29sYXRlZCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUMyOjpJbnRlcm5ldEdhdGV3YXknLCAxKTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkVDMjo6TmF0R2F0ZXdheScsIDApO1xuXG4gICAgfSk7XG4gICAgdGVzdCgnd2l0aCBwcml2YXRlIHN1Ym5ldHMgYW5kIGN1c3RvbSBuZXR3b3JrQWNsLicsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVGhlVlBDJywge1xuICAgICAgICBzdWJuZXRDb25maWd1cmF0aW9uOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QVUJMSUMsXG4gICAgICAgICAgICBuYW1lOiAnUHVibGljJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX0VHUkVTUyxcbiAgICAgICAgICAgIG5hbWU6ICdwcml2YXRlJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IG5hY2wxID0gbmV3IE5ldHdvcmtBY2woc3RhY2ssICdteU5BQ0wxJywge1xuICAgICAgICB2cGMsXG4gICAgICAgIHN1Ym5ldFNlbGVjdGlvbjogeyBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9FR1JFU1MgfSxcbiAgICAgIH0pO1xuXG4gICAgICBuZXcgTmV0d29ya0FjbEVudHJ5KHN0YWNrLCAnQWxsb3dETlNFZ3Jlc3MnLCB7XG4gICAgICAgIG5ldHdvcmtBY2w6IG5hY2wxLFxuICAgICAgICBydWxlTnVtYmVyOiAxMDAsXG4gICAgICAgIHRyYWZmaWM6IEFjbFRyYWZmaWMudWRwUG9ydCg1MyksXG4gICAgICAgIGRpcmVjdGlvbjogVHJhZmZpY0RpcmVjdGlvbi5FR1JFU1MsXG4gICAgICAgIGNpZHI6IEFjbENpZHIuaXB2NCgnMTAuMC4wLjAvMTYnKSxcbiAgICAgIH0pO1xuXG4gICAgICBuZXcgTmV0d29ya0FjbEVudHJ5KHN0YWNrLCAnQWxsb3dETlNJbmdyZXNzJywge1xuICAgICAgICBuZXR3b3JrQWNsOiBuYWNsMSxcbiAgICAgICAgcnVsZU51bWJlcjogMTAwLFxuICAgICAgICB0cmFmZmljOiBBY2xUcmFmZmljLnVkcFBvcnQoNTMpLFxuICAgICAgICBkaXJlY3Rpb246IFRyYWZmaWNEaXJlY3Rpb24uSU5HUkVTUyxcbiAgICAgICAgY2lkcjogQWNsQ2lkci5hbnlJcHY0KCksXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUMyOjpOZXR3b3JrQWNsJywgMSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6Ok5ldHdvcmtBY2xFbnRyeScsIDIpO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUMyOjpTdWJuZXROZXR3b3JrQWNsQXNzb2NpYXRpb24nLCAzKTtcblxuICAgIH0pO1xuXG4gICAgdGVzdCgnd2l0aCBubyBzdWJuZXRzIGRlZmluZWQsIHRoZSBWUEMgc2hvdWxkIGhhdmUgYW4gSUdXLCBhbmQgYSBOQVQgR2F0ZXdheSBwZXIgQVonLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgY29uc3Qgem9uZXMgPSBzdGFjay5hdmFpbGFiaWxpdHlab25lcy5sZW5ndGg7XG4gICAgICBuZXcgVnBjKHN0YWNrLCAnVGhlVlBDJywge30pO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUMyOjpJbnRlcm5ldEdhdGV3YXknLCAxKTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkVDMjo6TmF0R2F0ZXdheScsIHpvbmVzKTtcblxuICAgIH0pO1xuXG4gICAgdGVzdCgnd2l0aCBpc29sYXRlZCBhbmQgcHVibGljIHN1Ym5ldCwgc2hvdWxkIGJlIGFibGUgdG8gdXNlIHRoZSBpbnRlcm5ldCBnYXRld2F5IHRvIGRlZmluZSByb3V0ZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1RoZVZQQycsIHtcbiAgICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFJJVkFURV9JU09MQVRFRCxcbiAgICAgICAgICAgIG5hbWU6ICdpc29sYXRlZCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBVQkxJQyxcbiAgICAgICAgICAgIG5hbWU6ICdwdWJsaWMnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICAgICh2cGMuaXNvbGF0ZWRTdWJuZXRzWzBdIGFzIFN1Ym5ldCkuYWRkUm91dGUoJ1RoZVJvdXRlJywge1xuICAgICAgICByb3V0ZXJJZDogdnBjLmludGVybmV0R2F0ZXdheUlkISxcbiAgICAgICAgcm91dGVyVHlwZTogUm91dGVyVHlwZS5HQVRFV0FZLFxuICAgICAgICBkZXN0aW5hdGlvbkNpZHJCbG9jazogJzguOC44LjgvMzInLFxuICAgICAgfSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6OkludGVybmV0R2F0ZXdheScsIDEpO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpSb3V0ZScsIHtcbiAgICAgICAgRGVzdGluYXRpb25DaWRyQmxvY2s6ICc4LjguOC44LzMyJyxcbiAgICAgICAgR2F0ZXdheUlkOiB7fSxcbiAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCd3aXRoIHN1Ym5ldHMgYW5kIHJlc2VydmVkIHN1Ym5ldHMgZGVmaW5lZCwgVlBDIHN1Ym5ldCBjb3VudCBzaG91bGQgbm90IGNvbnRhaW4gcmVzZXJ2ZWQgc3VibmV0cyAnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgbmV3IFZwYyhzdGFjaywgJ1RoZVZQQycsIHtcbiAgICAgICAgaXBBZGRyZXNzZXM6IElwQWRkcmVzc2VzLmNpZHIoJzEwLjAuMC4wLzE2JyksXG4gICAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjaWRyTWFzazogMjQsXG4gICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBVQkxJQyxcbiAgICAgICAgICAgIG5hbWU6ICdQdWJsaWMnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2lkck1hc2s6IDI0LFxuICAgICAgICAgICAgbmFtZTogJ3Jlc2VydmVkJyxcbiAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX0VHUkVTUyxcbiAgICAgICAgICAgIHJlc2VydmVkOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2lkck1hc2s6IDI4LFxuICAgICAgICAgICAgbmFtZTogJ3JkcycsXG4gICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfSVNPTEFURUQsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgbWF4QXpzOiAzLFxuICAgICAgfSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6OlN1Ym5ldCcsIDYpO1xuXG4gICAgfSk7XG4gICAgdGVzdCgnd2l0aCByZXNlcnZlZCBzdWJuZXRzLCBhbnkgb3RoZXIgc3VibmV0cyBzaG91bGQgbm90IGhhdmUgY2lkckJsb2NrIGZyb20gd2l0aGluIHJlc2VydmVkIHNwYWNlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIG5ldyBWcGMoc3RhY2ssICdUaGVWUEMnLCB7XG4gICAgICAgIGlwQWRkcmVzc2VzOiBJcEFkZHJlc3Nlcy5jaWRyKCcxMC4wLjAuMC8xNicpLFxuICAgICAgICBzdWJuZXRDb25maWd1cmF0aW9uOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2lkck1hc2s6IDI0LFxuICAgICAgICAgICAgbmFtZTogJ2luZ3Jlc3MnLFxuICAgICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QVUJMSUMsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjaWRyTWFzazogMjQsXG4gICAgICAgICAgICBuYW1lOiAncmVzZXJ2ZWQnLFxuICAgICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfRUdSRVNTLFxuICAgICAgICAgICAgcmVzZXJ2ZWQ6IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjaWRyTWFzazogMjQsXG4gICAgICAgICAgICBuYW1lOiAncmRzJyxcbiAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX0VHUkVTUyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBtYXhBenM6IDMsXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgdGVtcGxhdGUgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICB0ZW1wbGF0ZS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTdWJuZXQnLCB7XG4gICAgICAgICAgQ2lkckJsb2NrOiBgMTAuMC4ke2l9LjAvMjRgLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGkgPSAzOyBpIDwgNjsgaSsrKSB7XG4gICAgICAgIGNvbnN0IG1hdGNoaW5nU3VibmV0cyA9IHRlbXBsYXRlLmZpbmRSZXNvdXJjZXMoJ0FXUzo6RUMyOjpTdWJuZXQnLCB7XG4gICAgICAgICAgQ2lkckJsb2NrOiBgMTAuMC4ke2l9LjAvMjRgLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KE9iamVjdC5rZXlzKG1hdGNoaW5nU3VibmV0cykubGVuZ3RoKS50b0JlKDApO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgaSA9IDY7IGkgPCA5OyBpKyspIHtcbiAgICAgICAgdGVtcGxhdGUuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U3VibmV0Jywge1xuICAgICAgICAgIENpZHJCbG9jazogYDEwLjAuJHtpfS4wLzI0YCxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICB9KTtcbiAgICB0ZXN0KCd3aXRoIGN1c3RvbSBzdWJuZXRzLCB0aGUgVlBDIHNob3VsZCBoYXZlIHRoZSByaWdodCBudW1iZXIgb2Ygc3VibmV0cywgYW4gSUdXLCBhbmQgYSBOQVQgR2F0ZXdheSBwZXIgQVonLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgY29uc3Qgem9uZXMgPSBzdGFjay5hdmFpbGFiaWxpdHlab25lcy5sZW5ndGg7XG4gICAgICBuZXcgVnBjKHN0YWNrLCAnVGhlVlBDJywge1xuICAgICAgICBpcEFkZHJlc3NlczogSXBBZGRyZXNzZXMuY2lkcignMTAuMC4wLjAvMjEnKSxcbiAgICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNpZHJNYXNrOiAyNCxcbiAgICAgICAgICAgIG5hbWU6ICdpbmdyZXNzJyxcbiAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2lkck1hc2s6IDI0LFxuICAgICAgICAgICAgbmFtZTogJ2FwcGxpY2F0aW9uJyxcbiAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX0VHUkVTUyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNpZHJNYXNrOiAyOCxcbiAgICAgICAgICAgIG5hbWU6ICdyZHMnLFxuICAgICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFX0lTT0xBVEVELFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIG1heEF6czogMyxcbiAgICAgIH0pO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUMyOjpJbnRlcm5ldEdhdGV3YXknLCAxKTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkVDMjo6TmF0R2F0ZXdheScsIHpvbmVzKTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkVDMjo6U3VibmV0JywgOSk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDY7IGkrKykge1xuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlN1Ym5ldCcsIHtcbiAgICAgICAgICBDaWRyQmxvY2s6IGAxMC4wLiR7aX0uMC8yNGAsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTdWJuZXQnLCB7XG4gICAgICAgICAgQ2lkckJsb2NrOiBgMTAuMC42LiR7aSAqIDE2fS8yOGAsXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgfSk7XG4gICAgdGVzdCgnd2l0aCBjdXN0b20gc3VibmV0cyBhbmQgbmF0R2F0ZXdheXMgPSAyIHRoZXJlIHNob3VsZCBiZSBvbmx5IHR3byBOQVRHVycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBuZXcgVnBjKHN0YWNrLCAnVGhlVlBDJywge1xuICAgICAgICBpcEFkZHJlc3NlczogSXBBZGRyZXNzZXMuY2lkcignMTAuMC4wLjAvMjEnKSxcbiAgICAgICAgbmF0R2F0ZXdheXM6IDIsXG4gICAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjaWRyTWFzazogMjQsXG4gICAgICAgICAgICBuYW1lOiAnaW5ncmVzcycsXG4gICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBVQkxJQyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNpZHJNYXNrOiAyNCxcbiAgICAgICAgICAgIG5hbWU6ICdhcHBsaWNhdGlvbicsXG4gICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9FR1JFU1MsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjaWRyTWFzazogMjgsXG4gICAgICAgICAgICBuYW1lOiAncmRzJyxcbiAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFJJVkFURV9JU09MQVRFRCxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBtYXhBenM6IDMsXG4gICAgICB9KTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkVDMjo6SW50ZXJuZXRHYXRld2F5JywgMSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6Ok5hdEdhdGV3YXknLCAyKTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkVDMjo6U3VibmV0JywgOSk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDY7IGkrKykge1xuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlN1Ym5ldCcsIHtcbiAgICAgICAgICBDaWRyQmxvY2s6IGAxMC4wLiR7aX0uMC8yNGAsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTdWJuZXQnLCB7XG4gICAgICAgICAgQ2lkckJsb2NrOiBgMTAuMC42LiR7aSAqIDE2fS8yOGAsXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgfSk7XG4gICAgdGVzdCgnd2l0aCBlbmFibGVEbnNIb3N0bmFtZXMgZW5hYmxlZCBidXQgZW5hYmxlRG5zU3VwcG9ydCBkaXNhYmxlZCwgc2hvdWxkIHRocm93IGFuIEVycm9yJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIGV4cGVjdCgoKSA9PiBuZXcgVnBjKHN0YWNrLCAnVGhlVlBDJywge1xuICAgICAgICBlbmFibGVEbnNIb3N0bmFtZXM6IHRydWUsXG4gICAgICAgIGVuYWJsZURuc1N1cHBvcnQ6IGZhbHNlLFxuICAgICAgfSkpLnRvVGhyb3coKTtcblxuICAgIH0pO1xuICAgIHRlc3QoJ3dpdGggcHVibGljIHN1Ym5ldHMgTWFwUHVibGljSXBPbkxhdW5jaCBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIG5ldyBWcGMoc3RhY2ssICdWUEMnLCB7XG4gICAgICAgIG1heEF6czogMSxcbiAgICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNpZHJNYXNrOiAyNCxcbiAgICAgICAgICAgIG5hbWU6ICdpbmdyZXNzJyxcbiAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkVDMjo6U3VibmV0JywgMSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6Ok5hdEdhdGV3YXknLCAwKTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U3VibmV0Jywge1xuICAgICAgICBNYXBQdWJsaWNJcE9uTGF1bmNoOiB0cnVlLFxuICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3dpdGggcHVibGljIHN1Ym5ldHMgTWFwUHVibGljSXBPbkxhdW5jaCBpcyB0cnVlIGlmIHBhcmFtZXRlciBtYXBQdWJsaWNJcE9uTGF1bmNoIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgbmV3IFZwYyhzdGFjaywgJ1ZQQycsIHtcbiAgICAgICAgbWF4QXpzOiAxLFxuICAgICAgICBzdWJuZXRDb25maWd1cmF0aW9uOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2lkck1hc2s6IDI0LFxuICAgICAgICAgICAgbmFtZTogJ2luZ3Jlc3MnLFxuICAgICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QVUJMSUMsXG4gICAgICAgICAgICBtYXBQdWJsaWNJcE9uTGF1bmNoOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkVDMjo6U3VibmV0JywgMSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6Ok5hdEdhdGV3YXknLCAwKTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U3VibmV0Jywge1xuICAgICAgICBNYXBQdWJsaWNJcE9uTGF1bmNoOiB0cnVlLFxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgdGVzdCgnd2l0aCBwdWJsaWMgc3VibmV0cyBNYXBQdWJsaWNJcE9uTGF1bmNoIGlzIGZhbHNlIGlmIHBhcmFtZXRlciBtYXBQdWJsaWNJcE9uTGF1bmNoIGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIG5ldyBWcGMoc3RhY2ssICdWUEMnLCB7XG4gICAgICAgIG1heEF6czogMSxcbiAgICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNpZHJNYXNrOiAyNCxcbiAgICAgICAgICAgIG5hbWU6ICdpbmdyZXNzJyxcbiAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgICAgICAgbWFwUHVibGljSXBPbkxhdW5jaDogZmFsc2UsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUMyOjpTdWJuZXQnLCAxKTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkVDMjo6TmF0R2F0ZXdheScsIDApO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTdWJuZXQnLCB7XG4gICAgICAgIE1hcFB1YmxpY0lwT25MYXVuY2g6IGZhbHNlLFxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgdGVzdCgnd2l0aCBwcml2YXRlIHN1Ym5ldHMgdGhyb3cgZXhjZXB0aW9uIGlmIHBhcmFtZXRlciBtYXBQdWJsaWNJcE9uTGF1bmNoIGlzIGRlZmluZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IFZwYyhzdGFjaywgJ1ZQQycsIHtcbiAgICAgICAgICBtYXhBenM6IDEsXG4gICAgICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiAncHVibGljJyxcbiAgICAgICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QVUJMSUMsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiAncHJpdmF0ZScsXG4gICAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX0VHUkVTUyxcbiAgICAgICAgICAgICAgbWFwUHVibGljSXBPbkxhdW5jaDogdHJ1ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9zdWJuZXQgY2Fubm90IGluY2x1ZGUgbWFwUHVibGljSXBPbkxhdW5jaCBwYXJhbWV0ZXIvKTtcbiAgICB9KTtcbiAgICB0ZXN0KCd3aXRoIGlzb2xhdGVkIHN1Ym5ldHMgdGhyb3cgZXhjZXB0aW9uIGlmIHBhcmFtZXRlciBtYXBQdWJsaWNJcE9uTGF1bmNoIGlzIGRlZmluZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IFZwYyhzdGFjaywgJ1ZQQycsIHtcbiAgICAgICAgICBtYXhBenM6IDEsXG4gICAgICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiAncHVibGljJyxcbiAgICAgICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QVUJMSUMsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiAncHJpdmF0ZScsXG4gICAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFJJVkFURV9JU09MQVRFRCxcbiAgICAgICAgICAgICAgbWFwUHVibGljSXBPbkxhdW5jaDogdHJ1ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9zdWJuZXQgY2Fubm90IGluY2x1ZGUgbWFwUHVibGljSXBPbkxhdW5jaCBwYXJhbWV0ZXIvKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3ZlcmlmeSB0aGUgRGVmYXVsdCBWUEMgbmFtZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBjb25zdCB0YWdOYW1lID0geyBLZXk6ICdOYW1lJywgVmFsdWU6IGAke3N0YWNrLm5vZGUucGF0aH0vVlBDYCB9O1xuICAgICAgbmV3IFZwYyhzdGFjaywgJ1ZQQycsIHtcbiAgICAgICAgbWF4QXpzOiAxLFxuICAgICAgICBzdWJuZXRDb25maWd1cmF0aW9uOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ3B1YmxpYycsXG4gICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBVQkxJQyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdwcml2YXRlJyxcbiAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX0VHUkVTUyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6OlN1Ym5ldCcsIDIpO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpFQzI6Ok5hdEdhdGV3YXknLCBNYXRjaC5hbnlWYWx1ZSgpKTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U3VibmV0Jywge1xuICAgICAgICBNYXBQdWJsaWNJcE9uTGF1bmNoOiB0cnVlLFxuICAgICAgfSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkVDMjo6VlBDJywgaGFzVGFncyhbdGFnTmFtZV0pKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3ZlcmlmeSB0aGUgYXNzaWduZWQgVlBDIG5hbWUgcGFzc2luZyB0aGUgXCJ2cGNOYW1lXCIgcHJvcCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBjb25zdCB0YWdOYW1lID0geyBLZXk6ICdOYW1lJywgVmFsdWU6ICdDdXN0b21WUENOYW1lJyB9O1xuICAgICAgbmV3IFZwYyhzdGFjaywgJ1ZQQycsIHtcbiAgICAgICAgbWF4QXpzOiAxLFxuICAgICAgICBzdWJuZXRDb25maWd1cmF0aW9uOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ3B1YmxpYycsXG4gICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBVQkxJQyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdwcml2YXRlJyxcbiAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX0VHUkVTUyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICB2cGNOYW1lOiAnQ3VzdG9tVlBDTmFtZScsXG4gICAgICB9KTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkVDMjo6U3VibmV0JywgMik7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6Ok5hdEdhdGV3YXknLCBNYXRjaC5hbnlWYWx1ZSgpKTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U3VibmV0Jywge1xuICAgICAgICBNYXBQdWJsaWNJcE9uTGF1bmNoOiB0cnVlLFxuICAgICAgfSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkVDMjo6VlBDJywgaGFzVGFncyhbdGFnTmFtZV0pKTtcbiAgICB9KTtcbiAgICB0ZXN0KCdtYXhBWnMgZGVmYXVsdHMgdG8gMyBpZiB1bnNldCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBuZXcgVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6OlN1Ym5ldCcsIDYpO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUMyOjpSb3V0ZScsIDYpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA2OyBpKyspIHtcbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTdWJuZXQnLCB7XG4gICAgICAgICAgQ2lkckJsb2NrOiBgMTAuMC4ke2kgKiAzMn0uMC8xOWAsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpSb3V0ZScsIHtcbiAgICAgICAgRGVzdGluYXRpb25DaWRyQmxvY2s6ICcwLjAuMC4wLzAnLFxuICAgICAgICBOYXRHYXRld2F5SWQ6IHt9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd3aXRoIG1heEFacyBzZXQgdG8gMicsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBuZXcgVnBjKHN0YWNrLCAnVlBDJywgeyBtYXhBenM6IDIgfSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6OlN1Ym5ldCcsIDQpO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUMyOjpSb3V0ZScsIDQpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTdWJuZXQnLCB7XG4gICAgICAgICAgQ2lkckJsb2NrOiBgMTAuMC4ke2kgKiA2NH0uMC8xOGAsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpSb3V0ZScsIHtcbiAgICAgICAgRGVzdGluYXRpb25DaWRyQmxvY2s6ICcwLjAuMC4wLzAnLFxuICAgICAgICBOYXRHYXRld2F5SWQ6IHt9LFxuICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rocm93cyBlcnJvciB3aGVuIGJvdGggYXZhaWxhYmlsaXR5Wm9uZXMgYW5kIG1heEF6cyBhcmUgc2V0JywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIG5ldyBWcGMoc3RhY2ssICdWUEMnLCB7XG4gICAgICAgICAgYXZhaWxhYmlsaXR5Wm9uZXM6IHN0YWNrLmF2YWlsYWJpbGl0eVpvbmVzLFxuICAgICAgICAgIG1heEF6czogMSxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9WcGMgc3VwcG9ydHMgJ2F2YWlsYWJpbGl0eVpvbmVzJyBvciAnbWF4QXpzJywgYnV0IG5vdCBib3RoLi8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnd2l0aCBhdmFpbGFiaWxpdHlab25lcyBzZXQgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIGNvbnN0IHNwZWNpZmljQXogPSBzdGFjay5hdmFpbGFiaWxpdHlab25lc1sxXTsgLy8gbm90IHRoZSBmaXJzdCBpdGVtXG4gICAgICBuZXcgVnBjKHN0YWNrLCAnVlBDJywge1xuICAgICAgICBhdmFpbGFiaWxpdHlab25lczogW3NwZWNpZmljQXpdLFxuICAgICAgfSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6OlN1Ym5ldCcsIDIpO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTdWJuZXQnLCB7XG4gICAgICAgIEF2YWlsYWJpbGl0eVpvbmU6IHNwZWNpZmljQXosXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3dpdGggYXZhaWxhYmlsaXR5Wm9uZXMgc2V0IHRvIHpvbmVzIGRpZmZlcmVudCBmcm9tIHN0YWNrJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIG5ldyBWcGMoc3RhY2ssICdWUEMnLCB7XG4gICAgICAgICAgYXZhaWxhYmlsaXR5Wm9uZXM6IFtzdGFjay5hdmFpbGFiaWxpdHlab25lc1swXSArICdpbnZhbGlkJ10sXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvdygvbXVzdCBiZSBhIHN1YnNldCBvZiB0aGUgc3RhY2svKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3dpdGggbmF0R2F0ZXdheSBzZXQgdG8gMScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBuZXcgVnBjKHN0YWNrLCAnVlBDJywge1xuICAgICAgICBuYXRHYXRld2F5czogMSxcbiAgICAgIH0pO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUMyOjpTdWJuZXQnLCA2KTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkVDMjo6Um91dGUnLCA2KTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkVDMjo6TmF0R2F0ZXdheScsIDEpO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpSb3V0ZScsIHtcbiAgICAgICAgRGVzdGluYXRpb25DaWRyQmxvY2s6ICcwLjAuMC4wLzAnLFxuICAgICAgICBOYXRHYXRld2F5SWQ6IHt9LFxuICAgICAgfSk7XG5cbiAgICB9KTtcbiAgICB0ZXN0KCd3aXRoIG5hdEdhdGV3YXkgc3VibmV0cyBkZWZpbmVkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIG5ldyBWcGMoc3RhY2ssICdWUEMnLCB7XG4gICAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjaWRyTWFzazogMjQsXG4gICAgICAgICAgICBuYW1lOiAnaW5ncmVzcycsXG4gICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBVQkxJQyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNpZHJNYXNrOiAyNCxcbiAgICAgICAgICAgIG5hbWU6ICdlZ3Jlc3MnLFxuICAgICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QVUJMSUMsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjaWRyTWFzazogMjQsXG4gICAgICAgICAgICBuYW1lOiAncHJpdmF0ZScsXG4gICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9FR1JFU1MsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgbmF0R2F0ZXdheVN1Ym5ldHM6IHtcbiAgICAgICAgICBzdWJuZXRHcm91cE5hbWU6ICdlZ3Jlc3MnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6Ok5hdEdhdGV3YXknLCAzKTtcbiAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgNDsgaSsrKSB7XG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6RUMyOjpTdWJuZXQnLCBoYXNUYWdzKFt7XG4gICAgICAgICAgS2V5OiAnYXdzLWNkazpzdWJuZXQtbmFtZScsXG4gICAgICAgICAgVmFsdWU6ICdlZ3Jlc3MnLFxuICAgICAgICB9LCB7XG4gICAgICAgICAgS2V5OiAnTmFtZScsXG4gICAgICAgICAgVmFsdWU6IGBUZXN0U3RhY2svVlBDL2VncmVzc1N1Ym5ldCR7aX1gLFxuICAgICAgICB9XSkpO1xuICAgICAgfVxuXG4gICAgfSk7XG5cbiAgICB0ZXN0RGVwcmVjYXRlZCgnbmF0R2F0ZXdheXMgPSAwIHRocm93cyBpZiBQUklWQVRFX1dJVEhfTkFUIHN1Ym5ldHMgY29uZmlndXJlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBuZXcgVnBjKHN0YWNrLCAnVlBDJywge1xuICAgICAgICAgIG5hdEdhdGV3YXlzOiAwLFxuICAgICAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogJ3B1YmxpYycsXG4gICAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogJ3ByaXZhdGUnLFxuICAgICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9OQVQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvdygvbWFrZSBzdXJlIHlvdSBkb24ndCBjb25maWd1cmUgYW55IFBSSVZBVEUvKTtcblxuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCduYXRHYXRld2F5cyA9IDAgc3VjY2VlZHMgaWYgUFJJVkFURV9XSVRIX0VHUkVTUyBzdWJuZXRzIGNvbmZpZ3VyZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuXG4gICAgICBuZXcgVnBjKHN0YWNrLCAnVlBDJywge1xuICAgICAgICBuYXRHYXRld2F5czogMCxcbiAgICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdwdWJsaWMnLFxuICAgICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QVUJMSUMsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAncHJpdmF0ZScsXG4gICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9FR1JFU1MsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6OkludGVybmV0R2F0ZXdheScsIDEpO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUMyOjpOYXRHYXRld2F5JywgMCk7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ25hdEdhdGV3YXkgPSAwIGRlZmF1bHRzIHdpdGggSVNPTEFURUQgc3VibmV0JywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIG5ldyBWcGMoc3RhY2ssICdWUEMnLCB7XG4gICAgICAgIG5hdEdhdGV3YXlzOiAwLFxuICAgICAgfSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkVDMjo6U3VibmV0JywgaGFzVGFncyhbe1xuICAgICAgICBLZXk6ICdhd3MtY2RrOnN1Ym5ldC10eXBlJyxcbiAgICAgICAgVmFsdWU6ICdJc29sYXRlZCcsXG4gICAgICB9XSkpO1xuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCd1bnNwZWNpZmllZCBuYXRHYXRld2F5cyBjb25zdHJ1Y3RzIHdpdGggUFJJVkFURSBzdWJuZXQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpFQzI6OlN1Ym5ldCcsIGhhc1RhZ3MoW3tcbiAgICAgICAgS2V5OiAnYXdzLWNkazpzdWJuZXQtdHlwZScsXG4gICAgICAgIFZhbHVlOiAnUHJpdmF0ZScsXG4gICAgICB9XSkpO1xuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCduYXRHYXRld2F5cyA9IDAgYWxsb3dzIFJFU0VSVkVEIFBSSVZBVEUgc3VibmV0cycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBuZXcgVnBjKHN0YWNrLCAnVlBDJywge1xuICAgICAgICBpcEFkZHJlc3NlczogSXBBZGRyZXNzZXMuY2lkcignMTAuMC4wLjAvMTYnKSxcbiAgICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdpbmdyZXNzJyxcbiAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ3ByaXZhdGUnLFxuICAgICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfRUdSRVNTLFxuICAgICAgICAgICAgcmVzZXJ2ZWQ6IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgbmF0R2F0ZXdheXM6IDAsXG4gICAgICB9KTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6RUMyOjpTdWJuZXQnLCBoYXNUYWdzKFt7XG4gICAgICAgIEtleTogJ2F3cy1jZGs6c3VibmV0LW5hbWUnLFxuICAgICAgICBWYWx1ZTogJ2luZ3Jlc3MnLFxuICAgICAgfV0pKTtcblxuICAgIH0pO1xuXG4gICAgdGVzdCgnRUlQIHBhc3NlZCB3aXRoIE5BVCBnYXRld2F5IGRvZXMgbm90IGNyZWF0ZSBkdXBsaWNhdGUgRUlQJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIG5ldyBWcGMoc3RhY2ssICdWUEMnLCB7XG4gICAgICAgIGlwQWRkcmVzc2VzOiBJcEFkZHJlc3Nlcy5jaWRyKCcxMC4wLjAuMC8xNicpLFxuICAgICAgICBzdWJuZXRDb25maWd1cmF0aW9uOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2lkck1hc2s6IDI0LFxuICAgICAgICAgICAgbmFtZTogJ2luZ3Jlc3MnLFxuICAgICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QVUJMSUMsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjaWRyTWFzazogMjQsXG4gICAgICAgICAgICBuYW1lOiAnYXBwbGljYXRpb24nLFxuICAgICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfRUdSRVNTLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIG5hdEdhdGV3YXlQcm92aWRlcjogTmF0UHJvdmlkZXIuZ2F0ZXdheSh7IGVpcEFsbG9jYXRpb25JZHM6IFsnYiddIH0pLFxuICAgICAgICBuYXRHYXRld2F5czogMSxcbiAgICAgIH0pO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUMyOjpFSVAnLCAwKTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6TmF0R2F0ZXdheScsIHtcbiAgICAgICAgQWxsb2NhdGlvbklkOiAnYicsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3dpdGggbWlzLW1hdGNoZWQgbmF0IGFuZCBzdWJuZXQgY29uZmlncyBpdCB0aHJvd3MnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgZXhwZWN0KCgpID0+IG5ldyBWcGMoc3RhY2ssICdWUEMnLCB7XG4gICAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjaWRyTWFzazogMjQsXG4gICAgICAgICAgICBuYW1lOiAnaW5ncmVzcycsXG4gICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBVQkxJQyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNpZHJNYXNrOiAyNCxcbiAgICAgICAgICAgIG5hbWU6ICdwcml2YXRlJyxcbiAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX0VHUkVTUyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBuYXRHYXRld2F5U3VibmV0czoge1xuICAgICAgICAgIHN1Ym5ldEdyb3VwTmFtZTogJ25vdHRoZXJlJyxcbiAgICAgICAgfSxcbiAgICAgIH0pKS50b1Rocm93KCk7XG5cbiAgICB9KTtcbiAgICB0ZXN0KCd3aXRoIGEgdnBuIGdhdGV3YXknLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgbmV3IFZwYyhzdGFjaywgJ1ZQQycsIHtcbiAgICAgICAgdnBuR2F0ZXdheTogdHJ1ZSxcbiAgICAgICAgdnBuR2F0ZXdheUFzbjogNjUwMDAsXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpWUE5HYXRld2F5Jywge1xuICAgICAgICBBbWF6b25TaWRlQXNuOiA2NTAwMCxcbiAgICAgICAgVHlwZTogJ2lwc2VjLjEnLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6VlBDR2F0ZXdheUF0dGFjaG1lbnQnLCB7XG4gICAgICAgIFZwY0lkOiB7XG4gICAgICAgICAgUmVmOiAnVlBDQjlFNUYwQjQnLFxuICAgICAgICB9LFxuICAgICAgICBWcG5HYXRld2F5SWQ6IHtcbiAgICAgICAgICBSZWY6ICdWUENWcG5HYXRld2F5QjVBQkFFNjgnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6VlBOR2F0ZXdheVJvdXRlUHJvcGFnYXRpb24nLCB7XG4gICAgICAgIFJvdXRlVGFibGVJZHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZWY6ICdWUENQcml2YXRlU3VibmV0MVJvdXRlVGFibGVCRThBNjAyNycsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZWY6ICdWUENQcml2YXRlU3VibmV0MlJvdXRlVGFibGUwQTE5RTEwRScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZWY6ICdWUENQcml2YXRlU3VibmV0M1JvdXRlVGFibGUxOTIxODZGOCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVnBuR2F0ZXdheUlkOiB7XG4gICAgICAgICAgUmVmOiAnVlBDVnBuR2F0ZXdheUI1QUJBRTY4JyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcbiAgICB0ZXN0KCd3aXRoIGEgdnBuIGdhdGV3YXkgYW5kIHJvdXRlIHByb3BhZ2F0aW9uIG9uIGlzb2xhdGVkIHN1Ym5ldHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgbmV3IFZwYyhzdGFjaywgJ1ZQQycsIHtcbiAgICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xuICAgICAgICAgIHsgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QVUJMSUMsIG5hbWU6ICdQdWJsaWMnIH0sXG4gICAgICAgICAgeyBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfSVNPTEFURUQsIG5hbWU6ICdJc29sYXRlZCcgfSxcbiAgICAgICAgXSxcbiAgICAgICAgdnBuR2F0ZXdheTogdHJ1ZSxcbiAgICAgICAgdnBuUm91dGVQcm9wYWdhdGlvbjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFJJVkFURV9JU09MQVRFRCxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6VlBOR2F0ZXdheVJvdXRlUHJvcGFnYXRpb24nLCB7XG4gICAgICAgIFJvdXRlVGFibGVJZHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZWY6ICdWUENJc29sYXRlZFN1Ym5ldDFSb3V0ZVRhYmxlRUIxNTYyMTAnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnVlBDSXNvbGF0ZWRTdWJuZXQyUm91dGVUYWJsZTlCNEY3OERDJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlZjogJ1ZQQ0lzb2xhdGVkU3VibmV0M1JvdXRlVGFibGVDQjZBMUZEQScsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVnBuR2F0ZXdheUlkOiB7XG4gICAgICAgICAgUmVmOiAnVlBDVnBuR2F0ZXdheUI1QUJBRTY4JyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcbiAgICB0ZXN0KCd3aXRoIGEgdnBuIGdhdGV3YXkgYW5kIHJvdXRlIHByb3BhZ2F0aW9uIG9uIHByaXZhdGUgYW5kIGlzb2xhdGVkIHN1Ym5ldHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgbmV3IFZwYyhzdGFjaywgJ1ZQQycsIHtcbiAgICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xuICAgICAgICAgIHsgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QVUJMSUMsIG5hbWU6ICdQdWJsaWMnIH0sXG4gICAgICAgICAgeyBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9FR1JFU1MsIG5hbWU6ICdQcml2YXRlJyB9LFxuICAgICAgICAgIHsgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFX0lTT0xBVEVELCBuYW1lOiAnSXNvbGF0ZWQnIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHZwbkdhdGV3YXk6IHRydWUsXG4gICAgICAgIHZwblJvdXRlUHJvcGFnYXRpb246IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9FR1JFU1MsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfSVNPTEFURUQsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlZQTkdhdGV3YXlSb3V0ZVByb3BhZ2F0aW9uJywge1xuICAgICAgICBSb3V0ZVRhYmxlSWRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnVlBDUHJpdmF0ZVN1Ym5ldDFSb3V0ZVRhYmxlQkU4QTYwMjcnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnVlBDUHJpdmF0ZVN1Ym5ldDJSb3V0ZVRhYmxlMEExOUUxMEUnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnVlBDUHJpdmF0ZVN1Ym5ldDNSb3V0ZVRhYmxlMTkyMTg2RjgnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnVlBDSXNvbGF0ZWRTdWJuZXQxUm91dGVUYWJsZUVCMTU2MjEwJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlZjogJ1ZQQ0lzb2xhdGVkU3VibmV0MlJvdXRlVGFibGU5QjRGNzhEQycsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZWY6ICdWUENJc29sYXRlZFN1Ym5ldDNSb3V0ZVRhYmxlQ0I2QTFGREEnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZwbkdhdGV3YXlJZDoge1xuICAgICAgICAgIFJlZjogJ1ZQQ1ZwbkdhdGV3YXlCNUFCQUU2OCcsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuXG4gICAgfSk7XG4gICAgdGVzdCgncm91dGUgcHJvcGFnYXRpb24gZGVmYXVsdHMgdG8gaXNvbGF0ZWQgc3VibmV0cyB3aGVuIHRoZXJlIGFyZSBubyBwcml2YXRlIHN1Ym5ldHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgbmV3IFZwYyhzdGFjaywgJ1ZQQycsIHtcbiAgICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xuICAgICAgICAgIHsgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QVUJMSUMsIG5hbWU6ICdQdWJsaWMnIH0sXG4gICAgICAgICAgeyBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfSVNPTEFURUQsIG5hbWU6ICdJc29sYXRlZCcgfSxcbiAgICAgICAgXSxcbiAgICAgICAgdnBuR2F0ZXdheTogdHJ1ZSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlZQTkdhdGV3YXlSb3V0ZVByb3BhZ2F0aW9uJywge1xuICAgICAgICBSb3V0ZVRhYmxlSWRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnVlBDSXNvbGF0ZWRTdWJuZXQxUm91dGVUYWJsZUVCMTU2MjEwJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlZjogJ1ZQQ0lzb2xhdGVkU3VibmV0MlJvdXRlVGFibGU5QjRGNzhEQycsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZWY6ICdWUENJc29sYXRlZFN1Ym5ldDNSb3V0ZVRhYmxlQ0I2QTFGREEnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZwbkdhdGV3YXlJZDoge1xuICAgICAgICAgIFJlZjogJ1ZQQ1ZwbkdhdGV3YXlCNUFCQUU2OCcsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuXG4gICAgfSk7XG4gICAgdGVzdCgncm91dGUgcHJvcGFnYXRpb24gZGVmYXVsdHMgdG8gcHVibGljIHN1Ym5ldHMgd2hlbiB0aGVyZSBhcmUgbm8gcHJpdmF0ZS9pc29sYXRlZCBzdWJuZXRzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIG5ldyBWcGMoc3RhY2ssICdWUEMnLCB7XG4gICAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcbiAgICAgICAgICB7IHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDLCBuYW1lOiAnUHVibGljJyB9LFxuICAgICAgICBdLFxuICAgICAgICB2cG5HYXRld2F5OiB0cnVlLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6VlBOR2F0ZXdheVJvdXRlUHJvcGFnYXRpb24nLCB7XG4gICAgICAgIFJvdXRlVGFibGVJZHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZWY6ICdWUENQdWJsaWNTdWJuZXQxUm91dGVUYWJsZUZFRTRCNzgxJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlZjogJ1ZQQ1B1YmxpY1N1Ym5ldDJSb3V0ZVRhYmxlNkYxQTE1RjEnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnVlBDUHVibGljU3VibmV0M1JvdXRlVGFibGU5OEFFMEUxNCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVnBuR2F0ZXdheUlkOiB7XG4gICAgICAgICAgUmVmOiAnVlBDVnBuR2F0ZXdheUI1QUJBRTY4JyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcbiAgICB0ZXN0KCdmYWlscyB3aGVuIHNwZWNpZnlpbmcgdnBuQ29ubmVjdGlvbnMgd2l0aCB2cG5HYXRld2F5IHNldCB0byBmYWxzZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgICBleHBlY3QoKCkgPT4gbmV3IFZwYyhzdGFjaywgJ1ZwY05ldHdvcmsnLCB7XG4gICAgICAgIHZwbkdhdGV3YXk6IGZhbHNlLFxuICAgICAgICB2cG5Db25uZWN0aW9uczoge1xuICAgICAgICAgIFZwbkNvbm5lY3Rpb246IHtcbiAgICAgICAgICAgIGFzbjogNjUwMDAsXG4gICAgICAgICAgICBpcDogJzE5Mi4wLjIuMScsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pKS50b1Rocm93KC9gdnBuQ29ubmVjdGlvbnNgLitgdnBuR2F0ZXdheWAuK2ZhbHNlLyk7XG5cblxuICAgIH0pO1xuICAgIHRlc3QoJ2ZhaWxzIHdoZW4gc3BlY2lmeWluZyB2cG5HYXRld2F5QXNuIHdpdGggdnBuR2F0ZXdheSBzZXQgdG8gZmFsc2UnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgICAgZXhwZWN0KCgpID0+IG5ldyBWcGMoc3RhY2ssICdWcGNOZXR3b3JrJywge1xuICAgICAgICB2cG5HYXRld2F5OiBmYWxzZSxcbiAgICAgICAgdnBuR2F0ZXdheUFzbjogNjUwMDAsXG4gICAgICB9KSkudG9UaHJvdygvYHZwbkdhdGV3YXlBc25gLitgdnBuR2F0ZXdheWAuK2ZhbHNlLyk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnU3VibmV0cyBoYXZlIGEgZGVmYXVsdENoaWxkJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWcGNOZXR3b3JrJyk7XG5cbiAgICAgIGV4cGVjdCh2cGMucHVibGljU3VibmV0c1swXS5ub2RlLmRlZmF1bHRDaGlsZCBpbnN0YW5jZW9mIENmblN1Ym5ldCkudG9FcXVhbCh0cnVlKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ0NJRFIgY2Fubm90IGJlIGEgVG9rZW4nLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IFZwYyhzdGFjaywgJ1ZwYycsIHtcbiAgICAgICAgICBpcEFkZHJlc3NlczogSXBBZGRyZXNzZXMuY2lkcihMYXp5LnN0cmluZyh7IHByb2R1Y2U6ICgpID0+ICdhYmMnIH0pKSxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9wcm9wZXJ0eSBtdXN0IGJlIGEgY29uY3JldGUgQ0lEUiBzdHJpbmcvKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ0RlZmF1bHQgTkFUIGdhdGV3YXkgcHJvdmlkZXInLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgbmF0R2F0ZXdheVByb3ZpZGVyID0gTmF0UHJvdmlkZXIuZ2F0ZXdheSgpO1xuICAgICAgbmV3IFZwYyhzdGFjaywgJ1ZwY05ldHdvcmsnLCB7IG5hdEdhdGV3YXlQcm92aWRlciB9KTtcblxuICAgICAgZXhwZWN0KG5hdEdhdGV3YXlQcm92aWRlci5jb25maWd1cmVkR2F0ZXdheXMubGVuZ3RoKS50b0JlR3JlYXRlclRoYW4oMCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdOQVQgZ2F0ZXdheSBwcm92aWRlciB3aXRoIEVJUCBhbGxvY2F0aW9ucycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBuYXRHYXRld2F5UHJvdmlkZXIgPSBOYXRQcm92aWRlci5nYXRld2F5KHtcbiAgICAgICAgZWlwQWxsb2NhdGlvbklkczogWydhJywgJ2InLCAnYycsICdkJ10sXG4gICAgICB9KTtcbiAgICAgIG5ldyBWcGMoc3RhY2ssICdWcGNOZXR3b3JrJywgeyBuYXRHYXRld2F5UHJvdmlkZXIgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6TmF0R2F0ZXdheScsIHtcbiAgICAgICAgQWxsb2NhdGlvbklkOiAnYScsXG4gICAgICB9KTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6TmF0R2F0ZXdheScsIHtcbiAgICAgICAgQWxsb2NhdGlvbklkOiAnYicsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ05BVCBnYXRld2F5IHByb3ZpZGVyIHdpdGggaW5zdWZmaWNpZW50IEVJUCBhbGxvY2F0aW9ucycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBuYXRHYXRld2F5UHJvdmlkZXIgPSBOYXRQcm92aWRlci5nYXRld2F5KHsgZWlwQWxsb2NhdGlvbklkczogWydhJ10gfSk7XG4gICAgICBleHBlY3QoKCkgPT4gbmV3IFZwYyhzdGFjaywgJ1ZwY05ldHdvcmsnLCB7IG5hdEdhdGV3YXlQcm92aWRlciB9KSlcbiAgICAgICAgLnRvVGhyb3coL05vdCBlbm91Z2ggTkFUIGdhdGV3YXkgRUlQIGFsbG9jYXRpb24gSURzIFxcKDEgcHJvdmlkZWRcXCkgZm9yIHRoZSByZXF1ZXN0ZWQgc3VibmV0IGNvdW50IFxcKFxcZCsgbmVlZGVkXFwpLyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdOQVQgZ2F0ZXdheSBwcm92aWRlciB3aXRoIHRva2VuIEVJUCBhbGxvY2F0aW9ucycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBlaXBBbGxvY2F0aW9uSWRzID0gRm4uc3BsaXQoJywnLCBGbi5pbXBvcnRWYWx1ZSgnbXlWcGNJZCcpKTtcbiAgICAgIGNvbnN0IG5hdEdhdGV3YXlQcm92aWRlciA9IE5hdFByb3ZpZGVyLmdhdGV3YXkoeyBlaXBBbGxvY2F0aW9uSWRzIH0pO1xuICAgICAgbmV3IFZwYyhzdGFjaywgJ1ZwY05ldHdvcmsnLCB7IG5hdEdhdGV3YXlQcm92aWRlciB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpOYXRHYXRld2F5Jywge1xuICAgICAgICBBbGxvY2F0aW9uSWQ6IHN0YWNrLnJlc29sdmUoRm4uc2VsZWN0KDAsIGVpcEFsbG9jYXRpb25JZHMpKSxcbiAgICAgIH0pO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpOYXRHYXRld2F5Jywge1xuICAgICAgICBBbGxvY2F0aW9uSWQ6IHN0YWNrLnJlc29sdmUoRm4uc2VsZWN0KDEsIGVpcEFsbG9jYXRpb25JZHMpKSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnQ2FuIGFkZCBhbiBJUHY2IHJvdXRlJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcbiAgICAgICh2cGMucHVibGljU3VibmV0c1swXSBhcyBQdWJsaWNTdWJuZXQpLmFkZFJvdXRlKCdTb21lUm91dGUnLCB7XG4gICAgICAgIGRlc3RpbmF0aW9uSXB2NkNpZHJCbG9jazogJzIwMDE6NDg2MDo0ODYwOjo4ODg4LzMyJyxcbiAgICAgICAgcm91dGVySWQ6ICdyb3V0ZXItMScsXG4gICAgICAgIHJvdXRlclR5cGU6IFJvdXRlclR5cGUuTkVUV09SS19JTlRFUkZBQ0UsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlJvdXRlJywge1xuICAgICAgICBEZXN0aW5hdGlvbklwdjZDaWRyQmxvY2s6ICcyMDAxOjQ4NjA6NDg2MDo6ODg4OC8zMicsXG4gICAgICAgIE5ldHdvcmtJbnRlcmZhY2VJZDogJ3JvdXRlci0xJyxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcbiAgICB0ZXN0KCdDYW4gYWRkIGFuIElQdjQgcm91dGUnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuICAgICAgKHZwYy5wdWJsaWNTdWJuZXRzWzBdIGFzIFB1YmxpY1N1Ym5ldCkuYWRkUm91dGUoJ1NvbWVSb3V0ZScsIHtcbiAgICAgICAgZGVzdGluYXRpb25DaWRyQmxvY2s6ICcwLjAuMC4wLzAnLFxuICAgICAgICByb3V0ZXJJZDogJ3JvdXRlci0xJyxcbiAgICAgICAgcm91dGVyVHlwZTogUm91dGVyVHlwZS5ORVRXT1JLX0lOVEVSRkFDRSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6Um91dGUnLCB7XG4gICAgICAgIERlc3RpbmF0aW9uQ2lkckJsb2NrOiAnMC4wLjAuMC8wJyxcbiAgICAgICAgTmV0d29ya0ludGVyZmFjZUlkOiAncm91dGVyLTEnLFxuICAgICAgfSk7XG5cbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2Zyb21WcGNBdHRyaWJ1dGVzJywgKCkgPT4ge1xuICAgIHRlc3QoJ3Bhc3NlcyByZWdpb24gY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG5cbiAgICAgIGNvbnN0IHZwY0lkID0gRm4uaW1wb3J0VmFsdWUoJ215VnBjSWQnKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgdnBjID0gVnBjLmZyb21WcGNBdHRyaWJ1dGVzKHN0YWNrLCAnVlBDJywge1xuICAgICAgICB2cGNJZCxcbiAgICAgICAgYXZhaWxhYmlsaXR5Wm9uZXM6IFsncmVnaW9uLTEyMzQ1YScsICdyZWdpb24tMTIzNDViJywgJ3JlZ2lvbi0xMjM0NWMnXSxcbiAgICAgICAgcmVnaW9uOiAncmVnaW9uLTEyMzQ1JyxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QodnBjLmVudi5yZWdpb24pLnRvRXF1YWwoJ3JlZ2lvbi0xMjM0NScpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgncGFzc2VzIHN1Ym5ldCBJUHY0IENJRFIgYmxvY2tzIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gVnBjLmZyb21WcGNBdHRyaWJ1dGVzKHN0YWNrLCAnVlBDJywge1xuICAgICAgICB2cGNJZDogJ3ZwYy0xMjM0JyxcbiAgICAgICAgYXZhaWxhYmlsaXR5Wm9uZXM6IFsnZHVtbXkxYScsICdkdW1teTFiJywgJ2R1bW15MWMnXSxcbiAgICAgICAgcHVibGljU3VibmV0SWRzOiBbJ3B1Yi0xJywgJ3B1Yi0yJywgJ3B1Yi0zJ10sXG4gICAgICAgIHB1YmxpY1N1Ym5ldElwdjRDaWRyQmxvY2tzOiBbJzEwLjAuMC4wLzE4JywgJzEwLjAuNjQuMC8xOCcsICcxMC4wLjEyOC4wLzE4J10sXG4gICAgICAgIHByaXZhdGVTdWJuZXRJZHM6IFsncHJpLTEnLCAncHJpLTInLCAncHJpLTMnXSxcbiAgICAgICAgcHJpdmF0ZVN1Ym5ldElwdjRDaWRyQmxvY2tzOiBbJzEwLjEwLjAuMC8xOCcsICcxMC4xMC42NC4wLzE4JywgJzEwLjEwLjEyOC4wLzE4J10sXG4gICAgICAgIGlzb2xhdGVkU3VibmV0SWRzOiBbJ2lzby0xJywgJ2lzby0yJywgJ2lzby0zJ10sXG4gICAgICAgIGlzb2xhdGVkU3VibmV0SXB2NENpZHJCbG9ja3M6IFsnMTAuMjAuMC4wLzE4JywgJzEwLjIwLjY0LjAvMTgnLCAnMTAuMjAuMTI4LjAvMTgnXSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBwdWJsaWMxID0gdnBjLnB1YmxpY1N1Ym5ldHMuZmluZCgoeyBzdWJuZXRJZCB9KSA9PiBzdWJuZXRJZCA9PT0gJ3B1Yi0xJyk7XG4gICAgICBjb25zdCBwdWJsaWMyID0gdnBjLnB1YmxpY1N1Ym5ldHMuZmluZCgoeyBzdWJuZXRJZCB9KSA9PiBzdWJuZXRJZCA9PT0gJ3B1Yi0yJyk7XG4gICAgICBjb25zdCBwdWJsaWMzID0gdnBjLnB1YmxpY1N1Ym5ldHMuZmluZCgoeyBzdWJuZXRJZCB9KSA9PiBzdWJuZXRJZCA9PT0gJ3B1Yi0zJyk7XG4gICAgICBjb25zdCBwcml2YXRlMSA9IHZwYy5wcml2YXRlU3VibmV0cy5maW5kKCh7IHN1Ym5ldElkIH0pID0+IHN1Ym5ldElkID09PSAncHJpLTEnKTtcbiAgICAgIGNvbnN0IHByaXZhdGUyID0gdnBjLnByaXZhdGVTdWJuZXRzLmZpbmQoKHsgc3VibmV0SWQgfSkgPT4gc3VibmV0SWQgPT09ICdwcmktMicpO1xuICAgICAgY29uc3QgcHJpdmF0ZTMgPSB2cGMucHJpdmF0ZVN1Ym5ldHMuZmluZCgoeyBzdWJuZXRJZCB9KSA9PiBzdWJuZXRJZCA9PT0gJ3ByaS0zJyk7XG4gICAgICBjb25zdCBpc29sYXRlZDEgPSB2cGMuaXNvbGF0ZWRTdWJuZXRzLmZpbmQoKHsgc3VibmV0SWQgfSkgPT4gc3VibmV0SWQgPT09ICdpc28tMScpO1xuICAgICAgY29uc3QgaXNvbGF0ZWQyID0gdnBjLmlzb2xhdGVkU3VibmV0cy5maW5kKCh7IHN1Ym5ldElkIH0pID0+IHN1Ym5ldElkID09PSAnaXNvLTInKTtcbiAgICAgIGNvbnN0IGlzb2xhdGVkMyA9IHZwYy5pc29sYXRlZFN1Ym5ldHMuZmluZCgoeyBzdWJuZXRJZCB9KSA9PiBzdWJuZXRJZCA9PT0gJ2lzby0zJyk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChwdWJsaWMxPy5pcHY0Q2lkckJsb2NrKS50b0VxdWFsKCcxMC4wLjAuMC8xOCcpO1xuICAgICAgZXhwZWN0KHB1YmxpYzI/LmlwdjRDaWRyQmxvY2spLnRvRXF1YWwoJzEwLjAuNjQuMC8xOCcpO1xuICAgICAgZXhwZWN0KHB1YmxpYzM/LmlwdjRDaWRyQmxvY2spLnRvRXF1YWwoJzEwLjAuMTI4LjAvMTgnKTtcbiAgICAgIGV4cGVjdChwcml2YXRlMT8uaXB2NENpZHJCbG9jaykudG9FcXVhbCgnMTAuMTAuMC4wLzE4Jyk7XG4gICAgICBleHBlY3QocHJpdmF0ZTI/LmlwdjRDaWRyQmxvY2spLnRvRXF1YWwoJzEwLjEwLjY0LjAvMTgnKTtcbiAgICAgIGV4cGVjdChwcml2YXRlMz8uaXB2NENpZHJCbG9jaykudG9FcXVhbCgnMTAuMTAuMTI4LjAvMTgnKTtcbiAgICAgIGV4cGVjdChpc29sYXRlZDE/LmlwdjRDaWRyQmxvY2spLnRvRXF1YWwoJzEwLjIwLjAuMC8xOCcpO1xuICAgICAgZXhwZWN0KGlzb2xhdGVkMj8uaXB2NENpZHJCbG9jaykudG9FcXVhbCgnMTAuMjAuNjQuMC8xOCcpO1xuICAgICAgZXhwZWN0KGlzb2xhdGVkMz8uaXB2NENpZHJCbG9jaykudG9FcXVhbCgnMTAuMjAuMTI4LjAvMTgnKTtcblxuICAgIH0pO1xuXG4gICAgdGVzdCgndGhyb3dzIG9uIGluY29ycmVjdCBudW1iZXIgb2Ygc3VibmV0IG5hbWVzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgICAgZXhwZWN0KCgpID0+XG4gICAgICAgIFZwYy5mcm9tVnBjQXR0cmlidXRlcyhzdGFjaywgJ1ZQQycsIHtcbiAgICAgICAgICB2cGNJZDogJ3ZwYy0xMjM0JyxcbiAgICAgICAgICBhdmFpbGFiaWxpdHlab25lczogWyd1cy1lYXN0LTFhJywgJ3VzLWVhc3QtMWInLCAndXMtZWFzdC0xYyddLFxuICAgICAgICAgIHB1YmxpY1N1Ym5ldElkczogWydzLTEyMzQ1JywgJ3MtMzQ1NjcnLCAncy01Njc4OSddLFxuICAgICAgICAgIHB1YmxpY1N1Ym5ldE5hbWVzOiBbJ1B1YmxpYyAxJywgJ1B1YmxpYyAyJ10sXG4gICAgICAgIH0pLFxuICAgICAgKS50b1Rocm93KC9wdWJsaWNTdWJuZXROYW1lcyBtdXN0IGhhdmUgYW4gZW50cnkgZm9yIGV2ZXJ5IGNvcnJlc3BvbmRpbmcgc3VibmV0IGdyb3VwLyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd0aHJvd3Mgb24gaW5jb3JyZWN0IG51bWJlciBvZiByb3V0ZSB0YWJsZSBpZHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgICBleHBlY3QoKCkgPT5cbiAgICAgICAgVnBjLmZyb21WcGNBdHRyaWJ1dGVzKHN0YWNrLCAnVlBDJywge1xuICAgICAgICAgIHZwY0lkOiAndnBjLTEyMzQnLFxuICAgICAgICAgIGF2YWlsYWJpbGl0eVpvbmVzOiBbJ3VzLWVhc3QtMWEnLCAndXMtZWFzdC0xYicsICd1cy1lYXN0LTFjJ10sXG4gICAgICAgICAgcHVibGljU3VibmV0SWRzOiBbJ3MtMTIzNDUnLCAncy0zNDU2NycsICdzLTU2Nzg5J10sXG4gICAgICAgICAgcHVibGljU3VibmV0Um91dGVUYWJsZUlkczogWydydC0xMjM0NSddLFxuICAgICAgICB9KSxcbiAgICAgICkudG9UaHJvdygnTnVtYmVyIG9mIHB1YmxpY1N1Ym5ldFJvdXRlVGFibGVJZHMgKDEpIG11c3QgYmUgZXF1YWwgdG8gdGhlIGFtb3VudCBvZiBwdWJsaWNTdWJuZXRJZHMgKDMpLicpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgndGhyb3dzIG9uIGluY29ycmVjdCBudW1iZXIgb2Ygc3VibmV0IElQdjQgQ0lEUiBibG9ja3MnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgICBleHBlY3QoKCkgPT5cbiAgICAgICAgVnBjLmZyb21WcGNBdHRyaWJ1dGVzKHN0YWNrLCAnVlBDJywge1xuICAgICAgICAgIHZwY0lkOiAndnBjLTEyMzQnLFxuICAgICAgICAgIGF2YWlsYWJpbGl0eVpvbmVzOiBbJ3VzLWVhc3QtMWEnLCAndXMtZWFzdC0xYicsICd1cy1lYXN0LTFjJ10sXG4gICAgICAgICAgcHVibGljU3VibmV0SWRzOiBbJ3MtMTIzNDUnLCAncy0zNDU2NycsICdzLTU2Nzg5J10sXG4gICAgICAgICAgcHVibGljU3VibmV0SXB2NENpZHJCbG9ja3M6IFsnMTAuMC4wLjAvMTgnLCAnMTAuMC42NC4wLzE4J10sXG4gICAgICAgIH0pLFxuICAgICAgKS50b1Rocm93KCdOdW1iZXIgb2YgcHVibGljU3VibmV0SXB2NENpZHJCbG9ja3MgKDIpIG11c3QgYmUgZXF1YWwgdG8gdGhlIGFtb3VudCBvZiBwdWJsaWNTdWJuZXRJZHMgKDMpLicpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnTkFUIGluc3RhbmNlcycsICgpID0+IHtcbiAgICB0ZXN0KCdDYW4gY29uZmlndXJlIE5BVCBpbnN0YW5jZXMgaW5zdGVhZCBvZiBOQVQgZ2F0ZXdheXMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgbmF0R2F0ZXdheVByb3ZpZGVyID0gTmF0UHJvdmlkZXIuaW5zdGFuY2Uoe1xuICAgICAgICBpbnN0YW5jZVR5cGU6IG5ldyBJbnN0YW5jZVR5cGUoJ3E4Ni5tZWdhJyksXG4gICAgICAgIG1hY2hpbmVJbWFnZTogbmV3IEdlbmVyaWNMaW51eEltYWdlKHtcbiAgICAgICAgICAndXMtZWFzdC0xJzogJ2FtaS0xJyxcbiAgICAgICAgfSksXG4gICAgICB9KTtcbiAgICAgIG5ldyBWcGMoc3RhY2ssICdUaGVWUEMnLCB7IG5hdEdhdGV3YXlQcm92aWRlciB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUMyOjpJbnN0YW5jZScsIDMpO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpJbnN0YW5jZScsIHtcbiAgICAgICAgSW1hZ2VJZDogJ2FtaS0xJyxcbiAgICAgICAgSW5zdGFuY2VUeXBlOiAncTg2Lm1lZ2EnLFxuICAgICAgICBTb3VyY2VEZXN0Q2hlY2s6IGZhbHNlLFxuICAgICAgfSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlJvdXRlJywge1xuICAgICAgICBSb3V0ZVRhYmxlSWQ6IHsgUmVmOiAnVGhlVlBDUHJpdmF0ZVN1Ym5ldDFSb3V0ZVRhYmxlRjY1MTNCQzInIH0sXG4gICAgICAgIERlc3RpbmF0aW9uQ2lkckJsb2NrOiAnMC4wLjAuMC8wJyxcbiAgICAgICAgSW5zdGFuY2VJZDogeyBSZWY6ICdUaGVWUENQdWJsaWNTdWJuZXQxTmF0SW5zdGFuY2VDQzUxNDE5MicgfSxcbiAgICAgIH0pO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwJywge1xuICAgICAgICBTZWN1cml0eUdyb3VwRWdyZXNzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQ2lkcklwOiAnMC4wLjAuMC8wJyxcbiAgICAgICAgICAgIERlc2NyaXB0aW9uOiAnQWxsb3cgYWxsIG91dGJvdW5kIHRyYWZmaWMgYnkgZGVmYXVsdCcsXG4gICAgICAgICAgICBJcFByb3RvY29sOiAnLTEnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFNlY3VyaXR5R3JvdXBJbmdyZXNzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQ2lkcklwOiAnMC4wLjAuMC8wJyxcbiAgICAgICAgICAgIERlc2NyaXB0aW9uOiAnZnJvbSAwLjAuMC4wLzA6QUxMIFRSQUZGSUMnLFxuICAgICAgICAgICAgSXBQcm90b2NvbDogJy0xJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnbmF0R2F0ZXdheXMgY29udHJvbHMgYW1vdW50IG9mIE5BVCBpbnN0YW5jZXMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IFZwYyhzdGFjaywgJ1RoZVZQQycsIHtcbiAgICAgICAgbmF0R2F0ZXdheVByb3ZpZGVyOiBOYXRQcm92aWRlci5pbnN0YW5jZSh7XG4gICAgICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgSW5zdGFuY2VUeXBlKCdxODYubWVnYScpLFxuICAgICAgICAgIG1hY2hpbmVJbWFnZTogbmV3IEdlbmVyaWNMaW51eEltYWdlKHtcbiAgICAgICAgICAgICd1cy1lYXN0LTEnOiAnYW1pLTEnLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9KSxcbiAgICAgICAgbmF0R2F0ZXdheXM6IDEsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUMyOjpJbnN0YW5jZScsIDEpO1xuICAgIH0pO1xuXG4gICAgdGVzdERlcHJlY2F0ZWQoJ2NhbiBjb25maWd1cmUgU2VjdXJpdHkgR3JvdXBzIG9mIE5BVCBpbnN0YW5jZXMgd2l0aCBhbGxvd0FsbFRyYWZmaWMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgcHJvdmlkZXIgPSBOYXRQcm92aWRlci5pbnN0YW5jZSh7XG4gICAgICAgIGluc3RhbmNlVHlwZTogbmV3IEluc3RhbmNlVHlwZSgncTg2Lm1lZ2EnKSxcbiAgICAgICAgbWFjaGluZUltYWdlOiBuZXcgR2VuZXJpY0xpbnV4SW1hZ2Uoe1xuICAgICAgICAgICd1cy1lYXN0LTEnOiAnYW1pLTEnLFxuICAgICAgICB9KSxcbiAgICAgICAgYWxsb3dBbGxUcmFmZmljOiBmYWxzZSxcbiAgICAgIH0pO1xuICAgICAgbmV3IFZwYyhzdGFjaywgJ1RoZVZQQycsIHtcbiAgICAgICAgbmF0R2F0ZXdheVByb3ZpZGVyOiBwcm92aWRlcixcbiAgICAgIH0pO1xuICAgICAgcHJvdmlkZXIuY29ubmVjdGlvbnMuYWxsb3dGcm9tKFBlZXIuaXB2NCgnMS4yLjMuNC8zMicpLCBQb3J0LnRjcCg4NikpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXAnLCB7XG4gICAgICAgIFNlY3VyaXR5R3JvdXBFZ3Jlc3M6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBDaWRySXA6ICcwLjAuMC4wLzAnLFxuICAgICAgICAgICAgRGVzY3JpcHRpb246ICdBbGxvdyBhbGwgb3V0Ym91bmQgdHJhZmZpYyBieSBkZWZhdWx0JyxcbiAgICAgICAgICAgIElwUHJvdG9jb2w6ICctMScsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgU2VjdXJpdHlHcm91cEluZ3Jlc3M6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBDaWRySXA6ICcxLjIuMy40LzMyJyxcbiAgICAgICAgICAgIERlc2NyaXB0aW9uOiAnZnJvbSAxLjIuMy40LzMyOjg2JyxcbiAgICAgICAgICAgIEZyb21Qb3J0OiA4NixcbiAgICAgICAgICAgIElwUHJvdG9jb2w6ICd0Y3AnLFxuICAgICAgICAgICAgVG9Qb3J0OiA4NixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIGNvbmZpZ3VyZSBTZWN1cml0eSBHcm91cHMgb2YgTkFUIGluc3RhbmNlcyB3aXRoIGRlZmF1bHRBbGxvd0FsbCBJTkJPVU5EX0FORF9PVVRCT1VORCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBwcm92aWRlciA9IE5hdFByb3ZpZGVyLmluc3RhbmNlKHtcbiAgICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgSW5zdGFuY2VUeXBlKCdxODYubWVnYScpLFxuICAgICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBHZW5lcmljTGludXhJbWFnZSh7XG4gICAgICAgICAgJ3VzLWVhc3QtMSc6ICdhbWktMScsXG4gICAgICAgIH0pLFxuICAgICAgICBkZWZhdWx0QWxsb3dlZFRyYWZmaWM6IE5hdFRyYWZmaWNEaXJlY3Rpb24uSU5CT1VORF9BTkRfT1VUQk9VTkQsXG4gICAgICB9KTtcbiAgICAgIG5ldyBWcGMoc3RhY2ssICdUaGVWUEMnLCB7XG4gICAgICAgIG5hdEdhdGV3YXlQcm92aWRlcjogcHJvdmlkZXIsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwJywge1xuICAgICAgICBTZWN1cml0eUdyb3VwRWdyZXNzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQ2lkcklwOiAnMC4wLjAuMC8wJyxcbiAgICAgICAgICAgIERlc2NyaXB0aW9uOiAnQWxsb3cgYWxsIG91dGJvdW5kIHRyYWZmaWMgYnkgZGVmYXVsdCcsXG4gICAgICAgICAgICBJcFByb3RvY29sOiAnLTEnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFNlY3VyaXR5R3JvdXBJbmdyZXNzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQ2lkcklwOiAnMC4wLjAuMC8wJyxcbiAgICAgICAgICAgIERlc2NyaXB0aW9uOiAnZnJvbSAwLjAuMC4wLzA6QUxMIFRSQUZGSUMnLFxuICAgICAgICAgICAgSXBQcm90b2NvbDogJy0xJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIGNvbmZpZ3VyZSBTZWN1cml0eSBHcm91cHMgb2YgTkFUIGluc3RhbmNlcyB3aXRoIGRlZmF1bHRBbGxvd0FsbCBPVVRCT1VORF9PTkxZJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHByb3ZpZGVyID0gTmF0UHJvdmlkZXIuaW5zdGFuY2Uoe1xuICAgICAgICBpbnN0YW5jZVR5cGU6IG5ldyBJbnN0YW5jZVR5cGUoJ3E4Ni5tZWdhJyksXG4gICAgICAgIG1hY2hpbmVJbWFnZTogbmV3IEdlbmVyaWNMaW51eEltYWdlKHtcbiAgICAgICAgICAndXMtZWFzdC0xJzogJ2FtaS0xJyxcbiAgICAgICAgfSksXG4gICAgICAgIGRlZmF1bHRBbGxvd2VkVHJhZmZpYzogTmF0VHJhZmZpY0RpcmVjdGlvbi5PVVRCT1VORF9PTkxZLFxuICAgICAgfSk7XG4gICAgICBuZXcgVnBjKHN0YWNrLCAnVGhlVlBDJywge1xuICAgICAgICBuYXRHYXRld2F5UHJvdmlkZXI6IHByb3ZpZGVyLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U2VjdXJpdHlHcm91cCcsIHtcbiAgICAgICAgU2VjdXJpdHlHcm91cEVncmVzczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIENpZHJJcDogJzAuMC4wLjAvMCcsXG4gICAgICAgICAgICBEZXNjcmlwdGlvbjogJ0FsbG93IGFsbCBvdXRib3VuZCB0cmFmZmljIGJ5IGRlZmF1bHQnLFxuICAgICAgICAgICAgSXBQcm90b2NvbDogJy0xJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIGNvbmZpZ3VyZSBTZWN1cml0eSBHcm91cHMgb2YgTkFUIGluc3RhbmNlcyB3aXRoIGRlZmF1bHRBbGxvd0FsbCBOT05FJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHByb3ZpZGVyID0gTmF0UHJvdmlkZXIuaW5zdGFuY2Uoe1xuICAgICAgICBpbnN0YW5jZVR5cGU6IG5ldyBJbnN0YW5jZVR5cGUoJ3E4Ni5tZWdhJyksXG4gICAgICAgIG1hY2hpbmVJbWFnZTogbmV3IEdlbmVyaWNMaW51eEltYWdlKHtcbiAgICAgICAgICAndXMtZWFzdC0xJzogJ2FtaS0xJyxcbiAgICAgICAgfSksXG4gICAgICAgIGRlZmF1bHRBbGxvd2VkVHJhZmZpYzogTmF0VHJhZmZpY0RpcmVjdGlvbi5OT05FLFxuICAgICAgfSk7XG4gICAgICBuZXcgVnBjKHN0YWNrLCAnVGhlVlBDJywge1xuICAgICAgICBuYXRHYXRld2F5UHJvdmlkZXI6IHByb3ZpZGVyLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U2VjdXJpdHlHcm91cCcsIHtcbiAgICAgICAgU2VjdXJpdHlHcm91cEVncmVzczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIENpZHJJcDogJzI1NS4yNTUuMjU1LjI1NS8zMicsXG4gICAgICAgICAgICBEZXNjcmlwdGlvbjogJ0Rpc2FsbG93IGFsbCB0cmFmZmljJyxcbiAgICAgICAgICAgIEZyb21Qb3J0OiAyNTIsXG4gICAgICAgICAgICBJcFByb3RvY29sOiAnaWNtcCcsXG4gICAgICAgICAgICBUb1BvcnQ6IDg2LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuXG4gICAgfSk7XG5cbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ05ldHdvcmsgQUNMIGFzc29jaWF0aW9uJywgKCkgPT4ge1xuICAgIHRlc3QoJ2J5IGRlZmF1bHQgdXNlcyBkZWZhdWx0IEFDTCByZWZlcmVuY2UnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1RoZVZQQycsIHsgaXBBZGRyZXNzZXM6IElwQWRkcmVzc2VzLmNpZHIoJzE5Mi4xNjguMC4wLzE2JykgfSk7XG4gICAgICBuZXcgQ2ZuT3V0cHV0KHN0YWNrLCAnT3V0cHV0Jywge1xuICAgICAgICB2YWx1ZTogKHZwYy5wdWJsaWNTdWJuZXRzWzBdIGFzIFN1Ym5ldCkuc3VibmV0TmV0d29ya0FjbEFzc29jaWF0aW9uSWQsXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgICBPdXRwdXRzOiB7XG4gICAgICAgICAgT3V0cHV0OiB7XG4gICAgICAgICAgICBWYWx1ZTogeyAnRm46OkdldEF0dCc6IFsnVGhlVlBDUHVibGljU3VibmV0MVN1Ym5ldDc3MEQ0RkYyJywgJ05ldHdvcmtBY2xBc3NvY2lhdGlvbklkJ10gfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdpZiBBQ0wgaXMgcmVwbGFjZWQgbmV3IEFDTCByZWZlcmVuY2UgaXMgcmV0dXJuZWQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdUaGVWUEMnLCB7IGlwQWRkcmVzc2VzOiBJcEFkZHJlc3Nlcy5jaWRyKCcxOTIuMTY4LjAuMC8xNicpIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgQ2ZuT3V0cHV0KHN0YWNrLCAnT3V0cHV0Jywge1xuICAgICAgICB2YWx1ZTogKHZwYy5wdWJsaWNTdWJuZXRzWzBdIGFzIFN1Ym5ldCkuc3VibmV0TmV0d29ya0FjbEFzc29jaWF0aW9uSWQsXG4gICAgICB9KTtcbiAgICAgIG5ldyBOZXR3b3JrQWNsKHN0YWNrLCAnQUNMJywge1xuICAgICAgICB2cGMsXG4gICAgICAgIHN1Ym5ldFNlbGVjdGlvbjogeyBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBVQkxJQyB9LFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgICAgT3V0cHV0czoge1xuICAgICAgICAgIE91dHB1dDoge1xuICAgICAgICAgICAgVmFsdWU6IHsgUmVmOiAnQUNMREJEMUJCNDknIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnV2hlbiBjcmVhdGluZyBhIFZQQyB3aXRoIGEgY3VzdG9tIENJRFIgcmFuZ2UnLCAoKSA9PiB7XG4gICAgdGVzdCgndnBjLnZwY0NpZHJCbG9jayBpcyB0aGUgY29ycmVjdCBuZXR3b3JrIHJhbmdlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIG5ldyBWcGMoc3RhY2ssICdUaGVWUEMnLCB7IGlwQWRkcmVzc2VzOiBJcEFkZHJlc3Nlcy5jaWRyKCcxOTIuMTY4LjAuMC8xNicpIH0pO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpWUEMnLCB7XG4gICAgICAgIENpZHJCbG9jazogJzE5Mi4xNjguMC4wLzE2JyxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbiAgZGVzY3JpYmUoJ1doZW4gdGFnZ2luZycsICgpID0+IHtcbiAgICB0ZXN0KCdWUEMgcHJvcGFnYXRlZCB0YWdzIHdpbGwgYmUgb24gc3VibmV0LCBJR1csIHJvdXRldGFibGVzLCBOQVRHVycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBjb25zdCB0YWdzID0ge1xuICAgICAgICBWcGNUeXBlOiAnR29vZCcsXG4gICAgICB9O1xuICAgICAgY29uc3Qgbm9Qcm9wVGFncyA9IHtcbiAgICAgICAgQnVzaW5lc3NVbml0OiAnTWFya2V0aW5nJyxcbiAgICAgIH07XG4gICAgICBjb25zdCBhbGxUYWdzID0geyAuLi5ub1Byb3BUYWdzLCAuLi50YWdzIH07XG5cbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdUaGVWUEMnKTtcbiAgICAgIC8vIG92ZXJ3cml0ZSB0byBzZXQgcHJvcGFnYXRlXG4gICAgICBUYWdzLm9mKHZwYykuYWRkKCdCdXNpbmVzc1VuaXQnLCAnTWFya2V0aW5nJywgeyBpbmNsdWRlUmVzb3VyY2VUeXBlczogW0NmblZQQy5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FXSB9KTtcbiAgICAgIFRhZ3Mub2YodnBjKS5hZGQoJ1ZwY1R5cGUnLCAnR29vZCcpO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpFQzI6OlZQQycsIGhhc1RhZ3ModG9DZm5UYWdzKGFsbFRhZ3MpKSk7XG4gICAgICBjb25zdCB0YWdnYWJsZXMgPSBbJ1N1Ym5ldCcsICdJbnRlcm5ldEdhdGV3YXknLCAnTmF0R2F0ZXdheScsICdSb3V0ZVRhYmxlJ107XG4gICAgICBjb25zdCBwcm9wVGFncyA9IHRvQ2ZuVGFncyh0YWdzKTtcbiAgICAgIGNvbnN0IG5vUHJvcCA9IHRvQ2ZuVGFncyhub1Byb3BUYWdzKTtcbiAgICAgIGZvciAoY29uc3QgcmVzb3VyY2Ugb2YgdGFnZ2FibGVzKSB7XG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKGBBV1M6OkVDMjo6JHtyZXNvdXJjZX1gLCB7XG4gICAgICAgICAgVGFnczogTWF0Y2guYXJyYXlXaXRoKHByb3BUYWdzKSxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IG1hdGNoaW5nUmVzb3VyY2VzID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5maW5kUmVzb3VyY2VzKGBBV1M6OkVDMjo6JHtyZXNvdXJjZX1gLCBoYXNUYWdzKG5vUHJvcCkpO1xuICAgICAgICBleHBlY3QoT2JqZWN0LmtleXMobWF0Y2hpbmdSZXNvdXJjZXMpLmxlbmd0aCkudG9CZSgwKTtcbiAgICAgIH1cblxuICAgIH0pO1xuICAgIHRlc3QoJ1N1Ym5ldCBOYW1lIHdpbGwgcHJvcGFnYXRlIHRvIHJvdXRlIHRhYmxlcyBhbmQgTkFUR1cnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1RoZVZQQycpO1xuICAgICAgZm9yIChjb25zdCBzdWJuZXQgb2YgdnBjLnB1YmxpY1N1Ym5ldHMpIHtcbiAgICAgICAgY29uc3QgdGFnID0geyBLZXk6ICdOYW1lJywgVmFsdWU6IHN1Ym5ldC5ub2RlLnBhdGggfTtcbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpFQzI6Ok5hdEdhdGV3YXknLCBoYXNUYWdzKFt0YWddKSk7XG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6RUMyOjpSb3V0ZVRhYmxlJywgaGFzVGFncyhbdGFnXSkpO1xuICAgICAgfVxuICAgICAgZm9yIChjb25zdCBzdWJuZXQgb2YgdnBjLnByaXZhdGVTdWJuZXRzKSB7XG4gICAgICAgIGNvbnN0IHRhZyA9IHsgS2V5OiAnTmFtZScsIFZhbHVlOiBzdWJuZXQubm9kZS5wYXRoIH07XG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6RUMyOjpSb3V0ZVRhYmxlJywgaGFzVGFncyhbdGFnXSkpO1xuICAgICAgfVxuXG4gICAgfSk7XG4gICAgdGVzdCgnVGFncyBjYW4gYmUgYWRkZWQgYWZ0ZXIgdGhlIFZwYyBpcyBjcmVhdGVkIHdpdGggYHZwYy50YWdzLnNldFRhZyguLi4pYCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG5cbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdUaGVWUEMnKTtcbiAgICAgIGNvbnN0IHRhZyA9IHsgS2V5OiAnTGF0ZScsIFZhbHVlOiAnQWRkZXInIH07XG4gICAgICBUYWdzLm9mKHZwYykuYWRkKHRhZy5LZXksIHRhZy5WYWx1ZSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkVDMjo6VlBDJywgaGFzVGFncyhbdGFnXSkpO1xuXG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdzdWJuZXQgc2VsZWN0aW9uJywgKCkgPT4ge1xuICAgIHRlc3QoJ3NlbGVjdGluZyBkZWZhdWx0IHN1Ym5ldHMgcmV0dXJucyB0aGUgcHJpdmF0ZSBvbmVzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHsgc3VibmV0SWRzIH0gPSB2cGMuc2VsZWN0U3VibmV0cygpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3Qoc3VibmV0SWRzKS50b0VxdWFsKHZwYy5wcml2YXRlU3VibmV0cy5tYXAocyA9PiBzLnN1Ym5ldElkKSk7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiBzZWxlY3QgcHVibGljIHN1Ym5ldHMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgeyBzdWJuZXRJZHMgfSA9IHZwYy5zZWxlY3RTdWJuZXRzKHsgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QVUJMSUMgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChzdWJuZXRJZHMpLnRvRXF1YWwodnBjLnB1YmxpY1N1Ym5ldHMubWFwKHMgPT4gcy5zdWJuZXRJZCkpO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiBzZWxlY3QgaXNvbGF0ZWQgc3VibmV0cycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycsIHtcbiAgICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xuICAgICAgICAgIHsgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QVUJMSUMsIG5hbWU6ICdQdWJsaWMnIH0sXG4gICAgICAgICAgeyBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfSVNPTEFURUQsIG5hbWU6ICdJc29sYXRlZCcgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCB7IHN1Ym5ldElkcyB9ID0gdnBjLnNlbGVjdFN1Ym5ldHMoeyBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfSVNPTEFURUQgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChzdWJuZXRJZHMpLnRvRXF1YWwodnBjLmlzb2xhdGVkU3VibmV0cy5tYXAocyA9PiBzLnN1Ym5ldElkKSk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIHNlbGVjdCBzdWJuZXRzIGJ5IG5hbWUnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnLCB7XG4gICAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcbiAgICAgICAgICB7IHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDLCBuYW1lOiAnQmxhQmxhJyB9LFxuICAgICAgICAgIHsgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfRUdSRVNTLCBuYW1lOiAnRG9udFRhbGtUb01lJyB9LFxuICAgICAgICAgIHsgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFX0lTT0xBVEVELCBuYW1lOiAnRG9udFRhbGtBdEFsbCcgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCB7IHN1Ym5ldElkcyB9ID0gdnBjLnNlbGVjdFN1Ym5ldHMoeyBzdWJuZXRHcm91cE5hbWU6ICdEb250VGFsa1RvTWUnIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3Qoc3VibmV0SWRzKS50b0VxdWFsKHZwYy5wcml2YXRlU3VibmV0cy5tYXAocyA9PiBzLnN1Ym5ldElkKSk7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3N1Ym5ldE5hbWUgaXMgYW4gYWxpYXMgZm9yIHN1Ym5ldEdyb3VwTmFtZSAoYmFja3dhcmRzIGNvbXBhdCknLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnLCB7XG4gICAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcbiAgICAgICAgICB7IHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDLCBuYW1lOiAnQmxhQmxhJyB9LFxuICAgICAgICAgIHsgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfRUdSRVNTLCBuYW1lOiAnRG9udFRhbGtUb01lJyB9LFxuICAgICAgICAgIHsgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFX0lTT0xBVEVELCBuYW1lOiAnRG9udFRhbGtBdEFsbCcgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCB7IHN1Ym5ldElkcyB9ID0gdnBjLnNlbGVjdFN1Ym5ldHMoeyBzdWJuZXROYW1lOiAnRG9udFRhbGtUb01lJyB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KHN1Ym5ldElkcykudG9FcXVhbCh2cGMucHJpdmF0ZVN1Ym5ldHMubWFwKHMgPT4gcy5zdWJuZXRJZCkpO1xuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdzZWxlY3RpbmcgZGVmYXVsdCBzdWJuZXRzIGluIGEgVlBDIHdpdGggb25seSBpc29sYXRlZCBzdWJuZXRzIHJldHVybnMgdGhlIGlzb2xhdGVkcycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gVnBjLmZyb21WcGNBdHRyaWJ1dGVzKHN0YWNrLCAnVlBDJywge1xuICAgICAgICB2cGNJZDogJ3ZwYy0xMjM0JyxcbiAgICAgICAgYXZhaWxhYmlsaXR5Wm9uZXM6IFsnZHVtbXkxYScsICdkdW1teTFiJywgJ2R1bW15MWMnXSxcbiAgICAgICAgaXNvbGF0ZWRTdWJuZXRJZHM6IFsnaXNvLTEnLCAnaXNvLTInLCAnaXNvLTMnXSxcbiAgICAgICAgaXNvbGF0ZWRTdWJuZXRSb3V0ZVRhYmxlSWRzOiBbJ3J0LTEnLCAncnQtMicsICdydC0zJ10sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3Qgc3VibmV0cyA9IHZwYy5zZWxlY3RTdWJuZXRzKCk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChzdWJuZXRzLnN1Ym5ldElkcykudG9FcXVhbChbJ2lzby0xJywgJ2lzby0yJywgJ2lzby0zJ10pO1xuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdzZWxlY3RpbmcgZGVmYXVsdCBzdWJuZXRzIGluIGEgVlBDIHdpdGggb25seSBwdWJsaWMgc3VibmV0cyByZXR1cm5zIHRoZSBwdWJsaWNzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBWcGMuZnJvbVZwY0F0dHJpYnV0ZXMoc3RhY2ssICdWUEMnLCB7XG4gICAgICAgIHZwY0lkOiAndnBjLTEyMzQnLFxuICAgICAgICBhdmFpbGFiaWxpdHlab25lczogWydkdW1teTFhJywgJ2R1bW15MWInLCAnZHVtbXkxYyddLFxuICAgICAgICBwdWJsaWNTdWJuZXRJZHM6IFsncHViLTEnLCAncHViLTInLCAncHViLTMnXSxcbiAgICAgICAgcHVibGljU3VibmV0Um91dGVUYWJsZUlkczogWydydC0xJywgJ3J0LTInLCAncnQtMyddLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHN1Ym5ldHMgPSB2cGMuc2VsZWN0U3VibmV0cygpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3Qoc3VibmV0cy5zdWJuZXRJZHMpLnRvRXF1YWwoWydwdWItMScsICdwdWItMicsICdwdWItMyddKTtcblxuICAgIH0pO1xuXG4gICAgdGVzdCgnc2VsZWN0aW5nIHN1Ym5ldHMgYnkgbmFtZSBmYWlscyBpZiB0aGUgbmFtZSBpcyB1bmtub3duJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJyk7XG5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIHZwYy5zZWxlY3RTdWJuZXRzKHsgc3VibmV0R3JvdXBOYW1lOiAnVG9vdCcgfSk7XG4gICAgICB9KS50b1Rocm93KC9UaGVyZSBhcmUgbm8gc3VibmV0IGdyb3VwcyB3aXRoIG5hbWUgJ1Rvb3QnIGluIHRoaXMgVlBDLiBBdmFpbGFibGUgbmFtZXM6IFB1YmxpYyxQcml2YXRlLyk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnc2VsZWN0IHN1Ym5ldHMgd2l0aCBheiByZXN0cmljdGlvbicsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZwY05ldHdvcmsnLCB7XG4gICAgICAgIG1heEF6czogMSxcbiAgICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xuICAgICAgICAgIHsgbmFtZTogJ2xiJywgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QVUJMSUMgfSxcbiAgICAgICAgICB7IG5hbWU6ICdhcHAnLCBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9FR1JFU1MgfSxcbiAgICAgICAgICB7IG5hbWU6ICdkYicsIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX0VHUkVTUyB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHsgc3VibmV0SWRzIH0gPSB2cGMuc2VsZWN0U3VibmV0cyh7IG9uZVBlckF6OiB0cnVlIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3Qoc3VibmV0SWRzLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICAgIGV4cGVjdChzdWJuZXRJZHNbMF0pLnRvRXF1YWwodnBjLnByaXZhdGVTdWJuZXRzWzBdLnN1Ym5ldElkKTtcblxuICAgIH0pO1xuXG4gICAgdGVzdCgnZnJvbVZwY0F0dHJpYnV0ZXMgdXNpbmcgdW5rbm93bi1sZW5ndGggbGlzdCB0b2tlbnMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcblxuICAgICAgY29uc3QgdnBjSWQgPSBGbi5pbXBvcnRWYWx1ZSgnbXlWcGNJZCcpO1xuICAgICAgY29uc3QgYXZhaWxhYmlsaXR5Wm9uZXMgPSBGbi5zcGxpdCgnLCcsIEZuLmltcG9ydFZhbHVlKCdteUF2YWlsYWJpbGl0eVpvbmVzJykpO1xuICAgICAgY29uc3QgcHVibGljU3VibmV0SWRzID0gRm4uc3BsaXQoJywnLCBGbi5pbXBvcnRWYWx1ZSgnbXlQdWJsaWNTdWJuZXRJZHMnKSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHZwYyA9IFZwYy5mcm9tVnBjQXR0cmlidXRlcyhzdGFjaywgJ1ZQQycsIHtcbiAgICAgICAgdnBjSWQsXG4gICAgICAgIGF2YWlsYWJpbGl0eVpvbmVzLFxuICAgICAgICBwdWJsaWNTdWJuZXRJZHMsXG4gICAgICB9KTtcblxuICAgICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnUmVzb3VyY2UnLCB7XG4gICAgICAgIHR5cGU6ICdTb21lOjpSZXNvdXJjZScsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBzdWJuZXRJZHM6IHZwYy5zZWxlY3RTdWJuZXRzKCkuc3VibmV0SWRzLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU4gLSBObyBleGNlcHRpb25cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdTb21lOjpSZXNvdXJjZScsIHtcbiAgICAgICAgc3VibmV0SWRzOiB7ICdGbjo6U3BsaXQnOiBbJywnLCB7ICdGbjo6SW1wb3J0VmFsdWUnOiAnbXlQdWJsaWNTdWJuZXRJZHMnIH1dIH0sXG4gICAgICB9KTtcblxuICAgICAgQW5ub3RhdGlvbnMuZnJvbVN0YWNrKHN0YWNrKS5oYXNXYXJuaW5nKCcvVGVzdFN0YWNrL1ZQQycsIFwiZnJvbVZwY0F0dHJpYnV0ZXM6ICdhdmFpbGFiaWxpdHlab25lcycgaXMgYSBsaXN0IHRva2VuOiB0aGUgaW1wb3J0ZWQgVlBDIHdpbGwgbm90IHdvcmsgd2l0aCBjb25zdHJ1Y3RzIHRoYXQgcmVxdWlyZSBhIGxpc3Qgb2Ygc3VibmV0cyBhdCBzeW50aGVzaXMgdGltZS4gVXNlICdWcGMuZnJvbUxvb2t1cCgpJyBvciAnRm4uaW1wb3J0TGlzdFZhbHVlJyBpbnN0ZWFkLlwiKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2Zyb21WcGNBdHRyaWJ1dGVzIHVzaW5nIGZpeGVkLWxlbmd0aCBsaXN0IHRva2VucycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuXG4gICAgICBjb25zdCB2cGNJZCA9IEZuLmltcG9ydFZhbHVlKCdteVZwY0lkJyk7XG4gICAgICBjb25zdCBhdmFpbGFiaWxpdHlab25lcyA9IEZuLmltcG9ydExpc3RWYWx1ZSgnbXlBdmFpbGFiaWxpdHlab25lcycsIDIpO1xuICAgICAgY29uc3QgcHVibGljU3VibmV0SWRzID0gRm4uaW1wb3J0TGlzdFZhbHVlKCdteVB1YmxpY1N1Ym5ldElkcycsIDIpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCB2cGMgPSBWcGMuZnJvbVZwY0F0dHJpYnV0ZXMoc3RhY2ssICdWUEMnLCB7XG4gICAgICAgIHZwY0lkLFxuICAgICAgICBhdmFpbGFiaWxpdHlab25lcyxcbiAgICAgICAgcHVibGljU3VibmV0SWRzLFxuICAgICAgfSk7XG5cbiAgICAgIG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ1Jlc291cmNlJywge1xuICAgICAgICB0eXBlOiAnU29tZTo6UmVzb3VyY2UnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgc3VibmV0SWRzOiB2cGMuc2VsZWN0U3VibmV0cygpLnN1Ym5ldElkcyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOIC0gTm8gZXhjZXB0aW9uXG5cbiAgICAgIGNvbnN0IHB1YmxpY1N1Ym5ldExpc3QgPSB7ICdGbjo6U3BsaXQnOiBbJywnLCB7ICdGbjo6SW1wb3J0VmFsdWUnOiAnbXlQdWJsaWNTdWJuZXRJZHMnIH1dIH07XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnU29tZTo6UmVzb3VyY2UnLCB7XG4gICAgICAgIHN1Ym5ldElkczogW1xuICAgICAgICAgIHsgJ0ZuOjpTZWxlY3QnOiBbMCwgcHVibGljU3VibmV0TGlzdF0gfSxcbiAgICAgICAgICB7ICdGbjo6U2VsZWN0JzogWzEsIHB1YmxpY1N1Ym5ldExpc3RdIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdzZWxlY3QgZXhwbGljaXRseSBkZWZpbmVkIHN1Ym5ldHMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IFZwYy5mcm9tVnBjQXR0cmlidXRlcyhzdGFjaywgJ1ZQQycsIHtcbiAgICAgICAgdnBjSWQ6ICd2cGMtMTIzNCcsXG4gICAgICAgIGF2YWlsYWJpbGl0eVpvbmVzOiBbJ2R1bW15MWEnLCAnZHVtbXkxYicsICdkdW1teTFjJ10sXG4gICAgICAgIHB1YmxpY1N1Ym5ldElkczogWydwdWItMScsICdwdWItMicsICdwdWItMyddLFxuICAgICAgICBwdWJsaWNTdWJuZXRSb3V0ZVRhYmxlSWRzOiBbJ3J0LTEnLCAncnQtMicsICdydC0zJ10sXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHN1Ym5ldCA9IG5ldyBQcml2YXRlU3VibmV0KHN0YWNrLCAnU3VibmV0Jywge1xuICAgICAgICBhdmFpbGFiaWxpdHlab25lOiB2cGMuYXZhaWxhYmlsaXR5Wm9uZXNbMF0sXG4gICAgICAgIGNpZHJCbG9jazogJzEwLjAuMC4wLzI4JyxcbiAgICAgICAgdnBjSWQ6IHZwYy52cGNJZCxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCB7IHN1Ym5ldElkcyB9ID0gdnBjLnNlbGVjdFN1Ym5ldHMoeyBzdWJuZXRzOiBbc3VibmV0XSB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KHN1Ym5ldElkcy5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgICBleHBlY3Qoc3VibmV0SWRzWzBdKS50b0VxdWFsKHN1Ym5ldC5zdWJuZXRJZCk7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3N1Ym5ldCBjcmVhdGVkIGZyb20gc3VibmV0SWQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3Qgc3VibmV0ID0gU3VibmV0LmZyb21TdWJuZXRJZChzdGFjaywgJ3N1Ym5ldDEnLCAncHViLTEnKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KHN1Ym5ldC5zdWJuZXRJZCkudG9FcXVhbCgncHViLTEnKTtcblxuICAgIH0pO1xuXG4gICAgdGVzdCgnUmVmZXJlbmNpbmcgQVogdGhyb3dzIGVycm9yIHdoZW4gc3VibmV0IGNyZWF0ZWQgZnJvbSBzdWJuZXRJZCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBzdWJuZXQgPSBTdWJuZXQuZnJvbVN1Ym5ldElkKHN0YWNrLCAnc3VibmV0MScsICdwdWItMScpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICAgICAgZXhwZWN0KCgpID0+IHN1Ym5ldC5hdmFpbGFiaWxpdHlab25lKS50b1Rocm93KFwiWW91IGNhbm5vdCByZWZlcmVuY2UgYSBTdWJuZXQncyBhdmFpbGFiaWxpdHkgem9uZSBpZiBpdCB3YXMgbm90IHN1cHBsaWVkLiBBZGQgdGhlIGF2YWlsYWJpbGl0eVpvbmUgd2hlbiBpbXBvcnRpbmcgdXNpbmcgU3VibmV0LmZyb21TdWJuZXRBdHRyaWJ1dGVzKClcIik7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ1JlZmVyZW5jaW5nIEFaIHRocm93cyBlcnJvciB3aGVuIHN1Ym5ldCBjcmVhdGVkIGZyb20gYXR0cmlidXRlcyB3aXRob3V0IGF6JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHN1Ym5ldCA9IFN1Ym5ldC5mcm9tU3VibmV0QXR0cmlidXRlcyhzdGFjaywgJ3N1Ym5ldDEnLCB7IHN1Ym5ldElkOiAncHViLTEnLCBhdmFpbGFiaWxpdHlab25lOiAnJyB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KHN1Ym5ldC5zdWJuZXRJZCkudG9FcXVhbCgncHViLTEnKTtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gICAgICBleHBlY3QoKCkgPT4gc3VibmV0LmF2YWlsYWJpbGl0eVpvbmUpLnRvVGhyb3coXCJZb3UgY2Fubm90IHJlZmVyZW5jZSBhIFN1Ym5ldCdzIGF2YWlsYWJpbGl0eSB6b25lIGlmIGl0IHdhcyBub3Qgc3VwcGxpZWQuIEFkZCB0aGUgYXZhaWxhYmlsaXR5Wm9uZSB3aGVuIGltcG9ydGluZyB1c2luZyBTdWJuZXQuZnJvbVN1Ym5ldEF0dHJpYnV0ZXMoKVwiKTtcblxuICAgIH0pO1xuXG4gICAgdGVzdCgnQVogaGF2ZSB2YWx1ZSB3aGVuIHN1Ym5ldCBjcmVhdGVkIGZyb20gYXR0cmlidXRlcyB3aXRoIGF6JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHN1Ym5ldCA9IFN1Ym5ldC5mcm9tU3VibmV0QXR0cmlidXRlcyhzdGFjaywgJ3N1Ym5ldDEnLCB7IHN1Ym5ldElkOiAncHViLTEnLCBhdmFpbGFiaWxpdHlab25lOiAnYXotMTIzNCcgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChzdWJuZXQuc3VibmV0SWQpLnRvRXF1YWwoJ3B1Yi0xJyk7XG4gICAgICBleHBlY3Qoc3VibmV0LmF2YWlsYWJpbGl0eVpvbmUpLnRvRXF1YWwoJ2F6LTEyMzQnKTtcblxuICAgIH0pO1xuXG4gICAgdGVzdCgnQ2FuIHNlbGVjdCBzdWJuZXRzIGJ5IHR5cGUgYW5kIEFaJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJywge1xuICAgICAgICBtYXhBenM6IDMsXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IEludGVyZmFjZVZwY0VuZHBvaW50KHN0YWNrLCAnVlBDIEVuZHBvaW50Jywge1xuICAgICAgICB2cGMsXG4gICAgICAgIHByaXZhdGVEbnNFbmFibGVkOiBmYWxzZSxcbiAgICAgICAgc2VydmljZTogbmV3IEludGVyZmFjZVZwY0VuZHBvaW50U2VydmljZSgnY29tLmFtYXpvbmF3cy52cGNlLnVzLWVhc3QtMS52cGNlLXN2Yy11dWRkbHJscmJhc3RydHN2YycsIDQ0MyksXG4gICAgICAgIHN1Ym5ldHM6IHtcbiAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9FR1JFU1MsXG4gICAgICAgICAgYXZhaWxhYmlsaXR5Wm9uZXM6IFsnZHVtbXkxYScsICdkdW1teTFjJ10sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpWUENFbmRwb2ludCcsIHtcbiAgICAgICAgU2VydmljZU5hbWU6ICdjb20uYW1hem9uYXdzLnZwY2UudXMtZWFzdC0xLnZwY2Utc3ZjLXV1ZGRscmxyYmFzdHJ0c3ZjJyxcbiAgICAgICAgU3VibmV0SWRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnVlBDUHJpdmF0ZVN1Ym5ldDFTdWJuZXQ4QkNBMTBFMCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZWY6ICdWUENQcml2YXRlU3VibmV0M1N1Ym5ldDNFRENENDU3JyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ1N1Ym5ldFNlbGVjdGlvbiBmaWx0ZXJlZCBvbiBheiB1c2VzIGRlZmF1bHQgc3VibmV0VHlwZSB3aGVuIG5vIHN1Ym5ldCB0eXBlIHNwZWNpZmllZCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycsIHtcbiAgICAgICAgbWF4QXpzOiAzLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBJbnRlcmZhY2VWcGNFbmRwb2ludChzdGFjaywgJ1ZQQyBFbmRwb2ludCcsIHtcbiAgICAgICAgdnBjLFxuICAgICAgICBzZXJ2aWNlOiBuZXcgSW50ZXJmYWNlVnBjRW5kcG9pbnRTZXJ2aWNlKCdjb20uYW1hem9uYXdzLnZwY2UudXMtZWFzdC0xLnZwY2Utc3ZjLXV1ZGRscmxyYmFzdHJ0c3ZjJywgNDQzKSxcbiAgICAgICAgc3VibmV0czoge1xuICAgICAgICAgIGF2YWlsYWJpbGl0eVpvbmVzOiBbJ2R1bW15MWEnLCAnZHVtbXkxYyddLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6VlBDRW5kcG9pbnQnLCB7XG4gICAgICAgIFNlcnZpY2VOYW1lOiAnY29tLmFtYXpvbmF3cy52cGNlLnVzLWVhc3QtMS52cGNlLXN2Yy11dWRkbHJscmJhc3RydHN2YycsXG4gICAgICAgIFN1Ym5ldElkczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlZjogJ1ZQQ1ByaXZhdGVTdWJuZXQxU3VibmV0OEJDQTEwRTAnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnVlBDUHJpdmF0ZVN1Ym5ldDNTdWJuZXQzRURDRDQ1NycsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgfSk7XG4gICAgdGVzdCgnU3VibmV0U2VsZWN0aW9uIGRvZXNudCB0aHJvdyBlcnJvciB3aGVuIHNlbGVjdGluZyBpbXBvcnRlZCBzdWJuZXRzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KCgpID0+IHZwYy5zZWxlY3RTdWJuZXRzKHtcbiAgICAgICAgc3VibmV0czogW1xuICAgICAgICAgIFN1Ym5ldC5mcm9tU3VibmV0SWQoc3RhY2ssICdTdWJuZXQnLCAnc3ViLTEnKSxcbiAgICAgICAgXSxcbiAgICAgIH0pKS5ub3QudG9UaHJvdygpO1xuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjYW4gZmlsdGVyIGJ5IHNpbmdsZSBJUCBhZGRyZXNzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG5cbiAgICAgIC8vIElQIHNwYWNlIGlzIHNwbGl0IGludG8gNiBwaWVjZXMsIG9uZSBwdWJsaWMvb25lIHByaXZhdGUgcGVyIEFaXG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJywge1xuICAgICAgICBpcEFkZHJlc3NlczogSXBBZGRyZXNzZXMuY2lkcignMTAuMC4wLjAvMTYnKSxcbiAgICAgICAgbWF4QXpzOiAzLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIC8vIFdlIHdhbnQgdG8gcGxhY2UgdGhpcyBiYXN0aW9uIGhvc3QgaW4gdGhlIHNhbWUgc3VibmV0IGFzIHRoaXMgSVB2NFxuICAgICAgLy8gYWRkcmVzcy5cbiAgICAgIG5ldyBCYXN0aW9uSG9zdExpbnV4KHN0YWNrLCAnQmFzdGlvbicsIHtcbiAgICAgICAgdnBjLFxuICAgICAgICBzdWJuZXRTZWxlY3Rpb246IHtcbiAgICAgICAgICBzdWJuZXRGaWx0ZXJzOiBbU3VibmV0RmlsdGVyLmNvbnRhaW5zSXBBZGRyZXNzZXMoWycxMC4wLjE2MC4wJ10pXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICAvLyAxMC4wLjE2MC4wLzE5IGlzIHRoZSB0aGlyZCBzdWJuZXQsIHNlcXVlbnRpYWxseSwgaWYgeW91IHNwbGl0XG4gICAgICAvLyAxMC4wLjAuMC8xNiBpbnRvIDYgcGllY2VzXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6Okluc3RhbmNlJywge1xuICAgICAgICBTdWJuZXRJZDoge1xuICAgICAgICAgIFJlZjogJ1ZQQ1ByaXZhdGVTdWJuZXQzU3VibmV0M0VEQ0Q0NTcnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiBmaWx0ZXIgYnkgbXVsdGlwbGUgSVAgYWRkcmVzc2VzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG5cbiAgICAgIC8vIElQIHNwYWNlIGlzIHNwbGl0IGludG8gNiBwaWVjZXMsIG9uZSBwdWJsaWMvb25lIHByaXZhdGUgcGVyIEFaXG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJywge1xuICAgICAgICBpcEFkZHJlc3NlczogSXBBZGRyZXNzZXMuY2lkcignMTAuMC4wLjAvMTYnKSxcbiAgICAgICAgbWF4QXpzOiAzLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIC8vIFdlIHdhbnQgdG8gcGxhY2UgdGhpcyBlbmRwb2ludCBpbiB0aGUgc2FtZSBzdWJuZXRzIGFzIHRoZXNlIElQdjRcbiAgICAgIC8vIGFkZHJlc3MuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgSW50ZXJmYWNlVnBjRW5kcG9pbnQoc3RhY2ssICdWUEMgRW5kcG9pbnQnLCB7XG4gICAgICAgIHZwYyxcbiAgICAgICAgc2VydmljZTogbmV3IEludGVyZmFjZVZwY0VuZHBvaW50U2VydmljZSgnY29tLmFtYXpvbmF3cy52cGNlLnVzLWVhc3QtMS52cGNlLXN2Yy11dWRkbHJscmJhc3RydHN2YycsIDQ0MyksXG4gICAgICAgIHN1Ym5ldHM6IHtcbiAgICAgICAgICBzdWJuZXRGaWx0ZXJzOiBbU3VibmV0RmlsdGVyLmNvbnRhaW5zSXBBZGRyZXNzZXMoWycxMC4wLjk2LjAnLCAnMTAuMC4xNjAuMCddKV0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpWUENFbmRwb2ludCcsIHtcbiAgICAgICAgU2VydmljZU5hbWU6ICdjb20uYW1hem9uYXdzLnZwY2UudXMtZWFzdC0xLnZwY2Utc3ZjLXV1ZGRscmxyYmFzdHJ0c3ZjJyxcbiAgICAgICAgU3VibmV0SWRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnVlBDUHJpdmF0ZVN1Ym5ldDFTdWJuZXQ4QkNBMTBFMCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZWY6ICdWUENQcml2YXRlU3VibmV0M1N1Ym5ldDNFRENENDU3JyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiBmaWx0ZXIgYnkgU3VibmV0IElkcycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuXG4gICAgICBjb25zdCB2cGMgPSBWcGMuZnJvbVZwY0F0dHJpYnV0ZXMoc3RhY2ssICdWUEMnLCB7XG4gICAgICAgIHZwY0lkOiAndnBjLTEyMzQnLFxuICAgICAgICB2cGNDaWRyQmxvY2s6ICcxOTIuMTY4LjAuMC8xNicsXG4gICAgICAgIGF2YWlsYWJpbGl0eVpvbmVzOiBbJ2R1bW15MWEnLCAnZHVtbXkxYicsICdkdW1teTFjJ10sXG4gICAgICAgIHByaXZhdGVTdWJuZXRJZHM6IFsncHJpdi0xJywgJ3ByaXYtMicsICdwcml2LTMnXSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgSW50ZXJmYWNlVnBjRW5kcG9pbnQoc3RhY2ssICdWUEMgRW5kcG9pbnQnLCB7XG4gICAgICAgIHZwYyxcbiAgICAgICAgc2VydmljZTogbmV3IEludGVyZmFjZVZwY0VuZHBvaW50U2VydmljZSgnY29tLmFtYXpvbmF3cy52cGNlLnVzLWVhc3QtMS52cGNlLXN2Yy11dWRkbHJscmJhc3RydHN2YycsIDQ0MyksXG4gICAgICAgIHN1Ym5ldHM6IHtcbiAgICAgICAgICBzdWJuZXRGaWx0ZXJzOiBbU3VibmV0RmlsdGVyLmJ5SWRzKFsncHJpdi0xJywgJ3ByaXYtMiddKV0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpWUENFbmRwb2ludCcsIHtcbiAgICAgICAgU2VydmljZU5hbWU6ICdjb20uYW1hem9uYXdzLnZwY2UudXMtZWFzdC0xLnZwY2Utc3ZjLXV1ZGRscmxyYmFzdHJ0c3ZjJyxcbiAgICAgICAgU3VibmV0SWRzOiBbJ3ByaXYtMScsICdwcml2LTInXSxcbiAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjYW4gZmlsdGVyIGJ5IFN1Ym5ldCBJZHMgdmlhIHNlbGVjdFN1Ym5ldHMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcblxuICAgICAgY29uc3QgdnBjID0gVnBjLmZyb21WcGNBdHRyaWJ1dGVzKHN0YWNrLCAnVlBDJywge1xuICAgICAgICB2cGNJZDogJ3ZwYy0xMjM0JyxcbiAgICAgICAgdnBjQ2lkckJsb2NrOiAnMTkyLjE2OC4wLjAvMTYnLFxuICAgICAgICBhdmFpbGFiaWxpdHlab25lczogWydkdW1teTFhJywgJ2R1bW15MWInLCAnZHVtbXkxYyddLFxuICAgICAgICBwcml2YXRlU3VibmV0SWRzOiBbJ3N1Ym5ldC0xJywgJ3N1Ym5ldC0yJywgJ3N1Ym5ldC0zJ10sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3Qgc3VibmV0cyA9IHZwYy5zZWxlY3RTdWJuZXRzKHtcbiAgICAgICAgc3VibmV0RmlsdGVyczogW1N1Ym5ldEZpbHRlci5ieUlkcyhbJ3N1Ym5ldC0xJ10pXSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3Qoc3VibmV0cy5zdWJuZXRJZHMubGVuZ3RoKS50b0VxdWFsKDEpO1xuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjYW4gZmlsdGVyIGJ5IENpZHIgTmV0bWFzaycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZwY05ldHdvcmsnLCB7XG4gICAgICAgIG1heEF6czogMSxcbiAgICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xuICAgICAgICAgIHsgbmFtZTogJ25vcm1hbFNuMScsIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDLCBjaWRyTWFzazogMjAgfSxcbiAgICAgICAgICB7IG5hbWU6ICdub3JtYWxTbjInLCBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBVQkxJQywgY2lkck1hc2s6IDIwIH0sXG4gICAgICAgICAgeyBuYW1lOiAnc21hbGxTbicsIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDLCBjaWRyTWFzazogMjggfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCB7IHN1Ym5ldElkcyB9ID0gdnBjLnNlbGVjdFN1Ym5ldHMoXG4gICAgICAgIHsgc3VibmV0RmlsdGVyczogW1N1Ym5ldEZpbHRlci5ieUNpZHJNYXNrKDIwKV0gfSxcbiAgICAgICk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChzdWJuZXRJZHMubGVuZ3RoKS50b0VxdWFsKDIpO1xuICAgICAgY29uc3QgZXhwZWN0ZWQgPSB2cGMucHVibGljU3VibmV0cy5maWx0ZXIocyA9PiBzLmlwdjRDaWRyQmxvY2suZW5kc1dpdGgoJy8yMCcpKTtcbiAgICAgIGV4cGVjdChzdWJuZXRJZHMpLnRvRXF1YWwoZXhwZWN0ZWQubWFwKHMgPT4gcy5zdWJuZXRJZCkpO1xuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCd0ZXN0cyByb3V0ZXIgdHlwZXMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWcGMnKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgKHZwYy5wdWJsaWNTdWJuZXRzWzBdIGFzIFN1Ym5ldCkuYWRkUm91dGUoJ1RyYW5zaXRSb3V0ZScsIHtcbiAgICAgICAgcm91dGVyVHlwZTogUm91dGVyVHlwZS5UUkFOU0lUX0dBVEVXQVksXG4gICAgICAgIHJvdXRlcklkOiAndHJhbnNpdC1pZCcsXG4gICAgICB9KTtcbiAgICAgICh2cGMucHVibGljU3VibmV0c1swXSBhcyBTdWJuZXQpLmFkZFJvdXRlKCdDYXJyaWVyUm91dGUnLCB7XG4gICAgICAgIHJvdXRlclR5cGU6IFJvdXRlclR5cGUuQ0FSUklFUl9HQVRFV0FZLFxuICAgICAgICByb3V0ZXJJZDogJ2NhcnJpZXItZ2F0ZXdheS1pZCcsXG4gICAgICB9KTtcbiAgICAgICh2cGMucHVibGljU3VibmV0c1swXSBhcyBTdWJuZXQpLmFkZFJvdXRlKCdMb2NhbEdhdGV3YXlSb3V0ZScsIHtcbiAgICAgICAgcm91dGVyVHlwZTogUm91dGVyVHlwZS5MT0NBTF9HQVRFV0FZLFxuICAgICAgICByb3V0ZXJJZDogJ2xvY2FsLWdhdGV3YXktaWQnLFxuICAgICAgfSk7XG4gICAgICAodnBjLnB1YmxpY1N1Ym5ldHNbMF0gYXMgU3VibmV0KS5hZGRSb3V0ZSgnVnBjRW5kcG9pbnRSb3V0ZScsIHtcbiAgICAgICAgcm91dGVyVHlwZTogUm91dGVyVHlwZS5WUENfRU5EUE9JTlQsXG4gICAgICAgIHJvdXRlcklkOiAndnBjLWVuZHBvaW50LWlkJyxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlJvdXRlJywge1xuICAgICAgICBUcmFuc2l0R2F0ZXdheUlkOiAndHJhbnNpdC1pZCcsXG4gICAgICB9KTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6Um91dGUnLCB7XG4gICAgICAgIExvY2FsR2F0ZXdheUlkOiAnbG9jYWwtZ2F0ZXdheS1pZCcsXG4gICAgICB9KTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6Um91dGUnLCB7XG4gICAgICAgIENhcnJpZXJHYXRld2F5SWQ6ICdjYXJyaWVyLWdhdGV3YXktaWQnLFxuICAgICAgfSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlJvdXRlJywge1xuICAgICAgICBWcGNFbmRwb2ludElkOiAndnBjLWVuZHBvaW50LWlkJyxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnVXNpbmcgcmVzZXJ2ZWQgYXpzJywgKCkgPT4ge1xuICAgIHRlc3QuZWFjaChbXG4gICAgICBbeyBtYXhBenM6IDIsIHJlc2VydmVkQXpzOiAxIH0sIHsgbWF4QXpzOiAzIH1dLFxuICAgICAgW3sgbWF4QXpzOiAyLCByZXNlcnZlZEF6czogMiB9LCB7IG1heEF6czogMywgcmVzZXJ2ZWRBenM6IDEgfV0sXG4gICAgICBbeyBtYXhBenM6IDIsIHJlc2VydmVkQXpzOiAxLCBzdWJuZXRDb25maWd1cmF0aW9uOiBbeyBjaWRyTWFzazogMjIsIG5hbWU6ICdQdWJsaWMnLCBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBVQkxJQyB9LCB7IGNpZHJNYXNrOiAyMywgbmFtZTogJ1ByaXZhdGUnLCBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9FR1JFU1MgfV0gfSxcbiAgICAgICAgeyBtYXhBenM6IDMsIHN1Ym5ldENvbmZpZ3VyYXRpb246IFt7IGNpZHJNYXNrOiAyMiwgbmFtZTogJ1B1YmxpYycsIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDIH0sIHsgY2lkck1hc2s6IDIzLCBuYW1lOiAnUHJpdmF0ZScsIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX0VHUkVTUyB9XSB9XSxcbiAgICAgIFt7IG1heEF6czogMiwgcmVzZXJ2ZWRBenM6IDEsIHN1Ym5ldENvbmZpZ3VyYXRpb246IFt7IGNpZHJNYXNrOiAyMiwgbmFtZTogJ1B1YmxpYycsIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDIH0sIHsgY2lkck1hc2s6IDIzLCBuYW1lOiAnUHJpdmF0ZScsIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX0VHUkVTUywgcmVzZXJ2ZWQ6IHRydWUgfV0gfSxcbiAgICAgICAgeyBtYXhBenM6IDMsIHN1Ym5ldENvbmZpZ3VyYXRpb246IFt7IGNpZHJNYXNrOiAyMiwgbmFtZTogJ1B1YmxpYycsIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDIH0sIHsgY2lkck1hc2s6IDIzLCBuYW1lOiAnUHJpdmF0ZScsIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX0VHUkVTUywgcmVzZXJ2ZWQ6IHRydWUgfV0gfV0sXG4gICAgICBbeyBtYXhBenM6IDIsIHJlc2VydmVkQXpzOiAxLCBpcEFkZHJlc3NlczogSXBBZGRyZXNzZXMuY2lkcignMTkyLjE2OC4wLjAvMTYnKSB9LCB7IG1heEF6czogMywgaXBBZGRyZXNzZXM6IElwQWRkcmVzc2VzLmNpZHIoJzE5Mi4xNjguMC4wLzE2JykgfV0sXG4gICAgICBbeyBhdmFpbGFiaWxpdHlab25lczogWydkdW1teTFhJywgJ2R1bW15MWInXSwgcmVzZXJ2ZWRBenM6IDEgfSwgeyBhdmFpbGFiaWxpdHlab25lczogWydkdW1teTFhJywgJ2R1bW15MWInLCAnZHVtbXkxYyddIH1dLFxuICAgIF0pKCdzdWJuZXRzIHNob3VsZCByZW1haW4gdGhlIHNhbWUgZ29pbmcgZnJvbSAlcCB0byAlcCcsIChwcm9wc1dpdGhSZXNlcnZlZEF6LCBwcm9wc1dpdGhVc2VkUmVzZXJ2ZWRBeikgPT4ge1xuICAgICAgY29uc3Qgc3RhY2tXaXRoUmVzZXJ2ZWRBeiA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgY29uc3Qgc3RhY2tXaXRoVXNlZFJlc2VydmVkQXogPSBnZXRUZXN0U3RhY2soKTtcblxuICAgICAgbmV3IFZwYyhzdGFja1dpdGhSZXNlcnZlZEF6LCAnVnBjJywgcHJvcHNXaXRoUmVzZXJ2ZWRBeik7XG4gICAgICBuZXcgVnBjKHN0YWNrV2l0aFVzZWRSZXNlcnZlZEF6LCAnVnBjJywgcHJvcHNXaXRoVXNlZFJlc2VydmVkQXopO1xuXG4gICAgICBjb25zdCB0ZW1wbGF0ZVdpdGhSZXNlcnZlZEF6ID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrV2l0aFJlc2VydmVkQXopO1xuICAgICAgY29uc3QgdGVtcGxhdGVXaXRoVXNlZFJlc2VydmVkQXogPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2tXaXRoVXNlZFJlc2VydmVkQXopO1xuXG4gICAgICBjb25zdCBzdWJuZXRzT2ZUZW1wbGF0ZVdpdGhSZXNlcnZlZEF6ID0gdGVtcGxhdGVXaXRoUmVzZXJ2ZWRBei5maW5kUmVzb3VyY2VzKCdBV1M6OkVDMjo6U3VibmV0Jyk7XG4gICAgICBjb25zdCBzdWJuZXRzT2ZUZW1wbGF0ZVdpdGhVc2VkUmVzZXJ2ZWRBeiA9IHRlbXBsYXRlV2l0aFVzZWRSZXNlcnZlZEF6LmZpbmRSZXNvdXJjZXMoJ0FXUzo6RUMyOjpTdWJuZXQnKTtcbiAgICAgIGZvciAoY29uc3QgW2xvZ2ljYWxJZCwgc3VibmV0T2ZUZW1wbGF0ZVdpdGhSZXNlcnZlZEF6XSBvZiBPYmplY3QuZW50cmllcyhzdWJuZXRzT2ZUZW1wbGF0ZVdpdGhSZXNlcnZlZEF6KSkge1xuICAgICAgICBjb25zdCBzdWJuZXRPZlRlbXBsYXRlV2l0aFVzZWRSZXNlcnZlZEF6ID0gc3VibmV0c09mVGVtcGxhdGVXaXRoVXNlZFJlc2VydmVkQXpbbG9naWNhbElkXTtcbiAgICAgICAgZXhwZWN0KHN1Ym5ldE9mVGVtcGxhdGVXaXRoVXNlZFJlc2VydmVkQXopLnRvRXF1YWwoc3VibmV0T2ZUZW1wbGF0ZVdpdGhSZXNlcnZlZEF6KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2NhbiByZWZlcmVuY2UgdnBjRW5kcG9pbnREbnNFbnRyaWVzIGFjcm9zcyBzdGFja3MnLCAoKSA9PiB7XG4gICAgdGVzdCgnY2FuIHJlZmVyZW5jZSBhbiBhY3R1YWwgc3RyaW5nIGxpc3QgYWNyb3NzIHN0YWNrcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjayhhcHAsICdTdGFjazEnKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2sxLCAnVnBjJyk7XG4gICAgICBjb25zdCBlbmRwb2ludCA9IG5ldyBJbnRlcmZhY2VWcGNFbmRwb2ludChzdGFjazEsICdpbnRlcmZhY2VWcGNFbmRwb2ludCcsIHtcbiAgICAgICAgdnBjLFxuICAgICAgICBzZXJ2aWNlOiBJbnRlcmZhY2VWcGNFbmRwb2ludEF3c1NlcnZpY2UuU0VDUkVUU19NQU5BR0VSLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHN0YWNrMiA9IG5ldyBTdGFjayhhcHAsICdTdGFjazInKTtcbiAgICAgIG5ldyBDZm5PdXRwdXQoc3RhY2syLCAnZW5kcG9pbnQnLCB7XG4gICAgICAgIHZhbHVlOiBGbi5zZWxlY3QoMCwgZW5kcG9pbnQudnBjRW5kcG9pbnREbnNFbnRyaWVzKSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuICAgICAgY29uc3QgdGVtcGxhdGUxID0gYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUoc3RhY2sxLnN0YWNrTmFtZSkudGVtcGxhdGU7XG4gICAgICBjb25zdCB0ZW1wbGF0ZTIgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjazIuc3RhY2tOYW1lKS50ZW1wbGF0ZTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KHRlbXBsYXRlMSkudG9NYXRjaE9iamVjdCh7XG4gICAgICAgIE91dHB1dHM6IHtcbiAgICAgICAgICBFeHBvcnRzT3V0cHV0Rm5HZXRBdHRpbnRlcmZhY2VWcGNFbmRwb2ludDg5Qzk5OTQ1RG5zRW50cmllc0IxODcyRjdBOiB7XG4gICAgICAgICAgICBWYWx1ZToge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgJ3x8Jywge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAgICdpbnRlcmZhY2VWcGNFbmRwb2ludDg5Qzk5OTQ1JyxcbiAgICAgICAgICAgICAgICAgICAgJ0Ruc0VudHJpZXMnLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEV4cG9ydDogeyBOYW1lOiAnU3RhY2sxOkV4cG9ydHNPdXRwdXRGbkdldEF0dGludGVyZmFjZVZwY0VuZHBvaW50ODlDOTk5NDVEbnNFbnRyaWVzQjE4NzJGN0EnIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3QodGVtcGxhdGUyKS50b01hdGNoT2JqZWN0KHtcbiAgICAgICAgT3V0cHV0czoge1xuICAgICAgICAgIGVuZHBvaW50OiB7XG4gICAgICAgICAgICBWYWx1ZToge1xuICAgICAgICAgICAgICAnRm46OlNlbGVjdCc6IFtcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdGbjo6U3BsaXQnOiBbXG4gICAgICAgICAgICAgICAgICAgICd8fCcsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAnRm46OkltcG9ydFZhbHVlJzogJ1N0YWNrMTpFeHBvcnRzT3V0cHV0Rm5HZXRBdHRpbnRlcmZhY2VWcGNFbmRwb2ludDg5Qzk5OTQ1RG5zRW50cmllc0IxODcyRjdBJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5mdW5jdGlvbiBnZXRUZXN0U3RhY2soKTogU3RhY2sge1xuICByZXR1cm4gbmV3IFN0YWNrKHVuZGVmaW5lZCwgJ1Rlc3RTdGFjaycsIHsgZW52OiB7IGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLCByZWdpb246ICd1cy1lYXN0LTEnIH0gfSk7XG59XG5cbmZ1bmN0aW9uIHRvQ2ZuVGFncyh0YWdzOiBhbnkpOiBBcnJheTx7S2V5OiBzdHJpbmcsIFZhbHVlOiBzdHJpbmd9PiB7XG4gIHJldHVybiBPYmplY3Qua2V5cyh0YWdzKS5tYXAoIGtleSA9PiB7XG4gICAgcmV0dXJuIHsgS2V5OiBrZXksIFZhbHVlOiB0YWdzW2tleV0gfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGhhc1RhZ3MoZXhwZWN0ZWRUYWdzOiBBcnJheTx7S2V5OiBzdHJpbmcsIFZhbHVlOiBzdHJpbmd9Pikge1xuICByZXR1cm4ge1xuICAgIFByb3BlcnRpZXM6IHtcbiAgICAgIFRhZ3M6IE1hdGNoLmFycmF5V2l0aChleHBlY3RlZFRhZ3MpLFxuICAgIH0sXG4gIH07XG59XG4iXX0=