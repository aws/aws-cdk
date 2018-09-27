import { Test } from 'nodeunit';
import { Construct, Output, Ref, resolve, Resource, Stack } from '../../lib';

export = {
  'outputs can be added to the stack'(test: Test) {
    const stack = new Stack();
    const res = new Resource(stack, 'MyResource', { type: 'R' });
    const ref = new Ref(res);

    new Output(stack, 'MyOutput', {
      export: 'ExportName',
      value: ref,
      description: 'Output properties'
    });
    test.deepEqual(stack.toCloudFormation(), { Resources: { MyResource: { Type: 'R' } },
    Outputs:
     { MyOutput:
      { Description: 'Output properties',
        Export: { Name: 'ExportName' },
        Value: { Ref: 'MyResource' } } } });
    test.done();
  },

  'outputs cannot be referenced'(test: Test) {
    const stack = new Stack();
    const output = new Output(stack, 'MyOutput', { description: 'My Output' });
    test.throws(() => output.ref);
    test.done();
  },

  'outputs have a default unique export name'(test: Test) {
    const stack = new Stack(undefined, 'MyStack');
    const output = new Output(stack, 'MyOutput');
    const child = new Construct(stack, 'MyConstruct');
    const output2 = new Output(child, 'MyOutput2');
    test.equal(output.export, 'MyStack:MyOutput');
    test.equal(output2.export, 'MyStack:MyConstructMyOutput255322D15');
    test.done();
  },

  'disableExport can be used to disable the auto-export behavior'(test: Test) {
    const stack = new Stack();
    const output = new Output(stack, 'MyOutput', { disableExport: true });

    test.equal(output.export, null);

    // cannot specify `export` and `disableExport` at the same time.
    test.throws(() => new Output(stack, 'YourOutput', {
      disableExport: true,
      export: 'bla'
    }), /Cannot set `disableExport` and specify an export name/);

    test.done();
  },

  'is stack name is undefined, we will only use the logical ID for the export name'(test: Test) {
    const stack = new Stack();
    const output = new Output(stack, 'MyOutput');
    test.equal(output.export, 'MyOutput');
    test.done();
  },

  'makeImportValue can be used to create an Fn::ImportValue from an output'(test: Test) {
    const stack = new Stack(undefined, 'MyStack');
    const output = new Output(stack, 'MyOutput');
    test.deepEqual(resolve(output.makeImportValue()), { 'Fn::ImportValue': 'MyStack:MyOutput' });
    test.done();
  }
};
