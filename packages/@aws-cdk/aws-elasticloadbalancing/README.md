# Amazon Elastic Load Balancing Construct Library
<!--BEGIN STABILITY BANNER-->

---

![End-of-Support](https://img.shields.io/badge/End--of--Support-critical.svg?style=for-the-badge)

> AWS CDK v1 has reached End-of-Support on 2023-06-01.
> This package is no longer being updated, and users should migrate to AWS CDK v2.
>
> For more information on how to migrate, see the [_Migrating to AWS CDK v2_ guide][doc].
>
> [doc]: https://docs.aws.amazon.com/cdk/v2/guide/migrating-v2.html

---

<!--END STABILITY BANNER-->

The `@aws-cdk/aws-elasticloadbalancing` package provides constructs for configuring
classic load balancers.

## Configuring a Load Balancer

Load balancers send traffic to one or more AutoScalingGroups. Create a load
balancer, set up listeners and a health check, and supply the fleet(s) you want
to load balance to in the `targets` property.

```ts
declare const vpc: ec2.IVpc;
const lb = new elb.LoadBalancer(this, 'LB', {
  vpc,
  internetFacing: true,
  healthCheck: {
    port: 80,
  },
});

declare const myAutoScalingGroup: autoscaling.AutoScalingGroup;
lb.addTarget(myAutoScalingGroup);
lb.addListener({
  externalPort: 80,
});
```

The load balancer allows all connections by default. If you want to change that,
pass the `allowConnectionsFrom` property while setting up the listener:

```ts
declare const mySecurityGroup: ec2.SecurityGroup;
declare const lb: elb.LoadBalancer;
lb.addListener({
  externalPort: 80,
  allowConnectionsFrom: [mySecurityGroup],
});
```
