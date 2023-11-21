import { IResource } from '../../core';

/**
 * Represents an Authorizer.
 */
export interface IAuthorizer extends IResource {
  /**
   * Id of the Authorizer
   * @attribute
   */
  readonly authorizerId: string
}
