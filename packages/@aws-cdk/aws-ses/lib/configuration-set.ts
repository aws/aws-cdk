import { IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IDedicatedIpPool } from './dedicated-ip-pool';
import { CfnConfigurationSet } from './ses.generated';

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
   * Whether to publishe reputation metrics for the configuration set, such as
   * bounce and complaint rates, to Amazon CloudWatch
   *
   * @default false
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
   * The custom subdomain that is used to redirect email recipients to the
   * Amazon SES event tracking domain
   *
   * @default - use the default awstrack.me domain
   */
  readonly customTrackingRedirectDomain?: string,
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
    super(scope, id);

    const configurationSet = new CfnConfigurationSet(this, 'Resource', {
      deliveryOptions: {
        sendingPoolName: props.dedicatedIpPool?.dedicatedIpPoolName,
        tlsPolicy: props.tlsPolicy,
      },
      name: props.configurationSetName,
      reputationOptions: {
        reputationMetricsEnabled: props.reputationMetrics,
      },
      sendingOptions: {
        sendingEnabled: props.sendingEnabled ?? true,
      },
      suppressionOptions: {
        suppressedReasons: renderSuppressedReasons(props.suppressionReasons),
      },
      trackingOptions: {
        customRedirectDomain: props.customTrackingRedirectDomain,
      },
    });

    this.configurationSetName = configurationSet.ref;
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
