import cxapi = require('@aws-cdk/cx-api');
import fs = require('fs');
import { Test } from 'nodeunit';
import path = require('path');
import { CfnResource, Construct, Stack, StackProps } from '../lib';
import { App } from '../lib/app';

function withApp(context: { [key: string]: any } | undefined, block: (app: App) => void): cxapi.SynthesizeResponse {
  const app = new App({ context });

  block(app);

  const session = app.run();

  // return the legacy manifest
  return JSON.parse(fs.readFileSync(path.join(session.outdir, cxapi.OUTFILE_NAME), 'utf-8'));
}

function synth(context?: { [key: string]: any }): cxapi.SynthesizeResponse {
  return withApp(context, app => {
    const stack1 = new Stack(app, 'stack1', { env: { account: '12345', region: 'us-east-1' } });
    new CfnResource(stack1, 's1c1', { type: 'DummyResource', properties: { Prop1: 'Prop1' } });
    const r2 = new CfnResource(stack1, 's1c2', { type: 'DummyResource', properties: { Foo: 123 } });

    const stack2 = new Stack(app, 'stack2');
    new CfnResource(stack2, 's2c1', { type: 'DummyResource', properties: { Prog2: 'Prog2' } });
    const c1 = new MyConstruct(stack2, 's1c2');

    // add some metadata
    stack1.node.addMetadata('meta', 111);
    r2.node.addWarning('warning1');
    r2.node.addWarning('warning2');
    c1.node.addMetadata('meta', { key: 'value' });
    app.node.addMetadata('applevel', 123); // apps can also have metadata
  });
}

function synthStack(name: string, includeMetadata: boolean = false, context?: any): cxapi.SynthesizedStack {
  const response = synth(context);
  const stack = response.stacks.find(s => s.name === name);
  if (!stack) {
    throw new Error(`Stack ${name} not found`);
  }

  if (!includeMetadata) {
    delete (stack as any).metadata;
  }

  return stack;
}

export = {
  'synthesizes all stacks and returns synthesis result'(test: Test) {
    const response = synth();

    // clean up metadata so assertion will be sane
    response.stacks.forEach(s => delete (s as any).metadata);
    delete (response as any).runtime;
    delete (response as any).artifacts;

    test.deepEqual(response, {
      version: '0.19.0',
      stacks:
      [ { name: 'stack1',
          environment:
           { name: '12345/us-east-1',
             account: '12345',
             region: 'us-east-1' },
          template:
           { Resources:
              { s1c1: { Type: 'DummyResource', Properties: { Prop1: 'Prop1' } },
                s1c2: { Type: 'DummyResource', Properties: { Foo: 123 } } } } },
        { name: 'stack2',
          environment:
           { name: 'unknown-account/unknown-region',
             account: 'unknown-account',
             region: 'unknown-region' },
          template:
           { Resources:
              { s2c1: { Type: 'DummyResource', Properties: { Prog2: 'Prog2' } },
                s1c2r1D1791C01: { Type: 'ResourceType1' },
                s1c2r25F685FFF: { Type: 'ResourceType2' } } } } ] });
    test.done();
  },

  'synth(name) can be used programmatically'(test: Test) {
    const prog = new App();
    const stack = new Stack(prog, 'MyStack');
    new CfnResource(stack, 'MyResource', { type: 'MyResourceType' });

    test.throws(() => prog.synthesizeStacks(['foo']), /foo/);

    test.deepEqual(prog.synthesizeStack('MyStack').template,
      { Resources: { MyResource: { Type: 'MyResourceType' } } });
    test.done();
  },

  'synth(name) also collects metadata from all constructs in the stack'(test: Test) {
    const stack = synthStack('stack1', true);

    const output = stack.metadata;
    stripStackTraces(output);

    test.ok(output['/'], 'app-level metadata is included under "."');
    test.equal(output['/'][0].type, 'applevel');
    test.equal(output['/'][0].data, 123);

    test.ok(output['/stack1'], 'the construct "stack1" has metadata');
    test.equal(output['/stack1'][0].type, 'meta');
    test.equal(output['/stack1'][0].data, 111);
    test.ok(output['/stack1'][0].trace.length > 0, 'trace contains multiple entries');

    test.ok(output['/stack1/s1c2']);
    test.equal(output['/stack1/s1c2'].length, 2, 'two entries');
    test.equal(output['/stack1/s1c2'][0].data, 'warning1');

    const stack2 = synthStack('stack2', true);
    const output2 = stack2.metadata;

    test.ok(output2['/stack2/s1c2']);
    test.equal(output2['/stack2/s1c2'][0].type, 'meta');
    test.deepEqual(output2['/stack2/s1c2'][0].data, { key: 'value' });

    test.done();
  },

  'context can be passed through CDK_CONTEXT'(test: Test) {
    process.env[cxapi.CONTEXT_ENV] = JSON.stringify({
      key1: 'val1',
      key2: 'val2'
    });
    const prog = new App();
    test.deepEqual(prog.node.getContext('key1'), 'val1');
    test.deepEqual(prog.node.getContext('key2'), 'val2');
    test.done();
  },

  'context from the command line can be used when creating the stack'(test: Test) {
    const output = synthStack('stack2', false, { ctx1: 'HELLO' });

    test.deepEqual(output.template, {
      Resources: {
        s2c1: {
        Type: "DummyResource",
        Properties: {
          Prog2: "Prog2"
        }
        },
        s1c2r1D1791C01: {
        Type: "ResourceType1"
        },
        s1c2r25F685FFF: {
        Type: "ResourceType2",
        Properties: {
          FromContext: "HELLO"
        }
        }
      }
    });
    test.done();
  },

  'setContext(k,v) can be used to set context programmatically'(test: Test) {
    const prog = new App();
    prog.node.setContext('foo', 'bar');
    test.deepEqual(prog.node.getContext('foo'), 'bar');
    test.done();
  },

  'setContext(k,v) cannot be called after stacks have been added because stacks may use the context'(test: Test) {
    const prog = new App();
    new Stack(prog, 's1');
    test.throws(() => prog.node.setContext('foo', 'bar'));
    test.done();
  },

  'app.synthesizeStack(stack) performs validation first (app.validateAll()) and if there are errors, it returns the errors'(test: Test) {

    class Child extends Construct {
      protected validate() {
        return [ `Error from ${this.node.id}` ];
      }
    }

    class Parent extends Stack {

    }

    const app = new App();

    const parent = new Parent(app, 'Parent');
    new Child(parent, 'C1');
    new Child(parent, 'C2');

    test.throws(() => {
      app.synthesizeStacks(['Parent']);
    }, /Validation failed with the following errors/);

    test.done();
  },

  'app.synthesizeStack(stack) will return a list of missing contextual information'(test: Test) {
    class MyStack extends Stack {
      constructor(scope: App, id: string, props?: StackProps) {
        super(scope, id, props);

        this.reportMissingContext('missing-context-key', {
          provider: 'fake',
          props: {
            account: '12345689012',
            region: 'ab-north-1',
          },
        },
        );

        this.reportMissingContext('missing-context-key-2', {
          provider: 'fake2',
          props: {
            foo: 'bar',
            account: '12345689012',
            region: 'ab-south-1',
          },
        },
        );
      }
    }

    const response = withApp(undefined, app => {
      new MyStack(app, 'MyStack');
    });

    test.deepEqual(response.stacks[0].missing, {
      "missing-context-key": {
        provider: 'fake',
        props: {
          account: '12345689012',
          region: 'ab-north-1',
        },
      },
      "missing-context-key-2": {
        provider: 'fake2',
        props: {
          account: '12345689012',
          region: 'ab-south-1',
          foo: 'bar',
        },
      },
    });

    test.done();
  },

  'runtime library versions disabled'(test: Test) {
    const context: any = {};
    context[cxapi.DISABLE_VERSION_REPORTING] = true;

    const response = withApp(context, app => {
      const stack = new Stack(app, 'stack1');
      new CfnResource(stack, 'MyResource', { type: 'Resource::Type' });
    });

    test.equals(response.runtime, undefined);
    test.done();
  },

  'runtime library versions'(test: Test) {
    const response = withApp({}, app => {
      const stack = new Stack(app, 'stack1');
      new CfnResource(stack, 'MyResource', { type: 'Resource::Type' });
    });

    const libs = (response.runtime && response.runtime.libraries) || { };

    const version = require('../package.json').version;
    test.deepEqual(libs['@aws-cdk/cdk'], version);
    test.deepEqual(libs['@aws-cdk/cx-api'], version);
    test.deepEqual(libs['jsii-runtime'], `node.js/${process.version}`);
    test.done();
  },

  'jsii-runtime version loaded from JSII_AGENT'(test: Test) {
    process.env.JSII_AGENT = 'Java/1.2.3.4';

    const response = withApp({}, app => {
      const stack = new Stack(app, 'stack1');
      new CfnResource(stack, 'MyResource', { type: 'Resource::Type' });
    });

    const libs = (response.runtime && response.runtime.libraries) || { };
    test.deepEqual(libs['jsii-runtime'], `Java/1.2.3.4`);

    delete process.env.JSII_AGENT;
    test.done();
  },

  'version reporting includes only @aws-cdk, aws-cdk and jsii libraries'(test: Test) {
    const response = withApp({}, app => {
      const stack = new Stack(app, 'stack1');
      new CfnResource(stack, 'MyResource', { type: 'Resource::Type' });
    });

    const libs = (response.runtime && response.runtime.libraries) || { };

    const version = require('../package.json').version;
    test.deepEqual(libs, {
      '@aws-cdk/cdk': version,
      '@aws-cdk/cx-api': version,
      'jsii-runtime': `node.js/${process.version}`
    });

    test.done();
  },

  'deep stack is shown and synthesized properly'(test: Test) {
    // WHEN
    const response = withApp(undefined, (app) => {
      const topStack = new Stack(app, 'Stack');
      const topResource = new CfnResource(topStack, 'Res', { type: 'CDK::TopStack::Resource' });

      const bottomStack = new Stack(topResource, 'Stack');
      new CfnResource(bottomStack, 'Res', { type: 'CDK::BottomStack::Resource' });
    });

    // THEN
    test.deepEqual(response.stacks.map(s => ({ name: s.name, template: s.template })), [
      {
        name: 'StackResStack7E4AFA86',
        template: { Resources: { Res: { Type: 'CDK::BottomStack::Resource' } } },
      },
      {
        name: 'Stack',
        template: { Resources: { Res: { Type: 'CDK::TopStack::Resource' } } },
      }
    ]);

    test.done();
  },
};

class MyConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new CfnResource(this, 'r1', { type: 'ResourceType1' });
    new CfnResource(this, 'r2', { type: 'ResourceType2', properties: { FromContext: this.node.getContext('ctx1') } });
  }
}

/**
 * Strip stack traces from metadata
 */
function stripStackTraces(meta: cxapi.StackMetadata) {
  for (const key of Object.keys(meta)) {
    meta[key] = meta[key].filter(entry => entry.type !== 'aws:cdk:logicalId');
  }
}
