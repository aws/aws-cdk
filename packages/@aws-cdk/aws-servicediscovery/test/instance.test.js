"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const ec2 = require("@aws-cdk/aws-ec2");
const elbv2 = require("@aws-cdk/aws-elasticloadbalancingv2");
const cdk = require("@aws-cdk/core");
const servicediscovery = require("../lib");
describe('instance', () => {
    test('IpInstance for service in HTTP namespace', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const namespace = new servicediscovery.HttpNamespace(stack, 'MyNamespace', {
            name: 'http',
        });
        const service = namespace.createService('MyService', {
            name: 'service',
        });
        service.registerIpInstance('IpInstance', {
            ipv4: '10.0.0.0',
            ipv6: '0:0:0:0:0:ffff:a00:0',
            port: 443,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::Instance', {
            InstanceAttributes: {
                AWS_INSTANCE_IPV4: '10.0.0.0',
                AWS_INSTANCE_IPV6: '0:0:0:0:0:ffff:a00:0',
                AWS_INSTANCE_PORT: '443',
            },
            ServiceId: {
                'Fn::GetAtt': [
                    'MyNamespaceMyService365E2470',
                    'Id',
                ],
            },
            InstanceId: 'MyNamespaceMyServiceIpInstanceBACEB9D2',
        });
    });
    test('IpInstance for service in PublicDnsNamespace', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
            name: 'public',
        });
        const service = namespace.createService('MyService', {
            name: 'service',
            dnsRecordType: servicediscovery.DnsRecordType.A_AAAA,
        });
        service.registerIpInstance('IpInstance', {
            ipv4: '54.239.25.192',
            ipv6: '0:0:0:0:0:ffff:a00:0',
            port: 443,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::Instance', {
            InstanceAttributes: {
                AWS_INSTANCE_IPV4: '54.239.25.192',
                AWS_INSTANCE_IPV6: '0:0:0:0:0:ffff:a00:0',
                AWS_INSTANCE_PORT: '443',
            },
            ServiceId: {
                'Fn::GetAtt': [
                    'MyNamespaceMyService365E2470',
                    'Id',
                ],
            },
            InstanceId: 'MyNamespaceMyServiceIpInstanceBACEB9D2',
        });
    });
    test('IpInstance for service in PrivateDnsNamespace', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc');
        const namespace = new servicediscovery.PrivateDnsNamespace(stack, 'MyNamespace', {
            name: 'public',
            vpc,
        });
        const service = namespace.createService('MyService', {
            name: 'service',
            dnsRecordType: servicediscovery.DnsRecordType.A_AAAA,
        });
        service.registerIpInstance('IpInstance', {
            ipv4: '10.0.0.0',
            ipv6: '0:0:0:0:0:ffff:a00:0',
            port: 443,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::Instance', {
            InstanceAttributes: {
                AWS_INSTANCE_IPV4: '10.0.0.0',
                AWS_INSTANCE_IPV6: '0:0:0:0:0:ffff:a00:0',
                AWS_INSTANCE_PORT: '443',
            },
            ServiceId: {
                'Fn::GetAtt': [
                    'MyNamespaceMyService365E2470',
                    'Id',
                ],
            },
            InstanceId: 'MyNamespaceMyServiceIpInstanceBACEB9D2',
        });
    });
    test('Registering IpInstance throws when omitting port for a service using SRV', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
            name: 'public',
        });
        const service = namespace.createService('MyService', {
            name: 'service',
            dnsRecordType: servicediscovery.DnsRecordType.SRV,
        });
        // THEN
        expect(() => {
            service.registerIpInstance('IpInstance', {
                instanceId: 'id',
            });
        }).toThrow(/A `port` must be specified for a service using a `SRV` record./);
    });
    test('Registering IpInstance throws when omitting ipv4 and ipv6 for a service using SRV', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
            name: 'dns',
        });
        const service = namespace.createService('MyService', {
            name: 'service',
            dnsRecordType: servicediscovery.DnsRecordType.SRV,
        });
        // THEN
        expect(() => {
            service.registerIpInstance('IpInstance', {
                port: 3306,
            });
        }).toThrow(/At least `ipv4` or `ipv6` must be specified for a service using a `SRV` record./);
    });
    test('Registering IpInstance throws when omitting ipv4 for a service using A records', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
            name: 'dns',
        });
        const service = namespace.createService('MyService', {
            name: 'service',
            dnsRecordType: servicediscovery.DnsRecordType.A,
        });
        // THEN
        expect(() => {
            service.registerIpInstance('IpInstance', {
                port: 3306,
            });
        }).toThrow(/An `ipv4` must be specified for a service using a `A` record./);
    });
    test('Registering IpInstance throws when omitting ipv6 for a service using AAAA records', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
            name: 'dns',
        });
        const service = namespace.createService('MyService', {
            name: 'service',
            dnsRecordType: servicediscovery.DnsRecordType.AAAA,
        });
        // THEN
        expect(() => {
            service.registerIpInstance('IpInstance', {
                port: 3306,
            });
        }).toThrow(/An `ipv6` must be specified for a service using a `AAAA` record./);
    });
    test('Registering IpInstance throws with wrong DNS record type', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
            name: 'dns',
        });
        const service = namespace.createService('MyService', {
            name: 'service',
            dnsRecordType: servicediscovery.DnsRecordType.CNAME,
        });
        // THEN
        expect(() => {
            service.registerIpInstance('IpInstance', {
                port: 3306,
            });
        }).toThrow(/Service must support `A`, `AAAA` or `SRV` records to register this instance type./);
    });
    test('Registering AliasTargetInstance', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVPC');
        const alb = new elbv2.ApplicationLoadBalancer(stack, 'MyALB', { vpc });
        const namespace = new servicediscovery.PrivateDnsNamespace(stack, 'MyNamespace', {
            name: 'dns',
            vpc,
        });
        const service = namespace.createService('MyService', {
            name: 'service',
            loadBalancer: true,
        });
        const customAttributes = { foo: 'bar' };
        service.registerLoadBalancer('Loadbalancer', alb, customAttributes);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::Instance', {
            InstanceAttributes: {
                AWS_ALIAS_DNS_NAME: {
                    'Fn::GetAtt': [
                        'MyALB911A8556',
                        'DNSName',
                    ],
                },
                foo: 'bar',
            },
            ServiceId: {
                'Fn::GetAtt': [
                    'MyNamespaceMyService365E2470',
                    'Id',
                ],
            },
            InstanceId: 'MyNamespaceMyServiceLoadbalancerD1112A76',
        });
    });
    test('Throws when registering AliasTargetInstance with Http Namespace', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const namespace = new servicediscovery.HttpNamespace(stack, 'MyNamespace', {
            name: 'http',
        });
        const service = new servicediscovery.Service(stack, 'MyService', {
            namespace,
        });
        const vpc = new ec2.Vpc(stack, 'MyVPC');
        const alb = new elbv2.ApplicationLoadBalancer(stack, 'MyALB', { vpc });
        // THEN
        expect(() => {
            service.registerLoadBalancer('Loadbalancer', alb);
        }).toThrow(/Namespace associated with Service must be a DNS Namespace./);
    });
    // TODO shouldn't be allowed to do this if loadbalancer on ServiceProps is not set to true.
    test('Throws when registering AliasTargetInstance with wrong Routing Policy', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
            name: 'http',
        });
        const service = namespace.createService('MyService', {
            routingPolicy: servicediscovery.RoutingPolicy.MULTIVALUE,
        });
        const vpc = new ec2.Vpc(stack, 'MyVPC');
        const alb = new elbv2.ApplicationLoadBalancer(stack, 'MyALB', { vpc });
        // THEN
        expect(() => {
            service.registerLoadBalancer('Loadbalancer', alb);
        }).toThrow(/Service must use `WEIGHTED` routing policy./);
    });
    test('Register CnameInstance', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
            name: 'dns',
        });
        const service = namespace.createService('MyService', {
            dnsRecordType: servicediscovery.DnsRecordType.CNAME,
        });
        service.registerCnameInstance('CnameInstance', {
            instanceCname: 'foo.com',
            customAttributes: { dogs: 'good' },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::Instance', {
            InstanceAttributes: {
                AWS_INSTANCE_CNAME: 'foo.com',
                dogs: 'good',
            },
            ServiceId: {
                'Fn::GetAtt': [
                    'MyNamespaceMyService365E2470',
                    'Id',
                ],
            },
            InstanceId: 'MyNamespaceMyServiceCnameInstance0EB1C98D',
        });
    });
    test('Throws when registering CnameInstance for an HTTP namespace', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const namespace = new servicediscovery.HttpNamespace(stack, 'MyNamespace', {
            name: 'http',
        });
        const service = new servicediscovery.Service(stack, 'MyService', {
            namespace,
        });
        // THEN
        expect(() => {
            service.registerCnameInstance('CnameInstance', {
                instanceCname: 'foo.com',
            });
        }).toThrow(/Namespace associated with Service must be a DNS Namespace/);
    });
    test('Register NonIpInstance', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const namespace = new servicediscovery.HttpNamespace(stack, 'MyNamespace', {
            name: 'http',
        });
        const service = namespace.createService('MyService');
        service.registerNonIpInstance('NonIpInstance', {
            customAttributes: { dogs: 'good' },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::Instance', {
            InstanceAttributes: {
                dogs: 'good',
            },
            ServiceId: {
                'Fn::GetAtt': [
                    'MyNamespaceMyService365E2470',
                    'Id',
                ],
            },
            InstanceId: 'MyNamespaceMyServiceNonIpInstance7EFD703A',
        });
    });
    test('Register NonIpInstance, DNS Namespace, API Only service', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
            name: 'http',
        });
        const service = namespace.createService('MyService', { discoveryType: servicediscovery.DiscoveryType.API });
        service.registerNonIpInstance('NonIpInstance', {
            customAttributes: { dogs: 'good' },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::Instance', {
            InstanceAttributes: {
                dogs: 'good',
            },
            ServiceId: {
                'Fn::GetAtt': ['MyNamespaceMyService365E2470', 'Id'],
            },
            InstanceId: 'MyNamespaceMyServiceNonIpInstance7EFD703A',
        });
    });
    test('Throws when registering NonIpInstance for an DNS discoverable service', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
            name: 'http',
        });
        const service = namespace.createService('MyService');
        // THEN
        expect(() => {
            service.registerNonIpInstance('NonIpInstance', {
                instanceId: 'nonIp',
            });
        }).toThrow(/This type of instance can only be registered for HTTP namespaces./);
    });
    test('Throws when no custom attribues specified for NonIpInstance', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const namespace = new servicediscovery.HttpNamespace(stack, 'MyNamespace', {
            name: 'http',
        });
        const service = namespace.createService('MyService');
        // THEN
        expect(() => {
            service.registerNonIpInstance('NonIpInstance', {
                instanceId: 'nonIp',
            });
        }).toThrow(/You must specify at least one custom attribute for this instance type./);
    });
    test('Throws when custom attribues are emptyfor NonIpInstance', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const namespace = new servicediscovery.HttpNamespace(stack, 'MyNamespace', {
            name: 'http',
        });
        const service = namespace.createService('MyService');
        // THEN
        expect(() => {
            service.registerNonIpInstance('NonIpInstance', {
                instanceId: 'nonIp',
                customAttributes: {},
            });
        }).toThrow(/You must specify at least one custom attribute for this instance type./);
    });
    test('Register multiple instances on the same service', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
            name: 'public',
        });
        const service = namespace.createService('MyService');
        // WHEN
        service.registerIpInstance('First', {
            ipv4: '10.0.0.0',
        });
        service.registerIpInstance('Second', {
            ipv4: '10.0.0.1',
        });
        // THEN
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::ServiceDiscovery::Instance', 2);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFuY2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluc3RhbmNlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0Msd0NBQXdDO0FBQ3hDLDZEQUE2RDtBQUM3RCxxQ0FBcUM7QUFDckMsMkNBQTJDO0FBRTNDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFO0lBQ3hCLElBQUksQ0FBQywwQ0FBMEMsRUFBRSxHQUFHLEVBQUU7UUFDcEQsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRTlCLE1BQU0sU0FBUyxHQUFHLElBQUksZ0JBQWdCLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUU7WUFDekUsSUFBSSxFQUFFLE1BQU07U0FDYixDQUFDLENBQUM7UUFFSCxNQUFNLE9BQU8sR0FBRyxTQUFTLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBRTtZQUNuRCxJQUFJLEVBQUUsU0FBUztTQUNoQixDQUFDLENBQUM7UUFFSCxPQUFPLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFO1lBQ3ZDLElBQUksRUFBRSxVQUFVO1lBQ2hCLElBQUksRUFBRSxzQkFBc0I7WUFDNUIsSUFBSSxFQUFFLEdBQUc7U0FDVixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsaUNBQWlDLEVBQUU7WUFDakYsa0JBQWtCLEVBQUU7Z0JBQ2xCLGlCQUFpQixFQUFFLFVBQVU7Z0JBQzdCLGlCQUFpQixFQUFFLHNCQUFzQjtnQkFDekMsaUJBQWlCLEVBQUUsS0FBSzthQUN6QjtZQUNELFNBQVMsRUFBRTtnQkFDVCxZQUFZLEVBQUU7b0JBQ1osOEJBQThCO29CQUM5QixJQUFJO2lCQUNMO2FBQ0Y7WUFDRCxVQUFVLEVBQUUsd0NBQXdDO1NBQ3JELENBQUMsQ0FBQztJQUdMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDhDQUE4QyxFQUFFLEdBQUcsRUFBRTtRQUN4RCxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFOUIsTUFBTSxTQUFTLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFO1lBQzlFLElBQUksRUFBRSxRQUFRO1NBQ2YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxXQUFXLEVBQUU7WUFDbkQsSUFBSSxFQUFFLFNBQVM7WUFDZixhQUFhLEVBQUUsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE1BQU07U0FDckQsQ0FBQyxDQUFDO1FBRUgsT0FBTyxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRTtZQUN2QyxJQUFJLEVBQUUsZUFBZTtZQUNyQixJQUFJLEVBQUUsc0JBQXNCO1lBQzVCLElBQUksRUFBRSxHQUFHO1NBQ1YsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGlDQUFpQyxFQUFFO1lBQ2pGLGtCQUFrQixFQUFFO2dCQUNsQixpQkFBaUIsRUFBRSxlQUFlO2dCQUNsQyxpQkFBaUIsRUFBRSxzQkFBc0I7Z0JBQ3pDLGlCQUFpQixFQUFFLEtBQUs7YUFDekI7WUFDRCxTQUFTLEVBQUU7Z0JBQ1QsWUFBWSxFQUFFO29CQUNaLDhCQUE4QjtvQkFDOUIsSUFBSTtpQkFDTDthQUNGO1lBQ0QsVUFBVSxFQUFFLHdDQUF3QztTQUNyRCxDQUFDLENBQUM7SUFHTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywrQ0FBK0MsRUFBRSxHQUFHLEVBQUU7UUFDekQsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzlCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFeEMsTUFBTSxTQUFTLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFO1lBQy9FLElBQUksRUFBRSxRQUFRO1lBQ2QsR0FBRztTQUNKLENBQUMsQ0FBQztRQUVILE1BQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFO1lBQ25ELElBQUksRUFBRSxTQUFTO1lBQ2YsYUFBYSxFQUFFLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxNQUFNO1NBQ3JELENBQUMsQ0FBQztRQUVILE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUU7WUFDdkMsSUFBSSxFQUFFLFVBQVU7WUFDaEIsSUFBSSxFQUFFLHNCQUFzQjtZQUM1QixJQUFJLEVBQUUsR0FBRztTQUNWLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxpQ0FBaUMsRUFBRTtZQUNqRixrQkFBa0IsRUFBRTtnQkFDbEIsaUJBQWlCLEVBQUUsVUFBVTtnQkFDN0IsaUJBQWlCLEVBQUUsc0JBQXNCO2dCQUN6QyxpQkFBaUIsRUFBRSxLQUFLO2FBQ3pCO1lBQ0QsU0FBUyxFQUFFO2dCQUNULFlBQVksRUFBRTtvQkFDWiw4QkFBOEI7b0JBQzlCLElBQUk7aUJBQ0w7YUFDRjtZQUNELFVBQVUsRUFBRSx3Q0FBd0M7U0FDckQsQ0FBQyxDQUFDO0lBR0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsMEVBQTBFLEVBQUUsR0FBRyxFQUFFO1FBQ3BGLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUU5QixNQUFNLFNBQVMsR0FBRyxJQUFJLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUU7WUFDOUUsSUFBSSxFQUFFLFFBQVE7U0FDZixDQUFDLENBQUM7UUFFSCxNQUFNLE9BQU8sR0FBRyxTQUFTLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBRTtZQUNuRCxJQUFJLEVBQUUsU0FBUztZQUNmLGFBQWEsRUFBRSxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsR0FBRztTQUNsRCxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNWLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUU7Z0JBQ3ZDLFVBQVUsRUFBRSxJQUFJO2FBQ2pCLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxnRUFBZ0UsQ0FBQyxDQUFDO0lBRy9FLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLG1GQUFtRixFQUFFLEdBQUcsRUFBRTtRQUM3RixRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFOUIsTUFBTSxTQUFTLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFO1lBQzlFLElBQUksRUFBRSxLQUFLO1NBQ1osQ0FBQyxDQUFDO1FBRUgsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxXQUFXLEVBQUU7WUFDbkQsSUFBSSxFQUFFLFNBQVM7WUFDZixhQUFhLEVBQUUsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLEdBQUc7U0FDbEQsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDVixPQUFPLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFO2dCQUN2QyxJQUFJLEVBQUUsSUFBSTthQUNYLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxpRkFBaUYsQ0FBQyxDQUFDO0lBR2hHLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGdGQUFnRixFQUFFLEdBQUcsRUFBRTtRQUMxRixRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFOUIsTUFBTSxTQUFTLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFO1lBQzlFLElBQUksRUFBRSxLQUFLO1NBQ1osQ0FBQyxDQUFDO1FBRUgsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxXQUFXLEVBQUU7WUFDbkQsSUFBSSxFQUFFLFNBQVM7WUFDZixhQUFhLEVBQUUsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDaEQsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDVixPQUFPLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFO2dCQUN2QyxJQUFJLEVBQUUsSUFBSTthQUNYLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQywrREFBK0QsQ0FBQyxDQUFDO0lBRzlFLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLG1GQUFtRixFQUFFLEdBQUcsRUFBRTtRQUM3RixRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFOUIsTUFBTSxTQUFTLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFO1lBQzlFLElBQUksRUFBRSxLQUFLO1NBQ1osQ0FBQyxDQUFDO1FBRUgsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxXQUFXLEVBQUU7WUFDbkQsSUFBSSxFQUFFLFNBQVM7WUFDZixhQUFhLEVBQUUsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLElBQUk7U0FDbkQsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDVixPQUFPLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFO2dCQUN2QyxJQUFJLEVBQUUsSUFBSTthQUNYLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxrRUFBa0UsQ0FBQyxDQUFDO0lBR2pGLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDBEQUEwRCxFQUFFLEdBQUcsRUFBRTtRQUNwRSxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFOUIsTUFBTSxTQUFTLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFO1lBQzlFLElBQUksRUFBRSxLQUFLO1NBQ1osQ0FBQyxDQUFDO1FBRUgsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxXQUFXLEVBQUU7WUFDbkQsSUFBSSxFQUFFLFNBQVM7WUFDZixhQUFhLEVBQUUsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLEtBQUs7U0FDcEQsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDVixPQUFPLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFO2dCQUN2QyxJQUFJLEVBQUUsSUFBSTthQUNYLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxtRkFBbUYsQ0FBQyxDQUFDO0lBR2xHLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGlDQUFpQyxFQUFFLEdBQUcsRUFBRTtRQUMzQyxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFOUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN4QyxNQUFNLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUV2RSxNQUFNLFNBQVMsR0FBRyxJQUFJLGdCQUFnQixDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUU7WUFDL0UsSUFBSSxFQUFFLEtBQUs7WUFDWCxHQUFHO1NBQ0osQ0FBQyxDQUFDO1FBRUgsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxXQUFXLEVBQUU7WUFDbkQsSUFBSSxFQUFFLFNBQVM7WUFDZixZQUFZLEVBQUUsSUFBSTtTQUNuQixDQUFDLENBQUM7UUFDSCxNQUFNLGdCQUFnQixHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDO1FBRXhDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxjQUFjLEVBQUUsR0FBRyxFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFFcEUsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGlDQUFpQyxFQUFFO1lBQ2pGLGtCQUFrQixFQUFFO2dCQUNsQixrQkFBa0IsRUFBRTtvQkFDbEIsWUFBWSxFQUFFO3dCQUNaLGVBQWU7d0JBQ2YsU0FBUztxQkFDVjtpQkFDRjtnQkFDRCxHQUFHLEVBQUUsS0FBSzthQUNYO1lBQ0QsU0FBUyxFQUFFO2dCQUNULFlBQVksRUFBRTtvQkFDWiw4QkFBOEI7b0JBQzlCLElBQUk7aUJBQ0w7YUFDRjtZQUNELFVBQVUsRUFBRSwwQ0FBMEM7U0FDdkQsQ0FBQyxDQUFDO0lBR0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsaUVBQWlFLEVBQUUsR0FBRyxFQUFFO1FBQzNFLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUU5QixNQUFNLFNBQVMsR0FBRyxJQUFJLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFO1lBQ3pFLElBQUksRUFBRSxNQUFNO1NBQ2IsQ0FBQyxDQUFDO1FBRUgsTUFBTSxPQUFPLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRTtZQUMvRCxTQUFTO1NBQ1YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN4QyxNQUFNLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUV2RSxPQUFPO1FBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNWLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxjQUFjLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDcEQsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLDREQUE0RCxDQUFDLENBQUM7SUFHM0UsQ0FBQyxDQUFDLENBQUM7SUFFSCwyRkFBMkY7SUFDM0YsSUFBSSxDQUFDLHVFQUF1RSxFQUFFLEdBQUcsRUFBRTtRQUNqRixRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFOUIsTUFBTSxTQUFTLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFO1lBQzlFLElBQUksRUFBRSxNQUFNO1NBQ2IsQ0FBQyxDQUFDO1FBRUgsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxXQUFXLEVBQUU7WUFDbkQsYUFBYSxFQUFFLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxVQUFVO1NBQ3pELENBQUMsQ0FBQztRQUVILE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDeEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUMsdUJBQXVCLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFFdkUsT0FBTztRQUNQLE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDVixPQUFPLENBQUMsb0JBQW9CLENBQUMsY0FBYyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO0lBRzVELENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHdCQUF3QixFQUFFLEdBQUcsRUFBRTtRQUNsQyxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFOUIsTUFBTSxTQUFTLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFO1lBQzlFLElBQUksRUFBRSxLQUFLO1NBQ1osQ0FBQyxDQUFDO1FBRUgsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxXQUFXLEVBQUU7WUFDbkQsYUFBYSxFQUFFLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxLQUFLO1NBQ3BELENBQUMsQ0FBQztRQUVILE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLEVBQUU7WUFDN0MsYUFBYSxFQUFFLFNBQVM7WUFDeEIsZ0JBQWdCLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO1NBQ25DLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxpQ0FBaUMsRUFBRTtZQUNqRixrQkFBa0IsRUFBRTtnQkFDbEIsa0JBQWtCLEVBQUUsU0FBUztnQkFDN0IsSUFBSSxFQUFFLE1BQU07YUFDYjtZQUNELFNBQVMsRUFBRTtnQkFDVCxZQUFZLEVBQUU7b0JBQ1osOEJBQThCO29CQUM5QixJQUFJO2lCQUNMO2FBQ0Y7WUFDRCxVQUFVLEVBQUUsMkNBQTJDO1NBQ3hELENBQUMsQ0FBQztJQUdMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDZEQUE2RCxFQUFFLEdBQUcsRUFBRTtRQUN2RSxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFOUIsTUFBTSxTQUFTLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRTtZQUN6RSxJQUFJLEVBQUUsTUFBTTtTQUNiLENBQUMsQ0FBQztRQUVILE1BQU0sT0FBTyxHQUFHLElBQUksZ0JBQWdCLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUU7WUFDL0QsU0FBUztTQUNWLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1YsT0FBTyxDQUFDLHFCQUFxQixDQUFDLGVBQWUsRUFBRTtnQkFDN0MsYUFBYSxFQUFFLFNBQVM7YUFDekIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLDJEQUEyRCxDQUFDLENBQUM7SUFHMUUsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxFQUFFO1FBQ2xDLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUU5QixNQUFNLFNBQVMsR0FBRyxJQUFJLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFO1lBQ3pFLElBQUksRUFBRSxNQUFNO1NBQ2IsQ0FBQyxDQUFDO1FBRUgsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUVyRCxPQUFPLENBQUMscUJBQXFCLENBQUMsZUFBZSxFQUFFO1lBQzdDLGdCQUFnQixFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTtTQUNuQyxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsaUNBQWlDLEVBQUU7WUFDakYsa0JBQWtCLEVBQUU7Z0JBQ2xCLElBQUksRUFBRSxNQUFNO2FBQ2I7WUFDRCxTQUFTLEVBQUU7Z0JBQ1QsWUFBWSxFQUFFO29CQUNaLDhCQUE4QjtvQkFDOUIsSUFBSTtpQkFDTDthQUNGO1lBQ0QsVUFBVSxFQUFFLDJDQUEyQztTQUN4RCxDQUFDLENBQUM7SUFHTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx5REFBeUQsRUFBRSxHQUFHLEVBQUU7UUFDbkUsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRTlCLE1BQU0sU0FBUyxHQUFHLElBQUksZ0JBQWdCLENBQUMsa0JBQWtCLENBQ3ZELEtBQUssRUFDTCxhQUFhLEVBQ2I7WUFDRSxJQUFJLEVBQUUsTUFBTTtTQUNiLENBQ0YsQ0FBQztRQUVGLE1BQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLEVBQUUsYUFBYSxFQUFFLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsQ0FBRSxDQUFDO1FBRTdHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLEVBQUU7WUFDN0MsZ0JBQWdCLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO1NBQ25DLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FDN0MsaUNBQWlDLEVBQ2pDO1lBQ0Usa0JBQWtCLEVBQUU7Z0JBQ2xCLElBQUksRUFBRSxNQUFNO2FBQ2I7WUFDRCxTQUFTLEVBQUU7Z0JBQ1QsWUFBWSxFQUFFLENBQUMsOEJBQThCLEVBQUUsSUFBSSxDQUFDO2FBQ3JEO1lBQ0QsVUFBVSxFQUFFLDJDQUEyQztTQUN4RCxDQUNGLENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx1RUFBdUUsRUFBRSxHQUFHLEVBQUU7UUFDakYsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRTlCLE1BQU0sU0FBUyxHQUFHLElBQUksZ0JBQWdCLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRTtZQUM5RSxJQUFJLEVBQUUsTUFBTTtTQUNiLENBQUMsQ0FBQztRQUVILE1BQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFckQsT0FBTztRQUNQLE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDVixPQUFPLENBQUMscUJBQXFCLENBQUMsZUFBZSxFQUFFO2dCQUM3QyxVQUFVLEVBQUUsT0FBTzthQUNwQixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsbUVBQW1FLENBQUMsQ0FBQztJQUdsRixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw2REFBNkQsRUFBRSxHQUFHLEVBQUU7UUFDdkUsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRTlCLE1BQU0sU0FBUyxHQUFHLElBQUksZ0JBQWdCLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUU7WUFDekUsSUFBSSxFQUFFLE1BQU07U0FDYixDQUFDLENBQUM7UUFFSCxNQUFNLE9BQU8sR0FBRyxTQUFTLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRXJELE9BQU87UUFDUCxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1YsT0FBTyxDQUFDLHFCQUFxQixDQUFDLGVBQWUsRUFBRTtnQkFDN0MsVUFBVSxFQUFFLE9BQU87YUFDcEIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLHdFQUF3RSxDQUFDLENBQUM7SUFHdkYsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMseURBQXlELEVBQUUsR0FBRyxFQUFFO1FBQ25FLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUU5QixNQUFNLFNBQVMsR0FBRyxJQUFJLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFO1lBQ3pFLElBQUksRUFBRSxNQUFNO1NBQ2IsQ0FBQyxDQUFDO1FBRUgsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUVyRCxPQUFPO1FBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNWLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLEVBQUU7Z0JBQzdDLFVBQVUsRUFBRSxPQUFPO2dCQUNuQixnQkFBZ0IsRUFBRSxFQUFFO2FBQ3JCLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyx3RUFBd0UsQ0FBQyxDQUFDO0lBR3ZGLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGlEQUFpRCxFQUFFLEdBQUcsRUFBRTtRQUMzRCxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFOUIsTUFBTSxTQUFTLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFO1lBQzlFLElBQUksRUFBRSxRQUFRO1NBQ2YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUVyRCxPQUFPO1FBQ1AsT0FBTyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBRTtZQUNsQyxJQUFJLEVBQUUsVUFBVTtTQUNqQixDQUFDLENBQUM7UUFFSCxPQUFPLENBQUMsa0JBQWtCLENBQUMsUUFBUSxFQUFFO1lBQ25DLElBQUksRUFBRSxVQUFVO1NBQ2pCLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxlQUFlLENBQUMsaUNBQWlDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFHbEYsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBlbGJ2MiBmcm9tICdAYXdzLWNkay9hd3MtZWxhc3RpY2xvYWRiYWxhbmNpbmd2Mic7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBzZXJ2aWNlZGlzY292ZXJ5IGZyb20gJy4uL2xpYic7XG5cbmRlc2NyaWJlKCdpbnN0YW5jZScsICgpID0+IHtcbiAgdGVzdCgnSXBJbnN0YW5jZSBmb3Igc2VydmljZSBpbiBIVFRQIG5hbWVzcGFjZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3QgbmFtZXNwYWNlID0gbmV3IHNlcnZpY2VkaXNjb3ZlcnkuSHR0cE5hbWVzcGFjZShzdGFjaywgJ015TmFtZXNwYWNlJywge1xuICAgICAgbmFtZTogJ2h0dHAnLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc2VydmljZSA9IG5hbWVzcGFjZS5jcmVhdGVTZXJ2aWNlKCdNeVNlcnZpY2UnLCB7XG4gICAgICBuYW1lOiAnc2VydmljZScsXG4gICAgfSk7XG5cbiAgICBzZXJ2aWNlLnJlZ2lzdGVySXBJbnN0YW5jZSgnSXBJbnN0YW5jZScsIHtcbiAgICAgIGlwdjQ6ICcxMC4wLjAuMCcsXG4gICAgICBpcHY2OiAnMDowOjA6MDowOmZmZmY6YTAwOjAnLFxuICAgICAgcG9ydDogNDQzLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlNlcnZpY2VEaXNjb3Zlcnk6Okluc3RhbmNlJywge1xuICAgICAgSW5zdGFuY2VBdHRyaWJ1dGVzOiB7XG4gICAgICAgIEFXU19JTlNUQU5DRV9JUFY0OiAnMTAuMC4wLjAnLFxuICAgICAgICBBV1NfSU5TVEFOQ0VfSVBWNjogJzA6MDowOjA6MDpmZmZmOmEwMDowJyxcbiAgICAgICAgQVdTX0lOU1RBTkNFX1BPUlQ6ICc0NDMnLFxuICAgICAgfSxcbiAgICAgIFNlcnZpY2VJZDoge1xuICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAnTXlOYW1lc3BhY2VNeVNlcnZpY2UzNjVFMjQ3MCcsXG4gICAgICAgICAgJ0lkJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBJbnN0YW5jZUlkOiAnTXlOYW1lc3BhY2VNeVNlcnZpY2VJcEluc3RhbmNlQkFDRUI5RDInLFxuICAgIH0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnSXBJbnN0YW5jZSBmb3Igc2VydmljZSBpbiBQdWJsaWNEbnNOYW1lc3BhY2UnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IG5hbWVzcGFjZSA9IG5ldyBzZXJ2aWNlZGlzY292ZXJ5LlB1YmxpY0Ruc05hbWVzcGFjZShzdGFjaywgJ015TmFtZXNwYWNlJywge1xuICAgICAgbmFtZTogJ3B1YmxpYycsXG4gICAgfSk7XG5cbiAgICBjb25zdCBzZXJ2aWNlID0gbmFtZXNwYWNlLmNyZWF0ZVNlcnZpY2UoJ015U2VydmljZScsIHtcbiAgICAgIG5hbWU6ICdzZXJ2aWNlJyxcbiAgICAgIGRuc1JlY29yZFR5cGU6IHNlcnZpY2VkaXNjb3ZlcnkuRG5zUmVjb3JkVHlwZS5BX0FBQUEsXG4gICAgfSk7XG5cbiAgICBzZXJ2aWNlLnJlZ2lzdGVySXBJbnN0YW5jZSgnSXBJbnN0YW5jZScsIHtcbiAgICAgIGlwdjQ6ICc1NC4yMzkuMjUuMTkyJyxcbiAgICAgIGlwdjY6ICcwOjA6MDowOjA6ZmZmZjphMDA6MCcsXG4gICAgICBwb3J0OiA0NDMsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U2VydmljZURpc2NvdmVyeTo6SW5zdGFuY2UnLCB7XG4gICAgICBJbnN0YW5jZUF0dHJpYnV0ZXM6IHtcbiAgICAgICAgQVdTX0lOU1RBTkNFX0lQVjQ6ICc1NC4yMzkuMjUuMTkyJyxcbiAgICAgICAgQVdTX0lOU1RBTkNFX0lQVjY6ICcwOjA6MDowOjA6ZmZmZjphMDA6MCcsXG4gICAgICAgIEFXU19JTlNUQU5DRV9QT1JUOiAnNDQzJyxcbiAgICAgIH0sXG4gICAgICBTZXJ2aWNlSWQ6IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgJ015TmFtZXNwYWNlTXlTZXJ2aWNlMzY1RTI0NzAnLFxuICAgICAgICAgICdJZCcsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgSW5zdGFuY2VJZDogJ015TmFtZXNwYWNlTXlTZXJ2aWNlSXBJbnN0YW5jZUJBQ0VCOUQyJyxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ0lwSW5zdGFuY2UgZm9yIHNlcnZpY2UgaW4gUHJpdmF0ZURuc05hbWVzcGFjZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnKTtcblxuICAgIGNvbnN0IG5hbWVzcGFjZSA9IG5ldyBzZXJ2aWNlZGlzY292ZXJ5LlByaXZhdGVEbnNOYW1lc3BhY2Uoc3RhY2ssICdNeU5hbWVzcGFjZScsIHtcbiAgICAgIG5hbWU6ICdwdWJsaWMnLFxuICAgICAgdnBjLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc2VydmljZSA9IG5hbWVzcGFjZS5jcmVhdGVTZXJ2aWNlKCdNeVNlcnZpY2UnLCB7XG4gICAgICBuYW1lOiAnc2VydmljZScsXG4gICAgICBkbnNSZWNvcmRUeXBlOiBzZXJ2aWNlZGlzY292ZXJ5LkRuc1JlY29yZFR5cGUuQV9BQUFBLFxuICAgIH0pO1xuXG4gICAgc2VydmljZS5yZWdpc3RlcklwSW5zdGFuY2UoJ0lwSW5zdGFuY2UnLCB7XG4gICAgICBpcHY0OiAnMTAuMC4wLjAnLFxuICAgICAgaXB2NjogJzA6MDowOjA6MDpmZmZmOmEwMDowJyxcbiAgICAgIHBvcnQ6IDQ0MyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTZXJ2aWNlRGlzY292ZXJ5OjpJbnN0YW5jZScsIHtcbiAgICAgIEluc3RhbmNlQXR0cmlidXRlczoge1xuICAgICAgICBBV1NfSU5TVEFOQ0VfSVBWNDogJzEwLjAuMC4wJyxcbiAgICAgICAgQVdTX0lOU1RBTkNFX0lQVjY6ICcwOjA6MDowOjA6ZmZmZjphMDA6MCcsXG4gICAgICAgIEFXU19JTlNUQU5DRV9QT1JUOiAnNDQzJyxcbiAgICAgIH0sXG4gICAgICBTZXJ2aWNlSWQ6IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgJ015TmFtZXNwYWNlTXlTZXJ2aWNlMzY1RTI0NzAnLFxuICAgICAgICAgICdJZCcsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgSW5zdGFuY2VJZDogJ015TmFtZXNwYWNlTXlTZXJ2aWNlSXBJbnN0YW5jZUJBQ0VCOUQyJyxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ1JlZ2lzdGVyaW5nIElwSW5zdGFuY2UgdGhyb3dzIHdoZW4gb21pdHRpbmcgcG9ydCBmb3IgYSBzZXJ2aWNlIHVzaW5nIFNSVicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3QgbmFtZXNwYWNlID0gbmV3IHNlcnZpY2VkaXNjb3ZlcnkuUHVibGljRG5zTmFtZXNwYWNlKHN0YWNrLCAnTXlOYW1lc3BhY2UnLCB7XG4gICAgICBuYW1lOiAncHVibGljJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IHNlcnZpY2UgPSBuYW1lc3BhY2UuY3JlYXRlU2VydmljZSgnTXlTZXJ2aWNlJywge1xuICAgICAgbmFtZTogJ3NlcnZpY2UnLFxuICAgICAgZG5zUmVjb3JkVHlwZTogc2VydmljZWRpc2NvdmVyeS5EbnNSZWNvcmRUeXBlLlNSVixcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgc2VydmljZS5yZWdpc3RlcklwSW5zdGFuY2UoJ0lwSW5zdGFuY2UnLCB7XG4gICAgICAgIGluc3RhbmNlSWQ6ICdpZCcsXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC9BIGBwb3J0YCBtdXN0IGJlIHNwZWNpZmllZCBmb3IgYSBzZXJ2aWNlIHVzaW5nIGEgYFNSVmAgcmVjb3JkLi8pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnUmVnaXN0ZXJpbmcgSXBJbnN0YW5jZSB0aHJvd3Mgd2hlbiBvbWl0dGluZyBpcHY0IGFuZCBpcHY2IGZvciBhIHNlcnZpY2UgdXNpbmcgU1JWJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBjb25zdCBuYW1lc3BhY2UgPSBuZXcgc2VydmljZWRpc2NvdmVyeS5QdWJsaWNEbnNOYW1lc3BhY2Uoc3RhY2ssICdNeU5hbWVzcGFjZScsIHtcbiAgICAgIG5hbWU6ICdkbnMnLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc2VydmljZSA9IG5hbWVzcGFjZS5jcmVhdGVTZXJ2aWNlKCdNeVNlcnZpY2UnLCB7XG4gICAgICBuYW1lOiAnc2VydmljZScsXG4gICAgICBkbnNSZWNvcmRUeXBlOiBzZXJ2aWNlZGlzY292ZXJ5LkRuc1JlY29yZFR5cGUuU1JWLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBzZXJ2aWNlLnJlZ2lzdGVySXBJbnN0YW5jZSgnSXBJbnN0YW5jZScsIHtcbiAgICAgICAgcG9ydDogMzMwNixcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL0F0IGxlYXN0IGBpcHY0YCBvciBgaXB2NmAgbXVzdCBiZSBzcGVjaWZpZWQgZm9yIGEgc2VydmljZSB1c2luZyBhIGBTUlZgIHJlY29yZC4vKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ1JlZ2lzdGVyaW5nIElwSW5zdGFuY2UgdGhyb3dzIHdoZW4gb21pdHRpbmcgaXB2NCBmb3IgYSBzZXJ2aWNlIHVzaW5nIEEgcmVjb3JkcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3QgbmFtZXNwYWNlID0gbmV3IHNlcnZpY2VkaXNjb3ZlcnkuUHVibGljRG5zTmFtZXNwYWNlKHN0YWNrLCAnTXlOYW1lc3BhY2UnLCB7XG4gICAgICBuYW1lOiAnZG5zJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IHNlcnZpY2UgPSBuYW1lc3BhY2UuY3JlYXRlU2VydmljZSgnTXlTZXJ2aWNlJywge1xuICAgICAgbmFtZTogJ3NlcnZpY2UnLFxuICAgICAgZG5zUmVjb3JkVHlwZTogc2VydmljZWRpc2NvdmVyeS5EbnNSZWNvcmRUeXBlLkEsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIHNlcnZpY2UucmVnaXN0ZXJJcEluc3RhbmNlKCdJcEluc3RhbmNlJywge1xuICAgICAgICBwb3J0OiAzMzA2LFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdygvQW4gYGlwdjRgIG11c3QgYmUgc3BlY2lmaWVkIGZvciBhIHNlcnZpY2UgdXNpbmcgYSBgQWAgcmVjb3JkLi8pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnUmVnaXN0ZXJpbmcgSXBJbnN0YW5jZSB0aHJvd3Mgd2hlbiBvbWl0dGluZyBpcHY2IGZvciBhIHNlcnZpY2UgdXNpbmcgQUFBQSByZWNvcmRzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBjb25zdCBuYW1lc3BhY2UgPSBuZXcgc2VydmljZWRpc2NvdmVyeS5QdWJsaWNEbnNOYW1lc3BhY2Uoc3RhY2ssICdNeU5hbWVzcGFjZScsIHtcbiAgICAgIG5hbWU6ICdkbnMnLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc2VydmljZSA9IG5hbWVzcGFjZS5jcmVhdGVTZXJ2aWNlKCdNeVNlcnZpY2UnLCB7XG4gICAgICBuYW1lOiAnc2VydmljZScsXG4gICAgICBkbnNSZWNvcmRUeXBlOiBzZXJ2aWNlZGlzY292ZXJ5LkRuc1JlY29yZFR5cGUuQUFBQSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgc2VydmljZS5yZWdpc3RlcklwSW5zdGFuY2UoJ0lwSW5zdGFuY2UnLCB7XG4gICAgICAgIHBvcnQ6IDMzMDYsXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC9BbiBgaXB2NmAgbXVzdCBiZSBzcGVjaWZpZWQgZm9yIGEgc2VydmljZSB1c2luZyBhIGBBQUFBYCByZWNvcmQuLyk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdSZWdpc3RlcmluZyBJcEluc3RhbmNlIHRocm93cyB3aXRoIHdyb25nIEROUyByZWNvcmQgdHlwZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3QgbmFtZXNwYWNlID0gbmV3IHNlcnZpY2VkaXNjb3ZlcnkuUHVibGljRG5zTmFtZXNwYWNlKHN0YWNrLCAnTXlOYW1lc3BhY2UnLCB7XG4gICAgICBuYW1lOiAnZG5zJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IHNlcnZpY2UgPSBuYW1lc3BhY2UuY3JlYXRlU2VydmljZSgnTXlTZXJ2aWNlJywge1xuICAgICAgbmFtZTogJ3NlcnZpY2UnLFxuICAgICAgZG5zUmVjb3JkVHlwZTogc2VydmljZWRpc2NvdmVyeS5EbnNSZWNvcmRUeXBlLkNOQU1FLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBzZXJ2aWNlLnJlZ2lzdGVySXBJbnN0YW5jZSgnSXBJbnN0YW5jZScsIHtcbiAgICAgICAgcG9ydDogMzMwNixcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL1NlcnZpY2UgbXVzdCBzdXBwb3J0IGBBYCwgYEFBQUFgIG9yIGBTUlZgIHJlY29yZHMgdG8gcmVnaXN0ZXIgdGhpcyBpbnN0YW5jZSB0eXBlLi8pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnUmVnaXN0ZXJpbmcgQWxpYXNUYXJnZXRJbnN0YW5jZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZQQycpO1xuICAgIGNvbnN0IGFsYiA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcihzdGFjaywgJ015QUxCJywgeyB2cGMgfSk7XG5cbiAgICBjb25zdCBuYW1lc3BhY2UgPSBuZXcgc2VydmljZWRpc2NvdmVyeS5Qcml2YXRlRG5zTmFtZXNwYWNlKHN0YWNrLCAnTXlOYW1lc3BhY2UnLCB7XG4gICAgICBuYW1lOiAnZG5zJyxcbiAgICAgIHZwYyxcbiAgICB9KTtcblxuICAgIGNvbnN0IHNlcnZpY2UgPSBuYW1lc3BhY2UuY3JlYXRlU2VydmljZSgnTXlTZXJ2aWNlJywge1xuICAgICAgbmFtZTogJ3NlcnZpY2UnLFxuICAgICAgbG9hZEJhbGFuY2VyOiB0cnVlLFxuICAgIH0pO1xuICAgIGNvbnN0IGN1c3RvbUF0dHJpYnV0ZXMgPSB7IGZvbzogJ2JhcicgfTtcblxuICAgIHNlcnZpY2UucmVnaXN0ZXJMb2FkQmFsYW5jZXIoJ0xvYWRiYWxhbmNlcicsIGFsYiwgY3VzdG9tQXR0cmlidXRlcyk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U2VydmljZURpc2NvdmVyeTo6SW5zdGFuY2UnLCB7XG4gICAgICBJbnN0YW5jZUF0dHJpYnV0ZXM6IHtcbiAgICAgICAgQVdTX0FMSUFTX0ROU19OQU1FOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnTXlBTEI5MTFBODU1NicsXG4gICAgICAgICAgICAnRE5TTmFtZScsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgZm9vOiAnYmFyJyxcbiAgICAgIH0sXG4gICAgICBTZXJ2aWNlSWQ6IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgJ015TmFtZXNwYWNlTXlTZXJ2aWNlMzY1RTI0NzAnLFxuICAgICAgICAgICdJZCcsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgSW5zdGFuY2VJZDogJ015TmFtZXNwYWNlTXlTZXJ2aWNlTG9hZGJhbGFuY2VyRDExMTJBNzYnLFxuICAgIH0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnVGhyb3dzIHdoZW4gcmVnaXN0ZXJpbmcgQWxpYXNUYXJnZXRJbnN0YW5jZSB3aXRoIEh0dHAgTmFtZXNwYWNlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBjb25zdCBuYW1lc3BhY2UgPSBuZXcgc2VydmljZWRpc2NvdmVyeS5IdHRwTmFtZXNwYWNlKHN0YWNrLCAnTXlOYW1lc3BhY2UnLCB7XG4gICAgICBuYW1lOiAnaHR0cCcsXG4gICAgfSk7XG5cbiAgICBjb25zdCBzZXJ2aWNlID0gbmV3IHNlcnZpY2VkaXNjb3ZlcnkuU2VydmljZShzdGFjaywgJ015U2VydmljZScsIHtcbiAgICAgIG5hbWVzcGFjZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWUEMnKTtcbiAgICBjb25zdCBhbGIgPSBuZXcgZWxidjIuQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIoc3RhY2ssICdNeUFMQicsIHsgdnBjIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBzZXJ2aWNlLnJlZ2lzdGVyTG9hZEJhbGFuY2VyKCdMb2FkYmFsYW5jZXInLCBhbGIpO1xuICAgIH0pLnRvVGhyb3coL05hbWVzcGFjZSBhc3NvY2lhdGVkIHdpdGggU2VydmljZSBtdXN0IGJlIGEgRE5TIE5hbWVzcGFjZS4vKTtcblxuXG4gIH0pO1xuXG4gIC8vIFRPRE8gc2hvdWxkbid0IGJlIGFsbG93ZWQgdG8gZG8gdGhpcyBpZiBsb2FkYmFsYW5jZXIgb24gU2VydmljZVByb3BzIGlzIG5vdCBzZXQgdG8gdHJ1ZS5cbiAgdGVzdCgnVGhyb3dzIHdoZW4gcmVnaXN0ZXJpbmcgQWxpYXNUYXJnZXRJbnN0YW5jZSB3aXRoIHdyb25nIFJvdXRpbmcgUG9saWN5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBjb25zdCBuYW1lc3BhY2UgPSBuZXcgc2VydmljZWRpc2NvdmVyeS5QdWJsaWNEbnNOYW1lc3BhY2Uoc3RhY2ssICdNeU5hbWVzcGFjZScsIHtcbiAgICAgIG5hbWU6ICdodHRwJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IHNlcnZpY2UgPSBuYW1lc3BhY2UuY3JlYXRlU2VydmljZSgnTXlTZXJ2aWNlJywge1xuICAgICAgcm91dGluZ1BvbGljeTogc2VydmljZWRpc2NvdmVyeS5Sb3V0aW5nUG9saWN5Lk1VTFRJVkFMVUUsXG4gICAgfSk7XG5cbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VlBDJyk7XG4gICAgY29uc3QgYWxiID0gbmV3IGVsYnYyLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyKHN0YWNrLCAnTXlBTEInLCB7IHZwYyB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgc2VydmljZS5yZWdpc3RlckxvYWRCYWxhbmNlcignTG9hZGJhbGFuY2VyJywgYWxiKTtcbiAgICB9KS50b1Rocm93KC9TZXJ2aWNlIG11c3QgdXNlIGBXRUlHSFRFRGAgcm91dGluZyBwb2xpY3kuLyk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdSZWdpc3RlciBDbmFtZUluc3RhbmNlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBjb25zdCBuYW1lc3BhY2UgPSBuZXcgc2VydmljZWRpc2NvdmVyeS5QdWJsaWNEbnNOYW1lc3BhY2Uoc3RhY2ssICdNeU5hbWVzcGFjZScsIHtcbiAgICAgIG5hbWU6ICdkbnMnLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc2VydmljZSA9IG5hbWVzcGFjZS5jcmVhdGVTZXJ2aWNlKCdNeVNlcnZpY2UnLCB7XG4gICAgICBkbnNSZWNvcmRUeXBlOiBzZXJ2aWNlZGlzY292ZXJ5LkRuc1JlY29yZFR5cGUuQ05BTUUsXG4gICAgfSk7XG5cbiAgICBzZXJ2aWNlLnJlZ2lzdGVyQ25hbWVJbnN0YW5jZSgnQ25hbWVJbnN0YW5jZScsIHtcbiAgICAgIGluc3RhbmNlQ25hbWU6ICdmb28uY29tJyxcbiAgICAgIGN1c3RvbUF0dHJpYnV0ZXM6IHsgZG9nczogJ2dvb2QnIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U2VydmljZURpc2NvdmVyeTo6SW5zdGFuY2UnLCB7XG4gICAgICBJbnN0YW5jZUF0dHJpYnV0ZXM6IHtcbiAgICAgICAgQVdTX0lOU1RBTkNFX0NOQU1FOiAnZm9vLmNvbScsXG4gICAgICAgIGRvZ3M6ICdnb29kJyxcbiAgICAgIH0sXG4gICAgICBTZXJ2aWNlSWQ6IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgJ015TmFtZXNwYWNlTXlTZXJ2aWNlMzY1RTI0NzAnLFxuICAgICAgICAgICdJZCcsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgSW5zdGFuY2VJZDogJ015TmFtZXNwYWNlTXlTZXJ2aWNlQ25hbWVJbnN0YW5jZTBFQjFDOThEJyxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ1Rocm93cyB3aGVuIHJlZ2lzdGVyaW5nIENuYW1lSW5zdGFuY2UgZm9yIGFuIEhUVFAgbmFtZXNwYWNlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBjb25zdCBuYW1lc3BhY2UgPSBuZXcgc2VydmljZWRpc2NvdmVyeS5IdHRwTmFtZXNwYWNlKHN0YWNrLCAnTXlOYW1lc3BhY2UnLCB7XG4gICAgICBuYW1lOiAnaHR0cCcsXG4gICAgfSk7XG5cbiAgICBjb25zdCBzZXJ2aWNlID0gbmV3IHNlcnZpY2VkaXNjb3ZlcnkuU2VydmljZShzdGFjaywgJ015U2VydmljZScsIHtcbiAgICAgIG5hbWVzcGFjZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgc2VydmljZS5yZWdpc3RlckNuYW1lSW5zdGFuY2UoJ0NuYW1lSW5zdGFuY2UnLCB7XG4gICAgICAgIGluc3RhbmNlQ25hbWU6ICdmb28uY29tJyxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL05hbWVzcGFjZSBhc3NvY2lhdGVkIHdpdGggU2VydmljZSBtdXN0IGJlIGEgRE5TIE5hbWVzcGFjZS8pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnUmVnaXN0ZXIgTm9uSXBJbnN0YW5jZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3QgbmFtZXNwYWNlID0gbmV3IHNlcnZpY2VkaXNjb3ZlcnkuSHR0cE5hbWVzcGFjZShzdGFjaywgJ015TmFtZXNwYWNlJywge1xuICAgICAgbmFtZTogJ2h0dHAnLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc2VydmljZSA9IG5hbWVzcGFjZS5jcmVhdGVTZXJ2aWNlKCdNeVNlcnZpY2UnKTtcblxuICAgIHNlcnZpY2UucmVnaXN0ZXJOb25JcEluc3RhbmNlKCdOb25JcEluc3RhbmNlJywge1xuICAgICAgY3VzdG9tQXR0cmlidXRlczogeyBkb2dzOiAnZ29vZCcgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTZXJ2aWNlRGlzY292ZXJ5OjpJbnN0YW5jZScsIHtcbiAgICAgIEluc3RhbmNlQXR0cmlidXRlczoge1xuICAgICAgICBkb2dzOiAnZ29vZCcsXG4gICAgICB9LFxuICAgICAgU2VydmljZUlkOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdNeU5hbWVzcGFjZU15U2VydmljZTM2NUUyNDcwJyxcbiAgICAgICAgICAnSWQnLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIEluc3RhbmNlSWQ6ICdNeU5hbWVzcGFjZU15U2VydmljZU5vbklwSW5zdGFuY2U3RUZENzAzQScsXG4gICAgfSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdSZWdpc3RlciBOb25JcEluc3RhbmNlLCBETlMgTmFtZXNwYWNlLCBBUEkgT25seSBzZXJ2aWNlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBjb25zdCBuYW1lc3BhY2UgPSBuZXcgc2VydmljZWRpc2NvdmVyeS5QdWJsaWNEbnNOYW1lc3BhY2UoXG4gICAgICBzdGFjayxcbiAgICAgICdNeU5hbWVzcGFjZScsXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdodHRwJyxcbiAgICAgIH0sXG4gICAgKTtcblxuICAgIGNvbnN0IHNlcnZpY2UgPSBuYW1lc3BhY2UuY3JlYXRlU2VydmljZSgnTXlTZXJ2aWNlJywgeyBkaXNjb3ZlcnlUeXBlOiBzZXJ2aWNlZGlzY292ZXJ5LkRpc2NvdmVyeVR5cGUuQVBJIH0gKTtcblxuICAgIHNlcnZpY2UucmVnaXN0ZXJOb25JcEluc3RhbmNlKCdOb25JcEluc3RhbmNlJywge1xuICAgICAgY3VzdG9tQXR0cmlidXRlczogeyBkb2dzOiAnZ29vZCcgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcyhcbiAgICAgICdBV1M6OlNlcnZpY2VEaXNjb3Zlcnk6Okluc3RhbmNlJyxcbiAgICAgIHtcbiAgICAgICAgSW5zdGFuY2VBdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgZG9nczogJ2dvb2QnLFxuICAgICAgICB9LFxuICAgICAgICBTZXJ2aWNlSWQ6IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFsnTXlOYW1lc3BhY2VNeVNlcnZpY2UzNjVFMjQ3MCcsICdJZCddLFxuICAgICAgICB9LFxuICAgICAgICBJbnN0YW5jZUlkOiAnTXlOYW1lc3BhY2VNeVNlcnZpY2VOb25JcEluc3RhbmNlN0VGRDcwM0EnLFxuICAgICAgfSxcbiAgICApO1xuICB9KTtcblxuICB0ZXN0KCdUaHJvd3Mgd2hlbiByZWdpc3RlcmluZyBOb25JcEluc3RhbmNlIGZvciBhbiBETlMgZGlzY292ZXJhYmxlIHNlcnZpY2UnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IG5hbWVzcGFjZSA9IG5ldyBzZXJ2aWNlZGlzY292ZXJ5LlB1YmxpY0Ruc05hbWVzcGFjZShzdGFjaywgJ015TmFtZXNwYWNlJywge1xuICAgICAgbmFtZTogJ2h0dHAnLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc2VydmljZSA9IG5hbWVzcGFjZS5jcmVhdGVTZXJ2aWNlKCdNeVNlcnZpY2UnKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgc2VydmljZS5yZWdpc3Rlck5vbklwSW5zdGFuY2UoJ05vbklwSW5zdGFuY2UnLCB7XG4gICAgICAgIGluc3RhbmNlSWQ6ICdub25JcCcsXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC9UaGlzIHR5cGUgb2YgaW5zdGFuY2UgY2FuIG9ubHkgYmUgcmVnaXN0ZXJlZCBmb3IgSFRUUCBuYW1lc3BhY2VzLi8pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnVGhyb3dzIHdoZW4gbm8gY3VzdG9tIGF0dHJpYnVlcyBzcGVjaWZpZWQgZm9yIE5vbklwSW5zdGFuY2UnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IG5hbWVzcGFjZSA9IG5ldyBzZXJ2aWNlZGlzY292ZXJ5Lkh0dHBOYW1lc3BhY2Uoc3RhY2ssICdNeU5hbWVzcGFjZScsIHtcbiAgICAgIG5hbWU6ICdodHRwJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IHNlcnZpY2UgPSBuYW1lc3BhY2UuY3JlYXRlU2VydmljZSgnTXlTZXJ2aWNlJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIHNlcnZpY2UucmVnaXN0ZXJOb25JcEluc3RhbmNlKCdOb25JcEluc3RhbmNlJywge1xuICAgICAgICBpbnN0YW5jZUlkOiAnbm9uSXAnLFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdygvWW91IG11c3Qgc3BlY2lmeSBhdCBsZWFzdCBvbmUgY3VzdG9tIGF0dHJpYnV0ZSBmb3IgdGhpcyBpbnN0YW5jZSB0eXBlLi8pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnVGhyb3dzIHdoZW4gY3VzdG9tIGF0dHJpYnVlcyBhcmUgZW1wdHlmb3IgTm9uSXBJbnN0YW5jZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3QgbmFtZXNwYWNlID0gbmV3IHNlcnZpY2VkaXNjb3ZlcnkuSHR0cE5hbWVzcGFjZShzdGFjaywgJ015TmFtZXNwYWNlJywge1xuICAgICAgbmFtZTogJ2h0dHAnLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc2VydmljZSA9IG5hbWVzcGFjZS5jcmVhdGVTZXJ2aWNlKCdNeVNlcnZpY2UnKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgc2VydmljZS5yZWdpc3Rlck5vbklwSW5zdGFuY2UoJ05vbklwSW5zdGFuY2UnLCB7XG4gICAgICAgIGluc3RhbmNlSWQ6ICdub25JcCcsXG4gICAgICAgIGN1c3RvbUF0dHJpYnV0ZXM6IHt9LFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdygvWW91IG11c3Qgc3BlY2lmeSBhdCBsZWFzdCBvbmUgY3VzdG9tIGF0dHJpYnV0ZSBmb3IgdGhpcyBpbnN0YW5jZSB0eXBlLi8pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnUmVnaXN0ZXIgbXVsdGlwbGUgaW5zdGFuY2VzIG9uIHRoZSBzYW1lIHNlcnZpY2UnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IG5hbWVzcGFjZSA9IG5ldyBzZXJ2aWNlZGlzY292ZXJ5LlB1YmxpY0Ruc05hbWVzcGFjZShzdGFjaywgJ015TmFtZXNwYWNlJywge1xuICAgICAgbmFtZTogJ3B1YmxpYycsXG4gICAgfSk7XG5cbiAgICBjb25zdCBzZXJ2aWNlID0gbmFtZXNwYWNlLmNyZWF0ZVNlcnZpY2UoJ015U2VydmljZScpO1xuXG4gICAgLy8gV0hFTlxuICAgIHNlcnZpY2UucmVnaXN0ZXJJcEluc3RhbmNlKCdGaXJzdCcsIHtcbiAgICAgIGlwdjQ6ICcxMC4wLjAuMCcsXG4gICAgfSk7XG5cbiAgICBzZXJ2aWNlLnJlZ2lzdGVySXBJbnN0YW5jZSgnU2Vjb25kJywge1xuICAgICAgaXB2NDogJzEwLjAuMC4xJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpTZXJ2aWNlRGlzY292ZXJ5OjpJbnN0YW5jZScsIDIpO1xuXG5cbiAgfSk7XG59KTtcbiJdfQ==