import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/core');
import cloudtrail = require('../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-cloudtrail');

const bucket = new s3.Bucket(stack, 'Bucket', { removalPolicy: cdk.RemovalPolicy.DESTROY });

const trail = new cloudtrail.Trail(stack, 'Trail');
trail.addS3EventSelector([bucket.arnForObjects('')]);

app.synth();
