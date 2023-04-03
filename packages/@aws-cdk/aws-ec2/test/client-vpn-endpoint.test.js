"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const logs = require("@aws-cdk/aws-logs");
const core_1 = require("@aws-cdk/core");
const ec2 = require("../lib");
const client_vpn_endpoint_1 = require("../lib/client-vpn-endpoint");
let stack;
let vpc;
beforeEach(() => {
    stack = new core_1.Stack();
    vpc = new ec2.Vpc(stack, 'Vpc');
});
test('client vpn endpoint', () => {
    const samlProvider = new aws_iam_1.SamlProvider(stack, 'Provider', {
        metadataDocument: aws_iam_1.SamlMetadataDocument.fromXml('xml'),
    });
    vpc.addClientVpnEndpoint('Endpoint', {
        cidr: '10.100.0.0/16',
        serverCertificateArn: 'server-certificate-arn',
        clientCertificateArn: 'client-certificate-arn',
        clientConnectionHandler: { functionArn: 'function-arn', functionName: 'AWSClientVPN-function-name' },
        dnsServers: ['8.8.8.8', '8.8.4.4'],
        userBasedAuthentication: client_vpn_endpoint_1.ClientVpnUserBasedAuthentication.federated(samlProvider),
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::ClientVpnEndpoint', {
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
    assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::ClientVpnTargetNetworkAssociation', 2);
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::ClientVpnTargetNetworkAssociation', {
        ClientVpnEndpointId: {
            Ref: 'VpcEndpoint6FF034F6',
        },
        SubnetId: {
            Ref: 'VpcPrivateSubnet1Subnet536B997A',
        },
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::ClientVpnTargetNetworkAssociation', {
        ClientVpnEndpointId: {
            Ref: 'VpcEndpoint6FF034F6',
        },
        SubnetId: {
            Ref: 'VpcPrivateSubnet2Subnet3788AAA1',
        },
    });
    assertions_1.Template.fromStack(stack).hasOutput('VpcEndpointSelfServicePortalUrl760AFE23', {
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
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::ClientVpnAuthorizationRule', {
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
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::ClientVpnEndpoint', {
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
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::ClientVpnEndpoint', {
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
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::ClientVpnEndpoint', {
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
    assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::ClientVpnAuthorizationRule', 1);
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::ClientVpnAuthorizationRule', {
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
    assertions_1.Template.fromStack(stack).hasResource('AWS::EC2::ClientVpnRoute', {
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
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::ClientVpnEndpoint', {
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
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::ClientVpnEndpoint', {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LXZwbi1lbmRwb2ludC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2xpZW50LXZwbi1lbmRwb2ludC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLDhDQUFzRTtBQUN0RSwwQ0FBMEM7QUFDMUMsd0NBQXNDO0FBQ3RDLDhCQUE4QjtBQUM5QixvRUFBOEU7QUFFOUUsSUFBSSxLQUFZLENBQUM7QUFDakIsSUFBSSxHQUFhLENBQUM7QUFDbEIsVUFBVSxDQUFDLEdBQUcsRUFBRTtJQUNkLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO0lBQ3BCLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2xDLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLHFCQUFxQixFQUFFLEdBQUcsRUFBRTtJQUMvQixNQUFNLFlBQVksR0FBRyxJQUFJLHNCQUFZLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtRQUN2RCxnQkFBZ0IsRUFBRSw4QkFBb0IsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO0tBQ3RELENBQUMsQ0FBQztJQUVILEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLEVBQUU7UUFDbkMsSUFBSSxFQUFFLGVBQWU7UUFDckIsb0JBQW9CLEVBQUUsd0JBQXdCO1FBQzlDLG9CQUFvQixFQUFFLHdCQUF3QjtRQUM5Qyx1QkFBdUIsRUFBRSxFQUFFLFdBQVcsRUFBRSxjQUFjLEVBQUUsWUFBWSxFQUFFLDRCQUE0QixFQUFFO1FBQ3BHLFVBQVUsRUFBRSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUM7UUFDbEMsdUJBQXVCLEVBQUUsc0RBQWdDLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQztLQUNsRixDQUFDLENBQUM7SUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyw2QkFBNkIs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akQsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLEVBQUU7UUFDaEQsSUFBSSxFQUFFLGVBQWU7UUFDckIsb0JBQW9CLEVBQUUsd0JBQXdCO0tBQy9DLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxtRUFBbUUsQ0FBQyxDQUFDO0FBQ25GLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCB7IFNhbWxNZXRhZGF0YURvY3VtZW50LCBTYW1sUHJvdmlkZXIgfSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGxvZ3MgZnJvbSAnQGF3cy1jZGsvYXdzLWxvZ3MnO1xuaW1wb3J0IHsgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICcuLi9saWInO1xuaW1wb3J0IHsgQ2xpZW50VnBuVXNlckJhc2VkQXV0aGVudGljYXRpb24gfSBmcm9tICcuLi9saWIvY2xpZW50LXZwbi1lbmRwb2ludCc7XG5cbmxldCBzdGFjazogU3RhY2s7XG5sZXQgdnBjOiBlYzIuSVZwYztcbmJlZm9yZUVhY2goKCkgPT4ge1xuICBzdGFjayA9IG5ldyBTdGFjaygpO1xuICB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZwYycpO1xufSk7XG5cbnRlc3QoJ2NsaWVudCB2cG4gZW5kcG9pbnQnLCAoKSA9PiB7XG4gIGNvbnN0IHNhbWxQcm92aWRlciA9IG5ldyBTYW1sUHJvdmlkZXIoc3RhY2ssICdQcm92aWRlcicsIHtcbiAgICBtZXRhZGF0YURvY3VtZW50OiBTYW1sTWV0YWRhdGFEb2N1bWVudC5mcm9tWG1sKCd4bWwnKSxcbiAgfSk7XG5cbiAgdnBjLmFkZENsaWVudFZwbkVuZHBvaW50KCdFbmRwb2ludCcsIHtcbiAgICBjaWRyOiAnMTAuMTAwLjAuMC8xNicsXG4gICAgc2VydmVyQ2VydGlmaWNhdGVBcm46ICdzZXJ2ZXItY2VydGlmaWNhdGUtYXJuJyxcbiAgICBjbGllbnRDZXJ0aWZpY2F0ZUFybjogJ2NsaWVudC1jZXJ0aWZpY2F0ZS1hcm4nLFxuICAgIGNsaWVudENvbm5lY3Rpb25IYW5kbGVyOiB7IGZ1bmN0aW9uQXJuOiAnZnVuY3Rpb24tYXJuJywgZnVuY3Rpb25OYW1lOiAnQVdTQ2xpZW50VlBOLWZ1bmN0aW9uLW5hbWUnIH0sXG4gICAgZG5zU2VydmVyczogWyc4LjguOC44JywgJzguOC40LjQnXSxcbiAgICB1c2VyQmFzZWRBdXRoZW50aWNhdGlvbjogQ2xpZW50VnBuVXNlckJhc2VkQXV0aGVudGljYXRpb24uZmVkZXJhdGVkKHNhbWxQcm92aWRlciksXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6Q2xpZW50VnBuRW5kcG9pbnQnLCB7XG4gICAgQXV0aGVudGljYXRpb25PcHRpb25zOiBbXG4gICAgICB7XG4gICAgICAgIE11dHVhbEF1dGhlbnRpY2F0aW9uOiB7XG4gICAgICAgICAgQ2xpZW50Um9vdENlcnRpZmljYXRlQ2hhaW5Bcm46ICdjbGllbnQtY2VydGlmaWNhdGUtYXJuJyxcbiAgICAgICAgfSxcbiAgICAgICAgVHlwZTogJ2NlcnRpZmljYXRlLWF1dGhlbnRpY2F0aW9uJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIEZlZGVyYXRlZEF1dGhlbnRpY2F0aW9uOiB7XG4gICAgICAgICAgU0FNTFByb3ZpZGVyQXJuOiB7XG4gICAgICAgICAgICBSZWY6ICdQcm92aWRlcjIyODE3MDhFJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBUeXBlOiAnZmVkZXJhdGVkLWF1dGhlbnRpY2F0aW9uJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBDbGllbnRDaWRyQmxvY2s6ICcxMC4xMDAuMC4wLzE2JyxcbiAgICBDb25uZWN0aW9uTG9nT3B0aW9uczoge1xuICAgICAgQ2xvdWR3YXRjaExvZ0dyb3VwOiB7XG4gICAgICAgIFJlZjogJ1ZwY0VuZHBvaW50TG9nR3JvdXA5NkExODg5NycsXG4gICAgICB9LFxuICAgICAgRW5hYmxlZDogdHJ1ZSxcbiAgICB9LFxuICAgIFNlcnZlckNlcnRpZmljYXRlQXJuOiAnc2VydmVyLWNlcnRpZmljYXRlLWFybicsXG4gICAgQ2xpZW50Q29ubmVjdE9wdGlvbnM6IHtcbiAgICAgIEVuYWJsZWQ6IHRydWUsXG4gICAgICBMYW1iZGFGdW5jdGlvbkFybjogJ2Z1bmN0aW9uLWFybicsXG4gICAgfSxcbiAgICBEbnNTZXJ2ZXJzOiBbXG4gICAgICAnOC44LjguOCcsXG4gICAgICAnOC44LjQuNCcsXG4gICAgXSxcbiAgICBTZWN1cml0eUdyb3VwSWRzOiBbXG4gICAgICB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdWcGNFbmRwb2ludFNlY3VyaXR5R3JvdXA3QjI1RUZEQycsXG4gICAgICAgICAgJ0dyb3VwSWQnLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFZwY0lkOiB7XG4gICAgICBSZWY6ICdWcGM4Mzc4RUIzOCcsXG4gICAgfSxcbiAgfSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUMyOjpDbGllbnRWcG5UYXJnZXROZXR3b3JrQXNzb2NpYXRpb24nLCAyKTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OkNsaWVudFZwblRhcmdldE5ldHdvcmtBc3NvY2lhdGlvbicsIHtcbiAgICBDbGllbnRWcG5FbmRwb2ludElkOiB7XG4gICAgICBSZWY6ICdWcGNFbmRwb2ludDZGRjAzNEY2JyxcbiAgICB9LFxuICAgIFN1Ym5ldElkOiB7XG4gICAgICBSZWY6ICdWcGNQcml2YXRlU3VibmV0MVN1Ym5ldDUzNkI5OTdBJyxcbiAgICB9LFxuICB9KTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OkNsaWVudFZwblRhcmdldE5ldHdvcmtBc3NvY2lhdGlvbicsIHtcbiAgICBDbGllbnRWcG5FbmRwb2ludElkOiB7XG4gICAgICBSZWY6ICdWcGNFbmRwb2ludDZGRjAzNEY2JyxcbiAgICB9LFxuICAgIFN1Ym5ldElkOiB7XG4gICAgICBSZWY6ICdWcGNQcml2YXRlU3VibmV0MlN1Ym5ldDM3ODhBQUExJyxcbiAgICB9LFxuICB9KTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc091dHB1dCgnVnBjRW5kcG9pbnRTZWxmU2VydmljZVBvcnRhbFVybDc2MEFGRTIzJywge1xuICAgIFZhbHVlOiB7XG4gICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICcnLFxuICAgICAgICBbXG4gICAgICAgICAgJ2h0dHBzOi8vc2VsZi1zZXJ2aWNlLmNsaWVudHZwbi5hbWF6b25hd3MuY29tL2VuZHBvaW50cy8nLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlZjogJ1ZwY0VuZHBvaW50NkZGMDM0RjYnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICBdLFxuICAgIH0sXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6Q2xpZW50VnBuQXV0aG9yaXphdGlvblJ1bGUnLCB7XG4gICAgQ2xpZW50VnBuRW5kcG9pbnRJZDoge1xuICAgICAgUmVmOiAnVnBjRW5kcG9pbnQ2RkYwMzRGNicsXG4gICAgfSxcbiAgICBUYXJnZXROZXR3b3JrQ2lkcjoge1xuICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICdWcGM4Mzc4RUIzOCcsXG4gICAgICAgICdDaWRyQmxvY2snLFxuICAgICAgXSxcbiAgICB9LFxuICAgIEF1dGhvcml6ZUFsbEdyb3VwczogdHJ1ZSxcbiAgfSk7XG59KTtcblxudGVzdCgnY2xpZW50IHZwbiBlbmRwb2ludCB3aXRoIGN1c3RvbSBzZWN1cml0eSBncm91cHMnLCAoKSA9PiB7XG4gIHZwYy5hZGRDbGllbnRWcG5FbmRwb2ludCgnRW5kcG9pbnQnLCB7XG4gICAgY2lkcjogJzEwLjEwMC4wLjAvMTYnLFxuICAgIHNlcnZlckNlcnRpZmljYXRlQXJuOiAnc2VydmVyLWNlcnRpZmljYXRlLWFybicsXG4gICAgY2xpZW50Q2VydGlmaWNhdGVBcm46ICdjbGllbnQtY2VydGlmaWNhdGUtYXJuJyxcbiAgICBzZWN1cml0eUdyb3VwczogW1xuICAgICAgbmV3IGVjMi5TZWN1cml0eUdyb3VwKHN0YWNrLCAnU0cxJywgeyB2cGMgfSksXG4gICAgICBuZXcgZWMyLlNlY3VyaXR5R3JvdXAoc3RhY2ssICdTRzInLCB7IHZwYyB9KSxcbiAgICBdLFxuICB9KTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OkNsaWVudFZwbkVuZHBvaW50Jywge1xuICAgIFNlY3VyaXR5R3JvdXBJZHM6IFtcbiAgICAgIHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgJ1NHMUJBMDY1QjZFJyxcbiAgICAgICAgICAnR3JvdXBJZCcsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAnU0cyMENFMzIxOUMnLFxuICAgICAgICAgICdHcm91cElkJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSk7XG59KTtcblxudGVzdCgnY2xpZW50IHZwbiBlbmRwb2ludCB3aXRoIGN1c3RvbSBsb2dnaW5nJywgKCkgPT4ge1xuICBjb25zdCBsb2dHcm91cCA9IG5ldyBsb2dzLkxvZ0dyb3VwKHN0YWNrLCAnTG9nR3JvdXAnLCB7XG4gICAgcmV0ZW50aW9uOiBsb2dzLlJldGVudGlvbkRheXMuVFdPX01PTlRIUyxcbiAgfSk7XG4gIHZwYy5hZGRDbGllbnRWcG5FbmRwb2ludCgnRW5kcG9pbnQnLCB7XG4gICAgY2lkcjogJzEwLjEwMC4wLjAvMTYnLFxuICAgIHNlcnZlckNlcnRpZmljYXRlQXJuOiAnc2VydmVyLWNlcnRpZmljYXRlLWFybicsXG4gICAgY2xpZW50Q2VydGlmaWNhdGVBcm46ICdjbGllbnQtY2VydGlmaWNhdGUtYXJuJyxcbiAgICBsb2dHcm91cCxcbiAgICBsb2dTdHJlYW06IGxvZ0dyb3VwLmFkZFN0cmVhbSgnTG9nU3RyZWFtJyksXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6Q2xpZW50VnBuRW5kcG9pbnQnLCB7XG4gICAgQ29ubmVjdGlvbkxvZ09wdGlvbnM6IHtcbiAgICAgIENsb3Vkd2F0Y2hMb2dHcm91cDoge1xuICAgICAgICBSZWY6ICdMb2dHcm91cEY1QjQ2OTMxJyxcbiAgICAgIH0sXG4gICAgICBDbG91ZHdhdGNoTG9nU3RyZWFtOiB7XG4gICAgICAgIFJlZjogJ0xvZ0dyb3VwTG9nU3RyZWFtMjQ1RDc2RDYnLFxuICAgICAgfSxcbiAgICAgIEVuYWJsZWQ6IHRydWUsXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgnY2xpZW50IHZwbiBlbmRwb2ludCB3aXRoIGxvZ2dpbmcgZGlzYWJsZWQnLCAoKSA9PiB7XG4gIHZwYy5hZGRDbGllbnRWcG5FbmRwb2ludCgnRW5kcG9pbnQnLCB7XG4gICAgY2lkcjogJzEwLjEwMC4wLjAvMTYnLFxuICAgIHNlcnZlckNlcnRpZmljYXRlQXJuOiAnc2VydmVyLWNlcnRpZmljYXRlLWFybicsXG4gICAgY2xpZW50Q2VydGlmaWNhdGVBcm46ICdjbGllbnQtY2VydGlmaWNhdGUtYXJuJyxcbiAgICBsb2dnaW5nOiBmYWxzZSxcbiAgfSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpDbGllbnRWcG5FbmRwb2ludCcsIHtcbiAgICBDb25uZWN0aW9uTG9nT3B0aW9uczoge1xuICAgICAgRW5hYmxlZDogZmFsc2UsXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgnY2xpZW50IHZwbiBlbmRwb2ludCB3aXRoIGN1c3RvbSBhdXRob3JpemF0aW9uIHJ1bGVzJywgKCkgPT4ge1xuICBjb25zdCBlbmRwb2ludCA9IHZwYy5hZGRDbGllbnRWcG5FbmRwb2ludCgnRW5kcG9pbnQnLCB7XG4gICAgY2lkcjogJzEwLjEwMC4wLjAvMTYnLFxuICAgIHNlcnZlckNlcnRpZmljYXRlQXJuOiAnc2VydmVyLWNlcnRpZmljYXRlLWFybicsXG4gICAgY2xpZW50Q2VydGlmaWNhdGVBcm46ICdjbGllbnQtY2VydGlmaWNhdGUtYXJuJyxcbiAgICBhdXRob3JpemVBbGxVc2Vyc1RvVnBjQ2lkcjogZmFsc2UsXG4gIH0pO1xuXG4gIGVuZHBvaW50LmFkZEF1dGhvcml6YXRpb25SdWxlKCdSdWxlJywge1xuICAgIGNpZHI6ICcxMC4wLjEwLjAvMzInLFxuICAgIGdyb3VwSWQ6ICdncm91cC1pZCcsXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkVDMjo6Q2xpZW50VnBuQXV0aG9yaXphdGlvblJ1bGUnLCAxKTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OkNsaWVudFZwbkF1dGhvcml6YXRpb25SdWxlJywge1xuICAgIENsaWVudFZwbkVuZHBvaW50SWQ6IHtcbiAgICAgIFJlZjogJ1ZwY0VuZHBvaW50NkZGMDM0RjYnLFxuICAgIH0sXG4gICAgVGFyZ2V0TmV0d29ya0NpZHI6ICcxMC4wLjEwLjAvMzInLFxuICAgIEFjY2Vzc0dyb3VwSWQ6ICdncm91cC1pZCcsXG4gICAgQXV0aG9yaXplQWxsR3JvdXBzOiBmYWxzZSxcbiAgfSk7XG59KTtcblxudGVzdCgnY2xpZW50IHZwbiBlbmRwb2ludCB3aXRoIGN1c3RvbSByb3V0ZScsICgpID0+IHtcbiAgY29uc3QgZW5kcG9pbnQgPSB2cGMuYWRkQ2xpZW50VnBuRW5kcG9pbnQoJ0VuZHBvaW50Jywge1xuICAgIGNpZHI6ICcxMC4xMDAuMC4wLzE2JyxcbiAgICBzZXJ2ZXJDZXJ0aWZpY2F0ZUFybjogJ3NlcnZlci1jZXJ0aWZpY2F0ZS1hcm4nLFxuICAgIGNsaWVudENlcnRpZmljYXRlQXJuOiAnY2xpZW50LWNlcnRpZmljYXRlLWFybicsXG4gICAgYXV0aG9yaXplQWxsVXNlcnNUb1ZwY0NpZHI6IGZhbHNlLFxuICB9KTtcblxuICBlbmRwb2ludC5hZGRSb3V0ZSgnUm91dGUnLCB7XG4gICAgY2lkcjogJzEwLjEwMC4wLjAvMTYnLFxuICAgIHRhcmdldDogZWMyLkNsaWVudFZwblJvdXRlVGFyZ2V0LmxvY2FsKCksXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6RUMyOjpDbGllbnRWcG5Sb3V0ZScsIHtcbiAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICBDbGllbnRWcG5FbmRwb2ludElkOiB7XG4gICAgICAgIFJlZjogJ1ZwY0VuZHBvaW50NkZGMDM0RjYnLFxuICAgICAgfSxcbiAgICAgIERlc3RpbmF0aW9uQ2lkckJsb2NrOiAnMTAuMTAwLjAuMC8xNicsXG4gICAgICBUYXJnZXRWcGNTdWJuZXRJZDogJ2xvY2FsJyxcbiAgICB9LFxuICAgIERlcGVuZHNPbjogW1xuICAgICAgJ1ZwY0VuZHBvaW50QXNzb2NpYXRpb24wNkIwNjYzMjEnLFxuICAgICAgJ1ZwY0VuZHBvaW50QXNzb2NpYXRpb24xMkI1MUE2N0YnLFxuICAgIF0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2NsaWVudCB2cG4gZW5kcG9pbnQgd2l0aCBjdXN0b20gc2Vzc2lvbiB0aW1lb3V0JywgKCkgPT4ge1xuICB2cGMuYWRkQ2xpZW50VnBuRW5kcG9pbnQoJ0VuZHBvaW50Jywge1xuICAgIGNpZHI6ICcxMC4xMDAuMC4wLzE2JyxcbiAgICBzZXJ2ZXJDZXJ0aWZpY2F0ZUFybjogJ3NlcnZlci1jZXJ0aWZpY2F0ZS1hcm4nLFxuICAgIGNsaWVudENlcnRpZmljYXRlQXJuOiAnY2xpZW50LWNlcnRpZmljYXRlLWFybicsXG4gICAgc2Vzc2lvblRpbWVvdXQ6IGVjMi5DbGllbnRWcG5TZXNzaW9uVGltZW91dC5URU5fSE9VUlMsXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6Q2xpZW50VnBuRW5kcG9pbnQnLCB7XG4gICAgU2Vzc2lvblRpbWVvdXRIb3VyczogMTAsXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2NsaWVudCB2cG4gZW5kcG9pbnQgd2l0aCBjbGllbnQgbG9naW4gYmFubmVyJywgKCkgPT4ge1xuICB2cGMuYWRkQ2xpZW50VnBuRW5kcG9pbnQoJ0VuZHBvaW50Jywge1xuICAgIGNpZHI6ICcxMC4xMDAuMC4wLzE2JyxcbiAgICBzZXJ2ZXJDZXJ0aWZpY2F0ZUFybjogJ3NlcnZlci1jZXJ0aWZpY2F0ZS1hcm4nLFxuICAgIGNsaWVudENlcnRpZmljYXRlQXJuOiAnY2xpZW50LWNlcnRpZmljYXRlLWFybicsXG4gICAgY2xpZW50TG9naW5CYW5uZXI6ICdXZWxjb21lIScsXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6Q2xpZW50VnBuRW5kcG9pbnQnLCB7XG4gICAgQ2xpZW50TG9naW5CYW5uZXJPcHRpb25zOiB7XG4gICAgICBFbmFibGVkOiB0cnVlLFxuICAgICAgQmFubmVyVGV4dDogJ1dlbGNvbWUhJyxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCd0aHJvd3Mgd2l0aCBtb3JlIHRoYW4gMiBkbnMgc2VydmVycycsICgpID0+IHtcbiAgZXhwZWN0KCgpID0+IHZwYy5hZGRDbGllbnRWcG5FbmRwb2ludCgnRW5kcG9pbnQnLCB7XG4gICAgY2lkcjogJzEwLjEwMC4wLjAvMTYnLFxuICAgIHNlcnZlckNlcnRpZmljYXRlQXJuOiAnc2VydmVyLWNlcnRpZmljYXRlLWFybicsXG4gICAgY2xpZW50Q2VydGlmaWNhdGVBcm46ICdjbGllbnQtY2VydGlmaWNhdGUtYXJuJyxcbiAgICBkbnNTZXJ2ZXJzOiBbJzEuMS4xLjEnLCAnMi4yLjIuMicsICczLjMuMy4zJ10sXG4gIH0pKS50b1Rocm93KC9BIGNsaWVudCBWUE4gZW5kcG9pbnQgY2FuIGhhdmUgdXAgdG8gdHdvIEROUyBzZXJ2ZXJzLyk7XG59KTtcblxudGVzdCgndGhyb3dzIHdoZW4gc3BlY2lmeWluZyBsb2dHcm91cCB3aXRoIGxvZ2dpbmcgZGlzYWJsZWQnLCAoKSA9PiB7XG4gIGV4cGVjdCgoKSA9PiB2cGMuYWRkQ2xpZW50VnBuRW5kcG9pbnQoJ0VuZHBvaW50Jywge1xuICAgIGNpZHI6ICcxMC4xMDAuMC4wLzE2JyxcbiAgICBzZXJ2ZXJDZXJ0aWZpY2F0ZUFybjogJ3NlcnZlci1jZXJ0aWZpY2F0ZS1hcm4nLFxuICAgIGNsaWVudENlcnRpZmljYXRlQXJuOiAnY2xpZW50LWNlcnRpZmljYXRlLWFybicsXG4gICAgbG9nZ2luZzogZmFsc2UsXG4gICAgbG9nR3JvdXA6IG5ldyBsb2dzLkxvZ0dyb3VwKHN0YWNrLCAnTG9nR3JvdXAnKSxcbiAgfSkpLnRvVGhyb3coL0Nhbm5vdCBzcGVjaWZ5IGBsb2dHcm91cGAgb3IgYGxvZ1N0cmVhbWAgd2hlbiBsb2dnaW5nIGlzIGRpc2FibGVkLyk7XG59KTtcblxudGVzdCgndGhyb3dzIHdpdGhvdXQgYXV0aGVudGljYXRpb24gb3B0aW9ucycsICgpID0+IHtcbiAgZXhwZWN0KCgpID0+IHZwYy5hZGRDbGllbnRWcG5FbmRwb2ludCgnRW5kcG9pbnQnLCB7XG4gICAgY2lkcjogJzEwLjEwMC4wLjAvMTYnLFxuICAgIHNlcnZlckNlcnRpZmljYXRlQXJuOiAnc2VydmVyLWNlcnRpZmljYXRlLWFybicsXG4gIH0pKS50b1Rocm93KC9BIGNsaWVudCBWUE4gZW5kcG9pbnQgbXVzdCB1c2UgYXQgbGVhc3Qgb25lIGF1dGhlbnRpY2F0aW9uIG9wdGlvbi8pO1xufSk7XG4iXX0=