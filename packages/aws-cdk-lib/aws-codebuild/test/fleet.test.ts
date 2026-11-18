import { Annotations, Match, Template } from '../../assertions';
import * as ec2 from '../../aws-ec2';
import * as iam from '../../aws-iam';
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

test('throws if accessing connections without vpc', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const fleet = new codebuild.Fleet(stack, 'Fleet', {
    baseCapacity: 1,
    computeType: codebuild.FleetComputeType.SMALL,
    environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
  });

  // THEN
  expect(() => fleet.connections).toThrow(/Only VPC-associated Fleets have security groups to manage/);
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
  ])('throw error for set compute configuration with non-attribute-based, non-custom-instance-type compute type %s', (computeType) => {
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
    }).toThrow(`computeConfiguration can only be specified if computeType is ATTRIBUTE_BASED or CUSTOM_INSTANCE_TYPE, got: ${computeType}`);
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
    }).toThrow('At least one compute configuration criteria must be specified if computeType is ATTRIBUTE_BASED');
  });

  test('throws error if instanceType is specified with ATTRIBUTE_BASED', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    expect(() => {
      new codebuild.Fleet(stack, 'Fleet', {
        baseCapacity: 1,
        computeType: codebuild.FleetComputeType.ATTRIBUTE_BASED,
        environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
        computeConfiguration: {
          vCpu: 2,
          instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM),
        },
      });
    }).toThrow('instanceType can only be specified in computeConfiguration if computeType is CUSTOM_INSTANCE_TYPE');
  });
});

describe('custom instance type compute', () => {
  test('specify compute configuration', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.CUSTOM_INSTANCE_TYPE,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      computeConfiguration: {
        disk: cdk.Size.gibibytes(10),
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
      BaseCapacity: 1,
      ComputeType: 'CUSTOM_INSTANCE_TYPE',
      EnvironmentType: 'LINUX_CONTAINER',
      ComputeConfiguration: {
        disk: 10,
        instanceType: 't3.medium',
      },
    });
  });

  test('throws error if missing instanceType', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    expect(() => {
      new codebuild.Fleet(stack, 'Fleet', {
        baseCapacity: 1,
        computeType: codebuild.FleetComputeType.CUSTOM_INSTANCE_TYPE,
        environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
        computeConfiguration: {},
      });
    }).toThrow('instanceType must be specified in computeConfiguration if computeType is CUSTOM_INSTANCE_TYPE');
  });

  test('throws error for invalid disk size', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    expect(() => {
      new codebuild.Fleet(stack, 'Fleet', {
        baseCapacity: 1,
        computeType: codebuild.FleetComputeType.CUSTOM_INSTANCE_TYPE,
        environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
        computeConfiguration: {
          disk: cdk.Size.gibibytes(1.5),
          instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM),
        },
      });
    }).toThrow('disk size must be a positive integer, got: 1.5');
  });

  test.each([
    { machineType: codebuild.MachineType.GENERAL },
    { memory: cdk.Size.gibibytes(8) },
    { vCpu: 2 },
  ])('throws error for any other computeConfiguration fields: %s', (config) => {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    expect(() => {
      new codebuild.Fleet(stack, 'Fleet', {
        baseCapacity: 1,
        computeType: codebuild.FleetComputeType.CUSTOM_INSTANCE_TYPE,
        environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
        computeConfiguration: {
          instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM),
          ...config,
        },
      });
    }).toThrow('computeConfiguration attributes can only be used if computeType is ATTRIBUTE_BASED');
  });
});

describe('vpc', () => {
  test('specify vpc only', () => {
    // GIVEN
    const stack = new cdk.Stack();
    // Reserved capacity fleets support only one subnet
    const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });

    // WHEN
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      vpc,
    });

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::CodeBuild::Fleet', {
      BaseCapacity: 1,
      ComputeType: 'BUILD_GENERAL1_SMALL',
      EnvironmentType: 'LINUX_CONTAINER',
      FleetVpcConfig: {
        SecurityGroupIds: [{ 'Fn::GetAtt': ['FleetSecurityGroup97A0FCFD', 'GroupId'] }],
        Subnets: [
          { Ref: 'VpcPrivateSubnet1Subnet536B997A' },
        ],
        VpcId: { Ref: 'Vpc8378EB38' },
      },
      FleetServiceRole: {
        'Fn::GetAtt': ['FleetRole427BC000', 'Arn'],
      },
    });
    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [{
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: { Service: 'codebuild.amazonaws.com' },
        }],
      },
    });
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([Match.objectLike({
          Action: 'ec2:CreateNetworkInterfacePermission',
          Condition: {
            ArnEquals: {
              'ec2:Subnet': [
                {
                  'Fn::Join': ['', [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':ec2:',
                    { Ref: 'AWS::Region' },
                    ':',
                    { Ref: 'AWS::AccountId' },
                    ':subnet/',
                    { Ref: 'VpcPrivateSubnet1Subnet536B997A' },
                  ]],
                },
              ],
            },
          },
          Resource: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':ec2:',
              { Ref: 'AWS::Region' },
              ':',
              { Ref: 'AWS::AccountId' },
              ':network-interface/*',
            ]],
          },
        })]),
      },
    });
  });

  test('specify vpc with subnetSelection and securityGroups', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });

    // WHEN
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      vpc,
      subnetSelection: { subnets: [vpc.privateSubnets[0]] },
      securityGroups: [securityGroup],
    });

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::CodeBuild::Fleet', {
      BaseCapacity: 1,
      ComputeType: 'BUILD_GENERAL1_SMALL',
      EnvironmentType: 'LINUX_CONTAINER',
      FleetVpcConfig: {
        SecurityGroupIds: [{ 'Fn::GetAtt': ['SecurityGroupDD263621', 'GroupId'] }],
        Subnets: [
          { Ref: 'VpcPrivateSubnet1Subnet536B997A' },
        ],
        VpcId: { Ref: 'Vpc8378EB38' },
      },
    });
    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [{
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: { Service: 'codebuild.amazonaws.com' },
        }],
      },
    });
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([Match.objectLike({
          Action: 'ec2:CreateNetworkInterfacePermission',
          Condition: {
            ArnEquals: {
              'ec2:Subnet': [
                {
                  'Fn::Join': ['', [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':ec2:',
                    { Ref: 'AWS::Region' },
                    ':',
                    { Ref: 'AWS::AccountId' },
                    ':subnet/',
                    { Ref: 'VpcPrivateSubnet1Subnet536B997A' },
                  ]],
                },
              ],
            },
          },
          Resource: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':ec2:',
              { Ref: 'AWS::Region' },
              ':',
              { Ref: 'AWS::AccountId' },
              ':network-interface/*',
            ]],
          },
        })]),
      },
    });
  });

  test('throws error for securityGroups without vpc', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });

    // THEN
    expect(() => {
      new codebuild.Fleet(stack, 'Fleet', {
        baseCapacity: 1,
        computeType: codebuild.FleetComputeType.SMALL,
        environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
        securityGroups: [securityGroup],
      });
    }).toThrow('Cannot configure securityGroups without configuring a VPC');
  });

  test('throws error for subnetSelection without vpc', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');

    // THEN
    expect(() => {
      new codebuild.Fleet(stack, 'Fleet', {
        baseCapacity: 1,
        computeType: codebuild.FleetComputeType.SMALL,
        environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
        subnetSelection: { subnets: [vpc.privateSubnets[0]] },
      });
    }).toThrow('Cannot configure subnetSelection without configuring a VPC');
  });

  test('auto-narrows to first subnet when no subnetSelection provided', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });

    // WHEN - no explicit subnetSelection, construct should auto-narrow to first subnet
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      vpc,
    });

    // THEN - should only have the first private subnet
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::CodeBuild::Fleet', {
      FleetVpcConfig: Match.objectLike({
        Subnets: [{ Ref: 'VpcPrivateSubnet1Subnet536B997A' }],
      }),
    });

    // The IAM condition is intentionally not narrowed; see
    // 'auto-narrowing keeps both subnet ARNs in IAM condition'.
  });

  test('auto-narrow emits warning with subnet path when narrowing occurs', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app);
    const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });

    // WHEN - no explicit subnetSelection triggers auto-narrow
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      vpc,
    });

    // THEN - warning should be emitted with the subnet path and warning ID
    Annotations.fromStack(stack).hasWarning('/Default/Fleet',
      Match.stringLikeRegexp('using Default/Vpc/PrivateSubnet1.*Pass subnetSelection.*\\[ack: @aws-cdk/aws-codebuild:fleetSubnetAutoNarrowed\\]'));
  });

  test('no warning emitted for single-AZ VPC', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app);
    const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });

    // WHEN
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      vpc,
    });

    // THEN - no warning because only one subnet exists
    Annotations.fromStack(stack).hasNoWarning('*',
      Match.stringLikeRegexp('Reserved capacity fleets support only one subnet'));
  });

  test('no warning emitted for explicit single-subnet selection', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app);
    const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });

    // WHEN - explicit single subnet
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      vpc,
      subnetSelection: { subnets: [vpc.privateSubnets[0]] },
    });

    // THEN - no warning because user explicitly selected one subnet
    Annotations.fromStack(stack).hasNoWarning('*',
      Match.stringLikeRegexp('Reserved capacity fleets support only one subnet'));
  });

  test('auto-narrows and warns when subnetSelection uses subnetType filter', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app);
    const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });

    // WHEN - subnetType filter selects multiple subnets, should auto-narrow
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      vpc,
      subnetSelection: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
    });

    // THEN - should only have the first private subnet (auto-narrowed)
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::CodeBuild::Fleet', {
      FleetVpcConfig: Match.objectLike({
        Subnets: [{ Ref: 'VpcPrivateSubnet1Subnet536B997A' }],
      }),
    });

    // THEN - warning should be emitted with the warning ID
    Annotations.fromStack(stack).hasWarning('/Default/Fleet',
      Match.stringLikeRegexp('using Default/Vpc/PrivateSubnet1.*Pass subnetSelection.*\\[ack: @aws-cdk/aws-codebuild:fleetSubnetAutoNarrowed\\]'));
  });

  test.each([
    ['subnets', (vpc: ec2.Vpc): ec2.SubnetSelection => ({ subnets: vpc.privateSubnets })],
    ['availabilityZones', (_vpc: ec2.Vpc): ec2.SubnetSelection => ({ availabilityZones: ['us-east-1a', 'us-east-1b'] })],
    ['subnetFilters byIds', (vpc: ec2.Vpc): ec2.SubnetSelection => ({
      subnetFilters: [ec2.SubnetFilter.byIds(vpc.privateSubnets.map(s => s.subnetId))],
    })],
  ])('auto-narrows and warns when explicit %s selects multiple subnets', (_name, selection) => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc', { availabilityZones: ['us-east-1a', 'us-east-1b'] });

    // WHEN
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      vpc,
      subnetSelection: selection(vpc),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
      FleetVpcConfig: Match.objectLike({
        Subnets: [{ Ref: 'VpcPrivateSubnet1Subnet536B997A' }],
      }),
    });
    Annotations.fromStack(stack).hasWarning('/Default/Fleet',
      Match.stringLikeRegexp('but subnetSelection resolves to 2 subnets; using Default/Vpc/PrivateSubnet1.*\\[ack: @aws-cdk/aws-codebuild:fleetSubnetAutoNarrowed\\]'));
  });

  test('explicit multi-subnet selection with an L1 override of FleetVpcConfig.Subnets still synthesizes', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });

    // WHEN - existing pattern: pin the second subnet via an L1 override
    const fleet = new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      vpc,
      subnetSelection: { subnets: vpc.privateSubnets },
    });
    (fleet.node.defaultChild as codebuild.CfnFleet).addPropertyOverride('FleetVpcConfig.Subnets', [vpc.privateSubnets[1].subnetId]);

    // THEN - the override wins and the IAM condition still covers the pinned subnet
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::CodeBuild::Fleet', {
      FleetVpcConfig: Match.objectLike({
        Subnets: [{ Ref: 'VpcPrivateSubnet2Subnet3788AAA1' }],
      }),
    });
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: Match.objectLike({
        Statement: Match.arrayWith([Match.objectLike({
          Action: 'ec2:CreateNetworkInterfacePermission',
          Condition: {
            ArnEquals: {
              'ec2:Subnet': [
                Match.objectLike({ 'Fn::Join': Match.arrayWith([Match.arrayWith([{ Ref: 'VpcPrivateSubnet1Subnet536B997A' }])]) }),
                Match.objectLike({ 'Fn::Join': Match.arrayWith([Match.arrayWith([{ Ref: 'VpcPrivateSubnet2Subnet3788AAA1' }])]) }),
              ],
            },
          },
        })]),
      }),
    });
  });

  test('does not throw on pending VPC lookup', () => {
    // GIVEN
    // Before the context lookup resolves, `selectSubnets` returns a dummy set
    // with `isPendingLookup: true`; this must not throw.
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', { env: { account: '1234', region: 'us-east-1' } });
    const vpc = ec2.Vpc.fromLookup(stack, 'Vpc', { vpcId: 'vpc-1234' });

    // WHEN/THEN - should not throw despite dummy VPC having multiple subnets
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      vpc,
    });

    // THEN - both dummy subnets should be kept (no narrowing during pending lookup)
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::CodeBuild::Fleet', {
      FleetVpcConfig: Match.objectLike({
        // Exact two-element array to ensure no narrowing occurred
        Subnets: [Match.stringLikeRegexp('^p-'), Match.stringLikeRegexp('^p-')],
      }),
    });

    // THEN - no warning during pending lookup
    Annotations.fromStack(stack).hasNoWarning('*',
      Match.stringLikeRegexp('Reserved capacity fleets support only one subnet'));
  });

  test.each([
    ['a subnetType filter', (_vpc: ec2.IVpc): ec2.SubnetSelection => ({ subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS })],
    ['explicit subnets', (vpc: ec2.IVpc): ec2.SubnetSelection => ({ subnets: vpc.privateSubnets })],
    ['explicit availabilityZones', (_vpc: ec2.IVpc): ec2.SubnetSelection => ({ availabilityZones: ['dummy1a', 'dummy1b'] })],
  ])('does not narrow on pending VPC lookup with %s', (_name, selection) => {
    // GIVEN - pending lookup, the dummy VPC has two private subnets
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', { env: { account: '1234', region: 'us-east-1' } });
    const vpc = ec2.Vpc.fromLookup(stack, 'Vpc', { vpcId: 'vpc-1234' });

    // WHEN
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      vpc,
      subnetSelection: selection(vpc),
    });

    // THEN - both dummy subnets are kept and no warning is emitted
    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
      FleetVpcConfig: Match.objectLike({
        Subnets: [Match.stringLikeRegexp('^p-'), Match.stringLikeRegexp('^p-')],
      }),
    });
    Annotations.fromStack(stack).hasNoWarning('*',
      Match.stringLikeRegexp('Reserved capacity fleets support only one subnet'));
  });

  test('auto-narrows to first token element when subnet IDs are individual tokens', () => {
    // GIVEN - VPC with per-element tokenized subnet IDs from Fn.importListValue.
    // Fn.importListValue produces a real JS array whose *elements* are Fn::Select tokens,
    // so Token.isUnresolved(subnetIds) is false and auto-narrowing applies normally.
    const stack = new cdk.Stack();
    const vpc = ec2.Vpc.fromVpcAttributes(stack, 'Vpc', {
      vpcId: 'vpc-1234',
      availabilityZones: ['us-east-1a', 'us-east-1b'],
      privateSubnetIds: cdk.Fn.importListValue('SubnetIds', 2),
    });

    // WHEN - auto-narrowing selects the first element, no throw
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      vpc,
      subnetSelection: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
    });

    // THEN - only the first Fn::Select token reaches the template
    const fnSplit = { 'Fn::Split': [',', { 'Fn::ImportValue': 'SubnetIds' }] };
    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
      FleetVpcConfig: Match.objectLike({
        Subnets: [{ 'Fn::Select': [0, fnSplit] }],
      }),
    });
    // IAM condition still covers both original subnet ARNs (each ARN is an Fn::Join around the Fn::Select)
    const subnetArn = (index: number) => ({
      'Fn::Join': ['', [
        'arn:',
        { Ref: 'AWS::Partition' },
        ':ec2:',
        { Ref: 'AWS::Region' },
        ':',
        { Ref: 'AWS::AccountId' },
        ':subnet/',
        { 'Fn::Select': [index, fnSplit] },
      ]],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: Match.objectLike({
        Statement: Match.arrayWith([Match.objectLike({
          Action: 'ec2:CreateNetworkInterfacePermission',
          Condition: {
            ArnEquals: { 'ec2:Subnet': [subnetArn(0), subnetArn(1)] },
          },
        })]),
      }),
    });
  });

  test('auto-narrowing keeps both subnet ARNs in IAM condition', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });

    // WHEN - filter-based selection resolves to 2 subnets, auto-narrowed to 1
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      vpc,
      subnetSelection: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
    });

    const template = Template.fromStack(stack);
    // FleetVpcConfig.Subnets is narrowed to one subnet
    template.hasResourceProperties('AWS::CodeBuild::Fleet', {
      FleetVpcConfig: Match.objectLike({
        Subnets: [{ Ref: 'VpcPrivateSubnet1Subnet536B997A' }],
      }),
    });
    // IAM ec2:Subnet condition still covers both original subnets
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: Match.objectLike({
        Statement: Match.arrayWith([Match.objectLike({
          Condition: Match.objectLike({
            ArnEquals: Match.objectLike({
              'ec2:Subnet': Match.arrayWith([
                Match.objectLike({ 'Fn::Join': Match.arrayWith([Match.arrayWith([Match.stringLikeRegexp('subnet'), { Ref: 'VpcPrivateSubnet1Subnet536B997A' }])]) }),
                Match.objectLike({ 'Fn::Join': Match.arrayWith([Match.arrayWith([Match.stringLikeRegexp('subnet'), { Ref: 'VpcPrivateSubnet2Subnet3788AAA1' }])]) }),
              ]),
            }),
          }),
        })]),
      }),
    });
  });

  test('accepts single subnet selection', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });

    // WHEN
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      vpc,
      subnetSelection: { subnets: [vpc.privateSubnets[0]] },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
      FleetVpcConfig: Match.objectLike({
        Subnets: [{ Ref: 'VpcPrivateSubnet1Subnet536B997A' }],
      }),
    });
  });
});

describe('image', () => {
  const amiPolicyStatement = {
    Effect: 'Allow',
    Action: ['ec2:DescribeImages', 'ec2:DescribeSnapshots'],
    Resource: '*',
  };

  test('fromCodeBuildImageId renders ImageId without a service role', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.LARGE,
      environmentType: codebuild.EnvironmentType.MAC_ARM,
      image: codebuild.FleetImage.fromCodeBuildImageId('aws/codebuild/macos-arm-base:26'),
    });

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::CodeBuild::Fleet', {
      EnvironmentType: 'MAC_ARM',
      ImageId: 'aws/codebuild/macos-arm-base:26',
      FleetServiceRole: Match.absent(),
    });
    template.resourceCountIs('AWS::IAM::Role', 0);
    template.resourceCountIs('AWS::IAM::Policy', 0);
  });

  test('fails if fromCodeBuildImageId is given an AMI ID', () => {
    expect(() => codebuild.FleetImage.fromCodeBuildImageId('ami-12345678'))
      .toThrow('fromCodeBuildImageId expects a CodeBuild image identifier, got AMI ID "ami-12345678"; use FleetImage.fromAmiId() for custom AMIs');
  });

  test('fromCodeBuildImageId accepts a token', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const imageId = new cdk.CfnParameter(stack, 'ImageId').valueAsString;

    // WHEN
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.LARGE,
      environmentType: codebuild.EnvironmentType.MAC_ARM,
      image: codebuild.FleetImage.fromCodeBuildImageId(imageId),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
      ImageId: { Ref: 'ImageId' },
      FleetServiceRole: Match.absent(),
    });
  });

  test('ImageId is absent when image is not specified', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_EC2,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
      ImageId: Match.absent(),
      FleetServiceRole: Match.absent(),
    });
  });

  test('fromAmiId creates a service role with AMI permissions', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_EC2,
      image: codebuild.FleetImage.fromAmiId('ami-12345678'),
    });

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [{
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: { Service: 'codebuild.amazonaws.com' },
        }],
      },
    });
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: { Statement: [amiPolicyStatement] },
      Roles: [{ Ref: 'FleetRole427BC000' }],
    });
    template.hasResource('AWS::CodeBuild::Fleet', {
      Properties: {
        ImageId: 'ami-12345678',
        FleetServiceRole: { 'Fn::GetAtt': ['FleetRole427BC000', 'Arn'] },
      },
      DependsOn: ['FleetRoleDefaultPolicyE9296E86'],
    });
  });

  test('fromAmiId grants AMI permissions to a provided role', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const role = new iam.Role(stack, 'MyRole', {
      assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
    });

    // WHEN
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_EC2,
      image: codebuild.FleetImage.fromAmiId('ami-12345678'),
      role,
    });

    // THEN
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::IAM::Role', 1);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: { Statement: [amiPolicyStatement] },
      Roles: [{ Ref: 'MyRoleF48FFE04' }],
    });
    template.hasResourceProperties('AWS::CodeBuild::Fleet', {
      FleetServiceRole: { 'Fn::GetAtt': ['MyRoleF48FFE04', 'Arn'] },
    });
  });

  test('fromAmiId grants AMI permissions to an imported role', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const role = iam.Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::123456789012:role/FleetRole');

    // WHEN
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_EC2,
      image: codebuild.FleetImage.fromAmiId('ami-12345678'),
      role,
    });

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: { Statement: [amiPolicyStatement] },
      Roles: ['FleetRole'],
    });
    template.hasResourceProperties('AWS::CodeBuild::Fleet', {
      FleetServiceRole: 'arn:aws:iam::123456789012:role/FleetRole',
    });
  });

  test('fromAmiId grants AMI permissions for a token AMI ID', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const amiId = new cdk.CfnParameter(stack, 'AmiId').valueAsString;

    // WHEN
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_EC2,
      image: codebuild.FleetImage.fromAmiId(amiId),
    });

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: { Statement: [amiPolicyStatement] },
    });
    template.hasResourceProperties('AWS::CodeBuild::Fleet', {
      ImageId: { Ref: 'AmiId' },
      FleetServiceRole: { 'Fn::GetAtt': ['FleetRole427BC000', 'Arn'] },
    });
  });

  test('fromMachineImage resolves the AMI and grants AMI permissions', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_EC2,
      image: codebuild.FleetImage.fromMachineImage(ec2.MachineImage.latestAmazonLinux2023()),
    });

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: { Statement: [amiPolicyStatement] },
    });
    template.hasResourceProperties('AWS::CodeBuild::Fleet', {
      ImageId: { Ref: Match.stringLikeRegexp('^SsmParameterValueawsserviceamiamazonlinuxlatestal2023amikernel') },
      FleetServiceRole: { 'Fn::GetAtt': ['FleetRole427BC000', 'Arn'] },
    });
  });

  test.each([
    codebuild.EnvironmentType.LINUX_EC2,
    codebuild.EnvironmentType.ARM_EC2,
    codebuild.EnvironmentType.WINDOWS_EC2,
    codebuild.EnvironmentType.MAC_ARM,
  ])('accepts image with EC2-based environment type: %s', (environmentType) => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.MEDIUM,
      environmentType,
      image: codebuild.FleetImage.fromAmiId('ami-12345678'),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
      ImageId: 'ami-12345678',
    });
  });

  test.each([
    codebuild.EnvironmentType.LINUX_CONTAINER,
    codebuild.EnvironmentType.ARM_CONTAINER,
    codebuild.EnvironmentType.LINUX_GPU_CONTAINER,
    codebuild.EnvironmentType.WINDOWS_SERVER_2019_CONTAINER,
    codebuild.EnvironmentType.WINDOWS_SERVER_2022_CONTAINER,
  ])('fails if image is specified with container-based environment type: %s', (environmentType) => {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    expect(() => {
      new codebuild.Fleet(stack, 'Fleet', {
        baseCapacity: 1,
        computeType: codebuild.FleetComputeType.MEDIUM,
        environmentType,
        image: codebuild.FleetImage.fromCodeBuildImageId('aws/codebuild/macos-arm-base:26'),
      });
    }).toThrow(`image is only supported for EC2-based environment types (LINUX_EC2, ARM_EC2, WINDOWS_EC2, MAC_ARM), got: ${environmentType}`);
  });
});

describe('scalingConfiguration', () => {
  test('scalingConfiguration defaults scalingType to TARGET_TRACKING_SCALING', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.MEDIUM,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      scalingConfiguration: {
        maxCapacity: 5,
        // scalingType defaults to TARGET_TRACKING_SCALING
        targetTrackingScalingConfigs: [{
          metricType: codebuild.FleetScalingMetricType.FLEET_UTILIZATION_RATE,
          targetValue: 80,
        }],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
      BaseCapacity: 1,
      ScalingConfiguration: {
        MaxCapacity: 5,
        ScalingType: 'TARGET_TRACKING_SCALING',
        TargetTrackingScalingConfigs: [{
          MetricType: 'FLEET_UTILIZATION_RATE',
          TargetValue: 80,
        }],
      },
    });
  });

  test('scalingConfiguration with explicit scalingType', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.MEDIUM,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      scalingConfiguration: {
        maxCapacity: 5,
        scalingType: codebuild.FleetScalingType.TARGET_TRACKING_SCALING,
        targetTrackingScalingConfigs: [{
          metricType: codebuild.FleetScalingMetricType.FLEET_UTILIZATION_RATE,
          targetValue: 80,
        }],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
      ScalingConfiguration: {
        ScalingType: 'TARGET_TRACKING_SCALING',
      },
    });
  });

  test('scalingConfiguration is absent when not specified', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
      ScalingConfiguration: Match.absent(),
    });
  });

  test('throws if maxCapacity is less than 1', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    expect(() => {
      new codebuild.Fleet(stack, 'Fleet', {
        baseCapacity: 1,
        computeType: codebuild.FleetComputeType.SMALL,
        environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
        scalingConfiguration: {
          maxCapacity: 0,
          targetTrackingScalingConfigs: [{
            metricType: codebuild.FleetScalingMetricType.FLEET_UTILIZATION_RATE,
            targetValue: 80,
          }],
        },
      });
    }).toThrow(/scalingConfiguration.maxCapacity must be greater than or equal to 1/);
  });

  test('throws if maxCapacity is less than baseCapacity', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    expect(() => {
      new codebuild.Fleet(stack, 'Fleet', {
        baseCapacity: 5,
        computeType: codebuild.FleetComputeType.SMALL,
        environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
        scalingConfiguration: {
          maxCapacity: 3,
          targetTrackingScalingConfigs: [{
            metricType: codebuild.FleetScalingMetricType.FLEET_UTILIZATION_RATE,
            targetValue: 80,
          }],
        },
      });
    }).toThrow(/scalingConfiguration.maxCapacity must be greater than or equal to baseCapacity/);
  });

  test('throws if targetTrackingScalingConfigs is empty with TARGET_TRACKING_SCALING', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    expect(() => {
      new codebuild.Fleet(stack, 'Fleet', {
        baseCapacity: 1,
        computeType: codebuild.FleetComputeType.SMALL,
        environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
        scalingConfiguration: {
          maxCapacity: 5,
          scalingType: codebuild.FleetScalingType.TARGET_TRACKING_SCALING,
          targetTrackingScalingConfigs: [],
        },
      });
    }).toThrow(/At least one targetTrackingScalingConfigs entry is required when scalingType is TARGET_TRACKING_SCALING/);
  });

  // Note: 'throws if targetTrackingScalingConfigs is omitted' test removed because
  // targetTrackingScalingConfigs is now required at the type level

  test.each([-1, -0.1, 101, 150])('throws if targetValue is out of range: %s', (targetValue) => {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    expect(() => {
      new codebuild.Fleet(stack, 'Fleet', {
        baseCapacity: 1,
        computeType: codebuild.FleetComputeType.SMALL,
        environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
        scalingConfiguration: {
          maxCapacity: 5,
          targetTrackingScalingConfigs: [{
            metricType: codebuild.FleetScalingMetricType.FLEET_UTILIZATION_RATE,
            targetValue,
          }],
        },
      });
    }).toThrow(/targetValue must be between 0 and 100 \(inclusive\)/);
  });

  test.each([0, 50, 100])('accepts valid targetValue boundary: %s', (targetValue) => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      scalingConfiguration: {
        maxCapacity: 5,
        targetTrackingScalingConfigs: [{
          metricType: codebuild.FleetScalingMetricType.FLEET_UTILIZATION_RATE,
          targetValue,
        }],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
      ScalingConfiguration: {
        TargetTrackingScalingConfigs: [{
          MetricType: 'FLEET_UTILIZATION_RATE',
          TargetValue: targetValue,
        }],
      },
    });
  });

  test('accepts maxCapacity equal to baseCapacity', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 5,
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      scalingConfiguration: {
        maxCapacity: 5,
        scalingType: codebuild.FleetScalingType.TARGET_TRACKING_SCALING,
        targetTrackingScalingConfigs: [{
          metricType: codebuild.FleetScalingMetricType.FLEET_UTILIZATION_RATE,
          targetValue: 70,
        }],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
      BaseCapacity: 5,
      ScalingConfiguration: {
        MaxCapacity: 5,
      },
    });
  });

  test('tokenized maxCapacity and targetValue skip numeric validation', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      scalingConfiguration: {
        maxCapacity: cdk.Token.asNumber({ Ref: 'MaxCapacity' }),
        targetTrackingScalingConfigs: [{
          metricType: codebuild.FleetScalingMetricType.FLEET_UTILIZATION_RATE,
          targetValue: cdk.Token.asNumber({ Ref: 'TargetValue' }),
        }],
      },
    });

    // THEN - tokens should reach the template
    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
      ScalingConfiguration: {
        MaxCapacity: { Ref: 'MaxCapacity' },
        TargetTrackingScalingConfigs: [{
          MetricType: 'FLEET_UTILIZATION_RATE',
          TargetValue: { Ref: 'TargetValue' },
        }],
      },
    });
  });

  test('tokenized baseCapacity skips maxCapacity comparison', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN - maxCapacity (5) < baseCapacity (token) should not throw
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: cdk.Token.asNumber({ Ref: 'BaseCapacity' }),
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      scalingConfiguration: {
        maxCapacity: 5,
        targetTrackingScalingConfigs: [{
          metricType: codebuild.FleetScalingMetricType.FLEET_UTILIZATION_RATE,
          targetValue: 70,
        }],
      },
    });

    // THEN - tokens should reach the template
    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
      BaseCapacity: { Ref: 'BaseCapacity' },
      ScalingConfiguration: {
        MaxCapacity: 5,
      },
    });
  });
});

describe('proxyConfiguration', () => {
  test('proxyConfiguration is passed to CloudFormation', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.MEDIUM,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      proxyConfiguration: {
        defaultBehavior: codebuild.FleetProxyRuleBehavior.DENY_ALL,
        orderedProxyRules: [{
          effect: codebuild.FleetProxyRuleEffect.ALLOW,
          entities: ['*.amazonaws.com'],
          type: codebuild.FleetProxyRuleType.DOMAIN,
        }],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
      FleetProxyConfiguration: {
        DefaultBehavior: 'DENY_ALL',
        OrderedProxyRules: [{
          Effect: 'ALLOW',
          Entities: ['*.amazonaws.com'],
          Type: 'DOMAIN',
        }],
      },
    });
  });

  test('throws if proxyConfiguration is specified with VPC', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });

    // THEN
    // Per AWS docs: "running reserved capacity fleets in a managed proxy server is not supported for VPC"
    // CFN accepts the combination but builds fail at PROVISIONING with CLIENT_ERROR.
    expect(() => {
      new codebuild.Fleet(stack, 'Fleet', {
        baseCapacity: 1,
        computeType: codebuild.FleetComputeType.MEDIUM,
        environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
        vpc,
        proxyConfiguration: {
          defaultBehavior: codebuild.FleetProxyRuleBehavior.DENY_ALL,
          orderedProxyRules: [{
            effect: codebuild.FleetProxyRuleEffect.ALLOW,
            entities: ['*.amazonaws.com'],
            type: codebuild.FleetProxyRuleType.DOMAIN,
          }],
        },
      });
    }).toThrow(/proxyConfiguration is not supported when vpc is configured/);
  });

  test('proxyConfiguration is absent when not specified', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
      FleetProxyConfiguration: Match.absent(),
    });
  });

  test.each([
    codebuild.EnvironmentType.LINUX_EC2,
    codebuild.EnvironmentType.ARM_EC2,
    codebuild.EnvironmentType.WINDOWS_EC2,
    codebuild.EnvironmentType.MAC_ARM,
  ])('throws if proxyConfiguration is specified with EC2-based environment type: %s', (environmentType) => {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    expect(() => {
      new codebuild.Fleet(stack, 'Fleet', {
        baseCapacity: 1,
        computeType: codebuild.FleetComputeType.MEDIUM,
        environmentType,
        proxyConfiguration: {
          defaultBehavior: codebuild.FleetProxyRuleBehavior.DENY_ALL,
        },
      });
    }).toThrow(/proxyConfiguration is only supported for Linux container environment types/);
  });

  test.each([
    codebuild.EnvironmentType.WINDOWS_SERVER_2019_CONTAINER,
    codebuild.EnvironmentType.WINDOWS_SERVER_2022_CONTAINER,
  ])('throws if proxyConfiguration is specified with Windows container environment type: %s', (environmentType) => {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    expect(() => {
      new codebuild.Fleet(stack, 'Fleet', {
        baseCapacity: 1,
        computeType: codebuild.FleetComputeType.MEDIUM,
        environmentType,
        proxyConfiguration: {
          defaultBehavior: codebuild.FleetProxyRuleBehavior.DENY_ALL,
        },
      });
    }).toThrow(/proxyConfiguration is only supported for Linux container environment types/);
  });

  test.each([
    codebuild.EnvironmentType.LINUX_CONTAINER,
    codebuild.EnvironmentType.ARM_CONTAINER,
    codebuild.EnvironmentType.LINUX_GPU_CONTAINER,
  ])('accepts proxyConfiguration with Linux container environment type: %s', (environmentType) => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.MEDIUM,
      environmentType,
      proxyConfiguration: {
        defaultBehavior: codebuild.FleetProxyRuleBehavior.DENY_ALL,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
      FleetProxyConfiguration: {
        DefaultBehavior: 'DENY_ALL',
      },
    });
  });

  test('throws if proxy rule has empty entities', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    expect(() => {
      new codebuild.Fleet(stack, 'Fleet', {
        baseCapacity: 1,
        computeType: codebuild.FleetComputeType.SMALL,
        environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
        proxyConfiguration: {
          defaultBehavior: codebuild.FleetProxyRuleBehavior.DENY_ALL,
          orderedProxyRules: [{
            effect: codebuild.FleetProxyRuleEffect.ALLOW,
            entities: [],
            type: codebuild.FleetProxyRuleType.DOMAIN,
          }],
        },
      });
    }).toThrow(/Each proxy rule must have at least one entity/);
  });

  test('tokenized entities skips empty-array validation', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN - tokenized entities list has .length === 1 (the marker), must not throw
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      proxyConfiguration: {
        defaultBehavior: codebuild.FleetProxyRuleBehavior.DENY_ALL,
        orderedProxyRules: [{
          effect: codebuild.FleetProxyRuleEffect.ALLOW,
          entities: cdk.Token.asList({ Ref: 'Entities' }),
          type: codebuild.FleetProxyRuleType.DOMAIN,
        }],
      },
    });

    // THEN - token reaches the template
    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
      FleetProxyConfiguration: {
        OrderedProxyRules: [{
          Entities: { Ref: 'Entities' },
        }],
      },
    });
  });
});

describe('combined properties', () => {
  test('image and scalingConfiguration together (EC2 environment)', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.MEDIUM,
      environmentType: codebuild.EnvironmentType.LINUX_EC2,
      image: codebuild.FleetImage.fromAmiId('ami-12345678'),
      scalingConfiguration: {
        maxCapacity: 3,
        scalingType: codebuild.FleetScalingType.TARGET_TRACKING_SCALING,
        targetTrackingScalingConfigs: [{
          metricType: codebuild.FleetScalingMetricType.FLEET_UTILIZATION_RATE,
          targetValue: 70,
        }],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
      BaseCapacity: 1,
      ComputeType: 'BUILD_GENERAL1_MEDIUM',
      EnvironmentType: 'LINUX_EC2',
      ImageId: 'ami-12345678',
      ScalingConfiguration: {
        MaxCapacity: 3,
        ScalingType: 'TARGET_TRACKING_SCALING',
        TargetTrackingScalingConfigs: [{
          MetricType: 'FLEET_UTILIZATION_RATE',
          TargetValue: 70,
        }],
      },
    });
  });

  test('proxyConfiguration and scalingConfiguration together (container environment)', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.MEDIUM,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      scalingConfiguration: {
        maxCapacity: 3,
        scalingType: codebuild.FleetScalingType.TARGET_TRACKING_SCALING,
        targetTrackingScalingConfigs: [{
          metricType: codebuild.FleetScalingMetricType.FLEET_UTILIZATION_RATE,
          targetValue: 70,
        }],
      },
      proxyConfiguration: {
        defaultBehavior: codebuild.FleetProxyRuleBehavior.DENY_ALL,
        orderedProxyRules: [
          {
            effect: codebuild.FleetProxyRuleEffect.ALLOW,
            entities: ['*.amazonaws.com'],
            type: codebuild.FleetProxyRuleType.DOMAIN,
          },
          {
            effect: codebuild.FleetProxyRuleEffect.ALLOW,
            entities: ['10.0.0.0/8'],
            type: codebuild.FleetProxyRuleType.IP,
          },
        ],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
      BaseCapacity: 1,
      ComputeType: 'BUILD_GENERAL1_MEDIUM',
      EnvironmentType: 'LINUX_CONTAINER',
      ScalingConfiguration: {
        MaxCapacity: 3,
        ScalingType: 'TARGET_TRACKING_SCALING',
        TargetTrackingScalingConfigs: [{
          MetricType: 'FLEET_UTILIZATION_RATE',
          TargetValue: 70,
        }],
      },
      FleetProxyConfiguration: {
        DefaultBehavior: 'DENY_ALL',
        OrderedProxyRules: [
          {
            Effect: 'ALLOW',
            Entities: ['*.amazonaws.com'],
            Type: 'DOMAIN',
          },
          {
            Effect: 'ALLOW',
            Entities: ['10.0.0.0/8'],
            Type: 'IP',
          },
        ],
      },
    });
  });
});

describe('overflowBehavior', () => {
  test('can set overflow behavior to QUEUE', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      overflowBehavior: codebuild.FleetOverflowBehavior.QUEUE,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
      BaseCapacity: 1,
      ComputeType: 'BUILD_GENERAL1_SMALL',
      EnvironmentType: 'LINUX_CONTAINER',
      OverflowBehavior: 'QUEUE',
    });
  });

  test('can set overflow behavior to ON_DEMAND', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      overflowBehavior: codebuild.FleetOverflowBehavior.ON_DEMAND,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
      BaseCapacity: 1,
      ComputeType: 'BUILD_GENERAL1_SMALL',
      EnvironmentType: 'LINUX_CONTAINER',
      OverflowBehavior: 'ON_DEMAND',
    });
  });

  test('overflow behavior is optional', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new codebuild.Fleet(stack, 'Fleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
      BaseCapacity: 1,
      ComputeType: 'BUILD_GENERAL1_SMALL',
      EnvironmentType: 'LINUX_CONTAINER',
    });
  });
});
