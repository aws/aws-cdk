import { IInputTransformation, IPipe, ITarget, TargetConfig } from '@aws-cdk/aws-pipes-alpha';
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
   * @default none
   */
  readonly inputTransformation?: IInputTransformation;

  /**
   * The name of the log stream.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetcloudwatchlogsparameters.html#cfn-pipes-pipe-pipetargetcloudwatchlogsparameters-logstreamname
   * @default none
   */
  readonly logStreamName?: string;

  /**
   * The time the event occurred, expressed as the number of milliseconds after Jan 1, 1970 00:00:00 UTC.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetcloudwatchlogsparameters.html#cfn-pipes-pipe-pipetargetcloudwatchlogsparameters-timestamp
   * @default none
   */
  readonly timestamp?: string;
}

/**
 * A EventBridge Pipes target that sends messages to a CloudWatch Logs log group.
 */
export class CloudWatchLogsTarget implements ITarget {
  private logGroup: ILogGroup;
  private cloudWatchLogsParameters?: CloudWatchLogsTargetParameters;
  public readonly targetArn: string;

  constructor(logGroup: ILogGroup, parameters?: CloudWatchLogsTargetParameters) {
    this.logGroup = logGroup;
    this.targetArn = logGroup.logGroupArn;
    this.cloudWatchLogsParameters = parameters;

    validateLogStreamName(this.cloudWatchLogsParameters?.logStreamName);
    validateTimestamp(this.cloudWatchLogsParameters?.timestamp);
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

function validateLogStreamName(name?: string) {
  if (name !== undefined) {
    if (name.length < 1 || name.length > 256) {
      throw new Error(`Log stream name must be between 1 and 256 characters, received ${name.length}`);
    }
  }
}

function validateTimestamp(timestamp?: string) {
  if (timestamp !== undefined) {
    if (timestamp.length < 1 || timestamp.length > 256) {
      throw new Error(`Timestamp must be between 1 and 256 characters, received ${timestamp.length}`);
    }
  }
}
