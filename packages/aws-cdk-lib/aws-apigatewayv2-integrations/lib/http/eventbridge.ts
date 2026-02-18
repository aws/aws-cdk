import type { IConstruct } from 'constructs';
import * as apigwv2 from '../../../aws-apigatewayv2';
import type * as events from '../../../aws-events';
import * as iam from '../../../aws-iam';
import { ValidationError } from '../../../core';

/**
 * Properties to initialize `HttpEventBridgeIntegration`.
 */
export interface HttpEventBridgeIntegrationProps {
  /**
   * Specifies how to transform HTTP requests before sending them to the backend.
   *
   * When not provided, a default mapping will be used that expects the
   * incoming request body to contain the fields `Detail`, `DetailType`, and
   * `Source`.
   *
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-parameter-mapping.html
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-aws-services-reference.html
   *
   * @default - set `Detail` to `$request.body.Detail`,
   * `DetailType` to `$request.body.DetailType`, and `Source` to `$request.body.Source`.
   */
  readonly parameterMapping?: apigwv2.ParameterMapping;

  /**
   * The subtype of the HTTP integration.
   *
   * Only subtypes starting with EVENTBRIDGE_ can be specified.
   *
   * @default HttpIntegrationSubtype.EVENTBRIDGE_PUT_EVENTS
   */
  readonly subtype?: apigwv2.HttpIntegrationSubtype;

  /**
   * EventBridge event bus that integrates with API Gateway
   */
  readonly eventBusRef: events.EventBusReference;
}

/**
 * The EventBridge PutEvents integration resource for HTTP API
 */
export class HttpEventBridgeIntegration extends apigwv2.HttpRouteIntegration {
  private readonly subtype: apigwv2.HttpIntegrationSubtype;
  /**
   * @param id id of the underlying integration construct
   * @param props properties to configure the integration
   */
  constructor(
    id: string,
    private readonly props: HttpEventBridgeIntegrationProps,
  ) {
    super(id);
    this.subtype = this.props.subtype ?? apigwv2.HttpIntegrationSubtype.EVENTBRIDGE_PUT_EVENTS;
  }

  public bind(options: apigwv2.HttpRouteIntegrationBindOptions): apigwv2.HttpRouteIntegrationConfig {
    if (this.props.subtype && !this.props.subtype.startsWith('EventBridge-')) {
      throw new ValidationError('Subtype must start with `EventBridge-`', options.scope);
    }

    const invokeRole = new iam.Role(options.scope, 'InvokeRole', {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
    });

    invokeRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        sid: 'AllowEventBridgePutEvents',
        actions: ['events:PutEvents'],
        resources: [this.props.eventBusRef.eventBusArn],
      }),
    );

    return {
      payloadFormatVersion: apigwv2.PayloadFormatVersion.VERSION_1_0,
      type: apigwv2.HttpIntegrationType.AWS_PROXY,
      subtype: this.subtype,
      credentials: apigwv2.IntegrationCredentials.fromRole(invokeRole),
      connectionType: apigwv2.HttpConnectionType.INTERNET,
      parameterMapping: this.props.parameterMapping ?? this.createDefaultParameterMapping(options.scope),
    };
  }

  private createDefaultParameterMapping(scope: IConstruct): apigwv2.ParameterMapping {
    switch (this.subtype) {
      case apigwv2.HttpIntegrationSubtype.EVENTBRIDGE_PUT_EVENTS:
        // Default mapping includes only the required PutEvents parameters: Detail, DetailType, and Source.
        // Optional parameters (for example, EventBusName, Time, Resources) are intentionally omitted.
        // See: https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-aws-services-reference.html#EventBridge-PutEvents
        return new apigwv2.ParameterMapping()
          .custom('Detail', '$request.body.Detail')
          .custom('DetailType', '$request.body.DetailType')
          .custom('Source', '$request.body.Source');
      default:
        throw new ValidationError(`Unsupported subtype: ${this.subtype}`, scope);
    }
  }
}
