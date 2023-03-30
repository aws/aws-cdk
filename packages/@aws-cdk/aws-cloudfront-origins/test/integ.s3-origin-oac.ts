import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as origins from '../lib';

class S3OriginOAC extends origins.S3Origin {
  constructor(bucket: s3.IBucket, props?: origins.S3OriginProps) {
    if (props?.originAccessControl === undefined) {
      props = { ...(props ?? {}), originAccessControl: true };
    }
    super(bucket, props);
  }
}

function makeDistribution(stack: cdk.Stack, id: string, first: cloudfront.IOrigin, ...more: cloudfront.IOrigin[]) {
  const dist = new cloudfront.Distribution(stack, id, {
    defaultBehavior: { origin: first },
  });
  more.forEach((o, idx) => dist.addBehavior(`${idx}/*`, o));
}

const app = new cdk.App();

const stack1 = new cdk.Stack(app, 's3origin-oac-1');
const bucket = new s3.Bucket(stack1, 'Bucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});
const bucketByName = s3.Bucket.fromBucketName(stack1, 'BucketHardcoded', 's3origin-oac-test-bucket');
const bucketImport = s3.Bucket.fromBucketName(stack1, 'BucketImported', bucket.bucketName);

const oacCustom = new cloudfront.OriginAccessControl(stack1, 'OACNeverSign', {
  originType: cloudfront.OriginAccessControlOriginType.S3,
  signingBehavior: cloudfront.OriginAccessControlSigningBehavior.NEVER,
});

makeDistribution(stack1, 'DistDefault',
  // this distribution will be granted access to the bucket via resource policy
  new S3OriginOAC(bucket),
  new S3OriginOAC(bucket, { autoResourcePolicy: true }), // should collapse with above
  new S3OriginOAC(bucket, { autoResourcePolicy: false }), // no effect on policy
  new S3OriginOAC(bucket, { originAccessControl: oacCustom }),
);
makeDistribution(stack1, 'DistNoPolicy',
  // this distribution will not be granted access to any buckets via resource policy
  new S3OriginOAC(bucket, { autoResourcePolicy: false }),
  new S3OriginOAC(bucket, { autoResourcePolicy: origins.S3OriginAutoResourcePolicy.NONE }),
  new S3OriginOAC(bucketByName, { autoResourcePolicy: origins.S3OriginAutoResourcePolicy.NONE }),
  new S3OriginOAC(bucketImport, { autoResourcePolicy: origins.S3OriginAutoResourcePolicy.NONE }),
);
makeDistribution(stack1, 'DistRWPolicy',
  // this distribution will be granted full read-write access to bucket via resource policy
  new S3OriginOAC(bucket, { autoResourcePolicy: origins.S3OriginAutoResourcePolicy.READ_WRITE }),
  new S3OriginOAC(bucket, { autoResourcePolicy: true }), // should collapse with above
);

const stack2 = new cdk.Stack(app, 's3origin-oac-multistack');
makeDistribution(stack2, 'DistCrossStack',
  new S3OriginOAC(bucket, { autoResourcePolicy: false }),
  new S3OriginOAC(bucketImport, { autoResourcePolicy: false }),
);

new integ.IntegTest(app, 'CloudFrontS3OriginOACTest', {
  testCases: [stack1, stack2],
});
app.synth();
