import {
  HttpRouteIntegrationBindOptions,
  HttpRouteIntegrationConfig,
  EventBridgeIntegrationRequestParameters,
  AwsServiceIntegrationSubtype,
} from '@aws-cdk/aws-apigatewayv2';
import { IEventBus } from '@aws-cdk/aws-events';
import { PolicyStatement, Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { AwsServiceIntegration } from './private/integration';

/**
 * Properties to initialize `EventBridgeIntegration`.
 */
export interface EventBridgeIntegrationProps {
  /**
   * The EventBridge API call to proxy to.
   * @default AwsServiceIntegrationSubtype.EVENT_BRIDGE_PUT_EVENTS
   */
  readonly integrationSubtype?: AwsServiceIntegrationSubtype;

  /**
   * The event bus to bind proxy to.
   */
  readonly eventBus: IEventBus;

  /**
   * The event source.
   */
  readonly eventSource?: string;

  /**
   * The EventBridge PutEvents request parameters.
   * @see https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_PutEvents.html
   */
  readonly requestParameters: EventBridgeIntegrationRequestParameters;
}

/**
 * The EventBridge integration resource for HTTP API
 */
export class EventBridgeIntegration extends AwsServiceIntegration {
  constructor(private readonly props: EventBridgeIntegrationProps) {
    super();
  }

  public bind(options: HttpRouteIntegrationBindOptions): HttpRouteIntegrationConfig {
    this.integrationSubtype = this.props.integrationSubtype ?? AwsServiceIntegrationSubtype.EVENT_BRIDGE_PUT_EVENTS;

    const { scope } = options;

    const role = new Role(scope, 'EventBridgeIntegrationRole', {
      description: 'Role for API Gateway to publish Events',
      assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
    });

    role.addToPolicy(new PolicyStatement({
      actions: ['events:PutEvents'],
      resources: [this.props.eventBus.eventBusArn],
      conditions: (() => !('eventSource' in this.props) ? undefined : {
        StringEquals: {
          'events:source': this.props.eventSource,
        },
      })(),
    }));

    return {
      payloadFormatVersion: this.payloadFormatVersion,
      type: this.integrationType,
      connectionType: this.connectionType,
      credentialsArn: role.roleArn,
      integrationSubtype: this.integrationSubtype,
      requestParameters: this.props.requestParameters,
    };
  }
}
