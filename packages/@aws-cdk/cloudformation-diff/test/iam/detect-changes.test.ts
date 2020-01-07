import { diffTemplate } from '../../lib';
import { poldoc, policy, resource, role, template } from '../util';

test('shows new AssumeRolePolicyDocument', () => {
  // WHEN
  const diff = diffTemplate({}, template({
    MyRole: role({
      AssumeRolePolicyDocument: poldoc({
        Action: 'sts:AssumeRole',
        Effect: 'Allow',
        Principal: { Service: 'lambda.amazonaws.com' }
      })
    })
  }));

  // THEN
  expect(diff.iamChanges.toJson()).toEqual({
    statementAdditions: [
      {
        effect: 'Allow',
        resources: { not: false, values: [ '${MyRole.Arn}' ] },
        principals: { not: false, values: [ 'Service:lambda.amazonaws.com' ] },
        actions: { not: false, values: [ 'sts:AssumeRole' ] },
      }
    ]
  });
});

test('implicitly knows principal of identity policy for all resource types', () => {
  for (const attr of ['Roles', 'Users', 'Groups']) {
    // WHEN
    const diff = diffTemplate({}, template({
      MyPolicy: policy({
        [attr]: [{ Ref: 'MyRole' }],
        PolicyDocument: poldoc({
          Effect: 'Allow',
          Action: 's3:DoThatThing',
          Resource: '*'
        })
      })
    }));

    // THEN
    expect(diff.iamChanges.toJson()).toEqual({
      statementAdditions: [
        {
          effect: 'Allow',
          resources: { not: false, values: [ '*' ] },
          principals: { not: false, values: [ 'AWS:${MyRole}' ] },
          actions: { not: false, values: [ 's3:DoThatThing' ] },
        }
      ]
    });
  }
});

test('policies on an identity object', () => {
  for (const resourceType of ['Role', 'User', 'Group']) {
    // WHEN
    const diff = diffTemplate({}, template({
      MyIdentity: resource(`AWS::IAM::${resourceType}`, {
        Policies: [
          {
            PolicyName: 'Polly',
            PolicyDocument: poldoc({
              Effect: 'Allow',
              Action: 's3:DoThatThing',
              Resource: '*'
            })
          }
        ],
      })
    }));

    // THEN
    expect(diff.iamChanges.toJson()).toEqual({
      statementAdditions: [
        {
          effect: 'Allow',
          resources: { not: false, values: [ '*' ] },
          principals: { not: false, values: [ 'AWS:${MyIdentity}' ] },
          actions: { not: false, values: [ 's3:DoThatThing' ] },
        }
      ]
    });
  }
});

test('if policy is attached to multiple roles all are shown', () => {
  // WHEN
  const diff = diffTemplate({}, template({
    MyPolicy: policy({
      Roles: [{ Ref: 'MyRole' }, { Ref: 'ThyRole' }],
      PolicyDocument: poldoc({
        Effect: 'Allow',
        Action: 's3:DoThatThing',
        Resource: '*'
      })
    })
  }));

  // THEN
  expect(diff.iamChanges.toJson()).toEqual({
    statementAdditions: [
      {
        effect: 'Allow',
        resources: { not: false, values: [ '*' ] },
        principals: { not: false, values: [ 'AWS:${MyRole}' ] },
        actions: { not: false, values: [ 's3:DoThatThing' ] },
      },
      {
        effect: 'Allow',
        resources: { not: false, values: [ '*' ] },
        principals: { not: false, values: [ 'AWS:${ThyRole}' ] },
        actions: { not: false, values: [ 's3:DoThatThing' ] },
      },
    ]
  });
});

test('correctly parses Lambda permissions', () => {
  // WHEN
  const diff = diffTemplate({}, template({
    MyPermission: resource('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      FunctionName: { Ref: 'MyFunction' },
      Principal: 's3.amazonaws.com',
      SourceAccount: {Ref: 'AWS::AccountId' },
      SourceArn: {'Fn::GetAtt': ['MyBucketF68F3FF0', 'Arn']},
    })
  }));

  // THEN
  expect(diff.iamChanges.toJson()).toEqual({
    statementAdditions: [
      {
        effect: 'Allow',
        resources: { not: false, values: [ '${MyFunction}' ] },
        principals: { not: false, values: [ 'Service:s3.amazonaws.com' ] },
        actions: { not: false, values: [ 'lambda:InvokeFunction' ] },
        condition: {
          StringEquals: { 'AWS:SourceAccount': '${AWS::AccountId}' },
          ArnLike: { 'AWS:SourceArn': '${MyBucketF68F3FF0.Arn}' }
        },
      }
    ]
  });
});

test('implicitly knows resource of (queue) resource policy even if * given', () => {
  // WHEN
  const diff = diffTemplate({}, template({
    QueuePolicy: resource('AWS::SQS::QueuePolicy', {
      Queues: [ { Ref: 'MyQueue' } ],
      PolicyDocument: poldoc({
        Effect: 'Allow',
        Action: 'sqs:SendMessage',
        Resource: '*',
        Principal: { Service: 'sns.amazonaws.com' }
      })
    })
  }));

  // THEN
  expect(diff.iamChanges.toJson()).toEqual({
    statementAdditions: [
      {
        effect: 'Allow',
        resources: { not: false, values: [ '${MyQueue}' ] },
        principals: { not: false, values: [ 'Service:sns.amazonaws.com' ] },
        actions: { not: false, values: [ 'sqs:SendMessage' ] },
      }
    ]
  });
});

test('finds sole statement removals', () => {
  // WHEN
  const diff = diffTemplate(template({
    BucketPolicy: resource('AWS::S3::BucketPolicy', {
      Bucket: { Ref: 'MyBucket' },
      PolicyDocument: poldoc({
        Effect: 'Allow',
        Action: 's3:PutObject',
        Resource: '*',
        Principal: { AWS: 'me' }
      })
    })
  }), {});

  // THEN
  expect(diff.iamChanges.toJson()).toEqual({
    statementRemovals: [
      {
        effect: 'Allow',
        resources: { not: false, values: [ '${MyBucket}' ] },
        principals: { not: false, values: [ 'AWS:me' ] },
        actions: { not: false, values: [ 's3:PutObject' ] },
      }
    ]
  });
});

test('finds one of many statement removals', () => {
  // WHEN
  const diff = diffTemplate(
    template({
      BucketPolicy: resource('AWS::S3::BucketPolicy', {
        Bucket: { Ref: 'MyBucket' },
        PolicyDocument: poldoc({
          Effect: 'Allow',
          Action: 's3:PutObject',
          Resource: '*',
          Principal: { AWS: 'me' }
        }, {
          Effect: 'Allow',
          Action: 's3:LookAtObject',
          Resource: '*',
          Principal: { AWS: 'me' }
        })
      })
    }),
    template({
      BucketPolicy: resource('AWS::S3::BucketPolicy', {
        Bucket: { Ref: 'MyBucket' },
        PolicyDocument: poldoc({
          Effect: 'Allow',
          Action: 's3:LookAtObject',
          Resource: '*',
          Principal: { AWS: 'me' }
        })
      })
    }));

  // THEN
  expect(diff.iamChanges.toJson()).toEqual({
    statementRemovals: [
      {
        effect: 'Allow',
        resources: { not: false, values: [ '${MyBucket}' ] },
        principals: { not: false, values: [ 'AWS:me' ] },
        actions: { not: false, values: [ 's3:PutObject' ] },
      }
    ]
  });
});

test('finds policy attachments', () => {
  // WHEN
  const diff = diffTemplate({}, template({
    SomeRole: resource('AWS::IAM::Role', {
      ManagedPolicyArns: ['arn:policy'],
    })
  }));

  // THEN
  expect(diff.iamChanges.toJson()).toEqual({
    managedPolicyAdditions: [
      {
        identityArn: '${SomeRole}',
        managedPolicyArn: 'arn:policy'
      }
    ]
  });
});

test('finds policy removals', () => {
  // WHEN
  const diff = diffTemplate(
    template({
      SomeRole: resource('AWS::IAM::Role', {
        ManagedPolicyArns: ['arn:policy', 'arn:policy2'],
      })
    }),
    template({
      SomeRole: resource('AWS::IAM::Role', {
        ManagedPolicyArns: ['arn:policy2'],
      })
  }));

  // THEN
  expect(diff.iamChanges.toJson()).toEqual({
    managedPolicyRemovals: [
      {
        identityArn: '${SomeRole}',
        managedPolicyArn: 'arn:policy'
      }
    ]
  });
});

test('queuepolicy queue change counts as removal+addition', () => {
  // WHEN
  const diff = diffTemplate(template({
    QueuePolicy: resource('AWS::SQS::QueuePolicy', {
      Queues: [ { Ref: 'MyQueue1' } ],
      PolicyDocument: poldoc({
        Effect: 'Allow',
        Action: 'sqs:SendMessage',
        Resource: '*',
        Principal: { Service: 'sns.amazonaws.com' }
      })
    })
  }), template({
    QueuePolicy: resource('AWS::SQS::QueuePolicy', {
      Queues: [ { Ref: 'MyQueue2' } ],
      PolicyDocument: poldoc({
        Effect: 'Allow',
        Action: 'sqs:SendMessage',
        Resource: '*',
        Principal: { Service: 'sns.amazonaws.com' }
      })
    })
  }));

  // THEN
  expect(diff.iamChanges.toJson()).toEqual({
    statementAdditions: [
      {
        effect: 'Allow',
        resources: { not: false, values: [ '${MyQueue2}' ] },
        principals: { not: false, values: [ 'Service:sns.amazonaws.com' ] },
        actions: { not: false, values: [ 'sqs:SendMessage' ] },
      }
    ],
    statementRemovals: [
      {
        effect: 'Allow',
        resources: { not: false, values: [ '${MyQueue1}' ] },
        principals: { not: false, values: [ 'Service:sns.amazonaws.com' ] },
        actions: { not: false, values: [ 'sqs:SendMessage' ] },
      }
    ]
  });
});
