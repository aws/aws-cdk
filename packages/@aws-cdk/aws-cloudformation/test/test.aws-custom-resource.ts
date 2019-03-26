import { expect, haveResource } from '@aws-cdk/assert';
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import { AwsCustomResource } from '../lib';

// tslint:disable:object-literal-key-quotes

export = {
  'aws sdk js custom resource with onCreate and onDelete'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new AwsCustomResource(stack, 'AwsSdk', {
      physicalResourceId: 'id1234',
      onCreate: {
        service: 'CloudWatchLogs',
        action: 'putRetentionPolicy',
        parameters: {
          logGroupName: '/aws/lambda/loggroup',
          retentionInDays: 90
        }
      },
      onDelete: {
        service: 'CloudWatchLogs',
        action: 'deleteRetentionPolicy',
        parameters: {
          logGroupName: '/aws/lambda/loggroup',
        }
      }
    });

    // THEN
    expect(stack).to(haveResource('Custom::AWS', {
      "PhysicalResourceId": "id1234",
      "Create": {
        "service": "CloudWatchLogs",
        "action": "putRetentionPolicy",
        "parameters": {
          "logGroupName": "/aws/lambda/loggroup",
          "retentionInDays": 90
        }
      },
      "Delete": {
        "service": "CloudWatchLogs",
        "action": "deleteRetentionPolicy",
        "parameters": {
          "logGroupName": "/aws/lambda/loggroup"
        }
      }
    }));

    expect(stack).to(haveResource('AWS::IAM::Policy', {
      "PolicyDocument": {
        "Statement": [
          {
            "Action": "logs:PutRetentionPolicy",
            "Effect": "Allow",
            "Resource": "*"
          },
          {
            "Action": "logs:DeleteRetentionPolicy",
            "Effect": "Allow",
            "Resource": "*"
          }
        ],
        "Version": "2012-10-17"
      },
    }));

    test.done();
  },

  'onCreate defaults to onUpdate'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new AwsCustomResource(stack, 'AwsSdk', {
      physicalResourceId: 'id1234',
      onUpdate: {
        service: 's3',
        action: 'putObject',
        parameters: {
          Bucket: 'my-bucket',
          Key: 'my-key',
          Body: 'my-body'
        }
      },
    });

    // THEN
    expect(stack).to(haveResource('Custom::AWS', {
      "PhysicalResourceId": "id1234",
      "Create": {
        "service": "s3",
        "action": "putObject",
        "parameters": {
          "Bucket": "my-bucket",
          "Key": "my-key",
          "Body": "my-body"
        }
      },
      "Update": {
        "service": "s3",
        "action": "putObject",
        "parameters": {
          "Bucket": "my-bucket",
          "Key": "my-key",
          "Body": "my-body"
        }
      },
    }));

    test.done();
  },

  'with custom policyStatements'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new AwsCustomResource(stack, 'AwsSdk', {
      physicalResourceId: 'id1234',
      onUpdate: {
        service: 'S3',
        action: 'putObject',
        parameters: {
          Bucket: 'my-bucket',
          Key: 'my-key',
          Body: 'my-body'
        }
      },
      policyStatements: [
        new iam.PolicyStatement()
          .addAction('s3:PutObject')
          .addResource('arn:aws:s3:::my-bucket/my-key')
      ]
    });

    // THEN
    expect(stack).to(haveResource('AWS::IAM::Policy', {
      "PolicyDocument": {
        "Statement": [
          {
            "Action": "s3:PutObject",
            "Effect": "Allow",
            "Resource": "arn:aws:s3:::my-bucket/my-key"
          },
        ],
        "Version": "2012-10-17"
      },
    }));

    test.done();
  },

  'fails when no calls are specified'(test: Test) {
    const stack = new cdk.Stack();

    test.throws(() => {
      new AwsCustomResource(stack, 'AwsSdk', { physicalResourceId: 'id1234' });
    }, /`onCreate`.+`onUpdate`.+`onDelete`/);

    test.done();
  }
};
