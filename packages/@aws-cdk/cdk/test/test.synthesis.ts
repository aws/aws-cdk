import cxapi = require('@aws-cdk/cx-api');
import { CloudAssemblyBuilder } from '@aws-cdk/cx-api';
import fs = require('fs');
import { Test } from 'nodeunit';
import os = require('os');
import path = require('path');
import cdk = require('../lib');
import { Construct, Synthesizer } from '../lib';

function createModernApp() {
  return new cdk.App({
    context: {
      [cxapi.DISABLE_VERSION_REPORTING]: 'true', // for test reproducibility
    }
  });
}

export = {
  'synthesis with an empty app'(test: Test) {
    // GIVEN
    const app = createModernApp();

    // WHEN
    const session = app.run();

    // THEN
    test.same(app.run(), session); // same session if we run() again
    test.deepEqual(list(session.directory), [ 'manifest.json' ]);
    test.deepEqual(readJson(session.directory, 'manifest.json').artifacts, {});
    test.done();
  },

  'single empty stack'(test: Test) {
    // GIVEN
    const app = createModernApp();
    new cdk.Stack(app, 'one-stack');

    // WHEN
    const session = app.run();

    // THEN
    test.deepEqual(list(session.directory), [
      'manifest.json',
      'one-stack.template.json'
    ]);
    test.done();
  },

  'some random construct implements "synthesize"'(test: Test) {
    // GIVEN
    const app = createModernApp();
    const stack = new cdk.Stack(app, 'one-stack');

    class MyConstruct extends cdk.Construct implements cdk.ISynthesizable {
      public synthesize(s: cxapi.CloudAssemblyBuilder) {
        writeJson(s.outdir, 'foo.json', { bar: 123 });
        s.addArtifact('my-random-construct', {
          type: cxapi.ArtifactType.AwsCloudFormationStack,
          environment: 'aws://12345/bar',
          properties: {
            templateFile: 'foo.json'
          }
        });
      }
    }

    new MyConstruct(stack, 'MyConstruct');

    // WHEN
    const session = app.run();

    // THEN
    test.deepEqual(list(session.directory), [
      'foo.json',
      'manifest.json',
      'one-stack.template.json'
    ]);
    test.deepEqual(readJson(session.directory, 'foo.json'), { bar: 123 });
    test.deepEqual(session.manifest, {
      version: '0.33.0',
      artifacts: {
        'my-random-construct': {
          type: 'aws:cloudformation:stack',
          environment: 'aws://12345/bar',
          properties: { templateFile: 'foo.json' }
        },
        'one-stack': {
          type: 'aws:cloudformation:stack',
          environment: 'aws://unknown-account/unknown-region',
          properties: { templateFile: 'one-stack.template.json' },
        }
      },
    });
    test.done();
  },

  'it should be possible to synthesize without an app'(test: Test) {
    const calls = new Array<string>();

    class SynthesizeMe extends Construct {
      constructor() {
        super(undefined as any, 'id');
      }

      protected validate(): string[] {
        calls.push('validate');
        return [];
      }

      protected prepare(): void {
        calls.push('prepare');
      }

      protected synthesize(session: CloudAssemblyBuilder) {
        calls.push('synthesize');

        session.addArtifact('art', {
          type: cxapi.ArtifactType.AwsCloudFormationStack,
          properties: { templateFile: 'hey.json' },
          environment: 'aws://unknown-account/us-east-1'
        });

        writeJson(session.outdir, 'hey.json', { hello: 123 });
      }
    }

    const root = new SynthesizeMe();

    const synth = new Synthesizer();
    const assembly = synth.synthesize(root, { outdir: fs.mkdtempSync(path.join(os.tmpdir(), 'outdir')) });

    test.deepEqual(calls, [ 'prepare', 'validate', 'synthesize' ]);
    const stack = assembly.getStack('art');
    test.deepEqual(stack.template, { hello: 123 });
    test.deepEqual(stack.properties, { templateFile: 'hey.json' });
    test.deepEqual(stack.environment, { region: 'us-east-1', account: 'unknown-account', name: 'aws://unknown-account/us-east-1' });
    test.done();
  },

  'stack.setParameterValue can be used to assign parameters'(test: Test) {
    // GIVEN
    const app = createModernApp();
    const stack = new cdk.Stack(app, 'my-stack');
    const param = new cdk.CfnParameter(stack, 'MyParam', { type: 'string' });

    // WHEN
    stack.setParameterValue(param, 'Foo');

    // THEN
    const session = app.run();
    const props = session.getStack('my-stack').properties;
    test.deepEqual(props.parameters, {
      MyParam: 'Foo'
    });
    test.done();
  },
};

function list(outdir: string) {
  return fs.readdirSync(outdir).sort();
}

function readJson(outdir: string, file: string) {
  return JSON.parse(fs.readFileSync(path.join(outdir, file), 'utf-8'));
}

function writeJson(outdir: string, file: string, data: any) {
  fs.writeFileSync(path.join(outdir, file), JSON.stringify(data, undefined, 2));
}