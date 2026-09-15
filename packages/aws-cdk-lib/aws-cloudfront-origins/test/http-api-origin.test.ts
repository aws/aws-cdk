import * as apigatewayv2 from '../../aws-apigatewayv2';
import * as cloudfront from '../../aws-cloudfront';
import { Duration, Stack } from '../../core';
import { HttpApiOrigin } from '../lib';

let stack: Stack;

beforeEach(() => {
  stack = new Stack();
});

test('Correctly renders the origin for default stage', () => {
  const httpApi = new apigatewayv2.HttpApi(stack, 'HttpApi');

  const origin = new HttpApiOrigin(httpApi);
  const originBindConfig = origin.bind(stack, { originId: 'StackOrigin029E19582' });

  expect(stack.resolve(originBindConfig.originProperty)).toEqual({
    id: 'StackOrigin029E19582',
    domainName: {
      'Fn::Join': ['', [
        { Ref: 'HttpApiF5A9A8A7' },
        '.execute-api.',
        { Ref: 'AWS::Region' },
        '.',
        { Ref: 'AWS::URLSuffix' },
      ]],
    },
    customOriginConfig: {
      originProtocolPolicy: 'https-only',
      originSslProtocols: [
        'TLSv1.2',
      ],
    },
  });
});

test('Correctly renders the origin, with custom originId', () => {
  const httpApi = new apigatewayv2.HttpApi(stack, 'HttpApi');

  const origin = new HttpApiOrigin(httpApi, { originId: 'MyCustomOrigin' });
  const originBindConfig = origin.bind(stack, { originId: 'StackOrigin029E19582' });

  expect(stack.resolve(originBindConfig.originProperty)).toEqual({
    id: 'MyCustomOrigin',
    domainName: {
      'Fn::Join': ['', [
        { Ref: 'HttpApiF5A9A8A7' },
        '.execute-api.',
        { Ref: 'AWS::Region' },
        '.',
        { Ref: 'AWS::URLSuffix' },
      ]],
    },
    customOriginConfig: {
      originProtocolPolicy: 'https-only',
      originSslProtocols: [
        'TLSv1.2',
      ],
    },
  });
});

test('Correctly renders the origin, with custom originPath', () => {
  const httpApi = new apigatewayv2.HttpApi(stack, 'HttpApi');

  const origin = new HttpApiOrigin(httpApi, { originPath: '/my/custom/path' });
  const originBindConfig = origin.bind(stack, { originId: 'StackOrigin029E19582' });

  expect(stack.resolve(originBindConfig.originProperty)).toEqual({
    id: 'StackOrigin029E19582',
    domainName: {
      'Fn::Join': ['', [
        { Ref: 'HttpApiF5A9A8A7' },
        '.execute-api.',
        { Ref: 'AWS::Region' },
        '.',
        { Ref: 'AWS::URLSuffix' },
      ]],
    },
    originPath: '/my/custom/path',
    customOriginConfig: {
      originProtocolPolicy: 'https-only',
      originSslProtocols: [
        'TLSv1.2',
      ],
    },
  });
});

test('Correctly renders the origin with explicit stage', () => {
  const httpApi = new apigatewayv2.HttpApi(stack, 'HttpApi');
  const prodStage = httpApi.addStage('prod', { stageName: 'prod', autoDeploy: true });

  const origin = new HttpApiOrigin(httpApi, { stage: prodStage });
  const originBindConfig = origin.bind(stack, { originId: 'StackOrigin029E19582' });

  expect(stack.resolve(originBindConfig.originProperty)).toEqual({
    id: 'StackOrigin029E19582',
    domainName: {
      'Fn::Join': ['', [
        { Ref: 'HttpApiF5A9A8A7' },
        '.execute-api.',
        { Ref: 'AWS::Region' },
        '.',
        { Ref: 'AWS::URLSuffix' },
      ]],
    },
    originPath: '/prod',
    customOriginConfig: {
      originProtocolPolicy: 'https-only',
      originSslProtocols: [
        'TLSv1.2',
      ],
    },
  });
});

test('throws when no default stage and no explicit stage provided', () => {
  const httpApi = new apigatewayv2.HttpApi(stack, 'HttpApi', {
    createDefaultStage: false,
  });

  expect(() => {
    new HttpApiOrigin(httpApi);
  }).toThrow('An explicit stage must be provided when the HTTP API does not have a default stage. Use the \'stage\' property to specify the stage.');
});

test('works with createDefaultStage: false when explicit stage is provided', () => {
  const httpApi = new apigatewayv2.HttpApi(stack, 'HttpApi', {
    createDefaultStage: false,
  });
  const prodStage = httpApi.addStage('prod', { autoDeploy: true });

  const origin = new HttpApiOrigin(httpApi, { stage: prodStage });
  const originBindConfig = origin.bind(stack, { originId: 'StackOrigin029E19582' });

  expect(originBindConfig.originProperty).toBeDefined();
});

test('renders responseCompletionTimeout in origin property', () => {
  const httpApi = new apigatewayv2.HttpApi(stack, 'HttpApi');

  const origin = new HttpApiOrigin(httpApi, {
    responseCompletionTimeout: Duration.seconds(120),
  });
  const originBindConfig = origin.bind(stack, { originId: 'StackOrigin029E19582' });

  expect(originBindConfig.originProperty?.responseCompletionTimeout).toEqual(120);
});

test('configure both responseCompletionTimeout and readTimeout', () => {
  const httpApi = new apigatewayv2.HttpApi(stack, 'HttpApi');

  const origin = new HttpApiOrigin(httpApi, {
    responseCompletionTimeout: Duration.seconds(60),
    readTimeout: Duration.seconds(60),
  });

  const originBindConfig = origin.bind(stack, { originId: 'StackOrigin029E19582' });
  expect(originBindConfig.originProperty?.responseCompletionTimeout).toEqual(60);
});

test('throw error for configuring readTimeout less than responseCompletionTimeout value', () => {
  const httpApi = new apigatewayv2.HttpApi(stack, 'HttpApi');

  expect(() => {
    new HttpApiOrigin(httpApi, {
      responseCompletionTimeout: Duration.seconds(30),
      readTimeout: Duration.seconds(60),
    });
  }).toThrow('responseCompletionTimeout must be equal to or greater than readTimeout (60s), got: 30s.');
});

test('works with imported HTTP API and explicit stage', () => {
  const importedApi = apigatewayv2.HttpApi.fromHttpApiAttributes(stack, 'ImportedApi', {
    httpApiId: 'imported-api-id',
  });
  const stage = new apigatewayv2.HttpStage(stack, 'Stage', {
    httpApi: importedApi,
    stageName: 'prod',
    autoDeploy: true,
  });

  const origin = new HttpApiOrigin(importedApi, { stage });
  const originBindConfig = origin.bind(stack, { originId: 'StackOrigin029E19582' });

  expect(stack.resolve(originBindConfig.originProperty)).toEqual(expect.objectContaining({
    domainName: {
      'Fn::Join': ['', [
        'imported-api-id.execute-api.',
        { Ref: 'AWS::Region' },
        '.',
        { Ref: 'AWS::URLSuffix' },
      ]],
    },
    originPath: '/prod',
  }));
});

test('works with imported stage (fromHttpStageAttributes)', () => {
  const httpApi = new apigatewayv2.HttpApi(stack, 'HttpApi');
  const importedStage = apigatewayv2.HttpStage.fromHttpStageAttributes(stack, 'ImportedStage', {
    stageName: '$default',
    api: httpApi,
  });

  const origin = new HttpApiOrigin(httpApi, { stage: importedStage });
  const originBindConfig = origin.bind(stack, { originId: 'StackOrigin029E19582' });

  // $default stage should have no originPath
  expect(stack.resolve(originBindConfig.originProperty)).toEqual(expect.objectContaining({
    domainName: {
      'Fn::Join': ['', [
        { Ref: 'HttpApiF5A9A8A7' },
        '.execute-api.',
        { Ref: 'AWS::Region' },
        '.',
        { Ref: 'AWS::URLSuffix' },
      ]],
    },
  }));
  expect(originBindConfig.originProperty?.originPath).toBeUndefined();
});

test('imported stage with custom stage name sets originPath', () => {
  const httpApi = new apigatewayv2.HttpApi(stack, 'HttpApi');
  const importedStage = apigatewayv2.HttpStage.fromHttpStageAttributes(stack, 'ImportedStage', {
    stageName: 'prod',
    api: httpApi,
  });

  const origin = new HttpApiOrigin(httpApi, { stage: importedStage });
  const originBindConfig = origin.bind(stack, { originId: 'StackOrigin029E19582' });

  expect(stack.resolve(originBindConfig.originProperty)).toEqual(expect.objectContaining({
    originPath: '/prod',
  }));
});

test.each([
  cloudfront.OriginIpAddressType.IPV4,
  cloudfront.OriginIpAddressType.IPV6,
  cloudfront.OriginIpAddressType.DUALSTACK,
])('renders with %s address type', (ipAddressType) => {
  const httpApi = new apigatewayv2.HttpApi(stack, 'HttpApi');

  const origin = new HttpApiOrigin(httpApi, {
    ipAddressType,
  });
  const originBindConfig = origin.bind(stack, { originId: 'StackOrigin029E19582' });

  expect(stack.resolve(originBindConfig.originProperty?.customOriginConfig)).toMatchObject({
    originProtocolPolicy: 'https-only',
    originSslProtocols: [
      'TLSv1.2',
    ],
    ipAddressType,
  });
});
