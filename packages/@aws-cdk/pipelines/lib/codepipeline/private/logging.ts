import * as cb from '@aws-cdk/aws-codebuild';
import { CodeBuildOptions } from '../codepipeline';

export function exportLoggingSettings(option: CodeBuildOptions): cb.LoggingOptions | undefined {
  let s3, cloudWatch = undefined;

  if (option.s3logging != undefined && option.s3logging.bucket) {
    s3 = {
      enabled: option.s3logging.enabled,
      bucket: option.s3logging.bucket,
      prefix: option.s3logging.prefix,
      encrypted: option.s3logging.encrypted,
    };
  }

  if (option.cloudWatchLogging != undefined) {
    cloudWatch = {
      enabled: option.cloudWatchLogging.enabled,
      logGroup: option.cloudWatchLogging.logGroup,
      prefix: option.cloudWatchLogging.prefix,
    };
  }

  if (s3 == undefined && cloudWatch == undefined) {
    return undefined;
  } else {
    return {
      cloudWatch: cloudWatch,
      s3: s3,
    };
  }
}
