import * as cxapi from '@aws-cdk/cx-api';
import { Mode, SdkProvider } from './aws-auth';
import { EvaluateCloudFormationTemplate, LazyListStackResources } from './evaluate-cloudformation-template';
import { CloudWatchLogEventMonitor } from './monitor/logs-monitor';

// resource types that have associated CloudWatch Log Groups that should
// _not_ be monitored
const excludedTypes: string[] = ['AWS::EC2::FlowLog', 'AWS::CloudTrail::Trail'];

// resource types that will create a cloudwatch log group
// with a specific name if one is not provided
const implicitTypes: string[] = ['AWS::Lambda::Function', 'AWS::CodeBuild::Project'];

export async function registerCloudWatchLogGroups(
  sdkProvider: SdkProvider,
  stackArtifact: cxapi.CloudFormationStackArtifact,
  cloudWatchLogMonitor: CloudWatchLogEventMonitor,
): Promise<void> {

  const logGroupNames = new Array<string>();
  const logGroupLogicalIds = new Set<string>();
  const implicitMap = new Map<string, string>();
  //
  // resolve the environment, so we can substitute things like AWS::Region in CFN expressions
  const resolvedEnv = await sdkProvider.resolveEnvironment(stackArtifact.environment);
  // create a new SDK using the CLI credentials, because the default one will not work for new-style synthesis -
  // it assumes the bootstrap deploy Role, which doesn't have permissions to update Lambda functions
  const sdk = await sdkProvider.forEnvironment(resolvedEnv, Mode.ForReading);

  // add the sdk to the cloudWatchLogMonitor so that it also has the
  // correct credentials to monitor CloudWatch log groups
  cloudWatchLogMonitor.addSdk(sdk);
  // The current resources of the Stack.
  // We need them to figure out the physical name of a resource in case it wasn't specified by the user.
  // We fetch it lazily, to save a service call, in case all hotswapped resources have their physical names set.
  const listStackResources = new LazyListStackResources(sdk, stackArtifact.stackName);
  const evaluateCfnTemplate = new EvaluateCloudFormationTemplate({
    stackArtifact,
    parameters: {},
    account: resolvedEnv.account,
    region: resolvedEnv.region,
    partition: (await sdk.currentAccount()).partition,
    urlSuffix: sdk.getEndpointSuffix,
    listStackResources,
  });

  const resources = await listStackResources.listStackResources();

  // do a first pass at identifying all log groups
  for (const resource of resources) {
    if (resource.ResourceType === 'AWS::Logs::LogGroup') {
      logGroupLogicalIds.add(resource.LogicalResourceId);
      // track all the resources that will create a log group if one
      // is not provided
    } else if (implicitTypes.includes(resource.ResourceType)) {
      const pathPart = resource.ResourceType.split('::')[1].toLowerCase();
      implicitMap.set(resource.LogicalResourceId, pathPart);
    }
  }

  // For each log group in the template make:
  // 1. make sure it is not associated with an excluded type
  // 2. see if it is associated with a resource type that implicitely
  //   creates a log group so we know not to add the implicit log group later
  for (const id of logGroupLogicalIds) {
    const resourcesReferencingLogGroup = evaluateCfnTemplate.findReferencesTo(id);
    for (const r of resourcesReferencingLogGroup) {
      if (excludedTypes.includes(r.Type)) {
        logGroupLogicalIds.delete(id);
      } else if (implicitTypes.includes(r.Type)) {
        implicitMap.delete(r.LogicalId);
      }
    };
  }

  for (const id of logGroupLogicalIds) {
    const groupName = await evaluateCfnTemplate.findPhysicalNameFor(id);
    if (groupName) {
      logGroupNames.push(groupName);
    }
  }

  // some resources can be created with a custom log group (handled above).
  // if a custom log group is not created, then the service will create one with a
  // specific name i.e. '/aws/codebuild/project-name'
  for (const [logicalId, serviceName] of implicitMap) {
    const name = await evaluateCfnTemplate.findPhysicalNameFor(logicalId);
    if (name) {
      logGroupNames.push(`/aws/${serviceName}/${name}`);
    }
  }

  cloudWatchLogMonitor.addLogGroups(logGroupNames);
}
