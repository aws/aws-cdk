import * as path from 'path';
import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { WebFunction, WebFunctionAuthType, WebFunctionCode, WebFunctionRuntime } from 'aws-cdk-lib/aws-lambda';

/**
 * Deploys two Python WebFunctions from the same package, which holds `main.py` (callable `app`)
 * and `api.py` (callable `application`):
 *
 * - one without `entryPoint`, which the runtime must serve from its default `main:app`;
 * - one with `entryPoint: 'api:application'`, which must be served from `api.py`.
 *
 * Each callable returns its own body, so a 200 carrying it shows which entry point the runtime
 * loaded.
 */
const app = new cdk.App({ analyticsReporting: false });
const stack = new cdk.Stack(app, 'WebFunctionPythonStack');

const HANDLER_PATH = path.join(__dirname, 'webfunction-python-handler');

// The assertions below have to reach the handlers, and integ-tests cannot sign requests.
// The handlers only return a fixed body, and the stack is torn down after the test.
const defaultEntryPoint = new WebFunction(stack, 'DefaultEntryPoint', {
  code: WebFunctionCode.fromAssetToManagedBucket(HANDLER_PATH),
  runtime: WebFunctionRuntime.PYTHON_3_15,
  defaultEndpointAuth: WebFunctionAuthType.APPLICATION_MANAGED,
});

const customEntryPoint = new WebFunction(stack, 'CustomEntryPoint', {
  code: WebFunctionCode.fromAssetToManagedBucket(HANDLER_PATH),
  runtime: WebFunctionRuntime.PYTHON_3_15,
  defaultEndpointAuth: WebFunctionAuthType.APPLICATION_MANAGED,
  entryPoint: 'api:application',
});

const testCase = new integ.IntegTest(app, 'WebFunctionPythonTest', {
  testCases: [stack],
  diffAssets: false,
});

testCase.assertions
  .httpApiCall(`https://${defaultEntryPoint.endpoint.domainName}/`)
  .expect(integ.ExpectedResult.objectLike({ status: 200, body: { entry: 'main' } }));

testCase.assertions
  .httpApiCall(`https://${customEntryPoint.endpoint.domainName}/`)
  .expect(integ.ExpectedResult.objectLike({ status: 200, body: { entry: 'api' } }));
