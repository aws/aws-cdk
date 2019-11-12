import { expect, haveResource, haveResourceLike, ResourcePart } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import { AmazonLinuxGeneration, InstanceClass, InstanceSize, InstanceType, SecurityGroup, SubnetType, Vpc } from '@aws-cdk/aws-ec2';
import { AmiHardwareType, EcsOptimizedAmi } from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Tag } from '@aws-cdk/core';
import { throws } from 'assert';
import * as batch from '../lib';

const computeResourceProps = (override: batch.ComputeResourceProps): batch.ComputeResourceProps => {
    return {
        ...override,
    };
};

const expectedManagedDefaultProps = {
    ServiceRole: {
        Ref: 'testcomputeenvResourceServiceLinkedRoleDC93CC0B',
    },
    Type: batch.ComputeEnvironmentType.MANAGED,
};

const expectedUnmanagedDefaultComputeProps = (override: any) => {
    return {
        ComputeResources: {
            AllocationStrategy: batch.AllocationStrategy.BEST_FIT,
            InstanceRole: {
                'Fn::GetAtt': [
                    'testcomputeenvResourceRoleBD565AC0',
                    'Arn'
                ]
            },
            InstanceTypes: [
                'optimal'
            ],
            MaxvCpus: 256,
            MinvCpus: 0,
            Subnets: [
                {
                    Ref: 'testvpcPrivateSubnet1Subnet865FB50A'
                },
                {
                    Ref: 'testvpcPrivateSubnet2Subnet23D3396F'
                }
            ],
            Type: batch.ComputeResourceType.EC2,
            ...override,
        },
    };
};

describe('When creating a batch compute evironment', () => {
    describe('with no properties provided', () => {
        test('should create an AWS managed environment', () => {
            // GIVEN
            const stack = new cdk.Stack();

            // WHEN
            new batch.ComputeEnvironment(stack, 'test-compute-env');

            // THEN
            expect(stack).to(haveResourceLike('AWS::Batch::ComputeEnvironment', {
                Type: batch.ComputeEnvironmentType.MANAGED
            }, ResourcePart.Properties));
        });
    });

    describe('using spot resources', () => {
        describe('with a bid percentage', () => {
            test('should deny my bid if set below 0', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const vpc = new Vpc(stack, 'test-vpc');
                const props = computeResourceProps({
                    vpc,
                    type: batch.ComputeResourceType.SPOT,
                    bidPercentage: -1,
                });

                // THEN
                throws(() => {
                    // WHEN
                    new batch.ComputeEnvironment(stack, 'test-compute-env', {
                        type: batch.ComputeEnvironmentType.UNMANAGED,
                        computeResources: props,
                    });
                });
            });

            test('should deny my bid if above 100', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const vpc = new Vpc(stack, 'test-vpc');
                const props = computeResourceProps({
                    vpc,
                    type: batch.ComputeResourceType.SPOT,
                    bidPercentage: 101,
                });

                // THEN
                throws(() => {
                    // WHEN
                    new batch.ComputeEnvironment(stack, 'test-compute-env', {
                        type: batch.ComputeEnvironmentType.UNMANAGED,
                        computeResources: props,
                    });
                });
            });
        });
    });

    describe('with properties specified', () => {
        test('should match all provided properties', () => {
            // GIVEN
            const stack = new cdk.Stack();

            // WHEN
            const vpc = new Vpc(stack, 'test-vpc');
            const props = {
                allocationStrategy: batch.AllocationStrategy.BEST_FIT_PROGRESSIVE,
                computeEnvironmentName: 'my-test-compute-env',
                computeResources: {
                    vpc,
                    bidPercentage: 20,
                    computeResourcesTags: new Tag('foo', 'bar'),
                    desiredvCpus: 1,
                    ec2KeyPair: 'my-key-pair',
                    image: new EcsOptimizedAmi({
                        generation: AmazonLinuxGeneration.AMAZON_LINUX_2,
                        hardwareType: AmiHardwareType.STANDARD,
                    }),
                    instanceRole: new iam.Role(stack, 'test-compute-env-instance-role', {
                        assumedBy: new iam.ServicePrincipal('batch.amazonaws.com'),
                    }),
                    instanceTypes: [
                        InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
                    ],
                    maxvCpus: 4,
                    minvCpus: 1,
                    securityGroupIds: [
                        new SecurityGroup(stack, 'test-sg', {
                            vpc,
                            allowAllOutbound: true,
                        }),
                    ],
                    spotIamFleetRole: new iam.Role(stack, 'test-spotfleet-role', {
                        assumedBy: new iam.ServicePrincipal('spotfleet.amazonaws.com'),
                    }),
                    type: batch.ComputeResourceType.SPOT,
                    vpcSubnets: {
                        subnetType: SubnetType.PRIVATE,
                    },
                },
                state: batch.ComputeEnvironmentStatus.DISABLED,
                type: batch.ComputeEnvironmentType.UNMANAGED,
            };

            new batch.ComputeEnvironment(stack, 'test-compute-env', props);

            // THEN
            expect(stack).to(haveResourceLike('AWS::Batch::ComputeEnvironment', {
                ComputeEnvironmentName: 'my-test-compute-env',
                Type: batch.ComputeEnvironmentType.UNMANAGED,
                State: batch.ComputeEnvironmentStatus.DISABLED,
                ComputeResources: {
                    AllocationStrategy: batch.AllocationStrategy.BEST_FIT_PROGRESSIVE,
                    BidPercentage: props.computeResources.bidPercentage,
                    DesiredvCpus: props.computeResources.desiredvCpus,
                    Ec2KeyPair: props.computeResources.ec2KeyPair,
                    ImageId: {
                        Ref: 'SsmParameterValueawsserviceecsoptimizedamiamazonlinux2recommendedimageidC96584B6F00A464EAD1953AFF4B05118Parameter'
                    },
                    InstanceRole: {
                        'Fn::GetAtt': [
                            `${props.computeResources.instanceRole.node.uniqueId}F3B86D94`,
                            'Arn'
                        ]
                    },
                    InstanceTypes: [
                        props.computeResources.instanceTypes[0].toString(),
                    ],
                    MaxvCpus: props.computeResources.maxvCpus,
                    MinvCpus: props.computeResources.minvCpus,
                    SecurityGroupIds: [
                        {
                            'Fn::GetAtt': [
                                `${props.computeResources.securityGroupIds[0].node.uniqueId}872EB48A`,
                                'GroupId'
                            ]
                        }
                    ],
                    SpotIamFleetRole: {
                        'Fn::GetAtt': [
                            `${props.computeResources.spotIamFleetRole.node.uniqueId}36A9D2CA`,
                            'Arn'
                        ]
                    },
                    Subnets: [
                        {
                            Ref: `${vpc.node.uniqueId}PrivateSubnet1Subnet865FB50A`
                        },
                        {
                            Ref: `${vpc.node.uniqueId}PrivateSubnet2Subnet23D3396F`
                        }
                    ],
                    Tags: {
                        key: 'foo',
                        props: {},
                        defaultPriority: 100,
                        value: 'bar'
                    },
                    Type: 'SPOT'
                },
            }, ResourcePart.Properties));
        });

        describe('with no allocation strategy specified', () => {
            test('should default to a best_fit strategy', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const vpc = new Vpc(stack, 'test-vpc');
                const props = computeResourceProps({ vpc });

                // WHEN
                new batch.ComputeEnvironment(stack, 'test-compute-env', {
                    computeResources: props,
                });

                // THEN
                expect(stack).to(haveResourceLike('AWS::Batch::ComputeEnvironment', {
                    ...expectedManagedDefaultProps,
                }, ResourcePart.Properties));
            });
        });

        describe('with a min vcpu value', () => {
            test('should deny less than 0', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const vpc = new Vpc(stack, 'test-vpc');
                const props = computeResourceProps({
                    vpc,
                    minvCpus: -1,
                });

                // THEN
                throws(() => {
                    // WHEN
                    new batch.ComputeEnvironment(stack, 'test-compute-env', {
                        computeResources: props,
                    });
                });
            });

            test('cannot be greater than the max vcpu value', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const vpc = new Vpc(stack, 'test-vpc');
                const props = computeResourceProps({
                    vpc,
                    minvCpus: 2,
                    maxvCpus: 1,
                });

                // THEN
                throws(() => {
                    // WHEN
                    new batch.ComputeEnvironment(stack, 'test-compute-env', {
                        computeResources: props,
                    });
                });
            });
        });

        describe('with no min vcpu value provided', () => {
            test('should default to 0', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const vpc = new Vpc(stack, 'test-vpc');
                const props = computeResourceProps({
                    vpc,
                });

                // WHEN
                new batch.ComputeEnvironment(stack, 'test-compute-env', {
                    type: batch.ComputeEnvironmentType.UNMANAGED,
                    computeResources: props,
                });

                // THEN
                const expectedProps = expectedUnmanagedDefaultComputeProps({
                    MinvCpus: 0,
                });

                expect(stack).to(haveResourceLike('AWS::Batch::ComputeEnvironment', {
                   ...expectedProps,
                }, ResourcePart.Properties));
            });
        });

        describe('with no max vcpu value provided', () => {
            test('should default to 256', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const vpc = new Vpc(stack, 'test-vpc');
                const props = computeResourceProps({
                    vpc,
                });

                // WHEN
                new batch.ComputeEnvironment(stack, 'test-compute-env', {
                    type: batch.ComputeEnvironmentType.UNMANAGED,
                    computeResources: props,
                });

                // THEN
                const expectedProps = expectedUnmanagedDefaultComputeProps({
                    MaxvCpus: 256,
                });

                expect(stack).to(haveResourceLike('AWS::Batch::ComputeEnvironment', {
                   ...expectedProps,
                }, ResourcePart.Properties));
            });
        });

        describe('with no instance role specified', () => {
            test('should generate a role for me', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const vpc = new Vpc(stack, 'test-vpc');
                const props = computeResourceProps({
                    vpc,
                });

                // WHEN
                new batch.ComputeEnvironment(stack, 'test-compute-env', {
                    type: batch.ComputeEnvironmentType.UNMANAGED,
                    computeResources: props,
                });

                // THEN
                expect(stack).to(haveResource('AWS::Batch::ComputeEnvironment'));
                expect(stack).to(haveResource('AWS::IAM::Role'));
            });
        });

        describe('with no instance type defined', () => {
            test('should default to optimal matching', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const vpc = new Vpc(stack, 'test-vpc');
                const props = computeResourceProps({
                    vpc,
                });

                // WHEN
                new batch.ComputeEnvironment(stack, 'test-compute-env', {
                    type: batch.ComputeEnvironmentType.UNMANAGED,
                    computeResources: props,
                });

                // THEN
                const expectedProps = expectedUnmanagedDefaultComputeProps({
                    InstanceTypes: [ 'optimal' ],
                });

                expect(stack).to(haveResourceLike('AWS::Batch::ComputeEnvironment', {
                   ...expectedProps,
                }, ResourcePart.Properties));
            });
        });

        describe('with no type specified', () => {
            test('should default to EC2', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const vpc = new Vpc(stack, 'test-vpc');
                const props = computeResourceProps({
                    vpc,
                });

                // WHEN
                new batch.ComputeEnvironment(stack, 'test-compute-env', {
                    type: batch.ComputeEnvironmentType.UNMANAGED,
                    computeResources: props,
                });

                // THEN
                const expectedProps = expectedUnmanagedDefaultComputeProps({
                    Type: batch.ComputeResourceType.EC2,
                });

                expect(stack).to(haveResourceLike('AWS::Batch::ComputeEnvironment', {
                   ...expectedProps,
                }, ResourcePart.Properties));
            });
        });
    });
});
