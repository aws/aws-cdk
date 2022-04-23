import * as path from 'path';
import { Manifest } from '@aws-cdk/cloud-assembly-schema';
import * as mockfs from 'mock-fs';
import { AssemblyManifestReader } from '../../../lib/runner/private/cloud-assembly';

describe('cloud assembly manifest reader', () => {
  const manifestFile = '/tmp/foo/bar/does/not/exist/manifest.json';
  const manifestStack = '/tmp/foo/bar/does/not/exist/test-stack.template.json';
  beforeEach(() => {
    mockfs({
      [manifestStack]: JSON.stringify({
        data: 'data',
      }),
      [manifestFile]: JSON.stringify({
        version: '17.0.0',
        artifacts: {
          'Tree': {
            type: 'cdk:tree',
            properties: {
              file: 'tree.json',
            },
          },
          'test-stack': {
            type: 'aws:cloudformation:stack',
            environment: 'aws://unknown-account/unknown-region',
            properties: {
              templateFile: 'test-stack.template.json',
              validateOnSynth: false,
            },
            metadata: {
              '/test-stack/MyFunction1/ServiceRole/Resource': [
                {
                  type: 'aws:cdk:logicalId',
                  data: 'MyFunction1ServiceRole9852B06B',
                  trace: [
                    'some trace',
                    'some more trace',
                  ],
                },
              ],
              '/test-stack/MyFunction1/Resource': [
                {
                  type: 'aws:cdk:logicalId',
                  data: 'MyFunction12A744C2E',
                  trace: [
                    'some trace',
                    'some more trace',
                  ],
                },
              ],
            },
            displayName: 'test-stack',
          },
          'test-stack2': {
            type: 'aws:cloudformation:stack',
            environment: 'aws://unknown-account/unknown-region',
            properties: {
              templateFile: 'test-stack.template.json',
              validateOnSynth: false,
            },
            metadata: {
              '/test-stack/asset1': [
                {
                  type: 'aws:cdk:asset',
                  data: {
                    path: 'asset.a820140ad8525b8ed56ad2a7bcd9da99d6afc2490e8c91e34620886c011bdc91',
                  },
                },
              ],
              '/test-stack/asset2': [
                {
                  type: 'aws:cdk:asset',
                  data: {
                    path: 'test-stack2.template.json',
                  },
                },
              ],
              '/test-stack/MyFunction1/ServiceRole/Resource': [
                {
                  type: 'aws:cdk:logicalId',
                  data: 'MyFunction1ServiceRole9852B06B',
                  trace: [
                    'some trace',
                    'some more trace',
                  ],
                },
              ],
              '/test-stack/MyFunction1/Resource': [
                {
                  type: 'aws:cdk:logicalId',
                  data: 'MyFunction12A744C2E',
                  trace: [
                    'some trace',
                    'some more trace',
                  ],
                },
              ],
            },
            displayName: 'test-stack',
          },
        },
      }),
    });
  });

  afterEach(() => {
    mockfs.restore();
  });

  test('can read manifest from file', () => {
    expect(() => {
      AssemblyManifestReader.fromFile(manifestFile);
    }).not.toThrow();
  });

  test('throws if manifest not found', () => {
    expect(() => {
      AssemblyManifestReader.fromFile('some-other-file');
    }).toThrow(/Cannot read integ manifest 'some-other-file':/);
  });

  test('can read manifest from path', () => {
    expect(() => {
      AssemblyManifestReader.fromPath(path.dirname(manifestFile));
    }).not.toThrow();
  });

  test('fromPath sets directory correctly', () => {
    const manifest = AssemblyManifestReader.fromPath(path.dirname(manifestFile));
    expect(manifest.directory).toEqual('/tmp/foo/bar/does/not/exist');
  });

  test('can get stacks from manifest', () => {
    const manifest = AssemblyManifestReader.fromFile(manifestFile);

    expect(manifest.stacks).toEqual({
      'test-stack': { data: 'data' },
      'test-stack2': { data: 'data' },
    });
  });

  test('can clean stack trace', () => {
    // WHEN
    const manifest = AssemblyManifestReader.fromFile(manifestFile);
    manifest.cleanManifest();

    // THEN
    const newManifest = Manifest.loadAssetManifest(manifestFile);
    expect(newManifest).toEqual({
      version: expect.any(String),
      artifacts: expect.objectContaining({
        'Tree': {
          type: 'cdk:tree',
          properties: {
            file: 'tree.json',
          },
        },
        'test-stack': {
          type: 'aws:cloudformation:stack',
          environment: 'aws://unknown-account/unknown-region',
          properties: {
            templateFile: 'test-stack.template.json',
            validateOnSynth: false,
          },
          metadata: {
            '/test-stack/MyFunction1/ServiceRole/Resource': [
              {
                type: 'aws:cdk:logicalId',
                data: 'MyFunction1ServiceRole9852B06B',
              },
            ],
            '/test-stack/MyFunction1/Resource': [
              {
                type: 'aws:cdk:logicalId',
                data: 'MyFunction12A744C2E',
              },
            ],
          },
          displayName: 'test-stack',
        },
      }),
    });
  });

  test('can add stack trace', () => {
    // WHEN
    const manifest = AssemblyManifestReader.fromFile(manifestFile);
    manifest.recordTrace(new Map([
      ['test-stack', new Map([
        ['MyFunction12A744C2E', 'some trace'],
      ])],
    ]));

    // THEN
    const newManifest = Manifest.loadAssetManifest(manifestFile);
    expect(newManifest).toEqual({
      version: expect.any(String),
      artifacts: expect.objectContaining({
        'Tree': {
          type: 'cdk:tree',
          properties: {
            file: 'tree.json',
          },
        },
        'test-stack': {
          type: 'aws:cloudformation:stack',
          environment: 'aws://unknown-account/unknown-region',
          properties: {
            templateFile: 'test-stack.template.json',
            validateOnSynth: false,
          },
          metadata: {
            '/test-stack/MyFunction1/ServiceRole/Resource': [
              {
                type: 'aws:cdk:logicalId',
                data: 'MyFunction1ServiceRole9852B06B',
              },
            ],
            '/test-stack/MyFunction1/Resource': [
              {
                type: 'aws:cdk:logicalId',
                data: 'MyFunction12A744C2E',
                trace: ['some trace'],
              },
            ],
          },
          displayName: 'test-stack',
        },
      }),
    });
  });

  test('can add stack trace for old resource', () => {
    // WHEN
    const manifest = AssemblyManifestReader.fromFile(manifestFile);
    manifest.recordTrace(new Map([
      ['test-stack', new Map([
        ['MyFunction', 'some trace'],
      ])],
    ]));

    // THEN
    const newManifest = Manifest.loadAssetManifest(manifestFile);
    expect(newManifest).toEqual({
      version: expect.any(String),
      artifacts: expect.objectContaining({
        'Tree': {
          type: 'cdk:tree',
          properties: {
            file: 'tree.json',
          },
        },
        'test-stack': {
          type: 'aws:cloudformation:stack',
          environment: 'aws://unknown-account/unknown-region',
          properties: {
            templateFile: 'test-stack.template.json',
            validateOnSynth: false,
          },
          metadata: {
            '/test-stack/MyFunction1/ServiceRole/Resource': [
              {
                type: 'aws:cdk:logicalId',
                data: 'MyFunction1ServiceRole9852B06B',
              },
            ],
            '/test-stack/MyFunction1/Resource': [
              {
                type: 'aws:cdk:logicalId',
                data: 'MyFunction12A744C2E',
              },
            ],
            'MyFunction': [
              {
                type: 'aws:cdk:logicalId',
                data: 'MyFunction',
                trace: ['some trace'],
              },
            ],
          },
          displayName: 'test-stack',
        },
      }),
    });
  });

  test('can get assets from assembly manifest', () => {
    // WHEN
    const manifest = AssemblyManifestReader.fromFile(manifestFile);
    const assets = manifest.getAssetsForStack('test-stack2');

    // THEN
    expect(assets).toEqual([
      'asset.a820140ad8525b8ed56ad2a7bcd9da99d6afc2490e8c91e34620886c011bdc91',
    ]);
  });
});
