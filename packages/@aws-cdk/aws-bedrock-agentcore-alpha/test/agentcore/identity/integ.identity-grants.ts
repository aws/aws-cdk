/**
 * Integration test: Identity grant methods (grantRead, grantAdmin, grantFullAccess)
 * for WorkloadIdentity, ApiKeyCredentialProvider, and OAuth2CredentialProvider.
 *
 * Each Lambda function is granted a specific permission scope and then invoked to verify
 * that the IAM policies produced by the grant helpers actually allow the expected API calls.
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
// Embedded into every Lambda to avoid an external layer / asset.

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
    return name.includes('AccessDenied') || message.includes('AccessDenied') || message.includes('not authorized');
  }
`;

// ===== 1. grantRead Lambda =====

const readFn = new lambda.Function(stack, 'GrantReadFn', {
  functionName: 'integ-identity-grants-read',
  runtime: lambda.Runtime.NODEJS_22_X,
  handler: 'index.handler',
  timeout: cdk.Duration.seconds(120),
  environment: {
    API_KEY_PROVIDER_ARN: apiKeyProvider.credentialProviderArn,
    OAUTH_PROVIDER_ARN: oauthProvider.credentialProviderArn,
    WORKLOAD_IDENTITY_ARN: workloadIdentity.workloadIdentityArn,
  },
  code: lambda.Code.fromInline(`
    ${INLINE_HELPERS}

    exports.handler = async () => {
      try {
        var sdk = await import('@aws-sdk/client-bedrock-agentcore-control');
        var client = new sdk.BedrockAgentCoreControlClient({});
        var results = [];
        var failures = [];

        var probes = [
          { type: 'api_key_provider', cmd: new sdk.GetApiKeyCredentialProviderCommand({ name: nameFromArn(process.env.API_KEY_PROVIDER_ARN) }) },
          { type: 'oauth_provider',   cmd: new sdk.GetOauth2CredentialProviderCommand({ name: nameFromArn(process.env.OAUTH_PROVIDER_ARN) }) },
          { type: 'workload_identity', cmd: new sdk.GetWorkloadIdentityCommand({ name: nameFromArn(process.env.WORKLOAD_IDENTITY_ARN) }) },
        ];

        for (var p of probes) {
          try {
            await client.send(p.cmd);
            results.push({ type: p.type, status: 'read_succeeded' });
          } catch (error) {
            failures.push({ type: p.type, error: error instanceof Error ? error.message : String(error) });
          }
        }

        return { results: results, failures: failures, passed: failures.length === 0 };
      } catch (fatal) {
        return { results: [], failures: [{ type: 'fatal', error: fatal instanceof Error ? fatal.message : String(fatal) }], passed: false };
      }
    };
  `),
});

apiKeyProvider.grantRead(readFn);
oauthProvider.grantRead(readFn);
workloadIdentity.grantRead(readFn);

// ===== 2. grantAdmin Lambda =====

const adminFn = new lambda.Function(stack, 'GrantAdminFn', {
  functionName: 'integ-identity-grants-admin',
  runtime: lambda.Runtime.NODEJS_22_X,
  handler: 'index.handler',
  timeout: cdk.Duration.seconds(120),
  environment: {
    API_KEY_PROVIDER_ARN: apiKeyProvider.credentialProviderArn,
    OAUTH_PROVIDER_ARN: oauthProvider.credentialProviderArn,
    WORKLOAD_IDENTITY_ARN: workloadIdentity.workloadIdentityArn,
  },
  code: lambda.Code.fromInline(`
    ${INLINE_HELPERS}

    exports.handler = async () => {
      try {
        var sdk = await import('@aws-sdk/client-bedrock-agentcore-control');
        var client = new sdk.BedrockAgentCoreControlClient({});
        var results = [];
        var failures = [];

        var probes = [
          {
            type: 'api_key_provider',
            cmd: new sdk.UpdateApiKeyCredentialProviderCommand({
              name: nameFromArn(process.env.API_KEY_PROVIDER_ARN),
              apiKey: 'integ-placeholder-api-key',
            }),
          },
          {
            type: 'oauth_provider',
            cmd: new sdk.UpdateOauth2CredentialProviderCommand({
              name: nameFromArn(process.env.OAUTH_PROVIDER_ARN),
              credentialProviderVendor: 'GithubOauth2',
              oauth2ProviderConfigInput: {
                githubOauth2ProviderConfig: {
                  clientId: 'integ-github-client-id',
                  clientSecret: 'integ-github-client-secret',
                },
              },
            }),
          },
          {
            type: 'workload_identity',
            cmd: new sdk.UpdateWorkloadIdentityCommand({
              name: nameFromArn(process.env.WORKLOAD_IDENTITY_ARN),
            }),
          },
        ];

        for (var p of probes) {
          try {
            await client.send(p.cmd);
            results.push({ type: p.type, status: 'admin_succeeded' });
          } catch (error) {
            if (isAccessDenied(error)) {
              failures.push({ type: p.type, error: error instanceof Error ? error.message : String(error) });
            } else {
              results.push({ type: p.type, status: 'admin_authorized_non_access_error', error: error instanceof Error ? error.message : String(error) });
            }
          }
        }

        return { results: results, failures: failures, passed: failures.length === 0 };
      } catch (fatal) {
        return { results: [], failures: [{ type: 'fatal', error: fatal instanceof Error ? fatal.message : String(fatal) }], passed: false };
      }
    };
  `),
});

apiKeyProvider.grantAdmin(adminFn);
oauthProvider.grantAdmin(adminFn);
workloadIdentity.grantAdmin(adminFn);

// ===== 3. grantFullAccess Lambda =====
// Tests read, admin, and use (data-plane) permissions in one function.
// Mirrors the pattern from the proven local integration test.

const fullAccessFn = new lambda.Function(stack, 'GrantFullAccessFn', {
  functionName: 'integ-identity-grants-full-access',
  runtime: lambda.Runtime.NODEJS_22_X,
  handler: 'index.handler',
  timeout: cdk.Duration.seconds(120),
  environment: {
    API_KEY_PROVIDER_ARN: apiKeyProvider.credentialProviderArn,
    OAUTH_PROVIDER_ARN: oauthProvider.credentialProviderArn,
    WORKLOAD_IDENTITY_ARN: workloadIdentity.workloadIdentityArn,
  },
  code: lambda.Code.fromInline(`
    ${INLINE_HELPERS}

    exports.handler = async () => {
      try {
        var controlSdk = await import('@aws-sdk/client-bedrock-agentcore-control');
        var runtimeSdk = await import('@aws-sdk/client-bedrock-agentcore');
        var controlClient = new controlSdk.BedrockAgentCoreControlClient({});
        var runtimeClient = new runtimeSdk.BedrockAgentCoreClient({});

        var apiKeyName = nameFromArn(process.env.API_KEY_PROVIDER_ARN);
        var oauthName  = nameFromArn(process.env.OAUTH_PROVIDER_ARN);
        var workloadName = nameFromArn(process.env.WORKLOAD_IDENTITY_ARN);

        var results = [];
        var failures = [];

        // Mint a workload access token (data-plane) — needed for credential retrieval probes
        var workloadIdentityToken = '';
        try {
          var tokenResp = await runtimeClient.send(
            new runtimeSdk.GetWorkloadAccessTokenCommand({ workloadName: workloadName }),
          );
          workloadIdentityToken = tokenResp.workloadAccessToken || '';
          results.push({ type: 'use_get_workload_access_token', status: 'full_access_succeeded' });
        } catch (tokenErr) {
          if (isAccessDenied(tokenErr)) {
            failures.push({ type: 'use_get_workload_access_token', error: tokenErr instanceof Error ? tokenErr.message : String(tokenErr) });
          } else {
            results.push({ type: 'use_get_workload_access_token', status: 'authorized_non_access_error', error: tokenErr instanceof Error ? tokenErr.message : String(tokenErr) });
          }
        }

        var probes = [
          { type: 'read_api_key',           cmd: new controlSdk.GetApiKeyCredentialProviderCommand({ name: apiKeyName }), client: controlClient },
          { type: 'read_workload_identity', cmd: new controlSdk.GetWorkloadIdentityCommand({ name: workloadName }),       client: controlClient },
          {
            type: 'admin_oauth',
            cmd: new controlSdk.UpdateOauth2CredentialProviderCommand({
              name: oauthName,
              credentialProviderVendor: 'GithubOauth2',
              oauth2ProviderConfigInput: {
                githubOauth2ProviderConfig: {
                  clientId: 'integ-github-client-id',
                  clientSecret: 'integ-github-client-secret',
                },
              },
            }),
            client: controlClient,
          },
          {
            type: 'use_api_key',
            cmd: new runtimeSdk.GetResourceApiKeyCommand({
              resourceCredentialProviderName: apiKeyName,
              workloadIdentityToken: workloadIdentityToken,
            }),
            client: runtimeClient,
          },
        ];

        for (var p of probes) {
          try {
            await p.client.send(p.cmd);
            results.push({ type: p.type, status: 'full_access_succeeded' });
          } catch (error) {
            if (isAccessDenied(error)) {
              failures.push({ type: p.type, error: error instanceof Error ? error.message : String(error) });
            } else {
              results.push({ type: p.type, status: 'authorized_non_access_error', error: error instanceof Error ? error.message : String(error) });
            }
          }
        }

        return { results: results, failures: failures, passed: failures.length === 0 };
      } catch (fatal) {
        return { results: [], failures: [{ type: 'fatal', error: fatal instanceof Error ? fatal.message : String(fatal) }], passed: false };
      }
    };
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

// Helper: invoke a Lambda and assert it reports no access-denied failures.
// Lambda invoke returns Payload as a serialized JSON string; Match.serializedJson
// instructs the assertion handler to parse it before matching.
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
