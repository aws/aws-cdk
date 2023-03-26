"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('vpc', () => {
    describe('When creating a VPC', () => {
        cdk_build_tools_1.testDeprecated('SubnetType.PRIVATE_WITH_NAT is equivalent to SubnetType.PRIVATE_WITH_EGRESS', () => {
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
        cdk_build_tools_1.testDeprecated('SubnetType.PRIVATE is equivalent to SubnetType.PRIVATE_WITH_NAT', () => {
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
        cdk_build_tools_1.testDeprecated('SubnetType.ISOLATED is equivalent to SubnetType.PRIVATE_ISOLATED', () => {
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
        cdk_build_tools_1.testDeprecated('natGateways = 0 throws if PRIVATE_WITH_NAT subnets configured', () => {
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
        cdk_build_tools_1.testDeprecated('can configure Security Groups of NAT instances with allowAllTraffic false', () => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnBjLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ2cGMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUFtRTtBQUNuRSw4REFBMEQ7QUFDMUQsd0NBQW1GO0FBQ25GLGdDQTJCZ0I7QUFFaEIsUUFBUSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUU7SUFDbkIsUUFBUSxDQUFDLHFCQUFxQixFQUFFLEdBQUcsRUFBRTtRQUVuQyxnQ0FBYyxDQUFDLDZFQUE2RSxFQUFFLEdBQUcsRUFBRTtZQUVqRyxNQUFNLE1BQU0sR0FBRyxZQUFZLEVBQUUsQ0FBQztZQUM5QixNQUFNLE1BQU0sR0FBRyxZQUFZLEVBQUUsQ0FBQztZQUM5QixJQUFJLFNBQUcsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFO2dCQUN4QixtQkFBbUIsRUFBRTtvQkFDbkI7d0JBQ0UsVUFBVSxFQUFFLGdCQUFVLENBQUMsZ0JBQWdCO3dCQUN2QyxJQUFJLEVBQUUsUUFBUTtxQkFDZjtvQkFDRDt3QkFDRSxVQUFVLEVBQUUsZ0JBQVUsQ0FBQyxNQUFNO3dCQUM3QixJQUFJLEVBQUUsUUFBUTtxQkFDZjtpQkFDRjthQUNGLENBQUMsQ0FBQztZQUVILElBQUksU0FBRyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUU7Z0JBQ3hCLG1CQUFtQixFQUFFO29CQUNuQjt3QkFDRSxVQUFVLEVBQUUsZ0JBQVUsQ0FBQyxtQkFBbUI7d0JBQzFDLElBQUksRUFBRSxRQUFRO3FCQUNmO29CQUNEO3dCQUNFLFVBQVUsRUFBRSxnQkFBVSxDQUFDLE1BQU07d0JBQzdCLElBQUksRUFBRSxRQUFRO3FCQUNmO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsTUFBTSxFQUFFLEdBQUcscUJBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdEMsTUFBTSxFQUFFLEdBQUcscUJBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFdEMsTUFBTSxDQUFDLEVB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QUMvRSxNQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUFDLFFBQVEsS0FBSyxPQUFPLENBQUMsQ0FBQztZQUMvRSxNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUFDLFFBQVEsS0FBSyxPQUFPLENBQUMsQ0FBQztZQUNqRixNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUFDLFFBQVEsS0FBSyxPQUFPLENBQUMsQ0FBQztZQUNqRixNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUFDLFFBQVEsS0FBSyxPQUFPLENBQUMsQ0FBQztZQUNqRixNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUFDLFFBQVEsS0FBSyxPQUFPLENBQUMsQ0FBQztZQUNuRixNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUFDLFFBQVEsS0FBSyxPQUFPLENBQUMsQ0FBQztZQUNuRixNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUFDLFFBQVEsS0FBSyxPQUFPLENBQUMsQ0FBQztZQUVuRixPQUFPO1lBQ1AsTUFBTSxDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDdEQsTUFBTSxDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQyxPQUFPLENB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Q0o7NENBQ0UsaUJBQWlCLEVBQUUsNEVBQTRFO3lDQUNoRztxQ0FDRjtpQ0FDRjs2QkFDRjt5QkFDRjtxQkFDRjtpQkFDRjthQUNGLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILFNBQVMsWUFBWTtJQUNuQixPQUFPLElBQUksWUFBSyxDQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDdEcsQ0FBQztBQUVELFNBQVMsU0FBUyxDQUFDLElBQVM7SUFDMUIsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBRSxHQUFHLENBQUMsRUFBRTtRQUNsQyxPQUFPLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7SUFDeEMsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsU0FBUyxPQUFPLENBQUMsWUFBaUQ7SUFDaEUsT0FBTztRQUNMLFVBQVUsRUFBRTtZQUNWLElBQUksRUFBRSxrQkFBSyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUM7U0FDcEM7S0FDRixDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFubm90YXRpb25zLCBNYXRjaCwgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCB7IHRlc3REZXByZWNhdGVkIH0gZnJvbSAnQGF3cy1jZGsvY2RrLWJ1aWxkLXRvb2xzJztcbmltcG9ydCB7IEFwcCwgQ2ZuT3V0cHV0LCBDZm5SZXNvdXJjZSwgRm4sIExhenksIFN0YWNrLCBUYWdzIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQge1xuICBBY2xDaWRyLFxuICBBY2xUcmFmZmljLFxuICBCYXN0aW9uSG9zdExpbnV4LFxuICBDZm5TdWJuZXQsXG4gIENmblZQQyxcbiAgU3VibmV0RmlsdGVyLFxuICBEZWZhdWx0SW5zdGFuY2VUZW5hbmN5LFxuICBHZW5lcmljTGludXhJbWFnZSxcbiAgSW5zdGFuY2VUeXBlLFxuICBJbnRlcmZhY2VWcGNFbmRwb2ludCxcbiAgSW50ZXJmYWNlVnBjRW5kcG9pbnRTZXJ2aWNlLFxuICBOYXRQcm92aWRlcixcbiAgTmF0VHJhZmZpY0RpcmVjdGlvbixcbiAgTmV0d29ya0FjbCxcbiAgTmV0d29ya0FjbEVudHJ5LFxuICBQZWVyLFxuICBQb3J0LFxuICBQcml2YXRlU3VibmV0LFxuICBQdWJsaWNTdWJuZXQsXG4gIFJvdXRlclR5cGUsXG4gIFN1Ym5ldCxcbiAgU3VibmV0VHlwZSxcbiAgVHJhZmZpY0RpcmVjdGlvbixcbiAgVnBjLFxuICBJcEFkZHJlc3NlcyxcbiAgSW50ZXJmYWNlVnBjRW5kcG9pbnRBd3NTZXJ2aWNlLFxufSBmcm9tICcuLi9saWInO1xuXG5kZXNjcmliZSgndnBjJywgKCkgPT4ge1xuICBkZXNjcmliZSgnV2hlbiBjcmVhdGluZyBhIFZQQycsICgpID0+IHtcblxuICAgIHRlc3REZXByZWNhdGVkKCdTdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9OQVQgaXMgZXF1aXZhbGVudCB0byBTdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9FR1JFU1MnLCAoKSA9PiB7XG5cbiAgICAgIGNvbnN0IHN0YWNrMSA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgY29uc3Qgc3RhY2syID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBuZXcgVnBjKHN0YWNrMSwgJ1RoZVZQQycsIHtcbiAgICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX05BVCxcbiAgICAgICAgICAgIG5hbWU6ICdzdWJuZXQnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QVUJMSUMsXG4gICAgICAgICAgICBuYW1lOiAncHVibGljJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIG5ldyBWcGMoc3RhY2syLCAnVGhlVlBDJywge1xuICAgICAgICBzdWJuZXRDb25maWd1cmF0aW9uOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfRUdSRVNTLFxuICAgICAgICAgICAgbmFtZTogJ3N1Ym5ldCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBVQkxJQyxcbiAgICAgICAgICAgIG5hbWU6ICdwdWJsaWMnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgdDEgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2sxKTtcbiAgICAgIGNvbnN0IHQyID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrMik7XG5cbiAgICAgIGV4cGVjdCh0MS50b0pTT04oKSkudG9FcXVhbCh0Mi50b0pTT04oKSk7XG5cbiAgICB9KTtcblxuICAgIHRlc3REZXByZWNhdGVkKCdTdWJuZXRUeXBlLlBSSVZBVEUgaXMgZXF1aXZhbGVudCB0byBTdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9OQVQnLCAoKSA9PiB7XG5cbiAgICAgIGNvbnN0IHN0YWNrMSA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgY29uc3Qgc3RhY2syID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBuZXcgVnBjKHN0YWNrMSwgJ1RoZVZQQycsIHtcbiAgICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFJJVkFURSxcbiAgICAgICAgICAgIG5hbWU6ICdzdWJuZXQnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QVUJMSUMsXG4gICAgICAgICAgICBuYW1lOiAncHVibGljJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIG5ldyBWcGMoc3RhY2syLCAnVGhlVlBDJywge1xuICAgICAgICBzdWJuZXRDb25maWd1cmF0aW9uOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfTkFULFxuICAgICAgICAgICAgbmFtZTogJ3N1Ym5ldCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBVQkxJQyxcbiAgICAgICAgICAgIG5hbWU6ICdwdWJsaWMnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgdDEgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2sxKTtcbiAgICAgIGNvbnN0IHQyID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrMik7XG5cbiAgICAgIGV4cGVjdCh0MS50b0pTT04oKSkudG9FcXVhbCh0Mi50b0pTT04oKSk7XG5cbiAgICB9KTtcblxuICAgIHRlc3REZXByZWNhdGVkKCdTdWJuZXRUeXBlLklTT0xBVEVEIGlzIGVxdWl2YWxlbnQgdG8gU3VibmV0VHlwZS5QUklWQVRFX0lTT0xBVEVEJywgKCkgPT4ge1xuXG4gICAgICBjb25zdCBzdGFjazEgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIGNvbnN0IHN0YWNrMiA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgbmV3IFZwYyhzdGFjazEsICdUaGVWUEMnLCB7XG4gICAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLklTT0xBVEVELFxuICAgICAgICAgICAgbmFtZTogJ3N1Ym5ldCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBuZXcgVnBjKHN0YWNrMiwgJ1RoZVZQQycsIHtcbiAgICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFJJVkFURV9JU09MQVRFRCxcbiAgICAgICAgICAgIG5hbWU6ICdzdWJuZXQnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHQxID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrMSk7XG4gICAgICBjb25zdCB0MiA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjazIpO1xuXG4gICAgICBleHBlY3QodDEudG9KU09OKCkpLnRvRXF1YWwodDIudG9KU09OKCkpO1xuXG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnd2l0aCB0aGUgZGVmYXVsdCBDSURSIHJhbmdlJywgKCkgPT4ge1xuXG4gICAgICB0ZXN0KCd2cGMudnBjSWQgcmV0dXJucyBhIHRva2VuIHRvIHRoZSBWUEMgSUQnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdUaGVWUEMnKTtcbiAgICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUodnBjLnZwY0lkKSkudG9FcXVhbCh7IFJlZjogJ1RoZVZQQzkyNjM2QUIwJyB9KTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCd2cGMudnBjQXJuIHJldHVybnMgYSB0b2tlbiB0byB0aGUgVlBDIElEJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVGhlVlBDJyk7XG4gICAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHZwYy52cGNBcm4pKS50b0VxdWFsKHsgJ0ZuOjpKb2luJzogWycnLCBbJ2FybjonLCB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LCAnOmVjMjp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOnZwYy8nLCB7IFJlZjogJ1RoZVZQQzkyNjM2QUIwJyB9XV0gfSk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnaXQgdXNlcyB0aGUgY29ycmVjdCBuZXR3b3JrIHJhbmdlJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgICBuZXcgVnBjKHN0YWNrLCAnVGhlVlBDJyk7XG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6VlBDJywge1xuICAgICAgICAgIENpZHJCbG9jazogVnBjLkRFRkFVTFRfQ0lEUl9SQU5HRSxcbiAgICAgICAgICBFbmFibGVEbnNIb3N0bmFtZXM6IHRydWUsXG4gICAgICAgICAgRW5hYmxlRG5zU3VwcG9ydDogdHJ1ZSxcbiAgICAgICAgICBJbnN0YW5jZVRlbmFuY3k6IERlZmF1bHRJbnN0YW5jZVRlbmFuY3kuREVGQVVMVCxcbiAgICAgICAgfSk7XG5cbiAgICAgIH0pO1xuICAgICAgdGVzdCgndGhlIE5hbWUgdGFnIGlzIGRlZmF1bHRlZCB0byBwYXRoJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgICBuZXcgVnBjKHN0YWNrLCAnVGhlVlBDJyk7XG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6RUMyOjpWUEMnLFxuICAgICAgICAgIGhhc1RhZ3MoW3sgS2V5OiAnTmFtZScsIFZhbHVlOiAnVGVzdFN0YWNrL1RoZVZQQycgfV0pLFxuICAgICAgICApO1xuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkVDMjo6SW50ZXJuZXRHYXRld2F5JyxcbiAgICAgICAgICBoYXNUYWdzKFt7IEtleTogJ05hbWUnLCBWYWx1ZTogJ1Rlc3RTdGFjay9UaGVWUEMnIH1dKSxcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCd3aXRoIGFsbCBvZiB0aGUgcHJvcGVydGllcyBzZXQsIGl0IHN1Y2Nlc3NmdWxseSBzZXRzIHRoZSBjb3JyZWN0IFZQQyBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIG5ldyBWcGMoc3RhY2ssICdUaGVWUEMnLCB7XG4gICAgICAgIGlwQWRkcmVzc2VzOiBJcEFkZHJlc3Nlcy5jaWRyKCcxOTIuMTY4LjAuMC8xNicpLFxuICAgICAgICBlbmFibGVEbnNIb3N0bmFtZXM6IGZhbHNlLFxuICAgICAgICBlbmFibGVEbnNTdXBwb3J0OiBmYWxzZSxcbiAgICAgICAgZGVmYXVsdEluc3RhbmNlVGVuYW5jeTogRGVmYXVsdEluc3RhbmNlVGVuYW5jeS5ERURJQ0FURUQsXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpWUEMnLCB7XG4gICAgICAgIENpZHJCbG9jazogJzE5Mi4xNjguMC4wLzE2JyxcbiAgICAgICAgRW5hYmxlRG5zSG9zdG5hbWVzOiBmYWxzZSxcbiAgICAgICAgRW5hYmxlRG5zU3VwcG9ydDogZmFsc2UsXG4gICAgICAgIEluc3RhbmNlVGVuYW5jeTogRGVmYXVsdEluc3RhbmNlVGVuYW5jeS5ERURJQ0FURUQsXG4gICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2RucyBnZXR0ZXJzIGNvcnJlc3BvbmQgdG8gQ0ZOIHByb3BlcnRpZXMnLCAoKSA9PiB7XG5cblxuICAgICAgY29uc3QgaW5wdXRzID0gW1xuICAgICAgICB7IGRuc1N1cHBvcnQ6IGZhbHNlLCBkbnNIb3N0bmFtZXM6IGZhbHNlIH0sXG4gICAgICAgIC8vIHtkbnNTdXBwb3J0OiBmYWxzZSwgZG5zSG9zdG5hbWVzOiB0cnVlfSAtIHRoaXMgY29uZmlndXJhdGlvbiBpcyBpbGxlZ2FsIHNvIGl0cyBub3QgcGFydCBvZiB0aGUgcGVybXV0YXRpb25zLlxuICAgICAgICB7IGRuc1N1cHBvcnQ6IHRydWUsIGRuc0hvc3RuYW1lczogZmFsc2UgfSxcbiAgICAgICAgeyBkbnNTdXBwb3J0OiB0cnVlLCBkbnNIb3N0bmFtZXM6IHRydWUgfSxcbiAgICAgIF07XG5cbiAgICAgIGZvciAoY29uc3QgaW5wdXQgb2YgaW5wdXRzKSB7XG5cbiAgICAgICAgdGVzdChgW2Ruc1N1cHBvcnQ9JHtpbnB1dC5kbnNTdXBwb3J0fSxkbnNIb3N0bmFtZXM9JHtpbnB1dC5kbnNIb3N0bmFtZXN9XWAsICgpID0+IHtcblxuICAgICAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1RoZVZQQycsIHtcbiAgICAgICAgICAgIGlwQWRkcmVzc2VzOiBJcEFkZHJlc3Nlcy5jaWRyKCcxOTIuMTY4LjAuMC8xNicpLFxuICAgICAgICAgICAgZW5hYmxlRG5zSG9zdG5hbWVzOiBpbnB1dC5kbnNIb3N0bmFtZXMsXG4gICAgICAgICAgICBlbmFibGVEbnNTdXBwb3J0OiBpbnB1dC5kbnNTdXBwb3J0LFxuICAgICAgICAgICAgZGVmYXVsdEluc3RhbmNlVGVuYW5jeTogRGVmYXVsdEluc3RhbmNlVGVuYW5jeS5ERURJQ0FURUQsXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlZQQycsIHtcbiAgICAgICAgICAgIENpZHJCbG9jazogJzE5Mi4xNjguMC4wLzE2JyxcbiAgICAgICAgICAgIEVuYWJsZURuc0hvc3RuYW1lczogaW5wdXQuZG5zSG9zdG5hbWVzLFxuICAgICAgICAgICAgRW5hYmxlRG5zU3VwcG9ydDogaW5wdXQuZG5zU3VwcG9ydCxcbiAgICAgICAgICAgIEluc3RhbmNlVGVuYW5jeTogRGVmYXVsdEluc3RhbmNlVGVuYW5jeS5ERURJQ0FURUQsXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBleHBlY3QoaW5wdXQuZG5zU3VwcG9ydCkudG9FcXVhbCh2cGMuZG5zU3VwcG9ydEVuYWJsZWQpO1xuICAgICAgICAgIGV4cGVjdChpbnB1dC5kbnNIb3N0bmFtZXMpLnRvRXF1YWwodnBjLmRuc0hvc3RuYW1lc0VuYWJsZWQpO1xuXG5cbiAgICAgICAgfSk7XG4gICAgICB9XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnY29udGFpbnMgdGhlIGNvcnJlY3QgbnVtYmVyIG9mIHN1Ym5ldHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1RoZVZQQycpO1xuICAgICAgY29uc3Qgem9uZXMgPSBzdGFjay5hdmFpbGFiaWxpdHlab25lcy5sZW5ndGg7XG4gICAgICBleHBlY3QodnBjLnB1YmxpY1N1Ym5ldHMubGVuZ3RoKS50b0VxdWFsKHpvbmVzKTtcbiAgICAgIGV4cGVjdCh2cGMucHJpdmF0ZVN1Ym5ldHMubGVuZ3RoKS50b0VxdWFsKHpvbmVzKTtcbiAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHZwYy52cGNJZCkpLnRvRXF1YWwoeyBSZWY6ICdUaGVWUEM5MjYzNkFCMCcgfSk7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiByZWZlciB0byB0aGUgaW50ZXJuZXQgZ2F0ZXdheScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVGhlVlBDJyk7XG4gICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZSh2cGMuaW50ZXJuZXRHYXRld2F5SWQpKS50b0VxdWFsKHsgUmVmOiAnVGhlVlBDSUdXRkEyNUNDMDgnIH0pO1xuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCd3aXRoIG9ubHkgaXNvbGF0ZWQgc3VibmV0cywgdGhlIFZQQyBzaG91bGQgbm90IGNvbnRhaW4gYW4gSUdXIG9yIE5BVCBHYXRld2F5cycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBuZXcgVnBjKHN0YWNrLCAnVGhlVlBDJywge1xuICAgICAgICBzdWJuZXRDb25maWd1cmF0aW9uOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFX0lTT0xBVEVELFxuICAgICAgICAgICAgbmFtZTogJ0lzb2xhdGVkJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6OkludGVybmV0R2F0ZXdheScsIDApO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUMyOjpOYXRHYXRld2F5JywgMCk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlN1Ym5ldCcsIHtcbiAgICAgICAgTWFwUHVibGljSXBPbkxhdW5jaDogZmFsc2UsXG4gICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgdGVzdCgnd2l0aCBubyBwcml2YXRlIHN1Ym5ldHMsIHRoZSBWUEMgc2hvdWxkIGhhdmUgYW4gSUdXIGJ1dCBubyBOQVQgR2F0ZXdheXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgbmV3IFZwYyhzdGFjaywgJ1RoZVZQQycsIHtcbiAgICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgICAgICAgbmFtZTogJ1B1YmxpYycsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfSVNPTEFURUQsXG4gICAgICAgICAgICBuYW1lOiAnSXNvbGF0ZWQnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkVDMjo6SW50ZXJuZXRHYXRld2F5JywgMSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6Ok5hdEdhdGV3YXknLCAwKTtcblxuICAgIH0pO1xuICAgIHRlc3QoJ3dpdGggcHJpdmF0ZSBzdWJuZXRzIGFuZCBjdXN0b20gbmV0d29ya0FjbC4nLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1RoZVZQQycsIHtcbiAgICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgICAgICAgbmFtZTogJ1B1YmxpYycsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9FR1JFU1MsXG4gICAgICAgICAgICBuYW1lOiAncHJpdmF0ZScsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBuYWNsMSA9IG5ldyBOZXR3b3JrQWNsKHN0YWNrLCAnbXlOQUNMMScsIHtcbiAgICAgICAgdnBjLFxuICAgICAgICBzdWJuZXRTZWxlY3Rpb246IHsgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfRUdSRVNTIH0sXG4gICAgICB9KTtcblxuICAgICAgbmV3IE5ldHdvcmtBY2xFbnRyeShzdGFjaywgJ0FsbG93RE5TRWdyZXNzJywge1xuICAgICAgICBuZXR3b3JrQWNsOiBuYWNsMSxcbiAgICAgICAgcnVsZU51bWJlcjogMTAwLFxuICAgICAgICB0cmFmZmljOiBBY2xUcmFmZmljLnVkcFBvcnQoNTMpLFxuICAgICAgICBkaXJlY3Rpb246IFRyYWZmaWNEaXJlY3Rpb24uRUdSRVNTLFxuICAgICAgICBjaWRyOiBBY2xDaWRyLmlwdjQoJzEwLjAuMC4wLzE2JyksXG4gICAgICB9KTtcblxuICAgICAgbmV3IE5ldHdvcmtBY2xFbnRyeShzdGFjaywgJ0FsbG93RE5TSW5ncmVzcycsIHtcbiAgICAgICAgbmV0d29ya0FjbDogbmFjbDEsXG4gICAgICAgIHJ1bGVOdW1iZXI6IDEwMCxcbiAgICAgICAgdHJhZmZpYzogQWNsVHJhZmZpYy51ZHBQb3J0KDUzKSxcbiAgICAgICAgZGlyZWN0aW9uOiBUcmFmZmljRGlyZWN0aW9uLklOR1JFU1MsXG4gICAgICAgIGNpZHI6IEFjbENpZHIuYW55SXB2NCgpLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkVDMjo6TmV0d29ya0FjbCcsIDEpO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUMyOjpOZXR3b3JrQWNsRW50cnknLCAyKTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkVDMjo6U3VibmV0TmV0d29ya0FjbEFzc29jaWF0aW9uJywgMyk7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3dpdGggbm8gc3VibmV0cyBkZWZpbmVkLCB0aGUgVlBDIHNob3VsZCBoYXZlIGFuIElHVywgYW5kIGEgTkFUIEdhdGV3YXkgcGVyIEFaJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIGNvbnN0IHpvbmVzID0gc3RhY2suYXZhaWxhYmlsaXR5Wm9uZXMubGVuZ3RoO1xuICAgICAgbmV3IFZwYyhzdGFjaywgJ1RoZVZQQycsIHt9KTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkVDMjo6SW50ZXJuZXRHYXRld2F5JywgMSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6Ok5hdEdhdGV3YXknLCB6b25lcyk7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3dpdGggaXNvbGF0ZWQgYW5kIHB1YmxpYyBzdWJuZXQsIHNob3VsZCBiZSBhYmxlIHRvIHVzZSB0aGUgaW50ZXJuZXQgZ2F0ZXdheSB0byBkZWZpbmUgcm91dGVzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdUaGVWUEMnLCB7XG4gICAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfSVNPTEFURUQsXG4gICAgICAgICAgICBuYW1lOiAnaXNvbGF0ZWQnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QVUJMSUMsXG4gICAgICAgICAgICBuYW1lOiAncHVibGljJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgICAodnBjLmlzb2xhdGVkU3VibmV0c1swXSBhcyBTdWJuZXQpLmFkZFJvdXRlKCdUaGVSb3V0ZScsIHtcbiAgICAgICAgcm91dGVySWQ6IHZwYy5pbnRlcm5ldEdhdGV3YXlJZCEsXG4gICAgICAgIHJvdXRlclR5cGU6IFJvdXRlclR5cGUuR0FURVdBWSxcbiAgICAgICAgZGVzdGluYXRpb25DaWRyQmxvY2s6ICc4LjguOC44LzMyJyxcbiAgICAgIH0pO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUMyOjpJbnRlcm5ldEdhdGV3YXknLCAxKTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6Um91dGUnLCB7XG4gICAgICAgIERlc3RpbmF0aW9uQ2lkckJsb2NrOiAnOC44LjguOC8zMicsXG4gICAgICAgIEdhdGV3YXlJZDoge30sXG4gICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgdGVzdCgnd2l0aCBzdWJuZXRzIGFuZCByZXNlcnZlZCBzdWJuZXRzIGRlZmluZWQsIFZQQyBzdWJuZXQgY291bnQgc2hvdWxkIG5vdCBjb250YWluIHJlc2VydmVkIHN1Ym5ldHMgJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIG5ldyBWcGMoc3RhY2ssICdUaGVWUEMnLCB7XG4gICAgICAgIGlwQWRkcmVzc2VzOiBJcEFkZHJlc3Nlcy5jaWRyKCcxMC4wLjAuMC8xNicpLFxuICAgICAgICBzdWJuZXRDb25maWd1cmF0aW9uOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2lkck1hc2s6IDI0LFxuICAgICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QVUJMSUMsXG4gICAgICAgICAgICBuYW1lOiAnUHVibGljJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNpZHJNYXNrOiAyNCxcbiAgICAgICAgICAgIG5hbWU6ICdyZXNlcnZlZCcsXG4gICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9FR1JFU1MsXG4gICAgICAgICAgICByZXNlcnZlZDogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNpZHJNYXNrOiAyOCxcbiAgICAgICAgICAgIG5hbWU6ICdyZHMnLFxuICAgICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFX0lTT0xBVEVELFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIG1heEF6czogMyxcbiAgICAgIH0pO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUMyOjpTdWJuZXQnLCA2KTtcblxuICAgIH0pO1xuICAgIHRlc3QoJ3dpdGggcmVzZXJ2ZWQgc3VibmV0cywgYW55IG90aGVyIHN1Ym5ldHMgc2hvdWxkIG5vdCBoYXZlIGNpZHJCbG9jayBmcm9tIHdpdGhpbiByZXNlcnZlZCBzcGFjZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBuZXcgVnBjKHN0YWNrLCAnVGhlVlBDJywge1xuICAgICAgICBpcEFkZHJlc3NlczogSXBBZGRyZXNzZXMuY2lkcignMTAuMC4wLjAvMTYnKSxcbiAgICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNpZHJNYXNrOiAyNCxcbiAgICAgICAgICAgIG5hbWU6ICdpbmdyZXNzJyxcbiAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2lkck1hc2s6IDI0LFxuICAgICAgICAgICAgbmFtZTogJ3Jlc2VydmVkJyxcbiAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX0VHUkVTUyxcbiAgICAgICAgICAgIHJlc2VydmVkOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2lkck1hc2s6IDI0LFxuICAgICAgICAgICAgbmFtZTogJ3JkcycsXG4gICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9FR1JFU1MsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgbWF4QXpzOiAzLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgdGVtcGxhdGUuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U3VibmV0Jywge1xuICAgICAgICAgIENpZHJCbG9jazogYDEwLjAuJHtpfS4wLzI0YCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBpID0gMzsgaSA8IDY7IGkrKykge1xuICAgICAgICBjb25zdCBtYXRjaGluZ1N1Ym5ldHMgPSB0ZW1wbGF0ZS5maW5kUmVzb3VyY2VzKCdBV1M6OkVDMjo6U3VibmV0Jywge1xuICAgICAgICAgIENpZHJCbG9jazogYDEwLjAuJHtpfS4wLzI0YCxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdChPYmplY3Qua2V5cyhtYXRjaGluZ1N1Ym5ldHMpLmxlbmd0aCkudG9CZSgwKTtcbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGkgPSA2OyBpIDwgOTsgaSsrKSB7XG4gICAgICAgIHRlbXBsYXRlLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlN1Ym5ldCcsIHtcbiAgICAgICAgICBDaWRyQmxvY2s6IGAxMC4wLiR7aX0uMC8yNGAsXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgfSk7XG4gICAgdGVzdCgnd2l0aCBjdXN0b20gc3VibmV0cywgdGhlIFZQQyBzaG91bGQgaGF2ZSB0aGUgcmlnaHQgbnVtYmVyIG9mIHN1Ym5ldHMsIGFuIElHVywgYW5kIGEgTkFUIEdhdGV3YXkgcGVyIEFaJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIGNvbnN0IHpvbmVzID0gc3RhY2suYXZhaWxhYmlsaXR5Wm9uZXMubGVuZ3RoO1xuICAgICAgbmV3IFZwYyhzdGFjaywgJ1RoZVZQQycsIHtcbiAgICAgICAgaXBBZGRyZXNzZXM6IElwQWRkcmVzc2VzLmNpZHIoJzEwLjAuMC4wLzIxJyksXG4gICAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjaWRyTWFzazogMjQsXG4gICAgICAgICAgICBuYW1lOiAnaW5ncmVzcycsXG4gICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBVQkxJQyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNpZHJNYXNrOiAyNCxcbiAgICAgICAgICAgIG5hbWU6ICdhcHBsaWNhdGlvbicsXG4gICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9FR1JFU1MsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjaWRyTWFzazogMjgsXG4gICAgICAgICAgICBuYW1lOiAncmRzJyxcbiAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFJJVkFURV9JU09MQVRFRCxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBtYXhBenM6IDMsXG4gICAgICB9KTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkVDMjo6SW50ZXJuZXRHYXRld2F5JywgMSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6Ok5hdEdhdGV3YXknLCB6b25lcyk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6OlN1Ym5ldCcsIDkpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA2OyBpKyspIHtcbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTdWJuZXQnLCB7XG4gICAgICAgICAgQ2lkckJsb2NrOiBgMTAuMC4ke2l9LjAvMjRgLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U3VibmV0Jywge1xuICAgICAgICAgIENpZHJCbG9jazogYDEwLjAuNi4ke2kgKiAxNn0vMjhgLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgIH0pO1xuICAgIHRlc3QoJ3dpdGggY3VzdG9tIHN1Ym5ldHMgYW5kIG5hdEdhdGV3YXlzID0gMiB0aGVyZSBzaG91bGQgYmUgb25seSB0d28gTkFUR1cnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgbmV3IFZwYyhzdGFjaywgJ1RoZVZQQycsIHtcbiAgICAgICAgaXBBZGRyZXNzZXM6IElwQWRkcmVzc2VzLmNpZHIoJzEwLjAuMC4wLzIxJyksXG4gICAgICAgIG5hdEdhdGV3YXlzOiAyLFxuICAgICAgICBzdWJuZXRDb25maWd1cmF0aW9uOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2lkck1hc2s6IDI0LFxuICAgICAgICAgICAgbmFtZTogJ2luZ3Jlc3MnLFxuICAgICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QVUJMSUMsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjaWRyTWFzazogMjQsXG4gICAgICAgICAgICBuYW1lOiAnYXBwbGljYXRpb24nLFxuICAgICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfRUdSRVNTLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2lkck1hc2s6IDI4LFxuICAgICAgICAgICAgbmFtZTogJ3JkcycsXG4gICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfSVNPTEFURUQsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgbWF4QXpzOiAzLFxuICAgICAgfSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6OkludGVybmV0R2F0ZXdheScsIDEpO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUMyOjpOYXRHYXRld2F5JywgMik7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6OlN1Ym5ldCcsIDkpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA2OyBpKyspIHtcbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTdWJuZXQnLCB7XG4gICAgICAgICAgQ2lkckJsb2NrOiBgMTAuMC4ke2l9LjAvMjRgLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U3VibmV0Jywge1xuICAgICAgICAgIENpZHJCbG9jazogYDEwLjAuNi4ke2kgKiAxNn0vMjhgLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgIH0pO1xuICAgIHRlc3QoJ3dpdGggZW5hYmxlRG5zSG9zdG5hbWVzIGVuYWJsZWQgYnV0IGVuYWJsZURuc1N1cHBvcnQgZGlzYWJsZWQsIHNob3VsZCB0aHJvdyBhbiBFcnJvcicsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBleHBlY3QoKCkgPT4gbmV3IFZwYyhzdGFjaywgJ1RoZVZQQycsIHtcbiAgICAgICAgZW5hYmxlRG5zSG9zdG5hbWVzOiB0cnVlLFxuICAgICAgICBlbmFibGVEbnNTdXBwb3J0OiBmYWxzZSxcbiAgICAgIH0pKS50b1Rocm93KCk7XG5cbiAgICB9KTtcbiAgICB0ZXN0KCd3aXRoIHB1YmxpYyBzdWJuZXRzIE1hcFB1YmxpY0lwT25MYXVuY2ggaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBuZXcgVnBjKHN0YWNrLCAnVlBDJywge1xuICAgICAgICBtYXhBenM6IDEsXG4gICAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjaWRyTWFzazogMjQsXG4gICAgICAgICAgICBuYW1lOiAnaW5ncmVzcycsXG4gICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBVQkxJQyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6OlN1Ym5ldCcsIDEpO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUMyOjpOYXRHYXRld2F5JywgMCk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlN1Ym5ldCcsIHtcbiAgICAgICAgTWFwUHVibGljSXBPbkxhdW5jaDogdHJ1ZSxcbiAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCd3aXRoIHB1YmxpYyBzdWJuZXRzIE1hcFB1YmxpY0lwT25MYXVuY2ggaXMgdHJ1ZSBpZiBwYXJhbWV0ZXIgbWFwUHVibGljSXBPbkxhdW5jaCBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIG5ldyBWcGMoc3RhY2ssICdWUEMnLCB7XG4gICAgICAgIG1heEF6czogMSxcbiAgICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNpZHJNYXNrOiAyNCxcbiAgICAgICAgICAgIG5hbWU6ICdpbmdyZXNzJyxcbiAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgICAgICAgbWFwUHVibGljSXBPbkxhdW5jaDogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6OlN1Ym5ldCcsIDEpO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUMyOjpOYXRHYXRld2F5JywgMCk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlN1Ym5ldCcsIHtcbiAgICAgICAgTWFwUHVibGljSXBPbkxhdW5jaDogdHJ1ZSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHRlc3QoJ3dpdGggcHVibGljIHN1Ym5ldHMgTWFwUHVibGljSXBPbkxhdW5jaCBpcyBmYWxzZSBpZiBwYXJhbWV0ZXIgbWFwUHVibGljSXBPbkxhdW5jaCBpcyBmYWxzZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBuZXcgVnBjKHN0YWNrLCAnVlBDJywge1xuICAgICAgICBtYXhBenM6IDEsXG4gICAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjaWRyTWFzazogMjQsXG4gICAgICAgICAgICBuYW1lOiAnaW5ncmVzcycsXG4gICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBVQkxJQyxcbiAgICAgICAgICAgIG1hcFB1YmxpY0lwT25MYXVuY2g6IGZhbHNlLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkVDMjo6U3VibmV0JywgMSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6Ok5hdEdhdGV3YXknLCAwKTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U3VibmV0Jywge1xuICAgICAgICBNYXBQdWJsaWNJcE9uTGF1bmNoOiBmYWxzZSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHRlc3QoJ3dpdGggcHJpdmF0ZSBzdWJuZXRzIHRocm93IGV4Y2VwdGlvbiBpZiBwYXJhbWV0ZXIgbWFwUHVibGljSXBPbkxhdW5jaCBpcyBkZWZpbmVkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIG5ldyBWcGMoc3RhY2ssICdWUEMnLCB7XG4gICAgICAgICAgbWF4QXpzOiAxLFxuICAgICAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogJ3B1YmxpYycsXG4gICAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogJ3ByaXZhdGUnLFxuICAgICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9FR1JFU1MsXG4gICAgICAgICAgICAgIG1hcFB1YmxpY0lwT25MYXVuY2g6IHRydWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvdygvc3VibmV0IGNhbm5vdCBpbmNsdWRlIG1hcFB1YmxpY0lwT25MYXVuY2ggcGFyYW1ldGVyLyk7XG4gICAgfSk7XG4gICAgdGVzdCgnd2l0aCBpc29sYXRlZCBzdWJuZXRzIHRocm93IGV4Y2VwdGlvbiBpZiBwYXJhbWV0ZXIgbWFwUHVibGljSXBPbkxhdW5jaCBpcyBkZWZpbmVkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIG5ldyBWcGMoc3RhY2ssICdWUEMnLCB7XG4gICAgICAgICAgbWF4QXpzOiAxLFxuICAgICAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogJ3B1YmxpYycsXG4gICAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogJ3ByaXZhdGUnLFxuICAgICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfSVNPTEFURUQsXG4gICAgICAgICAgICAgIG1hcFB1YmxpY0lwT25MYXVuY2g6IHRydWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvdygvc3VibmV0IGNhbm5vdCBpbmNsdWRlIG1hcFB1YmxpY0lwT25MYXVuY2ggcGFyYW1ldGVyLyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd2ZXJpZnkgdGhlIERlZmF1bHQgVlBDIG5hbWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgY29uc3QgdGFnTmFtZSA9IHsgS2V5OiAnTmFtZScsIFZhbHVlOiBgJHtzdGFjay5ub2RlLnBhdGh9L1ZQQ2AgfTtcbiAgICAgIG5ldyBWcGMoc3RhY2ssICdWUEMnLCB7XG4gICAgICAgIG1heEF6czogMSxcbiAgICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdwdWJsaWMnLFxuICAgICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QVUJMSUMsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAncHJpdmF0ZScsXG4gICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9FR1JFU1MsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUMyOjpTdWJuZXQnLCAyKTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6RUMyOjpOYXRHYXRld2F5JywgTWF0Y2guYW55VmFsdWUoKSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlN1Ym5ldCcsIHtcbiAgICAgICAgTWFwUHVibGljSXBPbkxhdW5jaDogdHJ1ZSxcbiAgICAgIH0pO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpFQzI6OlZQQycsIGhhc1RhZ3MoW3RhZ05hbWVdKSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd2ZXJpZnkgdGhlIGFzc2lnbmVkIFZQQyBuYW1lIHBhc3NpbmcgdGhlIFwidnBjTmFtZVwiIHByb3AnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgY29uc3QgdGFnTmFtZSA9IHsgS2V5OiAnTmFtZScsIFZhbHVlOiAnQ3VzdG9tVlBDTmFtZScgfTtcbiAgICAgIG5ldyBWcGMoc3RhY2ssICdWUEMnLCB7XG4gICAgICAgIG1heEF6czogMSxcbiAgICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdwdWJsaWMnLFxuICAgICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QVUJMSUMsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAncHJpdmF0ZScsXG4gICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9FR1JFU1MsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgdnBjTmFtZTogJ0N1c3RvbVZQQ05hbWUnLFxuICAgICAgfSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6OlN1Ym5ldCcsIDIpO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpOYXRHYXRld2F5JywgTWF0Y2guYW55VmFsdWUoKSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlN1Ym5ldCcsIHtcbiAgICAgICAgTWFwUHVibGljSXBPbkxhdW5jaDogdHJ1ZSxcbiAgICAgIH0pO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpFQzI6OlZQQycsIGhhc1RhZ3MoW3RhZ05hbWVdKSk7XG4gICAgfSk7XG4gICAgdGVzdCgnbWF4QVpzIGRlZmF1bHRzIHRvIDMgaWYgdW5zZXQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUMyOjpTdWJuZXQnLCA2KTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkVDMjo6Um91dGUnLCA2KTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNjsgaSsrKSB7XG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U3VibmV0Jywge1xuICAgICAgICAgIENpZHJCbG9jazogYDEwLjAuJHtpICogMzJ9LjAvMTlgLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6Um91dGUnLCB7XG4gICAgICAgIERlc3RpbmF0aW9uQ2lkckJsb2NrOiAnMC4wLjAuMC8wJyxcbiAgICAgICAgTmF0R2F0ZXdheUlkOiB7fSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnd2l0aCBtYXhBWnMgc2V0IHRvIDInLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgbmV3IFZwYyhzdGFjaywgJ1ZQQycsIHsgbWF4QXpzOiAyIH0pO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUMyOjpTdWJuZXQnLCA0KTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkVDMjo6Um91dGUnLCA0KTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U3VibmV0Jywge1xuICAgICAgICAgIENpZHJCbG9jazogYDEwLjAuJHtpICogNjR9LjAvMThgLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6Um91dGUnLCB7XG4gICAgICAgIERlc3RpbmF0aW9uQ2lkckJsb2NrOiAnMC4wLjAuMC8wJyxcbiAgICAgICAgTmF0R2F0ZXdheUlkOiB7fSxcbiAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCd0aHJvd3MgZXJyb3Igd2hlbiBib3RoIGF2YWlsYWJpbGl0eVpvbmVzIGFuZCBtYXhBenMgYXJlIHNldCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBuZXcgVnBjKHN0YWNrLCAnVlBDJywge1xuICAgICAgICAgIGF2YWlsYWJpbGl0eVpvbmVzOiBzdGFjay5hdmFpbGFiaWxpdHlab25lcyxcbiAgICAgICAgICBtYXhBenM6IDEsXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvdygvVnBjIHN1cHBvcnRzICdhdmFpbGFiaWxpdHlab25lcycgb3IgJ21heEF6cycsIGJ1dCBub3QgYm90aC4vKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3dpdGggYXZhaWxhYmlsaXR5Wm9uZXMgc2V0IGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBjb25zdCBzcGVjaWZpY0F6ID0gc3RhY2suYXZhaWxhYmlsaXR5Wm9uZXNbMV07IC8vIG5vdCB0aGUgZmlyc3QgaXRlbVxuICAgICAgbmV3IFZwYyhzdGFjaywgJ1ZQQycsIHtcbiAgICAgICAgYXZhaWxhYmlsaXR5Wm9uZXM6IFtzcGVjaWZpY0F6XSxcbiAgICAgIH0pO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUMyOjpTdWJuZXQnLCAyKTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U3VibmV0Jywge1xuICAgICAgICBBdmFpbGFiaWxpdHlab25lOiBzcGVjaWZpY0F6LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd3aXRoIGF2YWlsYWJpbGl0eVpvbmVzIHNldCB0byB6b25lcyBkaWZmZXJlbnQgZnJvbSBzdGFjaycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBuZXcgVnBjKHN0YWNrLCAnVlBDJywge1xuICAgICAgICAgIGF2YWlsYWJpbGl0eVpvbmVzOiBbc3RhY2suYXZhaWxhYmlsaXR5Wm9uZXNbMF0gKyAnaW52YWxpZCddLFxuICAgICAgICB9KTtcbiAgICAgIH0pLnRvVGhyb3coL211c3QgYmUgYSBzdWJzZXQgb2YgdGhlIHN0YWNrLyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd3aXRoIG5hdEdhdGV3YXkgc2V0IHRvIDEnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgbmV3IFZwYyhzdGFjaywgJ1ZQQycsIHtcbiAgICAgICAgbmF0R2F0ZXdheXM6IDEsXG4gICAgICB9KTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkVDMjo6U3VibmV0JywgNik7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6OlJvdXRlJywgNik7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6Ok5hdEdhdGV3YXknLCAxKTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6Um91dGUnLCB7XG4gICAgICAgIERlc3RpbmF0aW9uQ2lkckJsb2NrOiAnMC4wLjAuMC8wJyxcbiAgICAgICAgTmF0R2F0ZXdheUlkOiB7fSxcbiAgICAgIH0pO1xuXG4gICAgfSk7XG4gICAgdGVzdCgnd2l0aCBuYXRHYXRld2F5IHN1Ym5ldHMgZGVmaW5lZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBuZXcgVnBjKHN0YWNrLCAnVlBDJywge1xuICAgICAgICBzdWJuZXRDb25maWd1cmF0aW9uOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2lkck1hc2s6IDI0LFxuICAgICAgICAgICAgbmFtZTogJ2luZ3Jlc3MnLFxuICAgICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QVUJMSUMsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjaWRyTWFzazogMjQsXG4gICAgICAgICAgICBuYW1lOiAnZWdyZXNzJyxcbiAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2lkck1hc2s6IDI0LFxuICAgICAgICAgICAgbmFtZTogJ3ByaXZhdGUnLFxuICAgICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfRUdSRVNTLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIG5hdEdhdGV3YXlTdWJuZXRzOiB7XG4gICAgICAgICAgc3VibmV0R3JvdXBOYW1lOiAnZWdyZXNzJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUMyOjpOYXRHYXRld2F5JywgMyk7XG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8IDQ7IGkrKykge1xuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkVDMjo6U3VibmV0JywgaGFzVGFncyhbe1xuICAgICAgICAgIEtleTogJ2F3cy1jZGs6c3VibmV0LW5hbWUnLFxuICAgICAgICAgIFZhbHVlOiAnZWdyZXNzJyxcbiAgICAgICAgfSwge1xuICAgICAgICAgIEtleTogJ05hbWUnLFxuICAgICAgICAgIFZhbHVlOiBgVGVzdFN0YWNrL1ZQQy9lZ3Jlc3NTdWJuZXQke2l9YCxcbiAgICAgICAgfV0pKTtcbiAgICAgIH1cblxuICAgIH0pO1xuXG4gICAgdGVzdERlcHJlY2F0ZWQoJ25hdEdhdGV3YXlzID0gMCB0aHJvd3MgaWYgUFJJVkFURV9XSVRIX05BVCBzdWJuZXRzIGNvbmZpZ3VyZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IFZwYyhzdGFjaywgJ1ZQQycsIHtcbiAgICAgICAgICBuYXRHYXRld2F5czogMCxcbiAgICAgICAgICBzdWJuZXRDb25maWd1cmF0aW9uOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6ICdwdWJsaWMnLFxuICAgICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBVQkxJQyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6ICdwcml2YXRlJyxcbiAgICAgICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfTkFULFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KTtcbiAgICAgIH0pLnRvVGhyb3coL21ha2Ugc3VyZSB5b3UgZG9uJ3QgY29uZmlndXJlIGFueSBQUklWQVRFLyk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnbmF0R2F0ZXdheXMgPSAwIHN1Y2NlZWRzIGlmIFBSSVZBVEVfV0lUSF9FR1JFU1Mgc3VibmV0cyBjb25maWd1cmVkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcblxuICAgICAgbmV3IFZwYyhzdGFjaywgJ1ZQQycsIHtcbiAgICAgICAgbmF0R2F0ZXdheXM6IDAsXG4gICAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAncHVibGljJyxcbiAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ3ByaXZhdGUnLFxuICAgICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfRUdSRVNTLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUMyOjpJbnRlcm5ldEdhdGV3YXknLCAxKTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkVDMjo6TmF0R2F0ZXdheScsIDApO1xuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCduYXRHYXRld2F5ID0gMCBkZWZhdWx0cyB3aXRoIElTT0xBVEVEIHN1Ym5ldCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBuZXcgVnBjKHN0YWNrLCAnVlBDJywge1xuICAgICAgICBuYXRHYXRld2F5czogMCxcbiAgICAgIH0pO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpFQzI6OlN1Ym5ldCcsIGhhc1RhZ3MoW3tcbiAgICAgICAgS2V5OiAnYXdzLWNkazpzdWJuZXQtdHlwZScsXG4gICAgICAgIFZhbHVlOiAnSXNvbGF0ZWQnLFxuICAgICAgfV0pKTtcblxuICAgIH0pO1xuXG4gICAgdGVzdCgndW5zcGVjaWZpZWQgbmF0R2F0ZXdheXMgY29uc3RydWN0cyB3aXRoIFBSSVZBVEUgc3VibmV0JywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6RUMyOjpTdWJuZXQnLCBoYXNUYWdzKFt7XG4gICAgICAgIEtleTogJ2F3cy1jZGs6c3VibmV0LXR5cGUnLFxuICAgICAgICBWYWx1ZTogJ1ByaXZhdGUnLFxuICAgICAgfV0pKTtcblxuICAgIH0pO1xuXG4gICAgdGVzdCgnbmF0R2F0ZXdheXMgPSAwIGFsbG93cyBSRVNFUlZFRCBQUklWQVRFIHN1Ym5ldHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgbmV3IFZwYyhzdGFjaywgJ1ZQQycsIHtcbiAgICAgICAgaXBBZGRyZXNzZXM6IElwQWRkcmVzc2VzLmNpZHIoJzEwLjAuMC4wLzE2JyksXG4gICAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnaW5ncmVzcycsXG4gICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBVQkxJQyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdwcml2YXRlJyxcbiAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX0VHUkVTUyxcbiAgICAgICAgICAgIHJlc2VydmVkOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIG5hdEdhdGV3YXlzOiAwLFxuICAgICAgfSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkVDMjo6U3VibmV0JywgaGFzVGFncyhbe1xuICAgICAgICBLZXk6ICdhd3MtY2RrOnN1Ym5ldC1uYW1lJyxcbiAgICAgICAgVmFsdWU6ICdpbmdyZXNzJyxcbiAgICAgIH1dKSk7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ0VJUCBwYXNzZWQgd2l0aCBOQVQgZ2F0ZXdheSBkb2VzIG5vdCBjcmVhdGUgZHVwbGljYXRlIEVJUCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBuZXcgVnBjKHN0YWNrLCAnVlBDJywge1xuICAgICAgICBpcEFkZHJlc3NlczogSXBBZGRyZXNzZXMuY2lkcignMTAuMC4wLjAvMTYnKSxcbiAgICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNpZHJNYXNrOiAyNCxcbiAgICAgICAgICAgIG5hbWU6ICdpbmdyZXNzJyxcbiAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2lkck1hc2s6IDI0LFxuICAgICAgICAgICAgbmFtZTogJ2FwcGxpY2F0aW9uJyxcbiAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX0VHUkVTUyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBuYXRHYXRld2F5UHJvdmlkZXI6IE5hdFByb3ZpZGVyLmdhdGV3YXkoeyBlaXBBbGxvY2F0aW9uSWRzOiBbJ2InXSB9KSxcbiAgICAgICAgbmF0R2F0ZXdheXM6IDEsXG4gICAgICB9KTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkVDMjo6RUlQJywgMCk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6Ok5hdEdhdGV3YXknLCB7XG4gICAgICAgIEFsbG9jYXRpb25JZDogJ2InLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd3aXRoIG1pcy1tYXRjaGVkIG5hdCBhbmQgc3VibmV0IGNvbmZpZ3MgaXQgdGhyb3dzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIGV4cGVjdCgoKSA9PiBuZXcgVnBjKHN0YWNrLCAnVlBDJywge1xuICAgICAgICBzdWJuZXRDb25maWd1cmF0aW9uOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2lkck1hc2s6IDI0LFxuICAgICAgICAgICAgbmFtZTogJ2luZ3Jlc3MnLFxuICAgICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QVUJMSUMsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjaWRyTWFzazogMjQsXG4gICAgICAgICAgICBuYW1lOiAncHJpdmF0ZScsXG4gICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9FR1JFU1MsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgbmF0R2F0ZXdheVN1Ym5ldHM6IHtcbiAgICAgICAgICBzdWJuZXRHcm91cE5hbWU6ICdub3R0aGVyZScsXG4gICAgICAgIH0sXG4gICAgICB9KSkudG9UaHJvdygpO1xuXG4gICAgfSk7XG4gICAgdGVzdCgnd2l0aCBhIHZwbiBnYXRld2F5JywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIG5ldyBWcGMoc3RhY2ssICdWUEMnLCB7XG4gICAgICAgIHZwbkdhdGV3YXk6IHRydWUsXG4gICAgICAgIHZwbkdhdGV3YXlBc246IDY1MDAwLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6VlBOR2F0ZXdheScsIHtcbiAgICAgICAgQW1hem9uU2lkZUFzbjogNjUwMDAsXG4gICAgICAgIFR5cGU6ICdpcHNlYy4xJyxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlZQQ0dhdGV3YXlBdHRhY2htZW50Jywge1xuICAgICAgICBWcGNJZDoge1xuICAgICAgICAgIFJlZjogJ1ZQQ0I5RTVGMEI0JyxcbiAgICAgICAgfSxcbiAgICAgICAgVnBuR2F0ZXdheUlkOiB7XG4gICAgICAgICAgUmVmOiAnVlBDVnBuR2F0ZXdheUI1QUJBRTY4JyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlZQTkdhdGV3YXlSb3V0ZVByb3BhZ2F0aW9uJywge1xuICAgICAgICBSb3V0ZVRhYmxlSWRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnVlBDUHJpdmF0ZVN1Ym5ldDFSb3V0ZVRhYmxlQkU4QTYwMjcnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnVlBDUHJpdmF0ZVN1Ym5ldDJSb3V0ZVRhYmxlMEExOUUxMEUnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnVlBDUHJpdmF0ZVN1Ym5ldDNSb3V0ZVRhYmxlMTkyMTg2RjgnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZwbkdhdGV3YXlJZDoge1xuICAgICAgICAgIFJlZjogJ1ZQQ1ZwbkdhdGV3YXlCNUFCQUU2OCcsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuXG4gICAgfSk7XG4gICAgdGVzdCgnd2l0aCBhIHZwbiBnYXRld2F5IGFuZCByb3V0ZSBwcm9wYWdhdGlvbiBvbiBpc29sYXRlZCBzdWJuZXRzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIG5ldyBWcGMoc3RhY2ssICdWUEMnLCB7XG4gICAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcbiAgICAgICAgICB7IHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDLCBuYW1lOiAnUHVibGljJyB9LFxuICAgICAgICAgIHsgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFX0lTT0xBVEVELCBuYW1lOiAnSXNvbGF0ZWQnIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHZwbkdhdGV3YXk6IHRydWUsXG4gICAgICAgIHZwblJvdXRlUHJvcGFnYXRpb246IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfSVNPTEFURUQsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlZQTkdhdGV3YXlSb3V0ZVByb3BhZ2F0aW9uJywge1xuICAgICAgICBSb3V0ZVRhYmxlSWRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnVlBDSXNvbGF0ZWRTdWJuZXQxUm91dGVUYWJsZUVCMTU2MjEwJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlZjogJ1ZQQ0lzb2xhdGVkU3VibmV0MlJvdXRlVGFibGU5QjRGNzhEQycsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZWY6ICdWUENJc29sYXRlZFN1Ym5ldDNSb3V0ZVRhYmxlQ0I2QTFGREEnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZwbkdhdGV3YXlJZDoge1xuICAgICAgICAgIFJlZjogJ1ZQQ1ZwbkdhdGV3YXlCNUFCQUU2OCcsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuXG4gICAgfSk7XG4gICAgdGVzdCgnd2l0aCBhIHZwbiBnYXRld2F5IGFuZCByb3V0ZSBwcm9wYWdhdGlvbiBvbiBwcml2YXRlIGFuZCBpc29sYXRlZCBzdWJuZXRzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIG5ldyBWcGMoc3RhY2ssICdWUEMnLCB7XG4gICAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcbiAgICAgICAgICB7IHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDLCBuYW1lOiAnUHVibGljJyB9LFxuICAgICAgICAgIHsgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfRUdSRVNTLCBuYW1lOiAnUHJpdmF0ZScgfSxcbiAgICAgICAgICB7IHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFJJVkFURV9JU09MQVRFRCwgbmFtZTogJ0lzb2xhdGVkJyB9LFxuICAgICAgICBdLFxuICAgICAgICB2cG5HYXRld2F5OiB0cnVlLFxuICAgICAgICB2cG5Sb3V0ZVByb3BhZ2F0aW9uOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfRUdSRVNTLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFX0lTT0xBVEVELFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpWUE5HYXRld2F5Um91dGVQcm9wYWdhdGlvbicsIHtcbiAgICAgICAgUm91dGVUYWJsZUlkczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlZjogJ1ZQQ1ByaXZhdGVTdWJuZXQxUm91dGVUYWJsZUJFOEE2MDI3JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlZjogJ1ZQQ1ByaXZhdGVTdWJuZXQyUm91dGVUYWJsZTBBMTlFMTBFJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlZjogJ1ZQQ1ByaXZhdGVTdWJuZXQzUm91dGVUYWJsZTE5MjE4NkY4JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlZjogJ1ZQQ0lzb2xhdGVkU3VibmV0MVJvdXRlVGFibGVFQjE1NjIxMCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZWY6ICdWUENJc29sYXRlZFN1Ym5ldDJSb3V0ZVRhYmxlOUI0Rjc4REMnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnVlBDSXNvbGF0ZWRTdWJuZXQzUm91dGVUYWJsZUNCNkExRkRBJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWcG5HYXRld2F5SWQ6IHtcbiAgICAgICAgICBSZWY6ICdWUENWcG5HYXRld2F5QjVBQkFFNjgnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cblxuICAgIH0pO1xuICAgIHRlc3QoJ3JvdXRlIHByb3BhZ2F0aW9uIGRlZmF1bHRzIHRvIGlzb2xhdGVkIHN1Ym5ldHMgd2hlbiB0aGVyZSBhcmUgbm8gcHJpdmF0ZSBzdWJuZXRzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIG5ldyBWcGMoc3RhY2ssICdWUEMnLCB7XG4gICAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcbiAgICAgICAgICB7IHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDLCBuYW1lOiAnUHVibGljJyB9LFxuICAgICAgICAgIHsgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFX0lTT0xBVEVELCBuYW1lOiAnSXNvbGF0ZWQnIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHZwbkdhdGV3YXk6IHRydWUsXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpWUE5HYXRld2F5Um91dGVQcm9wYWdhdGlvbicsIHtcbiAgICAgICAgUm91dGVUYWJsZUlkczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlZjogJ1ZQQ0lzb2xhdGVkU3VibmV0MVJvdXRlVGFibGVFQjE1NjIxMCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZWY6ICdWUENJc29sYXRlZFN1Ym5ldDJSb3V0ZVRhYmxlOUI0Rjc4REMnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnVlBDSXNvbGF0ZWRTdWJuZXQzUm91dGVUYWJsZUNCNkExRkRBJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWcG5HYXRld2F5SWQ6IHtcbiAgICAgICAgICBSZWY6ICdWUENWcG5HYXRld2F5QjVBQkFFNjgnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cblxuICAgIH0pO1xuICAgIHRlc3QoJ3JvdXRlIHByb3BhZ2F0aW9uIGRlZmF1bHRzIHRvIHB1YmxpYyBzdWJuZXRzIHdoZW4gdGhlcmUgYXJlIG5vIHByaXZhdGUvaXNvbGF0ZWQgc3VibmV0cycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBuZXcgVnBjKHN0YWNrLCAnVlBDJywge1xuICAgICAgICBzdWJuZXRDb25maWd1cmF0aW9uOiBbXG4gICAgICAgICAgeyBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBVQkxJQywgbmFtZTogJ1B1YmxpYycgfSxcbiAgICAgICAgXSxcbiAgICAgICAgdnBuR2F0ZXdheTogdHJ1ZSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlZQTkdhdGV3YXlSb3V0ZVByb3BhZ2F0aW9uJywge1xuICAgICAgICBSb3V0ZVRhYmxlSWRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnVlBDUHVibGljU3VibmV0MVJvdXRlVGFibGVGRUU0Qjc4MScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZWY6ICdWUENQdWJsaWNTdWJuZXQyUm91dGVUYWJsZTZGMUExNUYxJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlZjogJ1ZQQ1B1YmxpY1N1Ym5ldDNSb3V0ZVRhYmxlOThBRTBFMTQnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZwbkdhdGV3YXlJZDoge1xuICAgICAgICAgIFJlZjogJ1ZQQ1ZwbkdhdGV3YXlCNUFCQUU2OCcsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuXG4gICAgfSk7XG4gICAgdGVzdCgnZmFpbHMgd2hlbiBzcGVjaWZ5aW5nIHZwbkNvbm5lY3Rpb25zIHdpdGggdnBuR2F0ZXdheSBzZXQgdG8gZmFsc2UnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgICAgZXhwZWN0KCgpID0+IG5ldyBWcGMoc3RhY2ssICdWcGNOZXR3b3JrJywge1xuICAgICAgICB2cG5HYXRld2F5OiBmYWxzZSxcbiAgICAgICAgdnBuQ29ubmVjdGlvbnM6IHtcbiAgICAgICAgICBWcG5Db25uZWN0aW9uOiB7XG4gICAgICAgICAgICBhc246IDY1MDAwLFxuICAgICAgICAgICAgaXA6ICcxOTIuMC4yLjEnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KSkudG9UaHJvdygvYHZwbkNvbm5lY3Rpb25zYC4rYHZwbkdhdGV3YXlgLitmYWxzZS8pO1xuXG5cbiAgICB9KTtcbiAgICB0ZXN0KCdmYWlscyB3aGVuIHNwZWNpZnlpbmcgdnBuR2F0ZXdheUFzbiB3aXRoIHZwbkdhdGV3YXkgc2V0IHRvIGZhbHNlJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAgIGV4cGVjdCgoKSA9PiBuZXcgVnBjKHN0YWNrLCAnVnBjTmV0d29yaycsIHtcbiAgICAgICAgdnBuR2F0ZXdheTogZmFsc2UsXG4gICAgICAgIHZwbkdhdGV3YXlBc246IDY1MDAwLFxuICAgICAgfSkpLnRvVGhyb3coL2B2cG5HYXRld2F5QXNuYC4rYHZwbkdhdGV3YXlgLitmYWxzZS8pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ1N1Ym5ldHMgaGF2ZSBhIGRlZmF1bHRDaGlsZCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVnBjTmV0d29yaycpO1xuXG4gICAgICBleHBlY3QodnBjLnB1YmxpY1N1Ym5ldHNbMF0ubm9kZS5kZWZhdWx0Q2hpbGQgaW5zdGFuY2VvZiBDZm5TdWJuZXQpLnRvRXF1YWwodHJ1ZSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdDSURSIGNhbm5vdCBiZSBhIFRva2VuJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIG5ldyBWcGMoc3RhY2ssICdWcGMnLCB7XG4gICAgICAgICAgaXBBZGRyZXNzZXM6IElwQWRkcmVzc2VzLmNpZHIoTGF6eS5zdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiAnYWJjJyB9KSksXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvdygvcHJvcGVydHkgbXVzdCBiZSBhIGNvbmNyZXRlIENJRFIgc3RyaW5nLyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdEZWZhdWx0IE5BVCBnYXRld2F5IHByb3ZpZGVyJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IG5hdEdhdGV3YXlQcm92aWRlciA9IE5hdFByb3ZpZGVyLmdhdGV3YXkoKTtcbiAgICAgIG5ldyBWcGMoc3RhY2ssICdWcGNOZXR3b3JrJywgeyBuYXRHYXRld2F5UHJvdmlkZXIgfSk7XG5cbiAgICAgIGV4cGVjdChuYXRHYXRld2F5UHJvdmlkZXIuY29uZmlndXJlZEdhdGV3YXlzLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDApO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnTkFUIGdhdGV3YXkgcHJvdmlkZXIgd2l0aCBFSVAgYWxsb2NhdGlvbnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgbmF0R2F0ZXdheVByb3ZpZGVyID0gTmF0UHJvdmlkZXIuZ2F0ZXdheSh7XG4gICAgICAgIGVpcEFsbG9jYXRpb25JZHM6IFsnYScsICdiJywgJ2MnLCAnZCddLFxuICAgICAgfSk7XG4gICAgICBuZXcgVnBjKHN0YWNrLCAnVnBjTmV0d29yaycsIHsgbmF0R2F0ZXdheVByb3ZpZGVyIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6Ok5hdEdhdGV3YXknLCB7XG4gICAgICAgIEFsbG9jYXRpb25JZDogJ2EnLFxuICAgICAgfSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6Ok5hdEdhdGV3YXknLCB7XG4gICAgICAgIEFsbG9jYXRpb25JZDogJ2InLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdOQVQgZ2F0ZXdheSBwcm92aWRlciB3aXRoIGluc3VmZmljaWVudCBFSVAgYWxsb2NhdGlvbnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgbmF0R2F0ZXdheVByb3ZpZGVyID0gTmF0UHJvdmlkZXIuZ2F0ZXdheSh7IGVpcEFsbG9jYXRpb25JZHM6IFsnYSddIH0pO1xuICAgICAgZXhwZWN0KCgpID0+IG5ldyBWcGMoc3RhY2ssICdWcGNOZXR3b3JrJywgeyBuYXRHYXRld2F5UHJvdmlkZXIgfSkpXG4gICAgICAgIC50b1Rocm93KC9Ob3QgZW5vdWdoIE5BVCBnYXRld2F5IEVJUCBhbGxvY2F0aW9uIElEcyBcXCgxIHByb3ZpZGVkXFwpIGZvciB0aGUgcmVxdWVzdGVkIHN1Ym5ldCBjb3VudCBcXChcXGQrIG5lZWRlZFxcKS8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnTkFUIGdhdGV3YXkgcHJvdmlkZXIgd2l0aCB0b2tlbiBFSVAgYWxsb2NhdGlvbnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgZWlwQWxsb2NhdGlvbklkcyA9IEZuLnNwbGl0KCcsJywgRm4uaW1wb3J0VmFsdWUoJ215VnBjSWQnKSk7XG4gICAgICBjb25zdCBuYXRHYXRld2F5UHJvdmlkZXIgPSBOYXRQcm92aWRlci5nYXRld2F5KHsgZWlwQWxsb2NhdGlvbklkcyB9KTtcbiAgICAgIG5ldyBWcGMoc3RhY2ssICdWcGNOZXR3b3JrJywgeyBuYXRHYXRld2F5UHJvdmlkZXIgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6TmF0R2F0ZXdheScsIHtcbiAgICAgICAgQWxsb2NhdGlvbklkOiBzdGFjay5yZXNvbHZlKEZuLnNlbGVjdCgwLCBlaXBBbGxvY2F0aW9uSWRzKSksXG4gICAgICB9KTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6TmF0R2F0ZXdheScsIHtcbiAgICAgICAgQWxsb2NhdGlvbklkOiBzdGFjay5yZXNvbHZlKEZuLnNlbGVjdCgxLCBlaXBBbGxvY2F0aW9uSWRzKSksXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ0NhbiBhZGQgYW4gSVB2NiByb3V0ZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgICAodnBjLnB1YmxpY1N1Ym5ldHNbMF0gYXMgUHVibGljU3VibmV0KS5hZGRSb3V0ZSgnU29tZVJvdXRlJywge1xuICAgICAgICBkZXN0aW5hdGlvbklwdjZDaWRyQmxvY2s6ICcyMDAxOjQ4NjA6NDg2MDo6ODg4OC8zMicsXG4gICAgICAgIHJvdXRlcklkOiAncm91dGVyLTEnLFxuICAgICAgICByb3V0ZXJUeXBlOiBSb3V0ZXJUeXBlLk5FVFdPUktfSU5URVJGQUNFLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpSb3V0ZScsIHtcbiAgICAgICAgRGVzdGluYXRpb25JcHY2Q2lkckJsb2NrOiAnMjAwMTo0ODYwOjQ4NjA6Ojg4ODgvMzInLFxuICAgICAgICBOZXR3b3JrSW50ZXJmYWNlSWQ6ICdyb3V0ZXItMScsXG4gICAgICB9KTtcblxuXG4gICAgfSk7XG4gICAgdGVzdCgnQ2FuIGFkZCBhbiBJUHY0IHJvdXRlJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcbiAgICAgICh2cGMucHVibGljU3VibmV0c1swXSBhcyBQdWJsaWNTdWJuZXQpLmFkZFJvdXRlKCdTb21lUm91dGUnLCB7XG4gICAgICAgIGRlc3RpbmF0aW9uQ2lkckJsb2NrOiAnMC4wLjAuMC8wJyxcbiAgICAgICAgcm91dGVySWQ6ICdyb3V0ZXItMScsXG4gICAgICAgIHJvdXRlclR5cGU6IFJvdXRlclR5cGUuTkVUV09SS19JTlRFUkZBQ0UsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlJvdXRlJywge1xuICAgICAgICBEZXN0aW5hdGlvbkNpZHJCbG9jazogJzAuMC4wLjAvMCcsXG4gICAgICAgIE5ldHdvcmtJbnRlcmZhY2VJZDogJ3JvdXRlci0xJyxcbiAgICAgIH0pO1xuXG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdmcm9tVnBjQXR0cmlidXRlcycsICgpID0+IHtcbiAgICB0ZXN0KCdwYXNzZXMgcmVnaW9uIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuXG4gICAgICBjb25zdCB2cGNJZCA9IEZuLmltcG9ydFZhbHVlKCdteVZwY0lkJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHZwYyA9IFZwYy5mcm9tVnBjQXR0cmlidXRlcyhzdGFjaywgJ1ZQQycsIHtcbiAgICAgICAgdnBjSWQsXG4gICAgICAgIGF2YWlsYWJpbGl0eVpvbmVzOiBbJ3JlZ2lvbi0xMjM0NWEnLCAncmVnaW9uLTEyMzQ1YicsICdyZWdpb24tMTIzNDVjJ10sXG4gICAgICAgIHJlZ2lvbjogJ3JlZ2lvbi0xMjM0NScsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KHZwYy5lbnYucmVnaW9uKS50b0VxdWFsKCdyZWdpb24tMTIzNDUnKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3Bhc3NlcyBzdWJuZXQgSVB2NCBDSURSIGJsb2NrcyBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IFZwYy5mcm9tVnBjQXR0cmlidXRlcyhzdGFjaywgJ1ZQQycsIHtcbiAgICAgICAgdnBjSWQ6ICd2cGMtMTIzNCcsXG4gICAgICAgIGF2YWlsYWJpbGl0eVpvbmVzOiBbJ2R1bW15MWEnLCAnZHVtbXkxYicsICdkdW1teTFjJ10sXG4gICAgICAgIHB1YmxpY1N1Ym5ldElkczogWydwdWItMScsICdwdWItMicsICdwdWItMyddLFxuICAgICAgICBwdWJsaWNTdWJuZXRJcHY0Q2lkckJsb2NrczogWycxMC4wLjAuMC8xOCcsICcxMC4wLjY0LjAvMTgnLCAnMTAuMC4xMjguMC8xOCddLFxuICAgICAgICBwcml2YXRlU3VibmV0SWRzOiBbJ3ByaS0xJywgJ3ByaS0yJywgJ3ByaS0zJ10sXG4gICAgICAgIHByaXZhdGVTdWJuZXRJcHY0Q2lkckJsb2NrczogWycxMC4xMC4wLjAvMTgnLCAnMTAuMTAuNjQuMC8xOCcsICcxMC4xMC4xMjguMC8xOCddLFxuICAgICAgICBpc29sYXRlZFN1Ym5ldElkczogWydpc28tMScsICdpc28tMicsICdpc28tMyddLFxuICAgICAgICBpc29sYXRlZFN1Ym5ldElwdjRDaWRyQmxvY2tzOiBbJzEwLjIwLjAuMC8xOCcsICcxMC4yMC42NC4wLzE4JywgJzEwLjIwLjEyOC4wLzE4J10sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgcHVibGljMSA9IHZwYy5wdWJsaWNTdWJuZXRzLmZpbmQoKHsgc3VibmV0SWQgfSkgPT4gc3VibmV0SWQgPT09ICdwdWItMScpO1xuICAgICAgY29uc3QgcHVibGljMiA9IHZwYy5wdWJsaWNTdWJuZXRzLmZpbmQoKHsgc3VibmV0SWQgfSkgPT4gc3VibmV0SWQgPT09ICdwdWItMicpO1xuICAgICAgY29uc3QgcHVibGljMyA9IHZwYy5wdWJsaWNTdWJuZXRzLmZpbmQoKHsgc3VibmV0SWQgfSkgPT4gc3VibmV0SWQgPT09ICdwdWItMycpO1xuICAgICAgY29uc3QgcHJpdmF0ZTEgPSB2cGMucHJpdmF0ZVN1Ym5ldHMuZmluZCgoeyBzdWJuZXRJZCB9KSA9PiBzdWJuZXRJZCA9PT0gJ3ByaS0xJyk7XG4gICAgICBjb25zdCBwcml2YXRlMiA9IHZwYy5wcml2YXRlU3VibmV0cy5maW5kKCh7IHN1Ym5ldElkIH0pID0+IHN1Ym5ldElkID09PSAncHJpLTInKTtcbiAgICAgIGNvbnN0IHByaXZhdGUzID0gdnBjLnByaXZhdGVTdWJuZXRzLmZpbmQoKHsgc3VibmV0SWQgfSkgPT4gc3VibmV0SWQgPT09ICdwcmktMycpO1xuICAgICAgY29uc3QgaXNvbGF0ZWQxID0gdnBjLmlzb2xhdGVkU3VibmV0cy5maW5kKCh7IHN1Ym5ldElkIH0pID0+IHN1Ym5ldElkID09PSAnaXNvLTEnKTtcbiAgICAgIGNvbnN0IGlzb2xhdGVkMiA9IHZwYy5pc29sYXRlZFN1Ym5ldHMuZmluZCgoeyBzdWJuZXRJZCB9KSA9PiBzdWJuZXRJZCA9PT0gJ2lzby0yJyk7XG4gICAgICBjb25zdCBpc29sYXRlZDMgPSB2cGMuaXNvbGF0ZWRTdWJuZXRzLmZpbmQoKHsgc3VibmV0SWQgfSkgPT4gc3VibmV0SWQgPT09ICdpc28tMycpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QocHVibGljMT8uaXB2NENpZHJCbG9jaykudG9FcXVhbCgnMTAuMC4wLjAvMTgnKTtcbiAgICAgIGV4cGVjdChwdWJsaWMyPy5pcHY0Q2lkckJsb2NrKS50b0VxdWFsKCcxMC4wLjY0LjAvMTgnKTtcbiAgICAgIGV4cGVjdChwdWJsaWMzPy5pcHY0Q2lkckJsb2NrKS50b0VxdWFsKCcxMC4wLjEyOC4wLzE4Jyk7XG4gICAgICBleHBlY3QocHJpdmF0ZTE/LmlwdjRDaWRyQmxvY2spLnRvRXF1YWwoJzEwLjEwLjAuMC8xOCcpO1xuICAgICAgZXhwZWN0KHByaXZhdGUyPy5pcHY0Q2lkckJsb2NrKS50b0VxdWFsKCcxMC4xMC42NC4wLzE4Jyk7XG4gICAgICBleHBlY3QocHJpdmF0ZTM/LmlwdjRDaWRyQmxvY2spLnRvRXF1YWwoJzEwLjEwLjEyOC4wLzE4Jyk7XG4gICAgICBleHBlY3QoaXNvbGF0ZWQxPy5pcHY0Q2lkckJsb2NrKS50b0VxdWFsKCcxMC4yMC4wLjAvMTgnKTtcbiAgICAgIGV4cGVjdChpc29sYXRlZDI/LmlwdjRDaWRyQmxvY2spLnRvRXF1YWwoJzEwLjIwLjY0LjAvMTgnKTtcbiAgICAgIGV4cGVjdChpc29sYXRlZDM/LmlwdjRDaWRyQmxvY2spLnRvRXF1YWwoJzEwLjIwLjEyOC4wLzE4Jyk7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rocm93cyBvbiBpbmNvcnJlY3QgbnVtYmVyIG9mIHN1Ym5ldCBuYW1lcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAgIGV4cGVjdCgoKSA9PlxuICAgICAgICBWcGMuZnJvbVZwY0F0dHJpYnV0ZXMoc3RhY2ssICdWUEMnLCB7XG4gICAgICAgICAgdnBjSWQ6ICd2cGMtMTIzNCcsXG4gICAgICAgICAgYXZhaWxhYmlsaXR5Wm9uZXM6IFsndXMtZWFzdC0xYScsICd1cy1lYXN0LTFiJywgJ3VzLWVhc3QtMWMnXSxcbiAgICAgICAgICBwdWJsaWNTdWJuZXRJZHM6IFsncy0xMjM0NScsICdzLTM0NTY3JywgJ3MtNTY3ODknXSxcbiAgICAgICAgICBwdWJsaWNTdWJuZXROYW1lczogWydQdWJsaWMgMScsICdQdWJsaWMgMiddLFxuICAgICAgICB9KSxcbiAgICAgICkudG9UaHJvdygvcHVibGljU3VibmV0TmFtZXMgbXVzdCBoYXZlIGFuIGVudHJ5IGZvciBldmVyeSBjb3JyZXNwb25kaW5nIHN1Ym5ldCBncm91cC8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgndGhyb3dzIG9uIGluY29ycmVjdCBudW1iZXIgb2Ygcm91dGUgdGFibGUgaWRzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgICAgZXhwZWN0KCgpID0+XG4gICAgICAgIFZwYy5mcm9tVnBjQXR0cmlidXRlcyhzdGFjaywgJ1ZQQycsIHtcbiAgICAgICAgICB2cGNJZDogJ3ZwYy0xMjM0JyxcbiAgICAgICAgICBhdmFpbGFiaWxpdHlab25lczogWyd1cy1lYXN0LTFhJywgJ3VzLWVhc3QtMWInLCAndXMtZWFzdC0xYyddLFxuICAgICAgICAgIHB1YmxpY1N1Ym5ldElkczogWydzLTEyMzQ1JywgJ3MtMzQ1NjcnLCAncy01Njc4OSddLFxuICAgICAgICAgIHB1YmxpY1N1Ym5ldFJvdXRlVGFibGVJZHM6IFsncnQtMTIzNDUnXSxcbiAgICAgICAgfSksXG4gICAgICApLnRvVGhyb3coJ051bWJlciBvZiBwdWJsaWNTdWJuZXRSb3V0ZVRhYmxlSWRzICgxKSBtdXN0IGJlIGVxdWFsIHRvIHRoZSBhbW91bnQgb2YgcHVibGljU3VibmV0SWRzICgzKS4nKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rocm93cyBvbiBpbmNvcnJlY3QgbnVtYmVyIG9mIHN1Ym5ldCBJUHY0IENJRFIgYmxvY2tzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgICAgZXhwZWN0KCgpID0+XG4gICAgICAgIFZwYy5mcm9tVnBjQXR0cmlidXRlcyhzdGFjaywgJ1ZQQycsIHtcbiAgICAgICAgICB2cGNJZDogJ3ZwYy0xMjM0JyxcbiAgICAgICAgICBhdmFpbGFiaWxpdHlab25lczogWyd1cy1lYXN0LTFhJywgJ3VzLWVhc3QtMWInLCAndXMtZWFzdC0xYyddLFxuICAgICAgICAgIHB1YmxpY1N1Ym5ldElkczogWydzLTEyMzQ1JywgJ3MtMzQ1NjcnLCAncy01Njc4OSddLFxuICAgICAgICAgIHB1YmxpY1N1Ym5ldElwdjRDaWRyQmxvY2tzOiBbJzEwLjAuMC4wLzE4JywgJzEwLjAuNjQuMC8xOCddLFxuICAgICAgICB9KSxcbiAgICAgICkudG9UaHJvdygnTnVtYmVyIG9mIHB1YmxpY1N1Ym5ldElwdjRDaWRyQmxvY2tzICgyKSBtdXN0IGJlIGVxdWFsIHRvIHRoZSBhbW91bnQgb2YgcHVibGljU3VibmV0SWRzICgzKS4nKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ05BVCBpbnN0YW5jZXMnLCAoKSA9PiB7XG4gICAgdGVzdCgnQ2FuIGNvbmZpZ3VyZSBOQVQgaW5zdGFuY2VzIGluc3RlYWQgb2YgTkFUIGdhdGV3YXlzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IG5hdEdhdGV3YXlQcm92aWRlciA9IE5hdFByb3ZpZGVyLmluc3RhbmNlKHtcbiAgICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgSW5zdGFuY2VUeXBlKCdxODYubWVnYScpLFxuICAgICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBHZW5lcmljTGludXhJbWFnZSh7XG4gICAgICAgICAgJ3VzLWVhc3QtMSc6ICdhbWktMScsXG4gICAgICAgIH0pLFxuICAgICAgfSk7XG4gICAgICBuZXcgVnBjKHN0YWNrLCAnVGhlVlBDJywgeyBuYXRHYXRld2F5UHJvdmlkZXIgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkVDMjo6SW5zdGFuY2UnLCAzKTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6SW5zdGFuY2UnLCB7XG4gICAgICAgIEltYWdlSWQ6ICdhbWktMScsXG4gICAgICAgIEluc3RhbmNlVHlwZTogJ3E4Ni5tZWdhJyxcbiAgICAgICAgU291cmNlRGVzdENoZWNrOiBmYWxzZSxcbiAgICAgIH0pO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpSb3V0ZScsIHtcbiAgICAgICAgUm91dGVUYWJsZUlkOiB7IFJlZjogJ1RoZVZQQ1ByaXZhdGVTdWJuZXQxUm91dGVUYWJsZUY2NTEzQkMyJyB9LFxuICAgICAgICBEZXN0aW5hdGlvbkNpZHJCbG9jazogJzAuMC4wLjAvMCcsXG4gICAgICAgIEluc3RhbmNlSWQ6IHsgUmVmOiAnVGhlVlBDUHVibGljU3VibmV0MU5hdEluc3RhbmNlQ0M1MTQxOTInIH0sXG4gICAgICB9KTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U2VjdXJpdHlHcm91cCcsIHtcbiAgICAgICAgU2VjdXJpdHlHcm91cEVncmVzczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIENpZHJJcDogJzAuMC4wLjAvMCcsXG4gICAgICAgICAgICBEZXNjcmlwdGlvbjogJ0FsbG93IGFsbCBvdXRib3VuZCB0cmFmZmljIGJ5IGRlZmF1bHQnLFxuICAgICAgICAgICAgSXBQcm90b2NvbDogJy0xJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBTZWN1cml0eUdyb3VwSW5ncmVzczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIENpZHJJcDogJzAuMC4wLjAvMCcsXG4gICAgICAgICAgICBEZXNjcmlwdGlvbjogJ2Zyb20gMC4wLjAuMC8wOkFMTCBUUkFGRklDJyxcbiAgICAgICAgICAgIElwUHJvdG9jb2w6ICctMScsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ25hdEdhdGV3YXlzIGNvbnRyb2xzIGFtb3VudCBvZiBOQVQgaW5zdGFuY2VzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBWcGMoc3RhY2ssICdUaGVWUEMnLCB7XG4gICAgICAgIG5hdEdhdGV3YXlQcm92aWRlcjogTmF0UHJvdmlkZXIuaW5zdGFuY2Uoe1xuICAgICAgICAgIGluc3RhbmNlVHlwZTogbmV3IEluc3RhbmNlVHlwZSgncTg2Lm1lZ2EnKSxcbiAgICAgICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBHZW5lcmljTGludXhJbWFnZSh7XG4gICAgICAgICAgICAndXMtZWFzdC0xJzogJ2FtaS0xJyxcbiAgICAgICAgICB9KSxcbiAgICAgICAgfSksXG4gICAgICAgIG5hdEdhdGV3YXlzOiAxLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkVDMjo6SW5zdGFuY2UnLCAxKTtcbiAgICB9KTtcblxuICAgIHRlc3REZXByZWNhdGVkKCdjYW4gY29uZmlndXJlIFNlY3VyaXR5IEdyb3VwcyBvZiBOQVQgaW5zdGFuY2VzIHdpdGggYWxsb3dBbGxUcmFmZmljIGZhbHNlJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHByb3ZpZGVyID0gTmF0UHJvdmlkZXIuaW5zdGFuY2Uoe1xuICAgICAgICBpbnN0YW5jZVR5cGU6IG5ldyBJbnN0YW5jZVR5cGUoJ3E4Ni5tZWdhJyksXG4gICAgICAgIG1hY2hpbmVJbWFnZTogbmV3IEdlbmVyaWNMaW51eEltYWdlKHtcbiAgICAgICAgICAndXMtZWFzdC0xJzogJ2FtaS0xJyxcbiAgICAgICAgfSksXG4gICAgICAgIGFsbG93QWxsVHJhZmZpYzogZmFsc2UsXG4gICAgICB9KTtcbiAgICAgIG5ldyBWcGMoc3RhY2ssICdUaGVWUEMnLCB7XG4gICAgICAgIG5hdEdhdGV3YXlQcm92aWRlcjogcHJvdmlkZXIsXG4gICAgICB9KTtcbiAgICAgIHByb3ZpZGVyLmNvbm5lY3Rpb25zLmFsbG93RnJvbShQZWVyLmlwdjQoJzEuMi4zLjQvMzInKSwgUG9ydC50Y3AoODYpKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwJywge1xuICAgICAgICBTZWN1cml0eUdyb3VwRWdyZXNzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQ2lkcklwOiAnMC4wLjAuMC8wJyxcbiAgICAgICAgICAgIERlc2NyaXB0aW9uOiAnQWxsb3cgYWxsIG91dGJvdW5kIHRyYWZmaWMgYnkgZGVmYXVsdCcsXG4gICAgICAgICAgICBJcFByb3RvY29sOiAnLTEnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFNlY3VyaXR5R3JvdXBJbmdyZXNzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQ2lkcklwOiAnMS4yLjMuNC8zMicsXG4gICAgICAgICAgICBEZXNjcmlwdGlvbjogJ2Zyb20gMS4yLjMuNC8zMjo4NicsXG4gICAgICAgICAgICBGcm9tUG9ydDogODYsXG4gICAgICAgICAgICBJcFByb3RvY29sOiAndGNwJyxcbiAgICAgICAgICAgIFRvUG9ydDogODYsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiBjb25maWd1cmUgU2VjdXJpdHkgR3JvdXBzIG9mIE5BVCBpbnN0YW5jZXMgd2l0aCBkZWZhdWx0QWxsb3dBbGwgSU5CT1VORF9BTkRfT1VUQk9VTkQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgcHJvdmlkZXIgPSBOYXRQcm92aWRlci5pbnN0YW5jZSh7XG4gICAgICAgIGluc3RhbmNlVHlwZTogbmV3IEluc3RhbmNlVHlwZSgncTg2Lm1lZ2EnKSxcbiAgICAgICAgbWFjaGluZUltYWdlOiBuZXcgR2VuZXJpY0xpbnV4SW1hZ2Uoe1xuICAgICAgICAgICd1cy1lYXN0LTEnOiAnYW1pLTEnLFxuICAgICAgICB9KSxcbiAgICAgICAgZGVmYXVsdEFsbG93ZWRUcmFmZmljOiBOYXRUcmFmZmljRGlyZWN0aW9uLklOQk9VTkRfQU5EX09VVEJPVU5ELFxuICAgICAgfSk7XG4gICAgICBuZXcgVnBjKHN0YWNrLCAnVGhlVlBDJywge1xuICAgICAgICBuYXRHYXRld2F5UHJvdmlkZXI6IHByb3ZpZGVyLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U2VjdXJpdHlHcm91cCcsIHtcbiAgICAgICAgU2VjdXJpdHlHcm91cEVncmVzczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIENpZHJJcDogJzAuMC4wLjAvMCcsXG4gICAgICAgICAgICBEZXNjcmlwdGlvbjogJ0FsbG93IGFsbCBvdXRib3VuZCB0cmFmZmljIGJ5IGRlZmF1bHQnLFxuICAgICAgICAgICAgSXBQcm90b2NvbDogJy0xJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBTZWN1cml0eUdyb3VwSW5ncmVzczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIENpZHJJcDogJzAuMC4wLjAvMCcsXG4gICAgICAgICAgICBEZXNjcmlwdGlvbjogJ2Zyb20gMC4wLjAuMC8wOkFMTCBUUkFGRklDJyxcbiAgICAgICAgICAgIElwUHJvdG9jb2w6ICctMScsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiBjb25maWd1cmUgU2VjdXJpdHkgR3JvdXBzIG9mIE5BVCBpbnN0YW5jZXMgd2l0aCBkZWZhdWx0QWxsb3dBbGwgT1VUQk9VTkRfT05MWScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBwcm92aWRlciA9IE5hdFByb3ZpZGVyLmluc3RhbmNlKHtcbiAgICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgSW5zdGFuY2VUeXBlKCdxODYubWVnYScpLFxuICAgICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBHZW5lcmljTGludXhJbWFnZSh7XG4gICAgICAgICAgJ3VzLWVhc3QtMSc6ICdhbWktMScsXG4gICAgICAgIH0pLFxuICAgICAgICBkZWZhdWx0QWxsb3dlZFRyYWZmaWM6IE5hdFRyYWZmaWNEaXJlY3Rpb24uT1VUQk9VTkRfT05MWSxcbiAgICAgIH0pO1xuICAgICAgbmV3IFZwYyhzdGFjaywgJ1RoZVZQQycsIHtcbiAgICAgICAgbmF0R2F0ZXdheVByb3ZpZGVyOiBwcm92aWRlcixcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXAnLCB7XG4gICAgICAgIFNlY3VyaXR5R3JvdXBFZ3Jlc3M6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBDaWRySXA6ICcwLjAuMC4wLzAnLFxuICAgICAgICAgICAgRGVzY3JpcHRpb246ICdBbGxvdyBhbGwgb3V0Ym91bmQgdHJhZmZpYyBieSBkZWZhdWx0JyxcbiAgICAgICAgICAgIElwUHJvdG9jb2w6ICctMScsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiBjb25maWd1cmUgU2VjdXJpdHkgR3JvdXBzIG9mIE5BVCBpbnN0YW5jZXMgd2l0aCBkZWZhdWx0QWxsb3dBbGwgTk9ORScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBwcm92aWRlciA9IE5hdFByb3ZpZGVyLmluc3RhbmNlKHtcbiAgICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgSW5zdGFuY2VUeXBlKCdxODYubWVnYScpLFxuICAgICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBHZW5lcmljTGludXhJbWFnZSh7XG4gICAgICAgICAgJ3VzLWVhc3QtMSc6ICdhbWktMScsXG4gICAgICAgIH0pLFxuICAgICAgICBkZWZhdWx0QWxsb3dlZFRyYWZmaWM6IE5hdFRyYWZmaWNEaXJlY3Rpb24uTk9ORSxcbiAgICAgIH0pO1xuICAgICAgbmV3IFZwYyhzdGFjaywgJ1RoZVZQQycsIHtcbiAgICAgICAgbmF0R2F0ZXdheVByb3ZpZGVyOiBwcm92aWRlcixcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXAnLCB7XG4gICAgICAgIFNlY3VyaXR5R3JvdXBFZ3Jlc3M6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBDaWRySXA6ICcyNTUuMjU1LjI1NS4yNTUvMzInLFxuICAgICAgICAgICAgRGVzY3JpcHRpb246ICdEaXNhbGxvdyBhbGwgdHJhZmZpYycsXG4gICAgICAgICAgICBGcm9tUG9ydDogMjUyLFxuICAgICAgICAgICAgSXBQcm90b2NvbDogJ2ljbXAnLFxuICAgICAgICAgICAgVG9Qb3J0OiA4NixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cblxuICAgIH0pO1xuXG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdOZXR3b3JrIEFDTCBhc3NvY2lhdGlvbicsICgpID0+IHtcbiAgICB0ZXN0KCdieSBkZWZhdWx0IHVzZXMgZGVmYXVsdCBBQ0wgcmVmZXJlbmNlJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdUaGVWUEMnLCB7IGlwQWRkcmVzc2VzOiBJcEFkZHJlc3Nlcy5jaWRyKCcxOTIuMTY4LjAuMC8xNicpIH0pO1xuICAgICAgbmV3IENmbk91dHB1dChzdGFjaywgJ091dHB1dCcsIHtcbiAgICAgICAgdmFsdWU6ICh2cGMucHVibGljU3VibmV0c1swXSBhcyBTdWJuZXQpLnN1Ym5ldE5ldHdvcmtBY2xBc3NvY2lhdGlvbklkLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgICAgT3V0cHV0czoge1xuICAgICAgICAgIE91dHB1dDoge1xuICAgICAgICAgICAgVmFsdWU6IHsgJ0ZuOjpHZXRBdHQnOiBbJ1RoZVZQQ1B1YmxpY1N1Ym5ldDFTdWJuZXQ3NzBENEZGMicsICdOZXR3b3JrQWNsQXNzb2NpYXRpb25JZCddIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnaWYgQUNMIGlzIHJlcGxhY2VkIG5ldyBBQ0wgcmVmZXJlbmNlIGlzIHJldHVybmVkJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVGhlVlBDJywgeyBpcEFkZHJlc3NlczogSXBBZGRyZXNzZXMuY2lkcignMTkyLjE2OC4wLjAvMTYnKSB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IENmbk91dHB1dChzdGFjaywgJ091dHB1dCcsIHtcbiAgICAgICAgdmFsdWU6ICh2cGMucHVibGljU3VibmV0c1swXSBhcyBTdWJuZXQpLnN1Ym5ldE5ldHdvcmtBY2xBc3NvY2lhdGlvbklkLFxuICAgICAgfSk7XG4gICAgICBuZXcgTmV0d29ya0FjbChzdGFjaywgJ0FDTCcsIHtcbiAgICAgICAgdnBjLFxuICAgICAgICBzdWJuZXRTZWxlY3Rpb246IHsgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QVUJMSUMgfSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICAgIE91dHB1dHM6IHtcbiAgICAgICAgICBPdXRwdXQ6IHtcbiAgICAgICAgICAgIFZhbHVlOiB7IFJlZjogJ0FDTERCRDFCQjQ5JyB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ1doZW4gY3JlYXRpbmcgYSBWUEMgd2l0aCBhIGN1c3RvbSBDSURSIHJhbmdlJywgKCkgPT4ge1xuICAgIHRlc3QoJ3ZwYy52cGNDaWRyQmxvY2sgaXMgdGhlIGNvcnJlY3QgbmV0d29yayByYW5nZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBuZXcgVnBjKHN0YWNrLCAnVGhlVlBDJywgeyBpcEFkZHJlc3NlczogSXBBZGRyZXNzZXMuY2lkcignMTkyLjE2OC4wLjAvMTYnKSB9KTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6VlBDJywge1xuICAgICAgICBDaWRyQmxvY2s6ICcxOTIuMTY4LjAuMC8xNicsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG4gIGRlc2NyaWJlKCdXaGVuIHRhZ2dpbmcnLCAoKSA9PiB7XG4gICAgdGVzdCgnVlBDIHByb3BhZ2F0ZWQgdGFncyB3aWxsIGJlIG9uIHN1Ym5ldCwgSUdXLCByb3V0ZXRhYmxlcywgTkFUR1cnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgY29uc3QgdGFncyA9IHtcbiAgICAgICAgVnBjVHlwZTogJ0dvb2QnLFxuICAgICAgfTtcbiAgICAgIGNvbnN0IG5vUHJvcFRhZ3MgPSB7XG4gICAgICAgIEJ1c2luZXNzVW5pdDogJ01hcmtldGluZycsXG4gICAgICB9O1xuICAgICAgY29uc3QgYWxsVGFncyA9IHsgLi4ubm9Qcm9wVGFncywgLi4udGFncyB9O1xuXG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVGhlVlBDJyk7XG4gICAgICAvLyBvdmVyd3JpdGUgdG8gc2V0IHByb3BhZ2F0ZVxuICAgICAgVGFncy5vZih2cGMpLmFkZCgnQnVzaW5lc3NVbml0JywgJ01hcmtldGluZycsIHsgaW5jbHVkZVJlc291cmNlVHlwZXM6IFtDZm5WUEMuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRV0gfSk7XG4gICAgICBUYWdzLm9mKHZwYykuYWRkKCdWcGNUeXBlJywgJ0dvb2QnKTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6RUMyOjpWUEMnLCBoYXNUYWdzKHRvQ2ZuVGFncyhhbGxUYWdzKSkpO1xuICAgICAgY29uc3QgdGFnZ2FibGVzID0gWydTdWJuZXQnLCAnSW50ZXJuZXRHYXRld2F5JywgJ05hdEdhdGV3YXknLCAnUm91dGVUYWJsZSddO1xuICAgICAgY29uc3QgcHJvcFRhZ3MgPSB0b0NmblRhZ3ModGFncyk7XG4gICAgICBjb25zdCBub1Byb3AgPSB0b0NmblRhZ3Mobm9Qcm9wVGFncyk7XG4gICAgICBmb3IgKGNvbnN0IHJlc291cmNlIG9mIHRhZ2dhYmxlcykge1xuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcyhgQVdTOjpFQzI6OiR7cmVzb3VyY2V9YCwge1xuICAgICAgICAgIFRhZ3M6IE1hdGNoLmFycmF5V2l0aChwcm9wVGFncyksXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBtYXRjaGluZ1Jlc291cmNlcyA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuZmluZFJlc291cmNlcyhgQVdTOjpFQzI6OiR7cmVzb3VyY2V9YCwgaGFzVGFncyhub1Byb3ApKTtcbiAgICAgICAgZXhwZWN0KE9iamVjdC5rZXlzKG1hdGNoaW5nUmVzb3VyY2VzKS5sZW5ndGgpLnRvQmUoMCk7XG4gICAgICB9XG5cbiAgICB9KTtcbiAgICB0ZXN0KCdTdWJuZXQgTmFtZSB3aWxsIHByb3BhZ2F0ZSB0byByb3V0ZSB0YWJsZXMgYW5kIE5BVEdXJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdUaGVWUEMnKTtcbiAgICAgIGZvciAoY29uc3Qgc3VibmV0IG9mIHZwYy5wdWJsaWNTdWJuZXRzKSB7XG4gICAgICAgIGNvbnN0IHRhZyA9IHsgS2V5OiAnTmFtZScsIFZhbHVlOiBzdWJuZXQubm9kZS5wYXRoIH07XG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6RUMyOjpOYXRHYXRld2F5JywgaGFzVGFncyhbdGFnXSkpO1xuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkVDMjo6Um91dGVUYWJsZScsIGhhc1RhZ3MoW3RhZ10pKTtcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3Qgc3VibmV0IG9mIHZwYy5wcml2YXRlU3VibmV0cykge1xuICAgICAgICBjb25zdCB0YWcgPSB7IEtleTogJ05hbWUnLCBWYWx1ZTogc3VibmV0Lm5vZGUucGF0aCB9O1xuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkVDMjo6Um91dGVUYWJsZScsIGhhc1RhZ3MoW3RhZ10pKTtcbiAgICAgIH1cblxuICAgIH0pO1xuICAgIHRlc3QoJ1RhZ3MgY2FuIGJlIGFkZGVkIGFmdGVyIHRoZSBWcGMgaXMgY3JlYXRlZCB3aXRoIGB2cGMudGFncy5zZXRUYWcoLi4uKWAnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuXG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVGhlVlBDJyk7XG4gICAgICBjb25zdCB0YWcgPSB7IEtleTogJ0xhdGUnLCBWYWx1ZTogJ0FkZGVyJyB9O1xuICAgICAgVGFncy5vZih2cGMpLmFkZCh0YWcuS2V5LCB0YWcuVmFsdWUpO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpFQzI6OlZQQycsIGhhc1RhZ3MoW3RhZ10pKTtcblxuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnc3VibmV0IHNlbGVjdGlvbicsICgpID0+IHtcbiAgICB0ZXN0KCdzZWxlY3RpbmcgZGVmYXVsdCBzdWJuZXRzIHJldHVybnMgdGhlIHByaXZhdGUgb25lcycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCB7IHN1Ym5ldElkcyB9ID0gdnBjLnNlbGVjdFN1Ym5ldHMoKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KHN1Ym5ldElkcykudG9FcXVhbCh2cGMucHJpdmF0ZVN1Ym5ldHMubWFwKHMgPT4gcy5zdWJuZXRJZCkpO1xuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjYW4gc2VsZWN0IHB1YmxpYyBzdWJuZXRzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHsgc3VibmV0SWRzIH0gPSB2cGMuc2VsZWN0U3VibmV0cyh7IHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3Qoc3VibmV0SWRzKS50b0VxdWFsKHZwYy5wdWJsaWNTdWJuZXRzLm1hcChzID0+IHMuc3VibmV0SWQpKTtcblxuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjYW4gc2VsZWN0IGlzb2xhdGVkIHN1Ym5ldHMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnLCB7XG4gICAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcbiAgICAgICAgICB7IHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDLCBuYW1lOiAnUHVibGljJyB9LFxuICAgICAgICAgIHsgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFX0lTT0xBVEVELCBuYW1lOiAnSXNvbGF0ZWQnIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgeyBzdWJuZXRJZHMgfSA9IHZwYy5zZWxlY3RTdWJuZXRzKHsgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFX0lTT0xBVEVEIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3Qoc3VibmV0SWRzKS50b0VxdWFsKHZwYy5pc29sYXRlZFN1Ym5ldHMubWFwKHMgPT4gcy5zdWJuZXRJZCkpO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiBzZWxlY3Qgc3VibmV0cyBieSBuYW1lJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJywge1xuICAgICAgICBzdWJuZXRDb25maWd1cmF0aW9uOiBbXG4gICAgICAgICAgeyBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBVQkxJQywgbmFtZTogJ0JsYUJsYScgfSxcbiAgICAgICAgICB7IHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX0VHUkVTUywgbmFtZTogJ0RvbnRUYWxrVG9NZScgfSxcbiAgICAgICAgICB7IHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFJJVkFURV9JU09MQVRFRCwgbmFtZTogJ0RvbnRUYWxrQXRBbGwnIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgeyBzdWJuZXRJZHMgfSA9IHZwYy5zZWxlY3RTdWJuZXRzKHsgc3VibmV0R3JvdXBOYW1lOiAnRG9udFRhbGtUb01lJyB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KHN1Ym5ldElkcykudG9FcXVhbCh2cGMucHJpdmF0ZVN1Ym5ldHMubWFwKHMgPT4gcy5zdWJuZXRJZCkpO1xuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdzdWJuZXROYW1lIGlzIGFuIGFsaWFzIGZvciBzdWJuZXRHcm91cE5hbWUgKGJhY2t3YXJkcyBjb21wYXQpJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJywge1xuICAgICAgICBzdWJuZXRDb25maWd1cmF0aW9uOiBbXG4gICAgICAgICAgeyBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBVQkxJQywgbmFtZTogJ0JsYUJsYScgfSxcbiAgICAgICAgICB7IHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX0VHUkVTUywgbmFtZTogJ0RvbnRUYWxrVG9NZScgfSxcbiAgICAgICAgICB7IHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFJJVkFURV9JU09MQVRFRCwgbmFtZTogJ0RvbnRUYWxrQXRBbGwnIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgeyBzdWJuZXRJZHMgfSA9IHZwYy5zZWxlY3RTdWJuZXRzKHsgc3VibmV0TmFtZTogJ0RvbnRUYWxrVG9NZScgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChzdWJuZXRJZHMpLnRvRXF1YWwodnBjLnByaXZhdGVTdWJuZXRzLm1hcChzID0+IHMuc3VibmV0SWQpKTtcblxuICAgIH0pO1xuXG4gICAgdGVzdCgnc2VsZWN0aW5nIGRlZmF1bHQgc3VibmV0cyBpbiBhIFZQQyB3aXRoIG9ubHkgaXNvbGF0ZWQgc3VibmV0cyByZXR1cm5zIHRoZSBpc29sYXRlZHMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IFZwYy5mcm9tVnBjQXR0cmlidXRlcyhzdGFjaywgJ1ZQQycsIHtcbiAgICAgICAgdnBjSWQ6ICd2cGMtMTIzNCcsXG4gICAgICAgIGF2YWlsYWJpbGl0eVpvbmVzOiBbJ2R1bW15MWEnLCAnZHVtbXkxYicsICdkdW1teTFjJ10sXG4gICAgICAgIGlzb2xhdGVkU3VibmV0SWRzOiBbJ2lzby0xJywgJ2lzby0yJywgJ2lzby0zJ10sXG4gICAgICAgIGlzb2xhdGVkU3VibmV0Um91dGVUYWJsZUlkczogWydydC0xJywgJ3J0LTInLCAncnQtMyddLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHN1Ym5ldHMgPSB2cGMuc2VsZWN0U3VibmV0cygpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3Qoc3VibmV0cy5zdWJuZXRJZHMpLnRvRXF1YWwoWydpc28tMScsICdpc28tMicsICdpc28tMyddKTtcblxuICAgIH0pO1xuXG4gICAgdGVzdCgnc2VsZWN0aW5nIGRlZmF1bHQgc3VibmV0cyBpbiBhIFZQQyB3aXRoIG9ubHkgcHVibGljIHN1Ym5ldHMgcmV0dXJucyB0aGUgcHVibGljcycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gVnBjLmZyb21WcGNBdHRyaWJ1dGVzKHN0YWNrLCAnVlBDJywge1xuICAgICAgICB2cGNJZDogJ3ZwYy0xMjM0JyxcbiAgICAgICAgYXZhaWxhYmlsaXR5Wm9uZXM6IFsnZHVtbXkxYScsICdkdW1teTFiJywgJ2R1bW15MWMnXSxcbiAgICAgICAgcHVibGljU3VibmV0SWRzOiBbJ3B1Yi0xJywgJ3B1Yi0yJywgJ3B1Yi0zJ10sXG4gICAgICAgIHB1YmxpY1N1Ym5ldFJvdXRlVGFibGVJZHM6IFsncnQtMScsICdydC0yJywgJ3J0LTMnXSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBzdWJuZXRzID0gdnBjLnNlbGVjdFN1Ym5ldHMoKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KHN1Ym5ldHMuc3VibmV0SWRzKS50b0VxdWFsKFsncHViLTEnLCAncHViLTInLCAncHViLTMnXSk7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3NlbGVjdGluZyBzdWJuZXRzIGJ5IG5hbWUgZmFpbHMgaWYgdGhlIG5hbWUgaXMgdW5rbm93bicsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICB2cGMuc2VsZWN0U3VibmV0cyh7IHN1Ym5ldEdyb3VwTmFtZTogJ1Rvb3QnIH0pO1xuICAgICAgfSkudG9UaHJvdygvVGhlcmUgYXJlIG5vIHN1Ym5ldCBncm91cHMgd2l0aCBuYW1lICdUb290JyBpbiB0aGlzIFZQQy4gQXZhaWxhYmxlIG5hbWVzOiBQdWJsaWMsUHJpdmF0ZS8pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3NlbGVjdCBzdWJuZXRzIHdpdGggYXogcmVzdHJpY3Rpb24nLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWcGNOZXR3b3JrJywge1xuICAgICAgICBtYXhBenM6IDEsXG4gICAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcbiAgICAgICAgICB7IG5hbWU6ICdsYicsIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDIH0sXG4gICAgICAgICAgeyBuYW1lOiAnYXBwJywgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfRUdSRVNTIH0sXG4gICAgICAgICAgeyBuYW1lOiAnZGInLCBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9FR1JFU1MgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCB7IHN1Ym5ldElkcyB9ID0gdnBjLnNlbGVjdFN1Ym5ldHMoeyBvbmVQZXJBejogdHJ1ZSB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KHN1Ym5ldElkcy5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgICBleHBlY3Qoc3VibmV0SWRzWzBdKS50b0VxdWFsKHZwYy5wcml2YXRlU3VibmV0c1swXS5zdWJuZXRJZCk7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2Zyb21WcGNBdHRyaWJ1dGVzIHVzaW5nIHVua25vd24tbGVuZ3RoIGxpc3QgdG9rZW5zJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG5cbiAgICAgIGNvbnN0IHZwY0lkID0gRm4uaW1wb3J0VmFsdWUoJ215VnBjSWQnKTtcbiAgICAgIGNvbnN0IGF2YWlsYWJpbGl0eVpvbmVzID0gRm4uc3BsaXQoJywnLCBGbi5pbXBvcnRWYWx1ZSgnbXlBdmFpbGFiaWxpdHlab25lcycpKTtcbiAgICAgIGNvbnN0IHB1YmxpY1N1Ym5ldElkcyA9IEZuLnNwbGl0KCcsJywgRm4uaW1wb3J0VmFsdWUoJ215UHVibGljU3VibmV0SWRzJykpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCB2cGMgPSBWcGMuZnJvbVZwY0F0dHJpYnV0ZXMoc3RhY2ssICdWUEMnLCB7XG4gICAgICAgIHZwY0lkLFxuICAgICAgICBhdmFpbGFiaWxpdHlab25lcyxcbiAgICAgICAgcHVibGljU3VibmV0SWRzLFxuICAgICAgfSk7XG5cbiAgICAgIG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ1Jlc291cmNlJywge1xuICAgICAgICB0eXBlOiAnU29tZTo6UmVzb3VyY2UnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgc3VibmV0SWRzOiB2cGMuc2VsZWN0U3VibmV0cygpLnN1Ym5ldElkcyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOIC0gTm8gZXhjZXB0aW9uXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnU29tZTo6UmVzb3VyY2UnLCB7XG4gICAgICAgIHN1Ym5ldElkczogeyAnRm46OlNwbGl0JzogWycsJywgeyAnRm46OkltcG9ydFZhbHVlJzogJ215UHVibGljU3VibmV0SWRzJyB9XSB9LFxuICAgICAgfSk7XG5cbiAgICAgIEFubm90YXRpb25zLmZyb21TdGFjayhzdGFjaykuaGFzV2FybmluZygnL1Rlc3RTdGFjay9WUEMnLCBcImZyb21WcGNBdHRyaWJ1dGVzOiAnYXZhaWxhYmlsaXR5Wm9uZXMnIGlzIGEgbGlzdCB0b2tlbjogdGhlIGltcG9ydGVkIFZQQyB3aWxsIG5vdCB3b3JrIHdpdGggY29uc3RydWN0cyB0aGF0IHJlcXVpcmUgYSBsaXN0IG9mIHN1Ym5ldHMgYXQgc3ludGhlc2lzIHRpbWUuIFVzZSAnVnBjLmZyb21Mb29rdXAoKScgb3IgJ0ZuLmltcG9ydExpc3RWYWx1ZScgaW5zdGVhZC5cIik7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdmcm9tVnBjQXR0cmlidXRlcyB1c2luZyBmaXhlZC1sZW5ndGggbGlzdCB0b2tlbnMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcblxuICAgICAgY29uc3QgdnBjSWQgPSBGbi5pbXBvcnRWYWx1ZSgnbXlWcGNJZCcpO1xuICAgICAgY29uc3QgYXZhaWxhYmlsaXR5Wm9uZXMgPSBGbi5pbXBvcnRMaXN0VmFsdWUoJ215QXZhaWxhYmlsaXR5Wm9uZXMnLCAyKTtcbiAgICAgIGNvbnN0IHB1YmxpY1N1Ym5ldElkcyA9IEZuLmltcG9ydExpc3RWYWx1ZSgnbXlQdWJsaWNTdWJuZXRJZHMnLCAyKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgdnBjID0gVnBjLmZyb21WcGNBdHRyaWJ1dGVzKHN0YWNrLCAnVlBDJywge1xuICAgICAgICB2cGNJZCxcbiAgICAgICAgYXZhaWxhYmlsaXR5Wm9uZXMsXG4gICAgICAgIHB1YmxpY1N1Ym5ldElkcyxcbiAgICAgIH0pO1xuXG4gICAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdSZXNvdXJjZScsIHtcbiAgICAgICAgdHlwZTogJ1NvbWU6OlJlc291cmNlJyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHN1Ym5ldElkczogdnBjLnNlbGVjdFN1Ym5ldHMoKS5zdWJuZXRJZHMsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTiAtIE5vIGV4Y2VwdGlvblxuXG4gICAgICBjb25zdCBwdWJsaWNTdWJuZXRMaXN0ID0geyAnRm46OlNwbGl0JzogWycsJywgeyAnRm46OkltcG9ydFZhbHVlJzogJ215UHVibGljU3VibmV0SWRzJyB9XSB9O1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ1NvbWU6OlJlc291cmNlJywge1xuICAgICAgICBzdWJuZXRJZHM6IFtcbiAgICAgICAgICB7ICdGbjo6U2VsZWN0JzogWzAsIHB1YmxpY1N1Ym5ldExpc3RdIH0sXG4gICAgICAgICAgeyAnRm46OlNlbGVjdCc6IFsxLCBwdWJsaWNTdWJuZXRMaXN0XSB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnc2VsZWN0IGV4cGxpY2l0bHkgZGVmaW5lZCBzdWJuZXRzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBWcGMuZnJvbVZwY0F0dHJpYnV0ZXMoc3RhY2ssICdWUEMnLCB7XG4gICAgICAgIHZwY0lkOiAndnBjLTEyMzQnLFxuICAgICAgICBhdmFpbGFiaWxpdHlab25lczogWydkdW1teTFhJywgJ2R1bW15MWInLCAnZHVtbXkxYyddLFxuICAgICAgICBwdWJsaWNTdWJuZXRJZHM6IFsncHViLTEnLCAncHViLTInLCAncHViLTMnXSxcbiAgICAgICAgcHVibGljU3VibmV0Um91dGVUYWJsZUlkczogWydydC0xJywgJ3J0LTInLCAncnQtMyddLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBzdWJuZXQgPSBuZXcgUHJpdmF0ZVN1Ym5ldChzdGFjaywgJ1N1Ym5ldCcsIHtcbiAgICAgICAgYXZhaWxhYmlsaXR5Wm9uZTogdnBjLmF2YWlsYWJpbGl0eVpvbmVzWzBdLFxuICAgICAgICBjaWRyQmxvY2s6ICcxMC4wLjAuMC8yOCcsXG4gICAgICAgIHZwY0lkOiB2cGMudnBjSWQsXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgeyBzdWJuZXRJZHMgfSA9IHZwYy5zZWxlY3RTdWJuZXRzKHsgc3VibmV0czogW3N1Ym5ldF0gfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChzdWJuZXRJZHMubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgZXhwZWN0KHN1Ym5ldElkc1swXSkudG9FcXVhbChzdWJuZXQuc3VibmV0SWQpO1xuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdzdWJuZXQgY3JlYXRlZCBmcm9tIHN1Ym5ldElkJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHN1Ym5ldCA9IFN1Ym5ldC5mcm9tU3VibmV0SWQoc3RhY2ssICdzdWJuZXQxJywgJ3B1Yi0xJyk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChzdWJuZXQuc3VibmV0SWQpLnRvRXF1YWwoJ3B1Yi0xJyk7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ1JlZmVyZW5jaW5nIEFaIHRocm93cyBlcnJvciB3aGVuIHN1Ym5ldCBjcmVhdGVkIGZyb20gc3VibmV0SWQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3Qgc3VibmV0ID0gU3VibmV0LmZyb21TdWJuZXRJZChzdGFjaywgJ3N1Ym5ldDEnLCAncHViLTEnKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgICAgIGV4cGVjdCgoKSA9PiBzdWJuZXQuYXZhaWxhYmlsaXR5Wm9uZSkudG9UaHJvdyhcIllvdSBjYW5ub3QgcmVmZXJlbmNlIGEgU3VibmV0J3MgYXZhaWxhYmlsaXR5IHpvbmUgaWYgaXQgd2FzIG5vdCBzdXBwbGllZC4gQWRkIHRoZSBhdmFpbGFiaWxpdHlab25lIHdoZW4gaW1wb3J0aW5nIHVzaW5nIFN1Ym5ldC5mcm9tU3VibmV0QXR0cmlidXRlcygpXCIpO1xuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdSZWZlcmVuY2luZyBBWiB0aHJvd3MgZXJyb3Igd2hlbiBzdWJuZXQgY3JlYXRlZCBmcm9tIGF0dHJpYnV0ZXMgd2l0aG91dCBheicsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBzdWJuZXQgPSBTdWJuZXQuZnJvbVN1Ym5ldEF0dHJpYnV0ZXMoc3RhY2ssICdzdWJuZXQxJywgeyBzdWJuZXRJZDogJ3B1Yi0xJywgYXZhaWxhYmlsaXR5Wm9uZTogJycgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChzdWJuZXQuc3VibmV0SWQpLnRvRXF1YWwoJ3B1Yi0xJyk7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICAgICAgZXhwZWN0KCgpID0+IHN1Ym5ldC5hdmFpbGFiaWxpdHlab25lKS50b1Rocm93KFwiWW91IGNhbm5vdCByZWZlcmVuY2UgYSBTdWJuZXQncyBhdmFpbGFiaWxpdHkgem9uZSBpZiBpdCB3YXMgbm90IHN1cHBsaWVkLiBBZGQgdGhlIGF2YWlsYWJpbGl0eVpvbmUgd2hlbiBpbXBvcnRpbmcgdXNpbmcgU3VibmV0LmZyb21TdWJuZXRBdHRyaWJ1dGVzKClcIik7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ0FaIGhhdmUgdmFsdWUgd2hlbiBzdWJuZXQgY3JlYXRlZCBmcm9tIGF0dHJpYnV0ZXMgd2l0aCBheicsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBzdWJuZXQgPSBTdWJuZXQuZnJvbVN1Ym5ldEF0dHJpYnV0ZXMoc3RhY2ssICdzdWJuZXQxJywgeyBzdWJuZXRJZDogJ3B1Yi0xJywgYXZhaWxhYmlsaXR5Wm9uZTogJ2F6LTEyMzQnIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3Qoc3VibmV0LnN1Ym5ldElkKS50b0VxdWFsKCdwdWItMScpO1xuICAgICAgZXhwZWN0KHN1Ym5ldC5hdmFpbGFiaWxpdHlab25lKS50b0VxdWFsKCdhei0xMjM0Jyk7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ0NhbiBzZWxlY3Qgc3VibmV0cyBieSB0eXBlIGFuZCBBWicsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycsIHtcbiAgICAgICAgbWF4QXpzOiAzLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBJbnRlcmZhY2VWcGNFbmRwb2ludChzdGFjaywgJ1ZQQyBFbmRwb2ludCcsIHtcbiAgICAgICAgdnBjLFxuICAgICAgICBwcml2YXRlRG5zRW5hYmxlZDogZmFsc2UsXG4gICAgICAgIHNlcnZpY2U6IG5ldyBJbnRlcmZhY2VWcGNFbmRwb2ludFNlcnZpY2UoJ2NvbS5hbWF6b25hd3MudnBjZS51cy1lYXN0LTEudnBjZS1zdmMtdXVkZGxybHJiYXN0cnRzdmMnLCA0NDMpLFxuICAgICAgICBzdWJuZXRzOiB7XG4gICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfRUdSRVNTLFxuICAgICAgICAgIGF2YWlsYWJpbGl0eVpvbmVzOiBbJ2R1bW15MWEnLCAnZHVtbXkxYyddLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6VlBDRW5kcG9pbnQnLCB7XG4gICAgICAgIFNlcnZpY2VOYW1lOiAnY29tLmFtYXpvbmF3cy52cGNlLnVzLWVhc3QtMS52cGNlLXN2Yy11dWRkbHJscmJhc3RydHN2YycsXG4gICAgICAgIFN1Ym5ldElkczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlZjogJ1ZQQ1ByaXZhdGVTdWJuZXQxU3VibmV0OEJDQTEwRTAnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnVlBDUHJpdmF0ZVN1Ym5ldDNTdWJuZXQzRURDRDQ1NycsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdTdWJuZXRTZWxlY3Rpb24gZmlsdGVyZWQgb24gYXogdXNlcyBkZWZhdWx0IHN1Ym5ldFR5cGUgd2hlbiBubyBzdWJuZXQgdHlwZSBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnLCB7XG4gICAgICAgIG1heEF6czogMyxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgSW50ZXJmYWNlVnBjRW5kcG9pbnQoc3RhY2ssICdWUEMgRW5kcG9pbnQnLCB7XG4gICAgICAgIHZwYyxcbiAgICAgICAgc2VydmljZTogbmV3IEludGVyZmFjZVZwY0VuZHBvaW50U2VydmljZSgnY29tLmFtYXpvbmF3cy52cGNlLnVzLWVhc3QtMS52cGNlLXN2Yy11dWRkbHJscmJhc3RydHN2YycsIDQ0MyksXG4gICAgICAgIHN1Ym5ldHM6IHtcbiAgICAgICAgICBhdmFpbGFiaWxpdHlab25lczogWydkdW1teTFhJywgJ2R1bW15MWMnXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlZQQ0VuZHBvaW50Jywge1xuICAgICAgICBTZXJ2aWNlTmFtZTogJ2NvbS5hbWF6b25hd3MudnBjZS51cy1lYXN0LTEudnBjZS1zdmMtdXVkZGxybHJiYXN0cnRzdmMnLFxuICAgICAgICBTdWJuZXRJZHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZWY6ICdWUENQcml2YXRlU3VibmV0MVN1Ym5ldDhCQ0ExMEUwJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlZjogJ1ZQQ1ByaXZhdGVTdWJuZXQzU3VibmV0M0VEQ0Q0NTcnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgIH0pO1xuICAgIHRlc3QoJ1N1Ym5ldFNlbGVjdGlvbiBkb2VzbnQgdGhyb3cgZXJyb3Igd2hlbiBzZWxlY3RpbmcgaW1wb3J0ZWQgc3VibmV0cycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJyk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiB2cGMuc2VsZWN0U3VibmV0cyh7XG4gICAgICAgIHN1Ym5ldHM6IFtcbiAgICAgICAgICBTdWJuZXQuZnJvbVN1Ym5ldElkKHN0YWNrLCAnU3VibmV0JywgJ3N1Yi0xJyksXG4gICAgICAgIF0sXG4gICAgICB9KSkubm90LnRvVGhyb3coKTtcblxuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIGZpbHRlciBieSBzaW5nbGUgSVAgYWRkcmVzcycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuXG4gICAgICAvLyBJUCBzcGFjZSBpcyBzcGxpdCBpbnRvIDYgcGllY2VzLCBvbmUgcHVibGljL29uZSBwcml2YXRlIHBlciBBWlxuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycsIHtcbiAgICAgICAgaXBBZGRyZXNzZXM6IElwQWRkcmVzc2VzLmNpZHIoJzEwLjAuMC4wLzE2JyksXG4gICAgICAgIG1heEF6czogMyxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICAvLyBXZSB3YW50IHRvIHBsYWNlIHRoaXMgYmFzdGlvbiBob3N0IGluIHRoZSBzYW1lIHN1Ym5ldCBhcyB0aGlzIElQdjRcbiAgICAgIC8vIGFkZHJlc3MuXG4gICAgICBuZXcgQmFzdGlvbkhvc3RMaW51eChzdGFjaywgJ0Jhc3Rpb24nLCB7XG4gICAgICAgIHZwYyxcbiAgICAgICAgc3VibmV0U2VsZWN0aW9uOiB7XG4gICAgICAgICAgc3VibmV0RmlsdGVyczogW1N1Ym5ldEZpbHRlci5jb250YWluc0lwQWRkcmVzc2VzKFsnMTAuMC4xNjAuMCddKV0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgLy8gMTAuMC4xNjAuMC8xOSBpcyB0aGUgdGhpcmQgc3VibmV0LCBzZXF1ZW50aWFsbHksIGlmIHlvdSBzcGxpdFxuICAgICAgLy8gMTAuMC4wLjAvMTYgaW50byA2IHBpZWNlc1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpJbnN0YW5jZScsIHtcbiAgICAgICAgU3VibmV0SWQ6IHtcbiAgICAgICAgICBSZWY6ICdWUENQcml2YXRlU3VibmV0M1N1Ym5ldDNFRENENDU3JyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjYW4gZmlsdGVyIGJ5IG11bHRpcGxlIElQIGFkZHJlc3NlcycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuXG4gICAgICAvLyBJUCBzcGFjZSBpcyBzcGxpdCBpbnRvIDYgcGllY2VzLCBvbmUgcHVibGljL29uZSBwcml2YXRlIHBlciBBWlxuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycsIHtcbiAgICAgICAgaXBBZGRyZXNzZXM6IElwQWRkcmVzc2VzLmNpZHIoJzEwLjAuMC4wLzE2JyksXG4gICAgICAgIG1heEF6czogMyxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICAvLyBXZSB3YW50IHRvIHBsYWNlIHRoaXMgZW5kcG9pbnQgaW4gdGhlIHNhbWUgc3VibmV0cyBhcyB0aGVzZSBJUHY0XG4gICAgICAvLyBhZGRyZXNzLlxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IEludGVyZmFjZVZwY0VuZHBvaW50KHN0YWNrLCAnVlBDIEVuZHBvaW50Jywge1xuICAgICAgICB2cGMsXG4gICAgICAgIHNlcnZpY2U6IG5ldyBJbnRlcmZhY2VWcGNFbmRwb2ludFNlcnZpY2UoJ2NvbS5hbWF6b25hd3MudnBjZS51cy1lYXN0LTEudnBjZS1zdmMtdXVkZGxybHJiYXN0cnRzdmMnLCA0NDMpLFxuICAgICAgICBzdWJuZXRzOiB7XG4gICAgICAgICAgc3VibmV0RmlsdGVyczogW1N1Ym5ldEZpbHRlci5jb250YWluc0lwQWRkcmVzc2VzKFsnMTAuMC45Ni4wJywgJzEwLjAuMTYwLjAnXSldLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6VlBDRW5kcG9pbnQnLCB7XG4gICAgICAgIFNlcnZpY2VOYW1lOiAnY29tLmFtYXpvbmF3cy52cGNlLnVzLWVhc3QtMS52cGNlLXN2Yy11dWRkbHJscmJhc3RydHN2YycsXG4gICAgICAgIFN1Ym5ldElkczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlZjogJ1ZQQ1ByaXZhdGVTdWJuZXQxU3VibmV0OEJDQTEwRTAnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnVlBDUHJpdmF0ZVN1Ym5ldDNTdWJuZXQzRURDRDQ1NycsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjYW4gZmlsdGVyIGJ5IFN1Ym5ldCBJZHMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcblxuICAgICAgY29uc3QgdnBjID0gVnBjLmZyb21WcGNBdHRyaWJ1dGVzKHN0YWNrLCAnVlBDJywge1xuICAgICAgICB2cGNJZDogJ3ZwYy0xMjM0JyxcbiAgICAgICAgdnBjQ2lkckJsb2NrOiAnMTkyLjE2OC4wLjAvMTYnLFxuICAgICAgICBhdmFpbGFiaWxpdHlab25lczogWydkdW1teTFhJywgJ2R1bW15MWInLCAnZHVtbXkxYyddLFxuICAgICAgICBwcml2YXRlU3VibmV0SWRzOiBbJ3ByaXYtMScsICdwcml2LTInLCAncHJpdi0zJ10sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IEludGVyZmFjZVZwY0VuZHBvaW50KHN0YWNrLCAnVlBDIEVuZHBvaW50Jywge1xuICAgICAgICB2cGMsXG4gICAgICAgIHNlcnZpY2U6IG5ldyBJbnRlcmZhY2VWcGNFbmRwb2ludFNlcnZpY2UoJ2NvbS5hbWF6b25hd3MudnBjZS51cy1lYXN0LTEudnBjZS1zdmMtdXVkZGxybHJiYXN0cnRzdmMnLCA0NDMpLFxuICAgICAgICBzdWJuZXRzOiB7XG4gICAgICAgICAgc3VibmV0RmlsdGVyczogW1N1Ym5ldEZpbHRlci5ieUlkcyhbJ3ByaXYtMScsICdwcml2LTInXSldLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6VlBDRW5kcG9pbnQnLCB7XG4gICAgICAgIFNlcnZpY2VOYW1lOiAnY29tLmFtYXpvbmF3cy52cGNlLnVzLWVhc3QtMS52cGNlLXN2Yy11dWRkbHJscmJhc3RydHN2YycsXG4gICAgICAgIFN1Ym5ldElkczogWydwcml2LTEnLCAncHJpdi0yJ10sXG4gICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIGZpbHRlciBieSBDaWRyIE5ldG1hc2snLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWcGNOZXR3b3JrJywge1xuICAgICAgICBtYXhBenM6IDEsXG4gICAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcbiAgICAgICAgICB7IG5hbWU6ICdub3JtYWxTbjEnLCBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBVQkxJQywgY2lkck1hc2s6IDIwIH0sXG4gICAgICAgICAgeyBuYW1lOiAnbm9ybWFsU24yJywgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QVUJMSUMsIGNpZHJNYXNrOiAyMCB9LFxuICAgICAgICAgIHsgbmFtZTogJ3NtYWxsU24nLCBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBVQkxJQywgY2lkck1hc2s6IDI4IH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgeyBzdWJuZXRJZHMgfSA9IHZwYy5zZWxlY3RTdWJuZXRzKFxuICAgICAgICB7IHN1Ym5ldEZpbHRlcnM6IFtTdWJuZXRGaWx0ZXIuYnlDaWRyTWFzaygyMCldIH0sXG4gICAgICApO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3Qoc3VibmV0SWRzLmxlbmd0aCkudG9FcXVhbCgyKTtcbiAgICAgIGNvbnN0IGV4cGVjdGVkID0gdnBjLnB1YmxpY1N1Ym5ldHMuZmlsdGVyKHMgPT4gcy5pcHY0Q2lkckJsb2NrLmVuZHNXaXRoKCcvMjAnKSk7XG4gICAgICBleHBlY3Qoc3VibmV0SWRzKS50b0VxdWFsKGV4cGVjdGVkLm1hcChzID0+IHMuc3VibmV0SWQpKTtcblxuICAgIH0pO1xuXG4gICAgdGVzdCgndGVzdHMgcm91dGVyIHR5cGVzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVnBjJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgICh2cGMucHVibGljU3VibmV0c1swXSBhcyBTdWJuZXQpLmFkZFJvdXRlKCdUcmFuc2l0Um91dGUnLCB7XG4gICAgICAgIHJvdXRlclR5cGU6IFJvdXRlclR5cGUuVFJBTlNJVF9HQVRFV0FZLFxuICAgICAgICByb3V0ZXJJZDogJ3RyYW5zaXQtaWQnLFxuICAgICAgfSk7XG4gICAgICAodnBjLnB1YmxpY1N1Ym5ldHNbMF0gYXMgU3VibmV0KS5hZGRSb3V0ZSgnQ2FycmllclJvdXRlJywge1xuICAgICAgICByb3V0ZXJUeXBlOiBSb3V0ZXJUeXBlLkNBUlJJRVJfR0FURVdBWSxcbiAgICAgICAgcm91dGVySWQ6ICdjYXJyaWVyLWdhdGV3YXktaWQnLFxuICAgICAgfSk7XG4gICAgICAodnBjLnB1YmxpY1N1Ym5ldHNbMF0gYXMgU3VibmV0KS5hZGRSb3V0ZSgnTG9jYWxHYXRld2F5Um91dGUnLCB7XG4gICAgICAgIHJvdXRlclR5cGU6IFJvdXRlclR5cGUuTE9DQUxfR0FURVdBWSxcbiAgICAgICAgcm91dGVySWQ6ICdsb2NhbC1nYXRld2F5LWlkJyxcbiAgICAgIH0pO1xuICAgICAgKHZwYy5wdWJsaWNTdWJuZXRzWzBdIGFzIFN1Ym5ldCkuYWRkUm91dGUoJ1ZwY0VuZHBvaW50Um91dGUnLCB7XG4gICAgICAgIHJvdXRlclR5cGU6IFJvdXRlclR5cGUuVlBDX0VORFBPSU5ULFxuICAgICAgICByb3V0ZXJJZDogJ3ZwYy1lbmRwb2ludC1pZCcsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpSb3V0ZScsIHtcbiAgICAgICAgVHJhbnNpdEdhdGV3YXlJZDogJ3RyYW5zaXQtaWQnLFxuICAgICAgfSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlJvdXRlJywge1xuICAgICAgICBMb2NhbEdhdGV3YXlJZDogJ2xvY2FsLWdhdGV3YXktaWQnLFxuICAgICAgfSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlJvdXRlJywge1xuICAgICAgICBDYXJyaWVyR2F0ZXdheUlkOiAnY2Fycmllci1nYXRld2F5LWlkJyxcbiAgICAgIH0pO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpSb3V0ZScsIHtcbiAgICAgICAgVnBjRW5kcG9pbnRJZDogJ3ZwYy1lbmRwb2ludC1pZCcsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ1VzaW5nIHJlc2VydmVkIGF6cycsICgpID0+IHtcbiAgICB0ZXN0LmVhY2goW1xuICAgICAgW3sgbWF4QXpzOiAyLCByZXNlcnZlZEF6czogMSB9LCB7IG1heEF6czogMyB9XSxcbiAgICAgIFt7IG1heEF6czogMiwgcmVzZXJ2ZWRBenM6IDIgfSwgeyBtYXhBenM6IDMsIHJlc2VydmVkQXpzOiAxIH1dLFxuICAgICAgW3sgbWF4QXpzOiAyLCByZXNlcnZlZEF6czogMSwgc3VibmV0Q29uZmlndXJhdGlvbjogW3sgY2lkck1hc2s6IDIyLCBuYW1lOiAnUHVibGljJywgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QVUJMSUMgfSwgeyBjaWRyTWFzazogMjMsIG5hbWU6ICdQcml2YXRlJywgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfRUdSRVNTIH1dIH0sXG4gICAgICAgIHsgbWF4QXpzOiAzLCBzdWJuZXRDb25maWd1cmF0aW9uOiBbeyBjaWRyTWFzazogMjIsIG5hbWU6ICdQdWJsaWMnLCBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBVQkxJQyB9LCB7IGNpZHJNYXNrOiAyMywgbmFtZTogJ1ByaXZhdGUnLCBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9FR1JFU1MgfV0gfV0sXG4gICAgICBbeyBtYXhBenM6IDIsIHJlc2VydmVkQXpzOiAxLCBzdWJuZXRDb25maWd1cmF0aW9uOiBbeyBjaWRyTWFzazogMjIsIG5hbWU6ICdQdWJsaWMnLCBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBVQkxJQyB9LCB7IGNpZHJNYXNrOiAyMywgbmFtZTogJ1ByaXZhdGUnLCBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9FR1JFU1MsIHJlc2VydmVkOiB0cnVlIH1dIH0sXG4gICAgICAgIHsgbWF4QXpzOiAzLCBzdWJuZXRDb25maWd1cmF0aW9uOiBbeyBjaWRyTWFzazogMjIsIG5hbWU6ICdQdWJsaWMnLCBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBVQkxJQyB9LCB7IGNpZHJNYXNrOiAyMywgbmFtZTogJ1ByaXZhdGUnLCBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9FR1JFU1MsIHJlc2VydmVkOiB0cnVlIH1dIH1dLFxuICAgICAgW3sgbWF4QXpzOiAyLCByZXNlcnZlZEF6czogMSwgaXBBZGRyZXNzZXM6IElwQWRkcmVzc2VzLmNpZHIoJzE5Mi4xNjguMC4wLzE2JykgfSwgeyBtYXhBenM6IDMsIGlwQWRkcmVzc2VzOiBJcEFkZHJlc3Nlcy5jaWRyKCcxOTIuMTY4LjAuMC8xNicpIH1dLFxuICAgICAgW3sgYXZhaWxhYmlsaXR5Wm9uZXM6IFsnZHVtbXkxYScsICdkdW1teTFiJ10sIHJlc2VydmVkQXpzOiAxIH0sIHsgYXZhaWxhYmlsaXR5Wm9uZXM6IFsnZHVtbXkxYScsICdkdW1teTFiJywgJ2R1bW15MWMnXSB9XSxcbiAgICBdKSgnc3VibmV0cyBzaG91bGQgcmVtYWluIHRoZSBzYW1lIGdvaW5nIGZyb20gJXAgdG8gJXAnLCAocHJvcHNXaXRoUmVzZXJ2ZWRBeiwgcHJvcHNXaXRoVXNlZFJlc2VydmVkQXopID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrV2l0aFJlc2VydmVkQXogPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgIGNvbnN0IHN0YWNrV2l0aFVzZWRSZXNlcnZlZEF6ID0gZ2V0VGVzdFN0YWNrKCk7XG5cbiAgICAgIG5ldyBWcGMoc3RhY2tXaXRoUmVzZXJ2ZWRBeiwgJ1ZwYycsIHByb3BzV2l0aFJlc2VydmVkQXopO1xuICAgICAgbmV3IFZwYyhzdGFja1dpdGhVc2VkUmVzZXJ2ZWRBeiwgJ1ZwYycsIHByb3BzV2l0aFVzZWRSZXNlcnZlZEF6KTtcblxuICAgICAgY29uc3QgdGVtcGxhdGVXaXRoUmVzZXJ2ZWRBeiA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFja1dpdGhSZXNlcnZlZEF6KTtcbiAgICAgIGNvbnN0IHRlbXBsYXRlV2l0aFVzZWRSZXNlcnZlZEF6ID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrV2l0aFVzZWRSZXNlcnZlZEF6KTtcblxuICAgICAgY29uc3Qgc3VibmV0c09mVGVtcGxhdGVXaXRoUmVzZXJ2ZWRBeiA9IHRlbXBsYXRlV2l0aFJlc2VydmVkQXouZmluZFJlc291cmNlcygnQVdTOjpFQzI6OlN1Ym5ldCcpO1xuICAgICAgY29uc3Qgc3VibmV0c09mVGVtcGxhdGVXaXRoVXNlZFJlc2VydmVkQXogPSB0ZW1wbGF0ZVdpdGhVc2VkUmVzZXJ2ZWRBei5maW5kUmVzb3VyY2VzKCdBV1M6OkVDMjo6U3VibmV0Jyk7XG4gICAgICBmb3IgKGNvbnN0IFtsb2dpY2FsSWQsIHN1Ym5ldE9mVGVtcGxhdGVXaXRoUmVzZXJ2ZWRBel0gb2YgT2JqZWN0LmVudHJpZXMoc3VibmV0c09mVGVtcGxhdGVXaXRoUmVzZXJ2ZWRBeikpIHtcbiAgICAgICAgY29uc3Qgc3VibmV0T2ZUZW1wbGF0ZVdpdGhVc2VkUmVzZXJ2ZWRBeiA9IHN1Ym5ldHNPZlRlbXBsYXRlV2l0aFVzZWRSZXNlcnZlZEF6W2xvZ2ljYWxJZF07XG4gICAgICAgIGV4cGVjdChzdWJuZXRPZlRlbXBsYXRlV2l0aFVzZWRSZXNlcnZlZEF6KS50b0VxdWFsKHN1Ym5ldE9mVGVtcGxhdGVXaXRoUmVzZXJ2ZWRBeik7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdjYW4gcmVmZXJlbmNlIHZwY0VuZHBvaW50RG5zRW50cmllcyBhY3Jvc3Mgc3RhY2tzJywgKCkgPT4ge1xuICAgIHRlc3QoJ2NhbiByZWZlcmVuY2UgYW4gYWN0dWFsIHN0cmluZyBsaXN0IGFjcm9zcyBzdGFja3MnLCAoKSA9PiB7XG4gICAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgICBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2sxJyk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrMSwgJ1ZwYycpO1xuICAgICAgY29uc3QgZW5kcG9pbnQgPSBuZXcgSW50ZXJmYWNlVnBjRW5kcG9pbnQoc3RhY2sxLCAnaW50ZXJmYWNlVnBjRW5kcG9pbnQnLCB7XG4gICAgICAgIHZwYyxcbiAgICAgICAgc2VydmljZTogSW50ZXJmYWNlVnBjRW5kcG9pbnRBd3NTZXJ2aWNlLlNFQ1JFVFNfTUFOQUdFUixcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2syJyk7XG4gICAgICBuZXcgQ2ZuT3V0cHV0KHN0YWNrMiwgJ2VuZHBvaW50Jywge1xuICAgICAgICB2YWx1ZTogRm4uc2VsZWN0KDAsIGVuZHBvaW50LnZwY0VuZHBvaW50RG5zRW50cmllcyksXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICAgIGNvbnN0IHRlbXBsYXRlMSA9IGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKHN0YWNrMS5zdGFja05hbWUpLnRlbXBsYXRlO1xuICAgICAgY29uc3QgdGVtcGxhdGUyID0gYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUoc3RhY2syLnN0YWNrTmFtZSkudGVtcGxhdGU7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCh0ZW1wbGF0ZTEpLnRvTWF0Y2hPYmplY3Qoe1xuICAgICAgICBPdXRwdXRzOiB7XG4gICAgICAgICAgRXhwb3J0c091dHB1dEZuR2V0QXR0aW50ZXJmYWNlVnBjRW5kcG9pbnQ4OUM5OTk0NURuc0VudHJpZXNCMTg3MkY3QToge1xuICAgICAgICAgICAgVmFsdWU6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICd8fCcsIHtcbiAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAnaW50ZXJmYWNlVnBjRW5kcG9pbnQ4OUM5OTk0NScsXG4gICAgICAgICAgICAgICAgICAgICdEbnNFbnRyaWVzJyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBFeHBvcnQ6IHsgTmFtZTogJ1N0YWNrMTpFeHBvcnRzT3V0cHV0Rm5HZXRBdHRpbnRlcmZhY2VWcGNFbmRwb2ludDg5Qzk5OTQ1RG5zRW50cmllc0IxODcyRjdBJyB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgZXhwZWN0KHRlbXBsYXRlMikudG9NYXRjaE9iamVjdCh7XG4gICAgICAgIE91dHB1dHM6IHtcbiAgICAgICAgICBlbmRwb2ludDoge1xuICAgICAgICAgICAgVmFsdWU6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpTZWxlY3QnOiBbXG4gICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnRm46OlNwbGl0JzogW1xuICAgICAgICAgICAgICAgICAgICAnfHwnLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpJbXBvcnRWYWx1ZSc6ICdTdGFjazE6RXhwb3J0c091dHB1dEZuR2V0QXR0aW50ZXJmYWNlVnBjRW5kcG9pbnQ4OUM5OTk0NURuc0VudHJpZXNCMTg3MkY3QScsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuZnVuY3Rpb24gZ2V0VGVzdFN0YWNrKCk6IFN0YWNrIHtcbiAgcmV0dXJuIG5ldyBTdGFjayh1bmRlZmluZWQsICdUZXN0U3RhY2snLCB7IGVudjogeyBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJywgcmVnaW9uOiAndXMtZWFzdC0xJyB9IH0pO1xufVxuXG5mdW5jdGlvbiB0b0NmblRhZ3ModGFnczogYW55KTogQXJyYXk8e0tleTogc3RyaW5nLCBWYWx1ZTogc3RyaW5nfT4ge1xuICByZXR1cm4gT2JqZWN0LmtleXModGFncykubWFwKCBrZXkgPT4ge1xuICAgIHJldHVybiB7IEtleToga2V5LCBWYWx1ZTogdGFnc1trZXldIH07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBoYXNUYWdzKGV4cGVjdGVkVGFnczogQXJyYXk8e0tleTogc3RyaW5nLCBWYWx1ZTogc3RyaW5nfT4pIHtcbiAgcmV0dXJuIHtcbiAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICBUYWdzOiBNYXRjaC5hcnJheVdpdGgoZXhwZWN0ZWRUYWdzKSxcbiAgICB9LFxuICB9O1xufVxuIl19