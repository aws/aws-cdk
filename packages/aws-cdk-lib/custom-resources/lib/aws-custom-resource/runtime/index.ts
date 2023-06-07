export { PHYSICAL_RESOURCE_ID_REFERENCE } from './shared';

const env = process.env.AWS_EXECUTION_ENV;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const runtime = env && env >= 'AWS_Lambda_nodejs18.x' ? require('./aws-sdk-v3-handler') : require('./aws-sdk-v2-handler');
export const handler = runtime.handler;