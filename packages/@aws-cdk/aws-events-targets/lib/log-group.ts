import * as events from '@aws-cdk/aws-events';
import * as logs from '@aws-cdk/aws-logs';
import { Token } from '@aws-cdk/core';
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
 * Use an AWS CloudWatch LogGroup as an event rule target.
 *
 * The LogGroup name must start with /aws/events/.
 */
export class LogGroup implements events.IRuleTarget {
  constructor(private readonly logGroup: logs.ILogGroup, private readonly props: LogGroupProps = {}) {}

  /**
   * Returns a RuleTarget that can be used to log an event into a CloudWatch LogGroup
   */
  public bind(_rule: events.IRule, _id?: string): events.RuleTargetConfig {
    if (!Token.isUnresolved(this.logGroup.logGroupName) && !this.logGroup.logGroupName.startsWith('/aws/events/')) {
      throw new Error('Target LogGroup name must start with "/aws/events/"');
    }

    return {
      id: '',
      arn: `arn:aws:logs:${this.logGroup.stack.region}:${this.logGroup.stack.account}:log-group:${this.logGroup.logGroupName}`,
      input: this.props.event,
    };
  }
}
