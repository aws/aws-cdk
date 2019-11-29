import { expect, haveResource, haveResourceLike, ResourcePart } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { throws } from 'assert';
import * as batch from '../lib';

describe('Batch Compute Evironment', () => {
    let expectedUnmanagedDefaultComputeProps: any;
    let defaultServiceRole: any;

    let stack: cdk.Stack;
    let vpc: ec2.Vpc;

    beforeEach(() => {
        // GIVEN
        stack = new cdk.Stack();
        vpc = new ec2.Vpc(stack, 'test-vpc');

        defaultServiceRole = {
            ServiceRole: {
                'Fn::GetAtt': [
                    'testcomputeenvResourceServiceInstanceRole105069A5',
                    'Arn'
                ],
            },
        };

        expectedUnmanagedDefaultComputeProps = (overrides: any) => {
            return {
                ComputeResources: {
                    AllocationStrategy: batch.AllocationStrategy.BEST_FIT,
                    InstanceRole: {
                        'Fn::GetAtt': [
                            'testcomputeenvResourceInstanceRole7FD819B9',
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
                    Type: batch.ComputeResourceType.ON_DEMAND,
                    ...overrides,
                }
            };
        };
    });

    describe('when validating props', () => {
        test('should deny setting compute resources when using type managed', () => {
            // THEN
            throws(() => {
                // WHEN
                new batch.ComputeEnvironment(stack, 'test-compute-env', {
                    computeResources: {
                        vpc,
                    },
                });
            }, new Error('It is not allowed to set computeResources on an AWS managed compute environment'));
        });

        test('should deny if creating an unmanged environment with no provided compute resource props', () => {
            // THEN
            throws(() => {
                // WHEN
                new batch.ComputeEnvironment(stack, 'test-compute-env', {
                    managed: false,
                });
            }, new Error('computeResources is missing but required on an unmanaged compute environment'));
        });
    });

    describe('using spot resources', () => {
        describe('with a bid percentage', () => {
            test('should deny my bid if set below 0', () => {
                // THEN
                throws(() => {
                    // WHEN
                    new batch.ComputeEnvironment(stack, 'test-compute-env', {
                        managed: false,
                        computeResources: {
                            vpc,
                            type: batch.ComputeResourceType.SPOT,
                            bidPercentage: -1,
                        },
                    });
                }, new Error('Bid percentage can only be a value between 0 and 100'));
            });

            test('should deny my bid if above 100', () => {
                // THEN
                throws(() => {
                    // WHEN
                    new batch.ComputeEnvironment(stack, 'test-compute-env', {
                        managed: false,
                        computeResources: {
                            vpc,
                            type: batch.ComputeResourceType.SPOT,
                            bidPercentage: 101,
                        },
                    });
                }, new Error('Bid percentage can only be a value between 0 and 100'));
            });
        });
    });

    describe('with properties specified', () => {
        test('renders the correct cloudformation properties', () => {
            // WHEN
            const props = {
                allocationStrategy: batch.AllocationStrategy.BEST_FIT_PROGRESSIVE,
                computeEnvironmentName: 'my-test-compute-env',
                computeResources: {
                    vpc,
                    bidPercentage: 20,
                    computeResourcesTags: new cdk.Tag('foo', 'bar'),
                    desiredvCpus: 1,
                    ec2KeyPair: 'my-key-pair',
                    image: new ecs.EcsOptimizedAmi({
                        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
                        hardwareType: ecs.AmiHardwareType.STANDARD,
                    }),
                    instanceRole: new iam.Role(stack, 'test-compute-env-instance-role', {
                        assumedBy: new iam.ServicePrincipal('batch.amazonaws.com'),
                    }),
                    instanceTypes: [
                        ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
                    ],
                    maxvCpus: 4,
                    minvCpus: 1,
                    securityGroups: [
                        new ec2.SecurityGroup(stack, 'test-sg', {
                            vpc,
                            allowAllOutbound: true,
                        }),
                    ],
                    spotIamFleetRole: new iam.Role(stack, 'test-spotfleet-role', {
                        assumedBy: new iam.ServicePrincipal('spotfleet.amazonaws.com'),
                    }),
                    type: batch.ComputeResourceType.SPOT,
                    vpcSubnets: {
                        subnetType: ec2.SubnetType.PRIVATE,
                    },
                } as batch.ComputeResourceProps,
                enabled: false,
                managed: false,
            };

            new batch.ComputeEnvironment(stack, 'test-compute-env', props);

            // THEN
            expect(stack).to(haveResourceLike('AWS::Batch::ComputeEnvironment', {
                ComputeEnvironmentName: 'my-test-compute-env',
                Type: 'UNMANAGED',
                State: 'DISABLED',
                ServiceRole: {
                    'Fn::GetAtt': [
                        'testcomputeenvResourceServiceInstanceRole105069A5',
                        'Arn'
                    ],
                },
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
                            props.computeResources.instanceRole ? `${props.computeResources.instanceRole.node.uniqueId}F3B86D94` : '',
                            'Arn'
                        ]
                    },
                    InstanceTypes: [
                        props.computeResources.instanceTypes ? props.computeResources.instanceTypes[0].toString() : '',
                    ],
                    MaxvCpus: props.computeResources.maxvCpus,
                    MinvCpus: props.computeResources.minvCpus,
                    SecurityGroupIds: [
                        {
                            'Fn::GetAtt': [
                                props.computeResources.securityGroups ? `${props.computeResources.securityGroups[0].node.uniqueId}872EB48A` : '',
                                'GroupId'
                            ]
                        }
                    ],
                    SpotIamFleetRole: {
                        'Fn::GetAtt': [
                            props.computeResources.spotIamFleetRole ? `${props.computeResources.spotIamFleetRole.node.uniqueId}36A9D2CA` : '',
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
                // WHEN
                new batch.ComputeEnvironment(stack, 'test-compute-env', {
                    managed: false,
                    computeResources: {
                        vpc,
                    },
                });

                // THEN
                expect(stack).to(haveResourceLike('AWS::Batch::ComputeEnvironment', {
                    Type: 'UNMANAGED',
                    ServiceRole: {
                        'Fn::GetAtt': [
                            'testcomputeenvResourceServiceInstanceRole105069A5',
                            'Arn'
                        ],
                    },
                }, ResourcePart.Properties));
            });
        });

        describe('with a min vcpu value', () => {
            test('should deny less than 0', () => {
                // THEN
                throws(() => {
                    // WHEN
                    new batch.ComputeEnvironment(stack, 'test-compute-env', {
                        computeResources: {
                            vpc,
                            minvCpus: -1,
                        },
                    });
                }, new Error('Minimum vCpus for a batch compute environment cannot be less than 0'));
            });

            test('cannot be greater than the max vcpu value', () => {
                // THEN
                throws(() => {
                    // WHEN
                    new batch.ComputeEnvironment(stack, 'test-compute-env', {
                        computeResources: {
                            vpc,
                            minvCpus: 2,
                            maxvCpus: 1,
                        },
                    });
                }, new Error('Minimum vCpus cannot be greater than the maximum vCpus'));
            });
        });

        describe('with no min vcpu value provided', () => {
            test('should default to 0', () => {
                // WHEN
                new batch.ComputeEnvironment(stack, 'test-compute-env', {
                    managed: false,
                    computeResources: {
                        vpc,
                    },
                });

                // THEN
                expect(stack).to(haveResourceLike('AWS::Batch::ComputeEnvironment', {
                    ...defaultServiceRole,
                    ...expectedUnmanagedDefaultComputeProps({
                        MinvCpus: 0,
                    }),
                }, ResourcePart.Properties));
            });
        });

        describe('with no max vcpu value provided', () => {
            test('should default to 256', () => {
                // WHEN
                new batch.ComputeEnvironment(stack, 'test-compute-env', {
                    managed: false,
                    computeResources: {
                        vpc,
                    },
                });

                // THEN
                expect(stack).to(haveResourceLike('AWS::Batch::ComputeEnvironment', {
                    ...expectedUnmanagedDefaultComputeProps({
                        MaxvCpus: 256,
                    }),
                }, ResourcePart.Properties));
            });
        });

        describe('with no instance role specified', () => {
            test('should generate a role for me', () => {
                // WHEN
                new batch.ComputeEnvironment(stack, 'test-compute-env', {
                    managed: false,
                    computeResources: {
                        vpc,
                    },
                });

                // THEN
                expect(stack).to(haveResource('AWS::Batch::ComputeEnvironment'));
                expect(stack).to(haveResource('AWS::IAM::Role'));
            });
        });

        describe('with no instance type defined', () => {
            test('should default to optimal matching', () => {
                // WHEN
                new batch.ComputeEnvironment(stack, 'test-compute-env', {
                    managed: false,
                    computeResources: {
                        vpc,
                    },
                });

                // THEN
                expect(stack).to(haveResourceLike('AWS::Batch::ComputeEnvironment', {
                    ...expectedUnmanagedDefaultComputeProps({
                        InstanceTypes: [ 'optimal' ],
                    }),
                }, ResourcePart.Properties));
            });
        });

        describe('with no type specified', () => {
            test('should default to EC2', () => {
                // WHEN
                new batch.ComputeEnvironment(stack, 'test-compute-env', {
                    managed: false,
                    computeResources: {
                        vpc,
                    },
                });

                // THEN
                expect(stack).to(haveResourceLike('AWS::Batch::ComputeEnvironment', {
                    ...expectedUnmanagedDefaultComputeProps({
                        Type: batch.ComputeResourceType.ON_DEMAND,
                    }),
                }, ResourcePart.Properties));
            });
        });
    });
});
