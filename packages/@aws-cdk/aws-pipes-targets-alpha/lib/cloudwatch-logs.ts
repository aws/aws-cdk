import { IInputTransformation, IPipe, ITarget, TargetConfig } from '@aws-cdk/aws-pipes-alpha';
import { Token } from 'aws-cdk-lib';
import { IRole } from 'aws-cdk-lib/aws-iam';
import { ILogGroup } from 'aws-cdk-lib/aws-logs';

/**
 * CloudWatch Logs target properties.
 */
export interface CloudWatchLogsTargetParameters {
  /**
   * The input transformation to apply to the message before sending it to the target.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-inputtemplate
   * @default - none
   */
  readonly inputTransformation?: IInputTransformation;

  /**
   * The name of the log stream.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetcloudwatchlogsparameters.html#cfn-pipes-pipe-pipetargetcloudwatchlogsparameters-logstreamname
   * @default - none
   */
  readonly logStreamName?: string;

  /**
   * The JSON path expression that references the timestamp in the payload.
   * This is the time that the event occurred, as a JSON path expression in the payload.
   *
   * @example '$.data.timestamp'
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetcloudwatchlogsparameters.html#cfn-pipes-pipe-pipetargetcloudwatchlogsparameters-timestamp
   * @default - current time
   */
  readonly timestamp?: string;
}

/**
 * An EventBridge Pipes target that sends messages to a CloudWatch Logs log group.
 */
export class CloudWatchLogsTarget implements ITarget {
  private logGroup: ILogGroup;
  private cloudWatchLogsParameters?: CloudWatchLogsTargetParameters;
  public readonly targetArn: string;

  constructor(logGroup: ILogGroup, parameters?: CloudWatchLogsTargetParameters) {
    this.logGroup = logGroup;
    this.targetArn = logGroup.logGroupArn;

    if (parameters) {
      this.cloudWatchLogsParameters = parameters;
      for (const validate of [validateLogStreamName, validateTimestamp]) {
        validate(parameters);
      }
    }
  }

  grantPush(grantee: IRole): void {
    this.logGroup.grantWrite(grantee);
  }

  bind(pipe: IPipe): TargetConfig {
    if (!this.cloudWatchLogsParameters) {
      return {
        targetParameters: {},
      };
    }

    return {
      targetParameters: {
        inputTemplate: this.cloudWatchLogsParameters.inputTransformation?.bind(pipe).inputTemplate,
        cloudWatchLogsParameters: this.cloudWatchLogsParameters,
      },
    };
  }
}

function validateLogStreamName({ logStreamName }: CloudWatchLogsTargetParameters) {
  if (logStreamName !== undefined && !Token.isUnresolved(logStreamName)) {
    if (logStreamName.length < 1 || logStreamName.length > 256) {
      throw new Error(`Log stream name must be between 1 and 256 characters, received ${logStreamName.length}`);
    }
  }
}

function validateTimestamp({ timestamp }: CloudWatchLogsTargetParameters) {
  if (timestamp !== undefined && !Token.isUnresolved(timestamp)) {
    if (timestamp.length < 1 || timestamp.length > 256) {
      throw new Error(`Timestamp must be between 1 and 256 characters, received ${timestamp.length}`);
    }
  }
}
