"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const ec2 = require("aws-cdk-lib/aws-ec2");
const cloudmap = require("aws-cdk-lib/aws-servicediscovery");
const cdk = require("aws-cdk-lib");
const appmesh = require("aws-cdk-lib/aws-appmesh");
exports.app = new cdk.App();
const stack = new cdk.Stack(exports.app, 'mesh-stack', {});
const vpc = new ec2.Vpc(stack, 'vpc', {
    natGateways: 1,
});
const namespace = new cloudmap.PrivateDnsNamespace(stack, 'test-namespace', {
    vpc,
    name: 'domain.local',
});
const mesh = new appmesh.Mesh(stack, 'mesh');
new appmesh.Mesh(stack, 'mesh-with-preference', {
    serviceDiscovery: {
        ipPreference: appmesh.IpPreference.IPV4_ONLY,
    },
});
const router = mesh.addVirtualRouter('router', {
    listeners: [
        appmesh.VirtualRouterListener.http(),
    ],
});
const virtualService = new appmesh.VirtualService(stack, 'service', {
    virtualServiceProvider: appmesh.VirtualServiceProvider.virtualRouter(router),
    virtualServiceName: 'service1.domain.local',
});
const node = mesh.addVirtualNode('node', {
    serviceDiscovery: appmesh.ServiceDiscovery.dns(`node1.${namespace.namespaceName}`, undefined, appmesh.IpPreference.IPV4_ONLY),
    listeners: [appmesh.VirtualNodeListener.http({
            healthCheck: appmesh.HealthCheck.http({
                healthyThreshold: 3,
                path: '/check-path',
            }),
        })],
    backends: [appmesh.Backend.virtualService(virtualService)],
});
node.addBackend(appmesh.Backend.virtualService(new appmesh.VirtualService(stack, 'service-2', {
    virtualServiceName: 'service2.domain.local',
    virtualServiceProvider: appmesh.VirtualServiceProvider.none(mesh),
})));
router.addRoute('route-1', {
    routeSpec: appmesh.RouteSpec.http({
        weightedTargets: [
            {
                virtualNode: node,
                weight: 50,
            },
        ],
        match: {
            path: appmesh.HttpRoutePathMatch.startsWith('/'),
        },
        timeout: {
            idle: cdk.Duration.seconds(10),
            perRequest: cdk.Duration.seconds(10),
        },
    }),
});
const node2 = mesh.addVirtualNode('node2', {
    serviceDiscovery: appmesh.ServiceDiscovery.dns(`node2.${namespace.namespaceName}`),
    listeners: [appmesh.VirtualNodeListener.http({
            healthCheck: appmesh.HealthCheck.http({
                healthyThreshold: 3,
                interval: cdk.Duration.seconds(5),
                path: '/check-path2',
                timeout: cdk.Duration.seconds(2),
                unhealthyThreshold: 2,
            }),
        })],
    backendDefaults: {
        tlsClientPolicy: {
            validation: {
                trust: appmesh.TlsValidationTrust.file('path/to/cert'),
            },
        },
    },
    backends: [appmesh.Backend.virtualService(new appmesh.VirtualService(stack, 'service-3', {
            virtualServiceName: 'service3.domain.local',
            virtualServiceProvider: appmesh.VirtualServiceProvider.none(mesh),
        }))],
});
const node3 = mesh.addVirtualNode('node3', {
    serviceDiscovery: appmesh.ServiceDiscovery.dns(`node3.${namespace.namespaceName}`),
    listeners: [appmesh.VirtualNodeListener.http({
            healthCheck: appmesh.HealthCheck.http({
                healthyThreshold: 3,
                interval: cdk.Duration.seconds(5),
                path: '/check-path3',
                timeout: cdk.Duration.seconds(2),
                unhealthyThreshold: 2,
            }),
        })],
    backendDefaults: {
        tlsClientPolicy: {
            validation: {
                trust: appmesh.TlsValidationTrust.file('path-to-certificate'),
            },
        },
    },
    accessLog: appmesh.AccessLog.fromFilePath('/dev/stdout'),
});
const node4 = mesh.addVirtualNode('node4', {
    serviceDiscovery: appmesh.ServiceDiscovery.dns(`node4.${namespace.namespaceName}`, appmesh.DnsResponseType.ENDPOINTS),
    listeners: [appmesh.VirtualNodeListener.http({
            tls: {
                mode: appmesh.TlsMode.STRICT,
                certificate: appmesh.TlsCertificate.sds('spiffe://domain.local/backend-service'),
                mutualTlsValidation: {
                    trust: appmesh.TlsValidationTrust.sds('spiffe://domain.local'),
                    subjectAlternativeNames: appmesh.SubjectAlternativeNames.matchingExactly('client.domain.local'),
                },
            },
            healthCheck: appmesh.HealthCheck.http({
                healthyThreshold: 3,
                interval: cdk.Duration.seconds(5),
                path: '/check-path3',
                timeout: cdk.Duration.seconds(2),
                unhealthyThreshold: 2,
            }),
        })],
    backendDefaults: {
        tlsClientPolicy: {
            mutualTlsCertificate: appmesh.TlsCertificate.file('path/to/certChain', 'path/to/privateKey'),
            validation: {
                subjectAlternativeNames: appmesh.SubjectAlternativeNames.matchingExactly('mymesh.local'),
                trust: appmesh.TlsValidationTrust.file('path-to-certificate'),
            },
        },
    },
    accessLog: appmesh.AccessLog.fromFilePath('/dev/stdout'),
});
node4.addBackend(appmesh.Backend.virtualService(new appmesh.VirtualService(stack, 'service-4', {
    virtualServiceName: 'service4.domain.local',
    virtualServiceProvider: appmesh.VirtualServiceProvider.none(mesh),
})));
router.addRoute('route-2', {
    routeSpec: appmesh.RouteSpec.http({
        weightedTargets: [
            {
                virtualNode: node2,
                weight: 30,
            },
        ],
        match: {
            path: appmesh.HttpRoutePathMatch.startsWith('/path2'),
        },
        timeout: {
            idle: cdk.Duration.seconds(11),
            perRequest: cdk.Duration.seconds(11),
        },
    }),
});
router.addRoute('route-3', {
    routeSpec: appmesh.RouteSpec.tcp({
        weightedTargets: [
            {
                virtualNode: node3,
                weight: 20,
            },
        ],
        timeout: {
            idle: cdk.Duration.seconds(12),
        },
    }),
});
router.addRoute('route-4', {
    routeSpec: appmesh.RouteSpec.grpc({
        weightedTargets: [
            {
                virtualNode: node4,
                weight: 20,
            },
        ],
        timeout: {
            idle: cdk.Duration.seconds(12),
        },
        match: {
            serviceName: 'test',
        },
    }),
});
router.addRoute('route-matching', {
    routeSpec: appmesh.RouteSpec.http2({
        weightedTargets: [{ virtualNode: node3 }],
        match: {
            path: appmesh.HttpRoutePathMatch.startsWith('/'),
            method: appmesh.HttpRouteMethod.POST,
            protocol: appmesh.HttpRouteProtocol.HTTPS,
            headers: [
                appmesh.HeaderMatch.valueIs('Content-Type', 'application/json'),
                appmesh.HeaderMatch.valueStartsWith('Content-Type', 'application/json'),
                appmesh.HeaderMatch.valueEndsWith('Content-Type', 'application/json'),
                appmesh.HeaderMatch.valueMatchesRegex('Content-Type', 'application/.*'),
                appmesh.HeaderMatch.valuesIsInRange('Content-Type', 1, 5),
                appmesh.HeaderMatch.valueIsNot('Content-Type', 'application/json'),
                appmesh.HeaderMatch.valueDoesNotStartWith('Content-Type', 'application/json'),
                appmesh.HeaderMatch.valueDoesNotEndWith('Content-Type', 'application/json'),
                appmesh.HeaderMatch.valueDoesNotMatchRegex('Content-Type', 'application/.*'),
                appmesh.HeaderMatch.valuesIsNotInRange('Content-Type', 1, 5),
            ],
        },
    }),
});
router.addRoute('route-http2-retry', {
    routeSpec: appmesh.RouteSpec.http2({
        weightedTargets: [{ virtualNode: node3 }],
        retryPolicy: {
            httpRetryEvents: [appmesh.HttpRetryEvent.CLIENT_ERROR],
            tcpRetryEvents: [appmesh.TcpRetryEvent.CONNECTION_ERROR],
            retryAttempts: 5,
            retryTimeout: cdk.Duration.seconds(1),
        },
    }),
});
router.addRoute('route-5', {
    routeSpec: appmesh.RouteSpec.http2({
        priority: 10,
        weightedTargets: [{ virtualNode: node2 }],
    }),
});
router.addRoute('route-grpc-retry', {
    routeSpec: appmesh.RouteSpec.grpc({
        weightedTargets: [{ virtualNode: node3 }],
        match: { serviceName: 'servicename' },
        retryPolicy: {
            grpcRetryEvents: [appmesh.GrpcRetryEvent.DEADLINE_EXCEEDED],
            httpRetryEvents: [appmesh.HttpRetryEvent.CLIENT_ERROR],
            tcpRetryEvents: [appmesh.TcpRetryEvent.CONNECTION_ERROR],
            retryAttempts: 5,
            retryTimeout: cdk.Duration.seconds(1),
        },
    }),
});
router.addRoute('route-6', {
    routeSpec: appmesh.RouteSpec.http2({
        weightedTargets: [
            {
                virtualNode: node2,
                weight: 30,
            },
        ],
        match: {
            path: appmesh.HttpRoutePathMatch.regex('regex'),
            queryParameters: [
                appmesh.QueryParameterMatch.valueIs('query-field', 'value'),
            ],
        },
    }),
});
router.addRoute('route-7', {
    routeSpec: appmesh.RouteSpec.grpc({
        weightedTargets: [
            {
                virtualNode: node4,
                weight: 20,
            },
        ],
        match: {
            serviceName: 'test-service',
            methodName: 'test-method',
            metadata: [
                appmesh.HeaderMatch.valueIs('Content-Type', 'application/json'),
            ],
        },
    }),
});
const gateway = mesh.addVirtualGateway('gateway1', {
    accessLog: appmesh.AccessLog.fromFilePath('/dev/stdout'),
    virtualGatewayName: 'gateway1',
});
new appmesh.VirtualGateway(stack, 'gateway2', {
    mesh: mesh,
    listeners: [appmesh.VirtualGatewayListener.http({
            port: 443,
            healthCheck: appmesh.HealthCheck.http({
                interval: cdk.Duration.seconds(10),
            }),
            tls: {
                mode: appmesh.TlsMode.STRICT,
                certificate: appmesh.TlsCertificate.file('path/to/certChain', 'path/to/privateKey'),
            },
        })],
});
new appmesh.VirtualGateway(stack, 'gateway3', {
    mesh: mesh,
    listeners: [appmesh.VirtualGatewayListener.http({
            port: 443,
            healthCheck: appmesh.HealthCheck.http({
                interval: cdk.Duration.seconds(10),
            }),
            tls: {
                mode: appmesh.TlsMode.STRICT,
                certificate: appmesh.TlsCertificate.sds('secret_certificate'),
                mutualTlsValidation: {
                    trust: appmesh.TlsValidationTrust.file('path/to/certChain'),
                },
            },
        })],
    backendDefaults: {
        tlsClientPolicy: {
            mutualTlsCertificate: appmesh.TlsCertificate.sds('secret_validation'),
            validation: {
                trust: appmesh.TlsValidationTrust.file('path/to/certChain'),
            },
        },
    },
});
gateway.addGatewayRoute('gateway1-route-http', {
    routeSpec: appmesh.GatewayRouteSpec.http({
        routeTarget: virtualService,
    }),
});
gateway.addGatewayRoute('gateway1-route-http-2', {
    routeSpec: appmesh.GatewayRouteSpec.http({
        routeTarget: virtualService,
        match: {
            path: appmesh.HttpGatewayRoutePathMatch.startsWith('/', ''),
            hostname: appmesh.GatewayRouteHostnameMatch.exactly('example.com'),
            method: appmesh.HttpRouteMethod.POST,
            headers: [
                appmesh.HeaderMatch.valueIs('Content-Type', 'application/json'),
                appmesh.HeaderMatch.valueStartsWith('Content-Type', 'application/json'),
                appmesh.HeaderMatch.valueEndsWith('Content-Type', 'application/json'),
                appmesh.HeaderMatch.valueMatchesRegex('Content-Type', 'application/.*'),
                appmesh.HeaderMatch.valuesIsInRange('Content-Type', 1, 5),
                appmesh.HeaderMatch.valueIsNot('Content-Type', 'application/json'),
                appmesh.HeaderMatch.valueDoesNotStartWith('Content-Type', 'application/json'),
                appmesh.HeaderMatch.valueDoesNotEndWith('Content-Type', 'application/json'),
                appmesh.HeaderMatch.valueDoesNotMatchRegex('Content-Type', 'application/.*'),
                appmesh.HeaderMatch.valuesIsNotInRange('Content-Type', 1, 5),
            ],
            queryParameters: [
                appmesh.QueryParameterMatch.valueIs('query-field', 'value'),
            ],
            rewriteRequestHostname: true,
        },
    }),
});
gateway.addGatewayRoute('gateway1-route-http2', {
    routeSpec: appmesh.GatewayRouteSpec.http2({
        routeTarget: virtualService,
    }),
});
gateway.addGatewayRoute('gateway1-route-http2-2', {
    routeSpec: appmesh.GatewayRouteSpec.http2({
        routeTarget: virtualService,
        match: {
            path: appmesh.HttpGatewayRoutePathMatch.exactly('/exact', '/rewrittenpath'),
        },
    }),
});
gateway.addGatewayRoute('gateway1-route-http2-3', {
    routeSpec: appmesh.GatewayRouteSpec.http2({
        routeTarget: virtualService,
        match: {
            path: appmesh.HttpGatewayRoutePathMatch.regex('regex'),
        },
    }),
});
gateway.addGatewayRoute('gateway1-route-grpc', {
    routeSpec: appmesh.GatewayRouteSpec.grpc({
        routeTarget: virtualService,
        match: {
            serviceName: virtualService.virtualServiceName,
        },
    }),
});
gateway.addGatewayRoute('gateway1-route-grpc-2', {
    routeSpec: appmesh.GatewayRouteSpec.grpc({
        routeTarget: virtualService,
        match: {
            hostname: appmesh.GatewayRouteHostnameMatch.exactly('example.com'),
            metadata: [
                appmesh.HeaderMatch.valueIs('Content-Type', 'application/json'),
                appmesh.HeaderMatch.valueIsNot('Content-Type', 'text/html'),
                appmesh.HeaderMatch.valueStartsWith('Content-Type', 'application/'),
                appmesh.HeaderMatch.valueDoesNotStartWith('Content-Type', 'text/'),
                appmesh.HeaderMatch.valueEndsWith('Content-Type', '/json'),
                appmesh.HeaderMatch.valueDoesNotEndWith('Content-Type', '/json+foobar'),
                appmesh.HeaderMatch.valueMatchesRegex('Content-Type', 'application/.*'),
                appmesh.HeaderMatch.valueDoesNotMatchRegex('Content-Type', 'text/.*'),
                appmesh.HeaderMatch.valuesIsInRange('Max-Forward', 1, 5),
                appmesh.HeaderMatch.valuesIsNotInRange('Max-Forward', 1, 5),
            ],
            rewriteRequestHostname: false,
        },
    }),
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubWVzaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLm1lc2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkNBQTJDO0FBQzNDLDZEQUE2RDtBQUM3RCxtQ0FBbUM7QUFDbkMsbURBQW1EO0FBRXRDLFFBQUEsR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRWpDLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxXQUFHLEVBQUUsWUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBRW5ELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO0lBQ3BDLFdBQVcsRUFBRSxDQUFDO0NBQ2YsQ0FBQyxDQUFDO0FBRUgsTUFBTSxTQUFTLEdBQUcsSUFBSSxRQUFRLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUFFO0lBQzFFLEdBQUc7SUFDSCxJQUFJLEVBQUUsY0FBYztDQUNyQixDQUFDLENBQUM7QUFFSCxNQUFNLElBQUksR0FBRyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzdDLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsc0JBQXNCLEVBQUU7SUFDOUMsZ0JBQWdCLEVBQUU7UUFDaEIsWUFBWSxFQUFFLE9BQU8sQ0FBQyxZQUFZLENBQUMsU0FBUztLQUM3QztDQUNGLENBQUMsQ0FBQztBQUNILE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUU7SUFDN0MsU0FBUyxFQUFFO1FBQ1QsT0FBTyxDQUFDLHFCQUFxQixDQUFDLElBQUksRUFBRTtLQUNyQztDQUNGLENBQUMsQ0FBQztBQUVILE1BQU0sY0FBYyxHQUFHLElBQUksT0FBTyxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFF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LE9BQU8sQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLGNBQWMsRUFBRSxXQUFXLENBQUM7Z0JBQzNELE9BQU8sQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLGNBQWMsRUFBRSxjQUFjLENBQUM7Z0JBQ25FLE9BQU8sQ0FBQyxXQUFXLENBQUMscUJBQXFCLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQztnQkFDbEUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQztnQkFDMUQsT0FBTyxDQUFDLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxjQUFjLEVBQUUsY0FBYyxDQUFDO2dCQUN2RSxPQUFPLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLGNBQWMsRUFBRSxnQkFBZ0IsQ0FBQztnQkFDdkUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxzQkFBc0IsQ0FBQyxjQUFjLEVBQUUsU0FBUyxDQUFDO2dCQUNyRSxPQUFPLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDeEQsT0FBTyxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUM1RDtZQUNELHNCQUFzQixFQUFFLEtBQUs7U0FDOUI7S0FDRixDQUFDO0NBQ0gsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgY2xvdWRtYXAgZnJvbSAnYXdzLWNkay1saWIvYXdzLXNlcnZpY2VkaXNjb3ZlcnknO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGFwcG1lc2ggZnJvbSAnYXdzLWNkay1saWIvYXdzLWFwcG1lc2gnO1xuXG5leHBvcnQgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxuY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ21lc2gtc3RhY2snLCB7fSk7XG5cbmNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAndnBjJywge1xuICBuYXRHYXRld2F5czogMSxcbn0pO1xuXG5jb25zdCBuYW1lc3BhY2UgPSBuZXcgY2xvdWRtYXAuUHJpdmF0ZURuc05hbWVzcGFjZShzdGFjaywgJ3Rlc3QtbmFtZXNwYWNlJywge1xuICB2cGMsXG4gIG5hbWU6ICdkb21haW4ubG9jYWwnLFxufSk7XG5cbmNvbnN0IG1lc2ggPSBuZXcgYXBwbWVzaC5NZXNoKHN0YWNrLCAnbWVzaCcpO1xubmV3IGFwcG1lc2guTWVzaChzdGFjaywgJ21lc2gtd2l0aC1wcmVmZXJlbmNlJywge1xuICBzZXJ2aWNlRGlzY292ZXJ5OiB7XG4gICAgaXBQcmVmZXJlbmNlOiBhcHBtZXNoLklwUHJlZmVyZW5jZS5JUFY0X09OTFksXG4gIH0sXG59KTtcbmNvbnN0IHJvdXRlciA9IG1lc2guYWRkVmlydHVhbFJvdXRlcigncm91dGVyJywge1xuICBsaXN0ZW5lcnM6IFtcbiAgICBhcHBtZXNoLlZpcnR1YWxSb3V0ZXJMaXN0ZW5lci5odHRwKCksXG4gIF0sXG59KTtcblxuY29uc3QgdmlydHVhbFNlcnZpY2UgPSBuZXcgYXBwbWVzaC5WaXJ0dWFsU2VydmljZShzdGFjaywgJ3NlcnZpY2UnLCB7XG4gIHZpcnR1YWxTZXJ2aWNlUHJvdmlkZXI6IGFwcG1lc2guVmlydHVhbFNlcnZpY2VQcm92aWRlci52aXJ0dWFsUm91dGVyKHJvdXRlciksXG4gIHZpcnR1YWxTZXJ2aWNlTmFtZTogJ3NlcnZpY2UxLmRvbWFpbi5sb2NhbCcsXG59KTtcblxuY29uc3Qgbm9kZSA9IG1lc2guYWRkVmlydHVhbE5vZGUoJ25vZGUnLCB7XG4gIHNlcnZpY2VEaXNjb3Zlcnk6IGFwcG1lc2guU2VydmljZURpc2NvdmVyeS5kbnMoYG5vZGUxLiR7bmFtZXNwYWNlLm5hbWVzcGFjZU5hbWV9YCwgdW5kZWZpbmVkLCBhcHBtZXNoLklwUHJlZmVyZW5jZS5JUFY0X09OTFkpLFxuICBsaXN0ZW5lcnM6IFthcHBtZXNoLlZpcnR1YWxOb2RlTGlzdGVuZXIuaHR0cCh7XG4gICAgaGVhbHRoQ2hlY2s6IGFwcG1lc2guSGVhbHRoQ2hlY2suaHR0cCh7XG4gICAgICBoZWFsdGh5VGhyZXNob2xkOiAzLFxuICAgICAgcGF0aDogJy9jaGVjay1wYXRoJyxcbiAgICB9KSxcbiAgfSldLFxuICBiYWNrZW5kczogW2FwcG1lc2guQmFja2VuZC52aXJ0dWFsU2VydmljZSh2aXJ0dWFsU2VydmljZSldLFxufSk7XG5cbm5vZGUuYWRkQmFja2VuZChhcHBtZXNoLkJhY2tlbmQudmlydHVhbFNlcnZpY2UoXG4gIG5ldyBhcHBtZXNoLlZpcnR1YWxTZXJ2aWNlKHN0YWNrLCAnc2VydmljZS0yJywge1xuICAgIHZpcnR1YWxTZXJ2aWNlTmFtZTogJ3NlcnZpY2UyLmRvbWFpbi5sb2NhbCcsXG4gICAgdmlydHVhbFNlcnZpY2VQcm92aWRlcjogYXBwbWVzaC5WaXJ0dWFsU2VydmljZVByb3ZpZGVyLm5vbmUobWVzaCksXG4gIH0pLFxuKSk7XG5cbnJvdXRlci5hZGRSb3V0ZSgncm91dGUtMScsIHtcbiAgcm91dGVTcGVjOiBhcHBtZXNoLlJvdXRlU3BlYy5odHRwKHtcbiAgICB3ZWlnaHRlZFRhcmdldHM6IFtcbiAgICAgIHtcbiAgICAgICAgdmlydHVhbE5vZGU6IG5vZGUsXG4gICAgICAgIHdlaWdodDogNTAsXG4gICAgICB9LFxuICAgIF0sXG4gICAgbWF0Y2g6IHtcbiAgICAgIHBhdGg6IGFwcG1lc2guSHR0cFJvdXRlUGF0aE1hdGNoLnN0YXJ0c1dpdGgoJy8nKSxcbiAgICB9LFxuICAgIHRpbWVvdXQ6IHtcbiAgICAgIGlkbGU6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDEwKSxcbiAgICAgIHBlclJlcXVlc3Q6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDEwKSxcbiAgICB9LFxuICB9KSxcbn0pO1xuXG5jb25zdCBub2RlMiA9IG1lc2guYWRkVmlydHVhbE5vZGUoJ25vZGUyJywge1xuICBzZXJ2aWNlRGlzY292ZXJ5OiBhcHBtZXNoLlNlcnZpY2VEaXNjb3ZlcnkuZG5zKGBub2RlMi4ke25hbWVzcGFjZS5uYW1lc3BhY2VOYW1lfWApLFxuICBsaXN0ZW5lcnM6IFthcHBtZXNoLlZpcnR1YWxOb2RlTGlzdGVuZXIuaHR0cCh7XG4gICAgaGVhbHRoQ2hlY2s6IGFwcG1lc2guSGVhbHRoQ2hlY2suaHR0cCh7XG4gICAgICBoZWFsdGh5VGhyZXNob2xkOiAzLFxuICAgICAgaW50ZXJ2YWw6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDUpLFxuICAgICAgcGF0aDogJy9jaGVjay1wYXRoMicsXG4gICAgICB0aW1lb3V0OiBjZGsuRHVyYXRpb24uc2Vjb25kcygyKSxcbiAgICAgIHVuaGVhbHRoeVRocmVzaG9sZDogMixcbiAgICB9KSxcbiAgfSldLFxuICBiYWNrZW5kRGVmYXVsdHM6IHtcbiAgICB0bHNDbGllbnRQb2xpY3k6IHtcbiAgICAgIHZhbGlkYXRpb246IHtcbiAgICAgICAgdHJ1c3Q6IGFwcG1lc2guVGxzVmFsaWRhdGlvblRydXN0LmZpbGUoJ3BhdGgvdG8vY2VydCcpLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBiYWNrZW5kczogW2FwcG1lc2guQmFja2VuZC52aXJ0dWFsU2VydmljZShcbiAgICBuZXcgYXBwbWVzaC5WaXJ0dWFsU2VydmljZShzdGFjaywgJ3NlcnZpY2UtMycsIHtcbiAgICAgIHZpcnR1YWxTZXJ2aWNlTmFtZTogJ3NlcnZpY2UzLmRvbWFpbi5sb2NhbCcsXG4gICAgICB2aXJ0dWFsU2VydmljZVByb3ZpZGVyOiBhcHBtZXNoLlZpcnR1YWxTZXJ2aWNlUHJvdmlkZXIubm9uZShtZXNoKSxcbiAgICB9KSxcbiAgKV0sXG59KTtcblxuY29uc3Qgbm9kZTMgPSBtZXNoLmFkZFZpcnR1YWxOb2RlKCdub2RlMycsIHtcbiAgc2VydmljZURpc2NvdmVyeTogYXBwbWVzaC5TZXJ2aWNlRGlzY292ZXJ5LmRucyhgbm9kZTMuJHtuYW1lc3BhY2UubmFtZXNwYWNlTmFtZX1gKSxcbiAgbGlzdGVuZXJzOiBbYXBwbWVzaC5WaXJ0dWFsTm9kZUxpc3RlbmVyLmh0dHAoe1xuICAgIGhlYWx0aENoZWNrOiBhcHBtZXNoLkhlYWx0aENoZWNrLmh0dHAoe1xuICAgICAgaGVhbHRoeVRocmVzaG9sZDogMyxcbiAgICAgIGludGVydmFsOiBjZGsuRHVyYXRpb24uc2Vjb25kcyg1KSxcbiAgICAgIHBhdGg6ICcvY2hlY2stcGF0aDMnLFxuICAgICAgdGltZW91dDogY2RrLkR1cmF0aW9uLnNlY29uZHMoMiksXG4gICAgICB1bmhlYWx0aHlUaHJlc2hvbGQ6IDIsXG4gICAgfSksXG4gIH0pXSxcbiAgYmFja2VuZERlZmF1bHRzOiB7XG4gICAgdGxzQ2xpZW50UG9saWN5OiB7XG4gICAgICB2YWxpZGF0aW9uOiB7XG4gICAgICAgIHRydXN0OiBhcHBtZXNoLlRsc1ZhbGlkYXRpb25UcnVzdC5maWxlKCdwYXRoLXRvLWNlcnRpZmljYXRlJyksXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIGFjY2Vzc0xvZzogYXBwbWVzaC5BY2Nlc3NMb2cuZnJvbUZpbGVQYXRoKCcvZGV2L3N0ZG91dCcpLFxufSk7XG5cbmNvbnN0IG5vZGU0ID0gbWVzaC5hZGRWaXJ0dWFsTm9kZSgnbm9kZTQnLCB7XG4gIHNlcnZpY2VEaXNjb3Zlcnk6IGFwcG1lc2guU2VydmljZURpc2NvdmVyeS5kbnMoYG5vZGU0LiR7bmFtZXNwYWNlLm5hbWVzcGFjZU5hbWV9YCwgYXBwbWVzaC5EbnNSZXNwb25zZVR5cGUuRU5EUE9JTlRTKSxcbiAgbGlzdGVuZXJzOiBbYXBwbWVzaC5WaXJ0dWFsTm9kZUxpc3RlbmVyLmh0dHAoe1xuICAgIHRsczoge1xuICAgICAgbW9kZTogYXBwbWVzaC5UbHNNb2RlLlNUUklDVCxcbiAgICAgIGNlcnRpZmljYXRlOiBhcHBtZXNoLlRsc0NlcnRpZmljYXRlLnNkcygnc3BpZmZlOi8vZG9tYWluLmxvY2FsL2JhY2tlbmQtc2VydmljZScpLFxuICAgICAgbXV0dWFsVGxzVmFsaWRhdGlvbjoge1xuICAgICAgICB0cnVzdDogYXBwbWVzaC5UbHNWYWxpZGF0aW9uVHJ1c3Quc2RzKCdzcGlmZmU6Ly9kb21haW4ubG9jYWwnKSxcbiAgICAgICAgc3ViamVjdEFsdGVybmF0aXZlTmFtZXM6IGFwcG1lc2guU3ViamVjdEFsdGVybmF0aXZlTmFtZXMubWF0Y2hpbmdFeGFjdGx5KCdjbGllbnQuZG9tYWluLmxvY2FsJyksXG4gICAgICB9LFxuICAgIH0sXG4gICAgaGVhbHRoQ2hlY2s6IGFwcG1lc2guSGVhbHRoQ2hlY2suaHR0cCh7XG4gICAgICBoZWFsdGh5VGhyZXNob2xkOiAzLFxuICAgICAgaW50ZXJ2YWw6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDUpLFxuICAgICAgcGF0aDogJy9jaGVjay1wYXRoMycsXG4gICAgICB0aW1lb3V0OiBjZGsuRHVyYXRpb24uc2Vjb25kcygyKSxcbiAgICAgIHVuaGVhbHRoeVRocmVzaG9sZDogMixcbiAgICB9KSxcbiAgfSldLFxuICBiYWNrZW5kRGVmYXVsdHM6IHtcbiAgICB0bHNDbGllbnRQb2xpY3k6IHtcbiAgICAgIG11dHVhbFRsc0NlcnRpZmljYXRlOiBhcHBtZXNoLlRsc0NlcnRpZmljYXRlLmZpbGUoJ3BhdGgvdG8vY2VydENoYWluJywgJ3BhdGgvdG8vcHJpdmF0ZUtleScpLFxuICAgICAgdmFsaWRhdGlvbjoge1xuICAgICAgICBzdWJqZWN0QWx0ZXJuYXRpdmVOYW1lczogYXBwbWVzaC5TdWJqZWN0QWx0ZXJuYXRpdmVOYW1lcy5tYXRjaGluZ0V4YWN0bHkoJ215bWVzaC5sb2NhbCcpLFxuICAgICAgICB0cnVzdDogYXBwbWVzaC5UbHNWYWxpZGF0aW9uVHJ1c3QuZmlsZSgncGF0aC10by1jZXJ0aWZpY2F0ZScpLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBhY2Nlc3NMb2c6IGFwcG1lc2guQWNjZXNzTG9nLmZyb21GaWxlUGF0aCgnL2Rldi9zdGRvdXQnKSxcbn0pO1xuXG5ub2RlNC5hZGRCYWNrZW5kKGFwcG1lc2guQmFja2VuZC52aXJ0dWFsU2VydmljZShcbiAgbmV3IGFwcG1lc2guVmlydHVhbFNlcnZpY2Uoc3RhY2ssICdzZXJ2aWNlLTQnLCB7XG4gICAgdmlydHVhbFNlcnZpY2VOYW1lOiAnc2VydmljZTQuZG9tYWluLmxvY2FsJyxcbiAgICB2aXJ0dWFsU2VydmljZVByb3ZpZGVyOiBhcHBtZXNoLlZpcnR1YWxTZXJ2aWNlUHJvdmlkZXIubm9uZShtZXNoKSxcbiAgfSksXG4pKTtcblxucm91dGVyLmFkZFJvdXRlKCdyb3V0ZS0yJywge1xuICByb3V0ZVNwZWM6IGFwcG1lc2guUm91dGVTcGVjLmh0dHAoe1xuICAgIHdlaWdodGVkVGFyZ2V0czogW1xuICAgICAge1xuICAgICAgICB2aXJ0dWFsTm9kZTogbm9kZTIsXG4gICAgICAgIHdlaWdodDogMzAsXG4gICAgICB9LFxuICAgIF0sXG4gICAgbWF0Y2g6IHtcbiAgICAgIHBhdGg6IGFwcG1lc2guSHR0cFJvdXRlUGF0aE1hdGNoLnN0YXJ0c1dpdGgoJy9wYXRoMicpLFxuICAgIH0sXG4gICAgdGltZW91dDoge1xuICAgICAgaWRsZTogY2RrLkR1cmF0aW9uLnNlY29uZHMoMTEpLFxuICAgICAgcGVyUmVxdWVzdDogY2RrLkR1cmF0aW9uLnNlY29uZHMoMTEpLFxuICAgIH0sXG4gIH0pLFxufSk7XG5cbnJvdXRlci5hZGRSb3V0ZSgncm91dGUtMycsIHtcbiAgcm91dGVTcGVjOiBhcHBtZXNoLlJvdXRlU3BlYy50Y3Aoe1xuICAgIHdlaWdodGVkVGFyZ2V0czogW1xuICAgICAge1xuICAgICAgICB2aXJ0dWFsTm9kZTogbm9kZTMsXG4gICAgICAgIHdlaWdodDogMjAsXG4gICAgICB9LFxuICAgIF0sXG4gICAgdGltZW91dDoge1xuICAgICAgaWRsZTogY2RrLkR1cmF0aW9uLnNlY29uZHMoMTIpLFxuICAgIH0sXG4gIH0pLFxufSk7XG5cbnJvdXRlci5hZGRSb3V0ZSgncm91dGUtNCcsIHtcbiAgcm91dGVTcGVjOiBhcHBtZXNoLlJvdXRlU3BlYy5ncnBjKHtcbiAgICB3ZWlnaHRlZFRhcmdldHM6IFtcbiAgICAgIHtcbiAgICAgICAgdmlydHVhbE5vZGU6IG5vZGU0LFxuICAgICAgICB3ZWlnaHQ6IDIwLFxuICAgICAgfSxcbiAgICBdLFxuICAgIHRpbWVvdXQ6IHtcbiAgICAgIGlkbGU6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDEyKSxcbiAgICB9LFxuICAgIG1hdGNoOiB7XG4gICAgICBzZXJ2aWNlTmFtZTogJ3Rlc3QnLFxuICAgIH0sXG4gIH0pLFxufSk7XG5cbnJvdXRlci5hZGRSb3V0ZSgncm91dGUtbWF0Y2hpbmcnLCB7XG4gIHJvdXRlU3BlYzogYXBwbWVzaC5Sb3V0ZVNwZWMuaHR0cDIoe1xuICAgIHdlaWdodGVkVGFyZ2V0czogW3sgdmlydHVhbE5vZGU6IG5vZGUzIH1dLFxuICAgIG1hdGNoOiB7XG4gICAgICBwYXRoOiBhcHBtZXNoLkh0dHBSb3V0ZVBhdGhNYXRjaC5zdGFydHNXaXRoKCcvJyksXG4gICAgICBtZXRob2Q6IGFwcG1lc2guSHR0cFJvdXRlTWV0aG9kLlBPU1QsXG4gICAgICBwcm90b2NvbDogYXBwbWVzaC5IdHRwUm91dGVQcm90b2NvbC5IVFRQUyxcbiAgICAgIGhlYWRlcnM6IFtcbiAgICAgICAgYXBwbWVzaC5IZWFkZXJNYXRjaC52YWx1ZUlzKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpLFxuICAgICAgICBhcHBtZXNoLkhlYWRlck1hdGNoLnZhbHVlU3RhcnRzV2l0aCgnQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKSxcbiAgICAgICAgYXBwbWVzaC5IZWFkZXJNYXRjaC52YWx1ZUVuZHNXaXRoKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpLFxuICAgICAgICBhcHBtZXNoLkhlYWRlck1hdGNoLnZhbHVlTWF0Y2hlc1JlZ2V4KCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vLionKSxcbiAgICAgICAgYXBwbWVzaC5IZWFkZXJNYXRjaC52YWx1ZXNJc0luUmFuZ2UoJ0NvbnRlbnQtVHlwZScsIDEsIDUpLFxuICAgICAgICBhcHBtZXNoLkhlYWRlck1hdGNoLnZhbHVlSXNOb3QoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyksXG4gICAgICAgIGFwcG1lc2guSGVhZGVyTWF0Y2gudmFsdWVEb2VzTm90U3RhcnRXaXRoKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpLFxuICAgICAgICBhcHBtZXNoLkhlYWRlck1hdGNoLnZhbHVlRG9lc05vdEVuZFdpdGgoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyksXG4gICAgICAgIGFwcG1lc2guSGVhZGVyTWF0Y2gudmFsdWVEb2VzTm90TWF0Y2hSZWdleCgnQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uLy4qJyksXG4gICAgICAgIGFwcG1lc2guSGVhZGVyTWF0Y2gudmFsdWVzSXNOb3RJblJhbmdlKCdDb250ZW50LVR5cGUnLCAxLCA1KSxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSksXG59KTtcblxucm91dGVyLmFkZFJvdXRlKCdyb3V0ZS1odHRwMi1yZXRyeScsIHtcbiAgcm91dGVTcGVjOiBhcHBtZXNoLlJvdXRlU3BlYy5odHRwMih7XG4gICAgd2VpZ2h0ZWRUYXJnZXRzOiBbeyB2aXJ0dWFsTm9kZTogbm9kZTMgfV0sXG4gICAgcmV0cnlQb2xpY3k6IHtcbiAgICAgIGh0dHBSZXRyeUV2ZW50czogW2FwcG1lc2guSHR0cFJldHJ5RXZlbnQuQ0xJRU5UX0VSUk9SXSxcbiAgICAgIHRjcFJldHJ5RXZlbnRzOiBbYXBwbWVzaC5UY3BSZXRyeUV2ZW50LkNPTk5FQ1RJT05fRVJST1JdLFxuICAgICAgcmV0cnlBdHRlbXB0czogNSxcbiAgICAgIHJldHJ5VGltZW91dDogY2RrLkR1cmF0aW9uLnNlY29uZHMoMSksXG4gICAgfSxcbiAgfSksXG59KTtcblxucm91dGVyLmFkZFJvdXRlKCdyb3V0ZS01Jywge1xuICByb3V0ZVNwZWM6IGFwcG1lc2guUm91dGVTcGVjLmh0dHAyKHtcbiAgICBwcmlvcml0eTogMTAsXG4gICAgd2VpZ2h0ZWRUYXJnZXRzOiBbeyB2aXJ0dWFsTm9kZTogbm9kZTIgfV0sXG4gIH0pLFxufSk7XG5cbnJvdXRlci5hZGRSb3V0ZSgncm91dGUtZ3JwYy1yZXRyeScsIHtcbiAgcm91dGVTcGVjOiBhcHBtZXNoLlJvdXRlU3BlYy5ncnBjKHtcbiAgICB3ZWlnaHRlZFRhcmdldHM6IFt7IHZpcnR1YWxOb2RlOiBub2RlMyB9XSxcbiAgICBtYXRjaDogeyBzZXJ2aWNlTmFtZTogJ3NlcnZpY2VuYW1lJyB9LFxuICAgIHJldHJ5UG9saWN5OiB7XG4gICAgICBncnBjUmV0cnlFdmVudHM6IFthcHBtZXNoLkdycGNSZXRyeUV2ZW50LkRFQURMSU5FX0VYQ0VFREVEXSxcbiAgICAgIGh0dHBSZXRyeUV2ZW50czogW2FwcG1lc2guSHR0cFJldHJ5RXZlbnQuQ0xJRU5UX0VSUk9SXSxcbiAgICAgIHRjcFJldHJ5RXZlbnRzOiBbYXBwbWVzaC5UY3BSZXRyeUV2ZW50LkNPTk5FQ1RJT05fRVJST1JdLFxuICAgICAgcmV0cnlBdHRlbXB0czogNSxcbiAgICAgIHJldHJ5VGltZW91dDogY2RrLkR1cmF0aW9uLnNlY29uZHMoMSksXG4gICAgfSxcbiAgfSksXG59KTtcblxucm91dGVyLmFkZFJvdXRlKCdyb3V0ZS02Jywge1xuICByb3V0ZVNwZWM6IGFwcG1lc2guUm91dGVTcGVjLmh0dHAyKHtcbiAgICB3ZWlnaHRlZFRhcmdldHM6IFtcbiAgICAgIHtcbiAgICAgICAgdmlydHVhbE5vZGU6IG5vZGUyLFxuICAgICAgICB3ZWlnaHQ6IDMwLFxuICAgICAgfSxcbiAgICBdLFxuICAgIG1hdGNoOiB7XG4gICAgICBwYXRoOiBhcHBtZXNoLkh0dHBSb3V0ZVBhdGhNYXRjaC5yZWdleCgncmVnZXgnKSxcbiAgICAgIHF1ZXJ5UGFyYW1ldGVyczogW1xuICAgICAgICBhcHBtZXNoLlF1ZXJ5UGFyYW1ldGVyTWF0Y2gudmFsdWVJcygncXVlcnktZmllbGQnLCAndmFsdWUnKSxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSksXG59KTtcblxucm91dGVyLmFkZFJvdXRlKCdyb3V0ZS03Jywge1xuICByb3V0ZVNwZWM6IGFwcG1lc2guUm91dGVTcGVjLmdycGMoe1xuICAgIHdlaWdodGVkVGFyZ2V0czogW1xuICAgICAge1xuICAgICAgICB2aXJ0dWFsTm9kZTogbm9kZTQsXG4gICAgICAgIHdlaWdodDogMjAsXG4gICAgICB9LFxuICAgIF0sXG4gICAgbWF0Y2g6IHtcbiAgICAgIHNlcnZpY2VOYW1lOiAndGVzdC1zZXJ2aWNlJyxcbiAgICAgIG1ldGhvZE5hbWU6ICd0ZXN0LW1ldGhvZCcsXG4gICAgICBtZXRhZGF0YTogW1xuICAgICAgICBhcHBtZXNoLkhlYWRlck1hdGNoLnZhbHVlSXMoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyksXG4gICAgICBdLFxuICAgIH0sXG4gIH0pLFxufSk7XG5cbmNvbnN0IGdhdGV3YXkgPSBtZXNoLmFkZFZpcnR1YWxHYXRld2F5KCdnYXRld2F5MScsIHtcbiAgYWNjZXNzTG9nOiBhcHBtZXNoLkFjY2Vzc0xvZy5mcm9tRmlsZVBhdGgoJy9kZXYvc3Rkb3V0JyksXG4gIHZpcnR1YWxHYXRld2F5TmFtZTogJ2dhdGV3YXkxJyxcbn0pO1xuXG5uZXcgYXBwbWVzaC5WaXJ0dWFsR2F0ZXdheShzdGFjaywgJ2dhdGV3YXkyJywge1xuICBtZXNoOiBtZXNoLFxuICBsaXN0ZW5lcnM6IFthcHBtZXNoLlZpcnR1YWxHYXRld2F5TGlzdGVuZXIuaHR0cCh7XG4gICAgcG9ydDogNDQzLFxuICAgIGhlYWx0aENoZWNrOiBhcHBtZXNoLkhlYWx0aENoZWNrLmh0dHAoe1xuICAgICAgaW50ZXJ2YWw6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDEwKSxcbiAgICB9KSxcbiAgICB0bHM6IHtcbiAgICAgIG1vZGU6IGFwcG1lc2guVGxzTW9kZS5TVFJJQ1QsXG4gICAgICBjZXJ0aWZpY2F0ZTogYXBwbWVzaC5UbHNDZXJ0aWZpY2F0ZS5maWxlKCdwYXRoL3RvL2NlcnRDaGFpbicsICdwYXRoL3RvL3ByaXZhdGVLZXknKSxcbiAgICB9LFxuICB9KV0sXG59KTtcblxubmV3IGFwcG1lc2guVmlydHVhbEdhdGV3YXkoc3RhY2ssICdnYXRld2F5MycsIHtcbiAgbWVzaDogbWVzaCxcbiAgbGlzdGVuZXJzOiBbYXBwbWVzaC5WaXJ0dWFsR2F0ZXdheUxpc3RlbmVyLmh0dHAoe1xuICAgIHBvcnQ6IDQ0MyxcbiAgICBoZWFsdGhDaGVjazogYXBwbWVzaC5IZWFsdGhDaGVjay5odHRwKHtcbiAgICAgIGludGVydmFsOiBjZGsuRHVyYXRpb24uc2Vjb25kcygxMCksXG4gICAgfSksXG4gICAgdGxzOiB7XG4gICAgICBtb2RlOiBhcHBtZXNoLlRsc01vZGUuU1RSSUNULFxuICAgICAgY2VydGlmaWNhdGU6IGFwcG1lc2guVGxzQ2VydGlmaWNhdGUuc2RzKCdzZWNyZXRfY2VydGlmaWNhdGUnKSxcbiAgICAgIG11dHVhbFRsc1ZhbGlkYXRpb246IHtcbiAgICAgICAgdHJ1c3Q6IGFwcG1lc2guVGxzVmFsaWRhdGlvblRydXN0LmZpbGUoJ3BhdGgvdG8vY2VydENoYWluJyksXG4gICAgICB9LFxuICAgIH0sXG4gIH0pXSxcbiAgYmFja2VuZERlZmF1bHRzOiB7XG4gICAgdGxzQ2xpZW50UG9saWN5OiB7XG4gICAgICBtdXR1YWxUbHNDZXJ0aWZpY2F0ZTogYXBwbWVzaC5UbHNDZXJ0aWZpY2F0ZS5zZHMoJ3NlY3JldF92YWxpZGF0aW9uJyksXG4gICAgICB2YWxpZGF0aW9uOiB7XG4gICAgICAgIHRydXN0OiBhcHBtZXNoLlRsc1ZhbGlkYXRpb25UcnVzdC5maWxlKCdwYXRoL3RvL2NlcnRDaGFpbicpLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7XG5cbmdhdGV3YXkuYWRkR2F0ZXdheVJvdXRlKCdnYXRld2F5MS1yb3V0ZS1odHRwJywge1xuICByb3V0ZVNwZWM6IGFwcG1lc2guR2F0ZXdheVJvdXRlU3BlYy5odHRwKHtcbiAgICByb3V0ZVRhcmdldDogdmlydHVhbFNlcnZpY2UsXG4gIH0pLFxufSk7XG5cbmdhdGV3YXkuYWRkR2F0ZXdheVJvdXRlKCdnYXRld2F5MS1yb3V0ZS1odHRwLTInLCB7XG4gIHJvdXRlU3BlYzogYXBwbWVzaC5HYXRld2F5Um91dGVTcGVjLmh0dHAoe1xuICAgIHJvdXRlVGFyZ2V0OiB2aXJ0dWFsU2VydmljZSxcbiAgICBtYXRjaDoge1xuICAgICAgcGF0aDogYXBwbWVzaC5IdHRwR2F0ZXdheVJvdXRlUGF0aE1hdGNoLnN0YXJ0c1dpdGgoJy8nLCAnJyksXG4gICAgICBob3N0bmFtZTogYXBwbWVzaC5HYXRld2F5Um91dGVIb3N0bmFtZU1hdGNoLmV4YWN0bHkoJ2V4YW1wbGUuY29tJyksXG4gICAgICBtZXRob2Q6IGFwcG1lc2guSHR0cFJvdXRlTWV0aG9kLlBPU1QsXG4gICAgICBoZWFkZXJzOiBbXG4gICAgICAgIGFwcG1lc2guSGVhZGVyTWF0Y2gudmFsdWVJcygnQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKSxcbiAgICAgICAgYXBwbWVzaC5IZWFkZXJNYXRjaC52YWx1ZVN0YXJ0c1dpdGgoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyksXG4gICAgICAgIGFwcG1lc2guSGVhZGVyTWF0Y2gudmFsdWVFbmRzV2l0aCgnQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKSxcbiAgICAgICAgYXBwbWVzaC5IZWFkZXJNYXRjaC52YWx1ZU1hdGNoZXNSZWdleCgnQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uLy4qJyksXG4gICAgICAgIGFwcG1lc2guSGVhZGVyTWF0Y2gudmFsdWVzSXNJblJhbmdlKCdDb250ZW50LVR5cGUnLCAxLCA1KSxcbiAgICAgICAgYXBwbWVzaC5IZWFkZXJNYXRjaC52YWx1ZUlzTm90KCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpLFxuICAgICAgICBhcHBtZXNoLkhlYWRlck1hdGNoLnZhbHVlRG9lc05vdFN0YXJ0V2l0aCgnQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKSxcbiAgICAgICAgYXBwbWVzaC5IZWFkZXJNYXRjaC52YWx1ZURvZXNOb3RFbmRXaXRoKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpLFxuICAgICAgICBhcHBtZXNoLkhlYWRlck1hdGNoLnZhbHVlRG9lc05vdE1hdGNoUmVnZXgoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi8uKicpLFxuICAgICAgICBhcHBtZXNoLkhlYWRlck1hdGNoLnZhbHVlc0lzTm90SW5SYW5nZSgnQ29udGVudC1UeXBlJywgMSwgNSksXG4gICAgICBdLFxuICAgICAgcXVlcnlQYXJhbWV0ZXJzOiBbXG4gICAgICAgIGFwcG1lc2guUXVlcnlQYXJhbWV0ZXJNYXRjaC52YWx1ZUlzKCdxdWVyeS1maWVsZCcsICd2YWx1ZScpLFxuICAgICAgXSxcbiAgICAgIHJld3JpdGVSZXF1ZXN0SG9zdG5hbWU6IHRydWUsXG4gICAgfSxcbiAgfSksXG59KTtcblxuZ2F0ZXdheS5hZGRHYXRld2F5Um91dGUoJ2dhdGV3YXkxLXJvdXRlLWh0dHAyJywge1xuICByb3V0ZVNwZWM6IGFwcG1lc2guR2F0ZXdheVJvdXRlU3BlYy5odHRwMih7XG4gICAgcm91dGVUYXJnZXQ6IHZpcnR1YWxTZXJ2aWNlLFxuICB9KSxcbn0pO1xuXG5nYXRld2F5LmFkZEdhdGV3YXlSb3V0ZSgnZ2F0ZXdheTEtcm91dGUtaHR0cDItMicsIHtcbiAgcm91dGVTcGVjOiBhcHBtZXNoLkdhdGV3YXlSb3V0ZVNwZWMuaHR0cDIoe1xuICAgIHJvdXRlVGFyZ2V0OiB2aXJ0dWFsU2VydmljZSxcbiAgICBtYXRjaDoge1xuICAgICAgcGF0aDogYXBwbWVzaC5IdHRwR2F0ZXdheVJvdXRlUGF0aE1hdGNoLmV4YWN0bHkoJy9leGFjdCcsICcvcmV3cml0dGVucGF0aCcpLFxuICAgIH0sXG4gIH0pLFxufSk7XG5cbmdhdGV3YXkuYWRkR2F0ZXdheVJvdXRlKCdnYXRld2F5MS1yb3V0ZS1odHRwMi0zJywge1xuICByb3V0ZVNwZWM6IGFwcG1lc2guR2F0ZXdheVJvdXRlU3BlYy5odHRwMih7XG4gICAgcm91dGVUYXJnZXQ6IHZpcnR1YWxTZXJ2aWNlLFxuICAgIG1hdGNoOiB7XG4gICAgICBwYXRoOiBhcHBtZXNoLkh0dHBHYXRld2F5Um91dGVQYXRoTWF0Y2gucmVnZXgoJ3JlZ2V4JyksXG4gICAgfSxcbiAgfSksXG59KTtcblxuZ2F0ZXdheS5hZGRHYXRld2F5Um91dGUoJ2dhdGV3YXkxLXJvdXRlLWdycGMnLCB7XG4gIHJvdXRlU3BlYzogYXBwbWVzaC5HYXRld2F5Um91dGVTcGVjLmdycGMoe1xuICAgIHJvdXRlVGFyZ2V0OiB2aXJ0dWFsU2VydmljZSxcbiAgICBtYXRjaDoge1xuICAgICAgc2VydmljZU5hbWU6IHZpcnR1YWxTZXJ2aWNlLnZpcnR1YWxTZXJ2aWNlTmFtZSxcbiAgICB9LFxuICB9KSxcbn0pO1xuXG5nYXRld2F5LmFkZEdhdGV3YXlSb3V0ZSgnZ2F0ZXdheTEtcm91dGUtZ3JwYy0yJywge1xuICByb3V0ZVNwZWM6IGFwcG1lc2guR2F0ZXdheVJvdXRlU3BlYy5ncnBjKHtcbiAgICByb3V0ZVRhcmdldDogdmlydHVhbFNlcnZpY2UsXG4gICAgbWF0Y2g6IHtcbiAgICAgIGhvc3RuYW1lOiBhcHBtZXNoLkdhdGV3YXlSb3V0ZUhvc3RuYW1lTWF0Y2guZXhhY3RseSgnZXhhbXBsZS5jb20nKSxcbiAgICAgIG1ldGFkYXRhOiBbXG4gICAgICAgIGFwcG1lc2guSGVhZGVyTWF0Y2gudmFsdWVJcygnQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKSxcbiAgICAgICAgYXBwbWVzaC5IZWFkZXJNYXRjaC52YWx1ZUlzTm90KCdDb250ZW50LVR5cGUnLCAndGV4dC9odG1sJyksXG4gICAgICAgIGFwcG1lc2guSGVhZGVyTWF0Y2gudmFsdWVTdGFydHNXaXRoKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vJyksXG4gICAgICAgIGFwcG1lc2guSGVhZGVyTWF0Y2gudmFsdWVEb2VzTm90U3RhcnRXaXRoKCdDb250ZW50LVR5cGUnLCAndGV4dC8nKSxcbiAgICAgICAgYXBwbWVzaC5IZWFkZXJNYXRjaC52YWx1ZUVuZHNXaXRoKCdDb250ZW50LVR5cGUnLCAnL2pzb24nKSxcbiAgICAgICAgYXBwbWVzaC5IZWFkZXJNYXRjaC52YWx1ZURvZXNOb3RFbmRXaXRoKCdDb250ZW50LVR5cGUnLCAnL2pzb24rZm9vYmFyJyksXG4gICAgICAgIGFwcG1lc2guSGVhZGVyTWF0Y2gudmFsdWVNYXRjaGVzUmVnZXgoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi8uKicpLFxuICAgICAgICBhcHBtZXNoLkhlYWRlck1hdGNoLnZhbHVlRG9lc05vdE1hdGNoUmVnZXgoJ0NvbnRlbnQtVHlwZScsICd0ZXh0Ly4qJyksXG4gICAgICAgIGFwcG1lc2guSGVhZGVyTWF0Y2gudmFsdWVzSXNJblJhbmdlKCdNYXgtRm9yd2FyZCcsIDEsIDUpLFxuICAgICAgICBhcHBtZXNoLkhlYWRlck1hdGNoLnZhbHVlc0lzTm90SW5SYW5nZSgnTWF4LUZvcndhcmQnLCAxLCA1KSxcbiAgICAgIF0sXG4gICAgICByZXdyaXRlUmVxdWVzdEhvc3RuYW1lOiBmYWxzZSxcbiAgICB9LFxuICB9KSxcbn0pO1xuIl19