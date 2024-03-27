import * as apigwv2 from '../../../aws-apigatewayv2';
import * as iam from '../../../aws-iam';
import * as sqs from '../../../aws-sqs';

/**
 * Properties to initialize `HttpSqsIntegration`.
 */
export interface HttpSqsIntegrationProps {
  /**
   * Specifies how to transform HTTP requests before sending them to the backend.
   *
   * When the subtype is either `START_EXECUTION` or `START_SYNC_EXECUTION`,
   * it is necessary to specify the `StateMachineArn`.
   * Conversely, when the subtype is `STOP_EXECUTION`, the `ExecutionArn` must be specified.
   *
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-parameter-mapping.html
   *
   * @default - specify only `StateMachineArn`
   */
  readonly parameterMapping?: apigwv2.ParameterMapping;

  /**
   * The subtype of the HTTP integration.
   *
   * Only subtypes starting with SQS_ can be specified.
   *
   * @default HttpIntegrationSubtype.SQS_SEND_MESSAGE
   */
  readonly subtype?: apigwv2.HttpIntegrationSubtype;

  /**
   * SQS queue that Integrates with API Gateway
   */
  readonly queue: sqs.IQueue;
}

/**
 * The Sqs integration resource for HTTP API
 */
export class HttpSqsIntegration extends apigwv2.HttpRouteIntegration {
  /**
   * @param id id of the underlying integration construct
   * @param props properties to configure the integration
   */
  constructor(
    id: string,
    private readonly props: HttpSqsIntegrationProps,
  ) {
    super(id);
  }

  public bind(options: apigwv2.HttpRouteIntegrationBindOptions): apigwv2.HttpRouteIntegrationConfig {
    if (this.props.subtype && !this.props.subtype.startsWith('SQS-')) {
      throw new Error('Subtype must start with `SQS_`');
    }

    const invokeRole = new iam.Role(options.scope, 'InvokeRole', {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
    });

    invokeRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        sid: 'AllowSqsExecution',
        actions: [this.determineActionBySubtype(this.props.subtype)],
        resources: [this.determineResourceArn(options)],
      }),
    );

    return {
      payloadFormatVersion: apigwv2.PayloadFormatVersion.VERSION_1_0,
      type: apigwv2.HttpIntegrationType.AWS_PROXY,
      subtype: this.props.subtype ?? apigwv2.HttpIntegrationSubtype.SQS_SEND_MESSAGE,
      credentials: apigwv2.IntegrationCredentials.fromRole(invokeRole),
      connectionType: apigwv2.HttpConnectionType.INTERNET,
      parameterMapping: this.props.parameterMapping ?? new apigwv2.ParameterMapping()
        .custom('QueueUrl', this.props.queue.queueUrl)
        .custom('MessageBody', '$request.body.MessageBody'),
    };
  }

  private determineActionBySubtype(subtype?: apigwv2.HttpIntegrationSubtype): string {
    switch (subtype) {
      case apigwv2.HttpIntegrationSubtype.SQS_SEND_MESSAGE:
        return 'sqs:SendMessage';
      case apigwv2.HttpIntegrationSubtype.SQS_RECEIVE_MESSAGE:
        return 'sqs:ReceiveMessage';
      case apigwv2.HttpIntegrationSubtype.SQS_DELETE_MESSAGE:
        return 'sqs:DeleteMessage';
      case apigwv2.HttpIntegrationSubtype.SQS_PURGE_QUEUE:
        return 'sqs:PurgeQueue';
      default:
        throw new Error('Invalid subtype for SQS integration');
    }
  }

  private determineResourceArn(options: apigwv2.HttpRouteIntegrationBindOptions): string {
    switch (this.props.subtype) {
      case apigwv2.HttpIntegrationSubtype.SQS_SEND_MESSAGE:
      case apigwv2.HttpIntegrationSubtype.SQS_RECEIVE_MESSAGE:
      case apigwv2.HttpIntegrationSubtype.SQS_DELETE_MESSAGE:
      case apigwv2.HttpIntegrationSubtype.SQS_PURGE_QUEUE:
        return this.props.queue.queueArn;
      default:
        return options.route.stack.formatArn({
          service: 'states',
          resource: `execution:${this.props.queue.queueName}:*`,
        });
    }
  }
}
