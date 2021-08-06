import * as kms from '@aws-cdk/aws-kms';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { DatabaseProps, DatabaseQuery } from './database';
import { DatabaseSecret } from './database-secret';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct as CoreConstruct } from '@aws-cdk/core';

/**
 * An action that a Redshift user can be granted privilege to perform on a resource.
 */
export enum Privilege {
  /**
   * Grants privilege to select data from a table or view using a SELECT statement.
   *
   * The SELECT privilege is also required to reference existing column values for UPDATE or DELETE operations.
   */
  SELECT,

  /**
   * Grants privilege to load data into a table using an INSERT statement or a COPY statement.
   */
  INSERT,

  /**
   * Grants privilege to update a table column using an UPDATE statement.
   *
   * UPDATE operations also require the SELECT privilege, because they must reference table columns to determine which rows to update, or to compute new values for columns.
   */
  UPDATE,

  /**
   * Grants privilege to delete a data row from a table.
   *
   * DELETE operations also require the SELECT privilege, because they must reference table columns to determine which rows to delete.
   */
  DELETE,

  /**
   * Grants privilege to drop a table.
   */
  DROP,

  /**
   * Grants privilege to create a foreign key constraint.
   *
   * You need to grant this privilege on both the referenced table and the referencing table; otherwise, the user can't create the constraint.
   */
  REFERENCES,

  /**
   * Grants all available privileges at once to the specified user or user group.
   */
  ALL
}

/**
 * Properties for configuring a Redshift user.
 */
export interface UserProps extends DatabaseProps {
  /**
   * The name of the user.
   *
   * @default - a name is generated
   */
  readonly username?: string;

  /**
   * KMS key to encrypt the generated secret.
   *
   * @default - the default AWS managed key is used
   */
  readonly encryptionKey?: kms.IKey;

  /**
   * The policy to apply when this resource is removed from the application.
   *
   * @default cdk.RemovalPolicy.Destroy
   */
  readonly removalPolicy?: cdk.RemovalPolicy;
}

/**
 * Represents a user in a Redshift database.
 */
export interface IUser extends cdk.IConstruct {
  /**
   * The name of the user.
   */
  readonly username: string;

  /**
   * The password of the user.
   */
  readonly password: cdk.SecretValue;

  /**
   * Grant this user privilege to access a table.
   */
  addPrivilege(tableName: string, ...privileges: Privilege[]): void;
}

/**
 * A full specification of a Redshift user that can be used to import it fluently into the CDK application.
 */
export interface UserAttributes extends DatabaseProps {
  /**
   * The name of the user.
   */
  readonly username: string;

  /**
   * The password of the user.
   *
   * Do not put passwords in CDK code directly.
   */
  readonly password: cdk.SecretValue;
}

interface TablePrivilege {
  readonly tableName: string;
  readonly privileges: Privilege[];
}

abstract class UserBase extends CoreConstruct implements IUser {
  abstract readonly username: string;
  abstract readonly password: cdk.SecretValue;

  /**
   * The tables that user will have access to
   */
  private tablePrivileges: TablePrivilege[] = [];

  private privileges?: DatabaseQuery;

  protected abstract readonly databaseProps: DatabaseProps;

  addPrivilege(tableName: string, ...privileges: Privilege[]): void {
    this.tablePrivileges.push({ tableName, privileges });
    if (!this.privileges) {
      this.createPrivileges();
    }
  }

  private createPrivileges(): void {
    this.privileges = new DatabaseQuery(this, 'Grant Privileges', {
      ...this.databaseProps,
      handler: 'grant-privileges',
      properties: {
        username: this.username,
        tablePrivileges: cdk.Lazy.string({
          produce: () => JSON.stringify(
            this.tablePrivileges.map(({ tableName, privileges }) => {
              if (privileges.includes(Privilege.ALL)) {
                privileges = [Privilege.ALL];
              }
              if (privileges.includes(Privilege.UPDATE) || privileges.includes(Privilege.DELETE)) {
                privileges.push(Privilege.SELECT);
              }
              const privilegeSet = new Set(privileges);
              return { tableName, privileges: Array.from(privilegeSet).map(privilege => Privilege[privilege]) };
            }),
          ),
        }),
      },
    });
  }
}

/**
 * A user in a Redshift cluster.
 */
export class User extends UserBase {
  /**
   * Specify a Redshift user using credentials that already exist.
   */
  static fromUserAttributes(scope: Construct, id: string, attrs: UserAttributes): IUser {
    return new class extends UserBase {
      readonly username = attrs.username;
      readonly password = attrs.password;
      protected readonly databaseProps = attrs;
    }(scope, id);
  }

  readonly username: string;
  readonly password: cdk.SecretValue;
  protected databaseProps: DatabaseProps;

  private resource: DatabaseQuery;

  constructor(scope: Construct, id: string, props: UserProps) {
    super(scope, id);

    this.databaseProps = props;

    const username = props.username ?? cdk.Names.uniqueId(this).toLowerCase();
    const secret = new DatabaseSecret(this, 'Secret', {
      username,
      encryptionKey: props.encryptionKey,
    });
    const attachedSecret = secret.attach(props.cluster);
    this.password = attachedSecret.secretValueFromJson('password');

    this.resource = new DatabaseQuery(this, 'Resource', {
      ...this.databaseProps,
      handler: 'create-user',
      properties: {
        username,
        passwordSecretArn: attachedSecret.secretArn,
      },
    });
    attachedSecret.grantRead(this.resource);

    this.username = this.resource.getAttString('username');
  }

  /**
   * Apply the given removal policy to this resource
   *
   * The Removal Policy controls what happens to this resource when it stops
   * being managed by CloudFormation, either because you've removed it from the
   * CDK application or because you've made a change that requires the resource
   * to be replaced.
   *
   * The resource can be destroyed (`RemovalPolicy.DESTROY`), or left in your AWS
   * account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).
   *
   * This resource is destroyed by default.
   */
  public applyRemovalPolicy(policy: cdk.RemovalPolicy): void {
    this.resource.applyRemovalPolicy(policy);
  }
}
