import { IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnUserPoolResourceServer } from './cognito.generated';
import { IUserPool } from './user-pool';

/**
 * Represents a Cognito user pool resource server
 */
export interface IUserPoolResourceServer extends IResource {
  /**
   * Resource server id
   * @attribute
   */
  readonly userPoolResourceServerId: string;
}

/**
 * Props to initialize ResourceServerScope
 */
export interface ResourceServerScopeProps {
  /**
   * The name of the scope
   */
  readonly scopeName: string;

  /**
   * A description of the scope.
   */
  readonly scopeDescription: string;
}

/**
 * A scope for ResourceServer
 */
export class ResourceServerScope {
  /**
   * The name of the scope
   */
  public readonly scopeName: string;

  /**
   * A description of the scope.
   */
  public readonly scopeDescription: string;

  constructor(props: ResourceServerScopeProps) {
    this.scopeName = props.scopeName;
    this.scopeDescription = props.scopeDescription;
  }
}


/**
 * Options to create a UserPoolResourceServer
 */
export interface UserPoolResourceServerOptions {
  /**
   * A unique resource server identifier for the resource server.
   */
  readonly identifier: string;

  /**
   * A friendly name for the resource server.
   * @default - same as `identifier`
   */
  readonly userPoolResourceServerName?: string;

  /**
   * Oauth scopes
   * @default - No scopes will be added
   */
  readonly scopes?: ResourceServerScope[];
}

/**
 * Properties for the UserPoolResourceServer construct
 */
export interface UserPoolResourceServerProps extends UserPoolResourceServerOptions {
  /**
   * The user pool to add this resource server to
   */
  readonly userPool: IUserPool;
}

/**
 * Defines a User Pool OAuth2.0 Resource Server
 */
export class UserPoolResourceServer extends Resource implements IUserPoolResourceServer {
  /**
   * Import a user pool resource client given its id.
   */
  public static fromUserPoolResourceServerId(scope: Construct, id: string, userPoolResourceServerId: string): IUserPoolResourceServer {
    class Import extends Resource implements IUserPoolResourceServer {
      public readonly userPoolResourceServerId = userPoolResourceServerId;
    }

    return new Import(scope, id);
  }

  public readonly userPoolResourceServerId: string;

  constructor(scope: Construct, id: string, props: UserPoolResourceServerProps) {
    super(scope, id, {
      physicalName: props.identifier,
    });

    const resource = new CfnUserPoolResourceServer(this, 'Resource', {
      identifier: this.physicalName,
      name: props.userPoolResourceServerName ?? this.physicalName,
      scopes: props.scopes,
      userPoolId: props.userPool.userPoolId,
    });

    this.userPoolResourceServerId = resource.ref;
  }
}
