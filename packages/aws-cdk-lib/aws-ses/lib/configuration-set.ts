import { Construct } from 'constructs';
import { ConfigurationSetEventDestination, ConfigurationSetEventDestinationOptions } from './configuration-set-event-destination';
import { IDedicatedIpPool } from './dedicated-ip-pool';
import { undefinedIfNoKeys } from './private/utils';
import { CfnConfigurationSet } from './ses.generated';
import { Duration, IResource, Resource, Token } from '../../core';

/**
 * A configuration set
 */
export interface IConfigurationSet extends IResource {
  /**
   * The name of the configuration set
   *
   * @attribute
   */
  readonly configurationSetName: string;
}

/**
 * Properties for a configuration set
 */
export interface ConfigurationSetProps {
  /**
   * A name for the configuration set
   *
   * @default - a CloudFormation generated name
   */
  readonly configurationSetName?: string;

  /**
   * The dedicated IP pool to associate with the configuration set
   *
   * @default - do not use a dedicated IP pool
   */
  readonly dedicatedIpPool?: IDedicatedIpPool;

  /**
   * Specifies whether messages that use the configuration set are required to
   * use Transport Layer Security (TLS)
   *
   * @default ConfigurationSetTlsPolicy.OPTIONAL
   */
  readonly tlsPolicy?: ConfigurationSetTlsPolicy;

  /**
   * Whether to publish reputation metrics for the configuration set, such as
   * bounce and complaint rates, to Amazon CloudWatch
   *
   * @default true
   */
  readonly reputationMetrics?: boolean;

  /**
   * Whether email sending is enabled
   *
   * @default true
   */
  readonly sendingEnabled?: boolean;

  /**
   * The reasons for which recipient email addresses should be automatically added
   * to your account's suppression list
   *
   * @default - use account level settings
   */
  readonly suppressionReasons?: SuppressionReasons;

  /**
   * If true, account-level suppression list is disabled; email sent with this configuration set
   * will not use any suppression settings at all
   *
   * @default false
   */
  readonly disableSuppressionList?: boolean;

  /**
   * The custom subdomain that is used to redirect email recipients to the
   * Amazon SES event tracking domain
   *
   * @default - use the default awstrack.me domain
   */
  readonly customTrackingRedirectDomain?: string;

  /**
   * The Virtual Deliverability Manager (VDM) options that apply to the configuration set
   *
   * @default - VDM options not configured at the configuration set level. In this case, use account level settings. (To set the account level settings using CDK, use the `VdmAttributes` Construct.)
   */
  readonly vdmOptions?: VdmOptions;

  /**
   * The maximum amount of time that Amazon SES API v2 will attempt delivery of email.
   *
   * This value must be greater than or equal to 5 minutes and less than or equal to 14 hours.
   *
   * @default undefined - SES defaults to 14 hours
   */
  readonly maxDeliveryDuration?: Duration;
}

/**
 * Properties for the Virtual Deliverability Manager (VDM) options that apply to the configuration set
 */
export interface VdmOptions {
  /**
   * If true, engagement metrics are enabled for the configuration set
   *
   * @default - Engagement metrics not configured at the configuration set level. In this case, use account level settings.
   */
  readonly engagementMetrics?: boolean;

  /**
   * If true, optimized shared delivery is enabled for the configuration set
   *
   * @default - Optimized shared delivery not configured at the configuration set level. In this case, use account level settings.
   */
  readonly optimizedSharedDelivery?: boolean;
}

/**
 * TLS policy for a configuration set
 */
export enum ConfigurationSetTlsPolicy {
  /**
   * Messages are only delivered if a TLS connection can be established
   */
  REQUIRE = 'REQUIRE',

  /**
   * Messages can be delivered in plain text if a TLS connection can't be established
   */
  OPTIONAL = 'OPTIONAL',
}

/**
 * Reasons for which recipient email addresses should be automatically added
 * to your account's suppression list
 */
export enum SuppressionReasons {
  /**
   * Bounces and complaints
   */
  BOUNCES_AND_COMPLAINTS = 'BOUNCES_AND_COMPLAINTS',

  /**
   * Bounces only
   */
  BOUNCES_ONLY = 'BOUNCES_ONLY',

  /**
   * Complaints only
   */
  COMPLAINTS_ONLY = 'COMPLAINTS_ONLY',
}

/**
 * A configuration set
 */
export class ConfigurationSet extends Resource implements IConfigurationSet {
  /**
   * Use an existing configuration set
   */
  public static fromConfigurationSetName(scope: Construct, id: string, configurationSetName: string): IConfigurationSet {
    class Import extends Resource implements IConfigurationSet {
      public readonly configurationSetName = configurationSetName;
    }
    return new Import(scope, id);
  }

  public readonly configurationSetName: string;

  constructor(scope: Construct, id: string, props: ConfigurationSetProps = {}) {
    super(scope, id, {
      physicalName: props.configurationSetName,
    });

    if (props.disableSuppressionList && props.suppressionReasons) {
      throw new Error('When disableSuppressionList is true, suppressionReasons must not be specified.');
    }
    if (props.maxDeliveryDuration && !Token.isUnresolved(props.maxDeliveryDuration)) {
      if (props.maxDeliveryDuration.toMilliseconds() < Duration.minutes(5).toMilliseconds()) {
        throw new Error(`The maximum delivery duration must be greater than or equal to 5 minutes (300_000 milliseconds), got: ${props.maxDeliveryDuration.toMilliseconds()} milliseconds.`);
      }
      if (props.maxDeliveryDuration.toSeconds() > Duration.hours(14).toSeconds()) {
        throw new Error(`The maximum delivery duration must be less than or equal to 14 hours (50400 seconds), got: ${props.maxDeliveryDuration.toSeconds()} seconds.`);
      }
    }

    const configurationSet = new CfnConfigurationSet(this, 'Resource', {
      deliveryOptions: undefinedIfNoKeys({
        sendingPoolName: props.dedicatedIpPool?.dedicatedIpPoolName,
        tlsPolicy: props.tlsPolicy,
        maxDeliverySeconds: props.maxDeliveryDuration?.toSeconds(),
      }),
      name: this.physicalName,
      reputationOptions: undefinedIfNoKeys({
        reputationMetricsEnabled: props.reputationMetrics,
      }),
      sendingOptions: undefinedIfNoKeys({
        sendingEnabled: props.sendingEnabled,
      }),
      suppressionOptions: undefinedIfNoKeys({
        suppressedReasons: props.disableSuppressionList ? [] : renderSuppressedReasons(props.suppressionReasons),
      }),
      trackingOptions: undefinedIfNoKeys({
        customRedirectDomain: props.customTrackingRedirectDomain,
      }),
      vdmOptions: undefinedIfNoKeys({
        dashboardOptions: props.vdmOptions?.engagementMetrics !== undefined ? {
          engagementMetrics: booleanToEnabledDisabled(props.vdmOptions?.engagementMetrics),
        } : undefined,
        guardianOptions: props.vdmOptions?.optimizedSharedDelivery !== undefined ? {
          optimizedSharedDelivery: booleanToEnabledDisabled(props.vdmOptions?.optimizedSharedDelivery),
        } : undefined,
      }),
    });

    this.configurationSetName = configurationSet.ref;
  }

  /**
   * Adds an event destination to this configuration set
   */
  public addEventDestination(id: string, options: ConfigurationSetEventDestinationOptions): ConfigurationSetEventDestination {
    return new ConfigurationSetEventDestination(this, id, {
      ...options,
      configurationSet: this,
    });
  }
}

function renderSuppressedReasons(suppressionReasons?: SuppressionReasons): string[] | undefined {
  if (!suppressionReasons) {
    return undefined;
  }

  switch (suppressionReasons) {
    case SuppressionReasons.BOUNCES_AND_COMPLAINTS:
      return ['BOUNCE', 'COMPLAINT'];
    case SuppressionReasons.BOUNCES_ONLY:
      return ['BOUNCE'];
    case SuppressionReasons.COMPLAINTS_ONLY:
      return ['COMPLAINT'];
  }
}

function booleanToEnabledDisabled(value: boolean): 'ENABLED' | 'DISABLED' {
  return value === true
    ? 'ENABLED'
    : 'DISABLED';
}
