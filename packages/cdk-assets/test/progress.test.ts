import { Manifest } from '@aws-cdk/cloud-assembly-schema';
import * as mockfs from 'mock-fs';
import { AssetManifest, AssetPublishing, EventType, IPublishProgress, IPublishProgressListener } from '../lib';
import { mockAws, mockedApiResult, mockUpload } from './mock-aws';

let aws: ReturnType<typeof mockAws>;
beforeEach(() => {
  mockfs({
    '/simple/cdk.out/assets.json': JSON.stringify({
      version: Manifest.version(),
      files: {
        theAsset: {
          source: {
            path: 'some_file',
          },
          destinations: {
            theDestination1: {
              region: 'us-north-50',
              assumeRoleArn: 'arn:aws:role',
              bucketName: 'some_bucket',
              objectKey: 'some_key',
            },
            theDestination2: {
              region: 'us-north-50',
              assumeRoleArn: 'arn:aws:role',
              bucketName: 'some_bucket',
              objectKey: 'some_key2',
            },
          },
        },
      },
    }),
    '/simple/cdk.out/some_file': 'FILE_CONTENTS',
  });

  aws = mockAws();

  // Accept all S3 uploads as new
  aws.mockS3.getBucketLocation = mockedApiResult({});
  aws.mockS3.listObjectsV2 = mockedApiResult({ Contents: undefined });
  aws.mockS3.upload = mockUpload();
});

afterEach(() => {
  mockfs.restore();
});

test('test listener', async () => {
  const progressListener = new FakeListener();

  const pub = new AssetPublishing(AssetManifest.fromPath('/simple/cdk.out'), { aws, progressListener });
  await pub.publish();

  const allMessages = progressListener.messages.join('\n');

  // Log mentions asset/destination ids
  expect(allMessages).toContain('theAsset:theDestination1');
  expect(allMessages).toContain('theAsset:theDestination2');
});

test('test abort', async () => {
  const progressListener = new FakeListener(true);

  const pub = new AssetPublishing(AssetManifest.fromPath('/simple/cdk.out'), { aws, progressListener });
  await pub.publish();

  const allMessages = progressListener.messages.join('\n');

  // We never get to asset 2
  expect(allMessages).not.toContain('theAsset:theDestination2');
});

class FakeListener implements IPublishProgressListener {
  public readonly messages = new Array<string>();

  constructor(private readonly doAbort = false) {
  }

  public onPublishEvent(_type: EventType, event: IPublishProgress): void {
    this.messages.push(event.message);

    if (this.doAbort) {
      event.abort();
    }
  }
}
