
/* eslint-disable @typescript-eslint/no-require-imports */
import mocks = require('./mocks');
import cfnResponse = require('../../lib/provider-framework/runtime/cfn-response');
import framework = require('../../lib/provider-framework/runtime/framework');
import outbound = require('../../lib/provider-framework/runtime/outbound');

console.log = jest.fn();

cfnResponse.includeStackTraces = false;

const MOCK_PHYSICAL_ID = 'mock-physical-resource-id';
const MOCK_PROPS = { Name: 'Value', List: ['1', '2', '3'], ServiceToken: 'bla' };
const MOCK_ATTRS = { MyAttribute: 'my-mock-attribute' };

outbound.httpRequest = mocks.httpRequestMock;
outbound.invokeFunction = mocks.invokeFunctionMock;
outbound.startExecution = mocks.startExecutionMock;

const invokeFunctionSpy = jest.spyOn(outbound, 'invokeFunction');

beforeEach(() => mocks.setup());
afterEach(() => invokeFunctionSpy.mockClear());

test('async flow: isComplete returns true only after 3 times', async () => {
  let isCompleteCalls = 0;

  mocks.onEventImplMock = async event => {
    expect(event.RequestType).toEqual('Create');
    expect(event.ResourceProperties).toStrictEqual(MOCK_PROPS);
    expect(event.PhysicalResourceId).toBeUndefined(); // physical ID in CREATE

    return {
      PhysicalResourceId: MOCK_PHYSICAL_ID,
      Data: MOCK_ATTRS,
      ArbitraryField: 1234,
    };
  };

  mocks.isCompleteImplMock = async event => {
    isCompleteCalls++;
    expect((event as any).ArbitraryField).toEqual(1234); // any field is passed through
    expect(event.PhysicalResourceId).toEqual(MOCK_PHYSICAL_ID); // physical ID returned from onEvent is passed to "isComplete"
    expect(event.Data).toStrictEqual(MOCK_ATTRS); // attributes are propagated between the calls

    const result = isCompleteCalls === 3;
    if (!result) {
      return {
        IsComplete: false,
      };
    }

    return {
      IsComplete: true,
      Data: {
        Additional: 'attribute', // additional attributes can be returned from "isComplete"
      },
    };
  };

  // WHEN
  await simulateEvent({
    RequestType: 'Create',
    ResourceProperties: MOCK_PROPS,
  });

  // THEN
  expect(isCompleteCalls).toEqual(3);

  expectCloudFormationSuccess({
    PhysicalResourceId: MOCK_PHYSICAL_ID,
    Data: {
      ...MOCK_ATTRS,
      Additional: 'attribute',
    },
  });
});

test('isComplete throws in the first invocation', async () => {
  // GIVEN
  mocks.onEventImplMock = async () => ({ PhysicalResourceId: MOCK_PHYSICAL_ID });
  mocks.isCompleteImplMock = async () => { throw new Error('Some failure'); };

  // WHEN
  await simulateEvent({
    RequestType: 'Create',
    ResourceProperties: MOCK_PROPS,
  });

  expectCloudFormationFailed('Some failure\n\nLogs: /aws/lambda/complete\n');
});

test('fails gracefully if "onEvent" throws an error', async () => {
  // GIVEN
  mocks.onEventImplMock = async () => { throw new Error('error thrown during onEvent'); };
  mocks.isCompleteImplMock = async () => ({ IsComplete: true });

  // WHEN
  await simulateEvent({
    RequestType: 'Create',
  });

  // THEN
  expectCloudFormationFailed('error thrown during onEvent\n\nLogs: /aws/lambda/event\n');
  expectNoWaiter();
});

describe('PhysicalResourceId', () => {
  describe('if not omitted from onEvent result', () => {
    it('defaults to RequestId for CREATE', async () => {
      // WHEN
      mocks.onEventImplMock = async () => undefined;

      // THEN
      await simulateEvent({
        RequestType: 'Create',
      });

      expectCloudFormationSuccess({
        PhysicalResourceId: mocks.MOCK_REQUEST.RequestId,
      });
    });

    it('defaults to the current PhysicalResourceId for UPDATE', async () => {
      // WHEN
      mocks.onEventImplMock = async () => undefined;

      // THEN
      await simulateEvent({
        RequestType: 'Update',
        PhysicalResourceId: MOCK_PHYSICAL_ID,
      });

      expectCloudFormationSuccess({
        PhysicalResourceId: MOCK_PHYSICAL_ID,
      });
    });

    it('defaults to the current PhysicalResourceId for DELETE', async () => {
      // WHEN
      mocks.onEventImplMock = async () => undefined;

      // THEN
      await simulateEvent({
        RequestType: 'Delete',
        PhysicalResourceId: MOCK_PHYSICAL_ID,
      });

      expectCloudFormationSuccess({
        PhysicalResourceId: MOCK_PHYSICAL_ID,
      });
    });
  });

  test('UPDATE: can change the physical ID by returning a new ID', async () => {
    // GIVEN
    mocks.onEventImplMock = async () => ({ PhysicalResourceId: 'NewPhysicalId' });
    mocks.isCompleteImplMock = async () => ({ IsComplete: true });

    // WHEN
    await simulateEvent({
      RequestType: 'Update',
      PhysicalResourceId: 'CurrentPhysicalId',
    });

    // THEN
    expectCloudFormationSuccess({
      PhysicalResourceId: 'NewPhysicalId',
    });
  });

  test('UPDATE: can override the physical ID with the actual on isComplete', async () => {
    // GIVEN
    mocks.onEventImplMock = async () => ({ PhysicalResourceId: 'TemporaryPhysicalId' });
    mocks.isCompleteImplMock = async () => ({ IsComplete: true, PhysicalResourceId: 'NewPhysicalId' });

    // WHEN
    await simulateEvent({
      RequestType: 'Update',
      PhysicalResourceId: 'CurrentPhysicalId',
    });

    // THEN
    expectCloudFormationSuccess({
      PhysicalResourceId: 'NewPhysicalId',
    });
  });

  test('DELETE: cannot change the physical resource ID during a delete', async () => {
    // GIVEN
    mocks.onEventImplMock = async () => ({ PhysicalResourceId: 'NewPhysicalId' });
    mocks.isCompleteImplMock = async () => ({ IsComplete: true });

    // WHEN
    await simulateEvent({
      RequestType: 'Delete',
      PhysicalResourceId: 'CurrentPhysicalId',
    });

    // THEN
    expectNoWaiter();
    expectCloudFormationFailed('DELETE: cannot change the physical resource ID from "CurrentPhysicalId" to "NewPhysicalId" during deletion');
  });
});

test('isComplete always returns "false" and then a timeout occurs', async () => {
  // GIVEN
  mocks.onEventImplMock = async () => ({ Data: { Foo: 123 }, PhysicalResourceId: MOCK_PHYSICAL_ID });
  mocks.isCompleteImplMock = async () => ({ IsComplete: false });

  // WHEN
  await simulateEvent({
    RequestType: 'Update',
    PhysicalResourceId: MOCK_PHYSICAL_ID,
  });

  // THEN
  expectCloudFormationFailed('Operation timed out');
});

test('onTimeout does not log the presigned ResponseURL, nor Data when NoEcho is set', async () => {
  // GIVEN
  mocks.onEventImplMock = async () => ({ Data: { Foo: 'SECRET-ATTR' }, NoEcho: true, PhysicalResourceId: MOCK_PHYSICAL_ID });
  mocks.isCompleteImplMock = async () => ({ IsComplete: false });
  const logMock = console.log as jest.Mock;
  logMock.mockClear();

  // WHEN
  await simulateEvent({
    RequestType: 'Update',
    PhysicalResourceId: MOCK_PHYSICAL_ID,
  });

  // THEN
  expectCloudFormationFailed('Operation timed out');
  const timeoutLogs = logMock.mock.calls.filter(args => String(args[1]).includes('timeoutHandler'));
  expect(timeoutLogs).toHaveLength(1);
  const logged = timeoutLogs.map(args => args.join(' ')).join('\n');
  expect(logged).not.toContain(mocks.MOCK_REQUEST.ResponseURL);
  expect(logged).not.toContain('SECRET-ATTR');
  expect(logged).toContain(MOCK_PHYSICAL_ID);
  const responseLogs = logMock.mock.calls.filter(args => /submit (redacted )?response/.test(String(args[1])));
  expect(responseLogs).toHaveLength(1);
  expect(responseLogs[0].join(' ')).not.toContain('SECRET-ATTR');
  // the response sent to cloudformation carries the real Data, with NoEcho set
  expect(mocks.cfnResponse.NoEcho).toBe(true);
  expect(mocks.cfnResponse.Data).toEqual({ Foo: 'SECRET-ATTR' });
});

test('a failing isComplete does not log NoEcho Data in the FAILED response', async () => {
  // GIVEN
  mocks.onEventImplMock = async () => ({ Data: { Foo: 'SECRET-ATTR' }, NoEcho: true, PhysicalResourceId: MOCK_PHYSICAL_ID });
  mocks.isCompleteImplMock = async () => {
    throw new Error('isComplete failed');
  };
  const logMock = console.log as jest.Mock;
  logMock.mockClear();

  // WHEN
  await simulateEvent({
    RequestType: 'Update',
    PhysicalResourceId: MOCK_PHYSICAL_ID,
  });

  // THEN
  expect(mocks.cfnResponse.Status).toEqual('FAILED');
  expect(mocks.cfnResponse.Reason).toContain('isComplete failed');
  const responseLogs = logMock.mock.calls.filter(args => /submit (redacted )?response/.test(String(args[1])));
  expect(responseLogs).toHaveLength(1);
  expect(String(responseLogs[0][1])).toEqual('submit redacted response to cloudformation');
  expect(logMock.mock.calls.map(args => args.join(' ')).join('\n')).not.toContain('SECRET-ATTR');
  // the response sent to cloudformation has NoEcho set, decided the same way as the log line
  expect(mocks.cfnResponse.NoEcho).toBe(true);
});

test('NoEcho Data returned by onEvent is not logged by any line of the async flow', async () => {
  // GIVEN
  let isCompleteCalls = 0;
  mocks.onEventImplMock = async () => ({ Data: { Foo: 'SECRET-ATTR' }, NoEcho: true, PhysicalResourceId: MOCK_PHYSICAL_ID });
  mocks.isCompleteImplMock = async () => ({ IsComplete: ++isCompleteCalls > 1 });
  const logMock = console.log as jest.Mock;
  logMock.mockClear();

  // WHEN
  await simulateEvent({
    RequestType: 'Update',
    PhysicalResourceId: MOCK_PHYSICAL_ID,
  });

  // THEN
  expectCloudFormationSuccess({ PhysicalResourceId: MOCK_PHYSICAL_ID, Data: { Foo: 'SECRET-ATTR' } });
  const logged = logMock.mock.calls.map(args => args.join(' ')).join('\n');
  expect(logged).toContain('executing user function arn:lambda:user:is:complete');
  expect(logged).toContain('user function response:');
  expect(logged).not.toContain('SECRET-ATTR');
});

test('onTimeout does not log the presigned ResponseURL when NoEcho is not set, and logs Data', async () => {
  // GIVEN
  mocks.onEventImplMock = async () => ({ Data: { Foo: 'VISIBLE-ATTR' }, PhysicalResourceId: MOCK_PHYSICAL_ID });
  mocks.isCompleteImplMock = async () => ({ IsComplete: false });
  const logMock = console.log as jest.Mock;
  logMock.mockClear();

  // WHEN
  await simulateEvent({
    RequestType: 'Update',
    PhysicalResourceId: MOCK_PHYSICAL_ID,
  });

  // THEN
  expectCloudFormationFailed('Operation timed out');
  const timeoutLogs = logMock.mock.calls.filter(args => String(args[1]).includes('timeoutHandler'));
  expect(timeoutLogs).toHaveLength(1);
  const logged = timeoutLogs.map(args => args.join(' ')).join('\n');
  expect(logged).not.toContain(mocks.MOCK_REQUEST.ResponseURL);
  expect(logged).toContain('VISIBLE-ATTR');
  expect(logged).toContain(MOCK_PHYSICAL_ID);
});

test('onTimeout with an unreadable Cause logs a sanitized summary and throws without the Cause', async () => {
  // GIVEN - a Cause that is not the JSON the waiter produces, but contains the presigned URL
  const logMock = console.log as jest.Mock;
  logMock.mockClear();
  const timeoutEvent = { Error: 'States.Timeout', Cause: `not json ${mocks.MOCK_REQUEST.ResponseURL}` };

  // WHEN
  const error = await framework.onTimeout(timeoutEvent).then(() => undefined, e => e);

  // THEN
  expect(error).toBeInstanceOf(Error);
  expect(error).not.toBeInstanceOf(SyntaxError);
  expect(error.message).toContain('cannot read the isComplete request from the timeout event (SyntaxError); Step Functions error: States.Timeout; event keys: Error, Cause');
  expect(error.message).not.toContain(mocks.MOCK_REQUEST.ResponseURL);
  const logged = logMock.mock.calls.map(args => args.join(' ')).join('\n');
  expect(logged).toContain('cannot read the isComplete request from the timeout event');
  expect(logged).not.toContain(mocks.MOCK_REQUEST.ResponseURL);
});

describe('submitResponse NoEcho', () => {
  const event = {
    StackId: mocks.MOCK_REQUEST.StackId,
    RequestId: mocks.MOCK_REQUEST.RequestId,
    LogicalResourceId: mocks.MOCK_REQUEST.LogicalResourceId,
    PhysicalResourceId: 'phys',
    ResponseURL: mocks.MOCK_REQUEST.ResponseURL,
    Data: { Foo: 'SECRET-ATTR' },
  };

  test.each([
    ['the option is true and the event is not', { noEcho: true }, undefined],
    ['the event is true and the option is not given', {}, true],
    ['the event is true and the option is false', { noEcho: false }, true],
    ['the option is the string "true"', { noEcho: 'true' as any }, undefined],
    ['the option is 1', { noEcho: 1 as any }, undefined],
    ['the event is the string "true"', {}, 'true' as any],
    ['the event is 1', {}, 1 as any],
  ])('is set when %s', async (_desc, options, eventNoEcho) => {
    const logMock = console.log as jest.Mock;
    logMock.mockClear();

    await cfnResponse.submitResponse('SUCCESS', { ...event, NoEcho: eventNoEcho }, options);

    expect(mocks.cfnResponse.NoEcho).toBe(true);
    expect(mocks.cfnResponse.Data).toEqual({ Foo: 'SECRET-ATTR' });
    expect(logMock.mock.calls.map(args => args.join(' ')).join('\n')).not.toContain('SECRET-ATTR');
  });

  test('is not set, and Data is logged, when neither says so', async () => {
    const logMock = console.log as jest.Mock;
    logMock.mockClear();

    await cfnResponse.submitResponse('SUCCESS', event, { noEcho: false });

    expect(mocks.cfnResponse.NoEcho).toBeUndefined();
    expect(logMock.mock.calls.map(args => args.join(' ')).join('\n')).toContain('SECRET-ATTR');
  });
});

// isComplete's response is merged into the request it completes, so a NoEcho it returns
// (outside the IsCompleteResponse contract) decides the SUCCESS response too. Truthy
// values, including the strings "false" and "0", mask; falsy values do not.
test.each([
  [true, true],
  ['false', true],
  ['0', true],
  [1, true],
  [false, undefined],
  [0, undefined],
  ['', undefined],
])('NoEcho %j returned only by isComplete gives a SUCCESS response with NoEcho %j', async (isCompleteNoEcho, expected) => {
  // GIVEN
  mocks.onEventImplMock = async () => ({ Data: { Foo: 'SECRET-ATTR' }, PhysicalResourceId: MOCK_PHYSICAL_ID });
  mocks.isCompleteImplMock = async () => ({ IsComplete: true, NoEcho: isCompleteNoEcho } as any);
  const logMock = console.log as jest.Mock;
  logMock.mockClear();

  // WHEN
  await simulateEvent({ RequestType: 'Create' });

  // THEN
  expect(mocks.cfnResponse.Status).toEqual('SUCCESS');
  expect(mocks.cfnResponse.NoEcho).toEqual(expected);
  const responseLogs = logMock.mock.calls.filter(args => /submit (redacted )?response/.test(String(args[1])));
  expect(responseLogs).toHaveLength(1);
  expect(String(responseLogs[0][1])).toEqual(expected ? 'submit redacted response to cloudformation' : 'submit response to cloudformation');
});

test('NoEcho returned by onEvent as a non-boolean truthy value is honored', async () => {
  // GIVEN - for example a handler that builds its JSON by hand
  mocks.onEventImplMock = async () => ({ Data: { Foo: 'SECRET-ATTR' }, NoEcho: 'true' as any, PhysicalResourceId: MOCK_PHYSICAL_ID });
  const logMock = console.log as jest.Mock;
  logMock.mockClear();

  // WHEN
  await simulateEvent({ RequestType: 'Create' });

  // THEN
  expect(mocks.cfnResponse.Status).toEqual('SUCCESS');
  expect(mocks.cfnResponse.NoEcho).toBe(true);
  expect(mocks.cfnResponse.Data).toEqual({ Foo: 'SECRET-ATTR' });
  expect(logMock.mock.calls.map(args => args.join(' ')).join('\n')).not.toContain('SECRET-ATTR');
});

test.each([
  ['the string "true"', 'true'],
  ['1', 1],
])('the malformed-event log masks Data when NoEcho is %s', async (_desc, noEcho) => {
  const logMock = console.log as jest.Mock;
  logMock.mockClear();
  const handler = cfnResponse.safeHandler(async () => {
    throw new Error('boom');
  });

  await handler({
    RequestType: 'Update',
    StackId: mocks.MOCK_REQUEST.StackId,
    RequestId: mocks.MOCK_REQUEST.RequestId,
    LogicalResourceId: mocks.MOCK_REQUEST.LogicalResourceId,
    ResponseURL: mocks.MOCK_REQUEST.ResponseURL,
    NoEcho: noEcho,
    Data: { Foo: 'SECRET-ATTR' },
  });

  const logged = logMock.mock.calls.map(args => args.join(' ')).join('\n');
  expect(logged).toContain('ERROR: Malformed event.');
  expect(logged).not.toContain('SECRET-ATTR');
});

test('the malformed-event log of a failing handler does not log NoEcho Data', async () => {
  // GIVEN - an isComplete-style event without a PhysicalResourceId
  const logMock = console.log as jest.Mock;
  logMock.mockClear();
  const handler = cfnResponse.safeHandler(async () => {
    throw new Error('boom');
  });

  // WHEN
  await handler({
    RequestType: 'Update',
    StackId: mocks.MOCK_REQUEST.StackId,
    RequestId: mocks.MOCK_REQUEST.RequestId,
    LogicalResourceId: mocks.MOCK_REQUEST.LogicalResourceId,
    ResponseURL: mocks.MOCK_REQUEST.ResponseURL,
    NoEcho: true,
    Data: { Foo: 'SECRET-ATTR' },
  });

  // THEN
  const logged = logMock.mock.calls.map(args => args.join(' ')).join('\n');
  expect(logged).toContain('ERROR: Malformed event.');
  expect(logged).not.toContain('SECRET-ATTR');
  expect(logged).not.toContain(mocks.MOCK_REQUEST.ResponseURL);
});

describe('redactDataFromPayload', () => {
  test('masks every value of object Data', () => {
    expect(cfnResponse.redactDataFromPayload({ NoEcho: true, Data: { A: 'secret-a', B: 'secret-b' } }).Data)
      .toEqual({ A: '*****', B: '*****' });
  });

  test.each([
    ['a string', 'SECRET-STRING'],
    ['an array', ['SECRET-1', 'SECRET-2']],
    ['a number', 1234567],
  ])('replaces Data that is %s with a single placeholder', (_desc, data) => {
    const payload = { NoEcho: true, Data: data as any };

    const redacted = cfnResponse.redactDataFromPayload(payload);

    expect(redacted.Data).toEqual('*****');
    expect(payload.Data).toEqual(data); // the input is not modified
  });
});

test('isComplete: "Data" is not allowed if InComplete is "False"', async () => {
  // GIVEN
  mocks.onEventImplMock = async () => ({ Data: { Foo: 123 }, PhysicalResourceId: MOCK_PHYSICAL_ID });
  mocks.isCompleteImplMock = async () => ({ IsComplete: false, Data: { Foo: 3333 } });

  // WHEN
  await simulateEvent({
    RequestType: 'Update',
    PhysicalResourceId: MOCK_PHYSICAL_ID,
  });

  expectCloudFormationFailed('"Data" is not allowed if "IsComplete" is "False"');
});

test('if there is no user-defined "isComplete", the waiter will not be triggered or needed', async () => {
  // GIVEN
  mocks.onEventImplMock = async () => ({ PhysicalResourceId: MOCK_PHYSICAL_ID });

  // WHEN
  await simulateEvent({
    RequestType: 'Create',
  });

  // THEN
  expectNoWaiter();
  expectCloudFormationSuccess({ PhysicalResourceId: MOCK_PHYSICAL_ID });
});

describe('NoEcho', () => {
  test('with onEvent', async () => {
    // GIVEN
    mocks.onEventImplMock = async () => ({
      Data: {
        Very: 'Sensitive',
      },
      NoEcho: true,
    });

    // WHEN
    await simulateEvent({
      RequestType: 'Create',
    });

    // THEN
    expectCloudFormationSuccess({
      Data: {
        Very: 'Sensitive',
      },
      NoEcho: true,
    });
  });

  test('with isComplete', async () => {
    // GIVEN
    mocks.onEventImplMock = async () => ({
      Data: {
        Very: 'Sensitive',
      },
      NoEcho: true,
    });
    mocks.isCompleteImplMock = async () => ({
      Data: {
        Also: 'Confidential',
      },
      IsComplete: true,
    });

    // WHEN
    await simulateEvent({
      RequestType: 'Create',
    });

    // THEN
    expectCloudFormationSuccess({
      Data: {
        Very: 'Sensitive',
        Also: 'Confidential',
      },
      NoEcho: true,
    });
  });
});

test('fails if user handler returns a non-object response', async () => {
  // GIVEN
  mocks.stringifyPayload = false;
  mocks.onEventImplMock = async () => 'string' as any;

  // WHEN
  await simulateEvent({ RequestType: 'Create' });

  // THEN
  expectCloudFormationFailed('return values from user-handlers must be JSON objects. got: \"string\"');
});

describe('if CREATE fails, the subsequent DELETE will be ignored', () => {
  it('FAILED response sets PhysicalResourceId to a special marker', async () => {
    // WHEN
    mocks.onEventImplMock = async () => { throw new Error('CREATE FAILED'); };

    // THEN
    await simulateEvent({
      RequestType: 'Create',
    });

    expectCloudFormationFailed('CREATE FAILED\n\nLogs: /aws/lambda/event\n', {
      PhysicalResourceId: cfnResponse.CREATE_FAILED_PHYSICAL_ID_MARKER,
    });
  });

  it('DELETE request with the marker succeeds without calling user handler', async () => {
    // GIVEN
    // user handler is not assigned

    // WHEN
    await simulateEvent({
      RequestType: 'Delete',
      PhysicalResourceId: cfnResponse.CREATE_FAILED_PHYSICAL_ID_MARKER,
    });

    // THEN
    expectCloudFormationSuccess();
  });
});

describe('ResponseURL is passed to user function', () => {
  test('for onEvent', async () => {
    // GIVEN
    mocks.onEventImplMock = async () => ({ PhysicalResourceId: MOCK_PHYSICAL_ID });

    // WHEN
    await simulateEvent({
      RequestType: 'Create',
    });

    // THEN
    expect(invokeFunctionSpy).toHaveBeenCalledTimes(1);
    expect(invokeFunctionSpy).toHaveBeenCalledWith(expect.objectContaining({
      Payload: expect.stringContaining(`"ResponseURL":"${mocks.MOCK_REQUEST.ResponseURL}"`),
    }));
  });

  test('for isComplete', async () => {
    // GIVEN
    mocks.onEventImplMock = async () => ({ PhysicalResourceId: MOCK_PHYSICAL_ID });
    mocks.isCompleteImplMock = async () => ({ IsComplete: true });

    // WHEN
    await simulateEvent({
      RequestType: 'Create',
    });

    // THEN
    expect(invokeFunctionSpy).toHaveBeenCalledTimes(2);
    expect(invokeFunctionSpy).toHaveBeenLastCalledWith(expect.objectContaining({
      Payload: expect.stringContaining(`"ResponseURL":"${mocks.MOCK_REQUEST.ResponseURL}"`),
    }));
  });
});

test('waiter state machine execution does not include name field (allows retries)', async () => {
  // GIVEN
  mocks.onEventImplMock = async () => ({ PhysicalResourceId: MOCK_PHYSICAL_ID });
  mocks.isCompleteImplMock = async () => ({ IsComplete: true });

  // WHEN
  await simulateEvent({
    RequestType: 'Create',
  });

  // THEN
  expect(mocks.startStateMachineInput).toBeDefined();
  expect(mocks.startStateMachineInput?.stateMachineArn).toEqual(mocks.MOCK_SFN_ARN);
  expect(mocks.startStateMachineInput?.name).toBeUndefined();
  expect(mocks.startStateMachineInput?.input).toBeDefined();

  expectCloudFormationSuccess({ PhysicalResourceId: MOCK_PHYSICAL_ID });
});

// -----------------------------------------------------------------------------------------------------------------------

/**
 * Triggers the custom resource lifecycle event flow by invoking the framework's
 * onEvent function and then, if the waiter state machine was started, simulates
 * the waiter and invokes isComplete and onTimeout as appropriate.
 */
async function simulateEvent(req: Partial<AWSLambda.CloudFormationCustomResourceEvent>) {
  const x = {
    ServiceToken: 'SERVICE-TOKEN',
    ResponseURL: mocks.MOCK_REQUEST.ResponseURL,
    StackId: mocks.MOCK_REQUEST.StackId,
    RequestId: mocks.MOCK_REQUEST.RequestId,
    ResourceType: 'Custom::TestResource',
    LogicalResourceId: mocks.MOCK_REQUEST.LogicalResourceId,
    ...req,
  };

  mocks.prepareForExecution();

  await framework.onEvent(x as AWSLambda.CloudFormationCustomResourceEvent);

  // if the FSM
  if (mocks.startStateMachineInput && mocks.startStateMachineInput.stateMachineArn === mocks.MOCK_SFN_ARN) {
    await simulateWaiter(JSON.parse(mocks.startStateMachineInput.input!));
  }

  async function simulateWaiter(event: AWSCDKAsyncCustomResource.IsCompleteRequest) {
    let retry = true;
    let count = 5;
    while (retry) {
      try {
        await framework.isComplete(event);
        retry = false;
      } catch (e: any) {
        if (e instanceof cfnResponse.Retry) {
          if (count-- === 0) {
            await framework.onTimeout({ Cause: JSON.stringify({ errorMessage: e.message }) });
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
}

function expectCloudFormationFailed(expectedReason: string, resp?: Partial<AWSLambda.CloudFormationCustomResourceResponse>) {
  expectCloudFormationResponse({
    Status: 'FAILED',
    Reason: expectedReason,
    ...resp,
  });
}

function expectCloudFormationSuccess(resp?: Partial<AWSLambda.CloudFormationCustomResourceResponse>) {
  if (mocks.cfnResponse.Status !== 'SUCCESS') {
    console.error(mocks.cfnResponse.Reason || '<NO REASON>');
  }

  expectCloudFormationResponse({ Status: 'SUCCESS', ...resp });
}

function expectCloudFormationResponse(resp: Partial<AWSLambda.CloudFormationCustomResourceResponse> = {}) {
  for (const [key, expected] of Object.entries(resp)) {
    const actual = (mocks.cfnResponse as any)[key];
    expect(actual).toStrictEqual(expected as any);
  }
}

function expectNoWaiter() {
  expect(mocks.startStateMachineInput).toBeUndefined();
}
