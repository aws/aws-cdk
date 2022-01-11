import * as cognito from '@aws-cdk/aws-cognito';
import * as iam from '@aws-cdk/aws-iam';
import {
  Arn, Resource,
} from '@aws-cdk/core';
import {
  AwsCustomResource,
  AwsCustomResourcePolicy,
  AwsSdkCall,
  PhysicalResourceId,
} from '@aws-cdk/custom-resources';
import { Construct } from 'constructs';
import * as rum from './rum.generated';
/**
 * All app monitor telemetories
 */
export enum AppMonitorTelemetory {
  /**
   * performance indicates that RUM collects performance data about how your application
   * and its resources are loaded and rendered. This includes Core Web Vitals.
   */
  PERFORMANCE = 'performance',
  /**
   * errors indicates that RUM collects data about unhandled JavaScript errors raised by your application.
   */
  ERRORS = 'errors',
  /**
   * http indicates that RUM collects data about HTTP errors thrown by your application.
   */
  HTTP = 'http',
}

/**
 * AppMonitorConfiguration
 *
 * @see https://docs.aws.amazon.com/cloudwatchrum/latest/APIReference/API_AppMonitorConfiguration.html
 */
export interface AppMonitorConfiguration {
  /**
   * If you set this to true, the CloudWatch RUM web client sets two cookies,
   * a session cookie and a user cookie. The cookies allow the CloudWatch RUM web client
   * to collect data relating to the number of users an application has and
   * the behavior of the application across a sequence of events.
   * Cookies are stored in the top-level domain of the current page.
   *
   * @default false
   */
  readonly allowCookies?: boolean;
  /**
   * If you set this to true, CloudWatch RUM sends client-side traces to X-Ray for each sampled session.
   * You can then see traces and segments from these user sessions in the RUM dashboard and the CloudWatch ServiceLens console.
   *
   * @default false
   */
  readonly enableXRay?: boolean;
  /**
   * A list of URLs in your website or application to exclude from RUM data collection..
   *
   * @default - No exclude pages.
   */
  readonly excludedPages?: string[];
  /**
   * A list of pages in your application that are to be displayed with a 'favorite' icon in the CloudWatch RUM console.
   *
   * @default - No favorite pages.
   */
  readonly favoritePages?: string[];
  /**
   * The ARN of the guest IAM role that is attached to the Amazon Cognito identity pool
   * that is used to authorize the sending of data to CloudWatch RUM.
   *
   * @default - Generated role ARN.
   */
  readonly guestRoleArn?: string;
  /**
   * The ID of the Amazon Cognito identity pool that is used to authorize the sending of data to CloudWatch RUM.
   * When you exclude this parameter, then this Construct creates a new Cognito identity pool.
   *
   * @default - Generated identity pool ID.
   */
  readonly identityPoolId?: string;
  /**
   * If this app monitor is to collect data from only certain pages in your application,
   * this structure lists those pages.
   * You can't include both ExcludedPages and IncludedPages in the same app monitor.
   *
   * @default - No include pages.
   */
  readonly includedPages?: string[];
  /**
   * Specifies the portion of user sessions to use for CloudWatch RUM data collection.
   * Choosing a higher portion gives you more data but also incurs more costs.
   * The range for this value is 0 to 1 inclusive.
   * Setting this to 1 means that 100% of user sessions are sampled,
   * and setting it to 0.1 means that 10% of user sessions are sampled.
   *
   * @default 0.1
   */
  readonly sessionSampleRate?: number;
  /**
   * An array that lists the types of telemetry data that this app monitor is to collect.
   *
   * @default - No collect telemetries.
   */
  readonly telemetries?: AppMonitorTelemetory[];
}

/**
 * App Monitor Props.
 */
export interface AppMonitorProps {
  /**
   * The top-level internet domain name for which your application has administrative authority.
   */
  readonly domain: string;
  /**
   * Name of this AppMonitor.
   */
  readonly appMonitorName: string;
  /**
   * A structure that contains much of the configuration data for the app monitor.
   * When you exclude this parameter, then this Construct creates a new Cognito identity pool.
   * If you don't create a new Cognito identity pool and use thrid-party provider,
   * then you can set useThirdPartyProvider to true.
   *
   * @default - Use default values every property.
   */
  readonly appMonitorConfiguration?: AppMonitorConfiguration;
  /**
   * Data collected by CloudWatch RUM is kept by RUM for 30 days and then deleted.
   * This parameter specifies whether CloudWatch RUM sends a copy of this telemetry data to Amazon CloudWatch Logs in your account.
   * This enables you to keep the telemetry data for more than 30 days, but it does incur Amazon CloudWatch Logs charges.
   *
   * @default false
   */
  readonly cwLogEnabled?: boolean;
  /**
   * If you don't create a new Cognito identity pool and use thrid-party provider,
   *
   * @default false
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-get-started-authorization.html#CloudWatch-RUM-get-started-authorization-thirdparty
   */
  readonly useThirdPartyProvider?: boolean;
}
interface TelemetryErrorsOption {
  stackTraceLength: number;
}
type TelemetryErrorsConfig = 'errors' | ['errors', TelemetryErrorsOption];
interface TelemetryHTTPOption {
  urlsToInclude: RegExp[];
  urlsToExclude: RegExp[];
  stackTraceLength: number;
  recordAllRequests: boolean;
  addXRayTraceIdHeader: boolean;
}
type TelemetryHTTPConfig = 'http' | ['http', TelemetryHTTPOption];
interface TelemetryInteractionOption {
  events: any[];
}
type TelemetryInteractionConfig =
  | 'interaction'
  | ['interaction', TelemetryInteractionOption];
interface TelemetryPerformanceOption {
  eventLimit: number;
}
type TelemetryPerformanceConfig =
  | 'performance'
  | ['performance', TelemetryPerformanceOption];
type TelemetryConfig =
  | TelemetryErrorsConfig
  | TelemetryHTTPConfig
  | TelemetryInteractionConfig
  | TelemetryPerformanceConfig;
interface CookieAttibute {
  domain: string
  path: string
  sameSite: boolean
  Secure: boolean
}
interface AppMonitorClientConfiguration {
  allowCookies: boolean;
  cookieAttibutes: CookieAttibute;
  disableAutoPageView: boolean;
  enableRumClient: boolean;
  enableXRay: boolean;
  endpoint: string;
  guestRoleArn: string;
  identityPoolId: string;
  pageIdFormat: string;
  pagesToInclude: string[];
  pagesToExclude: string[];
  recordResourceUrl: boolean;
  sessionEventLimit: number;
  sessionSampleRate: number;
  telemetries: TelemetryConfig[];
}
/**
 * Define a RUM App Monitor.
 */
export class AppMonitor extends Resource {
  private readonly appMonitor: rum.CfnAppMonitor;
  private readonly appMonitorCustomResource: AwsCustomResource;
  private readonly identityPool?: cognito.CfnIdentityPool;
  private readonly guestRole?: iam.Role;
  constructor(scope: Construct, id: string, props: AppMonitorProps) {
    super(scope, id, {
      physicalName: props.appMonitorName,
    });

    // If not passed identityPoolId, when create a new identity pool.
    // This like a to create RUM in management console.
    const createNewIdentityPool =
      props.appMonitorConfiguration?.identityPoolId === undefined &&
      !props.useThirdPartyProvider;

    if (createNewIdentityPool) {
      const { identityPool, guestRole } = this.createIdentityPool(props.appMonitorName);
      this.identityPool = identityPool;
      this.guestRole = guestRole;
    }

    this.appMonitor = new rum.CfnAppMonitor(this, 'AppMonitor', {
      name: props.appMonitorName,
      domain: props.domain,
      cwLogEnabled: props.cwLogEnabled,
      appMonitorConfiguration: {
        ...props.appMonitorConfiguration,
        identityPoolId: createNewIdentityPool
          ? this.identityPool?.ref
          : props.appMonitorConfiguration?.identityPoolId,
        guestRoleArn: createNewIdentityPool
          ? this.guestRole?.roleArn
          : props.appMonitorConfiguration?.guestRoleArn,
      },
    });
    this.appMonitorCustomResource = this.createAppMonitorCustomResource(
      this.appMonitor,
    );
  }
  /**
   * Returns the ARN of this app monitor.
   * @attribute
   */
  public get appMonitorArn(): string {
    return this.arnFromName(this.appMonitor.name as string);
  }
  /**
   * Returns the app monitor id of this app monitor.
   * @attribute
   */
  public get appMonitorId(): string {
    return this.appMonitorCustomResource.getResponseField('AppMonitor.Id');
  }
  /**
   * Returns the JavaScript code snippet for use this app monitor.
   * @attribute
   */
  public get codeSnippet(): string {
    const resourceConfig = this.appMonitor
      .appMonitorConfiguration as AppMonitorConfiguration;
    const clientConfig: Partial<AppMonitorClientConfiguration> = {
      allowCookies: resourceConfig.allowCookies,
      enableXRay: resourceConfig.enableXRay,
      endpoint: `https://dataplane.rum.${this.stack.region}.amazonaws.com`,
      guestRoleArn: resourceConfig.guestRoleArn,
      identityPoolId: resourceConfig.identityPoolId,
      pagesToInclude: resourceConfig.includedPages,
      pagesToExclude: resourceConfig.excludedPages,
      sessionSampleRate: resourceConfig.sessionSampleRate,
      telemetries: resourceConfig.telemetries,
    };
    return (
      '(function(n,i,v,r,s,c,x,z){' +
      'x=window.AwsRumClient={q:[],n:n,i:i,v:v,r:r,c:c};' +
      'window[n]=function(c,p){x.q.push({c:c,p:p});};' +
      "z=document.createElement('script');" +
      'z.async=true;' +
      'z.src=s;' +
      "document.head.insertBefore(z,document.getElementsByTagName('script')[0]);" +
      '})(' +
      "'cwr'," +
      `'${this.appMonitorId}',` +
      '\'1.0.0\',' +
      `'${this.stack.region}',` +
      '\'https://client.rum.us-east-1.amazonaws.com/1.0.2/cwr.js\',' +
      `${JSON.stringify(clientConfig)}` +
      ');'
    );
  }
  private arnFromName(name: string) {
    return Arn.format(
      {
        service: 'rum',
        resource: 'appmonitor',
        resourceName: name,
      },
      this.stack,
    );
  }
  private createIdentityPool(appMonitorName: string) {
    const identityPool = new cognito.CfnIdentityPool(this, 'IdentityPool', {
      identityPoolName: `RUM-Monitor-${this.stack.region}-${this.stack.account}-${appMonitorName}`,
      allowUnauthenticatedIdentities: true,
    });
    const guestRole = new iam.Role(this, 'GuestRole', {
      roleName: `RUM-Monitor-${this.stack.region}-${this.stack.account}-${appMonitorName}-Unauth`,
      assumedBy: new iam.FederatedPrincipal(
        'cognito-identity.amazonaws.com',
        {
          'StringEquals': {
            'cognito-identity.amazonaws.com:aud': identityPool.ref,
          },
          'ForAnyValue:StringLike': {
            'cognito-identity.amazonaws.com:amr': 'unauthenticated',
          },
        },
        'sts:AssumeRoleWithWebIdentity',
      ),
      managedPolicies: [
        new iam.ManagedPolicy(this, 'RUMPutBatchMetrics', {
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ['rum:PutRumEvents'],
              resources: [this.arnFromName(appMonitorName)],
            }),
          ],
        }),
      ],
    });
    new cognito.CfnIdentityPoolRoleAttachment(
      this,
      'IdentityPoolRoleAttachment',
      {
        identityPoolId: identityPool.ref,
        roles: {
          unauthenticated: guestRole.roleArn,
        },
      },
    );
    return { identityPool, guestRole };
  }
  private createAppMonitorCustomResource(appMonitor: rum.CfnAppMonitor) {
    const awsRumSdkCall: AwsSdkCall = {
      service: 'RUM',
      action: 'getAppMonitor',
      parameters: { Name: appMonitor.name },
      physicalResourceId: PhysicalResourceId.of(this.physicalName),
    };
    const customResource = new AwsCustomResource(
      this,
      'Custom::GetAppMonitor',
      {
        resourceType: 'Custom::GetAppMonitor',
        policy: AwsCustomResourcePolicy.fromSdkCalls({
          resources: [this.arnFromName(appMonitor.name as string)],
        }),
        installLatestAwsSdk: true,
        onCreate: awsRumSdkCall,
        onUpdate: awsRumSdkCall,
        functionName: 'GetAppMonitorCustomResourceHandler',
      },
    );
    customResource.node.addDependency(appMonitor);
    return customResource;
  }
}