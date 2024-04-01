import * as cxapi from '@aws-cdk/cx-api';
import { CloudFormation } from 'aws-sdk';
import { ISDK, Mode, SdkProvider } from '../aws-auth';
import { Deployments } from '../deployments';
import { EvaluateCloudFormationTemplate, LazyListStackResources } from '../evaluate-cloudformation-template';

// resource types that have associated CloudWatch Log Groups that should _not_ be monitored
const IGNORE_LOGS_RESOURCE_TYPES = ['AWS::EC2::FlowLog', 'AWS::CloudTrail::Trail', 'AWS::CodeBuild::Project'];

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
  readonly logGroupNames: string[];
}

export async function findCloudWatchLogGroups(
  sdkProvider: SdkProvider,
  stackArtifact: cxapi.CloudFormationStackArtifact,
): Promise<FoundLogGroupsResult> {
  let sdk: ISDK;
  const resolvedEnv = await sdkProvider.resolveEnvironment(stackArtifact.environment);
  // try to assume the lookup role and fallback to the default credentials
  try {
    sdk = (await new Deployments({ sdkProvider }).prepareSdkWithLookupRoleFor(stackArtifact)).sdk;
  } catch {
    sdk = (await sdkProvider.forEnvironment(resolvedEnv, Mode.ForReading)).sdk;
  }

  const listStackResources = new LazyListStackResources(sdk, stackArtifact.stackName);
  const evaluateCfnTemplate = new EvaluateCloudFormationTemplate({
    stackName: stackArtifact.stackName,
    template: stackArtifact.template,
    parameters: {},
    account: resolvedEnv.account,
    region: resolvedEnv.region,
    partition: (await sdk.currentAccount()).partition,
    urlSuffix: (region) => sdk.getEndpointSuffix(region),
    sdk,
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
  const resourcesReferencingLogGroup = evaluateCfnTemplate.findReferencesTo(logGroupResource.LogicalResourceId);
  return resourcesReferencingLogGroup.some(reference => {
    return IGNORE_LOGS_RESOURCE_TYPES.includes(reference.Type);
  });
}

type CloudWatchLogsResolver = (
  resource: CloudFormation.StackResourceSummary,
  evaluateCfnTemplate: EvaluateCloudFormationTemplate
) => string | undefined;

const cloudWatchLogsResolvers: Record<string, CloudWatchLogsResolver> = {
  'AWS::Logs::LogGroup': (resource, evaluateCfnTemplate) => {
    if (isReferencedFromIgnoredResource(resource, evaluateCfnTemplate)) {
      return undefined;
    }
    return resource.PhysicalResourceId?.toString();
  },

  // Resource types that will create a CloudWatch log group with a specific name if one is not provided.
  // The keys are CFN resource types, and the values are the name of the physical name property of that resource
  // and the service name that is used in the automatically created CloudWatch log group.
  'AWS::Lambda::Function': (resource, evaluateCfnTemplate) => {
    const loggingConfig = evaluateCfnTemplate.getResourceProperty(resource.LogicalResourceId, 'LoggingConfig');
    if (loggingConfig?.LogGroup) {
      // if LogGroup is a string then use it as the LogGroupName as it is referred by LogGroup.fromLogGroupArn in CDK
      if (typeof loggingConfig.LogGroup === 'string') {
        return loggingConfig.LogGroup;
      }

      // if { Ref: '...' } is used then try to resolve the LogGroupName from the referenced resource in the template
      if (typeof loggingConfig.LogGroup === 'object') {
        if (loggingConfig.LogGroup.Ref) {
          return evaluateCfnTemplate.getResourceProperty(loggingConfig.LogGroup.Ref, 'LogGroupName');
        }
      }
    }

    return `/aws/lambda/${resource.PhysicalResourceId}`;
  },
};

/**
 * Find all CloudWatch Log Groups in the deployed template.
 * This will find both explicitly created Log Groups (excluding those associated with ignored resources)
 * and Log Groups created implicitly (i.e. Lambda Functions)
 */
function findAllLogGroupNames(
  stackResources: CloudFormation.StackResourceSummary[],
  evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): string[] {
  const logGroupNames: string[] = [];

  for (const resource of stackResources) {
    const logGroupResolver = cloudWatchLogsResolvers[resource.ResourceType];
    if (logGroupResolver) {
      const logGroupName = logGroupResolver(resource, evaluateCfnTemplate);
      if (logGroupName) {
        logGroupNames.push(logGroupName);
      }
    }
  }

  return logGroupNames;
}
