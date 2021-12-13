import { IResolveContext, Lazy, Stack, Token } from '@aws-cdk/core';
import { FactName, RegionInfo } from '@aws-cdk/region-info';

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
   * Use the insights extension associated with the provided ARN. Make sure the ARN is associated
   * with same region as your function
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights-extension-versions.html
   */
  public static fromInsightVersionArn(arn: string): LambdaInsightsVersion {
    class InsightsArn extends LambdaInsightsVersion {
      public readonly layerVersionArn = arn;
    }
    return new InsightsArn();
  }

  // Use the verison to build the object. Not meant to be called by the user -- user should use e.g. VERSION_1_0_54_0
  private static fromInsightsVersion(insightsVersion: string): LambdaInsightsVersion {

    // Check if insights version is valid. This should only happen if one of the public static readonly versions are set incorrectly
    const versionExists = RegionInfo.regions.some(regionInfo => regionInfo.cloudwatchLambdaInsightsArn(insightsVersion));
    if (!versionExists) {
      throw new Error(`Insights version ${insightsVersion} does not exist.`);
    }

    class InsightsVersion extends LambdaInsightsVersion {
      public readonly layerVersionArn = Lazy.uncachedString({
        produce: (context) => getVersionArn(context, insightsVersion),
      });
    }
    return new InsightsVersion();
  }

  /**
   * The arn of the Lambda Insights extension
   */
  public readonly layerVersionArn: string = '';
}

/**
 * Function to retrieve the correct Lambda Insights ARN from RegionInfo,
 * or create a mapping to look it up at stack deployment time.
 *
 * This function is run on CDK synthesis.
 */
function getVersionArn(context: IResolveContext, insightsVersion: string): string {

  const scopeStack = Stack.of(context.scope);
  const region = scopeStack.region;

  // Region is defined, look up the arn, or throw an error if the version isn't supported by a region
  if (region !== undefined && !Token.isUnresolved(region)) {
    const arn = RegionInfo.get(region).cloudwatchLambdaInsightsArn(insightsVersion);
    if (arn === undefined) {
      throw new Error(`Insights version ${insightsVersion} is not supported in region ${region}`);
    }
    return arn;
  }

  // Otherwise, need to add a mapping to be looked up at deployment time
  return scopeStack.regionalFact(FactName.cloudwatchLambdaInsightsVersion(insightsVersion));
}