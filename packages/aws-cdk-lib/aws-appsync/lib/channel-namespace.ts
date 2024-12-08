import { Construct } from 'constructs';
import { IApi } from './api-base';
import { CfnChannelNamespace } from './appsync.generated';
import { AuthorizationType } from './auth-config';
import { Code } from './code';
import { IResource, Lazy, Names, Resource, Token } from '../../core';

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
 * Options for an AppSync channel namespace
 */
export interface ChannelNamespaceOptions {
  /**
   * The name of the channel namespace.
   * This name must be unique within the Api.
   *
   * @default - A name is automatically generated
   */
  readonly channelNamespaceName?: string;

  /**
   * The event handler function code
   *
   * @default - no code is used
   */
  readonly code?: Code;

  /**
   * The authorization mode to use for publishing messages on the channel namespace.
   * This configuration overrides the default Apiauthorization configuration.
   *
   * @default - not override the default Aipauthorization configuration
   */
  readonly publishAuthModes?: AuthorizationType[];

  /**
   * The authorization mode to use for subscribing to messages on the channel namespace.
   * This configuration overrides the default Apiauthorization configuration.
   *
   * @default - not override the default Aipauthorization configuration
   */
  readonly subscribeAuthModes?: AuthorizationType[];
}

/**
 * Properties for an AppSync channel namespace
 */
export interface ChannelNamespaceProps extends ChannelNamespaceOptions {
  /**
   * The Api
   */
  readonly api: IApi;
}

/**
 * An AppSync channel namespase
 *
 * @resource AWS::AppSync::ChannelNamespace
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
   * The ARN of the AppSync channel namespace
   */
  public readonly channelNamespaceArn: string;

  constructor(scope: Construct, id: string, props: ChannelNamespaceProps) {
    if (props.channelNamespaceName !== undefined && !Token.isUnresolved(props.channelNamespaceName)) {
      if (props.channelNamespaceName.length < 1 || props.channelNamespaceName.length > 50) {
        throw new Error(`\`channelNamespaceName\` must be between 1 and 50 characters, got: ${props.channelNamespaceName.length} characters.`);
      }

      const channelNamespaceNamePattern = /^[A-Za-z0-9]+$/;

      if (!channelNamespaceNamePattern.test(props.channelNamespaceName)) {
        throw new Error(`\`channelNamespaceName\` must contain only alphanumeric characters, got: ${props.channelNamespaceName}`);
      }
    }

    super(scope, id, {
      physicalName: props.channelNamespaceName ??
        Lazy.string({
          produce: () =>
            Names.uniqueResourceName(this, {
              maxLength: 50,
            }),
        }),
    });

    const code = props.code?.bind(this);
    const channelNamespace = new CfnChannelNamespace(this, 'Resource', {
      apiId: props.api.apiId,
      name: this.physicalName,
      codeHandlers: code?.inlineCode,
      codeS3Location: code?.s3Location,
      publishAuthModes: props.publishAuthModes?.map(mode => ({ authType: mode })),
      subscribeAuthModes: props.subscribeAuthModes?.map(mode => ({ authType: mode })),
    });

    this.channelNamespaceArn = channelNamespace.attrChannelNamespaceArn;
  }
}

