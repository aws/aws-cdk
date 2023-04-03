"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const ec2 = require("@aws-cdk/aws-ec2");
const route53 = require("@aws-cdk/aws-route53");
const core_1 = require("@aws-cdk/core");
const targets = require("../lib");
test('use InterfaceVpcEndpoint as record target', () => {
    // GIVEN
    const stack = new core_1.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const interfaceVpcEndpoint = new ec2.InterfaceVpcEndpoint(stack, 'InterfaceEndpoint', {
        vpc,
        service: {
            name: 'com.amazonaws.us-west-2.workspaces',
            port: 80,
        },
    });
    const zone = new route53.PrivateHostedZone(stack, 'PrivateZone', {
        vpc,
        zoneName: 'test.aws.cdk.com',
    });
    // WHEN
    new route53.ARecord(stack, 'AliasEndpointRecord', {
        zone,
        recordName: 'foo',
        target: route53.RecordTarget.fromAlias(new targets.InterfaceVpcEndpointTarget(interfaceVpcEndpoint)),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
        AliasTarget: {
            HostedZoneId: {
                'Fn::Select': [
                    0,
                    {
                        'Fn::Split': [
                            ':',
                            {
                                'Fn::Select': [
                                    0,
                                    {
                                        'Fn::GetAtt': [
                                            'InterfaceEndpoint12DE6E71',
                                            'DnsEntries',
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            DNSName: {
                'Fn::Select': [
                    1,
                    {
                        'Fn::Split': [
                            ':',
                            {
                                'Fn::Select': [
                                    0,
                                    {
                                        'Fn::GetAtt': [
                                            'InterfaceEndpoint12DE6E71',
                                            'DnsEntries',
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        },
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJmYWNlLXZwYy1lbmRwb2ludC10YXJnZXQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVyZmFjZS12cGMtZW5kcG9pbnQtdGFyZ2V0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0Msd0NBQXdDO0FBQ3hDLGdEQUFnRDtBQUNoRCx3Q0FBc0M7QUFDdEMsa0NBQWtDO0FBRWxDLElBQUksQ0FBQywyQ0FBMkMsRUFBRSxHQUFHLEVBQUU7SUFDckQsUUFBUTtJQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7SUFDMUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUV0QyxNQUFNLG9CQUFvQixHQUFHLElBQUksR0FBRyxDQUFDLG9CQUFvQixDQUFDLEtBQUssRUFBRSxtQkFBbUIsRUFBRTtRQUNwRixHQUFHO1FBQ0gsT0FBTyxFQUFFO1lBQ1AsSUFBSSxFQUFFLG9DQUFvQztZQUMxQyxJQUFJLEVBQUUsRUFBRTtTQUNUO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxJQUFJLEdBQUcsSUFBSSxPQUFPLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRTtRQUMvRCxHQUFHO1FBQ0gsUUFBUSxFQUFFLGtCQUFrQjtLQUM3QixDQUFDLENBQUM7SUFFSCxPQUFPO0lBQ1AsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxxQkFBcUIsRUFBRTtRQUNoRCxJQUFJO1FBQ0osVUFBVSxFQUFFLEtBQUs7UUFDakIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLElBQUksT0FBTyxDQUFDLDBCQUEwQixDQUFDLG9CQUFvQixDQUFDLENBQUM7S0FDckcsQ0FBQyxDQUFDO0lBRUgsT0FBTztJQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHlCQUF5QixFQUFFO1FBQ3pFLFdBQVcsRUFBRTtZQUNYLFlBQVksRUFBRTtnQkFDWixZQUFZLEVBQUU7b0JBQ1osQ0FBQztvQkFDRDt3QkFDRSxXQUFXLEVBQUU7NEJBQ1gsR0FBRzs0QkFDSDtnQ0FDRSxZQUFZLEVBQUU7b0NBQ1osQ0FBQztvQ0FDRDt3Q0FDRSxZQUFZLEVBQUU7NENBQ1osMkJBQTJCOzRDQUMzQixZQUFZO3lDQUNiO3FDQUNGO2lDQUNGOzZCQUNGO3lCQUNGO3FCQUNGO2lCQUNGO2FBQ0Y7WUFDRCxPQUFPLEVBQUU7Z0JBQ1AsWUFBWSxFQUFFO29CQUNaLENBQUM7b0JBQ0Q7d0JBQ0UsV0FBVyxFQUFFOzRCQUNYLEdBQUc7NEJBQ0g7Z0NBQ0UsWUFBWSxFQUFFO29DQUNaLENBQUM7b0NBQ0Q7d0NBQ0UsWUFBWSxFQUFFOzRDQUNaLDJCQUEyQjs0Q0FDM0IsWUFBWTt5Q0FDYjtxQ0FDRjtpQ0FDRjs2QkFDRjt5QkFDRjtxQkFDRjtpQkFDRjthQUNGO1NBQ0Y7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyByb3V0ZTUzIGZyb20gJ0Bhd3MtY2RrL2F3cy1yb3V0ZTUzJztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyB0YXJnZXRzIGZyb20gJy4uL2xpYic7XG5cbnRlc3QoJ3VzZSBJbnRlcmZhY2VWcGNFbmRwb2ludCBhcyByZWNvcmQgdGFyZ2V0JywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZQQycpO1xuXG4gIGNvbnN0IGludGVyZmFjZVZwY0VuZHBvaW50ID0gbmV3IGVjMi5JbnRlcmZhY2VWcGNFbmRwb2ludChzdGFjaywgJ0ludGVyZmFjZUVuZHBvaW50Jywge1xuICAgIHZwYyxcbiAgICBzZXJ2aWNlOiB7XG4gICAgICBuYW1lOiAnY29tLmFtYXpvbmF3cy51cy13ZXN0LTIud29ya3NwYWNlcycsXG4gICAgICBwb3J0OiA4MCxcbiAgICB9LFxuICB9KTtcbiAgY29uc3Qgem9uZSA9IG5ldyByb3V0ZTUzLlByaXZhdGVIb3N0ZWRab25lKHN0YWNrLCAnUHJpdmF0ZVpvbmUnLCB7XG4gICAgdnBjLFxuICAgIHpvbmVOYW1lOiAndGVzdC5hd3MuY2RrLmNvbScsXG4gIH0pO1xuXG4gIC8vIFdIRU5cbiAgbmV3IHJvdXRlNTMuQVJlY29yZChzdGFjaywgJ0FsaWFzRW5kcG9pbnRSZWNvcmQnLCB7XG4gICAgem9uZSxcbiAgICByZWNvcmROYW1lOiAnZm9vJyxcbiAgICB0YXJnZXQ6IHJvdXRlNTMuUmVjb3JkVGFyZ2V0LmZyb21BbGlhcyhuZXcgdGFyZ2V0cy5JbnRlcmZhY2VWcGNFbmRwb2ludFRhcmdldChpbnRlcmZhY2VWcGNFbmRwb2ludCkpLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlJvdXRlNTM6OlJlY29yZFNldCcsIHtcbiAgICBBbGlhc1RhcmdldDoge1xuICAgICAgSG9zdGVkWm9uZUlkOiB7XG4gICAgICAgICdGbjo6U2VsZWN0JzogW1xuICAgICAgICAgIDAsXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0ZuOjpTcGxpdCc6IFtcbiAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpTZWxlY3QnOiBbXG4gICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAnSW50ZXJmYWNlRW5kcG9pbnQxMkRFNkU3MScsXG4gICAgICAgICAgICAgICAgICAgICAgJ0Ruc0VudHJpZXMnLFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIEROU05hbWU6IHtcbiAgICAgICAgJ0ZuOjpTZWxlY3QnOiBbXG4gICAgICAgICAgMSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnRm46OlNwbGl0JzogW1xuICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnRm46OlNlbGVjdCc6IFtcbiAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICdJbnRlcmZhY2VFbmRwb2ludDEyREU2RTcxJyxcbiAgICAgICAgICAgICAgICAgICAgICAnRG5zRW50cmllcycsXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xufSk7XG4iXX0=