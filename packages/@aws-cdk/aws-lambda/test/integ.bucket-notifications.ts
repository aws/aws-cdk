import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import lambda = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'lambda-bucket-notifications');

const bucketA = new s3.Bucket(stack, 'MyBucket', {
  removalPolicy: cdk.RemovalPolicy.Destroy
});

const fn = new lambda.Function(stack, 'MyFunction', {
  runtime: lambda.Runtime.NodeJS810,
  handler: 'index.handler',
  code: lambda.Code.inline(`exports.handler = ${handler.toString()}`)
});

const bucketB = new s3.Bucket(stack, 'YourBucket', {
  removalPolicy: cdk.RemovalPolicy.Destroy
});

bucketA.onObjectCreated(fn, { suffix: '.png' });
bucketB.onEvent(s3.EventType.ObjectRemoved, fn);

app.run();

// tslint:disable:no-console
function handler(event: any, _context: any, callback: any) {
  console.log(JSON.stringify(event, undefined, 2));
  return callback(null, event);
}
