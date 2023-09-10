/* eslint-disable @typescript-eslint/no-require-imports */
export { PHYSICAL_RESOURCE_ID_REFERENCE } from './shared';

export function v2handler(event: AWSLambda.CloudFormationCustomResourceEvent, context: AWSLambda.Context) {
  return require('./aws-sdk-v2-handler').handler(event, context);
}

export function v3handler(event: AWSLambda.CloudFormationCustomResourceEvent, context: AWSLambda.Context) {
  return require('./aws-sdk-v3-handler').handler(event, context);
}

export function handler(event: AWSLambda.CloudFormationCustomResourceEvent, context: AWSLambda.Context) {
  const env = process.env.AWS_EXECUTION_ENV;
  return (env && env >= 'AWS_Lambda_nodejs18.x'
    ? v3handler(event, context)
    : v2handler(event, context));
}
