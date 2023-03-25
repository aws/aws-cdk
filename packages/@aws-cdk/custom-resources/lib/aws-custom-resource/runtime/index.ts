export { PHYSICAL_RESOURCE_ID_REFERENCE } from './shared';

const runtime = process.env.AWS_EXECUTION_ENV?.split('AWS_Lambda_')[1];
// eslint-disable-next-line @typescript-eslint/no-require-imports
const runtimeModule = runtime && runtime >= 'nodejs18.x' ? require('./aws-sdk-v3-handler') : require('./aws-sdk-v2-handler');
export const handler = runtimeModule.handler;
