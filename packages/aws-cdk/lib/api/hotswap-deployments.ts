import * as cfn_diff from '@aws-cdk/cloudformation-diff';
import * as cxapi from '@aws-cdk/cx-api';
import * as chalk from 'chalk';
import { print } from '../logging';
import { ISDK, Mode, SdkProvider } from './aws-auth';
import { DeployStackResult } from './deploy-stack';
import { EvaluateCloudFormationTemplate, LazyListStackResources } from './evaluate-cloudformation-template';
import { isHotswappableAppSyncChange } from './hotswap/appsync-mapping-templates';
//import { isHotswappableCodeBuildProjectChange } from './hotswap/code-build-projects';
import { ICON, ChangeHotswapImpact, ChangeHotswapResult, HotswappableChangeCandidate, HotswapMode, HotswappableChange, NonHotswappableChange } from './hotswap/common';
//import { isHotswappableEcsServiceChange } from './hotswap/ecs-services';
// import { isHotswappableLambdaFunctionChange } from './hotswap/lambda-functions';
// import { isHotswappableS3BucketDeploymentChange } from './hotswap/s3-bucket-deployments';
// import { isHotswappableStateMachineChange } from './hotswap/stepfunctions-state-machines';
import { loadCurrentTemplateWithNestedStacks, NestedStackNames } from './nested-stack-helpers';
import { CloudFormationStack } from './util/cloudformation';

/**
 * Perform a hotswap deployment,
 * short-circuiting CloudFormation if possible.
 * If it's not possible to short-circuit the deployment
 * (because the CDK Stack contains changes that cannot be deployed without CloudFormation),
 * returns `undefined`.
 */
export async function tryHotswapDeployment(
  sdkProvider: SdkProvider, assetParams: { [key: string]: string },
  cloudFormationStack: CloudFormationStack, stackArtifact: cxapi.CloudFormationStackArtifact,
  hotswapMode: HotswapMode,
): Promise<DeployStackResult | undefined> {
  // resolve the environment, so we can substitute things like AWS::Region in CFN expressions
  const resolvedEnv = await sdkProvider.resolveEnvironment(stackArtifact.environment);
  // create a new SDK using the CLI credentials, because the default one will not work for new-style synthesis -
  // it assumes the bootstrap deploy Role, which doesn't have permissions to update Lambda functions
  const sdk = (await sdkProvider.forEnvironment(resolvedEnv, Mode.ForWriting)).sdk;
  // The current resources of the Stack.
  // We need them to figure out the physical name of a resource in case it wasn't specified by the user.
  // We fetch it lazily, to save a service call, in case all hotswapped resources have their physical names set.
  const listStackResources = new LazyListStackResources(sdk, stackArtifact.stackName);
  const evaluateCfnTemplate = new EvaluateCloudFormationTemplate({
    template: stackArtifact.template,
    parameters: assetParams,
    account: resolvedEnv.account,
    region: resolvedEnv.region,
    partition: (await sdk.currentAccount()).partition,
    urlSuffix: (region) => sdk.getEndpointSuffix(region),
    listStackResources,
  });

  const currentTemplate = await loadCurrentTemplateWithNestedStacks(stackArtifact, sdk);
  const stackChanges = cfn_diff.diffTemplate(currentTemplate.deployedTemplate, stackArtifact.template);
  const hotswappableChanges = await findAllHotswappableChanges(
    stackChanges, evaluateCfnTemplate, sdk, currentTemplate.nestedStackNames, hotswapMode,
  );

  if (!hotswappableChanges || (hotswappableChanges.length === 0 && hotswapMode === HotswapMode.HOTSWAP)) {
    // this means there were changes to the template that cannot be short-circuited
    return undefined;
  }

  // apply the short-circuitable changes
  await applyAllHotswappableChanges(sdk, hotswappableChanges);

  return { noOp: hotswappableChanges.length === 0, stackArn: cloudFormationStack.stackId, outputs: cloudFormationStack.outputs };
}

async function findAllHotswappableChanges(
  stackChanges: cfn_diff.TemplateDiff,
  evaluateCfnTemplate: EvaluateCloudFormationTemplate,
  sdk: ISDK,
  nestedStackNames: { [nestedStackName: string]: NestedStackNames },
  hotswapMode: HotswapMode,
): Promise<HotswappableChange[] | undefined> {
  // Skip hotswap if there is any change on stack outputs
  if (stackChanges.outputs.differenceCount > 0 && hotswapMode === HotswapMode.HOTSWAP) {
    return undefined;
  }

  const resourceDifferences = getStackResourceDifferences(stackChanges);

  const promises: Array<() => Array<Promise<ChangeHotswapResult>>> = [];
  const hotswappableResources = new Array<HotswappableChange>();

  // gather the results of the detector functions
  for (const [logicalId, change] of Object.entries(resourceDifferences)) {
    if (change.newValue?.Type === 'AWS::CloudFormation::Stack' && change.oldValue?.Type === 'AWS::CloudFormation::Stack') {
      const nestedHotswappableResources = await findNestedHotswappableChanges(
        logicalId, change, nestedStackNames, evaluateCfnTemplate, sdk, hotswapMode,
      );
      if (!nestedHotswappableResources && hotswapMode === HotswapMode.HOTSWAP_ONLY) {
        // this nested stack was either newly created or contained no hotswappable resources
        // continue, so that other nested stacks and any hotswappable changes in this stack can be hotswapped
        continue;
      } else if (!nestedHotswappableResources) {
        return undefined;
      }
      hotswappableResources.push(...nestedHotswappableResources);
      continue;
    }

    const resourceHotswapEvaluation = isCandidateForHotswapping(change); // TODO

    if (resourceHotswapEvaluation === ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT) {
      if (hotswapMode === HotswapMode.HOTSWAP) {
        return undefined;
      }
    } else if (resourceHotswapEvaluation === ChangeHotswapImpact.IRRELEVANT) {
      // empty 'if' just for flow-aware typing to kick in...
    } else {
      // run isHotswappable* functions lazily to prevent unhandled rejections
      promises.push(() => [
        //isHotswappableLambdaFunctionChange(logicalId, resourceHotswapEvaluation, evaluateCfnTemplate, hotswapMode),
        //isHotswappableStateMachineChange(logicalId, resourceHotswapEvaluation, evaluateCfnTemplate, hotswapMode),
        //isHotswappableEcsServiceChange(logicalId, resourceHotswapEvaluation, evaluateCfnTemplate, hotswapMode),
        //isHotswappableS3BucketDeploymentChange(logicalId, resourceHotswapEvaluation, evaluateCfnTemplate),
        //isHotswappableCodeBuildProjectChange(logicalId, resourceHotswapEvaluation, evaluateCfnTemplate),
        isHotswappableAppSyncChange(logicalId, resourceHotswapEvaluation, evaluateCfnTemplate),
      ]);
    }
  }

  // resolve all detector results
  const changesDetectionResults: Array<Array<ChangeHotswapResult>> = [];
  for (const detectorResultPromises of promises) {
    const hotswapDetectionResults = await Promise.all(detectorResultPromises());
    changesDetectionResults.push(hotswapDetectionResults);
  }

  // we have a set of Resource detection results
  // that result is an array of length two; it has HotswappableProperties and NonHotswappableProperties
  // if there are any nonhotswappable properties && we have HOTSWAP, we should return undefined
  // otherwise there are only hotswappable properties && we have HOTSWAP, we should return HoswapOperation
  // if there are any hotswappable properties && we have HOTSWAP_ONLY, we should hotswap them
  // if there are no hotswappable properties and we have HOTSWAP_ONLY, we should return noOp

  for (const resourceDetectionResults of changesDetectionResults) {
    //const perChangeHotswappableResources = new Array<HotswappableChange>();
    const perChangeNonHotswappableResources = new Array<NonHotswappableChange>();

    for (const result of resourceDetectionResults) {
      for (const propertyResult of result) {
        if (propertyResult.hotswappable) {
          hotswappableResources.push(propertyResult);
        } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
          perChangeNonHotswappableResources.push(propertyResult);
        } else if (hotswapMode === HotswapMode.HOTSWAP) {
          return undefined;
        }
      }
    }
  }
  return hotswappableResources;
}

/**
 * Returns all changes to resources in the given Stack.
 *
 * @param stackChanges the collection of all changes to a given Stack
 */
function getStackResourceDifferences(stackChanges: cfn_diff.TemplateDiff): { [logicalId: string]: cfn_diff.ResourceDifference } {
  // we need to collapse logical ID rename changes into one change,
  // as they are represented in stackChanges as a pair of two changes: one addition and one removal
  const allResourceChanges: { [logId: string]: cfn_diff.ResourceDifference } = stackChanges.resources.changes;
  const allRemovalChanges = filterDict(allResourceChanges, resChange => resChange.isRemoval);
  const allNonRemovalChanges = filterDict(allResourceChanges, resChange => !resChange.isRemoval);
  for (const [logId, nonRemovalChange] of Object.entries(allNonRemovalChanges)) {
    if (nonRemovalChange.isAddition) {
      const addChange = nonRemovalChange;
      // search for an identical removal change
      const identicalRemovalChange = Object.entries(allRemovalChanges).find(([_, remChange]) => {
        return changesAreForSameResource(remChange, addChange);
      });
      // if we found one, then this means this is a rename change
      if (identicalRemovalChange) {
        const [removedLogId, removedResourceChange] = identicalRemovalChange;
        allNonRemovalChanges[logId] = makeRenameDifference(removedResourceChange, addChange);
        // delete the removal change that forms the rename pair
        delete allRemovalChanges[removedLogId];
      }
    }
  }
  // the final result are all of the remaining removal changes,
  // plus all of the non-removal changes
  // (we saved the rename changes in that object already)
  return {
    ...allRemovalChanges,
    ...allNonRemovalChanges,
  };
}

/** Filters an object with string keys based on whether the callback returns 'true' for the given value in the object. */
function filterDict<T>(dict: { [key: string]: T }, func: (t: T) => boolean): { [key: string]: T } {
  return Object.entries(dict).reduce((acc, [key, t]) => {
    if (func(t)) {
      acc[key] = t;
    }
    return acc;
  }, {} as { [key: string]: T });
}

/** Finds any hotswappable changes in all nested stacks. */
async function findNestedHotswappableChanges(
  logicalId: string,
  change: cfn_diff.ResourceDifference,
  nestedStackNames: { [nestedStackName: string]: NestedStackNames },
  evaluateCfnTemplate: EvaluateCloudFormationTemplate,
  sdk: ISDK,
  hotswapMode: HotswapMode,
): Promise<HotswappableChange[] | undefined> {
  const nestedStackName = nestedStackNames[logicalId].nestedStackPhysicalName;
  // the stack name could not be found in CFN, so this is a newly created nested stack
  if (!nestedStackName) {
    return undefined;
  }

  const nestedStackParameters = await evaluateCfnTemplate.evaluateCfnExpression(change.newValue?.Properties?.Parameters);
  const evaluateNestedCfnTemplate = evaluateCfnTemplate.createNestedEvaluateCloudFormationTemplate(
    new LazyListStackResources(sdk, nestedStackName), change.newValue?.Properties?.NestedTemplate, nestedStackParameters,
  );

  const nestedDiff = cfn_diff.diffTemplate(
    change.oldValue?.Properties?.NestedTemplate, change.newValue?.Properties?.NestedTemplate,
  );

  return findAllHotswappableChanges(nestedDiff, evaluateNestedCfnTemplate, sdk, nestedStackNames[logicalId].nestedChildStackNames, hotswapMode);
}

/** Returns 'true' if a pair of changes is for the same resource. */
function changesAreForSameResource(oldChange: cfn_diff.ResourceDifference, newChange: cfn_diff.ResourceDifference): boolean {
  return oldChange.oldResourceType === newChange.newResourceType &&
      // this isn't great, but I don't want to bring in something like underscore just for this comparison
      JSON.stringify(oldChange.oldProperties) === JSON.stringify(newChange.newProperties);
}

function makeRenameDifference(
  remChange: cfn_diff.ResourceDifference,
  addChange: cfn_diff.ResourceDifference,
): cfn_diff.ResourceDifference {
  return new cfn_diff.ResourceDifference(
    // we have to fill in the old value, because otherwise this will be classified as a non-hotswappable change
    remChange.oldValue,
    addChange.newValue,
    {
      resourceType: {
       oldType: remChange.oldResourceType,
        newType: addChange.newResourceType,
      },
      propertyDiffs: (addChange as any).propertyDiffs,
     otherDiffs: (addChange as any).otherDiffs,
    },
  );
}

/**
 * returns `ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT` if a resource was deleted, or a change that we cannot short-circuit occured.
 * Returns `ChangeHotswapImpact.IRRELEVANT` if a change that does not impact shortcircuiting occured, such as a metadata change.
 */
function isCandidateForHotswapping(change: cfn_diff.ResourceDifference): HotswappableChangeCandidate | ChangeHotswapImpact {
  // a resource has been removed OR a resource has been added; we can't short-circuit that change
  if (!change.newValue || !change.oldValue) {
    return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
  }

  // a resource has had its type changed
  if (change.newValue.Type !== change.oldValue.Type) {
    return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
  }

  // Ignore Metadata changes
  if (change.newValue.Type === 'AWS::CDK::Metadata') {
    return ChangeHotswapImpact.IRRELEVANT;
  }

  return {
    oldValue: change.oldValue,
    newValue: change.newValue,
    propertyUpdates: change.propertyUpdates,
  };
}

async function applyAllHotswappableChanges(sdk: ISDK, hotswappableChanges: HotswappableChange[]): Promise<void[]> {
  print(`\n${ICON} hotswapping resources:`);
  return Promise.all(hotswappableChanges.map(hotswapOperation => {
    return applyHotswappableChange(sdk, hotswapOperation);
  }));
}

async function applyHotswappableChange(sdk: ISDK, hotswapOperation: HotswappableChange): Promise<any> {
  // note the type of service that was successfully hotswapped in the User-Agent
  const customUserAgent = `cdk-hotswap/success-${hotswapOperation.service}`;
  sdk.appendCustomUserAgent(customUserAgent);

  try {
    for (const name of hotswapOperation.resourceNames) {
      print(`   ${ICON} %s`, chalk.bold(name));
    }
    return await hotswapOperation.apply(sdk);
  } finally {
    for (const name of hotswapOperation.resourceNames) {
      print(`${ICON} %s %s`, chalk.bold(name), chalk.green('hotswapped!'));
    }
    sdk.removeCustomUserAgent(customUserAgent);
  }
}
