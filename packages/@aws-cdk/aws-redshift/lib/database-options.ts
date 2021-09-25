import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import { ICluster } from './cluster';

/**
 * Properties for accessing a Redshift database
 */
export interface DatabaseOptions {
  /**
   * The cluster containing the database.
   */
  readonly cluster: ICluster;

  /**
   * The name of the database.
   */
  readonly databaseName: string;

  /**
   * The secret containing credentials to a Redshift user with administrator privileges.
   *
   * Secret JSON schema: `{ username: string; password: string }`.
   *
   * @default - the admin secret is taken from the cluster
   */
  readonly adminUser?: secretsmanager.ISecret;
}
