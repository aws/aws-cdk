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
    service.loadBalancerTarget({
      containerName: string,
      containerPort: number
    })
  ]
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
    service.loadBalancerTarget({
      containerName: "frontend",
      containerPort: 80,
    })
  ],
  pathPattern: "/web/*"
  ... // other target group props and rule props
});

listener.addTargets('api', {
  targets: [
    service.loadBalancerTarget({
      containerName: "backend",
      containerPort: 443,
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
    service.loadBalancerTarget({
      containerName: "myContainer",
      containerPort: 8080,
    })
  ],
  pathPattern: "/api/*"
  ... // other target group props and rule props
});

listener2.addTargets('management', {
  targets: [
    service.loadBalancerTarget({
      containerName: "myContainer",
      containerPort: 9080,
    })
  ],
  pathPattern: "/management/*"
});
```

## Code changes

Given the above, we should make the following changes on ECS:

  1. Add input validation.
  2. Add interfaces for new API.
  3. Improve the current API.
  4. Add new API.

### Part 1: Add input validation

_task-definition.ts_
``` ts
/**
 * The base class for all task definitions.
 */
export class TaskDefinition extends TaskDefinitionBase {

  ...

  /**
   * Returns the container that match the provided containerName.
   *
   * @internal
   */
  public _findContainer(containerName: string): ContainerDefinition | undefined {
    for (const container of this.containers) {
      if (container.containerName === containerName) {
        return container;
      }
    }
    return undefined;
  }

  /**
   * Returns the host port that match the provided container name and container port.
   *
   * @internal
   */
  public _findHostPort(containerName: string, containerPort: number): number {
    const container = this._findContainer(containerName);
    if (container === undefined) {
      throw new Error("Container does not exist.");
    }
    const port = container._findPortMapping(containerPort);
    if (port === undefined) {
      throw new Error("Container port does not exist");
    }
    if (port.hostPort !== undefined && port.hostPort !== 0) {
      return port.hostPort;
    }

    if (this.networkMode === NetworkMode.BRIDGE) {
      return 0;
    }
    return port.containerPort;
  }

  ...

}
```

_container-definition.ts_
``` ts
/**
 * A container definition is used in a task definition to describe the containers that are launched as part of a task.
 */
export class ContainerDefinition extends cdk.Construct {

  ...

  /**
   * Returns the host port for the requested container port if it exists
   *
   * @internal
   */
  public _findPortMapping(containerPort: number): PortMapping | undefined {
    for (const portMapping of this.portMappings) {
      if (portMapping.containerPort === containerPort) {
        return portMapping;
      }
    }
    return undefined;
  }

  ...

}
```

_base-service.ts_
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
    const container = this.taskDefinition._findContainer(target.containerName);
    if (container !== undefined) {
      const hostPort = container._findPortMapping(target.containerPort);
      if (hostPort !== undefined) {
        return true;
      }
    }
    return false;
  }

  ...

}  
```

### Part 2: Add interfaces for new API

_base-service.ts_
``` ts
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

### Part 3: Improve the current API
_base-service.ts_
``` ts

/**
 * Interface for ECS load balancer target.
 */
export interface IEcsLoadBalancerTarget extends elbv2.IApplicationLoadBalancerTarget, elbv2.INetworkLoadBalancerTarget {
}

/**
 * Properties for defining an ECS target.
 */
export interface LoadBalancerTargetOptions {
  /**
   * The name of the container.
   */
  readonly containerName: string;

  /**
   * The port number of the container.
   */
  readonly containerPort: number;
}

...

/**
 * The base class for Ec2Service and FargateService services.
 */
export abstract class BaseService extends Resource
  implements IService, elbv2.IApplicationLoadBalancerTarget, elbv2.INetworkLoadBalancerTarget,
             elbv2.IEcsNetworkLoadBalancerTarget, elbv2.IEcsApplicationLoadBalancerTarget {

  ...

  public loadBalancerTarget(options: LoadBalancerTargetOptions): IEcsLoadBalancerTarget {
    const self = this;
    if (!this.validateExist(options)) {
      throw new Error('One of container name or port for the provided targets does not exist.');
    }
    return {
      attachToApplicationTargetGroup(targetGroup: elbv2.ApplicationTargetGroup): elbv2.LoadBalancerTargetProps {
        const port = self.taskDefinition._findHostPort(options.containerName, options.containerPort);
        const portRange = port === 0 ? EPHEMERAL_PORT_RANGE : ec2.Port.tcp(port);
        targetGroup.registerConnectable(self, portRange);
        return self.attachToELBv2(targetGroup, options);
      },

      attachToNetworkTargetGroup(targetGroup: elbv2.NetworkTargetGroup): elbv2.LoadBalancerTargetProps {
        return self.attachToELBv2(targetGroup, options);
      },
    };
  }

  ...

  /**
   * Shared logic for attaching to an ELBv2
   */
  private attachToELBv2(targetGroup: elbv2.ITargetGroup, options?: LoadBalancerTargetOptions): elbv2.LoadBalancerTargetProps {
    if (this.taskDefinition.networkMode === NetworkMode.NONE) {
      throw new Error("Cannot use a load balancer if NetworkMode is None. Use Bridge, Host or AwsVpc instead.");
    }

    if (!options) {
      this.loadBalancers.push({
        targetGroupArn: targetGroup.targetGroupArn,
        containerName: this.taskDefinition.defaultContainer!.containerName,
        containerPort: this.taskDefinition.defaultContainer!.containerPort,

      });
    } else {
      this.loadBalancers.push({
        targetGroupArn: targetGroup.targetGroupArn,
        containerName: options.containerName,
        containerPort: options.containerPort,
      });
    }

    // Service creation can only happen after the load balancer has
    // been associated with our target group(s), so add ordering dependency.
    this.resource.node.addDependency(targetGroup.loadBalancerAttached);

    const targetType = this.taskDefinition.networkMode === NetworkMode.AWS_VPC ? elbv2.TargetType.IP : elbv2.TargetType.INSTANCE;
    return { targetType };
  }

  ...

}
```

### Part 4: Add new API

_base-service.ts_
``` ts
/**
 * The base class for Ec2Service and FargateService services.
 */
export abstract class BaseService extends Resource
  implements IService, elbv2.IApplicationLoadBalancerTarget, elbv2.INetworkLoadBalancerTarget,
             elbv2.IEcsNetworkLoadBalancerTarget, elbv2.IEcsApplicationLoadBalancerTarget {

  ...

  public registerContainerTargets(containers: TargetProps[]) {
    for (const container of containers) {
      for (const containerTarget of container.containerTargets) {
        const target = {
          containerName: container.containerName,
          containerPort: containerTarget.containerPort,
        };
        for (const targetGroupProp of containerTarget.targetGroups) {
          if (targetGroupProp.listener instanceof elbv2.ApplicationListener) {
            const props = targetGroupProp.addTargetGroupProps as elbv2.AddApplicationTargetsProps;
            targetGroupProp.listener.addTargets(targetGroupProp.targetGroupID, {
              ... props,
              targets: [
                this.loadBalancerTarget({
                  containerName: target.containerName,
                  containerPort: target.containerPort
                })
              ]
            });
          }
          if (targetGroupProp.listener instanceof elbv2.NetworkListener) {
            const props = targetGroupProp.addTargetGroupProps as elbv2.AddNetworkTargetsProps;
            targetGroupProp.listener.addTargets(targetGroupProp.targetGroupID, {
              ... props,
              targets: [
                this.loadBalancerTarget({
                  containerName: target.containerName,
                  containerPort: target.containerPort
                })
              ]
            });
          }
        }
      }
    }
  }

  ...

}
```


## Failure Scenarios
1. When task definition has no essential container. (Fails when CDK synthesizing to get CFN template)

2. When users register a target without specifying both container name and container port. (Fails when building)

3. When users register a container name that doesn’t exist in the task definition. (Will error in build time)

4. When users register a container port that doesn’t exist in the container’s port mappings. (Will error in build time)

5. For improved current API, if more than one container name/port pairs in the same service registered to the same target group. (Will error when deploying)
