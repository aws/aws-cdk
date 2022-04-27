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
        expected: {
          stringParam: 'foo',
          numberParam: 3,
          booleanParam: true,
        },
      };

      // WHEN
      const response: AssertionResult = await handler.processEvent(request);

      // THEN
      expect(response.data.status).toEqual('pass');
    });

    test('fail', async () => {
      // GIVEN
      const handler = assertionHandler() as any;
      const request: AssertionRequest = {
        assertionType: AssertionType.EQUALS,
        actual: {
          stringParam: 'foo',
        },
        expected: {
          stringParam: 'bar',
        },
      };

      // WHEN
      const response: AssertionResult = await handler.processEvent(request);

      // THEN
      expect(response.data.status).toEqual('fail');
    });
  });

  test('unsupported query', async () => {
    // GIVEN
    const handler = assertionHandler() as any;
    const assertionType: any = 'somethingElse';
    const request: AssertionRequest = {
      assertionType,
      actual: 'foo',
      expected: 'bar',
    };

    // THEN
    await expect(handler.processEvent(request)).rejects.toThrow(/Unsupported query type/);
  });
});
