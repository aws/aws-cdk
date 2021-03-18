import * as batch from '@aws-cdk/aws-batch';
import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import { Names } from '@aws-cdk/core';
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
   * @default the entire EventBridge event
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

  /**
   * The name of the submitted job
   *
   * @default - Automatically generated
   */
  readonly jobName?: string;
}

/**
 * Use an AWS Batch Job / Queue as an event rule target.
 * @experimental
 */
export class BatchJob implements events.IRuleTarget {
  constructor(
    private readonly jobQueue: batch.IJobQueue,
    private readonly jobDefinition: batch.IJobDefinition,
    private readonly props: BatchJobProps = {},
  ) { }

  /**
   * Returns a RuleTarget that can be used to trigger queue this batch job as a
   * result from an EventBridge event.
   */
  public bind(rule: events.IRule, _id?: string): events.RuleTargetConfig {
    const batchParameters: events.CfnRule.BatchParametersProperty = {
      jobDefinition: this.jobDefinition.jobDefinitionArn,
      jobName: this.props.jobName ?? Names.nodeUniqueId(rule.node),
      arrayProperties: this.props.size ? { size: this.props.size } : undefined,
      retryStrategy: this.props.attempts ? { attempts: this.props.attempts } : undefined,
    };

    return {
      arn: this.jobQueue.jobQueueArn,
      // When scoping resource-level access for job submission, you must provide both job queue and job definition resource types.
      // https://docs.aws.amazon.com/batch/latest/userguide/ExamplePolicies_BATCH.html#iam-example-restrict-job-def
      role: singletonEventRole(this.jobDefinition, [
        new iam.PolicyStatement({
          actions: ['batch:SubmitJob'],
          resources: [
            this.jobDefinition.jobDefinitionArn,
            this.jobQueue.jobQueueArn,
          ],
        }),
      ]),
      input: this.props.event,
      targetResource: this.jobQueue,
      batchParameters,
    };
  }
}
