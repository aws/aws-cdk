import * as cxapi from '@aws-cdk/cx-api';
import { CloudFormation } from 'aws-sdk';
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
  } catch {
    sdk = (await sdkProvider.forEnvironment(resolvedEnv, Mode.ForReading)).sdk;
  }

  const listStackResources = new LazyListStackResources(sdk, stackArtifact.stackName);
  const evaluateCfnTemplate = new EvaluateCloudFormationTemplate({
    template: stackArtifact.template,
    parameters: {},
    account: resolvedEnv.account,
    region: resolvedEnv.region,
    partition: (await sdk.currentAccount()).partition,
    urlSuffix: (region) => sdk.getEndpointSuffix(region),
    listStackResources,
  });

  const stackResources = await listStackResources.listStackResources();
  const logGroupNames = findAllLogGroupNames(stackResources, evaluateCfnTemplate);

  return {
    env: resolvedEnv,
    sdk,
    logGroupNames,
  };
}

/**
 * Determine if a CloudWatch Log Group is associated
 * with an ignored resource
 */
function isReferencedFromIgnoredResource(
  logGroupResource: CloudFormation.StackResourceSummary,
  evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): boolean {
  let foundReference = false;
  const resourcesReferencingLogGroup = evaluateCfnTemplate.findReferencesTo(logGroupResource.LogicalResourceId);
  for (const reference of resourcesReferencingLogGroup) {
    if (IGNORE_LOGS_RESOURCE_TYPES.includes(reference.Type)) {
      foundReference = true;
    }
  }
  return foundReference;
}

/**
 * Find all CloudWatch Log Groups in the deployed template.
 * This will find both explicitely created Log Groups (excluding those associated with ignored resources)
 * as well as Log Groups created implicitely (i.e. Lambda Functions)
 */
function findAllLogGroupNames(
  stackResources: CloudFormation.StackResourceSummary[],
  evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): string[] {
  return stackResources.reduce((logGroupNames: string[], resource) => {
    let logGroupName;
    if (resource.ResourceType === 'AWS::Logs::LogGroup') {
      if (!isReferencedFromIgnoredResource(resource, evaluateCfnTemplate)) {
        logGroupName = resource.PhysicalResourceId;
      }
    } else if (RESOURCE_TYPES_WITH_IMPLICIT_LOGS[resource.ResourceType]) {
      const servicePart = RESOURCE_TYPES_WITH_IMPLICIT_LOGS[resource.ResourceType].LogGroupServiceName;
      logGroupName = `/aws/${servicePart}/${resource.PhysicalResourceId}`;
    }
    if (logGroupName) {
      logGroupNames.push(logGroupName);
    }
    return logGroupNames;
  }, []);
}
