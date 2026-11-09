import { Match, Template } from '../../../../assertions';
import * as ec2 from '../../../../aws-ec2';
import * as cdk from '../../../../core';
import { Gateway } from '../../../lib';
import { GatewayCredentialProvider } from '../../../lib/gateway/outbound-auth/credential-provider';
import type { PrivateEndpointFromVpcOptions } from '../../../lib/gateway/targets/private-endpoint';
import { EndpointIpAddressType, PrivateEndpoint } from '../../../lib/gateway/targets/private-endpoint';
import { GatewayTarget } from '../../../lib/gateway/targets/target';

describe('Gateway target private endpoint', () => {
  let stack: cdk.Stack;
  let gateway: Gateway;
  let vpc: ec2.Vpc;

  beforeEach(() => {
    const app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
    cdk.Validations.of(stack).acknowledge({ id: 'CloudFormation-Validate::F3002', reason: 'PrivateEndpoint is a newly launched property not yet in the bundled schema' });
    gateway = new Gateway(stack, 'TestGateway', { gatewayName: 'test-gateway' });
    vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, natGateways: 0 });
  });

  const addTarget = (privateEndpoint?: PrivateEndpoint) =>
    gateway.addMcpServerTarget('McpTarget', {
      gatewayTargetName: 'mcp-target',
      endpoint: 'https://mcp.internal.example.com/mcp',
      credentialProviderConfigurations: [GatewayCredentialProvider.fromIamRole()],
      privateEndpoint,
    });

  describe('fromVpc', () => {
    test('renders the VPC, default subnets and IPV4 by default', () => {
      addTarget(PrivateEndpoint.fromVpc({ vpc }));

      Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
        PrivateEndpoint: {
          ManagedVpcResource: {
            VpcIdentifier: { Ref: Match.stringLikeRegexp('Vpc') },
            SubnetIds: [
              { Ref: Match.stringLikeRegexp('VpcIsolatedSubnet1') },
              { Ref: Match.stringLikeRegexp('VpcIsolatedSubnet2') },
            ],
            EndpointIpAddressType: 'IPV4',
            SecurityGroupIds: Match.absent(),
            RoutingDomain: Match.absent(),
            Tags: Match.absent(),
          },
        },
      });
    });

    test('renders all options', () => {
      const securityGroup = new ec2.SecurityGroup(stack, 'Sg', { vpc });

      addTarget(PrivateEndpoint.fromVpc({
        vpc,
        vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
        securityGroups: [securityGroup],
        ipAddressType: EndpointIpAddressType.IPV6,
        routingDomain: 'internal-alb.example.com',
        tags: { team: 'agents' },
      }));

      Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
        PrivateEndpoint: {
          ManagedVpcResource: {
            VpcIdentifier: { Ref: Match.stringLikeRegexp('Vpc') },
            SubnetIds: [
              { Ref: Match.stringLikeRegexp('VpcPublicSubnet1') },
              { Ref: Match.stringLikeRegexp('VpcPublicSubnet2') },
            ],
            SecurityGroupIds: [{ 'Fn::GetAtt': [Match.stringLikeRegexp('Sg'), 'GroupId'] }],
            EndpointIpAddressType: 'IPV6',
            RoutingDomain: 'internal-alb.example.com',
            Tags: { team: 'agents' },
          },
        },
      });
    });

    test('fails with more than 5 security groups', () => {
      const securityGroups = Array.from({ length: 6 }, (_, i) => new ec2.SecurityGroup(stack, `Sg${i}`, { vpc }));
      expect(() => PrivateEndpoint.fromVpc({ vpc, securityGroups })).toThrow(/at most 5 security groups/);
    });

    test.each(['ab', 'a'.repeat(256)])('fails with a routingDomain of invalid length %#', (routingDomain) => {
      expect(() => PrivateEndpoint.fromVpc({ vpc, routingDomain })).toThrow(/routingDomain must be 3 to 255 characters long/);
    });

    test('fails with the reserved tag key', () => {
      expect(() => PrivateEndpoint.fromVpc({ vpc, tags: { BedrockAgentCoreGatewayManaged: 'true' } }))
        .toThrow(/"BedrockAgentCoreGatewayManaged" is reserved/);
    });

    test('fails with more than 50 tags', () => {
      const tags = Object.fromEntries(Array.from({ length: 51 }, (_, i) => [`k${i}`, 'v']));
      expect(() => PrivateEndpoint.fromVpc({ vpc, tags })).toThrow(/at most 50 tags/);
    });

    test('skips validation of unresolved tokens', () => {
      const options: PrivateEndpointFromVpcOptions = {
        vpc,
        routingDomain: cdk.Lazy.string({ produce: () => 'ab' }),
        tags: cdk.Token.asAny(cdk.Lazy.any({ produce: () => ({}) })) as any,
      };
      expect(() => PrivateEndpoint.fromVpc(options)).not.toThrow();
    });
  });

  describe('fromResourceConfiguration', () => {
    test('renders the resource configuration identifier', () => {
      addTarget(PrivateEndpoint.fromResourceConfiguration('rcfg-0123456789abcdef0'));

      Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
        PrivateEndpoint: {
          SelfManagedLatticeResource: { ResourceConfigurationIdentifier: 'rcfg-0123456789abcdef0' },
        },
      });
    });

    test('fails with an empty identifier', () => {
      expect(() => PrivateEndpoint.fromResourceConfiguration('')).toThrow(/must not be empty/);
    });
  });

  test('omits PrivateEndpoint by default', () => {
    addTarget();

    Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
      PrivateEndpoint: Match.absent(),
    });
  });

  test('is forwarded by the static factory methods', () => {
    GatewayTarget.forMcpServer(stack, 'Target', {
      gateway,
      gatewayTargetName: 'factory-target',
      endpoint: 'https://mcp.internal.example.com/mcp',
      credentialProviderConfigurations: [GatewayCredentialProvider.fromIamRole()],
      privateEndpoint: PrivateEndpoint.fromResourceConfiguration('rcfg-0123456789abcdef0'),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
      Name: 'factory-target',
      PrivateEndpoint: {
        SelfManagedLatticeResource: { ResourceConfigurationIdentifier: 'rcfg-0123456789abcdef0' },
      },
    });
  });
});
