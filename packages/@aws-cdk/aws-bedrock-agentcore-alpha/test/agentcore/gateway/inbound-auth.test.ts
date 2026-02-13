/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { CustomClaimOperator } from '../../../lib/common/types';
import { GatewayAuthorizer } from '../../../lib/gateway/inbound-auth/authorizer';
import { GatewayCustomClaim } from '../../../lib/gateway/inbound-auth/custom-claim';

describe('Inbound Auth Tests', () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
  });

  describe('GatewayCustomClaim', () => {
    describe('withStringValue', () => {
      test('Should create custom claim with string value', () => {
        const claim = GatewayCustomClaim.withStringValue('department', 'engineering');
        expect(claim).toBeDefined();
      });

      test('Should render string claim correctly', () => {
        const claim = GatewayCustomClaim.withStringValue('department', 'engineering');
        const rendered = claim._render() as any;

        expect(rendered.inboundTokenClaimName).toBe('department');
        expect(rendered.inboundTokenClaimValueType).toBe('STRING');
        expect(rendered.authorizingClaimMatchValue.claimMatchOperator).toBe('EQUALS');
        expect(rendered.authorizingClaimMatchValue.claimMatchValue.matchValueString).toBe('engineering');
      });

      test('Should handle token-based string value', () => {
        const tokenValue = cdk.Lazy.string({ produce: () => 'test-value' });
        expect(() => {
          GatewayCustomClaim.withStringValue('claim', tokenValue);
        }).not.toThrow();
      });

      test('Should throw error when STRING type receives non-string value', () => {
        expect(() => {
          // @ts-ignore - Testing runtime validation
          GatewayCustomClaim.withStringValue('claim', ['array']);
        }).toThrow(/STRING type requires a string value/);
      });

      test('Should throw error when STRING type receives number value', () => {
        expect(() => {
          // @ts-ignore - Testing runtime validation
          GatewayCustomClaim.withStringValue('claim', 123);
        }).toThrow(/STRING type requires a string value/);
      });
    });

    describe('withStringArrayValue', () => {
      test('Should create custom claim with string array and CONTAINS operator', () => {
        const claim = GatewayCustomClaim.withStringArrayValue('roles', ['admin']);
        expect(claim).toBeDefined();
      });

      test('Should create custom claim with string array and CONTAINS_ANY operator', () => {
        const claim = GatewayCustomClaim.withStringArrayValue('permissions', ['read', 'write'], CustomClaimOperator.CONTAINS_ANY);
        expect(claim).toBeDefined();
      });

      test('Should throw error for invalid operator with STRING_ARRAY', () => {
        expect(() => {
          GatewayCustomClaim.withStringArrayValue('claim', ['value'], CustomClaimOperator.EQUALS);
        }).toThrow(/STRING_ARRAY type only supports CONTAINS or CONTAINS_ANY operators/);
      });

      test('Should throw error when STRING_ARRAY type receives non-array value', () => {
        expect(() => {
          // @ts-ignore - Testing runtime validation
          GatewayCustomClaim.withStringArrayValue('claim', 'string-value');
        }).toThrow(/STRING_ARRAY type requires an array value/);
      });

      test('Should throw error when STRING_ARRAY type receives number value', () => {
        expect(() => {
          // @ts-ignore - Testing runtime validation
          GatewayCustomClaim.withStringArrayValue('claim', 123);
        }).toThrow(/STRING_ARRAY type requires an array value/);
      });

      test('Should handle token-based array value', () => {
        const tokenArray = cdk.Lazy.any({ produce: () => ['value1', 'value2'] });
        expect(() => {
          GatewayCustomClaim.withStringArrayValue('claim', tokenArray as any);
        }).not.toThrow();
      });

      test('Should use CONTAINS operator by default', () => {
        const claim = GatewayCustomClaim.withStringArrayValue('roles', ['admin']);
        const rendered = claim._render() as any;
        expect(rendered.authorizingClaimMatchValue.claimMatchOperator).toBe('CONTAINS');
      });
    });

    describe('render method', () => {
      test('Should render STRING_ARRAY claim with CONTAINS operator', () => {
        const claim = GatewayCustomClaim.withStringArrayValue('roles', ['admin'], CustomClaimOperator.CONTAINS);
        const rendered = claim._render() as any;

        expect(rendered.inboundTokenClaimName).toBe('roles');
        expect(rendered.inboundTokenClaimValueType).toBe('STRING_ARRAY');
        expect(rendered.authorizingClaimMatchValue.claimMatchOperator).toBe('CONTAINS');
        expect(rendered.authorizingClaimMatchValue.claimMatchValue.matchValueString).toBe('admin');
        expect(rendered.authorizingClaimMatchValue.claimMatchValue.matchValueStringList).toBeUndefined();
      });

      test('Should render STRING_ARRAY claim with CONTAINS_ANY operator', () => {
        const claim = GatewayCustomClaim.withStringArrayValue('permissions', ['read', 'write'], CustomClaimOperator.CONTAINS_ANY);
        const rendered = claim._render() as any;

        expect(rendered.inboundTokenClaimName).toBe('permissions');
        expect(rendered.inboundTokenClaimValueType).toBe('STRING_ARRAY');
        expect(rendered.authorizingClaimMatchValue.claimMatchOperator).toBe('CONTAINS_ANY');
        expect(rendered.authorizingClaimMatchValue.claimMatchValue.matchValueStringList).toEqual(['read', 'write']);
        expect(rendered.authorizingClaimMatchValue.claimMatchValue.matchValueString).toBeUndefined();
      });

      test('Should throw error when CONTAINS operator used with multiple values', () => {
        const claim = GatewayCustomClaim.withStringArrayValue('roles', ['admin', 'user'], CustomClaimOperator.CONTAINS);
        expect(() => {
          claim._render();
        }).toThrow(/CONTAINS operator requires exactly one value/);
      });

      test('Should handle CONTAINS with single value in array', () => {
        const claim = GatewayCustomClaim.withStringArrayValue('role', ['admin'], CustomClaimOperator.CONTAINS);
        const rendered = claim._render() as any;
        expect(rendered.authorizingClaimMatchValue.claimMatchValue.matchValueString).toBe('admin');
      });

      test('Should handle CONTAINS with token-based first value', () => {
        const tokenValue = cdk.Lazy.string({ produce: () => 'admin' });
        const claim = GatewayCustomClaim.withStringArrayValue('role', [tokenValue], CustomClaimOperator.CONTAINS);

        expect(() => {
          claim._render();
        }).not.toThrow();
      });
    });
  });

  describe('GatewayAuthorizer', () => {
    describe('usingAwsIam', () => {
      test('Should create AWS IAM authorizer', () => {
        const authorizer = GatewayAuthorizer.usingAwsIam();
        expect(authorizer).toBeDefined();
        expect(authorizer.authorizerType).toBe('AWS_IAM');
      });

      test('Should render AWS IAM authorizer as undefined', () => {
        const authorizer = GatewayAuthorizer.usingAwsIam();
        const rendered = authorizer._render();
        expect(rendered).toBeUndefined();
      });
    });

    describe('usingCustomJwt', () => {
      test('Should create custom JWT authorizer with allowedAudience', () => {
        const authorizer = GatewayAuthorizer.usingCustomJwt({
          discoveryUrl: 'https://auth.example.com/.well-known/openid-configuration',
          allowedAudience: ['my-app'],
        });

        expect(authorizer).toBeDefined();
        expect(authorizer.authorizerType).toBe('CUSTOM_JWT');
      });

      test('Should create custom JWT authorizer with allowedClients', () => {
        const authorizer = GatewayAuthorizer.usingCustomJwt({
          discoveryUrl: 'https://auth.example.com/.well-known/openid-configuration',
          allowedClients: ['client-123'],
        });

        expect(authorizer).toBeDefined();
      });

      test('Should create custom JWT authorizer with allowedScopes', () => {
        const authorizer = GatewayAuthorizer.usingCustomJwt({
          discoveryUrl: 'https://auth.example.com/.well-known/openid-configuration',
          allowedScopes: ['read', 'write'],
        });

        expect(authorizer).toBeDefined();
      });

      test('Should create custom JWT authorizer with customClaims', () => {
        const claim = GatewayCustomClaim.withStringValue('department', 'engineering');
        const authorizer = GatewayAuthorizer.usingCustomJwt({
          discoveryUrl: 'https://auth.example.com/.well-known/openid-configuration',
          customClaims: [claim],
        });

        expect(authorizer).toBeDefined();
      });

      test('Should throw error when no validation fields provided', () => {
        expect(() => {
          GatewayAuthorizer.usingCustomJwt({
            discoveryUrl: 'https://auth.example.com/.well-known/openid-configuration',
          });
        }).toThrow(/At least one of allowedAudience, allowedClients, allowedScopes, or customClaims must be defined/);
      });

      test('Should render custom JWT authorizer with all fields', () => {
        const claim = GatewayCustomClaim.withStringValue('dept', 'eng');
        const authorizer = GatewayAuthorizer.usingCustomJwt({
          discoveryUrl: 'https://auth.example.com/.well-known/openid-configuration',
          allowedAudience: ['app1'],
          allowedClients: ['client1'],
          allowedScopes: ['read'],
          customClaims: [claim],
        });

        const rendered = authorizer._render();
        expect(rendered.customJwtAuthorizer.discoveryUrl).toBe('https://auth.example.com/.well-known/openid-configuration');
        expect(rendered.customJwtAuthorizer.allowedAudience).toEqual(['app1']);
        expect(rendered.customJwtAuthorizer.allowedClients).toEqual(['client1']);
        expect(rendered.customJwtAuthorizer.allowedScopes).toEqual(['read']);
        expect(rendered.customJwtAuthorizer.customClaims).toHaveLength(1);
      });

      test('Should render without optional fields when not provided', () => {
        const authorizer = GatewayAuthorizer.usingCustomJwt({
          discoveryUrl: 'https://auth.example.com/.well-known/openid-configuration',
          allowedAudience: ['app1'],
        });

        const rendered = authorizer._render();
        expect(rendered.customJwtAuthorizer.allowedAudience).toEqual(['app1']);
        expect(rendered.customJwtAuthorizer.allowedClients).toBeUndefined();
        expect(rendered.customJwtAuthorizer.allowedScopes).toBeUndefined();
        expect(rendered.customJwtAuthorizer.customClaims).toBeUndefined();
      });

      test('Should not render customClaims when empty array', () => {
        const authorizer = GatewayAuthorizer.usingCustomJwt({
          discoveryUrl: 'https://auth.example.com/.well-known/openid-configuration',
          allowedAudience: ['app1'],
          customClaims: [],
        });

        const rendered = authorizer._render();
        expect(rendered.customJwtAuthorizer.customClaims).toBeUndefined();
      });

      test('Should render customClaims when non-empty array', () => {
        const claim = GatewayCustomClaim.withStringValue('dept', 'eng');
        const authorizer = GatewayAuthorizer.usingCustomJwt({
          discoveryUrl: 'https://auth.example.com/.well-known/openid-configuration',
          allowedAudience: ['app1'],
          customClaims: [claim],
        });

        const rendered = authorizer._render();
        expect(rendered.customJwtAuthorizer.customClaims).toHaveLength(1);
      });

      test('Should render multiple custom claims', () => {
        const claim1 = GatewayCustomClaim.withStringValue('dept', 'eng');
        const claim2 = GatewayCustomClaim.withStringArrayValue('roles', ['admin'], CustomClaimOperator.CONTAINS);
        const authorizer = GatewayAuthorizer.usingCustomJwt({
          discoveryUrl: 'https://auth.example.com/.well-known/openid-configuration',
          customClaims: [claim1, claim2],
        });

        const rendered = authorizer._render();
        expect(rendered.customJwtAuthorizer.customClaims).toHaveLength(2);
      });
    });

    describe('usingCognito', () => {
      test('Should create Cognito authorizer from UserPool', () => {
        const userPool = new cognito.UserPool(stack, 'UserPool', {
          userPoolName: 'test-pool',
        });

        const client = new cognito.UserPoolClient(stack, 'Client', {
          userPool: userPool,
          generateSecret: true,
        });

        const authorizer = GatewayAuthorizer.usingCognito({
          userPool: userPool,
          allowedClients: [client],
        });

        expect(authorizer).toBeDefined();
        expect(authorizer.authorizerType).toBe('CUSTOM_JWT');
      });

      test('Should format Cognito discovery URL correctly', () => {
        const userPool = new cognito.UserPool(stack, 'UserPool', {
          userPoolName: 'test-pool',
        });

        const authorizer = GatewayAuthorizer.usingCognito({
          userPool: userPool,
          allowedAudiences: ['my-app'],
        });

        const rendered = authorizer._render();
        expect(rendered.customJwtAuthorizer.discoveryUrl).toContain('cognito-idp');
        expect(rendered.customJwtAuthorizer.discoveryUrl).toContain('.well-known/openid-configuration');
      });

      test('Should handle Cognito authorizer without clients', () => {
        const userPool = new cognito.UserPool(stack, 'UserPool', {
          userPoolName: 'test-pool',
        });

        const authorizer = GatewayAuthorizer.usingCognito({
          userPool: userPool,
          allowedAudiences: ['my-app'],
        });

        const rendered = authorizer._render();
        expect(rendered.customJwtAuthorizer.allowedClients).toBeUndefined();
      });

      test('Should map multiple UserPool clients to client IDs', () => {
        const userPool = new cognito.UserPool(stack, 'UserPool', {
          userPoolName: 'test-pool',
        });

        const client1 = new cognito.UserPoolClient(stack, 'Client1', {
          userPool: userPool,
        });

        const client2 = new cognito.UserPoolClient(stack, 'Client2', {
          userPool: userPool,
        });

        const authorizer = GatewayAuthorizer.usingCognito({
          userPool: userPool,
          allowedClients: [client1, client2],
        });

        const rendered = authorizer._render();
        expect(rendered.customJwtAuthorizer.allowedClients).toHaveLength(2);
      });

      test('Should include allowedAudiences when provided', () => {
        const userPool = new cognito.UserPool(stack, 'UserPool', {
          userPoolName: 'test-pool',
        });

        const authorizer = GatewayAuthorizer.usingCognito({
          userPool: userPool,
          allowedAudiences: ['app1', 'app2'],
        });

        const rendered = authorizer._render();
        expect(rendered.customJwtAuthorizer.allowedAudience).toEqual(['app1', 'app2']);
      });

      test('Should include allowedScopes when provided', () => {
        const userPool = new cognito.UserPool(stack, 'UserPool', {
          userPoolName: 'test-pool',
        });

        const authorizer = GatewayAuthorizer.usingCognito({
          userPool: userPool,
          allowedAudiences: ['app1'],
          allowedScopes: ['read', 'write'],
        });

        const rendered = authorizer._render();
        expect(rendered.customJwtAuthorizer.allowedScopes).toEqual(['read', 'write']);
      });

      test('Should include customClaims when provided', () => {
        const userPool = new cognito.UserPool(stack, 'UserPool', {
          userPoolName: 'test-pool',
        });

        const claim = GatewayCustomClaim.withStringValue('org', 'acme');

        const authorizer = GatewayAuthorizer.usingCognito({
          userPool: userPool,
          allowedAudiences: ['app1'],
          customClaims: [claim],
        });

        const rendered = authorizer._render();
        expect(rendered.customJwtAuthorizer.customClaims).toHaveLength(1);
      });

      test('Should create Cognito authorizer with all optional parameters', () => {
        const userPool = new cognito.UserPool(stack, 'UserPool', {
          userPoolName: 'test-pool',
        });

        const client = new cognito.UserPoolClient(stack, 'Client', {
          userPool: userPool,
        });

        const claim = GatewayCustomClaim.withStringValue('dept', 'eng');

        const authorizer = GatewayAuthorizer.usingCognito({
          userPool: userPool,
          allowedClients: [client],
          allowedAudiences: ['app1'],
          allowedScopes: ['read'],
          customClaims: [claim],
        });

        const rendered = authorizer._render();
        expect(rendered.customJwtAuthorizer).toBeDefined();
        expect(rendered.customJwtAuthorizer.allowedClients).toBeDefined();
        expect(rendered.customJwtAuthorizer.allowedAudience).toEqual(['app1']);
        expect(rendered.customJwtAuthorizer.allowedScopes).toEqual(['read']);
        expect(rendered.customJwtAuthorizer.customClaims).toHaveLength(1);
      });
    });
  });
});
