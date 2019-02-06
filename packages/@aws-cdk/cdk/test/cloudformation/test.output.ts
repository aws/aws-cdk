import { Test } from 'nodeunit';
import { Output, Ref, Resource, Stack } from '../../lib';

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

  'if stack name is undefined, we will only use the logical ID for the export name'(test: Test) {
    const stack = new Stack();
    const output = new Output(stack, 'MyOutput');
    test.deepEqual(stack.node.resolve(output.makeImportValue()), { 'Fn::ImportValue': 'MyOutput' });
    test.done();
  },

  'makeImportValue can be used to create an Fn::ImportValue from an output'(test: Test) {
    const stack = new Stack(undefined, 'MyStack');
    const output = new Output(stack, 'MyOutput');
    test.deepEqual(stack.node.resolve(output.makeImportValue()), { 'Fn::ImportValue': 'MyStack:MyOutput' });

    test.deepEqual(stack.toCloudFormation(), {
      Outputs: {
        MyOutput: {
          Export: { Name: 'MyStack:MyOutput' }
        }
      }
    });
    test.done();
  },

  'No export is created by default'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new Output(stack, 'SomeOutput', { value: 'x' });

    // THEN
    test.deepEqual(stack.toCloudFormation(), {
      Outputs: {
        SomeOutput: {
          Value: 'x'
        }
      }
    });

    test.done();
  },
};
