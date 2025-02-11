import { Match, Template, Annotations } from '../../assertions';
import * as iam from '../../aws-iam';
import * as cdk from '../../core';
import * as cxapi from '../../cx-api';
import * as s3 from '../lib';

describe('notification', () => {
  test('when notification is added a custom s3 bucket notification resource is provisioned', () => {
    const stack = new cdk.Stack();

    const bucket = new s3.Bucket(stack, 'MyBucket');

    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, {
      bind: () => ({
        arn: 'ARN',
        type: s3.BucketNotificationDestinationType.TOPIC,
      }),
    });

    Template.fromStack(stack).resourceCountIs('AWS::S3::Bucket', 1);
    Template.fromStack(stack).hasResourceProperties('Custom::S3BucketNotifications', {
      NotificationConfiguration: {
        TopicConfigurations: [
          {
            Events: [
              's3:ObjectCreated:*',
            ],
            TopicArn: 'ARN',
          },
        ],
      },
    });
  });

  test('can specify a custom role for the notifications handler of imported buckets', () => {
    const stack = new cdk.Stack();

    const importedRole = iam.Role.fromRoleArn(stack, 'role', 'arn:aws:iam::111111111111:role/DevsNotAllowedToTouch');

    const bucket = s3.Bucket.fromBucketAttributes(stack, 'MyBucket', {
      bucketName: 'foo-bar',
      notificationsHandlerRole: importedRole,
    });

    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, {
      bind: () => ({
        arn: 'ARN',
        type: s3.BucketNotificationDestinationType.TOPIC,
      }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Description: 'AWS CloudFormation handler for "Custom::S3BucketNotifications" resources (@aws-cdk/aws-s3)',
      Role: 'arn:aws:iam::111111111111:role/DevsNotAllowedToTouch',
    });
  });

  test('add service-role permission if no Roles are provided', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = s3.Bucket.fromBucketAttributes(stack, 'MyBucket', {
      bucketName: 'foo-bar',
    });

    // WHEN
    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, {
      bind: () => ({
        arn: 'ARN',
        type: s3.BucketNotificationDestinationType.TOPIC,
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [{
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: {
            Service: 'lambda.amazonaws.com',
          },
        }],
      },
      ManagedPolicyArns: [
        {
          'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole']],
        },
      ],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [{
          Action: 's3:PutBucketNotification',
          Effect: 'Allow',
          Resource: '*',
        }, {
          Action: 's3:GetBucketNotification',
          Effect: 'Allow',
          Resource: '*',
        }],
      },
    });
  });

  test('no warnings are shown if no Roles are provided, as CDK will be adding required roles & policies', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = s3.Bucket.fromBucketAttributes(stack, 'MyBucket', {
      bucketName: 'foo-bar',
    });

    // WHEN
    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, {
      bind: () => ({
        arn: 'ARN',
        type: s3.BucketNotificationDestinationType.TOPIC,
      }),
    });

    // THEN - Following is warning throwen as a part of fix in : https://github.com/aws/aws-cdk/pull/31212
    const warningFromStack = Annotations.fromStack(stack).findWarning('*', {});
    expect(warningFromStack[0]?.entry?.data).toEqual(undefined);
  });

  test('service-role permission are not added if `IRole` is provided', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const importedRole = iam.Role.fromRoleArn(stack, 'role', 'arn:aws:iam::111111111111:role/DevsNotAllowedToTouch');
    const bucket = s3.Bucket.fromBucketAttributes(stack, 'MyBucket', {
      bucketName: 'foo-bar',
      notificationsHandlerRole: importedRole,
    });

    // WHEN
    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, {
      bind: () => ({
        arn: 'ARN',
        type: s3.BucketNotificationDestinationType.TOPIC,
      }),
    });

    // THEN
    const serviceRole = Template.fromStack(stack).findResources('AWS::IAM::Role');
    expect(serviceRole).toEqual({});
  });

  test('warning is thrown when `IRole` is provided and not policies are added', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const importedRole = iam.Role.fromRoleArn(stack, 'role', 'arn:aws:iam::111111111111:role/DevsNotAllowedToTouch');
    const bucket = s3.Bucket.fromBucketAttributes(stack, 'MyBucket', {
      bucketName: 'foo-bar',
      notificationsHandlerRole: importedRole,
    });

    // WHEN
    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, {
      bind: () => ({
        arn: 'ARN',
        type: s3.BucketNotificationDestinationType.TOPIC,
      }),
    });

    // THEN - Following is warning throwen as a part of fix in : https://github.com/aws/aws-cdk/pull/31212
    const warningMessage = { 'Fn::Join': ['', ["Can't combine imported IManagedPolicy: arn:", { Ref: 'AWS::Partition' }, ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole to imported role IRole: DevsNotAllowedToTouch. Use ManagedPolicy directly. [ack: @aws-cdk/aws-iam:IRoleCantBeUsedWithIManagedPolicy]']] };
    const warningFromStack = Annotations.fromStack(stack).findWarning('*', {});
    expect(warningFromStack[0].entry.data).toEqual(warningMessage);
  });

  test('If `Role` is provided, PutBucketNotification, GetBucketNotification will be added along with `service-role/AWSLambdaBasicExecutionRole`', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const importedRole = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('someservice.amazonaws.com'),
    });
    const bucket = s3.Bucket.fromBucketAttributes(stack, 'MyBucket', {
      bucketName: 'foo-bar',
      notificationsHandlerRole: importedRole,
    });

    // WHEN
    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, {
      bind: () => ({
        arn: 'ARN',
        type: s3.BucketNotificationDestinationType.TOPIC,
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [{
          Action: 's3:PutBucketNotification',
          Effect: 'Allow',
          Resource: '*',
        }, {
          Action: 's3:GetBucketNotification',
          Effect: 'Allow',
          Resource: '*',
        }],
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [{
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: {
            Service: 'someservice.amazonaws.com',
          },
        }],
      },
      ManagedPolicyArns: [
        {
          'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole']],
        },
      ],
    });
  });

  test('If `Role` is provided, No warnings are thrown', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const importedRole = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('someservice.amazonaws.com'),
    });
    const bucket = s3.Bucket.fromBucketAttributes(stack, 'MyBucket', {
      bucketName: 'foo-bar',
      notificationsHandlerRole: importedRole,
    });

    // WHEN
    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, {
      bind: () => ({
        arn: 'ARN',
        type: s3.BucketNotificationDestinationType.TOPIC,
      }),
    });

    // THEN - Following is warning throwen as a part of fix in : https://github.com/aws/aws-cdk/pull/31212
    const warningFromStack = Annotations.fromStack(stack).findWarning('*', {});
    expect(warningFromStack[0]?.entry?.data).toEqual(undefined);
  });

  test('can specify prefix and suffix filter rules', () => {
    const stack = new cdk.Stack();

    const bucket = new s3.Bucket(stack, 'MyBucket');

    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, {
      bind: () => ({
        arn: 'ARN',
        type: s3.BucketNotificationDestinationType.TOPIC,
      }),
    }, { prefix: 'images/', suffix: '.png' });

    Template.fromStack(stack).hasResourceProperties('Custom::S3BucketNotifications', {
      NotificationConfiguration: {
        TopicConfigurations: [
          {
            Events: [
              's3:ObjectCreated:*',
            ],
            Filter: {
              Key: {
                FilterRules: [
                  {
                    Name: 'suffix',
                    Value: '.png',
                  },
                  {
                    Name: 'prefix',
                    Value: 'images/',
                  },
                ],
              },
            },
            TopicArn: 'ARN',
          },
        ],
      },
    });
  });

  test('the notification lambda handler must depend on the role to prevent executing too early', () => {
    const stack = new cdk.Stack();

    const bucket = new s3.Bucket(stack, 'MyBucket');

    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, {
      bind: () => ({
        arn: 'ARN',
        type: s3.BucketNotificationDestinationType.TOPIC,
      }),
    });

    Template.fromStack(stack).hasResource('AWS::Lambda::Function', {
      Type: 'AWS::Lambda::Function',
      Properties: {
        Role: {
          'Fn::GetAtt': [
            'BucketNotificationsHandler050a0587b7544547bf325f094a3db834RoleB6FB88EC',
            'Arn',
          ],
        },
      },
      DependsOn: ['BucketNotificationsHandler050a0587b7544547bf325f094a3db834RoleDefaultPolicy2CF63D36',
        'BucketNotificationsHandler050a0587b7544547bf325f094a3db834RoleB6FB88EC'],
    });
  });

  test('custom resource must not depend on bucket policy if it bucket policy does not exists', () => {
    const stack = new cdk.Stack();

    const bucket = new s3.Bucket(stack, 'MyBucket');

    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, {
      bind: () => ({
        arn: 'ARN',
        type: s3.BucketNotificationDestinationType.TOPIC,
      }),
    });

    Template.fromStack(stack).hasResource('Custom::S3BucketNotifications', {
      Type: 'Custom::S3BucketNotifications',
      DependsOn: Match.absent(),
    });
  });

  test('custom resource must depend on bucket policy to prevent executing too early', () => {
    const stack = new cdk.Stack();

    const bucket = new s3.Bucket(stack, 'MyBucket', {
      enforceSSL: true, // adds bucket policy for test
    });

    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, {
      bind: () => ({
        arn: 'ARN',
        type: s3.BucketNotificationDestinationType.TOPIC,
      }),
    });

    Template.fromStack(stack).hasResource('Custom::S3BucketNotifications', {
      Type: 'Custom::S3BucketNotifications',
      DependsOn: ['MyBucketPolicyE7FBAC7B'],
    });
  });

  test('custom resource must depend on bucket policy even if bucket policy is added after notification', () => {
    const stack = new cdk.Stack();

    const bucket = new s3.Bucket(stack, 'MyBucket');

    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, {
      bind: () => ({
        arn: 'ARN',
        type: s3.BucketNotificationDestinationType.TOPIC,
      }),
    });

    bucket.addToResourcePolicy(new iam.PolicyStatement({
      resources: [bucket.bucketArn],
      actions: ['s3:GetBucketAcl'],
      principals: [new iam.AnyPrincipal()],
    }));

    Template.fromStack(stack).hasResource('Custom::S3BucketNotifications', {
      Type: 'Custom::S3BucketNotifications',
      DependsOn: ['MyBucketPolicyE7FBAC7B'],
    });
  });

  test('throws with multiple prefix rules in a filter', () => {
    const stack = new cdk.Stack();

    const bucket = new s3.Bucket(stack, 'MyBucket');

    expect(() => bucket.addEventNotification(s3.EventType.OBJECT_CREATED, {
      bind: () => ({
        arn: 'ARN',
        type: s3.BucketNotificationDestinationType.TOPIC,
      }),
    }, { prefix: 'images/' }, { prefix: 'archive/' })).toThrow(/prefix rule/);
  });

  test('throws with multiple suffix rules in a filter', () => {
    const stack = new cdk.Stack();

    const bucket = new s3.Bucket(stack, 'MyBucket');

    expect(() => bucket.addEventNotification(s3.EventType.OBJECT_CREATED, {
      bind: () => ({
        arn: 'ARN',
        type: s3.BucketNotificationDestinationType.TOPIC,
      }),
    }, { suffix: '.png' }, { suffix: '.zip' })).toThrow(/suffix rule/);
  });

  test('EventBridge notification custom resource', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new s3.Bucket(stack, 'MyBucket', {
      eventBridgeEnabled: true,
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::S3::Bucket', 1);
    Template.fromStack(stack).hasResourceProperties('Custom::S3BucketNotifications', {
      NotificationConfiguration: {
        EventBridgeConfiguration: {},
      },
    });
  });

  test('Notification custom resource uses always treat bucket as unmanaged', () => {
    // GIVEN
    const stack = new cdk.Stack();

    stack.node.setContext(cxapi.S3_KEEP_NOTIFICATION_IN_IMPORTED_BUCKET, true);

    // WHEN
    new s3.Bucket(stack, 'MyBucket', {
      eventBridgeEnabled: true,
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::S3::Bucket', 1);
    Template.fromStack(stack).hasResourceProperties('Custom::S3BucketNotifications', {
      NotificationConfiguration: {
        EventBridgeConfiguration: {},
      },
      Managed: false,
    });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 's3:PutBucketNotification',
            Effect: 'Allow',
            Resource: '*',
          },
          {
            Action: 's3:GetBucketNotification',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('check notifications handler runtime version', () => {
    const stack = new cdk.Stack();

    const importedRole = iam.Role.fromRoleArn(stack, 'role', 'arn:aws:iam::111111111111:role/DevsNotAllowedToTouch');

    const bucket = s3.Bucket.fromBucketAttributes(stack, 'MyBucket', {
      bucketName: 'foo-bar',
      notificationsHandlerRole: importedRole,
    });

    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, {
      bind: () => ({
        arn: 'ARN',
        type: s3.BucketNotificationDestinationType.TOPIC,
      }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Runtime: 'python3.11',
    });
  });

  test('skip destination validation is set to false by default', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const bucket = new s3.Bucket(stack, 'MyBucket', {
      bucketName: 'foo-bar',
    });
    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, {
      bind: () => ({
        arn: 'ARN',
        type: s3.BucketNotificationDestinationType.TOPIC,
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('Custom::S3BucketNotifications', {
      SkipDestinationValidation: false,
    });
  });

  test('skip destination validation is set to true', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const bucket = new s3.Bucket(stack, 'MyBucket', {
      bucketName: 'foo-bar',
      notificationsSkipDestinationValidation: true,
    });
    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, {
      bind: () => ({
        arn: 'ARN',
        type: s3.BucketNotificationDestinationType.TOPIC,
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('Custom::S3BucketNotifications', {
      SkipDestinationValidation: true,
    });
  });

  test('skip destination validation is set to false', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const bucket = new s3.Bucket(stack, 'MyBucket', {
      bucketName: 'foo-bar',
      notificationsSkipDestinationValidation: false,
    });
    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, {
      bind: () => ({
        arn: 'ARN',
        type: s3.BucketNotificationDestinationType.TOPIC,
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('Custom::S3BucketNotifications', {
      SkipDestinationValidation: false,
    });
  });
});
