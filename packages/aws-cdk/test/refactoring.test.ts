import { checkRenaming } from '../lib/refactoring';

test('identical maps result in an empty correspondence', () => {
  const a = new Map<string, any>([
    ['foo', 123],
    ['bar', 'blah'],
  ]);
  const b = new Map<string, any>([
    ['foo', 123],
    ['bar', 'blah'],
  ]);

  expect(checkRenaming(a, b)).toEqual([]);
});

test('changes in the value for the same key result in an empty correspondence', () => {
  const a = new Map<string, any>([
    ['foo', 123],
    ['bar', 'blah'],
  ]);
  const b = new Map<string, any>([
    ['foo', 123],
    ['bar', 'zee'],
  ]);

  expect(checkRenaming(a, b)).toEqual([]);
});

test('renaming shows up in the correspondence', () => {
  const a = new Map<string, any>([
    ['foo', 123],
    ['oldName', 'blah'],
  ]);
  const b = new Map<string, any>([
    ['foo', 123],
    ['newName', 'blah'],
  ]);

  expect(checkRenaming(a, b)).toEqual([
    [new Set(['oldName']), new Set(['newName'])],
  ]);
});

test('changes in unrelated keys result in an empty correspondence', () => {
  const a = new Map<string, any>([
    ['foo', 123],
    ['oldName', 'blah'],
  ]);
  const b = new Map<string, any>([
    ['foo', 123],
    ['newName', 'value also changed, so it is an entirely new thing'],
  ]);

  expect(checkRenaming(a, b)).toEqual([]);
});

test('Metadata field at the top level is ignored', () => {
  const a = new Map<string, any>([
    ['foo', 123],
    ['oldName', 'blah'],
    ['Metadata', '/some/value'],
  ]);
  const b = new Map<string, any>([
    ['foo', 123],
    ['oldName', 'blah'],
    ['Metadata', '/some/other/value'],
  ]);

  expect(checkRenaming(a, b)).toEqual([]);
});

// TODO test for complex, nested objects
