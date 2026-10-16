import { Annotations, Match, Template } from '../../assertions';
import * as ec2 from '../../aws-ec2';
import * as iam from '../../aws-iam';
import { App, CfnOutput, CfnParameter, Stack } from '../../core';
import { CfnNetworkConnector } from '../lib/lambda.generated';
import {
  NetworkConnector,
  NetworkConnectorComputeType,
  NetworkConnectorConfiguration,
  NetworkProtocol,
} from '../lib/network-connector';

const CONNECTOR_ARN = 'arn:aws:lambda:us-west-2:123456789012:network-connector:nc-0123abcd';
const VERSION_ARN = `${CONNECTOR_ARN}:3`;

describe('NetworkConnector', () => {
  let stack: Stack;
  let vpc: ec2.Vpc;
  let securityGroup: ec2.SecurityGroup;

  beforeEach(() => {
    stack = new Stack(new App(), 'Stack', { env: { account: '123456789012', region: 'us-west-2' } });
    vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, natGateways: 0 });
    securityGroup = new ec2.SecurityGroup(stack, 'Sg', { vpc });
  });

  function vpcEgress(overrides: Partial<Parameters<typeof NetworkConnectorConfiguration.vpcEgress>[0]> = {}) {
    return NetworkConnectorConfiguration.vpcEgress({
      computeType: NetworkConnectorComputeType.WEB_FUNCTION,
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      securityGroups: [securityGroup],
      ...overrides,
    });
  }

  test('isNetworkConnector recognizes a NetworkConnector only', () => {
    const connector = new NetworkConnector(stack, 'Connector', { configuration: vpcEgress() });
    const imported = NetworkConnector.fromNetworkConnectorVersionArn(stack, 'Imported', VERSION_ARN);

    expect(NetworkConnector.isNetworkConnector(connector)).toBe(true);
    expect(NetworkConnector.isNetworkConnector(imported)).toBe(false);
    expect(NetworkConnector.isNetworkConnector(vpc)).toBe(false);
    expect(NetworkConnector.isNetworkConnector(null)).toBe(false);
  });

  test('exposes its L1 resource for escape hatches', () => {
    const connector = new NetworkConnector(stack, 'Connector', { configuration: vpcEgress() });

    expect(CfnNetworkConnector.isCfnNetworkConnector(connector.resource)).toBe(true);
    expect(connector.resource).toBe(connector.node.defaultChild);

    connector.resource.addPropertyOverride('Name', 'overridden');
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::NetworkConnector', { Name: 'overridden' });
  });

  describe('template', () => {
    test('renders the VPC egress configuration with the compute type', () => {
      new NetworkConnector(stack, 'Connector', {
        configuration: vpcEgress(),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::NetworkConnector', {
        Configuration: {
          VpcEgressConfiguration: {
            AssociatedComputeResourceTypes: ['WebFunction'],
            NetworkProtocol: 'IPv4',
            SecurityGroupIds: [{ 'Fn::GetAtt': [Match.stringLikeRegexp('^Sg'), 'GroupId'] }],
            SubnetIds: [
              { Ref: Match.stringLikeRegexp('^VpcIsolatedSubnet1') },
              { Ref: Match.stringLikeRegexp('^VpcIsolatedSubnet2') },
            ],
          },
        },
      });
    });

    test('defaults the network protocol to IPv4', () => {
      new NetworkConnector(stack, 'Connector', {
        configuration: vpcEgress(),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::NetworkConnector', {
        Configuration: {
          VpcEgressConfiguration: Match.objectLike({ NetworkProtocol: 'IPv4' }),
        },
      });
    });

    test('selects subnets through the VPC', () => {
      // Two public and two isolated subnets exist; only the isolated ones are selected.
      const vpcWithPublic = new ec2.Vpc(stack, 'Vpc2', {
        maxAzs: 2,
        natGateways: 0,
        subnetConfiguration: [
          { name: 'public', subnetType: ec2.SubnetType.PUBLIC },
          { name: 'isolated', subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
        ],
      });
      new NetworkConnector(stack, 'Connector', {
        configuration: vpcEgress({ vpc: vpcWithPublic, vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED } }),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::NetworkConnector', {
        Configuration: {
          VpcEgressConfiguration: Match.objectLike({
            SubnetIds: [
              { Ref: Match.stringLikeRegexp('^Vpc2isolatedSubnet1') },
              { Ref: Match.stringLikeRegexp('^Vpc2isolatedSubnet2') },
            ],
          }),
        },
      });
    });

    test('omits Name unless one is given', () => {
      new NetworkConnector(stack, 'Connector', {
        configuration: vpcEgress(),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::NetworkConnector', {
        Name: Match.absent(),
      });
    });

    test('passes networkConnectorName through as Name', () => {
      new NetworkConnector(stack, 'Connector', {
        configuration: vpcEgress({
          computeType: NetworkConnectorComputeType.MICRO_VM,
          networkProtocol: NetworkProtocol.DUAL_STACK,
        }),
        networkConnectorName: 'prod-egress',
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::NetworkConnector', {
        Name: 'prod-egress',
        Configuration: {
          VpcEgressConfiguration: Match.objectLike({
            AssociatedComputeResourceTypes: ['MicroVm'],
            NetworkProtocol: 'DualStack',
          }),
        },
      });
    });

    test('accepts a security group reference that is not an L2', () => {
      const cfnGroup = new ec2.CfnSecurityGroup(stack, 'CfnSg', {
        groupDescription: 'reference only',
        vpcId: vpc.vpcId,
      });

      new NetworkConnector(stack, 'Connector', {
        configuration: vpcEgress({ securityGroups: [cfnGroup] }),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::NetworkConnector', {
        Configuration: {
          VpcEgressConfiguration: Match.objectLike({
            SecurityGroupIds: [{ Ref: stack.getLogicalId(cfnGroup) }],
          }),
        },
      });
    });
  });

  describe('operator role', () => {
    test('creates one with the operator managed policy by default', () => {
      new NetworkConnector(stack, 'Connector', {
        configuration: vpcEgress(),
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Role', {
        AssumeRolePolicyDocument: {
          Statement: [{
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: { Service: 'lambda.amazonaws.com' },
          }],
        },
        ManagedPolicyArns: [{
          'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/AWSLambdaNetworkConnectorOperatorPolicy']],
        }],
      });
      template.hasResourceProperties('AWS::Lambda::NetworkConnector', {
        OperatorRole: { 'Fn::GetAtt': [Match.stringLikeRegexp('^ConnectorOperatorRole'), 'Arn'] },
      });
    });

    test('uses the given role and creates none', () => {
      const role = new iam.Role(stack, 'CustomRole', { assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com') });
      const connector = new NetworkConnector(stack, 'Connector', {
        configuration: vpcEgress(),
        operatorRole: role,
      });

      const template = Template.fromStack(stack);
      template.resourceCountIs('AWS::IAM::Role', 1);
      template.hasResourceProperties('AWS::Lambda::NetworkConnector', {
        OperatorRole: { 'Fn::GetAtt': [Match.stringLikeRegexp('^CustomRole'), 'Arn'] },
      });
      expect(connector.operatorRole).toBe(role);
    });

    test('attaches the operator managed policy to a given role defined in the app', () => {
      const role = new iam.Role(stack, 'CustomRole', { assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com') });
      new NetworkConnector(stack, 'Connector', {
        configuration: vpcEgress(),
        operatorRole: role,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
        ManagedPolicyArns: [{
          'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/AWSLambdaNetworkConnectorOperatorPolicy']],
        }],
      });
      Annotations.fromStack(stack).hasNoWarning('*', Match.stringLikeRegexp('networkConnectorOperatorRoleNotModified'));
    });

    test('warns instead of modifying an imported role', () => {
      const role = iam.Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::123456789012:role/operator');
      new NetworkConnector(stack, 'Connector', {
        configuration: vpcEgress(),
        operatorRole: role,
      });

      const annotations = Annotations.fromStack(stack);
      annotations.hasWarning('/Stack/Connector', Match.stringLikeRegexp(
        "operator role 'arn:aws:iam::123456789012:role/operator' \\(Stack/ImportedRole\\) cannot be modified.*AWSLambdaNetworkConnectorOperatorPolicy"));
      // The IAM module's own, less specific warning is not triggered.
      annotations.hasNoWarning('*', Match.stringLikeRegexp('IRoleCantBeUsedWithIManagedPolicy'));
      Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 0);
    });

    test('names a role defined in the app by path only, since its ARN is a token', () => {
      // A LazyRole has no default child until instantiated, so it takes the warning path.
      const role = new iam.LazyRole(stack, 'LazyRole', { assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com') });
      new NetworkConnector(stack, 'Connector', {
        configuration: vpcEgress(),
        operatorRole: role,
      });

      Annotations.fromStack(stack).hasWarning('/Stack/Connector', Match.stringLikeRegexp(
        "operator role 'Stack/LazyRole' cannot be modified"));
    });
  });

  describe('attributes', () => {
    test('exposes both ARNs as attributes of the L1', () => {
      const connector = new NetworkConnector(stack, 'Connector', {
        configuration: vpcEgress(),
      });

      expect(stack.resolve(connector.networkConnectorArn)).toEqual({ 'Fn::GetAtt': [expect.stringMatching(/^Connector/), 'Arn'] });
      expect(stack.resolve(connector.latestVersionArn)).toEqual({ 'Fn::GetAtt': [expect.stringMatching(/^Connector/), 'LatestVersionArn'] });
    });

    test('networkConnectorRef carries the unqualified ARN', () => {
      const connector = new NetworkConnector(stack, 'Connector', {
        configuration: vpcEgress(),
      });

      expect(stack.resolve(connector.networkConnectorRef.networkConnectorArn))
        .toEqual(stack.resolve(connector.networkConnectorArn));
    });

    test('does not derive the ARN from the name in another account', () => {
      // The ARN carries a service-assigned id, so a name-based ARN would point at nothing.
      const connector = new NetworkConnector(stack, 'Connector', {
        configuration: vpcEgress(),
        networkConnectorName: 'prod-egress',
      });
      const other = new Stack(stack.node.root as App, 'Other', { env: { account: '111111111111', region: 'us-west-2' } });
      new CfnOutput(other, 'Arn', { value: connector.networkConnectorArn });

      const output = JSON.stringify(Template.fromStack(other).findOutputs('Arn'));
      expect(output).not.toContain('network-connector:prod-egress');
      expect(output).toContain('Fn::GetStackOutput');
    });
  });

  describe('import', () => {
    test('fromNetworkConnectorVersionArn provides both ARNs', () => {
      const imported = NetworkConnector.fromNetworkConnectorVersionArn(stack, 'Imported', VERSION_ARN);

      expect(imported.latestVersionArn).toEqual(VERSION_ARN);
      expect(stack.resolve(imported.networkConnectorArn)).toEqual(CONNECTOR_ARN);
      expect(imported.networkConnectorRef.networkConnectorArn).toEqual(imported.networkConnectorArn);
    });

    test('fromNetworkConnectorVersionArn rejects an ARN without a version', () => {
      expect(() => NetworkConnector.fromNetworkConnectorVersionArn(stack, 'Imported', CONNECTOR_ARN))
        .toThrow(/Expected a qualified network connector ARN ending in ':<version>'/);
    });

    test('fromNetworkConnectorVersionArn accepts a deploy-time value and drops its version segment', () => {
      // A token cannot be inspected at synth; the unqualified ARN is rebuilt from the segments
      // before the version, which Arn.split selects for a token.
      const versionArn = new CfnParameter(stack, 'VersionArn').valueAsString;
      const imported = NetworkConnector.fromNetworkConnectorVersionArn(stack, 'Imported', versionArn);

      expect(stack.resolve(imported.latestVersionArn)).toEqual({ Ref: 'VersionArn' });
      const unqualified = JSON.stringify(stack.resolve(imported.networkConnectorArn));
      expect(unqualified).toContain('"Fn::Select":[6,');
      expect(unqualified).not.toContain('"Fn::Select":[7,');
    });

    test('fromNetworkConnectorArn provides the unqualified ARN and refuses the version ARN', () => {
      const imported = NetworkConnector.fromNetworkConnectorArn(stack, 'Imported', CONNECTOR_ARN);

      expect(imported.networkConnectorArn).toEqual(CONNECTOR_ARN);
      expect(() => imported.latestVersionArn).toThrow(/imported without a version/);
    });

    test('fromNetworkConnectorArn rejects an ARN with a version', () => {
      expect(() => NetworkConnector.fromNetworkConnectorArn(stack, 'Imported', VERSION_ARN))
        .toThrow(/Expected an unqualified network connector ARN, got '.*:3', which ends in a version.*fromNetworkConnectorVersionArn/);
    });

    test('fromNetworkConnectorArn accepts a deploy-time value', () => {
      const arn = new CfnParameter(stack, 'ConnectorArn').valueAsString;
      const imported = NetworkConnector.fromNetworkConnectorArn(stack, 'Imported', arn);

      expect(stack.resolve(imported.networkConnectorArn)).toEqual({ Ref: 'ConnectorArn' });
    });

    test('imports take their environment from the ARN', () => {
      const other = new Stack(new App(), 'Other', { env: { account: '111111111111', region: 'eu-west-1' } });
      const imported = NetworkConnector.fromNetworkConnectorArn(other, 'Imported', CONNECTOR_ARN);

      expect(imported.env).toEqual({ account: '123456789012', region: 'us-west-2' });
    });

    test('imports add nothing to the template', () => {
      NetworkConnector.fromNetworkConnectorVersionArn(stack, 'Imported', VERSION_ARN);

      Template.fromStack(stack).resourceCountIs('AWS::Lambda::NetworkConnector', 0);
    });
  });

  describe('validation', () => {
    test('rejects a selection with no subnets', () => {
      expect(() => new NetworkConnector(stack, 'Connector', {
        configuration: vpcEgress({ vpcSubnets: { subnets: [] } }),
      })).toThrow(/vpcSubnets must select between 1 and 16 subnets, got 0/);
    });

    test('rejects a selection of more than 16 subnets', () => {
      const subnets = Array.from({ length: 17 }, (_, i) =>
        ec2.Subnet.fromSubnetId(stack, `Subnet${i}`, `subnet-${i.toString().padStart(8, '0')}`));
      expect(() => new NetworkConnector(stack, 'Connector', {
        configuration: vpcEgress({ vpcSubnets: { subnets } }),
      })).toThrow(/vpcSubnets must select between 1 and 16 subnets, got 17/);
    });

    test('rejects an empty security group list', () => {
      expect(() => new NetworkConnector(stack, 'Connector', {
        configuration: vpcEgress({ securityGroups: [] }),
      })).toThrow(/securityGroups must contain between 1 and 5 items, got 0/);
    });

    test('rejects more than 5 security groups', () => {
      const securityGroups = Array.from({ length: 6 }, (_, i) =>
        ec2.SecurityGroup.fromSecurityGroupId(stack, `ExtraSg${i}`, `sg-${i.toString().padStart(8, '0')}`));
      expect(() => new NetworkConnector(stack, 'Connector', {
        configuration: vpcEgress({ securityGroups }),
      })).toThrow(/securityGroups must contain between 1 and 5 items, got 6/);
    });
  });
});
