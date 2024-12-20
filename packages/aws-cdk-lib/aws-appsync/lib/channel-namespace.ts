import { Construct } from 'constructs';
import { AppSyncEventIamResource } from './appsync-common';
import { CfnChannelNamespace } from './appsync.generated';
import { AppSyncAuthorizationType } from './auth-config';
import { Code } from './code';
import { IEventApi } from './eventapi';
import { IGrantable } from '../../aws-iam';
import { IResource, Resource, Token } from '../../core';

/**
 * An AppSync channel namespace
 */
export interface IChannelNamespace extends IResource {
  /**
   * The ARN of the AppSync channel namespace
   *
   * @attribute
   */
  readonly channelNamespaceArn: string;
}

/**
 * Authorization configuration for the Channel Namespace
 */
export interface NamespaceAuthConfig {
  /**
   * The publish auth modes for this Event Api
   * @default - API Key authorization
   */
  readonly publishAuthModeTypes?: AppSyncAuthorizationType[];

  /**
   * The subscribe auth modes for this Event Api
   * @default - API Key authorization
   */
  readonly subscribeAuthModeTypes?: AppSyncAuthorizationType[];
}

/**
 * the base properties for a channel namespace
 */
export interface BaseChannelNamespaceProps {
  /**
   * the name of the channel namespace
   *
   * @default - the construct's id will be used
   */
  readonly channelNamespaceName?: string;

  /**
   * The Event Handler code
   *
   * @default - no code is used
   */
  readonly code?: Code;

  /**
   * Authorization config for channel namespace
   *
   * @default - defaults to Event API default auth config
   */
  readonly authorizationConfig?: NamespaceAuthConfig;
}

/**
 * Additional property for an AppSync channel namespace for an Event API reference
 */
export interface ChannelNamespaceProps extends BaseChannelNamespaceProps {
  /**
   * The API this channel namespace is associated with
   */
  readonly api: IEventApi;
}

/**
 * Option configuration for channel namespace
 */
export interface ChannelNamespaceOptions {
  /**
   * The Channel Namespace name
   *
   * @default - the construct's id will be used
   */
  readonly channelNamespaceName?: string;

  /**
   * The Event Handler code
   *
   * @default - no code is used
   */
  readonly code?: Code;

  /**
   * Authorization config for channel namespace
   *
   * @default - defaults to Event API default auth config
   */
  readonly authorizationConfig?: NamespaceAuthConfig;
}

/**
 * A Channel Namespace
 */
export class ChannelNamespace extends Resource implements IChannelNamespace {

  /**
   * Use an existing channel namespace by ARN
   */
  public static fromChannelNamespaceArn(scope: Construct, id: string, channelNamespaceArn: string): IChannelNamespace {
    class Import extends Resource implements IChannelNamespace {
      public readonly channelNamespaceArn = channelNamespaceArn;
    }
    return new Import(scope, id);
  }

  /**
   * the ARN of the channel namespace
   */
  public readonly channelNamespaceArn: string;

  private channelNamespace: CfnChannelNamespace;

  private api: IEventApi;

  constructor(scope: Construct, id: string, props: ChannelNamespaceProps) {
    if (props.channelNamespaceName !== undefined && !Token.isUnresolved(props.channelNamespaceName)) {
      if (props.channelNamespaceName.length < 1 || props.channelNamespaceName.length > 50) {
        throw new Error(`\`channelNamespaceName\` must be between 1 and 50 characters, got: ${props.channelNamespaceName.length} characters.`);
      }
    }

    super(scope, id, {
      physicalName: props.channelNamespaceName ?? id,
    });

    const code = props.code?.bind(this);

    this.validateAuthorizationConfig(props.api.authProviderTypes, props.authorizationConfig?.publishAuthModeTypes ?? []);
    this.validateAuthorizationConfig(props.api.authProviderTypes, props.authorizationConfig?.subscribeAuthModeTypes ?? []);

    this.api = props.api;

    this.api = props.api;

    this.channelNamespace = new CfnChannelNamespace(this, 'Resource', {
      name: this.physicalName,
      apiId: props.api.apiId,
      codeHandlers: code?.inlineCode,
      codeS3Location: code?.s3Location,
      publishAuthModes: props.authorizationConfig?.publishAuthModeTypes?.map((mode) => ({
        authType: mode,
      })),
      subscribeAuthModes: props.authorizationConfig?.subscribeAuthModeTypes?.map((mode) => ({
        authType: mode,
      })),
    });

    this.channelNamespaceArn = this.channelNamespace.attrChannelNamespaceArn;
  }

  /**
   * Adds an IAM policy statement for EventSubscribe access to this channel namespace to an IAM
   * principal's policy.
   *
   * @param grantee The principal
   */
  public grantSubscribe(grantee: IGrantable) {
    return this.api.grant(grantee, AppSyncEventIamResource.ofChannelNamespace(this.channelNamespace.name), 'appsync:EventSubscribe');
  }

  /**
   * Adds an IAM policy statement for EventPublish access to this channel namespace to an IAM
   * principal's policy.
   *
   * @param grantee The principal
   */
  public grantPublish(grantee: IGrantable) {
    return this.api.grant(grantee, AppSyncEventIamResource.ofChannelNamespace(this.channelNamespace.name), 'appsync:EventPublish');
  }

  /**
   * Adds an IAM policy statement for EventPublish and EventSubscribe access to this channel namespace to an IAM
   * principal's policy.
   *
   * @param grantee The principal
   */
  public grantPublishAndSubscribe(grantee: IGrantable) {
    return this.api.grant(grantee, AppSyncEventIamResource.ofChannelNamespace(this.channelNamespace.name), 'appsync:EventPublish', 'appsync:EventSubscribe');
  }

  private validateAuthorizationConfig(apiAuthProviders: AppSyncAuthorizationType[], channelAuthModeTypes: AppSyncAuthorizationType[]) {
    for (const mode of channelAuthModeTypes) {
      if (!apiAuthProviders.find((authProvider) => authProvider === mode)) {
        throw new Error(`API is missing authorization configuration for ${mode}`);
      }
    }
  }
}
