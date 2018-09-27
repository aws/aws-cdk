import { expect, haveResource, not } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { CloudTrail, LogRetention, ReadWriteType } from '../lib';

export = {
  'constructs the expected resources': {
    'with no properties'(test: Test) {
      const stack = getTestStack();
      new CloudTrail(stack, 'MyAmazingCloudTrail');

      expect(stack).to(haveResource("AWS::CloudTrail::Trail"));
      expect(stack).to(haveResource("AWS::S3::Bucket"));
      expect(stack).to(haveResource("AWS::S3::BucketPolicy"));
      expect(stack).to(not(haveResource("AWS::Logs::LogGroup")));
      test.done();
    },
    'with cloud watch logs': {
      'enabled'(test: Test) {
        const stack = getTestStack();
        new CloudTrail(stack, 'MyAmazingCloudTrail', {
          sendToCloudWatchLogs: true
        });

        expect(stack).to(haveResource("AWS::CloudTrail::Trail"));
        expect(stack).to(haveResource("AWS::S3::Bucket"));
        expect(stack).to(haveResource("AWS::S3::BucketPolicy"));
        expect(stack).to(haveResource("AWS::Logs::LogGroup"));
        expect(stack).to(haveResource("AWS::IAM::Role"));
        expect(stack).to(haveResource("AWS::Logs::LogGroup", {
          RetentionInDays: 365
        }));

        test.done();
      },
      'enabled and custom retention'(test: Test) {
        const stack = getTestStack();
        new CloudTrail(stack, 'MyAmazingCloudTrail', {
          sendToCloudWatchLogs: true,
          cloudWatchLogsRetentionTimeDays: LogRetention.OneWeek
        });

        expect(stack).to(haveResource("AWS::CloudTrail::Trail"));
        expect(stack).to(haveResource("AWS::S3::Bucket"));
        expect(stack).to(haveResource("AWS::S3::BucketPolicy"));
        expect(stack).to(haveResource("AWS::Logs::LogGroup"));
        expect(stack).to(haveResource("AWS::IAM::Role"));
        expect(stack).to(haveResource("AWS::Logs::LogGroup", {
          RetentionInDays: 7
        }));
        test.done();
      },
    },
    'with event selectors': {
      'with default props'(test: Test) {
        const stack = getTestStack();

        const cloudTrail = new CloudTrail(stack, 'MyAmazingCloudTrail');
        cloudTrail.addS3EventSelector(["arn:aws:s3:::"], ReadWriteType.All);

        expect(stack).to(haveResource("AWS::CloudTrail::Trail"));
        expect(stack).to(haveResource("AWS::S3::Bucket"));
        expect(stack).to(haveResource("AWS::S3::BucketPolicy"));
        expect(stack).to(not(haveResource("AWS::Logs::LogGroup")));
        expect(stack).to(not(haveResource("AWS::IAM::Role")));

        const trail: any = stack.toCloudFormation().Resources.MyAmazingCloudTrail54516E8D;
        test.equals(trail.Properties.EventSelectors.length, 1);
        const selector = trail.Properties.EventSelectors[0];
        test.equals(selector.ReadWriteType, "All", "Expected selector read write type to be All");
        test.equals(selector.IncludeManagementEvents, false, "Expected management events to be false");
        test.equals(selector.DataResources.length, 1, "Expected there to be one data resource");
        const dataResource = selector.DataResources[0];
        test.equals(dataResource.Type, "AWS::S3::Object", "Expected the data resrouce type to be AWS::S3::Object");
        test.equals(dataResource.Values.length, 1, "Expected there to be one value");
        test.equals(dataResource.Values[0], "arn:aws:s3:::", "Expected the first type value to be the S3 type");
        test.done();
      },

      'with management event'(test: Test) {
        const stack = getTestStack();

        new CloudTrail(stack, 'MyAmazingCloudTrail', {managementEvents: ReadWriteType.WriteOnly});

        const trail: any = stack.toCloudFormation().Resources.MyAmazingCloudTrail54516E8D;
        test.equals(trail.Properties.EventSelectors.length, 1);
        const selector = trail.Properties.EventSelectors[0];
        test.equals(selector.ReadWriteType, "WriteOnly", "Expected selector read write type to be All");
        test.equals(selector.IncludeManagementEvents, true, "Expected management events to be false");
        test.equals(selector.DataResources, undefined, "Expected there to be no data resources");
        test.done();
      },
    }
  }
};

function getTestStack(): Stack {
  return new Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'us-east-1' } });
}
