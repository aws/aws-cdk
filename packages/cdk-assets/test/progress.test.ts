import { AssetManifest } from '@aws-cdk/cx-api';
import * as mockfs from 'mock-fs';
import { AssetPublishing, IPublishProgress, IPublishProgressListener } from '../lib';
import { mockAws, mockedApiFailure, mockPutObject } from './mock-aws';

let aws: ReturnType<typeof mockAws>;
beforeEach(() => {
  mockfs({
    '/simple/cdk.out/assets.json': JSON.stringify({
      version: 'assets-1.0',
      assets: {
        theAsset: {
          type: 'file',
          source: {
            path: 'some_file'
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
  aws.mockS3.headObject = mockedApiFailure('NotFound', 'File does not exist');
  aws.mockS3.putObject = mockPutObject();
});

afterEach(() => {
  mockfs.restore();
});

test('test listener', async () => {
  const progressListener = new FakeListener();

  const pub = new AssetPublishing({ aws, manifest: AssetManifest.fromPath('/simple/cdk.out'), progressListener });
  await pub.publish();

  const allMessages = progressListener.messages.join('\n');

  // Log mentions asset/destination ids
  expect(allMessages).toContain('theAsset:theDestination1');
  expect(allMessages).toContain('theAsset:theDestination2');
});

test('test abort', async () => {
  const progressListener = new FakeListener(true);

  const pub = new AssetPublishing({ aws, manifest: AssetManifest.fromPath('/simple/cdk.out'), progressListener });
  await pub.publish();

  const allMessages = progressListener.messages.join('\n');

  // We never get to asset 2
  expect(allMessages).not.toContain('theAsset:theDestination2');
});

class FakeListener implements IPublishProgressListener {
  public readonly messages = new Array<string>();

  constructor(private readonly doAbort = false) {
  }

  public onAssetStart(event: IPublishProgress): void {
    this.messages.push(event.message);

    if (this.doAbort) {
      event.abort();
    }
  }

  public onAssetEnd(event: IPublishProgress): void {
    this.messages.push(event.message);
  }

  public onEvent(event: IPublishProgress): void {
    this.messages.push(event.message);
  }

  public onError(event: IPublishProgress): void {
    this.messages.push(event.message);
  }
}