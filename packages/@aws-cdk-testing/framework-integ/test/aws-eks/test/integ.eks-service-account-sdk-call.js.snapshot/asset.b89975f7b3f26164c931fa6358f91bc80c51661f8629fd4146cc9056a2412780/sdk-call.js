const sdk = require('@aws-sdk/client-s3');

var s3 = new sdk.S3({ region: process.env.REGION });
const bucketName = process.env.BUCKET_NAME;
s3.createBucket({ Bucket: bucketName }, function (err) {
  if (!err) {
    console.log(`Bucket ${bucketName} was created`);
  } else {
    throw new Error(`failed to create s3 bucket ${bucketName} with error: ` + err);
  }
});
