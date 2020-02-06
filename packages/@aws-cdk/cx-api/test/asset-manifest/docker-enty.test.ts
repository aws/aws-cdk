import { DestinationIdentifier, StandardManifestEntries } from '../../lib';

test('Type cast valid ManifestDockerImageEntry', () => {
  const input = {
    id: new DestinationIdentifier('asset', 'dest'),
    type: 'docker-image',
    source: {
      directory: '.',
    },
    destination: {
      region: 'us-north-20',
      repositoryName: 'REPO',
      imageTag: 'TAG',
      imageUri: 'URI',
    },
  };

  expect(StandardManifestEntries.isDockerImageEntry(input)).toBeTruthy();
});

test('Return false on non-dockerimage entry', () => {
  expect(StandardManifestEntries.isDockerImageEntry({
    id: new DestinationIdentifier('asset', 'dest'),
    type: 'thing',
    source: {},
    destination: {},
  })).toBeFalsy();
});

test('Throw on invalid ManifestDockerImageEntry', () => {
  const input = {
    id: new DestinationIdentifier('asset', 'dest'),
    type: 'docker-image',
    source: {},
    destination: {},
  };

  expect(() => {
    StandardManifestEntries.isDockerImageEntry(input);
  }).toThrow(/Expected key 'directory' missing/);
});