import { countResources, expect, haveResource, isSuperObject} from '@aws-cdk/assert';
import { AvailabilityZoneProvider, Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { DefaultInstanceTenancy, SubnetType, VpcNetwork } from '../lib';

export = {

    "When creating a VPC": {
        "with the default CIDR range": {

            "vpc.vpcId returns a token to the VPC ID"(test: Test) {
                const stack = getTestStack();
                const vpc = new VpcNetwork(stack, 'TheVPC');
                test.deepEqual(vpc.vpcId.resolve(), {Ref: 'TheVPC92636AB0' } );
                test.done();
            },

            "it uses the correct network range"(test: Test) {
                const stack =  getTestStack();
                new VpcNetwork(stack, 'TheVPC');
                expect(stack).to(haveResource('AWS::EC2::VPC', {
                    CidrBlock: VpcNetwork.DEFAULT_CIDR_RANGE,
                    EnableDnsHostnames: true,
                    EnableDnsSupport: true,
                    InstanceTenancy: DefaultInstanceTenancy.Default,
                    Tags: []
                }));
                test.done();
            }
        },

        "with all of the properties set, it successfully sets the correct VPC properties"(test: Test) {
            const stack = getTestStack();
            const tag = {
                key: 'testKey',
                value: 'testValue'
            };
            new VpcNetwork(stack, 'TheVPC', {
                cidr: "192.168.0.0/16",
                enableDnsHostnames: false,
                enableDnsSupport: false,
                defaultInstanceTenancy: DefaultInstanceTenancy.Dedicated,
                tags: [tag]
            });

            expect(stack).to(haveResource('AWS::EC2::VPC', {
                CidrBlock: '192.168.0.0/16',
                EnableDnsHostnames: false,
                EnableDnsSupport: false,
                InstanceTenancy: DefaultInstanceTenancy.Dedicated,
                Tags: [{ Key: tag.key, Value: tag.value }]
            }));
            test.done();
        },

        "contains the correct number of subnets"(test: Test) {
            const stack = getTestStack();
            const vpc = new VpcNetwork(stack, 'TheVPC');
            const zones = new AvailabilityZoneProvider(stack).availabilityZones.length;
            test.equal(vpc.publicSubnets.length, zones);
            test.equal(vpc.privateSubnets.length, zones);
            test.deepEqual(vpc.vpcId.resolve(), { Ref: 'TheVPC92636AB0' });
            expect(stack).to(haveResource("AWS::EC2::Subnet", {
                Tags: [ {Key: "Name", Value: "PrivateSubnet2"} ],
            }));
            expect(stack).to(haveResource("AWS::EC2::Subnet", {
                Tags: [ {Key: "Name", Value: "PublicSubnet1"} ],
            }));
            test.done();
        },

        "with only isolated subnets, the VPC should not contain an IGW or NAT Gateways"(test: Test) {
            const stack = getTestStack();
            new VpcNetwork(stack, 'TheVPC', {
                subnetConfiguration: [
                    {
                        subnetType: SubnetType.Isolated,
                        name: 'Isolated',
                    }
                ]
            });
            expect(stack).notTo(haveResource("AWS::EC2::InternetGateway"));
            expect(stack).notTo(haveResource("AWS::EC2::NatGateway"));
            expect(stack).to(haveResource("AWS::EC2::Subnet", {
                MapPublicIpOnLaunch: false
            }));
            expect(stack).to(haveResource("AWS::EC2::Subnet", {
                Tags: [ {Key: "Name", Value: "IsolatedSubnet3"} ],
            }));
            test.done();
        },

        "with no private subnets, the VPC should have an IGW but no NAT Gateways"(test: Test) {
            const stack = getTestStack();
            new VpcNetwork(stack, 'TheVPC', {
                subnetConfiguration: [
                    {
                        subnetType: SubnetType.Public,
                        name: 'Public',
                    },
                    {
                        subnetType: SubnetType.Isolated,
                        name: 'Isolated',
                    }
                ]
            });
            expect(stack).to(countResources('AWS::EC2::InternetGateway', 1));
            expect(stack).notTo(haveResource("AWS::EC2::NatGateway"));
            test.done();
        },

        "with no subnets defined, the VPC should have an IGW, and a NAT Gateway per AZ"(test: Test) {
            const stack = getTestStack();
            const zones = new AvailabilityZoneProvider(stack).availabilityZones.length;
            new VpcNetwork(stack, 'TheVPC', { });
            expect(stack).to(countResources("AWS::EC2::InternetGateway", 1));
            expect(stack).to(countResources("AWS::EC2::NatGateway", zones));
            test.done();
        },

        "with custom subents, the VPC should have the right number of subnets, an IGW, and a NAT Gateway per AZ"(test: Test) {
            const stack = getTestStack();
            const zones = new AvailabilityZoneProvider(stack).availabilityZones.length;
            new VpcNetwork(stack, 'TheVPC', {
              cidr: '10.0.0.0/21',
              subnetConfiguration: [
                {
                  cidrMask: 24,
                  name: 'ingress',
                  subnetType: SubnetType.Public,
                  tags: [{key: 'SubnetType', value: 'Public'}],
                },
                {
                  cidrMask: 24,
                  name: 'application',
                  subnetType: SubnetType.Private,
                  tags: [{key: 'Compliance', value: 'PCI'}],
                },
                {
                  cidrMask: 28,
                  name: 'rds',
                  subnetType: SubnetType.Isolated,
                  tags: [{key: 'Billing', value: 'DatabaseTeam'}],
                }
              ],
              maxAZs: 3
            });
            expect(stack).to(countResources("AWS::EC2::InternetGateway", 1));
            expect(stack).to(countResources("AWS::EC2::NatGateway", zones));
            expect(stack).to(countResources("AWS::EC2::Subnet", 9));
            for (let i = 1; i < 4; i++) {
                expect(stack).to(haveResource('AWS::EC2::Subnet',
                    hasTags([
                        { Key: 'Name', Value: `ingressSubnet${i}` },
                        { Key: 'SubnetType', Value: 'Public' },
                    ])
                ));
                expect(stack).to(haveResource('AWS::EC2::Subnet',
                    hasTags([
                        { Key: 'Name', Value: `applicationSubnet${i}` },
                        { Key: 'Compliance', Value: 'PCI' },
                    ])
                ));
                expect(stack).to(haveResource('AWS::EC2::Subnet',
                    hasTags([
                        { Key: 'Name', Value: `rdsSubnet${i}` },
                        { Key: 'Billing', Value: 'DatabaseTeam' },
                    ])
                ));
            }
            for (let i = 0; i < 6; i++) {
              expect(stack).to(haveResource("AWS::EC2::Subnet", {
                CidrBlock: `10.0.${i}.0/24`
              }));
            }
            for (let i = 0; i < 3; i++) {
              expect(stack).to(haveResource("AWS::EC2::Subnet", {
                CidrBlock: `10.0.6.${i * 16}/28`
              }));
            }
            test.done();
        },
        "with custom subents and natGateways = 2 there should be only to NATGW"(test: Test) {
            const stack = getTestStack();
            new VpcNetwork(stack, 'TheVPC', {
              cidr: '10.0.0.0/21',
              natGateways: 2,
              subnetConfiguration: [
                {
                  cidrMask: 24,
                  name: 'ingress',
                  subnetType: SubnetType.Public,
                },
                {
                  cidrMask: 24,
                  name: 'application',
                  subnetType: SubnetType.Private,
                },
                {
                  cidrMask: 28,
                  name: 'rds',
                  subnetType: SubnetType.Isolated,
                }
              ],
              maxAZs: 3
            });
            expect(stack).to(countResources("AWS::EC2::InternetGateway", 1));
            expect(stack).to(countResources("AWS::EC2::NatGateway", 2));
            expect(stack).to(countResources("AWS::EC2::Subnet", 9));
            for (let i = 0; i < 6; i++) {
              expect(stack).to(haveResource("AWS::EC2::Subnet", {
                CidrBlock: `10.0.${i}.0/24`
              }));
            }
            for (let i = 0; i < 3; i++) {
              expect(stack).to(haveResource("AWS::EC2::Subnet", {
                CidrBlock: `10.0.6.${i * 16}/28`
              }));
            }
            test.done();
        },
        "with enableDnsHostnames enabled but enableDnsSupport disabled, should throw an Error"(test: Test) {
            const stack = getTestStack();
            test.throws(() => new VpcNetwork(stack, 'TheVPC', {
                enableDnsHostnames: true,
                enableDnsSupport: false
            }));
            test.done();
        },
        "with public subnets MapPublicIpOnLaunch is true"(test: Test) {
            const stack = getTestStack();
            new VpcNetwork(stack, 'VPC', {
                maxAZs: 1,
                subnetConfiguration: [
                    {
                        cidrMask: 24,
                        name: 'ingress',
                        subnetType: SubnetType.Public,
                    }
                ],
            });
            expect(stack).to(countResources("AWS::EC2::Subnet", 1));
            expect(stack).notTo(haveResource("AWS::EC2::NatGateway"));
            expect(stack).to(haveResource("AWS::EC2::Subnet", {
                MapPublicIpOnLaunch: true
            }));
            test.done();
        },
        "with maxAZs set to 2"(test: Test) {
            const stack = getTestStack();
            new VpcNetwork(stack, 'VPC', { maxAZs: 2 });
            expect(stack).to(countResources("AWS::EC2::Subnet", 4));
            expect(stack).to(countResources("AWS::EC2::Route", 4));
            for (let i = 0; i < 4; i++) {
              expect(stack).to(haveResource("AWS::EC2::Subnet", {
                CidrBlock: `10.0.${i * 64}.0/18`
              }));
            }
            expect(stack).to(haveResource("AWS::EC2::Route", {
                DestinationCidrBlock: '0.0.0.0/0',
                NatGatewayId: { },
            }));
            test.done();
        },
        "with natGateway set to 1"(test: Test) {
            const stack = getTestStack();
            new VpcNetwork(stack, 'VPC', { natGateways: 1 });
            expect(stack).to(countResources("AWS::EC2::Subnet", 6));
            expect(stack).to(countResources("AWS::EC2::Route", 6));
            expect(stack).to(countResources("AWS::EC2::Subnet", 6));
            expect(stack).to(countResources("AWS::EC2::NatGateway", 1));
            expect(stack).to(haveResource("AWS::EC2::Route", {
                DestinationCidrBlock: '0.0.0.0/0',
                NatGatewayId: { },
            }));
            test.done();
        }

    },

    "When creating a VPC with a custom CIDR range": {
        "vpc.vpcCidrBlock is the correct network range"(test: Test) {
            const stack = getTestStack();
            new VpcNetwork(stack, 'TheVPC', { cidr: '192.168.0.0/16' });
            expect(stack).to(haveResource("AWS::EC2::VPC", {
                CidrBlock: '192.168.0.0/16'
            }));
            test.done();
        }

    },
};

function getTestStack(): Stack {
    return new Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'us-east-1' } });
}

function hasTags(expectedTags: Array<{Key: string, Value: string}>): (props: any) => boolean {
    return (props: any) => {
        try {
            const tags = props.Tags;
            const actualTags = tags.filter( (tag: {Key: string, Value: string}) => {
                for (const expectedTag of expectedTags) {
                    if (isSuperObject(expectedTag, tag)) {
                        return true;
                    } else {
                        continue;
                    }
                }
                // no values in array so expecting empty
                return false;
            });
            return actualTags.length === expectedTags.length;
        } catch (e) {
            // tslint:disable-next-line:no-console
            console.error('Invalid Tags array in ', props);
            throw e;
        }
    };
}
