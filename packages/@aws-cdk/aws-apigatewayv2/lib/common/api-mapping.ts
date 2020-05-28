import { IResource } from '@aws-cdk/core';

/**
 *  interface of the ApiMapping resource
 */
export interface IApiMapping extends IResource {
  /**
   * ID of the api mapping
   * @attribute
   */
  readonly apiMappingId: string;
}
