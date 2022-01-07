import * as cxapi from '@aws-cdk/cx-api';
import { Mode, SdkProvider, ISDK } from '../aws-auth';
import { EvaluateCloudFormationTemplate, LazyListStackResources, establishResourcePhysicalName } from '../evaluate-cloudformation-template';

// resource types that have associated CloudWatch Log Groups that should _not_ be monitored
const IGNORE_LOGS_RESOURCE_TYPES = ['AWS::EC2::FlowLog', 'AWS::CloudTrail::Trail', 'AWS::CodeBuild::Project'];

// Resource types that will create a CloudWatch log group with a specific name if one is not provided.
// The keys are CFN resource types, and the values are the names of the physical name property of that resource.
const RESOURCE_TYPES_WITH_IMPLICIT_LOGS: { [cfnResourceType: string]: string } = {
  'AWS::Lambda::Function': 'FunctionName',
};

export async function findCloudWatchLogGroups(
  sdkProvider: SdkProvider,
  stackArtifact: cxapi.CloudFormationStackArtifact,
): Promise<{ env: cxapi.Environment, sdk: ISDK, logGroupNames: string[] }> {
  const resolvedEnv = await sdkProvider.resolveEnvironment(stackArtifact.environment);
  // TODO: update this to use the lookup role once https://github.com/aws/aws-cdk/pull/18277 is merged
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

  // map of logicalId to CloudFormation type
  // e.g. 'mylambdaFunction': 'AWS::Lambda::Function'
  const logicalIdsOfImplicitLogServices = new Map<string, string>();
  const logGroupNames: string[] = [];
  const logGroupLogicalIds = new Set<string>();
  const template = stackArtifact.template as { [section: string]: any };

  // do a first pass at identifying all log groups
  for (const [logicalId, resource] of Object.entries(template.Resources ?? {})) {
      const definition = resource as { [attributeName: string]: any };
      if (definition.Type === 'AWS::Logs::LogGroup') {
        logGroupLogicalIds.add(key);
      } else if (RESOURCE_TYPES_WITH_IMPLICIT_LOGS[definition.Type]) {
        logicalIdsOfImplicitLogServices.set(key, definition.Type);
      }
    }
  } else {
    return {
      env: resolvedEnv,
      sdk,
      logGroupNames: [],
    };
  }

  // For each log group in the template make:
  // 1. make sure it is not associated with an excluded type
  // 2. see if it is associated with a resource type that implicitely
  //   creates a log group so we know not to add the implicit log group later
  for (const logGroupLogicalId of logGroupLogicalIds) {
    const resourcesReferencingLogGroup = evaluateCfnTemplate.findReferencesTo(logGroupLogicalId);
    for (const reference of resourcesReferencingLogGroup) {
      if (IGNORE_LOGS_RESOURCE_TYPES.includes(reference.Type)) {
        logGroupLogicalIds.delete(logGroupLogicalId);
      } else if (RESOURCE_TYPES_WITH_IMPLICIT_LOGS[reference.Type]) {
        logicalIdsOfImplicitLogServices.delete(reference.LogicalId);
      }
    }
  }

  for (const logicalId of logGroupLogicalIds) {
    const physicalNameInTemplate = getPhysicalNameProperty(template.Resources[logicalId], 'LogGroupName');
    const groupName = await establishResourcePhysicalName(logicalId, physicalNameInTemplate, evaluateCfnTemplate);
    if (groupName) {
      logGroupNames.push(groupName);
    }
  }

  // some resources can be created with a custom log group (handled above).
  // if a custom log group is not created, then the service will create one with a
  // specific name i.e. '/aws/codebuild/project-name'
  for (const [logicalId, cfnResourceType] of logicalIdsOfImplicitLogServices) {
    const physicalNameProperty = RESOURCE_TYPES_WITH_IMPLICIT_LOGS[serviceName];
    const physicalNameInTemplate = getPhysicalNameProperty(template.Resources[logicalId], physicalNameProperty);
    const servicePart = serviceName.split('::')[1].toLowerCase();
    const name = await establishResourcePhysicalName(logicalId, physicalNameInTemplate, evaluateCfnTemplate);
    if (name) {
      logGroupNames.push(`/aws/${servicePart}/${name}`);
    }
  }

  return {
    env: resolvedEnv,
    sdk,
    logGroupNames,
  };
}

function getPhysicalNameProperty(templateResource: { [key: string]: any }, physicalNameProperty: string): any | undefined {
  return (templateResource.Properties ?? {})[physicalNameProperty];
}
