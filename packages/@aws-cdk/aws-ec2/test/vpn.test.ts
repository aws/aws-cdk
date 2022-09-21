import { Template } from '@aws-cdk/assertions';
import { Duration, SecretValue, Stack, Token } from '@aws-cdk/core';
import { PublicSubnet, Vpc, VpnConnection } from '../lib';

describe('vpn', () => {
  test('can add a vpn connection to a vpc with a vpn gateway', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new Vpc(stack, 'VpcNetwork', {
      vpnConnections: {
        VpnConnection: {
          asn: 65001,
          ip: '192.0.2.1',
        },
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::CustomerGateway', {
      BgpAsn: 65001,
      IpAddress: '192.0.2.1',
      Type: 'ipsec.1',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPNConnection', {
      CustomerGatewayId: {
        Ref: 'VpcNetworkVpnConnectionCustomerGateway8B56D9AF',
      },
      Type: 'ipsec.1',
      VpnGatewayId: {
        Ref: 'VpcNetworkVpnGateway501295FA',
      },
      StaticRoutesOnly: false,
    });


  });

  test('with static routing', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new Vpc(stack, 'VpcNetwork', {
      vpnConnections: {
        static: {
          ip: '192.0.2.1',
          staticRoutes: [
            '192.168.10.0/24',
            '192.168.20.0/24',
          ],
        },
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPNConnection', {
      CustomerGatewayId: {
        Ref: 'VpcNetworkstaticCustomerGatewayAF2651CC',
      },
      Type: 'ipsec.1',
      VpnGatewayId: {
        Ref: 'VpcNetworkVpnGateway501295FA',
      },
      StaticRoutesOnly: true,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPNConnectionRoute', {
      DestinationCidrBlock: '192.168.10.0/24',
      VpnConnectionId: {
        Ref: 'VpcNetworkstaticE33EA98C',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPNConnectionRoute', {
      DestinationCidrBlock: '192.168.20.0/24',
      VpnConnectionId: {
        Ref: 'VpcNetworkstaticE33EA98C',
      },
    });


  });

  test.each([false, true])('with tunnel options, using secret: %p', (secret) => {
    // GIVEN
    const stack = new Stack();

    new Vpc(stack, 'VpcNetwork', {
      vpnConnections: {
        VpnConnection: {
          ip: '192.0.2.1',
          tunnelOptions: [
            secret
              ? {
                preSharedKeySecret: SecretValue.unsafePlainText('secretkey1234'),
                tunnelInsideCidr: '169.254.10.0/30',
              }
              : {
                preSharedKey: 'secretkey1234',
                tunnelInsideCidr: '169.254.10.0/30',
              },
          ],
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPNConnection', {
      CustomerGatewayId: {
        Ref: 'VpcNetworkVpnConnectionCustomerGateway8B56D9AF',
      },
      Type: 'ipsec.1',
      VpnGatewayId: {
        Ref: 'VpcNetworkVpnGateway501295FA',
      },
      StaticRoutesOnly: false,
      VpnTunnelOptionsSpecifications: [
        {
          PreSharedKey: 'secretkey1234',
          TunnelInsideCidr: '169.254.10.0/30',
        },
      ],
    });
  });

  test('fails when ip is invalid', () => {
    // GIVEN
    const stack = new Stack();

    expect(() => new Vpc(stack, 'VpcNetwork', {
      vpnConnections: {
        VpnConnection: {
          ip: '192.0.2.256',
        },
      },
    })).toThrow(/`ip`.+IPv4/);


  });

  test('fails when specifying more than two tunnel options', () => {
    // GIVEN
    const stack = new Stack();

    expect(() => new Vpc(stack, 'VpcNetwork', {
      vpnConnections: {
        VpnConnection: {
          ip: '192.0.2.1',
          tunnelOptions: [
            {
              preSharedKey: 'secretkey1234',
            },
            {
              preSharedKey: 'secretkey1234',
            },
            {
              preSharedKey: 'secretkey1234',
            },
          ],
        },
      },
    })).toThrow(/two.+`tunnelOptions`/);


  });

  test('fails with duplicate tunnel inside cidr', () => {
    // GIVEN
    const stack = new Stack();

    expect(() => new Vpc(stack, 'VpcNetwork', {
      vpnConnections: {
        VpnConnection: {
          ip: '192.0.2.1',
          tunnelOptions: [
            {
              tunnelInsideCidr: '169.254.10.0/30',
            },
            {
              tunnelInsideCidr: '169.254.10.0/30',
            },
          ],
        },
      },
    })).toThrow(/`tunnelInsideCidr`.+both tunnels/);


  });

  test('fails when specifying an invalid pre-shared key', () => {
    // GIVEN
    const stack = new Stack();

    expect(() => new Vpc(stack, 'VpcNetwork', {
      vpnConnections: {
        VpnConnection: {
          ip: '192.0.2.1',
          tunnelOptions: [
            {
              preSharedKey: '0invalid',
            },
          ],
        },
      },
    })).toThrow(/`preSharedKey`/);


  });

  test('fails when specifying a reserved tunnel inside cidr', () => {
    // GIVEN
    const stack = new Stack();

    expect(() => new Vpc(stack, 'VpcNetwork', {
      vpnConnections: {
        VpnConnection: {
          ip: '192.0.2.1',
          tunnelOptions: [
            {
              tunnelInsideCidr: '169.254.1.0/30',
            },
          ],
        },
      },
    })).toThrow(/`tunnelInsideCidr`.+reserved/);


  });

  test('fails when specifying an invalid tunnel inside cidr', () => {
    // GIVEN
    const stack = new Stack();

    expect(() => new Vpc(stack, 'VpcNetwork', {
      vpnConnections: {
        VpnConnection: {
          ip: '192.0.2.1',
          tunnelOptions: [
            {
              tunnelInsideCidr: '169.200.10.0/30',
            },
          ],
        },
      },
    })).toThrow(/`tunnelInsideCidr`.+size/);


  });

  test('can use metricTunnelState on a vpn connection', () => {
    // GIVEN
    const stack = new Stack();

    const vpc = new Vpc(stack, 'VpcNetwork', {
      vpnGateway: true,
    });

    const vpn = vpc.addVpnConnection('Vpn', {
      ip: '192.0.2.1',
    });

    // THEN
    expect(stack.resolve(vpn.metricTunnelState())).toEqual({
      dimensions: { VpnId: { Ref: 'VpcNetworkVpnA476C58D' } },
      namespace: 'AWS/VPN',
      metricName: 'TunnelState',
      period: Duration.minutes(5),
      statistic: 'Average',
    });


  });

  test('can import a vpn connection from attributes', () => {

    const stack = new Stack();

    const vpn = VpnConnection.fromVpnConnectionAttributes(stack, 'Connection', {
      vpnId: 'idv',
      customerGatewayIp: 'ip',
      customerGatewayId: 'idc',
      customerGatewayAsn: 6500,
    });

    expect(vpn.vpnId).toEqual('idv');
    expect(vpn.customerGatewayAsn).toEqual(6500);
    expect(vpn.customerGatewayId).toEqual('idc');
    expect(vpn.customerGatewayIp).toEqual('ip');

    expect(stack.resolve(vpn.metricTunnelState())).toEqual({
      dimensions: { VpnId: 'idv' },
      namespace: 'AWS/VPN',
      metricName: 'TunnelState',
      period: Duration.minutes(5),
      statistic: 'Average',
    });

    expect(stack.resolve(vpn.metricTunnelDataIn())).toEqual({
      dimensions: { VpnId: 'idv' },
      namespace: 'AWS/VPN',
      metricName: 'TunnelDataIn',
      period: Duration.minutes(5),
      statistic: 'Sum',
    });

    expect(stack.resolve(vpn.metricTunnelDataOut())).toEqual({
      dimensions: { VpnId: 'idv' },
      namespace: 'AWS/VPN',
      metricName: 'TunnelDataOut',
      period: Duration.minutes(5),
      statistic: 'Sum',
    });

  });

  test('can use metricAllTunnelDataOut', () => {
    // GIVEN
    const stack = new Stack();

    // THEN
    expect(stack.resolve(VpnConnection.metricAllTunnelDataOut())).toEqual({
      namespace: 'AWS/VPN',
      metricName: 'TunnelDataOut',
      period: Duration.minutes(5),
      statistic: 'Sum',
    });


  });

  test('fails when enabling vpnGateway without having subnets', () => {
    // GIVEN
    const stack = new Stack();

    expect(() => new Vpc(stack, 'VpcNetwork', {
      vpnGateway: true,
      subnetConfiguration: [],
    })).toThrow(/VPN gateway/);


  });

  test('can add a vpn connection later to a vpc that initially had no subnets', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const vpc = new Vpc(stack, 'VpcNetwork', {
      subnetConfiguration: [],
    });
    const subnet = new PublicSubnet(stack, 'Subnet', {
      vpcId: vpc.vpcId,
      availabilityZone: 'eu-central-1a',
      cidrBlock: '10.0.0.0/28',
    });
    vpc.publicSubnets.push(subnet);
    vpc.addVpnConnection('VPNConnection', {
      ip: '1.2.3.4',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::CustomerGateway', {
      Type: 'ipsec.1',
    });

  });
  test('can add a vpn connection with a Token as customer gateway ip', () => {
    // GIVEN
    const stack = new Stack();
    const token = Token.asAny('192.0.2.1');

    // WHEN
    new Vpc(stack, 'VpcNetwork', {
      vpnConnections: {
        VpnConnection: {
          ip: token as any,
        },
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::CustomerGateway', {
      IpAddress: '192.0.2.1',
    });

  });
});
