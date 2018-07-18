import cdk = require('@aws-cdk/core');
import path = require('path');
import assets = require('../lib');

class TestStack extends cdk.Stack {
    constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
        super(parent, name, props);

        /// !show
        const asset = new assets.ZipDirectoryAsset(this, 'SampleAsset', {
            path: path.join(__dirname, 'sample-asset-directory')
        });

        new cdk.Output(this, 'S3BucketName', { value: asset.s3BucketName });
        new cdk.Output(this, 'S3ObjectKey', { value: asset.s3ObjectKey });
        new cdk.Output(this, 'S3URL', { value: asset.s3Url });
        /// !hide
    }
}

const app = new cdk.App(process.argv);
new TestStack(app, 'aws-cdk-asset-refs');
process.stdout.write(app.run());
