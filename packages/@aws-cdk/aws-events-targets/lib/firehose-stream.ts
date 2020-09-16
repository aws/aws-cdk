import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as firehose from '@aws-cdk/aws-kinesisfirehose';
import { singletonEventRole } from './util';

/**
 * Customize the Firehose Stream Event Target
 */
export interface FirehoseStreamProps {
  /**
   * The message to send to the stream.
   *
   * Must be a valid JSON text passed to the target stream.
   *
   * @default - the entire CloudWatch event
   */
  readonly message?: events.RuleTargetInput;
}


/**
 * Customize the Firehose Stream Event Target
 */
export class FirehoseStream implements events.IRuleTarget {

  constructor(private readonly stream: firehose.CfnDeliveryStream, private readonly props: FirehoseStreamProps = {}) {
  }

  /**
   * Returns a RuleTarget that can be used to trigger this Firehose Stream as a
   * result from a CloudWatch event.
   */
  public bind(_rule: events.IRule, _id?: string): events.RuleTargetConfig {
    const policyStatements = [new iam.PolicyStatement({
      actions: ['firehose:PutRecord', 'firehose:PutRecordBatch'],
      resources: [this.stream.attrArn],
    })];

    return {
      id: '',
      arn: this.stream.attrArn,
      role: singletonEventRole(this.stream, policyStatements),
      input: this.props.message,
      targetResource: this.stream,
    };
  }
}