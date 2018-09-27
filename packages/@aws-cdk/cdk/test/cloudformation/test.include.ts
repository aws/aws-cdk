import { Test } from 'nodeunit';
import { Include, Output, Parameter, Resource, Stack } from '../../lib';

export = {
  'the Include construct can be used to embed an existing template as-is into a stack'(test: Test) {
    const stack = new Stack();

    new Include(stack, 'T1', { template: clone(template) });

    test.deepEqual(stack.toCloudFormation(), {
      Parameters: { MyParam: { Type: 'String', Default: 'Hello' } },
      Resources: {
        MyResource1: { Type: 'ResourceType1', Properties: { P1: 1, P2: 2 } },
        MyResource2: { Type: 'ResourceType2' } } });

    test.done();
  },

  'included templates can co-exist with elements created programmatically'(test: Test) {
    const stack = new Stack();

    new Include(stack, 'T1', { template: clone(template) });
    new Resource(stack, 'MyResource3', { type: 'ResourceType3', properties: { P3: 'Hello' } });
    new Output(stack, 'MyOutput', { description: 'Out!', disableExport: true });
    new Parameter(stack, 'MyParam2', { type: 'Integer' });

    test.deepEqual(stack.toCloudFormation(), {
      Parameters: {
        MyParam: { Type: 'String', Default: 'Hello' },
        MyParam2: { Type: 'Integer' } },
      Resources: {
        MyResource1: { Type: 'ResourceType1', Properties: { P1: 1, P2: 2 } },
        MyResource2: { Type: 'ResourceType2' },
        MyResource3: { Type: 'ResourceType3', Properties: { P3: 'Hello' } } },
       Outputs: {
         MyOutput: { Description: 'Out!' } } });

    test.done();
  },

  'exception is thrown in construction if an entity from an included template has the same id as a programmatic entity'(test: Test) {
    const stack = new Stack();

    new Include(stack, 'T1', { template });
    new Resource(stack, 'MyResource3', { type: 'ResourceType3', properties: { P3: 'Hello' } });
    new Output(stack, 'MyOutput', { description: 'Out!' });
    new Parameter(stack, 'MyParam', { type: 'Integer' }); // duplicate!

    test.throws(() => stack.toCloudFormation());
    test.done();
  },
};

const template = {
  Parameters: {
    MyParam: {
      Type: 'String',
      Default: 'Hello'
    }
  },
  Resources: {
    MyResource1: {
      Type: 'ResourceType1',
      Properties: {
        P1: 1,
        P2: 2,
      }
    },
    MyResource2: {
      Type: 'ResourceType2'
    }
  }
};

/**
 * @param obj an object to clone
 * @returns a deep clone of ``obj`.
 */
function clone(obj: any): any {
  switch (typeof obj) {
  case 'object':
    if (Array.isArray(obj)) {
      return obj.map(elt => clone(elt));
    } else {
      const cloned: any = {};
      for (const key of Object.keys(obj)) {
        cloned[key] = clone(obj[key]);
      }
      return cloned;
    }
  default:
    return obj;
  }
}
