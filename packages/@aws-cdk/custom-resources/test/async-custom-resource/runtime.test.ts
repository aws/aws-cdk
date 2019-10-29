// tslint:disable: no-console
// tslint:disable: max-line-length
import AWS = require('aws-sdk');
import https = require('https');
import path = require('path');
import { parse as urlparse } from 'url';
import response = require('../../lib/async-custom-resource/runtime/cfn-response');
import consts = require('../../lib/async-custom-resource/runtime/consts');
import handler = require('../../lib/async-custom-resource/runtime/index');
import { Retry } from '../../lib/async-custom-resource/runtime/util';
import userHandler = require('./fixtures/mock-handler');

const MOCK_HANDLER_FILE = path.join(__dirname, 'fixtures', 'mock-handler.js');

const MOCK_REQUEST = {
  ResponseURL: "http://pre-signed-S3-url-for-response/path/in/bucket",
  LogicalResourceId: 'MyTestResource',
  RequestId: "uniqueid-for-this-create-request",
  StackId: 'arn:aws:cloudformation:us-west-2:123456789012:stack/stack-name/guid',
};

const MOCK_PHYSICAL_ID = 'mock-physical-resource-id';
const MOCK_SFN_ARN = 'arn:of:state:machine';
const MOCK_PROPS = { Name : "Value", List: [ "1", "2", "3" ], ServiceToken: 'bla' };
const MOCK_ATTRS = { MyAttribute: 'my-mock-attribute' };

let startStateMachineInput: AWS.StepFunctions.StartExecutionInput | undefined;
let assumeRoleInput: AWS.STS.AssumeRoleRequest | undefined;

// mock http requests
let cfnResponse: AWSLambda.CloudFormationCustomResourceResponse;
response.httpRequest = async (options: https.RequestOptions, body: string) => {
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

beforeEach(() => {
  cfnResponse = { } as any;

  process.env[consts.ENV_ON_EVENT_USER_HANDLER_FILE] = MOCK_HANDLER_FILE;
  process.env[consts.ENV_ON_EVENT_USER_HANDLER_FUNCTION] = 'onEvent';
  process.env[consts.ENV_IS_COMPLETE_USER_HANDLER_FILE] = MOCK_HANDLER_FILE;
  process.env[consts.ENV_IS_COMPLETE_USER_HANDLER_FUNCTION] = 'isComplete';
  process.env[consts.ENV_WAITER_STATE_MACHINE_ARN] = MOCK_SFN_ARN;

  userHandler.onEvent = () => { throw new Error('"onEvent" not implemented'); };
  userHandler.isComplete = () => { throw new Error('"isComplete" not implemented'); };

  startStateMachineInput = undefined;
  handler.startExecution = async (req: AWS.StepFunctions.StartExecutionInput) => {
    startStateMachineInput = req;
    expect(req.stateMachineArn).toEqual(MOCK_SFN_ARN);
    return {
      executionArn: req.stateMachineArn + '/execution',
      startDate: new Date(),
    };
  };

  assumeRoleInput = undefined;
  handler.assumeRoleAndMakeDefault = async (req: AWS.STS.AssumeRoleRequest) => {
    assumeRoleInput = req;
  };
});

afterEach(() => {
  delete process.env[consts.ENV_IS_COMPLETE_USER_HANDLER_FILE];
  delete process.env[consts.ENV_IS_COMPLETE_USER_HANDLER_FUNCTION];
  delete process.env[consts.ENV_ON_EVENT_USER_HANDLER_FILE];
  delete process.env[consts.ENV_ON_EVENT_USER_HANDLER_FUNCTION];
  delete process.env[consts.ENV_WAITER_STATE_MACHINE_ARN];
  delete process.env[consts.PROP_EXECUTION_ROLE_ARN];
});

test('synchronous flow (isComplete immediately returns true): waiter state machine is not triggered', async () => {
  // GIVEN
  let isCompleteCalls = 0;

  userHandler.onEvent = async event => {
    expect(event.RequestType).toEqual('Create');
    expect(event.ResourceProperties).toStrictEqual(MOCK_PROPS);
    expect(event.PhysicalResourceId).toBeUndefined(); // physical ID in CREATE

    return {
      PhysicalResourceId: MOCK_PHYSICAL_ID,
      Data: MOCK_ATTRS
    };
  };

  userHandler.isComplete = async event => {
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
    RequestType : 'Create',
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

  userHandler.onEvent = async event => {
    expect(event.RequestType).toEqual('Create');
    expect(event.ResourceProperties).toStrictEqual(MOCK_PROPS);
    expect(event.PhysicalResourceId).toBeUndefined(); // physical ID in CREATE

    return {
      PhysicalResourceId: MOCK_PHYSICAL_ID,
      Data: MOCK_ATTRS
    };
  };

  userHandler.isComplete = async event => {
    isCompleteCalls++;
    expect(event.PhysicalResourceId).toEqual(MOCK_PHYSICAL_ID); // physical ID returned from onEvent is passed to "isComplete"
    expect(event.Data).toStrictEqual(MOCK_ATTRS); // attributes are propagated between the calls

    const isComplete = isCompleteCalls === 3;
    if (!isComplete) {
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
    RequestType : 'Create',
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
    ResourceProperties: { Name: "Value", List: [ "1", "2", "3" ], ServiceToken: "bla" },
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
  userHandler.onEvent = async () => ({ PhysicalResourceId: MOCK_PHYSICAL_ID, });
  userHandler.isComplete = async () => { throw new Error('Some failure'); };

  // WHEN
  await invokeMainHandler({
    RequestType : 'Create',
    ResourceProperties: MOCK_PROPS
  });

  expectNoWaiter();
  expectCloudFormationFailed('Some failure');
});

test('fails gracefully if "onEvent" throws an error', async () => {
  // GIVEN
  userHandler.onEvent = async () => { throw new Error('error thrown during onEvent'); };
  userHandler.isComplete = async () => ({ IsComplete: true });

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
      userHandler.onEvent = async () => ({ Data: { a: 123 } } as any);

      // THEN
      await invokeMainHandler({
        RequestType: 'Create'
      });

      expectCloudFormationFailed('onEvent response must include a PhysicalResourceId for all request types');
    });

    test('UPDATE', async () => {
      // WHEN
      userHandler.onEvent = async () => ({ Data: { a: 123 } } as any);

      // THEN
      await invokeMainHandler({
        PhysicalResourceId: 'Boom',
        RequestType: 'Update'
      });

      expectCloudFormationFailed('onEvent response must include a PhysicalResourceId for all request types');
    });

    test('DELETE', async () => {
      // WHEN
      userHandler.onEvent = async () => ({ Data: { a: 123 } } as any);

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
    userHandler.onEvent = async () => ({ PhysicalResourceId: 'NewPhysicalId' });
    userHandler.isComplete = async () => ({ IsComplete: true });

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
    userHandler.onEvent = async () => ({ PhysicalResourceId: 'NewPhysicalId' });
    userHandler.isComplete = async () => ({ IsComplete: true });

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
    userHandler.onEvent = async () => undefined;
    userHandler.isComplete = async () => ({ IsComplete: false });

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
    userHandler.onEvent = async () => undefined;
    userHandler.isComplete = async () => ({ IsComplete: false });

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
    userHandler.onEvent = async () => undefined;
    userHandler.isComplete = async () => ({ IsComplete: false });

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
  userHandler.onEvent = async () => ({ Data: { Foo: 123 }, PhysicalResourceId: MOCK_PHYSICAL_ID });
  userHandler.isComplete = async () => ({ IsComplete: false });

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
    ResourceProperties: { },
    Data: {
      Foo: 123
    }
  });

  expectCloudFormationFailed(`Operation timed out`);
});

test('isComplete: "Data" is not allowed if InComplete is "False"', async () => {
  // GIVEN
  userHandler.onEvent = async () => ({ Data: { Foo: 123 }, PhysicalResourceId: MOCK_PHYSICAL_ID });
  userHandler.isComplete = async () => ({ IsComplete: false, Data: { Foo: 3333 } });

  // WHEN
  await invokeMainHandler({
    RequestType: 'Update',
    PhysicalResourceId: MOCK_PHYSICAL_ID
  });

  expectCloudFormationFailed(`"Data" is not allowed if "IsComplete" is "False"`);
});

test('if $ExecutionRoleArn is passed as a property, this role will be assumed and used as a default role for user handlers', async () => {
  userHandler.onEvent = async () => ({ PhysicalResourceId: 'Foo' });
  userHandler.isComplete = async () => ({ IsComplete: true });

  const MOCK_ASSUME_ROLE_ARN = 'execution:role:arn';

  await invokeMainHandler({
    RequestType: 'Create',
    ResourceProperties: {
      ServiceToken: 'Bla',
      [consts.PROP_EXECUTION_ROLE_ARN]: MOCK_ASSUME_ROLE_ARN,
    }
  });

  expect(assumeRoleInput && assumeRoleInput.RoleArn).toEqual(MOCK_ASSUME_ROLE_ARN);
  expectCloudFormationSuccess();
});

test('$ExecutionRoleArn is not used to start the waiter state machine', async () => {
  fail('boom');
});

// -----------------------------------------------------------------------------------------------------------------------

async function simulateWaiterAndExpect(expectedInput: any) {

  expectWaiterStarted({
    input: JSON.stringify(expectedInput),
    name: `${expectedInput.RequestType}:${MOCK_PHYSICAL_ID}`,
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
          await handler.timeoutHandler({ Cause: JSON.stringify({ errorMessage: e.message })});
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
    ResponseURL : MOCK_REQUEST.ResponseURL,
    StackId : MOCK_REQUEST.StackId,
    RequestId : MOCK_REQUEST.RequestId,
    ResourceType: 'Custom::TestResource',
    LogicalResourceId : MOCK_REQUEST.LogicalResourceId,
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

function expectCloudFormationResponse(resp: Partial<AWSLambda.CloudFormationCustomResourceResponse> = { }) {
  for (const [ key, expected ] of Object.entries(resp)) {
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