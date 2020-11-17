## AWS App Mesh Construct Library
<!--BEGIN STABILITY BANNER-->
---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib)) are always stable and safe to use.

![cdk-constructs: Developer Preview](https://img.shields.io/badge/cdk--constructs-developer--preview-informational.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are in **developer preview** before they become stable. We will only make breaking changes to address unforeseen API issues. Therefore, these APIs are not subject to [Semantic Versioning](https://semver.org/), and breaking changes will be announced in release notes. This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---
<!--END STABILITY BANNER-->

AWS App Mesh is a service mesh based on the [Envoy](https://www.envoyproxy.io/) proxy that makes it easy to monitor and control microservices. App Mesh standardizes how your microservices communicate, giving you end-to-end visibility and helping to ensure high-availability for your applications.

App Mesh gives you consistent visibility and network traffic controls for every microservice in an application.

App Mesh supports microservice applications that use service discovery naming for their components. To use App Mesh, you must have an existing application running on AWS Fargate, Amazon ECS, Amazon EKS, Kubernetes on AWS, or Amazon EC2.

For futher information on **AWS AppMesh** visit the [AWS Docs for AppMesh](https://docs.aws.amazon.com/app-mesh/index.html).

## Create the App and Stack

```typescript
const app = new cdk.App();
const stack = new cdk.Stack(app, 'stack');
```

## Creating the Mesh

A service mesh is a logical boundary for network traffic between the services that reside within it.

After you create your service mesh, you can create virtual services, virtual nodes, virtual routers, and routes to distribute traffic between the applications in your mesh.

The following example creates the `AppMesh` service mesh with the default filter of `DROP_ALL`, see [docs](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-mesh-egressfilter.html) here for more info on egress filters.

```typescript
const mesh = new Mesh(stack, 'AppMesh', {
  meshName: 'myAwsmMesh',
});
```

The mesh can also be created with the "ALLOW_ALL" egress filter by overwritting the property.

```typescript
const mesh = new Mesh(stack, 'AppMesh', {
  meshName: 'myAwsmMesh',
  egressFilter: MeshFilterType.ALLOW_ALL,
});
```

## Adding VirtualRouters

The _Mesh_ needs _VirtualRouters_ as logical units to route requests to _VirtualNodes_.

Virtual routers handle traffic for one or more virtual services within your mesh.
After you create a virtual router, you can create and associate routes to your virtual router that direct incoming requests to different virtual nodes.

```typescript
const router = mesh.addVirtualRouter('router', {
  listeners: [ appmesh.VirtualRouterListener.http(8080) ],
});
```

The router can also be created using the constructor and passing in the mesh instead of calling the `addVirtualRouter()` method for the mesh.
The same pattern applies to all constructs within the appmesh library, for any mesh.addXZY method, a new constuctor can also be used.
This is particularly useful for cross stack resources are required.
Where creating the `mesh` as part of an infrastructure stack and creating the `resources` such as `nodes` is more useful to keep in the application stack.

```typescript
const mesh = new Mesh(stack, 'AppMesh', {
  meshName: 'myAwsmMesh',
  egressFilter: MeshFilterType.Allow_All,
});

const router = new VirtualRouter(stack, 'router', {
  mesh, // notice that mesh is a required property when creating a router with a new statement
  listeners: [ appmesh.VirtualRouterListener.http(8081) ]
  }
});
```

The _VirtualRouterListener_ class provides an easy interface for defining new protocol specific listeners.
The `http()`, `http2()`, `grpc()` and `tcp()` methods are available for use.
They accept a single port parameter, that is used to define what port to match requests on.
The port parameter can be omitted, and it will default to port 8080.

## Adding VirtualService

A virtual service is an abstraction of a real service that is provided by a virtual node directly or indirectly by means of a virtual router. Dependent services call your virtual service by its virtualServiceName, and those requests are routed to the virtual node or virtual router that is specified as the provider for the virtual service.

We recommend that you use the service discovery name of the real service that you're targeting (such as `my-service.default.svc.cluster.local`).

When creating a virtual service:

- If you want the virtual service to spread traffic across multiple virtual nodes, specify a Virtual router.
- If you want the virtual service to reach a virtual node directly, without a virtual router, specify a Virtual node.

Adding a virtual router as the provider:

```typescript
mesh.addVirtualService('virtual-service', {
  virtualRouter: router,
  virtualServiceName: 'my-service.default.svc.cluster.local',
});
```

Adding a virtual node as the provider:

```typescript
mesh.addVirtualService('virtual-service', {
  virtualNode: node,
  virtualServiceName: `my-service.default.svc.cluster.local`,
});
```

**Note** that only one must of `virtualNode` or `virtualRouter` must be chosen.

## Adding a VirtualNode

A `virtual node` acts as a logical pointer to a particular task group, such as an Amazon ECS service or a Kubernetes deployment.

When you create a `virtual node`, you must specify the DNS service discovery hostname for your task group. Any inbound traffic that your `virtual node` expects should be specified as a listener. Any outbound traffic that your `virtual node` expects to reach should be specified as a backend.

The response metadata for your new `virtual node` contains the Amazon Resource Name (ARN) that is associated with the `virtual node`. Set this value (either the full ARN or the truncated resource name) as the APPMESH_VIRTUAL_NODE_NAME environment variable for your task group's Envoy proxy container in your task definition or pod spec. For example, the value could be mesh/default/virtualNode/simpleapp. This is then mapped to the node.id and node.cluster Envoy parameters.

> Note
> If you require your Envoy stats or tracing to use a different name, you can override the node.cluster value that is set by APPMESH_VIRTUAL_NODE_NAME with the APPMESH_VIRTUAL_NODE_CLUSTER environment variable.

```typescript
const vpc = new ec2.Vpc(stack, 'vpc');
const namespace = new servicediscovery.PrivateDnsNamespace(this, 'test-namespace', {
    vpc,
    name: 'domain.local',
});
const service = namespace.createService('Svc');

const node = mesh.addVirtualNode('virtual-node', {
  cloudMapService: service,
  listeners: [appmesh.VirtualNodeListener.httpNodeListener({
    port: 8081,
    healthCheck: {
      healthyThreshold: 3,
      interval: Duration.seconds(5), // minimum
      path: `/health-check-path`,
      port: 8080,
      protocol: Protocol.HTTP,
      timeout: Duration.seconds(2), // minimum
      unhealthyThreshold: 2,
    },
  })],
  accessLog: appmesh.AccessLog.fromFilePath('/dev/stdout'),
});
```

Create a `VirtualNode` with the the constructor and add tags.

```typescript
const node = new VirtualNode(this, 'node', {
  mesh,
  cloudMapService: service,
  listeners: [appmesh.VirtualNodeListener.httpNodeListener({
    port: 8080,
    healthCheck: {
      healthyThreshold: 3,
      interval: Duration.seconds(5), // min
      path: '/ping',
      port: 8080,
      protocol: Protocol.HTTP,
      timeout: Duration.seconds(2), // min
      unhealthyThreshold: 2,
    }, 
    timeout: {
      idle: cdk.Duration.seconds(5),
    },
  })],
  accessLog: appmesh.AccessLog.fromFilePath('/dev/stdout'),
});

cdk.Tag.add(node, 'Environment', 'Dev');
```

The `listeners` property can be left blank and added later with the `node.addListener()` method. The `healthcheck` and `timeout` properties are optional but if specifying a listener, the `port` must be added.

## Adding a Route

A `route` is associated with a virtual router, and it's used to match requests for a virtual router and distribute traffic accordingly to its associated virtual nodes.

You can use the prefix parameter in your `route` specification for path-based routing of requests. For example, if your virtual service name is my-service.local and you want the `route` to match requests to my-service.local/metrics, your prefix should be /metrics.

If your `route` matches a request, you can distribute traffic to one or more target virtual nodes with relative weighting.

```typescript
router.addRoute('route', {
  routeTargets: [
    {
      virtualNode,
      weight: 1,
    },
  ],
  prefix: `/path-to-app`,
  routeType: RouteType.HTTP,
});
```

Add a single route with multiple targets and split traffic 50/50

```typescript
router.addRoute('route', {
  routeTargets: [
    {
      virtualNode,
      weight: 50,
    },
    {
      virtualNode2,
      weight: 50,
    },
  ],
  prefix: `/path-to-app`,
  routeType: RouteType.HTTP,
});
```

## Adding a Virtual Gateway

A _virtual gateway_ allows resources outside your mesh to communicate to resources that are inside your mesh.
The virtual gateway represents an Envoy proxy running in an Amazon ECS task, in a Kubernetes service, or on an Amazon EC2 instance.
Unlike a virtual node, which represents an Envoy running with an application, a virtual gateway represents Envoy deployed by itself.

A virtual gateway is similar to a virtual node in that it has a listener that accepts traffic for a particular port and protocol (HTTP, HTTP2, GRPC).
The traffic that the virtual gateway receives, is directed to other services in your mesh,
using rules defined in gateway routes which can be added to your virtual gateway.

Create a virtual gateway with the constructor:

```typescript
const gateway = new appmesh.VirtualGateway(stack, 'gateway', {
  mesh: mesh,
  listeners: [appmesh.VirtualGatewayListener.httpGatewayListener({
    port: 443,
    healthCheck: {
      interval: cdk.Duration.seconds(10),
    },
  })],
  accessLog: appmesh.AccessLog.fromFilePath('/dev/stdout'),
  virtualGatewayName: 'virtualGateway',
});
```

Add a virtual gateway directly to the mesh:

```typescript
const gateway = mesh.addVirtualGateway('gateway', {
  accessLog: appmesh.AccessLog.fromFilePath('/dev/stdout'),
  virtualGatewayName: 'virtualGateway',
    listeners: [appmesh.VirtualGatewayListener.httpGatewayListener({
      port: 443,
      healthCheck: {
        interval: cdk.Duration.seconds(10),
      },
  })],
});
```

The listeners field can be omitted which will default to an HTTP Listener on port 8080.
A gateway route can be added using the `gateway.addGatewayRoute()` method.

## Adding a Gateway Route

A _gateway route_ is attached to a virtual gateway and routes traffic to an existing virtual service.
If a route matches a request, it can distribute traffic to a target virtual service.

For HTTP based routes, the match field can be used to match on a route prefix.
By default, an HTTP based route will match on `/`. All matches must start with a leading `/`.

```typescript
gateway.addGatewayRoute('gateway-route-http', {
  routeSpec: appmesh.GatewayRouteSpec.httpRouteSpec({
    routeTarget: virtualService,
    match: {
      prefixMatch: '/',
    },
  }),
});
```

For GRPC based routes, the match field can be used to match on service names.
You cannot omit the field, and must specify a match for these routes.

```typescript
gateway.addGatewayRoute('gateway-route-grpc', {
  routeSpec: appmesh.GatewayRouteSpec.grpcRouteSpec({
    routeTarget: virtualService,
    match: {
      serviceName: 'my-service.default.svc.cluster.local',
    },
  }),
});
```

## Importing Resources

Each mesh resource comes with two static methods for importing a reference to an existing App Mesh resource.
These imported resources can be used as references for other resources in your mesh.
There are two static methods, `from<Resource>Arn` and `from<Resource>Attributes` where the `<Resource>` is replaced with the resource name.

```typescript
const arn = "arn:aws:appmesh:us-east-1:123456789012:mesh/testMesh/virtualNode/testNode";
appmesh.VirtualNode.fromVirtualNodeArn(stack, 'importedVirtualNode', arn);
```

```typescript
appmesh.VirtualNode.fromVirtualNodeAttributes(stack, 'imported-virtual-node', {
  mesh: appmesh.Mesh.fromMeshName(stack, 'Mesh', 'testMesh'),
  virtualNodeName: virtualNodeName,
});
```

To import a mesh, there are two static methods, `fromMeshArn` and `fromMeshName`.

```typescript
const arn = 'arn:aws:appmesh:us-east-1:123456789012:mesh/testMesh';
appmesh.Mesh.fromMeshArn(stack, 'imported-mesh', arn);
```

```typescript
appmesh.Mesh.fromMeshName(stack, 'imported-mesh', 'abc');
```
