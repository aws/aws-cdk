import sfn = require('@aws-cdk/aws-stepfunctions');

/**
 * Suffixes corresponding to different service integration patterns
 *
 * Key is the service integration pattern, value is the resource ARN suffix.
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html
 */
const resourceArnSuffix = new Map<sfn.ServiceIntegrationPattern, string>();
resourceArnSuffix.set(sfn.ServiceIntegrationPattern.FIRE_AND_FORGET, "");
resourceArnSuffix.set(sfn.ServiceIntegrationPattern.SYNC, ".sync");
resourceArnSuffix.set(sfn.ServiceIntegrationPattern.WAIT_FOR_TASK_TOKEN, ".waitForTaskToken");

export { resourceArnSuffix };