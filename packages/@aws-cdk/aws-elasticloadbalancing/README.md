## Amazon Elastic Load Balancing Construct Library
<div class="stability_label">

  > **Stability: 1 - Experimental.**
  >
  > This API is still under active development and subject to non - backward
  > compatible changes or removal in any future version. Use of the API is not recommended in production
  > environments. Experimental APIs are not subject to the Semantic Versioning model.

</div>

The `@aws-cdk/aws-ec2` package provides constructs for configuring
classic load balancers.

### Configuring a Load Balancer

Load balancers send traffic to one or more AutoScalingGroups. Create a load
balancer, set up listeners and a health check, and supply the fleet(s) you want
to load balance to in the `targets` property.

```ts
const lb = new elb.LoadBalancer(this, 'LB', {
    vpc,
    internetFacing: true,
    healthCheck: {
        port: 80
    },
});

lb.addTarget(myAutoScalingGroup);
lb.addListener({
    externalPort: 80,
});
```

The load balancer allows all connections by default. If you want to change that,
pass the `allowConnectionsFrom` property while setting up the listener:

```
lb.addListener({
    externalPort: 80,
    allowConnectionsFrom: [mySecurityGroup]
});
```
