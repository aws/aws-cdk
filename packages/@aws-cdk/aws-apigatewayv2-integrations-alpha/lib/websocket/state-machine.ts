import {
  WebSocketRouteIntegration,
  WebSocketIntegrationType,
  WebSocketRouteIntegrationConfig,
  WebSocketRouteIntegrationBindOptions,
} from '@aws-cdk/aws-apigatewayv2-alpha';
import { IStateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { Stack } from 'aws-cdk-lib/core';

/**
 * State Machine WebSocket AWS direct integration properties
 */
export interface WebSocketStateMachineIntegrationProps {
  /**
   * Integration Method
   */
  readonly integrationMethod?: string;

  /**
     * Credentials Arn
     */
  readonly credentialsArn?: string;

  /**
     * Template Selection Expression
     */
  readonly templateSelectionExpression?: string;

  /**
     * Request Templates
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-requesttemplates
     */
  readonly requestTemplates?: { [key: string]: string };
}

/**
 * StateMachine WebSocket Integration
 */
export class WebSocketStateMachineIntegration extends WebSocketRouteIntegration {

  //private readonly _id: string;

  /**
     * @param id id of the underlying integration construct
     * @param stateMachine the State Machine
     */
  constructor(
    id: string,
    private readonly stateMachine: IStateMachine,
    private readonly props: WebSocketStateMachineIntegrationProps = {}) {
    super(id);
    //this._id = id;
  }

  bind(options: WebSocketRouteIntegrationBindOptions): WebSocketRouteIntegrationConfig {
    var route = options.route;

    //TODO: how to setup the CredentialsArn?
    /*
    this.stateMachine.addPermission(`${this._id}-Permission`, {
      scope: options.scope,
      principal: new ServicePrincipal('apigateway.amazonaws.com'),
      sourceArn: Stack.of(route).formatArn({
        service: 'execute-api',
        resource: route.webSocketApi.apiId,
        resourceName: '',
      }),
    });
    */

    //TODO: is this correct?
    //arn:aws:apigateway:${options.route.env.region}:states:action/StartExecution
    const integrationUri = Stack.of(route).formatArn({
      service: 'apigateway',
      account: 'states',
      resource: 'action/StartExecution',
    });

    return {
      type: WebSocketIntegrationType.AWS,
      uri: integrationUri,
      requestTemplates: this.props.requestTemplates,
      method: this.props.integrationMethod,
      credentialsArn: this.props.credentialsArn,
      templateSelectionExpression: this.props.templateSelectionExpression,
    };
  }
}
