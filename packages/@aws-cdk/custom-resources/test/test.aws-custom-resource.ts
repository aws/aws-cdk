import { expect, haveResource } from '@aws-cdk/assert';
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import { AwsCustomResource } from '../lib';

// tslint:disable:object-literal-key-quotes

export = {
  'aws sdk js custom resource with onCreate and onDelete'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new AwsCustomResource(stack, 'AwsSdk', {
      onCreate: {
        service: 'CloudWatchLogs',
        action: 'putRetentionPolicy',
        parameters: {
          logGroupName: '/aws/lambda/loggroup',
          retentionInDays: 90
        },
        physicalResourceId: 'loggroup'
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
      "Create": {
        "service": "CloudWatchLogs",
        "action": "putRetentionPolicy",
        "parameters": {
          "logGroupName": "/aws/lambda/loggroup",
          "retentionInDays": 90
        },
        "physicalResourceId": "loggroup"
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
      onUpdate: {
        service: 's3',
        action: 'putObject',
        parameters: {
          Bucket: 'my-bucket',
          Key: 'my-key',
          Body: 'my-body'
        },
        physicalResourceIdPath: 'ETag'
      },
    });

    // THEN
    expect(stack).to(haveResource('Custom::AWS', {
      "Create": {
        "service": "s3",
        "action": "putObject",
        "parameters": {
          "Bucket": "my-bucket",
          "Key": "my-key",
          "Body": "my-body"
        },
        "physicalResourceIdPath": "ETag"
      },
      "Update": {
        "service": "s3",
        "action": "putObject",
        "parameters": {
          "Bucket": "my-bucket",
          "Key": "my-key",
          "Body": "my-body"
        },
        "physicalResourceIdPath": "ETag"
      },
    }));

    test.done();
  },

  'with custom policyStatements'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new AwsCustomResource(stack, 'AwsSdk', {
      onUpdate: {
        service: 'S3',
        action: 'putObject',
        parameters: {
          Bucket: 'my-bucket',
          Key: 'my-key',
          Body: 'my-body'
        },
        physicalResourceIdPath: 'ETag'
      },
      policyStatements: [
        new iam.PolicyStatement({
          actions: ['s3:PutObject'],
          resources: ['arn:aws:s3:::my-bucket/my-key']
        })
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
      new AwsCustomResource(stack, 'AwsSdk', {});
    }, /`onCreate`.+`onUpdate`.+`onDelete`/);

    test.done();
  },

  'fails when no physical resource method is specified'(test: Test) {
    const stack = new cdk.Stack();

    test.throws(() => {
      new AwsCustomResource(stack, 'AwsSdk', {
        onUpdate: {
          service: 'CloudWatchLogs',
          action: 'putRetentionPolicy',
          parameters: {
            logGroupName: '/aws/lambda/loggroup',
            retentionInDays: 90
          }
        }
      });
    }, /`physicalResourceId`.+`physicalResourceIdPath`/);

    test.done();
  },

  'encodes booleans'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new AwsCustomResource(stack, 'AwsSdk', {
      onCreate: {
        service: 'service',
        action: 'action',
        parameters: {
          trueBoolean: true,
          trueString: 'true',
          falseBoolean: false,
          falseString: 'false'
        },
        physicalResourceId: 'id'
      },
    });

    // THEN
    expect(stack).to(haveResource('Custom::AWS', {
      "Create": {
        "service": "service",
        "action": "action",
        "parameters": {
          "trueBoolean": "TRUE:BOOLEAN",
          "trueString": "true",
          "falseBoolean": "FALSE:BOOLEAN",
          "falseString": "false"
        },
        "physicalResourceId": "id"
      },
    }));

    test.done();
  },

  'timeout defaults to 6 seconds'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new AwsCustomResource(stack, 'AwsSdk', {
      onCreate: {
        service: 'service',
        action: 'action',
        physicalResourceId: 'id'
      }
    });

    // THEN
    expect(stack).to(haveResource('AWS::Lambda::Function', {
      Timeout: 6
    }));

    test.done();
  },

  'can specify timeout'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new AwsCustomResource(stack, 'AwsSdk', {
      onCreate: {
        service: 'service',
        action: 'action',
        physicalResourceId: 'id'
      },
      timeout: cdk.Duration.minutes(15)
    });

    // THEN
    expect(stack).to(haveResource('AWS::Lambda::Function', {
      Timeout: 900
    }));

    test.done();
  }
};
