import * as apigwv2 from '../../../aws-apigatewayv2';
import * as iam from '../../../aws-iam';
import * as sfn from '../../../aws-stepfunctions';

/**
 * Properties to initialize `HttpStepFunctionsIntegration`.
 */
interface HttpStepFunctionsIntegrationProps {
  /**
   * The HTTP method that must be used to invoke the underlying HTTP proxy.
   * @default HttpMethod.ANY
   */
  readonly method?: apigwv2.HttpMethod;

  /**
   * Specifies how to transform HTTP requests before sending them to the backend
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-parameter-mapping.html
   * @default undefined requests are sent to the backend unmodified
   */
  readonly parameterMapping?: apigwv2.ParameterMapping;

  /**
   * Statemachine that Integrates with API Gateway
   */
  readonly stateMachine: sfn.IStateMachine;
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
    const invokeRole = new iam.Role(options.scope, 'InvokeRole', {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
    });

    invokeRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        sid: 'AllowStepFunctionsExecution',
        actions: ['states:StartExecution'],
        resources: [this.props.stateMachine.stateMachineArn],
      }),
    );

    return {
      method: this.props.method ?? apigwv2.HttpMethod.ANY,
      payloadFormatVersion: apigwv2.PayloadFormatVersion.VERSION_1_0,
      type: apigwv2.HttpIntegrationType.AWS_PROXY,
      subtype: apigwv2.HttpIntegrationSubtype.STEPFUNCTIONS_START_EXECUTION,
      credentials: apigwv2.IntegrationCredentials.fromRole(invokeRole),
      connectionType: apigwv2.HttpConnectionType.INTERNET,
      parameterMapping: this.props.parameterMapping,
    };
  }
}
