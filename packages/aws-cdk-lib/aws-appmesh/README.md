# AWS App Mesh Construct Library


AWS App Mesh is a service mesh based on the [Envoy](https://www.envoyproxy.io/) proxy that makes it easy to monitor and control microservices. App Mesh standardizes how your microservices communicate, giving you end-to-end visibility and helping to ensure high-availability for your applications.

App Mesh gives you consistent visibility and network traffic controls for every microservice in an application.

App Mesh supports microservice applications that use service discovery naming for their components. To use App Mesh, you must have an existing application running on AWS Fargate, Amazon ECS, Amazon EKS, Kubernetes on AWS, or Amazon EC2.

For further information on **AWS App Mesh**, visit the [AWS App Mesh Documentation](https://docs.aws.amazon.com/app-mesh/index.html).

## Create the App and Stack

```ts
const app = new cdk.App();
const stack = new cdk.Stack(app, 'stack');
```

## Creating the Mesh

A service mesh is a logical boundary for network traffic between the services that reside within it.

After you create your service mesh, you can create virtual services, virtual nodes, virtual routers, and routes to distribute traffic between the applications in your mesh.

The following example creates the `AppMesh` service mesh with the default egress filter of `DROP_ALL`. See [the AWS CloudFormation `EgressFilter` resource](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-mesh-egressfilter.html) for more info on egress filters.

```ts
const mesh = new appmesh.Mesh(this, 'AppMesh', {
  meshName: 'myAwsMesh',
});
```

The mesh can instead be created with the `ALLOW_ALL` egress filter by providing the `egressFilter` property.

```ts
const mesh = new appmesh.Mesh(this, 'AppMesh', {
  meshName: 'myAwsMesh',
  egressFilter: appmesh.MeshFilterType.ALLOW_ALL,
});
```

A mesh with an IP preference can be created by providing the property `serviceDiscovery` that specifes an `ipPreference`.

```ts
const mesh = new appmesh.Mesh(this, 'AppMesh', {
  meshName: 'myAwsMesh',
  serviceDiscovery: {
    ipPreference: appmesh.IpPreference.IPV4_ONLY,
  },
});
```

## Adding VirtualRouters

A _mesh_ uses  _virtual routers_ as logical units to route requests to _virtual nodes_.

Virtual routers handle traffic for one or more virtual services within your mesh.
After you create a virtual router, you can create and associate routes to your virtual router that direct incoming requests to different virtual nodes.

```ts
declare const mesh: appmesh.Mesh;
const router = mesh.addVirtualRouter('router', {
  listeners: [appmesh.VirtualRouterListener.http(8080)],
});
```

Note that creating the router using the `addVirtualRouter()` method places it in the same stack as the mesh
(which might be different from the current stack).
The router can also be created using the `VirtualRouter` constructor (passing in the mesh) instead of calling the `addVirtualRouter()` method.
This is particularly useful when splitting your resources between many stacks: for example, defining the mesh itself as part of an infrastructure stack, but defining the other resources, such as routers, in the application stack:

```ts
declare const infraStack: cdk.Stack;
declare const appStack: cdk.Stack;

const mesh = new appmesh.Mesh(infraStack, 'AppMesh', {
  meshName: 'myAwsMesh',
  egressFilter: appmesh.MeshFilterType.ALLOW_ALL,
});

// the VirtualRouter will belong to 'appStack',
// even though the Mesh belongs to 'infraStack'
const router = new appmesh.VirtualRouter(appStack, 'router', {
  mesh, // notice that mesh is a required property when creating a router with the 'new' statement
  listeners: [appmesh.VirtualRouterListener.http(8081)],
});
```

The same is true for other `add*()` methods in the App Mesh construct library.

The `VirtualRouterListener` class lets you define protocol-specific listeners.
The `http()`, `http2()`, `grpc()` and `tcp()` methods create listeners for the named protocols.
They accept a single parameter that defines the port to on which requests will be matched.
The port parameter defaults to 8080 if omitted.

## Adding a VirtualService

A _virtual service_ is an abstraction of a real service that is provided by a virtual node directly, or indirectly by means of a virtual router. Dependent services call your virtual service by its `virtualServiceName`, and those requests are routed to the virtual node or virtual router specified as the provider for the virtual service.

We recommend that you use the service discovery name of the real service that you're targeting (such as `my-service.default.svc.cluster.local`).

When creating a virtual service:

- If you want the virtual service to spread traffic across multiple virtual nodes, specify a virtual router.
- If you want the virtual service to reach a virtual node directly, without a virtual router, specify a virtual node.

Adding a virtual router as the provider:

```ts
declare const router: appmesh.VirtualRouter;

new appmesh.VirtualService(this, 'virtual-service', {
  virtualServiceName: 'my-service.default.svc.cluster.local', // optional
  virtualServiceProvider: appmesh.VirtualServiceProvider.virtualRouter(router),
});
```

Adding a virtual node as the provider:

```ts
declare const node: appmesh.VirtualNode;

new appmesh.VirtualService(this, 'virtual-service', {
  virtualServiceName: `my-service.default.svc.cluster.local`, // optional
  virtualServiceProvider: appmesh.VirtualServiceProvider.virtualNode(node),
});
```

## Adding a VirtualNode

A _virtual node_ acts as a logical pointer to a particular task group, such as an Amazon ECS service or a Kubernetes deployment.

When you create a virtual node, accept inbound traffic by specifying a *listener*. Outbound traffic that your virtual node expects to send should be specified as a *back end*.

The response metadata for your new virtual node contains the Amazon Resource Name (ARN) that is associated with the virtual node. Set this value (either the full ARN or the truncated resource name) as the `APPMESH_VIRTUAL_NODE_NAME` environment variable for your task group's Envoy proxy container in your task definition or pod spec. For example, the value could be `mesh/default/virtualNode/simpleapp`. This is then mapped to the `node.id` and `node.cluster` Envoy parameters.

> **Note**
> If you require your Envoy stats or tracing to use a different name, you can override the `node.cluster` value that is set by `APPMESH_VIRTUAL_NODE_NAME` with the `APPMESH_VIRTUAL_NODE_CLUSTER` environment variable.

```ts
const vpc = new ec2.Vpc(this, 'vpc');
const namespace = new cloudmap.PrivateDnsNamespace(this, 'test-namespace', {
    vpc,
    name: 'domain.local',
});
const service = namespace.createService('Svc');

declare const mesh: appmesh.Mesh;
const node = mesh.addVirtualNode('virtual-node', {
  serviceDiscovery: appmesh.ServiceDiscovery.cloudMap(service),
  listeners: [appmesh.VirtualNodeListener.http({
    port: 8081,
    healthCheck: appmesh.HealthCheck.http({
      healthyThreshold: 3,
      interval: Duration.seconds(5), // minimum
      path: '/health-check-path',
      timeout: Duration.seconds(2), // minimum
      unhealthyThreshold: 2,
    }),
  })],
  accessLog: appmesh.AccessLog.fromFilePath('/dev/stdout'),
});
```

Create a `VirtualNode` with the constructor and add tags.

```ts
declare const mesh: appmesh.Mesh;
declare const service: cloudmap.Service;

const node = new appmesh.VirtualNode(this, 'node', {
  mesh,
  serviceDiscovery: appmesh.ServiceDiscovery.cloudMap(service),
  listeners: [appmesh.VirtualNodeListener.http({
    port: 8080,
    healthCheck: appmesh.HealthCheck.http({
      healthyThreshold: 3,
      interval: Duration.seconds(5),
      path: '/ping',
      timeout: Duration.seconds(2),
      unhealthyThreshold: 2,
    }),
    timeout: {
      idle: Duration.seconds(5),
    },
  })],
  backendDefaults: {
    tlsClientPolicy: {
      validation: {
        trust: appmesh.TlsValidationTrust.file('/keys/local_cert_chain.pem'),
      },
    },
  },
  accessLog: appmesh.AccessLog.fromFilePath('/dev/stdout'),
});

cdk.Tags.of(node).add('Environment', 'Dev');
```

Create a `VirtualNode` with the customized access logging format.

```ts
declare const mesh: appmesh.Mesh;
declare const service: cloudmap.Service;
const node = new appmesh.VirtualNode(this, 'node', {
  mesh,
  serviceDiscovery: appmesh.ServiceDiscovery.cloudMap(service),
  listeners: [appmesh.VirtualNodeListener.http({
    port: 8080,
    healthCheck: appmesh.HealthCheck.http({
      healthyThreshold: 3,
      interval: cdk.Duration.seconds(5), 
      path: '/ping',
      timeout: cdk.Duration.seconds(2), 
      unhealthyThreshold: 2,
    }),
    timeout: {
      idle: cdk.Duration.seconds(5),
    },
  })],
  backendDefaults: {
    tlsClientPolicy: {
      validation: {
        trust: appmesh.TlsValidationTrust.file('/keys/local_cert_chain.pem'),
      },
    },
  },
  accessLog: appmesh.AccessLog.fromFilePath('/dev/stdout',
    appmesh.LoggingFormat.fromJson(
      {testKey1: 'testValue1', testKey2: 'testValue2'})),
});
```

By using a key-value pair indexed signature, you can specify json key pairs to customize the log entry pattern. You can also use text format as below. You can only specify one of these 2 formats.

```text
  accessLog: appmesh.AccessLog.fromFilePath('/dev/stdout', appmesh.LoggingFormat.fromText('test_pattern')),
```

For what values and operators you can use for these two formats, please visit the latest envoy documentation. (https://www.envoyproxy.io/docs/envoy/latest/configuration/observability/access_log/usage)
Create a `VirtualNode` with the constructor and add backend virtual service.

```ts
declare const mesh: appmesh.Mesh;
declare const router: appmesh.VirtualRouter;
declare const service: cloudmap.Service;

const node = new appmesh.VirtualNode(this, 'node', {
  mesh,
  serviceDiscovery: appmesh.ServiceDiscovery.cloudMap(service),
  listeners: [appmesh.VirtualNodeListener.http({
    port: 8080,
    healthCheck: appmesh.HealthCheck.http({
      healthyThreshold: 3,
      interval: Duration.seconds(5),
      path: '/ping',
      timeout: Duration.seconds(2),
      unhealthyThreshold: 2,
    }),
    timeout: {
      idle: Duration.seconds(5),
    },
  })],
  accessLog: appmesh.AccessLog.fromFilePath('/dev/stdout'),
});

const virtualService = new appmesh.VirtualService(this, 'service-1', {
  virtualServiceProvider: appmesh.VirtualServiceProvider.virtualRouter(router),
  virtualServiceName: 'service1.domain.local',
});

node.addBackend(appmesh.Backend.virtualService(virtualService));
```

The `listeners` property can be left blank and added later with the `node.addListener()` method. The `serviceDiscovery` property must be specified when specifying a listener.

The `backends` property can be added with `node.addBackend()`. In the example, we define a virtual service and add it to the virtual node to allow egress traffic to other nodes.

The `backendDefaults` property is added to the node while creating the virtual node. These are the virtual node's default settings for all backends.

The `VirtualNode.addBackend()` method is especially useful if you want to create a circular traffic flow by having a Virtual Service as a backend whose provider is that same Virtual Node:

```ts
declare const mesh: appmesh.Mesh;

const node = new appmesh.VirtualNode(this, 'node', {
  mesh,
  serviceDiscovery: appmesh.ServiceDiscovery.dns('node'),
});

const virtualService = new appmesh.VirtualService(this, 'service-1', {
  virtualServiceProvider: appmesh.VirtualServiceProvider.virtualNode(node),
  virtualServiceName: 'service1.domain.local',
});

node.addBackend(appmesh.Backend.virtualService(virtualService));
```

### Adding TLS to a listener

The `tls` property specifies TLS configuration when creating a listener for a virtual node or a virtual gateway.
Provide the TLS certificate to the proxy in one of the following ways:

- A certificate from AWS Certificate Manager (ACM).

- A customer-provided certificate (specify a `certificateChain` path file and a `privateKey` file path).

- A certificate provided by a Secrets Discovery Service (SDS) endpoint over local Unix Domain Socket (specify its `secretName`).

```ts
// A Virtual Node with listener TLS from an ACM provided certificate
declare const cert: certificatemanager.Certificate;
declare const mesh: appmesh.Mesh;

const node = new appmesh.VirtualNode(this, 'node', {
  mesh,
  serviceDiscovery: appmesh.ServiceDiscovery.dns('node'),
  listeners: [appmesh.VirtualNodeListener.grpc({
    port: 80,
    tls: {
      mode: appmesh.TlsMode.STRICT,
      certificate: appmesh.TlsCertificate.acm(cert),
    },
  })],
});

// A Virtual Gateway with listener TLS from a customer provided file certificate
const gateway = new appmesh.VirtualGateway(this, 'gateway', {
  mesh,
  listeners: [appmesh.VirtualGatewayListener.grpc({
    port: 8080,
    tls: {
      mode: appmesh.TlsMode.STRICT,
      certificate: appmesh.TlsCertificate.file('path/to/certChain', 'path/to/privateKey'),
    },
  })],
  virtualGatewayName: 'gateway',
});

// A Virtual Gateway with listener TLS from a SDS provided certificate
const gateway2 = new appmesh.VirtualGateway(this, 'gateway2', {
  mesh,
  listeners: [appmesh.VirtualGatewayListener.http2({
    port: 8080,
    tls: {
      mode: appmesh.TlsMode.STRICT,
      certificate: appmesh.TlsCertificate.sds('secrete_certificate'),
    },
  })],
  virtualGatewayName: 'gateway2',
});
```

### Adding mutual TLS authentication

Mutual TLS authentication is an optional component of TLS that offers two-way peer authentication.
To enable mutual TLS authentication, add the `mutualTlsCertificate` property to TLS client policy and/or the `mutualTlsValidation` property to your TLS listener.

`tls.mutualTlsValidation` and `tlsClientPolicy.mutualTlsCertificate` can be sourced from either:

- A customer-provided certificate (specify a `certificateChain` path file and a `privateKey` file path).

- A certificate provided by a Secrets Discovery Service (SDS) endpoint over local Unix Domain Socket (specify its `secretName`).

> **Note**
> Currently, a certificate from AWS Certificate Manager (ACM) cannot be used for mutual TLS authentication.

```ts
declare const mesh: appmesh.Mesh;

const node1 = new appmesh.VirtualNode(this, 'node1', {
  mesh,
  serviceDiscovery: appmesh.ServiceDiscovery.dns('node'),
  listeners: [appmesh.VirtualNodeListener.grpc({
    port: 80,
    tls: {
      mode: appmesh.TlsMode.STRICT,
      certificate: appmesh.TlsCertificate.file('path/to/certChain', 'path/to/privateKey'),
      // Validate a file client certificates to enable mutual TLS authentication when a client provides a certificate.
      mutualTlsValidation: {
        trust: appmesh.TlsValidationTrust.file('path-to-certificate'),
      },
    },
  })],
});

const certificateAuthorityArn = 'arn:aws:acm-pca:us-east-1:123456789012:certificate-authority/12345678-1234-1234-1234-123456789012';
const node2 = new appmesh.VirtualNode(this, 'node2', {
  mesh,
  serviceDiscovery: appmesh.ServiceDiscovery.dns('node2'),
  backendDefaults: {
    tlsClientPolicy: {
      ports: [8080, 8081],
      validation: {
        subjectAlternativeNames: appmesh.SubjectAlternativeNames.matchingExactly('mesh-endpoint.apps.local'),
        trust: appmesh.TlsValidationTrust.acm([
          acmpca.CertificateAuthority.fromCertificateAuthorityArn(this, 'certificate', certificateAuthorityArn)]),
      },
      // Provide a SDS client certificate when a server requests it and enable mutual TLS authentication.
      mutualTlsCertificate: appmesh.TlsCertificate.sds('secret_certificate'),
    },
  },
});
```

### Adding outlier detection to a Virtual Node listener

The `outlierDetection` property adds outlier detection to a Virtual Node listener. The properties
`baseEjectionDuration`, `interval`, `maxEjectionPercent`, and `maxServerErrors` are required.

```ts
// Cloud Map service discovery is currently required for host ejection by outlier detection
const vpc = new ec2.Vpc(this, 'vpc');
const namespace = new cloudmap.PrivateDnsNamespace(this, 'test-namespace', {
    vpc,
    name: 'domain.local',
});
const service = namespace.createService('Svc');

declare const mesh: appmesh.Mesh;
const node = mesh.addVirtualNode('virtual-node', {
  serviceDiscovery: appmesh.ServiceDiscovery.cloudMap(service),
  listeners: [appmesh.VirtualNodeListener.http({
    outlierDetection: {
      baseEjectionDuration: Duration.seconds(10),
      interval: Duration.seconds(30),
      maxEjectionPercent: 50,
      maxServerErrors: 5,
    },
  })],
});
```

### Adding a connection pool to a listener

The `connectionPool` property can be added to a Virtual Node listener or Virtual Gateway listener to add a request connection pool. Each listener protocol type has its own connection pool properties.

```ts
// A Virtual Node with a gRPC listener with a connection pool set
declare const mesh: appmesh.Mesh;
const node = new appmesh.VirtualNode(this, 'node', {
  mesh,
  // DNS service discovery can optionally specify the DNS response type as either LOAD_BALANCER or ENDPOINTS.
  // LOAD_BALANCER means that the DNS resolver returns a loadbalanced set of endpoints,
  // whereas ENDPOINTS means that the DNS resolver is returning all the endpoints.
  // By default, the response type is assumed to be LOAD_BALANCER
  serviceDiscovery: appmesh.ServiceDiscovery.dns('node', appmesh.DnsResponseType.ENDPOINTS),
  listeners: [appmesh.VirtualNodeListener.http({
    port: 80,
    connectionPool: {
      maxConnections: 100,
      maxPendingRequests: 10,
    },
  })],
});

// A Virtual Gateway with a gRPC listener with a connection pool set
const gateway = new appmesh.VirtualGateway(this, 'gateway', {
  mesh,
  listeners: [appmesh.VirtualGatewayListener.grpc({
    port: 8080,
    connectionPool: {
      maxRequests: 10,
    },
  })],
  virtualGatewayName: 'gateway',
});
```

### Adding an IP Preference to a Virtual Node

An `ipPreference` can be specified as part of a Virtual Node's service discovery. An IP preference defines how clients for this Virtual Node will interact with it.

There a four different IP preferences available to use which each specify what IP versions this Virtual Node will use and prefer.

- `IPv4_ONLY` - Only use IPv4. For CloudMap service discovery, only IPv4 addresses returned from CloudMap will be used. For DNS service discovery, Envoy's DNS resolver will only resolve DNS queries for IPv4.

- `IPv4_PREFERRED` - Prefer IPv4 and fall back to IPv6. For CloudMap service discovery, an IPv4 address will be used if returned from CloudMap. Otherwise, an IPv6 address will be used if available. For DNS service discovery, Envoy's DNS resolver will first attempt to resolve DNS queries using IPv4 and fall back to IPv6.

- `IPv6_ONLY` - Only use IPv6. For CloudMap service discovery, only IPv6 addresses returned from CloudMap will be used. For DNS service discovery, Envoy's DNS resolver will only resolve DNS queries for IPv6.

- `IPv6_PREFERRED` - Prefer IPv6 and fall back to IPv4. For CloudMap service discovery, an IPv6 address will be used if returned from CloudMap. Otherwise, an IPv4 address will be used if available. For DNS service discovery, Envoy's DNS resolver will first attempt to resolve DNS queries using IPv6 and fall back to IPv4.

```ts
const mesh = new appmesh.Mesh(this, 'mesh', {
  meshName: 'mesh-with-preference',
});

// Virtual Node with DNS service discovery and an IP preference
const dnsNode = new appmesh.VirtualNode(this, 'dns-node', {
  mesh,
  serviceDiscovery: appmesh.ServiceDiscovery.dns('test', appmesh.DnsResponseType.LOAD_BALANCER, appmesh.IpPreference.IPV4_ONLY),
});

// Virtual Node with CloudMap service discovery and an IP preference
const vpc = new ec2.Vpc(this, 'vpc');
const namespace = new cloudmap.PrivateDnsNamespace(this, 'test-namespace', {
  vpc,
  name: 'domain.local',
});
const service = namespace.createService('Svc');

const instanceAttribute : { [key: string]: string} = {};
instanceAttribute.testKey = 'testValue';

const cloudmapNode = new appmesh.VirtualNode(this, 'cloudmap-node', {
  mesh,
  serviceDiscovery: appmesh.ServiceDiscovery.cloudMap(service, instanceAttribute, appmesh.IpPreference.IPV4_ONLY),
});
```

## Adding a Route

A _route_ matches requests with an associated virtual router and distributes traffic to its associated virtual nodes.
The route distributes matching requests to one or more target virtual nodes with relative weighting.

The `RouteSpec` class lets you define protocol-specific route specifications.
The `tcp()`, `http()`, `http2()`, and `grpc()` methods create a specification for the named protocols.

For HTTP-based routes, the match field can match on path (prefix, exact, or regex), HTTP method, scheme,
HTTP headers, and query parameters. By default, HTTP-based routes match all requests.

For gRPC-based routes, the match field can  match on service name, method name, and metadata.
When specifying the method name, the service name must also be specified.

For example, here's how to add an HTTP route that matches based on a prefix of the URL path:

```ts
declare const router: appmesh.VirtualRouter;
declare const node: appmesh.VirtualNode;

router.addRoute('route-http', {
  routeSpec: appmesh.RouteSpec.http({
    weightedTargets: [
      {
        virtualNode: node,
      },
    ],
    match: {
      // Path that is passed to this method must start with '/'.
      path: appmesh.HttpRoutePathMatch.startsWith('/path-to-app'),
    },
  }),
});
```

Add an HTTP2 route that matches based on exact path, method, scheme, headers, and query parameters:

```ts
declare const router: appmesh.VirtualRouter;
declare const node: appmesh.VirtualNode;

router.addRoute('route-http2', {
  routeSpec: appmesh.RouteSpec.http2({
    weightedTargets: [
      {
        virtualNode: node,
      },
    ],
    match: {
      path: appmesh.HttpRoutePathMatch.exactly('/exact'),
      method: appmesh.HttpRouteMethod.POST,
      protocol: appmesh.HttpRouteProtocol.HTTPS,
      headers: [
        // All specified headers must match for the route to match.
        appmesh.HeaderMatch.valueIs('Content-Type', 'application/json'),
        appmesh.HeaderMatch.valueIsNot('Content-Type', 'application/json'),
      ],
      queryParameters: [
        // All specified query parameters must match for the route to match.
        appmesh.QueryParameterMatch.valueIs('query-field', 'value')
      ],
    },
  }),
});
```

Add a single route with two targets and split traffic 50/50:

```ts
declare const router: appmesh.VirtualRouter;
declare const node: appmesh.VirtualNode;

router.addRoute('route-http', {
  routeSpec: appmesh.RouteSpec.http({
    weightedTargets: [
      {
        virtualNode: node,
        weight: 50,
      },
      {
        virtualNode: node,
        weight: 50,
      },
    ],
    match: {
      path: appmesh.HttpRoutePathMatch.startsWith('/path-to-app'),
    },
  }),
});
```

Add an http2 route with retries:

```ts
declare const router: appmesh.VirtualRouter;
declare const node: appmesh.VirtualNode;

router.addRoute('route-http2-retry', {
  routeSpec: appmesh.RouteSpec.http2({
    weightedTargets: [{ virtualNode: node }],
    retryPolicy: {
      // Retry if the connection failed
      tcpRetryEvents: [appmesh.TcpRetryEvent.CONNECTION_ERROR],
      // Retry if HTTP responds with a gateway error (502, 503, 504)
      httpRetryEvents: [appmesh.HttpRetryEvent.GATEWAY_ERROR],
      // Retry five times
      retryAttempts: 5,
      // Use a 1 second timeout per retry
      retryTimeout: Duration.seconds(1),
    },
  }),
});
```

Add a gRPC route with retries:

```ts
declare const router: appmesh.VirtualRouter;
declare const node: appmesh.VirtualNode;

router.addRoute('route-grpc-retry', {
  routeSpec: appmesh.RouteSpec.grpc({
    weightedTargets: [{ virtualNode: node }],
    match: { serviceName: 'servicename' },
    retryPolicy: {
      tcpRetryEvents: [appmesh.TcpRetryEvent.CONNECTION_ERROR],
      httpRetryEvents: [appmesh.HttpRetryEvent.GATEWAY_ERROR],
      // Retry if gRPC responds that the request was cancelled, a resource
      // was exhausted, or if the service is unavailable
      grpcRetryEvents: [
        appmesh.GrpcRetryEvent.CANCELLED,
        appmesh.GrpcRetryEvent.RESOURCE_EXHAUSTED,
        appmesh.GrpcRetryEvent.UNAVAILABLE,
      ],
      retryAttempts: 5,
      retryTimeout: Duration.seconds(1),
    },
  }),
});
```

Add an gRPC route that matches based on method name and metadata:

```ts
declare const router: appmesh.VirtualRouter;
declare const node: appmesh.VirtualNode;

router.addRoute('route-grpc-retry', {
  routeSpec: appmesh.RouteSpec.grpc({
    weightedTargets: [{ virtualNode: node }],
    match: {
      // When method name is specified, service name must be also specified.
      methodName: 'methodname',
      serviceName: 'servicename',
      metadata: [
        // All specified metadata must match for the route to match.
        appmesh.HeaderMatch.valueStartsWith('Content-Type', 'application/'),
        appmesh.HeaderMatch.valueDoesNotStartWith('Content-Type', 'text/'),
      ],
    },
  }),
});
```

Add a gRPC route that matches based on port:

```ts
declare const router: appmesh.VirtualRouter;
declare const node: appmesh.VirtualNode;

router.addRoute('route-grpc-port', {
  routeSpec: appmesh.RouteSpec.grpc({
    weightedTargets: [
      {
        virtualNode: node,
      },
    ],
    match: {
      port: 1234,
    },
  }),
});
```

Add a gRPC route with timeout:

```ts
declare const router: appmesh.VirtualRouter;
declare const node: appmesh.VirtualNode;

router.addRoute('route-http', {
  routeSpec: appmesh.RouteSpec.grpc({
    weightedTargets: [
      {
        virtualNode: node,
      },
    ],
    match: {
      serviceName: 'my-service.default.svc.cluster.local',
    },
    timeout:  {
      idle : Duration.seconds(2),
      perRequest: Duration.seconds(1),
    },
  }),
});
```

## Adding a Virtual Gateway

A _virtual gateway_ allows resources outside your mesh to communicate with resources inside your mesh.
The virtual gateway represents an Envoy proxy running in an Amazon ECS task, in a Kubernetes service, or on an Amazon EC2 instance.
Unlike a virtual node, which represents Envoy running with an application, a virtual gateway represents Envoy deployed by itself.

A virtual gateway is similar to a virtual node in that it has a listener that accepts traffic for a particular port and protocol (HTTP, HTTP2, gRPC).
Traffic received by the virtual gateway is directed to other services in your mesh
using rules defined in gateway routes which can be added to your virtual gateway.

Create a virtual gateway with the constructor:

```ts
declare const mesh: appmesh.Mesh;
const certificateAuthorityArn = 'arn:aws:acm-pca:us-east-1:123456789012:certificate-authority/12345678-1234-1234-1234-123456789012';

const gateway = new appmesh.VirtualGateway(this, 'gateway', {
  mesh: mesh,
  listeners: [appmesh.VirtualGatewayListener.http({
    port: 443,
    healthCheck: appmesh.HealthCheck.http({
      interval: Duration.seconds(10),
    }),
  })],
  backendDefaults: {
    tlsClientPolicy: {
      ports: [8080, 8081],
      validation: {
        trust: appmesh.TlsValidationTrust.acm([
          acmpca.CertificateAuthority.fromCertificateAuthorityArn(this, 'certificate', certificateAuthorityArn)]),
      },
    },
  },
  accessLog: appmesh.AccessLog.fromFilePath('/dev/stdout'),
  virtualGatewayName: 'virtualGateway',
});
```

Add a virtual gateway directly to the mesh:

```ts
declare const mesh: appmesh.Mesh;

const gateway = mesh.addVirtualGateway('gateway', {
  accessLog: appmesh.AccessLog.fromFilePath('/dev/stdout'),
  virtualGatewayName: 'virtualGateway',
    listeners: [appmesh.VirtualGatewayListener.http({
      port: 443,
      healthCheck: appmesh.HealthCheck.http({
        interval: Duration.seconds(10),
      }),
  })],
});
```

The `listeners` field defaults to an HTTP Listener on port 8080 if omitted.
A gateway route can be added using the `gateway.addGatewayRoute()` method.

The `backendDefaults` property, provided when creating the virtual gateway, specifies the virtual gateway's default settings for all backends.

## Adding a Gateway Route

A _gateway route_ is attached to a virtual gateway and routes matching traffic to an existing virtual service.

For HTTP-based gateway routes, the `match` field can be used to match on
path (prefix, exact, or regex), HTTP method, host name, HTTP headers, and query parameters.
By default, HTTP-based gateway routes match all requests.

```ts
declare const gateway: appmesh.VirtualGateway;
declare const virtualService: appmesh.VirtualService;

gateway.addGatewayRoute('gateway-route-http', {
  routeSpec: appmesh.GatewayRouteSpec.http({
    routeTarget: virtualService,
    match: {
      path: appmesh.HttpGatewayRoutePathMatch.regex('regex'),
    },
  }),
});
```

For gRPC-based gateway routes, the `match` field can be used to match on service name, host name, port and metadata.

```ts
declare const gateway: appmesh.VirtualGateway;
declare const virtualService: appmesh.VirtualService;

gateway.addGatewayRoute('gateway-route-grpc', {
  routeSpec: appmesh.GatewayRouteSpec.grpc({
    routeTarget: virtualService,
    match: {
      hostname: appmesh.GatewayRouteHostnameMatch.endsWith('.example.com'),
    },
  }),
});
```

For HTTP based gateway routes, App Mesh automatically rewrites the matched prefix path in Gateway Route to “/”.
This automatic rewrite configuration can be overwritten in following ways:

```ts
declare const gateway: appmesh.VirtualGateway;
declare const virtualService: appmesh.VirtualService;

gateway.addGatewayRoute('gateway-route-http', {
  routeSpec: appmesh.GatewayRouteSpec.http({
    routeTarget: virtualService,
    match: {
      // This disables the default rewrite to '/', and retains original path.
      path: appmesh.HttpGatewayRoutePathMatch.startsWith('/path-to-app/', ''),
    },
  }),
});

gateway.addGatewayRoute('gateway-route-http-1', {
  routeSpec: appmesh.GatewayRouteSpec.http({
    routeTarget: virtualService,
    match: {
      // If the request full path is '/path-to-app/xxxxx', this rewrites the path to '/rewrittenUri/xxxxx'.
      // Please note both `prefixPathMatch` and `rewriteTo` must start and end with the `/` character.
      path: appmesh.HttpGatewayRoutePathMatch.startsWith('/path-to-app/', '/rewrittenUri/'),
    },
  }),
});
```

If matching other path (exact or regex), only specific rewrite path can be specified.
Unlike `startsWith()` method above, no default rewrite is performed.

```ts
declare const gateway: appmesh.VirtualGateway;
declare const virtualService: appmesh.VirtualService;

gateway.addGatewayRoute('gateway-route-http-2', {
  routeSpec: appmesh.GatewayRouteSpec.http({
    routeTarget: virtualService,
    match: {
      // This rewrites the path from '/test' to '/rewrittenPath'.
      path: appmesh.HttpGatewayRoutePathMatch.exactly('/test', '/rewrittenPath'),
    },
  }),
});
```

For HTTP/gRPC based routes, App Mesh automatically rewrites
the original request received at the Virtual Gateway to the destination Virtual Service name.
This default host name rewrite can be configured by specifying the rewrite rule as one of the `match` property:

```ts
declare const gateway: appmesh.VirtualGateway;
declare const virtualService: appmesh.VirtualService;

gateway.addGatewayRoute('gateway-route-grpc', {
  routeSpec: appmesh.GatewayRouteSpec.grpc({
    routeTarget: virtualService,
    match: {
      hostname: appmesh.GatewayRouteHostnameMatch.exactly('example.com'),
      // This disables the default rewrite to virtual service name and retain original request.
      rewriteRequestHostname: false,
    },
  }),
});
```

## Importing Resources

Each App Mesh resource class comes with two static methods, `from<Resource>Arn` and `from<Resource>Attributes` (where `<Resource>` is replaced with the resource name, such as `VirtualNode`) for importing a reference to an existing App Mesh resource.
These imported resources can be used with other resources in your mesh as if they were defined directly in your CDK application.

```ts
const arn = 'arn:aws:appmesh:us-east-1:123456789012:mesh/testMesh/virtualNode/testNode';
appmesh.VirtualNode.fromVirtualNodeArn(this, 'importedVirtualNode', arn);
```

```ts
const virtualNodeName = 'my-virtual-node';
appmesh.VirtualNode.fromVirtualNodeAttributes(this, 'imported-virtual-node', {
  mesh: appmesh.Mesh.fromMeshName(this, 'Mesh', 'testMesh'),
  virtualNodeName: virtualNodeName,
});
```

To import a mesh, again there are two static methods, `fromMeshArn` and `fromMeshName`.

```ts
const arn = 'arn:aws:appmesh:us-east-1:123456789012:mesh/testMesh';
appmesh.Mesh.fromMeshArn(this, 'imported-mesh', arn);
```

```ts
appmesh.Mesh.fromMeshName(this, 'imported-mesh', 'abc');
```

## IAM Grants

`VirtualNode` and `VirtualGateway` provide `grantStreamAggregatedResources` methods that grant identities that are running
Envoy access to stream generated config from App Mesh.

```ts
declare const mesh: appmesh.Mesh;
const gateway = new appmesh.VirtualGateway(this, 'testGateway', { mesh });
const envoyUser = new iam.User(this, 'envoyUser');

/**
 * This will grant `grantStreamAggregatedResources` ONLY for this gateway.
 */
gateway.grantStreamAggregatedResources(envoyUser)
```

## Adding Resources to shared meshes

A shared mesh allows resources created by different accounts to communicate with each other in the same mesh:

```ts
// This is the ARN for the mesh from different AWS IAM account ID.
// Ensure mesh is properly shared with your account. For more details, see: https://github.com/aws/aws-cdk/issues/15404
const arn = 'arn:aws:appmesh:us-east-1:123456789012:mesh/testMesh';
const sharedMesh = appmesh.Mesh.fromMeshArn(this, 'imported-mesh', arn);

// This VirtualNode resource can communicate with the resources in the mesh from different AWS IAM account ID.
new appmesh.VirtualNode(this, 'test-node', {
  mesh: sharedMesh,
});
```
