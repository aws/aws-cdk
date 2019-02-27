import cxapi = require('@aws-cdk/cx-api');
import fs = require('fs');
import { Test } from 'nodeunit';
import os = require('os');
import path = require('path');
import cdk = require('../lib');
import { FileSystemStore, InMemoryStore, SynthesisSession } from '../lib';

const storeTestMatrix: any = {};

export = {
  'backwards compatibility: cdk.out contains all synthesized stacks'(test: Test) {
    // GIVEN
    const app = new cdk.App();
    const stack1 = new cdk.Stack(app, 'stack1');
    new cdk.Resource(stack1, 'Resource1', { type: 'AWS::CDK::Resource' });
    new cdk.Resource(stack1, 'Resource2', { type: 'AWS::CDK::Resource' });
    const stack2 = new cdk.Stack(app, 'stack2');
    new cdk.Resource(stack2, 'ResourceA', { type: 'AWS::CDK::Resource' });

    // WHEN
    const session = app.run();
    const manifest = session.manifest;

    // THEN
    const t1 = manifest.stacks.find(s => s.name === 'stack1')!.template;
    const t2 = manifest.stacks.find(s => s.name === 'stack2')!.template;

    test.deepEqual(t1, {
      Resources: {
        Resource1: { Type: 'AWS::CDK::Resource' },
        Resource2: { Type: 'AWS::CDK::Resource' }
      }
    });
    test.deepEqual(t2, {
      Resources: {
        ResourceA: { Type: 'AWS::CDK::Resource' }
      }
    });
    test.done();
  },

  'store': storeTestMatrix
};

//
// all these tests will be executed for each type of store
//
const storeTests = {
  'writeFile()/readFile()'(test: Test, store: cdk.ISessionStore) {
    // WHEN
    store.writeFile('bla.txt', 'hello');
    store.writeFile('hey.txt', '1234');

    // THEN
    test.deepEqual(store.readFile('bla.txt').toString(), 'hello');
    test.deepEqual(store.readFile('hey.txt').toString(), '1234');
    test.throws(() => store.writeFile('bla.txt', 'override is forbidden'));

    // WHEN
    store.finalize();

    // THEN
    test.throws(() => store.writeFile('another.txt', 'locked!'));
    test.done();
  },

  'exists() for files'(test: Test, store: cdk.ISessionStore) {
    // WHEN
    store.writeFile('A.txt', 'aaa');

    // THEN
    test.ok(store.exists('A.txt'));
    test.ok(!store.exists('B.txt'));
    test.done();
  },

  'mkdir'(test: Test, store: cdk.ISessionStore) {
    // WHEN
    const dir1 = store.mkdir('dir1');
    const dir2 = store.mkdir('dir2');

    // THEN
    test.ok(fs.statSync(dir1).isDirectory());
    test.ok(fs.statSync(dir2).isDirectory());
    test.throws(() => store.mkdir('dir1'));

    // WHEN
    store.finalize();
    test.throws(() => store.mkdir('dir3'));
    test.done();
  },

  'list'(test: Test, store: cdk.ISessionStore) {
    // WHEN
    store.mkdir('dir1');
    store.writeFile('file1.txt', 'boom1');

    // THEN
    test.deepEqual(store.list(), ['dir1', 'file1.txt']);
    test.done();
  },

  'SynthesisSession'(test: Test, store: cdk.ISessionStore) {
    // GIVEN
    const session = new SynthesisSession(store);
    const templateFile = 'foo.template.json';

    // WHEN
    session.addArtifact('my-first-artifact', {
      type: cxapi.ArtifactType.CloudFormationStack,
      environment: 'aws://1222344/us-east-1',
      dependencies: ['a', 'b'],
      metadata: {
        foo: { bar: 123 }
      },
      properties: {
        template: templateFile,
        prop1: 1234,
        prop2: 555
      },
      missing: {
        foo: {
          provider: 'context-provider',
          props: {
            a: 'A',
            b: 2
          }
        }
      }
    });

    session.addArtifact('minimal-artifact', {
      type: cxapi.ArtifactType.CloudFormationStack,
      environment: 'aws://111/helo-world',
      properties: {
        template: templateFile
      }
    });

    session.store.writeJson(templateFile, {
      Resources: {
        MyTopic: {
          Type: 'AWS::S3::Topic'
        }
      }
    });

    session.finalize();

    const manifest = session.store.readJson(cxapi.MANIFEST_FILE);

    // THEN
    delete manifest.runtime; // deterministic tests

    // verify the manifest looks right
    test.deepEqual(manifest, {
      version: cxapi.PROTO_RESPONSE_VERSION,
      stacks: [], // here for legacy reasons
      artifacts: {
        'my-first-artifact': {
          type: 'aws:cloudformation:stack',
          environment: 'aws://1222344/us-east-1',
          dependencies: ['a', 'b'],
          metadata: { foo: { bar: 123 } },
          properties: { template: 'foo.template.json', prop1: 1234, prop2: 555 },
          missing: {
            foo: { provider: 'context-provider', props: { a: 'A', b: 2 } }
          }
        },
        'minimal-artifact': {
          type: 'aws:cloudformation:stack',
          environment: 'aws://111/helo-world',
          properties: { template: 'foo.template.json' }
        }
      }
    });

    // verify we have a template file
    test.deepEqual(session.store.readJson(templateFile), {
      Resources: {
        MyTopic: {
          Type: 'AWS::S3::Topic'
        }
      }
    });

    test.done();
  }
};

for (const [name, fn] of Object.entries(storeTests)) {
  const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'synthesis-tests'));
  const fsStore = new FileSystemStore({ outdir });
  const memoryStore = new InMemoryStore();
  storeTestMatrix[`FileSystemStore - ${name}`] = (test: Test) => fn(test, fsStore);
  storeTestMatrix[`InMemoryStore - ${name}`] = (test: Test) => fn(test, memoryStore);
}
