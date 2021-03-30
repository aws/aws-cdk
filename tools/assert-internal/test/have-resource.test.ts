import { writeFileSync } from 'fs';
import { join } from 'path';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import { ABSENT, arrayWith, exactValue, expect as cdkExpect, haveResource, haveResourceLike, Capture, anything } from '../lib/index';

test('support resource with no properties', () => {
  const synthStack = mkStack({
    Resources: {
      SomeResource: {
        Type: 'Some::Resource',
      },
    },
  });
  expect(() => cdkExpect(synthStack).to(haveResource('Some::Resource'))).not.toThrowError();
});

test('haveResource tells you about mismatched fields', () => {
  const synthStack = mkStack({
    Resources: {
      SomeResource: {
        Type: 'Some::Resource',
        Properties: {
          PropA: 'somevalue',
        },
      },
    },
  });

  expect(() => {
    cdkExpect(synthStack).to(haveResource('Some::Resource', {
      PropA: 'othervalue',
    }));
  }).toThrowError(/PropA/);
});

test('haveResource value matching is strict by default', () => {
  const synthStack = mkStack({
    Resources: {
      SomeResource: {
        Type: 'Some::Resource',
        Properties: {
          PropA: {
            foo: 'somevalue',
            bar: 'This is unexpected, so the value of PropA doesn\'t strictly match - it shouldn\'t pass',
          },
          PropB: 'This property is unexpected, but it\'s allowed',
        },
      },
    },
  });

  expect(() => {
    cdkExpect(synthStack).to(haveResource('Some::Resource', {
      PropA: {
        foo: 'somevalue',
      },
    }));
  }).toThrowError(/PropA/);
});

test('haveResource allows to opt in value extension', () => {
  const synthStack = mkStack({
    Resources: {
      SomeResource: {
        Type: 'Some::Resource',
        Properties: {
          PropA: {
            foo: 'somevalue',
            bar: 'Additional value is permitted, as we opted in',
          },
          PropB: 'Additional properties is always okay!',
        },
      },
    },
  });

  expect(() =>
    cdkExpect(synthStack).to(haveResource('Some::Resource', {
      PropA: {
        foo: 'somevalue',
      },
    }, undefined, true)),
  ).not.toThrowError();
});

describe('property absence', () => {
  test('pass on absence', () => {
    const synthStack = mkSomeResource({
      Prop: 'somevalue',
    });

    cdkExpect(synthStack).to(haveResource('Some::Resource', {
      PropA: ABSENT,
    }));
  });

  test('fail on presence', () => {
    const synthStack = mkSomeResource({
      PropA: 3,
    });

    expect(() => {
      cdkExpect(synthStack).to(haveResource('Some::Resource', {
        PropA: ABSENT,
      }));
    }).toThrowError(/PropA/);
  });

  test('pass on deep absence', () => {
    const synthStack = mkSomeResource({
      Deep: {
        Prop: 'somevalue',
      },
    });

    cdkExpect(synthStack).to(haveResource('Some::Resource', {
      Deep: {
        Prop: 'somevalue',
        PropA: ABSENT,
      },
    }));
  });

  test('fail on deep presence', () => {
    const synthStack = mkSomeResource({
      Deep: {
        Prop: 'somevalue',
      },
    });

    expect(() => {
      cdkExpect(synthStack).to(haveResource('Some::Resource', {
        Deep: {
          Prop: ABSENT,
        },
      }));
    }).toThrowError(/Prop/);
  });

  test('can use matcher to test for list element', () => {
    const synthStack = mkSomeResource({
      List: [
        { Prop: 'distraction' },
        { Prop: 'goal' },
      ],
    });

    expect(() => {
      cdkExpect(synthStack).to(haveResource('Some::Resource', {
        List: arrayWith({ Prop: 'goal' }),
      }));
    }).not.toThrowError();

    expect(() => {
      cdkExpect(synthStack).to(haveResource('Some::Resource', {
        List: arrayWith({ Prop: 'missme' }),
      }));
    }).toThrowError(/Array did not contain expected element/);
  });

  test('arrayContaining must match all elements in any order', () => {
    const synthStack = mkSomeResource({
      List: ['a', 'b'],
    });

    expect(() => {
      cdkExpect(synthStack).to(haveResource('Some::Resource', {
        List: arrayWith('b', 'a'),
      }));
    }).not.toThrowError();

    expect(() => {
      cdkExpect(synthStack).to(haveResource('Some::Resource', {
        List: arrayWith('a', 'c'),
      }));
    }).toThrowError(/Array did not contain expected element/);
  });

  test('exactValue escapes from deep fuzzy matching', () => {
    const synthStack = mkSomeResource({
      Deep: {
        PropA: 'A',
        PropB: 'B',
      },
    });

    expect(() => {
      cdkExpect(synthStack).to(haveResourceLike('Some::Resource', {
        Deep: {
          PropA: 'A',
        },
      }));
    }).not.toThrowError();

    expect(() => {
      cdkExpect(synthStack).to(haveResourceLike('Some::Resource', {
        Deep: exactValue({
          PropA: 'A',
        }),
      }));
    }).toThrowError(/Unexpected keys present in object/);
  });

  /**
   * Backwards compatibility test
   *
   * If we had designed this with a matcher library from the start, we probably wouldn't
   * have had this behavior, but here we are.
   *
   * Historically, when we do `haveResourceLike` (which maps to `objectContainingDeep`) with
   * a pattern containing lists of objects, the objects inside the list are also matched
   * as 'containing' keys (instead of having to completely 'match' the pattern objects).
   *
   * People will have written assertions depending on this behavior, so we have to maintain
   * it.
   */
  test('objectContainingDeep has deep effect through lists', () => {
    const synthStack = mkSomeResource({
      List: [
        {
          PropA: 'A',
          PropB: 'B',
        },
        {
          PropA: 'A',
          PropB: 'B',
        },
      ],
    });

    expect(() => {
      cdkExpect(synthStack).to(haveResourceLike('Some::Resource', {
        List: [
          { PropA: 'A' },
          { PropB: 'B' },
        ],
      }));
    }).not.toThrowError();
  });

  test('test capturing', () => {
    const synthStack = mkSomeResource({
      Prop: 'somevalue',
    });

    const propValue = Capture.aString();
    cdkExpect(synthStack).to(haveResourceLike('Some::Resource', {
      Prop: propValue.capture(anything()),
    }));

    expect(propValue.capturedValue).toEqual('somevalue');
  });
});

function mkStack(template: any): cxapi.CloudFormationStackArtifact {
  const assembly = new cxapi.CloudAssemblyBuilder();
  assembly.addArtifact('test', {
    type: cxschema.ArtifactType.AWS_CLOUDFORMATION_STACK,
    environment: cxapi.EnvironmentUtils.format('123456789', 'us-west-2'),
    properties: {
      templateFile: 'template.json',
    },
  });

  writeFileSync(join(assembly.outdir, 'template.json'), JSON.stringify(template));
  return assembly.buildAssembly().getStackByName('test');
}

function mkSomeResource(props: any): cxapi.CloudFormationStackArtifact {
  return mkStack({
    Resources: {
      SomeResource: {
        Type: 'Some::Resource',
        Properties: props,
      },
    },
  });
}