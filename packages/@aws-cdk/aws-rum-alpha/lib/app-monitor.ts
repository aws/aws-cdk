import { IResource, Resource, Fn } from 'aws-cdk-lib';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as rum from 'aws-cdk-lib/aws-rum';
import { ValidationError } from 'aws-cdk-lib/core/lib/errors';
import { Construct } from 'constructs';

/**
 * Represents a RUM App Monitor
 */
export interface IAppMonitor extends IResource {
  /**
   * The ID of the app monitor
   * @attribute
   */
  readonly appMonitorId: string;

  /**
   * The name of the app monitor
   * @attribute
   */
  readonly appMonitorName: string;

  /**
   * The CloudWatch log group for this RUM app monitor.
   *
   * Only available when `cwLogEnabled` is set to `true`.
   * Returns `undefined` when `cwLogEnabled` is `false`.
   */
  readonly logGroup?: logs.ILogGroup;
}

/**
 * Custom events configuration for RUM App Monitor
 */
export interface CustomEventsConfig {
  /**
   * Whether custom events are enabled
   *
   * @default false
   */
  readonly enabled?: boolean;
}

/**
 * JavaScript source maps configuration
 */
export interface JavaScriptSourceMapsConfig {
  /**
   * Whether JavaScript source maps are enabled
   */
  readonly enabled: boolean;

  /**
   * The S3 URI of the bucket or folder that stores the source map files
   * Required if enabled is true
   *
   * @default - No S3 URI provided
   */
  readonly s3Uri?: string;
}

/**
 * Deobfuscation configuration for RUM App Monitor
 */
export interface DeobfuscationConfig {
  /**
   * JavaScript source maps configuration
   *
   * @default - No JavaScript source maps configuration
   */
  readonly javaScriptSourceMaps?: JavaScriptSourceMapsConfig;
}

/**
 * App Monitor configuration for RUM
 */
export interface AppMonitorConfiguration {
  /**
   * Whether to allow cookies for tracking user sessions
   *
   * @default false
   */
  readonly allowCookies?: boolean;

  /**
   * Whether to enable X-Ray tracing
   *
   * @default false
   */
  readonly enableXRay?: boolean;

  /**
   * Portion of user sessions to sample for data collection
   * Range: 0 to 1 inclusive
   *
   * @default 0.1
   */
  readonly sessionSampleRate?: number;
}

/**
 * Properties for defining a RUM App Monitor
 */
export interface AppMonitorProps {
  /**
   * A name for the app monitor.
   * This parameter is required.
   */
  readonly appMonitorName: string;

  /**
   * The top-level internet domain name for which your application has administrative authority.
   * Either this parameter or domainList is required.
   */
  readonly domain: string;

  /**
   * Data collected by RUM is kept by RUM for 30 days and then deleted.
   * This parameter specifies whether RUM sends a copy of this telemetry data
   * to Amazon CloudWatch Logs in your account.
   *
   * @default false
   */
  readonly cwLogEnabled?: boolean;

  /**
   * Configuration data for the app monitor.
   *
   * @default - No configuration
   */
  readonly appMonitorConfiguration?: AppMonitorConfiguration;

  /**
   * Custom events configuration for the app monitor.
   *
   * @default - Custom events are disabled
   */
  readonly customEvents?: CustomEventsConfig;

  /**
   * Deobfuscation configuration for stack trace processing.
   *
   * @default - No deobfuscation configuration
   */
  readonly deobfuscationConfiguration?: DeobfuscationConfig;
}

/**
 * Attributes for importing an existing RUM App Monitor
 */
export interface AppMonitorAttributes {
  /**
   * The ID of the app monitor
   */
  readonly appMonitorId: string;

  /**
   * The name of the app monitor
   */
  readonly appMonitorName: string;

  /**
   * Whether CloudWatch logs are enabled for this app monitor
   *
   * @default false
   */
  readonly cwLogEnabled?: boolean;
}

/**
 * A RUM App Monitor
 *
 * @resource AWS::RUM::AppMonitor
 */
export class AppMonitor extends Resource implements IAppMonitor {
  /**
   * Import an existing RUM App Monitor
   */
  public static fromAppMonitorAttributes(scope: Construct, id: string, attrs: AppMonitorAttributes): IAppMonitor {
    class Import extends Resource implements IAppMonitor {
      public readonly appMonitorId = attrs.appMonitorId;
      public readonly appMonitorName = attrs.appMonitorName;
      private readonly cwLogEnabled = attrs.cwLogEnabled ?? false;

      private _logGroup?: logs.ILogGroup;

      public get logGroup(): logs.ILogGroup | undefined {
        if (!this.cwLogEnabled) {
          return undefined;
        }

        if (!this._logGroup) {
          const logGroupName = Fn.sub('RUMService_${Name}${Id}', {
            Name: this.appMonitorName,
            Id: Fn.select(0, Fn.split('-', this.appMonitorId)),
          });

          this._logGroup = logs.LogGroup.fromLogGroupName(
            this,
            'LogGroup',
            logGroupName,
          );
        }

        return this._logGroup;
      }
    }

    return new Import(scope, id);
  }

  /**
   * The ID of the app monitor
   * @attribute
   */
  public readonly appMonitorId: string;

  /**
   * The name of the app monitor
   * @attribute
   */
  public readonly appMonitorName: string;

  /**
   * The underlying CfnAppMonitor resource
   */
  private readonly appMonitor: rum.CfnAppMonitor;

  /**
   * Cached log group instance for lazy evaluation
   */
  private _logGroup?: logs.ILogGroup;

  constructor(scope: Construct, id: string, props: AppMonitorProps) {
    super(scope, id);

    this.appMonitor = new rum.CfnAppMonitor(this, 'Resource', {
      name: props.appMonitorName,
      domain: props.domain,
      cwLogEnabled: props.cwLogEnabled,
      appMonitorConfiguration: props.appMonitorConfiguration ?
        this.renderAppMonitorConfiguration(props.appMonitorConfiguration) : undefined,
      customEvents: props.customEvents ? this.renderCustomEvents(props.customEvents) : undefined,
      deobfuscationConfiguration: props.deobfuscationConfiguration ?
        this.renderDeobfuscationConfiguration(props.deobfuscationConfiguration) : undefined,
    });

    this.appMonitorId = this.appMonitor.attrId;
    this.appMonitorName = props.appMonitorName ?? this.appMonitor.name!;
  }

  /**
   * Convert L2 AppMonitorConfiguration to L1 property
   */
  private renderAppMonitorConfiguration(config: AppMonitorConfiguration): rum.CfnAppMonitor.AppMonitorConfigurationProperty {
    return {
      allowCookies: config.allowCookies,
      enableXRay: config.enableXRay,
      sessionSampleRate: config.sessionSampleRate,
    };
  }

  /**
   * Convert L2 CustomEventsConfig to L1 property
   */
  private renderCustomEvents(config: CustomEventsConfig): rum.CfnAppMonitor.CustomEventsProperty {
    return {
      status: config.enabled === true ? 'ENABLED' : 'DISABLED',
    };
  }

  /**
   * Convert L2 DeobfuscationConfig to L1 property
   */
  private renderDeobfuscationConfiguration(config: DeobfuscationConfig): rum.CfnAppMonitor.DeobfuscationConfigurationProperty {
    return {
      javaScriptSourceMaps: config.javaScriptSourceMaps ? this.renderJavaScriptSourceMaps(config.javaScriptSourceMaps) : undefined,
    };
  }

  /**
   * Convert L2 JavaScriptSourceMapsConfig to L1 property
   */
  private renderJavaScriptSourceMaps(config: JavaScriptSourceMapsConfig): rum.CfnAppMonitor.JavaScriptSourceMapsProperty {
    if (config.enabled && !config.s3Uri) {
      throw new ValidationError('s3Uri is required when JavaScript source maps are enabled', this);
    }

    return {
      status: config.enabled ? 'ENABLED' : 'DISABLED',
      ...(config.s3Uri && { s3Uri: config.s3Uri }),
    };
  }

  /**
   * The CloudWatch log group for this RUM app monitor.
   *
   * Only available when `cwLogEnabled` is set to `true`.
   * Returns `undefined` when `cwLogEnabled` is `false`.
   */
  public get logGroup(): logs.ILogGroup | undefined {
    if (!this.appMonitor.cwLogEnabled) {
      return undefined;
    }

    // Cache the log group instance (lazy evaluation)
    if (!this._logGroup) {
      const logGroupName = Fn.sub('RUMService_${Name}${Id}', {
        Name: this.appMonitorName,
        Id: Fn.select(0, Fn.split('-', this.appMonitorId)),
      });

      this._logGroup = logs.LogGroup.fromLogGroupName(
        this,
        'LogGroup',
        logGroupName,
      );
    }

    return this._logGroup;
  }
}
