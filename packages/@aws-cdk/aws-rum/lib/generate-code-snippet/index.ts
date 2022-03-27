/* eslint-disable no-console */
import { execSync } from 'child_process';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as AWS from 'aws-sdk';
import { CodeSnippetOptions } from '../code-snippet';

interface ErrorsTelemetryOption {
  stackTraceLength?: number;
}
type ErrorsTelemetryConfig = 'errors' | readonly ['errors', ErrorsTelemetryOption];
interface HttpTelemetryOption {
  urlsToInclude?: JSRegExp[];
  urlsToExclude?: JSRegExp[];
  stackTraceLength?: number;
  recordAllRequests?: boolean;
  addXRayTraceIdHeader?: boolean;
}
type HttpTelemetryConfig = 'http' | readonly ['http', HttpTelemetryOption];
interface InteractionTelemetryOption {
  events?: any[];
}
type InteractionTelemetryConfig =
  | 'interaction'
  | readonly ['interaction', InteractionTelemetryOption];
interface PerformanceTelemetryOption {
  eventLimit?: number;
}
type PerformanceTelemetryConfig =
  | 'performance'
  | readonly ['performance', PerformanceTelemetryOption];
type TelemetryConfig =
  | ErrorsTelemetryConfig
  | HttpTelemetryConfig
  | InteractionTelemetryConfig
  | PerformanceTelemetryConfig;
interface CookieAttibute {
  domain?: string;
  path?: string;
  sameSite?: boolean;
  secure?: boolean;
  unique?: boolean;
}

interface WebClientConfiguration {
  allowCookies?: boolean;
  cookieAttibutes?: CookieAttibute;
  disableAutoPageView?: boolean;
  enableRumClient?: boolean;
  enableXRay?: boolean;
  endpoint?: string;
  guestRoleArn?: string;
  identityPoolId?: string;
  pageIdFormat?: 'PATH' | 'HASH' | 'PATH_AND_HASH';
  pagesToInclude?: JSRegExp[];
  pagesToExclude?: JSRegExp[];
  recordResourceUrl?: boolean;
  sessionEventLimit?: number;
  sessionSampleRate?: number;
  telemetries?: TelemetryConfig[];
}

/**
 * This class is special class for `JavaScript.stringify`.
 * The value returned by toString of a subclass of this class
 * will be interpreted as a special value by `JavaScript.stringify`.
 */
abstract class JavaScriptType {
  abstract toJavaScript(): string;
}

/**
 * RegExp type for `JavaScript.stringify`.
 */
export class JSRegExp extends JavaScriptType {
  constructor(private pattern: string) {
    super();
  }
  /**
   * Return `RegExp` as string.
   * If `pattern` looks like `RegExp`, then this method returns as is.
   * @returns pattern as RegExp
   */
  toJavaScript(): string {
    if (this.pattern.match(/^\/.*\/[d|g|i|m|s|u|y]?$/)) {
      return this.pattern;
    }
    return new RegExp(this.pattern).toString();
  }
}

class JSNumber extends JavaScriptType {
  constructor(private value: string) {
    super();
  }
  toJavaScript(): string {
    return isNaN(parseInt(this.value)) ? '0' : this.value;
  }
}
class JSBoolean extends JavaScriptType {
  constructor(private value: string) {
    super();
  }
  toJavaScript(): string {
    return this.value === 'true' ? 'true' : 'false';
  }
}

type DeepStringType<T> = T extends any[] ? DeepStringType<(T[number])>[]
  : T extends JavaScriptType ? string
    : T extends object | undefined ? {
      [P in keyof T]: DeepStringType<T[P]>
    } : T extends string ? T : string;


type DeepJSType<T> = T extends [] ? DeepJSType<(T[number])>[] : T extends object ? {
  [P in keyof T]: DeepJSType<T[P]>
} : T extends number ? number | JSNumber : T extends boolean ? boolean | JSBoolean : T

/**
 * This is an object for JavaScript conversion that was created in the image of a JSON object variable.
 * It has the ability to convert values to JavaScript strings.
 */
export const JavaScript = {
  /**
   * Converts a JavaScript value to a JavaScript string.
   * @param value A JavaScript value, usually an object or array, to be converted.
   * @returns JavaScript string.
   */
  stringify(value: any): string {
    switch (typeof value) {
      case 'object':
        if (Array.isArray(value)) {
          return `[${value.map(v => JavaScript.stringify(v)).join(',')}]`;
        }
        if (value instanceof JavaScriptType) {
          return value.toJavaScript();
        }
        const properties = Object.entries(value)
          .filter(([_, v]) => v !== undefined && v !== null)
          .map(([k, v]) => `${k}:${JavaScript.stringify(v)}`);
        return `{${properties.join(',')}}`;
      case 'string':
        return `"${value}"`;
      case 'number':
      case 'bigint':
      case 'boolean':
        return value.toString();
      default: return '';
    }
  },
};

function getPhysicalResourceId(event: AWSLambda.CloudFormationCustomResourceEvent): string {
  switch (event.RequestType) {
    case 'Create':
      return event.ResourceProperties.Create?.physicalResourceId?.id ??
        event.ResourceProperties.Update?.physicalResourceId?.id ??
        event.ResourceProperties.Delete?.physicalResourceId?.id ??
        event.LogicalResourceId;
    case 'Update':
    case 'Delete':
      return event.ResourceProperties[event.RequestType]?.physicalResourceId?.id ?? event.PhysicalResourceId;
  }
}
/**
 * Installs latest AWS SDK v2
 * @returns installed path.
 */
function installLatestSdk(): string {
  console.log('Installing latest AWS SDK v2');
  // Both HOME and --prefix are needed here because /tmp is the only writable location
  execSync('HOME=/tmp npm install aws-sdk@2 --production --no-package-lock --no-save --prefix /tmp');
  return '/tmp/node_modules/aws-sdk';
}

function asJSNumber(value?: string) { return value ? new JSNumber(value) : undefined; }
function asJSBoolean(value?: string) { return value ? new JSBoolean(value) : undefined; }

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent, context: AWSLambda.Context) {
  try {
    console.log(JSON.stringify(event));
    if (event.RequestType === 'Delete') {
      return await respond('SUCCESS', 'OK', getPhysicalResourceId(event), {});
    }
    // RUM needs latest aws-sdk > v2.1039.0.
    const sdkPath = installLatestSdk();
    // eslint-disable-next-line import/no-extraneous-dependencies, @typescript-eslint/no-require-imports
    const aws = require(sdkPath);
    const region = process.env.AWS_DEFAULT_REGION;
    const rum = new (aws as typeof AWS).RUM();
    const appMonitor = (await rum.getAppMonitor({
      Name: event.ResourceProperties.appMonitorName,
    }).promise()).AppMonitor;
    if (!appMonitor?.Id) {
      return await respond('FAILED', 'Failed to get AppMonitor', context.logStreamName, {});
    }
    const options: DeepStringType<CodeSnippetOptions> | undefined = event.ResourceProperties.options;

    const telemetries: DeepJSType<TelemetryConfig>[] | undefined = options?.telemetries ? (options.telemetries).map(t => {
      const telemetry = t.config as DeepStringType<TelemetryConfig>;
      if (typeof telemetry === 'string') {
        return telemetry;
      }
      switch (telemetry[0]) {
        case 'errors': {
          return [
            'errors', {
              stackTraceLength: asJSNumber(telemetry[1].stackTraceLength),
            },
          ];
        }
        case 'http': {
          return [
            'http', {
              stackTraceLength: asJSNumber(telemetry[1].stackTraceLength),
              recordAllRequests: asJSBoolean(telemetry[1].recordAllRequests),
              addXRayTraceIdHeader: asJSBoolean(telemetry[1].addXRayTraceIdHeader),
              urlsToInclude: telemetry[1].urlsToInclude?.map(url => new JSRegExp(url)),
              urlsToExclude: telemetry[1].urlsToExclude?.map(url => new JSRegExp(url)),
            },
          ];
        }
        case 'performance': {
          return [
            'performance', {
              eventLimit: asJSNumber(telemetry[1].eventLimit),
            },
          ];
        }
        case 'interaction': {
          return ['interaction', telemetry[1]];
        }
      }
    }) : undefined;

    const cookieAttibutes = {
      domain: options?.cookieAttibuteDomain,
      path: options?.cookieAttibutePath,
      sameSite: asJSBoolean(options?.cookieAttibuteSameSite),
      secure: asJSBoolean(options?.cookieAttibuteSecure),
      unique: asJSBoolean(options?.cookieAttibuteUnique),
    };
    const defaultConfig = appMonitor.AppMonitorConfiguration;
    const rumWebConfiguration: DeepJSType<WebClientConfiguration> = {
      allowCookies: defaultConfig?.AllowCookies,
      cookieAttibutes: Object.keys(cookieAttibutes).length >= 1 ? cookieAttibutes : undefined,
      disableAutoPageView: asJSBoolean(options?.disableAutoPageView),
      enableRumClient: asJSBoolean(options?.enableRumClient),
      enableXRay: defaultConfig?.EnableXRay ?? false,
      endpoint: options?.endpoint ?? `https://dataplane.rum.${region}.amazonaws.com`,
      guestRoleArn: defaultConfig?.GuestRoleArn,
      identityPoolId: defaultConfig?.IdentityPoolId,
      pageIdFormat: options?.pageIdFormat as 'PATH' | 'HASH' | 'PATH_AND_HASH' | undefined,
      pagesToInclude: (options?.pagesToInclude ?? defaultConfig?.IncludedPages)?.map((page) => new JSRegExp(page)),
      pagesToExclude: (options?.pagesToExclude ?? defaultConfig?.ExcludedPages)?.map((page) => new JSRegExp(page)),
      recordResourceUrl: asJSBoolean(options?.recordResourceUrl),
      sessionEventLimit: asJSNumber(options?.sessionEventLimit),
      sessionSampleRate: defaultConfig?.SessionSampleRate ?? 1,
      telemetries: telemetries ?? defaultConfig?.Telemetries as TelemetryConfig[] ?? ['errors', 'http', 'performance'],
    };
    await respond('SUCCESS', 'OK', getPhysicalResourceId(event), {
      CodeSnippet: '(function(n,i,v,r,s,c,x,z){' +
        'x=window.AwsRumClient={q:[],n:n,i:i,v:v,r:r,c:c};' +
        'window[n]=function(c,p){x.q.push({c:c,p:p});};' +
        "z=document.createElement('script');" +
        'z.async=true;' +
        'z.src=s;' +
        "document.head.insertBefore(z,document.getElementsByTagName('script')[0]);" +
        '})(' +
        `"${options?.namespace ?? 'cwr'}",` +
        `'${appMonitor.Id}',` +
        `"${options?.applicationVersion ?? '1.0.0'}",` +
        `'${region}',` +
        `"https://client.rum.us-east-1.amazonaws.com/${options?.webClientVersion ?? '1.1.0'}/cwr.js",` +
        JavaScript.stringify(rumWebConfiguration) +
        ');'
      ,
    });
  } catch (error) {
    console.log(error);
    await respond('FAILED', (error as Error).message || 'Internal Error', context.logStreamName, {});
  }

  function respond(responseStatus: 'SUCCESS' | 'FAILED', reason: string, physicalResourceId: string, data: any) {
    const responseBody = JSON.stringify({
      Status: responseStatus,
      Reason: reason,
      PhysicalResourceId: physicalResourceId,
      StackId: event.StackId,
      RequestId: event.RequestId,
      LogicalResourceId: event.LogicalResourceId,
      NoEcho: false,
      Data: data,
    });

    console.log('Responding', responseBody);

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const parsedUrl = require('url').parse(event.ResponseURL);
    const requestOptions = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.path,
      method: 'PUT',
      headers: { 'content-type': '', 'content-length': responseBody.length },
    };

    return new Promise((resolve, reject) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const request = require('https').request(requestOptions, resolve);
        request.on('error', reject);
        request.write(responseBody);
        request.end();
      } catch (e) {
        reject(e);
      }
    });
  }
}

