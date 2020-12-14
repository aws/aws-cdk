import {
  IntegrationPattern,
} from '@aws-cdk/aws-stepfunctions';
import { Aws } from '@aws-cdk/core';

/**
 * Verifies that a validation pattern is supported for a service integration
 *
 */
export function validatePatternSupported(integrationPattern: IntegrationPattern, supportedPatterns: IntegrationPattern[]) {
  if (!supportedPatterns.includes(integrationPattern)) {
    throw new Error(`Unsupported service integration pattern. Supported Patterns: ${supportedPatterns}. Received: ${integrationPattern}`);
  }
}

/**
 * Suffixes corresponding to different service integration patterns
 *
 * Key is the service integration pattern, value is the resource ARN suffix.
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html
 */
const resourceArnSuffix: Record<IntegrationPattern, string> = {
  [IntegrationPattern.REQUEST_RESPONSE]: '',
  [IntegrationPattern.RUN_JOB]: '.sync',
  [IntegrationPattern.WAIT_FOR_TASK_TOKEN]: '.waitForTaskToken',
};

export function integrationResourceArn(service: string, api: string, integrationPattern: IntegrationPattern): string {
  if (!service || !api) {
    throw new Error("Both 'service' and 'api' must be provided to build the resource ARN.");
  }
  return `arn:${Aws.PARTITION}:states:::${service}:${api}` +
        (integrationPattern ? resourceArnSuffix[integrationPattern] : '');
}
