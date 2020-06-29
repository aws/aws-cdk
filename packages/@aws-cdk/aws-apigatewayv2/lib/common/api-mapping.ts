import { IResource } from '@aws-cdk/core';

/**
 * Defines the contract for an Api Gateway V2 Api Mapping.
 */
export interface IApiMapping extends IResource {
  /**
   * The ID of this API Gateway Api Mapping.
   * @attribute
   */
  readonly apiMappingId: string;
}