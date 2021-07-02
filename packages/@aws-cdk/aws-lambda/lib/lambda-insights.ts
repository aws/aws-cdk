/**
 * Version of Lambda Insights.
 */
export class LambdaInsightsVersion {

  /**
   * Use the insight version associated with the provided ARN. Make sure the ARN is associated
   * with same region as your function
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights-extension-versions.html
   */
  public static fromInsightVersionArn(arn: string): LambdaInsightsVersion {
    return new LambdaInsightsVersion(arn);
  }

  /**
   * The ARN of the Lambda insights lambda layer.
   */
  readonly layerVersionArn: string;

  private constructor(arn: string) {
    this.layerVersionArn = arn;
  }
}
