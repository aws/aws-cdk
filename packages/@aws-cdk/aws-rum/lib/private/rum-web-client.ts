import { JavaScriptRegExp } from './code-snippet';

export interface ErrorsTelemetryOption {
  stackTraceLength?: number;
}
export type ErrorsTelemetryConfig = 'errors' | readonly ['errors', ErrorsTelemetryOption];
export interface HttpTelemetryOption {
  urlsToInclude?: JavaScriptRegExp[];
  urlsToExclude?: JavaScriptRegExp[];
  stackTraceLength?: number;
  recordAllRequests?: boolean;
  addXRayTraceIdHeader?: boolean;
}
export type HttpTelemetryConfig = 'http' | readonly ['http', HttpTelemetryOption];
interface InteractionTelemetryOption {
  events?: any[];
}
export type InteractionTelemetryConfig =
  | 'interaction'
  | readonly ['interaction', InteractionTelemetryOption];
export interface PerformanceTelemetryOption {
  eventLimit: number;
}
export type PerformanceTelemetryConfig =
  | 'performance'
  | readonly ['performance', PerformanceTelemetryOption];
export type TelemetryConfig =
  | ErrorsTelemetryConfig
  | HttpTelemetryConfig
  | InteractionTelemetryConfig
  | PerformanceTelemetryConfig;
interface CookieAttibute {
  domain?: string
  path?: string
  sameSite?: boolean
  Secure?: boolean
}

export interface Configuration {
  allowCookies?: boolean;
  cookieAttibutes?: CookieAttibute;
  disableAutoPageView?: boolean;
  enableRumClient?: boolean;
  enableXRay?: boolean;
  endpoint?: string;
  guestRoleArn?: string;
  identityPoolId?: string;
  pageIdFormat?: 'PATH' | 'HASH' | 'PATH_AND_HASH';
  pagesToInclude?: JavaScriptRegExp[];
  pagesToExclude?: JavaScriptRegExp[];
  recordResourceUrl?: boolean;
  sessionEventLimit?: number;
  sessionSampleRate?: number;
  telemetries?: TelemetryConfig[];
}