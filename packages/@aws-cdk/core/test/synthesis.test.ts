import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import { Construct } from 'constructs';
import * as cdk from '../lib';
import { synthesize } from '../lib/private/synthesis';

function createModernApp() {
  return new cdk.App();
}

describe('synthesis', () => {
  test('synthesis with an empty app', () => {
    // GIVEN
    const app = createModernApp();

    // WHEN
    const session = app.synth();

    // THEN
    expect(app.synth()).toEqual(session); // same session if we synth() again
    expect(list(session.directory)).toEqual(['cdk.out', 'manifest.json', 'tree.json']);
    expect(readJson(session.directory, 'manifest.json').artifacts).toEqual({
      Tree: {
        type: 'cdk:tree',
        properties: { file: 'tree.json' },
      },
    });
    expect(readJson(session.directory, 'tree.json')).toEqual({
      version: 'tree-0.1',
      tree: expect.objectContaining({
        id: 'App',
        path: '',
        children: {
          Tree: expect.objectContaining({ id: 'Tree', path: 'Tree' }),
        },
      }),
    });
  });

  test('synthesis respects disabling tree metadata', () => {
    const app = new cdk.App({
      treeMetadata: false,
    });
    const assembly = app.synth();
    expect(list(assembly.directory)).toEqual(['cdk.out', 'manifest.json']);
  });

  test('synthesis respects disabling logicalId metadata', () => {
    const app = new cdk.App({
      context: {
        [cxapi.DISABLE_LOGICAL_ID_METADATA]: true,
      },
    });
    const stack = new cdk.Stack(app, 'one-stack');
    new cdk.CfnResource(stack, 'MagicResource', { type: 'Resource::Type' });

    // WHEN
    const session = app.synth();

    // THEN
    expect(Object.keys((session.manifest.artifacts ?? {})['one-stack'])).not.toContain('metadata');
  });

  test('synthesis respects disabling logicalId metadata, and does not disable other metadata', () => {
    const app = new cdk.App({
      context: {
        [cxapi.DISABLE_LOGICAL_ID_METADATA]: true,
      },
      stackTraces: false,
    });
    const stack = new cdk.Stack(app, 'one-stack', { tags: { boomTag: 'BOOM' } });
    new cdk.CfnResource(stack, 'MagicResource', { type: 'Resource::Type' });

    // WHEN
    const session = app.synth();

    // THEN
    expect(session.manifest.artifacts?.['one-stack'].metadata).toEqual({
      '/one-stack': [
        {
          type: 'aws:cdk:stack-tags',
          data: [
            {
              key: 'boomTag',
              value: 'BOOM',
            },
          ],
        },
      ],
      // no logicalId entry
    });
  });

  test('single empty stack', () => {
    // GIVEN
    const app = createModernApp();
    new cdk.Stack(app, 'one-stack');

    // WHEN
    const session = app.synth();

    // THEN
    expect(list(session.directory).includes('one-stack.template.json')).toEqual(true);
  });

  test('some random construct implements "synthesize"', () => {
    // GIVEN
    const app = createModernApp();
    const stack = new cdk.Stack(app, 'one-stack');

    class MyConstruct extends Construct {
      constructor(scope: Construct, id: string) {
        super(scope, id);

        cdk.attachCustomSynthesis(this, {
          onSynthesize(s: cdk.ISynthesisSession) {
            writeJson(s.assembly.outdir, 'foo.json', { bar: 123 });
            s.assembly.addArtifact('my-random-construct', {
              type: cxschema.ArtifactType.AWS_CLOUDFORMATION_STACK,
              environment: 'aws://12345/bar',
              properties: {
                templateFile: 'foo.json',
              },
            });
          },
        });
      }
    }

    new MyConstruct(stack, 'MyConstruct');

    // WHEN
    const session = app.synth();

    // THEN
    expect(list(session.directory).includes('one-stack.template.json')).toEqual(true);
    expect(list(session.directory).includes('foo.json')).toEqual(true);

    expect(readJson(session.directory, 'foo.json')).toEqual({ bar: 123 });
    expect(session.manifest).toEqual({
      version: cxschema.Manifest.version(),
      artifacts: expect.objectContaining({
        'Tree': {
          type: 'cdk:tree',
          properties: { file: 'tree.json' },
        },
        'my-random-construct': {
          type: 'aws:cloudformation:stack',
          environment: 'aws://12345/bar',
          properties: { templateFile: 'foo.json' },
        },
        'one-stack': expect.objectContaining({
          type: 'aws:cloudformation:stack',
          environment: 'aws://unknown-account/unknown-region',
          properties: expect.objectContaining({
            templateFile: 'one-stack.template.json',
            validateOnSynth: false,
          }),
          displayName: 'one-stack',
        }),
      }),
    });
  });

  test('random construct uses addCustomSynthesis', () => {
    // GIVEN
    const app = createModernApp();
    const stack = new cdk.Stack(app, 'one-stack');

    class MyConstruct extends Construct {
      constructor(scope: Construct, id: string) {
        super(scope, id);

        cdk.attachCustomSynthesis(this, {
          onSynthesize(s: cdk.ISynthesisSession) {
            writeJson(s.assembly.outdir, 'foo.json', { bar: 123 });
            s.assembly.addArtifact('my-random-construct', {
              type: cxschema.ArtifactType.AWS_CLOUDFORMATION_STACK,
              environment: 'aws://12345/bar',
              properties: {
                templateFile: 'foo.json',
              },
            });
          },
        });
      }
    }

    new MyConstruct(stack, 'MyConstruct');

    // WHEN
    const session = app.synth();

    // THEN
    expect(list(session.directory).includes('one-stack.template.json')).toEqual(true);
    expect(list(session.directory).includes('foo.json')).toEqual(true);

    expect(readJson(session.directory, 'foo.json')).toEqual({ bar: 123 });
    expect(session.manifest).toEqual({
      version: cxschema.Manifest.version(),
      artifacts: expect.objectContaining({
        'Tree': {
          type: 'cdk:tree',
          properties: { file: 'tree.json' },
        },
        'my-random-construct': {
          type: 'aws:cloudformation:stack',
          environment: 'aws://12345/bar',
          properties: { templateFile: 'foo.json' },
        },
        'one-stack': expect.objectContaining({
          type: 'aws:cloudformation:stack',
          environment: 'aws://unknown-account/unknown-region',
          properties: expect.objectContaining({
            templateFile: 'one-stack.template.json',
            validateOnSynth: false,
          }),
          displayName: 'one-stack',
        }),
      }),
    });
  });

  testDeprecated('it should be possible to synthesize without an app', () => {
    const calls = new Array<string>();

    class SynthesizeMe extends cdk.Stack {
      constructor() {
        super(undefined as any, 'id', {
          synthesizer: new cdk.LegacyStackSynthesizer(),
        });
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

    expect(calls).toEqual(['validate', 'synthesize']);
    const stack = assembly.getStackByName('art');
    expect(stack.template).toEqual({ hello: 123 });
    expect(stack.templateFile).toEqual('hey.json');
    expect(stack.parameters).toEqual({ paramId: 'paramValue', paramId2: 'paramValue2' });
    expect(stack.environment).toEqual({ region: 'us-east-1', account: 'unknown-account', name: 'aws://unknown-account/us-east-1' });
  });
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
