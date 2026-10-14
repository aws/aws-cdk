// Declare jest globals for type-checking in isolated lint runs
declare const describe: any;
declare const test: any;
declare const expect: any;
import { Match, Template } from '../../../assertions';
import { HttpApi, HttpIntegrationSubtype, HttpRoute, HttpRouteKey, ParameterMapping } from '../../../aws-apigatewayv2';
import * as events from '../../../aws-events';
import { App, Stack } from '../../../core';
import { HttpEventBridgeIntegration } from '../../lib/http/eventbridge';

describe('EventBridgeIntegration', () => {
  test('default', () => {
    const app = new App();
    const stack = new Stack(app, 'stack');
    const api = new HttpApi(stack, 'HttpApi');
    const bus = new events.EventBus(stack, 'Bus');

    new HttpRoute(stack, 'EventBridgeRoute', {
      httpApi: api,
      integration: new HttpEventBridgeIntegration('Integration', {
        eventBusRef: bus.eventBusRef,
      }),
      routeKey: HttpRouteKey.with('/events'),
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: { Service: 'apigateway.amazonaws.com' },
          }),
        ]),
      },
    });
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'events:PutEvents',
            Effect: 'Allow',
            Resource: stack.resolve(bus.eventBusArn),
          },
        ],
      },
      Roles: [
        Match.objectLike({ Ref: Match.stringLikeRegexp('EventBridgeRouteInvokeRole.*') }),
      ],
    });
    template.hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      ConnectionType: 'INTERNET',
      CredentialsArn: Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('EventBridgeRouteInvokeRole.*'), 'Arn'] }),
      IntegrationType: 'AWS_PROXY',
      IntegrationSubtype: 'EventBridge-PutEvents',
      PayloadFormatVersion: '1.0',
      RequestParameters: {
        Detail: '$request.body.Detail',
        DetailType: '$request.body.DetailType',
        Source: '$request.body.Source',
        EventBusName: stack.resolve(bus.eventBusName),
      },
    });
  });

  test('with parameterMapping', () => {
    const app = new App();
    const stack = new Stack(app, 'stack');
    const api = new HttpApi(stack, 'HttpApi');
    const bus = new events.EventBus(stack, 'Bus');

    new HttpRoute(stack, 'EventBridgeRoute', {
      httpApi: api,
      integration: new HttpEventBridgeIntegration('Integration', {
        eventBusRef: bus.eventBusRef,
        parameterMapping: new ParameterMapping().custom('test', 'testValue'),
      }),
      routeKey: HttpRouteKey.with('/events'),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      ConnectionType: 'INTERNET',
      CredentialsArn: Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('EventBridgeRouteInvokeRole.*'), 'Arn'] }),
      IntegrationType: 'AWS_PROXY',
      IntegrationSubtype: 'EventBridge-PutEvents',
      PayloadFormatVersion: '1.0',
      RequestParameters: {
        test: 'testValue',
        EventBusName: stack.resolve(bus.eventBusName),
      },
    });
  });

  test('with subtype EVENTBRIDGE_PUT_EVENTS', () => {
    const app = new App();
    const stack = new Stack(app, 'stack');
    const api = new HttpApi(stack, 'HttpApi');
    const bus = new events.EventBus(stack, 'Bus');

    new HttpRoute(stack, 'EventBridgeRoute', {
      httpApi: api,
      integration: new HttpEventBridgeIntegration('Integration', {
        eventBusRef: bus.eventBusRef,
        subtype: HttpIntegrationSubtype.EVENTBRIDGE_PUT_EVENTS,
      }),
      routeKey: HttpRouteKey.with('/events'),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      IntegrationSubtype: HttpIntegrationSubtype.EVENTBRIDGE_PUT_EVENTS,
    });
  });

  test('EventBusName can be explicitly overridden in parameterMapping', () => {
    const app = new App();
    const stack = new Stack(app, 'stack');
    const api = new HttpApi(stack, 'HttpApi');
    const bus = new events.EventBus(stack, 'Bus');

    new HttpRoute(stack, 'EventBridgeRoute', {
      httpApi: api,
      integration: new HttpEventBridgeIntegration('Integration', {
        eventBusRef: bus.eventBusRef,
        parameterMapping: new ParameterMapping()
          .custom('EventBusName', 'custom-bus-name')
          .custom('Detail', '$request.body.Detail'),
      }),
      routeKey: HttpRouteKey.with('/events'),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      RequestParameters: {
        EventBusName: 'custom-bus-name',
        Detail: '$request.body.Detail',
      },
    });
  });

  test('throw error when subtype does not start with EventBridge-', () => {
    const app = new App();
    const stack = new Stack(app, 'stack');
    const api = new HttpApi(stack, 'HttpApi');
    const bus = new events.EventBus(stack, 'Bus');

    expect(() => {
      new HttpRoute(stack, 'EventBridgeRoute', {
        httpApi: api,
        integration: new HttpEventBridgeIntegration('Integration', {
          eventBusRef: bus.eventBusRef,
          subtype: HttpIntegrationSubtype.SQS_SEND_MESSAGE,
        }),
        routeKey: HttpRouteKey.with('/events'),
      });
    }).toThrow(/Subtype must start with `EventBridge-`/);
  });
});
