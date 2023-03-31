import { IResource } from 'aws-cdk-lib';

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
