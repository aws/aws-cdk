import * as cxapi from '@aws-cdk/cx-api';
import { Mode, SdkProvider, ISDK } from '../aws-auth';
import { prepareSdkWithLookupRoleFor } from '../cloudformation-deployments';
import { EvaluateCloudFormationTemplate, LazyListStackResources } from '../evaluate-cloudformation-template';

// resource types that have associated CloudWatch Log Groups that should _not_ be monitored
const IGNORE_LOGS_RESOURCE_TYPES = ['AWS::EC2::FlowLog', 'AWS::CloudTrail::Trail', 'AWS::CodeBuild::Project'];

// Resource types that will create a CloudWatch log group with a specific name if one is not provided.
// The keys are CFN resource types, and the values are the name of the physical name property of that resource
// and the service name that is used in the automatically created CloudWatch log group.
const RESOURCE_TYPES_WITH_IMPLICIT_LOGS: { [cfnResourceType: string]: { [key: string]: string } } = {
  'AWS::Lambda::Function': {
    PhysicalNamePropertyName: 'FunctionName',
    LogGroupServiceName: 'lambda',
  },
};

/**
 * Configuration needed to monitor CloudWatch Log Groups
 * found in a given CloudFormation Stack
 */
export interface FoundLogGroupsResult {
  /**
   * The resolved environment (account/region) that the log
   * groups are deployed in
   */
  readonly env: cxapi.Environment;

  /**
   * The SDK that can be used to read events from the CloudWatch
   * Log Groups in the given environment
   */
  readonly sdk: ISDK;

  /**
   * The names of the relevant CloudWatch Log Groups
   * in the given CloudFormation template
   */
  readonly logGroupNames: string[]
}

export async function findCloudWatchLogGroups(
  sdkProvider: SdkProvider,
  stackArtifact: cxapi.CloudFormationStackArtifact,
): Promise<FoundLogGroupsResult> {
  let sdk: ISDK;
  const resolvedEnv = await sdkProvider.resolveEnvironment(stackArtifact.environment);
  // try to assume the lookup role and fallback to the default credentials
  try {
    sdk = (await prepareSdkWithLookupRoleFor(sdkProvider, stackArtifact)).sdk;
  } catch (e) {
    sdk = (await sdkProvider.forEnvironment(resolvedEnv, Mode.ForReading)).sdk;
  }

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

  const template = stackArtifact.template as { [section: string]: any };

  let logGroupResources = findAllLogGroupResources(template.Resources);
  filterLogGroupResources(logGroupResources, evaluateCfnTemplate);
  const logGroupNames = await getLogGroupPhysicalNames(logGroupResources.logGroupLogicalIds, template.Resources, evaluateCfnTemplate);
  logGroupNames.push(
    ...(await getImplicitLogGroupPhysicalNames(logGroupResources.logicalIdsOfImplicitLogServices, template.Resources, evaluateCfnTemplate)),
  );

  return {
    env: resolvedEnv,
    sdk,
    logGroupNames,
  };
}

interface LogGroupResources {
  /**
   * List of LogicalIds of CloudWatch Log Groups
   */
  readonly logGroupLogicalIds: Set<string>;

  /**
   * map of logicalId to CloudFormation type
   * e.g. 'mylambdaFunction': 'AWS::Lambda::Function'
   */
  readonly logicalIdsOfImplicitLogServices: Map<string, string>;
}

/**
 * Find all AWS::Logs::LogGroup resources along with
 * any resources that implicitely create log groups (RESOURCE_TYPES_WITH_IMPLICIT_LOGS)
 */
function findAllLogGroupResources(
  templateResources: { [logicalId: string]: any },
): LogGroupResources {
  const logicalIdsOfImplicitLogServices = new Map<string, string>();
  const logGroupLogicalIds = new Set<string>();
  for (const [logicalId, resource] of Object.entries(templateResources ?? {})) {
    const definition = resource as { [attributeName: string]: any };
    if (definition.Type === 'AWS::Logs::LogGroup') {
      logGroupLogicalIds.add(logicalId);
    } else if (RESOURCE_TYPES_WITH_IMPLICIT_LOGS[definition.Type]) {
      logicalIdsOfImplicitLogServices.set(logicalId, definition.Type);
    }
  }
  return { logGroupLogicalIds, logicalIdsOfImplicitLogServices };
}

/**
 * For each log group in the template:
 * 1. make sure it is not associated with an excluded type
 * 2. see if it is associated with a resource type that implicitely
 *   creates a log group so we know not to add the implicit log group later
 */
function filterLogGroupResources(
  logGroupResources: LogGroupResources,
  evaluateCfnTemplate: EvaluateCloudFormationTemplate,
) {
  for (const logGroupLogicalId of logGroupResources.logGroupLogicalIds) {
    const resourcesReferencingLogGroup = evaluateCfnTemplate.findReferencesTo(logGroupLogicalId);
    for (const reference of resourcesReferencingLogGroup) {
      if (IGNORE_LOGS_RESOURCE_TYPES.includes(reference.Type)) {
        logGroupResources.logGroupLogicalIds.delete(logGroupLogicalId);
      } else if (RESOURCE_TYPES_WITH_IMPLICIT_LOGS[reference.Type]) {
        logGroupResources.logicalIdsOfImplicitLogServices.delete(reference.LogicalId);
      }
    }
  }
}

/**
 * Get the PhysicalNames of all the CloudWatch log groups in the template
 */
async function getLogGroupPhysicalNames(
  logGroupLogicalIds: Set<string>,
  templateResources: { [logicalId: string]: any },
  evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): Promise<string[]> {
  const logGroupNames: string[] = [];
  for (const logicalId of logGroupLogicalIds) {
    const physicalNameInTemplate = getPhysicalNameProperty(templateResources[logicalId], 'LogGroupName');
    const groupName = await evaluateCfnTemplate.establishResourcePhysicalName(logicalId, physicalNameInTemplate);
    if (groupName) {
      logGroupNames.push(groupName);
    }
  }
  return logGroupNames;
}

/**
 * Some resources will automatically create a CloudWatch log group if
 * one is not explicitely created (tracked with RESOURCE_TYPES_WITH_IMPLICIT_LOGS)
 *
 * If a custom log group is not created, then the service will create one with a
 * specific name i.e. '/aws/lambda/function-name'
 */
async function getImplicitLogGroupPhysicalNames(
  logicalIdsOfImplicitLogServices: Map<string, string>,
  templateResources: { [logicalId: string]: any },
  evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): Promise<string[]> {
  const logGroupNames: string[] = [];
  for (const [logicalId, cfnResourceType] of logicalIdsOfImplicitLogServices) {
    const physicalNameProperty = RESOURCE_TYPES_WITH_IMPLICIT_LOGS[cfnResourceType].PhysicalNamePropertyName;
    const physicalNameInTemplate = getPhysicalNameProperty(templateResources[logicalId], physicalNameProperty);
    const name = await evaluateCfnTemplate.establishResourcePhysicalName(logicalId, physicalNameInTemplate);
    if (name) {
      const servicePart = RESOURCE_TYPES_WITH_IMPLICIT_LOGS[cfnResourceType].LogGroupServiceName;
      logGroupNames.push(`/aws/${servicePart}/${name}`);
    }
  }
  return logGroupNames;
}

function getPhysicalNameProperty(templateResource: { [key: string]: any }, physicalNameProperty: string): any | undefined {
  return (templateResource.Properties ?? {})[physicalNameProperty];
}
