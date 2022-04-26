import { Template } from '@aws-cdk/assertions';
import { SamlMetadataDocument, SamlProvider } from '@aws-cdk/aws-iam';
import * as logs from '@aws-cdk/aws-logs';
import { Stack } from '@aws-cdk/core';
import * as ec2 from '../lib';
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
    clientConnectionHandler: { functionArn: 'function-arn', functionName: 'AWSClientVPN-function-name' },
    dnsServers: ['8.8.8.8', '8.8.4.4'],
    userBasedAuthentication: ClientVpnUserBasedAuthentication.federated(samlProvider),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::EC2::ClientVpnEndpoint', {
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
    DnsServers: [
      '8.8.8.8',
      '8.8.4.4',
    ],
    SecurityGroupIds: [
      {
        'Fn::GetAtt': [
          'VpcEndpointSecurityGroup7B25EFDC',
          'GroupId',
        ],
      },
    ],
    VpcId: {
      Ref: 'Vpc8378EB38',
    },
  });

  Template.fromStack(stack).resourceCountIs('AWS::EC2::ClientVpnTargetNetworkAssociation', 2);

  Template.fromStack(stack).hasResourceProperties('AWS::EC2::ClientVpnTargetNetworkAssociation', {
    ClientVpnEndpointId: {
      Ref: 'VpcEndpoint6FF034F6',
    },
    SubnetId: {
      Ref: 'VpcPrivateSubnet1Subnet536B997A',
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::EC2::ClientVpnTargetNetworkAssociation', {
    ClientVpnEndpointId: {
      Ref: 'VpcEndpoint6FF034F6',
    },
    SubnetId: {
      Ref: 'VpcPrivateSubnet2Subnet3788AAA1',
    },
  });

  Template.fromStack(stack).hasOutput('VpcEndpointSelfServicePortalUrl760AFE23', {
    Value: {
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

  Template.fromStack(stack).hasResourceProperties('AWS::EC2::ClientVpnAuthorizationRule', {
    ClientVpnEndpointId: {
      Ref: 'VpcEndpoint6FF034F6',
    },
    TargetNetworkCidr: {
      'Fn::GetAtt': [
        'Vpc8378EB38',
        'CidrBlock',
      ],
    },
    AuthorizeAllGroups: true,
  });
});

test('client vpn endpoint with custom security groups', () => {
  vpc.addClientVpnEndpoint('Endpoint', {
    cidr: '10.100.0.0/16',
    serverCertificateArn: 'server-certificate-arn',
    clientCertificateArn: 'client-certificate-arn',
    securityGroups: [
      new ec2.SecurityGroup(stack, 'SG1', { vpc }),
      new ec2.SecurityGroup(stack, 'SG2', { vpc }),
    ],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::EC2::ClientVpnEndpoint', {
    SecurityGroupIds: [
      {
        'Fn::GetAtt': [
          'SG1BA065B6E',
          'GroupId',
        ],
      },
      {
        'Fn::GetAtt': [
          'SG20CE3219C',
          'GroupId',
        ],
      },
    ],
  });
});

test('client vpn endpoint with custom logging', () => {
  const logGroup = new logs.LogGroup(stack, 'LogGroup', {
    retention: logs.RetentionDays.TWO_MONTHS,
  });
  vpc.addClientVpnEndpoint('Endpoint', {
    cidr: '10.100.0.0/16',
    serverCertificateArn: 'server-certificate-arn',
    clientCertificateArn: 'client-certificate-arn',
    logGroup,
    logStream: logGroup.addStream('LogStream'),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::EC2::ClientVpnEndpoint', {
    ConnectionLogOptions: {
      CloudwatchLogGroup: {
        Ref: 'LogGroupF5B46931',
      },
      CloudwatchLogStream: {
        Ref: 'LogGroupLogStream245D76D6',
      },
      Enabled: true,
    },
  });
});

test('client vpn endpoint with logging disabled', () => {
  vpc.addClientVpnEndpoint('Endpoint', {
    cidr: '10.100.0.0/16',
    serverCertificateArn: 'server-certificate-arn',
    clientCertificateArn: 'client-certificate-arn',
    logging: false,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::EC2::ClientVpnEndpoint', {
    ConnectionLogOptions: {
      Enabled: false,
    },
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

  Template.fromStack(stack).resourceCountIs('AWS::EC2::ClientVpnAuthorizationRule', 1);

  Template.fromStack(stack).hasResourceProperties('AWS::EC2::ClientVpnAuthorizationRule', {
    ClientVpnEndpointId: {
      Ref: 'VpcEndpoint6FF034F6',
    },
    TargetNetworkCidr: '10.0.10.0/32',
    AccessGroupId: 'group-id',
    AuthorizeAllGroups: false,
  });
});

test('client vpn endpoint with custom route', () => {
  const endpoint = vpc.addClientVpnEndpoint('Endpoint', {
    cidr: '10.100.0.0/16',
    serverCertificateArn: 'server-certificate-arn',
    clientCertificateArn: 'client-certificate-arn',
    authorizeAllUsersToVpcCidr: false,
  });

  endpoint.addRoute('Route', {
    cidr: '10.100.0.0/16',
    target: ec2.ClientVpnRouteTarget.local(),
  });

  Template.fromStack(stack).hasResource('AWS::EC2::ClientVpnRoute', {
    Properties: {
      ClientVpnEndpointId: {
        Ref: 'VpcEndpoint6FF034F6',
      },
      DestinationCidrBlock: '10.100.0.0/16',
      TargetVpcSubnetId: 'local',
    },
    DependsOn: [
      'VpcEndpointAssociation06B066321',
      'VpcEndpointAssociation12B51A67F',
    ],
  });
});

test('client vpn endpoint with custom session timeout', () => {
  vpc.addClientVpnEndpoint('Endpoint', {
    cidr: '10.100.0.0/16',
    serverCertificateArn: 'server-certificate-arn',
    clientCertificateArn: 'client-certificate-arn',
    sessionTimeout: ec2.ClientVpnSessionTimeout.TEN_HOURS,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::EC2::ClientVpnEndpoint', {
    SessionTimeoutHours: 10,
  });
});

test('client vpn endpoint with client login banner', () => {
  vpc.addClientVpnEndpoint('Endpoint', {
    cidr: '10.100.0.0/16',
    serverCertificateArn: 'server-certificate-arn',
    clientCertificateArn: 'client-certificate-arn',
    clientLoginBanner: 'Welcome!',
  });

  Template.fromStack(stack).hasResourceProperties('AWS::EC2::ClientVpnEndpoint', {
    ClientLoginBannerOptions: {
      Enabled: true,
      BannerText: 'Welcome!',
    },
  });
});

test('throws with more than 2 dns servers', () => {
  expect(() => vpc.addClientVpnEndpoint('Endpoint', {
    cidr: '10.100.0.0/16',
    serverCertificateArn: 'server-certificate-arn',
    clientCertificateArn: 'client-certificate-arn',
    dnsServers: ['1.1.1.1', '2.2.2.2', '3.3.3.3'],
  })).toThrow(/A client VPN endpoint can have up to two DNS servers/);
});

test('throws when specifying logGroup with logging disabled', () => {
  expect(() => vpc.addClientVpnEndpoint('Endpoint', {
    cidr: '10.100.0.0/16',
    serverCertificateArn: 'server-certificate-arn',
    clientCertificateArn: 'client-certificate-arn',
    logging: false,
    logGroup: new logs.LogGroup(stack, 'LogGroup'),
  })).toThrow(/Cannot specify `logGroup` or `logStream` when logging is disabled/);
});

test('throws without authentication options', () => {
  expect(() => vpc.addClientVpnEndpoint('Endpoint', {
    cidr: '10.100.0.0/16',
    serverCertificateArn: 'server-certificate-arn',
  })).toThrow(/A client VPN endpoint must use at least one authentication option/);
});
