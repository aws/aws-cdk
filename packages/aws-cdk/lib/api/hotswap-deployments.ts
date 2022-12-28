import * as cfn_diff from '@aws-cdk/cloudformation-diff';
import * as cxapi from '@aws-cdk/cx-api';
import * as chalk from 'chalk';
import { print } from '../logging';
import { ISDK, Mode, SdkProvider } from './aws-auth';
import { DeployStackResult } from './deploy-stack';
import { EvaluateCloudFormationTemplate, LazyListStackResources } from './evaluate-cloudformation-template';
import { isHotswappableAppSyncChange } from './hotswap/appsync-mapping-templates';
import { isHotswappableCodeBuildProjectChange } from './hotswap/code-build-projects';
import { ICON, ChangeHotswapResult, HotswapMode, HotswappableChange, NonHotswappableChange, HotswappableChangeCandidate, AllChanges } from './hotswap/common';
import { isHotswappableEcsServiceChange } from './hotswap/ecs-services';
import { isHotswappableLambdaFunctionChange } from './hotswap/lambda-functions';
import { isHotswappableS3BucketDeploymentChange } from './hotswap/s3-bucket-deployments';
import { isHotswappableStateMachineChange } from './hotswap/stepfunctions-state-machines';
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
  const { hotswappableChanges, nonHotswappableChanges, metadataChanged } = await findAllHotswappableChanges(
    stackChanges, evaluateCfnTemplate, sdk, currentTemplate.nestedStackNames,
  );

  // preserve classic hotswap behavior
  if (hotswapMode === HotswapMode.CLASSIC) {
    // The only change detected was to CDK::Metadata, so return noOp
    if (hotswappableChanges.length === 0 && nonHotswappableChanges.length === 0 && metadataChanged) {
      return { noOp: true, stackArn: cloudFormationStack.stackId, outputs: cloudFormationStack.outputs };
    }

    // the number of hotswappable resources is less than the number of changes
    // this means that at least one change was deemed not hotswappable by every detector function,
    // ie they all returned { hotswappableChanges: [], ... }
    if (hotswappableChanges.length < Object.keys(getStackResourceDifferences(stackChanges)).length) {
      return undefined;
    }

    if (nonHotswappableChanges.length > 0) {
      return undefined;
    }
  }

  // apply the short-circuitable changes
  await applyAllHotswappableChanges(sdk, hotswappableChanges);
  if (nonHotswappableChanges.length > 0) {
    logNonHotswappableChanges(nonHotswappableChanges);
  }

  return { noOp: hotswappableChanges.length === 0, stackArn: cloudFormationStack.stackId, outputs: cloudFormationStack.outputs };
}

async function findAllHotswappableChanges(
  stackChanges: cfn_diff.TemplateDiff,
  evaluateCfnTemplate: EvaluateCloudFormationTemplate,
  sdk: ISDK,
  nestedStackNames: { [nestedStackName: string]: NestedStackNames },
): Promise<AllChanges> {
  const resourceDifferences = getStackResourceDifferences(stackChanges);

  const promises: Array<() => Array<Promise<ChangeHotswapResult>>> = [];
  const hotswappableResources = new Array<HotswappableChange>();
  const nonHotswappableResources = new Array<NonHotswappableChange>();
  let metadataChanged = false;

  for (const logicalId of Object.keys(stackChanges.outputs.changes)) {
    nonHotswappableResources.push({
      hotswappable: false,
      reason: 'output was changed',
      logicalId,
      rejectedChanges: [],
      resourceType: 'Stack Output',
    });
  }
  // gather the results of the detector functions
  for (const [logicalId, change] of Object.entries(resourceDifferences)) {
    if (change.newValue?.Type === 'AWS::CloudFormation::Stack' && change.oldValue?.Type === 'AWS::CloudFormation::Stack') {
      const nestedHotswappableResources = await findNestedHotswappableChanges(logicalId, change, nestedStackNames, evaluateCfnTemplate, sdk);
      hotswappableResources.push(...nestedHotswappableResources.hotswappableChanges);
      nonHotswappableResources.push(...nestedHotswappableResources.nonHotswappableChanges);
    }

    const resourceHotswapEvaluation = isCandidateForHotswapping(change, logicalId);
    // we don't need to run this through the detector functions, we can already judge this
    if ('hotswappable' in resourceHotswapEvaluation) {
      if (!resourceHotswapEvaluation.hotswappable) {
        nonHotswappableResources.push(resourceHotswapEvaluation);
      } else {
        // the only hotswappable type `isCandidateForHotswapping` can return is Metadata
        metadataChanged = true;
      }

      continue;
    }

    // run detector functions lazily to prevent unhandled promise rejections
    promises.push(() => [
      // each detector function returns an array of HotswappableChanges and NonHotswappableChanges.
      // if the array is empty, then that detector function had no opinion on that change.
      // For example, a change to an AWS::Lambda::Function will result in every detector function
      // except for `isHotswappableLambdaFunctionChange` returning `[]`.
      isHotswappableLambdaFunctionChange(logicalId, resourceHotswapEvaluation, evaluateCfnTemplate),
      isHotswappableS3BucketDeploymentChange(logicalId, resourceHotswapEvaluation, evaluateCfnTemplate),
      isHotswappableStateMachineChange(logicalId, resourceHotswapEvaluation, evaluateCfnTemplate),
      isHotswappableEcsServiceChange(logicalId, resourceHotswapEvaluation, evaluateCfnTemplate),
      isHotswappableCodeBuildProjectChange(logicalId, resourceHotswapEvaluation, evaluateCfnTemplate),
      isHotswappableAppSyncChange(logicalId, resourceHotswapEvaluation, evaluateCfnTemplate),
    ]);
  }

  // resolve all detector results
  const changesDetectionResults: Array<Array<ChangeHotswapResult>> = [];
  for (const detectorResultPromises of promises) {
    const hotswapDetectionResults = await Promise.all(detectorResultPromises());
    changesDetectionResults.push(hotswapDetectionResults);
  }

  for (const resourceDetectionResults of changesDetectionResults) {
    for (const result of resourceDetectionResults) {
      for (const propertyResult of result) {
        propertyResult.hotswappable ?
          hotswappableResources.push(propertyResult) :
          nonHotswappableResources.push(propertyResult);
      }
    }
  }


  return {
    hotswappableChanges: hotswappableResources,
    nonHotswappableChanges: nonHotswappableResources,
    metadataChanged,
  };
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
): Promise<AllChanges> {
  const nestedStackName = nestedStackNames[logicalId].nestedStackPhysicalName;
  if (!nestedStackName) {
    return {
      hotswappableChanges: [],
      nonHotswappableChanges: [{
        hotswappable: false,
        logicalId,
        reason: `physical name for AWS::CloudFormation::Stack '${logicalId}' could not be found in CloudFormation, so this is a newly created nested stack and cannot be hotswapped`,
        rejectedChanges: [],
        resourceType: 'AWS::CloudFormation::Stack',
      }],
      metadataChanged: false, // false, since this won't deploy anyway
    };
  }

  const nestedStackParameters = await evaluateCfnTemplate.evaluateCfnExpression(change.newValue?.Properties?.Parameters);
  const evaluateNestedCfnTemplate = evaluateCfnTemplate.createNestedEvaluateCloudFormationTemplate(
    new LazyListStackResources(sdk, nestedStackName), change.newValue?.Properties?.NestedTemplate, nestedStackParameters,
  );

  const nestedDiff = cfn_diff.diffTemplate(
    change.oldValue?.Properties?.NestedTemplate, change.newValue?.Properties?.NestedTemplate,
  );

  return findAllHotswappableChanges(nestedDiff, evaluateNestedCfnTemplate, sdk, nestedStackNames[logicalId].nestedChildStackNames);
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
 * Returns a `HotswappableChangeCandidate` if the change is hotswappable
 * Returns an empty `HotswappableChange` if the change is to CDK::Metadata
 * Returns a `NonHotswappableChange` if the change is not hotswappable
 */
function isCandidateForHotswapping(
  change: cfn_diff.ResourceDifference, logicalId: string,
): HotswappableChange | NonHotswappableChange | HotswappableChangeCandidate {
  // a resource has been removed OR a resource has been added; we can't short-circuit that change
  if (!change.oldValue) {
    return {
      hotswappable: false,
      resourceType: change.newValue!.Type,
      logicalId,
      rejectedChanges: [],
      reason: `resource ${logicalId} was created`,
    };
  } else if (!change.newValue) {
    return {
      hotswappable: false,
      resourceType: change.oldValue!.Type,
      logicalId,
      rejectedChanges: [],
      reason: `resource '${logicalId}' was destroyed`,
    };
  }

  // a resource has had its type changed
  if (change.newValue?.Type !== change.oldValue?.Type) {
    return {
      hotswappable: false,
      resourceType: change.newValue?.Type,
      logicalId,
      rejectedChanges: [],
      reason: `resource '${logicalId}' had its type changed from '${change.oldValue?.Type}' to '${change.newValue?.Type}'`,
    };
  }

  // Ignore Metadata changes
  if (change.newValue.Type === 'AWS::CDK::Metadata') {
    return {
      hotswappable: true,
      resourceType: change.newValue?.Type,
      propsChanged: [],
      resourceNames: [],
      service: 'cdk',
      apply: async (_sdk: ISDK) => {},
    };
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

async function applyHotswappableChange(sdk: ISDK, hotswapOperation: HotswappableChange): Promise<void> {
  // note the type of service that was successfully hotswapped in the User-Agent
  const customUserAgent = `cdk-hotswap/success-${hotswapOperation.service}`;
  sdk.appendCustomUserAgent(customUserAgent);

  try {
    for (const name of hotswapOperation.resourceNames) {
      print(`   ${ICON} %s`, chalk.bold(name));
    }
    await hotswapOperation.apply(sdk);
  } finally {
    for (const name of hotswapOperation.resourceNames) {
      print(`${ICON} %s %s`, chalk.bold(name), chalk.green('hotswapped!'));
    }
    sdk.removeCustomUserAgent(customUserAgent);
  }
}

function logNonHotswappableChanges(nonHotswappableChanges: NonHotswappableChange[]): void {
  print(`\n${ICON} %s`, chalk.red('the following non-hotswappable changes were found:'));
  for (const change of nonHotswappableChanges) {
    let reason = change.reason;
    if (!reason) {
      reason = `resource properties '${change.rejectedChanges}' are not hotswappable on this resource type`;
    }
    change.rejectedChanges.length > 0 ?
      print(`${ICON} logicalID: %s, type: %s, rejected changes: %s, reason: %s`, chalk.bold(change.logicalId), chalk.bold(change.resourceType), chalk.bold(change.rejectedChanges), chalk.red(reason)):
      print(`${ICON} logicalID: %s, type: %s, reason: %s`, chalk.bold(change.logicalId), chalk.bold(change.resourceType), chalk.red(reason));
  }
}
