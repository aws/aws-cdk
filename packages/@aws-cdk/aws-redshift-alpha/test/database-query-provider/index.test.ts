/* eslint-disable-next-line import/no-unresolved */
import type * as AWSLambda from 'aws-lambda';

const resourceProperties = {
  handler: 'table',
  ServiceToken: '',
};
const requestId = 'requestId';
const baseEvent: AWSLambda.CloudFormationCustomResourceEvent = {
  ResourceProperties: resourceProperties,
  RequestType: 'Create',
  ServiceToken: '',
  ResponseURL: '',
  StackId: '',
  RequestId: requestId,
  LogicalResourceId: '',
  ResourceType: '',
};

const mockSubHandler = jest.fn();
jest.mock('../../lib/private/database-query-provider/table', () => ({
  __esModule: true,
  handler: mockSubHandler,
}));
import { handler } from '../../lib/private/database-query-provider/index';

beforeEach(() => {
  jest.clearAllMocks();
});

test('calls sub handler', async () => {
  const event = baseEvent;

  await handler(event);

  expect(mockSubHandler).toHaveBeenCalled();
});

test('throws with unregistered subhandler', async () => {
  const event = {
    ...baseEvent,
    ResourceProperties: {
      ...resourceProperties,
      handler: 'unregistered',
    },
  };

  await expect(handler(event)).rejects.toThrow(/Requested handler unregistered is not in supported set/);
  expect(mockSubHandler).not.toHaveBeenCalled();
});
