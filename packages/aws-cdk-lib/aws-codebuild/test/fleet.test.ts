import { Match, Template } from '../../assertions';
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

describe('fleet service role', () => {
  test('default service role is created if not specified', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new codebuild.Fleet(stack, 'Fleet', {
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      baseCapacity: 1,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
      BaseCapacity: 1,
      ComputeType: 'BUILD_GENERAL1_SMALL',
      EnvironmentType: 'LINUX_CONTAINER',
      FleetServiceRole: { 'Fn::GetAtt': ['FleetServiceRole02EA2190', 'Arn'] },
    });
  });

  test('can specify a service role prop', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const serviceRole = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
    });

    // WHEN
    new codebuild.Fleet(stack, 'Fleet', {
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      baseCapacity: 1,
      serviceRole,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
      BaseCapacity: 1,
      ComputeType: 'BUILD_GENERAL1_SMALL',
      EnvironmentType: 'LINUX_CONTAINER',
      FleetServiceRole: { 'Fn::GetAtt': ['Role1ABCC5F0', 'Arn'] },
    });
  });

});

describe('fleet proxy configuration', () => {
  test('can specify a basic proxy configuration', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const proxyConfiguration =
      new codebuild.FleetProxyConfiguration(codebuild.FleetProxyDefaultBehavior.DENY_ALL);

    new codebuild.Fleet(stack, 'Fleet', {
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      baseCapacity: 1,
      proxyConfiguration,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
      BaseCapacity: 1,
      ComputeType: 'BUILD_GENERAL1_SMALL',
      EnvironmentType: 'LINUX_CONTAINER',
      FleetProxyConfiguration: {
        DefaultBehavior: 'DENY_ALL',
      },
    });
  });
  test('can add multiple rules', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const proxyConfiguration =
      new codebuild.FleetProxyConfiguration(codebuild.FleetProxyDefaultBehavior.DENY_ALL)
        .addIpRule(codebuild.FleetProxyRuleEffect.ALLOW, '1.2.3.4', '2.3.4.5')
        .addDomainRule(codebuild.FleetProxyRuleEffect.DENY, 'example.com', 'example.org');
    proxyConfiguration
      .addIpRule(codebuild.FleetProxyRuleEffect.DENY, '2001:0db8:85a3:0000:0000:abcd:0001:2345');

    new codebuild.Fleet(stack, 'Fleet', {
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      baseCapacity: 1,
      proxyConfiguration,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
      BaseCapacity: 1,
      ComputeType: 'BUILD_GENERAL1_SMALL',
      EnvironmentType: 'LINUX_CONTAINER',
      FleetProxyConfiguration: {
        DefaultBehavior: 'DENY_ALL',
        OrderedProxyRules: [
          {
            Effect: 'ALLOW',
            Entities: ['1.2.3.4', '2.3.4.5'],
            Type: 'IP',
          },
          {
            Effect: 'DENY',
            Entities: ['example.com', 'example.org'],
            Type: 'DOMAIN',
          },
          {
            Effect: 'DENY',
            Entities: ['2001:0db8:85a3:0000:0000:abcd:0001:2345'],
            Type: 'IP',
          },
        ],
      },
    });
  });

  test('throws if proxyConfiguration is used with environmentType different than LINUX_CONTAINER', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const proxyConfiguration =
      new codebuild.FleetProxyConfiguration(codebuild.FleetProxyDefaultBehavior.DENY_ALL);

    // THEN
    expect(() => {
      new codebuild.Fleet(stack, 'Fleet', {
        fleetName: 'MyFleet',
        computeType: codebuild.FleetComputeType.SMALL,
        environmentType: codebuild.EnvironmentType.WINDOWS_SERVER_2019_CONTAINER,
        baseCapacity: 1,
        proxyConfiguration,
      });
    }).toThrow(/proxyConfiguration can only be used if environmentType is "LINUX_CONTAINER" or "LINUX_GPU_CONTAINER"/);
  });

  test('throws if proxyConfiguration is used with VPC configuration', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });

    // THEN
    expect(() => {
      new codebuild.Fleet(stack, 'Fleet', {
        fleetName: 'MyFleet',
        computeType: codebuild.FleetComputeType.SMALL,
        environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
        baseCapacity: 1,
        proxyConfiguration: new codebuild.FleetProxyConfiguration(codebuild.FleetProxyDefaultBehavior.DENY_ALL),
        vpcConfiguration: {
          vpc,
          subnets: vpc.privateSubnets,
          securityGroups: [securityGroup],
        },
      });
    }).toThrow(/proxyConfiguration and vpcConfiguration cannot be used concurrently/);
  });
});

describe('fleet VPC configuration', () => {
  test('can specify a basic VPC configuration', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });

    // WHEN
    new codebuild.Fleet(stack, 'Fleet', {
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      baseCapacity: 1,
      vpcConfiguration: {
        vpc,
        subnets: vpc.privateSubnets,
        securityGroups: [securityGroup],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
      BaseCapacity: 1,
      ComputeType: 'BUILD_GENERAL1_SMALL',
      EnvironmentType: 'LINUX_CONTAINER',
      FleetVpcConfig: {
        VpcId: { Ref: 'Vpc8378EB38' },
        Subnets: [{ Ref: 'VpcPrivateSubnet1Subnet536B997A' }, { Ref: 'VpcPrivateSubnet2Subnet3788AAA1' }],
        SecurityGroupIds: [{ 'Fn::GetAtt': ['SecurityGroupDD263621', 'GroupId'] }],
      },
    });
  });

  test('can use an imported VPC and security group', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = ec2.Vpc.fromVpcAttributes(stack, 'Vpc', {
      vpcId: 'vpc-12345',
      availabilityZones: ['az1'],
    });
    const securityGroup = ec2.SecurityGroup.fromSecurityGroupId(stack, 'SecurityGroup', 'sg-12345');

    // WHEN
    new codebuild.Fleet(stack, 'Fleet', {
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      baseCapacity: 1,
      vpcConfiguration: {
        vpc,
        subnets: vpc.privateSubnets,
        securityGroups: [securityGroup],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
      BaseCapacity: 1,
      ComputeType: 'BUILD_GENERAL1_SMALL',
      EnvironmentType: 'LINUX_CONTAINER',
      FleetVpcConfig: {
        VpcId: 'vpc-12345',
      },
    });
  });

  test('throws if VPC is in a different account than the fleet', () => {
    // GIVEN
    const [accountA, accountB] = ['123456789012', '012345678901'];

    const app = new cdk.App();
    const stackForAccountA = new cdk.Stack(app, 'StackA', { env: { account: accountA } });
    const stackForAccountB = new cdk.Stack(app, 'StackB', { env: { account: accountB } });
    const stackForUnresolvedAccount = new cdk.Stack(app, 'StackUnresolved');

    const createdVpcForAccountB = new ec2.Vpc(stackForAccountB, 'CreatedVpcStackB');
    const importedVpcForAccountB = ec2.Vpc.fromVpcAttributes(stackForAccountB, 'ImportedVpcStackB', {
      vpcId: 'vpc-12345',
      availabilityZones: ['az1'],
    });
    const securityGroup = new ec2.SecurityGroup(stackForAccountB, 'SecurityGroup', {
      vpc: createdVpcForAccountB,
    });

    const vpcForUnresolvedAccount = new ec2.Vpc(stackForUnresolvedAccount, 'CreatedVpcStackUnresolved');

    // THEN
    expect(() => {
      new codebuild.Fleet(stackForAccountA, 'FleetWithCreatedCrossAccountVpc', {
        fleetName: 'MyFleet',
        computeType: codebuild.FleetComputeType.SMALL,
        environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
        baseCapacity: 1,
        vpcConfiguration: {
          vpc: createdVpcForAccountB,
          securityGroups: [securityGroup],
          subnets: createdVpcForAccountB.privateSubnets,
        },
      });
    }).toThrow(/VPC must be in the same account as its associated fleet/);

    expect(() => {
      new codebuild.Fleet(stackForAccountA, 'FleetWithImportedCrossAccountVpc', {
        fleetName: 'MyFleet',
        computeType: codebuild.FleetComputeType.SMALL,
        environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
        baseCapacity: 1,
        vpcConfiguration: {
          vpc: importedVpcForAccountB,
          securityGroups: [securityGroup],
          subnets: importedVpcForAccountB.privateSubnets,
        },
      });
    }).toThrow(/VPC must be in the same account as its associated fleet/);

    // Do not throw if both accounts aren't resolved
    expect(() => {
      new codebuild.Fleet(stackForAccountA, 'FleetWithUnresolvedAccountVpc', {
        fleetName: 'MyFleet',
        computeType: codebuild.FleetComputeType.SMALL,
        environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
        baseCapacity: 1,
        vpcConfiguration: {
          vpc: vpcForUnresolvedAccount,
          securityGroups: [securityGroup],
          subnets: vpcForUnresolvedAccount.privateSubnets,
        },
      });
    }).not.toThrow();
    expect(() => {
      new codebuild.Fleet(stackForUnresolvedAccount, 'FleetInUnresolvedAccount', {
        fleetName: 'MyFleet',
        computeType: codebuild.FleetComputeType.SMALL,
        environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
        baseCapacity: 1,
        vpcConfiguration: {
          vpc: createdVpcForAccountB,
          securityGroups: [securityGroup],
          subnets: createdVpcForAccountB.privateSubnets,
        },
      });
    }).not.toThrow();
  });
});
