import * as cfn_diff from '@aws-cdk/cloudformation-diff';
import * as cxapi from '@aws-cdk/cx-api';
import * as chalk from 'chalk';
import { ISDK, Mode, SdkProvider } from './aws-auth';
import { DeployStackResult } from './deploy-stack';
import { CfnEvaluationException, EvaluateCloudFormationTemplate, LazyListStackResources } from './evaluate-cloudformation-template';
import { isHotswappableAppSyncChange } from './hotswap/appsync-mapping-templates';
import { isHotswappableCodeBuildProjectChange } from './hotswap/code-build-projects';
import { ICON, ChangeHotswapResult, HotswapMode, HotswappableChange, NonHotswappableChange, HotswappableChangeCandidate, ClassifiedResourceChanges, reportNonHotswappableChange } from './hotswap/common';
import { isHotswappableEcsServiceChange } from './hotswap/ecs-services';
import { isHotswappableLambdaFunctionChange } from './hotswap/lambda-functions';
import { isHotswappableS3BucketDeploymentChange } from './hotswap/s3-bucket-deployments';
import { isHotswappableStateMachineChange } from './hotswap/stepfunctions-state-machines';
import { loadCurrentTemplateWithNestedStacks, NestedStackNames } from './nested-stack-helpers';
import { CloudFormationStack } from './util/cloudformation';
import { print } from '../logging';

type HotswapDetector = (
  logicalId: string, change: HotswappableChangeCandidate, evaluateCfnTemplate: EvaluateCloudFormationTemplate
) => Promise<ChangeHotswapResult>;

const RESOURCE_DETECTORS: { [key:string]: HotswapDetector } = {
  // Lambda
  'AWS::Lambda::Function': isHotswappableLambdaFunctionChange,
  'AWS::Lambda::Version': isHotswappableLambdaFunctionChange,
  'AWS::Lambda::Alias': isHotswappableLambdaFunctionChange,
  // AppSync
  'AWS::AppSync::Resolver': isHotswappableAppSyncChange,
  'AWS::AppSync::FunctionConfiguration': isHotswappableAppSyncChange,

  'AWS::ECS::TaskDefinition': isHotswappableEcsServiceChange,
  'AWS::CodeBuild::Project': isHotswappableCodeBuildProjectChange,
  'AWS::StepFunctions::StateMachine': isHotswappableStateMachineChange,
  'Custom::CDKBucketDeployment': isHotswappableS3BucketDeploymentChange,
  'AWS::IAM::Policy': isHotswappableS3BucketDeploymentChange,

  'AWS::CDK::Metadata': async () => [],
};

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
  const { hotswappableChanges, nonHotswappableChanges } = await classifyResourceChanges(
    stackChanges, evaluateCfnTemplate, sdk, currentTemplate.nestedStackNames,
  );

  logNonHotswappableChanges(nonHotswappableChanges, hotswapMode);

  // preserve classic hotswap behavior
  if (hotswapMode === HotswapMode.FALL_BACK) {
    if (nonHotswappableChanges.length > 0) {
      return undefined;
    }
  }

  // apply the short-circuitable changes
  await applyAllHotswappableChanges(sdk, hotswappableChanges);

  return { noOp: hotswappableChanges.length === 0, stackArn: cloudFormationStack.stackId, outputs: cloudFormationStack.outputs };
}

/**
 * Classifies all changes to all resources as either hotswappable or not.
 * Metadata changes are excluded from the list of (non)hotswappable resources.
 */
async function classifyResourceChanges(
  stackChanges: cfn_diff.TemplateDiff,
  evaluateCfnTemplate: EvaluateCloudFormationTemplate,
  sdk: ISDK,
  nestedStackNames: { [nestedStackName: string]: NestedStackNames },
): Promise<ClassifiedResourceChanges> {
  const resourceDifferences = getStackResourceDifferences(stackChanges);

  const promises: Array<() => Promise<ChangeHotswapResult>> = [];
  const hotswappableResources = new Array<HotswappableChange>();
  const nonHotswappableResources = new Array<NonHotswappableChange>();
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

      continue;
    }

    const hotswappableChangeCandidate = isCandidateForHotswapping(change, logicalId);
    // we don't need to run this through the detector functions, we can already judge this
    if ('hotswappable' in hotswappableChangeCandidate) {
      if (!hotswappableChangeCandidate.hotswappable) {
        nonHotswappableResources.push(hotswappableChangeCandidate);
      }

      continue;
    }

    const resourceType: string = hotswappableChangeCandidate.newValue.Type;
    if (resourceType in RESOURCE_DETECTORS) {
      // run detector functions lazily to prevent unhandled promise rejections
      promises.push(() => RESOURCE_DETECTORS[resourceType](logicalId, hotswappableChangeCandidate, evaluateCfnTemplate));
    } else {
      reportNonHotswappableChange(nonHotswappableResources, hotswappableChangeCandidate, undefined, 'This resource type is not supported for hotswap deployments');
    }
  }

  // resolve all detector results
  const changesDetectionResults: Array<ChangeHotswapResult> = [];
  for (const detectorResultPromises of promises) {
    const hotswapDetectionResults = await Promise.all(await detectorResultPromises());
    changesDetectionResults.push(hotswapDetectionResults);
  }

  for (const resourceDetectionResults of changesDetectionResults) {
    for (const propertyResult of resourceDetectionResults) {
      propertyResult.hotswappable ?
        hotswappableResources.push(propertyResult) :
        nonHotswappableResources.push(propertyResult);
    }
  }

  return {
    hotswappableChanges: hotswappableResources,
    nonHotswappableChanges: nonHotswappableResources,
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
): Promise<ClassifiedResourceChanges> {
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
    };
  }

  const nestedStackParameters = await evaluateCfnTemplate.evaluateCfnExpression(change.newValue?.Properties?.Parameters);
  const evaluateNestedCfnTemplate = evaluateCfnTemplate.createNestedEvaluateCloudFormationTemplate(
    new LazyListStackResources(sdk, nestedStackName), change.newValue?.Properties?.NestedTemplate, nestedStackParameters,
  );

  const nestedDiff = cfn_diff.diffTemplate(
    change.oldValue?.Properties?.NestedTemplate, change.newValue?.Properties?.NestedTemplate,
  );

  return classifyResourceChanges(nestedDiff, evaluateNestedCfnTemplate, sdk, nestedStackNames[logicalId].nestedChildStackNames);
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
      reason: `resource '${logicalId}' was created by this deployment`,
    };
  } else if (!change.newValue) {
    return {
      hotswappable: false,
      resourceType: change.oldValue!.Type,
      logicalId,
      rejectedChanges: [],
      reason: `resource '${logicalId}' was destroyed by this deployment`,
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

  return {
    logicalId,
    oldValue: change.oldValue,
    newValue: change.newValue,
    propertyUpdates: change.propertyUpdates,
  };
}

async function applyAllHotswappableChanges(sdk: ISDK, hotswappableChanges: HotswappableChange[]): Promise<void[]> {
  if (hotswappableChanges.length > 0) {
    print(`\n${ICON} hotswapping resources:`);
  }
  return Promise.all(hotswappableChanges.map(hotswapOperation => {
    return applyHotswappableChange(sdk, hotswapOperation);
  }));
}

async function applyHotswappableChange(sdk: ISDK, hotswapOperation: HotswappableChange): Promise<void> {
  // note the type of service that was successfully hotswapped in the User-Agent
  const customUserAgent = `cdk-hotswap/success-${hotswapOperation.service}`;
  sdk.appendCustomUserAgent(customUserAgent);

  for (const name of hotswapOperation.resourceNames) {
    print(`   ${ICON} %s`, chalk.bold(name));
  }

  // if the SDK call fails, an error will be thrown by the SDK
  // and will prevent the green 'hotswapped!' text from being displayed
  await hotswapOperation.apply(sdk);

  for (const name of hotswapOperation.resourceNames) {
    print(`${ICON} %s %s`, chalk.bold(name), chalk.green('hotswapped!'));
  }

  sdk.removeCustomUserAgent(customUserAgent);
}

function logNonHotswappableChanges(nonHotswappableChanges: NonHotswappableChange[], hotswapMode: HotswapMode): void {
  if (nonHotswappableChanges.length === 0) {
    return;
  }
  /**
   * EKS Services can have a task definition that doesn't refer to the task definition being updated.
   * We have to log this as a non-hotswappable change to the task definition, but when we do,
   * we wind up hotswapping the task definition and logging it as a non-hotswappable change.
   *
   * This logic prevents us from logging that change as non-hotswappable when we hotswap it.
   */
  if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
    nonHotswappableChanges = nonHotswappableChanges.filter((change) => change.hotswapOnlyVisible === true);

    if (nonHotswappableChanges.length === 0) {
      return;
    }
  }
  if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
    print('\n%s %s', chalk.red('⚠️'), chalk.red('The following non-hotswappable changes were found. To reconcile these using CloudFormation, specify --hotswap-fallback'));
  } else {
    print('\n%s %s', chalk.red('⚠️'), chalk.red('The following non-hotswappable changes were found:'));
  }

  for (const change of nonHotswappableChanges) {
    change.rejectedChanges.length > 0 ?
      print('    logicalID: %s, type: %s, rejected changes: %s, reason: %s', chalk.bold(change.logicalId), chalk.bold(change.resourceType), chalk.bold(change.rejectedChanges), chalk.red(change.reason)):
      print('    logicalID: %s, type: %s, reason: %s', chalk.bold(change.logicalId), chalk.bold(change.resourceType), chalk.red(change.reason));
  }

  print(''); // newline
}

type ChangedProps = {
  /**
   * Array to specify the property from an object.
   * e.g. Given this object `{ 'a': { 'b': 1 } }`, the key array for the element `1` will be `['a', 'b']`
   */
  key: string[];

  /**
   * Whether the property is added (also modified) or removed.
   */
  type: 'removed' | 'added';

  /**
   * evaluated value of the property.
   * undefined if type == 'removed'
   */
  value?: any
};

function detectChangedProps(next: any, prev: any): ChangedProps[] {
  const changedProps: ChangedProps[] = [];
  changedProps.push(...detectAdditions(next, prev));
  changedProps.push(...detectRemovals(next, prev));
  return changedProps;
}

function detectAdditions(next: any, prev: any, keys: string[] = []): ChangedProps[] {
  // Compare each value of two objects, detect additions (added or modified properties)
  // If we encounter CFn intrinsic (key.startsWith('Fn::') || key == 'Ref'), stop recursion

  if (typeof next !== 'object') {
    if (next !== prev) {
      // there is an addition or change to the property
      return [{ key: new Array(...keys), type: 'added' }];
    } else {
      return [];
    }
  }

  if (typeof prev !== 'object') {
    // there is an addition or change to the property
    return [{ key: new Array(...keys), type: 'added' }];
  }

  // If the next is a CFn intrinsic, don't recurse further.
  const childKeys = Object.keys(next);
  if (childKeys.length === 1 && (childKeys[0].startsWith('Fn::') || childKeys[0] === 'Ref')) {
    if (!deepCompareObject(prev, next)) {
      // there is an addition or change to the property
      return [{ key: new Array(...keys), type: 'added' }];
    } else {
      return [];
    }
  }

  const changedProps: ChangedProps[] = [];
  // compare children
  for (const key of childKeys) {
    keys.push(key);
    changedProps.push(...detectAdditions((next as any)[key], (prev as any)[key], keys));
    keys.pop();
  }
  return changedProps;
}

function detectRemovals(next: any, prev: any, keys: string[] = []): ChangedProps[] {
  // Compare each value of two objects, detect removed properties
  // To do this, find any keys that exist only in prev object.
  // If we encounter CFn intrinsic (key.startsWith('Fn::') || key == 'Ref'), stop recursion
  if (next === undefined) {
    return [{ key: new Array(...keys), type: 'removed' }];
  }

  if (typeof prev !== 'object' || typeof next !== 'object') {
    // either prev or next is not an object nor undefined, then the property is not removed
    return [];
  }

  // If the prev is a CFn intrinsic, don't recurse further.
  const childKeys = Object.keys(prev);
  if (childKeys.length === 1 && (childKeys[0].startsWith('Fn::') || childKeys[0] === 'Ref')) {
    // next is not undefined here, so it is at least not removed
    return [];
  }

  const changedProps: ChangedProps[] = [];
  // compare children
  for (const key of childKeys) {
    keys.push(key);
    changedProps.push(...detectRemovals((next as any)[key], (prev as any)[key], keys));
    keys.pop();
  }
  return changedProps;
}

/**
 * return true when two objects are identical
 */
function deepCompareObject(lhs: any, rhs: any): boolean {
  if (typeof lhs !== 'object') {
    return lhs === rhs;
  }
  if (typeof rhs !== 'object') {
    return false;
  }
  if (Object.keys(lhs).length != Object.keys(rhs).length) {
    return false;
  }
  for (const key of Object.keys(lhs)) {
    if (!deepCompareObject((lhs as any)[key], (rhs as any)[key])) {
      return false;
    }
  }
  return true;
}

interface EvaluatedPropertyUpdates {
  readonly updates: ChangedProps[];
  readonly unevaluatableUpdates: ChangedProps[];
}

/**
 * Diff each property of the changes, and check if each diff can be actually hotswapped (i.e. evaluated by EvaluateCloudFormationTemplate.)
 * If any diff cannot be evaluated, they are reported by unevaluatableUpdates.
 * This method works on more granular level than HotswappableChangeCandidate.propertyUpdates.
 */
export async function evaluatableProperties(
  evaluate: EvaluateCloudFormationTemplate,
  change: HotswappableChangeCandidate,
  PropertiesToInclude: string[],
  transform?: (obj: any) => any,
): Promise<EvaluatedPropertyUpdates> {
  transform = transform ?? ((obj: any) => obj);
  const prev = transform(change.oldValue.Properties!);
  const next = transform(change.newValue.Properties!);
  const changedProps = detectChangedProps(next, prev).filter(
    prop => PropertiesToInclude.includes(prop.key[0]),
  );
  const evaluatedUpdates = await Promise.all(
    changedProps
      .filter((prop) => prop.type === 'added')
      .map(async (prop) => {
        const val = getPropertyFromKey(prop.key, next);
        try {
          const evaluated = await evaluate.evaluateCfnExpression(val);
          return {
            ...prop,
            value: evaluated,
          };
        } catch (e) {
          if (e instanceof CfnEvaluationException) {
            return prop;
          }
          throw e;
        }
      }));
  const unevaluatableUpdates = evaluatedUpdates.filter(update => update.value === undefined);
  evaluatedUpdates.push(...changedProps.filter(prop => prop.type == 'removed'));

  return {
    updates: evaluatedUpdates,
    unevaluatableUpdates,
  };
}

function getPropertyFromKey(key: string[], obj: object) {
  return key.reduce((prev, cur) => (prev as any)?.[cur], obj);
}

function overwriteProperty(key: string[], newValue: any, target: object) {
  for (const next of key.slice(0, -1)) {
    if (next in target) {
      target = (target as any)[next];
    } else if (Array.isArray(target)) {
      // When an element is added to an array, we need explicitly allocate the new element.
      target = {};
      (target as any)[next] = {};
    } else {
      // This is an unexpected condition. Perhaps the deployed task definition is modified outside of CFn.
      return false;
    }
  }
  if (newValue === undefined) {
    delete (target as any)[key[key.length - 1]];
  } else {
    (target as any)[key[key.length - 1]] = newValue;
  }
  return true;
}

/**
 * Take the old template and property updates, and synthesize a new template.
 */
export function applyPropertyUpdates(patches: ChangedProps[], target: any) {
  target = JSON.parse(JSON.stringify(target));
  for (const patch of patches) {
    const res = overwriteProperty(patch.key, patch.value, target);
    if (!res) {
      throw new Error(`failed to applying patch to ${patch.key.join('.')}. Please try deploying without hotswap first.`);
    }
  }
  return target;
}
