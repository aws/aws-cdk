import { expect } from '@aws-cdk/assert';
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import fs = require('fs');
import { Test } from 'nodeunit';
import path = require('path');
import { InlineJavaScriptFunction } from '../lib';

export = {
  'inline node lambda allows plugging in javascript functions as handlers'(test: Test) {

    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'MyBucket');
    const lambda = new InlineJavaScriptFunction(stack, 'MyLambda', {
      environment: {
        BUCKET_NAME: bucket.bucketName
      },
      handler: {
        fn: (_event: any, _context: any, callback: any) => {
          // tslint:disable:no-console
          const S3 = require('aws-sdk').S3;
          const client = new S3();
          const bucketName = process.env.BUCKET_NAME;
          client.upload({ Bucket: bucketName, Key: 'myfile.txt', Body: 'Hello, world' }, (err: any, data: any) => {
            if (err) {
              return callback(err);
            }
            console.log(data);
            return callback();
          });
        },
      }
    });

    bucket.grantReadWrite(lambda.role);

    const expected = JSON.parse(fs.readFileSync(path.join(__dirname, 'inline.expected.json')).toString());
    expect(stack).toMatch(expected);

    test.done();
  }
};
