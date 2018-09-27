import { Test } from 'nodeunit';
import { Mapping, Resource, Stack } from '../../lib';

export = {
  'mappings can be added as another type of entity, and mapping.findInMap can be used to get a token'(test: Test) {
    const stack = new Stack();
    const mapping = new Mapping(stack, 'MyMapping', { mapping: {
      TopLevelKey1: {
        SecondLevelKey1: [ 1, 2, 3 ],
        SecondLevelKey2: { Hello: 'World' }
      },
      TopLevelKey2: {
        SecondLevelKey1: [ 99, 99, 99 ]
      }
    } });

    // findInMap can be used to take a reference
    new Resource(stack, 'MyResource', {
      type: 'R',
      properties: {
        RefToValueInMap: mapping.findInMap('TopLevelKey1', 'SecondLevelKey1')
      }
    });
    test.throws(() => mapping.findInMap('NotFoundTopLevel', 'NotFound'), 'cant take a reference on a non existing key');
    test.throws(() => mapping.findInMap('TopLevelKey1', 'NotFound'), 'cant take a reference on a non existing key');

    // set value can be used to set/modify a specific value
    mapping.setValue('TopLevelKey2', 'SecondLevelKey2', 'Hi');
    mapping.setValue('TopLevelKey1', 'SecondLevelKey1', [ 1, 2, 3, 4 ]);

    test.deepEqual(stack.toCloudFormation(), { Mappings:
      { MyMapping:
         { TopLevelKey1:
          { SecondLevelKey1: [ 1, 2, 3, 4 ],
          SecondLevelKey2: { Hello: 'World' } },
         TopLevelKey2: { SecondLevelKey1: [ 99, 99, 99 ], SecondLevelKey2: 'Hi' } } },
       Resources:
      { MyResource:
         { Type: 'R',
         Properties:
          { RefToValueInMap:
           { 'Fn::FindInMap': [ 'MyMapping', 'TopLevelKey1', 'SecondLevelKey1' ] } } } } });

    test.done();
  },
};
