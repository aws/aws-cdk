import * as codebuild from '@aws-cdk/aws-codebuild';

export function mergeLoggings(a: codebuild.LoggingOptions, b?: codebuild.LoggingOptions): codebuild.LoggingOptions | undefined;
export function mergeLoggings(a: codebuild.LoggingOptions | undefined, b: codebuild.LoggingOptions): codebuild.LoggingOptions | undefined;
export function mergeLoggings(a?: codebuild.LoggingOptions, b?: codebuild.LoggingOptions): codebuild.LoggingOptions | undefined;
export function mergeLoggings(a?: codebuild.LoggingOptions, b?: codebuild.LoggingOptions) {
  const cloudWatch = b?.cloudWatch ?? a?.cloudWatch;
  const s3 = b?.s3 ?? a?.s3;

  if (!cloudWatch && !s3) {
    return undefined;
  }

  return {
    cloudWatch: (cloudWatch?.enabled && !cloudWatch?.logGroup) ? undefined : cloudWatch,
    s3: s3,
  };
}
