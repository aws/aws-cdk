import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { getResourceArn, TaskStateConfig, taskStateJson, validatePatternSupported } from '../private/task-utils';

/**
 * Properties for PublishTask
 */
export interface SnsPublishProps extends sfn.TaskStateBaseProps {

  /**
   * The SNS topic that the task will publish to
   */
  readonly topic: sns.ITopic;

  /**
   * The text message to send to the topic.
   */
  readonly message: sfn.TaskInput;

  /**
   * If true, send a different message to every subscription type
   *
   * If this is set to true, message must be a JSON object with a
   * "default" key and a key for every subscription type (such as "sqs",
   * "email", etc.) The values are strings representing the messages
   * being sent to every subscription type.
   *
   * @see https://docs.aws.amazon.com/sns/latest/api/API_Publish.html#API_Publish_RequestParameters
   * @default false
   */
  readonly messagePerSubscriptionType?: boolean;

  /**
   * Used as the "Subject" line when the message is delivered to email endpoints.
   * Also included, if present, in the standard JSON messages delivered to other endpoints.
   *
   * @default - No subject
   */
  readonly subject?: string;

  /**
   * The service integration pattern indicates different ways to call Publish to SNS.
   *
   * @default IntegrationPattern.REQUEST_RESPONSE
   */
  readonly integrationPattern?: sfn.IntegrationPattern;
}

/**
 * A Step Functions Task to publish messages to SNS topic.
 *
 * A Function can be used directly as a Resource, but this class mirrors
 * integration with other AWS services via a specific class instance.
 */
export class SnsPublish extends sfn.TaskStateBase {

  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
    sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
  ];

  private readonly integrationPattern: sfn.IntegrationPattern;

  constructor(scope: cdk.Construct, id: string, private readonly props: SnsPublishProps) {
    super(scope, id, props);
    this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.REQUEST_RESPONSE;

    validatePatternSupported(this.integrationPattern, SnsPublish.SUPPORTED_INTEGRATION_PATTERNS);

    if (this.integrationPattern === sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN) {
      if (!sfn.FieldUtils.containsTaskToken(props.message)) {
        throw new Error('Task Token is required in `message` Use Context.taskToken to set the token.');
      }
    }

    this.taskPolicies = [
      new iam.PolicyStatement({
        actions: ['sns:Publish'],
        resources: [this.props.topic.topicArn],
      }),
    ];
  }

  protected renderTask(): any {
    const taskConfig: TaskStateConfig = {
      resourceArn: getResourceArn('sns', 'publish', this.integrationPattern),
      parameters: {
        TopicArn: this.props.topic.topicArn,
        Message: this.props.message.value,
        MessageStructure: this.props.messagePerSubscriptionType ? 'json' : undefined,
        Subject: this.props.subject,
      },
    };

    return taskStateJson(taskConfig);
  }
}
