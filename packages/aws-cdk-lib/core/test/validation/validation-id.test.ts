import { parseValidationId } from '../../lib/validation/private/validation-id';

test('missing namespace is fine', () => {
  expect(parseValidationId('foo')).toEqual({ ruleId: 'foo' });
});

test('present namespace is fine', () => {
  expect(parseValidationId('ns::foo')).toEqual({ namespace: 'ns', ruleId: 'foo' });
});

test('missing namespace and :: between brackets is fine', () => {
  expect(parseValidationId('foo[bar::baz]')).toEqual({ ruleId: 'foo[bar::baz]' });
});

test('present namespace and :: between brackets is fine', () => {
  expect(parseValidationId('ns::foo[bar::baz]')).toEqual({ namespace: 'ns', ruleId: 'foo[bar::baz]' });
});

test('multiple top-level namespaces throws', () => {
  expect(() => parseValidationId('ns::foo[bar::baz]::oy')).toThrow(/Invalid validation rule ID/);
});
