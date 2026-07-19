import type { IStage } from './stage';
import type { ILogGroupRef } from '../../../interfaces/generated/aws-logs-interfaces.generated';

/**
 * Access log destination for a HttpApi Stage.
 */
export interface IAccessLogDestination {
  /**
   * Binds this destination to the HttpApi Stage.
   */
  bind(stage: IStage): AccessLogDestinationConfig;
}

/**
 * Options when binding a log destination to a HttpApi Stage.
 */
export interface AccessLogDestinationConfig {
  /**
   * The Amazon Resource Name (ARN) of the destination resource
   */
  readonly destinationArn: string;
}

/**
 * Use CloudWatch Logs as a custom access log destination for API Gateway.
 */
export class LogGroupLogDestination implements IAccessLogDestination {
  constructor(private readonly logGroup: ILogGroupRef) {
  }

  /**
   * Binds this destination to the CloudWatch Logs.
   */
  public bind(_stage: IStage): AccessLogDestinationConfig {
    return {
      destinationArn: this.logGroup.logGroupRef.logGroupArn,
    };
  }
}
