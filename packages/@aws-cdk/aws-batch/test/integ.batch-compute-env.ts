import { expect, haveResource, haveResourceLike, ResourcePart } from '@aws-cdk/assert';
import { AmazonLinuxGeneration, AmazonLinuxImage, InstanceClass, InstanceSize, InstanceType, ISecurityGroup, Vpc } from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as batch from '../lib';

export = {
    'When creating a Batch Compute Environment': {
        'with no spec applied': {
            'creates a managed cluster with free tier resources'(test: Test) {
                // GIVEN
                const env = {
                    account: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
                    region: process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION
                };

                const app = new cdk.App();
                const stack = new cdk.Stack(app, 'test-compute-env', { env });

                // WHEN
                new batch.ComputeEnvironment(stack, 'compute-env');

                // THEN
                expect(stack).to(
                    haveResourceLike('AWS::Batch::ComputeEnvironment', {
                        AllocationStrategy: 'BEST_FIT',
                        MinvCpus: 0,
                        MaxvCpus: 256,
                    }, ResourcePart.Properties)
                );

                expect(stack).to(haveResource('AWS::IAM::Role'));

                test.done();
            },
            'matches all provided compute resource properties'(test: Test) {
                // GIVEN
                const env = {
                    account: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
                    region: process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION
                };

                const app = new cdk.App();
                const stack = new cdk.Stack(app, 'test-compute-env', { env });

                const defaultVpc = Vpc.fromLookup(stack, 'Resource-Default-VPC', {
                    isDefault: true,
                });

                // WHEN
                new batch.ComputeEnvironment(stack, 'compute-env', {
                    computeResources: {
                        bidPercentage: 20,
                        desiredvCpus: 2,
                        ec2KeyPair: 'key-pair',
                        imagedId: new AmazonLinuxImage({ generation: AmazonLinuxGeneration.AMAZON_LINUX_2 }),
                        instanceRole: new iam.Role(stack, 'compute-env-role', {
                            assumedBy: new iam.ServicePrincipal('batch.amazonaws.com'),
                        }),
                        instanceTypes: [
                            InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
                        ],
                        launchTemplate: undefined,
                        maxvCpus: 4,
                        minvCpus: 0,
                        securityGroupIds: new Array<ISecurityGroup>(),
                        spotIamFleetRole: new iam.Role(stack, 'compute-env-spot-role', {
                            assumedBy: new iam.ServicePrincipal('spotfleet.amazonaws.com'),
                        }),
                        subnets: defaultVpc.privateSubnets,
                    },
                });

                // THEN
                expect(stack).to(
                    haveResourceLike('AWS::Batch::ComputeEnvironment', {
                        BidPercentage: 20,
                    }, ResourcePart.Properties)
                );

                expect(stack).to(haveResource('AWS::IAM::Role'));

                test.done();
            },
            'prevents me from setting a spot fleet bid below 0%'(test: Test) {
                // GIVEN
                const env = {
                    account: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
                    region: process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION
                };

                const app = new cdk.App();
                const stack = new cdk.Stack(app, 'test-compute-env', { env });

                const defaultVpc = Vpc.fromLookup(stack, 'Resource-Default-VPC', {
                    isDefault: true,
                });

                test.throws(() => {
                    // WHEN
                    new batch.ComputeEnvironment(stack, 'compute-env', {
                        computeResources: {
                            bidPercentage: -1,
                            instanceRole: new iam.Role(stack, 'compute-env-role', {
                                assumedBy: new iam.ServicePrincipal('batch.amazonaws.com'),
                            }),
                            subnets: defaultVpc.privateSubnets,
                        },
                    });
                    // THEN
                }, 'Bid percentage can only be a value between 0 and 100');

                test.done();
            },
            'prevents me from setting a spot fleet bid above 100%'(test: Test) {
                // GIVEN
                const env = {
                    account: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
                    region: process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION
                };

                const app = new cdk.App();
                const stack = new cdk.Stack(app, 'test-compute-env', { env });

                const defaultVpc = Vpc.fromLookup(stack, 'Resource-Default-VPC', {
                    isDefault: true,
                });

                test.throws(() => {
                    // WHEN
                    new batch.ComputeEnvironment(stack, 'compute-env', {
                        computeResources: {
                            bidPercentage: 101,
                            instanceRole: new iam.Role(stack, 'compute-env-role', {
                                assumedBy: new iam.ServicePrincipal('batch.amazonaws.com'),
                            }),
                            subnets: defaultVpc.privateSubnets,
                        },
                    });
                    // THEN
                }, 'Bid percentage can only be a value between 0 and 100');

                test.done();
            },
        }
    }
};