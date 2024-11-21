import { Construct } from 'constructs';
import { Code } from './code';
import { IEventApi } from './eventapi';
import { AuthorizationType } from './auth-config';
import { CfnChannelNamespace } from './appsync.generated';

/**
 * Authorization configuration for the Channel Namespace
 */
export interface NamespaceAuthConfig {
  /**
   * Default publish auth modes
   * @default - API Key authorization
   */
  readonly publishAuthModes?: AuthorizationType[];

  /**
   * Default subscribe auth modes
   * @default - API Key authorization
   */
  readonly subscribeAuthModes?: AuthorizationType[];
}

/**
 * the base properties for a channel namespace
 */
export interface BaseChannelNamespaceProps {
  /**
   * the name of the channel namespace
   */
  readonly name: string;

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

  constructor(scope: Construct, id: string, props: ChannelNamespaceProps) {
    super(scope, id);

    const code = props.code?.bind(this);
    this.channelNamespace = new CfnChannelNamespace(this, 'Resource', {
      name: props.name,
      apiId: props.api.apiId,
      codeHandlers: code?.inlineCode,
      codeS3Location: code?.s3Location
    });

    this.arn = this.channelNamespace.attrChannelNamespaceArn;
  }
}