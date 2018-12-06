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
  },

  'haveResource value matching is strict by default'(test: Test) {
    const synthStack = mkStack({
      Resources: {
        SomeResource: {
          Type: 'Some::Resource',
          Properties: {
            PropA: {
              foo: 'somevalue',
              bar: 'This is unexpected, so the value of PropA doesn\'t strictly match - it shouldn\'t pass'
            },
            PropB: 'This property is unexpected, but it\'s allowed'
          }
        }
      }
    });

    test.throws(() => {
      expect(synthStack).to(haveResource('Some::Resource', {
        PropA: {
          foo: 'somevalue'
        }
      }));
    }, /PropA/);

    test.done();
  },

  'haveResource allows to opt in value extension'(test: Test) {
    const synthStack = mkStack({
      Resources: {
        SomeResource: {
          Type: 'Some::Resource',
          Properties: {
            PropA: {
              foo: 'somevalue',
              bar: 'Additional value is permitted, as we opted in'
            },
            PropB: 'Additional properties is always okay!'
          }
        }
      }
    });

    expect(synthStack).to(haveResource('Some::Resource', {
      PropA: {
        foo: 'somevalue'
      }
    }, undefined, true));

    test.done();
  },
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
