# Amazon Elastic Load Balancing Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

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

### Adding Ec2 Instance as a target for the load balancer

You can add an EC2 instance to the load balancer by calling using `new InstanceTarget` as the argument to `addTarget()`:

```ts
const lb = new elb.LoadBalancer(this, 'LB', {
  vpc,
});
// instance to add as the target for load balancer.
const instance = new Instance(stack, 'targetInstance', {
  vpc: vpc,
  instanceType: InstanceType.of(InstanceClass.BURSTABLE2, InstanceSize.MICRO),
  machineImage: new AmazonLinuxImage(),
});
lb.addTarget(elb.InstanceTarget(instance));
```
