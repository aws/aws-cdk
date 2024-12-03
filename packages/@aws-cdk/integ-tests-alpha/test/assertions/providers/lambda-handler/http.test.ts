import { HttpHandler } from '../../../../lib/assertions/providers/lambda-handler/http';
import * as fetch from 'node-fetch';
import { HttpRequest } from '../../../../lib';

let fetchMock = jest.fn();
jest.mock('node-fetch');
const { Response } = jest.requireActual('node-fetch');

function httpHandler() {
  const context: any = {
    getRemainingTimeInMillis: () => 50000,
  };
  return new HttpHandler({} as any, context);
}

beforeAll(() => {
  jest.useFakeTimers();
  jest.spyOn(console, 'log').mockImplementation(() => { return true; });
});

afterAll(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

beforeEach(() => {
  fetchMock = (fetch as any).mockResolvedValue(
    new Response(
      JSON.stringify({ key: 'value' }),
      { status: 200, statusText: 'OK', ok: true }),
  );
});

describe('HttpHandler', () => {
  test('default', async () => {
    // GIVEN
    const request: HttpRequest = {
      parameters: {
        url: 'url',
      },
    };

    // WHEN
    const response = await processEvent(request);

    // THEN
    expect(response.apiCallResponse).toEqual({
      ok: true,
      body: {
        key: 'value',
      },
      headers: {
        'Content-Type': [
          'text/plain;charset=UTF-8',
        ],
      },
      status: 200,
      statusText: 'OK',
    });
    expect(fetchMock).toHaveBeenCalledWith('url', undefined);
  });

  test('with fetch options', async () => {
    // GIVEN
    const request: HttpRequest = {
      parameters: {
        url: 'url',
        fetchOptions: {
          body: JSON.stringify({ param: 'value1' }),
          method: 'POST',
          port: 8443,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      },
    };

    // WHEN
    const response = await processEvent(request);

    // THEN
    expect(response.apiCallResponse).toEqual({
      ok: true,
      body: {
        key: 'value',
      },
      headers: {
        'Content-Type': [
          'text/plain;charset=UTF-8',
        ],
      },
      status: 200,
      statusText: 'OK',
    });
    expect(fetchMock).toHaveBeenCalledWith('url', {
      body: JSON.stringify({ param: 'value1' }),
      method: 'POST',
      port: 8443,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  test('JSON is parsed', async () => {
    // GIVEN
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ key: 'value' }), { status: 200, statusText: 'OK', ok: true }),
    );

    // WHEN
    const response = await processEvent({ parameters: { url: 'x' } });

    // THEN
    expect(response.apiCallResponse.body).toEqual({ key: 'value' });
  });

  test('Non-JSON is not parsed', async () => {
    // GIVEN
    fetchMock.mockResolvedValue(
      new Response('this is a string', { status: 200, statusText: 'OK', ok: true }),
    );

    // WHEN
    const response = await processEvent({ parameters: { url: 'x' } });

    // THEN
    expect(response.apiCallResponse.body).toEqual('this is a string');
  });
});

function processEvent(request: HttpRequest): ReturnType<HttpHandler['processEvent']> {
  return (httpHandler() as any).processEvent(request);
}
