/**
 * Handler tests against in-memory AWS.
 *
 * Every assertion is about the **state of the fake services** after a request — which
 * objects exist, with what bytes and metadata, which invalidations were created. Nothing
 * asserts on the sequence of API calls, so the provider stays free to change how it
 * achieves a given outcome.
 *
 * Section references are to `BUCKET_DEPLOYMENT_CONTRACT.md`; `B` references are defects in
 * `BUCKET_DEPLOYMENT_BUGS.md` that this implementation fixes.
 */
import { CloudFrontClient } from '@aws-sdk/client-cloudfront';
import { S3Client } from '@aws-sdk/client-s3';
import type { AwsStub } from 'aws-sdk-client-mock';
import { mockClient } from 'aws-sdk-client-mock';
import { FakeCloudFront } from './fake-aws/fake-cloudfront';
import { FakeS3 } from './fake-aws/fake-s3';
import { buildZip, cfnEvent, renameEntry } from './helpers';
import { external, onEvent } from '../../../lib/aws-s3-deployment/bucket-deployment-ts-handler';
import { CloudFrontInvalidator } from '../../../lib/aws-s3-deployment/bucket-deployment-ts-handler/cloudfront';

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

  s3Mock = mockClient(S3Client);
  cloudFrontMock = mockClient(CloudFrontClient);
  fakeS3.installUsingAwsMock(s3Mock as any);
  fakeCloudFront.installUsingAwsMock(cloudFrontMock as any);

  // Poll fast and give up quickly: the production waiter's 20-second interval and
  // 13-minute budget would make the waiting tests take minutes.
  external.invalidator = (client) => new CloudFrontInvalidator(
    client,
    { intervalMs: 1, timeoutMs: 500 },
    () => Promise.resolve(),
  );

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
// §5 Resulting destination state
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

  test('archive entries cannot escape the destination prefix', async () => {
    const zip = renameEntry(
      buildZip([{ path: 'xx/escape.txt', body: 'contained' }]),
      'xx/escape.txt',
      '../escape.txt',
    );
    fakeS3.seed(SRC, 'evil.zip', zip);

    await onEvent(cfnEvent('Create', props({ DestinationBucketKeyPrefix: 'web/' }, ['evil.zip'])));

    expect(fakeS3.keys(DST)).toEqual(['web/escape.txt']);
  });

  test('empty directories do not become objects', async () => {
    seedZip('a.zip', [{ path: 'f.txt', body: 'x' }], { directories: ['empty/'] });

    await onEvent(cfnEvent('Create', props()));

    expect(fakeS3.keys(DST)).toEqual(['f.txt']);
  });

  test('a same-size content change is deployed', async () => {
    // The previous implementation delegated to `aws s3 sync`, whose comparator skipped
    // this case and silently kept the stale content (B1).
    fakeS3.seed(DST, 'web/index.html', 'AAAA');
    seedZip('a.zip', [{ path: 'index.html', body: 'BBBB' }]);

    await onEvent(cfnEvent('Create', props({ DestinationBucketKeyPrefix: 'web/' })));

    expect(fakeS3.text(DST, 'web/index.html')).toBe('BBBB');
  });

  test('metadata reaches objects that already existed with the same content', async () => {
    // Follows from the same fix: a skipped object would never get updated metadata.
    fakeS3.seed(DST, 'web/f.txt', 'same');
    seedZip('a.zip', [{ path: 'f.txt', body: 'same' }]);

    await onEvent(cfnEvent('Create', props({
      DestinationBucketKeyPrefix: 'web/',
      SystemMetadata: { 'cache-control': 'max-age=60' },
    })));

    expect(fakeS3.object(DST, 'web/f.txt')?.cacheControl).toBe('max-age=60');
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

  test('a mid-deployment failure leaves the destination partially updated', async () => {
    // No rollback (contract §5); asserted so a future staging-and-swap design has to
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
// §4 Markers
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
// §2.1 Prune, Exclude, Include
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
    // Normalizing the prefix once is what keeps deployment and deletion in agreement (B2).
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
// §2.1 Metadata
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
    // The previous implementation passed keys through to a command line, so this surfaced
    // as an opaque exit status (B10).
    seedZip('a.zip', [{ path: 'f.txt', body: 'x' }]);

    await expect(onEvent(cfnEvent('Create', props({ SystemMetadata: { 'not-a-flag': 'x' } }))))
      .rejects.toThrow(/unsupported SystemMetadata key\(s\) \["not-a-flag"\]/);
    expect(fakeS3.keys(DST)).toEqual([]);
  });

  test('a value beginning with a dash is stored literally', async () => {
    // It cannot be reinterpreted as an option, because there is no command line (B10).
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
// §3 Lifecycle
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

  test('a destructive Update without OldResourceProperties fails loudly', async () => {
    // The previous implementation returned without responding, hanging the stack (B5).
    fakeS3.seed(DST, 'web/seeded.txt', 'x');
    seedZip('a.zip', [{ path: 'f.txt', body: 'x' }]);

    await expect(onEvent(cfnEvent(
      'Update',
      props({ DestinationBucketKeyPrefix: 'new/', RetainOnDelete: 'false' }),
    ))).rejects.toThrow(/needs 'OldResourceProperties'/);

    expect(fakeS3.keys(DST)).toEqual(['web/seeded.txt']);
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

    // An unslashed prefix used to delete the siblings too (B2).
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
// §6 Ownership guard
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

  test('an unreadable tag set refuses to delete', async () => {
    // Fails closed: the previous implementation treated any error as "not owned", so a
    // missing permission escalated into data loss (B3).
    fakeS3.seed(DST, 'web/a.txt', 'a');
    fakeS3.failures.getBucketTagging = { name: 'AccessDenied', message: 'Access Denied' };

    await expect(onEvent(deleteRequest('web/'))).rejects.toThrow(/refusing to delete its contents/);

    expect(fakeS3.keys(DST)).toEqual(['web/a.txt']);
  });

  test('the guard also covers the destructive Update path', async () => {
    // Previously only the Delete path was guarded (B4).
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
// §7 Response
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
      // The previous implementation returned a list of empty strings, indistinguishable
      // from an unversioned bucket (B17).
      seedZip('a.zip', [{ path: 'f.txt', body: 'x' }]);

      await expect(onEvent(cfnEvent('Create', props({ OutputObjectVersionIds: 'true' }))))
        .rejects.toThrow(/requires 'Extract' to be false/);
    });
  });
});

// ---------------------------------------------------------------------------------------
// §3.6 CloudFront invalidation
// ---------------------------------------------------------------------------------------

describe('cloudfront invalidation', () => {
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

  test('a destructive Delete also invalidates', async () => {
    fakeS3.seed(DST, 'web/a.txt', 'a');

    await onEvent(cfnEvent('Delete', props({
      DestinationBucketKeyPrefix: 'web/',
      RetainOnDelete: 'false',
      DistributionId: DISTRIBUTION,
    })));

    expect(fakeS3.keys(DST)).toEqual([]);
    expect(fakeCloudFront.invalidationsFor(DISTRIBUTION)).toHaveLength(1);
  });

  test('waiting means the invalidation has completed when the request returns', async () => {
    fakeCloudFront.pollsUntilComplete = 2;
    seedZip('a.zip', [{ path: 'f.txt', body: 'x' }]);

    await onEvent(cfnEvent('Create', props({
      DistributionId: DISTRIBUTION,
      WaitForDistributionInvalidation: 'true',
    })));

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

    await expect(onEvent(cfnEvent('Create', props({
      DistributionId: DISTRIBUTION,
      WaitForDistributionInvalidation: 'true',
    })))).rejects.toThrow(/Unable to confirm that cache invalidation was successful/);

    // The destination was fully written before the invalidation step ran: no rollback.
    expect(fakeS3.keys(DST)).toEqual(['f.txt']);
  });

  test('a wait that never completes fails with the documented message', async () => {
    fakeCloudFront.neverComplete = true;
    seedZip('a.zip', [{ path: 'f.txt', body: 'x' }]);

    await expect(onEvent(cfnEvent('Create', props({
      DistributionId: DISTRIBUTION,
      WaitForDistributionInvalidation: 'true',
    })))).rejects.toThrow(/Unable to confirm that cache invalidation was successful.*timed out/s);
  });

  test('retrying the same request does not create a second invalidation', async () => {
    // A fresh caller reference per attempt made every retry billable (B20).
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
