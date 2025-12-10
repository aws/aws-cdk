import { EventApiBase } from './eventapi';
import { ICertificate } from '../../aws-certificatemanager';
import { IRoleRef } from '../../aws-iam';
import { RetentionDays } from '../../aws-logs';
import { Stack, ArnFormat } from '../../core';

/**
 * A class used to generate resource arns for AppSync Event APIs
 */
export class AppSyncEventResource {
  /**
   * Generate a resource for the calling API
   */
  public static forAPI(): AppSyncEventResource {
    return new AppSyncEventResource(['']);
  }

  /**
   * Generate the resource names given a channel namespace
   *
   * @param channelNamespace The channel namespace that needs to be allowed
   *
   * Example: ofChannelNamespace('default')
   */
  public static ofChannelNamespace(channelNamespace: string): AppSyncEventResource {
    const arns = [`channelNamespace/${channelNamespace}`];
    return new AppSyncEventResource(arns);
  }

  /**
   * Generate the resource names that accepts all types: `*`
   */
  public static all(): AppSyncEventResource {
    return new AppSyncEventResource(['*']);
  }

  /**
   * Generate the resource names that accepts all channel namespaces: `*`
   */
  public static allChannelNamespaces(): AppSyncEventResource {
    const arns = ['channelNamespace/*'];
    return new AppSyncEventResource(arns);
  }

  private arns: string[];

  private constructor(arns: string[]) {
    this.arns = arns;
  }

  /**
   * Return the Resource ARN
   *
   * @param api The AppSync API to give permissions
   */
  public resourceArns(api: EventApiBase): string[] {
    return this.arns.map((arn) => {
      if (arn === '') {
        return Stack.of(api).formatArn({
          service: 'appsync',
          resource: `apis/${api.apiId}`,
          arnFormat: ArnFormat.NO_RESOURCE_NAME,
        });
      } else {
        return Stack.of(api).formatArn({
          service: 'appsync',
          resource: `apis/${api.apiId}`,
          arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
          resourceName: arn,
        });
      }
    });
  }
}

/**
 * log-level for fields in AppSync
 */
export enum AppSyncFieldLogLevel {
  /**
   * Resolver logging is disabled
   */
  NONE = 'NONE',
  /**
   * Only Error messages appear in logs
   */
  ERROR = 'ERROR',
  /**
   * Info and Error messages appear in logs
   */
  INFO = 'INFO',
  /**
   * Debug, Info, and Error messages, appear in logs
   */
  DEBUG = 'DEBUG',
  /**
   * All messages (Debug, Error, Info, and Trace) appear in logs
   */
  ALL = 'ALL',
}

/**
 * Logging configuration for AppSync
 */
export interface AppSyncLogConfig {
  /**
   * exclude verbose content
   *
   * @default false
   */
  readonly excludeVerboseContent?: boolean;
  /**
   * log level for fields
   *
   * @default - Use AppSync default
   */
  readonly fieldLogLevel?: AppSyncFieldLogLevel;

  /**
   * The role for CloudWatch Logs
   *
   * @default - None
   */
  readonly role?: IRoleRef;

  /**
   * The number of days log events are kept in CloudWatch Logs.
   * By default AppSync keeps the logs infinitely. When updating this property,
   * unsetting it doesn't remove the log retention policy.
   * To remove the retention policy, set the value to `INFINITE`
   *
   * @default RetentionDays.INFINITE
   */
  readonly retention?: RetentionDays;
}

/**
 * Domain name configuration for AppSync
 */
export interface AppSyncDomainOptions {
  /**
   * The certificate to use with the domain name.
   */
  readonly certificate: ICertificate;

  /**
   * The actual domain name. For example, `api.example.com`.
   */
  readonly domainName: string;
}
