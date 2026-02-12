import type { Construct } from 'constructs';
import { CfnUserPoolResourceServer } from './cognito.generated';
import type { IResource } from '../../core';
import { Resource } from '../../core';
import { UnscopedValidationError } from '../../core/lib/errors';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';
import type { IUserPoolRef, IUserPoolResourceServerRef, UserPoolResourceServerReference } from '../../interfaces/generated/aws-cognito-interfaces.generated';

/**
 * Represents a Cognito user pool resource server
 */
export interface IUserPoolResourceServer extends IResource, IUserPoolResourceServerRef {
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
  readonly userPool: IUserPoolRef;
}

/**
 * Defines a User Pool OAuth2.0 Resource Server
 */
@propertyInjectable
export class UserPoolResourceServer extends Resource implements IUserPoolResourceServer {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-cognito.UserPoolResourceServer';

  /**
   * Import a user pool resource client given its id.
   */
  public static fromUserPoolResourceServerId(scope: Construct, id: string, userPoolResourceServerId: string): IUserPoolResourceServer {
    class Import extends Resource implements IUserPoolResourceServer {
      public readonly userPoolResourceServerId = userPoolResourceServerId;

      public get userPoolResourceServerRef(): UserPoolResourceServerReference {
        return {
          identifier: userPoolResourceServerId,
          get userPoolId(): string {
            throw new UnscopedValidationError('userPoolId is not available on UserPoolResourceServer.fromUserPoolResourceServiceId().');
          },
        };
      }
    }

    return new Import(scope, id);
  }

  public readonly userPoolResourceServerId: string;
  private readonly _userPool: IUserPoolRef;
  private readonly identifier: string;

  public get userPoolResourceServerRef(): UserPoolResourceServerReference {
    return {
      userPoolId: this._userPool.userPoolRef.userPoolId,
      identifier: this.identifier,
    };
  }

  constructor(scope: Construct, id: string, props: UserPoolResourceServerProps) {
    super(scope, id, {
      physicalName: props.identifier,
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this._userPool = props.userPool;
    this.identifier = this.physicalName;

    const resource = new CfnUserPoolResourceServer(this, 'Resource', {
      identifier: this.physicalName,
      name: props.userPoolResourceServerName ?? this.physicalName,
      scopes: props.scopes,
      userPoolId: this._userPool.userPoolRef.userPoolId,
    });

    this.userPoolResourceServerId = resource.ref;
  }
}
