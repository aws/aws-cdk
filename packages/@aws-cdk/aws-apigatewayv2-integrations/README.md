## AWS APIGatewayv2 Integrations
<!--BEGIN STABILITY BANNER-->
---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development. They are subject to non-backward compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be announced in the release notes. This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---
<!--END STABILITY BANNER-->

## Table of Contents

- [Introduction](#introduction)
- [Private Integration](#private-integration)

## Introduction

Integrations connect a route to backend resources. HTTP APIs support Lambda proxy, AWS service, and HTTP proxy integrations. HTTP proxy integrations are also known as private integrations.

Currently the following integrations are supported by this construct library.

## Private Integration

Private integrations enable integrating an HTTP API route with private resources in a VPC, such as Application Load Balancers or
Amazon ECS container-based applications.  Using private integrations, resources in a VPC can be exposed for access by
clients outside of the VPC.

The following integrations are supported for private resources in a VPC.

### Application Load Balancer

The following code is a basic application load balancer private integration of HTTP API:

```ts
const vpc = new ec2.Vpc(stack, 'VPC');
const lb = new elbv2.ALB(stack, 'lb', { vpc });
const listener = lb.addListener('listener', { port: 80 });
listener.addTargets('target', {
  port: 80,
});

const httpEndpoint = new HttpApi(stack, 'HttpProxyPrivateApi', {
  defaultIntegration: new HttpAlbIntegrationProps({
    listener,
  }),
});
```

### Network Load Balancer

The following code is a basic network load balancer private integration of HTTP API:

```ts
const vpc = new ec2.Vpc(stack, 'VPC');
const lb = new elbv2.NLB(stack, 'lb', { vpc });
const listener = lb.addListener('listener', { port: 80 });
listener.addTargets('target', {
  port: 80,
});

const httpEndpoint = new HttpApi(stack, 'HttpProxyPrivateApi', {
  defaultIntegration: new HttpNlbIntegrationProps({
    listener,
  }),
});
```

### Cloud Map Service Discovery

The following code is a basic discovery service private integration of HTTP API:

```ts
const vpc = new ec2.Vpc(stack, 'VPC');
const vpcLink = new VpcLink(stack, 'VpcLink', { vpc });
const namespace = new servicediscovery.PrivateDnsNamespace(stack, 'Namespace', {
  name: 'boobar.com',
  vpc,
});
const service = namespace.createService('Service');

const httpEndpoint = new HttpApi(stack, 'HttpProxyPrivateApi', {
  defaultIntegration: new HttpServiceDiscoveryIntegration({
    vpcLink,
    service,
  }),
});
```
