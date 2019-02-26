import path = require('path');
import assets = require('../@aws-cdk/assets/lib');
import cdk = require('../@aws-cdk/cdk/lib');

class MyStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    new cdk.Resource(this, 'R1', { type: 'R1', properties: { Boom: 'Bam' } });

    const file = new assets.FileAsset(this, 'File', {
      path: path.join(__dirname, 'file.txt')
    });

    new cdk.Resource(this, 'R2', { type: 'R2', properties: {
      Bucket: file.s3BucketName,
      Key: file.s3ObjectKey
    } });
  }

}

const app = new cdk.App();

new MyStack(app, 'my-stack');

app.run();