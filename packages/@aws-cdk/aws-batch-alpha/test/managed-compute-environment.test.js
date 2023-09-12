"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("aws-cdk-lib/assertions");
const ec2 = require("aws-cdk-lib/aws-ec2");
const eks = require("aws-cdk-lib/aws-eks");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const utils_1 = require("./utils");
const batch = require("../lib");
const lib_1 = require("../lib");
const defaultExpectedEcsProps = {
    type: 'managed',
    computeEnvironmentName: undefined,
    serviceRole: undefined,
    state: 'ENABLED',
    eksConfiguration: undefined,
    computeResources: {
        allocationStrategy: lib_1.AllocationStrategy.BEST_FIT_PROGRESSIVE,
        bidPercentage: undefined,
        desiredvCpus: undefined,
        maxvCpus: 256,
        type: 'EC2',
        ec2Configuration: undefined,
        minvCpus: 0,
        subnets: [
            { Ref: 'vpcPrivateSubnet1Subnet934893E8' },
            { Ref: 'vpcPrivateSubnet2Subnet7031C2BA' },
        ],
        ec2KeyPair: undefined,
        imageId: undefined,
        instanceRole: { 'Fn::GetAtt': ['MyCEInstanceProfile6D69963F', 'Arn'] },
        instanceTypes: ['optimal'],
        launchTemplate: undefined,
        placementGroup: undefined,
        securityGroupIds: [{
                'Fn::GetAtt': ['MyCESecurityGroup81DCAA06', 'GroupId'],
            }],
        spotIamFleetRole: undefined,
        updateToLatestImageVersion: true,
    },
    replaceComputeEnvironment: false,
};
const defaultExpectedEksProps = {
    ...defaultExpectedEcsProps,
    eksConfiguration: {
        eksClusterArn: {
            'Fn::GetAtt': ['eksTestCluster1B416C0E', 'Arn'],
        },
        kubernetesNamespace: 'cdk-test-namespace',
    },
};
let stack;
let vpc;
let pascalCaseExpectedEcsProps;
let pascalCaseExpectedEksProps;
let defaultComputeResources;
let defaultEcsProps;
let defaultEksProps;
let expectedProps;
let defaultProps;
describe.each([lib_1.ManagedEc2EcsComputeEnvironment, lib_1.ManagedEc2EksComputeEnvironment])('%p type ComputeEnvironment', (ComputeEnvironment) => {
    beforeEach(() => {
        stack = new aws_cdk_lib_1.Stack();
        vpc = new ec2.Vpc(stack, 'vpc');
        pascalCaseExpectedEcsProps = (0, utils_1.capitalizePropertyNames)(stack, defaultExpectedEcsProps);
        pascalCaseExpectedEksProps = (0, utils_1.capitalizePropertyNames)(stack, defaultExpectedEksProps);
        defaultComputeResources = pascalCaseExpectedEcsProps.ComputeResources;
        defaultEcsProps = {
            vpc,
        };
        defaultEksProps = {
            vpc,
            kubernetesNamespace: 'cdk-test-namespace',
            eksCluster: new eks.Cluster(stack, 'eksTestCluster', {
                version: eks.KubernetesVersion.V1_24,
            }),
        };
        expectedProps = ComputeEnvironment === lib_1.ManagedEc2EcsComputeEnvironment
            ? pascalCaseExpectedEcsProps
            : pascalCaseExpectedEksProps;
        defaultProps = ComputeEnvironment === lib_1.ManagedEc2EcsComputeEnvironment
            ? defaultEcsProps
            : defaultEksProps;
    });
    test('default props', () => {
        // WHEN
        new ComputeEnvironment(stack, 'MyCE', {
            ...defaultProps,
            vpc,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
            ...expectedProps,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::InstanceProfile', {
            Roles: [{ Ref: 'MyCEInstanceProfileRole895D248D' }],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            AssumeRolePolicyDocument: {
                Statement: [{
                        Action: 'sts:AssumeRole',
                        Effect: 'Allow',
                        Principal: { Service: 'ec2.amazonaws.com' },
                    }],
                Version: '2012-10-17',
            },
        });
    });
    test('can specify maxvCpus', () => {
        // WHEN
        new ComputeEnvironment(stack, 'MyCE', {
            ...defaultProps,
            vpc,
            maxvCpus: 512,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
            ...expectedProps,
            ComputeResources: {
                ...defaultComputeResources,
                MaxvCpus: 512,
            },
        });
    });
    test('can specify minvCpus', () => {
        // WHEN
        new ComputeEnvironment(stack, 'MyCE', {
            ...defaultProps,
            vpc,
            minvCpus: 8,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
            ...expectedProps,
            ComputeResources: {
                ...defaultComputeResources,
                MinvCpus: 8,
            },
        });
    });
    test('can be disabled', () => {
        // WHEN
        new ComputeEnvironment(stack, 'MyCE', {
            ...defaultProps,
            vpc,
            enabled: false,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
            ...expectedProps,
            State: 'DISABLED',
        });
    });
    test('spot => AllocationStrategy.SPOT_PRICE_CAPACITY_OPTIMIZED', () => {
        // WHEN
        new ComputeEnvironment(stack, 'MyCE', {
            ...defaultProps,
            vpc,
            spot: true,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
            ...expectedProps,
            ComputeResources: {
                ...defaultComputeResources,
                Type: 'SPOT',
                AllocationStrategy: 'SPOT_PRICE_CAPACITY_OPTIMIZED',
            },
        });
    });
    test('images are correctly rendered as EC2ConfigurationObjects', () => {
        const expectedImageType = ComputeEnvironment === lib_1.ManagedEc2EcsComputeEnvironment
            ? batch.EcsMachineImageType.ECS_AL2
            : batch.EksMachineImageType.EKS_AL2;
        // WHEN
        new ComputeEnvironment(stack, 'MyCE', {
            ...defaultProps,
            vpc,
            images: [
                {
                    image: ec2.MachineImage.latestAmazonLinux2(),
                },
            ],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
            ...expectedProps,
            ComputeResources: {
                ...defaultComputeResources,
                Ec2Configuration: [
                    {
                        ImageIdOverride: { Ref: 'SsmParameterValueawsserviceamiamazonlinuxlatestamzn2amikernel510hvmx8664gp2C96584B6F00A464EAD1953AFF4B05118Parameter' },
                        ImageType: expectedImageType,
                    },
                ],
            },
        });
    });
    test('instance classes are correctly rendered', () => {
        // WHEN
        new ComputeEnvironment(stack, 'MyCE', {
            ...defaultProps,
            vpc,
            instanceClasses: [ec2.InstanceClass.R4],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
            ...expectedProps,
            ComputeResources: {
                ...defaultComputeResources,
                InstanceTypes: [
                    'r4',
                    'optimal',
                ],
            },
        });
    });
    test('instance types are correctly rendered', () => {
        // WHEN
        const ce = new ComputeEnvironment(stack, 'MyCE', {
            ...defaultProps,
            vpc,
            instanceTypes: [ec2.InstanceType.of(ec2.InstanceClass.R4, ec2.InstanceSize.LARGE)],
        });
        ce.addInstanceClass(ec2.InstanceClass.M4);
        ce.addInstanceType(ec2.InstanceType.of(ec2.InstanceClass.C4, ec2.InstanceSize.LARGE));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
            ...expectedProps,
            ComputeResources: {
                ...defaultComputeResources,
                InstanceTypes: [
                    'r4.large',
                    'c4.large',
                    'm4',
                    'optimal',
                ],
            },
        });
    });
    test('respects useOptimalInstanceClasses: false', () => {
        // WHEN
        new ComputeEnvironment(stack, 'MyCE', {
            ...defaultProps,
            vpc,
            useOptimalInstanceClasses: false,
            instanceClasses: [ec2.InstanceClass.R4],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
            ...expectedProps,
            ComputeResources: {
                ...defaultComputeResources,
                InstanceTypes: [
                    'r4',
                ],
            },
        });
    });
    test('does not throw with useOptimalInstanceClasses: false and a call to addInstanceClass()', () => {
        // WHEN
        const myCE = new ComputeEnvironment(stack, 'MyCE', {
            ...defaultProps,
            vpc,
            useOptimalInstanceClasses: false,
        });
        myCE.addInstanceClass(ec2.InstanceClass.C4);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
            ...expectedProps,
            ComputeResources: {
                ...defaultComputeResources,
                InstanceTypes: [
                    'c4',
                ],
            },
        });
    });
    test('does not throw with useOptimalInstanceClasses: false and a call to addInstanceType()', () => {
        // WHEN
        const myCE = new ComputeEnvironment(stack, 'MyCE', {
            ...defaultProps,
            vpc,
            useOptimalInstanceClasses: false,
        });
        myCE.addInstanceType(ec2.InstanceType.of(ec2.InstanceClass.C4, ec2.InstanceSize.XLARGE112));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
            ...expectedProps,
            ComputeResources: {
                ...defaultComputeResources,
                InstanceTypes: [
                    'c4.112xlarge',
                ],
            },
        });
    });
    test('creates and uses instanceProfile, even when instanceRole is specified', () => {
        // WHEN
        new ComputeEnvironment(stack, 'MyCE', {
            ...defaultProps,
            vpc,
            instanceRole: new aws_iam_1.Role(stack, 'myRole', {
                assumedBy: new aws_iam_1.ServicePrincipal('foo.amazonaws.com', {
                    region: 'bermuda-triangle-1337',
                }),
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
            ...expectedProps,
            ComputeResources: {
                ...defaultComputeResources,
                // instanceRole is unchanged from default
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::InstanceProfile', {
            Roles: [{ Ref: 'myRoleE60D68E8' }],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            AssumeRolePolicyDocument: {
                Statement: [{
                        Action: 'sts:AssumeRole',
                        Effect: 'Allow',
                        Principal: { Service: 'foo.amazonaws.com' },
                    }],
                Version: '2012-10-17',
            },
        });
    });
    test('respects launch template', () => {
        // WHEN
        new ComputeEnvironment(stack, 'MyCE', {
            ...defaultProps,
            vpc,
            launchTemplate: new ec2.LaunchTemplate(stack, 'launchTemplate'),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
            ...expectedProps,
            ComputeResources: {
                ...defaultComputeResources,
                LaunchTemplate: {
                    LaunchTemplateId: { Ref: 'launchTemplateDEE5742D' },
                },
            },
        });
    });
    test('respects name', () => {
        // WHEN
        new ComputeEnvironment(stack, 'MyCE', {
            ...defaultProps,
            vpc,
            computeEnvironmentName: 'NamedCE',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
            ...expectedProps,
            ComputeEnvironmentName: 'NamedCE',
            ComputeResources: {
                ...defaultComputeResources,
            },
        });
    });
    test('respects placement group', () => {
        // WHEN
        new ComputeEnvironment(stack, 'MyCE', {
            ...defaultProps,
            vpc,
            placementGroup: new ec2.PlacementGroup(stack, 'myPlacementGroup'),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
            ...expectedProps,
            ComputeResources: {
                ...defaultComputeResources,
                PlacementGroup: {
                    'Fn::GetAtt': ['myPlacementGroup2E94D14E', 'GroupName'],
                },
            },
        });
    });
    test('respects replaceComputeEnvironment', () => {
        // WHEN
        new ComputeEnvironment(stack, 'MyCE', {
            ...defaultProps,
            vpc,
            replaceComputeEnvironment: true,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
            ...expectedProps,
            ComputeResources: {
                ...defaultComputeResources,
            },
            ReplaceComputeEnvironment: true,
        });
    });
    test('respects security groups', () => {
        // WHEN
        new ComputeEnvironment(stack, 'MyCE', {
            ...defaultProps,
            securityGroups: [new ec2.SecurityGroup(stack, 'TestSG', {
                    vpc,
                    allowAllOutbound: false,
                })],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
            ...expectedProps,
            ComputeResources: {
                ...defaultComputeResources,
                SecurityGroupIds: [{
                        'Fn::GetAtt': ['TestSG581D3391', 'GroupId'],
                    }],
            },
        });
    });
    test('respects service role', () => {
        // WHEN
        new ComputeEnvironment(stack, 'MyCE', {
            ...defaultProps,
            serviceRole: new aws_iam_1.Role(stack, 'TestSLR', {
                assumedBy: new aws_iam_1.ServicePrincipal('cdk.amazonaws.com'),
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
            ...expectedProps,
            ServiceRole: {
                'Fn::GetAtt': ['TestSLR05974C22', 'Arn'],
            },
            ComputeResources: {
                ...defaultComputeResources,
            },
        });
    });
    test('respects vpcSubnets', () => {
        // WHEN
        new ComputeEnvironment(stack, 'MyCE', {
            ...defaultProps,
            vpcSubnets: {
                subnets: [new ec2.Subnet(stack, 'testSubnet', {
                        availabilityZone: 'az-3',
                        cidrBlock: '10.0.0.0/32',
                        vpcId: new ec2.Vpc(stack, 'subnetVpc').vpcId,
                    })],
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
            ...expectedProps,
            ComputeResources: {
                ...defaultComputeResources,
                Subnets: [
                    { Ref: 'testSubnet42F0FA0C' },
                ],
            },
        });
    });
    test('respects updateTimeout', () => {
        // WHEN
        new ComputeEnvironment(stack, 'MyCE', {
            ...defaultProps,
            updateTimeout: aws_cdk_lib_1.Duration.minutes(1),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
            ...expectedProps,
            ComputeResources: {
                ...defaultComputeResources,
            },
            UpdatePolicy: {
                JobExecutionTimeoutMinutes: 1,
            },
        });
    });
    test('respects terminateOnUpdate', () => {
        // WHEN
        new ComputeEnvironment(stack, 'MyCE', {
            ...defaultProps,
            terminateOnUpdate: false,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
            ...expectedProps,
            ComputeResources: {
                ...defaultComputeResources,
            },
            UpdatePolicy: {
                TerminateJobsOnUpdate: false,
            },
        });
    });
    test('respects updateToLatestImageVersion', () => {
        // WHEN
        new ComputeEnvironment(stack, 'MyCE', {
            ...defaultProps,
            updateToLatestImageVersion: false,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
            ...expectedProps,
            ComputeResources: {
                ...defaultComputeResources,
                UpdateToLatestImageVersion: false,
            },
        });
    });
    test('respects tags', () => {
        // WHEN
        const ce = new ComputeEnvironment(stack, 'MyCE', {
            ...defaultProps,
        });
        aws_cdk_lib_1.Tags.of(ce).add('superfood', 'acai');
        aws_cdk_lib_1.Tags.of(ce).add('super', 'salamander');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
            ...expectedProps,
            ComputeResources: {
                ...defaultComputeResources,
                Tags: {
                    superfood: 'acai',
                    super: 'salamander',
                },
            },
        });
    });
    test('can be imported from arn', () => {
        // WHEN
        const ce = lib_1.ManagedEc2EcsComputeEnvironment.fromManagedEc2EcsComputeEnvironmentArn(stack, 'import', 'arn:aws:batch:us-east-1:123456789012:compute-environment/ce-name');
        // THEN
        expect(ce.computeEnvironmentArn).toEqual('arn:aws:batch:us-east-1:123456789012:compute-environment/ce-name');
    });
    test('attach necessary managed policy to instance role', () => {
        // WHEN
        new ComputeEnvironment(stack, 'MyCE', {
            ...defaultProps,
            vpc,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            ManagedPolicyArns: [
                {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {
                                Ref: 'AWS::Partition',
                            },
                            ':iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role',
                        ],
                    ],
                },
            ],
        });
    });
    test('throws when no instance types are provided', () => {
        new ComputeEnvironment(stack, 'MyCE', {
            ...defaultProps,
            useOptimalInstanceClasses: false,
            vpc,
        });
        expect(() => {
            assertions_1.Template.fromStack(stack);
        }).toThrow(/Specifies 'useOptimalInstanceClasses: false' without specifying any instance types or classes/);
    });
    test('throws error when AllocationStrategy.SPOT_CAPACITY_OPTIMIZED is used without specfiying spot', () => {
        // THEN
        expect(() => {
            new ComputeEnvironment(stack, 'MyCE', {
                ...defaultProps,
                vpc,
                allocationStrategy: lib_1.AllocationStrategy.SPOT_CAPACITY_OPTIMIZED,
            });
        }).toThrow(/Managed ComputeEnvironment 'MyCE' specifies 'AllocationStrategy.SPOT_CAPACITY_OPTIMIZED' without using spot instances/);
    });
    test('throws error when AllocationStrategy.SPOT_PRICE_CAPACITY_OPTIMIZED is used without specfiying spot', () => {
        // THEN
        expect(() => {
            new ComputeEnvironment(stack, 'MyCE', {
                ...defaultProps,
                vpc,
                allocationStrategy: lib_1.AllocationStrategy.SPOT_PRICE_CAPACITY_OPTIMIZED,
            });
        }).toThrow(/Managed ComputeEnvironment 'MyCE' specifies 'AllocationStrategy.SPOT_PRICE_CAPACITY_OPTIMIZED' without using spot instances/);
    });
    test('throws error when spotBidPercentage is specified without spot', () => {
        // THEN
        expect(() => {
            new ComputeEnvironment(stack, 'MyCE', {
                ...defaultProps,
                vpc,
                spotBidPercentage: 80,
            });
        }).toThrow(/Managed ComputeEnvironment 'MyCE' specifies 'spotBidPercentage' without specifying 'spot'/);
    });
    test('throws error when spotBidPercentage is specified and spot is false', () => {
        // THEN
        expect(() => {
            new ComputeEnvironment(stack, 'MyCE', {
                ...defaultProps,
                vpc,
                spotBidPercentage: 80,
                spot: false,
            });
        }).toThrow(/Managed ComputeEnvironment 'MyCE' specifies 'spotBidPercentage' without specifying 'spot'/);
    });
    test('throws error when spotBidPercentage > 100', () => {
        // THEN
        expect(() => {
            new ComputeEnvironment(stack, 'MyCE', {
                ...defaultProps,
                vpc,
                spotBidPercentage: 120,
                spot: true,
            });
        }).toThrow(/Managed ComputeEnvironment 'MyCE' specifies 'spotBidPercentage' > 100/);
    });
    test('throws error when spotBidPercentage < 0', () => {
        // THEN
        expect(() => {
            new ComputeEnvironment(stack, 'MyCE', {
                ...defaultProps,
                vpc,
                spotBidPercentage: -120,
                spot: true,
            });
        }).toThrow(/Managed ComputeEnvironment 'MyCE' specifies 'spotBidPercentage' < 0/);
    });
    test('throws error when minvCpus > maxvCpus', () => {
        // THEN
        expect(() => {
            new ComputeEnvironment(stack, 'MyCE', {
                ...defaultProps,
                vpc,
                maxvCpus: 512,
                minvCpus: 1024,
            });
        }).toThrow(/Managed ComputeEnvironment 'MyCE' has 'minvCpus' = 1024 > 'maxvCpus' = 512; 'minvCpus' cannot be greater than 'maxvCpus'/);
    });
    test('throws error when minvCpus < 0', () => {
        // THEN
        expect(() => {
            new ComputeEnvironment(stack, 'MyCE', {
                ...defaultProps,
                vpc,
                minvCpus: -256,
            });
        }).toThrowError(/Managed ComputeEnvironment 'MyCE' has 'minvCpus' = -256 < 0; 'minvCpus' cannot be less than zero/);
    });
});
describe('ManagedEc2EcsComputeEnvironment', () => {
    beforeEach(() => {
        stack = new aws_cdk_lib_1.Stack();
        vpc = new ec2.Vpc(stack, 'vpc');
        pascalCaseExpectedEcsProps = (0, utils_1.capitalizePropertyNames)(stack, defaultExpectedEcsProps);
        pascalCaseExpectedEksProps = (0, utils_1.capitalizePropertyNames)(stack, defaultExpectedEksProps);
        defaultComputeResources = pascalCaseExpectedEcsProps.ComputeResources;
        defaultEcsProps = {
            vpc,
        };
        defaultEksProps = {
            vpc,
            kubernetesNamespace: 'cdk-test-namespace',
            eksCluster: new eks.Cluster(stack, 'eksTestCluster', {
                version: eks.KubernetesVersion.V1_24,
            }),
        };
    });
    test('respects spotFleetRole', () => {
        // WHEN
        new lib_1.ManagedEc2EcsComputeEnvironment(stack, 'MyCE', {
            ...defaultEcsProps,
            spot: true,
            spotFleetRole: new aws_iam_1.Role(stack, 'SpotFleetRole', {
                assumedBy: new aws_iam_1.ArnPrincipal('arn:aws:iam:123456789012:magicuser/foobar'),
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
            ...pascalCaseExpectedEcsProps,
            ComputeResources: {
                ...defaultComputeResources,
                AllocationStrategy: lib_1.AllocationStrategy.SPOT_PRICE_CAPACITY_OPTIMIZED,
                Type: 'SPOT',
                SpotIamFleetRole: {
                    'Fn::GetAtt': ['SpotFleetRole6D4F7558', 'Arn'],
                },
            },
        });
    });
    test('image types are correctly rendered as EC2ConfigurationObjects', () => {
        // WHEN
        new lib_1.ManagedEc2EcsComputeEnvironment(stack, 'MyCE', {
            ...defaultEcsProps,
            vpc,
            images: [
                {
                    imageType: batch.EcsMachineImageType.ECS_AL2_NVIDIA,
                },
            ],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
            ...pascalCaseExpectedEcsProps,
            ComputeResources: {
                ...defaultComputeResources,
                Ec2Configuration: [
                    {
                        ImageType: 'ECS_AL2_NVIDIA',
                    },
                ],
            },
        });
    });
    test('can use non-default allocation strategy', () => {
        // WHEN
        new lib_1.ManagedEc2EcsComputeEnvironment(stack, 'MyCE', {
            ...defaultProps,
            vpc,
            allocationStrategy: lib_1.AllocationStrategy.BEST_FIT,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
            ...pascalCaseExpectedEcsProps,
            ComputeResources: {
                ...defaultComputeResources,
                AllocationStrategy: 'BEST_FIT',
            },
        });
    });
    test('spot and AllocationStrategy.BEST_FIT => a default spot fleet role is created', () => {
        // WHEN
        new lib_1.ManagedEc2EcsComputeEnvironment(stack, 'MyCE', {
            ...defaultProps,
            vpc,
            spot: true,
            allocationStrategy: lib_1.AllocationStrategy.BEST_FIT,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
            ...pascalCaseExpectedEcsProps,
            ComputeResources: {
                ...defaultComputeResources,
                Type: 'SPOT',
                AllocationStrategy: 'BEST_FIT',
                SpotIamFleetRole: { 'Fn::GetAtt': ['MyCESpotFleetRole70BE30A0', 'Arn'] },
            },
        });
    });
    test('throws when spotFleetRole is specified without spot', () => {
        // WHEN
        expect(() => {
            new lib_1.ManagedEc2EcsComputeEnvironment(stack, 'MyCE', {
                ...defaultEcsProps,
                spotFleetRole: new aws_iam_1.Role(stack, 'SpotFleetRole', {
                    assumedBy: new aws_iam_1.ArnPrincipal('arn:aws:iam:123456789012:magicuser/foobar'),
                }),
            });
        }).toThrow(/Managed ComputeEnvironment 'MyCE' specifies 'spotFleetRole' without specifying 'spot'/);
    });
});
describe('ManagedEc2EksComputeEnvironment', () => {
    beforeEach(() => {
        stack = new aws_cdk_lib_1.Stack();
        vpc = new ec2.Vpc(stack, 'vpc');
        pascalCaseExpectedEcsProps = (0, utils_1.capitalizePropertyNames)(stack, defaultExpectedEcsProps);
        pascalCaseExpectedEksProps = (0, utils_1.capitalizePropertyNames)(stack, defaultExpectedEksProps);
        defaultComputeResources = pascalCaseExpectedEcsProps.ComputeResources;
        defaultEcsProps = {
            vpc,
        };
        defaultEksProps = {
            vpc,
            kubernetesNamespace: 'cdk-test-namespace',
            eksCluster: new eks.Cluster(stack, 'eksTestCluster', {
                version: eks.KubernetesVersion.V1_24,
            }),
        };
    });
    test('default props', () => {
        // WHEN
        new lib_1.ManagedEc2EksComputeEnvironment(stack, 'MyCE', {
            ...defaultEksProps,
            vpc,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
            ...pascalCaseExpectedEksProps,
            ComputeResources: {
                ...defaultComputeResources,
            },
        });
    });
    test('throws error when AllocationStrategy.BEST_FIT is used', () => {
        // THEN
        expect(() => {
            new lib_1.ManagedEc2EksComputeEnvironment(stack, 'MyCE', {
                ...defaultProps,
                allocationStrategy: lib_1.AllocationStrategy.BEST_FIT,
            });
        }).toThrow(/ManagedEc2EksComputeEnvironment 'MyCE' uses invalid allocation strategy 'AllocationStrategy.BEST_FIT'/);
    });
    test('image types are correctly rendered as EC2ConfigurationObjects', () => {
        // WHEN
        new lib_1.ManagedEc2EksComputeEnvironment(stack, 'MyCE', {
            ...defaultEksProps,
            vpc,
            images: [
                {
                    imageType: batch.EksMachineImageType.EKS_AL2_NVIDIA,
                },
            ],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
            ...pascalCaseExpectedEksProps,
            ComputeResources: {
                ...defaultComputeResources,
                Ec2Configuration: [
                    {
                        ImageType: 'EKS_AL2_NVIDIA',
                    },
                ],
            },
        });
    });
});
describe('FargateComputeEnvironment', () => {
    beforeEach(() => {
        stack = new aws_cdk_lib_1.Stack();
        vpc = new ec2.Vpc(stack, 'vpc');
    });
    test('respects name', () => {
        // WHEN
        new lib_1.FargateComputeEnvironment(stack, 'maximalPropsFargate', {
            vpc,
            maxvCpus: 512,
            computeEnvironmentName: 'maxPropsFargateCE',
            replaceComputeEnvironment: true,
            spot: true,
            terminateOnUpdate: true,
            updateTimeout: aws_cdk_lib_1.Duration.minutes(30),
            updateToLatestImageVersion: false,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
            ComputeEnvironmentName: 'maxPropsFargateCE',
        });
    });
    test('can be imported from arn', () => {
        // WHEN
        const ce = lib_1.FargateComputeEnvironment.fromFargateComputeEnvironmentArn(stack, 'import', 'arn:aws:batch:us-east-1:123456789012:compute-environment/ce-name');
        // THEN
        expect(ce.computeEnvironmentArn).toEqual('arn:aws:batch:us-east-1:123456789012:compute-environment/ce-name');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFuYWdlZC1jb21wdXRlLWVudmlyb25tZW50LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtYW5hZ2VkLWNvbXB1dGUtZW52aXJvbm1lbnQudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVEQUFrRDtBQUNsRCwyQ0FBMkM7QUFDM0MsMkNBQTJDO0FBQzNDLGlEQUEyRTtBQUMzRSw2Q0FBb0Q7QUFDcEQsbUNBQWtEO0FBQ2xELGdDQUFnQztBQUNoQyxnQ0FBcU47QUFHck4sTUFBTSx1QkFBdUIsR0FBK0I7SUFDMUQsSUFBSSxFQUFFLFNBQVM7SUFDZixzQkFBc0IsRUFBRSxTQUFTO0lBQ2pDLFdBQVcsRUFBRSxTQUFTO0lBQ3RCLEtBQUssRUFBRSxTQUFTO0lBQ2hCLGdCQUFnQixFQUFFLFNBQVM7SUFDM0IsZ0JBQWdCLEVBQUU7UUFDaEIsa0JBQWtCLEVBQUUsd0JBQWtCLENBQUMsb0JBQW9CO1FBQzNELGFBQWEsRUFBRSxTQUFTO1FBQ3hCLFlBQVksRUFBRSxTQUFTO1FBQ3ZCLFFBQVEsRUFBRSxHQUFHO1FBQ2IsSUFBSSxFQUFFLEtBQUs7UUFDWCxnQkFBZ0IsRUFBRSxTQUFTO1FBQzNCLFFBQVEsRUFBRSxDQUFDO1FBQ1gsT0FBTyxFQUFFO1lBQ1AsRUFBRSxHQUFHLEVBQUUsaUNBQWlDLEVBQVM7WUFDakQsRUFBRSxHQUFHLEVBQUUsaUNBQWlDLEVBQVM7U0FDbEQ7UUFDRCxVQUFVLEVBQUUsU0FBUztRQUNyQixPQUFPLEVBQUUsU0FBUztRQUNsQixZQUFZLEVBQUUsRUFBRSxZQUFZLEVBQUUsQ0FBQyw2QkFBNkIsRUFBRSxLQUFLLENBQUMsRUFBUztRQUM3RSxhQUFhLEVBQUUsQ0FBQyxTQUFTLENBQUM7UUFDMUIsY0FBYyxFQUFFLFNBQVM7UUFDekIsY0FBYyxFQUFFLFNBQVM7UUFDekIsZ0JBQWdCLEVBQUUsQ0FBQztnQkFDakIsWUFBWSxFQUFFLENBQUMsMkJBQTJCLEVBQUUsU0FBUyxDQUFDO2FBQ3ZE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QUMsZ0NBQWdDLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxrRUFBa0UsQ0FBQyxDQUFDO1FBRTNKLE9BQU87UUFDUCxNQUFNLENBQUMsRUFBRSxDQUFDLHFCQUFxQixDQUFDLENBQUMsT0FBTyxDQUFDLGtFQUFrRSxDQUFDLENBQUM7SUFDL0csQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnYXdzLWNkay1saWIvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBla3MgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVrcyc7XG5pbXBvcnQgeyBBcm5QcmluY2lwYWwsIFJvbGUsIFNlcnZpY2VQcmluY2lwYWwgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCB7IFN0YWNrLCBEdXJhdGlvbiwgVGFncyB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IGNhcGl0YWxpemVQcm9wZXJ0eU5hbWVzIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgKiBhcyBiYXRjaCBmcm9tICcuLi9saWInO1xuaW1wb3J0IHsgQWxsb2NhdGlvblN0cmF0ZWd5LCBNYW5hZ2VkRWMyRWNzQ29tcHV0ZUVudmlyb25tZW50LCBNYW5hZ2VkRWMyRWNzQ29tcHV0ZUVudmlyb25tZW50UHJvcHMsIE1hbmFnZWRFYzJFa3NDb21wdXRlRW52aXJvbm1lbnQsIE1hbmFnZWRFYzJFa3NDb21wdXRlRW52aXJvbm1lbnRQcm9wcywgRmFyZ2F0ZUNvbXB1dGVFbnZpcm9ubWVudCB9IGZyb20gJy4uL2xpYic7XG5pbXBvcnQgeyBDZm5Db21wdXRlRW52aXJvbm1lbnRQcm9wcyB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1iYXRjaCc7XG5cbmNvbnN0IGRlZmF1bHRFeHBlY3RlZEVjc1Byb3BzOiBDZm5Db21wdXRlRW52aXJvbm1lbnRQcm9wcyA9IHtcbiAgdHlwZTogJ21hbmFnZWQnLFxuICBjb21wdXRlRW52aXJvbm1lbnROYW1lOiB1bmRlZmluZWQsXG4gIHNlcnZpY2VSb2xlOiB1bmRlZmluZWQsXG4gIHN0YXRlOiAnRU5BQkxFRCcsXG4gIGVrc0NvbmZpZ3VyYXRpb246IHVuZGVmaW5lZCxcbiAgY29tcHV0ZVJlc291cmNlczoge1xuICAgIGFsbG9jYXRpb25TdHJhdGVneTogQWxsb2NhdGlvblN0cmF0ZWd5LkJFU1RfRklUX1BST0dSRVNTSVZFLFxuICAgIGJpZFBlcmNlbnRhZ2U6IHVuZGVmaW5lZCxcbiAgICBkZXNpcmVkdkNwdXM6IHVuZGVmaW5lZCxcbiAgICBtYXh2Q3B1czogMjU2LFxuICAgIHR5cGU6ICdFQzInLFxuICAgIGVjMkNvbmZpZ3VyYXRpb246IHVuZGVmaW5lZCxcbiAgICBtaW52Q3B1czogMCxcbiAgICBzdWJuZXRzOiBbXG4gICAgICB7IFJlZjogJ3ZwY1ByaXZhdGVTdWJuZXQxU3VibmV0OTM0ODkzRTgnIH0gYXMgYW55LFxuICAgICAgeyBSZWY6ICd2cGNQcml2YXRlU3VibmV0MlN1Ym5ldDcwMzFDMkJBJyB9IGFzIGFueSxcbiAgICBdLFxuICAgIGVjMktleVBhaXI6IHVuZGVmaW5lZCxcbiAgICBpbWFnZUlkOiB1bmRlZmluZWQsXG4gICAgaW5zdGFuY2VSb2xlOiB7ICdGbjo6R2V0QXR0JzogWydNeUNFSW5zdGFuY2VQcm9maWxlNkQ2OTk2M0YnLCAnQXJuJ10gfSBhcyBhbnksXG4gICAgaW5zdGFuY2VUeXBlczogWydvcHRpbWFsJ10sXG4gICAgbGF1bmNoVGVtcGxhdGU6IHVuZGVmaW5lZCxcbiAgICBwbGFjZW1lbnRHcm91cDogdW5kZWZpbmVkLFxuICAgIHNlY3VyaXR5R3JvdXBJZHM6IFt7XG4gICAgICAnRm46OkdldEF0dCc6IFsnTXlDRVNlY3VyaXR5R3JvdXA4MURDQUEwNicsICdHcm91cElkJ10sXG4gICAgfV0gYXMgYW55LFxuICAgIHNwb3RJYW1GbGVldFJvbGU6IHVuZGVmaW5lZCxcbiAgICB1cGRhdGVUb0xhdGVzdEltYWdlVmVyc2lvbjogdHJ1ZSxcbiAgfSxcbiAgcmVwbGFjZUNvbXB1dGVFbnZpcm9ubWVudDogZmFsc2UsXG59O1xuXG5jb25zdCBkZWZhdWx0RXhwZWN0ZWRFa3NQcm9wczogQ2ZuQ29tcHV0ZUVudmlyb25tZW50UHJvcHMgPSB7XG4gIC4uLmRlZmF1bHRFeHBlY3RlZEVjc1Byb3BzLFxuICBla3NDb25maWd1cmF0aW9uOiB7XG4gICAgZWtzQ2x1c3RlckFybjoge1xuICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ2Vrc1Rlc3RDbHVzdGVyMUI0MTZDMEUnLCAnQXJuJ10sXG4gICAgfSBhcyBhbnksXG4gICAga3ViZXJuZXRlc05hbWVzcGFjZTogJ2Nkay10ZXN0LW5hbWVzcGFjZScsXG4gIH0sXG59O1xuXG5sZXQgc3RhY2s6IFN0YWNrO1xubGV0IHZwYzogZWMyLlZwYztcblxubGV0IHBhc2NhbENhc2VFeHBlY3RlZEVjc1Byb3BzOiBhbnk7XG5sZXQgcGFzY2FsQ2FzZUV4cGVjdGVkRWtzUHJvcHM6IGFueTtcbmxldCBkZWZhdWx0Q29tcHV0ZVJlc291cmNlczogYW55O1xuXG5sZXQgZGVmYXVsdEVjc1Byb3BzOiBNYW5hZ2VkRWMyRWNzQ29tcHV0ZUVudmlyb25tZW50UHJvcHM7XG5sZXQgZGVmYXVsdEVrc1Byb3BzOiBNYW5hZ2VkRWMyRWtzQ29tcHV0ZUVudmlyb25tZW50UHJvcHM7XG5cbmxldCBleHBlY3RlZFByb3BzOiBhbnk7XG5sZXQgZGVmYXVsdFByb3BzOiBhbnk7XG5cbmRlc2NyaWJlLmVhY2goW01hbmFnZWRFYzJFY3NDb21wdXRlRW52aXJvbm1lbnQsIE1hbmFnZWRFYzJFa3NDb21wdXRlRW52aXJvbm1lbnRdKSgnJXAgdHlwZSBDb21wdXRlRW52aXJvbm1lbnQnLCAoQ29tcHV0ZUVudmlyb25tZW50KSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICd2cGMnKTtcblxuICAgIHBhc2NhbENhc2VFeHBlY3RlZEVjc1Byb3BzID0gY2FwaXRhbGl6ZVByb3BlcnR5TmFtZXMoc3RhY2ssIGRlZmF1bHRFeHBlY3RlZEVjc1Byb3BzKTtcbiAgICBwYXNjYWxDYXNlRXhwZWN0ZWRFa3NQcm9wcyA9IGNhcGl0YWxpemVQcm9wZXJ0eU5hbWVzKHN0YWNrLCBkZWZhdWx0RXhwZWN0ZWRFa3NQcm9wcyk7XG4gICAgZGVmYXVsdENvbXB1dGVSZXNvdXJjZXMgPSBwYXNjYWxDYXNlRXhwZWN0ZWRFY3NQcm9wcy5Db21wdXRlUmVzb3VyY2VzO1xuXG4gICAgZGVmYXVsdEVjc1Byb3BzID0ge1xuICAgICAgdnBjLFxuICAgIH07XG4gICAgZGVmYXVsdEVrc1Byb3BzID0ge1xuICAgICAgdnBjLFxuICAgICAga3ViZXJuZXRlc05hbWVzcGFjZTogJ2Nkay10ZXN0LW5hbWVzcGFjZScsXG4gICAgICBla3NDbHVzdGVyOiBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdla3NUZXN0Q2x1c3RlcicsIHtcbiAgICAgICAgdmVyc2lvbjogZWtzLkt1YmVybmV0ZXNWZXJzaW9uLlYxXzI0LFxuICAgICAgfSksXG4gICAgfTtcbiAgICBleHBlY3RlZFByb3BzID0gQ29tcHV0ZUVudmlyb25tZW50ID09PSBNYW5hZ2VkRWMyRWNzQ29tcHV0ZUVudmlyb25tZW50XG4gICAgICA/IHBhc2NhbENhc2VFeHBlY3RlZEVjc1Byb3BzXG4gICAgICA6IHBhc2NhbENhc2VFeHBlY3RlZEVrc1Byb3BzO1xuICAgIGRlZmF1bHRQcm9wcyA9IENvbXB1dGVFbnZpcm9ubWVudCA9PT0gTWFuYWdlZEVjMkVjc0NvbXB1dGVFbnZpcm9ubWVudFxuICAgICAgPyBkZWZhdWx0RWNzUHJvcHMgYXMgTWFuYWdlZEVjMkVjc0NvbXB1dGVFbnZpcm9ubWVudFByb3BzXG4gICAgICA6IGRlZmF1bHRFa3NQcm9wcyBhcyBNYW5hZ2VkRWMyRWtzQ29tcHV0ZUVudmlyb25tZW50UHJvcHM7XG4gIH0pO1xuXG4gIHRlc3QoJ2RlZmF1bHQgcHJvcHMnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBDb21wdXRlRW52aXJvbm1lbnQoc3RhY2ssICdNeUNFJywge1xuICAgICAgLi4uZGVmYXVsdFByb3BzLFxuICAgICAgdnBjLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkJhdGNoOjpDb21wdXRlRW52aXJvbm1lbnQnLCB7XG4gICAgICAuLi5leHBlY3RlZFByb3BzLFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6SW5zdGFuY2VQcm9maWxlJywge1xuICAgICAgUm9sZXM6IFt7IFJlZjogJ015Q0VJbnN0YW5jZVByb2ZpbGVSb2xlODk1RDI0OEQnIH1dLFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICAgIEFzc3VtZVJvbGVQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFt7XG4gICAgICAgICAgQWN0aW9uOiAnc3RzOkFzc3VtZVJvbGUnLFxuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBQcmluY2lwYWw6IHsgU2VydmljZTogJ2VjMi5hbWF6b25hd3MuY29tJyB9LFxuICAgICAgICB9XSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIHNwZWNpZnkgbWF4dkNwdXMnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBDb21wdXRlRW52aXJvbm1lbnQoc3RhY2ssICdNeUNFJywge1xuICAgICAgLi4uZGVmYXVsdFByb3BzLFxuICAgICAgdnBjLFxuICAgICAgbWF4dkNwdXM6IDUxMixcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpCYXRjaDo6Q29tcHV0ZUVudmlyb25tZW50Jywge1xuICAgICAgLi4uZXhwZWN0ZWRQcm9wcyxcbiAgICAgIENvbXB1dGVSZXNvdXJjZXM6IHtcbiAgICAgICAgLi4uZGVmYXVsdENvbXB1dGVSZXNvdXJjZXMsXG4gICAgICAgIE1heHZDcHVzOiA1MTIsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gc3BlY2lmeSBtaW52Q3B1cycsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IENvbXB1dGVFbnZpcm9ubWVudChzdGFjaywgJ015Q0UnLCB7XG4gICAgICAuLi5kZWZhdWx0UHJvcHMsXG4gICAgICB2cGMsXG4gICAgICBtaW52Q3B1czogOCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpCYXRjaDo6Q29tcHV0ZUVudmlyb25tZW50Jywge1xuICAgICAgLi4uZXhwZWN0ZWRQcm9wcyxcbiAgICAgIENvbXB1dGVSZXNvdXJjZXM6IHtcbiAgICAgICAgLi4uZGVmYXVsdENvbXB1dGVSZXNvdXJjZXMsXG4gICAgICAgIE1pbnZDcHVzOiA4LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGJlIGRpc2FibGVkJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgQ29tcHV0ZUVudmlyb25tZW50KHN0YWNrLCAnTXlDRScsIHtcbiAgICAgIC4uLmRlZmF1bHRQcm9wcyxcbiAgICAgIHZwYyxcbiAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkJhdGNoOjpDb21wdXRlRW52aXJvbm1lbnQnLCB7XG4gICAgICAuLi5leHBlY3RlZFByb3BzLFxuICAgICAgU3RhdGU6ICdESVNBQkxFRCcsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Nwb3QgPT4gQWxsb2NhdGlvblN0cmF0ZWd5LlNQT1RfUFJJQ0VfQ0FQQUNJVFlfT1BUSU1JWkVEJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgQ29tcHV0ZUVudmlyb25tZW50KHN0YWNrLCAnTXlDRScsIHtcbiAgICAgIC4uLmRlZmF1bHRQcm9wcyxcbiAgICAgIHZwYyxcbiAgICAgIHNwb3Q6IHRydWUsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QmF0Y2g6OkNvbXB1dGVFbnZpcm9ubWVudCcsIHtcbiAgICAgIC4uLmV4cGVjdGVkUHJvcHMsXG4gICAgICBDb21wdXRlUmVzb3VyY2VzOiB7XG4gICAgICAgIC4uLmRlZmF1bHRDb21wdXRlUmVzb3VyY2VzLFxuICAgICAgICBUeXBlOiAnU1BPVCcsXG4gICAgICAgIEFsbG9jYXRpb25TdHJhdGVneTogJ1NQT1RfUFJJQ0VfQ0FQQUNJVFlfT1BUSU1JWkVEJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ltYWdlcyBhcmUgY29ycmVjdGx5IHJlbmRlcmVkIGFzIEVDMkNvbmZpZ3VyYXRpb25PYmplY3RzJywgKCkgPT4ge1xuICAgIGNvbnN0IGV4cGVjdGVkSW1hZ2VUeXBlID0gQ29tcHV0ZUVudmlyb25tZW50ID09PSBNYW5hZ2VkRWMyRWNzQ29tcHV0ZUVudmlyb25tZW50XG4gICAgICA/IGJhdGNoLkVjc01hY2hpbmVJbWFnZVR5cGUuRUNTX0FMMlxuICAgICAgOiBiYXRjaC5Fa3NNYWNoaW5lSW1hZ2VUeXBlLkVLU19BTDI7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IENvbXB1dGVFbnZpcm9ubWVudChzdGFjaywgJ015Q0UnLCB7XG4gICAgICAuLi5kZWZhdWx0UHJvcHMsXG4gICAgICB2cGMsXG4gICAgICBpbWFnZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGltYWdlOiBlYzIuTWFjaGluZUltYWdlLmxhdGVzdEFtYXpvbkxpbnV4MigpLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpCYXRjaDo6Q29tcHV0ZUVudmlyb25tZW50Jywge1xuICAgICAgLi4uZXhwZWN0ZWRQcm9wcyxcbiAgICAgIENvbXB1dGVSZXNvdXJjZXM6IHtcbiAgICAgICAgLi4uZGVmYXVsdENvbXB1dGVSZXNvdXJjZXMsXG4gICAgICAgIEVjMkNvbmZpZ3VyYXRpb246IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBJbWFnZUlkT3ZlcnJpZGU6IHsgUmVmOiAnU3NtUGFyYW1ldGVyVmFsdWVhd3NzZXJ2aWNlYW1pYW1hem9ubGludXhsYXRlc3RhbXpuMmFtaWtlcm5lbDUxMGh2bXg4NjY0Z3AyQzk2NTg0QjZGMDBBNDY0RUFEMTk1M0FGRjRCMDUxMThQYXJhbWV0ZXInIH0sXG4gICAgICAgICAgICBJbWFnZVR5cGU6IGV4cGVjdGVkSW1hZ2VUeXBlLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdpbnN0YW5jZSBjbGFzc2VzIGFyZSBjb3JyZWN0bHkgcmVuZGVyZWQnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBDb21wdXRlRW52aXJvbm1lbnQoc3RhY2ssICdNeUNFJywge1xuICAgICAgLi4uZGVmYXVsdFByb3BzLFxuICAgICAgdnBjLFxuICAgICAgaW5zdGFuY2VDbGFzc2VzOiBbZWMyLkluc3RhbmNlQ2xhc3MuUjRdLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkJhdGNoOjpDb21wdXRlRW52aXJvbm1lbnQnLCB7XG4gICAgICAuLi5leHBlY3RlZFByb3BzLFxuICAgICAgQ29tcHV0ZVJlc291cmNlczoge1xuICAgICAgICAuLi5kZWZhdWx0Q29tcHV0ZVJlc291cmNlcyxcbiAgICAgICAgSW5zdGFuY2VUeXBlczogW1xuICAgICAgICAgICdyNCcsXG4gICAgICAgICAgJ29wdGltYWwnLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnaW5zdGFuY2UgdHlwZXMgYXJlIGNvcnJlY3RseSByZW5kZXJlZCcsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3QgY2UgPSBuZXcgQ29tcHV0ZUVudmlyb25tZW50KHN0YWNrLCAnTXlDRScsIHtcbiAgICAgIC4uLmRlZmF1bHRQcm9wcyxcbiAgICAgIHZwYyxcbiAgICAgIGluc3RhbmNlVHlwZXM6IFtlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLlI0LCBlYzIuSW5zdGFuY2VTaXplLkxBUkdFKV0sXG4gICAgfSk7XG5cbiAgICBjZS5hZGRJbnN0YW5jZUNsYXNzKGVjMi5JbnN0YW5jZUNsYXNzLk00KTtcbiAgICBjZS5hZGRJbnN0YW5jZVR5cGUoZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5DNCwgZWMyLkluc3RhbmNlU2l6ZS5MQVJHRSkpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkJhdGNoOjpDb21wdXRlRW52aXJvbm1lbnQnLCB7XG4gICAgICAuLi5leHBlY3RlZFByb3BzLFxuICAgICAgQ29tcHV0ZVJlc291cmNlczoge1xuICAgICAgICAuLi5kZWZhdWx0Q29tcHV0ZVJlc291cmNlcyxcbiAgICAgICAgSW5zdGFuY2VUeXBlczogW1xuICAgICAgICAgICdyNC5sYXJnZScsXG4gICAgICAgICAgJ2M0LmxhcmdlJyxcbiAgICAgICAgICAnbTQnLFxuICAgICAgICAgICdvcHRpbWFsJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Jlc3BlY3RzIHVzZU9wdGltYWxJbnN0YW5jZUNsYXNzZXM6IGZhbHNlJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgQ29tcHV0ZUVudmlyb25tZW50KHN0YWNrLCAnTXlDRScsIHtcbiAgICAgIC4uLmRlZmF1bHRQcm9wcyxcbiAgICAgIHZwYyxcbiAgICAgIHVzZU9wdGltYWxJbnN0YW5jZUNsYXNzZXM6IGZhbHNlLFxuICAgICAgaW5zdGFuY2VDbGFzc2VzOiBbZWMyLkluc3RhbmNlQ2xhc3MuUjRdLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkJhdGNoOjpDb21wdXRlRW52aXJvbm1lbnQnLCB7XG4gICAgICAuLi5leHBlY3RlZFByb3BzLFxuICAgICAgQ29tcHV0ZVJlc291cmNlczoge1xuICAgICAgICAuLi5kZWZhdWx0Q29tcHV0ZVJlc291cmNlcyxcbiAgICAgICAgSW5zdGFuY2VUeXBlczogW1xuICAgICAgICAgICdyNCcsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdkb2VzIG5vdCB0aHJvdyB3aXRoIHVzZU9wdGltYWxJbnN0YW5jZUNsYXNzZXM6IGZhbHNlIGFuZCBhIGNhbGwgdG8gYWRkSW5zdGFuY2VDbGFzcygpJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCBteUNFID0gbmV3IENvbXB1dGVFbnZpcm9ubWVudChzdGFjaywgJ015Q0UnLCB7XG4gICAgICAuLi5kZWZhdWx0UHJvcHMsXG4gICAgICB2cGMsXG4gICAgICB1c2VPcHRpbWFsSW5zdGFuY2VDbGFzc2VzOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIG15Q0UuYWRkSW5zdGFuY2VDbGFzcyhlYzIuSW5zdGFuY2VDbGFzcy5DNCk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QmF0Y2g6OkNvbXB1dGVFbnZpcm9ubWVudCcsIHtcbiAgICAgIC4uLmV4cGVjdGVkUHJvcHMsXG4gICAgICBDb21wdXRlUmVzb3VyY2VzOiB7XG4gICAgICAgIC4uLmRlZmF1bHRDb21wdXRlUmVzb3VyY2VzLFxuICAgICAgICBJbnN0YW5jZVR5cGVzOiBbXG4gICAgICAgICAgJ2M0JyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2RvZXMgbm90IHRocm93IHdpdGggdXNlT3B0aW1hbEluc3RhbmNlQ2xhc3NlczogZmFsc2UgYW5kIGEgY2FsbCB0byBhZGRJbnN0YW5jZVR5cGUoKScsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbXlDRSA9IG5ldyBDb21wdXRlRW52aXJvbm1lbnQoc3RhY2ssICdNeUNFJywge1xuICAgICAgLi4uZGVmYXVsdFByb3BzLFxuICAgICAgdnBjLFxuICAgICAgdXNlT3B0aW1hbEluc3RhbmNlQ2xhc3NlczogZmFsc2UsXG4gICAgfSk7XG5cbiAgICBteUNFLmFkZEluc3RhbmNlVHlwZShlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLkM0LCBlYzIuSW5zdGFuY2VTaXplLlhMQVJHRTExMikpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkJhdGNoOjpDb21wdXRlRW52aXJvbm1lbnQnLCB7XG4gICAgICAuLi5leHBlY3RlZFByb3BzLFxuICAgICAgQ29tcHV0ZVJlc291cmNlczoge1xuICAgICAgICAuLi5kZWZhdWx0Q29tcHV0ZVJlc291cmNlcyxcbiAgICAgICAgSW5zdGFuY2VUeXBlczogW1xuICAgICAgICAgICdjNC4xMTJ4bGFyZ2UnLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3JlYXRlcyBhbmQgdXNlcyBpbnN0YW5jZVByb2ZpbGUsIGV2ZW4gd2hlbiBpbnN0YW5jZVJvbGUgaXMgc3BlY2lmaWVkJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgQ29tcHV0ZUVudmlyb25tZW50KHN0YWNrLCAnTXlDRScsIHtcbiAgICAgIC4uLmRlZmF1bHRQcm9wcyxcbiAgICAgIHZwYyxcbiAgICAgIGluc3RhbmNlUm9sZTogbmV3IFJvbGUoc3RhY2ssICdteVJvbGUnLCB7XG4gICAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ2Zvby5hbWF6b25hd3MuY29tJywge1xuICAgICAgICAgIHJlZ2lvbjogJ2Jlcm11ZGEtdHJpYW5nbGUtMTMzNycsXG4gICAgICAgIH0pLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QmF0Y2g6OkNvbXB1dGVFbnZpcm9ubWVudCcsIHtcbiAgICAgIC4uLmV4cGVjdGVkUHJvcHMsXG4gICAgICBDb21wdXRlUmVzb3VyY2VzOiB7XG4gICAgICAgIC4uLmRlZmF1bHRDb21wdXRlUmVzb3VyY2VzLFxuICAgICAgICAvLyBpbnN0YW5jZVJvbGUgaXMgdW5jaGFuZ2VkIGZyb20gZGVmYXVsdFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06Okluc3RhbmNlUHJvZmlsZScsIHtcbiAgICAgIFJvbGVzOiBbeyBSZWY6ICdteVJvbGVFNjBENjhFOCcgfV0sXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpSb2xlJywge1xuICAgICAgQXNzdW1lUm9sZVBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW3tcbiAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgIFByaW5jaXBhbDogeyBTZXJ2aWNlOiAnZm9vLmFtYXpvbmF3cy5jb20nIH0sXG4gICAgICAgIH1dLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdyZXNwZWN0cyBsYXVuY2ggdGVtcGxhdGUnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBDb21wdXRlRW52aXJvbm1lbnQoc3RhY2ssICdNeUNFJywge1xuICAgICAgLi4uZGVmYXVsdFByb3BzLFxuICAgICAgdnBjLFxuICAgICAgbGF1bmNoVGVtcGxhdGU6IG5ldyBlYzIuTGF1bmNoVGVtcGxhdGUoc3RhY2ssICdsYXVuY2hUZW1wbGF0ZScpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkJhdGNoOjpDb21wdXRlRW52aXJvbm1lbnQnLCB7XG4gICAgICAuLi5leHBlY3RlZFByb3BzLFxuICAgICAgQ29tcHV0ZVJlc291cmNlczoge1xuICAgICAgICAuLi5kZWZhdWx0Q29tcHV0ZVJlc291cmNlcyxcbiAgICAgICAgTGF1bmNoVGVtcGxhdGU6IHtcbiAgICAgICAgICBMYXVuY2hUZW1wbGF0ZUlkOiB7IFJlZjogJ2xhdW5jaFRlbXBsYXRlREVFNTc0MkQnIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdyZXNwZWN0cyBuYW1lJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgQ29tcHV0ZUVudmlyb25tZW50KHN0YWNrLCAnTXlDRScsIHtcbiAgICAgIC4uLmRlZmF1bHRQcm9wcyxcbiAgICAgIHZwYyxcbiAgICAgIGNvbXB1dGVFbnZpcm9ubWVudE5hbWU6ICdOYW1lZENFJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpCYXRjaDo6Q29tcHV0ZUVudmlyb25tZW50Jywge1xuICAgICAgLi4uZXhwZWN0ZWRQcm9wcyxcbiAgICAgIENvbXB1dGVFbnZpcm9ubWVudE5hbWU6ICdOYW1lZENFJyxcbiAgICAgIENvbXB1dGVSZXNvdXJjZXM6IHtcbiAgICAgICAgLi4uZGVmYXVsdENvbXB1dGVSZXNvdXJjZXMsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdyZXNwZWN0cyBwbGFjZW1lbnQgZ3JvdXAnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBDb21wdXRlRW52aXJvbm1lbnQoc3RhY2ssICdNeUNFJywge1xuICAgICAgLi4uZGVmYXVsdFByb3BzLFxuICAgICAgdnBjLFxuICAgICAgcGxhY2VtZW50R3JvdXA6IG5ldyBlYzIuUGxhY2VtZW50R3JvdXAoc3RhY2ssICdteVBsYWNlbWVudEdyb3VwJyksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QmF0Y2g6OkNvbXB1dGVFbnZpcm9ubWVudCcsIHtcbiAgICAgIC4uLmV4cGVjdGVkUHJvcHMsXG4gICAgICBDb21wdXRlUmVzb3VyY2VzOiB7XG4gICAgICAgIC4uLmRlZmF1bHRDb21wdXRlUmVzb3VyY2VzLFxuICAgICAgICBQbGFjZW1lbnRHcm91cDoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogWydteVBsYWNlbWVudEdyb3VwMkU5NEQxNEUnLCAnR3JvdXBOYW1lJ10sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdyZXNwZWN0cyByZXBsYWNlQ29tcHV0ZUVudmlyb25tZW50JywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgQ29tcHV0ZUVudmlyb25tZW50KHN0YWNrLCAnTXlDRScsIHtcbiAgICAgIC4uLmRlZmF1bHRQcm9wcyxcbiAgICAgIHZwYyxcbiAgICAgIHJlcGxhY2VDb21wdXRlRW52aXJvbm1lbnQ6IHRydWUsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QmF0Y2g6OkNvbXB1dGVFbnZpcm9ubWVudCcsIHtcbiAgICAgIC4uLmV4cGVjdGVkUHJvcHMsXG4gICAgICBDb21wdXRlUmVzb3VyY2VzOiB7XG4gICAgICAgIC4uLmRlZmF1bHRDb21wdXRlUmVzb3VyY2VzLFxuICAgICAgfSxcbiAgICAgIFJlcGxhY2VDb21wdXRlRW52aXJvbm1lbnQ6IHRydWUsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Jlc3BlY3RzIHNlY3VyaXR5IGdyb3VwcycsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IENvbXB1dGVFbnZpcm9ubWVudChzdGFjaywgJ015Q0UnLCB7XG4gICAgICAuLi5kZWZhdWx0UHJvcHMsXG4gICAgICBzZWN1cml0eUdyb3VwczogW25ldyBlYzIuU2VjdXJpdHlHcm91cChzdGFjaywgJ1Rlc3RTRycsIHtcbiAgICAgICAgdnBjLFxuICAgICAgICBhbGxvd0FsbE91dGJvdW5kOiBmYWxzZSxcbiAgICAgIH0pXSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpCYXRjaDo6Q29tcHV0ZUVudmlyb25tZW50Jywge1xuICAgICAgLi4uZXhwZWN0ZWRQcm9wcyxcbiAgICAgIENvbXB1dGVSZXNvdXJjZXM6IHtcbiAgICAgICAgLi4uZGVmYXVsdENvbXB1dGVSZXNvdXJjZXMsXG4gICAgICAgIFNlY3VyaXR5R3JvdXBJZHM6IFt7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ1Rlc3RTRzU4MUQzMzkxJywgJ0dyb3VwSWQnXSxcbiAgICAgICAgfV0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdyZXNwZWN0cyBzZXJ2aWNlIHJvbGUnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBDb21wdXRlRW52aXJvbm1lbnQoc3RhY2ssICdNeUNFJywge1xuICAgICAgLi4uZGVmYXVsdFByb3BzLFxuICAgICAgc2VydmljZVJvbGU6IG5ldyBSb2xlKHN0YWNrLCAnVGVzdFNMUicsIHtcbiAgICAgICAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnY2RrLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkJhdGNoOjpDb21wdXRlRW52aXJvbm1lbnQnLCB7XG4gICAgICAuLi5leHBlY3RlZFByb3BzLFxuICAgICAgU2VydmljZVJvbGU6IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ1Rlc3RTTFIwNTk3NEMyMicsICdBcm4nXSxcbiAgICAgIH0sXG4gICAgICBDb21wdXRlUmVzb3VyY2VzOiB7XG4gICAgICAgIC4uLmRlZmF1bHRDb21wdXRlUmVzb3VyY2VzLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncmVzcGVjdHMgdnBjU3VibmV0cycsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IENvbXB1dGVFbnZpcm9ubWVudChzdGFjaywgJ015Q0UnLCB7XG4gICAgICAuLi5kZWZhdWx0UHJvcHMsXG4gICAgICB2cGNTdWJuZXRzOiB7XG4gICAgICAgIHN1Ym5ldHM6IFtuZXcgZWMyLlN1Ym5ldChzdGFjaywgJ3Rlc3RTdWJuZXQnLCB7XG4gICAgICAgICAgYXZhaWxhYmlsaXR5Wm9uZTogJ2F6LTMnLFxuICAgICAgICAgIGNpZHJCbG9jazogJzEwLjAuMC4wLzMyJyxcbiAgICAgICAgICB2cGNJZDogbmV3IGVjMi5WcGMoc3RhY2ssICdzdWJuZXRWcGMnKS52cGNJZCxcbiAgICAgICAgfSldLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpCYXRjaDo6Q29tcHV0ZUVudmlyb25tZW50Jywge1xuICAgICAgLi4uZXhwZWN0ZWRQcm9wcyxcbiAgICAgIENvbXB1dGVSZXNvdXJjZXM6IHtcbiAgICAgICAgLi4uZGVmYXVsdENvbXB1dGVSZXNvdXJjZXMsXG4gICAgICAgIFN1Ym5ldHM6IFtcbiAgICAgICAgICB7IFJlZjogJ3Rlc3RTdWJuZXQ0MkYwRkEwQycgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Jlc3BlY3RzIHVwZGF0ZVRpbWVvdXQnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBDb21wdXRlRW52aXJvbm1lbnQoc3RhY2ssICdNeUNFJywge1xuICAgICAgLi4uZGVmYXVsdFByb3BzLFxuICAgICAgdXBkYXRlVGltZW91dDogRHVyYXRpb24ubWludXRlcygxKSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpCYXRjaDo6Q29tcHV0ZUVudmlyb25tZW50Jywge1xuICAgICAgLi4uZXhwZWN0ZWRQcm9wcyxcbiAgICAgIENvbXB1dGVSZXNvdXJjZXM6IHtcbiAgICAgICAgLi4uZGVmYXVsdENvbXB1dGVSZXNvdXJjZXMsXG4gICAgICB9LFxuICAgICAgVXBkYXRlUG9saWN5OiB7XG4gICAgICAgIEpvYkV4ZWN1dGlvblRpbWVvdXRNaW51dGVzOiAxLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncmVzcGVjdHMgdGVybWluYXRlT25VcGRhdGUnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBDb21wdXRlRW52aXJvbm1lbnQoc3RhY2ssICdNeUNFJywge1xuICAgICAgLi4uZGVmYXVsdFByb3BzLFxuICAgICAgdGVybWluYXRlT25VcGRhdGU6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkJhdGNoOjpDb21wdXRlRW52aXJvbm1lbnQnLCB7XG4gICAgICAuLi5leHBlY3RlZFByb3BzLFxuICAgICAgQ29tcHV0ZVJlc291cmNlczoge1xuICAgICAgICAuLi5kZWZhdWx0Q29tcHV0ZVJlc291cmNlcyxcbiAgICAgIH0sXG4gICAgICBVcGRhdGVQb2xpY3k6IHtcbiAgICAgICAgVGVybWluYXRlSm9ic09uVXBkYXRlOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Jlc3BlY3RzIHVwZGF0ZVRvTGF0ZXN0SW1hZ2VWZXJzaW9uJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgQ29tcHV0ZUVudmlyb25tZW50KHN0YWNrLCAnTXlDRScsIHtcbiAgICAgIC4uLmRlZmF1bHRQcm9wcyxcbiAgICAgIHVwZGF0ZVRvTGF0ZXN0SW1hZ2VWZXJzaW9uOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpCYXRjaDo6Q29tcHV0ZUVudmlyb25tZW50Jywge1xuICAgICAgLi4uZXhwZWN0ZWRQcm9wcyxcbiAgICAgIENvbXB1dGVSZXNvdXJjZXM6IHtcbiAgICAgICAgLi4uZGVmYXVsdENvbXB1dGVSZXNvdXJjZXMsXG4gICAgICAgIFVwZGF0ZVRvTGF0ZXN0SW1hZ2VWZXJzaW9uOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Jlc3BlY3RzIHRhZ3MnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNlID0gbmV3IENvbXB1dGVFbnZpcm9ubWVudChzdGFjaywgJ015Q0UnLCB7XG4gICAgICAuLi5kZWZhdWx0UHJvcHMsXG4gICAgfSk7XG5cbiAgICBUYWdzLm9mKGNlKS5hZGQoJ3N1cGVyZm9vZCcsICdhY2FpJyk7XG4gICAgVGFncy5vZihjZSkuYWRkKCdzdXBlcicsICdzYWxhbWFuZGVyJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QmF0Y2g6OkNvbXB1dGVFbnZpcm9ubWVudCcsIHtcbiAgICAgIC4uLmV4cGVjdGVkUHJvcHMsXG4gICAgICBDb21wdXRlUmVzb3VyY2VzOiB7XG4gICAgICAgIC4uLmRlZmF1bHRDb21wdXRlUmVzb3VyY2VzLFxuICAgICAgICBUYWdzOiB7XG4gICAgICAgICAgc3VwZXJmb29kOiAnYWNhaScsXG4gICAgICAgICAgc3VwZXI6ICdzYWxhbWFuZGVyJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBiZSBpbXBvcnRlZCBmcm9tIGFybicsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3QgY2UgPSBNYW5hZ2VkRWMyRWNzQ29tcHV0ZUVudmlyb25tZW50LmZyb21NYW5hZ2VkRWMyRWNzQ29tcHV0ZUVudmlyb25tZW50QXJuKHN0YWNrLCAnaW1wb3J0JywgJ2Fybjphd3M6YmF0Y2g6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjpjb21wdXRlLWVudmlyb25tZW50L2NlLW5hbWUnKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoY2UuY29tcHV0ZUVudmlyb25tZW50QXJuKS50b0VxdWFsKCdhcm46YXdzOmJhdGNoOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6Y29tcHV0ZS1lbnZpcm9ubWVudC9jZS1uYW1lJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2F0dGFjaCBuZWNlc3NhcnkgbWFuYWdlZCBwb2xpY3kgdG8gaW5zdGFuY2Ugcm9sZScsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IENvbXB1dGVFbnZpcm9ubWVudChzdGFjaywgJ015Q0UnLCB7XG4gICAgICAuLi5kZWZhdWx0UHJvcHMsXG4gICAgICB2cGMsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpSb2xlJywge1xuICAgICAgTWFuYWdlZFBvbGljeUFybnM6IFtcbiAgICAgICAge1xuICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICc6aWFtOjphd3M6cG9saWN5L3NlcnZpY2Utcm9sZS9BbWF6b25FQzJDb250YWluZXJTZXJ2aWNlZm9yRUMyUm9sZScsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3Mgd2hlbiBubyBpbnN0YW5jZSB0eXBlcyBhcmUgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgbmV3IENvbXB1dGVFbnZpcm9ubWVudChzdGFjaywgJ015Q0UnLCB7XG4gICAgICAuLi5kZWZhdWx0UHJvcHMsXG4gICAgICB1c2VPcHRpbWFsSW5zdGFuY2VDbGFzc2VzOiBmYWxzZSxcbiAgICAgIHZwYyxcbiAgICB9KTtcblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgIH0pLnRvVGhyb3coL1NwZWNpZmllcyAndXNlT3B0aW1hbEluc3RhbmNlQ2xhc3NlczogZmFsc2UnIHdpdGhvdXQgc3BlY2lmeWluZyBhbnkgaW5zdGFuY2UgdHlwZXMgb3IgY2xhc3Nlcy8pO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3MgZXJyb3Igd2hlbiBBbGxvY2F0aW9uU3RyYXRlZ3kuU1BPVF9DQVBBQ0lUWV9PUFRJTUlaRUQgaXMgdXNlZCB3aXRob3V0IHNwZWNmaXlpbmcgc3BvdCcsICgpID0+IHtcbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBDb21wdXRlRW52aXJvbm1lbnQoc3RhY2ssICdNeUNFJywge1xuICAgICAgICAuLi5kZWZhdWx0UHJvcHMsXG4gICAgICAgIHZwYyxcbiAgICAgICAgYWxsb2NhdGlvblN0cmF0ZWd5OiBBbGxvY2F0aW9uU3RyYXRlZ3kuU1BPVF9DQVBBQ0lUWV9PUFRJTUlaRUQsXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC9NYW5hZ2VkIENvbXB1dGVFbnZpcm9ubWVudCAnTXlDRScgc3BlY2lmaWVzICdBbGxvY2F0aW9uU3RyYXRlZ3kuU1BPVF9DQVBBQ0lUWV9PUFRJTUlaRUQnIHdpdGhvdXQgdXNpbmcgc3BvdCBpbnN0YW5jZXMvKTtcbiAgfSk7XG5cbiAgdGVzdCgndGhyb3dzIGVycm9yIHdoZW4gQWxsb2NhdGlvblN0cmF0ZWd5LlNQT1RfUFJJQ0VfQ0FQQUNJVFlfT1BUSU1JWkVEIGlzIHVzZWQgd2l0aG91dCBzcGVjZml5aW5nIHNwb3QnLCAoKSA9PiB7XG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgQ29tcHV0ZUVudmlyb25tZW50KHN0YWNrLCAnTXlDRScsIHtcbiAgICAgICAgLi4uZGVmYXVsdFByb3BzLFxuICAgICAgICB2cGMsXG4gICAgICAgIGFsbG9jYXRpb25TdHJhdGVneTogQWxsb2NhdGlvblN0cmF0ZWd5LlNQT1RfUFJJQ0VfQ0FQQUNJVFlfT1BUSU1JWkVELFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdygvTWFuYWdlZCBDb21wdXRlRW52aXJvbm1lbnQgJ015Q0UnIHNwZWNpZmllcyAnQWxsb2NhdGlvblN0cmF0ZWd5LlNQT1RfUFJJQ0VfQ0FQQUNJVFlfT1BUSU1JWkVEJyB3aXRob3V0IHVzaW5nIHNwb3QgaW5zdGFuY2VzLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyBlcnJvciB3aGVuIHNwb3RCaWRQZXJjZW50YWdlIGlzIHNwZWNpZmllZCB3aXRob3V0IHNwb3QnLCAoKSA9PiB7XG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgQ29tcHV0ZUVudmlyb25tZW50KHN0YWNrLCAnTXlDRScsIHtcbiAgICAgICAgLi4uZGVmYXVsdFByb3BzLFxuICAgICAgICB2cGMsXG4gICAgICAgIHNwb3RCaWRQZXJjZW50YWdlOiA4MCxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL01hbmFnZWQgQ29tcHV0ZUVudmlyb25tZW50ICdNeUNFJyBzcGVjaWZpZXMgJ3Nwb3RCaWRQZXJjZW50YWdlJyB3aXRob3V0IHNwZWNpZnlpbmcgJ3Nwb3QnLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyBlcnJvciB3aGVuIHNwb3RCaWRQZXJjZW50YWdlIGlzIHNwZWNpZmllZCBhbmQgc3BvdCBpcyBmYWxzZScsICgpID0+IHtcbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBDb21wdXRlRW52aXJvbm1lbnQoc3RhY2ssICdNeUNFJywge1xuICAgICAgICAuLi5kZWZhdWx0UHJvcHMsXG4gICAgICAgIHZwYyxcbiAgICAgICAgc3BvdEJpZFBlcmNlbnRhZ2U6IDgwLFxuICAgICAgICBzcG90OiBmYWxzZSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL01hbmFnZWQgQ29tcHV0ZUVudmlyb25tZW50ICdNeUNFJyBzcGVjaWZpZXMgJ3Nwb3RCaWRQZXJjZW50YWdlJyB3aXRob3V0IHNwZWNpZnlpbmcgJ3Nwb3QnLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyBlcnJvciB3aGVuIHNwb3RCaWRQZXJjZW50YWdlID4gMTAwJywgKCkgPT4ge1xuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IENvbXB1dGVFbnZpcm9ubWVudChzdGFjaywgJ015Q0UnLCB7XG4gICAgICAgIC4uLmRlZmF1bHRQcm9wcyxcbiAgICAgICAgdnBjLFxuICAgICAgICBzcG90QmlkUGVyY2VudGFnZTogMTIwLFxuICAgICAgICBzcG90OiB0cnVlLFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdygvTWFuYWdlZCBDb21wdXRlRW52aXJvbm1lbnQgJ015Q0UnIHNwZWNpZmllcyAnc3BvdEJpZFBlcmNlbnRhZ2UnID4gMTAwLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyBlcnJvciB3aGVuIHNwb3RCaWRQZXJjZW50YWdlIDwgMCcsICgpID0+IHtcbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBDb21wdXRlRW52aXJvbm1lbnQoc3RhY2ssICdNeUNFJywge1xuICAgICAgICAuLi5kZWZhdWx0UHJvcHMsXG4gICAgICAgIHZwYyxcbiAgICAgICAgc3BvdEJpZFBlcmNlbnRhZ2U6IC0xMjAsXG4gICAgICAgIHNwb3Q6IHRydWUsXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC9NYW5hZ2VkIENvbXB1dGVFbnZpcm9ubWVudCAnTXlDRScgc3BlY2lmaWVzICdzcG90QmlkUGVyY2VudGFnZScgPCAwLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyBlcnJvciB3aGVuIG1pbnZDcHVzID4gbWF4dkNwdXMnLCAoKSA9PiB7XG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgQ29tcHV0ZUVudmlyb25tZW50KHN0YWNrLCAnTXlDRScsIHtcbiAgICAgICAgLi4uZGVmYXVsdFByb3BzLFxuICAgICAgICB2cGMsXG4gICAgICAgIG1heHZDcHVzOiA1MTIsXG4gICAgICAgIG1pbnZDcHVzOiAxMDI0LFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdygvTWFuYWdlZCBDb21wdXRlRW52aXJvbm1lbnQgJ015Q0UnIGhhcyAnbWludkNwdXMnID0gMTAyNCA+ICdtYXh2Q3B1cycgPSA1MTI7ICdtaW52Q3B1cycgY2Fubm90IGJlIGdyZWF0ZXIgdGhhbiAnbWF4dkNwdXMnLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyBlcnJvciB3aGVuIG1pbnZDcHVzIDwgMCcsICgpID0+IHtcbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBDb21wdXRlRW52aXJvbm1lbnQoc3RhY2ssICdNeUNFJywge1xuICAgICAgICAuLi5kZWZhdWx0UHJvcHMsXG4gICAgICAgIHZwYyxcbiAgICAgICAgbWludkNwdXM6IC0yNTYsXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93RXJyb3IoL01hbmFnZWQgQ29tcHV0ZUVudmlyb25tZW50ICdNeUNFJyBoYXMgJ21pbnZDcHVzJyA9IC0yNTYgPCAwOyAnbWludkNwdXMnIGNhbm5vdCBiZSBsZXNzIHRoYW4gemVyby8pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnTWFuYWdlZEVjMkVjc0NvbXB1dGVFbnZpcm9ubWVudCcsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ3ZwYycpO1xuXG4gICAgcGFzY2FsQ2FzZUV4cGVjdGVkRWNzUHJvcHMgPSBjYXBpdGFsaXplUHJvcGVydHlOYW1lcyhzdGFjaywgZGVmYXVsdEV4cGVjdGVkRWNzUHJvcHMpO1xuICAgIHBhc2NhbENhc2VFeHBlY3RlZEVrc1Byb3BzID0gY2FwaXRhbGl6ZVByb3BlcnR5TmFtZXMoc3RhY2ssIGRlZmF1bHRFeHBlY3RlZEVrc1Byb3BzKTtcbiAgICBkZWZhdWx0Q29tcHV0ZVJlc291cmNlcyA9IHBhc2NhbENhc2VFeHBlY3RlZEVjc1Byb3BzLkNvbXB1dGVSZXNvdXJjZXM7XG5cbiAgICBkZWZhdWx0RWNzUHJvcHMgPSB7XG4gICAgICB2cGMsXG4gICAgfTtcbiAgICBkZWZhdWx0RWtzUHJvcHMgPSB7XG4gICAgICB2cGMsXG4gICAgICBrdWJlcm5ldGVzTmFtZXNwYWNlOiAnY2RrLXRlc3QtbmFtZXNwYWNlJyxcbiAgICAgIGVrc0NsdXN0ZXI6IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ2Vrc1Rlc3RDbHVzdGVyJywge1xuICAgICAgICB2ZXJzaW9uOiBla3MuS3ViZXJuZXRlc1ZlcnNpb24uVjFfMjQsXG4gICAgICB9KSxcbiAgICB9O1xuICB9KTtcblxuICB0ZXN0KCdyZXNwZWN0cyBzcG90RmxlZXRSb2xlJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgTWFuYWdlZEVjMkVjc0NvbXB1dGVFbnZpcm9ubWVudChzdGFjaywgJ015Q0UnLCB7XG4gICAgICAuLi5kZWZhdWx0RWNzUHJvcHMsXG4gICAgICBzcG90OiB0cnVlLFxuICAgICAgc3BvdEZsZWV0Um9sZTogbmV3IFJvbGUoc3RhY2ssICdTcG90RmxlZXRSb2xlJywge1xuICAgICAgICBhc3N1bWVkQnk6IG5ldyBBcm5QcmluY2lwYWwoJ2Fybjphd3M6aWFtOjEyMzQ1Njc4OTAxMjptYWdpY3VzZXIvZm9vYmFyJyksXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpCYXRjaDo6Q29tcHV0ZUVudmlyb25tZW50Jywge1xuICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkRWNzUHJvcHMsXG4gICAgICBDb21wdXRlUmVzb3VyY2VzOiB7XG4gICAgICAgIC4uLmRlZmF1bHRDb21wdXRlUmVzb3VyY2VzLFxuICAgICAgICBBbGxvY2F0aW9uU3RyYXRlZ3k6IEFsbG9jYXRpb25TdHJhdGVneS5TUE9UX1BSSUNFX0NBUEFDSVRZX09QVElNSVpFRCxcbiAgICAgICAgVHlwZTogJ1NQT1QnLFxuICAgICAgICBTcG90SWFtRmxlZXRSb2xlOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ1Nwb3RGbGVldFJvbGU2RDRGNzU1OCcsICdBcm4nXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ltYWdlIHR5cGVzIGFyZSBjb3JyZWN0bHkgcmVuZGVyZWQgYXMgRUMyQ29uZmlndXJhdGlvbk9iamVjdHMnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBNYW5hZ2VkRWMyRWNzQ29tcHV0ZUVudmlyb25tZW50KHN0YWNrLCAnTXlDRScsIHtcbiAgICAgIC4uLmRlZmF1bHRFY3NQcm9wcyxcbiAgICAgIHZwYyxcbiAgICAgIGltYWdlczogW1xuICAgICAgICB7XG4gICAgICAgICAgaW1hZ2VUeXBlOiBiYXRjaC5FY3NNYWNoaW5lSW1hZ2VUeXBlLkVDU19BTDJfTlZJRElBLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpCYXRjaDo6Q29tcHV0ZUVudmlyb25tZW50Jywge1xuICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkRWNzUHJvcHMsXG4gICAgICBDb21wdXRlUmVzb3VyY2VzOiB7XG4gICAgICAgIC4uLmRlZmF1bHRDb21wdXRlUmVzb3VyY2VzLFxuICAgICAgICBFYzJDb25maWd1cmF0aW9uOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgSW1hZ2VUeXBlOiAnRUNTX0FMMl9OVklESUEnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gdXNlIG5vbi1kZWZhdWx0IGFsbG9jYXRpb24gc3RyYXRlZ3knLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBNYW5hZ2VkRWMyRWNzQ29tcHV0ZUVudmlyb25tZW50KHN0YWNrLCAnTXlDRScsIHtcbiAgICAgIC4uLmRlZmF1bHRQcm9wcyxcbiAgICAgIHZwYyxcbiAgICAgIGFsbG9jYXRpb25TdHJhdGVneTogQWxsb2NhdGlvblN0cmF0ZWd5LkJFU1RfRklULFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkJhdGNoOjpDb21wdXRlRW52aXJvbm1lbnQnLCB7XG4gICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRFY3NQcm9wcyxcbiAgICAgIENvbXB1dGVSZXNvdXJjZXM6IHtcbiAgICAgICAgLi4uZGVmYXVsdENvbXB1dGVSZXNvdXJjZXMsXG4gICAgICAgIEFsbG9jYXRpb25TdHJhdGVneTogJ0JFU1RfRklUJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Nwb3QgYW5kIEFsbG9jYXRpb25TdHJhdGVneS5CRVNUX0ZJVCA9PiBhIGRlZmF1bHQgc3BvdCBmbGVldCByb2xlIGlzIGNyZWF0ZWQnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBNYW5hZ2VkRWMyRWNzQ29tcHV0ZUVudmlyb25tZW50KHN0YWNrLCAnTXlDRScsIHtcbiAgICAgIC4uLmRlZmF1bHRQcm9wcyxcbiAgICAgIHZwYyxcbiAgICAgIHNwb3Q6IHRydWUsXG4gICAgICBhbGxvY2F0aW9uU3RyYXRlZ3k6IEFsbG9jYXRpb25TdHJhdGVneS5CRVNUX0ZJVCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpCYXRjaDo6Q29tcHV0ZUVudmlyb25tZW50Jywge1xuICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkRWNzUHJvcHMsXG4gICAgICBDb21wdXRlUmVzb3VyY2VzOiB7XG4gICAgICAgIC4uLmRlZmF1bHRDb21wdXRlUmVzb3VyY2VzLFxuICAgICAgICBUeXBlOiAnU1BPVCcsXG4gICAgICAgIEFsbG9jYXRpb25TdHJhdGVneTogJ0JFU1RfRklUJyxcbiAgICAgICAgU3BvdElhbUZsZWV0Um9sZTogeyAnRm46OkdldEF0dCc6IFsnTXlDRVNwb3RGbGVldFJvbGU3MEJFMzBBMCcsICdBcm4nXSB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgndGhyb3dzIHdoZW4gc3BvdEZsZWV0Um9sZSBpcyBzcGVjaWZpZWQgd2l0aG91dCBzcG90JywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IE1hbmFnZWRFYzJFY3NDb21wdXRlRW52aXJvbm1lbnQoc3RhY2ssICdNeUNFJywge1xuICAgICAgICAuLi5kZWZhdWx0RWNzUHJvcHMsXG4gICAgICAgIHNwb3RGbGVldFJvbGU6IG5ldyBSb2xlKHN0YWNrLCAnU3BvdEZsZWV0Um9sZScsIHtcbiAgICAgICAgICBhc3N1bWVkQnk6IG5ldyBBcm5QcmluY2lwYWwoJ2Fybjphd3M6aWFtOjEyMzQ1Njc4OTAxMjptYWdpY3VzZXIvZm9vYmFyJyksXG4gICAgICAgIH0pLFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdygvTWFuYWdlZCBDb21wdXRlRW52aXJvbm1lbnQgJ015Q0UnIHNwZWNpZmllcyAnc3BvdEZsZWV0Um9sZScgd2l0aG91dCBzcGVjaWZ5aW5nICdzcG90Jy8pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnTWFuYWdlZEVjMkVrc0NvbXB1dGVFbnZpcm9ubWVudCcsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ3ZwYycpO1xuXG4gICAgcGFzY2FsQ2FzZUV4cGVjdGVkRWNzUHJvcHMgPSBjYXBpdGFsaXplUHJvcGVydHlOYW1lcyhzdGFjaywgZGVmYXVsdEV4cGVjdGVkRWNzUHJvcHMpO1xuICAgIHBhc2NhbENhc2VFeHBlY3RlZEVrc1Byb3BzID0gY2FwaXRhbGl6ZVByb3BlcnR5TmFtZXMoc3RhY2ssIGRlZmF1bHRFeHBlY3RlZEVrc1Byb3BzKTtcbiAgICBkZWZhdWx0Q29tcHV0ZVJlc291cmNlcyA9IHBhc2NhbENhc2VFeHBlY3RlZEVjc1Byb3BzLkNvbXB1dGVSZXNvdXJjZXM7XG5cbiAgICBkZWZhdWx0RWNzUHJvcHMgPSB7XG4gICAgICB2cGMsXG4gICAgfTtcbiAgICBkZWZhdWx0RWtzUHJvcHMgPSB7XG4gICAgICB2cGMsXG4gICAgICBrdWJlcm5ldGVzTmFtZXNwYWNlOiAnY2RrLXRlc3QtbmFtZXNwYWNlJyxcbiAgICAgIGVrc0NsdXN0ZXI6IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ2Vrc1Rlc3RDbHVzdGVyJywge1xuICAgICAgICB2ZXJzaW9uOiBla3MuS3ViZXJuZXRlc1ZlcnNpb24uVjFfMjQsXG4gICAgICB9KSxcbiAgICB9O1xuICB9KTtcblxuICB0ZXN0KCdkZWZhdWx0IHByb3BzJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgTWFuYWdlZEVjMkVrc0NvbXB1dGVFbnZpcm9ubWVudChzdGFjaywgJ015Q0UnLCB7XG4gICAgICAuLi5kZWZhdWx0RWtzUHJvcHMsXG4gICAgICB2cGMsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QmF0Y2g6OkNvbXB1dGVFbnZpcm9ubWVudCcsIHtcbiAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZEVrc1Byb3BzLFxuICAgICAgQ29tcHV0ZVJlc291cmNlczoge1xuICAgICAgICAuLi5kZWZhdWx0Q29tcHV0ZVJlc291cmNlcyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyBlcnJvciB3aGVuIEFsbG9jYXRpb25TdHJhdGVneS5CRVNUX0ZJVCBpcyB1c2VkJywgKCkgPT4ge1xuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IE1hbmFnZWRFYzJFa3NDb21wdXRlRW52aXJvbm1lbnQoc3RhY2ssICdNeUNFJywge1xuICAgICAgICAuLi5kZWZhdWx0UHJvcHMsXG4gICAgICAgIGFsbG9jYXRpb25TdHJhdGVneTogQWxsb2NhdGlvblN0cmF0ZWd5LkJFU1RfRklULFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdygvTWFuYWdlZEVjMkVrc0NvbXB1dGVFbnZpcm9ubWVudCAnTXlDRScgdXNlcyBpbnZhbGlkIGFsbG9jYXRpb24gc3RyYXRlZ3kgJ0FsbG9jYXRpb25TdHJhdGVneS5CRVNUX0ZJVCcvKTtcbiAgfSk7XG5cbiAgdGVzdCgnaW1hZ2UgdHlwZXMgYXJlIGNvcnJlY3RseSByZW5kZXJlZCBhcyBFQzJDb25maWd1cmF0aW9uT2JqZWN0cycsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IE1hbmFnZWRFYzJFa3NDb21wdXRlRW52aXJvbm1lbnQoc3RhY2ssICdNeUNFJywge1xuICAgICAgLi4uZGVmYXVsdEVrc1Byb3BzLFxuICAgICAgdnBjLFxuICAgICAgaW1hZ2VzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBpbWFnZVR5cGU6IGJhdGNoLkVrc01hY2hpbmVJbWFnZVR5cGUuRUtTX0FMMl9OVklESUEsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkJhdGNoOjpDb21wdXRlRW52aXJvbm1lbnQnLCB7XG4gICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRFa3NQcm9wcyxcbiAgICAgIENvbXB1dGVSZXNvdXJjZXM6IHtcbiAgICAgICAgLi4uZGVmYXVsdENvbXB1dGVSZXNvdXJjZXMsXG4gICAgICAgIEVjMkNvbmZpZ3VyYXRpb246IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBJbWFnZVR5cGU6ICdFS1NfQUwyX05WSURJQScsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdGYXJnYXRlQ29tcHV0ZUVudmlyb25tZW50JywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAndnBjJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Jlc3BlY3RzIG5hbWUnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBGYXJnYXRlQ29tcHV0ZUVudmlyb25tZW50KHN0YWNrLCAnbWF4aW1hbFByb3BzRmFyZ2F0ZScsIHtcbiAgICAgIHZwYyxcbiAgICAgIG1heHZDcHVzOiA1MTIsXG4gICAgICBjb21wdXRlRW52aXJvbm1lbnROYW1lOiAnbWF4UHJvcHNGYXJnYXRlQ0UnLFxuICAgICAgcmVwbGFjZUNvbXB1dGVFbnZpcm9ubWVudDogdHJ1ZSxcbiAgICAgIHNwb3Q6IHRydWUsXG4gICAgICB0ZXJtaW5hdGVPblVwZGF0ZTogdHJ1ZSxcbiAgICAgIHVwZGF0ZVRpbWVvdXQ6IER1cmF0aW9uLm1pbnV0ZXMoMzApLFxuICAgICAgdXBkYXRlVG9MYXRlc3RJbWFnZVZlcnNpb246IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkJhdGNoOjpDb21wdXRlRW52aXJvbm1lbnQnLCB7XG4gICAgICBDb21wdXRlRW52aXJvbm1lbnROYW1lOiAnbWF4UHJvcHNGYXJnYXRlQ0UnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gYmUgaW1wb3J0ZWQgZnJvbSBhcm4nLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNlID0gRmFyZ2F0ZUNvbXB1dGVFbnZpcm9ubWVudC5mcm9tRmFyZ2F0ZUNvbXB1dGVFbnZpcm9ubWVudEFybihzdGFjaywgJ2ltcG9ydCcsICdhcm46YXdzOmJhdGNoOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6Y29tcHV0ZS1lbnZpcm9ubWVudC9jZS1uYW1lJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KGNlLmNvbXB1dGVFbnZpcm9ubWVudEFybikudG9FcXVhbCgnYXJuOmF3czpiYXRjaDp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmNvbXB1dGUtZW52aXJvbm1lbnQvY2UtbmFtZScpO1xuICB9KTtcbn0pO1xuIl19