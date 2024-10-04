import { ListAliasesCommand } from '@aws-sdk/client-kms';
import { KeyContextProviderPlugin } from '../../lib/context-providers/keys';
import { MockSdkProvider, mockKMSClient, restoreSdkMocksToDefault } from '../util/mock-sdk';

let provider: KeyContextProviderPlugin;

beforeEach(() => {
  provider = new KeyContextProviderPlugin(new MockSdkProvider());
  restoreSdkMocksToDefault();
});

test('looks up the requested Key - single result', async () => {
  // GIVEN
  mockKMSClient.on(ListAliasesCommand).resolves({
    Aliases: [
      {
        AliasName: 'alias/foo',
        TargetKeyId: '1234abcd-12ab-34cd-56ef-123456789000',
      },
    ],
  });

  // WHEN
  const result = await provider.getValue({
    account: '123456789012',
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
  mockKMSClient.on(ListAliasesCommand).resolves({
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

  // WHEN
  const result = await provider.getValue({
    account: '123456789012',
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
  mockKMSClient
    .on(ListAliasesCommand)
    .resolvesOnce({
      NextMarker: 'nextMarker',
      Truncated: true,
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
    })
    .resolvesOnce({
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

  // WHEN
  const result = await provider.getValue({
    account: '123456789012',
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
  mockKMSClient.on(ListAliasesCommand).resolves({
    Aliases: [],
  });

  // WHEN
  await expect(
    provider.getValue({
      account: '123456789012',
      region: 'us-east-1',
      aliasName: 'alias/foo',
    }),
  ).rejects.toThrow(/Could not find any key with alias named/);
});
