import { Match, Template } from '../../../assertions';
import { User } from '../../../aws-iam';
import { Stack } from '../../../core';
import { WebSocketApi, WebSocketStage } from '../../lib';

let stack: Stack;
let api: WebSocketApi;

beforeEach(() => {
  stack = new Stack();
  api = new WebSocketApi(stack, 'Api');
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
});
