import { countResources, expect, haveResource } from '@aws-cdk/assert';
import {  AvailabilityZoneProvider, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { DefaultInstanceTenancy, OutboundTrafficMode, SubnetType, VpcNetwork } from '../lib';

export = {

    "When creating a VPC with the default CIDR range": {

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
                outboundTraffic: OutboundTrafficMode.None,
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
            test.done();
        },

        "with outbound traffic mode None, the VPC should not contain an IGW or NAT Gateways"(test: Test) {
            const stack = getTestStack();
            new VpcNetwork(stack, 'TheVPC', { outboundTraffic: OutboundTrafficMode.None });
            expect(stack).notTo(haveResource("AWS::EC2::InternetGateway"));
            expect(stack).notTo(haveResource("AWS::EC2::NatGateway"));
            test.done();
        },

        "with outbound traffic mode FromPublicSubnetsOnly, the VPC should have an IGW but no NAT Gateways"(test: Test) {
            const stack = getTestStack();
            new VpcNetwork(stack, 'TheVPC', { outboundTraffic: OutboundTrafficMode.FromPublicSubnetsOnly });
            expect(stack).to(countResources('AWS::EC2::InternetGateway', 1));
            expect(stack).notTo(haveResource("AWS::EC2::NatGateway"));
            test.done();
        },

        "with outbound traffic mode FromPublicAndPrivateSubnets, the VPC should have an IGW, and a NAT Gateway per AZ"(test: Test) {
            const stack = getTestStack();
            const zones = new AvailabilityZoneProvider(stack).availabilityZones.length;
            new VpcNetwork(stack, 'TheVPC', { outboundTraffic: OutboundTrafficMode.FromPublicAndPrivateSubnets });
            expect(stack).to(countResources("AWS::EC2::InternetGateway", 1));
            expect(stack).to(countResources("AWS::EC2::NatGateway", zones));
            test.done();
        },

        "with custom subents, the VPC should have the right number of subnets, an IGW, and a NAT Gateway per AZ"(test: Test) {
            const stack = getTestStack();
            const zones = new AvailabilityZoneProvider(stack).availabilityZones.length;
            new VpcNetwork(stack, 'TheVPC', {
              cidr: '10.0.0.0/21',
              outboundTraffic: OutboundTrafficMode.FromPublicAndPrivateSubnets,
              subnetConfigurations: [
                {
                  cidrMask: 24,
                  name: 'ingress',
                  subnetType: SubnetType.Public,
                  natGateway: true,
                },
                {
                  cidrMask: 24,
                  name: 'application',
                  subnetType: SubnetType.Private,
                },
                {
                  cidrMask: 28,
                  name: 'rds',
                  subnetType: SubnetType.Internal,
                }
              ],
              maxAZs: 3
            });
            expect(stack).to(countResources("AWS::EC2::InternetGateway", 1));
            expect(stack).to(countResources("AWS::EC2::NatGateway", zones));
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

    }

};

function getTestStack(): Stack {
    return new Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'us-east-1' } });
}
