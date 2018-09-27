import { Test } from 'nodeunit';
import { Construct, Parameter, resolve, Resource, Stack } from '../../lib';

export = {
  'parameters can be used and referenced using param.ref'(test: Test) {
    const stack = new Stack();

    const child = new Construct(stack, 'Child');
    const param = new Parameter(child, 'MyParam', {
      default: 10,
      type: 'Integer',
      description: 'My first parameter'
    });

    new Resource(stack, 'Resource', { type: 'Type', properties: { ReferenceToParam: param.ref } });

    test.deepEqual(stack.toCloudFormation(), {
      Parameters: {
        [param.logicalId]: {
          Default: 10,
          Type: 'Integer',
          Description: 'My first parameter' } },
      Resources: {
        Resource: {
          Type: 'Type',
          Properties: { ReferenceToParam: { Ref: param.logicalId } } } } });

    test.done();
  },

  'parameters are tokens, so they can be assigned without .ref and their Ref will be taken'(test: Test) {
    const stack = new Stack();
    const param = new Parameter(stack, 'MyParam', { type: 'String' });

    test.deepEqual(resolve(param), { Ref: 'MyParam' });
    test.done();
  }
};
