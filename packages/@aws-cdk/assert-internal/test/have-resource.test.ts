import {
  ABSENT,
  arrayWith,
  exactValue,
  expect as cdkExpect,
  haveResource,
  haveResourceLike,
  Capture,
  anything,
  stringLike,
} from '../lib/index';
import { mkResource, mkStack } from './cloud-artifact';

test('support resource with no properties', async () => {
  const synthStack = mkStack({
    Resources: {
      SomeResource: {
        Type: 'Some::Resource',
      },
    },
  });
  await cdkExpect(synthStack).to(haveResource('Some::Resource'));
});

test('haveResource tells you about mismatched fields', async () => {
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

  await expect(async () => {
    await cdkExpect(synthStack).to(haveResource('Some::Resource', {
      PropA: 'othervalue',
    }));
  }).rejects.toThrowError(/PropA/);
});

test('haveResource value matching is strict by default', async () => {
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

  await expect(async () => {
    await cdkExpect(synthStack).to(haveResource('Some::Resource', {
      PropA: {
        foo: 'somevalue',
      },
    }));
  }).rejects.toThrowError(/PropA/);
});

test('haveResource allows to opt in value extension', async () => {
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

  await cdkExpect(synthStack).to(haveResource('Some::Resource', {
    PropA: {
      foo: 'somevalue',
    },
  }, undefined, true));
});

describe('property absence', () => {
  test('pass on absence', async () => {
    const synthStack = mkResource({
      Prop: 'somevalue',
    });

    await cdkExpect(synthStack).to(haveResource('Some::Resource', {
      PropA: ABSENT,
    }));
  });

  test('fail on presence', async () => {
    const synthStack = mkResource({
      PropA: 3,
    });

    await expect(async () => {
      await cdkExpect(synthStack).to(haveResource('Some::Resource', {
        PropA: ABSENT,
      }));
    }).rejects.toThrowError(/PropA/);
  });

  test('pass on deep absence', async () => {
    const synthStack = mkResource({
      Deep: {
        Prop: 'somevalue',
      },
    });

    await cdkExpect(synthStack).to(haveResource('Some::Resource', {
      Deep: {
        Prop: 'somevalue',
        PropA: ABSENT,
      },
    }));
  });

  test('fail on deep presence', async () => {
    const synthStack = mkResource({
      Deep: {
        Prop: 'somevalue',
      },
    });

    await expect(async () => {
      await cdkExpect(synthStack).to(haveResource('Some::Resource', {
        Deep: {
          Prop: ABSENT,
        },
      }));
    }).rejects.toThrowError(/Prop/);
  });

  test('can use matcher to test for list element', async () => {
    const synthStack = mkResource({
      List: [
        { Prop: 'distraction' },
        { Prop: 'goal' },
      ],
    });

    await expect(async () => {
      await cdkExpect(synthStack).to(haveResource('Some::Resource', {
        List: arrayWith({ Prop: 'goal' }),
      }));
    }).not.toThrowError();

    await expect(async () => {
      await cdkExpect(synthStack).to(haveResource('Some::Resource', {
        List: arrayWith({ Prop: 'missme' }),
      }));
    }).rejects.toThrowError(/Array did not contain expected element/);
  });

  test('can use matcher to test stringLike on single-line strings', async () => {
    const synthStack = mkResource({
      Content: 'something required something',
    });

    await expect(async () => {
      await cdkExpect(synthStack).to(haveResource('Some::Resource', {
        Content: stringLike('*required*'),
      }));
    }).not.toThrowError();
  });

  test('can use matcher to test stringLike on multi-line strings', async () => {
    const synthStack = mkResource({
      Content: 'something\nrequired\nsomething',
    });

    await expect(async () => {
      await cdkExpect(synthStack).to(haveResource('Some::Resource', {
        Content: stringLike('*required*'),
      }));
    }).not.toThrowError();
  });

  test('arrayContaining must match all elements in any order', async () => {
    const synthStack = mkResource({
      List: ['a', 'b'],
    });

    await expect(async () => {
      await cdkExpect(synthStack).to(haveResource('Some::Resource', {
        List: arrayWith('b', 'a'),
      }));
    }).not.toThrowError();

    await expect(async () => {
      await cdkExpect(synthStack).to(haveResource('Some::Resource', {
        List: arrayWith('a', 'c'),
      }));
    }).rejects.toThrowError(/Array did not contain expected element/);
  });

  test('exactValue escapes from deep fuzzy matching', async () => {
    const synthStack = mkResource({
      Deep: {
        PropA: 'A',
        PropB: 'B',
      },
    });

    await expect(async () => {
      await cdkExpect(synthStack).to(haveResourceLike('Some::Resource', {
        Deep: {
          PropA: 'A',
        },
      }));
    }).not.toThrowError();

    await expect(async () => {
      await cdkExpect(synthStack).to(haveResourceLike('Some::Resource', {
        Deep: exactValue({
          PropA: 'A',
        }),
      }));
    }).rejects.toThrowError(/Unexpected keys present in object/);
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
  test('objectContainingDeep has deep effect through lists', async () => {
    const synthStack = mkResource({
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

    await expect(async () => {
      await cdkExpect(synthStack).to(haveResourceLike('Some::Resource', {
        List: [
          { PropA: 'A' },
          { PropB: 'B' },
        ],
      }));
    }).not.toThrowError();
  });

  test('test capturing', async () => {
    const synthStack = mkResource({
      Prop: 'somevalue',
    });

    const propValue = Capture.aString();
    await cdkExpect(synthStack).to(haveResourceLike('Some::Resource', {
      Prop: propValue.capture(anything()),
    }));

    expect(propValue.capturedValue).toEqual('somevalue');
  });
});
