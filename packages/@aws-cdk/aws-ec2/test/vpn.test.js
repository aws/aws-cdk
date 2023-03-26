"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('vpn', () => {
    test('can add a vpn connection to a vpc with a vpn gateway', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.Vpc(stack, 'VpcNetwork', {
            vpnConnections: {
                VpnConnection: {
                    asn: 65001,
                    ip: '192.0.2.1',
                },
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::CustomerGateway', {
            BgpAsn: 65001,
            IpAddress: '192.0.2.1',
            Type: 'ipsec.1',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPNConnection', {
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
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.Vpc(stack, 'VpcNetwork', {
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPNConnection', {
            CustomerGatewayId: {
                Ref: 'VpcNetworkstaticCustomerGatewayAF2651CC',
            },
            Type: 'ipsec.1',
            VpnGatewayId: {
                Ref: 'VpcNetworkVpnGateway501295FA',
            },
            StaticRoutesOnly: true,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPNConnectionRoute', {
            DestinationCidrBlock: '192.168.10.0/24',
            VpnConnectionId: {
                Ref: 'VpcNetworkstaticE33EA98C',
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPNConnectionRoute', {
            DestinationCidrBlock: '192.168.20.0/24',
            VpnConnectionId: {
                Ref: 'VpcNetworkstaticE33EA98C',
            },
        });
    });
    test('with tunnel options, using secret value', () => {
        // GIVEN
        const stack = new core_1.Stack();
        new lib_1.Vpc(stack, 'VpcNetwork', {
            vpnConnections: {
                VpnConnection: {
                    ip: '192.0.2.1',
                    tunnelOptions: [{
                            preSharedKeySecret: core_1.SecretValue.unsafePlainText('secretkey1234'),
                            tunnelInsideCidr: '169.254.10.0/30',
                        }],
                },
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPNConnection', {
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
    cdk_build_tools_1.testDeprecated('with tunnel options, using secret', () => {
        // GIVEN
        const stack = new core_1.Stack();
        new lib_1.Vpc(stack, 'VpcNetwork', {
            vpnConnections: {
                VpnConnection: {
                    ip: '192.0.2.1',
                    tunnelOptions: [{
                            preSharedKey: 'secretkey1234',
                            tunnelInsideCidr: '169.254.10.0/30',
                        }],
                },
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPNConnection', {
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
        const stack = new core_1.Stack();
        expect(() => new lib_1.Vpc(stack, 'VpcNetwork', {
            vpnConnections: {
                VpnConnection: {
                    ip: '192.0.2.256',
                },
            },
        })).toThrow(/`ip`.+IPv4/);
    });
    test('fails when specifying more than two tunnel options', () => {
        // GIVEN
        const stack = new core_1.Stack();
        expect(() => new lib_1.Vpc(stack, 'VpcNetwork', {
            vpnConnections: {
                VpnConnection: {
                    ip: '192.0.2.1',
                    tunnelOptions: [
                        {
                            preSharedKeySecret: core_1.SecretValue.unsafePlainText('secretkey1234'),
                        },
                        {
                            preSharedKeySecret: core_1.SecretValue.unsafePlainText('secretkey1234'),
                        },
                        {
                            preSharedKeySecret: core_1.SecretValue.unsafePlainText('secretkey1234'),
                        },
                    ],
                },
            },
        })).toThrow(/two.+`tunnelOptions`/);
    });
    test('fails with duplicate tunnel inside cidr', () => {
        // GIVEN
        const stack = new core_1.Stack();
        expect(() => new lib_1.Vpc(stack, 'VpcNetwork', {
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
    cdk_build_tools_1.testDeprecated('fails when specifying an invalid pre-shared key', () => {
        // GIVEN
        const stack = new core_1.Stack();
        expect(() => new lib_1.Vpc(stack, 'VpcNetwork', {
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
        const stack = new core_1.Stack();
        expect(() => new lib_1.Vpc(stack, 'VpcNetwork', {
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
        const stack = new core_1.Stack();
        expect(() => new lib_1.Vpc(stack, 'VpcNetwork', {
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
        const stack = new core_1.Stack();
        const vpc = new lib_1.Vpc(stack, 'VpcNetwork', {
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
            period: core_1.Duration.minutes(5),
            statistic: 'Average',
        });
    });
    test('can import a vpn connection from attributes', () => {
        const stack = new core_1.Stack();
        const vpn = lib_1.VpnConnection.fromVpnConnectionAttributes(stack, 'Connection', {
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
            period: core_1.Duration.minutes(5),
            statistic: 'Average',
        });
        expect(stack.resolve(vpn.metricTunnelDataIn())).toEqual({
            dimensions: { VpnId: 'idv' },
            namespace: 'AWS/VPN',
            metricName: 'TunnelDataIn',
            period: core_1.Duration.minutes(5),
            statistic: 'Sum',
        });
        expect(stack.resolve(vpn.metricTunnelDataOut())).toEqual({
            dimensions: { VpnId: 'idv' },
            namespace: 'AWS/VPN',
            metricName: 'TunnelDataOut',
            period: core_1.Duration.minutes(5),
            statistic: 'Sum',
        });
    });
    test('can use metricAllTunnelDataOut', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // THEN
        expect(stack.resolve(lib_1.VpnConnection.metricAllTunnelDataOut())).toEqual({
            namespace: 'AWS/VPN',
            metricName: 'TunnelDataOut',
            period: core_1.Duration.minutes(5),
            statistic: 'Sum',
        });
    });
    test('fails when enabling vpnGateway without having subnets', () => {
        // GIVEN
        const stack = new core_1.Stack();
        expect(() => new lib_1.Vpc(stack, 'VpcNetwork', {
            vpnGateway: true,
            subnetConfiguration: [],
        })).toThrow(/VPN gateway/);
    });
    test('can add a vpn connection later to a vpc that initially had no subnets', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const vpc = new lib_1.Vpc(stack, 'VpcNetwork', {
            subnetConfiguration: [],
        });
        const subnet = new lib_1.PublicSubnet(stack, 'Subnet', {
            vpcId: vpc.vpcId,
            availabilityZone: 'eu-central-1a',
            cidrBlock: '10.0.0.0/28',
        });
        vpc.publicSubnets.push(subnet);
        vpc.addVpnConnection('VPNConnection', {
            ip: '1.2.3.4',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::CustomerGateway', {
            Type: 'ipsec.1',
        });
    });
    test('can add a vpn connection with a Token as customer gateway ip', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const token = core_1.Token.asAny('192.0.2.1');
        // WHEN
        new lib_1.Vpc(stack, 'VpcNetwork', {
            vpnConnections: {
                VpnConnection: {
                    ip: token,
                },
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::CustomerGateway', {
            IpAddress: '192.0.2.1',
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnBuLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ2cG4udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyw4REFBMEQ7QUFDMUQsd0NBQW9FO0FBQ3BFLGdDQUEwRDtBQUUxRCxRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRTtJQUNuQixJQUFJLENBQUMsc0RBQXNELEVBQUUsR0FBRyxFQUFFO1FBQ2hFLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBRTFCLE9BQU87UUFDUCxJQUFJLFNBQUcsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO1lBQzNCLGNBQWMsRUFBRTtnQkFDZCxhQUFhLEVBQUU7b0JBQ2IsR0FBRyxFQUFFLEtBQUs7b0JBQ1YsRUFBRSxFQUFFLFdBQVc7aUJBQ2hCO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsMkJBQTJCLEVBQUU7WUFDM0UsTUFBTSxFQUFFLEtBQUs7WUFDYixTQUFTLEVBQUUsV0FBVztZQUN0QixJQUFJLEVBQUUsU0FBUztTQUNoQixDQUFDLENBQUM7UUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx5QkFBeUIsRUFBRTtZQUN6RSxpQkFBaUIsRUFBRTtnQkFDakIsR0FBRyxFQUFFLGdEQUFnRDthQUN0RDtZQUNELElBQUksRUFBRSxTQUFTO1lBQ2YsWUFBWSxFQUFFO2dCQUNaLEdBQUcsRUFBRSw4QkFBOEI7YUFDcEM7WUFDRCxnQkFBZ0IsRUFBRSxLQUFLO1NBQ3hCLENBQUMsQ0FBQztJQUdMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHFCQUFxQixFQUFFLEdBQUcsRUFBRTtRQUMvQixRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUUxQixPQUFPO1FBQ1AsSUFBSSxTQUFHLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtZQUMzQixjQUFjLEVBQUU7Z0JBQ2QsTUFBTSxFQUFFO29CQUNOLEVBQUUsRUFBRSxXQUFXO29CQUNmLFlBQVksRUFBRTt3QkFDWixpQkFBaUI7d0JBQ2pCLGlCQUFpQjtxQkFDbEI7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx5QkFBeUIsRUFBRTtZQUN6RSxpQkFBaUIsRUFBRTtnQkFDakIsR0FBRyxFQUFFLHlDQUF5QzthQUMvQztZQUNELElBQUksRUFBRSxTQUFTO1lBQ2YsWUFBWSxFQUFFO2dCQUNaLEdBQUcsRUFBRSw4QkFBOEI7YUFDcEM7WUFDRCxnQkFBZ0IsRUFBRSxJQUFJO1NBQ3ZCLENBQUMsQ0FBQztRQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDhCQUE4QixFQUFFO1lBQzlFLG9CQUFvQixFQUFFLGlCQUFpQjtZQUN2QyxlQUFlLEVBQUU7Z0JBQ2YsR0FBRyxFQUFFLDBCQUEwQjthQUNoQztTQUNGLENBQUMsQ0FBQztRQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDhCQUE4QixFQUFFO1lBQzlFLG9CQUFvQixFQUFFLGlCQUFpQjtZQUN2QyxlQUFlLEVBQUU7Z0JBQ2YsR0FBRyxFQUFFLDBCQUEwQjthQUNoQztTQUNGLENBQUMsQ0FBQztJQUdMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHlDQUF5QyxFQUFFLEdBQUcsRUFBRTtRQUNuRCxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUUxQixJQUFJLFNBQUcsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO1lBQzNCLGNBQWMsRUFBRTtnQkFDZCxhQUFhLEVBQUU7b0JBQ2IsRUFBRSxFQUFFLFdBQVc7b0JBQ2YsYUFBYSxFQUFFLENBQUM7NEJBQ2Qsa0JBQWtCLEVBQUUsa0JBQVcsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDOzRCQUNoRSxnQkFBZ0IsRUFBRSxpQkFBaUI7eUJBQ3BDLENBQUM7aUJBQ0g7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHlCQUF5QixFQUFFO1lBQ3pFLGlCQUFpQixFQUFFO2dCQUNqQixHQUFHLEVBQUUsZ0RBQWdEO2FBQ3REO1lBQ0QsSUFBSSxFQUFFLFNBQVM7WUFDZixZQUFZLEVBQUU7Z0JBQ1osR0FBRyxFQUFFLDhCQUE4QjthQUNwQztZQUNELGdCQUFnQixFQUFFLEtBQUs7WUFDdkIsOEJBQThCLEVBQUU7Z0JBQzlCO29CQUNFLFlBQVksRUFBRSxlQUFlO29CQUM3QixnQkFBZ0IsRUFBRSxpQkFBaUI7aUJBQ3BDO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILGdDQUFjLENBQUMsbUNBQW1DLEVBQUUsR0FBRyxFQUFFO1FBQ3ZELFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBRTFCLElBQUksU0FBRyxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7WUFDM0IsY0FBYyxFQUFFO2dCQUNkLGFBQWEsRUFBRTtvQkFDYixFQUFFLEVBQUUsV0FBVztvQkFDZixhQUFhLEVBQUUsQ0FBQzs0QkFDZCxZQUFZLEVBQUUsZUFBZTs0QkFDN0IsZ0JBQWdCLEVBQUUsaUJBQWlCO3lCQUNwQyxDQUFDO2lCQUNIO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx5QkFBeUIsRUFBRTtZQUN6RSxpQkFBaUIsRUFBRTtnQkFDakIsR0FBRyxFQUFFLGdEQUFnRDthQUN0RDtZQUNELElBQUksRUFBRSxTQUFTO1lBQ2YsWUFBWSxFQUFFO2dCQUNaLEdBQUcsRUFBRSw4QkFBOEI7YUFDcEM7WUFDRCxnQkFBZ0IsRUFBRSxLQUFLO1lBQ3ZCLDhCQUE4QixFQUFFO2dCQUM5QjtvQkFDRSxZQUFZLEVBQUUsZUFBZTtvQkFDN0IsZ0JBQWdCLEVBQUUsaUJBQWlCO2lCQUNwQzthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO1FBQ3BDLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBRTFCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLFNBQUcsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO1lBQ3hDLGNBQWMsRUFBRTtnQkFDZCxhQUFhLEVBQUU7b0JBQ2IsRUFBRSxFQUFFLGFBQWE7aUJBQ2xCO2FBQ0Y7U0FDRixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7SUFHNUIsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsb0RBQW9ELEVBQUUsR0FBRyxFQUFFO1FBQzlELFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBRTFCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLFNBQUcsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO1lBQ3hDLGNBQWMsRUFBRTtnQkFDZCxhQUFhLEVBQUU7b0JBQ2IsRUFBRSxFQUFFLFdBQVc7b0JBQ2YsYUFBYSxFQUFFO3dCQUNiOzRCQUNFLGtCQUFrQixFQUFFLGtCQUFXLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQzt5QkFDakU7d0JBQ0Q7NEJBQ0Usa0JBQWtCLEVBQUUsa0JBQVcsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDO3lCQUNqRTt3QkFDRDs0QkFDRSxrQkFBa0IsRUFBRSxrQkFBVyxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUM7eUJBQ2pFO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztJQUd0QyxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx5Q0FBeUMsRUFBRSxHQUFHLEVBQUU7UUFDbkQsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksU0FBRyxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7WUFDeEMsY0FBYyxFQUFFO2dCQUNkLGFBQWEsRUFBRTtvQkFDYixFQUFFLEVBQUUsV0FBVztvQkFDZixhQUFhLEVBQUU7d0JBQ2I7NEJBQ0UsZ0JBQWdCLEVBQUUsaUJBQWlCO3lCQUNwQzt3QkFDRDs0QkFDRSxnQkFBZ0IsRUFBRSxpQkFBaUI7eUJBQ3BDO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsa0NBQWtDLENBQUMsQ0FBQztJQUdsRCxDQUFDLENBQUMsQ0FBQztJQUVILGdDQUFjLENBQUMsaURBQWlELEVBQUUsR0FBRyxFQUFFO1FBQ3JFLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBRTFCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLFNBQUcsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO1lBQ3hDLGNBQWMsRUFBRTtnQkFDZCxhQUFhLEVBQUU7b0JBQ2IsRUFBRSxFQUFFLFdBQVc7b0JBQ2YsYUFBYSxFQUFFO3dCQUNiOzRCQUNFLFlBQVksRUFBRSxVQUFVO3lCQUN6QjtxQkFDRjtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFHaEMsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMscURBQXFELEVBQUUsR0FBRyxFQUFFO1FBQy9ELFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBRTFCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLFNBQUcsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO1lBQ3hDLGNBQWMsRUFBRTtnQkFDZCxhQUFhLEVBQUU7b0JBQ2IsRUFBRSxFQUFFLFdBQVc7b0JBQ2YsYUFBYSxFQUFFO3dCQUNiOzRCQUNFLGdCQUFnQixFQUFFLGdCQUFnQjt5QkFDbkM7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0lBRzlDLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHFEQUFxRCxFQUFFLEdBQUcsRUFBRTtRQUMvRCxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUUxQixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxTQUFHLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtZQUN4QyxjQUFjLEVBQUU7Z0JBQ2QsYUFBYSxFQUFFO29CQUNiLEVBQUUsRUFBRSxXQUFXO29CQUNmLGFBQWEsRUFBRTt3QkFDYjs0QkFDRSxnQkFBZ0IsRUFBRSxpQkFBaUI7eUJBQ3BDO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQztJQUcxQyxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywrQ0FBK0MsRUFBRSxHQUFHLEVBQUU7UUFDekQsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFHLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtZQUN2QyxVQUFVLEVBQUUsSUFBSTtTQUNqQixDQUFDLENBQUM7UUFFSCxNQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFO1lBQ3RDLEVBQUUsRUFBRSxXQUFXO1NBQ2hCLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ3JELFVBQVUsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSx1QkFBdUIsRUFBRSxFQUFFO1lBQ3ZELFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSxhQUFhO1lBQ3pCLE1BQU0sRUFBRSxlQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUMzQixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDLENBQUM7SUFHTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw2Q0FBNkMsRUFBRSxHQUFHLEVBQUU7UUFFdkQsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUUxQixNQUFNLEdBQUcsR0FBRyxtQkFBYSxDQUFDLDJCQUEyQixDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7WUFDekUsS0FBSyxFQUFFLEtBQUs7WUFDWixpQkFBaUIsRUFBRSxJQUFJO1lBQ3ZCLGlCQUFpQixFQUFFLEtBQUs7WUFDeEIsa0JBQWtCLEVBQUUsSUFBSTtTQUN6QixDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNqQyxNQUFNLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdDLE1BQU0sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDN0MsTUFBTSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU1QyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ3JELFVBQVUsRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7WUFDNUIsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLGFBQWE7WUFDekIsTUFBTSxFQUFFLGVBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQzNCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDdEQsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtZQUM1QixTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsY0FBYztZQUMxQixNQUFNLEVBQUUsZUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDM0IsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUN2RCxVQUFVLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO1lBQzVCLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSxlQUFlO1lBQzNCLE1BQU0sRUFBRSxlQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUMzQixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDLENBQUM7SUFFTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxnQ0FBZ0MsRUFBRSxHQUFHLEVBQUU7UUFDMUMsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUNQLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLG1CQUFhLENBQUMsc0JBQXNCLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ3BFLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSxlQUFlO1lBQzNCLE1BQU0sRUFBRSxlQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUMzQixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDLENBQUM7SUFHTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx1REFBdUQsRUFBRSxHQUFHLEVBQUU7UUFDakUsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksU0FBRyxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7WUFDeEMsVUFBVSxFQUFFLElBQUk7WUFDaEIsbUJBQW1CLEVBQUUsRUFBRTtTQUN4QixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7SUFHN0IsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsdUVBQXVFLEVBQUUsR0FBRyxFQUFFO1FBQ2pGLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBRTFCLE9BQU87UUFDUCxNQUFNLEdBQUcsR0FBRyxJQUFJLFNBQUcsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO1lBQ3ZDLG1CQUFtQixFQUFFLEVBQUU7U0FDeEIsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxNQUFNLEdBQUcsSUFBSSxrQkFBWSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7WUFDL0MsS0FBSyxFQUFFLEdBQUcsQ0FBQyxLQUFLO1lBQ2hCLGdCQUFnQixFQUFFLGVBQWU7WUFDakMsU0FBUyxFQUFFLGFBQWE7U0FDekIsQ0FBQyxDQUFDO1FBQ0gsR0FBRyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0IsR0FBRyxDQUFDLGdCQUFnQixDQUFDLGVBQWUsRUFBRTtZQUNwQyxFQUFFLEVBQUUsU0FBUztTQUNkLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQywyQkFBMkIsRUFBRTtZQUMzRSxJQUFJLEVBQUUsU0FBUztTQUNoQixDQUFDLENBQUM7SUFFTCxDQUFDLENBQUMsQ0FBQztJQUNILElBQUksQ0FBQyw4REFBOEQsRUFBRSxHQUFHLEVBQUU7UUFDeEUsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFDMUIsTUFBTSxLQUFLLEdBQUcsWUFBSyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUV2QyxPQUFPO1FBQ1AsSUFBSSxTQUFHLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtZQUMzQixjQUFjLEVBQUU7Z0JBQ2QsYUFBYSxFQUFFO29CQUNiLEVBQUUsRUFBRSxLQUFZO2lCQUNqQjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDJCQUEyQixFQUFFO1lBQzNFLFNBQVMsRUFBRSxXQUFXO1NBQ3ZCLENBQUMsQ0FBQztJQUVMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0IHsgdGVzdERlcHJlY2F0ZWQgfSBmcm9tICdAYXdzLWNkay9jZGstYnVpbGQtdG9vbHMnO1xuaW1wb3J0IHsgRHVyYXRpb24sIFNlY3JldFZhbHVlLCBTdGFjaywgVG9rZW4gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IFB1YmxpY1N1Ym5ldCwgVnBjLCBWcG5Db25uZWN0aW9uIH0gZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ3ZwbicsICgpID0+IHtcbiAgdGVzdCgnY2FuIGFkZCBhIHZwbiBjb25uZWN0aW9uIHRvIGEgdnBjIHdpdGggYSB2cG4gZ2F0ZXdheScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFZwYyhzdGFjaywgJ1ZwY05ldHdvcmsnLCB7XG4gICAgICB2cG5Db25uZWN0aW9uczoge1xuICAgICAgICBWcG5Db25uZWN0aW9uOiB7XG4gICAgICAgICAgYXNuOiA2NTAwMSxcbiAgICAgICAgICBpcDogJzE5Mi4wLjIuMScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6Q3VzdG9tZXJHYXRld2F5Jywge1xuICAgICAgQmdwQXNuOiA2NTAwMSxcbiAgICAgIElwQWRkcmVzczogJzE5Mi4wLjIuMScsXG4gICAgICBUeXBlOiAnaXBzZWMuMScsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlZQTkNvbm5lY3Rpb24nLCB7XG4gICAgICBDdXN0b21lckdhdGV3YXlJZDoge1xuICAgICAgICBSZWY6ICdWcGNOZXR3b3JrVnBuQ29ubmVjdGlvbkN1c3RvbWVyR2F0ZXdheThCNTZEOUFGJyxcbiAgICAgIH0sXG4gICAgICBUeXBlOiAnaXBzZWMuMScsXG4gICAgICBWcG5HYXRld2F5SWQ6IHtcbiAgICAgICAgUmVmOiAnVnBjTmV0d29ya1ZwbkdhdGV3YXk1MDEyOTVGQScsXG4gICAgICB9LFxuICAgICAgU3RhdGljUm91dGVzT25seTogZmFsc2UsXG4gICAgfSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCd3aXRoIHN0YXRpYyByb3V0aW5nJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgVnBjKHN0YWNrLCAnVnBjTmV0d29yaycsIHtcbiAgICAgIHZwbkNvbm5lY3Rpb25zOiB7XG4gICAgICAgIHN0YXRpYzoge1xuICAgICAgICAgIGlwOiAnMTkyLjAuMi4xJyxcbiAgICAgICAgICBzdGF0aWNSb3V0ZXM6IFtcbiAgICAgICAgICAgICcxOTIuMTY4LjEwLjAvMjQnLFxuICAgICAgICAgICAgJzE5Mi4xNjguMjAuMC8yNCcsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpWUE5Db25uZWN0aW9uJywge1xuICAgICAgQ3VzdG9tZXJHYXRld2F5SWQ6IHtcbiAgICAgICAgUmVmOiAnVnBjTmV0d29ya3N0YXRpY0N1c3RvbWVyR2F0ZXdheUFGMjY1MUNDJyxcbiAgICAgIH0sXG4gICAgICBUeXBlOiAnaXBzZWMuMScsXG4gICAgICBWcG5HYXRld2F5SWQ6IHtcbiAgICAgICAgUmVmOiAnVnBjTmV0d29ya1ZwbkdhdGV3YXk1MDEyOTVGQScsXG4gICAgICB9LFxuICAgICAgU3RhdGljUm91dGVzT25seTogdHJ1ZSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6VlBOQ29ubmVjdGlvblJvdXRlJywge1xuICAgICAgRGVzdGluYXRpb25DaWRyQmxvY2s6ICcxOTIuMTY4LjEwLjAvMjQnLFxuICAgICAgVnBuQ29ubmVjdGlvbklkOiB7XG4gICAgICAgIFJlZjogJ1ZwY05ldHdvcmtzdGF0aWNFMzNFQTk4QycsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpWUE5Db25uZWN0aW9uUm91dGUnLCB7XG4gICAgICBEZXN0aW5hdGlvbkNpZHJCbG9jazogJzE5Mi4xNjguMjAuMC8yNCcsXG4gICAgICBWcG5Db25uZWN0aW9uSWQ6IHtcbiAgICAgICAgUmVmOiAnVnBjTmV0d29ya3N0YXRpY0UzM0VBOThDJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCd3aXRoIHR1bm5lbCBvcHRpb25zLCB1c2luZyBzZWNyZXQgdmFsdWUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgbmV3IFZwYyhzdGFjaywgJ1ZwY05ldHdvcmsnLCB7XG4gICAgICB2cG5Db25uZWN0aW9uczoge1xuICAgICAgICBWcG5Db25uZWN0aW9uOiB7XG4gICAgICAgICAgaXA6ICcxOTIuMC4yLjEnLFxuICAgICAgICAgIHR1bm5lbE9wdGlvbnM6IFt7XG4gICAgICAgICAgICBwcmVTaGFyZWRLZXlTZWNyZXQ6IFNlY3JldFZhbHVlLnVuc2FmZVBsYWluVGV4dCgnc2VjcmV0a2V5MTIzNCcpLFxuICAgICAgICAgICAgdHVubmVsSW5zaWRlQ2lkcjogJzE2OS4yNTQuMTAuMC8zMCcsXG4gICAgICAgICAgfV0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpWUE5Db25uZWN0aW9uJywge1xuICAgICAgQ3VzdG9tZXJHYXRld2F5SWQ6IHtcbiAgICAgICAgUmVmOiAnVnBjTmV0d29ya1ZwbkNvbm5lY3Rpb25DdXN0b21lckdhdGV3YXk4QjU2RDlBRicsXG4gICAgICB9LFxuICAgICAgVHlwZTogJ2lwc2VjLjEnLFxuICAgICAgVnBuR2F0ZXdheUlkOiB7XG4gICAgICAgIFJlZjogJ1ZwY05ldHdvcmtWcG5HYXRld2F5NTAxMjk1RkEnLFxuICAgICAgfSxcbiAgICAgIFN0YXRpY1JvdXRlc09ubHk6IGZhbHNlLFxuICAgICAgVnBuVHVubmVsT3B0aW9uc1NwZWNpZmljYXRpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBQcmVTaGFyZWRLZXk6ICdzZWNyZXRrZXkxMjM0JyxcbiAgICAgICAgICBUdW5uZWxJbnNpZGVDaWRyOiAnMTY5LjI1NC4xMC4wLzMwJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3REZXByZWNhdGVkKCd3aXRoIHR1bm5lbCBvcHRpb25zLCB1c2luZyBzZWNyZXQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgbmV3IFZwYyhzdGFjaywgJ1ZwY05ldHdvcmsnLCB7XG4gICAgICB2cG5Db25uZWN0aW9uczoge1xuICAgICAgICBWcG5Db25uZWN0aW9uOiB7XG4gICAgICAgICAgaXA6ICcxOTIuMC4yLjEnLFxuICAgICAgICAgIHR1bm5lbE9wdGlvbnM6IFt7XG4gICAgICAgICAgICBwcmVTaGFyZWRLZXk6ICdzZWNyZXRrZXkxMjM0JyxcbiAgICAgICAgICAgIHR1bm5lbEluc2lkZUNpZHI6ICcxNjkuMjU0LjEwLjAvMzAnLFxuICAgICAgICAgIH1dLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6VlBOQ29ubmVjdGlvbicsIHtcbiAgICAgIEN1c3RvbWVyR2F0ZXdheUlkOiB7XG4gICAgICAgIFJlZjogJ1ZwY05ldHdvcmtWcG5Db25uZWN0aW9uQ3VzdG9tZXJHYXRld2F5OEI1NkQ5QUYnLFxuICAgICAgfSxcbiAgICAgIFR5cGU6ICdpcHNlYy4xJyxcbiAgICAgIFZwbkdhdGV3YXlJZDoge1xuICAgICAgICBSZWY6ICdWcGNOZXR3b3JrVnBuR2F0ZXdheTUwMTI5NUZBJyxcbiAgICAgIH0sXG4gICAgICBTdGF0aWNSb3V0ZXNPbmx5OiBmYWxzZSxcbiAgICAgIFZwblR1bm5lbE9wdGlvbnNTcGVjaWZpY2F0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgUHJlU2hhcmVkS2V5OiAnc2VjcmV0a2V5MTIzNCcsXG4gICAgICAgICAgVHVubmVsSW5zaWRlQ2lkcjogJzE2OS4yNTQuMTAuMC8zMCcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdmYWlscyB3aGVuIGlwIGlzIGludmFsaWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgZXhwZWN0KCgpID0+IG5ldyBWcGMoc3RhY2ssICdWcGNOZXR3b3JrJywge1xuICAgICAgdnBuQ29ubmVjdGlvbnM6IHtcbiAgICAgICAgVnBuQ29ubmVjdGlvbjoge1xuICAgICAgICAgIGlwOiAnMTkyLjAuMi4yNTYnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KSkudG9UaHJvdygvYGlwYC4rSVB2NC8pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnZmFpbHMgd2hlbiBzcGVjaWZ5aW5nIG1vcmUgdGhhbiB0d28gdHVubmVsIG9wdGlvbnMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgZXhwZWN0KCgpID0+IG5ldyBWcGMoc3RhY2ssICdWcGNOZXR3b3JrJywge1xuICAgICAgdnBuQ29ubmVjdGlvbnM6IHtcbiAgICAgICAgVnBuQ29ubmVjdGlvbjoge1xuICAgICAgICAgIGlwOiAnMTkyLjAuMi4xJyxcbiAgICAgICAgICB0dW5uZWxPcHRpb25zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHByZVNoYXJlZEtleVNlY3JldDogU2VjcmV0VmFsdWUudW5zYWZlUGxhaW5UZXh0KCdzZWNyZXRrZXkxMjM0JyksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBwcmVTaGFyZWRLZXlTZWNyZXQ6IFNlY3JldFZhbHVlLnVuc2FmZVBsYWluVGV4dCgnc2VjcmV0a2V5MTIzNCcpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgcHJlU2hhcmVkS2V5U2VjcmV0OiBTZWNyZXRWYWx1ZS51bnNhZmVQbGFpblRleHQoJ3NlY3JldGtleTEyMzQnKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSkpLnRvVGhyb3coL3R3by4rYHR1bm5lbE9wdGlvbnNgLyk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdmYWlscyB3aXRoIGR1cGxpY2F0ZSB0dW5uZWwgaW5zaWRlIGNpZHInLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgZXhwZWN0KCgpID0+IG5ldyBWcGMoc3RhY2ssICdWcGNOZXR3b3JrJywge1xuICAgICAgdnBuQ29ubmVjdGlvbnM6IHtcbiAgICAgICAgVnBuQ29ubmVjdGlvbjoge1xuICAgICAgICAgIGlwOiAnMTkyLjAuMi4xJyxcbiAgICAgICAgICB0dW5uZWxPcHRpb25zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHR1bm5lbEluc2lkZUNpZHI6ICcxNjkuMjU0LjEwLjAvMzAnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdHVubmVsSW5zaWRlQ2lkcjogJzE2OS4yNTQuMTAuMC8zMCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pKS50b1Rocm93KC9gdHVubmVsSW5zaWRlQ2lkcmAuK2JvdGggdHVubmVscy8pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ2ZhaWxzIHdoZW4gc3BlY2lmeWluZyBhbiBpbnZhbGlkIHByZS1zaGFyZWQga2V5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGV4cGVjdCgoKSA9PiBuZXcgVnBjKHN0YWNrLCAnVnBjTmV0d29yaycsIHtcbiAgICAgIHZwbkNvbm5lY3Rpb25zOiB7XG4gICAgICAgIFZwbkNvbm5lY3Rpb246IHtcbiAgICAgICAgICBpcDogJzE5Mi4wLjIuMScsXG4gICAgICAgICAgdHVubmVsT3B0aW9uczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBwcmVTaGFyZWRLZXk6ICcwaW52YWxpZCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pKS50b1Rocm93KC9gcHJlU2hhcmVkS2V5YC8pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnZmFpbHMgd2hlbiBzcGVjaWZ5aW5nIGEgcmVzZXJ2ZWQgdHVubmVsIGluc2lkZSBjaWRyJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGV4cGVjdCgoKSA9PiBuZXcgVnBjKHN0YWNrLCAnVnBjTmV0d29yaycsIHtcbiAgICAgIHZwbkNvbm5lY3Rpb25zOiB7XG4gICAgICAgIFZwbkNvbm5lY3Rpb246IHtcbiAgICAgICAgICBpcDogJzE5Mi4wLjIuMScsXG4gICAgICAgICAgdHVubmVsT3B0aW9uczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0dW5uZWxJbnNpZGVDaWRyOiAnMTY5LjI1NC4xLjAvMzAnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KSkudG9UaHJvdygvYHR1bm5lbEluc2lkZUNpZHJgLityZXNlcnZlZC8pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnZmFpbHMgd2hlbiBzcGVjaWZ5aW5nIGFuIGludmFsaWQgdHVubmVsIGluc2lkZSBjaWRyJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGV4cGVjdCgoKSA9PiBuZXcgVnBjKHN0YWNrLCAnVnBjTmV0d29yaycsIHtcbiAgICAgIHZwbkNvbm5lY3Rpb25zOiB7XG4gICAgICAgIFZwbkNvbm5lY3Rpb246IHtcbiAgICAgICAgICBpcDogJzE5Mi4wLjIuMScsXG4gICAgICAgICAgdHVubmVsT3B0aW9uczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0dW5uZWxJbnNpZGVDaWRyOiAnMTY5LjIwMC4xMC4wLzMwJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSkpLnRvVGhyb3coL2B0dW5uZWxJbnNpZGVDaWRyYC4rc2l6ZS8pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnY2FuIHVzZSBtZXRyaWNUdW5uZWxTdGF0ZSBvbiBhIHZwbiBjb25uZWN0aW9uJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWcGNOZXR3b3JrJywge1xuICAgICAgdnBuR2F0ZXdheTogdHJ1ZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHZwbiA9IHZwYy5hZGRWcG5Db25uZWN0aW9uKCdWcG4nLCB7XG4gICAgICBpcDogJzE5Mi4wLjIuMScsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUodnBuLm1ldHJpY1R1bm5lbFN0YXRlKCkpKS50b0VxdWFsKHtcbiAgICAgIGRpbWVuc2lvbnM6IHsgVnBuSWQ6IHsgUmVmOiAnVnBjTmV0d29ya1ZwbkE0NzZDNThEJyB9IH0sXG4gICAgICBuYW1lc3BhY2U6ICdBV1MvVlBOJyxcbiAgICAgIG1ldHJpY05hbWU6ICdUdW5uZWxTdGF0ZScsXG4gICAgICBwZXJpb2Q6IER1cmF0aW9uLm1pbnV0ZXMoNSksXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBpbXBvcnQgYSB2cG4gY29ubmVjdGlvbiBmcm9tIGF0dHJpYnV0ZXMnLCAoKSA9PiB7XG5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3QgdnBuID0gVnBuQ29ubmVjdGlvbi5mcm9tVnBuQ29ubmVjdGlvbkF0dHJpYnV0ZXMoc3RhY2ssICdDb25uZWN0aW9uJywge1xuICAgICAgdnBuSWQ6ICdpZHYnLFxuICAgICAgY3VzdG9tZXJHYXRld2F5SXA6ICdpcCcsXG4gICAgICBjdXN0b21lckdhdGV3YXlJZDogJ2lkYycsXG4gICAgICBjdXN0b21lckdhdGV3YXlBc246IDY1MDAsXG4gICAgfSk7XG5cbiAgICBleHBlY3QodnBuLnZwbklkKS50b0VxdWFsKCdpZHYnKTtcbiAgICBleHBlY3QodnBuLmN1c3RvbWVyR2F0ZXdheUFzbikudG9FcXVhbCg2NTAwKTtcbiAgICBleHBlY3QodnBuLmN1c3RvbWVyR2F0ZXdheUlkKS50b0VxdWFsKCdpZGMnKTtcbiAgICBleHBlY3QodnBuLmN1c3RvbWVyR2F0ZXdheUlwKS50b0VxdWFsKCdpcCcpO1xuXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUodnBuLm1ldHJpY1R1bm5lbFN0YXRlKCkpKS50b0VxdWFsKHtcbiAgICAgIGRpbWVuc2lvbnM6IHsgVnBuSWQ6ICdpZHYnIH0sXG4gICAgICBuYW1lc3BhY2U6ICdBV1MvVlBOJyxcbiAgICAgIG1ldHJpY05hbWU6ICdUdW5uZWxTdGF0ZScsXG4gICAgICBwZXJpb2Q6IER1cmF0aW9uLm1pbnV0ZXMoNSksXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9KTtcblxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHZwbi5tZXRyaWNUdW5uZWxEYXRhSW4oKSkpLnRvRXF1YWwoe1xuICAgICAgZGltZW5zaW9uczogeyBWcG5JZDogJ2lkdicgfSxcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9WUE4nLFxuICAgICAgbWV0cmljTmFtZTogJ1R1bm5lbERhdGFJbicsXG4gICAgICBwZXJpb2Q6IER1cmF0aW9uLm1pbnV0ZXMoNSksXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUodnBuLm1ldHJpY1R1bm5lbERhdGFPdXQoKSkpLnRvRXF1YWwoe1xuICAgICAgZGltZW5zaW9uczogeyBWcG5JZDogJ2lkdicgfSxcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9WUE4nLFxuICAgICAgbWV0cmljTmFtZTogJ1R1bm5lbERhdGFPdXQnLFxuICAgICAgcGVyaW9kOiBEdXJhdGlvbi5taW51dGVzKDUpLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9KTtcblxuICB9KTtcblxuICB0ZXN0KCdjYW4gdXNlIG1ldHJpY0FsbFR1bm5lbERhdGFPdXQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKFZwbkNvbm5lY3Rpb24ubWV0cmljQWxsVHVubmVsRGF0YU91dCgpKSkudG9FcXVhbCh7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvVlBOJyxcbiAgICAgIG1ldHJpY05hbWU6ICdUdW5uZWxEYXRhT3V0JyxcbiAgICAgIHBlcmlvZDogRHVyYXRpb24ubWludXRlcyg1KSxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdmYWlscyB3aGVuIGVuYWJsaW5nIHZwbkdhdGV3YXkgd2l0aG91dCBoYXZpbmcgc3VibmV0cycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBleHBlY3QoKCkgPT4gbmV3IFZwYyhzdGFjaywgJ1ZwY05ldHdvcmsnLCB7XG4gICAgICB2cG5HYXRld2F5OiB0cnVlLFxuICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW10sXG4gICAgfSkpLnRvVGhyb3coL1ZQTiBnYXRld2F5Lyk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdjYW4gYWRkIGEgdnBuIGNvbm5lY3Rpb24gbGF0ZXIgdG8gYSB2cGMgdGhhdCBpbml0aWFsbHkgaGFkIG5vIHN1Ym5ldHMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWcGNOZXR3b3JrJywge1xuICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW10sXG4gICAgfSk7XG4gICAgY29uc3Qgc3VibmV0ID0gbmV3IFB1YmxpY1N1Ym5ldChzdGFjaywgJ1N1Ym5ldCcsIHtcbiAgICAgIHZwY0lkOiB2cGMudnBjSWQsXG4gICAgICBhdmFpbGFiaWxpdHlab25lOiAnZXUtY2VudHJhbC0xYScsXG4gICAgICBjaWRyQmxvY2s6ICcxMC4wLjAuMC8yOCcsXG4gICAgfSk7XG4gICAgdnBjLnB1YmxpY1N1Ym5ldHMucHVzaChzdWJuZXQpO1xuICAgIHZwYy5hZGRWcG5Db25uZWN0aW9uKCdWUE5Db25uZWN0aW9uJywge1xuICAgICAgaXA6ICcxLjIuMy40JyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OkN1c3RvbWVyR2F0ZXdheScsIHtcbiAgICAgIFR5cGU6ICdpcHNlYy4xJyxcbiAgICB9KTtcblxuICB9KTtcbiAgdGVzdCgnY2FuIGFkZCBhIHZwbiBjb25uZWN0aW9uIHdpdGggYSBUb2tlbiBhcyBjdXN0b21lciBnYXRld2F5IGlwJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCB0b2tlbiA9IFRva2VuLmFzQW55KCcxOTIuMC4yLjEnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgVnBjKHN0YWNrLCAnVnBjTmV0d29yaycsIHtcbiAgICAgIHZwbkNvbm5lY3Rpb25zOiB7XG4gICAgICAgIFZwbkNvbm5lY3Rpb246IHtcbiAgICAgICAgICBpcDogdG9rZW4gYXMgYW55LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OkN1c3RvbWVyR2F0ZXdheScsIHtcbiAgICAgIElwQWRkcmVzczogJzE5Mi4wLjIuMScsXG4gICAgfSk7XG5cbiAgfSk7XG59KTtcbiJdfQ==