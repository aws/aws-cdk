## AWS App Mesh Construct Library
<!--BEGIN STABILITY BANNER-->

---

![Stability: Experimental](https://img.shields.io/badge/stability-Experimental-important.svg?style=for-the-badge)

> **This is a _developer preview_ (public beta) module. Releases might lack important features and might have
> future breaking changes.**
>
> This API is still under active development and subject to non-backward
> compatible changes or removal in any future version. Use of the API is not recommended in production
> environments. Experimental APIs are not subject to the Semantic Versioning model.

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

The `Mesh` needs `VirtualRouters` as logical units to route to `VirtualNodes`.

Virtual routers handle traffic for one or more virtual services within your mesh. After you create a virtual router, you can create and associate routes for your virtual router that direct incoming requests to different virtual nodes.

```typescript
const router = mesh.addVirtualRouter('router', {
  listener: {
    portMapping: {
      port: 8081,
      protocol: Protocol.HTTP,
    }
  }
});
```

The router can also be created using the constructor and passing in the mesh instead of calling the addVirtualRouter() method for the mesh.

```typescript
const mesh = new Mesh(stack, 'AppMesh', {
  meshName: 'myAwsmMesh',
  egressFilter: MeshFilterType.Allow_All,
});

const router = new VirtualRouter(stack, 'router', {
  mesh, // notice that mesh is a required property when creating a router with a new statement
  listener: {
    portMapping: {
      port: 8081,
      protocol: Protocol.HTTP,
    }
  }
});
```

The listener protocol can be either `HTTP` or `TCP`.

The same pattern applies to all constructs within the appmesh library, for any mesh.addXZY method, a new constuctor can also be used. This is particularly useful for cross stack resources are required. Where creating the `mesh` as part of an infrastructure stack and creating the `resources` such as `nodes` is more useful to keep in the application stack.

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

![Virtual node logical diagram](https://docs.aws.amazon.com/app-mesh/latest/userguide/images/virtual_node.png)

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
  dnsHostName: 'node-a',
  cloudMapService: service,
  listener: {
    portMapping: {
      port: 8081,
      protocol: Protocol.HTTP,
    },
    healthCheck: {
      healthyThreshold: 3,
      interval: Duration.seconds(5), // minimum
      path: `/health-check-path`,
      port: 8080,
      protocol: Protocol.HTTP,
      timeout: Duration.seconds(2), // minimum
      unhealthyThreshold: 2,
    },
  },
})
```

Create a `VirtualNode` with the the constructor and add tags.

```typescript
const node = new VirtualNode(this, 'node', {
  mesh,
  dnsHostName: 'node-1',
  cloudMapService: service,
  listener: {
    portMapping: {
      port: 8080,
      protocol: Protocol.HTTP,
    },
    healthCheck: {
      healthyThreshold: 3,
      interval: Duration.seconds(5), // min
      path: '/ping',
      port: 8080,
      protocol: Protocol.HTTP,
      timeout: Duration.seconds(2), // min
      unhealthyThreshold: 2,
    },
  },
});

cdk.Tag.add(node, 'Environment', 'Dev');
```

The listeners property can be left blank dded later with the `mesh.addListeners()` method. The `healthcheck` property is optional but if specifying a listener, the `portMappings` must contain at least one property.

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

Multiple routes may also be added at once to different applications or targets.

```typescript
ratingsRouter.addRoutes(
  ['route1', 'route2'],
  [
    {
      routeTargets: [
        {
          virtualNode,
          weight: 1,
        },
      ],
      prefix: `/path-to-app`,
      routeType: RouteType.HTTP,
    },
    {
      routeTargets: [
        {
          virtualNode: virtualNode2,
          weight: 1,
        },
      ],
      prefix: `/path-to-app2`,
      routeType: RouteType.HTTP,
    },
  ]
);
```

The number of `route ids` and `route targets` must match as each route needs to have a unique name per router.
