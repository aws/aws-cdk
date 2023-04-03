"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const ec2 = require("@aws-cdk/aws-ec2");
const cdk = require("@aws-cdk/core");
const servicediscovery = require("../lib");
const lib_1 = require("../lib");
describe('service', () => {
    test('Service for HTTP namespace with custom health check', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const namespace = new servicediscovery.HttpNamespace(stack, 'MyNamespace', {
            name: 'http',
        });
        namespace.createService('MyService', {
            name: 'service',
            description: 'service description',
            customHealthCheck: {
                failureThreshold: 3,
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                MyNamespaceD0BB8558: {
                    Type: 'AWS::ServiceDiscovery::HttpNamespace',
                    Properties: {
                        Name: 'http',
                    },
                },
                MyNamespaceMyService365E2470: {
                    Type: 'AWS::ServiceDiscovery::Service',
                    Properties: {
                        Description: 'service description',
                        HealthCheckCustomConfig: {
                            FailureThreshold: 3,
                        },
                        Name: 'service',
                        NamespaceId: {
                            'Fn::GetAtt': [
                                'MyNamespaceD0BB8558',
                                'Id',
                            ],
                        },
                    },
                },
            },
        });
    });
    test('Service for HTTP namespace with health check', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const namespace = new servicediscovery.HttpNamespace(stack, 'MyNamespace', {
            name: 'http',
        });
        namespace.createService('MyService', {
            name: 'service',
            description: 'service description',
            healthCheck: {
                type: servicediscovery.HealthCheckType.HTTP,
                resourcePath: '/check',
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                MyNamespaceD0BB8558: {
                    Type: 'AWS::ServiceDiscovery::HttpNamespace',
                    Properties: {
                        Name: 'http',
                    },
                },
                MyNamespaceMyService365E2470: {
                    Type: 'AWS::ServiceDiscovery::Service',
                    Properties: {
                        Description: 'service description',
                        HealthCheckConfig: {
                            FailureThreshold: 1,
                            ResourcePath: '/check',
                            Type: 'HTTP',
                        },
                        Name: 'service',
                        NamespaceId: {
                            'Fn::GetAtt': [
                                'MyNamespaceD0BB8558',
                                'Id',
                            ],
                        },
                    },
                },
            },
        });
    });
    test('Service for Public DNS namespace', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
            name: 'dns',
        });
        namespace.createService('MyService', {
            name: 'service',
            description: 'service description',
            customHealthCheck: {
                failureThreshold: 3,
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                MyNamespaceD0BB8558: {
                    Type: 'AWS::ServiceDiscovery::PublicDnsNamespace',
                    Properties: {
                        Name: 'dns',
                    },
                },
                MyNamespaceMyService365E2470: {
                    Type: 'AWS::ServiceDiscovery::Service',
                    Properties: {
                        Description: 'service description',
                        DnsConfig: {
                            DnsRecords: [
                                {
                                    TTL: 60,
                                    Type: 'A',
                                },
                            ],
                            NamespaceId: {
                                'Fn::GetAtt': [
                                    'MyNamespaceD0BB8558',
                                    'Id',
                                ],
                            },
                            RoutingPolicy: 'MULTIVALUE',
                        },
                        HealthCheckCustomConfig: {
                            FailureThreshold: 3,
                        },
                        Name: 'service',
                        NamespaceId: {
                            'Fn::GetAtt': [
                                'MyNamespaceD0BB8558',
                                'Id',
                            ],
                        },
                    },
                },
            },
        });
    });
    test('Service for Public DNS namespace with A and AAAA records', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
            name: 'dns',
        });
        namespace.createService('MyService', {
            dnsRecordType: servicediscovery.DnsRecordType.A_AAAA,
        });
        // THEN
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                MyNamespaceD0BB8558: {
                    Type: 'AWS::ServiceDiscovery::PublicDnsNamespace',
                    Properties: {
                        Name: 'dns',
                    },
                },
                MyNamespaceMyService365E2470: {
                    Type: 'AWS::ServiceDiscovery::Service',
                    Properties: {
                        DnsConfig: {
                            DnsRecords: [
                                {
                                    TTL: 60,
                                    Type: 'A',
                                },
                                {
                                    TTL: 60,
                                    Type: 'AAAA',
                                },
                            ],
                            NamespaceId: {
                                'Fn::GetAtt': [
                                    'MyNamespaceD0BB8558',
                                    'Id',
                                ],
                            },
                            RoutingPolicy: 'MULTIVALUE',
                        },
                        NamespaceId: {
                            'Fn::GetAtt': [
                                'MyNamespaceD0BB8558',
                                'Id',
                            ],
                        },
                    },
                },
            },
        });
    });
    test('Defaults to WEIGHTED routing policy for CNAME', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
            name: 'dns',
        });
        namespace.createService('MyService', {
            dnsRecordType: servicediscovery.DnsRecordType.CNAME,
        });
        // THEN
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                MyNamespaceD0BB8558: {
                    Type: 'AWS::ServiceDiscovery::PublicDnsNamespace',
                    Properties: {
                        Name: 'dns',
                    },
                },
                MyNamespaceMyService365E2470: {
                    Type: 'AWS::ServiceDiscovery::Service',
                    Properties: {
                        DnsConfig: {
                            DnsRecords: [
                                {
                                    TTL: 60,
                                    Type: 'CNAME',
                                },
                            ],
                            NamespaceId: {
                                'Fn::GetAtt': [
                                    'MyNamespaceD0BB8558',
                                    'Id',
                                ],
                            },
                            RoutingPolicy: 'WEIGHTED',
                        },
                        NamespaceId: {
                            'Fn::GetAtt': [
                                'MyNamespaceD0BB8558',
                                'Id',
                            ],
                        },
                    },
                },
            },
        });
    });
    test('Throws when specifying both healthCheckConfig and healthCheckCustomConfig on PublicDnsNamespace', () => {
        const stack = new cdk.Stack();
        const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
            name: 'name',
        });
        // THEN
        expect(() => {
            namespace.createService('MyService', {
                name: 'service',
                healthCheck: {
                    resourcePath: '/',
                },
                customHealthCheck: {
                    failureThreshold: 1,
                },
            });
        }).toThrow(/`healthCheckConfig`.+`healthCheckCustomConfig`/);
    });
    test('Throws when specifying healthCheckConfig on PrivateDnsNamespace', () => {
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc');
        const namespace = new servicediscovery.PrivateDnsNamespace(stack, 'MyNamespace', {
            name: 'name',
            vpc,
        });
        // THEN
        expect(() => {
            namespace.createService('MyService', {
                name: 'service',
                healthCheck: {
                    resourcePath: '/',
                },
                customHealthCheck: {
                    failureThreshold: 1,
                },
            });
        }).toThrow(/`healthCheckConfig`.+`healthCheckCustomConfig`/);
    });
    test('Throws when using CNAME and Multivalue routing policy', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
            name: 'name',
        });
        // THEN
        expect(() => {
            namespace.createService('MyService', {
                name: 'service',
                dnsRecordType: servicediscovery.DnsRecordType.CNAME,
                routingPolicy: servicediscovery.RoutingPolicy.MULTIVALUE,
            });
        }).toThrow(/Cannot use `CNAME` record when routing policy is `Multivalue`./);
    });
    test('Throws when specifying resourcePath with TCP', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
            name: 'name',
        });
        // THEN
        expect(() => {
            namespace.createService('MyService', {
                name: 'service',
                healthCheck: {
                    type: servicediscovery.HealthCheckType.TCP,
                    resourcePath: '/check',
                },
            });
        }).toThrow(/`resourcePath`.+`TCP`/);
    });
    test('Throws when specifying loadbalancer with wrong DnsRecordType', () => {
        const stack = new cdk.Stack();
        const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
            name: 'name',
        });
        // THEN
        expect(() => {
            namespace.createService('MyService', {
                name: 'service',
                dnsRecordType: servicediscovery.DnsRecordType.CNAME,
                loadBalancer: true,
            });
        }).toThrow(/Must support `A` or `AAAA` records to register loadbalancers/);
    });
    test('Throws when specifying loadbalancer with Multivalue routing Policy', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
            name: 'http',
        });
        // THEN
        expect(() => {
            namespace.createService('MyService', {
                loadBalancer: true,
                routingPolicy: servicediscovery.RoutingPolicy.MULTIVALUE,
            });
        }).toThrow(/Cannot register loadbalancers when routing policy is `Multivalue`./);
    });
    test('Throws when specifying discovery type of DNS within a HttpNamespace', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const namespace = new servicediscovery.HttpNamespace(stack, 'MyNamespace', {
            name: 'http',
        });
        // THEN
        expect(() => {
            new servicediscovery.Service(stack, 'Service', {
                namespace,
                discoveryType: lib_1.DiscoveryType.DNS_AND_API,
            });
        }).toThrow(/Cannot specify `discoveryType` of DNS_AND_API when using an HTTP namespace./);
    });
    test('Service for Private DNS namespace', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc');
        const namespace = new servicediscovery.PrivateDnsNamespace(stack, 'MyNamespace', {
            name: 'private',
            vpc,
        });
        namespace.createService('MyService', {
            name: 'service',
            description: 'service description',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::PrivateDnsNamespace', {
            Name: 'private',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::Service', {
            Description: 'service description',
            DnsConfig: {
                DnsRecords: [
                    {
                        TTL: 60,
                        Type: 'A',
                    },
                ],
                NamespaceId: {
                    'Fn::GetAtt': [
                        'MyNamespaceD0BB8558',
                        'Id',
                    ],
                },
                RoutingPolicy: 'MULTIVALUE',
            },
            Name: 'service',
            NamespaceId: {
                'Fn::GetAtt': [
                    'MyNamespaceD0BB8558',
                    'Id',
                ],
            },
        });
    });
    test('Service for DNS namespace with API only discovery', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc');
        const namespace = new servicediscovery.PrivateDnsNamespace(stack, 'MyNamespace', {
            name: 'private',
            vpc,
        });
        namespace.createService('MyService', {
            name: 'service',
            description: 'service description',
            discoveryType: lib_1.DiscoveryType.API,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::PrivateDnsNamespace', {
            Name: 'private',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::Service', {
            Description: 'service description',
            Name: 'service',
            NamespaceId: {
                'Fn::GetAtt': [
                    'MyNamespaceD0BB8558',
                    'Id',
                ],
            },
            Type: 'HTTP',
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VydmljZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLHdDQUF3QztBQUN4QyxxQ0FBcUM7QUFDckMsMkNBQTJDO0FBQzNDLGdDQUF1QztBQUV2QyxRQUFRLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRTtJQUN2QixJQUFJLENBQUMscURBQXFELEVBQUUsR0FBRyxFQUFFO1FBQy9ELFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUU5QixNQUFNLFNBQVMsR0FBRyxJQUFJLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFO1lBQ3pFLElBQUksRUFBRSxNQUFNO1NBQ2IsQ0FBQyxDQUFDO1FBRUgsU0FBUyxDQUFDLGFBQWEsQ0FBQyxXQUFXLEVBQUU7WUFDbkMsSUFBSSxFQUFFLFNBQVM7WUFDZixXQUFXLEVBQUUscUJBQXFCO1lBQ2xDLGlCQUFpQixFQUFFO2dCQUNqQixnQkFBZ0IsRUFBRSxDQUFDO2FBQ3BCO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLGVBQWUsQ0FBQztZQUN4QyxTQUFTLEVBQUU7Z0JBQ1QsbUJBQW1CLEVBQUU7b0JBQ25CLElBQUksRUFBRSxzQ0FBc0M7b0JBQzVDLFVBQVUsRUFBRTt3QkFDVixJQUFJLEVBQUUsTUFBTTtxQkFDYjtpQkFDRjtnQkFDRCw0QkFBNEIsRUFBRTtvQkFDNUIsSUFBSSxFQUFFLGdDQUFnQztvQkFDdEMsVUFBVSxFQUFFO3dCQUNWLFdBQVcsRUFBRSxxQkFBcUI7d0JBQ2xDLHVCQUF1QixFQUFFOzRCQUN2QixnQkFBZ0IsRUFBRSxDQUFDO3lCQUNwQjt3QkFDRCxJQUFJLEVBQUUsU0FBUzt3QkFDZixXQUFXLEVBQUU7NEJBQ1gsWUFB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SSxFQUFFLFNBQVM7WUFDZixXQUFXLEVBQUUscUJBQXFCO1lBQ2xDLGFBQWEsRUFBRSxtQkFBYSxDQUFDLEdBQUc7U0FDakMsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDRDQUE0QyxFQUFFO1lBQzVGLElBQUksRUFBRSxTQUFTO1NBQ2hCLENBQUMsQ0FBQztRQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGdDQUFnQyxFQUFFO1lBQ2hGLFdBQVcsRUFBRSxxQkFBcUI7WUFDbEMsSUFBSSxFQUFFLFNBQVM7WUFDZixXQUFXLEVBQUU7Z0JBQ1gsWUFBWSxFQUFFO29CQUNaLHFCQUFxQjtvQkFDckIsSUFBSTtpQkFDTDthQUNGO1lBQ0QsSUFBSSxFQUFFLE1BQU07U0FDYixDQUFDLENBQUM7SUFFTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIHNlcnZpY2VkaXNjb3ZlcnkgZnJvbSAnLi4vbGliJztcbmltcG9ydCB7IERpc2NvdmVyeVR5cGUgfSBmcm9tICcuLi9saWInO1xuXG5kZXNjcmliZSgnc2VydmljZScsICgpID0+IHtcbiAgdGVzdCgnU2VydmljZSBmb3IgSFRUUCBuYW1lc3BhY2Ugd2l0aCBjdXN0b20gaGVhbHRoIGNoZWNrJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBjb25zdCBuYW1lc3BhY2UgPSBuZXcgc2VydmljZWRpc2NvdmVyeS5IdHRwTmFtZXNwYWNlKHN0YWNrLCAnTXlOYW1lc3BhY2UnLCB7XG4gICAgICBuYW1lOiAnaHR0cCcsXG4gICAgfSk7XG5cbiAgICBuYW1lc3BhY2UuY3JlYXRlU2VydmljZSgnTXlTZXJ2aWNlJywge1xuICAgICAgbmFtZTogJ3NlcnZpY2UnLFxuICAgICAgZGVzY3JpcHRpb246ICdzZXJ2aWNlIGRlc2NyaXB0aW9uJyxcbiAgICAgIGN1c3RvbUhlYWx0aENoZWNrOiB7XG4gICAgICAgIGZhaWx1cmVUaHJlc2hvbGQ6IDMsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBNeU5hbWVzcGFjZUQwQkI4NTU4OiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6U2VydmljZURpc2NvdmVyeTo6SHR0cE5hbWVzcGFjZScsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgTmFtZTogJ2h0dHAnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIE15TmFtZXNwYWNlTXlTZXJ2aWNlMzY1RTI0NzA6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpTZXJ2aWNlRGlzY292ZXJ5OjpTZXJ2aWNlJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBEZXNjcmlwdGlvbjogJ3NlcnZpY2UgZGVzY3JpcHRpb24nLFxuICAgICAgICAgICAgSGVhbHRoQ2hlY2tDdXN0b21Db25maWc6IHtcbiAgICAgICAgICAgICAgRmFpbHVyZVRocmVzaG9sZDogMyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBOYW1lOiAnc2VydmljZScsXG4gICAgICAgICAgICBOYW1lc3BhY2VJZDoge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnTXlOYW1lc3BhY2VEMEJCODU1OCcsXG4gICAgICAgICAgICAgICAgJ0lkJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdTZXJ2aWNlIGZvciBIVFRQIG5hbWVzcGFjZSB3aXRoIGhlYWx0aCBjaGVjaycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3QgbmFtZXNwYWNlID0gbmV3IHNlcnZpY2VkaXNjb3ZlcnkuSHR0cE5hbWVzcGFjZShzdGFjaywgJ015TmFtZXNwYWNlJywge1xuICAgICAgbmFtZTogJ2h0dHAnLFxuICAgIH0pO1xuXG4gICAgbmFtZXNwYWNlLmNyZWF0ZVNlcnZpY2UoJ015U2VydmljZScsIHtcbiAgICAgIG5hbWU6ICdzZXJ2aWNlJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnc2VydmljZSBkZXNjcmlwdGlvbicsXG4gICAgICBoZWFsdGhDaGVjazoge1xuICAgICAgICB0eXBlOiBzZXJ2aWNlZGlzY292ZXJ5LkhlYWx0aENoZWNrVHlwZS5IVFRQLFxuICAgICAgICByZXNvdXJjZVBhdGg6ICcvY2hlY2snLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgTXlOYW1lc3BhY2VEMEJCODU1ODoge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OlNlcnZpY2VEaXNjb3Zlcnk6Okh0dHBOYW1lc3BhY2UnLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIE5hbWU6ICdodHRwJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBNeU5hbWVzcGFjZU15U2VydmljZTM2NUUyNDcwOiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6U2VydmljZURpc2NvdmVyeTo6U2VydmljZScsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgRGVzY3JpcHRpb246ICdzZXJ2aWNlIGRlc2NyaXB0aW9uJyxcbiAgICAgICAgICAgIEhlYWx0aENoZWNrQ29uZmlnOiB7XG4gICAgICAgICAgICAgIEZhaWx1cmVUaHJlc2hvbGQ6IDEsXG4gICAgICAgICAgICAgIFJlc291cmNlUGF0aDogJy9jaGVjaycsXG4gICAgICAgICAgICAgIFR5cGU6ICdIVFRQJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBOYW1lOiAnc2VydmljZScsXG4gICAgICAgICAgICBOYW1lc3BhY2VJZDoge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnTXlOYW1lc3BhY2VEMEJCODU1OCcsXG4gICAgICAgICAgICAgICAgJ0lkJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdTZXJ2aWNlIGZvciBQdWJsaWMgRE5TIG5hbWVzcGFjZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3QgbmFtZXNwYWNlID0gbmV3IHNlcnZpY2VkaXNjb3ZlcnkuUHVibGljRG5zTmFtZXNwYWNlKHN0YWNrLCAnTXlOYW1lc3BhY2UnLCB7XG4gICAgICBuYW1lOiAnZG5zJyxcbiAgICB9KTtcblxuICAgIG5hbWVzcGFjZS5jcmVhdGVTZXJ2aWNlKCdNeVNlcnZpY2UnLCB7XG4gICAgICBuYW1lOiAnc2VydmljZScsXG4gICAgICBkZXNjcmlwdGlvbjogJ3NlcnZpY2UgZGVzY3JpcHRpb24nLFxuICAgICAgY3VzdG9tSGVhbHRoQ2hlY2s6IHtcbiAgICAgICAgZmFpbHVyZVRocmVzaG9sZDogMyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIE15TmFtZXNwYWNlRDBCQjg1NTg6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpTZXJ2aWNlRGlzY292ZXJ5OjpQdWJsaWNEbnNOYW1lc3BhY2UnLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIE5hbWU6ICdkbnMnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIE15TmFtZXNwYWNlTXlTZXJ2aWNlMzY1RTI0NzA6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpTZXJ2aWNlRGlzY292ZXJ5OjpTZXJ2aWNlJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBEZXNjcmlwdGlvbjogJ3NlcnZpY2UgZGVzY3JpcHRpb24nLFxuICAgICAgICAgICAgRG5zQ29uZmlnOiB7XG4gICAgICAgICAgICAgIERuc1JlY29yZHM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBUVEw6IDYwLFxuICAgICAgICAgICAgICAgICAgVHlwZTogJ0EnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIE5hbWVzcGFjZUlkOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAnTXlOYW1lc3BhY2VEMEJCODU1OCcsXG4gICAgICAgICAgICAgICAgICAnSWQnLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFJvdXRpbmdQb2xpY3k6ICdNVUxUSVZBTFVFJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBIZWFsdGhDaGVja0N1c3RvbUNvbmZpZzoge1xuICAgICAgICAgICAgICBGYWlsdXJlVGhyZXNob2xkOiAzLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIE5hbWU6ICdzZXJ2aWNlJyxcbiAgICAgICAgICAgIE5hbWVzcGFjZUlkOiB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdNeU5hbWVzcGFjZUQwQkI4NTU4JyxcbiAgICAgICAgICAgICAgICAnSWQnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ1NlcnZpY2UgZm9yIFB1YmxpYyBETlMgbmFtZXNwYWNlIHdpdGggQSBhbmQgQUFBQSByZWNvcmRzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBjb25zdCBuYW1lc3BhY2UgPSBuZXcgc2VydmljZWRpc2NvdmVyeS5QdWJsaWNEbnNOYW1lc3BhY2Uoc3RhY2ssICdNeU5hbWVzcGFjZScsIHtcbiAgICAgIG5hbWU6ICdkbnMnLFxuICAgIH0pO1xuXG4gICAgbmFtZXNwYWNlLmNyZWF0ZVNlcnZpY2UoJ015U2VydmljZScsIHtcbiAgICAgIGRuc1JlY29yZFR5cGU6IHNlcnZpY2VkaXNjb3ZlcnkuRG5zUmVjb3JkVHlwZS5BX0FBQUEsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIE15TmFtZXNwYWNlRDBCQjg1NTg6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpTZXJ2aWNlRGlzY292ZXJ5OjpQdWJsaWNEbnNOYW1lc3BhY2UnLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIE5hbWU6ICdkbnMnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIE15TmFtZXNwYWNlTXlTZXJ2aWNlMzY1RTI0NzA6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpTZXJ2aWNlRGlzY292ZXJ5OjpTZXJ2aWNlJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBEbnNDb25maWc6IHtcbiAgICAgICAgICAgICAgRG5zUmVjb3JkczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFRUTDogNjAsXG4gICAgICAgICAgICAgICAgICBUeXBlOiAnQScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBUVEw6IDYwLFxuICAgICAgICAgICAgICAgICAgVHlwZTogJ0FBQUEnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIE5hbWVzcGFjZUlkOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAnTXlOYW1lc3BhY2VEMEJCODU1OCcsXG4gICAgICAgICAgICAgICAgICAnSWQnLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFJvdXRpbmdQb2xpY3k6ICdNVUxUSVZBTFVFJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBOYW1lc3BhY2VJZDoge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnTXlOYW1lc3BhY2VEMEJCODU1OCcsXG4gICAgICAgICAgICAgICAgJ0lkJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdEZWZhdWx0cyB0byBXRUlHSFRFRCByb3V0aW5nIHBvbGljeSBmb3IgQ05BTUUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IG5hbWVzcGFjZSA9IG5ldyBzZXJ2aWNlZGlzY292ZXJ5LlB1YmxpY0Ruc05hbWVzcGFjZShzdGFjaywgJ015TmFtZXNwYWNlJywge1xuICAgICAgbmFtZTogJ2RucycsXG4gICAgfSk7XG5cbiAgICBuYW1lc3BhY2UuY3JlYXRlU2VydmljZSgnTXlTZXJ2aWNlJywge1xuICAgICAgZG5zUmVjb3JkVHlwZTogc2VydmljZWRpc2NvdmVyeS5EbnNSZWNvcmRUeXBlLkNOQU1FLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBNeU5hbWVzcGFjZUQwQkI4NTU4OiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6U2VydmljZURpc2NvdmVyeTo6UHVibGljRG5zTmFtZXNwYWNlJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBOYW1lOiAnZG5zJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBNeU5hbWVzcGFjZU15U2VydmljZTM2NUUyNDcwOiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6U2VydmljZURpc2NvdmVyeTo6U2VydmljZScsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgRG5zQ29uZmlnOiB7XG4gICAgICAgICAgICAgIERuc1JlY29yZHM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBUVEw6IDYwLFxuICAgICAgICAgICAgICAgICAgVHlwZTogJ0NOQU1FJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBOYW1lc3BhY2VJZDoge1xuICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgJ015TmFtZXNwYWNlRDBCQjg1NTgnLFxuICAgICAgICAgICAgICAgICAgJ0lkJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBSb3V0aW5nUG9saWN5OiAnV0VJR0hURUQnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIE5hbWVzcGFjZUlkOiB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdNeU5hbWVzcGFjZUQwQkI4NTU4JyxcbiAgICAgICAgICAgICAgICAnSWQnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ1Rocm93cyB3aGVuIHNwZWNpZnlpbmcgYm90aCBoZWFsdGhDaGVja0NvbmZpZyBhbmQgaGVhbHRoQ2hlY2tDdXN0b21Db25maWcgb24gUHVibGljRG5zTmFtZXNwYWNlJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3QgbmFtZXNwYWNlID0gbmV3IHNlcnZpY2VkaXNjb3ZlcnkuUHVibGljRG5zTmFtZXNwYWNlKHN0YWNrLCAnTXlOYW1lc3BhY2UnLCB7XG4gICAgICBuYW1lOiAnbmFtZScsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5hbWVzcGFjZS5jcmVhdGVTZXJ2aWNlKCdNeVNlcnZpY2UnLCB7XG4gICAgICAgIG5hbWU6ICdzZXJ2aWNlJyxcbiAgICAgICAgaGVhbHRoQ2hlY2s6IHtcbiAgICAgICAgICByZXNvdXJjZVBhdGg6ICcvJyxcbiAgICAgICAgfSxcbiAgICAgICAgY3VzdG9tSGVhbHRoQ2hlY2s6IHtcbiAgICAgICAgICBmYWlsdXJlVGhyZXNob2xkOiAxLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdygvYGhlYWx0aENoZWNrQ29uZmlnYC4rYGhlYWx0aENoZWNrQ3VzdG9tQ29uZmlnYC8pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnVGhyb3dzIHdoZW4gc3BlY2lmeWluZyBoZWFsdGhDaGVja0NvbmZpZyBvbiBQcml2YXRlRG5zTmFtZXNwYWNlJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnKTtcblxuICAgIGNvbnN0IG5hbWVzcGFjZSA9IG5ldyBzZXJ2aWNlZGlzY292ZXJ5LlByaXZhdGVEbnNOYW1lc3BhY2Uoc3RhY2ssICdNeU5hbWVzcGFjZScsIHtcbiAgICAgIG5hbWU6ICduYW1lJyxcbiAgICAgIHZwYyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmFtZXNwYWNlLmNyZWF0ZVNlcnZpY2UoJ015U2VydmljZScsIHtcbiAgICAgICAgbmFtZTogJ3NlcnZpY2UnLFxuICAgICAgICBoZWFsdGhDaGVjazoge1xuICAgICAgICAgIHJlc291cmNlUGF0aDogJy8nLFxuICAgICAgICB9LFxuICAgICAgICBjdXN0b21IZWFsdGhDaGVjazoge1xuICAgICAgICAgIGZhaWx1cmVUaHJlc2hvbGQ6IDEsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC9gaGVhbHRoQ2hlY2tDb25maWdgLitgaGVhbHRoQ2hlY2tDdXN0b21Db25maWdgLyk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdUaHJvd3Mgd2hlbiB1c2luZyBDTkFNRSBhbmQgTXVsdGl2YWx1ZSByb3V0aW5nIHBvbGljeScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3QgbmFtZXNwYWNlID0gbmV3IHNlcnZpY2VkaXNjb3ZlcnkuUHVibGljRG5zTmFtZXNwYWNlKHN0YWNrLCAnTXlOYW1lc3BhY2UnLCB7XG4gICAgICBuYW1lOiAnbmFtZScsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5hbWVzcGFjZS5jcmVhdGVTZXJ2aWNlKCdNeVNlcnZpY2UnLCB7XG4gICAgICAgIG5hbWU6ICdzZXJ2aWNlJyxcbiAgICAgICAgZG5zUmVjb3JkVHlwZTogc2VydmljZWRpc2NvdmVyeS5EbnNSZWNvcmRUeXBlLkNOQU1FLFxuICAgICAgICByb3V0aW5nUG9saWN5OiBzZXJ2aWNlZGlzY292ZXJ5LlJvdXRpbmdQb2xpY3kuTVVMVElWQUxVRSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL0Nhbm5vdCB1c2UgYENOQU1FYCByZWNvcmQgd2hlbiByb3V0aW5nIHBvbGljeSBpcyBgTXVsdGl2YWx1ZWAuLyk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdUaHJvd3Mgd2hlbiBzcGVjaWZ5aW5nIHJlc291cmNlUGF0aCB3aXRoIFRDUCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3QgbmFtZXNwYWNlID0gbmV3IHNlcnZpY2VkaXNjb3ZlcnkuUHVibGljRG5zTmFtZXNwYWNlKHN0YWNrLCAnTXlOYW1lc3BhY2UnLCB7XG4gICAgICBuYW1lOiAnbmFtZScsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5hbWVzcGFjZS5jcmVhdGVTZXJ2aWNlKCdNeVNlcnZpY2UnLCB7XG4gICAgICAgIG5hbWU6ICdzZXJ2aWNlJyxcbiAgICAgICAgaGVhbHRoQ2hlY2s6IHtcbiAgICAgICAgICB0eXBlOiBzZXJ2aWNlZGlzY292ZXJ5LkhlYWx0aENoZWNrVHlwZS5UQ1AsXG4gICAgICAgICAgcmVzb3VyY2VQYXRoOiAnL2NoZWNrJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL2ByZXNvdXJjZVBhdGhgLitgVENQYC8pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnVGhyb3dzIHdoZW4gc3BlY2lmeWluZyBsb2FkYmFsYW5jZXIgd2l0aCB3cm9uZyBEbnNSZWNvcmRUeXBlJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3QgbmFtZXNwYWNlID0gbmV3IHNlcnZpY2VkaXNjb3ZlcnkuUHVibGljRG5zTmFtZXNwYWNlKHN0YWNrLCAnTXlOYW1lc3BhY2UnLCB7XG4gICAgICBuYW1lOiAnbmFtZScsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5hbWVzcGFjZS5jcmVhdGVTZXJ2aWNlKCdNeVNlcnZpY2UnLCB7XG4gICAgICAgIG5hbWU6ICdzZXJ2aWNlJyxcbiAgICAgICAgZG5zUmVjb3JkVHlwZTogc2VydmljZWRpc2NvdmVyeS5EbnNSZWNvcmRUeXBlLkNOQU1FLFxuICAgICAgICBsb2FkQmFsYW5jZXI6IHRydWUsXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC9NdXN0IHN1cHBvcnQgYEFgIG9yIGBBQUFBYCByZWNvcmRzIHRvIHJlZ2lzdGVyIGxvYWRiYWxhbmNlcnMvKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ1Rocm93cyB3aGVuIHNwZWNpZnlpbmcgbG9hZGJhbGFuY2VyIHdpdGggTXVsdGl2YWx1ZSByb3V0aW5nIFBvbGljeScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3QgbmFtZXNwYWNlID0gbmV3IHNlcnZpY2VkaXNjb3ZlcnkuUHVibGljRG5zTmFtZXNwYWNlKHN0YWNrLCAnTXlOYW1lc3BhY2UnLCB7XG4gICAgICBuYW1lOiAnaHR0cCcsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5hbWVzcGFjZS5jcmVhdGVTZXJ2aWNlKCdNeVNlcnZpY2UnLCB7XG4gICAgICAgIGxvYWRCYWxhbmNlcjogdHJ1ZSxcbiAgICAgICAgcm91dGluZ1BvbGljeTogc2VydmljZWRpc2NvdmVyeS5Sb3V0aW5nUG9saWN5Lk1VTFRJVkFMVUUsXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC9DYW5ub3QgcmVnaXN0ZXIgbG9hZGJhbGFuY2VycyB3aGVuIHJvdXRpbmcgcG9saWN5IGlzIGBNdWx0aXZhbHVlYC4vKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ1Rocm93cyB3aGVuIHNwZWNpZnlpbmcgZGlzY292ZXJ5IHR5cGUgb2YgRE5TIHdpdGhpbiBhIEh0dHBOYW1lc3BhY2UnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IG5hbWVzcGFjZSA9IG5ldyBzZXJ2aWNlZGlzY292ZXJ5Lkh0dHBOYW1lc3BhY2Uoc3RhY2ssICdNeU5hbWVzcGFjZScsIHtcbiAgICAgIG5hbWU6ICdodHRwJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IHNlcnZpY2VkaXNjb3ZlcnkuU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICAgIG5hbWVzcGFjZSxcbiAgICAgICAgZGlzY292ZXJ5VHlwZTogRGlzY292ZXJ5VHlwZS5ETlNfQU5EX0FQSSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL0Nhbm5vdCBzcGVjaWZ5IGBkaXNjb3ZlcnlUeXBlYCBvZiBETlNfQU5EX0FQSSB3aGVuIHVzaW5nIGFuIEhUVFAgbmFtZXNwYWNlLi8pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnU2VydmljZSBmb3IgUHJpdmF0ZSBETlMgbmFtZXNwYWNlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycpO1xuXG4gICAgY29uc3QgbmFtZXNwYWNlID0gbmV3IHNlcnZpY2VkaXNjb3ZlcnkuUHJpdmF0ZURuc05hbWVzcGFjZShzdGFjaywgJ015TmFtZXNwYWNlJywge1xuICAgICAgbmFtZTogJ3ByaXZhdGUnLFxuICAgICAgdnBjLFxuICAgIH0pO1xuXG4gICAgbmFtZXNwYWNlLmNyZWF0ZVNlcnZpY2UoJ015U2VydmljZScsIHtcbiAgICAgIG5hbWU6ICdzZXJ2aWNlJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnc2VydmljZSBkZXNjcmlwdGlvbicsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U2VydmljZURpc2NvdmVyeTo6UHJpdmF0ZURuc05hbWVzcGFjZScsIHtcbiAgICAgIE5hbWU6ICdwcml2YXRlJyxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlNlcnZpY2VEaXNjb3Zlcnk6OlNlcnZpY2UnLCB7XG4gICAgICBEZXNjcmlwdGlvbjogJ3NlcnZpY2UgZGVzY3JpcHRpb24nLFxuICAgICAgRG5zQ29uZmlnOiB7XG4gICAgICAgIERuc1JlY29yZHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBUVEw6IDYwLFxuICAgICAgICAgICAgVHlwZTogJ0EnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIE5hbWVzcGFjZUlkOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnTXlOYW1lc3BhY2VEMEJCODU1OCcsXG4gICAgICAgICAgICAnSWQnLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIFJvdXRpbmdQb2xpY3k6ICdNVUxUSVZBTFVFJyxcbiAgICAgIH0sXG4gICAgICBOYW1lOiAnc2VydmljZScsXG4gICAgICBOYW1lc3BhY2VJZDoge1xuICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAnTXlOYW1lc3BhY2VEMEJCODU1OCcsXG4gICAgICAgICAgJ0lkJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdTZXJ2aWNlIGZvciBETlMgbmFtZXNwYWNlIHdpdGggQVBJIG9ubHkgZGlzY292ZXJ5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycpO1xuXG4gICAgY29uc3QgbmFtZXNwYWNlID0gbmV3IHNlcnZpY2VkaXNjb3ZlcnkuUHJpdmF0ZURuc05hbWVzcGFjZShzdGFjaywgJ015TmFtZXNwYWNlJywge1xuICAgICAgbmFtZTogJ3ByaXZhdGUnLFxuICAgICAgdnBjLFxuICAgIH0pO1xuXG4gICAgbmFtZXNwYWNlLmNyZWF0ZVNlcnZpY2UoJ015U2VydmljZScsIHtcbiAgICAgIG5hbWU6ICdzZXJ2aWNlJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnc2VydmljZSBkZXNjcmlwdGlvbicsXG4gICAgICBkaXNjb3ZlcnlUeXBlOiBEaXNjb3ZlcnlUeXBlLkFQSSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTZXJ2aWNlRGlzY292ZXJ5OjpQcml2YXRlRG5zTmFtZXNwYWNlJywge1xuICAgICAgTmFtZTogJ3ByaXZhdGUnLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U2VydmljZURpc2NvdmVyeTo6U2VydmljZScsIHtcbiAgICAgIERlc2NyaXB0aW9uOiAnc2VydmljZSBkZXNjcmlwdGlvbicsXG4gICAgICBOYW1lOiAnc2VydmljZScsXG4gICAgICBOYW1lc3BhY2VJZDoge1xuICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAnTXlOYW1lc3BhY2VEMEJCODU1OCcsXG4gICAgICAgICAgJ0lkJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBUeXBlOiAnSFRUUCcsXG4gICAgfSk7XG5cbiAgfSk7XG59KTtcbiJdfQ==