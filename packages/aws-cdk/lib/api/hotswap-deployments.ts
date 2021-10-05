import * as cfn_diff from '@aws-cdk/cloudformation-diff';
import * as cxapi from '@aws-cdk/cx-api';
import { CloudFormation } from 'aws-sdk';
import { ISDK, Mode, SdkProvider } from './aws-auth';
import { DeployStackResult } from './deploy-stack';
import { ChangeHotswapImpact, ChangeHotswapResult, HotswapOperation, ListStackResources } from './hotswap/common';
import { EvaluateCloudFormationTemplate } from './hotswap/evaluate-cloudformation-template';
import { isHotswappableLambdaFunctionChange } from './hotswap/lambda-functions';
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
    // ToDo make this better:
    partition: 'aws',
    // ToDo make this better:
    urlSuffix: 'amazonaws.com',
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
  const promises = new Array<Promise<ChangeHotswapResult>>();
  stackChanges.resources.forEachDifference(async (logicalId: string, change: cfn_diff.ResourceDifference) => {
    promises.push(isHotswappableLambdaFunctionChange(logicalId, change, evaluateCfnTemplate));
  });
  return Promise.all(promises).then(hotswapDetectionResults => {
    const hotswappableResources = new Array<HotswapOperation>();
    let foundNonHotswappableChange = false;
    for (const lambdaFunctionShortCircuitChange of hotswapDetectionResults) {
      if (lambdaFunctionShortCircuitChange === ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT) {
        foundNonHotswappableChange = true;
      } else if (lambdaFunctionShortCircuitChange === ChangeHotswapImpact.IRRELEVANT) {
        // empty 'if' just for flow-aware typing to kick in...
      } else {
        hotswappableResources.push(lambdaFunctionShortCircuitChange);
      }
    }
    return foundNonHotswappableChange ? undefined : hotswappableResources;
  });
}

async function applyAllHotswappableChanges(
  sdk: ISDK, hotswappableChanges: HotswapOperation[],
): Promise<void[]> {
  return Promise.all(hotswappableChanges.map(hotswapOperation => {
    return hotswapOperation.apply(sdk);
  }));
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
