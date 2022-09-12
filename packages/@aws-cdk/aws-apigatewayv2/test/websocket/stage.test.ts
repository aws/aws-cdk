import { Match, Template } from '@aws-cdk/assertions';
import { User } from '@aws-cdk/aws-iam';
import { LogGroup } from '@aws-cdk/aws-logs';
import { Stack } from '@aws-cdk/core';
import { defaultAccessLogFormat, WebSocketApi, WebSocketStage, DataTraceLoggingLevel } from '../../lib';

describe('WebSocketStage', () => {
  test('default', () => {
    // GIVEN
    const stack = new Stack();
    const api = new WebSocketApi(stack, 'Api');

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
    // GIVEN
    const stack = new Stack();
    const api = new WebSocketApi(stack, 'Api');

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
    // GIVEN
    const stack = new Stack();
    const api = new WebSocketApi(stack, 'Api');

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
      const stack = new Stack();
      const api = new WebSocketApi(stack, 'Api');
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

  test('correctly sets throttle', () => {
    // GIVEN
    const stack = new Stack();
    const api = new WebSocketApi(stack, 'Api');

    // WHEN
    new WebSocketStage(stack, 'DefaultStage', {
      webSocketApi: api,
      stageName: 'dev',
      throttle: {
        burstLimit: 123,
        rateLimit: 456,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Stage', {
      ApiId: stack.resolve(api.apiId),
      StageName: 'dev',
      DefaultRouteSettings: {
        ThrottlingBurstLimit: 123,
        ThrottlingRateLimit: 456,
      },
    });
  });

  test('correctly sets default route settings when throttle is set and data trace logging level is INFO', () => {
    // GIVEN
    const stack = new Stack();
    const api = new WebSocketApi(stack, 'Api');

    // WHEN
    new WebSocketStage(stack, 'DefaultStage', {
      webSocketApi: api,
      stageName: 'dev',
      throttle: {
        burstLimit: 123,
        rateLimit: 456,
      },
      dataTraceLoggingLevel: DataTraceLoggingLevel.INFO,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Stage', {
      ApiId: stack.resolve(api.apiId),
      StageName: 'dev',
      DefaultRouteSettings: {
        DataTraceEnabled: true,
        LoggingLevel: 'INFO',
        ThrottlingBurstLimit: 123,
        ThrottlingRateLimit: 456,
      },
    });
  });

  test('correctly sets access log settings when the log group and format are not supplied', () => {
    // GIVEN
    const stack = new Stack();
    const api = new WebSocketApi(stack, 'Api');

    // WHEN
    new WebSocketStage(stack, 'DefaultStage', {
      webSocketApi: api,
      stageName: 'dev',
      accessLogEnabled: true,
    });

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::ApiGatewayV2::Stage', {
      ApiId: stack.resolve(api.apiId),
      StageName: 'dev',
      AccessLogSettings: {
        Format: defaultAccessLogFormat,
      },
    });

    // The log group is auto-allocated so we don't know the value of it's arn
    // but it has to be there with some value.
    const stageProperties = template.findResources('AWS::ApiGatewayV2::Stage', {});
    const StageName = Object.keys(stageProperties);
    expect(StageName).toHaveLength(1);
    expect(stageProperties[StageName[0]]).toHaveProperty('Properties.AccessLogSettings.DestinationArn');
  });

  test('correctly sets access log settings when the log group and format are supplied', () => {
    // GIVEN
    const stack = new Stack();
    const api = new WebSocketApi(stack, 'Api');
    const accessLogsLogGroup = new LogGroup(stack, 'AccessLogsLogGroup');

    // A format string which is different from the default.
    const formatString: string = JSON.stringify({
      apigw: {
        api_id: '$context.apiId',
        stage: '$context.stage',
      },
      request: {
        request_id: '$context.requestId',
        extended_request_id: '$context.extendedRequestId',
        time: '$context.requestTime',
        time_epoch: '$context.requestTimeEpoch',
        protocol: '$context.protocol',
      },
    });

    // WHEN
    new WebSocketStage(stack, 'DefaultStage', {
      webSocketApi: api,
      stageName: 'dev',
      accessLogEnabled: true,
      accessLogGroup: accessLogsLogGroup,
      accessLogFormat: formatString,
    });

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::ApiGatewayV2::Stage', {
      ApiId: stack.resolve(api.apiId),
      StageName: 'dev',
      AccessLogSettings: {
        Format: formatString,
      },
    });

    // The arn for the log group gets transformed, so we don't know it's value
    // but it has to be there with some value.
    const stageProperties = template.findResources('AWS::ApiGatewayV2::Stage', {});
    const StageName = Object.keys(stageProperties);
    expect(StageName).toHaveLength(1);
    expect(stageProperties[StageName[0]]).toHaveProperty('Properties.AccessLogSettings.DestinationArn');
  });
});
