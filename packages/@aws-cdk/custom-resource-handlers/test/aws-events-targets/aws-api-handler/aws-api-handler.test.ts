/* eslint-disable no-console */
import { ECSClient, UpdateServiceCommand, UpdateServiceCommandInput, ServiceNotFoundException } from '@aws-sdk/client-ecs';
import { PutRecordsCommand, KinesisClient } from '@aws-sdk/client-kinesis';
import { EncryptCommand, KMSClient } from '@aws-sdk/client-kms';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest' ;
import { handler } from '../../../lib/aws-events-targets/aws-api-handler';

console.log = jest.fn();

const kinesisMock = mockClient(KinesisClient);
const kmsMock = mockClient(KMSClient);
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

test('can convert string parameters to Uint8Array when needed', async () => {
  kmsMock.on(EncryptCommand).resolves({
    CiphertextBlob: new TextEncoder().encode('dummy-data'),
    KeyId: 'key-id',
    EncryptionAlgorithm: 'SYMMETRIC_DEFAULT',
  });

  await handler({
    service: 'KMS',
    action: 'encrypt',
    parameters: {
      KeyId: 'key-id',
      Plaintext: 'dummy-data',
    },
  });

  expect(kmsMock).toHaveReceivedCommandWith(EncryptCommand, {
    KeyId: 'key-id',
    Plaintext: new Uint8Array([
      100, 117, 109, 109,
      121, 45, 100, 97,
      116, 97,
    ]),
  });
});

test('can convert string parameters to Uint8Array in arrays', async () => {
  kinesisMock.on(PutRecordsCommand).resolves({
    FailedRecordCount: 0,
    Records: [
      {
        SequenceNumber: '1',
        ShardId: '1',
      },
      {
        SequenceNumber: '2',
        ShardId: '1',
      },
    ],
    EncryptionType: 'NONE',
  });

  await handler({
    service: 'Kinesis',
    action: 'putRecords',
    parameters: {
      Records: [
        {
          Data: 'aaa',
          PartitionKey: 'key',
        },
        {
          Data: 'bbb',
          PartitionKey: 'key',
        },
      ],
    },
  });

  expect(kinesisMock).toHaveReceivedCommandWith(PutRecordsCommand, {
    Records: [
      {
        Data: new Uint8Array([97, 97, 97]),
        PartitionKey: 'key',
      },
      {
        Data: new Uint8Array([98, 98, 98]),
        PartitionKey: 'key',
      },
    ],
  });
});
