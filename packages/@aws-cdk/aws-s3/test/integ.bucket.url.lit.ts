import cdk = require('@aws-cdk/cdk');
import s3 = require('../lib');

class TestStack extends cdk.Stack {
  constructor(parent: cdk.App, id: string) {
    super(parent, id);

    /// !show
    const bucket = new s3.Bucket(this, 'MyBucket');

    new cdk.Output(this, 'BucketURL', { value: bucket.bucketUrl });
    new cdk.Output(this, 'ObjectURL', { value: bucket.urlForObject('myfolder/myfile.txt') });
    /// !hide
  }
}

const app = new cdk.App(process.argv);
new TestStack(app, 'aws-cdk-s3-urls');
process.stdout.write(app.run());
