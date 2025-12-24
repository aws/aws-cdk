import { UnscopedValidationError } from '../../../core/lib/errors';
import { IGraphQLApiRef } from '../../../interfaces/generated/aws-appsync-interfaces.generated';
import { IGraphqlApi } from '../graphqlapi-base';

/**
 * Converts an IGraphQLApiRef to IGraphqlApi, validating that it implements the full interface
 */
export function toIGraphqlApi(apiRef: IGraphQLApiRef): IGraphqlApi {
  // Check for presence of key API elements of IGraphqlApi
  if (typeof (apiRef as any).apiId !== 'string' ||
      typeof (apiRef as any).addSchemaDependency !== 'function') {
    throw new UnscopedValidationError(`'apiRef' instance should implement IGraphqlApi, but doesn't: ${apiRef.constructor.name}`);
  }
  return apiRef as IGraphqlApi;
}
