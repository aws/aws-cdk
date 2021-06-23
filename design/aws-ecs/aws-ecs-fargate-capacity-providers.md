# Fargate Spot Capacity Provider support in the CDK

## Objective

Since Capacity Providers are now supported in CloudFormation, incorporating support for Fargate Spot capacity has been one of the [top asks](https://github.com/aws/aws-cdk/issues?q=is%3Aissue+is%3Aopen+label%3A%40aws-cdk%2Faws-ecs+sort%3Areactions-%2B1-desc) for the ECS CDK module, with over 60 customer reactions. While there are still some outstanding issues regarding capacity provider support in general, specifically regarding cyclic workflows with named clusters (See: [CFN issue](http://%20https//github.com/aws/containers-roadmap/issues/631#issuecomment-702580141)), we should be able to move ahead with supporting `FARGATE` and `FARGATE_SPOT` capacity providers with our existing FargateService construct.

See: https://github.com/aws/aws-cdk/issues/5850

## CloudFormation Requirements

### Cluster

A list of capacity providers (specifically, `FARGATE` and `FARGATE_SPOT`) need to be specified on the cluster itself as part of the [CapacityProviders](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-cluster.html#cfn-ecs-cluster-capacityproviders) field.

Additionally, there is a [DefaultCapacityProviderStrategy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-cluster.html#cfn-ecs-cluster-defaultcapacityproviderstrategy) on the cluster. While it is considered best practice to specify one if using capacity providers, this may not be necessary when only using Fargate capacity providers.

### Service

The [CapacityProviderStrategy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html#cfn-ecs-service-capacityproviderstrategy) field will need to be added to the Service construct. This would be a list of capacity provider strategies (aka [CapacityProviderStrategyItem](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-capacityproviderstrategyitem.html) in CFN) used for the service.

_Note_: It may be more readable to name the `CapacityProviderStrategy` field on the service to  *CapacityProviderStrategies*, which would be a list of *CapacityProviderStrategy* objects that correspond to the CFN `CapacityProviderStrategyItem`.


## Proposed solution

### User Experience

The most straightforward solution would be to add the *capacityProviders* field on cluster, which the customer would have to set to the Fargate capacity providers (`FARGATE` and `FARGATE_SPOT`), and then specify the *capacityProviderStrategies* field on the FargateService with one or more strategies that use the Fargate capacity providers.

Example:

```ts
const stack = new cdk.Stack();
const vpc = new ec2.Vpc(stack, 'MyVpc', {});
const cluster = new ecs.Cluster(stack, 'EcsCluster', {
  vpc,
 *capacityProviders: ['FARGATE', 'FARGATE_SPOT'],*
});

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

const container = taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  memoryLimitMiB: 512,
});
container.addPortMappings({ containerPort: 8000 });

new ecs.FargateService(stack, 'FargateService', {
  cluster,
  taskDefinition,
  *capacityProviderStrategies**: [
    {
      capacityProvider: 'FARGATE_SPOT',
      weight: 2,
    },
    {
      capacityProvider: 'FARGATE',
      weight: 1,
    }
  ],*
});
```

The type for the *capacityProviders*  field on a *Cluster* would be a list of string literals. An alternative that ensures type safety is to have `FARGATE` and `FARGATE_SPOT` as enum values; however, this would make it potentially more difficult to support Autoscaling Group capacity providers in the future, since [capacity providers](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cluster-capacity-providers.html) of that type would have be specified by their capacity provider name (as a string literal).

The type for the *capacityProviderStrategies* field on a *Service* would be a list of  [*CapacityProviderStrategy*](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-capacityproviderstrategyitem.html) objects, taking the form:

{"[Base](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-capacityproviderstrategyitem.html#cfn-ecs-service-capacityproviderstrategyitem-base)" : Integer, "[CapacityProvider](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-capacityproviderstrategyitem.html#cfn-ecs-service-capacityproviderstrategyitem-capacityprovider)" : String, "[Weight](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-capacityproviderstrategyitem.html#cfn-ecs-service-capacityproviderstrategyitem-weight)" : Integer }

*Base* and *Weight* fields will be *optional*; *CapacityProvider* is *required*. I.e.:

```ts
/**
 * A Capacity Provider strategy to use for the service.
 */
export interface CapacityProviderStrategy {
  /**
   * The name of the Capacity Provider. Currently only FARGATE and FARGATE_SPOT are supported.
   */
  readonly capacityProvider: string;

  /**
   * The base value designates how many tasks, at a minimum, to run on the specified capacity provider. Only one
   * capacity provider in a capacity provider strategy can have a base defined. If no value is specified, the default
   * value of 0 is used.
   *
   * @default - none
   */
  readonly base?: number;

  /**
   * The weight value designates the relative percentage of the total number of tasks launched that should use the
   * specified
capacity provider. The weight value is taken into consideration after the base value, if defined, is satisfied.
   *
   * @default - 0
   */
  readonly weight?: number;
}

```
This new field would be added to the BaseService, not only for better extensibility when we add support for ASG capacity providers, but also to facilitate construction, since the FargateService extends the BaseService and would necessarily call super into the BaseService constructor.

Implications Setting Launch Type

Since it can be reasonably assumed that any CapacityProvideStrategies defined on the Service are what the customer intends to use on the Service, the LaunchType will *not* be set on the Service if CapacityProvideStrategies are specified. This is similar to how the LaunchType field is unset if the service uses an external DeploymentController (https://github.com/aws/aws-cdk/blob/master/packages/%40aws-cdk/aws-ecs/lib/base/base-service.ts#L374).

On the other hand, this intent would not be as obvious with Default Capacity Provider Strategies defined a cluster. A *defaultCapacityProviderStrategy* specified on a cluster is used for any service that does not specify either a launchType or its own CapacityProviderStrategies. From the point of view of the ECS APIs, similar to how custom CapacityProvideStrategies defined on the Service are expected to supersede the defaultCapacityProviderStrategy on a cluster, the expected behavior for an ECS Service that specifies a launchType is for it to also ignore the Cluster’s defaultCapacityProviderStrategy.

However, since the two Service constructs in the CDK (Ec2Service and FargateService) do not support having the launchType field passed in explicitly, it would not possible to infer whether the intent of the customer using one of these Service constructs is to use the implied launchType (currently set under the hood in the service’s constructor (https://github.com/aws/aws-cdk/blob/master/packages/%40aws-cdk/aws-ecs/lib/fargate/fargate-service.ts#L155)) or the defaultCapacityProviderStrategy.  For this reason, we will not be adding the  defaultCapacityProviderStrategy field on the Cluster construct for this iteration.

_*Note*_: Future for support will be dependent on a re-design of the existing Service strategies. This will be treated in v2 of the ECS modules, likely with a single Service L2 construct and deprecation of the Ec2Service and FargateService constructs.


### Alternatives:
One alternative considered was to provide a more magical experience by populating the capacityProviders field under the hood (for example, by modifying the cluster if capacityProviderStrategies is set on a FargateService). However, there is the slight disadvantage of this being a less consistent behavior with how ASG capacity providers will be set in the future, and would break from the general pattern of setting resource fields at construction time. Furthermore, given that the cluster field on a service is of type ICluster, this may make it prohibitively difficult/impossible to provide the magical experience of modifying fields on the Cluster from the service. In the case where an ICluster is defined in a different stack, its properties cannot be modified from the stack where the Service is defined at all. For this reason, we will have to enforce the capacityProviders field being set explicitly on the Cluster construct.

For future extensibility, we can however add an `addCapacityProvider` method on the Cluster resource, to allow modifying the cluster CapacityProviders field post-construction.

Another option would be to create a new FargateCluster resource, that would have the two Fargate capacity providers set by default. The main advantage with this alternative would be that it would be consistent with the current Console experience, which sets the Fargate capacity providers for you if you choose the “Networking Only” cluster template via the cluster wizard. The downside is that it would be a more restrictive resource model that would go back on the decision to have a single generic ECS Cluster resource that could potentially contain both Fargate and EC2 services or tasks. Given that we are moving towards more generic versions of ECS resources, this is not a preferable solution. That being said, in the current iteration we can set the Fargate Capacity Providers on the cluster by default, but put them behind a feature flag, which we would be able to remove in the v2 version of the ECS module. Using the feature flag would ensure that there would not be a diff in the generated CFN template for existing customers defining ECS clusters in their stack who redeploy using an updated version of the CDK.

