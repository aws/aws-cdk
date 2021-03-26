import * as api from '@aws-cdk/aws-apigateway';
import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as sqs from '@aws-cdk/aws-sqs';
import { addToDeadLetterQueueResourcePolicy, singletonEventRole } from './util';

/**
 * Customize the API Gateway Event Target
 */
export interface ApiGatewayProps {

  /**
   * The method for api resource invoked by the rule.
   *
   * @default '*' that treated as ANY
   */
  readonly method?: string;

  /**
   * The api resource invoked by the rule.
   * We can use wildcards('*') to specify the path. In that case,
   * an equal number of real values must be specified for pathParameterValues.
   *
   * @default '/'
   */
  readonly path?: string;

  /**
   * The deploy stage of api gateway invoked by the rule.
   *
   * @default the value of deploymentStage.stageName of target api gateway.
   */
  readonly stage?: string;

  /**
   * The headers to be set when requesting API
   *
   * @default no header parameters
   */
  readonly headerParameters?: { [key: string]: (string) };

  /**
   * The path parameter values to be used to
   * populate to wildcards("*") of requesting api path
   *
   * @default no path parameters
   */
  readonly pathParameterValues?: string[];

  /**
   * The query parameters to be set when requesting API.
   *
   * @default no querystring parameters
   */
  readonly queryStringParameters?: { [key: string]: (string) };

  /**
   * Message Group ID for messages sent to this queue.
   *
   * Required for FIFO queues, leave empty for regular queues.
   *
   * @default - no message group ID (regular queue)
   */
  readonly messageGroupId?: string;

  /**
   * The message to send to the queue.
   *
   * Must be a valid JSON text passed to the target queue.
   *
   * @default the entire EventBridge event
   */
  readonly message?: events.RuleTargetInput;

  /**
   * The role to assume before invoking the target
   * (i.e., the pipeline) when the given rule is triggered.
   *
   * @default - a new role will be created
   */
  readonly eventRole?: iam.IRole;

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
 * Use an API Gateway REST APIs as a target for Amazon EventBridge rules.
 */
export class ApiGateway implements events.IRuleTarget {

  constructor(public readonly restApi: api.RestApi, private readonly props?: ApiGatewayProps) {
  }

  /**
   * Returns a RuleTarget that can be used to trigger this API Gateway REST APIs
   * as a result from an EventBridge event.
   *
   * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/resource-based-policies-eventbridge.html#sqs-permissions
   */
  public bind(rule: events.IRule, _id?: string): events.RuleTargetConfig {
    if (this.props?.deadLetterQueue) {
      addToDeadLetterQueueResourcePolicy(rule, this.props.deadLetterQueue);
    }

    const restApiArn = this.restApi.arnForExecuteApi(
      this.props?.method,
      this.props?.path || '/',
      this.props?.stage || this.restApi.deploymentStage.stageName,
    );
    return {
      arn: restApiArn,
      role: this.props?.eventRole || singletonEventRole(this.restApi, [new iam.PolicyStatement({
        resources: [restApiArn],
        actions: [
          'execute-api:Invoke',
          'execute-api:ManageConnections',
        ],
      })]),
      deadLetterConfig: this.props?.deadLetterQueue && { arn: this.props.deadLetterQueue?.queueArn },
      input: this.props?.message,
      targetResource: this.restApi,
      httpParameters: {
        headerParameters: this.props?.headerParameters,
        queryStringParameters: this.props?.queryStringParameters,
        pathParameterValues: this.props?.pathParameterValues,
      },
    };
  }

}

