## AWS Application and Network Load Balancing Construct Library

The `@aws-cdk/aws-elasticloadbalancingv2` package provides constructs for
configuring application and network load balancers.

For more information, see the AWS documentation for
[Application Load Balancers](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html)
and [Network Load Balancers](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html).

### Defining an Application Load Balancer

You define an application load balancer by creating an instance of
`ApplicationLoadBalancer`, adding a Listener to the load balancer
and adding Targets to the Listener:

```ts
import ec2 = require('@aws-cdk/aws-ec2');
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import autoscaling = require('@aws-cdk/aws-autoscaling');

// ...

const vpc = new ec2.VpcNetwork(...);

// Create the load balancer in a VPC. 'internetFacing' is 'false'
// by default, which creates an internal load balancer.
const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', {
    vpc,
    internetFacing: true
});

// Add a listener and open up the load balancer's security group
// to the world. 'open' is the default, set this to 'false'
// and use `listener.connections` if you want to be selective
// about who can access the listener.
const listener = lb.addListener('Listener', {
    port: 80,
    open: true,
});

// Create an AutoScaling group and add it as a load balancing
// target to the listener.
const asg = new autoscaling.AutoScalingGroup(...);
listener.addTargets('ApplicationFleet', {
    port: 8080,
    targets: [asg]
});
```

The security groups of the load balancer and the target are automatically
updated to allow the network traffic.

#### Conditions

It's possible to route traffic to targets based on conditions in the incoming
HTTP request. Path- and host-based conditions are supported. For example,
the following will route requests to the indicated AutoScalingGroup
only if the requested host in the request is `example.com`:

```ts
listener.addTargets('Example.Com Fleet', {
    priority: 10,
    hostHeader: 'example.com',
    port: 8080,
    targets: [asg]
});
```

`priority` is a required field when you add targets with conditions. The lowest
number wins.

Every listener must have at least one target without conditions.

### Defining a Network Load Balancer

Network Load Balancers are defined in a similar way to Application Load
Balancers:

```ts
import ec2 = require('@aws-cdk/aws-ec2');
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import autoscaling = require('@aws-cdk/aws-autoscaling');

// Create the load balancer in a VPC. 'internetFacing' is 'false'
// by default, which creates an internal load balancer.
const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', {
    vpc,
    internetFacing: true
});

// Add a listener on a particular port.
const listener = lb.addListener('Listener', {
    port: 443,
});

// Add targets on a particular port.
listener.addTargets('AppFleet', {
    port: 443,
    targets: [asg]
});
```

One thing to keep in mind is that network load balancers do not have security
groups, and no automatic security group configuration is done for you. You will
have to configure the security groups of the target yourself to allow traffic by
clients and/or load balancer instances, depending on your target types.  See
[Target Groups for your Network Load
Balancers](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-target-groups.html)
and [Register targets with your Target
Group](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/target-group-register-targets.html)
for more information.

### Targets and Target Groups

Application and Network Load Balancers organize load balancing targets in Target
Groups. If you add your balancing targets (such as AutoScalingGroups, ECS
services or individual instances) to your listener directly, the appropriate
`TargetGroup` will be automatically created for you.

If you need more control over the Target Groups created, create an instance of
`ApplicationTargetGroup` or `NetworkTargetGroup`, add the members you desire,
and add it to the listener by calling `addTargetGroups` instead of `addTargets`.

`addTargets()` will always return the Target Group it just created for you:

```ts
const group = listener.addTargets('AppFleet', {
    port: 443,
    targets: [asg1],
});

group.addTarget(asg2);
```

### Configuring Health Checks

Health checks are configured upon creation of a target group:

```ts
listener.addTargets('AppFleet', {
    port: 8080,
    targets: [asg],
    healthCheck: {
        path: '/ping',
        intervalSecs: 60,
    }
});
```

The health check can also be configured after creation by calling
`configureHealthCheck()` on the created object.

No attempts are made to configure security groups for the port you're
configuring a health check for, but if the health check is on the same port
you're routing traffic to, the security group already allows the traffic.
If not, you will have to configure the security groups appropriately:

```ts
listener.addTargets('AppFleet', {
    port: 8080,
    targets: [asg],
    healthCheck: {
        port: 8088,
    }
});

listener.connections.allowFrom(lb, new TcpPort(8088));
```

### Protocol for Load Balancer Targets

Constructs that want to be a load balancer target should implement
`IApplicationLoadBalancerTarget` and/or `INetworkLoadBalancerTarget`, and
provide an implementation for the function `attachToXxxTargetGroup()`, which can
call functions on the load balancer and should return metadata about the
load balancing target:

```ts
public attachToApplicationTargetGroup(targetGroup: ApplicationTargetGroup): LoadBalancerTargetProps {
    targetGroup.registerConnectable(...);
    return {
        targetType: TargetType.Instance | TargetType.Ip | TargetType.SelfRegistering,
        targetJson: { id: ..., port: ... },
    };
}
```

`targetType` should be one of `Instance` or `Ip` if the target can be directly
added to the target group, or `SelfRegistering` if the target will register new
instances with the load balancer at some later point.

If the `targetType` is `Instance` or `Ip`, `targetJson` should contain the `id`
of the target (either instance ID or IP address depending on the type) and
optionally a `port` or `availabilityZone` override.

Application load balancer targets can call `registerConnectable()` on the
target group to register themselves for addition to the load balancer's security
group rules.
