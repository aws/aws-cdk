/**
 * Matches the definition of AwsSdkCall in packages/aws-cdk-lib/custom-resources/lib/aws-custom-resource/aws-custom-resource.ts
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
}