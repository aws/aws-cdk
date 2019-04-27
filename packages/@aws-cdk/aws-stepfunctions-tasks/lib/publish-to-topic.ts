import iam = require('@aws-cdk/aws-iam');
import sns = require('@aws-cdk/aws-sns');
import stepfunctions = require('@aws-cdk/aws-stepfunctions');
import cdk = require('@aws-cdk/cdk');

/**
 * Properties for PublishTask
 */
export interface PublishTaskProps extends stepfunctions.BasicTaskProps {
  /**
   * The topic to publish to
   */
  readonly topic: sns.ITopic;

  /**
   * The text message to send to the queue.
   *
   * Exactly one of `message`, `messageObject` and `messagePath` is required.
   */
  readonly message?: string;

  /**
   * JSONPath expression of the message to send to the queue
   *
   * Exactly one of `message`, `messageObject` and `messagePath` is required.
   */
  readonly messagePath?: string;

  /**
   * Object to be JSON-encoded and used as message
   *
   * Exactly one of `message`, `messageObject` and `messagePath` is required.
   */
  readonly messageObject?: string;

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
   * JSONPath expression of subject
   */
  readonly subjectPath?: string;
}

/**
 * A StepFunctions Task to publish to an SNS Topic
 */
export class PublishTask extends stepfunctions.Task {
  constructor(scope: cdk.Construct, id: string, props: PublishTaskProps) {
    if ((props.message !== undefined ? 1 : 0)
      + (props.messagePath !== undefined ? 1 : 0)
      + (props.messageObject !== undefined ? 1 : 0) !== 1) {
      throw new Error(`Supply exactly one of 'message', 'messageObject' or 'messagePath'`);
    }

    if (props.subject !== undefined && props.subjectPath !== undefined) {
      throw new Error(`Supply either 'subject' or 'subjectPath'`);
    }

    super(scope, id, {
      ...props,
      resourceArn: 'arn:aws:states:::sns:publish',
      policyStatements: [new iam.PolicyStatement()
        .addAction('sns:Publish')
        .addResource(props.topic.topicArn)
      ],
      parameters: {
        "TopicArn": props.topic.topicArn,
        "Message": props.messageObject
            ? new cdk.Token(() => this.node.stringifyJson(props.messageObject))
            : props.message,
        "Message.$": props.messagePath,
        "MessageStructure": props.messagePerSubscriptionType ? "json" : undefined,
        "Subject": props.subject,
        "Subject.$": props.subjectPath
      }
    });
  }
}