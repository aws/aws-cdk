import cxapi = require('@aws-cdk/cx-api');
import fs = require('fs');
import { Test } from 'nodeunit';
import os = require('os');
import path = require('path');
import cdk = require('../lib');
import { Construct, ISynthesisSession, SynthesisSession, Synthesizer } from '../lib';

const storeTestMatrix: any = {};

function createModernApp() {
  return new cdk.App({
    context: {
      [cxapi.DISABLE_LEGACY_MANIFEST_CONTEXT]: 'true',
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
    test.deepEqual(list(session.outdir), [ 'manifest.json' ]);
    test.deepEqual(readJson(session.outdir, 'manifest.json').artifacts, {});
    test.done();
  },

  'single empty stack'(test: Test) {
    // GIVEN
    const app = createModernApp();
    new cdk.Stack(app, 'one-stack');

    // WHEN
    const session = app.run();

    // THEN
    test.deepEqual(list(session.outdir), [
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
      public synthesize(s: cdk.ISynthesisSession) {
        writeJson(s.outdir, 'foo.json', { bar: 123 });
        s.addArtifact('my-random-construct', {
          type: cxapi.ArtifactType.AwsCloudFormationStack,
          environment: 'aws://12345/bar',
          properties: {
            templateFile: 'file://boom'
          }
        });
      }
    }

    new MyConstruct(stack, 'MyConstruct');

    // WHEN
    const session = app.run();

    // THEN
    test.deepEqual(list(session.outdir), [
      'foo.json',
      'manifest.json',
      'one-stack.template.json'
    ]);
    test.deepEqual(readJson(session.outdir, 'foo.json'), { bar: 123 });
    test.deepEqual(session.manifest, {
      version: '0.19.0',
      artifacts: {
        'my-random-construct': {
          type: 'aws:cloudformation:stack',
          environment: 'aws://12345/bar',
          properties: { templateFile: 'file://boom' }
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

  'backwards compatibility: cdk.out contains all synthesized stacks'(test: Test) {
    // GIVEN
    const app = new cdk.App();
    const stack1 = new cdk.Stack(app, 'stack1');
    new cdk.CfnResource(stack1, 'Resource1', { type: 'AWS::CDK::Resource' });
    new cdk.CfnResource(stack1, 'Resource2', { type: 'AWS::CDK::Resource' });
    const stack2 = new cdk.Stack(app, 'stack2');
    new cdk.CfnResource(stack2, 'ResourceA', { type: 'AWS::CDK::Resource' });

    // WHEN
    const session = app.run();
    const legacy: cxapi.SynthesizeResponse = readJson(session.outdir, cxapi.OUTFILE_NAME);

    // THEN
    const t1 = legacy.stacks.find(s => s.name === 'stack1')!.template;
    const t2 = legacy.stacks.find(s => s.name === 'stack2')!.template;

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

      protected synthesize(session: ISynthesisSession) {
        calls.push('synthesize');

        session.addArtifact('art', {
          type: cxapi.ArtifactType.AwsEcrDockerImage,
          environment: 'aws://unknown-account/us-east-1'
        });

        writeJson(session.outdir, 'hey.json', { hello: 123 });
      }
    }

    const root = new SynthesizeMe();

    const synth = new Synthesizer();
    const result = synth.synthesize(root, { outdir: fs.mkdtempSync(path.join(os.tmpdir(), 'outdir')) });

    test.deepEqual(calls, [ 'prepare', 'validate', 'synthesize' ]);
    test.deepEqual(readJson(result.outdir, 'hey.json'), { hello: 123 });
    test.deepEqual(result.manifest.artifacts!.art, {
      type: 'aws:ecr:image',
      environment: 'aws://unknown-account/us-east-1'
    });
    test.done();
  },

  'store': storeTestMatrix
};

//
// all these tests will be executed for each type of store
//
const storeTests = {
  'SynthesisSession'(test: Test, outdir: string) {
    // GIVEN
    const session = new SynthesisSession({ outdir });
    const templateFile = 'foo.template.json';

    // WHEN
    session.addArtifact('my-first-artifact', {
      type: cxapi.ArtifactType.AwsCloudFormationStack,
      environment: 'aws://1222344/us-east-1',
      dependencies: ['a', 'b'],
      metadata: {
        foo: { bar: 123 }
      },
      properties: {
        templateFile,
        parameters: {
          prop1: '1234',
          prop2: '555'
        }
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
      type: cxapi.ArtifactType.AwsCloudFormationStack,
      environment: 'aws://111/helo-world',
      properties: {
        templateFile
      }
    });

    writeJson(session.outdir, templateFile, {
      Resources: {
        MyTopic: {
          Type: 'AWS::S3::Topic'
        }
      }
    });

    session.close();

    const manifest = readJson(session.outdir, cxapi.MANIFEST_FILE);

    // THEN
    delete manifest.runtime; // deterministic tests

    // verify the manifest looks right
    test.deepEqual(manifest, {
      version: cxapi.PROTO_RESPONSE_VERSION,
      artifacts: {
        'my-first-artifact': {
          type: 'aws:cloudformation:stack',
          environment: 'aws://1222344/us-east-1',
          dependencies: ['a', 'b'],
          metadata: { foo: { bar: 123 } },
          properties: {
            templateFile: 'foo.template.json',
            parameters: {
              prop1: '1234',
              prop2: '555'
            },
          },
          missing: {
            foo: { provider: 'context-provider', props: { a: 'A', b: 2 } }
          }
        },
        'minimal-artifact': {
          type: 'aws:cloudformation:stack',
          environment: 'aws://111/helo-world',
          properties: { templateFile: 'foo.template.json' }
        }
      }
    });

    // verify we have a template file
    test.deepEqual(readJson(session.outdir, templateFile), {
      Resources: {
        MyTopic: {
          Type: 'AWS::S3::Topic'
        }
      }
    });

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
    const props = (session.manifest.artifacts && session.manifest.artifacts['my-stack'].properties) || {};
    test.deepEqual(props.parameters, {
      MyParam: 'Foo'
    });
    test.done();
  },

  'addBuildStep can be used to produce build.json'(test: Test) {
    // GIVEN
    const app = createModernApp();

    // WHEN
    class BuildMe extends cdk.Construct implements cdk.ISynthesizable {
      public synthesize(s: cdk.ISynthesisSession) {
        s.addBuildStep('step_id', {
          type: 'build-step-type',
          parameters: {
            boom: 123
          }
        });
      }
    }

    new BuildMe(app, 'hey');

    // THEN
    const session  = app.run();
    test.deepEqual(list(session.outdir), [ 'build.json', 'manifest.json' ]);
    test.deepEqual(readJson(session.outdir, 'build.json'), {
      steps: {
        step_id: { type: 'build-step-type', parameters: { boom: 123 } }
      }
    });
    test.done();
  }
};

for (const [name, fn] of Object.entries(storeTests)) {
  const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'synthesis-tests'));
  storeTestMatrix[name] = (test: Test) => fn(test, outdir);
}

function list(outdir: string) {
  return fs.readdirSync(outdir).sort();
}

function readJson(outdir: string, file: string) {
  return JSON.parse(fs.readFileSync(path.join(outdir, file), 'utf-8'));
}

function writeJson(outdir: string, file: string, data: any) {
  fs.writeFileSync(path.join(outdir, file), JSON.stringify(data, undefined, 2));
}