import * as https from 'https';
import { httpRequest, withRetries } from '../lib/utils';

jest.mock('https');

describe('withRetries', () => {
  beforeEach(() => {
    // make backoff sleeps instantaneous and deterministic
    jest.spyOn(Math, 'random').mockReturnValue(0);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('returns the result without retrying when the function succeeds', async () => {
    const fn = jest.fn().mockResolvedValue('ok');

    const result = await withRetries({ attempts: 5, sleep: 1 }, fn)();

    expect(result).toEqual('ok');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('retries and eventually succeeds', async () => {
    const fn = jest.fn()
      .mockRejectedValueOnce(new Error('transient'))
      .mockRejectedValueOnce(new Error('transient'))
      .mockResolvedValue('ok');

    const result = await withRetries({ attempts: 5, sleep: 1 }, fn)();

    expect(result).toEqual('ok');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  test('throws the last error after exhausting all attempts', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('always fails'));

    // attempts: 3 => 1 initial call + 3 retries = 4 invocations
    await expect(withRetries({ attempts: 3, sleep: 1 }, fn)()).rejects.toThrow('always fails');
    expect(fn).toHaveBeenCalledTimes(4);
  });
});

describe('httpRequest', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    (https.request as jest.Mock).mockReset();
  });

  test('resolves on a successful (< 400) response', async () => {
    (https.request as jest.Mock).mockImplementation((_options: any, cb: any) => {
      cb({ statusCode: 200, resume: jest.fn() });
      return { on: jest.fn(), write: jest.fn(), end: jest.fn() };
    });

    await expect(httpRequest({}, 'body')).resolves.toBeUndefined();
  });

  test('rejects on a >= 400 response', async () => {
    (https.request as jest.Mock).mockImplementation((_options: any, cb: any) => {
      cb({ statusCode: 500, resume: jest.fn() });
      return { on: jest.fn(), write: jest.fn(), end: jest.fn() };
    });

    await expect(httpRequest({}, 'body')).rejects.toThrow('Unsuccessful HTTP response: 500');
  });

  test('rejects on a network error', async () => {
    (https.request as jest.Mock).mockImplementation((_options: any, _cb: any) => {
      return {
        on: (event: string, handler: (e: Error) => void) => {
          if (event === 'error') {
            handler(new Error('socket hang up'));
          }
        },
        write: jest.fn(),
        end: jest.fn(),
      };
    });

    await expect(httpRequest({}, 'body')).rejects.toThrow('socket hang up');
  });
});
