import { Resource, Stack, IResource } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as iot from 'aws-cdk-lib/aws-iot';
import * as iam from 'aws-cdk-lib/aws-iam';

/**
 * Represents AWS IoT Logging
 */
export interface ILogging extends IResource {
  /**
   * The log ID
   * @attribute
   */
  readonly logId: string;
}

/**
 * The log level for the AWS IoT Logging
 */
export enum LogLevel {
  /**
   * Any error that causes an operation to fail
   *
   * Logs include ERROR information only
   */
  ERROR = 'ERROR',

  /**
   * Anything that can potentially cause inconsistencies in the system, but might not cause the operation to fail
   *
   * Logs include ERROR and WARN information
   */
  WARN = 'WARN',

  /**
   * High-level information about the flow of things
   *
   * Logs include INFO, ERROR, and WARN information
   */
  INFO = 'INFO',

  /**
   * Information that might be helpful when debugging a problem
   *
   * Logs include DEBUG, INFO, ERROR, and WARN information
   */
  DEBUG = 'DEBUG',

  /**
   * All logging is disabled
   */
  DISABLED = 'DISABLED',
}

/**
 * Properties for defining AWS IoT Logging
 */
export interface LoggingProps {
  /**
   * The log level for the AWS IoT Logging
   *
   * @default LogLevel.ERROR
   */
  readonly logLevel?: LogLevel;
}

/**
 * Defines AWS IoT Logging
 */
export class Logging extends Resource implements ILogging {
  /**
   * Import an existing AWS IoT Logging
   *
   * @param scope The parent creating construct (usually `this`)
   * @param id The construct's name
   * @param logId AWS IoT Logging ID
   */
  public static fromLogId(scope: Construct, id: string, logId: string): ILogging {
    class Import extends Resource implements ILogging {
      public readonly logId = logId;
    }
    return new Import(scope, id);
  }

  /**
   * The logging ID
   * @attribute
   */
  public readonly logId: string;

  constructor(scope: Construct, id: string, props?: LoggingProps) {
    super(scope, id);

    const accountId = Stack.of(this).account;

    // Create a role for logging
    // https://docs.aws.amazon.com/iot/latest/developerguide/configure-logging.html#configure-logging-role-and-policy
    const role = new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('iot.amazonaws.com'),
      inlinePolicies: {
        LoggingPolicy: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              actions: [
                'logs:CreateLogGroup',
                'logs:CreateLogStream',
                'logs:PutLogEvents',
                'logs:PutMetricFilter',
                'logs:PutRetentionPolicy',
                'iot:GetLoggingOptions',
                'iot:SetLoggingOptions',
                'iot:SetV2LoggingOptions',
                'iot:GetV2LoggingOptions',
                'iot:SetV2LoggingLevel',
                'iot:ListV2LoggingLevels',
                'iot:DeleteV2LoggingLevel',
              ],
              resources: [
                Stack.of(this).formatArn({
                  service: 'logs',
                  resource: 'log-group',
                  sep: ':',
                  resourceName: 'AWSIotLogsV2:*',
                }),
              ],
            }),
          ],
        }),
      },
    });

    const resource = new iot.CfnLogging(this, 'Resource', {
      accountId,
      defaultLogLevel: props?.logLevel ?? LogLevel.ERROR,
      roleArn: role.roleArn,
    });

    this.logId = resource.ref;
  }
}
