import type * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import type { ICluster } from './cluster';

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

  /**
   * Share a custom resource provider with other database queries in this stack.
   *
   * Set this when creating a new table or user. A user's table privilege queries
   * use the same setting. Changing this on an existing query changes its service
   * token, which CloudFormation does not support updating in place.
   *
   * @default false
   */
  readonly shareQueryProvider?: boolean;
}
