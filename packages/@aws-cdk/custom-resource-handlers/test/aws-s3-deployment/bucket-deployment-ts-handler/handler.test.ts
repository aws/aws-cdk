/**
 * Handler tests against in-memory AWS.
 *
 * Every assertion is about the **state of the fake services** after a request — which
 * objects exist, with what bytes and metadata, which invalidations were created. Nothing
 * asserts on the sequence of API calls, so the provider stays free to change how it
 * achieves a given outcome.
 */
import { CloudFront } from '@aws-sdk/client-cloudfront';
import { S3 } from '@aws-sdk/client-s3';
import type { AwsStub } from 'aws-sdk-client-mock';
import { mockClient } from 'aws-sdk-client-mock';
import { FakeCloudFront } from './fake-aws/fake-cloudfront';
import { FakeS3 } from './fake-aws/fake-s3';
import { advanceTimeUntil } from './fake-time';
import { buildZip, cfnEvent, renameEntry } from './helpers';
import { onEvent } from '../../../lib/aws-s3-deployment/bucket-deployment-ts-handler';

const SRC = 'source-bucket';
const DST = 'destination-bucket';
const DST_VERSIONED = 'destination-versioned';
const DISTRIBUTION = 'E1EXAMPLE';

let fakeS3: FakeS3;
let fakeCloudFront: FakeCloudFront;
let s3Mock: AwsStub<any, any, any>;
let cloudFrontMock: AwsStub<any, any, any>;

beforeEach(() => {
  fakeS3 = new FakeS3();
  fakeCloudFront = new FakeCloudFront();

  // The aggregated clients, matching what the handler constructs: their per-operation
  // methods build the command and hand it to `send`, which is what the stub intercepts.
  s3Mock = mockClient(S3);
  cloudFrontMock = mockClient(CloudFront);
  fakeS3.installUsingAwsMock(s3Mock as any);
  fakeCloudFront.installUsingAwsMock(cloudFrontMock as any);

  fakeS3.createBucket(SRC);
  fakeS3.createBucket(DST);
  fakeS3.createBucket(DST_VERSIONED, { versioned: true });
  fakeCloudFront.createDistribution(DISTRIBUTION);
});

afterEach(() => {
  s3Mock.restore();
  cloudFrontMock.restore();
});

/** Upload a zip to the source bucket and return its key. */
function seedZip(key: string, entries: Parameters<typeof buildZip>[0], options?: Parameters<typeof buildZip>[1]): string {
  fakeS3.seed(SRC, key, buildZip(entries, options));
  return key;
}

/** `ResourceProperties` for a one-source deployment. */
function props(extra: Record<string, any> = {}, sourceKeys = ['a.zip']): Record<string, any> {
  return {
    SourceBucketNames: sourceKeys.map(() => SRC),
    SourceObjectKeys: sourceKeys,
    DestinationBucketName: DST,
    ...extra,
  };
}

// ---------------------------------------------------------------------------------------
// Resulting destination state
// ---------------------------------------------------------------------------------------

describe('deployment', () => {
  test('extracts an archive into the destination', async () => {
    seedZip('a.zip', [
      { path: 'index.html', body: '<html>' },
      { path: 'nested/style.css', body: 'body{}' },
    ]);

    await onEvent(cfnEvent('Create', props()));

    expect(fakeS3.keys(DST)).toEqual(['index.html', 'nested/style.css']);
    expect(fakeS3.text(DST, 'index.html')).toBe('<html>');
    expect(fakeS3.text(DST, 'nested/style.css')).toBe('body{}');
  });

  test('deploys under a key prefix', async () => {
    seedZip('a.zip', [{ path: 'index.html', body: 'x' }]);

    await onEvent(cfnEvent('Create', props({ DestinationBucketKeyPrefix: 'web/' })));

    expect(fakeS3.keys(DST)).toEqual(['web/index.html']);
  });

  test('normalizes a prefix without a trailing slash', async () => {
    seedZip('a.zip', [{ path: 'index.html', body: 'x' }]);

    await onEvent(cfnEvent('Create', props({ DestinationBucketKeyPrefix: 'web' })));

    expect(fakeS3.keys(DST)).toEqual(['web/index.html']);
  });

  test('treats "/" as the bucket root', async () => {
    seedZip('a.zip', [{ path: 'index.html', body: 'x' }]);

    await onEvent(cfnEvent('Create', props({ DestinationBucketKeyPrefix: '/' })));

    expect(fakeS3.keys(DST)).toEqual(['index.html']);
  });

  test('Extract=false deploys the object opaquely, keyed by basename', async () => {
    fakeS3.seed(SRC, 'assets/deadbeef.zip', 'raw payload');

    await onEvent(cfnEvent('Create', props(
      { Extract: 'false', DestinationBucketKeyPrefix: 'web/' },
      ['assets/deadbeef.zip'],
    )));

    expect(fakeS3.keys(DST)).toEqual(['web/deadbeef.zip']);
    expect(fakeS3.text(DST, 'web/deadbeef.zip')).toBe('raw payload');
  });

  test('later sources win on a path collision', async () => {
    seedZip('a.zip', [{ path: 'index.html', body: 'from-a' }, { path: 'only-a.txt', body: 'a' }]);
    seedZip('b.zip', [{ path: 'index.html', body: 'from-b' }, { path: 'only-b.txt', body: 'b' }]);

    await onEvent(cfnEvent('Create', props({}, ['a.zip', 'b.zip'])));

    expect(fakeS3.keys(DST)).toEqual(['index.html', 'only-a.txt', 'only-b.txt']);
    expect(fakeS3.text(DST, 'index.html')).toBe('from-b');
  });

  test('an archive whose entries would escape the destination is refused', async () => {
    const zip = renameEntry(
      buildZip([{ path: 'xx/escape.txt', body: 'payload' }]),
      'xx/escape.txt',
      '../escape.txt',
    );
    fakeS3.seed(SRC, 'evil.zip', zip);

    await expect(onEvent(cfnEvent('Create', props({ DestinationBucketKeyPrefix: 'web/' }, ['evil.zip']))))
      .rejects.toThrow(/relative path/);

    expect(fakeS3.keys(DST)).toEqual([]);
  });

  test('empty directories do not become objects', async () => {
    seedZip('a.zip', [{ path: 'f.txt', body: 'x' }], { directories: ['empty/'] });

    await onEvent(cfnEvent('Create', props()));

    expect(fakeS3.keys(DST)).toEqual(['f.txt']);
  });

  test('a same-size content change is NOT deployed over a newer object', async () => {
    // A known hole in the size-and-time skip, inherited from `aws s3 sync`: the sizes
    // match and the archive's timestamp is older than the object, so the edit is invisible
    // to the comparison. Pinned so that nobody mistakes it for a bug in the skip logic —
    // the fix is a content hash, which costs a request per object.
    fakeS3.seed(DST, 'web/index.html', 'AAAA');
    seedZip('a.zip', [{ path: 'index.html', body: 'BBBB' }]);

    await onEvent(cfnEvent('Create', props({ DestinationBucketKeyPrefix: 'web/' })));

    expect(fakeS3.text(DST, 'web/index.html')).toBe('AAAA');
  });

  test('metadata does NOT reach objects that are skipped', async () => {
    // The other hole: the LIST response carries no metadata, so an object that looks
    // unchanged never learns about a new `cache-control`.
    fakeS3.seed(DST, 'web/f.txt', 'same');
    seedZip('a.zip', [{ path: 'f.txt', body: 'same' }]);

    await onEvent(cfnEvent('Create', props({
      DestinationBucketKeyPrefix: 'web/',
      SystemMetadata: { 'cache-control': 'max-age=60' },
    })));

    expect(fakeS3.object(DST, 'web/f.txt')?.cacheControl).toBeUndefined();
  });

  test('repeating an identical request converges on the same state', async () => {
    seedZip('a.zip', [{ path: 'one.txt', body: 'one' }, { path: 'deep/two.txt', body: 'two' }]);
    const event = cfnEvent('Create', props({ DestinationBucketKeyPrefix: 'web/' }));

    await onEvent(event);
    const after = fakeS3.keys(DST);
    await onEvent(event);

    expect(fakeS3.keys(DST)).toEqual(after);
    expect(fakeS3.text(DST, 'web/one.txt')).toBe('one');
  });

  describe('how bytes get to the destination', () => {
    // Content is only held in memory when a marker substitution has to see the whole file.
    // Everything else is piped from its source straight into the upload, so a deployment
    // costs a file on disk rather than heap.
    test('an archive entry with no markers is streamed', async () => {
      seedZip('a.zip', [{ path: 'f.txt', body: 'streamed' }]);

      await onEvent(cfnEvent('Create', props()));

      expect(fakeS3.wasStreamed(DST, 'f.txt')).toBe(true);
      expect(fakeS3.text(DST, 'f.txt')).toBe('streamed');
    });

    test('an archive entry with markers is buffered, so it can be substituted', async () => {
      seedZip('a.zip', [{ path: 'f.txt', body: 'a <<m>> b' }]);

      await onEvent(cfnEvent('Create', props({ SourceMarkers: [{ '<<m>>': 'value' }] })));

      expect(fakeS3.wasStreamed(DST, 'f.txt')).toBe(false);
      expect(fakeS3.text(DST, 'f.txt')).toBe('a value b');
    });

    test('an object deployed whole with no markers is streamed', async () => {
      fakeS3.seed(SRC, 'blob.bin', 'opaque payload');

      await onEvent(cfnEvent('Create', props({ Extract: 'false' }, ['blob.bin'])));

      expect(fakeS3.wasStreamed(DST, 'blob.bin')).toBe(true);
      expect(fakeS3.text(DST, 'blob.bin')).toBe('opaque payload');
    });

    test('a file larger than the heap would like still round-trips', async () => {
      // Not actually large, but large enough to span many stream chunks, which is where a
      // broken pipe or a wrong ContentLength would show up. The fake rejects a body whose
      // length disagrees with the declared one, as S3 does.
      const body = 'x'.repeat(2 * 1024 * 1024);
      seedZip('big.zip', [{ path: 'big.txt', body }]);

      await onEvent(cfnEvent('Create', props({}, ['big.zip'])));

      expect(fakeS3.bytes(DST, 'big.txt')).toHaveLength(body.length);
    });

    test('a path carried by several sources is written once per source', async () => {
      // Sources are processed one at a time so that only one archive is on disk, which
      // means a shadowed file is uploaded and then overwritten rather than skipped. The
      // last source still wins; the cost is an extra write, and an extra version on a
      // versioned bucket.
      seedZip('a.zip', [{ path: 'index.html', body: 'from-a' }]);
      seedZip('b.zip', [{ path: 'index.html', body: 'from-b' }]);

      await onEvent(cfnEvent('Create', {
        SourceBucketNames: [SRC, SRC],
        SourceObjectKeys: ['a.zip', 'b.zip'],
        DestinationBucketName: DST_VERSIONED,
        DestinationBucketKeyPrefix: 'web/',
      }));

      expect(fakeS3.versions(DST_VERSIONED, 'web/index.html')).toHaveLength(2);
      expect(fakeS3.text(DST_VERSIONED, 'web/index.html')).toBe('from-b');
    });

    test('every source can skip a destination object that is already up to date', async () => {
      // Claiming a key for pruning must not change the comparison: all three sources are
      // compared against the original listing, so all three skip. Removing the record on
      // the first claim would make the later sources upload needlessly.
      const when = new Date('2030-01-01T00:00:00Z');
      fakeS3.seed(DST, 'web/index.html', 'AAAA', { lastModified: when });
      seedZip('a.zip', [{ path: 'index.html', body: 'BBBB' }]);
      seedZip('b.zip', [{ path: 'index.html', body: 'CCCC' }]);
      seedZip('c.zip', [{ path: 'index.html', body: 'DDDD' }]);

      await onEvent(cfnEvent('Create', {
        SourceBucketNames: [SRC, SRC, SRC],
        SourceObjectKeys: ['a.zip', 'b.zip', 'c.zip'],
        DestinationBucketName: DST,
        DestinationBucketKeyPrefix: 'web/',
      }));

      // Nothing was written, and the object survived pruning because every source claimed
      // it.
      expect(fakeS3.callCount('PutObject')).toBe(0);
      expect(fakeS3.text(DST, 'web/index.html')).toBe('AAAA');
    });

    test('the later source still wins when the first one already matches the destination', async () => {
      // The skip check runs against a snapshot taken before any write, so the second
      // source is compared with what was there beforehand — not with what the first source
      // just put down. Comparing against the fresher object would make this look unchanged
      // and leave `from-a` in place.
      const sameLength = { aaa: 'from-a', bbb: 'from-b' };
      seedZip('a.zip', [{ path: 'index.html', body: sameLength.aaa }]);
      seedZip('b.zip', [{ path: 'index.html', body: sameLength.bbb }]);

      await onEvent(cfnEvent('Create', {
        SourceBucketNames: [SRC, SRC],
        SourceObjectKeys: ['a.zip', 'b.zip'],
        DestinationBucketName: DST,
        DestinationBucketKeyPrefix: 'web/',
      }));

      expect(fakeS3.text(DST, 'web/index.html')).toBe('from-b');
    });

    test('a deployment costs one LIST, pruning included', async () => {
      // The destination listing serves both the skip decision and the prune set, so
      // neither grows with the number of files and pruning adds no request of its own.
      fakeS3.seed(DST, 'web/stale.txt', 'stale');
      seedZip('a.zip', [
        { path: 'one.txt', body: '1' },
        { path: 'two.txt', body: '2' },
        { path: 'deep/three.txt', body: '3' },
      ]);

      await onEvent(cfnEvent('Create', props({ DestinationBucketKeyPrefix: 'web/', Prune: 'true' })));

      expect(fakeS3.callCount('ListObjectsV2')).toBe(1);
      expect(fakeS3.callCount('HeadObject')).toBe(0);
      expect(fakeS3.relativeKeys(DST, 'web/')).toEqual(['deep/three.txt', 'one.txt', 'two.txt']);
    });

    test('a redeployment that changes nothing writes nothing', async () => {
      seedZip('a.zip', [{ path: 'one.txt', body: '1' }, { path: 'two.txt', body: '2' }]);
      const event = cfnEvent('Create', props({ DestinationBucketKeyPrefix: 'web/' }));
      await onEvent(event);

      const puts = fakeS3.callCount('PutObject');
      await onEvent(event);

      expect(fakeS3.callCount('PutObject')).toBe(puts);
    });

    test('a skipped entry is never decompressed', async () => {
      // The skip decision comes from the central directory and the LIST response, so a
      // redeployment of an unchanged site reads no entry contents at all.
      seedZip('a.zip', [{ path: 'f.txt', body: 'same' }]);
      const event = cfnEvent('Create', props({ DestinationBucketKeyPrefix: 'web/' }));

      await onEvent(event);
      const before = fakeS3.object(DST, 'web/f.txt');
      await onEvent(event);

      expect(fakeS3.object(DST, 'web/f.txt')).toBe(before);
    });
  });

  describe('deciding what to skip', () => {
    // The skip decision uses only `Size` and `LastModified` from the LIST response, which
    // is what `aws s3 sync` did. These tests pin both halves of that rule and the two
    // things it cannot see.
    const versionedProps = (extra: Record<string, any> = {}) => ({
      SourceBucketNames: [SRC],
      SourceObjectKeys: ['a.zip'],
      DestinationBucketName: DST_VERSIONED,
      DestinationBucketKeyPrefix: 'web/',
      ...extra,
    });

    test('redeploying identical content writes no new version', async () => {
      seedZip('a.zip', [{ path: 'f.txt', body: 'same' }]);

      await onEvent(cfnEvent('Create', versionedProps()));
      await onEvent(cfnEvent('Create', versionedProps()));

      expect(fakeS3.versions(DST_VERSIONED, 'web/f.txt')).toHaveLength(1);
      expect(fakeS3.text(DST_VERSIONED, 'web/f.txt')).toBe('same');
    });

    test('a change in size writes a new version', async () => {
      seedZip('a.zip', [{ path: 'f.txt', body: 'first' }]);
      await onEvent(cfnEvent('Create', versionedProps()));

      seedZip('a.zip', [{ path: 'f.txt', body: 'second' }]);
      await onEvent(cfnEvent('Create', versionedProps()));

      expect(fakeS3.versions(DST_VERSIONED, 'web/f.txt')).toHaveLength(2);
      expect(fakeS3.text(DST_VERSIONED, 'web/f.txt')).toBe('second');
    });

    test('an archive newer than the destination object writes a new version', async () => {
      // The time half of the rule: same size, but the staged file is newer.
      fakeS3.seed(DST_VERSIONED, 'web/f.txt', 'AAAA', { lastModified: new Date('2020-01-01') });
      seedZip('a.zip', [{ path: 'f.txt', body: 'BBBB', mtime: new Date('2021-01-01') }]);

      await onEvent(cfnEvent('Create', versionedProps()));

      expect(fakeS3.text(DST_VERSIONED, 'web/f.txt')).toBe('BBBB');
    });

    test('an exactly equal timestamp skips', async () => {
      // `aws s3 sync` treats an equal timestamp as "destination is newer" and skips. Zip
      // entries carry whole seconds, so this is reachable in practice rather than a
      // theoretical tie.
      const when = new Date('2021-06-01T12:00:00Z');
      fakeS3.seed(DST_VERSIONED, 'web/f.txt', 'AAAA', { lastModified: when });
      seedZip('a.zip', [{ path: 'f.txt', body: 'BBBB', mtime: when }]);

      await onEvent(cfnEvent('Create', versionedProps()));

      expect(fakeS3.text(DST_VERSIONED, 'web/f.txt')).toBe('AAAA');
    });

    test('a same-size content change is skipped — a known hole', async () => {
      seedZip('a.zip', [{ path: 'f.txt', body: 'AAAA' }]);
      await onEvent(cfnEvent('Create', versionedProps()));

      // Same length, same archive timestamp: indistinguishable from no change.
      seedZip('a.zip', [{ path: 'f.txt', body: 'BBBB' }]);
      await onEvent(cfnEvent('Create', versionedProps()));

      expect(fakeS3.versions(DST_VERSIONED, 'web/f.txt')).toHaveLength(1);
      expect(fakeS3.text(DST_VERSIONED, 'web/f.txt')).toBe('AAAA');
    });

    test('a metadata-only change is skipped — a known hole', async () => {
      seedZip('a.zip', [{ path: 'f.txt', body: 'same' }]);
      await onEvent(cfnEvent('Create', versionedProps()));

      await onEvent(cfnEvent('Create', versionedProps({
        SystemMetadata: { 'cache-control': 'max-age=60' },
      })));

      expect(fakeS3.versions(DST_VERSIONED, 'web/f.txt')).toHaveLength(1);
      expect(fakeS3.object(DST_VERSIONED, 'web/f.txt')?.cacheControl).toBeUndefined();
    });

    test('an object deployed with Extract=false is always rewritten', async () => {
      // Its staged timestamp is the moment it was fetched, so it always beats the
      // destination. That is also why version-id reporting, which requires
      // `Extract: false`, always has a fresh id to report.
      fakeS3.seed(SRC, 'blob.zip', 'unchanged');
      // Byte-identical, and deliberately given an explicit past timestamp: without one,
      // two deployments inside the same millisecond would compare as equal and skip.
      fakeS3.seed(DST_VERSIONED, 'web/blob.zip', 'unchanged', { lastModified: new Date('2020-01-01') });

      const result = await onEvent(cfnEvent('Create', {
        SourceBucketNames: [SRC],
        SourceObjectKeys: ['blob.zip'],
        DestinationBucketName: DST_VERSIONED,
        DestinationBucketKeyPrefix: 'web/',
        Extract: 'false',
        OutputObjectVersionIds: 'true',
      }));

      expect(fakeS3.versions(DST_VERSIONED, 'web/blob.zip')).toHaveLength(2);
      expect((result.Data!.SourceObjectVersionIds as string[])[0]).toBeTruthy();
    });
  });

  test('a mid-deployment failure leaves the destination partially updated', async () => {
    // There is no rollback; asserted so that a future staging-and-swap design has to
    // change this test deliberately.
    seedZip('a.zip', [
      { path: 'allowed.txt', body: '1' },
      { path: 'blocked/denied.txt', body: '2' },
    ]);
    fakeS3.failures.putObject = (key) => key.includes('blocked/')
      ? { name: 'AccessDenied', message: 'Access Denied' }
      : undefined;

    await expect(onEvent(cfnEvent('Create', props()))).rejects.toThrow(/Access Denied/);

    expect(fakeS3.keys(DST)).toEqual(['allowed.txt']);
  });
});

// ---------------------------------------------------------------------------------------
// Markers
// ---------------------------------------------------------------------------------------

describe('markers', () => {
  test('substitutes in every file from the matching source', async () => {
    seedZip('a.zip', [
      { path: 'one.txt', body: 'a <<m>> b' },
      { path: 'nested/two.txt', body: '<<m>>' },
    ]);

    await onEvent(cfnEvent('Create', props({ SourceMarkers: [{ '<<m>>': 'arn:aws:sns:::topic' }] })));

    expect(fakeS3.text(DST, 'one.txt')).toBe('a arn:aws:sns:::topic b');
    expect(fakeS3.text(DST, 'nested/two.txt')).toBe('arn:aws:sns:::topic');
  });

  test('marker maps are per source', async () => {
    seedZip('a.zip', [{ path: 'a.txt', body: 'X' }]);
    seedZip('b.zip', [{ path: 'b.txt', body: 'X' }]);

    await onEvent(cfnEvent('Create', props(
      { SourceMarkers: [{ X: '1' }, { X: '2' }] },
      ['a.zip', 'b.zip'],
    )));

    expect(fakeS3.text(DST, 'a.txt')).toBe('1');
    expect(fakeS3.text(DST, 'b.txt')).toBe('2');
  });

  test('markers do not apply when Extract is off', async () => {
    const body = buildZip([{ path: 'f.txt', body: '<<m>>' }]);
    fakeS3.seed(SRC, 'a.zip', body);

    await onEvent(cfnEvent('Create', props({ Extract: 'false', SourceMarkers: [{ '<<m>>': 'value' }] })));

    expect(fakeS3.bytes(DST, 'a.zip').equals(body)).toBe(true);
  });

  test('jsonEscape keeps a document parseable', async () => {
    const value = 'he said "hi"\nand left';
    seedZip('a.zip', [{ path: 'config.json', body: '{"v": "<<m>>"}' }]);

    await onEvent(cfnEvent('Create', props({
      SourceMarkers: [{ '<<m>>': value }],
      SourceMarkersConfig: [{ jsonEscape: 'true' }],
    })));

    expect(JSON.parse(fakeS3.text(DST, 'config.json')).v).toBe(value);
  });
});

// ---------------------------------------------------------------------------------------
// Prune, Exclude, Include
// ---------------------------------------------------------------------------------------

describe('pruning and filters', () => {
  test('prunes destination objects the sources do not account for', async () => {
    fakeS3.seed(DST, 'web/stale.txt', 'stale');
    seedZip('a.zip', [{ path: 'keep.txt', body: 'keep' }]);

    await onEvent(cfnEvent('Create', props({ DestinationBucketKeyPrefix: 'web/' })));

    expect(fakeS3.relativeKeys(DST, 'web/')).toEqual(['keep.txt']);
  });

  test('Prune=false leaves them alone', async () => {
    fakeS3.seed(DST, 'web/stale.txt', 'stale');
    seedZip('a.zip', [{ path: 'keep.txt', body: 'keep' }]);

    await onEvent(cfnEvent('Create', props({ DestinationBucketKeyPrefix: 'web/', Prune: 'false' })));

    expect(fakeS3.relativeKeys(DST, 'web/')).toEqual(['keep.txt', 'stale.txt']);
  });

  test('pruning stays inside the prefix', async () => {
    fakeS3.seed(DST, 'web/stale.txt', 'stale');
    fakeS3.seed(DST, 'other/keep.txt', 'keep');
    fakeS3.seed(DST, 'website/keep.txt', 'keep');
    seedZip('a.zip', [{ path: 'f.txt', body: 'x' }]);

    await onEvent(cfnEvent('Create', props({ DestinationBucketKeyPrefix: 'web/' })));

    expect(fakeS3.keys(DST)).toEqual(['other/keep.txt', 'web/f.txt', 'website/keep.txt']);
  });

  test('an unslashed prefix prunes the same scope as a slashed one', async () => {
    // Normalizing the prefix once is what keeps deployment and deletion in agreement.
    fakeS3.seed(DST, 'web/stale.txt', 'stale');
    fakeS3.seed(DST, 'website/keep.txt', 'keep');
    seedZip('a.zip', [{ path: 'f.txt', body: 'x' }]);

    await onEvent(cfnEvent('Create', props({ DestinationBucketKeyPrefix: 'web' })));

    expect(fakeS3.keys(DST)).toEqual(['web/f.txt', 'website/keep.txt']);
  });

  test('Exclude protects destination objects from pruning', async () => {
    fakeS3.seed(DST, 'logs/app.log', 'log');
    fakeS3.seed(DST, 'stale.txt', 'stale');
    seedZip('a.zip', [{ path: 'f.txt', body: 'x' }]);

    await onEvent(cfnEvent('Create', props({ Exclude: ['logs/*'] })));

    expect(fakeS3.keys(DST)).toEqual(['f.txt', 'logs/app.log']);
  });

  test('an excluded file is neither uploaded nor pruned', async () => {
    // Both halves of one pattern: `*.log` keeps log files out of the deployment *and*
    // protects log files already at the destination from pruning. The AWS CLI behaved the
    // same way — `sync` applies the exclude/include patterns to the destination listing as
    // well as the source, so an excluded object never becomes a deletion candidate.
    fakeS3.seed(DST, 'web/pre-existing.log', 'keep me');
    fakeS3.seed(DST, 'web/stale.txt', 'delete me');
    seedZip('a.zip', [
      { path: 'index.html', body: 'h' },
      { path: 'build.log', body: 'noise' },
    ]);

    await onEvent(cfnEvent('Create', props({
      DestinationBucketKeyPrefix: 'web/',
      Prune: 'true',
      Exclude: ['*.log'],
    })));

    expect(fakeS3.relativeKeys(DST, 'web/')).toEqual(['index.html', 'pre-existing.log']);
  });

  test('Exclude keeps files out of the deployment', async () => {
    seedZip('a.zip', [
      { path: 'a.txt', body: 'a' },
      { path: 'b.log', body: 'b' },
      { path: 'deep/c.log', body: 'c' },
    ]);

    await onEvent(cfnEvent('Create', props({ Exclude: ['*.log'] })));

    expect(fakeS3.keys(DST)).toEqual(['a.txt']);
  });

  test('Include re-admits a subset of an Exclude', async () => {
    seedZip('a.zip', [
      { path: 'index.html', body: 'h' },
      { path: 'style.css', body: 'c' },
    ]);

    await onEvent(cfnEvent('Create', props({ Exclude: ['*'], Include: ['*.html'] })));

    expect(fakeS3.keys(DST)).toEqual(['index.html']);
  });

  test('an empty source empties the prefix', async () => {
    fakeS3.seed(DST, 'web/a.txt', 'a');
    fakeS3.seed(DST, 'web/nested/b.txt', 'b');
    seedZip('empty.zip', []);

    await onEvent(cfnEvent('Create', props({ DestinationBucketKeyPrefix: 'web/' }, ['empty.zip'])));

    expect(fakeS3.relativeKeys(DST, 'web/')).toEqual([]);
  });
});

// ---------------------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------------------

describe('metadata', () => {
  test('user metadata keys are lowercased, values preserved', async () => {
    seedZip('a.zip', [{ path: 'f.txt', body: 'x' }]);

    await onEvent(cfnEvent('Create', props({ UserMetadata: { Foo: 'Bar', BAZ: 'qux' } })));

    expect(fakeS3.object(DST, 'f.txt')?.metadata).toEqual({ foo: 'Bar', baz: 'qux' });
  });

  test('system metadata is applied to every object', async () => {
    seedZip('a.zip', [{ path: 'index.html', body: 'h' }, { path: 'data.json', body: '{}' }]);

    await onEvent(cfnEvent('Create', props({
      SystemMetadata: {
        'cache-control': 'max-age=60, public',
        'content-type': 'text/plain',
        'content-language': 'en-GB',
        'storage-class': 'STANDARD_IA',
        'website-redirect': '/elsewhere',
        'expires': 'Tue, 01 Jan 2030 00:00:00 GMT',
      },
    })));

    for (const key of ['index.html', 'data.json']) {
      const object = fakeS3.object(DST, key)!;
      expect(object.cacheControl).toBe('max-age=60, public');
      // An explicit content type overrides the per-extension guess for every object.
      expect(object.contentType).toBe('text/plain');
      expect(object.contentLanguage).toBe('en-GB');
      expect(object.storageClass).toBe('STANDARD_IA');
      expect(object.websiteRedirectLocation).toBe('/elsewhere');
      expect(object.expires).toEqual(new Date('Tue, 01 Jan 2030 00:00:00 GMT'));
    }
  });

  test('content type is guessed from the extension', async () => {
    seedZip('a.zip', [
      { path: 'index.html', body: 'h' },
      { path: 'style.css', body: 'c' },
      { path: 'data.json', body: '{}' },
      { path: 'blob.bin', body: 'b' },
    ]);

    await onEvent(cfnEvent('Create', props()));

    expect(fakeS3.object(DST, 'index.html')?.contentType).toBe('text/html');
    expect(fakeS3.object(DST, 'style.css')?.contentType).toBe('text/css');
    expect(fakeS3.object(DST, 'data.json')?.contentType).toBe('application/json');
    // Unknown extensions are left unset, which S3 renders as binary/octet-stream.
    expect(fakeS3.object(DST, 'blob.bin')?.contentType).toBeUndefined();
  });

  test('an unsupported system metadata key is rejected by name', async () => {
    seedZip('a.zip', [{ path: 'f.txt', body: 'x' }]);

    await expect(onEvent(cfnEvent('Create', props({ SystemMetadata: { 'not-a-flag': 'x' } }))))
      .rejects.toThrow(/unsupported SystemMetadata key "not-a-flag"/);
    expect(fakeS3.keys(DST)).toEqual([]);
  });

  test('sse-c-copy-source is logged and ignored, not fatal', async () => {
    // It comes from a BucketDeployment property that has never had any effect, so failing
    // the deployment over it would be worse than carrying on without it.
    const logged = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      seedZip('a.zip', [{ path: 'f.txt', body: 'x' }]);

      await onEvent(cfnEvent('Create', props({ SystemMetadata: { 'sse-c-copy-source': 'AES256' } })));

      expect(fakeS3.keys(DST)).toEqual(['f.txt']);
      expect(logged).toHaveBeenCalledWith(expect.stringContaining("ignoring SystemMetadata key 'sse-c-copy-source'"));
    } finally {
      logged.mockRestore();
    }
  });

  test('a value beginning with a dash is stored literally', async () => {
    // Nothing parses it as an option, because there is no command line.
    seedZip('a.zip', [{ path: 'f.txt', body: 'x' }]);

    await onEvent(cfnEvent('Create', props({ SystemMetadata: { 'content-type': '--acl' } })));

    expect(fakeS3.object(DST, 'f.txt')?.contentType).toBe('--acl');
  });

  test('property values are never interpreted as shell syntax', async () => {
    seedZip('a.zip', [{ path: 'index.html', body: 'x' }]);

    await onEvent(cfnEvent('Create', props({
      DestinationBucketKeyPrefix: '$(id)`whoami`/',
      UserMetadata: { k: 'v; touch /tmp/pwned' },
    })));

    expect(fakeS3.keys(DST)).toEqual(['$(id)`whoami`/index.html']);
    expect(fakeS3.object(DST, '$(id)`whoami`/index.html')?.metadata).toEqual({ k: 'v; touch /tmp/pwned' });
  });
});

// ---------------------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------------------

describe('lifecycle', () => {
  test('Create allocates a fresh physical id', async () => {
    seedZip('a.zip', [{ path: 'f.txt', body: 'x' }]);

    const first = await onEvent(cfnEvent('Create', props()));
    const second = await onEvent(cfnEvent('Create', props()));

    expect(first.PhysicalResourceId).toMatch(/^aws\.cdk\.s3deployment\.[0-9a-f-]{36}$/);
    expect(second.PhysicalResourceId).not.toBe(first.PhysicalResourceId);
  });

  test('Update and Delete relay the incoming physical id', async () => {
    seedZip('a.zip', [{ path: 'f.txt', body: 'x' }]);

    const update = await onEvent(cfnEvent('Update', props(), {
      physicalResourceId: 'aws.cdk.s3deployment.FIXED',
      oldProperties: props(),
    }));

    expect(update.PhysicalResourceId).toBeUndefined();
  });

  test.each(['Update', 'Delete'] as const)('%s without a physical id fails before mutating', async (requestType) => {
    fakeS3.seed(DST, 'web/seeded.txt', 'seeded');
    seedZip('a.zip', [{ path: 'f.txt', body: 'x' }]);

    await expect(onEvent(cfnEvent(
      requestType,
      props({ DestinationBucketKeyPrefix: 'web/', RetainOnDelete: 'false' }),
      { omitPhysicalResourceId: true },
    ))).rejects.toThrow(/'PhysicalResourceId' is not defined/);

    expect(fakeS3.keys(DST)).toEqual(['web/seeded.txt']);
  });

  test('an Update that moves the destination deletes the old one', async () => {
    fakeS3.seed(DST, 'old/f.txt', 'x');
    seedZip('a.zip', [{ path: 'f.txt', body: 'x' }]);

    await onEvent(cfnEvent(
      'Update',
      props({ DestinationBucketKeyPrefix: 'new/', RetainOnDelete: 'false' }),
      { oldProperties: props({ DestinationBucketKeyPrefix: 'old/', RetainOnDelete: 'false' }) },
    ));

    expect(fakeS3.keys(DST)).toEqual(['new/f.txt']);
  });

  test('an Update that moves the destination retains the old one by default', async () => {
    fakeS3.seed(DST, 'old/f.txt', 'x');
    seedZip('a.zip', [{ path: 'f.txt', body: 'x' }]);

    await onEvent(cfnEvent(
      'Update',
      props({ DestinationBucketKeyPrefix: 'new/' }),
      { oldProperties: props({ DestinationBucketKeyPrefix: 'old/' }) },
    ));

    expect(fakeS3.keys(DST)).toEqual(['new/f.txt', 'old/f.txt']);
  });

  test('an Update with an unchanged destination does not wipe it first', async () => {
    fakeS3.seed(DST, 'web/stale.txt', 'stale');
    seedZip('a.zip', [{ path: 'keep.txt', body: 'keep' }]);

    await onEvent(cfnEvent(
      'Update',
      props({ DestinationBucketKeyPrefix: 'web/', RetainOnDelete: 'false', Prune: 'false' }),
      { oldProperties: props({ DestinationBucketKeyPrefix: 'web/', RetainOnDelete: 'false', Prune: 'false' }) },
    ));

    // Pruning is off, so the stale object proves no separate deletion ran.
    expect(fakeS3.relativeKeys(DST, 'web/')).toEqual(['keep.txt', 'stale.txt']);
  });

  test('Delete retains content by default', async () => {
    fakeS3.seed(DST, 'web/a.txt', 'a');
    fakeS3.seed(DST, 'web/b.txt', 'b');

    await onEvent(cfnEvent('Delete', props({ DestinationBucketKeyPrefix: 'web/' })));

    expect(fakeS3.keys(DST)).toEqual(['web/a.txt', 'web/b.txt']);
  });

  test('Delete with RetainOnDelete=false removes the prefix and nothing else', async () => {
    fakeS3.seed(DST, 'app/a.txt', 'a');
    fakeS3.seed(DST, 'app/nested/b.txt', 'b');
    fakeS3.seed(DST, 'apple/c.txt', 'c');
    fakeS3.seed(DST, 'appendix.txt', 'd');

    await onEvent(cfnEvent('Delete', props({
      DestinationBucketKeyPrefix: 'app',
      RetainOnDelete: 'false',
    })));

    // The siblings share a string prefix but not a path prefix.
    expect(fakeS3.keys(DST)).toEqual(['appendix.txt', 'apple/c.txt']);
  });

  test('Delete never reads the sources', async () => {
    fakeS3.seed(DST, 'web/a.txt', 'a');

    await onEvent(cfnEvent('Delete', {
      // A bucket that does not exist in the fake: reading it would throw.
      SourceBucketNames: ['no-such-bucket'],
      SourceObjectKeys: ['nope.zip'],
      DestinationBucketName: DST,
      DestinationBucketKeyPrefix: 'web/',
      RetainOnDelete: 'false',
    }));

    expect(fakeS3.keys(DST)).toEqual([]);
  });

  test('deleting on a versioned bucket leaves recoverable versions', async () => {
    fakeS3.seed(DST_VERSIONED, 'web/a.txt', 'original');

    await onEvent(cfnEvent('Delete', {
      SourceBucketNames: [SRC],
      SourceObjectKeys: ['nope.zip'],
      DestinationBucketName: DST_VERSIONED,
      DestinationBucketKeyPrefix: 'web/',
      RetainOnDelete: 'false',
    }));

    expect(fakeS3.keys(DST_VERSIONED)).toEqual([]);
    const versions = fakeS3.versions(DST_VERSIONED, 'web/a.txt');
    expect(versions).toHaveLength(2);
    expect(versions[1].deleted).toBe(true);
  });
});

// ---------------------------------------------------------------------------------------
// Ownership guard
// ---------------------------------------------------------------------------------------

describe('ownership guard', () => {
  const deleteRequest = (prefix: string) => cfnEvent('Delete', {
    SourceBucketNames: [SRC],
    SourceObjectKeys: ['nope.zip'],
    DestinationBucketName: DST,
    DestinationBucketKeyPrefix: prefix,
    RetainOnDelete: 'false',
  });

  test('a matching tag blocks the delete', async () => {
    fakeS3.seed(DST, 'web/a.txt', 'a');
    fakeS3.setTags(DST, { 'aws-cdk:cr-owned:web/:ABCD1234': 'true' });

    await onEvent(deleteRequest('web/'));

    expect(fakeS3.keys(DST)).toEqual(['web/a.txt']);
  });

  test('a tag written for an unslashed prefix still blocks', async () => {
    // The construct embeds the caller's spelling in the tag, so normalizing the prefix
    // must not make the guard blind to it.
    fakeS3.seed(DST, 'web/a.txt', 'a');
    fakeS3.setTags(DST, { 'aws-cdk:cr-owned:web:ABCD1234': 'true' });

    await onEvent(deleteRequest('web'));

    expect(fakeS3.keys(DST)).toEqual(['web/a.txt']);
  });

  test('a tag for a different prefix does not block', async () => {
    fakeS3.seed(DST, 'web/a.txt', 'a');
    fakeS3.setTags(DST, { 'aws-cdk:cr-owned:other/:ABCD1234': 'true' });

    await onEvent(deleteRequest('web/'));

    expect(fakeS3.keys(DST)).toEqual([]);
  });

  test('no ownership tag means the content goes', async () => {
    fakeS3.seed(DST, 'web/a.txt', 'a');

    await onEvent(deleteRequest('web/'));

    expect(fakeS3.keys(DST)).toEqual([]);
  });

  test('an unreadable tag set is treated as owned, so nothing is deleted', async () => {
    // Fails closed without failing the request: treating an unreadable tag set as "not
    // owned" would turn a missing permission into data loss, and aborting would turn it
    // into a failed stack operation.
    fakeS3.seed(DST, 'web/a.txt', 'a');
    fakeS3.failures.getBucketTagging = { name: 'AccessDenied', message: 'Access Denied' };

    await onEvent(deleteRequest('web/'));

    expect(fakeS3.keys(DST)).toEqual(['web/a.txt']);
  });

  test('the guard also covers the destructive Update path', async () => {
    fakeS3.seed(DST, 'old/a.txt', 'a');
    fakeS3.setTags(DST, { 'aws-cdk:cr-owned:old/:ABCD1234': 'true' });
    seedZip('a.zip', [{ path: 'f.txt', body: 'x' }]);

    await onEvent(cfnEvent(
      'Update',
      props({ DestinationBucketKeyPrefix: 'new/', RetainOnDelete: 'false' }),
      { oldProperties: props({ DestinationBucketKeyPrefix: 'old/', RetainOnDelete: 'false' }) },
    ));

    expect(fakeS3.keys(DST)).toEqual(['new/f.txt', 'old/a.txt']);
  });

  test('the guard does not cover pruning', async () => {
    // Pruning is an explicit instruction scoped to the prefix the caller named.
    fakeS3.seed(DST, 'web/stale.txt', 'stale');
    fakeS3.setTags(DST, { 'aws-cdk:cr-owned:web/:ABCD1234': 'true' });
    seedZip('a.zip', [{ path: 'f.txt', body: 'x' }]);

    await onEvent(cfnEvent('Create', props({ DestinationBucketKeyPrefix: 'web/' })));

    expect(fakeS3.relativeKeys(DST, 'web/')).toEqual(['f.txt']);
  });

  test('the provider never writes bucket tags', async () => {
    seedZip('a.zip', [{ path: 'f.txt', body: 'x' }]);
    const before = { 'aws-cdk:cr-owned:other/:X': 'true' };
    fakeS3.setTags(DST, { ...before });

    await onEvent(cfnEvent('Create', props()));

    expect(fakeS3.tagsOf(DST)).toEqual(before);
  });
});

// ---------------------------------------------------------------------------------------
// Response
// ---------------------------------------------------------------------------------------

describe('response data', () => {
  test('echoes DestinationBucketArn and reports the source keys', async () => {
    seedZip('a.zip', [{ path: 'f.txt', body: 'x' }]);
    const arn = 'arn:aws:s3:::not-a-real-bucket';

    const result = await onEvent(cfnEvent('Create', props({ DestinationBucketArn: arn })));

    expect(result.Data).toMatchObject({ DestinationBucketArn: arn, SourceObjectKeys: ['a.zip'] });
    expect(result.NoEcho).toBe(false);
  });

  test('reports source keys, not destination keys', async () => {
    fakeS3.seed(SRC, 'assets/abc.zip', 'payload');

    const result = await onEvent(cfnEvent('Create', props(
      { Extract: 'false', DestinationBucketKeyPrefix: 'web/' },
      ['assets/abc.zip'],
    )));

    expect(result.Data!.SourceObjectKeys).toEqual(['assets/abc.zip']);
    expect(fakeS3.keys(DST)).toEqual(['web/abc.zip']);
  });

  test('OutputObjectKeys=false empties the list without changing the deployment', async () => {
    seedZip('a.zip', [{ path: 'f.txt', body: 'x' }]);

    const result = await onEvent(cfnEvent('Create', props({ OutputObjectKeys: 'false' })));

    expect(result.Data!.SourceObjectKeys).toEqual([]);
    expect(fakeS3.keys(DST)).toEqual(['f.txt']);
  });

  describe('version ids', () => {
    const versionedProps = (extra: Record<string, any> = {}, sourceKeys = ['one.zip', 'two.zip']) => ({
      SourceBucketNames: sourceKeys.map(() => SRC),
      SourceObjectKeys: sourceKeys,
      DestinationBucketName: DST_VERSIONED,
      DestinationBucketKeyPrefix: 'web/',
      Extract: 'false',
      OutputObjectVersionIds: 'true',
      ...extra,
    });

    test('reports a version id per source, in order', async () => {
      fakeS3.seed(SRC, 'one.zip', 'one');
      fakeS3.seed(SRC, 'two.zip', 'two');

      const result = await onEvent(cfnEvent('Create', versionedProps()));

      const ids = result.Data!.SourceObjectVersionIds as string[];
      expect(ids).toHaveLength(2);
      expect(ids[0]).toBe(fakeS3.object(DST_VERSIONED, 'web/one.zip')!.versionId);
      expect(ids[1]).toBe(fakeS3.object(DST_VERSIONED, 'web/two.zip')!.versionId);
    });

    test('an unversioned bucket reports empty strings', async () => {
      fakeS3.seed(SRC, 'one.zip', 'one');
      fakeS3.seed(SRC, 'two.zip', 'two');

      const result = await onEvent(cfnEvent('Create', versionedProps({ DestinationBucketName: DST })));

      expect(result.Data!.SourceObjectVersionIds).toEqual(['', '']);
    });

    test('a filtered-out source reports an empty string rather than failing', async () => {
      fakeS3.seed(SRC, 'keep-me.zip', 'keep');
      fakeS3.seed(SRC, 'drop-me.zip', 'drop');

      const result = await onEvent(cfnEvent('Create', versionedProps(
        { Exclude: ['*'], Include: ['keep-me.zip'] },
        ['keep-me.zip', 'drop-me.zip'],
      )));

      const ids = result.Data!.SourceObjectVersionIds as string[];
      expect(ids[0]).toBeTruthy();
      expect(ids[1]).toBe('');
    });

    test('Delete reports an empty list rather than omitting the key', async () => {
      const result = await onEvent(cfnEvent('Delete', props({ OutputObjectVersionIds: 'true' })));

      expect(result.Data).toHaveProperty('SourceObjectVersionIds');
      expect(result.Data!.SourceObjectVersionIds).toEqual([]);
    });

    test.each([undefined, 'false'])('absent when OutputObjectVersionIds=%s', async (flag) => {
      seedZip('a.zip', [{ path: 'f.txt', body: 'x' }]);

      const result = await onEvent(cfnEvent('Create', props(
        flag === undefined ? {} : { OutputObjectVersionIds: flag },
      )));

      expect(result.Data).not.toHaveProperty('SourceObjectVersionIds');
    });

    test('combining it with Extract is rejected instead of returning empty strings', async () => {
      // Returning empty strings instead would be indistinguishable from an unversioned
      // bucket.
      seedZip('a.zip', [{ path: 'f.txt', body: 'x' }]);

      await expect(onEvent(cfnEvent('Create', props({ OutputObjectVersionIds: 'true' }))))
        .rejects.toThrow(/requires 'Extract' to be false/);
    });
  });
});

// ---------------------------------------------------------------------------------------
// CloudFront invalidation
// ---------------------------------------------------------------------------------------

describe('cloudfront invalidation', () => {
  // The provider polls CloudFront on the production 20-second interval with a 13-minute
  // budget. A virtual clock lets the real values be exercised without the wall-clock cost,
  // so the waiting tests assert the shipped timings rather than injected ones.
  beforeEach(() => {
    // `nextTick` and `setImmediate` stay real: the zip reader's streams are scheduled on
    // them, so faking them would stall reading the source archive instead of the
    // invalidation waiter this suite is about.
    jest.useFakeTimers({ doNotFake: ['nextTick', 'setImmediate'] });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('no DistributionId means no invalidation', async () => {
    seedZip('a.zip', [{ path: 'f.txt', body: 'x' }]);

    await onEvent(cfnEvent('Create', props()));

    expect(fakeCloudFront.allInvalidations()).toEqual([]);
  });

  test('default paths cover the destination prefix', async () => {
    seedZip('a.zip', [{ path: 'f.txt', body: 'x' }]);

    await onEvent(cfnEvent('Create', props({
      DestinationBucketKeyPrefix: 'web/',
      DistributionId: DISTRIBUTION,
    })));

    expect(fakeCloudFront.invalidationsFor(DISTRIBUTION).map((i) => i.paths)).toEqual([['/web/*']]);
  });

  test('default paths cover the whole distribution with no prefix', async () => {
    seedZip('a.zip', [{ path: 'f.txt', body: 'x' }]);

    await onEvent(cfnEvent('Create', props({ DistributionId: DISTRIBUTION })));

    expect(fakeCloudFront.invalidationsFor(DISTRIBUTION)[0].paths).toEqual(['/*']);
  });

  test('explicit paths are used as given', async () => {
    seedZip('a.zip', [{ path: 'f.txt', body: 'x' }]);

    await onEvent(cfnEvent('Create', props({
      DistributionId: DISTRIBUTION,
      DistributionPaths: ['/a/*', '/b'],
    })));

    expect(fakeCloudFront.invalidationsFor(DISTRIBUTION)[0].paths).toEqual(['/a/*', '/b']);
  });

  test('a Delete does not invalidate', async () => {
    // A Delete is assumed to be taking the distribution with it, so flushing its caches
    // would be wasted work. This differs from the AWS CLI implementation, which
    // invalidated on every request type.
    fakeS3.seed(DST, 'web/a.txt', 'a');

    await onEvent(cfnEvent('Delete', props({
      DestinationBucketKeyPrefix: 'web/',
      RetainOnDelete: 'false',
      DistributionId: DISTRIBUTION,
    })));

    expect(fakeS3.keys(DST)).toEqual([]);
    expect(fakeCloudFront.invalidationsFor(DISTRIBUTION)).toEqual([]);
  });

  test('waiting means the invalidation has completed when the request returns', async () => {
    fakeCloudFront.pollsUntilComplete = 2;
    seedZip('a.zip', [{ path: 'f.txt', body: 'x' }]);

    await advanceTimeUntil(onEvent(cfnEvent('Create', props({
      DistributionId: DISTRIBUTION,
      WaitForDistributionInvalidation: 'true',
    }))));

    expect(fakeCloudFront.invalidationsFor(DISTRIBUTION)[0].status).toBe('Completed');
  });

  test('not waiting returns while the invalidation is still in progress', async () => {
    fakeCloudFront.pollsUntilComplete = 2;
    seedZip('a.zip', [{ path: 'f.txt', body: 'x' }]);

    await onEvent(cfnEvent('Create', props({
      DistributionId: DISTRIBUTION,
      WaitForDistributionInvalidation: 'false',
    })));

    expect(fakeCloudFront.invalidationsFor(DISTRIBUTION)[0].status).toBe('InProgress');
  });

  test('a wait that cannot be confirmed fails with the documented message', async () => {
    fakeCloudFront.pollsUntilComplete = 5;
    fakeCloudFront.failGetInvalidation = { name: 'AccessDenied', message: 'not authorized' };
    seedZip('a.zip', [{ path: 'f.txt', body: 'x' }]);

    await expect(advanceTimeUntil(onEvent(cfnEvent('Create', props({
      DistributionId: DISTRIBUTION,
      WaitForDistributionInvalidation: 'true',
    }))))).rejects.toThrow(/Unable to confirm that cache invalidation was successful/);

    // The destination was fully written before the invalidation step ran: no rollback.
    expect(fakeS3.keys(DST)).toEqual(['f.txt']);
  });

  test('a wait that never completes fails with the documented message', async () => {
    fakeCloudFront.neverComplete = true;
    seedZip('a.zip', [{ path: 'f.txt', body: 'x' }]);

    await expect(advanceTimeUntil(onEvent(cfnEvent('Create', props({
      DistributionId: DISTRIBUTION,
      WaitForDistributionInvalidation: 'true',
    }))))).rejects.toThrow(/Unable to confirm that cache invalidation was successful.*timed out/s);
  });

  test('retrying the same request does not create a second invalidation', async () => {
    // A fresh caller reference per attempt would make every retry billable.
    seedZip('a.zip', [{ path: 'f.txt', body: 'x' }]);
    const event = cfnEvent('Create', props({ DistributionId: DISTRIBUTION }), { requestId: 'retried-request' });

    await onEvent(event);
    await onEvent(event);

    expect(fakeCloudFront.invalidationsFor(DISTRIBUTION)).toHaveLength(1);
  });

  test('a different request creates its own invalidation', async () => {
    seedZip('a.zip', [{ path: 'f.txt', body: 'x' }]);

    await onEvent(cfnEvent('Create', props({ DistributionId: DISTRIBUTION }), { requestId: 'request-one' }));
    await onEvent(cfnEvent('Create', props({ DistributionId: DISTRIBUTION }), { requestId: 'request-two' }));

    expect(fakeCloudFront.invalidationsFor(DISTRIBUTION)).toHaveLength(2);
  });
});
