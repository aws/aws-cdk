import { findResourceCorrespondence, RenamingPair, ResourceCorrespondence } from '../lib/refactoring';

describe('findResourceCorrespondence', () => {
  test('identical objects result in an empty correspondence', () => {
    const a = {
      foo: 123,
      bar: 'blah',
    };

    const b = {
      bar: 'blah',
      foo: 123,
    };
    expect(findResourceCorrespondence(a, b).pairs).toEqual([]);
  });

  test('an empty object results in an empty correspondence', () => {
    const a = {};

    const b = {
      bar: 'blah',
      foo: 123,
    };
    expect(findResourceCorrespondence(a, b).pairs).toEqual([]);
  });

  test('changes in the value for the same key result in an empty correspondence', () => {
    const a = {
      foo: 123,
      bar: 'blah',
    };

    const b = {
      bar: 'zee',
      foo: 123,
    };

    expect(findResourceCorrespondence(a, b).pairs).toEqual([]);
  });

  test('renaming shows up in the correspondence', () => {
    const a = {
      foo: 123,
      oldName: 'blah',
    };

    const b = {
      newName: 'blah',
      foo: 123,
    };

    expect(findResourceCorrespondence(a, b).pairs).toEqual([
      [new Set(['oldName']), new Set(['newName'])],
    ]);
  });

  test('changes in unrelated keys result in an empty correspondence', () => {
    const a = {
      foo: 123,
      oldName: 'blah',
    };

    const b = {
      newName: 'value also changed, so it is an entirely new thing',
      foo: 123,
    };

    expect(findResourceCorrespondence(a, b).pairs).toEqual([]);
  });

  test('Metadata field at the top level is ignored', () => {
    const a = {
      foo: 123,
      oldName: 'blah',
      Metadata: '/some/value',
    };

    const b = {
      foo: 123,
      oldName: 'blah',
      Metadata: '/some/other/value',
    };

    expect(findResourceCorrespondence(a, b).pairs).toEqual([]);
  });

  test('Correspondence between complex objects', () => {
    const a = {
      oldName: {
        name: 'AWS Service',
        category: 'Cloud Computing',
        launched: 2006,
        specialChars: "!@#$%^&*()_+{}[]|\\:;\"'<>,.?/",
        unicode: 'こんにちは、AWS！',
        mixedArray: [1, 'two', false, null, 3.14],
      },
    };

    const b = {
      newName: {
        name: 'AWS Service',
        category: 'Cloud Computing',
        launched: 2006,
        specialChars: "!@#$%^&*()_+{}[]|\\:;\"'<>,.?/",
        unicode: 'こんにちは、AWS！',
        mixedArray: [1, 'two', false, null, 3.14],
      },
    };

    expect(findResourceCorrespondence(a, b).pairs).toEqual([
      [new Set(['oldName']), new Set(['newName'])],
    ]);
  });
});

describe('toString', () => {
  test('formats as a human readable string', () => {
    const oldResources = {
      a: {
        Metadata: {
          'aws:cdk:path': '/foo/a',
        },
      },
      b: {
        Metadata: {
          'aws:cdk:path': '/foo/b',
        },
      },
      c: {
        Metadata: {
          'aws:cdk:path': '/foo/c',
        },
      },
    };

    const newResources = {
      d: {
        Metadata: {
          'aws:cdk:path': '/foo/d',
        },
      },
      e: {
        Metadata: {
          'aws:cdk:path': '/foo/e',
        },
      },
      f: {
        Metadata: {
          'aws:cdk:path': '/foo/f',
        },
      },
    };

    const correspondence: RenamingPair[] = [
      [new Set(['a']), new Set(['d'])],
      [new Set(['b', 'c']), new Set(['e', 'f'])],
    ];

    const foo = new ResourceCorrespondence(correspondence, oldResources, newResources);

    expect(foo.toString()).toEqual(`
  - /foo/a -> /foo/d
  - {/foo/b, /foo/c} -> {/foo/e, /foo/f}
`,
    );
  });
});
