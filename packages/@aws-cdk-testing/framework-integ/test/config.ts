import { CustomResourceProviderRuntime } from 'aws-cdk-lib/core';
import { Runtime } from 'aws-cdk-lib/aws-lambda';

/**
 * The standard nodejs runtime used for integration tests.
 * Use this, unless specifically testing a certain runtime.
 *
 * The runtime should be the lowest runtime currently supported by the AWS CDK.
 * Updating this value will require you to run a lot of integration tests.
 */
export const STANDARD_NODEJS_RUNTIME = Runtime.NODEJS_18_X;

/**
 * The standard custom resource provider runtime used for integration tests.
 * Use this, unless specifically testing a certain runtime.
 *
 * The runtime should be the lowest runtime currently supported by the AWS CDK.
 * Updating this value will require you to run a lot of integration tests.
 */
export const STANDARD_CUSTOM_RESOURCE_PROVIDER_RUNTIME = CustomResourceProviderRuntime.NODEJS_18_X;
