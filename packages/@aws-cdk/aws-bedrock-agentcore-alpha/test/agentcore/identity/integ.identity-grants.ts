/**
 * Integration test: Identity grant methods (grantRead, grantAdmin, grantFullAccess)
 * for WorkloadIdentity, ApiKeyCredentialProvider, and OAuth2CredentialProvider.
 *
 * Each Lambda function is granted a specific permission scope and then invoked to run
 * ALL probe categories (read, admin, use). The test verifies both positive access (granted
 * actions succeed) and negative access (non-granted actions are denied), proving that
 * grants are neither under- nor over-permissive.
 */

/// !cdk-integ aws-cdk-bedrock-agentcore-identity-grants-1

import * as integ from '@aws-cdk/integ-tests-alpha';
import { AwsApiCall, Match } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as agentcore from '../../../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-identity-grants-1');

// ===== Identity Resources =====

const apiKeyProvider = new agentcore.ApiKeyCredentialProvider(stack, 'ApiKeyProvider', {
  apiKeyCredentialProviderName: 'integ-grants-api-key',
  apiKey: cdk.SecretValue.unsafePlainText('integ-placeholder-api-key'),
  tags: { integ: 'identity-grants' },
});

const oauthProvider = agentcore.OAuth2CredentialProvider.usingGithub(stack, 'OAuthProvider', {
  oAuth2CredentialProviderName: 'integ-grants-oauth',
  clientId: 'integ-github-client-id',
  clientSecret: cdk.SecretValue.unsafePlainText('integ-github-client-secret'),
  tags: { integ: 'identity-grants' },
});

const workloadIdentity = new agentcore.WorkloadIdentity(stack, 'WorkloadIdentity', {
  workloadIdentityName: 'integ-grants-workload-identity',
  tags: { integ: 'identity-grants' },
});

// ===== Shared inline helpers =====

const INLINE_HELPERS = `
  function nameFromArn(arn) {
    var parts = arn.split(':');
    var resource = parts[5] || '';
    var segments = resource.split('/');
    var name = segments[segments.length - 1];
    if (!name) throw new Error('Unable to parse resource name from ARN: ' + arn);
    return name;
  }

  function isAccessDenied(error) {
    var message = error instanceof Error ? error.message : String(error);
    var name = typeof error === 'object' && error !== null && 'name' in error ? String(error.name) : '';
    var httpStatus = typeof error === 'object' && error !== null && '$metadata' in error
      ? (error.$metadata && error.$metadata.httpStatusCode) : 0;
    return httpStatus === 403
      || name.includes('AccessDenied')
      || name.includes('Unauthorized')
      || name.includes('Forbidden')
      || message.includes('AccessDenied')
      || message.includes('not authorized')
      || message.includes('Not authorized');
  }
`;

// ===== Unified handler body =====
// All three Lambdas share this handler. Behavior is driven by the EXPECTED_DENIED
// environment variable which lists probe categories that SHOULD be denied.
// Categories: 'read', 'admin', 'use'
//
// The handler runs all probes and then verifies:
//   - Every probe in an expected-denied category got AccessDenied
//   - No probe in an allowed category got AccessDenied

const INLINE_HANDLER_BODY = `
  exports.handler = async () => {
    try {
      var controlSdk = await import('@aws-sdk/client-bedrock-agentcore-control');
      var runtimeSdk = await import('@aws-sdk/client-bedrock-agentcore');
      var controlClient = new controlSdk.BedrockAgentCoreControlClient({});
      var runtimeClient = new runtimeSdk.BedrockAgentCoreClient({});

      var apiKeyName = nameFromArn(process.env.API_KEY_PROVIDER_ARN);
      var oauthName = nameFromArn(process.env.OAUTH_PROVIDER_ARN);
      var workloadName = nameFromArn(process.env.WORKLOAD_IDENTITY_ARN);
      var expectedDenied = JSON.parse(process.env.EXPECTED_DENIED || '[]');

      var results = [];
      var accessDenied = [];

      // ---- Read probes ----
      var readProbes = [
        { category: 'read', type: 'read_api_key', cmd: new controlSdk.GetApiKeyCredentialProviderCommand({ name: apiKeyName }), client: controlClient },
        { category: 'read', type: 'read_oauth', cmd: new controlSdk.GetOauth2CredentialProviderCommand({ name: oauthName }), client: controlClient },
        { category: 'read', type: 'read_workload_identity', cmd: new controlSdk.GetWorkloadIdentityCommand({ name: workloadName }), client: controlClient },
      ];

      // ---- Admin probes ----
      var adminProbes = [
        { category: 'admin', type: 'admin_api_key', cmd: new controlSdk.UpdateApiKeyCredentialProviderCommand({ name: apiKeyName, apiKey: 'integ-placeholder-api-key' }), client: controlClient },
        {
          category: 'admin', type: 'admin_oauth',
          cmd: new controlSdk.UpdateOauth2CredentialProviderCommand({
            name: oauthName,
            credentialProviderVendor: 'GithubOauth2',
            oauth2ProviderConfigInput: { githubOauth2ProviderConfig: { clientId: 'integ-github-client-id', clientSecret: 'integ-github-client-secret' } },
          }),
          client: controlClient,
        },
        { category: 'admin', type: 'admin_workload_identity', cmd: new controlSdk.UpdateWorkloadIdentityCommand({ name: workloadName }), client: controlClient },
      ];

      // ---- Use probes ----
      // GetWorkloadAccessToken first (needed to call GetResourceApiKey)
      var workloadIdentityToken = '';
      try {
        var tokenResp = await runtimeClient.send(
          new runtimeSdk.GetWorkloadAccessTokenCommand({ workloadName: workloadName })
        );
        workloadIdentityToken = tokenResp.workloadAccessToken || '';
        results.push({ category: 'use', type: 'use_get_workload_access_token', status: 'succeeded' });
      } catch (error) {
        if (isAccessDenied(error)) {
          accessDenied.push({ category: 'use', type: 'use_get_workload_access_token' });
        } else {
          results.push({ category: 'use', type: 'use_get_workload_access_token', status: 'authorized_non_access_error', error: error instanceof Error ? error.name + ': ' + error.message : String(error) });
        }
      }

      // GetResourceApiKey - only attempt with a real token; with a placeholder token
      // the service may return a validation error instead of AccessDenied, making the
      // result ambiguous. When the token call was denied, we already know 'use' is denied.
      if (workloadIdentityToken) {
        try {
          await runtimeClient.send(
            new runtimeSdk.GetResourceApiKeyCommand({
              resourceCredentialProviderName: apiKeyName,
              workloadIdentityToken: workloadIdentityToken,
            })
          );
          results.push({ category: 'use', type: 'use_get_resource_api_key', status: 'succeeded' });
        } catch (error) {
          if (isAccessDenied(error)) {
            accessDenied.push({ category: 'use', type: 'use_get_resource_api_key' });
          } else {
            results.push({ category: 'use', type: 'use_get_resource_api_key', status: 'authorized_non_access_error', error: error instanceof Error ? error.name + ': ' + error.message : String(error) });
          }
        }
      }

      // ---- Run read and admin probes ----
      var allProbes = readProbes.concat(adminProbes);
      for (var p of allProbes) {
        try {
          await p.client.send(p.cmd);
          results.push({ category: p.category, type: p.type, status: 'succeeded' });
        } catch (error) {
          if (isAccessDenied(error)) {
            accessDenied.push({ category: p.category, type: p.type });
          } else {
            results.push({ category: p.category, type: p.type, status: 'authorized_non_access_error', error: error instanceof Error ? error.name + ': ' + error.message : String(error) });
          }
        }
      }

      // ---- Determine pass/fail ----
      // unexpectedDenied: probes that got AccessDenied but should NOT have been denied
      var unexpectedDenied = accessDenied.filter(function(d) { return expectedDenied.indexOf(d.category) === -1; });
      // overPermissive: probes in expected-denied categories that were NOT denied
      // (succeeded or got a non-access error, meaning IAM allowed the call)
      var overPermissive = results.filter(function(r) { return expectedDenied.indexOf(r.category) !== -1; });
      // missingDenied: expected-denied categories where no probe was even attempted
      // (should not happen unless probes array is misconfigured)
      var deniedCategories = accessDenied.map(function(d) { return d.category; });
      var attemptedCategories = results.map(function(r) { return r.category; }).concat(deniedCategories);
      var missingDenied = expectedDenied.filter(function(cat) { return attemptedCategories.indexOf(cat) === -1; });

      var passed = unexpectedDenied.length === 0 && overPermissive.length === 0 && missingDenied.length === 0;

      if (!passed) {
        console.error('GRANT TEST FAILED:', JSON.stringify({ unexpectedDenied: unexpectedDenied, overPermissive: overPermissive, missingDenied: missingDenied }));
      }

      return {
        results: results,
        accessDenied: accessDenied,
        unexpectedDenied: unexpectedDenied,
        overPermissive: overPermissive,
        missingDenied: missingDenied,
        passed: passed,
      };
    } catch (fatal) {
      console.error('FATAL:', fatal);
      return { results: [], accessDenied: [], unexpectedDenied: [], overPermissive: [], missingDenied: [], passed: false, fatalError: fatal instanceof Error ? fatal.message : String(fatal) };
    }
  };
`;

// ===== 1. grantRead Lambda =====
// Verifies: read probes pass, admin and use probes are denied.

const readFn = new lambda.Function(stack, 'GrantReadFn', {
  runtime: lambda.Runtime.NODEJS_LATEST,
  handler: 'index.handler',
  timeout: cdk.Duration.seconds(120),
  environment: {
    API_KEY_PROVIDER_ARN: apiKeyProvider.credentialProviderArn,
    OAUTH_PROVIDER_ARN: oauthProvider.credentialProviderArn,
    WORKLOAD_IDENTITY_ARN: workloadIdentity.workloadIdentityArn,
    EXPECTED_DENIED: JSON.stringify(['admin', 'use']),
  },
  code: lambda.Code.fromInline(`
    ${INLINE_HELPERS}
    ${INLINE_HANDLER_BODY}
  `),
});

apiKeyProvider.grantRead(readFn);
oauthProvider.grantRead(readFn);
workloadIdentity.grantRead(readFn);

// ===== 2. grantAdmin Lambda =====
// Verifies: read and admin probes pass (ADMIN_PERMS includes Get*), use probes are denied.

const adminFn = new lambda.Function(stack, 'GrantAdminFn', {
  runtime: lambda.Runtime.NODEJS_LATEST,
  handler: 'index.handler',
  timeout: cdk.Duration.seconds(120),
  environment: {
    API_KEY_PROVIDER_ARN: apiKeyProvider.credentialProviderArn,
    OAUTH_PROVIDER_ARN: oauthProvider.credentialProviderArn,
    WORKLOAD_IDENTITY_ARN: workloadIdentity.workloadIdentityArn,
    EXPECTED_DENIED: JSON.stringify(['use']),
  },
  code: lambda.Code.fromInline(`
    ${INLINE_HELPERS}
    ${INLINE_HANDLER_BODY}
  `),
});

apiKeyProvider.grantAdmin(adminFn);
oauthProvider.grantAdmin(adminFn);
workloadIdentity.grantAdmin(adminFn);

// ===== 3. grantFullAccess Lambda =====
// Verifies: all probes pass, nothing is denied.

const fullAccessFn = new lambda.Function(stack, 'GrantFullAccessFn', {
  runtime: lambda.Runtime.NODEJS_LATEST,
  handler: 'index.handler',
  timeout: cdk.Duration.seconds(120),
  environment: {
    API_KEY_PROVIDER_ARN: apiKeyProvider.credentialProviderArn,
    OAUTH_PROVIDER_ARN: oauthProvider.credentialProviderArn,
    WORKLOAD_IDENTITY_ARN: workloadIdentity.workloadIdentityArn,
    EXPECTED_DENIED: JSON.stringify([]),
  },
  code: lambda.Code.fromInline(`
    ${INLINE_HELPERS}
    ${INLINE_HANDLER_BODY}
  `),
});

apiKeyProvider.grantFullAccess(fullAccessFn);
oauthProvider.grantFullAccess(fullAccessFn);
workloadIdentity.grantFullAccess(fullAccessFn);

// ===== IntegTest with Lambda invoke assertions =====

const integTest = new integ.IntegTest(app, 'BedrockAgentCoreIdentityGrants', {
  testCases: [stack],
  regions: ['us-east-1'],
});

// Helper: invoke a Lambda and assert it reports no unexpected access results.
// Each Lambda returns { passed: boolean, ... } where passed means the actual
// access/denial pattern matches the expected pattern for that permission level.
// Retries up to 10 min with 30s intervals to allow IAM policy propagation.
function assertLambdaPasses(fn: lambda.Function) {
  const invoke = integTest.assertions.awsApiCall('Lambda', 'invoke', {
    FunctionName: fn.functionName,
    InvocationType: 'RequestResponse',
  });

  invoke.provider.addToRolePolicy({
    Effect: 'Allow',
    Action: ['lambda:InvokeFunction'],
    Resource: ['*'],
  });

  invoke.expect(
    integ.ExpectedResult.objectLike({
      Payload: Match.serializedJson(Match.objectLike({ passed: true })),
    }),
  ).waitForAssertions({
    interval: cdk.Duration.seconds(30),
    totalTimeout: cdk.Duration.minutes(10),
  });

  // The waiter's isCompleteProvider also needs invoke permission for retries
  if (invoke instanceof AwsApiCall) {
    invoke.waiterProvider?.addToRolePolicy({
      Effect: 'Allow',
      Action: ['lambda:InvokeFunction'],
      Resource: ['*'],
    });
  }
}

assertLambdaPasses(readFn);
assertLambdaPasses(adminFn);
assertLambdaPasses(fullAccessFn);

app.synth();
