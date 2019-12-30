import '@aws-cdk/assert/jest';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { AwsCustomResource } from '../../lib';

// tslint:disable:object-literal-key-quotes

test('aws sdk js custom resource with onCreate and onDelete', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new AwsCustomResource(stack, 'AwsSdk', {
      resourceType: 'Custom::LogRetentionPolicy',
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
    expect(stack).toHaveResource('Custom::LogRetentionPolicy', {
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
    });

    expect(stack).toHaveResource('AWS::IAM::Policy', {
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
  });
});

test('onCreate defaults to onUpdate', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  new AwsCustomResource(stack, 'AwsSdk', {
    resourceType: 'Custom::S3PutObject',
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
  expect(stack).toHaveResource('Custom::S3PutObject', {
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
  });
});

test('with custom policyStatements', () => {
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
  expect(stack).toHaveResource('AWS::IAM::Policy', {
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
  });
});

test('fails when no calls are specified', () => {
  const stack = new cdk.Stack();
  expect(() => new AwsCustomResource(stack, 'AwsSdk', {})).toThrow(/`onCreate`.+`onUpdate`.+`onDelete`/);
});

test('fails when no physical resource method is specified', () => {
  const stack = new cdk.Stack();

  expect(() => new AwsCustomResource(stack, 'AwsSdk', {
    onUpdate: {
      service: 'CloudWatchLogs',
      action: 'putRetentionPolicy',
      parameters: {
        logGroupName: '/aws/lambda/loggroup',
        retentionInDays: 90
      }
    }
  })).toThrow(/`physicalResourceId`.+`physicalResourceIdPath`/);
});

test('encodes booleans', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  new AwsCustomResource(stack, 'AwsSdk', {
    resourceType: 'Custom::ServiceAction',
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
  expect(stack).toHaveResource('Custom::ServiceAction', {
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
  });
});

test('timeout defaults to 30 seconds', () => {
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
  expect(stack).toHaveResource('AWS::Lambda::Function', {
    Timeout: 60
  });
});

test('can specify timeout', () => {
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
  expect(stack).toHaveResource('AWS::Lambda::Function', {
    Timeout: 900
  });
});

test('implements IGrantable', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const role = new iam.Role(stack, 'Role', {
    assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com')
  });
  const customResource = new AwsCustomResource(stack, 'AwsSdk', {
    onCreate: {
      service: 'service',
      action: 'action',
      physicalResourceId: 'id'
    }
  });

  // WHEN
  role.grantPassRole(customResource.grantPrincipal);

  expect(stack).toHaveResource('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'service:Action',
          Effect: 'Allow',
          Resource: '*'
        },
        {
          Action: 'iam:PassRole',
          Effect: 'Allow',
          Resource: {
            'Fn::GetAtt': [
              'Role1ABCC5F0',
              'Arn'
            ]
          }
        }
      ],
      Version: '2012-10-17'
    }
  });
});

test('can use existing role', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const role = iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::123456789012:role/CoolRole');

  // WHEN
  new AwsCustomResource(stack, 'AwsSdk', {
    onCreate: {
      service: 'service',
      action: 'action',
      physicalResourceId: 'id'
    },
    role
  });

  // THEN
  expect(stack).toHaveResource('AWS::Lambda::Function', {
    Role: 'arn:aws:iam::123456789012:role/CoolRole'
  });

  expect(stack).not.toHaveResource('AWS::IAM::Role');
});

test('getData', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const awsSdk = new AwsCustomResource(stack, 'AwsSdk', {
    onCreate: {
      service: 'service',
      action: 'action',
      physicalResourceId: 'id'
    }
  });

  // WHEN
  const token = awsSdk.getData('Data');

  // THEN
  expect(stack.resolve(token)).toEqual({
    'Fn::GetAtt': [
      'AwsSdkE966FE43',
      'Data'
    ]
  });
});

test('getDataString', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const awsSdk = new AwsCustomResource(stack, 'AwsSdk1', {
    onCreate: {
      service: 'service',
      action: 'action',
      physicalResourceId: 'id'
    }
  });

  // WHEN
  new AwsCustomResource(stack, 'AwsSdk2', {
    onCreate: {
      service: 'service',
      action: 'action',
      parameters: {
        a: awsSdk.getDataString('Data')
      },
      physicalResourceId: 'id'
    }
  });

  // THEN
  expect(stack).toHaveResource('Custom::AWS', {
    Create: {
      service: 'service',
      action: 'action',
      parameters: {
        a: {
          'Fn::GetAtt': [
            'AwsSdk155B91071',
            'Data'
          ]
        }
      },
      physicalResourceId: 'id'
    }
  });
});
