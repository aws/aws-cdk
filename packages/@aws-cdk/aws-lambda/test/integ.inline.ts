import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import lambda = require('../lib');

const app = new cdk.App(process.argv);

const stack = new cdk.Stack(app, 'aws-cdk-lambda-2');

const bucket = new s3.Bucket(stack, 'MyBucket');

const fn = new lambda.InlineJavaScriptFunction(stack, 'MyLambda', {
  environment: {
    BUCKET_NAME: bucket.bucketName
  },
  handler: {
    fn: (_event: any, _context: any, callback: any) => {
      // tslint:disable:no-console
      const S3 = require('aws-sdk').S3;
      const client = new S3();
      const bucketName = process.env.BUCKET_NAME;
      const req = {
        Bucket: bucketName,
        Key: 'myfile.txt',
        Body: 'Hello, world'
      };
      return client.upload(req, (err: any, data: any) => {
        if (err) {
          return callback(err);
        }
        console.log(data);
        return callback();
      });
    },
  }
});

bucket.grantReadWrite(fn.role);

process.stdout.write(app.run());
