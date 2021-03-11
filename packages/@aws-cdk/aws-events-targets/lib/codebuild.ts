import * as codebuild from '@aws-cdk/aws-codebuild';
import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as sqs from '@aws-cdk/aws-sqs';
import { addToDeadLetterQueueResourcePolicy, singletonEventRole } from './util';

/**
 * Customize the CodeBuild Event Target
 */
export interface CodeBuildProjectProps {

  /**
   * The role to assume before invoking the target
   * (i.e., the codebuild) when the given rule is triggered.
   *
   * @default - a new role will be created
   */
  readonly eventRole?: iam.IRole;

  /**
   * The event to send to CodeBuild
   *
   * This will be the payload for the StartBuild API.
   *
   * @default - the entire EventBridge event
   */
  readonly event?: events.RuleTargetInput;

  /**
   * The SQS queue to be used as deadLetterQueue.
   * Check out the [considerations for using a dead-letter queue](https://docs.aws.amazon.com/eventbridge/latest/userguide/rule-dlq.html#dlq-considerations).
   *
   * The events not successfully delivered are automatically retried for a specified period of time,
   * depending on the retry policy of the target.
   * If an event is not delivered before all retry attempts are exhausted, it will be sent to the dead letter queue.
   *
   * @default - no dead-letter queue
   */
  readonly deadLetterQueue?: sqs.IQueue;
}

/**
 * Start a CodeBuild build when an Amazon EventBridge rule is triggered.
 */
export class CodeBuildProject implements events.IRuleTarget {
  constructor(
    private readonly project: codebuild.IProject,
    private readonly props: CodeBuildProjectProps = {},
  ) {}

  /**
   * Allows using build projects as event rule targets.
   */
  public bind(_rule: events.IRule, _id?: string): events.RuleTargetConfig {

    if (this.props.deadLetterQueue) {
      addToDeadLetterQueueResourcePolicy(_rule, this.props.deadLetterQueue);
    }

    return {
      id: '',
      arn: this.project.projectArn,
      deadLetterConfig: this.props.deadLetterQueue ? { arn: this.props.deadLetterQueue?.queueArn } : undefined,
      role: this.props.eventRole || singletonEventRole(this.project, [
        new iam.PolicyStatement({
          actions: ['codebuild:StartBuild'],
          resources: [this.project.projectArn],
        }),
      ]),
      input: this.props.event,
      targetResource: this.project,
    };
  }
}
