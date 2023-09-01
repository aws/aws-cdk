import * as AWS from 'aws-sdk';
import { ChangeHotswapResult, classifyChanges, HotswappableChangeCandidate, lowerCaseFirstCharacter, reportNonHotswappableChange, transformObjectKeys, upperCaseFirstCharacter, applyPropertyUpdates, evaluatableProperties } from './common';
import { ISDK } from '../aws-auth';
import { EvaluateCloudFormationTemplate } from '../evaluate-cloudformation-template';

export async function isHotswappableEcsServiceChange(
  logicalId: string, change: HotswappableChangeCandidate, evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): Promise<ChangeHotswapResult> {
  // the only resource change we can evaluate here is an ECS TaskDefinition
  if (change.newValue.Type !== 'AWS::ECS::TaskDefinition') {
    return [];
  }

  const ret: ChangeHotswapResult = [];

  // We only allow a change in the ContainerDefinitions of the TaskDefinition for now -
  // it contains the image and environment variables, so seems like a safe bet for now.
  // We might revisit this decision in the future though!
  const propertiesToHotswap = ['ContainerDefinitions'];
  const classifiedChanges = classifyChanges(change, propertiesToHotswap);
  classifiedChanges.reportNonHotswappablePropertyChanges(ret);

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
  if (ecsServicesReferencingTaskDef.length === 0) {
    // if there are no resources referencing the TaskDefinition,
    // hotswap is not possible in FALL_BACK mode
    reportNonHotswappableChange(ret, change, undefined, 'No ECS services reference the changed task definition', false);
  }
  if (resourcesReferencingTaskDef.length > ecsServicesReferencingTaskDef.length) {
    // if something besides an ECS Service is referencing the TaskDefinition,
    // hotswap is not possible in FALL_BACK mode
    const nonEcsServiceTaskDefRefs = resourcesReferencingTaskDef.filter(r => r.Type !== 'AWS::ECS::Service');
    for (const taskRef of nonEcsServiceTaskDefRefs) {
      reportNonHotswappableChange(ret, change, undefined, `A resource '${taskRef.LogicalId}' with Type '${taskRef.Type}' that is not an ECS Service was found referencing the changed TaskDefinition '${logicalId}'`);
    }
  }

  const namesOfHotswappableChanges = Object.keys(classifiedChanges.hotswappableProps);
  if (namesOfHotswappableChanges.length > 0) {
    const familyName = await getFamilyName(evaluateCfnTemplate, logicalId, change);
    if (familyName === undefined) {
      reportNonHotswappableChange(ret, change, undefined, 'Failed to determine family name of the task definition', false);
      return ret;
    }
    const oldTaskDefinitionArn = await evaluateCfnTemplate.findPhysicalNameFor(logicalId);
    if (oldTaskDefinitionArn === undefined) {
      reportNonHotswappableChange(ret, change, undefined, 'Failed to determine ARN of the task definition', false);
      return ret;
    }

    const changes = await evaluatableProperties(evaluateCfnTemplate, change, propertiesToHotswap);
    if (changes.unevaluatableUpdates.length > 0) {
      reportNonHotswappableChange(ret, change, undefined, `Found changes that cannot be evaluated locally in the task definition - ${
        changes.unevaluatableUpdates.map(p => p.key.join('.')).join(', ')
      }`, false);
      return ret;
    }

    ret.push({
      hotswappable: true,
      resourceType: change.newValue.Type,
      propsChanged: namesOfHotswappableChanges,
      service: 'ecs-service',
      resourceNames: [
        `ECS Task Definition '${familyName}'`,
        ...ecsServicesReferencingTaskDef.map(ecsService => `ECS Service '${ecsService.serviceArn.split('/')[2]}'`),
      ],
      apply: async (sdk: ISDK) => {
        // Step 1 - update the changed TaskDefinition, creating a new TaskDefinition Revision
        // we need to lowercase the evaluated TaskDef from CloudFormation,
        // as the AWS SDK uses lowercase property names for these

        // get the task definition of the family and revision corresponding to the old CFn template
        const target = await sdk
          .ecs()
          .describeTaskDefinition({
            taskDefinition: oldTaskDefinitionArn,
            include: ['TAGS'],
          })
          .promise();
        if (target.taskDefinition === undefined) {
          throw new Error(`Could not find a task definition: ${oldTaskDefinitionArn}. Try deploying without hotswap first.`);
        }

        // The describeTaskDefinition response contains several keys that must not exist in a registerTaskDefinition request.
        // We remove these keys here, comparing these two structs:
        // https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_RegisterTaskDefinition.html#API_RegisterTaskDefinition_RequestSyntax
        // https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_DescribeTaskDefinition.html#API_DescribeTaskDefinition_ResponseSyntax
        [
          'compatibilities',
          'taskDefinitionArn',
          'revision',
          'status',
          'requiresAttributes',
          'compatibilities',
          'registeredAt',
          'registeredBy',
        ].forEach(key=> delete (target.taskDefinition as any)[key]);

        // the tags field is in a different location in describeTaskDefinition response,
        // moving it as intended for registerTaskDefinition request.
        if (target.tags !== undefined && target.tags.length > 0) {
          (target.taskDefinition as any).tags = target.tags;
          delete target.tags;
        }

        // Don't transform the properties that take arbitrary string as keys i.e. { "string" : "string" }
        // https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_RegisterTaskDefinition.html#API_RegisterTaskDefinition_RequestSyntax
        const excludeFromTransform = {
          ContainerDefinitions: {
            DockerLabels: true,
            FirelensConfiguration: {
              Options: true,
            },
            LogConfiguration: {
              Options: true,
            },
          },
          Volumes: {
            DockerVolumeConfiguration: {
              DriverOpts: true,
              Labels: true,
            },
          },
        } as const;
        const excludeFromTransformLowercased = transformObjectKeys(excludeFromTransform, lowerCaseFirstCharacter);
        // We first uppercase the task definition to properly merge it with the one from CloudFormation template.
        const upperCasedTaskDef = transformObjectKeys(target.taskDefinition, upperCaseFirstCharacter, excludeFromTransformLowercased);
        // merge evaluatable diff from CloudFormation template.
        const updatedTaskDef = applyPropertyUpdates(changes.updates, upperCasedTaskDef);
        // lowercase the merged task definition to use it in AWS SDK.
        const lowercasedTaskDef = transformObjectKeys(updatedTaskDef, lowerCaseFirstCharacter, excludeFromTransform);

        const registerTaskDefResponse = await sdk.ecs().registerTaskDefinition(lowercasedTaskDef).promise();
        const taskDefRevArn = registerTaskDefResponse.taskDefinition?.taskDefinitionArn;

        // Step 2 - update the services using that TaskDefinition to point to the new TaskDefinition Revision
        const servicePerClusterUpdates: { [cluster: string]: Array<{ promise: Promise<any>, ecsService: EcsService }> } = {};
        for (const ecsService of ecsServicesReferencingTaskDef) {
          const clusterName = ecsService.serviceArn.split('/')[1];

          const existingClusterPromises = servicePerClusterUpdates[clusterName];
          let clusterPromises: Array<{ promise: Promise<any>, ecsService: EcsService }>;
          if (existingClusterPromises) {
            clusterPromises = existingClusterPromises;
          } else {
            clusterPromises = [];
            servicePerClusterUpdates[clusterName] = clusterPromises;
          }
          // Forcing New Deployment and setting Minimum Healthy Percent to 0.
          // As CDK HotSwap is development only, this seems the most efficient way to ensure all tasks are replaced immediately, regardless of original amount.
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
        await Promise.all(Object.entries(servicePerClusterUpdates).map(([clusterName, serviceUpdates]) => {
          return deploymentWaiter.wait({
            cluster: clusterName,
            services: serviceUpdates.map(serviceUpdate => serviceUpdate.ecsService.serviceArn),
          }).promise();
        }));
      },
    });
  }

  return ret;
}

interface EcsService {
  readonly serviceArn: string;
}

async function getFamilyName(
  evaluateCfnTemplate: EvaluateCloudFormationTemplate,
  logicalId: string,
  change: HotswappableChangeCandidate) {
  const taskDefinitionResource: { [name: string]: any } = {
    ...change.oldValue.Properties,
    ContainerDefinitions: change.newValue.Properties?.ContainerDefinitions,
  };
    // first, let's get the name of the family
  const familyNameOrArn = await evaluateCfnTemplate.establishResourcePhysicalName(logicalId, taskDefinitionResource?.Family);
  if (!familyNameOrArn) {
    // if the Family property has not been provided, and we can't find it in the current Stack,
    // this means hotswapping is not possible
    return;
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

  return family;
}
