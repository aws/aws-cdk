import { Match, Template } from '../../../assertions';
import { AccessLogField, AccessLogFormat } from '../../../aws-apigateway';
import { User } from '../../../aws-iam';
import { LogGroup } from '../../../aws-logs';
import { Lazy, Stack } from '../../../core';
import { LogGroupLogDestination, WebSocketApi, WebSocketStage } from '../../lib';

let stack: Stack;
let api: WebSocketApi;
let logGroup: LogGroup;

beforeEach(() => {
  stack = new Stack();
  api = new WebSocketApi(stack, 'Api');
  logGroup = new LogGroup(stack, 'LogGroup');
});

describe('WebSocketStage', () => {
  test('default', () => {
    // WHEN
    const defaultStage = new WebSocketStage(stack, 'Stage', {
      webSocketApi: api,
      stageName: 'dev',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Stage', {
      ApiId: stack.resolve(api.apiId),
      StageName: 'dev',
    });
    expect(defaultStage.url.endsWith('/dev')).toBe(true);
  });

  test('import', () => {
    // WHEN
    const stage = new WebSocketStage(stack, 'Stage', {
      webSocketApi: api,
      stageName: 'dev',
    });

    const imported = WebSocketStage.fromWebSocketStageAttributes(stack, 'Import', {
      stageName: stage.stageName,
      api,
    });

    // THEN
    expect(imported.stageName).toEqual(stage.stageName);
    expect(() => imported.url).toThrow();
    expect(() => imported.callbackUrl).toThrow();
  });

  test('callback URL', () => {
    // WHEN
    const defaultStage = new WebSocketStage(stack, 'Stage', {
      webSocketApi: api,
      stageName: 'dev',
    });

    // THEN
    expect(defaultStage.callbackUrl.endsWith('/dev')).toBe(true);
    expect(defaultStage.callbackUrl.startsWith('https://')).toBe(true);
  });

  describe('grantManageConnections', () => {
    test('adds an IAM policy to the principal', () => {
      // GIVEN
      const defaultStage = new WebSocketStage(stack, 'Stage', {
        webSocketApi: api,
        stageName: 'dev',
      });
      const principal = new User(stack, 'User');

      // WHEN
      defaultStage.grantManagementApiAccess(principal);

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: Match.arrayWith([{
            Action: 'execute-api:ManageConnections',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': ['', [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':execute-api:',
                {
                  Ref: 'AWS::Region',
                },
                ':',
                {
                  Ref: 'AWS::AccountId',
                },
                ':',
                {
                  Ref: 'ApiF70053CD',
                },
                `/${defaultStage.stageName}/*/@connections/*`,
              ]],
            },
          }]),
        },
      });
    });
  });

  test('correctly sets throttle settings', () => {
    // WHEN
    new WebSocketStage(stack, 'DefaultStage', {
      webSocketApi: api,
      stageName: 'dev',
      throttle: {
        burstLimit: 1000,
        rateLimit: 1000,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Stage', {
      ApiId: stack.resolve(api.apiId),
      StageName: 'dev',
      DefaultRouteSettings: {
        ThrottlingBurstLimit: 1000,
        ThrottlingRateLimit: 1000,
      },
    });
  });

  test('correctly sets details metrics settings', () => {
    // WHEN
    new WebSocketStage(stack, 'DefaultStage', {
      webSocketApi: api,
      stageName: 'dev',
      detailedMetricsEnabled: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Stage', {
      ApiId: stack.resolve(api.apiId),
      StageName: 'dev',
      DefaultRouteSettings: {
        DetailedMetricsEnabled: true,
      },
    });
  });

  test('correctly sets route settings', () => {
    // WHEN
    new WebSocketStage(stack, 'DefaultStage', {
      webSocketApi: api,
      stageName: 'dev',
      throttle: {
        burstLimit: 1000,
        rateLimit: 1000,
      },
      detailedMetricsEnabled: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Stage', {
      ApiId: stack.resolve(api.apiId),
      StageName: 'dev',
      DefaultRouteSettings: {
        ThrottlingBurstLimit: 1000,
        ThrottlingRateLimit: 1000,
        DetailedMetricsEnabled: true,
      },
    });
  });

  test('specify description', () => {
    // WHEN
    new WebSocketStage(stack, 'DefaultStage', {
      webSocketApi: api,
      stageName: 'dev',
      description: 'My Stage',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Stage', {
      Description: 'My Stage',
    });
  });

  test('can add stage variables after creation', () => {
    // WHEN
    const stage = new WebSocketStage(stack, 'DefaultStage', {
      webSocketApi: api,
      stageName: 'dev',
      stageVariables: {
        env: 'dev',
      },
    });

    stage.addStageVariable('timeout', '600');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Stage', {
      ApiId: stack.resolve(api.apiId),
      StageName: 'dev',
      StageVariables: {
        env: 'dev',
        timeout: '600',
      },
    });
  });

  test('if only the custom log destination log group is set', () => {
    // WHEN
    new WebSocketStage(stack, 'my-stage', {
      webSocketApi: api,
      stageName: 'dev',
      accessLogSettings: {
        destination: new LogGroupLogDestination(logGroup),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Stage', {
      AccessLogSettings: {
        DestinationArn: {
          'Fn::GetAtt': [
            'LogGroupF5B46931',
            'Arn',
          ],
        },
        Format: '$context.identity.sourceIp $context.identity.caller $context.identity.user [$context.requestTime] "$context.eventType $context.routeKey $context.connectionId" $context.status $context.requestId',
      },
    });
  });

  test('if the custom log destination log group and format is set', () => {
    // WHEN
    const testFormat = AccessLogFormat.custom(JSON.stringify({
      requestId: AccessLogField.contextRequestId(),
      ip: AccessLogField.contextIdentitySourceIp(),
      user: AccessLogField.contextIdentityUser(),
    }));

    new WebSocketStage(stack, 'my-stage', {
      webSocketApi: api,
      stageName: 'dev',
      accessLogSettings: {
        destination: new LogGroupLogDestination(logGroup),
        format: testFormat,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Stage', {
      AccessLogSettings: {
        DestinationArn: {
          'Fn::GetAtt': [
            'LogGroupF5B46931',
            'Arn',
          ],
        },
        Format: '{"requestId":"$context.requestId","ip":"$context.identity.sourceIp","user":"$context.identity.user"}',
      },
    });
  });

  describe('access log check', () => {
    test('fails when access log format does not contain `contextRequestId()` or `contextExtendedRequestId()', () => {
      // WHEN
      const testFormat = AccessLogFormat.custom('');

      // THEN
      expect(() => new WebSocketStage(stack, 'my-stage', {
        webSocketApi: api,
        stageName: 'dev',
        accessLogSettings: {
          destination: new LogGroupLogDestination(logGroup),
          format: testFormat,
        },
      })).toThrow('Access log must include either `AccessLogFormat.contextRequestId()` or `AccessLogFormat.contextExtendedRequestId()`');
    });

    test('succeeds when access log format contains `contextRequestId()`', () => {
      // WHEN
      const testFormat = AccessLogFormat.custom(JSON.stringify({
        requestId: AccessLogField.contextRequestId(),
      }));

      // THEN
      expect(() => new WebSocketStage(stack, 'my-stage', {
        webSocketApi: api,
        stageName: 'dev',
        accessLogSettings: {
          destination: new LogGroupLogDestination(logGroup),
          format: testFormat,
        },
      })).not.toThrow();
    });

    test('succeeds when access log format contains `contextExtendedRequestId()`', () => {
      // WHEN
      const testFormat = AccessLogFormat.custom(JSON.stringify({
        extendedRequestId: AccessLogField.contextExtendedRequestId(),
      }));

      // THEN
      expect(() => new WebSocketStage(stack, 'my-stage', {
        webSocketApi: api,
        stageName: 'dev',
        accessLogSettings: {
          destination: new LogGroupLogDestination(logGroup),
          format: testFormat,
        },
      })).not.toThrow();
    });

    test('succeeds when access log format contains both `contextRequestId()` and `contextExtendedRequestId`', () => {
      // WHEN
      const testFormat = AccessLogFormat.custom(JSON.stringify({
        requestId: AccessLogField.contextRequestId(),
        extendedRequestId: AccessLogField.contextExtendedRequestId(),
      }));

      // THEN
      expect(() => new WebSocketStage(stack, 'my-stage', {
        webSocketApi: api,
        stageName: 'dev',
        accessLogSettings: {
          destination: new LogGroupLogDestination(logGroup),
          format: testFormat,
        },
      })).not.toThrow();
    });

    test('fails when access log format contains `contextRequestIdXxx`', () => {
      // WHEN
      const testFormat = AccessLogFormat.custom(JSON.stringify({
        requestIdXxx: '$context.requestIdXxx',
      }));

      // THEN
      expect(() => new WebSocketStage(stack, 'my-stage', {
        webSocketApi: api,
        stageName: 'dev',
        accessLogSettings: {
          destination: new LogGroupLogDestination(logGroup),
          format: testFormat,
        },
      })).toThrow('Access log must include either `AccessLogFormat.contextRequestId()` or `AccessLogFormat.contextExtendedRequestId()`');
    });

    test('does not fail when access log format is a token', () => {
      // WHEN
      const testFormat = AccessLogFormat.custom(Lazy.string({ produce: () => 'test' }));

      // THEN
      expect(() => new WebSocketStage(stack, 'my-stage', {
        webSocketApi: api,
        stageName: 'dev',
        accessLogSettings: {
          destination: new LogGroupLogDestination(logGroup),
          format: testFormat,
        },
      })).not.toThrow();
    });
  });
});
