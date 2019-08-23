import { expect, haveResource, not, SynthUtils } from '@aws-cdk/assert';
import iam = require('@aws-cdk/aws-iam');
import { RetentionDays } from '@aws-cdk/aws-logs';
import s3 = require('@aws-cdk/aws-s3');
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { ReadWriteType, Trail } from '../lib';

const ExpectedBucketPolicyProperties = {
  PolicyDocument: {
    Statement: [
      {
        Action: "s3:GetBucketAcl",
        Effect: "Allow",
        Principal: {
          Service: "cloudtrail.amazonaws.com"
        },
        Resource: {
          "Fn::GetAtt": [
            "MyAmazingCloudTrailS3A580FE27",
            "Arn"
          ]
        }
      },
      {
        Action: "s3:PutObject",
        Condition: {
          StringEquals: {
            "s3:x-amz-acl": "bucket-owner-full-control"
          }
        },
        Effect: "Allow",
        Principal: {
          Service: "cloudtrail.amazonaws.com"
        },
        Resource: {
          "Fn::Join": [
            "",
            [
              {
                "Fn::GetAtt": [
                  "MyAmazingCloudTrailS3A580FE27",
                  "Arn"
                ]
              },
              "/AWSLogs/123456789012/*",
            ]
          ]
        }
      }
    ],
    Version: "2012-10-17"
  }
};

const logsRolePolicyName = 'MyAmazingCloudTrailLogsRoleDefaultPolicy61DC49E7';
const logsRoleName = 'MyAmazingCloudTrailLogsRoleF2CCF977';

export = {
  'constructs the expected resources': {
    'with no properties'(test: Test) {
      const stack = getTestStack();
      new Trail(stack, 'MyAmazingCloudTrail');
      expect(stack).to(haveResource("AWS::CloudTrail::Trail"));
      expect(stack).to(haveResource("AWS::S3::Bucket"));
      expect(stack).to(haveResource("AWS::S3::BucketPolicy", ExpectedBucketPolicyProperties));
      expect(stack).to(not(haveResource("AWS::Logs::LogGroup")));
      const trail: any = SynthUtils.synthesize(stack).template.Resources.MyAmazingCloudTrail54516E8D;
      test.deepEqual(trail.DependsOn, ['MyAmazingCloudTrailS3Policy39C120B0']);
      test.done();
    },
    'with s3bucket'(test: Test) {
      const stack = getTestStack();
      const Trailbucket = new s3.Bucket(stack, 'S3');
      const cloudTrailPrincipal = new iam.ServicePrincipal("cloudtrail.amazonaws.com");
      Trailbucket.addToResourcePolicy(new iam.PolicyStatement({
        resources: [Trailbucket.bucketArn],
         actions: ['s3:GetBucketAcl'],
         principals: [cloudTrailPrincipal],
       }));

      Trailbucket.addToResourcePolicy(new iam.PolicyStatement({
        resources: [Trailbucket.arnForObjects(`AWSLogs/${Stack.of(stack).account}/*`)],
        actions: ["s3:PutObject"],
        principals: [cloudTrailPrincipal],
        conditions:  {
          StringEquals: {'s3:x-amz-acl': "bucket-owner-full-control"}
        }
      }));

      new Trail(stack, 'Trail', {bucket: Trailbucket});

      expect(stack).to(haveResource("AWS::CloudTrail::Trail"));
      expect(stack).to(haveResource("AWS::S3::Bucket"));
      expect(stack).to(haveResource("AWS::S3::BucketPolicy"));
      expect(stack).to(not(haveResource("AWS::Logs::LogGroup")));
      test.done();
    },
    'with cloud watch logs': {
      'enabled'(test: Test) {
        const stack = getTestStack();
        new Trail(stack, 'MyAmazingCloudTrail', {
          sendToCloudWatchLogs: true
        });

        expect(stack).to(haveResource("AWS::CloudTrail::Trail"));
        expect(stack).to(haveResource("AWS::S3::Bucket"));
        expect(stack).to(haveResource("AWS::S3::BucketPolicy", ExpectedBucketPolicyProperties));
        expect(stack).to(haveResource("AWS::Logs::LogGroup"));
        expect(stack).to(haveResource("AWS::IAM::Role"));
        expect(stack).to(haveResource("AWS::Logs::LogGroup", { RetentionInDays: 365 }));
        expect(stack).to(haveResource("AWS::IAM::Policy", {
          PolicyDocument: {
            Version: '2012-10-17',
            Statement: [{
              Effect: 'Allow',
              Action: ['logs:PutLogEvents', 'logs:CreateLogStream'],
              Resource: {
                'Fn::GetAtt': ['MyAmazingCloudTrailLogGroupAAD65144', 'Arn'],
              }
            }]
          },
          PolicyName: logsRolePolicyName,
          Roles: [{ Ref: 'MyAmazingCloudTrailLogsRoleF2CCF977' }],
        }));
        const trail: any = SynthUtils.synthesize(stack).template.Resources.MyAmazingCloudTrail54516E8D;
        test.deepEqual(trail.DependsOn, [logsRolePolicyName, logsRoleName, 'MyAmazingCloudTrailS3Policy39C120B0']);
        test.done();
      },
      'enabled and custom retention'(test: Test) {
        const stack = getTestStack();
        new Trail(stack, 'MyAmazingCloudTrail', {
          sendToCloudWatchLogs: true,
          cloudWatchLogsRetention: RetentionDays.ONE_WEEK
        });

        expect(stack).to(haveResource("AWS::CloudTrail::Trail"));
        expect(stack).to(haveResource("AWS::S3::Bucket"));
        expect(stack).to(haveResource("AWS::S3::BucketPolicy", ExpectedBucketPolicyProperties));
        expect(stack).to(haveResource("AWS::Logs::LogGroup"));
        expect(stack).to(haveResource("AWS::IAM::Role"));
        expect(stack).to(haveResource("AWS::Logs::LogGroup", {
          RetentionInDays: 7
        }));
        const trail: any = SynthUtils.synthesize(stack).template.Resources.MyAmazingCloudTrail54516E8D;
        test.deepEqual(trail.DependsOn, [logsRolePolicyName, logsRoleName, 'MyAmazingCloudTrailS3Policy39C120B0']);
        test.done();
      },
    },
    'with event selectors': {
      'with default props'(test: Test) {
        const stack = getTestStack();

        const cloudTrail = new Trail(stack, 'MyAmazingCloudTrail');
        cloudTrail.addS3EventSelector(["arn:aws:s3:::"]);

        expect(stack).to(haveResource("AWS::CloudTrail::Trail"));
        expect(stack).to(haveResource("AWS::S3::Bucket"));
        expect(stack).to(haveResource("AWS::S3::BucketPolicy", ExpectedBucketPolicyProperties));
        expect(stack).to(not(haveResource("AWS::Logs::LogGroup")));
        expect(stack).to(not(haveResource("AWS::IAM::Role")));

        const trail: any = SynthUtils.synthesize(stack).template.Resources.MyAmazingCloudTrail54516E8D;
        test.equals(trail.Properties.EventSelectors.length, 1);
        const selector = trail.Properties.EventSelectors[0];
        test.equals(selector.ReadWriteType, null, "Expected selector read write type to be undefined");
        test.equals(selector.IncludeManagementEvents, null, "Expected management events to be undefined");
        test.equals(selector.DataResources.length, 1, "Expected there to be one data resource");
        const dataResource = selector.DataResources[0];
        test.equals(dataResource.Type, "AWS::S3::Object", "Expected the data resrouce type to be AWS::S3::Object");
        test.equals(dataResource.Values.length, 1, "Expected there to be one value");
        test.equals(dataResource.Values[0], "arn:aws:s3:::", "Expected the first type value to be the S3 type");
        test.deepEqual(trail.DependsOn, ['MyAmazingCloudTrailS3Policy39C120B0']);
        test.done();
      },

      'with hand-specified props'(test: Test) {
        const stack = getTestStack();

        const cloudTrail = new Trail(stack, 'MyAmazingCloudTrail');
        cloudTrail.addS3EventSelector(["arn:aws:s3:::"], { includeManagementEvents: false, readWriteType: ReadWriteType.READ_ONLY });

        expect(stack).to(haveResource("AWS::CloudTrail::Trail"));
        expect(stack).to(haveResource("AWS::S3::Bucket"));
        expect(stack).to(haveResource("AWS::S3::BucketPolicy", ExpectedBucketPolicyProperties));
        expect(stack).to(not(haveResource("AWS::Logs::LogGroup")));
        expect(stack).to(not(haveResource("AWS::IAM::Role")));

        const trail: any = SynthUtils.synthesize(stack).template.Resources.MyAmazingCloudTrail54516E8D;
        test.equals(trail.Properties.EventSelectors.length, 1);
        const selector = trail.Properties.EventSelectors[0];
        test.equals(selector.ReadWriteType, "ReadOnly", "Expected selector read write type to be Read");
        test.equals(selector.IncludeManagementEvents, false, "Expected management events to be false");
        test.equals(selector.DataResources.length, 1, "Expected there to be one data resource");
        const dataResource = selector.DataResources[0];
        test.equals(dataResource.Type, "AWS::S3::Object", "Expected the data resrouce type to be AWS::S3::Object");
        test.equals(dataResource.Values.length, 1, "Expected there to be one value");
        test.equals(dataResource.Values[0], "arn:aws:s3:::", "Expected the first type value to be the S3 type");
        test.deepEqual(trail.DependsOn, ['MyAmazingCloudTrailS3Policy39C120B0']);
        test.done();
      },

      'with management event'(test: Test) {
        const stack = getTestStack();

        new Trail(stack, 'MyAmazingCloudTrail', { managementEvents: ReadWriteType.WRITE_ONLY });

        const trail: any = SynthUtils.synthesize(stack).template.Resources.MyAmazingCloudTrail54516E8D;
        test.equals(trail.Properties.EventSelectors.length, 1);
        const selector = trail.Properties.EventSelectors[0];
        test.equals(selector.ReadWriteType, "WriteOnly", "Expected selector read write type to be All");
        test.equals(selector.IncludeManagementEvents, true, "Expected management events to be false");
        test.equals(selector.DataResources, undefined, "Expected there to be no data resources");
        test.done();
      },
    }
  },

  'add an event rule'(test: Test) {
    // GIVEN
    const stack = getTestStack();
    const trail = new Trail(stack, 'MyAmazingCloudTrail', { managementEvents: ReadWriteType.WRITE_ONLY });

    // WHEN
    trail.onCloudTrailEvent('DoEvents', {
      target: {
        bind: () => ({
          id: '',
          arn: 'arn',
        })
      }
    });

    // THEN
    expect(stack).to(haveResource('AWS::Events::Rule', {
      EventPattern: {
        "detail-type": [
          "AWS API Call via CloudTrail"
        ]
      },
      State: "ENABLED",
      Targets: [
        {
          Arn: "arn",
          Id: "Target0"
        }
      ]
    }));

    test.done();
  },
};

function getTestStack(): Stack {
  return new Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'us-east-1' } });
}
