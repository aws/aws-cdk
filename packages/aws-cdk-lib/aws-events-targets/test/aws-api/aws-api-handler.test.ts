/* eslint-disable no-console */
import * as SDK from 'aws-sdk';
import * as AWS from 'aws-sdk-mock';
import { AwsApiProps } from '../../lib';
import { handler } from '../../lib/aws-api-handler';

AWS.setSDK(require.resolve('aws-sdk'));

console.log = jest.fn();

const event: AwsApiProps = {
  service: 'ECS',
  action: 'updateService',
  parameters: {
    service: 'cool-service',
    forceNewDeployment: true,
  } as SDK.ECS.UpdateServiceRequest,
};

beforeEach(() => {
  AWS.restore();
});

test('calls the SDK with the right parameters', async () => {
  const updateServiceMock = jest.fn().mockResolvedValue({ success: true });

  AWS.mock('ECS', 'updateService', updateServiceMock);

  await handler(event);

  expect(updateServiceMock).toHaveBeenCalledWith({
    service: 'cool-service',
    forceNewDeployment: true,
  }, expect.any(Function));

  expect(console.log).toHaveBeenLastCalledWith('Response: %j', {
    success: true,
  });
});

test('throws and logs in case of error', async () => {
  const updateServiceMock = jest.fn().mockRejectedValue({ code: 'Error' });

  AWS.mock('ECS', 'updateService', updateServiceMock);

  await expect(handler(event)).rejects.toEqual({ code: 'Error' });

  expect(console.log).toHaveBeenLastCalledWith({ code: 'Error' });
});

test('catches and logs error', async () => {
  const catchEvent: AwsApiProps = {
    ...event,
    catchErrorPattern: 'Invalid',
  };

  const updateServiceMock = jest.fn().mockRejectedValue({ code: 'Invalid' });

  AWS.mock('ECS', 'updateService', updateServiceMock);

  await handler(catchEvent);

  expect(console.log).toHaveBeenLastCalledWith({ code: 'Invalid' });
});
