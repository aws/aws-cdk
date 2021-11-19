import * as cfn_diff from '@aws-cdk/cloudformation-diff';
import * as cxapi from '@aws-cdk/cx-api';
import { CloudFormation } from 'aws-sdk';
import { ISDK, Mode, SdkProvider } from './aws-auth';
import { DeployStackResult } from './deploy-stack';
import { ChangeHotswapImpact, ChangeHotswapResult, HotswapOperation, HotswappableChangeCandidate, ListStackResources } from './hotswap/common';
import { isHotswappableEcsServiceChange } from './hotswap/ecs-services';
import { EvaluateCloudFormationTemplate } from './hotswap/evaluate-cloudformation-template';
import { isHotswappableLambdaFunctionChange } from './hotswap/lambda-functions';
import { isHotswappableStateMachineChange } from './hotswap/stepfunctions-state-machines';
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
): Promise<DeployStackResult | undefined> {
  // resolve the environment, so we can substitute things like AWS::Region in CFN expressions
  const resolvedEnv = await sdkProvider.resolveEnvironment(stackArtifact.environment);
  // create a new SDK using the CLI credentials, because the default one will not work for new-style synthesis -
  // it assumes the bootstrap deploy Role, which doesn't have permissions to update Lambda functions
  const sdk = await sdkProvider.forEnvironment(resolvedEnv, Mode.ForWriting);
  // The current resources of the Stack.
  // We need them to figure out the physical name of a resource in case it wasn't specified by the user.
  // We fetch it lazily, to save a service call, in case all hotswapped resources have their physical names set.
  const listStackResources = new LazyListStackResources(sdk, stackArtifact.stackName);
  const evaluateCfnTemplate = new EvaluateCloudFormationTemplate({
    stackArtifact,
    parameters: assetParams,
    account: resolvedEnv.account,
    region: resolvedEnv.region,
    partition: (await sdk.currentAccount()).partition,
    urlSuffix: sdk.getEndpointSuffix,
    listStackResources,
  });

  const currentTemplate = await cloudFormationStack.template();
  const stackChanges = cfn_diff.diffTemplate(currentTemplate, stackArtifact.template);
  const hotswappableChanges = await findAllHotswappableChanges(stackChanges, evaluateCfnTemplate);
  if (!hotswappableChanges) {
    // this means there were changes to the template that cannot be short-circuited
    return undefined;
  }

  // apply the short-circuitable changes
  await applyAllHotswappableChanges(sdk, hotswappableChanges);

  return { noOp: hotswappableChanges.length === 0, stackArn: cloudFormationStack.stackId, outputs: cloudFormationStack.outputs, stackArtifact };
}

async function findAllHotswappableChanges(
  stackChanges: cfn_diff.TemplateDiff, evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): Promise<HotswapOperation[] | undefined> {
  let foundNonHotswappableChange = false;
  const promises: Array<Array<Promise<ChangeHotswapResult>>> = [];

  // gather the results of the detector functions
  stackChanges.resources.forEachDifference((logicalId: string, change: cfn_diff.ResourceDifference) => {
    const resourceHotswapEvaluation = isCandidateForHotswapping(change);

    if (resourceHotswapEvaluation === ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT) {
      foundNonHotswappableChange = true;
    } else if (resourceHotswapEvaluation === ChangeHotswapImpact.IRRELEVANT) {
      // empty 'if' just for flow-aware typing to kick in...
    } else {
      promises.push([
        isHotswappableLambdaFunctionChange(logicalId, resourceHotswapEvaluation, evaluateCfnTemplate),
        isHotswappableStateMachineChange(logicalId, resourceHotswapEvaluation, evaluateCfnTemplate),
        isHotswappableEcsServiceChange(logicalId, resourceHotswapEvaluation, evaluateCfnTemplate),
      ]);
    }
  });

  const changesDetectionResults: Array<Array<ChangeHotswapResult>> = [];
  for (const detectorResultPromises of promises) {
    const hotswapDetectionResults = await Promise.all(detectorResultPromises);
    changesDetectionResults.push(hotswapDetectionResults);
  }

  const hotswappableResources = new Array<HotswapOperation>();

  // resolve all detector results
  for (const hotswapDetectionResults of changesDetectionResults) {
    const perChangeHotswappableResources = new Array<HotswapOperation>();

    for (const result of hotswapDetectionResults) {
      if (typeof result !== 'string') {
        perChangeHotswappableResources.push(result);
      }
    }

    // if we found any hotswappable changes, return now
    if (perChangeHotswappableResources.length > 0) {
      hotswappableResources.push(...perChangeHotswappableResources);
      continue;
    }

    // no hotswappable changes found, so any REQUIRES_FULL_DEPLOYMENTs imply a non-hotswappable change
    for (const result of hotswapDetectionResults) {
      if (result === ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT) {
        foundNonHotswappableChange = true;
      }
    }
    // no REQUIRES_FULL_DEPLOYMENT implies that all results are IRRELEVANT
  }

  return foundNonHotswappableChange ? undefined : hotswappableResources;
}

/**
 * returns `ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT` if a resource was deleted, or a change that we cannot short-circuit occured.
 * Returns `ChangeHotswapImpact.IRRELEVANT` if a change that does not impact shortcircuiting occured, such as a metadata change.
 */
export function isCandidateForHotswapping(change: cfn_diff.ResourceDifference): HotswappableChangeCandidate | ChangeHotswapImpact {
  // a resource has been removed OR a resource has been added; we can't short-circuit that change
  if (!change.newValue || !change.oldValue) {
    return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
  }

  // Ignore Metadata changes
  if (change.newValue.Type === 'AWS::CDK::Metadata') {
    return ChangeHotswapImpact.IRRELEVANT;
  }

  return {
    newValue: change.newValue,
    propertyUpdates: change.propertyUpdates,
  };
}

async function applyAllHotswappableChanges(
  sdk: ISDK, hotswappableChanges: HotswapOperation[],
): Promise<void[]> {
  return Promise.all(hotswappableChanges.map(hotswapOperation => {
    return applyHotswappableChange(sdk, hotswapOperation);
  }));
}

async function applyHotswappableChange(sdk: ISDK, hotswapOperation: HotswapOperation): Promise<any> {
  // note the type of service that was successfully hotswapped in the User-Agent
  const customUserAgent = `cdk-hotswap/success-${hotswapOperation.service}`;
  sdk.appendCustomUserAgent(customUserAgent);

  try {
    return await hotswapOperation.apply(sdk);
  } finally {
    sdk.removeCustomUserAgent(customUserAgent);
  }
}

class LazyListStackResources implements ListStackResources {
  private stackResources: CloudFormation.StackResourceSummary[] | undefined;

  constructor(private readonly sdk: ISDK, private readonly stackName: string) {
  }

  async listStackResources(): Promise<CloudFormation.StackResourceSummary[]> {
    if (this.stackResources === undefined) {
      this.stackResources = await this.getStackResources();
    }
    return this.stackResources;
  }

  private async getStackResources(): Promise<CloudFormation.StackResourceSummary[]> {
    const ret = new Array<CloudFormation.StackResourceSummary>();
    let nextToken: string | undefined;
    do {
      const stackResourcesResponse = await this.sdk.cloudFormation().listStackResources({
        StackName: this.stackName,
        NextToken: nextToken,
      }).promise();
      ret.push(...(stackResourcesResponse.StackResourceSummaries ?? []));
      nextToken = stackResourcesResponse.NextToken;
    } while (nextToken);
    return ret;
  }
}
