import { quoteIdentifier, quoteLiteral, quoteQualifiedIdentifier } from '../../lib/private/database-query-provider/escape';

describe('quoteIdentifier', () => {
  test('returns a plain lowercase identifier unchanged', () => {
    expect(quoteIdentifier('users')).toEqual('users');
  });

  test('returns a mixed-case identifier unchanged (Redshift folds it, matching prior behaviour)', () => {
    expect(quoteIdentifier('MyUser')).toEqual('MyUser');
  });

  test('returns an identifier with digits, underscores, and dollar signs unchanged', () => {
    expect(quoteIdentifier('etl_user_2$')).toEqual('etl_user_2$');
  });

  test('returns a non-ASCII (multibyte) identifier unchanged', () => {
    expect(quoteIdentifier('café')).toEqual('café');
  });

  test('delimits an identifier containing a space', () => {
    expect(quoteIdentifier('a b')).toEqual('"a b"');
  });

  test('delimits an identifier starting with a digit', () => {
    expect(quoteIdentifier('1table')).toEqual('"1table"');
  });

  test('delimits an identifier containing a double quote and doubles it', () => {
    expect(quoteIdentifier('a"b')).toEqual('"a""b"');
  });

  test('delimits a name that would otherwise break out of the statement', () => {
    expect(quoteIdentifier("evil PASSWORD 'x' CREATEUSER --")).toEqual('"evil PASSWORD \'x\' CREATEUSER --"');
  });

  test('delimits an empty identifier', () => {
    expect(quoteIdentifier('')).toEqual('""');
  });
});

describe('quoteLiteral', () => {
  test('wraps a plain value in single quotes', () => {
    expect(quoteLiteral('a')).toEqual("'a'");
  });

  test('doubles an embedded single quote character', () => {
    expect(quoteLiteral("a'b")).toEqual("'a''b'");
  });

  test('wraps an empty value in single quotes', () => {
    expect(quoteLiteral('')).toEqual("''");
  });
});

describe('quoteQualifiedIdentifier', () => {
  test('returns each bare-safe component unchanged, keeping the dot separator', () => {
    expect(quoteQualifiedIdentifier('public.users')).toEqual('public.users');
  });

  test('returns a single bare-safe name unchanged', () => {
    expect(quoteQualifiedIdentifier('users')).toEqual('users');
  });

  test('delimits only the component that needs it', () => {
    expect(quoteQualifiedIdentifier('public.us ers')).toEqual('public."us ers"');
  });

  test('doubles an embedded double quote character within a component', () => {
    expect(quoteQualifiedIdentifier('public.us"ers')).toEqual('public."us""ers"');
  });

  test('delimits an empty name', () => {
    expect(quoteQualifiedIdentifier('')).toEqual('""');
  });
});
