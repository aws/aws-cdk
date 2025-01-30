import { checkRenaming } from '../lib/refactoring';

test('identical objects result in an empty correspondence', () => {
  const a = {
    foo: 123,
    bar: 'blah',
  };

  const b = {
    bar: 'blah',
    foo: 123,
  };
  expect(checkRenaming(a, b)).toEqual([]);
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

  expect(checkRenaming(a, b)).toEqual([]);
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

  expect(checkRenaming(a, b)).toEqual([
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

  expect(checkRenaming(a, b)).toEqual([]);
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

  expect(checkRenaming(a, b)).toEqual([]);
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

  expect(checkRenaming(a, b)).toEqual([
    [new Set(['oldName']), new Set(['newName'])],
  ]);
});
