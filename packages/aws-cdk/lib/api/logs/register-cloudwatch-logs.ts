import * as cxapi from '@aws-cdk/cx-api';
import { Mode, SdkProvider, ISDK } from '../aws-auth';
import { EvaluateCloudFormationTemplate, LazyListStackResources } from '../evaluate-cloudformation-template';

// resource types that have associated CloudWatch Log Groups that should
// _not_ be monitored
const IGNORE_LOGS_RESOURCE_TYPES = ['AWS::EC2::FlowLog', 'AWS::CloudTrail::Trail'];

// resource types that will create a cloudwatch log group
// with a specific name if one is not provided
const RESOURCE_TYPES_WITH_IMPLICIT_LOGS = ['AWS::Lambda::Function', 'AWS::CodeBuild::Project'];

export async function registerCloudWatchLogGroups(
  sdkProvider: SdkProvider,
  stackArtifact: cxapi.CloudFormationStackArtifact,
): Promise<{ env: cxapi.Environment, sdk: ISDK, logGroupNames: string[] }> {


  const resolvedEnv = await sdkProvider.resolveEnvironment(stackArtifact.environment);
  const sdk = await sdkProvider.forEnvironment(resolvedEnv, Mode.ForReading);

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

  const logGroupLogicalIds = new Set<string>();
  // map of logicalId to AWS service name
  // e.g. mylambdaFunction: lambda
  const logicalIdsOfImplicitLogServices = new Map<string, string>();
  //
  // do a first pass at identifying all log groups
  for (const resource of resources) {
    if (resource.ResourceType === 'AWS::Logs::LogGroup') {
      logGroupLogicalIds.add(resource.LogicalResourceId);
      // track all the resources that will create a log group if one
      // is not provided
    } else if (RESOURCE_TYPES_WITH_IMPLICIT_LOGS.includes(resource.ResourceType)) {
      const pathPart = resource.ResourceType.split('::')[1].toLowerCase();
      logicalIdsOfImplicitLogServices.set(resource.LogicalResourceId, pathPart);
    }
  }

  // For each log group in the template make:
  // 1. make sure it is not associated with an excluded type
  // 2. see if it is associated with a resource type that implicitely
  //   creates a log group so we know not to add the implicit log group later
  for (const id of logGroupLogicalIds) {
    const resourcesReferencingLogGroup = evaluateCfnTemplate.findReferencesTo(id);
    for (const r of resourcesReferencingLogGroup) {
      if (IGNORE_LOGS_RESOURCE_TYPES.includes(r.Type)) {
        logGroupLogicalIds.delete(id);
      } else if (RESOURCE_TYPES_WITH_IMPLICIT_LOGS.includes(r.Type)) {
        logicalIdsOfImplicitLogServices.delete(r.LogicalId);
      }
    }
  }

  const logGroupNames: string[] = [];
  for (const id of logGroupLogicalIds) {
    const groupName = await evaluateCfnTemplate.findPhysicalNameFor(id);
    if (groupName) {
      logGroupNames.push(groupName);
    }
  }

  // some resources can be created with a custom log group (handled above).
  // if a custom log group is not created, then the service will create one with a
  // specific name i.e. '/aws/codebuild/project-name'
  for (const [logicalId, serviceName] of logicalIdsOfImplicitLogServices) {
    const name = await evaluateCfnTemplate.findPhysicalNameFor(logicalId);
    if (name) {
      logGroupNames.push(`/aws/${serviceName}/${name}`);
    }
  }

  return {
    env: resolvedEnv,
    sdk,
    logGroupNames,
  };
}
