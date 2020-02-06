import { DestinationIdentifier, StandardManifestEntries } from '../../lib';

test('Type cast valid ManifestFileEntry', () => {
  const input = {
    id: new DestinationIdentifier('asset', 'dest'),
    type: 'file',
    source: {
      path: 'a/b/c',
    },
    destination: {
      region: 'us-north-20',
      bucketName: 'Bouquet',
      objectKey: 'key',
    },
  };

  expect(StandardManifestEntries.isFileEntry(input)).toBeTruthy();
});

test('Return false on non-file entry', () => {
  expect(StandardManifestEntries.isFileEntry({
    id: new DestinationIdentifier('asset', 'dest'),
    type: 'thing',
    source: {},
    destination: {},
  })).toBeFalsy();
});

test('Throw on invalid ManifestFileEntry', () => {
  const input = {
    id: new DestinationIdentifier('asset', 'dest'),
    type: 'file',
    source: {},
    destination: {},
  };

  expect(() => {
    StandardManifestEntries.isFileEntry(input);
  }).toThrow(/Expected key 'path' missing/);
});

test('Throw on invalid ManifestFileEntry type', () => {
  const input = {
    id: new DestinationIdentifier('asset', 'dest'),
    type: 'file',
    source: {
      path: 3
    },
    destination: {},
  };

  expect(() => {
    StandardManifestEntries.isFileEntry(input);
  }).toThrow(/Expected type of key 'path' to be 'string': got 'number'/);
});