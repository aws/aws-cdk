/* eslint-disable no-console */
import { ECSClient, UpdateServiceCommand, UpdateServiceCommandInput, ServiceNotFoundException } from '@aws-sdk/client-ecs';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest' ;
import { handler } from '../../../lib/aws-events-targets/aws-api-handler';

console.log = jest.fn();

const ecsMock = mockClient(ECSClient);
const event = {
  service: 'ECS',
  action: 'updateService',
  parameters: {
    service: 'cool-service',
    forceNewDeployment: true,
  } as UpdateServiceCommandInput,
};

beforeEach(() => {
  ecsMock.reset();
});

test('calls the SDK with the right parameters', async () => {
  ecsMock.on(UpdateServiceCommand).resolves({
    service: {
      serviceName: 'cool-service',
    },
  });

  await handler(event);

  expect(ecsMock).toHaveReceivedCommandWith(UpdateServiceCommand, {
    service: 'cool-service',
    forceNewDeployment: true,
  });
  expect(console.log).toHaveBeenLastCalledWith('Response: %j', {
    service: {
      serviceName: 'cool-service',
    },
  });
});

test('throws and logs in case of error', async () => {
  ecsMock.on(UpdateServiceCommand).rejects(new ServiceNotFoundException({
    $metadata: {},
    message: 'error',
  }));
  await expect(handler(event)).rejects.toThrow(expect.objectContaining({
    name: 'ServiceNotFoundException',
  }));

  expect(console.log).toHaveBeenLastCalledWith(expect.objectContaining({
    name: 'ServiceNotFoundException',
  }));
});

test('catches and logs error', async () => {
  const catchEvent = {
    ...event,
    catchErrorPattern: 'ServiceNotFoundException',
  };

  ecsMock.on(UpdateServiceCommand).rejects(new ServiceNotFoundException({
    $metadata: {},
    message: 'error',
  }));

  await handler(catchEvent);

  expect(console.log).toHaveBeenLastCalledWith(expect.objectContaining({
    name: 'ServiceNotFoundException',
  }));
});
