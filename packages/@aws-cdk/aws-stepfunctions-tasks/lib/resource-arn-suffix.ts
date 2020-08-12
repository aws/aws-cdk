import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Aws } from '@aws-cdk/core';

/**
 * Suffixes corresponding to different service integration patterns
 *
 * Key is the service integration pattern, value is the resource ARN suffix.
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html
 */
const resourceArnSuffix = new Map<sfn.ServiceIntegrationPattern, string>();
resourceArnSuffix.set(sfn.ServiceIntegrationPattern.FIRE_AND_FORGET, '');
resourceArnSuffix.set(sfn.ServiceIntegrationPattern.SYNC, '.sync');
resourceArnSuffix.set(sfn.ServiceIntegrationPattern.WAIT_FOR_TASK_TOKEN, '.waitForTaskToken');

export function getResourceArn(service: string, api: string, integrationPattern: sfn.ServiceIntegrationPattern): string {
  if (!service || !api) {
    throw new Error("Both 'service' and 'api' must be provided to build the resource ARN.");
  }
  return `arn:${Aws.PARTITION}:states:::${service}:${api}` +
        (integrationPattern ? resourceArnSuffix.get(integrationPattern) : '');
}
