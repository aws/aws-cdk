import { Template } from '@aws-cdk/assertions';
import { Vpc } from '@aws-cdk/aws-ec2';
import { Stack } from '@aws-cdk/core';
import { capitalizePropertyNames } from '@aws-cdk/core/lib/util';
import * as batch from '../lib';
import { AllocationStrategy } from '../lib';
import { CfnComputeEnvironmentProps } from '../lib/batch.generated';

describe('ManagedEc2EcsComputeEnvironment', () => {
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

  test('default props', () => {
    // GIVEN
    stack = new Stack();
    const vpc = new Vpc(stack, 'vpc');

    // WHEN
    new batch.ManagedEc2EcsComputeEnvironment(stack, 'MyCE', {
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
    new batch.ManagedEc2EcsComputeEnvironment(stack, 'MyCE', {
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
    new batch.ManagedEc2EcsComputeEnvironment(stack, 'MyCE', {
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
    new batch.ManagedEc2EcsComputeEnvironment(stack, 'MyCE', {
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
    new batch.ManagedEc2EcsComputeEnvironment(stack, 'MyCE', {
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
    new batch.ManagedEc2EcsComputeEnvironment(stack, 'MyCE', {
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

  test('throws error when AllocationStrategy.SPOT_CAPACITY_OPTIMIZED is used without specfiying spot', () => {
    // GIVEN
    stack = new Stack();
    const vpc = new Vpc(stack, 'vpc');

    // THEN
    expect(() => {
      new batch.ManagedEc2EcsComputeEnvironment(stack, 'MyCE', {
        allocationStrategy: AllocationStrategy.SPOT_CAPACITY_OPTIMIZED,
        vpc,
      });
    }).toThrow(/Managed ComputeEnvironment 'MyCE' specifies 'AllocationStrategy.SPOT_CAPACITY_OPTIMIZED' without using spot instances/);
  });

  test('throws error when minvCpus > maxvCpus', () => {
    // GIVEN
    stack = new Stack();
    const vpc = new Vpc(stack, 'vpc');

    // THEN
    expect(() => {
      new batch.ManagedEc2EcsComputeEnvironment(stack, 'MyCE', {
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
      new batch.ManagedEc2EcsComputeEnvironment(stack, 'MyCE', {
        minvCpus: -256,
        vpc,
      });
    }).toThrowError(/Managed ComputeEnvironment 'MyCE' has 'minvCpus' = -256 < 0; 'minvCpus' cannot be less than zero/);
  });
});
