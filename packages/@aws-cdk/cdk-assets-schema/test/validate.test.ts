import { AssetManifestSchema } from '../lib';

test('Correctly validate Docker image asset', () => {
  expect(() => {
    AssetManifestSchema.validate({
      version: AssetManifestSchema.currentVersion(),
      dockerImages: {
        asset: {
          source: {
            directory: '.',
          },
          destinations: {
            dest: {
              region: 'us-north-20',
              repositoryName: 'REPO',
              imageTag: 'TAG',
            },
          },
        },
      },
    });
  }).not.toThrow();
});

test('Throw on invalid Docker image asset', () => {
  expect(() => {
    AssetManifestSchema.validate({
      version: AssetManifestSchema.currentVersion(),
      dockerImages: {
        asset: {
          source: { },
          destinations: { },
        },
      },
    });
  }).toThrow(/dockerImages: source: Expected key 'directory' missing/);
});

test('Correctly validate File asset', () => {
  expect(() => {
    AssetManifestSchema.validate({
      version: AssetManifestSchema.currentVersion(),
      files: {
        asset: {
          source: {
            path: 'a/b/c',
          },
          destinations: {
            dest: {
              region: 'us-north-20',
              bucketName: 'Bouquet',
              objectKey: 'key',
            }
          },
        },
      },
    });
  }).not.toThrow();
});

test('Throw on invalid file asset', () => {
  expect(() => {
    AssetManifestSchema.validate({
      version: AssetManifestSchema.currentVersion(),
      files: {
        asset: {
          source: {
            path: 3,
          },
          destinations: {
            dest: {
              region: 'us-north-20',
              bucketName: 'Bouquet',
              objectKey: 'key',
            }
          },
        },
      },
    });
  }).toThrow(/Expected a string, got '3'/);
});
