import * as fs from 'fs';
import * as path from 'path';
import { Construct } from 'constructs';
import { App, Stack } from '../lib';
import type { ForestFile, TreeFile } from '../lib/helpers-internal';

/**
 * Tests for how `tree.json` is fragmented into forest files.
 *
 * Tests that assert on `constructInfo` live in
 * `@aws-cdk-testing/framework-integ`, because that metadata is only present when
 * the library has been compiled with jsii. These don't need it.
 */
describe('tree metadata forest files', () => {
  test('tree ids are dense and restart per forest file', () => {
    // Tree ids come from a per-forest-file counter. Assert the ids in each forest
    // file are exactly t0..tN-1: dense, unique, and restarting at t0 for every
    // file. A counter shared across files would still be unique, but would not
    // restart, and deriving the id from the number of keys already in the file
    // would make writing the forest quadratic in the number of subtrees.
    const app = new App({
      context: {
        '@aws-cdk/core.TreeMetadata:maxNodes': 1_000,
      },
      analyticsReporting: false,
    });

    // GIVEN - enough nodes to spill into more than one forest file. Plain
    // Constructs rather than CfnResources, to stay under a Stack's resource limit.
    const stack = new Stack(app, 'SomeStack');
    for (let i = 0; i < 3_000; i++) {
      new Construct(stack, `Construct${i}`);
    }

    // WHEN
    const assembly = app.synth();
    try {
      const forestFileNames = fs.readdirSync(assembly.directory).filter((f: string) => /^trees-\d+\.json$/.test(f));

      // THEN
      expect(forestFileNames.length).toBeGreaterThan(1);

      for (const fileName of forestFileNames) {
        const forestFile: ForestFile = readJson(assembly.directory, fileName);
        const ids = Object.keys(forestFile.forest);

        expect(ids.length).toBeGreaterThan(0);
        expect(ids).toEqual(ids.map((_, i) => `t${i}`));
      }

      // Every subtree reference resolves to a tree that actually exists
      const treeArtifact = assembly.tree();
      const rootFile: TreeFile = readJson(assembly.directory, treeArtifact!.file);
      let references = 0;
      recurse(rootFile.tree);
      expect(references).toBeGreaterThan(0);

      function recurse(node: TreeFile['tree']) {
        if (isSubtreeReference(node)) {
          references += 1;
          const forestFile: ForestFile = readJson(assembly.directory, node.fileName);
          expect(forestFile.forest[node.treeId!]).toBeDefined();
          return;
        }
        for (const child of Object.values(node.children ?? {})) {
          recurse(child);
        }
      }
    } finally {
      fs.rmSync(assembly.directory, { force: true, recursive: true });
    }
  });
});

function readJson(outdir: string, file: string) {
  return JSON.parse(fs.readFileSync(path.join(outdir, file), 'utf-8'));
}

function isSubtreeReference(x: TreeFile['tree']): x is Extract<TreeFile['tree'], { fileName: string }> {
  return !!(x as any).fileName;
}
