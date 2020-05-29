import { AssetManifestSchema, FileAssetPackaging } from '../lib';

describe('Docker image asset', () => {
  test('valid input', () => {
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

  test('invalid input', () => {
    expect(() => {
      AssetManifestSchema.validate({
        version: AssetManifestSchema.currentVersion(),
        dockerImages: {
          asset: {
            source: {},
            destinations: {},
          },
        },
      });
    }).toThrow(/dockerImages: source: Expected key 'directory' missing/);
  });
});

describe('File asset', () => {
  describe('valid input', () => {
    test('without packaging', () => {
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
                },
              },
            },
          },
        });
      }).not.toThrow();
    });

    for (const packaging of Object.values(FileAssetPackaging)) {
      test(`with "${packaging}" packaging`, () => {
        expect(() => {
          AssetManifestSchema.validate({
            version: AssetManifestSchema.currentVersion(),
            files: {
              asset: {
                source: {
                  path: 'a/b/c',
                  packaging,
                },
                destinations: {
                  dest: {
                    region: 'us-north-20',
                    bucketName: 'Bouquet',
                    objectKey: 'key',
                  },
                },
              },
            },
          });
        }).not.toThrow();
      });
    }
  });

  describe('invalid input', () => {
    test('bad "source.path" property', () => {
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
                },
              },
            },
          },
        });
      }).toThrow(/Expected a string, got '3'/);
    });

    test('bad "source.packaging" property', () => {
      expect(() => {
        AssetManifestSchema.validate({
          version: AssetManifestSchema.currentVersion(),
          files: {
            asset: {
              source: {
                path: 'a/b/c',
                packaging: 'BLACK_HOLE',
              },
              destinations: {
                dest: {
                  region: 'us-north-20',
                  bucketName: 'Bouquet',
                  objectKey: 'key',
                },
              },
            },
          },
        });
      }).toThrow(/Expected a FileAssetPackaging \(one of [^)]+\), got 'BLACK_HOLE'/);
    });
  });
});
