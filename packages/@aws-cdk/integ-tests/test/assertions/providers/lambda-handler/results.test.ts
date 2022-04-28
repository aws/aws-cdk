// Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
import { ResultsCollectionRequest, ResultsCollectionResult } from '../../../../lib/assertions';
import { ResultsCollectionHandler } from '../../../../lib/assertions/providers/lambda-handler/results';

function handler() {
  const context: any = {
    getRemainingTimeInMillis: () => 50000,
  };
  return new ResultsCollectionHandler({} as any, context); // as any to ignore all type checks
}
beforeAll(() => {
  jest.useFakeTimers();
  jest.spyOn(process.stderr, 'write').mockImplementation(() => { return true; });
  jest.spyOn(process.stdout, 'write').mockImplementation(() => { return true; });
});
afterAll(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('ResultsCollectionHandler', () => {
  test('default', async () => {
    // GIVEN
    const resultsCollection = handler() as any;
    const request: ResultsCollectionRequest = {
      assertionResults: [
        { status: 'pass' },
        { status: 'fail', message: 'something failed' },
      ],
    };

    // WHEN
    const result: ResultsCollectionResult = await resultsCollection.processEvent(request);
    const split = result.message.split('\n');

    // THEN
    expect(split.length).toEqual(2);
    expect(split[0]).toEqual('Test0: pass');
    expect(split[1]).toEqual('Test1: fail - something failed');
  });

  test('message not displayed for pass', async () => {
    // GIVEN
    const resultsCollection = handler() as any;
    const request: ResultsCollectionRequest = {
      assertionResults: [
        { status: 'pass', message: 'OK' },
      ],
    };

    // WHEN
    const result: ResultsCollectionResult = await resultsCollection.processEvent(request);
    const split = result.message.split('\n');

    // THEN
    expect(split.length).toEqual(1);
    expect(split[0]).toEqual('Test0: pass');
  });
});
