/**
 * Unit tests for the pure parts of the provider: the zip reader, marker substitution and
 * filter compilation. No AWS involved.
 */
import { buildZip, renameEntry } from './helpers';
import { compileFilters, globToRegExp } from '../../../lib/aws-s3-deployment/bucket-deployment-ts-handler/filters';
import { encodeMarkerValue, replaceMarkers } from '../../../lib/aws-s3-deployment/bucket-deployment-ts-handler/markers';
import { normalizePrefix, parseBoolean, parseRequest } from '../../../lib/aws-s3-deployment/bucket-deployment-ts-handler/request';
import { readZip, sanitizeEntryPath } from '../../../lib/aws-s3-deployment/bucket-deployment-ts-handler/zip';

describe('zip reader', () => {
  test.each(['store', 'deflate'] as const)('reads %s entries', (method) => {
    const body = 'hello '.repeat(100);
    const zip = buildZip([{ path: 'a/b.txt', body, method }]);

    const entries = readZip(zip);
    expect(entries).toHaveLength(1);
    expect(entries[0].rawPath).toBe('a/b.txt');
    expect(entries[0].contents.toString('utf-8')).toBe(body);
  });

  test('reads an archive with many entries and mixed methods', () => {
    const zip = buildZip([
      { path: 'one.txt', body: 'one', method: 'store' },
      { path: 'nested/two.txt', body: 'two', method: 'deflate' },
      { path: 'three.bin', body: Buffer.from([0, 1, 2, 255]), method: 'store' },
    ]);

    expect(readZip(zip).map((e) => [e.rawPath, e.contents.toString('latin1')])).toEqual([
      ['one.txt', 'one'],
      ['nested/two.txt', 'two'],
      ['three.bin', '\u0000\u0001\u0002\u00ff'],
    ]);
  });

  test('skips directory entries', () => {
    const zip = buildZip([{ path: 'd/f.txt', body: 'x' }], { directories: ['d/'] });

    expect(readZip(zip).map((e) => e.rawPath)).toEqual(['d/f.txt']);
  });

  test('handles an empty archive', () => {
    expect(readZip(buildZip([]))).toEqual([]);
  });

  test('preserves binary content exactly', () => {
    const body = Buffer.from(Array.from({ length: 256 }, (_, i) => i));
    const zip = buildZip([{ path: 'blob', body }]);

    expect(readZip(zip)[0].contents.equals(body)).toBe(true);
  });

  test('rejects something that is not an archive', () => {
    expect(() => readZip(Buffer.from('definitely not a zip file'))).toThrow(/not a zip archive/);
  });

  describe('path sanitization', () => {
    test.each([
      ['../escape.txt', 'escape.txt'],
      ['/abs.txt', 'abs.txt'],
      ['a/../../b.txt', 'a/b.txt'],
      ['./rel.txt', 'rel.txt'],
      ['back\\slash.txt', 'back/slash.txt'],
      ['nested/ok.txt', 'nested/ok.txt'],
    ])('%s -> %s', (raw, expected) => {
      expect(sanitizeEntryPath(raw)).toBe(expected);
    });

    test('a path that normalizes to nothing is dropped', () => {
      expect(sanitizeEntryPath('../..')).toBeUndefined();
      expect(sanitizeEntryPath('/')).toBeUndefined();
    });

    test('a traversal entry in a real archive is contained', () => {
      const zip = renameEntry(buildZip([{ path: 'xx/escape.txt', body: 'pwned' }]), 'xx/escape.txt', '../escape.txt');

      const entries = readZip(zip);
      expect(entries[0].rawPath).toBe('../escape.txt');
      expect(sanitizeEntryPath(entries[0].rawPath)).toBe('escape.txt');
    });
  });
});

describe('marker substitution', () => {
  const replace = (body: string, markers: Record<string, unknown>, jsonEscape?: boolean) =>
    replaceMarkers(Buffer.from(body), markers, jsonEescapeConfig(jsonEscape)).toString('utf-8');

  const jsonEescapeConfig = (jsonEscape?: boolean) =>
    jsonEscape === undefined ? undefined : { jsonEscape: String(jsonEscape) };

  test('replaces every occurrence', () => {
    expect(replace('a <<m>> b <<m>>', { '<<m>>': 'X' })).toBe('a X b X');
  });

  test('is a literal substring replace, not a placeholder syntax', () => {
    expect(replace('FOOBARFOO prefixFOOsuffix', { FOO: 'BAR' })).toBe('BARBARBAR prefixBARsuffix');
  });

  test('leaves content alone when there are no markers', () => {
    expect(replace('unchanged', {})).toBe('unchanged');
  });

  test('matches a marker that spans a line break', () => {
    // The previous implementation worked line by line and could never match this.
    expect(replace('AB\nCD', { 'AB\nCD': 'X' })).toBe('X');
  });

  test('is single-pass: an inserted value is not re-substituted', () => {
    // Order-dependent cascading was a defect; the result must not depend on key order.
    expect(replace('A', { A: 'B', B: 'C' })).toBe('B');
    expect(replace('A', { B: 'C', A: 'B' })).toBe('B');
  });

  test('prefers the longest matching key', () => {
    expect(replace('<<marker:long>>', { '<<marker': 'SHORT', '<<marker:long>>': 'LONG' })).toBe('LONG');
  });

  test('replaces inside binary content', () => {
    const body = Buffer.concat([Buffer.from([0, 1]), Buffer.from('<<m>>'), Buffer.from([255])]);
    const result = replaceMarkers(body, { '<<m>>': 'x' }, undefined);
    expect(result.equals(Buffer.concat([Buffer.from([0, 1]), Buffer.from('x'), Buffer.from([255])]))).toBe(true);
  });

  describe('jsonEscape', () => {
    test('escapes a value so it survives inside a JSON string', () => {
      const value = 'he said "hi"\nand left\\done';
      const body = replace('{"v": "<<m>>"}', { '<<m>>': value }, true);

      expect(JSON.parse(body).v).toBe(value);
    });

    test('inserts raw when off, which can break the document', () => {
      const body = replace('{"v": "<<m>>"}', { '<<m>>': 'a"b' }, false);

      expect(body).toBe('{"v": "a"b"}');
      expect(() => JSON.parse(body)).toThrow();
    });

    test('is case-insensitive and defaults off', () => {
      expect(replaceMarkers(Buffer.from('<<m>>'), { '<<m>>': 'a"b' }, { jsonEscape: 'TRUE' }).toString()).toBe('a\\"b');
      expect(replaceMarkers(Buffer.from('<<m>>'), { '<<m>>': 'a"b' }, {}).toString()).toBe('a"b');
    });

    test('non-string values keep their JSON form', () => {
      const body = replace('{"n": <<n>>, "o": <<o>>}', { '<<n>>': 42, '<<o>>': { a: 1 } }, true);

      expect(JSON.parse(body)).toEqual({ n: 42, o: { a: 1 } });
    });

    test('non-string values do not throw when escaping is off', () => {
      // The previous implementation raised here, inconsistently with the escaped path.
      expect(encodeMarkerValue(42, false)).toBe('42');
      expect(encodeMarkerValue({ a: 1 }, false)).toBe('{"a":1}');
    });
  });
});

describe('filters', () => {
  test('accept everything when neither list is given', () => {
    const filters = compileFilters([], []);
    expect(filters.accepts('anything/at/all.txt')).toBe(true);
  });

  test('* crosses directory separators', () => {
    const filters = compileFilters(['*.log'], []);

    expect(filters.accepts('a.txt')).toBe(true);
    expect(filters.accepts('b.log')).toBe(false);
    expect(filters.accepts('deep/c.log')).toBe(false);
    expect(filters.accepts('deep/d.txt')).toBe(true);
  });

  test('a prefix pattern protects a subtree', () => {
    const filters = compileFilters(['logs/*'], []);

    expect(filters.accepts('logs/app.log')).toBe(false);
    expect(filters.accepts('logs/nested/app.log')).toBe(false);
    expect(filters.accepts('other.txt')).toBe(true);
  });

  test('include re-admits a subset of an exclude', () => {
    const filters = compileFilters(['*'], ['*.html']);

    expect(filters.accepts('index.html')).toBe(true);
    expect(filters.accepts('style.css')).toBe(false);
  });

  test('an exact include beats a wildcard exclude', () => {
    const filters = compileFilters(['*.log'], ['important.log']);

    expect(filters.accepts('important.log')).toBe(true);
    expect(filters.accepts('other.log')).toBe(false);
  });

  test('later patterns win within a list', () => {
    const filters = compileFilters(['a/*', 'a/keep.txt'], []);

    // Both are excludes, so the second match does not re-include; last match wins only
    // between rules of differing verdicts.
    expect(filters.accepts('a/keep.txt')).toBe(false);
  });

  describe('glob translation', () => {
    test.each([
      ['*.txt', 'a.txt', true],
      ['*.txt', 'a.txtx', false],
      ['?.txt', 'a.txt', true],
      ['?.txt', 'ab.txt', false],
      ['[abc].txt', 'b.txt', true],
      ['[abc].txt', 'd.txt', false],
      ['[!abc].txt', 'd.txt', true],
      ['a.b', 'axb', false],
      ['a+b', 'a+b', true],
    ])('%s vs %s -> %s', (pattern, candidate, expected) => {
      expect(globToRegExp(pattern).test(candidate)).toBe(expected);
    });
  });
});

describe('request parsing', () => {
  const minimal = {
    SourceBucketNames: ['src'],
    SourceObjectKeys: ['a.zip'],
    DestinationBucketName: 'dst',
  };

  test.each(['SourceBucketNames', 'SourceObjectKeys', 'DestinationBucketName'])(
    'rejects a request without %s', (missing) => {
      const props: Record<string, any> = { ...minimal };
      delete props[missing];

      expect(() => parseRequest(props)).toThrow(`missing request resource property '${missing}'`);
    },
  );

  test('rejects mismatched source lists instead of truncating', () => {
    expect(() => parseRequest({
      ...minimal,
      SourceBucketNames: ['a', 'b'],
      SourceObjectKeys: ['one.zip'],
    })).toThrow(/must be the same length/);
  });

  test('rejects a marker list that does not cover every source', () => {
    expect(() => parseRequest({
      ...minimal,
      SourceBucketNames: ['a', 'b'],
      SourceObjectKeys: ['one.zip', 'two.zip'],
      SourceMarkers: [{}],
    })).toThrow(/'SourceMarkers' has 1 entries but there are 2 sources/);
  });

  test('applies documented defaults', () => {
    const request = parseRequest(minimal);

    expect(request.extract).toBe(true);
    expect(request.prune).toBe(true);
    expect(request.retainOnDelete).toBe(true);
    expect(request.waitForDistributionInvalidation).toBe(true);
    expect(request.outputObjectKeys).toBe(true);
    expect(request.outputObjectVersionIds).toBe(false);
    expect(request.destinationBucketKeyPrefix).toBe('');
    expect(request.distributionPaths).toEqual(['/*']);
  });

  test('derives default invalidation paths from the prefix', () => {
    expect(parseRequest({ ...minimal, DestinationBucketKeyPrefix: 'web/' }).distributionPaths).toEqual(['/web/*']);
    expect(parseRequest({ ...minimal, DestinationBucketKeyPrefix: 'web' }).distributionPaths).toEqual(['/web/*']);
  });

  describe('prefix normalization', () => {
    test.each([
      [undefined, ''],
      ['', ''],
      ['/', ''],
      ['web', 'web/'],
      ['web/', 'web/'],
      ['a/b', 'a/b/'],
    ])('%s -> %s', (raw, expected) => {
      expect(normalizePrefix(raw)).toBe(expected);
    });
  });

  describe('boolean parsing', () => {
    test.each([
      ['true', true],
      ['TRUE', true],
      ['True', true],
      ['false', false],
      ['FALSE', false],
      [true, true],
      [false, false],
    ])('%s -> %s', (raw, expected) => {
      expect(parseBoolean(raw, false)).toBe(expected);
      expect(parseBoolean(raw, true)).toBe(expected);
    });

    test('unrecognized values take the default rather than a destructive branch', () => {
      // The previous implementation compared `RetainOnDelete` with `== "true"`, so any
      // typo selected deletion.
      expect(parseBoolean('yes', true)).toBe(true);
      expect(parseBoolean(undefined, true)).toBe(true);
      expect(parseRequest({ ...minimal, RetainOnDelete: 'True' }).retainOnDelete).toBe(true);
      expect(parseRequest({ ...minimal, RetainOnDelete: 'nonsense' }).retainOnDelete).toBe(true);
    });

    test('the string "false" disables waiting', () => {
      // Truthiness-testing this one property meant "false" used to mean "wait".
      expect(parseRequest({ ...minimal, WaitForDistributionInvalidation: 'false' })
        .waitForDistributionInvalidation).toBe(false);
    });
  });
});
