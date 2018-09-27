import cxapi = require('@aws-cdk/cx-api');
import { Test } from 'nodeunit';
import { Construct, Resource, Stack, StackProps } from '../lib';
import { App } from '../lib/app';

//
// this is the idiomatic way we want our apps to look like:

function main(...argv: string[]): any {
  const app = new App([ 'myprog', ...argv ]);

  // stacks are children of the program

  const stack1 = new Stack(app, 'stack1', { env: { account: '12345', region: 'us-east-1' } });
  new Resource(stack1, 's1c1', { type: 'DummyResource', properties: { Prop1: 'Prop1' } });
  const r2 = new Resource(stack1, 's1c2', { type: 'DummyResource', properties: { Foo: 123 } });

  const stack2 = new Stack(app, 'stack2');
  new Resource(stack2, 's2c1', { type: 'DummyResource', properties: { Prog2: 'Prog2' } });
  const c1 = new MyConstruct(stack2, 's1c2');

  // add some metadata
  stack1.addMetadata('meta', 111);
  r2.addWarning('warning1');
  r2.addWarning('warning2');
  c1.addMetadata('meta', { key: 'value' });
  app.addMetadata('applevel', 123); // apps can also have metadata

  return JSON.parse(app.run());
}

function runMain(object: cxapi.CXRequest) {
  return main(JSON.stringify(object));
}

function runList() {
  return (main(JSON.stringify({type: 'list'})) as cxapi.ListStacksResponse).stacks;
}

function runConsNoMeta1(stack: string, context?: any): cxapi.SynthesizedStack {
  const response = main(JSON.stringify({
    type: 'synth',
    stacks: [stack],
    context
  }));
  delete response.stacks[0].metadata;
  return response.stacks[0];
}

export = {
  'first line is the version of the cx interface'(test: Test) {
    const prog = new App();
    test.ok((prog.run()).indexOf('CloudExecutable/1.0') === 0);
    test.done();
  },

  'when executed without arguments, shows interface version and usage usage'(test: Test) {
    const output = new App([ 'myprog' ]).run();

    test.notEqual(output.indexOf('myprog'), -1, 'Output should contain program name');
    test.notEqual(output.indexOf('Usage'), -1, 'Output should contain usage');
    test.done();
  },

  async 'unknown command will throw an error'(test: Test) {
    test.throws(
      () => { main('foo'); }
    );
    test.done();
  },

  '"list" with no stacks returns with an empty array'(test: Test) {
    const output = new App([ 'myprog', JSON.stringify({type: 'list'}) ]).run();
    test.deepEqual(JSON.parse(output).stacks, []);
    test.done();
  },

  '"list" returns a list of all stacks, with region information if exists'(test: Test) {
    // tslint:disable-next-line:max-line-length
    test.deepEqual(runList(), [ { name: 'stack1', environment: { name: '12345/us-east-1', region: 'us-east-1', account: '12345' } }, { name: 'stack2' } ]);
    test.done();
  },

  'list() can be used programmatically'(test: Test) {
    const prog = new App();
    test.deepEqual(prog.listStacks(), []);
    test.done();
  },

  '"cons" throws if the stack do not exist'(test: Test) {
    test.throws(
      () => { runMain({type: 'synth', stacks: ['stack99'] }); }
    );
    test.done();
  },

  '"cons" will return region info for the required stack'(test: Test) {
    const out = (runConsNoMeta1('stack1'));
    test.equal('stack1', out.name);
    test.equal('12345', out.environment!.account);
    test.equal('us-east-1', out.environment!.region);
    test.done();
  },

  '"cons" will return the cloudformation template for the required stack'(test: Test) {
    const out1 = (runConsNoMeta1('stack1')).template;
    test.deepEqual(out1, { Resources:
      { s1c1: { Type: 'DummyResource', Properties: { Prop1: 'Prop1' } },
        s1c2: { Type: 'DummyResource', Properties: { Foo: 123 } } } });

    const out2 = (runConsNoMeta1('stack2')).template;
    test.deepEqual(out2,
      { Resources:
      { s2c1: { Type: 'DummyResource', Properties: { Prog2: 'Prog2' } },
        s1c2r1D1791C01: { Type: 'ResourceType1' },
        s1c2r25F685FFF: { Type: 'ResourceType2' } } });

    test.done();
  },

  'synth(name) can be used programmatically'(test: Test) {
    const prog = new App();
    const stack = new Stack(prog, 'MyStack');
    new Resource(stack, 'MyResource', { type: 'MyResourceType' });

    let throws;
    try {
      prog.synthesizeStacks(['foo']);
    } catch (e) {
      throws = e.message;
    }
    test.ok(throws.indexOf('Cannot find stack foo') !== -1);

    test.deepEqual(prog.synthesizeStack('MyStack').template,
      { Resources: { MyResource: { Type: 'MyResourceType' } } });
    test.done();
  },

  'synth(name) also collects metadata from all constructs in the stack'(test: Test) {
    const response = runMain({type: 'synth', stacks: ['stack1']}) as cxapi.SynthesizeResponse;

    const output = response.stacks[0].metadata;
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

    const response2 = runMain({type: 'synth', stacks: ['stack2']}) as cxapi.SynthesizeResponse;
    const output2 = response2.stacks[0].metadata;

    test.ok(output2['/stack2/s1c2']);
    test.equal(output2['/stack2/s1c2'][0].type, 'meta');
    test.deepEqual(output2['/stack2/s1c2'][0].data, { key: 'value' });

    test.done();
  },

  'context can be passed using the -c option'(test: Test) {
    const prog = new App([ 'myprog', JSON.stringify({
      type: 'synth',
      stackName: 'stack',
      context: {
        key1: 'val1',
        key2: 'val2'
      }
    })]);
    test.deepEqual(prog.getContext('key1'), 'val1');
    test.deepEqual(prog.getContext('key2'), 'val2');
    test.done();
  },

  'context from the command line can be used when creating the stack'(test: Test) {
    const output = runConsNoMeta1('stack2', { ctx1: 'HELLO' });

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
    prog.setContext('foo', 'bar');
    test.deepEqual(prog.getContext('foo'), 'bar');
    test.done();
  },

  'setContext(k,v) cannot be called after stacks have been added because stacks may use the context'(test: Test) {
    const prog = new App();
    new Stack(prog, 's1');
    test.throws(() => prog.setContext('foo', 'bar'));
    test.done();
  },

  'app.synthesizeStack(stack) performs validation first (app.validateAll()) and if there are errors, it returns the errors'(test: Test) {

    class Child extends Construct {
      public validate() {
        return [ `Error from ${this.id}` ];
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
    }, /Stack validation failed with the following errors/);

    test.done();
  },

  'app.synthesizeStack(stack) will return a list of missing contextual information'(test: Test) {
    const command: cxapi.CXRequest = {
      type: 'synth',
      stacks: ['MyStack']
    };

    class MyStack extends Stack {
      constructor(parent: App, name: string, props?: StackProps) {
        super(parent, name, props);

        this.reportMissingContext('missing-context-key', {
          provider: 'ctx-provider',
          args: [ 'arg1', 'arg2' ],
          scope: [ 'scope1', 'scope2' ]
        });

        this.reportMissingContext('missing-context-key-2', {
          provider: 'ctx-provider',
          args: [ 'arg1', 'arg2' ],
          scope: [ 'scope1', 'scope2' ]
        });
      }
    }

    const app = new App([ 'prog', JSON.stringify(command) ]);

    new MyStack(app, 'MyStack');

    const response = JSON.parse(app.run()) as cxapi.SynthesizeResponse;

    test.deepEqual(response.stacks[0].missing, {
      "missing-context-key": {
      provider: "ctx-provider",
      args: [
        "arg1",
        "arg2"
      ],
      scope: [
        "scope1",
        "scope2"
      ]
      },
      "missing-context-key-2": {
      provider: "ctx-provider",
      args: [
        "arg1",
        "arg2"
      ],
      scope: [
        "scope1",
        "scope2"
      ]
      }
    });

    test.done();
  },

  'requests can also be base64 encoded'(test: Test) {
    const req = {
      type: 'list'
    };
    const resp = main('base64:' + new Buffer(JSON.stringify(req)).toString('base64'));
    test.deepEqual(resp, {
      stacks: [
        {
        name: "stack1",
        environment: {
          name: "12345/us-east-1",
          account: "12345",
          region: "us-east-1"
        }
        },
        {
        name: "stack2"
        }
      ]
    });

    test.done();
  },

  'fails when base64 cannot be encoded'(test: Test) {
    test.throws(() => main('base64:'), /Unexpected end of JSON input/);
    test.done();
  }
};

class MyConstruct extends Construct {
  constructor(parent: Construct, name: string) {
    super(parent, name);

    new Resource(this, 'r1', { type: 'ResourceType1' });
    new Resource(this, 'r2', { type: 'ResourceType2', properties: { FromContext: this.getContext('ctx1') } });
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
