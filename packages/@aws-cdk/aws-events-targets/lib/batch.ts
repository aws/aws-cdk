import * as batch from '@aws-cdk/aws-batch';
import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import { singletonEventRole } from './util';

/**
 * Customize the Batch Job Event Target
 * @experimental
 */
export interface BatchJobProps {
  /**
   * The event to send to the Lambda
   *
   * This will be the payload sent to the Lambda Function.
   *
   * @default the entire CloudWatch event
   */
  readonly event?: events.RuleTargetInput;

  /**
   * The size of the array, if this is an array batch job.
   *
   * Valid values are integers between 2 and 10,000.
   *
   * @default no arrayProperties are set
   */
  readonly size?: number;

  /**
   * The number of times to attempt to retry, if the job fails. Valid values are 1–10.
   *
   * @default no retryStrategy is set
   */
  readonly attempts?: number;
}

/**
 * Use an AWS Batch Job / Queue as an event rule target.
 * @experimental
 */
export class BatchJob implements events.IRuleTarget {
  constructor(
    private readonly jobQueue: batch.IJobQueue,
    private readonly jobDefinition: batch.IJobDefinition,
    private readonly props: BatchJobProps = {}
  ) { }

  /**
   * Returns a RuleTarget that can be used to trigger queue this batch job as a
   * result from a CloudWatch event.
   */
  public bind(_rule: events.IRule, _id?: string): events.RuleTargetConfig {
    const baseBatchParameters: any = {
      jobDefinition: this.jobDefinition.jobDefinitionArn,
      jobName: this.jobDefinition.jobDefinitionName
    };

    if (this.props.size) {
      baseBatchParameters.arrayProperties = {
        size: this.props.size
      };
    }

    if (this.props.attempts) {
      baseBatchParameters.retryStrategy = {
        attempts: this.props.attempts
      };
    }

    const batchParameters: events.CfnRule.BatchParametersProperty = baseBatchParameters;

    return {
      id: '',
      arn: this.jobQueue.jobQueueArn,
      role: singletonEventRole(this.jobDefinition, [
        new iam.PolicyStatement({
          actions: ['batch:SubmitJob'],
          resources: [this.jobDefinition.jobDefinitionArn]
        })
      ]),
      input: this.props.event,
      targetResource: this.jobQueue,
      batchParameters
    };
  }
}
