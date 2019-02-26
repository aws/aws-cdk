import { expect, haveResource,  } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { VpcNetwork } from '../lib';

export = {
  'can add a vpn connection to a vpc with a vpn gateway'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const vpc = new VpcNetwork(stack, 'VpcNetwork', {
      vpnGateway: true,
    });

    vpc.newVpnConnection('VpnConnection', {
      asn: 65001,
      ip: '192.0.2.1',
    });

    // THEN
    expect(stack).to(haveResource('AWS::EC2::CustomerGateway', {
      BgpAsn: 65001,
      IpAddress: '192.0.2.1',
      Type: 'ipsec.1'
    }));

    expect(stack).to(haveResource('AWS::EC2::VPNConnection', {
      CustomerGatewayId: {
        Ref: 'VpcNetworkVpnConnectionCustomerGateway8B56D9AF'
      },
      Type: 'ipsec.1',
      VpnGatewayId: {
        Ref: 'VpcNetworkVpnGateway501295FA'
      },
      StaticRoutesOnly: false,
    }));

    test.done();
  },

  'with static routing'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const vpc = new VpcNetwork(stack, 'VpcNetwork', {
      vpnGateway: true,
    });

    vpc.newVpnConnection('VpnConnection', {
      ip: '192.0.2.1',
      staticRoutes: [
        '192.168.10.0/24',
        '192.168.20.0/24'
      ]
    });

    // THEN
    expect(stack).to(haveResource('AWS::EC2::VPNConnection', {
      CustomerGatewayId: {
        Ref: 'VpcNetworkVpnConnectionCustomerGateway8B56D9AF'
      },
      Type: 'ipsec.1',
      VpnGatewayId: {
        Ref: 'VpcNetworkVpnGateway501295FA'
      },
      StaticRoutesOnly: true,
    }));

    expect(stack).to(haveResource('AWS::EC2::VPNConnectionRoute', {
      DestinationCidrBlock: '192.168.10.0/24',
      VpnConnectionId: {
        Ref: 'VpcNetworkVpnConnectionFB5C15BC'
      }
    }));

    expect(stack).to(haveResource('AWS::EC2::VPNConnectionRoute', {
      DestinationCidrBlock: '192.168.20.0/24',
      VpnConnectionId: {
        Ref: 'VpcNetworkVpnConnectionFB5C15BC'
      }
    }));

    test.done();
  },

  'fails when vpc has no vpn gateway'(test: Test) {
    // GIVEN
    const stack = new Stack();

    const vpc = new VpcNetwork(stack, 'VpcNetwork');

    test.throws(() => vpc.newVpnConnection('VpnConnection', {
      asn: 65000,
      ip: '192.0.2.1'
    }), /VPN gateway/);

    test.done();
  }
};
