import { CustomResourceProviderRuntime } from 'aws-cdk-lib/core';
import { Runtime } from 'aws-cdk-lib/aws-lambda';

/**
 * The standard nodejs runtime used for integration tests.
 * Use this, unless specifically testing a certain runtime.
 *
 * The runtime should not be changed too much as updating this
 * value will require you to run a lot of integration tests.
 *
 * If the Nodejs version here is deprecated, update it to the
 * latest NodeJS runtime version available. Doing this will push back
 * the date we have to update the value again as much as possible
 * so we don't update this value frequently.
 */
export const STANDARD_NODEJS_RUNTIME = Runtime.NODEJS_24_X;

/**
 * The standard custom resource provider runtime used for integration tests.
 * Use this, unless specifically testing a certain runtime.
 *
 * The runtime should not be changed too much as updating this
 * value will require you to run a lot of integration tests.
 *
 * If the Nodejs version here is deprecated, update it to the
 * latest NodeJS runtime version available. Doing this will push back
 * the date we have to update the value again as much as possible
 * so we don't update this value frequently.
 */
export const STANDARD_CUSTOM_RESOURCE_PROVIDER_RUNTIME = CustomResourceProviderRuntime.NODEJS_22_X;
