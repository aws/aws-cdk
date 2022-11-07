const sdk = require('aws-sdk');
sdk.config.update({region: 'us-east-1'});

var s3 = new sdk.S3();
s3.createBucket({ Bucket: 'amazingly-made-sdk-call-created-eks-bucket' }, function(err) {
  if (!err) {
    console.log('Bucket was created');
  } else {
    throw new Error('failed to create s3 bucket with error: ' + err);
  }
});
