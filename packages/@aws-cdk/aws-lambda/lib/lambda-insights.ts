import { Aws, CfnMapping, Fn, IResolveContext, Lazy, Stack, Token } from '@aws-cdk/core';
import { FactName, RegionInfo } from '@aws-cdk/region-info';
import { Construct } from 'constructs';
import { Architecture } from './architecture';
import { IFunction } from './function-base';


// This is the name of the mapping that will be added to the CloudFormation template, if a stack is region agnostic
const DEFAULT_MAPPING_PREFIX = 'LambdaInsightsVersions';

/**
 * Config returned from {@link LambdaInsightsVersion._bind}
 */
interface InsightsBindConfig {
  /**
   * ARN of the Lambda Insights Layer Version
   */
  readonly arn: string;
}

// To add new versions, update fact-tables.ts `CLOUDWATCH_LAMBDA_INSIGHTS_ARNS` and create a new `public static readonly VERSION_A_B_C_D`

/**
 * Version of CloudWatch Lambda Insights
 */
export abstract class LambdaInsightsVersion {

  /**
   * Version 1.0.54.0
   */
  public static readonly VERSION_1_0_54_0 = LambdaInsightsVersion.fromInsightsVersion('1.0.54.0');

  /**
   * Version 1.0.86.0
   */
  public static readonly VERSION_1_0_86_0 = LambdaInsightsVersion.fromInsightsVersion('1.0.86.0');

  /**
   * Version 1.0.89.0
   */
  public static readonly VERSION_1_0_89_0 = LambdaInsightsVersion.fromInsightsVersion('1.0.89.0');

  /**
   * Version 1.0.98.0
   */
  public static readonly VERSION_1_0_98_0 = LambdaInsightsVersion.fromInsightsVersion('1.0.98.0');

  /**
   * Version 1.0.119.0
   */
  public static readonly VERSION_1_0_119_0 = LambdaInsightsVersion.fromInsightsVersion('1.0.119.0');

  /**
   * Use the insights extension associated with the provided ARN. Make sure the ARN is associated
   * with same region as your function
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights-extension-versions.html
   */
  public static fromInsightVersionArn(arn: string): LambdaInsightsVersion {
    class InsightsArn extends LambdaInsightsVersion {
      public readonly layerVersionArn = arn;
      public _bind(_scope: Construct, _function: IFunction): InsightsBindConfig {
        return { arn };
      }
    }
    return new InsightsArn();
  }

  // Use the verison to build the object. Not meant to be called by the user -- user should use e.g. VERSION_1_0_54_0
  private static fromInsightsVersion(insightsVersion: string): LambdaInsightsVersion {

    class InsightsVersion extends LambdaInsightsVersion {
      public readonly layerVersionArn = Lazy.uncachedString({
        produce: (context) => getVersionArn(context, insightsVersion),
      });

      public _bind(_scope: Construct, _function: IFunction): InsightsBindConfig {
        const arch = _function.architecture?.name ?? Architecture.X86_64.name;
        // Check if insights version is valid. This should only happen if one of the public static readonly versions are set incorrectly
        // or if the version is not available for the Lambda Architecture
        const versionExists = RegionInfo.regions.some(regionInfo => regionInfo.cloudwatchLambdaInsightsArn(insightsVersion, arch));
        if (!versionExists) {
          throw new Error(`Insights version ${insightsVersion} does not exist.`);
        }
        return {
          arn: Lazy.uncachedString({
            produce: (context) => getVersionArn(context, insightsVersion, arch),
          }),
        };
      }
    }
    return new InsightsVersion();
  }

  /**
   * The arn of the Lambda Insights extension
   */
  public readonly layerVersionArn: string = '';

  /**
   * Returns the arn of the Lambda Insights extension based on the
   * Lambda architecture
   * @internal
   */
  public abstract _bind(_scope: Construct, _function: IFunction): InsightsBindConfig;
}

/**
 * Function to retrieve the correct Lambda Insights ARN from RegionInfo,
 * or create a mapping to look it up at stack deployment time.
 *
 * This function is run on CDK synthesis.
 */
function getVersionArn(context: IResolveContext, insightsVersion: string, architecture?: string): string {

  const scopeStack = Stack.of(context.scope);
  const region = scopeStack.region;
  const arch = architecture ?? Architecture.X86_64.name;

  // Region is defined, look up the arn, or throw an error if the version isn't supported by a region
  if (region !== undefined && !Token.isUnresolved(region)) {
    const arn = RegionInfo.get(region).cloudwatchLambdaInsightsArn(insightsVersion, arch);
    if (arn === undefined) {
      throw new Error(`Insights version ${insightsVersion} is not supported in region ${region}`);
    }
    return arn;
  }

  // Otherwise, need to add a mapping to be looked up at deployment time

  /**
   * See this for the context as to why the mappings are the way they are
   * https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/mappings-section-structure.html
   *
   * Mappings have to have a structure like this, and no functions can be used inside them:
   * <Alphanumeric only>
   * - <Can be non-alphanumeric>
   * -- { <alphanumeric>: "value1"},
   * -- { <alphanumeric>: "value2"}
   *
   * So we cannot have an otherwise ideal mapping like this, because '1.0.98.0' is non-alphanumeric:
   * LambdaInsightsVersions
   * - us-east-1
   * -- {'1.0.98.0': 'arn1'},
   * -- {'1.0.89.0': 'arn2'}
   *
   * To get around this limitation, this is the mapping structure:
   * LambdaInsightsVersions10980 // for version 1.0.98.0
   * - us-east-1
   * -- {'arn': 'arn1'},
   * - us-east-2
   * -- {'arn': 'arn2'}
   * LambdaInsightsVersions10890 // a separate mapping version 1.0.89.0
   * - us-east-1
   * -- {'arn': 'arn3'},
   * - us-east-2
   * -- {'arn': 'arn4'}
   * LambdaInsightsVersions101190arm64 // a separate mapping version 1.0.119.0 arm64
   * - us-east-1
   * -- {'arn': 'arn3'},
   * - us-east-2
   * -- {'arn': 'arn4'}
   */

  let mapName = DEFAULT_MAPPING_PREFIX + insightsVersion.split('.').join('');
  // if the architecture is arm64 then append that to the end of the name
  // this is so that we can have a separate mapping for x86 vs arm in scenarios
  // where we have Lambda functions with both architectures in the same stack
  if (arch === Architecture.ARM_64.name) {
    mapName += arch;
  }
  const mapping: { [k1: string]: { [k2: string]: any } } = {};
  const region2arns = RegionInfo.regionMap(FactName.cloudwatchLambdaInsightsVersion(insightsVersion, arch));
  for (const [reg, arn] of Object.entries(region2arns)) {
    mapping[reg] = { arn };
  }

  // Only create a given mapping once. If another version of insights is used elsewhere, that mapping will also exist
  if (!scopeStack.node.tryFindChild(mapName)) {
    // need to call findInMap here if we are going to set lazy=true, otherwise
    // we get the informLazyUse info message
    const map = new CfnMapping(scopeStack, mapName, { mapping, lazy: true });
    return map.findInMap(Aws.REGION, 'arn');
  }
  // The ARN will be looked up at deployment time from the mapping we created
  return Fn.findInMap(mapName, Aws.REGION, 'arn');
}
