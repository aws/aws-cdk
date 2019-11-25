import { IResource } from '@aws-cdk/core';
import { IPhysicalRequirements } from './physical-requirements'

export enum ConnectionInputTypes {
  /**
   * The type of the connection. Currently, only JDBC is supported; SFTP is not supported.
   */
  JDBC = 'JDBC',
}

export interface IConnectionInput extends IResource {
  /**
   * @attribute
   */
  readonly properties: object;

  /**
   * @attribute
   */
  readonly type: ConnectionInputTypes;

  /**
   * @attribute
   */
  readonly description?: string;

  /**
   * @attribute
   */
  readonly matchCriteria?: string[];

  /**
   * @attribute
   */
  readonly name?: string;

  /**
   * @attribute
   */
  readonly physicalRequirements?: IPhysicalRequirements;
}
