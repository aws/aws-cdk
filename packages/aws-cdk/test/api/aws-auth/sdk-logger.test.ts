import { formatSdkLoggerContent, SdkToCliLogger } from '../../../lib/api/aws-auth/sdk-logger';
import * as logging from '../../../lib/logging';

describe(SdkToCliLogger, () => {
  const logger = new SdkToCliLogger();
  const trace = jest.spyOn(logging, 'trace');

  beforeEach(() => {
    trace.mockReset();
  });

  test.each(['trace', 'debug'] as Array<keyof SdkToCliLogger>)('%s method does not call trace', (meth) => {
    logger[meth]('test');
    expect(trace).not.toHaveBeenCalled();
  });

  test.each(['info', 'warn', 'error'] as Array<keyof SdkToCliLogger>)('%s method logs to trace', (meth) => {
    logger[meth]('test');
    expect(trace).toHaveBeenCalled();
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
