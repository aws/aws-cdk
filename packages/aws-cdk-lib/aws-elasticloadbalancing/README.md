# Amazon Elastic Load Balancing Construct Library


The `aws-cdk-lib/aws-elasticloadbalancing` package provides constructs for configuring
classic load balancers.

## Configuring a Load Balancer

Load balancers send traffic to one or more AutoScalingGroups. Create a load
balancer, set up listeners and a health check, and supply the fleet(s) you want
to load balance to in the `targets` property. If you want the load balancer to be
 accessible from the internet, set `internetFacing: true`.

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
declare const vpc: ec2.IVpc;
const lb = new elb.LoadBalancer(this, 'LB', {
  vpc,
  internetFacing: true,
});

// instance to add as the target for load balancer.
const instance = new ec2.Instance(this, 'targetInstance', {
  vpc: vpc,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
  machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 }),
});
lb.addTarget(new elb.InstanceTarget(instance));
```
