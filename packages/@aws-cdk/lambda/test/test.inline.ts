import { expect } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';
import { Bucket } from '@aws-cdk/s3';
import * as fs from 'fs';
import { Test } from 'nodeunit';
import * as path from 'path';
import { InlineJavaScriptFunction } from '../lib';

export = {
    'inline node lambda allows plugging in javascript functions as handlers'(test: Test) {

        const stack = new Stack();
        const bucket = new Bucket(stack, 'MyBucket');
        const lambda = new InlineJavaScriptFunction(stack, 'MyLambda', {
            environment: {
                BUCKET_NAME: bucket.bucketName
            },
            handler: {
                fn: (_event: any, _context: any, callback: any) => {
                    // tslint:disable:no-console
                    const S3 = require('aws-sdk').S3;
                    const s3 = new S3();
                    const bucketName = process.env.BUCKET_NAME;
                    s3.upload({ Bucket: bucketName, Key: 'myfile.txt', Body: 'Hello, world' }, (err: any, data: any) => {
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
