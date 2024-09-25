import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { FileAssetPackaging, Manifest } from '../lib';

describe('Docker image asset', () => {
  test('valid input', () => {
    expect(() => {
      validate({
        version: Manifest.version(),
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
          externalAsset: {
            source: {
              executable: ['sometool'],
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
      validate({
        version: Manifest.version(),
        dockerImages: {
          asset: {
            source: {
              directory: true,
            },
            destinations: {},
          },
          externalAsset: {
            source: {},
            destinations: {},
          },
        },
      });
    }).toThrow(/instance\.dockerImages\.asset\.source\.directory is not of a type\(s\) string/);
  });
});

describe('File asset', () => {
  describe('valid input', () => {
    test('without packaging', () => {
      expect(() => {
        validate({
          version: Manifest.version(),
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
            externalAsset: {
              source: {
                executable: ['sometool'],
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
          validate({
            version: Manifest.version(),
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
        validate({
          version: Manifest.version(),
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
            externalAsset: {
              source: {
                executable: ['sometool'],
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
      }).toThrow(/instance\.files\.asset\.source\.path is not of a type\(s\) string/);
    });

    test('bad "source.packaging" property', () => {
      expect(() => {
        validate({
          version: Manifest.version(),
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
      }).toThrow(/instance\.files\.asset\.source\.packaging is not one of enum values: file,zip/);
    });
  });
});

function validate(manifest: any) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'assets.test.'));
  const filePath = path.join(dir, 'manifest.json');
  fs.writeFileSync(filePath, JSON.stringify(manifest, undefined, 2));
  try {
    Manifest.loadAssetManifest(filePath);
  } finally {
    fs.unlinkSync(filePath);
    fs.rmdirSync(dir);
  }
}
