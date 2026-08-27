import * as cdk from '../../../../core';
import { cedarActionUid, cedarAttrPath, cedarEntityId, cedarLong, cedarPath, cedarString } from '../../../lib/policy/cedar-encoding';

// A verified injection payload from the finding: it closes the string literal and
// appends a second policy.
const INJECTION = 'arn:x") ; permit(principal, action, resource is AgentCore::Gateway //';

describe('cedarString', () => {
  test.each([
    ['plain ASCII', 'Engineering'],
    ['a space', 'hello world'],
    ['a tab', 'a\tb'],
    ['a line feed', 'a\nb'],
    ['a NUL', 'a\u0000b'],
    ['a DEL', 'a\u007fb'],
    ['a C1 control', 'a\u0085b'],
    ['an emoji', 'team \u{1F600}'],
    ['CJK', '\u4e2d\u6587'],
    ['combining marks', 'e\u0301'],
    ['an empty string', ''],
  ])('passes through %s unchanged', (_name, value) => {
    expect(cedarString(value, 'v')).toBe(`"${value}"`);
  });

  test('passes an unresolved token through unchanged (a marker holds no unsafe char)', () => {
    const token = cdk.Aws.ACCOUNT_ID;
    expect(cedarString(token, 'v')).toBe(`"${token}"`);
  });

  test.each([
    ['a double quote', 'a"b'],
    ['a backslash', 'a\\b'],
    ['a carriage return', 'a\rb'],
    ['a lone high surrogate', 'a\ud800b'],
    ['a lone low surrogate', 'a\udc00b'],
  ])('rejects %s', (_name, value) => {
    expect(() => cedarString(value, 'v')).toThrow();
  });

  test('accepts a valid astral character, proving the check is not a plain surrogate range', () => {
    expect(() => cedarString('\u{1F680}', 'v')).not.toThrow();
  });
});

describe('cedarPath', () => {
  test('accepts a qualified path', () => {
    expect(cedarPath('AgentCore::Gateway', 'type')).toBe('AgentCore::Gateway');
  });

  test.each([
    ['a reserved segment', 'My::is::Type'],
    ['a leading digit', 'My::9Type'],
    ['an empty segment', 'A::::B'],
    ['an injection payload', INJECTION],
  ])('rejects %s', (_name, value) => {
    expect(() => cedarPath(value, 'type')).toThrow();
  });

  test('rejects an unresolved token', () => {
    expect(() => cedarPath(cdk.Aws.ACCOUNT_ID, 'type')).toThrow(/concrete Cedar entity type/);
  });
});

describe('cedarAttrPath', () => {
  test('renders an identifier with dot access', () => {
    expect(cedarAttrPath('principal', 'department')).toBe('principal.department');
  });

  test('renders a dotted path per segment', () => {
    expect(cedarAttrPath('principal', 'address.city')).toBe('principal.address.city');
  });

  test.each([
    ['a namespaced attribute', 'cognito:groups'],
    ['a reserved segment', 'is'],
    ['an injection payload without a quote or dot', 'x == 1 || true'],
  ])('uses the bracket form for %s', (_name, value) => {
    expect(cedarAttrPath('principal', value)).toBe(`principal["${value}"]`);
  });

  test('throws when a segment contains a quote (cannot be bracket-quoted safely)', () => {
    expect(() => cedarAttrPath('principal', 'a"b')).toThrow();
  });

  test('throws for a whole token', () => {
    expect(() => cedarAttrPath('principal', cdk.Aws.ACCOUNT_ID)).toThrow(/concrete name/);
  });

  test('throws for a token mixed into a dotted path', () => {
    expect(() => cedarAttrPath('principal', `a.${cdk.Aws.ACCOUNT_ID}`)).toThrow(/concrete name/);
  });
});

describe('cedarLong', () => {
  test.each([0, -3, -0, Number.MAX_SAFE_INTEGER])('accepts %p', (value) => {
    expect(cedarLong(value, 'n')).toBe(value.toString());
  });

  test.each([1.5, NaN, Infinity, 1e21])('rejects %p', (value) => {
    expect(() => cedarLong(value, 'n')).toThrow(/must be an integer/);
  });
});

describe('cedarActionUid', () => {
  test.each([
    ['a bare quoted UID', 'Action::"read"', 'Action::"read"'],
    ['a quoted UID with an escaped backslash body', 'Action::"a\\b"', 'Action::"a\\b"'],
    ['a concrete qualified id', 'AgentCore::Action::Get', 'AgentCore::Action::"Get"'],
    ['a concrete id with :: in the name', 'AgentCore::Action::Foo::Bar', 'AgentCore::Action::"Foo::Bar"'],
  ])('renders %s', (_name, input, expected) => {
    expect(cedarActionUid(input)).toBe(expected);
  });

  test('preserves a token inside a quoted UID', () => {
    const token = cdk.Aws.ACCOUNT_ID;
    expect(cedarActionUid(`Action::"${token}"`)).toBe(`Action::"${token}"`);
  });

  test('renders a token id under a concrete action entity type', () => {
    const token = cdk.Aws.ACCOUNT_ID;
    expect(cedarActionUid(`AgentCore::Action::${token}`)).toBe(`AgentCore::Action::"${token}"`);
  });

  test.each([
    ['an entity type not ending in Action', 'Foo::Bar::"x"'],
    ['an unqualified id', 'Get'],
    ['a fully tokenized action', cdk.Aws.ACCOUNT_ID],
  ])('rejects %s', (_name, input) => {
    expect(() => cedarActionUid(input)).toThrow();
  });
});

describe('cedarEntityId', () => {
  test('accepts a non-empty id and quotes it', () => {
    expect(cedarEntityId('user123', 'principal id')).toBe('"user123"');
  });

  test('rejects an empty id, naming the field', () => {
    expect(() => cedarEntityId('', 'resource id')).toThrow(/resource id cannot be an empty string/);
  });

  test('appends the hint for the principal id', () => {
    expect(() => cedarEntityId('', 'principal id', 'Omit the id to match any entity of the type.'))
      .toThrow(/principal id cannot be an empty string\. Omit the id/);
  });

  test('still rejects the unsafe characters via cedarString', () => {
    expect(() => cedarEntityId('a"b', 'principal id')).toThrow();
  });
});
