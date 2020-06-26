## AWS Elastic Load Balancing Patterns Construct Library
<!--BEGIN STABILITY BANNER-->
---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development. They are subject to non-backward compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be announced in the release notes. This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---
<!--END STABILITY BANNER-->

> __Status: Experimental__

This library provides higher-level load balancing constructs which follow common architectural patterns. It contains:

* Network Load Balancer Front For Application Load Balancer

## Network Load Balancer Front For Application Load Balancer

This construct is based on an [AWS blog post](https://aws.amazon.com/blogs/networking-and-content-delivery/using-static-ip-addresses-for-application-load-balancers)
which described downsides to Application Load Balancers and Network Load Balancers, and how they could be combined to get the best of both. 

This is useful because Application Load Balancers cannot be exposed over a Private Link, or through a Vpc Endpoint Service, so clients running in an Isolated subnet are unable
to connect to the ALB. If there is a NLB forwarding traffic to the ALB, the NLB can be exposed as a service to those clients.

```ts
    const vpc = new Vpc(stack, 'VPC', {});
    const alb = new ApplicationLoadBalancer(stack, 'ALB', {
      vpc,
    });

    // WHEN
    new StaticIpForAlb(stack, 'Sync', {
      applicationLoadBalancer: alb,
    });
```

## Under The Hood

You specify the ALB and the port to have traffic forwarded on. If your ALB is listening on port 443, then you want to provide port 443.
The construct creates:

- An IP Target Group which targets the IP addresses of the ALB.
- A Lambda function which queries DNS for the IP addresses of the ALB once per 5 minutes. These IP addresses are saved in an S3 bucket, and updated
on the Target Group.
- A Listener which listens on the provided port, and which targets the Target Group
- A Network Load Balancer which uses the Listener
