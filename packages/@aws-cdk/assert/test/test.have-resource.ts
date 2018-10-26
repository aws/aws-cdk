import { Test } from 'nodeunit';
import { expect, haveResource } from '../lib/index';

export = {
  'support resource with no properties'(test: Test) {
    const synthStack = mkStack({
      Resources: {
        SomeResource: {
          Type: 'Some::Resource'
        }
      }
    });
    expect(synthStack).to(haveResource('Some::Resource'));

    test.done();
  },

  'haveResource tells you about mismatched fields'(test: Test) {
    const synthStack = mkStack({
      Resources: {
        SomeResource: {
          Type: 'Some::Resource',
          Properties: {
            PropA: 'somevalue'
          }
        }
      }
    });

    test.throws(() => {
      expect(synthStack).to(haveResource('Some::Resource', {
        PropA: 'othervalue'
      }));
    }, /PropA/);

    test.done();
  }
};

function mkStack(template: any) {
  return {
    name: 'test',
    template,
    metadata: {},
    environment: {
      name: 'test',
      account: 'test',
      region: 'test'
    }
  };
}