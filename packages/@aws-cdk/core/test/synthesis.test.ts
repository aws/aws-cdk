import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { nodeunitShim, Test } from 'nodeunit-shim';
import * as cdk from '../lib';
import { synthesize } from '../lib/private/synthesis';

function createModernApp() {
  return new cdk.App();
}

nodeunitShim({
  'synthesis with an empty app'(test: Test) {
    // GIVEN
    const app = createModernApp();

    // WHEN
    const session = app.synth();

    // THEN
    test.same(app.synth(), session); // same session if we synth() again
    test.deepEqual(list(session.directory), ['cdk.out', 'manifest.json', 'tree.json']);
    test.deepEqual(readJson(session.directory, 'manifest.json').artifacts, {
      Tree: {
        type: 'cdk:tree',
        properties: { file: 'tree.json' },
      },
    });
    test.deepEqual(readJson(session.directory, 'tree.json'), {
      version: 'tree-0.1',
      tree: expect.objectContaining({
        id: 'App',
        path: '',
        children: {
          Tree: expect.objectContaining({ id: 'Tree', path: 'Tree' }),
        },
      }),
    });
    test.done();
  },

  'synthesis respects disabling tree metadata'(test: Test) {
    const app = new cdk.App({
      treeMetadata: false,
    });
    const assembly = app.synth();
    test.deepEqual(list(assembly.directory), ['cdk.out', 'manifest.json']);
    test.done();
  },

  'single empty stack'(test: Test) {
    // GIVEN
    const app = createModernApp();
    new cdk.Stack(app, 'one-stack');

    // WHEN
    const session = app.synth();

    // THEN
    test.ok(list(session.directory).includes('one-stack.template.json'));
    test.done();
  },

  'it should be possible to synthesize without an app'(test: Test) {
    const calls = new Array<string>();

    class SynthesizeMe extends cdk.Stack {
      constructor() {
        super(undefined as any, 'id');

        this.node.addValidation({
          validate: () => {
            calls.push('validate');
            return [];
          },
        });
      }

      public _synthesizeTemplate(session: cdk.ISynthesisSession) {
        calls.push('synthesize');

        session.assembly.addArtifact('art', {
          type: cxschema.ArtifactType.AWS_CLOUDFORMATION_STACK,
          properties: {
            templateFile: 'hey.json',
            parameters: {
              paramId: 'paramValue',
              paramId2: 'paramValue2',
            },
          },
          environment: 'aws://unknown-account/us-east-1',
        });

        writeJson(session.assembly.outdir, 'hey.json', { hello: 123 });
      }
    }

    const root = new SynthesizeMe();
    const assembly = synthesize(root, { outdir: fs.mkdtempSync(path.join(os.tmpdir(), 'outdir')) });

    test.deepEqual(calls, ['validate', 'synthesize']);
    const stack = assembly.getStackByName('art');
    test.deepEqual(stack.template, { hello: 123 });
    test.deepEqual(stack.templateFile, 'hey.json');
    test.deepEqual(stack.parameters, { paramId: 'paramValue', paramId2: 'paramValue2' });
    test.deepEqual(stack.environment, { region: 'us-east-1', account: 'unknown-account', name: 'aws://unknown-account/us-east-1' });
    test.done();
  },
});

function list(outdir: string) {
  return fs.readdirSync(outdir).sort();
}

function readJson(outdir: string, file: string) {
  return JSON.parse(fs.readFileSync(path.join(outdir, file), 'utf-8'));
}

function writeJson(outdir: string, file: string, data: any) {
  fs.writeFileSync(path.join(outdir, file), JSON.stringify(data, undefined, 2));
}
