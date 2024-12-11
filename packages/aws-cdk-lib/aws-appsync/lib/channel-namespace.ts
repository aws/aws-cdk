import { Construct } from 'constructs';
import { IamResource } from './appsync-common';
import { CfnChannelNamespace } from './appsync.generated';
import { AuthorizationType } from './auth-config';
import { Code } from './code';
import { IEventApi } from './eventapi';
import { IGrantable } from '../../aws-iam';

/**
 * Authorization configuration for the Channel Namespace
 */
export interface NamespaceAuthConfig {
  /**
   * The publish auth modes for this Event Api
   * @default - API Key authorization
   */
  readonly publishAuthModeTypes?: AuthorizationType[];

  /**
   * The subscribe auth modes for this Event Api
   * @default - API Key authorization
   */
  readonly subscribeAuthModeTypes?: AuthorizationType[];
}

/**
 * the base properties for a channel namespace
 */
export interface BaseChannelNamespaceProps {
  /**
   * the name of the channel namespace
   *
   * @default - id of channel namespace
   */
  readonly name?: string;

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
   * @default - the `id` is used if not provided
   */
  readonly name?: string;

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
export class ChannelNamespace extends Construct {
  /**
   * the ARN of the channel namespace
   */
  public readonly arn: string;

  private channelNamespace: CfnChannelNamespace;

  private api: IEventApi;

  constructor(scope: Construct, id: string, props: ChannelNamespaceProps) {
    super(scope, id);

    const code = props.code?.bind(this);

    this.validateAuthorizationConfig(props.api.authProviderTypes, props.authorizationConfig?.publishAuthModeTypes ?? []);
    this.validateAuthorizationConfig(props.api.authProviderTypes, props.authorizationConfig?.subscribeAuthModeTypes ?? []);

    this.api = props.api;

    this.channelNamespace = new CfnChannelNamespace(this, 'Resource', {
      name: props.name ?? id,
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

    this.arn = this.channelNamespace.attrChannelNamespaceArn;
  }

  /**
   * Adds an IAM policy statement for EventSubscribe access to this channel namespace to an IAM
   * principal's policy.
   *
   * @param grantee The principal
   */
  public grantSubscribe(grantee: IGrantable) {
    return this.api.grant(grantee, IamResource.ofChannelNamespace(this.channelNamespace.name), 'appsync:EventPublish');
  }

  /**
   * Adds an IAM policy statement for EventPublish access to this channel namespace to an IAM
   * principal's policy.
   *
   * @param grantee The principal
   */
  public grantPublish(grantee: IGrantable) {
    return this.api.grant(grantee, IamResource.ofChannelNamespace(this.channelNamespace.name), 'appsync:EventSubscribe');
  }

  /**
   * Adds an IAM policy statement for EventPublish and EventSubscribe access to this channel namespace to an IAM
   * principal's policy.
   *
   * @param grantee The principal
   */
  public grantPublishSubscribe(grantee: IGrantable) {
    return this.api.grant(grantee, IamResource.ofChannelNamespace(this.channelNamespace.name), 'appsync:EventPublish', 'appsync:EventSubscribe');
  }

  private validateAuthorizationConfig(authProviderTypes: AuthorizationType[], authModeTypes: AuthorizationType[]) {
    for (const mode of authModeTypes) {
      if (!authProviderTypes.find((authProvider) => authProvider === mode)) {
        throw new Error(`API is missing authorization configuration for ${mode}`);
      }
    }
  }
}
