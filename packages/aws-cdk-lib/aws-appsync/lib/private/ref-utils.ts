import { UnscopedValidationError } from '../../../core';
import { IGraphQLApiRef, IApiRef } from '../../../interfaces/generated/aws-appsync-interfaces.generated';
import { IApi } from '../api-base';
import { IGraphqlApi } from '../graphqlapi-base';

/**
 * Converts an IGraphQLApiRef to IGraphqlApi, validating that it implements the full interface
 */
export function toIGraphqlApi(apiRef: IGraphQLApiRef): IGraphqlApi {
  const api = apiRef as any;
  if (typeof api.apiId !== 'string' || typeof api.arn !== 'string' || typeof api.addNoneDataSource !== 'function') {
    throw new UnscopedValidationError(`'api' instance should implement IGraphqlApi, but doesn't: ${api.constructor?.name ?? 'unknown'}`);
  }
  return apiRef as IGraphqlApi;
}

/**
 * Converts an IApiRef to IApi, validating that it implements the full interface
 */
export function toIApi(apiRef: IApiRef): IApi {
  const api = apiRef as any;
  if (typeof api.apiId !== 'string' || typeof api.apiArn !== 'string' || typeof api.addDynamoDbDataSource !== 'function') {
    throw new UnscopedValidationError(`'api' instance should implement IApi, but doesn't: ${api.constructor?.name ?? 'unknown'}`);
  }
  return apiRef as IApi;
}
