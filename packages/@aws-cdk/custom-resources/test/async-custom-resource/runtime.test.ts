// tslint:disable: no-console
// tslint:disable: max-line-length
import AWS = require('aws-sdk');
import https = require('https');
import { parse as urlparse } from 'url';
import consts = require('../../lib/async-custom-resource/runtime/consts');
import handler = require('../../lib/async-custom-resource/runtime/index');
import outbound = require('../../lib/async-custom-resource/runtime/outbound');
import util = require('../../lib/async-custom-resource/runtime/util');
import { Retry } from '../../lib/async-custom-resource/runtime/util';

util.includeStackTraces = false;

const MOCK_ON_EVENT_FUNCTION_ARN = 'arn:lambda:user:on:event';
const MOCK_IS_COMPLETE_FUNCTION_ARN = 'arn:lambda:user:is:complete';

const MOCK_REQUEST = {
  ResponseURL: "http://pre-signed-S3-url-for-response/path/in/bucket",
  LogicalResourceId: 'MyTestResource',
  RequestId: "uniqueid-for-this-create-request",
  StackId: 'arn:aws:cloudformation:us-west-2:123456789012:stack/stack-name/guid',
};

const MOCK_PHYSICAL_ID = 'mock-physical-resource-id';
const MOCK_SFN_ARN = 'arn:of:state:machine';
const MOCK_PROPS = { Name: "Value", List: ["1", "2", "3"], ServiceToken: 'bla' };
const MOCK_ATTRS = { MyAttribute: 'my-mock-attribute' };

let onEventMock: AWSCDKAsyncCustomResource.OnEventHandler;
let isCompleteMock: AWSCDKAsyncCustomResource.IsCompleteHandler;
let startStateMachineInput: AWS.StepFunctions.StartExecutionInput | undefined;

// mock http requests
let cfnResponse: AWSLambda.CloudFormationCustomResourceResponse;
outbound.httpRequest = async (options: https.RequestOptions, body: string) => {
  const responseUrl = urlparse(MOCK_REQUEST.ResponseURL);

  expect(options.method).toEqual('PUT');
  expect(options.path).toEqual(responseUrl.path);
  expect(options.hostname).toEqual(responseUrl.hostname);
  const headers = options.headers || {};
  expect(headers['content-length']).toEqual(body.length);
  expect(headers['content-type']).toStrictEqual("");
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
};

outbound.invokeFunction = async (req: AWS.Lambda.InvocationRequest): Promise<AWS.Lambda.InvocationResponse> => {
  if (!req.Payload || typeof (req.Payload) !== 'string') {
    throw new Error(`invalid payload of type ${typeof (req.Payload)}}`);
  }

  const input = JSON.parse(req.Payload);

  try {

    let ret;
    switch (req.FunctionName) {
      case MOCK_ON_EVENT_FUNCTION_ARN:
        ret = await onEventMock(input as AWSCDKAsyncCustomResource.OnEventRequest);
        break;

      case MOCK_IS_COMPLETE_FUNCTION_ARN:
        ret = await isCompleteMock(input as AWSCDKAsyncCustomResource.IsCompleteRequest);
        break;

      default:
        throw new Error(`unknown mock function`);
    }

    return {
      Payload: JSON.stringify(ret)
    };
  } catch (e) {
    return {
      FunctionError: 'Unhandled',
      Payload: JSON.stringify({
        errorType: e.name,
        errorMessage: e.message,
        trace: [
          "AccessDenied: Access Denied",
          "    at Request.extractError (/var/runtime/node_modules/aws-sdk/lib/services/s3.js:585:35)",
          "    at Request.callListeners (/var/runtime/node_modules/aws-sdk/lib/sequential_executor.js:106:20)",
          "    at Request.emit (/var/runtime/node_modules/aws-sdk/lib/sequential_executor.js:78:10)",
          "    at Request.emit (/var/runtime/node_modules/aws-sdk/lib/request.js:683:14)",
          "    at Request.transition (/var/runtime/node_modules/aws-sdk/lib/request.js:22:10)",
          "    at AcceptorStateMachine.runTo (/var/runtime/node_modules/aws-sdk/lib/state_machine.js:14:12)",
          "    at /var/runtime/node_modules/aws-sdk/lib/state_machine.js:26:10",
          "    at Request.<anonymous> (/var/runtime/node_modules/aws-sdk/lib/request.js:38:9)",
          "    at Request.<anonymous> (/var/runtime/node_modules/aws-sdk/lib/request.js:685:12)",
          "    at Request.callListeners (/var/runtime/node_modules/aws-sdk/lib/sequential_executor.js:116:18)"
        ]
      })
    };
  }
};

beforeEach(() => {
  cfnResponse = {} as any;

  process.env[consts.ENV_USER_IS_COMPLETE_FUNCTION_ARN] = MOCK_IS_COMPLETE_FUNCTION_ARN;
  process.env[consts.ENV_USER_ON_EVENT_FUNCTION_ARN] = MOCK_ON_EVENT_FUNCTION_ARN;
  process.env[consts.ENV_WAITER_STATE_MACHINE_ARN] = MOCK_SFN_ARN;

  onEventMock = () => { throw new Error('"onEvent" not implemented'); };
  isCompleteMock = () => { throw new Error('"isComplete" not implemented'); };

  startStateMachineInput = undefined;
  outbound.startExecution = async (req: AWS.StepFunctions.StartExecutionInput) => {
    startStateMachineInput = req;
    expect(req.stateMachineArn).toEqual(MOCK_SFN_ARN);
    return {
      executionArn: req.stateMachineArn + '/execution',
      startDate: new Date(),
    };
  };
});

afterEach(() => {
  delete process.env[consts.ENV_USER_IS_COMPLETE_FUNCTION_ARN];
  delete process.env[consts.ENV_USER_ON_EVENT_FUNCTION_ARN];
  delete process.env[consts.ENV_WAITER_STATE_MACHINE_ARN];
});

test('synchronous flow (isComplete immediately returns true): waiter state machine is not triggered', async () => {
  // GIVEN
  let isCompleteCalls = 0;

  onEventMock = async event => {
    expect(event.RequestType).toEqual('Create');
    expect(event.ResourceProperties).toStrictEqual(MOCK_PROPS);
    expect(event.PhysicalResourceId).toBeUndefined(); // physical ID in CREATE

    return {
      PhysicalResourceId: MOCK_PHYSICAL_ID,
      Data: MOCK_ATTRS
    };
  };

  isCompleteMock = async event => {
    isCompleteCalls++;
    expect(event.PhysicalResourceId).toEqual(MOCK_PHYSICAL_ID); // physical ID returned from onEvent is passed to "isComplete"
    expect(event.Data).toStrictEqual(MOCK_ATTRS); // attributes are propagated between the calls

    return {
      IsComplete: true,
      Data: {
        Additional: 'attribute' // additional attributes can be returned from "isComplete"
      }
    };
  };

  // WHEN
  await invokeMainHandler({
    RequestType: 'Create',
    ResourceProperties: MOCK_PROPS
  });

  // THEN
  expect(isCompleteCalls).toEqual(1); // we expect "isComplete" to be called immediately
  expectNoWaiter();
  expectCloudFormationSuccess({
    PhysicalResourceId: MOCK_PHYSICAL_ID,
    Data: {
      ...MOCK_ATTRS,
      Additional: 'attribute'
    }
  });
});

test('async flow: isComplete returns true only after 3 times', async () => {
  let isCompleteCalls = 0;

  onEventMock = async event => {
    expect(event.RequestType).toEqual('Create');
    expect(event.ResourceProperties).toStrictEqual(MOCK_PROPS);
    expect(event.PhysicalResourceId).toBeUndefined(); // physical ID in CREATE

    return {
      PhysicalResourceId: MOCK_PHYSICAL_ID,
      Data: MOCK_ATTRS
    };
  };

  isCompleteMock = async event => {
    isCompleteCalls++;
    expect(event.PhysicalResourceId).toEqual(MOCK_PHYSICAL_ID); // physical ID returned from onEvent is passed to "isComplete"
    expect(event.Data).toStrictEqual(MOCK_ATTRS); // attributes are propagated between the calls

    const result = isCompleteCalls === 3;
    if (!result) {
      return {
        IsComplete: false
      };
    }

    return {
      IsComplete: true,
      Data: {
        Additional: 'attribute' // additional attributes can be returned from "isComplete"
      }
    };
  };

  // WHEN
  await invokeMainHandler({
    RequestType: 'Create',
    ResourceProperties: MOCK_PROPS
  });

  // THEN

  // simulate the state machine
  await simulateWaiterAndExpect({
    ServiceToken: "SERVICE-TOKEN",
    ResponseURL: "http://pre-signed-S3-url-for-response/path/in/bucket",
    StackId: "arn:aws:cloudformation:us-west-2:123456789012:stack/stack-name/guid",
    RequestId: "uniqueid-for-this-create-request",
    ResourceType: "Custom::TestResource",
    LogicalResourceId: "MyTestResource",
    RequestType: "Create",
    ResourceProperties: { Name: "Value", List: ["1", "2", "3"], ServiceToken: "bla" },
    PhysicalResourceId: "mock-physical-resource-id",
    Data: { MyAttribute: "my-mock-attribute" }
  });

  expect(isCompleteCalls).toEqual(3);

  expectCloudFormationSuccess({
    PhysicalResourceId: MOCK_PHYSICAL_ID,
    Data: {
      ...MOCK_ATTRS,
      Additional: 'attribute'
    },
  });
});

test('isComplete throws synchronously (in the first invocation)', async () => {
  // GIVEN
  onEventMock = async () => ({ PhysicalResourceId: MOCK_PHYSICAL_ID, });
  isCompleteMock = async () => { throw new Error('Some failure'); };

  // WHEN
  await invokeMainHandler({
    RequestType: 'Create',
    ResourceProperties: MOCK_PROPS
  });

  expectNoWaiter();
  expectCloudFormationFailed('Some failure');
});

test('fails gracefully if "onEvent" throws an error', async () => {
  // GIVEN
  onEventMock = async () => { throw new Error('error thrown during onEvent'); };
  isCompleteMock = async () => ({ IsComplete: true });

  // WHEN
  await invokeMainHandler({
    RequestType: 'Create'
  });

  // THEN
  expectCloudFormationFailed('error thrown during onEvent');
  expectNoWaiter();
});

describe('Physical IDs', () => {

  describe('must be returned from all operations', () => {

    test('CREATE', async () => {
      // WHEN
      onEventMock = async () => ({ Data: { a: 123 } } as any);

      // THEN
      await invokeMainHandler({
        RequestType: 'Create'
      });

      expectCloudFormationFailed('onEvent response must include a PhysicalResourceId for all request types');
    });

    test('UPDATE', async () => {
      // WHEN
      onEventMock = async () => ({ Data: { a: 123 } } as any);

      // THEN
      await invokeMainHandler({
        PhysicalResourceId: 'Boom',
        RequestType: 'Update'
      });

      expectCloudFormationFailed('onEvent response must include a PhysicalResourceId for all request types');
    });

    test('DELETE', async () => {
      // WHEN
      onEventMock = async () => ({ Data: { a: 123 } } as any);

      // THEN
      await invokeMainHandler({
        PhysicalResourceId: 'Boom',
        RequestType: 'Delete'
      });

      expectCloudFormationFailed('onEvent response must include a PhysicalResourceId for all request types');
    });

  });

  test('UPDATE: can change the physical ID by returning a new ID', async () => {
    // GIVEN
    onEventMock = async () => ({ PhysicalResourceId: 'NewPhysicalId' });
    isCompleteMock = async () => ({ IsComplete: true });

    // WHEN
    await invokeMainHandler({
      RequestType: 'Update',
      PhysicalResourceId: 'CurrentPhysicalId'
    });

    // THEN
    expectNoWaiter();
    expectCloudFormationSuccess({
      PhysicalResourceId: 'NewPhysicalId'
    });
  });

  test('DELETE: cannot change the physical resource ID during a delete', async () => {
    // GIVEN
    onEventMock = async () => ({ PhysicalResourceId: 'NewPhysicalId' });
    isCompleteMock = async () => ({ IsComplete: true });

    // WHEN
    await invokeMainHandler({
      RequestType: 'Delete',
      PhysicalResourceId: 'CurrentPhysicalId'
    });

    // THEN
    expectNoWaiter();
    expectCloudFormationFailed('DELETE: cannot change the physical resource ID from "CurrentPhysicalId" to "NewPhysicalId" during deletion');
  });

  test('main handler fails if UPDATE is called without a physical resource id', async () => {
    // GIVEN
    onEventMock = async () => undefined;
    isCompleteMock = async () => ({ IsComplete: false });

    // WHEN
    await invokeMainHandler({
      RequestType: 'Update',
      PhysicalResourceId: undefined
    });

    // THEN
    expectCloudFormationFailed('Invalid CloudFormation custom resource event (Update): PhysicalResourceId is required for \"Update\" and \"Delete\" events');
  });

  test('main handler fails if DELETE is called without a physical resource id', async () => {
    // GIVEN
    onEventMock = async () => undefined;
    isCompleteMock = async () => ({ IsComplete: false });

    // WHEN
    await invokeMainHandler({
      RequestType: 'Delete',
      PhysicalResourceId: undefined
    });

    // THEN
    expectCloudFormationFailed('Invalid CloudFormation custom resource event (Delete): PhysicalResourceId is required for \"Update\" and \"Delete\" events');
  });

  test('main handler fails if CREATE is called *with* a physical resource id', async () => {
    // GIVEN
    onEventMock = async () => undefined;
    isCompleteMock = async () => ({ IsComplete: false });

    // WHEN
    await invokeMainHandler({
      RequestType: 'Create',
      PhysicalResourceId: 'Foo'
    } as any);

    // THEN
    expectCloudFormationFailed('Invalid CloudFormation custom resource event (Create): PhysicalResourceId is not allowed for \"Create\" events');
  });

});

test('isComplete always returns "false" and then a timeout occurs', async () => {
  // GIVEN
  onEventMock = async () => ({ Data: { Foo: 123 }, PhysicalResourceId: MOCK_PHYSICAL_ID });
  isCompleteMock = async () => ({ IsComplete: false });

  // WHEN
  await invokeMainHandler({
    RequestType: 'Update',
    PhysicalResourceId: MOCK_PHYSICAL_ID
  });

  // THEN
  await simulateWaiterAndExpect({
    ServiceToken: "SERVICE-TOKEN",
    ResponseURL: "http://pre-signed-S3-url-for-response/path/in/bucket",
    StackId: "arn:aws:cloudformation:us-west-2:123456789012:stack/stack-name/guid",
    RequestId: "uniqueid-for-this-create-request",
    ResourceType: "Custom::TestResource",
    LogicalResourceId: "MyTestResource",
    RequestType: "Update",
    PhysicalResourceId: "mock-physical-resource-id",
    ResourceProperties: {},
    Data: {
      Foo: 123
    }
  });

  expectCloudFormationFailed(`Operation timed out`);
});

test('isComplete: "Data" is not allowed if InComplete is "False"', async () => {
  // GIVEN
  onEventMock = async () => ({ Data: { Foo: 123 }, PhysicalResourceId: MOCK_PHYSICAL_ID });
  isCompleteMock = async () => ({ IsComplete: false, Data: { Foo: 3333 } });

  // WHEN
  await invokeMainHandler({
    RequestType: 'Update',
    PhysicalResourceId: MOCK_PHYSICAL_ID
  });

  expectCloudFormationFailed(`"Data" is not allowed if "IsComplete" is "False"`);
});

// -----------------------------------------------------------------------------------------------------------------------

async function simulateWaiterAndExpect(expectedInput: any) {

  expectWaiterStarted({
    input: JSON.stringify(expectedInput),
    name: MOCK_REQUEST.RequestId,
    stateMachineArn: MOCK_SFN_ARN,
  });

  let retry = true;
  let count = 5;
  while (retry) {
    try {
      await handler.isCompleteHandler(expectedInput);
      retry = false;
    } catch (e) {
      if (e instanceof Retry) {

        if (count-- === 0) {
          await handler.timeoutHandler({ Cause: JSON.stringify({ errorMessage: e.message }) });
          retry = false;
        } else {
          retry = true;
          continue;
        }
      } else {
        throw new Error(e);
      }
    }
  }
}

async function invokeMainHandler(req: Partial<AWSLambda.CloudFormationCustomResourceEvent>) {
  const x = {
    ServiceToken: 'SERVICE-TOKEN',
    ResponseURL: MOCK_REQUEST.ResponseURL,
    StackId: MOCK_REQUEST.StackId,
    RequestId: MOCK_REQUEST.RequestId,
    ResourceType: 'Custom::TestResource',
    LogicalResourceId: MOCK_REQUEST.LogicalResourceId,
    ...req
  };

  return await handler.onEventHandler(x as AWSLambda.CloudFormationCustomResourceEvent);
}

function expectCloudFormationFailed(expectedReason: string) {
  expectCloudFormationResponse({
    Status: 'FAILED',
    Reason: expectedReason
  });
}

function expectCloudFormationSuccess(resp?: Partial<AWSLambda.CloudFormationCustomResourceResponse>) {
  if (cfnResponse.Status !== 'SUCCESS') {
    console.error(cfnResponse.Reason || '<NO REASON>');
  }

  expectCloudFormationResponse({ Status: 'SUCCESS', ...resp });
}

function expectCloudFormationResponse(resp: Partial<AWSLambda.CloudFormationCustomResourceResponse> = {}) {
  for (const [key, expected] of Object.entries(resp)) {
    const actual = (cfnResponse as any)[key];
    expect(actual).toStrictEqual(expected as any);
  }
}

function expectNoWaiter() {
  expect(startStateMachineInput).toBeUndefined();
}

function expectWaiterStarted(expected: AWS.StepFunctions.StartExecutionInput) {
  expect(startStateMachineInput).toStrictEqual(expected);
}