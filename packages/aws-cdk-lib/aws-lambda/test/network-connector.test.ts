import { Template, Match } from '../../assertions';
import * as ec2 from '../../aws-ec2';
import * as iam from '../../aws-iam';
import * as cdk from '../../core';
import * as lambda from '../lib';

describe('NetworkConnector', () => {
  let stack: cdk.Stack;
  let vpc: ec2.Vpc;
  let subnets: ec2.ISubnet[];
  let securityGroup: ec2.SecurityGroup;

  beforeEach(() => {
    stack = new cdk.Stack();
    vpc = new ec2.Vpc(stack, 'Vpc');
    subnets = vpc.privateSubnets.slice(0, 2);
    securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });
  });

  describe('basic creation', () => {
    test('creates a network connector with all required props', () => {
      // WHEN
      new lambda.NetworkConnector(stack, 'MyConnector', {
        configuration: lambda.NetworkConnectorConfig.vpcEgress({
          subnets,
          securityGroups: [securityGroup],
          networkProtocol: lambda.NetworkProtocol.IPV4,
          associatedComputeResourceTypes: [lambda.ComputeType.MICROVMS],
        }),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::NetworkConnector', {
        Configuration: {
          VpcEgressConfiguration: {
            SubnetIds: Match.arrayWith([
              { Ref: Match.stringLikeRegexp('VpcPrivateSubnet.*') },
            ]),
            SecurityGroupIds: [
              { 'Fn::GetAtt': [Match.stringLikeRegexp('SecurityGroup.*'), 'GroupId'] },
            ],
            NetworkProtocol: 'IPv4',
            AssociatedComputeResourceTypes: ['MicroVm'],
          },
        },
      });
    });

    test('creates a network connector with custom name', () => {
      // WHEN
      new lambda.NetworkConnector(stack, 'MyConnector', {
        networkConnectorName: 'my-vpc-connector',
        configuration: lambda.NetworkConnectorConfig.vpcEgress({
          subnets,
          securityGroups: [securityGroup],
          networkProtocol: lambda.NetworkProtocol.IPV4,
          associatedComputeResourceTypes: [lambda.ComputeType.MICROVMS],
        }),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::NetworkConnector', {
        Name: 'my-vpc-connector',
      });
    });

    test('creates a network connector without name', () => {
      // WHEN
      new lambda.NetworkConnector(stack, 'MyConnector', {
        configuration: lambda.NetworkConnectorConfig.vpcEgress({
          subnets,
          securityGroups: [securityGroup],
          networkProtocol: lambda.NetworkProtocol.IPV4,
          associatedComputeResourceTypes: [lambda.ComputeType.MICROVMS],
        }),
      });

      // THEN
      const template = Template.fromStack(stack);
      const connectors = template.findResources('AWS::Lambda::NetworkConnector');
      const resource = Object.values(connectors)[0];
      expect(resource.Properties.Name).toBeUndefined();
    });
  });

  describe('operator role', () => {
    test('auto-creates operator role when not provided', () => {
      // WHEN
      new lambda.NetworkConnector(stack, 'MyConnector', {
        configuration: lambda.NetworkConnectorConfig.vpcEgress({
          subnets,
          securityGroups: [securityGroup],
          networkProtocol: lambda.NetworkProtocol.IPV4,
          associatedComputeResourceTypes: [lambda.ComputeType.MICROVMS],
        }),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::NetworkConnector', {
        OperatorRole: {
          'Fn::GetAtt': [Match.stringLikeRegexp('MyConnectorOperatorRole.*'), 'Arn'],
        },
      });
    });

    test('auto-created role has AWSLambdaNetworkConnectorOperatorPolicy managed policy', () => {
      // WHEN
      new lambda.NetworkConnector(stack, 'MyConnector', {
        configuration: lambda.NetworkConnectorConfig.vpcEgress({
          subnets,
          securityGroups: [securityGroup],
          networkProtocol: lambda.NetworkProtocol.IPV4,
          associatedComputeResourceTypes: [lambda.ComputeType.MICROVMS],
        }),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
        ManagedPolicyArns: Match.arrayWith([
          {
            'Fn::Join': ['', Match.arrayWith([
              Match.stringLikeRegexp('.*AWSLambdaNetworkConnectorOperatorPolicy'),
            ])],
          },
        ]),
      });
    });

    test('auto-created role has lambda.amazonaws.com trust policy', () => {
      // WHEN
      new lambda.NetworkConnector(stack, 'MyConnector', {
        configuration: lambda.NetworkConnectorConfig.vpcEgress({
          subnets,
          securityGroups: [securityGroup],
          networkProtocol: lambda.NetworkProtocol.IPV4,
          associatedComputeResourceTypes: [lambda.ComputeType.MICROVMS],
        }),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
        AssumeRolePolicyDocument: {
          Statement: [
            {
              Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: { Service: 'lambda.amazonaws.com' },
            },
          ],
        },
      });
    });

    test('uses provided role when operatorRole is specified', () => {
      // GIVEN
      const customRole = new iam.Role(stack, 'CustomRole', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      });

      // WHEN
      new lambda.NetworkConnector(stack, 'MyConnector', {
        configuration: lambda.NetworkConnectorConfig.vpcEgress({
          subnets,
          securityGroups: [securityGroup],
          networkProtocol: lambda.NetworkProtocol.IPV4,
          associatedComputeResourceTypes: [lambda.ComputeType.MICROVMS],
        }),
        operatorRole: customRole,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::NetworkConnector', {
        OperatorRole: {
          'Fn::GetAtt': [Match.stringLikeRegexp('CustomRole.*'), 'Arn'],
        },
      });
      // Should NOT create auto role
      Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 1);
    });
  });

  describe('configuration mapping', () => {
    test('correctly maps VpcEgressConfig to L1 properties', () => {
      // WHEN
      new lambda.NetworkConnector(stack, 'MyConnector', {
        configuration: lambda.NetworkConnectorConfig.vpcEgress({
          subnets,
          securityGroups: [securityGroup],
          networkProtocol: lambda.NetworkProtocol.DUAL_STACK,
          associatedComputeResourceTypes: [lambda.ComputeType.MICROVMS],
        }),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::NetworkConnector', {
        Configuration: {
          VpcEgressConfiguration: {
            NetworkProtocol: 'DualStack',
            AssociatedComputeResourceTypes: ['MicroVm'],
          },
        },
      });
    });

    test('maps subnet IDs from ISubnet objects', () => {
      // GIVEN
      const importedSubnets = [
        ec2.Subnet.fromSubnetId(stack, 'Sub1', 'subnet-111'),
        ec2.Subnet.fromSubnetId(stack, 'Sub2', 'subnet-222'),
      ];

      // WHEN
      new lambda.NetworkConnector(stack, 'MyConnector', {
        configuration: lambda.NetworkConnectorConfig.vpcEgress({
          subnets: importedSubnets,
          securityGroups: [securityGroup],
          networkProtocol: lambda.NetworkProtocol.IPV4,
          associatedComputeResourceTypes: [lambda.ComputeType.MICROVMS],
        }),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::NetworkConnector', {
        Configuration: {
          VpcEgressConfiguration: {
            SubnetIds: ['subnet-111', 'subnet-222'],
          },
        },
      });
    });

    test('maps security group IDs from ISecurityGroup objects', () => {
      // GIVEN
      const importedSg = ec2.SecurityGroup.fromSecurityGroupId(stack, 'ImportedSg', 'sg-abc123');

      // WHEN
      new lambda.NetworkConnector(stack, 'MyConnector', {
        configuration: lambda.NetworkConnectorConfig.vpcEgress({
          subnets,
          securityGroups: [importedSg],
          networkProtocol: lambda.NetworkProtocol.IPV4,
          associatedComputeResourceTypes: [lambda.ComputeType.MICROVMS],
        }),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::NetworkConnector', {
        Configuration: {
          VpcEgressConfiguration: {
            SecurityGroupIds: ['sg-abc123'],
          },
        },
      });
    });
  });

  describe('validation', () => {
    test('throws when subnets list is empty', () => {
      expect(() => {
        new lambda.NetworkConnector(stack, 'MyConnector', {
          configuration: lambda.NetworkConnectorConfig.vpcEgress({
            subnets: [],
            securityGroups: [securityGroup],
            networkProtocol: lambda.NetworkProtocol.IPV4,
            associatedComputeResourceTypes: [lambda.ComputeType.MICROVMS],
          }),
        });
      }).toThrow(/subnets must contain between 1 and 16 items/);
    });

    test('throws when subnets exceeds 16', () => {
      // GIVEN
      const manySubnets = Array.from({ length: 17 }, (_, i) =>
        ec2.Subnet.fromSubnetId(stack, `Subnet${i}`, `subnet-${i}`),
      );

      // THEN
      expect(() => {
        new lambda.NetworkConnector(stack, 'MyConnector', {
          configuration: lambda.NetworkConnectorConfig.vpcEgress({
            subnets: manySubnets,
            securityGroups: [securityGroup],
            networkProtocol: lambda.NetworkProtocol.IPV4,
            associatedComputeResourceTypes: [lambda.ComputeType.MICROVMS],
          }),
        });
      }).toThrow(/subnets must contain between 1 and 16 items/);
    });

    test('throws when security groups exceeds 5', () => {
      // GIVEN
      const manySgs = Array.from({ length: 6 }, (_, i) =>
        ec2.SecurityGroup.fromSecurityGroupId(stack, `Sg${i}`, `sg-${i}`),
      );

      // THEN
      expect(() => {
        new lambda.NetworkConnector(stack, 'MyConnector', {
          configuration: lambda.NetworkConnectorConfig.vpcEgress({
            subnets,
            securityGroups: manySgs,
            networkProtocol: lambda.NetworkProtocol.IPV4,
            associatedComputeResourceTypes: [lambda.ComputeType.MICROVMS],
          }),
        });
      }).toThrow(/securityGroups must contain between 1 and 5 items/);
    });

    test('throws when name exceeds 64 characters', () => {
      // GIVEN
      const longName = 'a'.repeat(65);

      // THEN
      expect(() => {
        new lambda.NetworkConnector(stack, 'MyConnector', {
          networkConnectorName: longName,
          configuration: lambda.NetworkConnectorConfig.vpcEgress({
            subnets,
            securityGroups: [securityGroup],
            networkProtocol: lambda.NetworkProtocol.IPV4,
            associatedComputeResourceTypes: [lambda.ComputeType.MICROVMS],
          }),
        });
      }).toThrow(/networkConnectorName must be at most 64 characters/);
    });

    test('throws when name contains invalid characters', () => {
      expect(() => {
        new lambda.NetworkConnector(stack, 'MyConnector', {
          networkConnectorName: 'invalid name!',
          configuration: lambda.NetworkConnectorConfig.vpcEgress({
            subnets,
            securityGroups: [securityGroup],
            networkProtocol: lambda.NetworkProtocol.IPV4,
            associatedComputeResourceTypes: [lambda.ComputeType.MICROVMS],
          }),
        });
      }).toThrow(/networkConnectorName must contain only alphanumeric characters, hyphens, and underscores/);
    });

    test('skips validation when values are tokens', () => {
      // GIVEN - token-based subnet list (unresolved)
      const tokenSubnets = cdk.Token.asList(cdk.Lazy.any({ produce: () => ['subnet-1'] }));
      const subnetsFromTokens = tokenSubnets.map((id, i) =>
        ec2.Subnet.fromSubnetId(stack, `TokenSub${i}`, id),
      );

      // THEN - should not throw even though we can't validate length
      expect(() => {
        new lambda.NetworkConnector(stack, 'MyConnector', {
          networkConnectorName: cdk.Token.asString(cdk.Lazy.string({ produce: () => 'valid' })),
          configuration: lambda.NetworkConnectorConfig.vpcEgress({
            subnets: subnetsFromTokens,
            securityGroups: [securityGroup],
            networkProtocol: lambda.NetworkProtocol.IPV4,
            associatedComputeResourceTypes: [lambda.ComputeType.MICROVMS],
          }),
        });
      }).not.toThrow();
    });
  });

  describe('import methods', () => {
    test('fromNetworkConnectorArn returns correct ARN', () => {
      // WHEN
      const imported = lambda.NetworkConnector.fromNetworkConnectorArn(
        stack, 'Imported',
        'arn:aws:lambda:us-east-1:123456789012:network-connector:nc-8fc7cb2d-1234',
      );

      // THEN
      expect(imported.networkConnectorArn).toBe(
        'arn:aws:lambda:us-east-1:123456789012:network-connector:nc-8fc7cb2d-1234',
      );
    });

    test('fromNetworkConnectorAttributes returns correct properties', () => {
      // WHEN
      const imported = lambda.NetworkConnector.fromNetworkConnectorAttributes(stack, 'Imported', {
        networkConnectorArn: 'arn:aws:lambda:us-east-1:123456789012:network-connector:nc-8fc7cb2d-1234',
      });

      // THEN
      expect(imported.networkConnectorArn).toBe(
        'arn:aws:lambda:us-east-1:123456789012:network-connector:nc-8fc7cb2d-1234',
      );
    });
  });

  describe('attributes', () => {
    test('exposes networkConnectorArn attribute', () => {
      // WHEN
      const connector = new lambda.NetworkConnector(stack, 'MyConnector', {
        configuration: lambda.NetworkConnectorConfig.vpcEgress({
          subnets,
          securityGroups: [securityGroup],
          networkProtocol: lambda.NetworkProtocol.IPV4,
          associatedComputeResourceTypes: [lambda.ComputeType.MICROVMS],
        }),
      });

      // THEN
      const resolved = stack.resolve(connector.networkConnectorArn);
      expect(resolved).toHaveProperty('Fn::GetAtt');
      expect(resolved['Fn::GetAtt'][0]).toMatch(/MyConnector/);
      expect(resolved['Fn::GetAtt'][1]).toBe('Arn');
    });
  });

  describe('tags', () => {
    test('Tags.of(connector).add() works correctly', () => {
      // WHEN
      const connector = new lambda.NetworkConnector(stack, 'MyConnector', {
        configuration: lambda.NetworkConnectorConfig.vpcEgress({
          subnets,
          securityGroups: [securityGroup],
          networkProtocol: lambda.NetworkProtocol.IPV4,
          associatedComputeResourceTypes: [lambda.ComputeType.MICROVMS],
        }),
      });
      cdk.Tags.of(connector).add('Environment', 'prod');

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::NetworkConnector', {
        Tags: Match.arrayWith([
          { Key: 'Environment', Value: 'prod' },
        ]),
      });
    });
  });
});
