import * as mockfs from 'mock-fs';
import { AssetManifest, DestinationIdentifier, DestinationPattern } from '../../lib';

beforeEach(() => {
  mockfs({
    '/simple/cdk.out/assets.json': JSON.stringify({
      version: 'assets-1.0',
      assets: {
        asset1: {
          type: 'file',
          source: { src: 'S1' },
          destinations: {
            dest1: { dst: 'D1' },
            dest2: { dst: 'D2' },
          },
        },
        asset2: {
          type: 'thing',
          source: { src: 'S2' },
          destinations: {
            dest1: { dst: 'D3' },
            dest2: { dst: 'D4' },
          },
        },
      },
    })
  });
});

afterEach(() => {
  mockfs.restore();
});

test('Can list manifest', () => {
  const manifest = AssetManifest.fromPath('/simple/cdk.out');
  expect(manifest.list().join('\n')).toEqual(`
asset1 file {"src":"S1"}
  ├ asset1:dest1 {"dst":"D1"}
  └ asset1:dest2 {"dst":"D2"}
asset2 thing {"src":"S2"}
  ├ asset2:dest1 {"dst":"D3"}
  └ asset2:dest2 {"dst":"D4"}
`.trim());
});

test('.entries() iterates over all destinations', () => {
  const manifest = AssetManifest.fromPath('/simple/cdk.out');

  expect(manifest.entries).toEqual([
    {
      destination: { dst: "D1" },
      id: new DestinationIdentifier('asset1', 'dest1'),
      source: { src: "S1" },
      type: "file",
    },
    {
      destination: { dst: "D2", },
      id: new DestinationIdentifier('asset1', 'dest2'),
      source: { src: "S1", },
      type: "file",
    },
    {
      destination: { dst: "D3", },
      id: new DestinationIdentifier('asset2', 'dest1'),
      source: { src: "S2", },
      type: "thing",
    },
    {
      destination: { dst: "D4", },
      id: new DestinationIdentifier('asset2', 'dest2'),
      source: { src: "S2", },
      type: "thing",
    },
  ]);
});

test('can select by asset ID', () => {
  const manifest = AssetManifest.fromPath('/simple/cdk.out');

  const subset = manifest.select([DestinationPattern.parse('asset2')]);

  expect(subset.entries.map(e => e.destination.dst)).toEqual(['D3', 'D4']);
});

test('can select by asset ID + destination ID', () => {
  const manifest = AssetManifest.fromPath('/simple/cdk.out');

  const subset = manifest.select([
    DestinationPattern.parse('asset1:dest1'),
    DestinationPattern.parse('asset2:dest2'),
  ]);

  expect(subset.entries.map(e => e.destination.dst)).toEqual(['D1', 'D4']);
});

test('can select by destination ID', () => {
  const manifest = AssetManifest.fromPath('/simple/cdk.out');

  const subset = manifest.select([
    DestinationPattern.parse(':dest1'),
  ]);

  expect(subset.entries.map(e => e.destination.dst)).toEqual(['D1', 'D3']);
});

test('empty string is not a valid pattern', () => {
  expect(() => {
    DestinationPattern.parse('');
  }).toThrow(/Empty string is not a valid destination identifier/);
});

test('pattern must have two components', () => {
  expect(() => {
    DestinationPattern.parse('a:b:c');
  }).toThrow(/Asset identifier must contain at most 2/);
});