## Tagging with the CDK

Tags are implemented using `Aspects` for details on the implementation see the
detailed sections below.

### Tag Quickstart

Tags can be applied to any `Construct` in the CDK. By default the Tag will
propagate to any resource that is a child of the construct and supports tagging.

For example, if you create a stack and want anything in the stack to receive a
tag:

```ts
import cdk = require('@aws-cdk/cdk');

const app = new cdk.App();
const theBestStack = new cdk.Stack(app, 'MarketingSystem');
theBestStack.apply(new cdk.Tag('StackType', 'TheBest'));

// any resources added that support tags will get them
```

### Advanced Tagging

#### Resource Type Controls

If you need to apply a tag, but want to specify which CloudFormation Resource
Types are affected you can include or exclude those in properties.

```ts
import cdk = require('@aws-cdk/cdk');
import ec2 = require('@aws-cdk/aws-ec2');

const app = new cdk.App();
const theBestStack = new cdk.Stack(app, 'MarketingSystem');
theBestStack.apply(new cdk.Tag('StackType', 'TheBest', {
  includeResourceTypes: [ec2.CfnVpc.resourceType]
  }));
// the only resource with tags will be the VPC

// or tag all but the vpc with
theBestStack.apply(new cdk.Tag('StackType', 'TheBest', {
  excludeResourceTypes: [ec2.CfnVpc.resourceType]
  }));

```

#### Removing Tags

Removing tags is accomplished by applying a `RemoveTag`. The important default
is that remove tags override `Tag` unless specified differently.

```ts
import cdk = require('@aws-cdk/cdk');

const app = new cdk.App();
const theBestStack = new cdk.Stack(app, 'MarketingSystem');
theBestStack.apply(new cdk.Tag('StackType', 'TheBest'));
theBestStack.apply(new cdk.RemoveTag('StackType', 'TheBest'));
// now nothing will be tagged
```

#### Tag Priority

The final control you have is to set a priority number. Tags with highest
priority number will always win. If tags have the same priority number the tag
closest in tree distance to the resource will win.

The default priority of `Tag` is 0. The default priority of `RemoveTag` is 1.

```ts
import cdk = require('@aws-cdk/cdk');
import ec2 = require('@aws-cdk/aws-ec2');

const app = new cdk.App();
const theBestStack = new cdk.Stack(app, 'MarketingSystem');

theBestStack.apply(new cdk.Tag('StackType', 'TheBest', {prioirty: 1}));

const vpc = new ec2.VpcNetwork(marketingStack, 'MarketingVpc', {
  maxAZs: 3, 
});

// Tag default is 0, so this has no affect
vpc.apply(new cdk.Tag('StackType', 'TheBestVpc'));
// RemoveTag default is 1, so this removes the tag from the VPC and children of
// VPC (e.g. Subnet, RouteTable, NAT Gateway, etc)
vpc.apply(new cdk.RemoveTag('StackType'));
```

You can use priority to control tagging regardless of the hierarchy of the tree.

## Aspects

Aspects are a mechanism to extend the CDK without having to directly impact the
class hierarchy directly. We have implemented Aspects using the [Visitor
Pattern](https://en.wikipedia.org/wiki/Aspect-oriented_programming).

### Aspects in the CDK

An aspect in the CDK is defined by the interface:

```ts
/**
 * Represents an Aspect
 */
export interface IAspect {
  /**
   * Aspects invocation pattern
   */
  readonly visitType: AspectVisitType;
  /**
   * All aspects can visit an IConstruct
   */
  visit(node: IConstruct): void;
}
```

Initially two types of aspects are supported. 

1. Single visit aspects will ensure the aspect visit function is only invoked
   one time.
1. Multiple visit aspects will invoke the visit function as many times as
   requested

Aspects can be applied to any `Construct`. During the tree
preparation phase the aspect will visit each construct in the tree at least one
time. Aspects are invoked in the order they were added to the `Construct`,
starting at the `App` (root of the tree) and progressing in order to the leaf
nodes (most commonly the CloudFormation Resource). Aspect authors will implement 
the `visit(IConstruct)` function can inspect the `Construct` for specific characteristics.
Such as, is this construct a CloudFormation Resource?

### Tag and Remove Tag Aspect

Tag support is the first use of Aspects. The goal was to enable the ability to
define tags in one place and them have applied consistently for all resources
that support tagging. In addition the developer should not have to know if the
resource supports tags. The developer defines the tagging intents for all
resources within a path. If the resources support tags they are added, else no
action is taken.

In order to enable additional controls a Tag Aspect can specifically include or
exclude a CloudFormation Resource Type. See the TagAspectProps interface for
more details. 

#### Tag Example with ECS

We are going to use the ECS example as starting point.

For the purposes of example, this ECS cluster is for the Marketing Department.
Marketing has two core groups Business to Business (B2B) and Business to Consumer
(B2C). However, the Marketing team relies on the Platform team to help build the
common components across businesses and separates costs to match. The goal here
is tag the Platform team resources, the Marketing Department and then Marketing
groups to enable proper cost allocations.


```ts
import cdk = require('@aws-cdk/cdk');
import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');

const app = new cdk.App();
const marketingStack = new cdk.Stack(app, 'MarketingSystem');

const vpc = new ec2.VpcNetwork(marketingStack, 'MarketingVpc', {
  maxAZs: 3 // Default is all AZs in region
});

const cluster = new ecs.Cluster(marketingStack, 'MarketingCluster', {
  vpc: vpc
});

// Create a load-balanced Fargate service and make it public
new ecs.LoadBalancedFargateService(marketingStack, 'B2BService', {
  cluster: cluster,  // Required
  cpu: '512', // Default is 256
  desiredCount: 6,  // Default is 1
  image: ecs.ContainerImage.fromDockerHub('amazon/amazon-ecs-sample'), // Required
  memoryMiB: '2048',  // Default is 512
  publicLoadBalancer: true  // Default is false
});

// Create a load-balanced Fargate service and make it public
new ecs.LoadBalancedFargateService(marketingStack, 'B2CService', {
  cluster: cluster,  // Required
  cpu: '512', // Default is 256
  desiredCount: 6,  // Default is 1
  image: ecs.ContainerImage.fromDockerHub('amazon/amazon-ecs-sample'), // Required
  memoryMiB: '2048',  // Default is 512
  publicLoadBalancer: true  // Default is false
});
```


```ts
import cdk = require('@aws-cdk/cdk');
import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');

const COST_CENTER_KEY = 'CostCenter';

const app = new cdk.App();
// every resource starts with Marketing
app.apply(new cdk.Tag(COST_CENTER_KEY, 'Marketing'));

const marketingStack = new cdk.Stack(app, 'MarketingSystem');

const vpc = new ec2.VpcNetwork(marketingStack, 'MarketingVpc', {
  maxAZs: 3 // Default is all AZs in region
});
// override the VPC tags with Platform
// this will tag the VPC, Subnets, Route Tables, IGW, and NatGWs
vpc.apply(new cdk.Tag(COST_CENTER_KEY, 'Platform'));

const cluster = new ecs.Cluster(marketingStack, 'MarketingCluster', {
  vpc: vpc
});

// Create a load-balanced Fargate service and make it public
const b2b = new ecs.LoadBalancedFargateService(marketingStack, 'B2BService', {
  cluster: cluster,  // Required
  cpu: '512', // Default is 256
  desiredCount: 6,  // Default is 1
  image: ecs.ContainerImage.fromDockerHub('amazon/amazon-ecs-sample'), // Required
  memoryMiB: '2048',  // Default is 512
  publicLoadBalancer: true  // Default is false
});

// Create a load-balanced Fargate service and make it public
new ecs.LoadBalancedFargateService(marketingStack, 'B2CService', {
  cluster: cluster,  // Required
  cpu: '512', // Default is 256
  desiredCount: 6,  // Default is 1
  image: ecs.ContainerImage.fromDockerHub('amazon/amazon-ecs-sample'), // Required
  memoryMiB: '2048',  // Default is 512
  publicLoadBalancer: true  // Default is false
});
```

The resulting tags are as follows:

> We are omitting the default tags for VPC components.

| Construct Path | Tag Key | Tag Value |
| ----------|:---------|:-----|
|MarketingSystem/MarketingVpc|CostCenter|Platform|
|MarketingSystem/MarketingVpc/PublicSubnet1| CostCenter | Platform|
|MarketingSystem/MarketingVpc/PublicSubnet1/RouteTable| CostCenter | Platform|
|MarketingSystem/MarketingVpc/PublicSubnet1/NATGateway| CostCenter | Platform|
|MarketingSystem/MarketingVpc/PublicSubnet2| CostCenter | Platform|
|MarketingSystem/MarketingVpc/PublicSubnet2/RouteTable| CostCenter | Platform|
|MarketingSystem/MarketingVpc/PublicSubnet2/NATGateway| CostCenter | Platform|
|MarketingSystem/MarketingVpc/PublicSubnet3| CostCenter | Platform|
|MarketingSystem/MarketingVpc/PublicSubnet3/RouteTable| CostCenter | Platform|
|MarketingSystem/MarketingVpc/PublicSubnet3/NATGateway| CostCenter | Platform|
|MarketingSystem/MarketingVpc/PrivateSubnet1| CostCenter | Platform|
|MarketingSystem/MarketingVpc/PrivateSubnet1/RouteTable| CostCenter | Platform|
|MarketingSystem/MarketingVpc/PrivateSubnet2| CostCenter | Platform|
|MarketingSystem/MarketingVpc/PrivateSubnet2/RouteTable| CostCenter | Platform|
|MarketingSystem/MarketingVpc/PrivateSubnet3| CostCenter | Platform|
|MarketingSystem/MarketingVpc/PrivateSubnet3/RouteTable| CostCenter | Platform|
|MarketingSystem/MarketingVpc/IGW|CostCenter|Platform|
|MarketingSystem/B2BService/Service/SecurityGroup/Resource|CostCenter|Marketing|
|MarketingSystem/B2BService/LB/Resource|CostCenter|Marketing|
|MarketingSystem/B2BService/LB/SecurityGroup/Resource|CostCenter|Marketing|
|MarketingSystem/B2BService/LB/PublicListener/ECSGroup/Resource|CostCenter|Marketing|
|MarketingSystem/B2CService/Service/SecurityGroup/Resource|CostCenter|Marketing|
|MarketingSystem/B2CService/LB/Resource|CostCenter|Marketing|
|MarketingSystem/B2CService/LB/SecurityGroup/Resource|CostCenter|Marketing|
|MarketingSystem/B2CService/LB/PublicListener/ECSGroup/Resource|CostCenter|Marketing|

As you can see many tags are generated with only a few intent based directives. The CDK does default some additional tags for suggested `Name` keys. If you want to remove those tags you can do so by using the `RemoveTag` aspect, see below:

```ts
// snip //
const vpc = new ec2.VpcNetwork(marketingStack, 'MarketingVpc', {
  maxAZs: 3 // Default is all AZs in region
  });
// override the VPC tags with Platform
// this will tag the VPC, Subnets, Route Tables, IGW, and NatGWs
vpc.apply(new cdk.Tag(COST_CENTER_KEY, 'Platform'));
vpc.apply(new cdk.RemoveTag('Name'));
// snip //
```

If you run the above modification you will notice that the Subnets, Route
Tables, and NAT Gateways will still have `Name` tags. Why is that?

The framework applies aspects starting with the root node. In our example, this
would be the `cdk.App`. For the given node, the aspects are applied in the order
the same order they were added to the `Construct`. We have the following
simplified tree:

```
  +------+
  | App  |
  |      |
  +---+--+
      |    +------+
      |    |VPC   |
      +---->      |
           +---+--+
              |
              |   +-------+
              |   |Subnet |
              +---> (6 Instances)
                  +-------+
```

The nodes have the following aspects for just the Name tags:

| Node | Aspects | Description |
| ------------- |:-------------:|:-------------|
| VPC | Tag(Name: `VPC Path`) | This is defaulted by the CDK|
| VPC | Remove(Name) | This is defaulted by the CDK|
| Subnet | Tag(Name: `Subnet Path`) | This is defaulted by the CDK on all 6 Subnets|

The Subnets will see the following order of tag operations:

1. Subnet set Tag (Name: `VPC Path`)
1. Subnet remove Tag (Name)
1. Subnet set Tag (Name: `Subnet Path`)

> Note that route tables and NAT Gateways are also children of the subnet and
> receive the pattern as described above.

If you really want to remove the name tag from subnets you will need to iterate
through subnets from the `vpc` object and apply the Remove Tag aspect.

#### Tag Options

Tag Aspects support three options: include, exclude and applyToLaunchInstances.

##### applyToLaunchInstances

This property is a boolean that defaults to `true`. When `true` and the aspect
visits an AutoScalingGroup resource the `PropagateAtLaunch` property is set to
true. If false the property is set accordingly.

##### include

Include is an array property that contains strings of CloudFormation Resource
Types. As the aspect visits nodes it only takes action if node is one of the
resource types in the array. By default the array is empty and an empty array is
interpreted as apply to any resource type.

##### exclude 

Exclude is the inverse of include. Exclude is also an array of CloudFormation
Resource Types. As the aspect visit nodes it will not take action if the node is
one of the resource types in the array. By default the array is empty and an
empty array is interpreted to match no resource type. Exclude takes precedence
over include in the event of a collision.
