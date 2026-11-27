import * as path from 'path';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { WebFunction, WebFunctionAuthType, WebFunctionCode, WebFunctionRuntime } from 'aws-cdk-lib/aws-lambda';

/**
 * Deploys two Python WebFunctions from the same package, which holds `main.py` (a WSGI callable
 * `app`) and `api.py` (an ASGI callable `application`):
 *
 * - one without `entryPoint`, which the runtime must serve from its default `main:app`;
 * - one with `entryPoint: 'api:application'`, which must be served from `api.py`.
 *
 * Each callable returns its own body, so a 200 carrying it shows which entry point the runtime
 * loaded. The endpoints use `IAM_AUTH`, and a helper Lambda signs the requests with SigV4.
 */
const app = new cdk.App({ analyticsReporting: false });
const stack = new cdk.Stack(app, 'WebFunctionPythonStack');

const HANDLER_PATH = path.join(__dirname, 'webfunction-python-handler');

const defaultEntryPoint = new WebFunction(stack, 'DefaultEntryPoint', {
  code: WebFunctionCode.fromAssetToManagedBucket(HANDLER_PATH),
  runtime: WebFunctionRuntime.PYTHON_3_15,
  defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
});

const customEntryPoint = new WebFunction(stack, 'CustomEntryPoint', {
  code: WebFunctionCode.fromAssetToManagedBucket(HANDLER_PATH),
  runtime: WebFunctionRuntime.PYTHON_3_15,
  defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
  entryPoint: 'api:application',
});

// Signs a GET to the given URL with SigV4 for the `lambda` service in its own Region, using
// the function's credentials, and returns the response status and body.
const signer = new lambda.Function(stack, 'Signer', {
  runtime: lambda.Runtime.NODEJS_22_X,
  handler: 'index.handler',
  timeout: cdk.Duration.seconds(30),
  code: lambda.Code.fromInline(`
const crypto = require('crypto');
const https = require('https');
const hash = (data) => crypto.createHash('sha256').update(data).digest('hex');
const hmac = (key, data) => crypto.createHmac('sha256', key).update(data).digest();
exports.handler = async ({ url }) => {
  const { hostname, pathname } = new URL(url);
  const region = process.env.AWS_REGION;
  const service = 'lambda';
  const amzDate = new Date().toISOString().replace(/[:-]|\\.\\d{3}/g, '');
  const date = amzDate.slice(0, 8);
  const payloadHash = hash('');
  const headers = {
    'host': hostname,
    'x-amz-content-sha256': payloadHash,
    'x-amz-date': amzDate,
    'x-amz-security-token': process.env.AWS_SESSION_TOKEN,
  };
  const names = Object.keys(headers).sort();
  const canonical = ['GET', pathname || '/', '', ...names.map((n) => n + ':' + headers[n]), '', names.join(';'), payloadHash].join('\\n');
  const scope = date + '/' + region + '/' + service + '/aws4_request';
  const toSign = ['AWS4-HMAC-SHA256', amzDate, scope, hash(canonical)].join('\\n');
  let key = hmac('AWS4' + process.env.AWS_SECRET_ACCESS_KEY, date);
  for (const part of [region, service, 'aws4_request']) { key = hmac(key, part); }
  const signature = crypto.createHmac('sha256', key).update(toSign).digest('hex');
  headers.authorization = 'AWS4-HMAC-SHA256 Credential=' + process.env.AWS_ACCESS_KEY_ID + '/' + scope +
    ', SignedHeaders=' + names.join(';') + ', Signature=' + signature;
  const { status, body } = await new Promise((resolve, reject) => {
    https.get({ hostname, path: pathname || '/', headers }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    }).on('error', reject);
  });
  return { status, body };
};
`),
});

for (const webFunction of [defaultEntryPoint, customEntryPoint]) {
  // An ArnPrincipal has no policy CDK can add to, so the grant lands in the function's
  // resource policy.
  webFunction.endpoint.grants.invoke(new iam.ArnPrincipal(signer.role!.roleArn));
}

const testCase = new integ.IntegTest(app, 'WebFunctionPythonTest', {
  testCases: [stack],
  diffAssets: false,
});

for (const [webFunction, entry] of [[defaultEntryPoint, 'main'], [customEntryPoint, 'api']] as const) {
  testCase.assertions
    .invokeFunction({
      functionName: signer.functionName,
      payload: JSON.stringify({ url: `https://${webFunction.endpoint.domainName}/` }),
    })
    .expect(integ.ExpectedResult.objectLike({
      Payload: JSON.stringify({ status: 200, body: entry }),
    }));
}
