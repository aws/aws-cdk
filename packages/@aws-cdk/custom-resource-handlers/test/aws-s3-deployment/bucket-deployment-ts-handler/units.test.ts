/**
 * Unit tests for the parts of the provider that do not talk to AWS: reading archives,
 * marker substitution, filter compilation and request parsing.
 */
import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import { S3 } from '@aws-sdk/client-s3';
import type { AwsStub } from 'aws-sdk-client-mock';
import { mockClient } from 'aws-sdk-client-mock';
import { FakeS3 } from './fake-aws/fake-s3';
import { buildZip, cfnEvent, renameEntry } from './helpers';
import { S3ObjectSet } from '../../../lib/aws-s3-deployment/bucket-deployment-ts-handler/file-set';
import { compileFilters, globToRegExp } from '../../../lib/aws-s3-deployment/bucket-deployment-ts-handler/filters';
import { encodeMarkerValue, replaceMarkers } from '../../../lib/aws-s3-deployment/bucket-deployment-ts-handler/markers';
import type { DeploymentAction } from '../../../lib/aws-s3-deployment/bucket-deployment-ts-handler/request';
import { normalizePrefix, parseBoolean, parseRequest } from '../../../lib/aws-s3-deployment/bucket-deployment-ts-handler/request';
import type { CopyableFile } from '../../../lib/aws-s3-deployment/bucket-deployment-ts-handler/staging';
import { withSourceFiles } from '../../../lib/aws-s3-deployment/bucket-deployment-ts-handler/staging';

const SRC = 'source-bucket';

describe('expanding a source', () => {
  // `withSourceFiles` is the seam between "a source in a request" and "the files it wants
  // deployed". It downloads from S3 and reads the archive, so these tests drive it against
  // in-memory S3 and a real scratch directory, and assert on the files it describes.
  let fakeS3: FakeS3;
  let s3Mock: AwsStub<any, any, any>;
  let s3: S3;
  let scratch: string;

  beforeEach(async () => {
    fakeS3 = new FakeS3();
    s3Mock = mockClient(S3);
    fakeS3.installUsingAwsMock(s3Mock as any);
    fakeS3.createBucket(SRC);
    s3 = new S3({});
    scratch = await fs.mkdtemp(path.join(os.tmpdir(), 'staging-test-'));
  });

  afterEach(async () => {
    s3Mock.restore();
    await fs.rm(scratch, { recursive: true, force: true });
  });

  /**
   * Seed `body` as the source object and expand it.
   *
   * The files are only valid while the block runs, so everything a test wants to know has
   * to be extracted inside it.
   */
  function expandObject<A>(body: Buffer, block: (files: CopyableFile[]) => Promise<A>, extract = true): Promise<A> {
    fakeS3.seed(SRC, 'src.zip', body);
    const source = { bucketName: SRC, objectKey: 'src.zip', markers: {} };
    return withSourceFiles(s3, source, 0, extract, scratch, block);
  }

  /** Seed an archive of `entries` as the source object and expand it. */
  function expand<A>(
    entries: Parameters<typeof buildZip>[0],
    block: (files: CopyableFile[]) => Promise<A>,
    options?: Parameters<typeof buildZip>[1],
  ): Promise<A> {
    return expandObject(buildZip(entries, options), block);
  }

  /** Drain a file's stream, the way an upload would. */
  async function contentsOf(file: CopyableFile): Promise<Buffer> {
    const { body } = await file.openStream();
    const chunks: Buffer[] = [];
    for await (const chunk of body) {
      chunks.push(chunk as Buffer);
    }
    return Buffer.concat(chunks);
  }

  const keysOf = (files: CopyableFile[]) => files.map((file) => file.relativeKey);

  test.each(['store', 'deflate'] as const)('reads %s entries', async (method) => {
    const body = 'hello '.repeat(100);

    const read = await expand([{ path: 'a/b.txt', body, method }], async (files) => {
      expect(keysOf(files)).toEqual(['a/b.txt']);
      return contentsOf(files[0]);
    });

    expect(read.toString('utf-8')).toBe(body);
  });

  test('an archive is fetched once however many entries it has', async () => {
    await expand([
      { path: 'one.txt', body: 'one' },
      { path: 'two.txt', body: 'two' },
      { path: 'three.txt', body: 'three' },
    ], async (files) => {
      expect(files).toHaveLength(3);
      // The archive is read from its scratch copy, so describing and reading entries costs
      // no further S3 requests beyond the single download.
      expect(fakeS3.callCount('GetObject')).toBe(1);
      // The fixture is a fixed three entries.
      // eslint-disable-next-line @cdklabs/promiseall-no-unbounded-parallelism
      await Promise.all(files.map(contentsOf));
      expect(fakeS3.callCount('GetObject')).toBe(1);
    });
  });

  test('an entry carries the size and timestamp recorded in the archive', async () => {
    // Size and timestamp are not exposed directly: they are what the skip decision asks
    // about, so they are observable through a destination that already holds the file.
    const mtime = new Date(2021, 5, 1, 12, 30, 20);
    const body = 'x'.repeat(40);

    await expand([{ path: 'f.txt', body, mtime }], async ([file]) => {
      const matching = new S3ObjectSet();
      matching.add('f.txt', body.length, mtime);
      expect(file.isAlreadyInDestination(matching)).toBe(true);

      const differentSize = new S3ObjectSet();
      differentSize.add('f.txt', body.length + 1, mtime);
      expect(file.isAlreadyInDestination(differentSize)).toBe(false);

      const older = new S3ObjectSet();
      older.add('f.txt', body.length, new Date(mtime.getTime() - 1000));
      expect(file.isAlreadyInDestination(older)).toBe(false);
    });
  });

  test('streams an entry larger than one chunk', async () => {
    const body = 'chunky '.repeat(5000);

    const read = await expand([{ path: 'big.txt', body }], ([file]) => contentsOf(file));

    expect(read.toString('utf-8')).toBe(body);
  });

  test('an entry can be streamed more than once', async () => {
    // The write loop opens an entry after the entry walk has finished, so the handle has
    // to stay usable.
    const [first, second] = await expand([{ path: 'f.txt', body: 'twice' }], async ([file]) => {
      return [await contentsOf(file), await contentsOf(file)];
    });

    expect([first.toString(), second.toString()]).toEqual(['twice', 'twice']);
  });

  test('entries of one archive can be streamed concurrently', async () => {
    // The write loop uploads a source's files in parallel, which means several read
    // streams are open on one archive at the same time.
    const entries = Array.from({ length: 12 }, (_, i) => ({
      path: `f${i}.txt`,
      body: String.fromCharCode(97 + i).repeat(70_000),
      method: (i % 2 ? 'store' : 'deflate') as 'store' | 'deflate',
    }));

    // Concurrency is the point of this test, over a fixed twelve entries.
    // eslint-disable-next-line @cdklabs/promiseall-no-unbounded-parallelism
    const read = await expand(entries, (files) => Promise.all(files.map(contentsOf)));

    expect(read.map((buffer) => buffer.toString('utf-8'))).toEqual(entries.map((entry) => entry.body));
  });

  test('directory entries are not deployed', async () => {
    // S3 has no directories. An entry for one would otherwise become a zero-byte object
    // whose key ends in a separator.
    await expand([{ path: 'd/f.txt', body: 'x' }], async (files) => {
      expect(keysOf(files)).toEqual(['d/f.txt']);
    }, { directories: ['d/', 'empty/'] });
  });

  test('an empty archive wants nothing deployed', async () => {
    await expand([], async (files) => {
      expect(files).toEqual([]);
    });
  });

  test('preserves binary content exactly', async () => {
    const body = Buffer.from(Array.from({ length: 256 }, (_, i) => i));

    const read = await expand([{ path: 'blob', body }], ([file]) => contentsOf(file));

    expect(read.equals(body)).toBe(true);
  });

  test('a later entry of the same name wins', async () => {
    // An archive may repeat a name. Only the last is deployed: deploying both would race
    // two uploads for one key.
    const read = await expand([
      { path: 'dup.txt', body: 'first' },
      { path: 'dup.txt', body: 'second' },
    ], async (files) => {
      expect(files).toHaveLength(1);
      return contentsOf(files[0]);
    });

    expect(read.toString()).toBe('second');
  });

  test('the scratch copy of the archive is deleted afterwards', async () => {
    // A deployment can carry archives far larger than the function's disk, so each one has
    // to be gone before the next source is touched.
    await expand([{ path: 'f.txt', body: 'x' }], async () => {
      expect(await fs.readdir(scratch)).toHaveLength(1);
    });

    expect(await fs.readdir(scratch)).toEqual([]);
  });

  test('rejects something that is not an archive', async () => {
    await expect(expandObject(Buffer.from('definitely not a zip file'), async () => {})).rejects.toThrow();
  });

  describe('hostile entry names', () => {
    // The archive is refused outright if an entry would be written outside the directory
    // it is extracted into, rather than being relocated.
    test.each([
      ['../escape.txt', /relative path/],
      ['xx/../../e.txt', /relative path/],
      ['/absolute.txt', /absolute path/],
    ])('refuses %s', async (name, message) => {
      const padded = 'x'.repeat(name.length);
      const archive = renameEntry(buildZip([{ path: padded, body: 'payload' }]), padded, name);

      await expect(expandObject(archive, async () => {})).rejects.toThrow(message);
    });

    test('a backslash is treated as a separator, not rejected', async () => {
      const archive = renameEntry(buildZip([{ path: 'aa/bb.txt', body: 'x' }]), 'aa/bb.txt', 'aa\\bb.txt');

      await expandObject(archive, async (files) => {
        expect(keysOf(files)).toEqual(['aa/bb.txt']);
      });
    });
  });

  describe('a source deployed without extraction', () => {
    test('is keyed by its basename and streamed straight through', async () => {
      fakeS3.seed(SRC, 'dir/archive.zip', 'opaque bytes');
      const source = { bucketName: SRC, objectKey: 'dir/archive.zip', markers: {} };

      const read = await withSourceFiles(s3, source, 0, false, scratch, async (files) => {
        expect(keysOf(files)).toEqual(['archive.zip']);
        // Nothing is downloaded to scratch, and nothing is read until the bytes are asked
        // for.
        expect(await fs.readdir(scratch)).toEqual([]);
        expect(fakeS3.callCount('GetObject')).toBe(0);
        return contentsOf(files[0]);
      });

      expect(read.toString()).toBe('opaque bytes');
    });

    test('is never considered already present at the destination', async () => {
      // The object's own timestamp is not compared against the destination's, mirroring
      // the previous implementation, which staged it to a local file whose mtime was
      // therefore always newer.
      fakeS3.seed(SRC, 'f.txt', 'body');
      const source = { bucketName: SRC, objectKey: 'f.txt', markers: {} };

      await withSourceFiles(s3, source, 0, false, scratch, async ([file]) => {
        const identical = new S3ObjectSet();
        identical.add('f.txt', 'body'.length, new Date());
        expect(file.isAlreadyInDestination(identical)).toBe(false);
      });
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
    expect(replace('AB\nCD', { 'AB\nCD': 'X' })).toBe('X');
  });

  test('is single-pass: an inserted value is not re-substituted', () => {
    // The result must not depend on the order of the marker map.
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

describe('parsing a request into actions', () => {
  const minimal = {
    SourceBucketNames: ['src'],
    SourceObjectKeys: ['a.zip'],
    DestinationBucketName: 'dst',
  };

  /** The action of a given type, asserting there is exactly one. */
  function only<T extends DeploymentAction['type']>(
    actions: DeploymentAction[],
    type: T,
  ): Extract<DeploymentAction, { type: T }> {
    const matching = actions.filter((a) => a.type === type);
    expect(matching).toHaveLength(1);
    return matching[0] as Extract<DeploymentAction, { type: T }>;
  }

  /** Just the action types, which is the shape of the lifecycle. */
  const types = (actions: DeploymentAction[]) => actions.map((a) => a.type);

  /** A response value an action sets, or `undefined` if nothing sets it. */
  function responseValue(actions: DeploymentAction[], key: string): unknown {
    return actions
      .filter((a): a is Extract<DeploymentAction, { type: 'set-response-value' }> => a.type === 'set-response-value')
      .find((a) => a.key === key)?.value;
  }

  describe('validation', () => {
    test.each(['SourceBucketNames', 'SourceObjectKeys', 'DestinationBucketName'])(
      'rejects a request without %s', (missing) => {
        const props: Record<string, any> = { ...minimal };
        delete props[missing];

        expect(() => parseRequest(cfnEvent('Create', props)))
          .toThrow(`missing request resource property '${missing}'`);
      },
    );

    test('rejects mismatched source lists instead of truncating', () => {
      expect(() => parseRequest(cfnEvent('Create', {
        ...minimal,
        SourceBucketNames: ['a', 'b'],
        SourceObjectKeys: ['one.zip'],
      }))).toThrow(/must be the same length/);
    });

    test('rejects a marker list that does not cover every source', () => {
      expect(() => parseRequest(cfnEvent('Create', {
        ...minimal,
        SourceBucketNames: ['a', 'b'],
        SourceObjectKeys: ['one.zip', 'two.zip'],
        SourceMarkers: [{}],
      }))).toThrow(/'SourceMarkers' has 1 entries but there are 2 sources/);
    });

    test('rejects version-id reporting combined with extraction', () => {
      expect(() => parseRequest(cfnEvent('Create', { ...minimal, OutputObjectVersionIds: 'true' })))
        .toThrow(/requires 'Extract' to be false/);
    });

    test.each(['Update', 'Delete'] as const)('rejects a %s without a physical id', (requestType) => {
      expect(() => parseRequest(cfnEvent(requestType, minimal, { omitPhysicalResourceId: true })))
        .toThrow(/'PhysicalResourceId' is not defined/);
    });
  });

  describe('which actions each request type implies', () => {
    test('Create allocates an id and copies', () => {
      expect(types(parseRequest(cfnEvent('Create', minimal)))).toEqual([
        'set-response-value', 'set-response-value', 'allocate-physical-id', 'copy-sources',
      ]);
    });

    test('Update copies without allocating an id', () => {
      const actions = parseRequest(cfnEvent('Update', minimal, { oldProperties: minimal }));

      expect(types(actions)).not.toContain('allocate-physical-id');
      expect(types(actions)).toContain('copy-sources');
    });

    test('an Update that moves the destination deletes the old one first', () => {
      const actions = parseRequest(cfnEvent(
        'Update',
        { ...minimal, DestinationBucketKeyPrefix: 'new/', RetainOnDelete: 'false' },
        { oldProperties: { ...minimal, DestinationBucketKeyPrefix: 'old/', RetainOnDelete: 'false' } },
      ));

      expect(types(actions)).toEqual([
        'set-response-value', 'set-response-value', 'delete-prefix', 'copy-sources',
      ]);
      expect(only(actions, 'delete-prefix').destination.keyPrefix).toBe('old/');
    });

    test('an Update with an unchanged destination does not delete anything', () => {
      const props = { ...minimal, DestinationBucketKeyPrefix: 'web/', RetainOnDelete: 'false' };
      const actions = parseRequest(cfnEvent('Update', props, { oldProperties: props }));

      // Reconciling an unchanged destination is `prune`'s job.
      expect(types(actions)).not.toContain('delete-prefix');
    });

    test('an Update that moves the destination retains it by default', () => {
      const actions = parseRequest(cfnEvent(
        'Update',
        { ...minimal, DestinationBucketKeyPrefix: 'new/' },
        { oldProperties: { ...minimal, DestinationBucketKeyPrefix: 'old/' } },
      ));

      expect(types(actions)).not.toContain('delete-prefix');
    });

    test('a retaining Delete does nothing at all', () => {
      const actions = parseRequest(cfnEvent('Delete', minimal));

      expect(types(actions)).toEqual(['set-response-value', 'set-response-value']);
    });

    test('a destructive Delete deletes and does not copy', () => {
      const actions = parseRequest(cfnEvent('Delete', { ...minimal, RetainOnDelete: 'false' }));

      expect(types(actions)).toEqual([
        'set-response-value', 'set-response-value', 'delete-prefix',
      ]);
    });

    test('a named distribution is invalidated on Create and Update, but not Delete', () => {
      for (const requestType of ['Create', 'Update'] as const) {
        const actions = parseRequest(cfnEvent(
          requestType,
          { ...minimal, DistributionId: 'E1' },
          { oldProperties: minimal },
        ));

        expect(types(actions)).toContain('invalidate-cloudfront');
      }

      // A Delete is assumed to be taking the distribution with it.
      const onDelete = parseRequest(cfnEvent('Delete', { ...minimal, DistributionId: 'E1' }));
      expect(types(onDelete)).not.toContain('invalidate-cloudfront');
    });

    test('no distribution means no invalidation', () => {
      expect(types(parseRequest(cfnEvent('Create', minimal)))).not.toContain('invalidate-cloudfront');
    });
  });

  describe('response values', () => {
    test('DestinationBucketArn is echoed straight back', () => {
      const arn = 'arn:aws:s3:::some-bucket';
      const actions = parseRequest(cfnEvent('Create', { ...minimal, DestinationBucketArn: arn }));

      expect(responseValue(actions, 'DestinationBucketArn')).toBe(arn);
    });

    test('SourceObjectKeys reports the requested keys', () => {
      const actions = parseRequest(cfnEvent('Create', minimal));

      expect(responseValue(actions, 'SourceObjectKeys')).toEqual(['a.zip']);
    });

    test('OutputObjectKeys=false reports an empty list', () => {
      const actions = parseRequest(cfnEvent('Create', { ...minimal, OutputObjectKeys: 'false' }));

      expect(responseValue(actions, 'SourceObjectKeys')).toEqual([]);
    });

    test('version ids are reported by the copy action', () => {
      const actions = parseRequest(cfnEvent('Create', {
        ...minimal, Extract: 'false', OutputObjectVersionIds: 'true',
      }));

      expect(only(actions, 'copy-sources').reportVersionIdsAs).toBe('SourceObjectVersionIds');
    });

    test('a Delete reports an empty version-id list, since nothing was deployed', () => {
      const actions = parseRequest(cfnEvent('Delete', { ...minimal, OutputObjectVersionIds: 'true' }));

      expect(responseValue(actions, 'SourceObjectVersionIds')).toEqual([]);
    });

    test('version ids are absent unless asked for', () => {
      const actions = parseRequest(cfnEvent('Create', minimal));

      expect(only(actions, 'copy-sources').reportVersionIdsAs).toBeUndefined();
      expect(actions.some((a) => a.type === 'set-response-value' && a.key === 'SourceObjectVersionIds')).toBe(false);
    });
  });

  describe('defaults', () => {
    test('a minimal request extracts, prunes and waits', () => {
      const actions = parseRequest(cfnEvent('Create', { ...minimal, DistributionId: 'E1' }));
      const copy = only(actions, 'copy-sources');

      expect(copy.extract).toBe(true);
      expect(copy.prune).toBe(true);
      // No patterns given, so nothing is filtered out.
      expect(copy.filters.accepts('anything/at/all.txt')).toBe(true);
      expect(copy.destination.keyPrefix).toBe('');
      expect(only(actions, 'invalidate-cloudfront').wait).toBe(true);
    });

    test('a minimal Delete retains', () => {
      expect(types(parseRequest(cfnEvent('Delete', minimal)))).not.toContain('delete-prefix');
    });

    test('invalidation paths derive from the destination prefix', () => {
      const paths = (prefix?: string) => only(
        parseRequest(cfnEvent('Create', {
          ...minimal,
          DistributionId: 'E1',
          ...(prefix === undefined ? {} : { DestinationBucketKeyPrefix: prefix }),
        })),
        'invalidate-cloudfront',
      ).paths;

      expect(paths('web/')).toEqual(['/web/*']);
      expect(paths('web')).toEqual(['/web/*']);
      expect(paths()).toEqual(['/*']);
    });

    test('explicit invalidation paths win', () => {
      const actions = parseRequest(cfnEvent('Create', {
        ...minimal, DistributionId: 'E1', DistributionPaths: ['/a/*', '/b'],
      }));

      expect(only(actions, 'invalidate-cloudfront').paths).toEqual(['/a/*', '/b']);
    });
  });

  describe('prefix normalization', () => {
    const keyPrefix = (raw?: string) => only(
      parseRequest(cfnEvent('Create', {
        ...minimal,
        ...(raw === undefined ? {} : { DestinationBucketKeyPrefix: raw }),
      })),
      'copy-sources',
    ).destination;

    test.each([
      [undefined, ''],
      ['', ''],
      ['/', ''],
      ['web', 'web/'],
      ['web/', 'web/'],
      ['a/b', 'a/b/'],
    ])('%s -> %s', (raw, expected) => {
      expect(normalizePrefix(raw)).toBe(expected);
      expect(keyPrefix(raw).keyPrefix).toBe(expected);
    });

    test('the caller\'s spelling is kept for ownership-tag matching', () => {
      // The tag a BucketDeployment writes embeds the spelling the caller used, so both
      // forms have to survive parsing.
      expect(keyPrefix('web').rawKeyPrefix).toBe('web');
      expect(keyPrefix('web/').rawKeyPrefix).toBe('web/');
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
      // A typo must not select deletion.
      expect(parseBoolean('yes', true)).toBe(true);
      expect(parseBoolean(undefined, true)).toBe(true);

      for (const retainOnDelete of ['True', 'nonsense', '']) {
        const actions = parseRequest(cfnEvent('Delete', { ...minimal, RetainOnDelete: retainOnDelete }));
        expect(types(actions)).not.toContain('delete-prefix');
      }
    });

    test('the string "false" disables waiting', () => {
      // Truthiness-testing a stringified boolean would make "false" mean "wait".
      const actions = parseRequest(cfnEvent('Create', {
        ...minimal, DistributionId: 'E1', WaitForDistributionInvalidation: 'false',
      }));

      expect(only(actions, 'invalidate-cloudfront').wait).toBe(false);
    });
  });
});
