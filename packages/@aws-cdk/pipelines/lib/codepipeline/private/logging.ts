import * as codebuild from '@aws-cdk/aws-codebuild';

export function mergeLoggings(a: codebuild.LoggingOptions, b?: codebuild.LoggingOptions): codebuild.LoggingOptions;
export function mergeLoggings(a: codebuild.LoggingOptions | undefined, b: codebuild.LoggingOptions): codebuild.LoggingOptions;
export function mergeLoggings(a?: codebuild.LoggingOptions, b?: codebuild.LoggingOptions): codebuild.LoggingOptions | undefined;
export function mergeLoggings(a?: codebuild.LoggingOptions, b?: codebuild.LoggingOptions) {
  return b ?? a;
}
