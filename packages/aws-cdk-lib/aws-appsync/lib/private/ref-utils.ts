import { Fn, UnscopedValidationError } from '../../../core';
import type { IGraphQLApiRef, IApiRef, IFunctionConfigurationRef } from '../../../interfaces/generated/aws-appsync-interfaces.generated';
import type { IApi } from '../api-base';
import type { IAppsyncFunction } from '../appsync-function';
import type { IGraphqlApi } from '../graphqlapi-base';

/**
 * Converts an IGraphQLApiRef to IGraphqlApi, validating that it implements the full interface
 */
export function toIGraphqlApi(api: IGraphQLApiRef): IGraphqlApi {
  if (!isGraphQlApi(api)) {
    throw new UnscopedValidationError(`'api' instance should implement IGraphqlApi, but doesn't: ${api.constructor?.name ?? 'unknown'}`);
  }
  return api;
}

function isGraphQlApi(apiRef: IGraphQLApiRef): apiRef is IGraphqlApi {
  const api = apiRef as any;
  return ('apiId' in api && 'arn' in api && 'addNoneDataSource' in api);
}

function isIApi(apiRef: IApiRef): apiRef is IApi {
  const api = apiRef as any;
  return ('apiId' in api && 'apiArn' in api && 'addDynamoDbDataSource' in api);
}

/**
 * Converts an IApiRef to IApi, validating that it implements the full interface
 */
export function toIApi(api: IApiRef): IApi {
  if (!isIApi(api)) {
    throw new UnscopedValidationError(`'api' instance should implement IApi, but doesn't: ${api.constructor?.name ?? 'unknown'}`);
  }
  return api;
}

export function extractApiIdFromApiRef(apiRef: IApiRef): string {
  // Check if this is actually an IApi (which has apiId directly)
  if (isIApi(apiRef)) {
    return apiRef.apiId;
  }

  // Otherwise, extract from the ARN
  // ARN format: arn:aws:appsync:region:account:apis/<apiId>
  return Fn.select(1, Fn.split('/', apiRef.apiRef.apiArn));
}

export function extractApiIdFromGraphQLApiRef(apiRef: IGraphQLApiRef): string {
  // Check if this is actually an IGraphqlApi (which has apiId directly)
  if (isGraphQlApi(apiRef)) {
    return apiRef.apiId;
  }
  // Otherwise, extract from the ARN
  // ARN format: arn:aws:appsync:region:account:apis/<apiId>
  return Fn.select(1, Fn.split('/', apiRef.graphQlApiRef.graphQlApiArn));
}

function isIFunctionConfiguration(funcRef: IFunctionConfigurationRef): funcRef is IAppsyncFunction {
  const fr = funcRef as unknown as IAppsyncFunction;
  return !!fr.functionId;
}

export function extractFunctionIdFromFunctionRef(funcRef: IFunctionConfigurationRef): string {
  // Check if this is actually an IAppsyncFunction (which has functionId directly)
  if (isIFunctionConfiguration(funcRef)) {
    return funcRef.functionId;
  }
  // Otherwise, extract from the ARN
  // ARN format: arn:aws:appsync:region:account:apis/<apiId>/functions/<functionId>
  return Fn.select(3, Fn.split('/', funcRef.functionConfigurationRef.functionArn));
}
