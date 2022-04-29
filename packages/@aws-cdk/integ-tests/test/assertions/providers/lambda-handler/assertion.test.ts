import { AssertionRequest, AssertionResult, AssertionType } from '../../../../lib/assertions';
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
  describe('objectLike', () => {
    test('pass', async () => {
      // GIVEN
      const handler = assertionHandler() as any;
      const request: AssertionRequest = {
        assertionType: AssertionType.OBJECT_LIKE,
        actual: {
          stringParam: 'foo',
          numberParam: 3,
          booleanParam: true,
        },
        expected: JSON.stringify({
          stringParam: 'foo',
        }),
      };

      // WHEN
      const response: AssertionResult = await handler.processEvent(request);

      // THEN
      expect(response.data).toEqual('{"status":"pass"}');
    });

    test('fail', async () => {
      // GIVEN
      const handler = assertionHandler() as any;
      const request: AssertionRequest = {
        assertionType: AssertionType.OBJECT_LIKE,
        actual: {
          stringParam: 'foo',
          numberParam: 3,
          booleanParam: true,
        },
        expected: JSON.stringify({
          stringParam: 'bar',
        }),
      };

      // WHEN
      const response: AssertionResult = await handler.processEvent(request);

      // THEN
      expect(JSON.parse(response.data)).toEqual({
        status: 'fail',
        message: 'Expected bar but received foo at /stringParam (using objectLike matcher)\n' +
          '{\n  \"stringParam\": \"foo\",\n  \"numberParam\": 3,\n  \"booleanParam\": true\n}',
      });
    });
  });

  describe('equals', () => {
    test('pass', async () => {
      // GIVEN
      const handler = assertionHandler() as any;
      const request: AssertionRequest = {
        assertionType: AssertionType.EQUALS,
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
      expect(response.data).toEqual('{"status":"pass"}');
    });

    test('string equals pass', async () => {
      // GIVEN
      const handler = assertionHandler() as any;
      const request: AssertionRequest = {
        assertionType: AssertionType.EQUALS,
        actual: 'foo',
        expected: 'foo',
      };

      // WHEN
      const response: AssertionResult = await handler.processEvent(request);

      // THEN
      expect(response.data).toEqual('{"status":"pass"}');
    });

    test('fail', async () => {
      // GIVEN
      const handler = assertionHandler() as any;
      const request: AssertionRequest = {
        assertionType: AssertionType.EQUALS,
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
      expect(JSON.parse(response.data)).toEqual({
        status: 'fail',
        message: 'Expected bar but received foo at /stringParam (using exact matcher)\n{\n  \"stringParam\": \"foo\"\n}',
      });
    });
  });

  test('unsupported query', async () => {
    // GIVEN
    const handler = assertionHandler() as any;
    const assertionType: any = 'somethingElse';
    const request: AssertionRequest = {
      assertionType,
      actual: 'foo',
      expected: JSON.stringify({ foo: 'bar' }),
    };

    // THEN
    await expect(handler.processEvent(request)).rejects.toThrow(/Unsupported query type/);
  });
});
