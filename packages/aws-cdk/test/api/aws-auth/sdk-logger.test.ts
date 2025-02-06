import { formatSdkLoggerContent, SdkToCliLogger } from '../../../lib/api/aws-auth/sdk-logger';

describe(SdkToCliLogger, () => {
  const ioHost = {
    notify: jest.fn(),
    requestResponse: jest.fn(),
  };
  const logger = new SdkToCliLogger(ioHost);

  beforeEach(() => {
    ioHost.notify.mockReset();
  });

  test.each(['trace', 'debug'] as Array<keyof SdkToCliLogger>)('%s method does not call notify', (method) => {
    logger[method]('SDK Logger test message');
    expect(ioHost.notify).not.toHaveBeenCalled();
  });

  test.each(['info', 'warn', 'error'] as Array<keyof SdkToCliLogger>)('%s method logs to notify', (method) => {
    logger[method]('SDK Logger test message');
    expect(ioHost.notify).toHaveBeenCalledWith(expect.objectContaining({
      level: 'trace',
      message: `[SDK ${method}] SDK Logger test message`,
    }));
  });
});

const SUCCESS_CALL = {
  clientName: 'S3Client',
  commandName: 'GetBucketLocationCommand',
  input: {
    Bucket: '.....',
    ExpectedBucketOwner: undefined,
  },
  output: { LocationConstraint: 'eu-central-1' },
  metadata: {
    httpStatusCode: 200,
    requestId: '....',
    extendedRequestId: '...',
    cfId: undefined,
    attempts: 2,
    totalRetryDelay: 30,
  },
};

const ERROR_CALL = {
  clientName: 'S3Client',
  commandName: 'GetBucketLocationCommand',
  input: {
    Bucket: '.....',
    ExpectedBucketOwner: undefined,
  },
  error: new Error('it failed'),
  metadata: {
    httpStatusCode: 200,
    attempts: 2,
    totalRetryDelay: 30,
  },
};

test('formatting a successful SDK call looks broadly reasonable', () => {
  const output = formatSdkLoggerContent([SUCCESS_CALL]);
  expect(output).toMatchSnapshot();
});

test('formatting a failing SDK call looks broadly reasonable', () => {
  const output = formatSdkLoggerContent([ERROR_CALL]);
  expect(output).toMatchSnapshot();
});

test('formatting a successful SDK call includes attempts and retries if greater than 1', () => {
  const output = formatSdkLoggerContent([SUCCESS_CALL]);
  expect(output).toContain('2 attempts');
  expect(output).toContain('30ms');
});

test('formatting a failing SDK call includes attempts and retries if greater than 1', () => {
  const output = formatSdkLoggerContent([ERROR_CALL]);
  expect(output).toContain('2 attempts');
  expect(output).toContain('30ms');
});

test('formatting a failing SDK call includes the error', () => {
  const output = formatSdkLoggerContent([ERROR_CALL]);
  expect(output).toContain('it failed');
});
