import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'cloudfront-s3-mrap-origin');
const bucket = new s3.Bucket(stack, 'Bucket', { removalPolicy: cdk.RemovalPolicy.DESTROY });
const mrap = new s3.CfnMultiRegionAccessPoint(stack, 'Mrap', {
  regions: [{ bucket: bucket.bucketName }],
});
const oac = new cloudfront.S3OriginAccessControl(stack, 'OAC', {
  signing: cloudfront.Signing.SIGV4A_ALWAYS,
});
const distribution = new cloudfront.Distribution(stack, 'Distribution', {
  defaultBehavior: {
    origin: new origins.S3MrapOrigin(mrap.attrAlias, {
      originAccessControlId: oac.originAccessControlId,
    }),
  },
});
const statement = new iam.PolicyStatement({
  principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
  actions: ['s3:GetObject'],
  resources: [bucket.arnForObjects('*')],
  conditions: { StringEquals: { 'AWS:SourceArn': distribution.distributionArn } },
});
bucket.addToResourcePolicy(statement);
new s3.CfnMultiRegionAccessPointPolicy(stack, 'MrapPolicy', {
  mrapName: mrap.ref,
  policy: new iam.PolicyDocument({
    statements: [new iam.PolicyStatement({
      principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
      actions: ['s3:GetObject'],
      resources: [stack.formatArn({
        service: 's3',
        region: '',
        resource: 'accesspoint',
        resourceName: `${mrap.attrAlias}/object/*`,
        arnFormat: cdk.ArnFormat.SLASH_RESOURCE_NAME,
      })],
      conditions: { StringEquals: { 'AWS:SourceArn': distribution.distributionArn } },
    })],
  }).toJSON(),
});

const integ = new IntegTest(app, 'S3MrapOriginTest', { testCases: [stack] });
integ.assertions.awsApiCall('CloudFront', 'getDistributionConfig', {
  Id: distribution.distributionId,
}).expect(ExpectedResult.objectLike({
  DistributionConfig: {
    Origins: {
      Items: [{
        DomainName: `${mrap.attrAlias}.accesspoint.s3-global.amazonaws.com`,
        OriginAccessControlId: oac.originAccessControlId,
        CustomOriginConfig: { OriginProtocolPolicy: 'https-only' },
      }],
    },
  },
}));
