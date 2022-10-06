import { AssertionRequest, AssertionResult, ExpectedResult } from '../../../../lib/assertions';
import { Match } from '../../../../lib/assertions/match';
import { AssertionHandler } from '../../../../lib/assertions/providers/lambda-handler/assertion';

function assertionHandler() {
  const context: any = {
    getRemainingTimeInMillis: () => 50000,
  };
  return new AssertionHandler({} as any, context); // as any to ignore all type checks
}

beforeAll(() => {
  jest.useFakeTimers();
  jest.spyOn(console, 'log').mockImplementation(() => { return true; });
});
afterAll(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('AssertionHandler', () => {
  test('report failure', async () => {
    // GIVEN
    const handler = assertionHandler() as any;
    const request: AssertionRequest = {
      actual: 'this is the actual results',
      expected: ExpectedResult.stringLikeRegexp('abcd').result,
      failDeployment: true,
    };

    // THEN
    let failed: Error = new Error();
    try {
      await handler.processEvent(request);
    } catch (e) {
      failed = e;
    }
    expect(failed.message).toMatch(/String 'this is the actual results' did not match pattern 'abcd' (using stringLikeRegexp matcher)*/);
  });
  describe('stringLike', () => {
    test('pass', async () => {
      // GIVEN
      const handler = assertionHandler() as any;
      const request: AssertionRequest = {
        actual: 'this is the actual results',
        expected: ExpectedResult.stringLikeRegexp('this is').result,
      };

      // WHEN
      const response: AssertionResult = await handler.processEvent(request);

      // THEN
      expect(response.assertion).toEqual('{"status":"success"}');
    });

    test('fail', async () => {
      // GIVEN
      const handler = assertionHandler() as any;
      const request: AssertionRequest = {
        actual: 'this is the actual results',
        expected: ExpectedResult.stringLikeRegexp('abcd').result,
      };

      // WHEN
      const response: AssertionResult = await handler.processEvent(request);

      // THEN
      expect(JSON.parse(response.assertion)).toEqual({
        status: 'fail',
        message: expect.stringMatching(/String 'this is the actual results' did not match pattern 'abcd' (using stringLikeRegexp matcher)*/),
      });
    });
  });
  describe('arrayWith', () => {
    test('pass', async () => {
      // GIVEN
      const handler = assertionHandler() as any;
      const request: AssertionRequest = {
        actual: [
          {
            Elements: [{ Asdf: 3 }, { Asdf: 4 }],
          },
          {
            Elements: [{ Asdf: 2 }, { Asdf: 1 }],
          },
        ],
        expected: ExpectedResult.arrayWith([
          {
            Elements: Match.arrayWith([{ Asdf: 3 }]),
          },
        ]).result,
      };

      // WHEN
      const response: AssertionResult = await handler.processEvent(request);

      // THEN
      expect(response.assertion).toEqual('{"status":"success"}');
    });

    test('fail', async () => {
      // GIVEN
      const handler = assertionHandler() as any;
      const request: AssertionRequest = {
        actual: [
          {
            Elements: [{ Asdf: 5 }, { Asdf: 4 }],
          },
          {
            Elements: [{ Asdf: 2 }, { Asdf: 1 }],
          },
        ],
        expected: ExpectedResult.arrayWith([
          {
            Elements: [{ Asdf: 3 }],
          },
        ]).result,
      };

      // WHEN
      const response: AssertionResult = await handler.processEvent(request);

      // THEN
      expect(JSON.parse(response.assertion)).toEqual({
        status: 'fail',
        message: expect.stringMatching(/Missing element at pattern index 0 (using arrayWith matcher)*/),
      });
    });
  });

  describe('objectLike', () => {
    test('pass', async () => {
      // GIVEN
      const handler = assertionHandler() as any;
      const request: AssertionRequest = {
        actual: {
          Message: [
            {
              OtherKey: 'value',
              Payload: 'some status',
              Body: {
                OtherKey: 4,
                Elements: [{ Asdf: 3 }, { Asdf: 4 }],
              },
            },
          ],
        },
        expected: ExpectedResult.objectLike({
          Message: [{
            Payload: Match.stringLikeRegexp('status'),
            Body: Match.objectLike({
              Elements: Match.arrayWith([{ Asdf: 3 }]),
            }),
          }],
        }).result,
      };

      // WHEN
      const response: AssertionResult = await handler.processEvent(request);

      // THEN
      expect(response.assertion).toEqual('{"status":"success"}');
    });

    test('fail', async () => {
      // GIVEN
      const handler = assertionHandler() as any;
      const request: AssertionRequest = {
        actual: {
          stringParam: 'foo',
          numberParam: 3,
          booleanParam: true,
        },
        expected: ExpectedResult.objectLike({
          stringParam: 'bar',
        }).result,
      };

      // WHEN
      const response: AssertionResult = await handler.processEvent(request);

      // THEN
      expect(JSON.parse(response.assertion)).toEqual({
        status: 'fail',
        message: 'Expected bar but received foo at /stringParam (using objectLike matcher)\n' +
          '{\n  \"stringParam\": \"foo\",\n  \"numberParam\": 3,\n  \"booleanParam\": true\n}',
      });
    });
  });

  describe('not using Match', () => {
    test('pass', async () => {
      // GIVEN
      const handler = assertionHandler() as any;
      const request: AssertionRequest = {
        actual: {
          stringParam: 'foo',
          numberParam: 3,
          booleanParam: true,
        },
        expected: JSON.stringify({
          stringParam: 'foo',
          numberParam: 3,
          booleanParam: true,
        }),
      };

      // WHEN
      const response: AssertionResult = await handler.processEvent(request);

      // THEN
      expect(response.assertion).toEqual('{"status":"success"}');
    });

    test('string equals pass', async () => {
      // GIVEN
      const handler = assertionHandler() as any;
      const request: AssertionRequest = {
        actual: 'foo',
        expected: 'foo',
      };

      // WHEN
      const response: AssertionResult = await handler.processEvent(request);

      // THEN
      expect(response.assertion).toEqual('{"status":"success"}');
    });

    test('fail', async () => {
      // GIVEN
      const handler = assertionHandler() as any;
      const request: AssertionRequest = {
        actual: {
          stringParam: 'foo',
        },
        expected: JSON.stringify({
          stringParam: 'bar',
        }),
      };

      // WHEN
      const response: AssertionResult = await handler.processEvent(request);

      // THEN
      expect(JSON.parse(response.assertion)).toEqual({
        status: 'fail',
        message: 'Expected bar but received foo at /stringParam (using exact matcher)\n{\n  \"stringParam\": \"foo\"\n}',
      });
    });
  });
});
