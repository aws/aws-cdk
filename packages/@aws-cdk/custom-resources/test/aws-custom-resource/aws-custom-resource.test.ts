import '@aws-cdk/assert/jest';
import * as iam from '@aws-cdk/aws-iam';
import * as logs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from '../../lib';

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
        retentionInDays: 90,
      },
      physicalResourceId: PhysicalResourceId.of('loggroup'),
    },
    onDelete: {
      service: 'CloudWatchLogs',
      action: 'deleteRetentionPolicy',
      parameters: {
        logGroupName: '/aws/lambda/loggroup',
      },
    },
    policy: AwsCustomResourcePolicy.fromSdkCalls({resources: AwsCustomResourcePolicy.ANY_RESOURCE}),
  });

  // THEN
  expect(stack).toHaveResource('Custom::LogRetentionPolicy', {
    'Create': {
      'service': 'CloudWatchLogs',
      'action': 'putRetentionPolicy',
      'parameters': {
        'logGroupName': '/aws/lambda/loggroup',
        'retentionInDays': 90,
      },
      'physicalResourceId': {
        'id': 'loggroup',
      },
    },
    'Delete': {
      'service': 'CloudWatchLogs',
      'action': 'deleteRetentionPolicy',
      'parameters': {
        'logGroupName': '/aws/lambda/loggroup',
      },
    },
  });

  expect(stack).toHaveResource('AWS::IAM::Policy', {
    'PolicyDocument': {
      'Statement': [
        {
          'Action': 'logs:PutRetentionPolicy',
          'Effect': 'Allow',
          'Resource': '*',
        },
        {
          'Action': 'logs:DeleteRetentionPolicy',
          'Effect': 'Allow',
          'Resource': '*',
        },
      ],
      'Version': '2012-10-17',
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
        Body: 'my-body',
      },
      physicalResourceId: PhysicalResourceId.fromResponse('ETag'),
    },
    policy: AwsCustomResourcePolicy.fromSdkCalls({resources: AwsCustomResourcePolicy.ANY_RESOURCE}),
  });

  // THEN
  expect(stack).toHaveResource('Custom::S3PutObject', {
    'Create': {
      'service': 's3',
      'action': 'putObject',
      'parameters': {
        'Bucket': 'my-bucket',
        'Key': 'my-key',
        'Body': 'my-body',
      },
      'physicalResourceId': {
        'responsePath': 'ETag',
      },
    },
    'Update': {
      'service': 's3',
      'action': 'putObject',
      'parameters': {
        'Bucket': 'my-bucket',
        'Key': 'my-key',
        'Body': 'my-body',
      },
      'physicalResourceId': {
        'responsePath': 'ETag',
      },
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
        Body: 'my-body',
      },
      physicalResourceId: PhysicalResourceId.fromResponse('ETag'),
    },
    policy: AwsCustomResourcePolicy.fromStatements([
      new iam.PolicyStatement({
        actions: ['s3:PutObject'],
        resources: ['arn:aws:s3:::my-bucket/my-key'],
      }),
    ]),
  });

  // THEN
  expect(stack).toHaveResource('AWS::IAM::Policy', {
    'PolicyDocument': {
      'Statement': [
        {
          'Action': 's3:PutObject',
          'Effect': 'Allow',
          'Resource': 'arn:aws:s3:::my-bucket/my-key',
        },
      ],
      'Version': '2012-10-17',
    },
  });
});

test('fails when no calls are specified', () => {
  const stack = new cdk.Stack();
  expect(() => new AwsCustomResource(stack, 'AwsSdk', {
    policy: AwsCustomResourcePolicy.fromSdkCalls({resources: AwsCustomResourcePolicy.ANY_RESOURCE}),
  })).toThrow(/`onCreate`.+`onUpdate`.+`onDelete`/);
});

test('fails when no physical resource method is specified', () => {
  const stack = new cdk.Stack();

  expect(() => new AwsCustomResource(stack, 'AwsSdk', {
    onUpdate: {
      service: 'CloudWatchLogs',
      action: 'putRetentionPolicy',
      parameters: {
        logGroupName: '/aws/lambda/loggroup',
        retentionInDays: 90,
      },
    },
    policy: AwsCustomResourcePolicy.fromSdkCalls({resources: AwsCustomResourcePolicy.ANY_RESOURCE}),
  })).toThrow(/`physicalResourceId`/);
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
        falseString: 'false',
      },
      physicalResourceId: PhysicalResourceId.of('id'),
    },
    policy: AwsCustomResourcePolicy.fromSdkCalls({resources: AwsCustomResourcePolicy.ANY_RESOURCE}),
  });

  // THEN
  expect(stack).toHaveResource('Custom::ServiceAction', {
    'Create': {
      'service': 'service',
      'action': 'action',
      'parameters': {
        'trueBoolean': 'TRUE:BOOLEAN',
        'trueString': 'true',
        'falseBoolean': 'FALSE:BOOLEAN',
        'falseString': 'false',
      },
      'physicalResourceId': {
        'id': 'id',
      },
    },
  });
});

test('timeout defaults to 2 minutes', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  new AwsCustomResource(stack, 'AwsSdk', {
    onCreate: {
      service: 'service',
      action: 'action',
      physicalResourceId: PhysicalResourceId.of('id'),
    },
    policy: AwsCustomResourcePolicy.fromSdkCalls({resources: AwsCustomResourcePolicy.ANY_RESOURCE}),
  });

  // THEN
  expect(stack).toHaveResource('AWS::Lambda::Function', {
    Timeout: 120,
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
      physicalResourceId: PhysicalResourceId.of('id'),
    },
    timeout: cdk.Duration.minutes(15),
    policy: AwsCustomResourcePolicy.fromSdkCalls({resources: AwsCustomResourcePolicy.ANY_RESOURCE}),
  });

  // THEN
  expect(stack).toHaveResource('AWS::Lambda::Function', {
    Timeout: 900,
  });
});

test('implements IGrantable', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const role = new iam.Role(stack, 'Role', {
    assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
  });
  const customResource = new AwsCustomResource(stack, 'AwsSdk', {
    onCreate: {
      service: 'service',
      action: 'action',
      physicalResourceId: PhysicalResourceId.of('id'),
    },
    policy: AwsCustomResourcePolicy.fromSdkCalls({resources: AwsCustomResourcePolicy.ANY_RESOURCE}),
  });

  // WHEN
  role.grantPassRole(customResource.grantPrincipal);

  expect(stack).toHaveResource('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'service:Action',
          Effect: 'Allow',
          Resource: '*',
        },
        {
          Action: 'iam:PassRole',
          Effect: 'Allow',
          Resource: {
            'Fn::GetAtt': [
              'Role1ABCC5F0',
              'Arn',
            ],
          },
        },
      ],
      Version: '2012-10-17',
    },
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
      physicalResourceId: PhysicalResourceId.of('id'),
    },
    role,
    policy: AwsCustomResourcePolicy.fromSdkCalls({resources: AwsCustomResourcePolicy.ANY_RESOURCE}),
  });

  // THEN
  expect(stack).toHaveResource('AWS::Lambda::Function', {
    Role: 'arn:aws:iam::123456789012:role/CoolRole',
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
      physicalResourceId: PhysicalResourceId.of('id'),
    },
    policy: AwsCustomResourcePolicy.fromSdkCalls({resources: AwsCustomResourcePolicy.ANY_RESOURCE}),
  });

  // WHEN
  const token = awsSdk.getResponseFieldReference('Data');

  // THEN
  expect(stack.resolve(token)).toEqual({
    'Fn::GetAtt': [
      'AwsSdkE966FE43',
      'Data',
    ],
  });
});

test('fails when getData is used with `ignoreErrorCodesMatching`', () => {

  const stack = new cdk.Stack();

  const resource = new AwsCustomResource(stack, 'AwsSdk', {
    onUpdate: {
      service: 'CloudWatchLogs',
      action: 'putRetentionPolicy',
      parameters: {
        logGroupName: '/aws/lambda/loggroup',
        retentionInDays: 90,
      },
      ignoreErrorCodesMatching: '.*',
      physicalResourceId: PhysicalResourceId.of('Id'),
    },
    policy: AwsCustomResourcePolicy.fromSdkCalls({resources: AwsCustomResourcePolicy.ANY_RESOURCE}),
  });

  expect(() => resource.getResponseFieldReference('ShouldFail')).toThrow(/`getData`.+`ignoreErrorCodesMatching`/);

});

test('fails when getDataString is used with `ignoreErrorCodesMatching`', () => {

  const stack = new cdk.Stack();

  const resource = new AwsCustomResource(stack, 'AwsSdk', {
    onUpdate: {
      service: 'CloudWatchLogs',
      action: 'putRetentionPolicy',
      parameters: {
        logGroupName: '/aws/lambda/loggroup',
        retentionInDays: 90,
      },
      ignoreErrorCodesMatching: '.*',
      physicalResourceId: PhysicalResourceId.of('Id'),
    },
    policy: AwsCustomResourcePolicy.fromSdkCalls({resources: AwsCustomResourcePolicy.ANY_RESOURCE}),
  });

  expect(() => resource.getResponseField('ShouldFail')).toThrow(/`getDataString`.+`ignoreErrorCodesMatching`/);

});

test('fail when `PhysicalResourceId.fromResponse` is used with `ignoreErrorCodesMatching', () => {

  const stack = new cdk.Stack();
  expect(() => new AwsCustomResource(stack, 'AwsSdkOnUpdate', {
    onUpdate: {
      service: 'CloudWatchLogs',
      action: 'putRetentionPolicy',
      parameters: {
        logGroupName: '/aws/lambda/loggroup',
        retentionInDays: 90,
      },
      ignoreErrorCodesMatching: '.*',
      physicalResourceId: PhysicalResourceId.fromResponse('Response'),
    },
    policy: AwsCustomResourcePolicy.fromSdkCalls({resources: AwsCustomResourcePolicy.ANY_RESOURCE}),
  })).toThrow(/`PhysicalResourceId.fromResponse`.+`ignoreErrorCodesMatching`/);

  expect(() => new AwsCustomResource(stack, 'AwsSdkOnCreate', {
    onCreate: {
      service: 'CloudWatchLogs',
      action: 'putRetentionPolicy',
      parameters: {
        logGroupName: '/aws/lambda/loggroup',
        retentionInDays: 90,
      },
      ignoreErrorCodesMatching: '.*',
      physicalResourceId: PhysicalResourceId.fromResponse('Response'),
    },
    policy: AwsCustomResourcePolicy.fromSdkCalls({resources: AwsCustomResourcePolicy.ANY_RESOURCE}),
  })).toThrow(/`PhysicalResourceId.fromResponse`.+`ignoreErrorCodesMatching`/);

  expect(() => new AwsCustomResource(stack, 'AwsSdkOnDelete', {
    onDelete: {
      service: 'CloudWatchLogs',
      action: 'putRetentionPolicy',
      parameters: {
        logGroupName: '/aws/lambda/loggroup',
        retentionInDays: 90,
      },
      ignoreErrorCodesMatching: '.*',
      physicalResourceId: PhysicalResourceId.fromResponse('Response'),
    },
    policy: AwsCustomResourcePolicy.fromSdkCalls({resources: AwsCustomResourcePolicy.ANY_RESOURCE}),
  })).toThrow(/`PhysicalResourceId.fromResponse`.+`ignoreErrorCodesMatching`/);

});

test('getDataString', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const awsSdk = new AwsCustomResource(stack, 'AwsSdk1', {
    onCreate: {
      service: 'service',
      action: 'action',
      physicalResourceId: PhysicalResourceId.of('id'),
    },
    policy: AwsCustomResourcePolicy.fromSdkCalls({resources: AwsCustomResourcePolicy.ANY_RESOURCE}),
  });

  // WHEN
  new AwsCustomResource(stack, 'AwsSdk2', {
    onCreate: {
      service: 'service',
      action: 'action',
      parameters: {
        a: awsSdk.getResponseField('Data'),
      },
      physicalResourceId: PhysicalResourceId.of('id'),
    },
    policy: AwsCustomResourcePolicy.fromSdkCalls({resources: AwsCustomResourcePolicy.ANY_RESOURCE}),
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
            'Data',
          ],
        },
      },
      physicalResourceId: {
        'id': 'id',
      },
    },
  });
});

test('can specify log retention', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  new AwsCustomResource(stack, 'AwsSdk', {
    onCreate: {
      service: 'service',
      action: 'action',
      physicalResourceId: PhysicalResourceId.of('id'),
    },
    logRetention: logs.RetentionDays.ONE_WEEK,
    policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
  });

  // THEN
  expect(stack).toHaveResource('Custom::LogRetention', {
    LogGroupName: {
      'Fn::Join': [
        '',
        [
          '/aws/lambda/',
          {
            Ref: 'AWS679f53fac002430cb0da5b7982bd22872D164C4C',
          },
        ],
      ],
    },
    RetentionInDays: 7,
  });
});
