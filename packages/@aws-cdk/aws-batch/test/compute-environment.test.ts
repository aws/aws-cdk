import { Template } from '@aws-cdk/assertions';
import { Stack } from '@aws-cdk/core';
import { capitalizePropertyNames } from '@aws-cdk/core/lib/util';
import * as batch from '../lib';
import { AllocationStrategy } from '../lib';
import { CfnComputeEnvironmentProps } from '../lib/batch.generated';

describe('ManagedEc2ComputeEnvironment', () => {
  const defaultProps: CfnComputeEnvironmentProps = {
    type: 'managed',
    computeEnvironmentName: undefined,
    serviceRole: undefined,
    state: 'ENABLED',
    computeResources: {
      allocationStrategy: undefined,
      bidPercentage: undefined,
      desiredvCpus: undefined,
      ec2Configuration: [{
        imageType: 'ECS_AL2',
      }],
      maxvCpus: 256,
      type: 'EC2',
      minvCpus: 0,
      subnets: ['TODO'],
      ec2KeyPair: undefined,
      imageId: undefined,
      instanceRole: 'some-arn',
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

    // WHEN
    new batch.ManagedEc2ComputeEnvironment(stack, 'MyCE');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
      ...PascalCaseProps,
    });
  });

  test('can specify maxvCpus', () => {
    // GIVEN
    stack = new Stack();

    // WHEN
    new batch.ManagedEc2ComputeEnvironment(stack, 'MyCE', {
      maxvCpus: 512,
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

  test('can specify maxvCpus', () => {
    // GIVEN
    stack = new Stack();

    // WHEN
    new batch.ManagedEc2ComputeEnvironment(stack, 'MyCE', {
      maxvCpus: 512,
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

    // WHEN
    new batch.ManagedEc2ComputeEnvironment(stack, 'MyCE', {
      minvCpus: 0,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
      ...PascalCaseProps,
      ComputeResources: {
        ...DefaultComputeResources,
        MinxvCpus: 0,
      },
    });
  });


  test('can be disabled', () => {
    // GIVEN
    stack = new Stack();

    // WHEN
    new batch.ManagedEc2ComputeEnvironment(stack, 'MyCE', {
      enabled: false,
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

    // WHEN
    new batch.ManagedEc2ComputeEnvironment(stack, 'MyCE', {
      allocationStrategy: AllocationStrategy.BEST_FIT,
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

    // WHEN
    new batch.ManagedEc2ComputeEnvironment(stack, 'MyCE', {
      spot: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
      ...PascalCaseProps,
      ComputeResources: {
        ...DefaultComputeResources,
        AllocationStrategy: 'SPOT_CAPACITY_OPTIMIZED',
        SpotIamFleetRole: 'some-role-arn',
      },
    });
  });

  test('throws error when AllocationStrategy.SPOT_CAPACITY_OPTIMIZED is used without specfiying spot', () => {
    // GIVEN
    stack = new Stack();

    // THEN
    expect(new batch.ManagedEc2ComputeEnvironment(stack, 'MyCE', {
      allocationStrategy: AllocationStrategy.SPOT_CAPACITY_OPTIMIZED,
    })).toThrowError(/errorrrrr/);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
      ...PascalCaseProps,
      ComputeResources: {
        ...DefaultComputeResources,
        AllocationStrategy: 'SPOT_CAPACITY_OPTIMIZED',
        SpotIamFleetRole: 'some-role-arn',
      },
    });
  });

  test('throws error when minvCpus > maxvCpus', () => {
    // GIVEN
    stack = new Stack();

    // THEN
    expect(new batch.ManagedEc2ComputeEnvironment(stack, 'MyCE', {
      maxvCpus: 512,
      minvCpus: 1024,
    })).toThrowError(/errorrrrr/);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
      ...PascalCaseProps,
      ComputeResources: {
        ...DefaultComputeResources,
        AllocationStrategy: 'SPOT_CAPACITY_OPTIMIZED',
        SpotIamFleetRole: 'some-role-arn',
      },
    });
  });

  test('throws error when minvCpus specified without specifying maxvCpus', () => {
    // GIVEN
    stack = new Stack();

    // THEN
    expect(new batch.ManagedEc2ComputeEnvironment(stack, 'MyCE', {
      minvCpus: 512,
    })).toThrowError(/errorrrrr/);
  });

  test('throws error when maxvCpus specified without specifying minvCpus', () => {
    // GIVEN
    stack = new Stack();

    // THEN
    expect(new batch.ManagedEc2ComputeEnvironment(stack, 'MyCE', {
      maxvCpus: 512,
    })).toThrowError(/errorrrrr/);
  });


});
