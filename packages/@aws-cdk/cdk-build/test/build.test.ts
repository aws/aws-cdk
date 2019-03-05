import cxapi = require('@aws-cdk/cx-api');
import fs = require('fs-extra');
import os = require('os');
import path = require('path');
import { Build } from '../lib/build';
import { createTree, snapshotTree, decompress } from './util';

test('no build.json', async () => {
  const root = await createTree({
    'file1.txt': { boom: 123 }
  });

  const build = new Build({ root });
  await build.build();
});

test('a single build step', async () => {
  // GIVEN
  const root = await createTree({
    'source-file.txt': 'this is the source file',
    'build.json': {
      steps: {
        s1: {
          type: 'copy',
          parameters: {
            src: 'source-file.txt',
            dest: 'output/dest-file.txt'
          }
        }
      }
    } as cxapi.BuildManifest
  });

  // WHEN
  const build = new Build({ root });
  await build.build();

  // THEN
  expect(snapshotTree(path.join(root, 'output'))).toEqual({
    'dest-file.txt': 'this is the source file'
  });
});

test('multiple build steps with deps', async () => {
  // GIVEN
  const content = 'hello, this is source';
  const root = await createTree({
    'source.txt': content,
    'build.json': {
      steps: {
        source_to_dest1: {
          type: 'copy',
          parameters: {
            src: 'source.txt',
            dest: 'output/dest1.txt'
          }
        },
        dest1_to_dest2: {
          type: 'copy',
          depends: [ 'source_to_dest1' ],
          parameters: {
            src: 'output/dest1.txt',
            dest: 'output/dest2.txt'
          }
        }
      }
    }
  });

  const build = new Build({ root });
  await build.build();

  expect(snapshotTree(path.join(root, 'output'))).toEqual({
    'dest1.txt': content,
    'dest2.txt': content
  });
});

test('full scenario', async () => {
  const src = path.join(__dirname, 'fixtures', 'example');
  const root = await fs.mkdtemp(os.tmpdir());
  await fs.copy(src, root, { recursive: true });

  const build = new Build({ root });
  await build.build();

  expect(await fs.pathExists(path.join(root, 'output', 'aaabbb.zip'))).toBeTruthy();
  expect(await fs.pathExists(path.join(root, 'output', 'dup.zip'))).toBeTruthy();

  const decom = await fs.mkdtemp(os.tmpdir());

  await decompress(path.join(root, 'output', 'dup.zip'), decom);
  expect(snapshotTree(decom)).toEqual({
    'file1.txt': 'dir1/file1.txt'
  });
});