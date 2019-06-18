import iam = require('@aws-cdk/aws-iam');
import sns = require('@aws-cdk/aws-sns');
import sfn = require('@aws-cdk/aws-stepfunctions');

/**
 * Properties for PublishTask
 */
export interface PublishToTopicProps {
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
   */
  readonly messagePerSubscriptionType?: boolean;

  /**
   * Message subject
   */
  readonly subject?: string;

  /**
   * Whether to pause the workflow until a task token is returned
   *
   * @default false
   */
  readonly waitForTaskToken?: boolean;
}

/**
 * A StepFunctions Task to invoke a Lambda function.
 *
 * A Function can be used directly as a Resource, but this class mirrors
 * integration with other AWS services via a specific class instance.
 */
export class PublishToTopic implements sfn.IStepFunctionsTask {

  private readonly waitForTaskToken: boolean;

  constructor(private readonly topic: sns.ITopic, private readonly props: PublishToTopicProps) {
    this.waitForTaskToken = props.waitForTaskToken === true;

    if (this.waitForTaskToken && !sfn.FieldUtils.containsTaskToken(props.message.value)) {
      throw new Error('Task Token is missing in message (pass Context.taskToken somewhere in message)');
    }
  }

  public bind(_task: sfn.Task): sfn.StepFunctionsTaskConfig {
    return {
      resourceArn: 'arn:aws:states:::sns:publish' + (this.waitForTaskToken ? '.waitForTaskToken' : ''),
      policyStatements: [new iam.PolicyStatement({
        actions: ['sns:Publish'],
        resources: [this.topic.topicArn]
      })],
      parameters: {
        TopicArn: this.topic.topicArn,
        ...sfn.FieldUtils.renderObject({
          Message: this.props.message.value,
          MessageStructure: this.props.messagePerSubscriptionType ? "json" : undefined,
          Subject: this.props.subject,
        })
      }
    };
  }
}
