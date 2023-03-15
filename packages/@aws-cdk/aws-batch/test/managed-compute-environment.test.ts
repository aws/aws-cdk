import { Template } from '@aws-cdk/assertions';
import { Vpc, MachineImage, InstanceClass, InstanceType, InstanceSize } from '@aws-cdk/aws-ec2';
import { Stack } from '@aws-cdk/core';
import { capitalizePropertyNames } from '@aws-cdk/core/lib/util';
import * as batch from '../lib';
import { AllocationStrategy, ManagedEc2EcsComputeEnvironment, ManagedEc2EksComputeEnvironment } from '../lib';
import { CfnComputeEnvironmentProps } from '../lib/batch.generated';


const defaultProps: CfnComputeEnvironmentProps = {
  type: 'managed',
  computeEnvironmentName: undefined,
  serviceRole: undefined,
  state: 'ENABLED',
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

let stack = new Stack();

const PascalCaseProps = capitalizePropertyNames(stack, defaultProps);
const DefaultComputeResources = PascalCaseProps.ComputeResources;

describe.each([ManagedEc2EcsComputeEnvironment, ManagedEc2EksComputeEnvironment])('%p type ComputeEnvironment', (ComputeEnvironment) => {
  test('default props', () => {
    // GIVEN
    stack = new Stack();
    const vpc = new Vpc(stack, 'vpc');

    // WHEN
    new ComputeEnvironment(stack, 'MyCE', {
      vpc,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
      ...PascalCaseProps,
    });
  });

  test('can specify maxvCpus', () => {
    // GIVEN
    stack = new Stack();
    const vpc = new Vpc(stack, 'vpc');

    // WHEN
    new ComputeEnvironment(stack, 'MyCE', {
      maxvCpus: 512,
      vpc,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
      ...PascalCaseProps,
      ComputeResources: {
        ...DefaultComputeResources,
        MaxvCpus: 512,
      },
    });
  });

  test('can specify minvCpus', () => {
    // GIVEN
    stack = new Stack();
    const vpc = new Vpc(stack, 'vpc');

    // WHEN
    new ComputeEnvironment(stack, 'MyCE', {
      minvCpus: 8,
      vpc,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
      ...PascalCaseProps,
      ComputeResources: {
        ...DefaultComputeResources,
        MinvCpus: 8,
      },
    });
  });


  test('can be disabled', () => {
    // GIVEN
    stack = new Stack();
    const vpc = new Vpc(stack, 'vpc');

    // WHEN
    new ComputeEnvironment(stack, 'MyCE', {
      enabled: false,
      vpc,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
      ...PascalCaseProps,
      State: 'DISABLED',
    });
  });

  test('can use non-default allocation strategy', () => {
    // GIVEN
    stack = new Stack();
    const vpc = new Vpc(stack, 'vpc');

    // WHEN
    new ComputeEnvironment(stack, 'MyCE', {
      allocationStrategy: AllocationStrategy.BEST_FIT,
      vpc,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
      ...PascalCaseProps,
      ComputeResources: {
        ...DefaultComputeResources,
        AllocationStrategy: 'BEST_FIT',
      },
    });
  });

  test('spot => AllocationStrategy.SPOT_CAPACITY_OPTIMIZED and a default spot fleet role is created', () => {
    // GIVEN
    stack = new Stack();
    const vpc = new Vpc(stack, 'vpc');

    // WHEN
    new ComputeEnvironment(stack, 'MyCE', {
      spot: true,
      vpc,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
      ...PascalCaseProps,
      ComputeResources: {
        ...DefaultComputeResources,
        Type: 'SPOT',
        AllocationStrategy: 'SPOT_CAPACITY_OPTIMIZED',
        SpotIamFleetRole: { 'Fn::GetAtt': ['MyCESpotFleetRole70BE30A0', 'Arn'] },
      },
    });
  });

  test('images are correctly rendered as EC2ConfigurationObjects', () => {
    // GIVEN
    stack = new Stack();
    const vpc = new Vpc(stack, 'vpc');

    const expectedImageType = ComputeEnvironment === ManagedEc2EcsComputeEnvironment
      ? batch.EcsMachineImageType.ECS_AL2
      : batch.EksMachineImageType.EKS_AL2;

    // WHEN
    new ComputeEnvironment(stack, 'MyCE', {
      images: [
        {
          image: MachineImage.latestAmazonLinux(),
        },
      ],
      vpc,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
      ...PascalCaseProps,
      ComputeResources: {
        ...DefaultComputeResources,
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
    const vpc = new Vpc(stack, 'vpc');

    // WHEN
    new ComputeEnvironment(stack, 'MyCE', {
      instanceClasses: [InstanceClass.R4],
      vpc,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
      ...PascalCaseProps,
      ComputeResources: {
        ...DefaultComputeResources,
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
    const vpc = new Vpc(stack, 'vpc');

    // WHEN
    new ComputeEnvironment(stack, 'MyCE', {
      instanceTypes: [InstanceType.of(InstanceClass.R4, InstanceSize.LARGE)],
      vpc,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
      ...PascalCaseProps,
      ComputeResources: {
        ...DefaultComputeResources,
        InstanceTypes: [
          'r4.large',
          'optimal',
        ],
      },
    });
  });

  test('respects useOptimalInstanceClasses: false', () => {
    // GIVEN
    stack = new Stack();
    const vpc = new Vpc(stack, 'vpc');

    // WHEN
    new ComputeEnvironment(stack, 'MyCE', {
      useOptimalInstanceClasses: false,
      instanceClasses: [InstanceClass.R4],
      vpc,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
      ...PascalCaseProps,
      ComputeResources: {
        ...DefaultComputeResources,
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
    const vpc = new Vpc(stack, 'vpc');

    // THEN
    expect(() => {
      new ComputeEnvironment(stack, 'MyCE', {
        allocationStrategy: AllocationStrategy.SPOT_CAPACITY_OPTIMIZED,
        vpc,
      });
    }).toThrow(/Managed ComputeEnvironment 'MyCE' specifies 'AllocationStrategy.SPOT_CAPACITY_OPTIMIZED' without using spot instances/);
  });

  test('throws error when spotBidPercentage is specified without spot', () => {
    // GIVEN
    stack = new Stack();
    const vpc = new Vpc(stack, 'vpc');

    // THEN
    expect(() => {
      new ComputeEnvironment(stack, 'MyCE', {
        spotBidPercentage: 80,
        vpc,
      });
    }).toThrow(/Managed ComputeEnvironment 'MyCE' specifies 'spotBidPercentage' without specifying 'spot'/);
  });

  test('throws error when spotBidPercentage is specified and spot is false', () => {
    // GIVEN
    stack = new Stack();
    const vpc = new Vpc(stack, 'vpc');

    // THEN
    expect(() => {
      new ComputeEnvironment(stack, 'MyCE', {
        spotBidPercentage: 80,
        spot: false,
        vpc,
      });
    }).toThrow(/Managed ComputeEnvironment 'MyCE' specifies 'spotBidPercentage' without specifying 'spot'/);
  });

  test('throws error when spotBidPercentage > 100', () => {
    // GIVEN
    stack = new Stack();
    const vpc = new Vpc(stack, 'vpc');

    // THEN
    expect(() => {
      new ComputeEnvironment(stack, 'MyCE', {
        spotBidPercentage: 120,
        spot: true,
        vpc,
      });
    }).toThrow(/Managed ComputeEnvironment 'MyCE' specifies 'spotBidPercentage' > 100/);
  });

  test('throws error when spotBidPercentage < 0', () => {
    // GIVEN
    stack = new Stack();
    const vpc = new Vpc(stack, 'vpc');

    // THEN
    expect(() => {
      new ComputeEnvironment(stack, 'MyCE', {
        spotBidPercentage: -120,
        spot: true,
        vpc,
      });
    }).toThrow(/Managed ComputeEnvironment 'MyCE' specifies 'spotBidPercentage' < 0/);
  });

  test('throws error when minvCpus > maxvCpus', () => {
    // GIVEN
    stack = new Stack();
    const vpc = new Vpc(stack, 'vpc');

    // THEN
    expect(() => {
      new ComputeEnvironment(stack, 'MyCE', {
        vpc,
        maxvCpus: 512,
        minvCpus: 1024,
      });
    }).toThrow(/Managed ComputeEnvironment 'MyCE' has 'minvCpus' = 1024 > 'maxvCpus' = 512; 'minvCpus' cannot be greater than 'maxvCpus'/);
  });

  test('throws error when minvCpus < 0', () => {
    // GIVEN
    stack = new Stack();
    const vpc = new Vpc(stack, 'vpc');

    // THEN
    expect(() => {
      new ComputeEnvironment(stack, 'MyCE', {
        minvCpus: -256,
        vpc,
      });
    }).toThrowError(/Managed ComputeEnvironment 'MyCE' has 'minvCpus' = -256 < 0; 'minvCpus' cannot be less than zero/);
  });
});

describe('ManagedEc2EcsComputeEnvironment', () => {
  test('image types are correctly rendered as EC2ConfigurationObjects', () => {
    // GIVEN
    stack = new Stack();
    const vpc = new Vpc(stack, 'vpc');

    // WHEN
    new ManagedEc2EcsComputeEnvironment(stack, 'MyCE', {
      images: [
        {
          imageType: batch.EcsMachineImageType.ECS_AL2_NVIDIA,
        },
      ],
      vpc,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
      ...PascalCaseProps,
      ComputeResources: {
        ...DefaultComputeResources,
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
  test('image types are correctly rendered as EC2ConfigurationObjects', () => {
    // GIVEN
    stack = new Stack();
    const vpc = new Vpc(stack, 'vpc');

    // WHEN
    new ManagedEc2EksComputeEnvironment(stack, 'MyCE', {
      images: [
        {
          imageType: batch.EksMachineImageType.EKS_AL2_NVIDIA,
        },
      ],
      vpc,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
      ...PascalCaseProps,
      ComputeResources: {
        ...DefaultComputeResources,
        Ec2Configuration: [
          {
            ImageType: 'EKS_AL2_NVIDIA',
          },
        ],
      },
    });
  });
});
