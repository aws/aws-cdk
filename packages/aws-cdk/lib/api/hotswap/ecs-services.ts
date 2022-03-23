import * as AWS from 'aws-sdk';
import { ISDK } from '../aws-auth';
import { EvaluateCloudFormationTemplate } from '../evaluate-cloudformation-template';
import { ChangeHotswapImpact, ChangeHotswapResult, HotswapOperation, HotswappableChangeCandidate, lowerCaseFirstCharacter, transformObjectKeys } from './common';

export async function isHotswappableEcsServiceChange(
  logicalId: string, change: HotswappableChangeCandidate, evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): Promise<ChangeHotswapResult> {
  // the only resource change we should allow is an ECS TaskDefinition
  if (change.newValue.Type !== 'AWS::ECS::TaskDefinition') {
    return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
  }

  for (const updatedPropName in change.propertyUpdates) {
    // We only allow a change in the ContainerDefinitions of the TaskDefinition for now -
    // it contains the image and environment variables, so seems like a safe bet for now.
    // We might revisit this decision in the future though!
    if (updatedPropName !== 'ContainerDefinitions') {
      return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
    }
    const containerDefinitionsDifference = (change.propertyUpdates)[updatedPropName];
    if (containerDefinitionsDifference.newValue === undefined) {
      return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
    }
  }
  // at this point, we know the TaskDefinition can be hotswapped

  // find all ECS Services that reference the TaskDefinition that changed
  const resourcesReferencingTaskDef = evaluateCfnTemplate.findReferencesTo(logicalId);
  const ecsServiceResourcesReferencingTaskDef = resourcesReferencingTaskDef.filter(r => r.Type === 'AWS::ECS::Service');
  const ecsServicesReferencingTaskDef = new Array<EcsService>();
  for (const ecsServiceResource of ecsServiceResourcesReferencingTaskDef) {
    const serviceArn = await evaluateCfnTemplate.findPhysicalNameFor(ecsServiceResource.LogicalId);
    if (serviceArn) {
      ecsServicesReferencingTaskDef.push({ serviceArn });
    }
  }
  if (ecsServicesReferencingTaskDef.length === 0 ||
      resourcesReferencingTaskDef.length > ecsServicesReferencingTaskDef.length) {
    // if there are either no resources referencing the TaskDefinition,
    // or something besides an ECS Service is referencing it,
    // hotswap is not possible
    return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
  }

  const taskDefinitionResource = change.newValue.Properties;
  // first, let's get the name of the family
  const familyNameOrArn = await evaluateCfnTemplate.establishResourcePhysicalName(logicalId, taskDefinitionResource?.Family);
  if (!familyNameOrArn) {
    // if the Family property has not bee provided, and we can't find it in the current Stack,
    // this means hotswapping is not possible
    return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
  }
  // the physical name of the Task Definition in CloudFormation includes its current revision number at the end,
  // remove it if needed
  const familyNameOrArnParts = familyNameOrArn.split(':');
  const family = familyNameOrArnParts.length > 1
    // familyNameOrArn is actually an ARN, of the format 'arn:aws:ecs:region:account:task-definition/<family-name>:<revision-nr>'
    // so, take the 6th element, at index 5, and split it on '/'
    ? familyNameOrArnParts[5].split('/')[1]
    // otherwise, familyNameOrArn is just the simple name evaluated from the CloudFormation template
    : familyNameOrArn;
  // then, let's evaluate the body of the remainder of the TaskDef (without the Family property)
  const evaluatedTaskDef = {
    ...await evaluateCfnTemplate.evaluateCfnExpression({
      ...(taskDefinitionResource ?? {}),
      Family: undefined,
    }),
    Family: family,
  };
  return new EcsServiceHotswapOperation(evaluatedTaskDef, ecsServicesReferencingTaskDef);
}

interface EcsService {
  readonly serviceArn: string;
}

class EcsServiceHotswapOperation implements HotswapOperation {
  public readonly service = 'ecs-service';
  public readonly resourceNames: string[] = [];

  constructor(
    private readonly taskDefinitionResource: any,
    private readonly servicesReferencingTaskDef: EcsService[],
  ) {
    this.resourceNames = servicesReferencingTaskDef.map(ecsService =>
      `ECS Service '${ecsService.serviceArn.split('/')[2]}'`);
  }

  public async apply(sdk: ISDK): Promise<any> {
    // Step 1 - update the changed TaskDefinition, creating a new TaskDefinition Revision
    // we need to lowercase the evaluated TaskDef from CloudFormation,
    // as the AWS SDK uses lowercase property names for these
    const lowercasedTaskDef = transformObjectKeys(this.taskDefinitionResource, lowerCaseFirstCharacter);
    const registerTaskDefResponse = await sdk.ecs().registerTaskDefinition(lowercasedTaskDef).promise();
    const taskDefRevArn = registerTaskDefResponse.taskDefinition?.taskDefinitionArn;

    // Step 2 - update the services using that TaskDefinition to point to the new TaskDefinition Revision
    const servicePerClusterUpdates: { [cluster: string]: Array<{ promise: Promise<any>, ecsService: EcsService }> } = {};
    for (const ecsService of this.servicesReferencingTaskDef) {
      const clusterName = ecsService.serviceArn.split('/')[1];

      const existingClusterPromises = servicePerClusterUpdates[clusterName];
      let clusterPromises: Array<{ promise: Promise<any>, ecsService: EcsService }>;
      if (existingClusterPromises) {
        clusterPromises = existingClusterPromises;
      } else {
        clusterPromises = [];
        servicePerClusterUpdates[clusterName] = clusterPromises;
      }

      clusterPromises.push({
        promise: sdk.ecs().updateService({
          service: ecsService.serviceArn,
          taskDefinition: taskDefRevArn,
          cluster: clusterName,
          forceNewDeployment: true,
          deploymentConfiguration: {
            minimumHealthyPercent: 0,
          },
        }).promise(),
        ecsService: ecsService,
      });
    }
    await Promise.all(Object.values(servicePerClusterUpdates)
      .map(clusterUpdates => {
        return Promise.all(clusterUpdates.map(serviceUpdate => serviceUpdate.promise));
      }),
    );

    // Step 3 - wait for the service deployments triggered in Step 2 to finish
    // configure a custom Waiter
    (sdk.ecs() as any).api.waiters.deploymentToFinish = {
      name: 'DeploymentToFinish',
      operation: 'describeServices',
      delay: 10,
      maxAttempts: 60,
      acceptors: [
        {
          matcher: 'pathAny',
          argument: 'failures[].reason',
          expected: 'MISSING',
          state: 'failure',
        },
        {
          matcher: 'pathAny',
          argument: 'services[].status',
          expected: 'DRAINING',
          state: 'failure',
        },
        {
          matcher: 'pathAny',
          argument: 'services[].status',
          expected: 'INACTIVE',
          state: 'failure',
        },
        {
          matcher: 'path',
          argument: "length(services[].deployments[? status == 'PRIMARY' && runningCount < desiredCount][]) == `0`",
          expected: true,
          state: 'success',
        },
      ],
    };
    // create a custom Waiter that uses the deploymentToFinish configuration added above
    const deploymentWaiter = new (AWS as any).ResourceWaiter(sdk.ecs(), 'deploymentToFinish');
    // wait for all of the waiters to finish
    return Promise.all(Object.entries(servicePerClusterUpdates).map(([clusterName, serviceUpdates]) => {
      return deploymentWaiter.wait({
        cluster: clusterName,
        services: serviceUpdates.map(serviceUpdate => serviceUpdate.ecsService.serviceArn),
      }).promise();
    }));
  }
}
