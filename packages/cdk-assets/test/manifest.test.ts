import { Manifest } from '@aws-cdk/cloud-assembly-schema';
import * as mockfs from 'mock-fs';
import { AssetManifest, DestinationIdentifier, DestinationPattern, DockerImageManifestEntry, FileManifestEntry } from '../lib';

beforeEach(() => {
  mockfs({
    '/simple/cdk.out/assets.json': JSON.stringify({
      version: Manifest.version(),
      files: {
        asset1: {
          type: 'file',
          source: { path: 'S1' },
          destinations: {
            dest1: { bucketName: 'D1', objectKey: 'X' },
            dest2: { bucketName: 'D2', objectKey: 'X' },
          },
        },
      },
      dockerImages: {
        asset2: {
          type: 'thing',
          source: { directory: 'S2' },
          destinations: {
            dest1: { repositoryName: 'D3', imageTag: 'X' },
            dest2: { repositoryName: 'D4', imageTag: 'X' },
          },
        },
      },
    }),
  });
});

afterEach(() => {
  mockfs.restore();
});

test('Can list manifest', () => {
  const manifest = AssetManifest.fromPath('/simple/cdk.out');
  expect(manifest.list().join('\n')).toEqual(`
asset1 file {\"path\":\"S1\"}
  ├ asset1:dest1 {\"bucketName\":\"D1\",\"objectKey\":\"X\"}
  └ asset1:dest2 {\"bucketName\":\"D2\",\"objectKey\":\"X\"}
asset2 docker-image {\"directory\":\"S2\"}
  ├ asset2:dest1 {\"repositoryName\":\"D3\",\"imageTag\":\"X\"}
  └ asset2:dest2 {\"repositoryName\":\"D4\",\"imageTag\":\"X\"}
`.trim());
});

test('.entries() iterates over all destinations', () => {
  const manifest = AssetManifest.fromPath('/simple/cdk.out');

  expect(manifest.entries).toEqual([
    new FileManifestEntry(new DestinationIdentifier('asset1', 'dest1'), { path: 'S1' }, { bucketName: 'D1', objectKey: 'X' }),
    new FileManifestEntry(new DestinationIdentifier('asset1', 'dest2'), { path: 'S1' }, { bucketName: 'D2', objectKey: 'X' }),
    new DockerImageManifestEntry(new DestinationIdentifier('asset2', 'dest1'), { directory: 'S2' }, { repositoryName: 'D3', imageTag: 'X' }),
    new DockerImageManifestEntry(new DestinationIdentifier('asset2', 'dest2'), { directory: 'S2' }, { repositoryName: 'D4', imageTag: 'X' }),
  ]);
});

test('can select by asset ID', () => {
  const manifest = AssetManifest.fromPath('/simple/cdk.out');

  const subset = manifest.select([DestinationPattern.parse('asset2')]);

  expect(subset.entries.map(e => f(e.genericDestination, 'repositoryName'))).toEqual(['D3', 'D4']);
});

test('can select by asset ID + destination ID', () => {
  const manifest = AssetManifest.fromPath('/simple/cdk.out');

  const subset = manifest.select([
    DestinationPattern.parse('asset1:dest1'),
    DestinationPattern.parse('asset2:dest2'),
  ]);

  expect(subset.entries.map(e => f(e.genericDestination, 'repositoryName', 'bucketName'))).toEqual(['D1', 'D4']);
});

test('can select by destination ID', () => {
  const manifest = AssetManifest.fromPath('/simple/cdk.out');

  const subset = manifest.select([
    DestinationPattern.parse(':dest1'),
  ]);

  expect(subset.entries.map(e => f(e.genericDestination, 'repositoryName', 'bucketName'))).toEqual(['D1', 'D3']);
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

test('parse ASSET:* the same as ASSET and ASSET:', () => {
  expect(DestinationPattern.parse('a:*')).toEqual(DestinationPattern.parse('a'));
  expect(DestinationPattern.parse('a:*')).toEqual(DestinationPattern.parse('a:'));
});

test('parse *:DEST the same as :DEST', () => {
  expect(DestinationPattern.parse('*:a')).toEqual(DestinationPattern.parse(':a'));
});

function f(obj: unknown, ...keys: string[]): any {
  for (const k of keys) {
    if (typeof obj === 'object' && obj !== null && k in obj) {
      return (obj as any)[k];
    }
  }
  return undefined;
}
