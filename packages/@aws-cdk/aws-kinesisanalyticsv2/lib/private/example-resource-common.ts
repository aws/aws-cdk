import * as cdk from '@aws-cdk/core';

export function flinkApplicationArnComponents(resourceName: string): cdk.ArnComponents {
  return {
    service: 'kinesisanalytics',
    resource: 'application',
    resourceName,
  };
}
