import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import cloudtrail = require('../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-cloudtrail');

const bucket = new s3.Bucket(stack, 'Bucket', { removalPolicy: cdk.RemovalPolicy.Destroy });

const trail = new cloudtrail.CloudTrail(stack, 'Trail');
trail.addS3EventSelector([bucket.arnForObjects('')]);

app.run();
