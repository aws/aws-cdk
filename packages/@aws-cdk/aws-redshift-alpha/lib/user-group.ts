import * as cdk from 'aws-cdk-lib';
import { Construct, IConstruct } from 'constructs';
import { ICluster } from './cluster';
import { DatabaseOptions } from './database-options';
import { DatabaseQuery } from './private/database-query';
import { HandlerName } from './private/database-query-provider/handler-name';
import { UserGroupHandlerProps } from './private/handler-props';
import { IUser } from './user';

/**
 * Properties for configuring a Redshift user group.
 */
export interface UserGroupProps extends DatabaseOptions {
  /**
   * The name of the user group.
   *
   * For valid values, see: https://docs.aws.amazon.com/redshift/latest/dg/r_names.html. In addition, group names beginning with two underscores are reserved for Amazon Redshift internal use.
   *
   * @default - a name is generated
   */
  readonly groupName?: string;

  /**
   * The users in the user group.
   *
   * @default - no users
   */
  readonly users?: IUser[];

  /**
   * The policy to apply when this resource is removed from the application.
   *
   * @default cdk.RemovalPolicy.Destroy
   */
  readonly removalPolicy?: cdk.RemovalPolicy;
}

/**
 * Represents a user group in a Redshift database.
 */
export interface IUserGroup extends IConstruct {
  /**
   * The name of the user group.
   */
  readonly groupName: string;

  /**
   * The cluster where the user group is located.
   */
  readonly cluster: ICluster;

  /**
   * The name of the database where the user group is located.
   */
  readonly databaseName: string;
}

/**
 * A full specification of a Redshift user group that can be used to import it fluently into the CDK application.
 */
export interface UserGroupAttributes extends DatabaseOptions {
  /**
   * The name of the user group.
   */
  readonly groupName: string;
}

abstract class UserGroupBase extends Construct implements IUserGroup {
  abstract readonly groupName: string;
  abstract readonly cluster: ICluster;
  abstract readonly databaseName: string;
}

export class UserGroup extends UserGroupBase {
  /**
   * Specify a user group that already exists.
   */
  static fromUserGroupName(scope: Construct, id: string, attrs: UserGroupAttributes): IUserGroup {
    return new class extends UserGroupBase {
      readonly groupName = attrs.groupName;
      readonly cluster = attrs.cluster;
      readonly databaseName = attrs.databaseName;
    }(scope, id);
  }

  readonly groupName: string;
  readonly cluster: ICluster;
  readonly databaseName: string;
  protected databaseProps: DatabaseOptions;

  private resource: DatabaseQuery<UserGroupHandlerProps>;

  constructor(scope: Construct, id: string, props: UserGroupProps) {
    super(scope, id);

    this.databaseProps = props;
    this.cluster = props.cluster;
    this.databaseName = props.databaseName;

    const groupName = props.groupName ?? cdk.Names.uniqueId(this).toLowerCase();

    this.resource = new DatabaseQuery(this, 'Resource', {
      ...this.databaseProps,
      handler: HandlerName.UserGroup,
      properties: { groupName },
    });

    this.groupName = this.resource.getAttString('groupName');
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
   * This resource is retained by default.
   */
  public applyRemovalPolicy(policy: cdk.RemovalPolicy): void {
    this.resource.applyRemovalPolicy(policy);
  }
}