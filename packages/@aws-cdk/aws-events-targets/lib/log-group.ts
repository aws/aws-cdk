import * as events from '@aws-cdk/aws-events';
import * as logs from '@aws-cdk/aws-logs';
/**
 * Customize the CloudWatch LogGroup Event Target
 */
export interface LogGroupProps {
  /**
   * The event to send to the CloudWatch LogGroup
   *
   * This will be the event logged into the CloudWatch LogGroup
   *
   * @default - the entire EventBridge event
   */
  readonly event?: events.RuleTargetInput;
}

/**
 * Use an AWS CloudWatch LogGroup as an event rule target
 */
export class LogGroup implements events.IRuleTarget {
  constructor(private readonly handler: logs.ILogGroup, private readonly props: LogGroupProps = {}) {}

  /**
   * Returns a RuleTarget that can be used to log an event into a CloudWatch LogGroup
   */
  public bind(_rule: events.IRule, _id?: string): events.RuleTargetConfig {
    return {
      id: '',
      arn: this.handler.logGroupArn,
      input: this.props.event,
      targetResource: this.handler,
    };
  }
}
