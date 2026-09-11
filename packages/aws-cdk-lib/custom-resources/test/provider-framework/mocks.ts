
import type { OutgoingHttpHeaders } from 'http';
import type * as https from 'https';
import { parse as urlparse } from 'url';
import type { InvocationResponse, InvokeCommandInput } from '@aws-sdk/client-lambda';
import type { StartExecutionCommandInput, StartExecutionInput } from '@aws-sdk/client-sfn';
import type { DeleteParameterCommandInput, GetParameterCommandInput, PutParameterCommandInput } from '@aws-sdk/client-ssm';
import * as consts from '../../lib/provider-framework/runtime/consts';

export const MOCK_REQUEST = {
  ResponseURL: 'http://pre-signed-S3-url-for-response/path/in/bucket',
  LogicalResourceId: 'MyTestResource',
  RequestId: 'uniqueid-for-this-create-request',
  StackId: 'arn:aws:cloudformation:us-west-2:123456789012:stack/stack-name/guid',
};

export const MOCK_ON_EVENT_FUNCTION_ARN = 'arn:lambda:user:on:event';
export const MOCK_IS_COMPLETE_FUNCTION_ARN = 'arn:lambda:user:is:complete';
export const MOCK_SFN_ARN = 'arn:of:state:machine';
export const MOCK_RESPONSE_URL_PARAMETER_PREFIX = '/cdk/custom-resource-provider/mockprovideraddr';

export let stringifyPayload = true;
export let onEventImplMock: AWSCDKAsyncCustomResource.OnEventHandler | undefined;
export let isCompleteImplMock: AWSCDKAsyncCustomResource.IsCompleteHandler | undefined;
export let startStateMachineInput: StartExecutionCommandInput | undefined;
export let cfnResponse: AWSLambda.CloudFormationCustomResourceResponse;

/** In-memory stand-in for SSM Parameter Store. */
export let parameterStore: Record<string, string>;

export function setup() {
  process.env[consts.WAITER_STATE_MACHINE_ARN_ENV] = MOCK_SFN_ARN;
  process.env[consts.RESPONSE_URL_PARAMETER_PREFIX_ENV] = MOCK_RESPONSE_URL_PARAMETER_PREFIX;

  stringifyPayload = true;
  onEventImplMock = undefined;
  isCompleteImplMock = undefined;
  cfnResponse = {} as any;
  startStateMachineInput = undefined;
  parameterStore = {};
}

export async function putParameterMock(req: PutParameterCommandInput): Promise<void> {
  if (!req.Name || !req.Value) {
    throw new Error('putParameter requires both Name and Value');
  }
  if (parameterStore[req.Name] !== undefined && !req.Overwrite) {
    throw new Error(`parameter "${req.Name}" already exists`);
  }
  parameterStore[req.Name] = req.Value;
}

export async function getParameterMock(req: GetParameterCommandInput): Promise<string | undefined> {
  return parameterStore[req.Name!];
}

export async function deleteParameterMock(req: DeleteParameterCommandInput): Promise<void> {
  if (parameterStore[req.Name!] === undefined) {
    throw new Error(`parameter "${req.Name}" not found`);
  }
  delete parameterStore[req.Name!];
}

export async function httpRequestMock(options: https.RequestOptions, body: string) {
  const responseUrl = urlparse(MOCK_REQUEST.ResponseURL);

  expect(options.method).toEqual('PUT');
  expect(options.path).toEqual(responseUrl.path);
  expect(options.hostname).toEqual(responseUrl.hostname);
  const headers = options.headers || {};
  expect((headers as OutgoingHttpHeaders)['content-length']).toEqual(body.length);
  expect((headers as OutgoingHttpHeaders)['content-type']).toStrictEqual('');
  cfnResponse = JSON.parse(body);

  if (!cfnResponse) { throw new Error('unexpected'); }

  // we always expect a physical resource id
  expect(cfnResponse.PhysicalResourceId).toBeTruthy();

  // we always expect a reason
  expect(cfnResponse.Reason).toBeTruthy();

  expect(cfnResponse.LogicalResourceId).toEqual(MOCK_REQUEST.LogicalResourceId);
  expect(cfnResponse.RequestId).toEqual(MOCK_REQUEST.RequestId);
  expect(cfnResponse.StackId).toEqual(MOCK_REQUEST.StackId);
  expect(cfnResponse.Status === 'FAILED' || cfnResponse.Status === 'SUCCESS').toBeTruthy();
}

export async function invokeFunctionMock(req: InvokeCommandInput): Promise<InvocationResponse> {
  if (!req.Payload || typeof (req.Payload) !== 'string') {
    throw new Error(`invalid payload of type ${typeof (req.Payload)}}`);
  }

  const input = JSON.parse(req.Payload);

  try {
    let ret;
    switch (req.FunctionName) {
      case MOCK_ON_EVENT_FUNCTION_ARN:
        if (!onEventImplMock) {
          throw new Error('Trying to trigger "onEvent" but it is not implemented');
        }
        ret = await onEventImplMock(input as AWSCDKAsyncCustomResource.OnEventRequest);
        break;

      case MOCK_IS_COMPLETE_FUNCTION_ARN:
        if (!isCompleteImplMock) {
          throw new Error('Trying to trigger "isComplete" but it is not implemented');
        }
        ret = await isCompleteImplMock(input as AWSCDKAsyncCustomResource.IsCompleteRequest);
        break;

      default:
        throw new Error('unknown mock function');
    }

    return {
      Payload: ret
        ? new TextEncoder().encode(typeof ret !== 'string' ? JSON.stringify(ret) : ret)
        // handle undefined explicitly for mocks so we don't encode it
        : undefined,
    };
  } catch (e: any) {
    return {
      FunctionError: 'Unhandled',
      Payload: new TextEncoder().encode(JSON.stringify({
        errorType: e.name,
        errorMessage: e.message,
        trace: [
          'AccessDenied: Access Denied',
          '    at Request.extractError (/var/runtime/node_modules/aws-sdk/lib/services/s3.js:585:35)',
          '    at Request.callListeners (/var/runtime/node_modules/aws-sdk/lib/sequential_executor.js:106:20)',
          '    at Request.emit (/var/runtime/node_modules/aws-sdk/lib/sequential_executor.js:78:10)',
          '    at Request.emit (/var/runtime/node_modules/aws-sdk/lib/request.js:683:14)',
          '    at Request.transition (/var/runtime/node_modules/aws-sdk/lib/request.js:22:10)',
          '    at AcceptorStateMachine.runTo (/var/runtime/node_modules/aws-sdk/lib/state_machine.js:14:12)',
          '    at /var/runtime/node_modules/aws-sdk/lib/state_machine.js:26:10',
          '    at Request.<anonymous> (/var/runtime/node_modules/aws-sdk/lib/request.js:38:9)',
          '    at Request.<anonymous> (/var/runtime/node_modules/aws-sdk/lib/request.js:685:12)',
          '    at Request.callListeners (/var/runtime/node_modules/aws-sdk/lib/sequential_executor.js:116:18)',
        ],
      })),
    };
  }
}

export function prepareForExecution() {
  startStateMachineInput = undefined;

  if (onEventImplMock) {
    process.env[consts.USER_ON_EVENT_FUNCTION_ARN_ENV] = MOCK_ON_EVENT_FUNCTION_ARN;
  } else {
    delete process.env[consts.USER_ON_EVENT_FUNCTION_ARN_ENV];
  }

  if (isCompleteImplMock) {
    process.env[consts.USER_IS_COMPLETE_FUNCTION_ARN_ENV] = MOCK_IS_COMPLETE_FUNCTION_ARN;
  } else {
    delete process.env[consts.USER_IS_COMPLETE_FUNCTION_ARN_ENV];
  }
}

export async function startExecutionMock(req: StartExecutionInput) {
  startStateMachineInput = req;
  expect(req.stateMachineArn).toEqual(MOCK_SFN_ARN);
  expect(req.name).toBeUndefined();
  return {
    executionArn: req.stateMachineArn + '/execution',
    startDate: new Date(),
  };
}
