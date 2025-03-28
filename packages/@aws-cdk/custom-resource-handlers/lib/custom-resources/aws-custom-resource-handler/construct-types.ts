/**
 * Mostly matches the definition of AwsSdkCall in packages/aws-cdk-lib/custom-resources/lib/aws-custom-resource/aws-custom-resource.ts
 * The logging property is configured via the Logging class. Before passing an AwsSdkCall via the event object the internal render
 * method will be called on the Logging instance. This representation includes logging properties after render has been called.
 */
export interface AwsSdkCall {
  readonly service: string;
  readonly action: string;
  readonly parameters?: any;

  /**
   * Matches the definition of the PhysicalResourceId class.
   */
  readonly physicalResourceId?: {
    readonly responsePath?: string;
    readonly id?: string;
  };
  readonly ignoreErrorCodesMatching?: string;
  readonly apiVersion?: string;
  readonly region?: string;
  readonly outputPath?: string;
  readonly outputPaths?: string[];
  readonly assumedRoleArn?: string;
  readonly assumedRoleExternalId?: string;
  readonly logApiResponseData?: boolean;
}
