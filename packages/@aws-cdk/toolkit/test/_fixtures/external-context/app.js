import * as s3 from 'aws-cdk-lib/aws-s3';
import * as core from 'aws-cdk-lib/core';

const app = new core.App({ autoSynth: false });
const stack = new core.Stack(app, 'Stack1');
new s3.Bucket(stack, 'MyBucket', {
    bucketName: app.node.tryGetContext('externally-provided-bucket-name')
});
app.synth();
