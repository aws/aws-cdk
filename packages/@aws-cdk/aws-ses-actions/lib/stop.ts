import * as ses from '@aws-cdk/aws-ses';
import * as sns from '@aws-cdk/aws-sns';

/**
 * Construction properties for a stop action.
 */
export interface StopProps {
  /**
   * The SNS topic to notify when the stop action is taken.
   */
  readonly topic?: sns.ITopic;
}

/**
 * Terminates the evaluation of the receipt rule set and optionally publishes a
 * notification to Amazon SNS.
 */
export class Stop implements ses.IReceiptRuleAction {
  constructor(private readonly props: StopProps = {}) {
  }

  public bind(_rule: ses.IReceiptRule): ses.ReceiptRuleActionConfig {
    return {
      stopAction: {
        scope: 'RuleSet',
        topicArn: this.props.topic?.topicArn,
      },
    };
  }
}
