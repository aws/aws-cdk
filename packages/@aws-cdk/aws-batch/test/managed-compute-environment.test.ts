import { Template } from '@aws-cdk/assertions';
import { Vpc, MachineImage, InstanceClass, InstanceType, InstanceSize } from '@aws-cdk/aws-ec2';
import { Stack } from '@aws-cdk/core';
import { capitalizePropertyNames } from '@aws-cdk/core/lib/util';
import * as batch from '../lib';
import { AllocationStrategy, ManagedEc2EcsComputeEnvironment, ManagedEc2EcsComputeEnvironmentProps, ManagedEc2EksComputeEnvironment, ManagedEc2EksComputeEnvironmentProps } from '../lib';
import { CfnComputeEnvironmentProps } from '../lib/batch.generated';


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
    securityGroupIds: undefined,
    spotIamFleetRole: undefined,
    updateToLatestImageVersion: true,
  },
};

const defaultExpectedEksProps: CfnComputeEnvironmentProps = {
  ...defaultExpectedEcsProps,
  eksConfiguration: {
    eksClusterArn: {
      'Fn::GetAtt': ['MyCEEKSClusterD7B4E278', 'Arn'],
    } as any,
    kubernetesNamespace: 'cdk-test-namespace',
  },
};

let stack = new Stack();
let vpc = new Vpc(stack, 'vpc');

const pascalCaseExpectedEcsProps = capitalizePropertyNames(stack, defaultExpectedEcsProps);
const pascalCaseExpectedEksProps = capitalizePropertyNames(stack, defaultExpectedEksProps);
const defaultComputeResources = pascalCaseExpectedEcsProps.ComputeResources;

const defaultEcsProps: ManagedEc2EcsComputeEnvironmentProps = {
  vpc,
};
const defaultEksProps: ManagedEc2EksComputeEnvironmentProps = {
  vpc,
  kubernetesNamespace: 'cdk-test-namespace',
};

describe.each([ManagedEc2EcsComputeEnvironment, ManagedEc2EksComputeEnvironment])('%p type ComputeEnvironment', (ComputeEnvironment) => {
  let expectedProps = ComputeEnvironment === ManagedEc2EcsComputeEnvironment
    ? pascalCaseExpectedEcsProps
    : pascalCaseExpectedEksProps;
  let defaultProps: any = ComputeEnvironment === ManagedEc2EcsComputeEnvironment
    ? defaultEcsProps as ManagedEc2EcsComputeEnvironmentProps
    : defaultEksProps as ManagedEc2EksComputeEnvironmentProps;

  test('default props', () => {
    // GIVEN
    stack = new Stack();
    vpc = new Vpc(stack, 'vpc');

    // WHEN
    new ComputeEnvironment(stack, 'MyCE', {
      ...defaultProps,
      vpc,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
      ...expectedProps,
    });
  });

  test('can specify maxvCpus', () => {
    // GIVEN
    stack = new Stack();
    vpc = new Vpc(stack, 'vpc');

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
    // GIVEN
    stack = new Stack();
    vpc = new Vpc(stack, 'vpc');

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
    // GIVEN
    stack = new Stack();
    vpc = new Vpc(stack, 'vpc');

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

  test('can use non-default allocation strategy', () => {
    // GIVEN
    stack = new Stack();
    vpc = new Vpc(stack, 'vpc');

    // WHEN
    new ComputeEnvironment(stack, 'MyCE', {
      ...defaultProps,
      vpc,
      allocationStrategy: AllocationStrategy.BEST_FIT,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
      ...expectedProps,
      ComputeResources: {
        ...defaultComputeResources,
        AllocationStrategy: 'BEST_FIT',
      },
    });
  });

  test('spot => AllocationStrategy.SPOT_CAPACITY_OPTIMIZED and a default spot fleet role is created', () => {
    // GIVEN
    stack = new Stack();
    vpc = new Vpc(stack, 'vpc');

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
        AllocationStrategy: 'SPOT_CAPACITY_OPTIMIZED',
        SpotIamFleetRole: { 'Fn::GetAtt': ['MyCESpotFleetRole70BE30A0', 'Arn'] },
      },
    });
  });

  test('images are correctly rendered as EC2ConfigurationObjects', () => {
    // GIVEN
    stack = new Stack();
    vpc = new Vpc(stack, 'vpc');

    const expectedImageType = ComputeEnvironment === ManagedEc2EcsComputeEnvironment
      ? batch.EcsMachineImageType.ECS_AL2
      : batch.EksMachineImageType.EKS_AL2;

    // WHEN
    new ComputeEnvironment(stack, 'MyCE', {
      ...defaultProps,
      vpc,
      images: [
        {
          image: MachineImage.latestAmazonLinux(),
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
            ImageIdOverride: { Ref: 'SsmParameterValueawsserviceamiamazonlinuxlatestamznamihvmx8664gp2C96584B6F00A464EAD1953AFF4B05118Parameter' },
            ImageType: expectedImageType,
          },
        ],
      },
    });
  });

  test('instance classes are correctly rendered', () => {
    // GIVEN
    stack = new Stack();
    vpc = new Vpc(stack, 'vpc');

    // WHEN
    new ComputeEnvironment(stack, 'MyCE', {
      ...defaultProps,
      vpc,
      instanceClasses: [InstanceClass.R4],
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
    // GIVEN
    stack = new Stack();
    vpc = new Vpc(stack, 'vpc');

    // WHEN
    const ce = new ComputeEnvironment(stack, 'MyCE', {
      ...defaultProps,
      vpc,
      instanceTypes: [InstanceType.of(InstanceClass.R4, InstanceSize.LARGE)],
    });

    ce.addInstanceClass(InstanceClass.M4);
    ce.addInstanceType(InstanceType.of(InstanceClass.C4, InstanceSize.LARGE));

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
    // GIVEN
    stack = new Stack();
    vpc = new Vpc(stack, 'vpc');

    // WHEN
    new ComputeEnvironment(stack, 'MyCE', {
      ...defaultProps,
      vpc,
      useOptimalInstanceClasses: false,
      instanceClasses: [InstanceClass.R4],
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

  /*
  test('throws when no instance types are provided', () => {
    // GIVEN
    stack = new Stack();
    const vpc = new Vpc(stack, 'vpc');

    expect(() => {
      new ComputeEnvironment(stack, 'MyCE', {
        useOptimalInstanceClasses: false,
        vpc,
      });
    }).toThrow(/Managed ComputeEnvironment 'MyCE' uses no instance types or classes/);
  });
  */

  test('throws error when AllocationStrategy.SPOT_CAPACITY_OPTIMIZED is used without specfiying spot', () => {
    // GIVEN
    stack = new Stack();
    vpc = new Vpc(stack, 'vpc');

    // THEN
    expect(() => {
      new ComputeEnvironment(stack, 'MyCE', {
        ...defaultProps,
        vpc,
        allocationStrategy: AllocationStrategy.SPOT_CAPACITY_OPTIMIZED,
      });
    }).toThrow(/Managed ComputeEnvironment 'MyCE' specifies 'AllocationStrategy.SPOT_CAPACITY_OPTIMIZED' without using spot instances/);
  });

  test('throws error when spotBidPercentage is specified without spot', () => {
    // GIVEN
    stack = new Stack();
    vpc = new Vpc(stack, 'vpc');

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
    // GIVEN
    stack = new Stack();
    vpc = new Vpc(stack, 'vpc');

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
    // GIVEN
    stack = new Stack();
    vpc = new Vpc(stack, 'vpc');

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
    // GIVEN
    stack = new Stack();
    vpc = new Vpc(stack, 'vpc');

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
    // GIVEN
    stack = new Stack();
    vpc = new Vpc(stack, 'vpc');

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
    // GIVEN
    stack = new Stack();
    vpc = new Vpc(stack, 'vpc');

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
  test('image types are correctly rendered as EC2ConfigurationObjects', () => {
    // GIVEN
    stack = new Stack();
    vpc = new Vpc(stack, 'vpc');

    // WHEN
    new ManagedEc2EcsComputeEnvironment(stack, 'MyCE', {
      ...defaultEcsProps,
      vpc,
      images: [
        {
          imageType: batch.EcsMachineImageType.ECS_AL2_NVIDIA,
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
});

describe('ManagedEc2EksComputeEnvironment', () => {
  test('default props', () => {
    // GIVEN
    stack = new Stack();
    vpc = new Vpc(stack, 'vpc');

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

  test('image types are correctly rendered as EC2ConfigurationObjects', () => {
    // GIVEN
    stack = new Stack();
    vpc = new Vpc(stack, 'vpc');

    // WHEN
    new ManagedEc2EksComputeEnvironment(stack, 'MyCE', {
      ...defaultEksProps,
      vpc,
      images: [
        {
          imageType: batch.EksMachineImageType.EKS_AL2_NVIDIA,
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
