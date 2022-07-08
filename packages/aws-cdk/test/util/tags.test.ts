import { validateTags } from '../../lib/util/tags';

test('validateTags does not throw when given undefined', () => {
  expect(validateTags(undefined)).toBeUndefined();
});

test('validateTags does not throw when given an empty array', () => {
  const tags: any = [];
  expect(validateTags(tags)).toBe(tags);
});

test('validateTags does not throw when given array of Tag objects', () => {
  const tags: any = [{ Tag: 'a', Value: 'b' }];
  expect(validateTags(tags)).toBe(tags);
});

test('validateTags throws when given an object', () => {
  expect(() => validateTags({ a: 'b' })).toThrow('tags must be');
});

test('validateTags throws when given an array of non-Tag objects', () => {
  expect(() => validateTags([{ a: 'b' }])).toThrow('tags must be');
});

test('validateTags throws when Tag is not a string', () => {
  expect(() => validateTags([{ Tag: null, Value: 'b' }])).toThrow();
});

test('validateTags throws when Value is not a string', () => {
  expect(() => validateTags([{ Tag: 'a', Value: null }])).toThrow();
});
