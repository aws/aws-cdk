import { RegionInfo } from '@aws-cdk/region-info';

/**
 * Version of Lambda Insights.
 */
export class LambdaInsightsLayerVersion {

  /**
   * Use the insight version associated with the provided ARN. Make sure the ARN is associated
   * with same region as your function
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights-extension-versions.html
   */
  public static fromInsightVersionArn(arn: string): LambdaInsightsLayerVersion {
    return new LambdaInsightsLayerVersion(arn);
  }

  /**
   * Use the insight version associated with the given region and version.
   */
  public static fromVersionAndRegion(insightsVersion: LambdaInsightsVersion, region: string): LambdaInsightsLayerVersion {
    const arn = RegionInfo.get(region).cloudwatchLambdaInsightsArn(insightsVersion);
    if (arn === undefined) {
      throw new Error(`Insights version ${insightsVersion} does not exist or is not supported in region ${region}`);
    }
    return LambdaInsightsLayerVersion.fromInsightVersionArn(arn);
  }

  /**
   * The ARN of the Lambda insights lambda layer.
   */
  readonly layerVersionArn: string;

  private constructor(arn: string) {
    this.layerVersionArn = arn;
  }
}

/**
 * Available versions of Lambda Insights
 */
export enum LambdaInsightsVersion {

  /**
   * 1.0.98.0
   */
  VERSION_1_0_98_0 = '1.0.98.0',

  /**
   * 1.0.89.0
   */
  VERSION_1_0_89_0 = '1.0.89.0',

  /**
   * 1.0.86.0
   */
  VERSION_1_0_86_0 = '1.0.86.0',

  /**
   * 1.0.54.0
   */
  VERSION_1_0_54_0 = '1.0.54.0'
}
