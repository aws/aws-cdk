import { SynthUtils } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { RetentionDays } from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import { Stack } from '@aws-cdk/core';
import { ReadWriteType, Trail } from '../lib';

const ExpectedBucketPolicyProperties = {
  PolicyDocument: {
    Statement: [
      {
        Action: 's3:GetBucketAcl',
        Effect: 'Allow',
        Principal: {
          Service: 'cloudtrail.amazonaws.com',
        },
        Resource: {
          'Fn::GetAtt': [
            'MyAmazingCloudTrailS3A580FE27',
            'Arn',
          ],
        },
      },
      {
        Action: 's3:PutObject',
        Condition: {
          StringEquals: {
            's3:x-amz-acl': 'bucket-owner-full-control',
          },
        },
        Effect: 'Allow',
        Principal: {
          Service: 'cloudtrail.amazonaws.com',
        },
        Resource: {
          'Fn::Join': [
            '',
            [
              {
                'Fn::GetAtt': [
                  'MyAmazingCloudTrailS3A580FE27',
                  'Arn',
                ],
              },
              '/AWSLogs/123456789012/*',
            ],
          ],
        },
      },
    ],
    Version: '2012-10-17',
  },
};

const logsRolePolicyName = 'MyAmazingCloudTrailLogsRoleDefaultPolicy61DC49E7';
const logsRoleName = 'MyAmazingCloudTrailLogsRoleF2CCF977';

function getTestStack(): Stack {
  return new Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'us-east-1' } });
}

describe('cloudtrail', () => {
  describe('constructs the expected resources', () => {
    test('with no properties', () => {
      const stack = getTestStack();
      new Trail(stack, 'MyAmazingCloudTrail');
      expect(stack).toHaveResource('AWS::CloudTrail::Trail');
      expect(stack).toHaveResource('AWS::S3::Bucket');
      expect(stack).toHaveResource('AWS::S3::BucketPolicy', ExpectedBucketPolicyProperties);
      expect(stack).not.toHaveResource('AWS::Logs::LogGroup');
      const trail: any = SynthUtils.synthesize(stack).template.Resources.MyAmazingCloudTrail54516E8D;
      expect(trail.DependsOn).toEqual(['MyAmazingCloudTrailS3Policy39C120B0']);
    });

    test('with s3bucket', () => {
      const stack = getTestStack();
      const Trailbucket = new s3.Bucket(stack, 'S3');
      const cloudTrailPrincipal = new iam.ServicePrincipal('cloudtrail.amazonaws.com');
      Trailbucket.addToResourcePolicy(new iam.PolicyStatement({
        resources: [Trailbucket.bucketArn],
        actions: ['s3:GetBucketAcl'],
        principals: [cloudTrailPrincipal],
      }));

      Trailbucket.addToResourcePolicy(new iam.PolicyStatement({
        resources: [Trailbucket.arnForObjects(`AWSLogs/${Stack.of(stack).account}/*`)],
        actions: ['s3:PutObject'],
        principals: [cloudTrailPrincipal],
        conditions: {
          StringEquals: { 's3:x-amz-acl': 'bucket-owner-full-control' },
        },
      }));

      new Trail(stack, 'Trail', { bucket: Trailbucket });

      expect(stack).toHaveResource('AWS::CloudTrail::Trail');
      expect(stack).toHaveResource('AWS::S3::Bucket');
      expect(stack).toHaveResource('AWS::S3::BucketPolicy');
      expect(stack).not.toHaveResource('AWS::Logs::LogGroup');
    });

    test('with imported s3 bucket', () => {
      // GIVEN
      const stack = getTestStack();
      const bucket = s3.Bucket.fromBucketName(stack, 'S3', 'SomeBucket');

      // WHEN
      new Trail(stack, 'Trail', { bucket });

      expect(stack).toHaveResource('AWS::CloudTrail::Trail', {
        S3BucketName: 'SomeBucket',
      });
    });

    test('with s3KeyPrefix', () => {
      // GIVEN
      const stack = getTestStack();

      // WHEN
      new Trail(stack, 'Trail', { s3KeyPrefix: 'someprefix' });

      expect(stack).toHaveResource('AWS::CloudTrail::Trail');
      expect(stack).toHaveResource('AWS::S3::Bucket');
      expect(stack).toHaveResource('AWS::S3::BucketPolicy', {
        Bucket: { Ref: 'TrailS30071F172' },
        PolicyDocument: {
          Statement: [
            {
              Action: 's3:GetBucketAcl',
              Effect: 'Allow',
              Principal: { Service: 'cloudtrail.amazonaws.com' },
              Resource: { 'Fn::GetAtt': ['TrailS30071F172', 'Arn'] },
            },
            {
              Action: 's3:PutObject',
              Condition: {
                StringEquals: { 's3:x-amz-acl': 'bucket-owner-full-control' },
              },
              Effect: 'Allow',
              Principal: { Service: 'cloudtrail.amazonaws.com' },
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    { 'Fn::GetAtt': ['TrailS30071F172', 'Arn'] },
                    '/someprefix/AWSLogs/123456789012/*',
                  ],
                ],
              },
            },
          ],
          Version: '2012-10-17',
        },
      });
    });

    describe('with cloud watch logs', () => {
      test('enabled', () => {
        const stack = getTestStack();
        new Trail(stack, 'MyAmazingCloudTrail', {
          sendToCloudWatchLogs: true,
        });

        expect(stack).toHaveResource('AWS::CloudTrail::Trail');
        expect(stack).toHaveResource('AWS::S3::Bucket');
        expect(stack).toHaveResource('AWS::S3::BucketPolicy', ExpectedBucketPolicyProperties);
        expect(stack).toHaveResource('AWS::Logs::LogGroup');
        expect(stack).toHaveResource('AWS::IAM::Role');
        expect(stack).toHaveResource('AWS::Logs::LogGroup', { RetentionInDays: 365 });
        expect(stack).toHaveResource('AWS::IAM::Policy', {
          PolicyDocument: {
            Version: '2012-10-17',
            Statement: [{
              Effect: 'Allow',
              Action: ['logs:PutLogEvents', 'logs:CreateLogStream'],
              Resource: {
                'Fn::GetAtt': ['MyAmazingCloudTrailLogGroupAAD65144', 'Arn'],
              },
            }],
          },
          PolicyName: logsRolePolicyName,
          Roles: [{ Ref: 'MyAmazingCloudTrailLogsRoleF2CCF977' }],
        });
        const trail: any = SynthUtils.synthesize(stack).template.Resources.MyAmazingCloudTrail54516E8D;
        expect(trail.DependsOn).toEqual([logsRolePolicyName, logsRoleName, 'MyAmazingCloudTrailS3Policy39C120B0']);
      });

      test('enabled and custom retention', () => {
        const stack = getTestStack();
        new Trail(stack, 'MyAmazingCloudTrail', {
          sendToCloudWatchLogs: true,
          cloudWatchLogsRetention: RetentionDays.ONE_WEEK,
        });

        expect(stack).toHaveResource('AWS::CloudTrail::Trail');
        expect(stack).toHaveResource('AWS::S3::Bucket');
        expect(stack).toHaveResource('AWS::S3::BucketPolicy', ExpectedBucketPolicyProperties);
        expect(stack).toHaveResource('AWS::Logs::LogGroup');
        expect(stack).toHaveResource('AWS::IAM::Role');
        expect(stack).toHaveResource('AWS::Logs::LogGroup', {
          RetentionInDays: 7,
        });
        const trail: any = SynthUtils.synthesize(stack).template.Resources.MyAmazingCloudTrail54516E8D;
        expect(trail.DependsOn).toEqual([logsRolePolicyName, logsRoleName, 'MyAmazingCloudTrailS3Policy39C120B0']);
      });
    });

    describe('with event selectors', () => {
      test('with default props', () => {
        const stack = getTestStack();

        const cloudTrail = new Trail(stack, 'MyAmazingCloudTrail');
        cloudTrail.addS3EventSelector(['arn:aws:s3:::']);

        expect(stack).toHaveResource('AWS::CloudTrail::Trail');
        expect(stack).toHaveResource('AWS::S3::Bucket');
        expect(stack).toHaveResource('AWS::S3::BucketPolicy', ExpectedBucketPolicyProperties);
        expect(stack).not.toHaveResource('AWS::Logs::LogGroup');
        expect(stack).not.toHaveResource('AWS::IAM::Role');

        const trail: any = SynthUtils.synthesize(stack).template.Resources.MyAmazingCloudTrail54516E8D;
        expect(trail.Properties.EventSelectors.length).toEqual(1);
        const selector = trail.Properties.EventSelectors[0];
        expect(selector.ReadWriteType).toBeUndefined();
        expect(selector.IncludeManagementEvents).toBeUndefined();
        expect(selector.DataResources.length).toEqual(1);
        const dataResource = selector.DataResources[0];
        expect(dataResource.Type).toEqual('AWS::S3::Object');
        expect(dataResource.Values.length).toEqual(1);
        expect(dataResource.Values[0]).toEqual('arn:aws:s3:::');
        expect(trail.DependsOn).toEqual(['MyAmazingCloudTrailS3Policy39C120B0']);
      });

      test('with hand-specified props', () => {
        const stack = getTestStack();

        const cloudTrail = new Trail(stack, 'MyAmazingCloudTrail');
        cloudTrail.addS3EventSelector(['arn:aws:s3:::'], { includeManagementEvents: false, readWriteType: ReadWriteType.READ_ONLY });

        expect(stack).toHaveResource('AWS::CloudTrail::Trail');
        expect(stack).toHaveResource('AWS::S3::Bucket');
        expect(stack).toHaveResource('AWS::S3::BucketPolicy', ExpectedBucketPolicyProperties);
        expect(stack).not.toHaveResource('AWS::Logs::LogGroup');
        expect(stack).not.toHaveResource('AWS::IAM::Role');

        const trail: any = SynthUtils.synthesize(stack).template.Resources.MyAmazingCloudTrail54516E8D;
        expect(trail.Properties.EventSelectors.length).toEqual(1);
        const selector = trail.Properties.EventSelectors[0];
        expect(selector.ReadWriteType).toEqual('ReadOnly');
        expect(selector.IncludeManagementEvents).toEqual(false);
        expect(selector.DataResources.length).toEqual(1);
        const dataResource = selector.DataResources[0];
        expect(dataResource.Type).toEqual('AWS::S3::Object');
        expect(dataResource.Values.length).toEqual(1);
        expect(dataResource.Values[0]).toEqual('arn:aws:s3:::');
        expect(trail.DependsOn).toEqual(['MyAmazingCloudTrailS3Policy39C120B0']);
      });

      test('with management event', () => {
        const stack = getTestStack();

        new Trail(stack, 'MyAmazingCloudTrail', { managementEvents: ReadWriteType.WRITE_ONLY });

        const trail: any = SynthUtils.synthesize(stack).template.Resources.MyAmazingCloudTrail54516E8D;
        expect(trail.Properties.EventSelectors.length).toEqual(1);
        const selector = trail.Properties.EventSelectors[0];
        expect(selector.ReadWriteType).toEqual('WriteOnly');
        expect(selector.IncludeManagementEvents).toEqual(true);
        expect(selector.DataResources).toEqual(undefined);
      });

      test('for Lambda function data event', () => {
        const stack = getTestStack();
        const lambdaFunction = new lambda.Function(stack, 'LambdaFunction', {
          runtime: lambda.Runtime.NODEJS_10_X,
          handler: 'hello.handler',
          code: lambda.Code.fromInline('exports.handler = {}'),
        });

        const cloudTrail = new Trail(stack, 'MyAmazingCloudTrail');
        cloudTrail.addLambdaEventSelector([lambdaFunction.functionArn]);

        expect(stack).toHaveResource('AWS::CloudTrail::Trail');
        expect(stack).toHaveResource('AWS::Lambda::Function');
        expect(stack).not.toHaveResource('AWS::Logs::LogGroup');

        const trail: any = SynthUtils.synthesize(stack).template.Resources.MyAmazingCloudTrail54516E8D;
        expect(trail.Properties.EventSelectors.length).toEqual(1);
        const selector = trail.Properties.EventSelectors[0];
        expect(selector.ReadWriteType).toBeUndefined();
        expect(selector.IncludeManagementEvents).toBeUndefined();
        expect(selector.DataResources.length).toEqual(1);
        const dataResource = selector.DataResources[0];
        expect(dataResource.Type).toEqual('AWS::Lambda::Function');
        expect(dataResource.Values.length).toEqual(1);
        expect(dataResource.Values[0]).toEqual({ 'Fn::GetAtt': [ 'LambdaFunctionBF21E41F', 'Arn' ] });
        expect(trail.DependsOn).toEqual(['MyAmazingCloudTrailS3Policy39C120B0']);
      });

      test('for all Lambda function data events', () => {
        const stack = getTestStack();

        const cloudTrail = new Trail(stack, 'MyAmazingCloudTrail');
        cloudTrail.addLambdaEventSelector(['arn:aws:lambda']);

        expect(stack).toHaveResource('AWS::CloudTrail::Trail');
        expect(stack).not.toHaveResource('AWS::Logs::LogGroup');
        expect(stack).not.toHaveResource('AWS::IAM::Role');

        const trail: any = SynthUtils.synthesize(stack).template.Resources.MyAmazingCloudTrail54516E8D;
        expect(trail.Properties.EventSelectors.length).toEqual(1);
        const selector = trail.Properties.EventSelectors[0];
        expect(selector.ReadWriteType).toBeUndefined();
        expect(selector.IncludeManagementEvents).toBeUndefined();
        expect(selector.DataResources.length).toEqual(1);
        const dataResource = selector.DataResources[0];
        expect(dataResource.Type).toEqual('AWS::Lambda::Function');
        expect(dataResource.Values.length).toEqual(1);
        expect(dataResource.Values[0]).toEqual('arn:aws:lambda');
        expect(trail.DependsOn).toEqual(['MyAmazingCloudTrailS3Policy39C120B0']);
      });
    });
  });
});