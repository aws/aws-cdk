import fs = require('fs');
import { Test } from 'nodeunit';
import path = require('path');
import { App, Construct, Resource, Stack } from '../../lib/index';

export = {
  'tree metadata is generated as expected'(test: Test) {
    const app = new App();

    const stack = new Stack(app, 'mystack');
    new Construct(stack, 'group1');
    const group2 = new Construct(stack, 'group2');

    new MyResource(group2, 'resource3');

    const assembly = app.synth();
    const treeArtifact = assembly.tree();
    test.ok(treeArtifact);

    test.deepEqual(readJson(assembly.directory, treeArtifact!.file), {
      version: 'tree-0.1',
      tree: {
        id: 'App',
        path: '',
        children: [
          {
            id: 'Tree',
            path: 'Tree'
          },
          {
            id: 'mystack',
            path: 'mystack',
            children: [
              {
                id: 'group1',
                path: 'mystack/group1'
              },
              {
                id: 'group2',
                path: 'mystack/group2',
                children: [
                  { id: 'resource3', path: 'mystack/group2/resource3' }
                ]
              }
            ]
          },
        ]
      }
    });
    test.done();
  },
};

class MyResource extends Resource {
  constructor(scope: Construct, id: string) {
    super(scope, id);
  }
}

function readJson(outdir: string, file: string) {
  return JSON.parse(fs.readFileSync(path.join(outdir, file), 'utf-8'));
}
