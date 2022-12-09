import * as aws from 'aws-sdk';
import { invokeFunction } from '../../lib/provider-framework/runtime/outbound';

jest.mock('aws-sdk', () => {
  return {
    Lambda: class {
      public invoke() {
        return { promise: () => mockInvoke() };
      }

      public waitFor() {
        return { promise: () => mockWaitFor() };
      }
    },
  };
});

let mockInvoke: () => Promise<aws.Lambda.InvocationResponse>;

const req: aws.Lambda.InvocationRequest = {
  FunctionName: 'Whatever',
  Payload: {
    IsThisATest: 'Yes, this is a test',
    AreYouSure: 'Yes, I am sure',
  },
};

let invokeCount: number = 0;
let expectedFunctionStates: string[] = [];
let receivedFunctionStates: string[] = [];

const mockWaitFor = async (): Promise<aws.Lambda.GetFunctionResponse> => {
  let state = expectedFunctionStates.pop();
  while (state !== 'Active') {
    receivedFunctionStates.push(state!);
    // If it goes back to inactive it's failed
    if (state === 'Inactive') throw new Error('Not today');
    // If failed... it's failed
    if (state === 'Failed') throw new Error('Broken');
    // If pending, continue the loop, no other valid options
    if (state !== 'Pending') throw new Error('State is confused');
    state = expectedFunctionStates.pop();
  }
  receivedFunctionStates.push(state);
  return {
    Configuration: {
      State: 'Active',
    },
  };
};

describe('invokeFunction tests', () => {
  afterEach(() => {
    invokeCount = 0;
    expectedFunctionStates = [];
    receivedFunctionStates = [];
  });

  // Success cases
  test('Inactive function that reactivates does not throw error', async () => {
    mockInvoke = async () => {
      if (invokeCount == 0) {
        invokeCount++;
        throw new Error('Better luck next time');
      }
      invokeCount++;
      return { Payload: req.Payload };
    };

    expectedFunctionStates.push('Active');
    expectedFunctionStates.push('Pending');

    expect(await invokeFunction(req)).toEqual({ Payload: req.Payload });
    expect(invokeCount).toEqual(2);
    expect(receivedFunctionStates).toEqual(['Pending', 'Active']);
  });

  test('Active function does not run waitFor or retry invoke', async () => {
    mockInvoke = async () => {
      if (invokeCount == 1) {
        invokeCount++;
        throw new Error('This should not happen in this test');
      }
      invokeCount++;
      return { Payload: req.Payload };
    };

    expectedFunctionStates.push('Active');

    expect(await invokeFunction(req)).toEqual({ Payload: req.Payload });
    expect(invokeCount).toEqual(1);
    expect(receivedFunctionStates).toEqual([]);
  });

  // Failure cases
  test('Inactive function that goes back to inactive throws error', async () => {
    mockInvoke = async () => {
      if (invokeCount == 0) {
        invokeCount++;
        throw new Error('Better luck next time');
      }
      invokeCount++;
      return { Payload: req.Payload };
    };

    expectedFunctionStates.push('Inactive');
    expectedFunctionStates.push('Pending');
    expectedFunctionStates.push('Pending');

    await expect(invokeFunction(req)).rejects.toThrowError(new Error('Not today'));
    expect(invokeCount).toEqual(1);
    expect(receivedFunctionStates).toEqual(['Pending', 'Pending', 'Inactive']);
  });

  test('Inactive function that goes to failed throws error', async () => {
    mockInvoke = async () => {
      if (invokeCount == 0) {
        invokeCount++;
        throw new Error('Better luck next time');
      }
      invokeCount++;
      return { Payload: req.Payload };
    };

    expectedFunctionStates.push('Failed');
    expectedFunctionStates.push('Pending');
    expectedFunctionStates.push('Pending');

    await expect(invokeFunction(req)).rejects.toThrowError(new Error('Broken'));
    expect(invokeCount).toEqual(1);
    expect(receivedFunctionStates).toEqual(['Pending', 'Pending', 'Failed']);
  });

  test('Inactive function that returns other value throws error', async () => {
    mockInvoke = async () => {
      if (invokeCount == 0) {
        invokeCount++;
        throw new Error('Better luck next time');
      }
      invokeCount++;
      return { Payload: req.Payload };
    };

    expectedFunctionStates.push('NewFunctionWhoDis');
    expectedFunctionStates.push('Pending');
    expectedFunctionStates.push('Pending');

    await expect(invokeFunction(req)).rejects.toThrowError(new Error('State is confused'));
    expect(invokeCount).toEqual(1);
    expect(receivedFunctionStates).toEqual(['Pending', 'Pending', 'NewFunctionWhoDis']);
  });

  test('Wait for stops on terminal responses', async () => {
    mockInvoke = async () => {
      if (invokeCount == 0) {
        invokeCount++;
        throw new Error('Better luck next time');
      }
      invokeCount++;
      return { Payload: req.Payload };
    };

    expectedFunctionStates.push('SomethingElse');
    expectedFunctionStates.push('Pending');
    expectedFunctionStates.push('Inactive');
    expectedFunctionStates.push('Pending');
    expectedFunctionStates.push('Pending');

    await expect(invokeFunction(req)).rejects.toThrowError(new Error('Not today'));
    expect(invokeCount).toEqual(1);
    expect(receivedFunctionStates).toEqual(['Pending', 'Pending', 'Inactive']);
  });
});

