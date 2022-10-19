import * as aws from 'aws-sdk';
import * as AWS from 'aws-sdk-mock';
import { KeyContextProviderPlugin } from '../../lib/context-providers/keys';
import { MockSdkProvider } from '../util/mock-sdk';

AWS.setSDK(require.resolve('aws-sdk'));
const mockSDK = new MockSdkProvider();
type AwsCallback<T> = (err: Error | null, val: T) => void;

afterEach(done => {
  AWS.restore();
  done();
});

test('looks up the requested Key - single result', async () => {
  // GIVEN
  const provider = new KeyContextProviderPlugin(mockSDK);

  AWS.mock('KMS', 'listAliases', (params: aws.KMS.ListAliasesRequest, cb: AwsCallback<aws.KMS.ListAliasesResponse>) => {
    expect(params.KeyId).toBeUndefined();
    return cb(null, {
      Aliases: [
        {
          AliasName: 'alias/foo',
          TargetKeyId: '1234abcd-12ab-34cd-56ef-123456789000',
        },
      ],
    });
  });

  // WHEN
  const result = await provider.getValue({
    account: '1234',
    region: 'us-east-1',
    aliasName: 'alias/foo',
  });

  // THEN
  expect(result).toEqual({
    keyId: '1234abcd-12ab-34cd-56ef-123456789000',
  });
});

test('looks up the requested Key - multiple results', async () => {
  // GIVEN
  const provider = new KeyContextProviderPlugin(mockSDK);

  AWS.mock('KMS', 'listAliases', (params: aws.KMS.ListAliasesRequest, cb: AwsCallback<aws.KMS.ListAliasesResponse>) => {
    expect(params.KeyId).toBeUndefined();
    return cb(null, {
      Aliases: [
        {
          AliasName: 'alias/bar',
          TargetKeyId: '1234abcd-12ab-34cd-56ef-123456789000',
        },
        {
          AliasName: 'alias/foo',
          TargetKeyId: '1234abcd-12ab-34cd-56ef-123456789001',
        },
        {
          AliasName: 'alias/fooBar',
          TargetKeyId: '1234abcd-12ab-34cd-56ef-123456789002',
        },
      ],
    });
  });

  // WHEN
  const result = await provider.getValue({
    account: '1234',
    region: 'us-east-1',
    aliasName: 'alias/foo',
  });

  // THEN
  expect(result).toEqual({
    keyId: '1234abcd-12ab-34cd-56ef-123456789001',
  });
});


test('looks up the requested Key - multiple results with pagination', async () => {
  // GIVEN
  const provider = new KeyContextProviderPlugin(mockSDK);

  AWS.mock('KMS', 'listAliases', (params: aws.KMS.ListAliasesRequest, cb: AwsCallback<aws.KMS.ListAliasesResponse>) => {
    if (!params.Marker) {
      return cb(null, {
        Truncated: true,
        NextMarker: 'nextMarker',
        Aliases: [
          {
            AliasName: 'alias/key1',
            TargetKeyId: '1234abcd-12ab-34cd-56ef-123456789000',
          },
          {
            AliasName: 'alias/key2',
            TargetKeyId: '1234abcd-12ab-34cd-56ef-123456789001',
          },
          {
            AliasName: 'alias/key3',
            TargetKeyId: '1234abcd-12ab-34cd-56ef-123456789002',
          },
        ],
      });
    } else if (params.Marker == 'nextMarker') {
      return cb(null, {
        Aliases: [
          {
            AliasName: 'alias/key4',
            TargetKeyId: '1234abcd-12ab-34cd-56ef-123456789003',
          },
          {
            AliasName: 'alias/foo',
            TargetKeyId: '1234abcd-12ab-34cd-56ef-123456789004',
          },
          {
            AliasName: 'alias/key5',
            TargetKeyId: '1234abcd-12ab-34cd-56ef-123456789005',
          },
        ],
      });
    }
  });

  // WHEN
  const result = await provider.getValue({
    account: '1234',
    region: 'us-east-1',
    aliasName: 'alias/foo',
  });

  // THEN
  expect(result).toEqual({
    keyId: '1234abcd-12ab-34cd-56ef-123456789004',
  });
});

test('throw exception - no key found', async () => {
  // GIVEN
  const provider = new KeyContextProviderPlugin(mockSDK);

  AWS.mock('KMS', 'listAliases', (params: aws.KMS.ListAliasesRequest, cb: AwsCallback<aws.KMS.ListAliasesResponse>) => {
    expect(params.KeyId).toBeUndefined();
    return cb(null, {
    });
  });

  // WHEN
  await expect(provider.getValue({
    account: '1234',
    region: 'us-east-1',
    aliasName: 'alias/foo',
  })).rejects.toThrow(/Could not find any key with alias named/);

});