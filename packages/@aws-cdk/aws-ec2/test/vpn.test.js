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
    (0, cdk_build_tools_1.testDeprecated)('with tunnel options, using secret', () => {
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
    (0, cdk_build_tools_1.testDeprecated)('fails when specifying an invalid pre-shared key', () => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnBuLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ2cG4udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyw4REFBMEQ7QUFDMUQsd0NBQW9FO0FBQ3BFLGdDQUEwRDtBQUUxRCxRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRTtJQUNuQixJQUFJLENBQUMsc0RBQXNELEVBQUUsR0FBRyxFQUFFO1FBQ2hFLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBRTFCLE9BQU87UUFDUCxJQUFJLFNBQUcsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO1lBQzNCLGNBQWMsRUFBRTtnQkFDZCxhQUFhLEVBQUU7b0JBQ2IsR0FBRyxFQUFFLEtBQUs7b0JBQ1YsRUFBRSxFQUFFLFdBQVc7aUJBQ2hCO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsMkJBQTJCLEVBQUU7WUFDM0UsTUFBTSxFQUFFLEtBQUs7WUFDYixTQUFTLEVBQUUsV0FBVztZQUN0QixJQUFJLEVBQUUsU0FBUztTQUNoQixDQUFDLENBQUM7UUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx5QkFBeUIsRUFBRTtZQUN6RSxpQkFBaUIsRUFBRTtnQkFDakIsR0FBRyxFQUFFLGdEQUFnRDthQUN0RDtZQUNELElBQUksRUFBRSxTQUFTO1lBQ2YsWUFBWSxFQUFFO2dCQUNaLEdBQUcsRUFBRSw4QkFBOEI7YUFDcEM7WUFDRCxnQkFBZ0IsRUFBRSxLQUFLO1NBQ3hCLENBQUMsQ0FBQztJQUdMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHFCQUFxQixFQUFFLEdBQUcsRUFBRTtRQUMvQixRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUs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RUwsQ0FBQyxDQUFDLENBQUM7SUFDSCxJQUFJLENBQUMsOERBQThELEVBQUUsR0FBRyxFQUFFO1FBQ3hFLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBQzFCLE1BQU0sS0FBSyxHQUFHLFlBQUssQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFdkMsT0FBTztRQUNQLElBQUksU0FBRyxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7WUFDM0IsY0FBYyxFQUFFO2dCQUNkLGFBQWEsRUFBRTtvQkFDYixFQUFFLEVBQUUsS0FBWTtpQkFDakI7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQywyQkFBMkIsRUFBRTtZQUMzRSxTQUFTLEVBQUUsV0FBVztTQUN2QixDQUFDLENBQUM7SUFFTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCB7IHRlc3REZXByZWNhdGVkIH0gZnJvbSAnQGF3cy1jZGsvY2RrLWJ1aWxkLXRvb2xzJztcbmltcG9ydCB7IER1cmF0aW9uLCBTZWNyZXRWYWx1ZSwgU3RhY2ssIFRva2VuIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBQdWJsaWNTdWJuZXQsIFZwYywgVnBuQ29ubmVjdGlvbiB9IGZyb20gJy4uL2xpYic7XG5cbmRlc2NyaWJlKCd2cG4nLCAoKSA9PiB7XG4gIHRlc3QoJ2NhbiBhZGQgYSB2cG4gY29ubmVjdGlvbiB0byBhIHZwYyB3aXRoIGEgdnBuIGdhdGV3YXknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBWcGMoc3RhY2ssICdWcGNOZXR3b3JrJywge1xuICAgICAgdnBuQ29ubmVjdGlvbnM6IHtcbiAgICAgICAgVnBuQ29ubmVjdGlvbjoge1xuICAgICAgICAgIGFzbjogNjUwMDEsXG4gICAgICAgICAgaXA6ICcxOTIuMC4yLjEnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OkN1c3RvbWVyR2F0ZXdheScsIHtcbiAgICAgIEJncEFzbjogNjUwMDEsXG4gICAgICBJcEFkZHJlc3M6ICcxOTIuMC4yLjEnLFxuICAgICAgVHlwZTogJ2lwc2VjLjEnLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpWUE5Db25uZWN0aW9uJywge1xuICAgICAgQ3VzdG9tZXJHYXRld2F5SWQ6IHtcbiAgICAgICAgUmVmOiAnVnBjTmV0d29ya1ZwbkNvbm5lY3Rpb25DdXN0b21lckdhdGV3YXk4QjU2RDlBRicsXG4gICAgICB9LFxuICAgICAgVHlwZTogJ2lwc2VjLjEnLFxuICAgICAgVnBuR2F0ZXdheUlkOiB7XG4gICAgICAgIFJlZjogJ1ZwY05ldHdvcmtWcG5HYXRld2F5NTAxMjk1RkEnLFxuICAgICAgfSxcbiAgICAgIFN0YXRpY1JvdXRlc09ubHk6IGZhbHNlLFxuICAgIH0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnd2l0aCBzdGF0aWMgcm91dGluZycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFZwYyhzdGFjaywgJ1ZwY05ldHdvcmsnLCB7XG4gICAgICB2cG5Db25uZWN0aW9uczoge1xuICAgICAgICBzdGF0aWM6IHtcbiAgICAgICAgICBpcDogJzE5Mi4wLjIuMScsXG4gICAgICAgICAgc3RhdGljUm91dGVzOiBbXG4gICAgICAgICAgICAnMTkyLjE2OC4xMC4wLzI0JyxcbiAgICAgICAgICAgICcxOTIuMTY4LjIwLjAvMjQnLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6VlBOQ29ubmVjdGlvbicsIHtcbiAgICAgIEN1c3RvbWVyR2F0ZXdheUlkOiB7XG4gICAgICAgIFJlZjogJ1ZwY05ldHdvcmtzdGF0aWNDdXN0b21lckdhdGV3YXlBRjI2NTFDQycsXG4gICAgICB9LFxuICAgICAgVHlwZTogJ2lwc2VjLjEnLFxuICAgICAgVnBuR2F0ZXdheUlkOiB7XG4gICAgICAgIFJlZjogJ1ZwY05ldHdvcmtWcG5HYXRld2F5NTAxMjk1RkEnLFxuICAgICAgfSxcbiAgICAgIFN0YXRpY1JvdXRlc09ubHk6IHRydWUsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlZQTkNvbm5lY3Rpb25Sb3V0ZScsIHtcbiAgICAgIERlc3RpbmF0aW9uQ2lkckJsb2NrOiAnMTkyLjE2OC4xMC4wLzI0JyxcbiAgICAgIFZwbkNvbm5lY3Rpb25JZDoge1xuICAgICAgICBSZWY6ICdWcGNOZXR3b3Jrc3RhdGljRTMzRUE5OEMnLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6VlBOQ29ubmVjdGlvblJvdXRlJywge1xuICAgICAgRGVzdGluYXRpb25DaWRyQmxvY2s6ICcxOTIuMTY4LjIwLjAvMjQnLFxuICAgICAgVnBuQ29ubmVjdGlvbklkOiB7XG4gICAgICAgIFJlZjogJ1ZwY05ldHdvcmtzdGF0aWNFMzNFQTk4QycsXG4gICAgICB9LFxuICAgIH0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnd2l0aCB0dW5uZWwgb3B0aW9ucywgdXNpbmcgc2VjcmV0IHZhbHVlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIG5ldyBWcGMoc3RhY2ssICdWcGNOZXR3b3JrJywge1xuICAgICAgdnBuQ29ubmVjdGlvbnM6IHtcbiAgICAgICAgVnBuQ29ubmVjdGlvbjoge1xuICAgICAgICAgIGlwOiAnMTkyLjAuMi4xJyxcbiAgICAgICAgICB0dW5uZWxPcHRpb25zOiBbe1xuICAgICAgICAgICAgcHJlU2hhcmVkS2V5U2VjcmV0OiBTZWNyZXRWYWx1ZS51bnNhZmVQbGFpblRleHQoJ3NlY3JldGtleTEyMzQnKSxcbiAgICAgICAgICAgIHR1bm5lbEluc2lkZUNpZHI6ICcxNjkuMjU0LjEwLjAvMzAnLFxuICAgICAgICAgIH1dLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6VlBOQ29ubmVjdGlvbicsIHtcbiAgICAgIEN1c3RvbWVyR2F0ZXdheUlkOiB7XG4gICAgICAgIFJlZjogJ1ZwY05ldHdvcmtWcG5Db25uZWN0aW9uQ3VzdG9tZXJHYXRld2F5OEI1NkQ5QUYnLFxuICAgICAgfSxcbiAgICAgIFR5cGU6ICdpcHNlYy4xJyxcbiAgICAgIFZwbkdhdGV3YXlJZDoge1xuICAgICAgICBSZWY6ICdWcGNOZXR3b3JrVnBuR2F0ZXdheTUwMTI5NUZBJyxcbiAgICAgIH0sXG4gICAgICBTdGF0aWNSb3V0ZXNPbmx5OiBmYWxzZSxcbiAgICAgIFZwblR1bm5lbE9wdGlvbnNTcGVjaWZpY2F0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgUHJlU2hhcmVkS2V5OiAnc2VjcmV0a2V5MTIzNCcsXG4gICAgICAgICAgVHVubmVsSW5zaWRlQ2lkcjogJzE2OS4yNTQuMTAuMC8zMCcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnd2l0aCB0dW5uZWwgb3B0aW9ucywgdXNpbmcgc2VjcmV0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIG5ldyBWcGMoc3RhY2ssICdWcGNOZXR3b3JrJywge1xuICAgICAgdnBuQ29ubmVjdGlvbnM6IHtcbiAgICAgICAgVnBuQ29ubmVjdGlvbjoge1xuICAgICAgICAgIGlwOiAnMTkyLjAuMi4xJyxcbiAgICAgICAgICB0dW5uZWxPcHRpb25zOiBbe1xuICAgICAgICAgICAgcHJlU2hhcmVkS2V5OiAnc2VjcmV0a2V5MTIzNCcsXG4gICAgICAgICAgICB0dW5uZWxJbnNpZGVDaWRyOiAnMTY5LjI1NC4xMC4wLzMwJyxcbiAgICAgICAgICB9XSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlZQTkNvbm5lY3Rpb24nLCB7XG4gICAgICBDdXN0b21lckdhdGV3YXlJZDoge1xuICAgICAgICBSZWY6ICdWcGNOZXR3b3JrVnBuQ29ubmVjdGlvbkN1c3RvbWVyR2F0ZXdheThCNTZEOUFGJyxcbiAgICAgIH0sXG4gICAgICBUeXBlOiAnaXBzZWMuMScsXG4gICAgICBWcG5HYXRld2F5SWQ6IHtcbiAgICAgICAgUmVmOiAnVnBjTmV0d29ya1ZwbkdhdGV3YXk1MDEyOTVGQScsXG4gICAgICB9LFxuICAgICAgU3RhdGljUm91dGVzT25seTogZmFsc2UsXG4gICAgICBWcG5UdW5uZWxPcHRpb25zU3BlY2lmaWNhdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFByZVNoYXJlZEtleTogJ3NlY3JldGtleTEyMzQnLFxuICAgICAgICAgIFR1bm5lbEluc2lkZUNpZHI6ICcxNjkuMjU0LjEwLjAvMzAnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZmFpbHMgd2hlbiBpcCBpcyBpbnZhbGlkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGV4cGVjdCgoKSA9PiBuZXcgVnBjKHN0YWNrLCAnVnBjTmV0d29yaycsIHtcbiAgICAgIHZwbkNvbm5lY3Rpb25zOiB7XG4gICAgICAgIFZwbkNvbm5lY3Rpb246IHtcbiAgICAgICAgICBpcDogJzE5Mi4wLjIuMjU2JyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSkpLnRvVGhyb3coL2BpcGAuK0lQdjQvKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ2ZhaWxzIHdoZW4gc3BlY2lmeWluZyBtb3JlIHRoYW4gdHdvIHR1bm5lbCBvcHRpb25zJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGV4cGVjdCgoKSA9PiBuZXcgVnBjKHN0YWNrLCAnVnBjTmV0d29yaycsIHtcbiAgICAgIHZwbkNvbm5lY3Rpb25zOiB7XG4gICAgICAgIFZwbkNvbm5lY3Rpb246IHtcbiAgICAgICAgICBpcDogJzE5Mi4wLjIuMScsXG4gICAgICAgICAgdHVubmVsT3B0aW9uczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBwcmVTaGFyZWRLZXlTZWNyZXQ6IFNlY3JldFZhbHVlLnVuc2FmZVBsYWluVGV4dCgnc2VjcmV0a2V5MTIzNCcpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgcHJlU2hhcmVkS2V5U2VjcmV0OiBTZWNyZXRWYWx1ZS51bnNhZmVQbGFpblRleHQoJ3NlY3JldGtleTEyMzQnKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHByZVNoYXJlZEtleVNlY3JldDogU2VjcmV0VmFsdWUudW5zYWZlUGxhaW5UZXh0KCdzZWNyZXRrZXkxMjM0JyksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pKS50b1Rocm93KC90d28uK2B0dW5uZWxPcHRpb25zYC8pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnZmFpbHMgd2l0aCBkdXBsaWNhdGUgdHVubmVsIGluc2lkZSBjaWRyJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGV4cGVjdCgoKSA9PiBuZXcgVnBjKHN0YWNrLCAnVnBjTmV0d29yaycsIHtcbiAgICAgIHZwbkNvbm5lY3Rpb25zOiB7XG4gICAgICAgIFZwbkNvbm5lY3Rpb246IHtcbiAgICAgICAgICBpcDogJzE5Mi4wLjIuMScsXG4gICAgICAgICAgdHVubmVsT3B0aW9uczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0dW5uZWxJbnNpZGVDaWRyOiAnMTY5LjI1NC4xMC4wLzMwJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHR1bm5lbEluc2lkZUNpZHI6ICcxNjkuMjU0LjEwLjAvMzAnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KSkudG9UaHJvdygvYHR1bm5lbEluc2lkZUNpZHJgLitib3RoIHR1bm5lbHMvKTtcblxuXG4gIH0pO1xuXG4gIHRlc3REZXByZWNhdGVkKCdmYWlscyB3aGVuIHNwZWNpZnlpbmcgYW4gaW52YWxpZCBwcmUtc2hhcmVkIGtleScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBleHBlY3QoKCkgPT4gbmV3IFZwYyhzdGFjaywgJ1ZwY05ldHdvcmsnLCB7XG4gICAgICB2cG5Db25uZWN0aW9uczoge1xuICAgICAgICBWcG5Db25uZWN0aW9uOiB7XG4gICAgICAgICAgaXA6ICcxOTIuMC4yLjEnLFxuICAgICAgICAgIHR1bm5lbE9wdGlvbnM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgcHJlU2hhcmVkS2V5OiAnMGludmFsaWQnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KSkudG9UaHJvdygvYHByZVNoYXJlZEtleWAvKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ2ZhaWxzIHdoZW4gc3BlY2lmeWluZyBhIHJlc2VydmVkIHR1bm5lbCBpbnNpZGUgY2lkcicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBleHBlY3QoKCkgPT4gbmV3IFZwYyhzdGFjaywgJ1ZwY05ldHdvcmsnLCB7XG4gICAgICB2cG5Db25uZWN0aW9uczoge1xuICAgICAgICBWcG5Db25uZWN0aW9uOiB7XG4gICAgICAgICAgaXA6ICcxOTIuMC4yLjEnLFxuICAgICAgICAgIHR1bm5lbE9wdGlvbnM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdHVubmVsSW5zaWRlQ2lkcjogJzE2OS4yNTQuMS4wLzMwJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSkpLnRvVGhyb3coL2B0dW5uZWxJbnNpZGVDaWRyYC4rcmVzZXJ2ZWQvKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ2ZhaWxzIHdoZW4gc3BlY2lmeWluZyBhbiBpbnZhbGlkIHR1bm5lbCBpbnNpZGUgY2lkcicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBleHBlY3QoKCkgPT4gbmV3IFZwYyhzdGFjaywgJ1ZwY05ldHdvcmsnLCB7XG4gICAgICB2cG5Db25uZWN0aW9uczoge1xuICAgICAgICBWcG5Db25uZWN0aW9uOiB7XG4gICAgICAgICAgaXA6ICcxOTIuMC4yLjEnLFxuICAgICAgICAgIHR1bm5lbE9wdGlvbnM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdHVubmVsSW5zaWRlQ2lkcjogJzE2OS4yMDAuMTAuMC8zMCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pKS50b1Rocm93KC9gdHVubmVsSW5zaWRlQ2lkcmAuK3NpemUvKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiB1c2UgbWV0cmljVHVubmVsU3RhdGUgb24gYSB2cG4gY29ubmVjdGlvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVnBjTmV0d29yaycsIHtcbiAgICAgIHZwbkdhdGV3YXk6IHRydWUsXG4gICAgfSk7XG5cbiAgICBjb25zdCB2cG4gPSB2cGMuYWRkVnBuQ29ubmVjdGlvbignVnBuJywge1xuICAgICAgaXA6ICcxOTIuMC4yLjEnLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHZwbi5tZXRyaWNUdW5uZWxTdGF0ZSgpKSkudG9FcXVhbCh7XG4gICAgICBkaW1lbnNpb25zOiB7IFZwbklkOiB7IFJlZjogJ1ZwY05ldHdvcmtWcG5BNDc2QzU4RCcgfSB9LFxuICAgICAgbmFtZXNwYWNlOiAnQVdTL1ZQTicsXG4gICAgICBtZXRyaWNOYW1lOiAnVHVubmVsU3RhdGUnLFxuICAgICAgcGVyaW9kOiBEdXJhdGlvbi5taW51dGVzKDUpLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdjYW4gaW1wb3J0IGEgdnBuIGNvbm5lY3Rpb24gZnJvbSBhdHRyaWJ1dGVzJywgKCkgPT4ge1xuXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IHZwbiA9IFZwbkNvbm5lY3Rpb24uZnJvbVZwbkNvbm5lY3Rpb25BdHRyaWJ1dGVzKHN0YWNrLCAnQ29ubmVjdGlvbicsIHtcbiAgICAgIHZwbklkOiAnaWR2JyxcbiAgICAgIGN1c3RvbWVyR2F0ZXdheUlwOiAnaXAnLFxuICAgICAgY3VzdG9tZXJHYXRld2F5SWQ6ICdpZGMnLFxuICAgICAgY3VzdG9tZXJHYXRld2F5QXNuOiA2NTAwLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KHZwbi52cG5JZCkudG9FcXVhbCgnaWR2Jyk7XG4gICAgZXhwZWN0KHZwbi5jdXN0b21lckdhdGV3YXlBc24pLnRvRXF1YWwoNjUwMCk7XG4gICAgZXhwZWN0KHZwbi5jdXN0b21lckdhdGV3YXlJZCkudG9FcXVhbCgnaWRjJyk7XG4gICAgZXhwZWN0KHZwbi5jdXN0b21lckdhdGV3YXlJcCkudG9FcXVhbCgnaXAnKTtcblxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHZwbi5tZXRyaWNUdW5uZWxTdGF0ZSgpKSkudG9FcXVhbCh7XG4gICAgICBkaW1lbnNpb25zOiB7IFZwbklkOiAnaWR2JyB9LFxuICAgICAgbmFtZXNwYWNlOiAnQVdTL1ZQTicsXG4gICAgICBtZXRyaWNOYW1lOiAnVHVubmVsU3RhdGUnLFxuICAgICAgcGVyaW9kOiBEdXJhdGlvbi5taW51dGVzKDUpLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfSk7XG5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZSh2cG4ubWV0cmljVHVubmVsRGF0YUluKCkpKS50b0VxdWFsKHtcbiAgICAgIGRpbWVuc2lvbnM6IHsgVnBuSWQ6ICdpZHYnIH0sXG4gICAgICBuYW1lc3BhY2U6ICdBV1MvVlBOJyxcbiAgICAgIG1ldHJpY05hbWU6ICdUdW5uZWxEYXRhSW4nLFxuICAgICAgcGVyaW9kOiBEdXJhdGlvbi5taW51dGVzKDUpLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9KTtcblxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHZwbi5tZXRyaWNUdW5uZWxEYXRhT3V0KCkpKS50b0VxdWFsKHtcbiAgICAgIGRpbWVuc2lvbnM6IHsgVnBuSWQ6ICdpZHYnIH0sXG4gICAgICBuYW1lc3BhY2U6ICdBV1MvVlBOJyxcbiAgICAgIG1ldHJpY05hbWU6ICdUdW5uZWxEYXRhT3V0JyxcbiAgICAgIHBlcmlvZDogRHVyYXRpb24ubWludXRlcyg1KSxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfSk7XG5cbiAgfSk7XG5cbiAgdGVzdCgnY2FuIHVzZSBtZXRyaWNBbGxUdW5uZWxEYXRhT3V0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShWcG5Db25uZWN0aW9uLm1ldHJpY0FsbFR1bm5lbERhdGFPdXQoKSkpLnRvRXF1YWwoe1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL1ZQTicsXG4gICAgICBtZXRyaWNOYW1lOiAnVHVubmVsRGF0YU91dCcsXG4gICAgICBwZXJpb2Q6IER1cmF0aW9uLm1pbnV0ZXMoNSksXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnZmFpbHMgd2hlbiBlbmFibGluZyB2cG5HYXRld2F5IHdpdGhvdXQgaGF2aW5nIHN1Ym5ldHMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgZXhwZWN0KCgpID0+IG5ldyBWcGMoc3RhY2ssICdWcGNOZXR3b3JrJywge1xuICAgICAgdnBuR2F0ZXdheTogdHJ1ZSxcbiAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtdLFxuICAgIH0pKS50b1Rocm93KC9WUE4gZ2F0ZXdheS8pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGFkZCBhIHZwbiBjb25uZWN0aW9uIGxhdGVyIHRvIGEgdnBjIHRoYXQgaW5pdGlhbGx5IGhhZCBubyBzdWJuZXRzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVnBjTmV0d29yaycsIHtcbiAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtdLFxuICAgIH0pO1xuICAgIGNvbnN0IHN1Ym5ldCA9IG5ldyBQdWJsaWNTdWJuZXQoc3RhY2ssICdTdWJuZXQnLCB7XG4gICAgICB2cGNJZDogdnBjLnZwY0lkLFxuICAgICAgYXZhaWxhYmlsaXR5Wm9uZTogJ2V1LWNlbnRyYWwtMWEnLFxuICAgICAgY2lkckJsb2NrOiAnMTAuMC4wLjAvMjgnLFxuICAgIH0pO1xuICAgIHZwYy5wdWJsaWNTdWJuZXRzLnB1c2goc3VibmV0KTtcbiAgICB2cGMuYWRkVnBuQ29ubmVjdGlvbignVlBOQ29ubmVjdGlvbicsIHtcbiAgICAgIGlwOiAnMS4yLjMuNCcsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpDdXN0b21lckdhdGV3YXknLCB7XG4gICAgICBUeXBlOiAnaXBzZWMuMScsXG4gICAgfSk7XG5cbiAgfSk7XG4gIHRlc3QoJ2NhbiBhZGQgYSB2cG4gY29ubmVjdGlvbiB3aXRoIGEgVG9rZW4gYXMgY3VzdG9tZXIgZ2F0ZXdheSBpcCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgdG9rZW4gPSBUb2tlbi5hc0FueSgnMTkyLjAuMi4xJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFZwYyhzdGFjaywgJ1ZwY05ldHdvcmsnLCB7XG4gICAgICB2cG5Db25uZWN0aW9uczoge1xuICAgICAgICBWcG5Db25uZWN0aW9uOiB7XG4gICAgICAgICAgaXA6IHRva2VuIGFzIGFueSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpDdXN0b21lckdhdGV3YXknLCB7XG4gICAgICBJcEFkZHJlc3M6ICcxOTIuMC4yLjEnLFxuICAgIH0pO1xuXG4gIH0pO1xufSk7XG4iXX0=