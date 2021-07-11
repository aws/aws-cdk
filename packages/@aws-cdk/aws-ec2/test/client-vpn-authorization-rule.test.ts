import '@aws-cdk/assert-internal/jest';
import { SamlMetadataDocument, SamlProvider } from '@aws-cdk/aws-iam';
import { Stack } from '@aws-cdk/core';
import * as ec2 from '../lib';
import { Connections, IClientVpnEndpoint } from '../lib';
import { ClientVpnAuthorizationRule } from '../lib/client-vpn-authorization-rule';
import { ClientVpnUserBasedAuthentication } from '../lib/client-vpn-endpoint';

let stack: Stack;
let vpc: ec2.IVpc;
beforeEach(() => {
  stack = new Stack();
  vpc = new ec2.Vpc(stack, 'Vpc');
});

test('client vpn endpoint', () => {
  const samlProvider = new SamlProvider(stack, 'Provider', {
    metadataDocument: SamlMetadataDocument.fromXml('xml'),
  });

  vpc.addClientVpnEndpoint('Endpoint', {
    cidr: '10.100.0.0/16',
    serverCertificateArn: 'server-certificate-arn',
    clientCertificateArn: 'client-certificate-arn',
    clientConnectionHandler: {
      functionArn: 'function-arn',
      functionName: 'AWSClientVPN-function-name',
    },
    dnsServers: ['8.8.8.8', '8.8.4.4'],
    userBasedAuthentication: ClientVpnUserBasedAuthentication.federated(samlProvider),
  });

  expect(stack).toHaveResource('AWS::EC2::ClientVpnEndpoint', {
    AuthenticationOptions: [
      {
        MutualAuthentication: {
          ClientRootCertificateChainArn: 'client-certificate-arn',
        },
        Type: 'certificate-authentication',
      },
      {
        FederatedAuthentication: {
          SAMLProviderArn: {
            Ref: 'Provider2281708E',
          },
        },
        Type: 'federated-authentication',
      },
    ],
    ClientCidrBlock: '10.100.0.0/16',
    ConnectionLogOptions: {
      CloudwatchLogGroup: {
        Ref: 'VpcEndpointLogGroup96A18897',
      },
      Enabled: true,
    },
    ServerCertificateArn: 'server-certificate-arn',
    ClientConnectOptions: {
      Enabled: true,
      LambdaFunctionArn: 'function-arn',
    },
    DnsServers: ['8.8.8.8', '8.8.4.4'],
    SecurityGroupIds: [
      {
        'Fn::GetAtt': ['VpcEndpointSecurityGroup7B25EFDC', 'GroupId'],
      },
    ],
    VpcId: {
      Ref: 'Vpc8378EB38',
    },
  });

  expect(stack).toCountResources('AWS::EC2::ClientVpnTargetNetworkAssociation', 2);

  expect(stack).toHaveResource('AWS::EC2::ClientVpnTargetNetworkAssociation', {
    ClientVpnEndpointId: {
      Ref: 'VpcEndpoint6FF034F6',
    },
    SubnetId: {
      Ref: 'VpcPrivateSubnet1Subnet536B997A',
    },
  });

  expect(stack).toHaveResource('AWS::EC2::ClientVpnTargetNetworkAssociation', {
    ClientVpnEndpointId: {
      Ref: 'VpcEndpoint6FF034F6',
    },
    SubnetId: {
      Ref: 'VpcPrivateSubnet2Subnet3788AAA1',
    },
  });

  expect(stack).toHaveOutput({
    outputName: 'VpcEndpointSelfServicePortalUrl760AFE23',
    outputValue: {
      'Fn::Join': [
        '',
        [
          'https://self-service.clientvpn.amazonaws.com/endpoints/',
          {
            Ref: 'VpcEndpoint6FF034F6',
          },
        ],
      ],
    },
  });

  expect(stack).toHaveResource('AWS::EC2::ClientVpnAuthorizationRule', {
    ClientVpnEndpointId: {
      Ref: 'VpcEndpoint6FF034F6',
    },
    TargetNetworkCidr: {
      'Fn::GetAtt': ['Vpc8378EB38', 'CidrBlock'],
    },
    AuthorizeAllGroups: true,
  });
});

test('client vpn endpoint with custom authorization rules', () => {
  const endpoint = vpc.addClientVpnEndpoint('Endpoint', {
    cidr: '10.100.0.0/16',
    serverCertificateArn: 'server-certificate-arn',
    clientCertificateArn: 'client-certificate-arn',
    authorizeAllUsersToVpcCidr: false,
  });

  endpoint.addAuthorizationRule('Rule', {
    cidr: '10.0.10.0/32',
    groupId: 'group-id',
  });

  expect(stack).toCountResources('AWS::EC2::ClientVpnAuthorizationRule', 1);

  expect(stack).toHaveResource('AWS::EC2::ClientVpnAuthorizationRule', {
    ClientVpnEndpointId: {
      Ref: 'VpcEndpoint6FF034F6',
    },
    TargetNetworkCidr: '10.0.10.0/32',
    AccessGroupId: 'group-id',
    AuthorizeAllGroups: false,
  });
});

describe('ClientVpnAuthorizationRule constructor', () => {
  test('normal usage', () => {
    const clientVpnEndpoint: IClientVpnEndpoint = {
      endpointId: 'myClientVpnEndpoint',
      targetNetworksAssociated: [],
      stack,
      env: { account: 'myAccount', region: 'us-east-1' },
      connections: new Connections(),
      node: stack.node,
    };
    new ClientVpnAuthorizationRule(stack, 'Rule', { cidr: '10.0.10.0/32', clientVpnEndpoint });
    expect(stack).toCountResources('AWS::EC2::ClientVpnAuthorizationRule', 1);
    expect(stack.node.children.length).toBe(2);
  });
  test('either clientVpnEndoint (deprecated, typo) or clientVpnEndpoint is required', () => {
    expect(() => {
      new ClientVpnAuthorizationRule(stack, 'Rule', { cidr: '10.0.10.0/32' });
    }).toThrow(
      new Error(
        'ClientVpnAuthorizationRule: either clientVpnEndpoint or clientVpnEndoint (deprecated) must be specified',
      ),
    );
  });
  test('specifying both clientVpnEndoint (deprecated, typo) and clientVpnEndpoint is not allowed', () => {
    const clientVpnEndoint: IClientVpnEndpoint = {
      endpointId: 'typoTypo',
      targetNetworksAssociated: [],
      stack,
      env: { account: 'myAccount', region: 'us-east-1' },
      connections: new Connections(),
      node: stack.node,
    };
    const clientVpnEndpoint: IClientVpnEndpoint = {
      endpointId: 'myClientVpnEndpoint',
      targetNetworksAssociated: [],
      stack,
      env: { account: 'myAccount', region: 'us-east-1' },
      connections: new Connections(),
      node: stack.node,
    };
    expect(() => {
      new ClientVpnAuthorizationRule(stack, 'Rule', {
        cidr: '10.0.10.0/32',
        clientVpnEndoint,
        clientVpnEndpoint,
      });
    }).toThrow(
      new Error(
        'ClientVpnAuthorizationRule: either clientVpnEndpoint or clientVpnEndoint (deprecated) must be specified' +
          ', but not both',
      ),
    );
  });
  test('invalid constructor calls should not add anything to the stack', () => {
    expect(() => {
      new ClientVpnAuthorizationRule(stack, 'InvalidRule', { cidr: '10.0.10.0/32' });
    }).toThrow();
    expect(stack.node.children.length).toBe(1);
  });
});
