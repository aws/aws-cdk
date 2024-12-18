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
    return fleet.computeConfiguration;
  }).toThrow(/Cannot retrieve computeConfiguration property from an imported Fleet/);
  expect(() => {
    return fleet.environmentType;
  }).toThrow(/Cannot retrieve environmentType property from an imported Fleet/);
});

describe('attribute based compute', () => {
  test('can construct a fleet with attribute based compute', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new codebuild.Fleet(stack, 'Fleet', {
      fleetName: 'MyFleet',
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.ATTRIBUTE_BASED,
      computeConfiguration: {
        machineType: codebuild.FleetComputeConfigurationMachineType.NVME,
        disk: 60,
        memory: 8,
        vCpu: 2,
      },
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
      Name: 'MyFleet',
      BaseCapacity: 1,
      ComputeType: 'ATTRIBUTE_BASED_COMPUTE',
      EnvironmentType: 'LINUX_CONTAINER',
      ComputeConfiguration: {
        disk: 60,
        memory: 8,
        vCpu: 2,
        machineType: 'NVME',
      },
    });
  });

  test('can construct a fleet with minimal criteria based compute', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new codebuild.Fleet(stack, 'Fleet', {
      fleetName: 'MyFleet',
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.ATTRIBUTE_BASED,
      computeConfiguration: {
        machineType: codebuild.FleetComputeConfigurationMachineType.GENERAL,
      },
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
      Name: 'MyFleet',
      BaseCapacity: 1,
      ComputeType: 'ATTRIBUTE_BASED_COMPUTE',
      EnvironmentType: 'LINUX_CONTAINER',
      ComputeConfiguration: {
        machineType: 'GENERAL',
        // Undefined integer values cause the CloudFormation template to fail on deployment
        disk: 0,
        memory: 0,
        vCpu: 0,
      },
    });
  });

  test('throws if computeConfiguration is specified but computeType is not AttributeBasedCompute', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    expect(() => {
      new codebuild.Fleet(stack, 'Fleet', {
        fleetName: 'MyFleet',
        baseCapacity: 1,
        computeType: codebuild.FleetComputeType.SMALL,
        computeConfiguration: { disk: 1 },
        environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      });
    }).toThrow(/computeConfiguration can only be specified if computeType is "ATTRIBUTE_BASED"/);
    expect(() => {
      new codebuild.Fleet(stack, 'Fleet', {
        fleetName: 'MyFleet',
        baseCapacity: 1,
        computeType: codebuild.FleetComputeType.SMALL,
        computeConfiguration: {},
        environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      });
    }).toThrow(/computeConfiguration can only be specified if computeType is "ATTRIBUTE_BASED"/);
  });

  test('throws if computeType is AttributeBasedCompute but computeConfiguration is not specified', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    expect(() => {
      new codebuild.Fleet(stack, 'Fleet', {
        fleetName: 'MyFleet',
        baseCapacity: 1,
        computeType: codebuild.FleetComputeType.ATTRIBUTE_BASED,
        environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      });
    }).toThrow(/At least one compute configuration criteria must be specified if computeType is "ATTRIBUTE_BASED"/);

    expect(() => {
      new codebuild.Fleet(stack, 'Fleet', {
        fleetName: 'MyFleet',
        baseCapacity: 1,
        computeType: codebuild.FleetComputeType.ATTRIBUTE_BASED,
        environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
        computeConfiguration: {},
      });
    }).toThrow(/At least one compute configuration criteria must be specified if computeType is "ATTRIBUTE_BASED"/);
  });
});
