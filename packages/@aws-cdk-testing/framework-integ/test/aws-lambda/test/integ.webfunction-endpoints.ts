import * as path from 'path';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import {
  WebFunction,
  WebFunctionAuthType,
  WebFunctionCode,
  WebFunctionEndpointLocation,
  WebFunctionRuntime,
} from 'aws-cdk-lib/aws-lambda';

/**
 * Deploys the endpoint features that only the service can accept or reject:
 *
 * - an `IAM_AUTH` endpoint reached by a caller whose only permission is the statement
 *   `grants.invoke()` adds to the function's resource policy. A helper Lambda signs a request
 *   with SigV4, including `X-Amz-Content-SHA256`, and must get a 200;
 * - a `MULTI_REGION` and a `PER_REGION` endpoint added with `addEndpoint()`, which must be
 *   created and reject an unsigned request with 403.
 */
const app = new cdk.App({ analyticsReporting: false });
const stack = new cdk.Stack(app, 'WebFunctionEndpointsStack');

const webFunction = new WebFunction(stack, 'Function', {
  code: WebFunctionCode.fromAssetToManagedBucket(path.join(__dirname, 'webfunction-ok-handler')),
  runtime: WebFunctionRuntime.NODEJS_24_X,
  defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
});

const multiRegion = webFunction.addEndpoint('MultiRegion', {
  authType: WebFunctionAuthType.IAM_AUTH,
  endpointLocation: WebFunctionEndpointLocation.multiRegion(['us-east-1']),
});
const perRegion = webFunction.addEndpoint('PerRegion', {
  authType: WebFunctionAuthType.IAM_AUTH,
  endpointLocation: WebFunctionEndpointLocation.perRegion(['us-east-1']),
});

// Signs a GET to the given URL with SigV4 for the `lambda` service in its own Region, using
// the function's credentials, and returns the response status.
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
  const status = await new Promise((resolve, reject) => {
    https.get({ hostname, path: pathname || '/', headers }, (res) => { res.resume(); resolve(res.statusCode); })
      .on('error', reject);
  });
  return { status };
};
`),
});

// An ArnPrincipal has no policy CDK can add to, so the grant lands in the function's
// resource policy: the signer's own role has no permission on the endpoint.
webFunction.endpoint.grants.invoke(new iam.ArnPrincipal(signer.role!.roleArn));

const testCase = new integ.IntegTest(app, 'WebFunctionEndpointsTest', {
  testCases: [stack],
  diffAssets: false,
});

testCase.assertions
  .invokeFunction({
    functionName: signer.functionName,
    payload: JSON.stringify({ url: `https://${webFunction.endpoint.domainName}/` }),
  })
  .expect(integ.ExpectedResult.objectLike({ Payload: '{"status":200}' }));

for (const endpoint of [multiRegion, perRegion]) {
  testCase.assertions
    .httpApiCall(`https://${endpoint.domainName}/`)
    .expect(integ.ExpectedResult.objectLike({ status: 403 }));
}
