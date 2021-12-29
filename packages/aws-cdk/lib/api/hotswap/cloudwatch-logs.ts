import * as cxapi from '@aws-cdk/cx-api';
import { LazyListStackResources } from '../hotswap-deployments';
import { Mode, SdkProvider } from './../aws-auth';
import { EvaluateCloudFormationTemplate } from './evaluate-cloudformation-template';
import { CloudWatchLogEventMonitor } from './monitor/logs-monitor';

export async function registerCloudWatchLogGroups(
  sdkProvider: SdkProvider,
  stackArtifact: cxapi.CloudFormationStackArtifact,
  assetParams: { [key: string]: string },
  hotswapLogMonitor: CloudWatchLogEventMonitor,
): Promise<void> {
  //
  // resolve the environment, so we can substitute things like AWS::Region in CFN expressions
  const resolvedEnv = await sdkProvider.resolveEnvironment(stackArtifact.environment);
  // create a new SDK using the CLI credentials, because the default one will not work for new-style synthesis -
  // it assumes the bootstrap deploy Role, which doesn't have permissions to update Lambda functions
  const sdk = await sdkProvider.forEnvironment(resolvedEnv, Mode.ForWriting);

  // add the sdk to the hotswapLogMonitor so that it also has the
  // correct credentials to monitor CloudWatch log groups
  hotswapLogMonitor.addSdk(sdk);
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

  const resources = await listStackResources.listStackResources();
  const allGroups = resources.filter(resource => resource.ResourceType === 'AWS::Logs::LogGroup');
  const functions = resources.filter(resource => resource.ResourceType === 'AWS::Lambda::Function');
  const functionLogGroups = await Promise.all(functions.map(async f => {
    const name = await evaluateCfnTemplate.findPhysicalNameFor(f.LogicalResourceId);
    return `/aws/lambda/${name}`;
  }));

  hotswapLogMonitor.addLogGroups(functionLogGroups);

  const relevantGroups = allGroups.filter(group => {
    const resourcesReferencingLogGroup = evaluateCfnTemplate.findReferencesTo(group.LogicalResourceId);
    return resourcesReferencingLogGroup.some(r => (r.Type === 'AWS::ECS::TaskDefinition' || r.Type === 'AWS::StepFunctions::StateMachine'));
  });

  for (let group of relevantGroups) {
    const groupName = await evaluateCfnTemplate.findPhysicalNameFor(group.LogicalResourceId);
    if (groupName) {
      hotswapLogMonitor.addLogGroups([groupName]);
    }
  }
}
