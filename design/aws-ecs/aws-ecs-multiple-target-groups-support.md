# AWS ECS - Multiple Target Groups Support

Target groups are used to route traffic to one or more registered targets when using an Application Load Balancer (ALB) or Network Load Balancer (NLB). Previously, users could only attach one target group to each ECS service. On Jun. 30, 2019 ECS started supporting multiple target groups for ECS services (see [here](https://aws.amazon.com/about-aws/whats-new/2019/07/amazon-ecs-services-now-support-multiple-load-balancer-target-groups/)).

However, currently if users want to specify multiple target groups for their ECS services, they must use the Amazon ECS API, SDK, AWS CLI, or an AWS CloudFormation template. Since it would be painful to create an AWS CloudFormation template without AWS CDK, we also want CDK to be able to create a template that specifies multiple target groups to an ECS service.

## Current behavior

The AWS CDK supports the following way to attach multiple target groups to an ECS service:

``` ts
...
const lb = new elbv2.ApplicationLoadBalancer(stack, "lb", { vpc });
const listener = lb.addListener("listener", { port: 80 });


// attach multiple target groups to services
listener.addTargets('TargetGroup', {
    port: 80,
    targets: [SERVICE],
});
listener.addTargets('TargetGroup1', {
    port: 81,
    targets: [SERVICE],
});
```

Under the hood when you register an ECS service to a target group, only the default container name and container port (first container port added) of the default container (the first added essential container) in the service will be registered as target in the target group (as shown below).


However, users don’t always want to register the first essential container and the first added container port by default (they might also want to register the second or third container instead). Although users can always set the container they want to register to be the default container. Nevertheless, when they are trying to register multiple containers in a service, duplicated services (very similar except for the default container and port) are required for them, which cause extra costs.

## Proposal

 To solve this problem, we propose two major changes: proposing a new API and improve the current one. Both methods allow users to specify which container and which port of that container they want to register.

### Add new API

We want to add a new API `SERVICE.registerContainerTargets()` to register targets in a service to target groups.

``` ts
service.registerContainerTarget([
  {
    containerName: string,
    containerTargets: [
      {
        containerPort: number,
        targetGroups: [
          {
            targetGroupID: string,
            addTargetGroupProps: elbv2.AddApplicationTargetsProps | elbv2.AddNetworkTargetsProps,
            listener: elbv2.ApplicationListener | elbv2.NetworkListener
          }
        ]
      },
    ]
  }
]);
```

### Improve current API

As we addressed above, the current API only register the default container name/port pair when registering a service, which needs improvement when users want to register any container.

``` ts
listener.addTargets(string, {
  // Accept only one target
  targets: [
    //set the target to be registered, default to be first container and first port added
    service.registerTarget({
      containerName: string,
      containerPort: number
    })
  ],
  ... // other target group props and rule props
});
```

## Use cases / Examples
According to customer feedback, we can focus on the following two use cases.

### Use case 1
_I have an ECS service with two containers: one container is mapped to /web/* to serve front end assets; and my other container is mapped to /api/* to serve backend requests. As a user of the ECS CDK, I should be able to programmatically create two different path rules in my ALB and map them to the containers, so that my team can work on separate logical boundaries but scale the task as one unit._

**New API**
``` ts
service.registerContainerTargets([
  {
    // listener: listener // if only one listener
    containerName: "frontend",
    targetProps: [
      {
        // targetGroup1 will be attached to listener
        containerPort: 80,
        targetGroups: [
          {
            targetGroupID: "web",
            listener: listener,
            addTargetGroupProps: { // existing interface on IListener
              pathPattern: "/web/*"
            }
          }
        ]
      },
    ]
  },
  {
    containerName: "backend",
    targetProps: [
      {
        // targetGroup2 will be attached to listener
        containerPort: 80,
        targetGroups: [
          {
            targetGroupID: 'api',
            listener: listener,
            addTargetGroupProps: {
              pathPattern: "/api/*"
            }
          }
        ]
      },
    ]
  },
]);
```

**Improved current API**
``` ts
listener.addTargets('web', {
  // Accept only one target (see project scope)
  targets: [
    //set the target to be registered, default to be first container and first port added
    service.registerTarget({
      containerName: "frontend",
      containerPort: 80
    })
  ],
  pathPattern: "/web/*"
  ... // other target group props and rule props
});

listener.addTargets('api', {
  targets: [
    service.registerTarget({
      containerName: "backend",
      containerPort: 443
    })
  ],
  pathPattern: "/api/*"
});
```

### Use case 2
_I have an ECS service with one container, which listens on port 8080 to serve API traffic. And my container is also listening on port 9080 to serve management traffic. As a user of the ECS CDK, I should be able to programmatically create my application load balancers and map the container ports separately, so that I can have more control of which traffic is routed to my management port._

**New Api**
``` ts
service.registerContainerTargets([
  {
    containerName: "myContainer",
    targetProps: [
      {
        // targetGroup1 will be attached to listener1
        containerPort: 8080,
        targetGroups: [
          {
            targetGroupID: 'api',
            listener: listener1,
            addTargetGroupProps: {
              pathPattern: "/api/*"
            }
          }
        ]
      },
      {
        // targetGroup2 will be attached to listener2
        containerPort: 9080,
        targetGroups: [
          {
            targetGroupID: "management"
            listener: listener2,
            addTargetGroupProps: {
              pathPattern: "/management/*"
            }
          }
        ]
      }
    ]
  }
]);
```

**Improved current API**
``` ts
listener1.addTargets('api', {
  targets: [
    service.registerTarget({
      containerName: "myContainer",
      containerPort: 8080
    })
  ],
  pathPattern: "/api/*"
  ... // other target group props and rule props
});

listener2.addTargets('management', {
  targets: [
    service.registerTarget({
      containerName: "myContainer",
      containerPort: 9080
    })
  ],
  pathPattern: "/management/*"
});
```

## Code changes

Given the above, we should make the following changes on ECS:

  1. Add input validation.
  2. Add interfaces for new API.
  3. Add new API.
  4. Improve the current API

We also need to make the following changes on ELBv2 to support the new API:

  5. Changed `addLoadBalancerTarget()` from `protected` to `public`.
  6. Changed `loadBalancer` property from `private` to `public`.

### Part 1: Add input validation

``` ts
/**
 * The interface for a container's name and ports.
 */
export interface RegisteredContainer {
  /**
   * The name of the container.
   */
  readonly containerName: string;
  /**
   * The port numbers of the container.
   */
  readonly containerPorts: number [];
}

/**
 * The base class for all task definitions.
 */
export class TaskDefinition extends TaskDefinitionBase {

  ...

  public get containerNamePorts(): RegisteredContainer [] {
    const registeredContainers = new Array<RegisteredContainer>();
    for (const container of this.containers) {
      const ports = new Array<number>();
      for (const portMapping of container.portMappings) {
        ports.push(portMapping.containerPort);
      }
      registeredContainers.push({
        containerName: container.containerName,
        containerPorts: ports
      });
    }
    return registeredContainers;
  }

  ...

}
```

``` ts
/**
 * The base class for Ec2Service and FargateService services.
 */
export abstract class BaseService extends Resource
  implements IService, elbv2.IApplicationLoadBalancerTarget, elbv2.INetworkLoadBalancerTarget {

  ...

  /**
   * Validate the existence of the target in the taskDefinition.
   */
  private validateExist(target: ContainerTarget): boolean {
    for (const container of this.taskDefinition.containerNamePorts) {
      if (target.containerName === container.containerName) {
        if (container.containerPorts.includes(target.containerPort)) {
          return true;
        }
      }
    }
    return false;
  }
}  
```

### Part 2: Add interfaces for new API

``` ts
/**
 * Properties for defining an ECS target.
 */
export interface ContainerTarget {
  /**
   * The name of the container.
   */
  readonly containerName: string;

  /**
   * The port number of the container.
   */
  readonly containerPort: number;
}

/**
 * Properties for ECS container targets.
 */
export interface TargetProps {
  /**
   * Name of the container.
   */
  readonly containerName: string,
  /**
   * Container targets of the container.
   */
  readonly containerTargets: ContainerTargetProps[]
}

/**
 * Properties for registering a container target.
 */
export interface ContainerTargetProps {
  /**
   * Container port number to be registered.
   */
  readonly containerPort: number,
  /**
   * Setting to create and attach target groups.
   */
  readonly targetGroups: TargetGroupProps [],
}

/**
 * The interface for creating and attaching a target group.
 */
export interface TargetGroupProps {
  /**
   * ID for a target group to be created.
   */
  readonly targetGroupID: string,
  /**
   * Properties for adding new targets to a listener.
   */
  readonly addTargetGroupProps: elbv2.AddApplicationTargetsProps | elbv2.AddNetworkTargetsProps,
  /**
   * Listener to attach to.
   */
  readonly listener: elbv2.IApplicationListener | elbv2.INetworkListener
}
```

### Part 3: Add new API

``` ts
/**
 * The base class for Ec2Service and FargateService services.
 */
export abstract class BaseService extends Resource
  implements IService, elbv2.IApplicationLoadBalancerTarget, elbv2.INetworkLoadBalancerTarget {

  ...

  public attachToTargetGroup(targetGroup: elbv2.ApplicationTargetGroup | elbv2.NetworkTargetGroup,
                             target: ContainerTarget): elbv2.LoadBalancerTargetProps {
    if (targetGroup instanceof elbv2.ApplicationTargetGroup) {
      const ret = this.attachToELB(targetGroup, target);

      // Open up security groups. For dynamic port mapping, we won't know the port range
      // in advance so we need to open up all ports.
      const port = this.taskDefinition.defaultContainer!.ingressPort;
      const portRange = port === 0 ? EPHEMERAL_PORT_RANGE : ec2.Port.tcp(port);
      targetGroup.registerConnectable(this, portRange);

      return ret;
    }
    return this.attachToELB(targetGroup, target);
  }

  ...

  public registerContainerTargets(containers: TargetProps[]) {
    for (const container of containers) {
      for (const containerTarget of container.containerTargets) {
        const target = {
          containerName: container.containerName,
          containerPort: containerTarget.containerPort
        };
        if (!this.validateExist(target)) {
          throw new Error('One of container name or port for the provided targets does not exist.');
        }
        for (const targetGroupProp of containerTarget.targetGroups) {
          const targetGroup = this.createAttachTargetGroup(targetGroupProp.targetGroupID, targetGroupProp.listener,
            targetGroupProp.addTargetGroupProps);

          const result = this.attachToTargetGroup(targetGroup, target);

          targetGroup.addLoadBalancerTarget(result);
        }
      }
    }
  }

  public createAttachTargetGroup(id: string, listener: elbv2.IApplicationListener | elbv2.INetworkListener,
                                 addProps: elbv2.AddApplicationTargetsProps | elbv2.AddNetworkTargetsProps) {
    let targetGroup: elbv2.ApplicationTargetGroup | elbv2.NetworkTargetGroup;
    if (listener instanceof elbv2.ApplicationListener) {
      if (!listener.loadBalancer.vpc) {
        // tslint:disable-next-line:max-line-length
        throw new Error('Can only call registerContainerTarget() when using a Load Balancer with VPC');
      }
      const props = addProps as elbv2.AddApplicationTargetsProps;
      targetGroup = new elbv2.ApplicationTargetGroup(this.stack, id + "Group", {
        deregistrationDelay: props.deregistrationDelay,
        healthCheck: props.healthCheck,
        port: props.port,
        protocol: props.protocol,
        slowStart: props.slowStart,
        stickinessCookieDuration: props.stickinessCookieDuration,
        targetGroupName: props.targetGroupName,
        vpc: listener.loadBalancer.vpc
      });

      (listener as elbv2.ApplicationListener).addTargetGroups(id, {
        targetGroups: [targetGroup],
        hostHeader: props.hostHeader,
        pathPattern: props.pathPattern,
        priority: props.priority
      });
    } else if (listener instanceof elbv2.NetworkListener) {
      if (!listener.loadBalancer.vpc) {
        // tslint:disable-next-line:max-line-length
        throw new Error('Can only call registerContainerTarget() when using a Load Balancer with VPC');
      }
      const props = addProps as elbv2.NetworkTargetGroupProps;
      targetGroup = new elbv2.NetworkTargetGroup(this.stack, id + "Group", {
        deregistrationDelay: props.deregistrationDelay,
        healthCheck: props.healthCheck,
        port: props.port,
        proxyProtocolV2: props.proxyProtocolV2,
        targetGroupName: props.targetGroupName,
        vpc: listener.loadBalancer.vpc
      });
      (listener as elbv2.NetworkListener).addTargetGroups(id, targetGroup);
    } else {
      throw new Error('Listener can only be either ApplicationListener or NetworkListener.');
    }
    return targetGroup;
  }

  ...

  private attachToELB(targetGroup: elbv2.ITargetGroup, target: ContainerTarget): elbv2.LoadBalancerTargetProps {
    if (this.taskDefinition.networkMode === NetworkMode.NONE) {
      throw new Error("Cannot use a load balancer if NetworkMode is None. Use Bridge, Host or AwsVpc instead.");
    }

    this.loadBalancers.push({
      targetGroupArn: targetGroup.targetGroupArn,
      containerName: target.containerName,
      containerPort: target.containerPort,
    });

    // Service creation can only happen after the load balancer has
    // been associated with our target group(s), so add ordering dependency.
    this.resource.node.addDependency(targetGroup.loadBalancerAttached);

    const targetType = this.taskDefinition.networkMode === NetworkMode.AWS_VPC ? elbv2.TargetType.IP : elbv2.TargetType.INSTANCE;
    return { targetType };
  }

  ...

}  
```

### Part 4: Improve the current API

``` ts
/**
 * The base class for Ec2Service and FargateService services.
 */
export abstract class BaseService extends Resource
  implements IService, elbv2.IApplicationLoadBalancerTarget, elbv2.INetworkLoadBalancerTarget {

  ...

  private targetContainers?: ContainerTarget;

  ...

  protected registerTargetBase(target: ContainerTarget) {
    if (this.validateExist(target)) {
      this.targetContainers = {
        containerName: target.containerName,
        containerPort: target.containerPort
      };
    } else {
      throw new Error('One of container name or port for the provided targets does not exist.');
    }
  }

  ...

  /**
   * Shared logic for attaching to an ELBv2
   */
  private attachToELBv2(targetGroup: elbv2.ITargetGroup): elbv2.LoadBalancerTargetProps {

    ...

    if (this.targetContainers === undefined) {
      this.targetContainers = {
        containerName: this.taskDefinition.defaultContainer!.containerName,
        containerPort: this.taskDefinition.defaultContainer!.containerPort
      };
    }

    this.loadBalancers.push({
      targetGroupArn: targetGroup.targetGroupArn,
      containerName: this.targetContainers.containerName,
      containerPort: this.targetContainers.containerPort,
    });

  ...

}
```

``` ts
/**
 * This creates a service using the EC2 launch type on an ECS cluster.
 *
 * @resource AWS::ECS::Service
 */
export class Ec2Service extends BaseService implements IEc2Service, elb.ILoadBalancerTarget {

  ...

  /**
   * registerTarget is called to register a target container in the task definition.
   */
  public registerTarget(target: ContainerTarget) {
    super.registerTargetBase(target);
    return this;
  }

  ...

}
```

``` ts
/**
 * This creates a service using the Fargate launch type on an ECS cluster.
 *
 * @resource AWS::ECS::Service
 */
export class FargateService extends BaseService implements IFargateService {

  ...

  public registerTarget(target: ContainerTarget) {
    super.registerTargetBase(target);
    return this;
  }

  ...

}
```

### Part 5: Changed `addLoadBalancerTarget()` from `protected` to `public`

``` ts
/**
 * Define the target of a load balancer
 */
export abstract class TargetGroupBase extends cdk.Construct implements ITargetGroup {

  ...

  /**
   * Register the given load balancing target as part of this group
   */
  public addLoadBalancerTarget(props: LoadBalancerTargetProps) {

     ...

  }

  ...

}  
```

### Part 6: Changed `loadBalancer` property from `private` to `public`

``` ts
/**
 * Define a Network Listener
 *
 * @resource AWS::ElasticLoadBalancingV2::Listener
 */
export class NetworkListener extends BaseListener implements INetworkListener {

  ...

  /**
   * The load balancer this listener is attached to
   */
  public readonly loadBalancer: INetworkLoadBalancer;

  ...

}
```

## Failure Scenarios
1. When task definition has no essential container. (Fails when CDK synthesizing to get CFN template)

2. When users register a target without specifying both container name and container port. (Fails when building)

3. When users register a container name that doesn’t exist in the task definition. (Will error in build time)

4. When users register a container port that doesn’t exist in the container’s port mappings. (Will error in build time)

5. For improved current API, if more than one container name/port pairs in the same service registered to the same target group. (Will error when deploying)
