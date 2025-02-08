import { ListExportsCommand } from '@aws-sdk/client-cloudformation';
import { LazyLookupExport } from '../../lib/api/evaluate-cloudformation-template';
import { MockSdk, mockCloudFormationClient, restoreSdkMocksToDefault } from '../util/mock-sdk';

describe('LazyLookupExport', () => {
  const mockSdk = new MockSdk();

  beforeEach(() => {
    restoreSdkMocksToDefault();
  });

  const createExport = (num: number) => ({
    ExportingStackId: `test-exporting-stack-id-${num}`,
    Name: `test-name-${num}`,
    Value: `test-value-${num}`,
  });

  it('skips over any results that omit Name property', async () => {
    mockCloudFormationClient.on(ListExportsCommand).resolvesOnce({
      Exports: [
        createExport(1),
        createExport(2),
        {
          Value: 'value-without-name',
        },
        createExport(3),
      ],
      NextToken: undefined,
    });

    const lookup = new LazyLookupExport(mockSdk);

    const result = await lookup.lookupExport('test-name-3');
    expect(result?.Value).toEqual('test-value-3');
  });

  describe('three pages of exports', () => {
    let lookup: LazyLookupExport;
    beforeEach(() => {
      lookup = new LazyLookupExport(mockSdk);
      mockCloudFormationClient
        .on(ListExportsCommand)
        .resolvesOnce({
          Exports: [createExport(1), createExport(2), createExport(3)],
          NextToken: 'next-token-1',
        })
        .resolvesOnce({
          Exports: [createExport(4), createExport(5), createExport(6)],
          NextToken: 'next-token-2',
        })
        .resolvesOnce({
          Exports: [createExport(7), createExport(8)],
          NextToken: undefined,
        });
    });

    it('returns the matching export', async () => {
      const name = 'test-name-3';
      const result = await lookup.lookupExport(name);
      expect(result?.Name).toEqual(name);
      expect(result?.Value).toEqual('test-value-3');
    });

    it('stops fetching once export is found', async () => {
      await lookup.lookupExport('test-name-3');
      expect(mockCloudFormationClient).toHaveReceivedCommandTimes(ListExportsCommand, 1);
    });

    it('paginates', async () => {
      await lookup.lookupExport('test-name-7');
      expect(mockCloudFormationClient).toHaveReceivedCommandTimes(ListExportsCommand, 3);
      expect(mockCloudFormationClient).toHaveReceivedCommandWith(ListExportsCommand, {
        NextToken: 'next-token-1',
      });
      expect(mockCloudFormationClient).toHaveReceivedCommandWith(ListExportsCommand, {
        NextToken: 'next-token-2',
      });
    });

    it('caches the calls to CloudFormation API', async () => {
      await lookup.lookupExport('test-name-3');
      await lookup.lookupExport('test-name-3');
      await lookup.lookupExport('test-name-3');
      expect(mockCloudFormationClient).toHaveReceivedCommandTimes(ListExportsCommand, 1);
    });

    it('returns undefined if the export does not exist', async () => {
      const result = await lookup.lookupExport('test-name-unknown');
      expect(result).toBeUndefined();
    });
  });
});
