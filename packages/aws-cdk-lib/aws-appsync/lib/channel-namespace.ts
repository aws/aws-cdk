import { Construct } from 'constructs';
import { AppSyncEventResource } from './appsync-common';
import { CfnChannelNamespace } from './appsync.generated';
import { AppSyncAuthorizationType } from './auth-config';
import { Code } from './code';
import {
  AppSyncBackedDataSource,
  AppSyncDataSourceType,
  LambdaInvokeType,
} from './data-source-common';
import { IEventApi } from './eventapi';
import { IGrantable } from '../../aws-iam';
import { IResource, Resource, Token, ValidationError } from '../../core';
import { addConstructMetadata, MethodMetadata } from '../../core/lib/metadata-resource';

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
 * Enumerated type for the handler behavior for a channel namespace
 */
export enum HandlerBehavior {
  /**
   * Code handler
   */
  CODE = 'CODE',
  /**
   * Direct integration handler
   */
  DIRECT = 'DIRECT',
}

/**
 * Lambda invocation type configuration for handler integration
 */
export interface LambdaConfigOptions {
  /**
   * The Lambda invoke type for the integration
   *
   * @default - LambdaInvokeType.REQUEST_RESPONSE
   */
  readonly invokeType?: LambdaInvokeType;
}

/**
 * Integration configuration for handlers
 */
export interface IntegrationOptions {
  /**
   * Data source to invoke for this integration
   */
  readonly dataSourceName: string;

  /**
   * Configuration for Lambda integration
   *
   * @default - No Lambda specific configuration
   */
  readonly lambdaConfig?: LambdaConfigOptions;
}

/**
 * Configuration for individual event handlers
 */
export interface HandlerConfigOptions {
  /**
   * The behavior of the handler
   */
  readonly behavior: HandlerBehavior;

  /**
   * Integration configuration for the handler
   */
  readonly integration: IntegrationOptions;
}

/**
 * Configuration for all handlers in the channel namespace
 */
export interface HandlerConfigsOptions {
  /**
   * Handler configuration for publish events
   *
   * @default - No publish handler configured
   */
  readonly onPublish?: HandlerConfigOptions;

  /**
   * Handler configuration for subscribe events
   *
   * @default - No subscribe handler configured
   */
  readonly onSubscribe?: HandlerConfigOptions;
}

/**
 * Handler configuration construct for onPublish and onSubscribe
 */
export interface HandlerConfig {
  /**
   * If the Event Handler should invoke the data source directly
   *
   * @default - false
   */
  readonly direct?: boolean;

  /**
   * The Event Handler data source
   *
   * @default - no data source is used
   */
  readonly dataSource?: AppSyncBackedDataSource;

  /**
   * The Lambda invocation type for direct integrations
   *
   * @default - LambdaInvokeType.REQUEST_RESPONSE
   */
  readonly lambdaInvokeType?: LambdaInvokeType;
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
   * onPublish handler config
   *
   * @default - no handler config
   */
  readonly publishHandlerConfig?: HandlerConfig;

  /**
   * onSubscribe handler config
   *
   * @default - no handler config
   */
  readonly subscribeHandlerConfig?: HandlerConfig;

  /**
   * Direct configuration for handler configs
   *
   * @default - Handler configs derived from publishHandlerConfig and subscribeHandlerConfig
   */
  readonly handlerConfigs?: HandlerConfigsOptions;

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
   * onPublish handler config
   *
   * @default - no handler config
   */
  readonly publishHandlerConfig?: HandlerConfig;

  /**
   * onSubscribe handler config
   *
   * @default - no handler config
   */
  readonly subscribeHandlerConfig?: HandlerConfig;

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
        throw new ValidationError(`\`channelNamespaceName\` must be between 1 and 50 characters, got: ${props.channelNamespaceName.length} characters.`, scope);
      }
    }

    super(scope, id, {
      physicalName: props.channelNamespaceName ?? id,
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.validateHandlerConfig(props);
    const code = props.code?.bind(this);

    let handlerConfig: { [key: string]: any } = {};

    // If direct handlerConfigs is provided, use it
    if (props.handlerConfigs) {
      handlerConfig = props.handlerConfigs;
    }
    // Otherwise, build from publishHandlerConfig and subscribeHandlerConfig for backward compatibility
    else {
      if (props.publishHandlerConfig) {
        handlerConfig = {
          onPublish: {
            behavior: props.publishHandlerConfig?.direct ? HandlerBehavior.DIRECT : HandlerBehavior.CODE,
            integration: {
              dataSourceName: props.publishHandlerConfig?.dataSource?.name || '',
            },
          },
        };

        if (handlerConfig.onPublish.behavior === HandlerBehavior.DIRECT) {
          handlerConfig.onPublish.integration.lambdaConfig = {
            invokeType: props.publishHandlerConfig?.lambdaInvokeType || LambdaInvokeType.REQUEST_RESPONSE,
          };
        }
      }

      if (props.subscribeHandlerConfig) {
        handlerConfig = {
          ...handlerConfig,
          onSubscribe: {
            behavior: props.subscribeHandlerConfig?.direct ? HandlerBehavior.DIRECT : HandlerBehavior.CODE,
            integration: {
              dataSourceName: props.subscribeHandlerConfig?.dataSource?.name || '',
            },
          },
        };

        if (handlerConfig.onSubscribe.behavior === HandlerBehavior.DIRECT) {
          handlerConfig.onSubscribe.integration.lambdaConfig = {
            invokeType: props.subscribeHandlerConfig?.lambdaInvokeType || LambdaInvokeType.REQUEST_RESPONSE,
          };
        }
      }
    }

    this.validateAuthorizationConfig(props.api.authProviderTypes, props.authorizationConfig?.publishAuthModeTypes ?? []);
    this.validateAuthorizationConfig(props.api.authProviderTypes, props.authorizationConfig?.subscribeAuthModeTypes ?? []);

    this.channelNamespace = new CfnChannelNamespace(this, 'Resource', {
      name: this.physicalName,
      apiId: props.api.apiId,
      codeHandlers: code?.inlineCode,
      codeS3Location: code?.s3Location,
      handlerConfigs: handlerConfig,
      publishAuthModes: props.authorizationConfig?.publishAuthModeTypes?.map((mode) => ({
        authType: mode,
      })),
      subscribeAuthModes: props.authorizationConfig?.subscribeAuthModeTypes?.map((mode) => ({
        authType: mode,
      })),
    });

    if (props.publishHandlerConfig?.dataSource) {
      this.channelNamespace.addDependency(props.publishHandlerConfig.dataSource.resource);
    }
    if (props.subscribeHandlerConfig?.dataSource) {
      this.channelNamespace.addDependency(props.subscribeHandlerConfig.dataSource.resource);
    }
    this.channelNamespaceArn = this.channelNamespace.attrChannelNamespaceArn;
    this.api = props.api;
  }

  /**
   * Adds an IAM policy statement for EventSubscribe access to this channel namespace to an IAM
   * principal's policy.
   *
   * @param grantee The principal
   */
  @MethodMetadata()
  public grantSubscribe(grantee: IGrantable) {
    return this.api.grant(grantee, AppSyncEventResource.ofChannelNamespace(this.channelNamespace.name), 'appsync:EventSubscribe');
  }

  /**
   * Adds an IAM policy statement for EventPublish access to this channel namespace to an IAM
   * principal's policy.
   *
   * @param grantee The principal
   */
  @MethodMetadata()
  public grantPublish(grantee: IGrantable) {
    return this.api.grant(grantee, AppSyncEventResource.ofChannelNamespace(this.channelNamespace.name), 'appsync:EventPublish');
  }

  /**
   * Adds an IAM policy statement for EventPublish and EventSubscribe access to this channel namespace to an IAM
   * principal's policy.
   *
   * @param grantee The principal
   */
  @MethodMetadata()
  public grantPublishAndSubscribe(grantee: IGrantable) {
    return this.api.grant(grantee, AppSyncEventResource.ofChannelNamespace(this.channelNamespace.name), 'appsync:EventPublish', 'appsync:EventSubscribe');
  }

  private validateAuthorizationConfig(apiAuthProviders: AppSyncAuthorizationType[], channelAuthModeTypes: AppSyncAuthorizationType[]) {
    for (const mode of channelAuthModeTypes) {
      if (!apiAuthProviders.find((authProvider) => authProvider === mode)) {
        throw new ValidationError(`API is missing authorization configuration for ${mode}`, this);
      }
    }
  }

  private validateHandlerConfig(props?: ChannelNamespaceProps) {
    // Handle the case when direct handlerConfigs is provided
    if (props?.handlerConfigs) {
      // If code is provided when both handlers are direct, it's an error
      const onPublishDirect = props.handlerConfigs.onPublish?.behavior === HandlerBehavior.DIRECT;
      const onSubscribeDirect = props.handlerConfigs.onSubscribe?.behavior === HandlerBehavior.DIRECT;
      if (onPublishDirect && onSubscribeDirect && props.code) {
        throw new ValidationError('Code handlers are not supported when both publish and subscribe use the Direct data source behavior', this);
      }
      return;
    }

    // Handle the case when no handler configs are defined for publish or subscribe
    if (!props?.publishHandlerConfig && !props?.subscribeHandlerConfig) return undefined;

    // Handle the case where behavior is direct but Lambda is not the data source
    if (props.publishHandlerConfig?.direct) {
      if (!props.publishHandlerConfig.dataSource) {
        throw new ValidationError('No data source provided. AWS_LAMBDA data source is required for Direct handler behavior type', this);
      }
      if (props.publishHandlerConfig.dataSource.resource.type !== AppSyncDataSourceType.LAMBDA) {
        throw new ValidationError('Direct integration is only supported for AWS_LAMBDA data sources.', this);
      }
    }

    if (props.subscribeHandlerConfig?.direct) {
      if (!props.subscribeHandlerConfig.dataSource) {
        throw new ValidationError('No data source provided. AWS_LAMBDA data source is required for Direct handler behavior type', this);
      }
      if (props.subscribeHandlerConfig.dataSource.resource.type !== AppSyncDataSourceType.LAMBDA) {
        throw new ValidationError('Direct integration is only supported for AWS_LAMBDA data sources.', this);
      }
    }

    // Handle the case where behavior is direct for both publish and subscribe, but code handler is provided
    if (props.publishHandlerConfig?.direct && props.subscribeHandlerConfig?.direct && props.code) {
      throw new ValidationError('Code handlers are not supported when both publish and subscribe use the Direct data source behavior', this);
    }

    // Handle the case where behavior is code and Lambda invoke type is specified
    if (!props.publishHandlerConfig?.direct && props.publishHandlerConfig?.lambdaInvokeType) {
      throw new ValidationError('LambdaInvokeType is only supported for Direct handler behavior type', this);
    }

    // Handle the case where behavior is code and Lambda invoke type is specified
    if (!props.subscribeHandlerConfig?.direct && props.subscribeHandlerConfig?.lambdaInvokeType) {
      throw new ValidationError('LambdaInvokeType is only supported for Direct handler behavior type', this);
    }
  }
}
