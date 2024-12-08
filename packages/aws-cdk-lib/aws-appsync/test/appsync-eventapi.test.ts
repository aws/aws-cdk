import * as path from 'path';
import { Template } from '../../assertions';
import { Certificate } from '../../aws-certificatemanager';
import * as iam from '../../aws-iam';
import * as logs from '../../aws-logs';
import { App } from '../../core';
import * as cdk from '../../core';
import * as appsync from '../lib';

// GIVEN
let stack: cdk.Stack;
let app: App;
beforeEach(() => {
  app = new App({});
  stack = new cdk.Stack(app);
});

describe('AppSync Event API Key Authorization', () => {
  test('AppSync Event API - creates default api key', () => {
    // WHEN
    new appsync.EventApi(stack, 'api', { apiName: 'api' });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::AppSync::ApiKey', 1);
  });

  test('AppSync Event API - allows a single key with no name', () => {
    // WHEN
    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [{ authorizationType: appsync.AuthorizationType.API_KEY }],
      },
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::AppSync::ApiKey', 1);
  });

  test('AppSync Event API - allows multiple keys to be created', () => {
    // WHEN
    new appsync.EventApi(stack, 'api', {
      apiName: 'api',
      authorizationConfig: {
        authProviders: [
          { authorizationType: appsync.AuthorizationType.API_KEY, apiKeyConfig: { name: 'first' } },
          { authorizationType: appsync.AuthorizationType.API_KEY, apiKeyConfig: { name: 'second' } },
        ],
      },
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::AppSync::ApiKey', 2);
  });

  test('AppSync Event API - Requires a name when multiple keys are specified', () => {
    // WHEN
    expect(() => {
      new appsync.EventApi(stack, 'api', {
        apiName: 'api',
        authorizationConfig: {
          authProviders: [
            { authorizationType: appsync.AuthorizationType.API_KEY },
            { authorizationType: appsync.AuthorizationType.API_KEY, apiKeyConfig: { name: 'second' } },
          ],
        },
      });
    }).toThrow('You must specify key names when configuring more than 1 API key.');
  });
});
