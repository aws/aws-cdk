import { Match, Template } from '../../assertions';
import * as cdk from '../../core';
import * as codebuild from '../lib';

test('can construct a default fleet', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const fleet = new codebuild.Fleet(stack, 'Fleet', {
    computeType: codebuild.FleetComputeType.SMALL,
    environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
    baseCapacity: 1,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
    Name: Match.absent(),
    BaseCapacity: 1,
    ComputeType: 'BUILD_GENERAL1_SMALL',
    EnvironmentType: 'LINUX_CONTAINER',
  });
  expect(cdk.Token.isUnresolved(fleet.fleetName)).toBeTruthy();
  expect(cdk.Token.isUnresolved(fleet.fleetArn)).toBeTruthy();
  expect(fleet.computeType).toEqual(codebuild.FleetComputeType.SMALL);
  expect(fleet.environmentType).toEqual(codebuild.EnvironmentType.LINUX_CONTAINER);
});

test('can construct a LINUX_EC2 fleet', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const fleet = new codebuild.Fleet(stack, 'Fleet', {
    computeType: codebuild.FleetComputeType.SMALL,
    environmentType: codebuild.EnvironmentType.LINUX_EC2,
    baseCapacity: 1,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
    Name: Match.absent(),
    BaseCapacity: 1,
    ComputeType: 'BUILD_GENERAL1_SMALL',
    EnvironmentType: 'LINUX_EC2',
  });
  expect(cdk.Token.isUnresolved(fleet.fleetName)).toBeTruthy();
  expect(cdk.Token.isUnresolved(fleet.fleetArn)).toBeTruthy();
  expect(fleet.computeType).toEqual(codebuild.FleetComputeType.SMALL);
  expect(fleet.environmentType).toEqual(codebuild.EnvironmentType.LINUX_EC2);
});

test('can construct an ARM_EC2 fleet', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const fleet = new codebuild.Fleet(stack, 'Fleet', {
    computeType: codebuild.FleetComputeType.SMALL,
    environmentType: codebuild.EnvironmentType.ARM_EC2,
    baseCapacity: 1,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
    Name: Match.absent(),
    BaseCapacity: 1,
    ComputeType: 'BUILD_GENERAL1_SMALL',
    EnvironmentType: 'ARM_EC2',
  });
  expect(cdk.Token.isUnresolved(fleet.fleetName)).toBeTruthy();
  expect(cdk.Token.isUnresolved(fleet.fleetArn)).toBeTruthy();
  expect(fleet.computeType).toEqual(codebuild.FleetComputeType.SMALL);
  expect(fleet.environmentType).toEqual(codebuild.EnvironmentType.ARM_EC2);
});

test('can construct a WINDOWS_EC2 fleet', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const fleet = new codebuild.Fleet(stack, 'Fleet', {
    computeType: codebuild.FleetComputeType.MEDIUM,
    environmentType: codebuild.EnvironmentType.WINDOWS_EC2,
    baseCapacity: 1,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
    Name: Match.absent(),
    BaseCapacity: 1,
    ComputeType: 'BUILD_GENERAL1_MEDIUM',
    EnvironmentType: 'WINDOWS_EC2',
  });
  expect(cdk.Token.isUnresolved(fleet.fleetName)).toBeTruthy();
  expect(cdk.Token.isUnresolved(fleet.fleetArn)).toBeTruthy();
  expect(fleet.computeType).toEqual(codebuild.FleetComputeType.MEDIUM);
  expect(fleet.environmentType).toEqual(codebuild.EnvironmentType.WINDOWS_EC2);
});

test('can construct a fleet with a specified name', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const fleet = new codebuild.Fleet(stack, 'Fleet', {
    fleetName: 'MyFleet',
    baseCapacity: 2,
    computeType: codebuild.FleetComputeType.SMALL,
    environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
    Name: 'MyFleet',
    BaseCapacity: 2,
    ComputeType: 'BUILD_GENERAL1_SMALL',
    EnvironmentType: 'LINUX_CONTAINER',
  });
  expect(cdk.Token.isUnresolved(fleet.fleetName)).toBeTruthy();
  expect(cdk.Token.isUnresolved(fleet.fleetArn)).toBeTruthy();
  expect(fleet.computeType).toEqual(codebuild.FleetComputeType.SMALL);
  expect(fleet.environmentType).toEqual(codebuild.EnvironmentType.LINUX_CONTAINER);
});

test('can import with a concrete ARN', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const fleet = codebuild.Fleet.fromFleetArn(stack, 'Fleet',
    'arn:aws:codebuild:us-east-1:123456789012:fleet/MyFleet:298f98fb-ba69-4381-a663-c8d517dd61be',
  );

  // THEN
  expect(fleet.fleetArn).toEqual(
    'arn:aws:codebuild:us-east-1:123456789012:fleet/MyFleet:298f98fb-ba69-4381-a663-c8d517dd61be',
  );
  expect(fleet.fleetName).toEqual('MyFleet');
});

test('throws if fleet name is longer than 128 characters', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // THEN
  expect(() => {
    new codebuild.Fleet(stack, 'Fleet', {
      fleetName: 'a'.repeat(129),
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      baseCapacity: 1,
    });
  }).toThrow(/Fleet name can not be longer than 128 characters but has 129 characters./);
});

test('throws if fleet name is shorter than 2 characters', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // THEN
  expect(() => {
    new codebuild.Fleet(stack, 'Fleet', {
      fleetName: 'a',
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      baseCapacity: 1,
    });
  }).toThrow(/Fleet name can not be shorter than 2 characters but has 1 characters./);
});

test('throws if baseCapacity is less than 1', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // THEN
  expect(() => {
    new codebuild.Fleet(stack, 'Fleet', {
      fleetName: 'MyFleet',
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      baseCapacity: 0,
    });
  }).toThrow(/baseCapacity must be greater than or equal to 1/);
});

test('throws if trying to retrieve properties from an imported Fleet', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const fleet = codebuild.Fleet.fromFleetArn(stack, 'Fleet',
    'arn:aws:codebuild:us-east-1:123456789012:fleet/MyFleet:298f98fb-ba69-4381-a663-c8d517dd61be',
  );

  // THEN
  expect(() => {
    return fleet.computeType;
  }).toThrow(/Cannot retrieve computeType property from an imported Fleet/);
  expect(() => {
    return fleet.environmentType;
  }).toThrow(/Cannot retrieve environmentType property from an imported Fleet/);
});

describe('attribute based compute', () => {
  test('specify compute configuration', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.ATTRIBUTE_BASED,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      computeConfiguration: {
        vCpu: 2,
        memory: cdk.Size.gibibytes(4),
        disk: cdk.Size.gibibytes(10),
        machineType: codebuild.MachineType.GENERAL,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
      BaseCapacity: 1,
      ComputeType: 'ATTRIBUTE_BASED_COMPUTE',
      EnvironmentType: 'LINUX_CONTAINER',
      ComputeConfiguration: {
        vCpu: 2,
        memory: 4,
        disk: 10,
        machineType: 'GENERAL',
      },
    });
  });

  test('specify only machine type', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.ATTRIBUTE_BASED,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      computeConfiguration: {
        machineType: codebuild.MachineType.GENERAL,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
      BaseCapacity: 1,
      ComputeType: 'ATTRIBUTE_BASED_COMPUTE',
      EnvironmentType: 'LINUX_CONTAINER',
      ComputeConfiguration: {
        vCpu: 0,
        memory: 0,
        disk: 0,
        machineType: 'GENERAL',
      },
    });
  });

  test.each([
    codebuild.FleetComputeType.SMALL,
    codebuild.FleetComputeType.MEDIUM,
    codebuild.FleetComputeType.LARGE,
    codebuild.FleetComputeType.X_LARGE,
    codebuild.FleetComputeType.X2_LARGE,
  ])('throw error for set compute configuration with non-attribute based compute type %s', (computeType) => {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    expect(() => {
      new codebuild.Fleet(stack, 'Fleet', {
        baseCapacity: 1,
        computeType,
        environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
        computeConfiguration: {
          vCpu: 2,
          memory: cdk.Size.gibibytes(4),
          disk: cdk.Size.gibibytes(10),
          machineType: codebuild.MachineType.GENERAL,
        },
      });
    }).toThrow(`'computeConfiguration' can only be specified if 'computeType' is 'ATTRIBUTE_BASED', got: ${computeType}`);
  });

  test('throw error for invalid disk size', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    expect(() => {
      new codebuild.Fleet(stack, 'Fleet', {
        baseCapacity: 1,
        computeType: codebuild.FleetComputeType.ATTRIBUTE_BASED,
        environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
        computeConfiguration: {
          disk: cdk.Size.gibibytes(1.5),
        },
      });
    }).toThrow('disk size must be a positive integer, got: 1.5');
  });

  test('throw error for invalid memory size', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    expect(() => {
      new codebuild.Fleet(stack, 'Fleet', {
        baseCapacity: 1,
        computeType: codebuild.FleetComputeType.ATTRIBUTE_BASED,
        environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
        computeConfiguration: {
          memory: cdk.Size.gibibytes(1.5),
        },
      });
    }).toThrow('memory size must be a positive integer, got: 1.5');
  });

  test.each([-1, 1.5, 2.5, NaN])('throw error for invalid vCPU count %s', (vCpu) => {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    expect(() => {
      new codebuild.Fleet(stack, 'Fleet', {
        baseCapacity: 1,
        computeType: codebuild.FleetComputeType.ATTRIBUTE_BASED,
        environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
        computeConfiguration: {
          vCpu,
        },
      });
    }).toThrow(`vCPU count must be a positive integer, got: ${vCpu}`);
  });

  test('throw error for not specifying all of compute configuration properties', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    expect(() => {
      new codebuild.Fleet(stack, 'Fleet', {
        baseCapacity: 1,
        computeType: codebuild.FleetComputeType.ATTRIBUTE_BASED,
        environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      });
    }).toThrow('At least one compute configuration criteria must be specified if computeType is "ATTRIBUTE_BASED"');
  });
});
