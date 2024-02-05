import * as apigwv2 from '../../../aws-apigatewayv2';
import * as iam from '../../../aws-iam';
import * as sfn from '../../../aws-stepfunctions';

/**
 * Properties to initialize `HttpStepFunctionsIntegration`.
 */
interface HttpStepFunctionsIntegrationProps {
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
   * Only subtypes starting with STEPFUNCTIONS_ can be specified.
   *
   * @default HttpIntegrationSubtype.STEPFUNCTIONS_START_EXECUTION
   */
  readonly subtype?: apigwv2.HttpIntegrationSubtype;

  /**
   * Statemachine that Integrates with API Gateway
   */
  readonly stateMachine: sfn.StateMachine;
}

/**
 * The StepFunctions integration resource for HTTP API
 */
export class HttpStepFunctionsIntegration extends apigwv2.HttpRouteIntegration {
  /**
   * @param id id of the underlying integration construct
   * @param props properties to configure the integration
   */
  constructor(
    id: string,
    private readonly props: HttpStepFunctionsIntegrationProps,
  ) {
    super(id);
  }

  public bind(options: apigwv2.HttpRouteIntegrationBindOptions): apigwv2.HttpRouteIntegrationConfig {
    if (this.props.subtype && !this.props.subtype.startsWith('StepFunctions-')) {
      throw new Error('Subtype must start with STEPFUNCTIONS_');
    }

    const invokeRole = new iam.Role(options.scope, 'InvokeRole', {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
    });

    invokeRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        sid: 'AllowStepFunctionsExecution',
        actions: [this.determineActionBySubtype(this.props.subtype)],
        resources: [this.determineResourceArn(options)],
      }),
    );

    return {
      payloadFormatVersion: apigwv2.PayloadFormatVersion.VERSION_1_0,
      type: apigwv2.HttpIntegrationType.AWS_PROXY,
      subtype: this.props.subtype ?? apigwv2.HttpIntegrationSubtype.STEPFUNCTIONS_START_EXECUTION,
      credentials: apigwv2.IntegrationCredentials.fromRole(invokeRole),
      connectionType: apigwv2.HttpConnectionType.INTERNET,
      parameterMapping: this.props.parameterMapping ?? new apigwv2.ParameterMapping()
        .custom('StateMachineArn', this.props.stateMachine.stateMachineArn),
    };
  }

  private determineActionBySubtype(subtype?: apigwv2.HttpIntegrationSubtype): string {
    switch (subtype) {
      case apigwv2.HttpIntegrationSubtype.STEPFUNCTIONS_STOP_EXECUTION:
        return 'states:StopExecution';
      case apigwv2.HttpIntegrationSubtype.STEPFUNCTIONS_START_SYNC_EXECUTION:
        return 'states:StartSyncExecution';
      default:
        return 'states:StartExecution';
    }
  }

  private determineResourceArn(options: apigwv2.HttpRouteIntegrationBindOptions): string {
    switch (this.props.subtype) {
      case apigwv2.HttpIntegrationSubtype.STEPFUNCTIONS_STOP_EXECUTION:
        return options.route.stack.formatArn({
          service: 'states',
          resource: `execution:${this.props.stateMachine.stateMachineName}`,
          resourceName: '*',
        });
      // Both START_EXECUTION and START_SYNC_EXECUTION return the state machine arn
      default:
        return this.props.stateMachine.stateMachineArn;
    }
  }
}
