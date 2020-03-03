import * as events from '@aws-cdk/aws-events';
import * as batch from '@aws-cdk/aws-batch';
import * as iam from '@aws-cdk/aws-iam';
import { singletonEventRole } from './util';

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
   * @default undefined
   */
  readonly size?: number;

  /**
   * The number of times to attempt to retry, if the job fails. Valid values are 1–10. 
   * 
   * @default undefined
   */
  readonly attempts?: number;
}

export class BatchJob implements events.IRuleTarget {
  constructor(
    public readonly jobQueue: batch.IJobQueue,
    public readonly jobDefinition: batch.IJobDefinition,
    private readonly props: BatchJobProps = {}
  ) { }

  public bind(rule: events.IRule, _id?: string): events.RuleTargetConfig {
    let batchParameters: events.CfnRule.BatchParametersProperty = {
      jobDefinition: this.jobDefinition.jobDefinitionArn
    }

    if (this.props.size) {
      batchParameters['arrayProperties'] = {
        size: this.props.size
      }
    }

    if (this.props.attempts) {
      batchParameters['retryStrategy'] = {
        attempts: this.props.attempts
      }
    }

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