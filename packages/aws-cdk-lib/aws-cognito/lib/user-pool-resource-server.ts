import { Construct } from 'constructs';
import { CfnUserPoolResourceServer } from './cognito.generated';
import { IResource, Resource } from '../../core';
import { ValidationError } from '../../core/lib/errors';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';
import { IUserPoolResourceServerRef, IUserPoolRef, UserPoolResourceServerReference } from '../../interfaces/generated/aws-cognito-interfaces.generated';

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
      get userPoolResourceServerRef(): UserPoolResourceServerReference {
        throw new ValidationError('userPoolResourceServerRef is not available for imported UserPoolResourceServer without userPoolId', this);
      }
    }

    return new Import(scope, id);
  }

  public readonly userPoolResourceServerId: string;
  private readonly userPool: IUserPoolRef;
  private readonly identifier: string;

  constructor(scope: Construct, id: string, props: UserPoolResourceServerProps) {
    super(scope, id, {
      physicalName: props.identifier,
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.userPool = props.userPool;
    this.identifier = props.identifier;

    const resource = new CfnUserPoolResourceServer(this, 'Resource', {
      identifier: this.physicalName,
      name: props.userPoolResourceServerName ?? this.physicalName,
      scopes: props.scopes,
      userPoolId: props.userPool.userPoolRef.userPoolId,
    });

    this.userPoolResourceServerId = resource.ref;
  }

  public get userPoolResourceServerRef(): UserPoolResourceServerReference {
    return {
      userPoolId: this.userPool.userPoolRef.userPoolId,
      identifier: this.identifier,
    };
  }
}
