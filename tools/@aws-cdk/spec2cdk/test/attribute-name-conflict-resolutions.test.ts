import { attributePropertyNames } from '../lib/cdk/attribute-name-conflict-resolutions';

const RESOURCE_TYPE = 'AWS::Some::Resource';
const RESOLUTIONS = {
  [RESOURCE_TYPE]: {
    'Foo.Bar': 'FooBarValue',
  },
};

test.each([
  ['flat attribute first', ['FooBar', 'Foo.Bar']],
  ['nested attribute first', ['Foo.Bar', 'FooBar']],
])('the flat attribute keeps the preferred name and the nested one takes its recorded name (%s)', (_name, attributeNames) => {
  // WHEN
  const names = attributePropertyNames(RESOURCE_TYPE, attributeNames, RESOLUTIONS);

  // THEN
  expect(names.get('FooBar')).toEqual('attrFooBar');
  expect(names.get('Foo.Bar')).toEqual('attrFooBarValue');
});

test('an attribute name conflict with no recorded resolution throws', () => {
  // WHEN
  const resolve = () => attributePropertyNames(RESOURCE_TYPE, ['FooBar', 'Foo.Bar'], {});

  // THEN
  expect(resolve).toThrow(
    "Attribute name conflict on AWS::Some::Resource between 'FooBar' and 'Foo.Bar', which both become 'attrFooBar'. Update attribute-name-conflict-resolutions.ts to rename the newer attribute to something else.",
  );
});

test('a recorded resolution that another attribute already uses throws', () => {
  // WHEN
  const resolve = () => attributePropertyNames(RESOURCE_TYPE, ['FooBar', 'FooBarValue', 'Foo.Bar'], RESOLUTIONS);

  // THEN
  expect(resolve).toThrow(
    "Attribute name conflict on AWS::Some::Resource: the recorded name 'FooBarValue' for 'Foo.Bar' becomes 'attrFooBarValue', which 'FooBarValue' already uses. Update attribute-name-conflict-resolutions.ts to rename it to something else.",
  );
});

test('a recorded resolution for an attribute that no longer conflicts is ignored', () => {
  // WHEN - Foo.Bar is the only attribute, so nothing collides with it
  const names = attributePropertyNames(RESOURCE_TYPE, ['Foo.Bar'], RESOLUTIONS);

  // THEN - it keeps the preferred name rather than taking the recorded one
  expect(names.get('Foo.Bar')).toEqual('attrFooBar');
});

test('attributes that do not conflict all keep their preferred names', () => {
  // WHEN
  const names = attributePropertyNames(RESOURCE_TYPE, ['Arn', 'Foo.Baz'], RESOLUTIONS);

  // THEN
  expect([...names]).toEqual([
    ['Arn', 'attrArn'],
    ['Foo.Baz', 'attrFooBaz'],
  ]);
});
