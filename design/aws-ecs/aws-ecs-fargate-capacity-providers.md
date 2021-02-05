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

This new field would be added to the BaseService, not only for better extensibility when we add support for ASG capacity providers, but also to facilitate construction, since the FargateService extends the BaseService and would necessarily call super into the BaseService constructor.

### Alternatives
One alternative could be to provide a more magical experience by populating the capacityProviders field under the hood (for example, by modifying the cluster if capacityProviderStrategies is set on a FargateService). However, it’s unclear if this may lead to undesired behavior, especially if the customer is using an imported cluster. There is also the slight disadvantage of this being a less consistent behavior with how ASG capacity providers will be set in the future, and would break from the general pattern of setting resource fields at construction time.

Another option would be to create a new FargateCluster resource, that would have the two Fargate capacity providers set by default. The main advantage with this alternative would be that it would be consistent with the current Console experience, which sets the Fargate capacity providers for you if you choose the “Networking Only” cluster template via the cluster wizard. The downside is that it would be a more restrictive resource model that would go back on the decision to have a single generic ECS Cluster resource that could potentially contain both Fargate and EC2 services or tasks.
