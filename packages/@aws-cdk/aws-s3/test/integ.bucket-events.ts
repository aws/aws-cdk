import cdk = require('@aws-cdk/core');
import s3 = require('../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-s3-events');

const bucket = new s3.Bucket(stack, 'Bucket');
// Use a raw CfnResource since aws-sns would introduce a circular dependency
const topic = new cdk.CfnResource(stack, 'MyTopic', {
    type: 'AWS::SNS::Topic',
});

bucket.onCloudTrailPutObject('OnPutObject', {
    target: {
        bind: () => ({
            arn: topic.ref,
            id: ''
        })
    },
    paths: [ 'key' ]
});

app.synth();
