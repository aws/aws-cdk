import { expect, haveResource,  } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { VpcNetwork } from '../lib';

export = {
  'can add a vpn connection to a vpc with a vpn gateway'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new VpcNetwork(stack, 'VpcNetwork', {
      vpnConnections: {
        VpnConnection: {
          asn: 65001,
          ip: '192.0.2.1'
        }
      }
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
    new VpcNetwork(stack, 'VpcNetwork', {
      vpnConnections: {
        static: {
          ip: '192.0.2.1',
          staticRoutes: [
            '192.168.10.0/24',
            '192.168.20.0/24'
          ]
        }
      }
    });

    // THEN
    expect(stack).to(haveResource('AWS::EC2::VPNConnection', {
      CustomerGatewayId: {
        Ref: 'VpcNetworkstaticCustomerGatewayAF2651CC'
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
        Ref: 'VpcNetworkstaticE33EA98C'
      }
    }));

    expect(stack).to(haveResource('AWS::EC2::VPNConnectionRoute', {
      DestinationCidrBlock: '192.168.20.0/24',
      VpnConnectionId: {
        Ref: 'VpcNetworkstaticE33EA98C'
      }
    }));

    test.done();
  },

  'fails when vpc has no vpn gateway'(test: Test) {
    // GIVEN
    const stack = new Stack();

    const vpc = new VpcNetwork(stack, 'VpcNetwork');

    test.throws(() => vpc.addVpnConnection('VpnConnection', {
      asn: 65000,
      ip: '192.0.2.1'
    }), /VPN gateway/);

    test.done();
  },

  'fails when specifying vpnConnections with vpnGateway set to false'(test: Test) {
    // GIVEN
    const stack = new Stack();

    test.throws(() => new VpcNetwork(stack, 'VpcNetwork', {
      vpnGateway: false,
      vpnConnections: {
        VpnConnection: {
          asn: 65000,
          ip: '192.0.2.1'
        }
      }
    }), /`vpnConnections`.+`vpnGateway`.+false/);

    test.done();
  }
};
