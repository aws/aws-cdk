import { IKey, Key } from '../../aws-kms';
import { Stack } from '../../core';
import { TableEncryption, TableEncryptionV2 } from '../lib';

describe('dynamo owned key', () => {
  // GIVEN
  let encryption: TableEncryptionV2;
  beforeEach(() => {
    encryption = TableEncryptionV2.dynamoOwnedKey();
  });

  test('can render SSE specification', () => {
    // WHEN / THEN
    expect(encryption._renderSseSpecification()).toEqual({ sseEnabled: false });
  });

  test('replica SSE specification is undefined', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN / THEN
    expect(encryption._renderReplicaSseSpecification(stack, stack.region)).toBeUndefined();
  });

  test('encryption type is AWS_OWNED', () => {
    // WHEN / THEN
    expect(encryption.type).toEqual(TableEncryption.DEFAULT);
  });

  test('table key is undefined', () => {
    // WHEN / THEN
    expect(encryption.tableKey).toBeUndefined();
  });

  test('replica key ARNs are undefined', () => {
    // WHEN / THEN
    expect(encryption.replicaKeyArns).toBeUndefined();
  });
});

describe('aws managed key', () => {
  // GIVEN
  let encryption: TableEncryptionV2;
  beforeEach(() => {
    encryption = TableEncryptionV2.awsManagedKey();
  });

  test('can render SSE specification', () => {
    // WHEN / THEN
    expect(encryption._renderSseSpecification()).toEqual({ sseEnabled: true, sseType: 'KMS' });
  });

  test('replica SSE specification is undefined', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN / THEN
    expect(encryption._renderReplicaSseSpecification(stack, stack.region)).toBeUndefined();
  });

  test('encryption type is AWS_MANAGED', () => {
    // WHEN / THEN
    expect(encryption.type).toEqual('AWS_MANAGED');
  });

  test('table key is undefined', () => {
    // WHEN / THEN
    expect(encryption.tableKey).toBeUndefined();
  });

  test('replica key ARNs are undefined', () => {
    // WHEN / THEN
    expect(encryption.replicaKeyArns).toBeUndefined();
  });
});

describe('customer managed keys', () => {
  // GIVEN
  let encryption: TableEncryptionV2;
  let stack: Stack;
  let tableKey: IKey;
  let replicaKeyArns: { [region: string]: string };
  beforeEach(() => {
    stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    tableKey = new Key(stack, 'key');
    replicaKeyArns = {
      'us-east-1': 'arn:aws:kms:us-east-1:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
      'us-east-2': 'arn:aws:kms:us-east-2:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
    };
    encryption = TableEncryptionV2.customerManagedKey(tableKey, replicaKeyArns);
  });

  test('can render SSE specification', () => {
    // WHEN / THEN
    expect(encryption._renderSseSpecification()).toEqual({ sseEnabled: true, sseType: 'KMS' });
  });

  test('can render replica SSE specification in deployment region', () => {
    // WHEN / THEN
    expect(encryption._renderReplicaSseSpecification(stack, stack.region)).toEqual({
      kmsMasterKeyId: tableKey.keyArn,
    });
  });

  test('can render replica SSE specification in replica region', () => {
    // WHEN / THEN
    expect(encryption._renderReplicaSseSpecification(stack, 'us-east-1')).toEqual({
      kmsMasterKeyId: 'arn:aws:kms:us-east-1:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
    });
  });

  test('encryption type is CUSTOMER_MANAGED', () => {
    // WHEN / THEN
    expect(encryption.type).toEqual('CUSTOMER_MANAGED');
  });

  test('can get the table key', () => {
    // WHEN / THEN
    expect(encryption.tableKey?.keyArn).toEqual(tableKey.keyArn);
  });

  test('can get replica key ARNs', () => {
    // WHEN / THEN
    expect(encryption.replicaKeyArns).toEqual({
      'us-east-1': 'arn:aws:kms:us-east-1:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
      'us-east-2': 'arn:aws:kms:us-east-2:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
    });
  });

  test('render replica SSE specification throws in region agnostic stack', () => {
    // GIVEN
    const regionAgnosticStack = new Stack();

    // WHEN / THEN
    expect(() => {
      encryption._renderReplicaSseSpecification(regionAgnosticStack, 'us-east-1');
    }).toThrow('Replica SSE specification cannot be rendered in a region agnostic stack');
  });

  test('render replica SSE specification throws if deployment region is defined in replica key ARNs', () => {
    replicaKeyArns[stack.region] = 'arn:aws:kms:us-west-2:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6';

    // WHEN / THEN
    expect(() => {
      encryption._renderReplicaSseSpecification(stack, 'us-east-2');
    }).toThrow("KMS key for deployment region us-west-2 cannot be defined in 'replicaKeyArns'");
  });

  test('render replica SSE specification throws if region not defined in replica key ARNs', () => {
    // WHEN / THEN
    expect(() => {
      encryption._renderReplicaSseSpecification(stack, 'us-west-1');
    }).toThrow("KMS key for us-west-1 was not found in 'replicaKeyArns'");
  });
});
