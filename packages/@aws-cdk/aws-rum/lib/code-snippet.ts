import * as path from 'path';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3deployment from '@aws-cdk/aws-s3-deployment';
import { CustomResource, Duration } from '@aws-cdk/core';
import { IAppMonitor } from './app-monitor';

// Use @aws-cdk/core to implement s3deployment.ISource
// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/**
 * Configuration for `CodeSnippetOptions.telemetries`.
 */
export interface ITelemetryConfig {
  /**
   * One of telemetry config that is type name only or tuple of [type name, options].
   *
   * @example
   * { config: 'errors' }
   * { config: ['http', { stackTraceLength: 30 }] }
   */
  readonly config: any;
}

/**
 * Errors options of telemetry in RUM web client configuration.
 * @see https://github.com/aws-observability/aws-rum-web/blob/main/docs/cdn_installation.md#errors
 */
export interface ErrorsOptions {
  /**
   * The number of characters to record from a JavaScript error's stack trace (if available).
   *
   * @default 200
   */
  readonly stackTraceLength?: number;
}

/**
 * HTTP options of telemetry in RUM web client configuration.
 * @see https://github.com/aws-observability/aws-rum-web/blob/main/docs/cdn_installation.md#http
 */
export interface HttpOptions {
  /**
   * A list of HTTP request (XMLHttpRequest or fetch) URLs. These requests will be recorded, unless explicitly excluded by urlsToExclude.
   *
   * @default - [/.(*)/] The actual default value does not have the round brackets, but they are added because they cannot be written in the doc comment.
   */
  readonly urlsToInclude?: string[];
  /**
   * A list of HTTP request (XMLHttpRequest or fetch) URLs. These requests will not be recorded.
   *
   * @default []
   */
  readonly urlsToExclude?: string[];
  /**
   * The number of characters to record from a JavaScript error's stack trace (if available).
   *
   * @default 200
   */
  readonly stackTraceLength?: number;

  /**
   * By default, only HTTP failed requests (i.e., those with network errors or status codes which are not 2xx) are recorded.
   * When this field is true, the http telemetry will record all requests, including those with successful 2xx status codes.
   *
   * @default false
   */
  readonly recordAllRequests?: boolean;
  /**
   * By default, the X-Amzn-Trace-Id header will not be added to the HTTP request.
   * This means that the client-side trace and server-side trace will not be linked in X-Ray or the ServiceLens graph.
   *
   * @default false
   */
  readonly addXRayTraceIdHeader?: boolean;
}

/**
 * Interaction options of telemetry in RUM web client configuration.
 * @see https://github.com/aws-observability/aws-rum-web/blob/main/docs/cdn_installation.md#interaction
 */
export interface InteractionOptions {
  /**
   * An array of target DOM events to record.
   *
   * @example
   * // record a single element with Id mybutton
   * [{ event: 'click', elementId: 'mybutton' }]
   * // record a complete clickstream
   * [{ event: 'click', element: document }]
   *
   * @default []
   */
  readonly events?: any[];
}

/**
 * Performance options of telemetry in RUM web client configuration.
 * @see https://github.com/aws-observability/aws-rum-web/blob/main/docs/cdn_installation.md#performance
 */
export interface PerformanceOptions {
  /**
   * The maximum number of resources to record load timing.
   *
   * @default 10
   */
  readonly eventLimit?: number;
}

/**
 * Configuration factory for `CodeSnippetOptions.telemetries`.
 */
export class TelemetryConfig {
  /**
   * Use a errors telemetry config.
   */
  static errors(options?: ErrorsOptions): ITelemetryConfig {
    return TelemetryConfig.resolve('errors', options);
  }
  /**
   * Use a http telemetry config.
   */
  static http(options?: HttpOptions): ITelemetryConfig {
    return TelemetryConfig.resolve('http', options);
  }
  /**
   * Use a performance telemetry config.
   */
  static performance(options?: PerformanceOptions): ITelemetryConfig {
    return TelemetryConfig.resolve('performance', options);
  }
  /**
   * Use a interaction telemetry config.
   */
  static interaction(options?: InteractionOptions): ITelemetryConfig {
    return TelemetryConfig.resolve('interaction', options);
  }
  private static resolve(type: string, options?: any): ITelemetryConfig {
    return {
      config: options ? [type, options] : type,
    };
  }
}

/**
 * enum of PageIdFormat
 */
export enum PageIdFormat {
  /**
   * PATH of PageIdFormat.
   */
  PATH = 'PATH',
  /**
   * HASH of PageIdFormat.
   */
  HASH = 'HASH',
  /**
   * PATH_AND_HASH of PageIdFormat.
   */
  PATH_AND_HASH = 'PATH_AND_HASH',
}

/**
 * Options for `CodeSnippet`.
 * @see https://github.com/aws-observability/aws-rum-web/blob/main/docs/configuration.md
 */
export interface CodeSnippetOptions {
  /**
   * The object key of will generates code snippet.
   *
   * @default 'rum.js'
   */
  readonly objectKey?: string;
  /**
   * The name of the global variable that the application will use to execute commands on the web client.
   *
   * @default 'cwr'
   */
  readonly namespace?: string;
  /**
   * Your application's semantic version. If you do not wish to use this field then add any placeholder.
   *
   * @default '1.0.0'
   */
  readonly applicationVersion?: string;
  /**
   * The version of the web client bundle.
   *
   * @default '1.1.0'
   */
  readonly webClientVersion?: string;
  /**
   * This propertiy specifies which hosts can receive a cookie.
   *
   * @default 'window.location.hostname'
   */
  readonly cookieAttibuteDomain?: string;
  /**
   * This propertiy indicates a URL path that must exist in the requested URL in order to send the Cookie header.
   *
   * @default '/'
   */
  readonly cookieAttibutePath?: string;
  /**
   * This propertiy lets servers specify whether/when cookies are sent with cross-site requests.
   *
   * @default true
   */
  readonly cookieAttibuteSameSite?: boolean;
  /**
   * Cookies with SameSite=None must now also specify the this propertiy.
   *
   * @default true
   */
  readonly cookieAttibuteSecure?: boolean;
  /**
   * When this field is false, the session cookie name is cwr_s. When this field is true true, the session cookie name is cwr_s_[AppMonitor Id].
   *
   * Set this field to true when multiple AppMonitors will monitor the same page. For example, this might be the case if one AppMonitor is used for logged-in users, and a second AppMonitor is used for guest users.
   *
   * @default false
   */
  readonly cookieAttibuteUnique?: boolean;
  /**
   * When this field is false, the web client will not automatically record page views.
   * By default, the web client records page views when (1) the page first loads and (2) the browser's history API is called.
   * The page ID is window.location.pathname.
   *
   * In some cases, the web client's instrumentation will not record the desired page ID.
   * In this case, the web client's page view automation must be disabled using the disableAutoPageView configuration,
   * and the application must be instrumented to record page views using the recordPageView command.
   *
   * @default false
   */
  readonly disableAutoPageView?: boolean;
  /**
   * When this field is true, the web client will record and dispatch RUM events.
   *
   * @default true
   */
  readonly enableRumClient?: boolean;
  /**
   * The URL of the CloudWatch RUM API where data will be sent.
   *
   * @default 'https://dataplane.rum.[AWS::Region].amazonaws.com'
   */
  readonly endpoint?: string;
  /**
   * The portion of the window.location that will be used as the page ID.
   *
   * For example, consider the URL `https://amazonaws.com/home?param=true#content`.
   * - PATH: /home
   * - HASH: #content
   * - PATH_AND_HASH: /home#content
   *
   * @default PATH
   */
  readonly pageIdFormat?: PageIdFormat;
  /**
   * This property can override includedPages value set in appMonitorConfiguration.
   * A list of regular expressions as string which specify the window.location values for which the web client will record data.
   * Pages are matched using the RegExp.test() function.
   *
   * @default - Use the includedPages value set in appMonitorConfiguration.
   */
  readonly pagesToInclude?: string[];
  /**
   * This property can override excludedPages value set in appMonitorConfiguration.
   * A list of regular expressions as string which specify the window.location values for which the web client will record data.
   * Pages are matched using the RegExp.test() function.
   *
   * @default - Use the excludedPages value set in appMonitorConfiguration.
   */
  readonly pagesToExclude?: string[];
  /**
   * When this field is false, the web client will not record the URLs of resources downloaded by your appliation.
   * Some types of resources (e.g., profile images) may be referenced by URLs which contain PII.
   * If this applies to your application, you must set this field to false to comply with CloudWatch RUM's shared responsibility model.
   *
   * @default true
   */
  readonly recordResourceUrl?: boolean;
  /**
   * The maximum number of events to record during a single session.
   *
   * @default 200
   */
  readonly sessionEventLimit?: number;
  /**
   * This property can override telemetries value set in appMonitorConfiguration.
   * If this property is set, addCodeSnippet will override telemetries set in appMonitorConfiguration.
   * Therefore, it is necessary to set all properties to this telemetry property.
   *
   * @default - Use the telemetries value set in appMonitorConfiguration.
   */
  readonly telemetries?: ITelemetryConfig[];
}

/**
 * Properties for `CodeSnippet`.
 */
export interface CodeSnippetProps extends CodeSnippetOptions {
  /**
   * App monitor to create code snippets.
   */
  readonly appMonitor: IAppMonitor;
}

/**
 * Code snippet to embed to an application.
 */
export class CodeSnippet extends Construct implements s3deployment.ISource {
  /**
   * String value of this code snippet.
   */
  public readonly value: string;
  private readonly source: s3deployment.ISource;

  constructor(scope: Construct, id: string, props: CodeSnippetProps) {
    super(scope, id);
    const codeSnippetProvider = new lambda.SingletonFunction(this, 'CodeSnippetProvider', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'generate-code-snippet')),
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      uuid: '0d90af78-1b35-5934-2261-81dca6a78bdd',
      lambdaPurpose: 'CodeSnippet',
      timeout: Duration.minutes(2),
    });
    const codeSnippetPolicy = new iam.Policy(this, 'CodeSnippetPolicy', {
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['rum:GetAppMonitor'],
          resources: [props.appMonitor.appMonitorArn],
        }),
      ],
    });
    if (codeSnippetProvider.role) {
      codeSnippetPolicy.attachToRole(codeSnippetProvider.role);
    }

    // Remove appMonitor to prevent circular references
    const options: CodeSnippetOptions & { appMonitor?: IAppMonitor } = { ...props };
    delete options.appMonitor;

    const codeSnippetGenerator = new CustomResource(this, 'CodeSnippetGenerator', {
      resourceType: 'Custom::AppMonitorCodeSnippet',
      serviceToken: codeSnippetProvider.functionArn,
      properties: {
        appMonitorName: props.appMonitor.appMonitorName,
        // This is always necessary to get the latest app monitor
        updateTime: new Date().toString(),
        options,
      },
    });
    this.value = codeSnippetGenerator.getAttString('CodeSnippet');
    this.source = s3deployment.Source.data(props.objectKey ?? 'rum.js', this.value);
  }

  bind(scope: Construct, context?: s3deployment.DeploymentSourceContext): s3deployment.SourceConfig {
    return this.source.bind(scope, context);
  }
}