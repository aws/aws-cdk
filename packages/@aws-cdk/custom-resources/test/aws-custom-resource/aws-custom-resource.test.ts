import { Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as logs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId, PhysicalResourceIdReference } from '../../lib';

/* eslint-disable quote-props */

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
    policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('Custom::LogRetentionPolicy', {
    'Create': JSON.stringify({
      'service': 'CloudWatchLogs',
      'action': 'putRetentionPolicy',
      'parameters': {
        'logGroupName': '/aws/lambda/loggroup',
        'retentionInDays': 90,
      },
      'physicalResourceId': {
        'id': 'loggroup',
      },
    }),
    'Delete': JSON.stringify({
      'service': 'CloudWatchLogs',
      'action': 'deleteRetentionPolicy',
      'parameters': {
        'logGroupName': '/aws/lambda/loggroup',
      },
    }),
    'InstallLatestAwsSdk': true,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
    policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('Custom::S3PutObject', {
    'Create': JSON.stringify({
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
    }),
    'Update': JSON.stringify({
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
    }),
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
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
    policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
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
    policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
  })).toThrow(/`physicalResourceId`/);
});

test('booleans are encoded in the stringified parameters object', () => {
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
    policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('Custom::ServiceAction', {
    'Create': JSON.stringify({
      'service': 'service',
      'action': 'action',
      'parameters': {
        'trueBoolean': true,
        'trueString': 'true',
        'falseBoolean': false,
        'falseString': 'false',
      },
      'physicalResourceId': {
        'id': 'id',
      },
    }),
  });
});

test('fails PhysicalResourceIdReference is passed to onCreate parameters', () => {
  const stack = new cdk.Stack();
  expect(() => new AwsCustomResource(stack, 'AwsSdk', {
    resourceType: 'Custom::ServiceAction',
    onCreate: {
      service: 'service',
      action: 'action',
      parameters: {
        physicalResourceIdReference: new PhysicalResourceIdReference(),
      },
      physicalResourceId: PhysicalResourceId.of('id'),
    },
    policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
  })).toThrow('`PhysicalResourceIdReference` must not be specified in `onCreate` parameters.');
});

test('encodes physical resource id reference', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  new AwsCustomResource(stack, 'AwsSdk', {
    resourceType: 'Custom::ServiceAction',
    onUpdate: {
      service: 'service',
      action: 'action',
      parameters: {
        trueBoolean: true,
        trueString: 'true',
        falseBoolean: false,
        falseString: 'false',
        physicalResourceIdReference: new PhysicalResourceIdReference(),
      },
      physicalResourceId: PhysicalResourceId.of('id'),
    },
    policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('Custom::ServiceAction', {
    'Create': JSON.stringify({
      'service': 'service',
      'action': 'action',
      'parameters': {
        'trueBoolean': true,
        'trueString': 'true',
        'falseBoolean': false,
        'falseString': 'false',
        'physicalResourceIdReference': 'PHYSICAL:RESOURCEID:',
      },
      'physicalResourceId': {
        'id': 'id',
      },
    }),
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
    policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
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
    policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
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
    policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
  });

  // WHEN
  role.grantPassRole(customResource.grantPrincipal);

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
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
    policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
    Role: 'arn:aws:iam::123456789012:role/CoolRole',
  });

  Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 0);
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
    policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
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
    policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
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
    policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
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
    policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
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
    policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
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
    policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
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
    policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
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
    policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('Custom::AWS', {
    Create: {
      'Fn::Join': [
        '',
        [
          '{"service":"service","action":"action","parameters":{"a":"',
          {
            'Fn::GetAtt': [
              'AwsSdk155B91071',
              'Data',
            ],
          },
          '"},"physicalResourceId":{"id":"id"}}',
        ],
      ],
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
  Template.fromStack(stack).hasResourceProperties('Custom::LogRetention', {
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

test('disable AWS SDK installation', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  new AwsCustomResource(stack, 'AwsSdk', {
    installLatestAwsSdk: false,
    onCreate: {
      service: 'service',
      action: 'action',
      physicalResourceId: PhysicalResourceId.of('id'),
    },
    policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('Custom::AWS', {
    'InstallLatestAwsSdk': false,
  });
});

test('can specify function name', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  new AwsCustomResource(stack, 'AwsSdk', {
    onCreate: {
      service: 'service',
      action: 'action',
      physicalResourceId: PhysicalResourceId.of('id'),
    },
    policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
    functionName: 'my-cool-function',
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
    FunctionName: 'my-cool-function',
  });
});

test('separate policies per custom resource', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  new AwsCustomResource(stack, 'Custom1', {
    onCreate: {
      service: 'service1',
      action: 'action1',
      physicalResourceId: PhysicalResourceId.of('id1'),
    },
    policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
  });
  new AwsCustomResource(stack, 'Custom2', {
    onCreate: {
      service: 'service2',
      action: 'action2',
      physicalResourceId: PhysicalResourceId.of('id2'),
    },
    policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'service1:Action1',
          Effect: 'Allow',
          Resource: '*',
        },
      ],
      Version: '2012-10-17',
    },
  });
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'service2:Action2',
          Effect: 'Allow',
          Resource: '*',
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('tokens can be used as dictionary keys', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const dummy = new cdk.CfnResource(stack, 'MyResource', {
    type: 'AWS::My::Resource',
  });

  // WHEN
  new AwsCustomResource(stack, 'Custom1', {
    onCreate: {
      service: 'service1',
      action: 'action1',
      physicalResourceId: PhysicalResourceId.of('id1'),
      parameters: {
        [dummy.ref]: {
          Foo: 1234,
          Bar: dummy.getAtt('Foorz'),
        },
      },
    },
    policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('Custom::AWS', {
    Create: {
      'Fn::Join': [
        '',
        [
          '{"service":"service1","action":"action1","physicalResourceId":{"id":"id1"},"parameters":{"',
          {
            'Ref': 'MyResource',
          },
          '":{"Foo":1234,"Bar":"',
          {
            'Fn::GetAtt': [
              'MyResource',
              'Foorz',
            ],
          },
          '"}}}',
        ],
      ],
    },
  });
});

test('assumedRoleArn adds statement for sts:assumeRole', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  new AwsCustomResource(stack, 'AwsSdk', {
    onCreate: {
      assumedRoleArn: 'roleArn',
      service: 'service',
      action: 'action',
      physicalResourceId: PhysicalResourceId.of('id'),
    },
    policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
  });

  // THEN

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Resource: 'roleArn',
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('fails when at least one of policy or role is not specified', () => {
  const stack = new cdk.Stack();
  expect(() => new AwsCustomResource(stack, 'AwsSdk', {
    onUpdate: {
      service: 'service',
      action: 'action',
      physicalResourceId: PhysicalResourceId.of('id'),
      parameters: {
        param: 'param',
      },
    },
  })).toThrow(/`policy`.+`role`/);
});

test('can provide no policy if using existing role', () => {
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
  });
  // THEN
  Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 0);
  Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 0);
});

test('can specify VPC', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'TestVpc');

  // WHEN
  new AwsCustomResource(stack, 'AwsSdk', {
    onCreate: {
      service: 'service',
      action: 'action',
      physicalResourceId: PhysicalResourceId.of('id'),
    },
    policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
    vpc,
    vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
    VpcConfig: {
      SubnetIds: stack.resolve(vpc.privateSubnets.map(subnet => subnet.subnetId)),
    },
  });
});

test('specifying public subnets results in a synthesis error', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'TestVpc');

  // THEN
  expect(() => {
    new AwsCustomResource(stack, 'AwsSdk', {
      onCreate: {
        service: 'service',
        action: 'action',
        physicalResourceId: PhysicalResourceId.of('id'),
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
    });
  }).toThrow(/Lambda Functions in a public subnet/);
});

test('not specifying vpcSubnets when only public subnets exist on a VPC results in an error', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'TestPublicOnlyVpc', {
    subnetConfiguration: [{ name: 'public', subnetType: ec2.SubnetType.PUBLIC }],
  });

  // THEN
  expect(() => {
    new AwsCustomResource(stack, 'AwsSdk', {
      onCreate: {
        service: 'service',
        action: 'action',
        physicalResourceId: PhysicalResourceId.of('id'),
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
      vpc,
    });
  }).toThrow(/Lambda Functions in a public subnet/);
});

test('vpcSubnets filter is not required when only isolated subnets exist', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'TestPrivateOnlyVpc', {
    subnetConfiguration: [
      { name: 'test1private', subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      { name: 'test2private', subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
    ],
  });

  // WHEN
  new AwsCustomResource(stack, 'AwsSdk', {
    onCreate: {
      service: 'service',
      action: 'action',
      physicalResourceId: PhysicalResourceId.of('id'),
    },
    policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
    vpc,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
    VpcConfig: {
      SubnetIds: stack.resolve(vpc.isolatedSubnets.map(subnet => subnet.subnetId)),
    },
  });
});

test('vpcSubnets filter is not required for the default VPC configuration', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'TestVpc');

  // WHEN
  new AwsCustomResource(stack, 'AwsSdk', {
    onCreate: {
      service: 'service',
      action: 'action',
      physicalResourceId: PhysicalResourceId.of('id'),
    },
    policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
    vpc,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
    VpcConfig: {
      SubnetIds: stack.resolve(vpc.privateSubnets.map(subnet => subnet.subnetId)),
    },
  });
});

test('vpcSubnets without vpc results in an error', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  expect(() => new AwsCustomResource(stack, 'AwsSdk', {
    onCreate: {
      service: 'service',
      action: 'action',
      physicalResourceId: PhysicalResourceId.of('id'),
    },
    policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
    vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
  })).toThrow('Cannot configure \'vpcSubnets\' without configuring a VPC');
});
