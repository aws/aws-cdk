import { capitalizePropertyNames } from './utils';
import { Template } from '../../assertions';
import * as ec2 from '../../aws-ec2';
import * as eks from '../../aws-eks';
import { ArnPrincipal, Role, ServicePrincipal } from '../../aws-iam';
import { Stack, Duration, Tags } from '../../core';
import { AllocationStrategy, CfnComputeEnvironmentProps, ManagedEc2EcsComputeEnvironment, ManagedEc2EcsComputeEnvironmentProps, ManagedEc2EksComputeEnvironment, ManagedEc2EksComputeEnvironmentProps, FargateComputeEnvironment, EcsMachineImageType, EksMachineImageType } from '../lib';

const defaultExpectedEcsProps: CfnComputeEnvironmentProps = {
  type: 'managed',
  computeEnvironmentName: undefined,
  serviceRole: undefined,
  state: 'ENABLED',
  eksConfiguration: undefined,
  computeResources: {
    allocationStrategy: AllocationStrategy.BEST_FIT_PROGRESSIVE,
    bidPercentage: undefined,
    desiredvCpus: undefined,
    maxvCpus: 256,
    type: 'EC2',
    ec2Configuration: undefined,
    minvCpus: 0,
    subnets: [
      { Ref: 'vpcPrivateSubnet1Subnet934893E8' } as any,
      { Ref: 'vpcPrivateSubnet2Subnet7031C2BA' } as any,
    ],
    ec2KeyPair: undefined,
    imageId: undefined,
    instanceRole: { 'Fn::GetAtt': ['MyCEInstanceProfile6D69963F', 'Arn'] } as any,
    instanceTypes: ['optimal'],
    launchTemplate: undefined,
    placementGroup: undefined,
    securityGroupIds: [{
      'Fn::GetAtt': ['MyCESecurityGroup81DCAA06', 'GroupId'],
    }] as any,
    spotIamFleetRole: undefined,
    updateToLatestImageVersion: undefined,
  },
  replaceComputeEnvironment: false,
};

const defaultExpectedEksProps: CfnComputeEnvironmentProps = {
  ...defaultExpectedEcsProps,
  eksConfiguration: {
    eksClusterArn: {
      'Fn::GetAtt': ['eksTestCluster1B416C0E', 'Arn'],
    } as any,
    kubernetesNamespace: 'cdk-test-namespace',
  },
};

let stack: Stack;
let vpc: ec2.Vpc;

let pascalCaseExpectedEcsProps: any;
let pascalCaseExpectedEksProps: any;
let defaultComputeResources: any;

let defaultEcsProps: ManagedEc2EcsComputeEnvironmentProps;
let defaultEksProps: ManagedEc2EksComputeEnvironmentProps;

let expectedProps: any;
let defaultProps: any;

describe.each([ManagedEc2EcsComputeEnvironment, ManagedEc2EksComputeEnvironment])('%p type ComputeEnvironment', (ComputeEnvironment) => {
  beforeEach(() => {
    stack = new Stack();
    vpc = new ec2.Vpc(stack, 'vpc');

    pascalCaseExpectedEcsProps = capitalizePropertyNames(stack, defaultExpectedEcsProps);
    pascalCaseExpectedEksProps = capitalizePropertyNames(stack, defaultExpectedEksProps);
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
    expectedProps = ComputeEnvironment === ManagedEc2EcsComputeEnvironment
      ? pascalCaseExpectedEcsProps
      : pascalCaseExpectedEksProps;
    defaultProps = ComputeEnvironment === ManagedEc2EcsComputeEnvironment
      ? defaultEcsProps as ManagedEc2EcsComputeEnvironmentProps
      : defaultEksProps as ManagedEc2EksComputeEnvironmentProps;
  });

  test('default props', () => {
    // WHEN
    new ComputeEnvironment(stack, 'MyCE', {
      ...defaultProps,
      vpc,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
      ...expectedProps,
    });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::InstanceProfile', {
      Roles: [{ Ref: 'MyCEInstanceProfileRole895D248D' }],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
      ...expectedProps,
      ComputeResources: {
        ...defaultComputeResources,
        Type: 'SPOT',
        AllocationStrategy: 'SPOT_PRICE_CAPACITY_OPTIMIZED',
      },
    });
  });

  test('images are correctly rendered as EC2ConfigurationObjects', () => {
    const expectedImageType = ComputeEnvironment === ManagedEc2EcsComputeEnvironment
      ? EcsMachineImageType.ECS_AL2
      : EksMachineImageType.EKS_AL2;

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
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
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
      instanceRole: new Role(stack, 'myRole', {
        assumedBy: new ServicePrincipal('foo.amazonaws.com', {
          region: 'bermuda-triangle-1337',
        }),
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
      ...expectedProps,
      ComputeResources: {
        ...defaultComputeResources,
        // instanceRole is unchanged from default
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::InstanceProfile', {
      Roles: [{ Ref: 'myRoleE60D68E8' }],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
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
      serviceRole: new Role(stack, 'TestSLR', {
        assumedBy: new ServicePrincipal('cdk.amazonaws.com'),
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
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
      updateTimeout: Duration.minutes(1),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
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

    Tags.of(ce).add('superfood', 'acai');
    Tags.of(ce).add('super', 'salamander');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
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
    const ce = ManagedEc2EcsComputeEnvironment.fromManagedEc2EcsComputeEnvironmentArn(stack, 'import', 'arn:aws:batch:us-east-1:123456789012:compute-environment/ce-name');

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
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
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
      Template.fromStack(stack);
    }).toThrow(/Specifies 'useOptimalInstanceClasses: false' without specifying any instance types or classes/);
  });

  test('throws error when AllocationStrategy.SPOT_CAPACITY_OPTIMIZED is used without specfiying spot', () => {
    // THEN
    expect(() => {
      new ComputeEnvironment(stack, 'MyCE', {
        ...defaultProps,
        vpc,
        allocationStrategy: AllocationStrategy.SPOT_CAPACITY_OPTIMIZED,
      });
    }).toThrow(/Managed ComputeEnvironment 'MyCE' specifies 'AllocationStrategy.SPOT_CAPACITY_OPTIMIZED' without using spot instances/);
  });

  test('throws error when AllocationStrategy.SPOT_PRICE_CAPACITY_OPTIMIZED is used without specfiying spot', () => {
    // THEN
    expect(() => {
      new ComputeEnvironment(stack, 'MyCE', {
        ...defaultProps,
        vpc,
        allocationStrategy: AllocationStrategy.SPOT_PRICE_CAPACITY_OPTIMIZED,
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
    }).toThrow(/Managed ComputeEnvironment 'MyCE' has 'minvCpus' = -256 < 0; 'minvCpus' cannot be less than zero/);
  });
});

describe('ManagedEc2EcsComputeEnvironment', () => {
  beforeEach(() => {
    stack = new Stack();
    vpc = new ec2.Vpc(stack, 'vpc');

    pascalCaseExpectedEcsProps = capitalizePropertyNames(stack, defaultExpectedEcsProps);
    pascalCaseExpectedEksProps = capitalizePropertyNames(stack, defaultExpectedEksProps);
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
    new ManagedEc2EcsComputeEnvironment(stack, 'MyCE', {
      ...defaultEcsProps,
      spot: true,
      spotFleetRole: new Role(stack, 'SpotFleetRole', {
        assumedBy: new ArnPrincipal('arn:aws:iam:123456789012:magicuser/foobar'),
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
      ...pascalCaseExpectedEcsProps,
      ComputeResources: {
        ...defaultComputeResources,
        AllocationStrategy: AllocationStrategy.SPOT_PRICE_CAPACITY_OPTIMIZED,
        Type: 'SPOT',
        SpotIamFleetRole: {
          'Fn::GetAtt': ['SpotFleetRole6D4F7558', 'Arn'],
        },
      },
    });
  });

  test('image types are correctly rendered as EC2ConfigurationObjects', () => {
    // WHEN
    new ManagedEc2EcsComputeEnvironment(stack, 'MyCE', {
      ...defaultEcsProps,
      vpc,
      images: [
        {
          imageType: EcsMachineImageType.ECS_AL2_NVIDIA,
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
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

  test('Amazon Linux 2023 does not support A1 instances.', () => {
    expect(() => new ManagedEc2EcsComputeEnvironment(stack, 'Al2023A1InstanceClass', {
      ...defaultEcsProps,
      instanceClasses: [ec2.InstanceClass.A1],
      vpc,
      images: [
        {
          imageType: EcsMachineImageType.ECS_AL2023,
        },
      ],
    })).toThrow('Amazon Linux 2023 does not support A1 instances.');

    expect(() => new ManagedEc2EcsComputeEnvironment(stack, 'Al2023A1XlargeInstance', {
      ...defaultEcsProps,
      instanceTypes: [ec2.InstanceType.of(ec2.InstanceClass.A1, ec2.InstanceSize.XLARGE2)],
      vpc,
      images: [
        {
          imageType: EcsMachineImageType.ECS_AL2023,
        },
      ],
    })).toThrow('Amazon Linux 2023 does not support A1 instances.');

    new ManagedEc2EcsComputeEnvironment(stack, 'Al2A1InstanceClass', {
      ...defaultEcsProps,
      instanceClasses: [ec2.InstanceClass.A1],
      vpc,
      images: [
        {
          imageType: EcsMachineImageType.ECS_AL2,
        },
      ],
    });

    new ManagedEc2EcsComputeEnvironment(stack, 'Al2A1XlargeInstance', {
      ...defaultEcsProps,
      instanceTypes: [ec2.InstanceType.of(ec2.InstanceClass.A1, ec2.InstanceSize.XLARGE2)],
      vpc,
      images: [
        {
          imageType: EcsMachineImageType.ECS_AL2,
        },
      ],
    });
  });

  test('can use non-default allocation strategy', () => {
    // WHEN
    new ManagedEc2EcsComputeEnvironment(stack, 'MyCE', {
      ...defaultProps,
      vpc,
      allocationStrategy: AllocationStrategy.BEST_FIT,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
      ...pascalCaseExpectedEcsProps,
      ComputeResources: {
        ...defaultComputeResources,
        AllocationStrategy: 'BEST_FIT',
      },
    });
  });

  test('spot and AllocationStrategy.BEST_FIT => a default spot fleet role is created', () => {
    // WHEN
    new ManagedEc2EcsComputeEnvironment(stack, 'MyCE', {
      ...defaultProps,
      vpc,
      spot: true,
      allocationStrategy: AllocationStrategy.BEST_FIT,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
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
      new ManagedEc2EcsComputeEnvironment(stack, 'MyCE', {
        ...defaultEcsProps,
        spotFleetRole: new Role(stack, 'SpotFleetRole', {
          assumedBy: new ArnPrincipal('arn:aws:iam:123456789012:magicuser/foobar'),
        }),
      });
    }).toThrow(/Managed ComputeEnvironment 'MyCE' specifies 'spotFleetRole' without specifying 'spot'/);
  });
});

describe('ManagedEc2EksComputeEnvironment', () => {
  beforeEach(() => {
    stack = new Stack();
    vpc = new ec2.Vpc(stack, 'vpc');

    pascalCaseExpectedEcsProps = capitalizePropertyNames(stack, defaultExpectedEcsProps);
    pascalCaseExpectedEksProps = capitalizePropertyNames(stack, defaultExpectedEksProps);
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
    new ManagedEc2EksComputeEnvironment(stack, 'MyCE', {
      ...defaultEksProps,
      vpc,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
      ...pascalCaseExpectedEksProps,
      ComputeResources: {
        ...defaultComputeResources,
      },
    });
  });

  test('throws error when AllocationStrategy.BEST_FIT is used', () => {
    // THEN
    expect(() => {
      new ManagedEc2EksComputeEnvironment(stack, 'MyCE', {
        ...defaultProps,
        allocationStrategy: AllocationStrategy.BEST_FIT,
      });
    }).toThrow(/ManagedEc2EksComputeEnvironment 'MyCE' uses invalid allocation strategy 'AllocationStrategy.BEST_FIT'/);
  });

  test('image types are correctly rendered as EC2ConfigurationObjects', () => {
    // WHEN
    new ManagedEc2EksComputeEnvironment(stack, 'MyCE', {
      ...defaultEksProps,
      vpc,
      images: [
        {
          imageType: EksMachineImageType.EKS_AL2_NVIDIA,
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
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
    stack = new Stack();
    vpc = new ec2.Vpc(stack, 'vpc');
  });

  test('respects name', () => {
    // WHEN
    new FargateComputeEnvironment(stack, 'maximalPropsFargate', {
      vpc,
      maxvCpus: 512,
      computeEnvironmentName: 'maxPropsFargateCE',
      replaceComputeEnvironment: true,
      spot: true,
      terminateOnUpdate: true,
      updateTimeout: Duration.minutes(30),
      updateToLatestImageVersion: false,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
      ComputeEnvironmentName: 'maxPropsFargateCE',
    });
  });

  test('can be imported from arn', () => {
    // WHEN
    const ce = FargateComputeEnvironment.fromFargateComputeEnvironmentArn(stack, 'import', 'arn:aws:batch:us-east-1:123456789012:compute-environment/ce-name');

    // THEN
    expect(ce.computeEnvironmentArn).toEqual('arn:aws:batch:us-east-1:123456789012:compute-environment/ce-name');
  });
});
