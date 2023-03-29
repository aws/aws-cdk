import * as apigateway from '@aws-cdk/aws-apigateway';
import { Stack } from '@aws-cdk/core';
import { RestApiOrigin } from '../lib';

let stack: Stack;

beforeEach(() => {
  stack = new Stack();
});

test('Correctly renders the origin', () => {
  const api = new apigateway.RestApi(stack, 'RestApi');
  api.root.addMethod('GET');

  const origin = new RestApiOrigin(api);
  const originBindConfig = origin.bind(stack, { originId: 'StackOrigin029E19582' });

  expect(stack.resolve(originBindConfig.originProperty)).toEqual({
    id: 'StackOrigin029E19582',
    domainName: {
      'Fn::Select': [2, {
        'Fn::Split': ['/', {
          'Fn::Join': ['', [
            'https://', { Ref: 'RestApi0C43BF4B' },
            '.execute-api.',
            { Ref: 'AWS::Region' },
            '.',
            { Ref: 'AWS::URLSuffix' },
            '/',
            { Ref: 'RestApiDeploymentStageprod3855DE66' },
            '/',
          ]],
        }],
      }],
    },
    originPath: {
      'Fn::Join': ['', ['/', {
        'Fn::Select': [3, {
          'Fn::Split': ['/', {
            'Fn::Join': ['', [
              'https://',
              { Ref: 'RestApi0C43BF4B' },
              '.execute-api.',
              { Ref: 'AWS::Region' },
              '.',
              { Ref: 'AWS::URLSuffix' },
              '/',
              { Ref: 'RestApiDeploymentStageprod3855DE66' },
              '/',
            ]],
          }],
        }],
      }]],
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
  const api = new apigateway.RestApi(stack, 'RestApi');
  api.root.addMethod('GET');

  const origin = new RestApiOrigin(api, { originId: 'MyCustomOrigin' });
  const originBindConfig = origin.bind(stack, { originId: 'StackOrigin029E19582' });

  expect(stack.resolve(originBindConfig.originProperty)).toEqual({
    id: 'MyCustomOrigin',
    domainName: {
      'Fn::Select': [2, {
        'Fn::Split': ['/', {
          'Fn::Join': ['', [
            'https://', { Ref: 'RestApi0C43BF4B' },
            '.execute-api.',
            { Ref: 'AWS::Region' },
            '.',
            { Ref: 'AWS::URLSuffix' },
            '/',
            { Ref: 'RestApiDeploymentStageprod3855DE66' },
            '/',
          ]],
        }],
      }],
    },
    originPath: {
      'Fn::Join': ['', ['/', {
        'Fn::Select': [3, {
          'Fn::Split': ['/', {
            'Fn::Join': ['', [
              'https://',
              { Ref: 'RestApi0C43BF4B' },
              '.execute-api.',
              { Ref: 'AWS::Region' },
              '.',
              { Ref: 'AWS::URLSuffix' },
              '/',
              { Ref: 'RestApiDeploymentStageprod3855DE66' },
              '/',
            ]],
          }],
        }],
      }]],
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
  const api = new apigateway.RestApi(stack, 'RestApi');
  api.root.addMethod('GET');

  const origin = new RestApiOrigin(api, { originPath: '/my/custom/path' });
  const originBindConfig = origin.bind(stack, { originId: 'StackOrigin029E19582' });

  expect(stack.resolve(originBindConfig.originProperty)).toEqual({
    id: 'StackOrigin029E19582',
    domainName: {
      'Fn::Select': [2, {
        'Fn::Split': ['/', {
          'Fn::Join': ['', [
            'https://', { Ref: 'RestApi0C43BF4B' },
            '.execute-api.',
            { Ref: 'AWS::Region' },
            '.',
            { Ref: 'AWS::URLSuffix' },
            '/',
            { Ref: 'RestApiDeploymentStageprod3855DE66' },
            '/',
          ]],
        }],
      }],
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