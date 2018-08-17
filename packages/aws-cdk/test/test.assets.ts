import { Test } from 'nodeunit';
import { prepareAssets } from '../lib/assets';

export = {
  async 'prepare assets'(test: Test) {
    const stack = {
      metadata: {
        '/SomeStack/SomeResource': {
          type: 'aws:cdk:asset',
          data: {
            path: 'abc.zip',
            packaging: 'file',
            s3BucketParameter: 'BucketParameter',
            s3KeyParameter: 'KeyParameter'
          },
          trace: []
        }
      },
      template: {
        Resources: {
          SomeResource: {
            Type: 'AWS::Something::Something'
          }
        }
      }
    };
    const toolkit = {};
    const params = await prepareAssets(stack, toolkit);

    console.log(params);
    test.done();
  }
};
