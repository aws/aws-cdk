import { App, Stack } from 'aws-cdk';
import { Bucket } from 'aws-cdk-s3';
import { InlineJavaScriptLambda } from '../lib/inline';

const app = new App(process.argv);

const stack = new Stack(app, 'aws-cdk-lambda-2');

const bucket = new Bucket(stack, 'MyBucket');

const lambda = new InlineJavaScriptLambda(stack, 'MyLambda', {
    environment: {
        BUCKET_NAME: bucket.bucketName
    },
    handler: {
        fn: (_event: any, _context: any, callback: any) => {
            // tslint:disable:no-console
            const S3 = require('aws-sdk').S3;
            const s3 = new S3();
            const bucketName = process.env.BUCKET_NAME;
            const req = {
                Bucket: bucketName,
                Key: 'myfile.txt',
                Body: 'Hello, world'
            };
            return s3.upload(req, (err: any, data: any) => {
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

process.stdout.write(app.run());