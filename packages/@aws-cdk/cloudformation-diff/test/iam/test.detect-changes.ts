import { Test } from 'nodeunit';
import { diffTemplate } from '../../lib';
import { poldoc, policy, resource, role, template } from '../util';

export = {
  'shows new AssumeRolePolicyDocument'(test: Test) {
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
    test.deepEqual(diff.iamChanges.toJson(), {
      statementAdditions: [
        {
          effect: 'Allow',
          resources: { not: false, values: [ '${MyRole.Arn}' ] },
          principals: { not: false, values: [ 'Service:lambda.amazonaws.com' ] },
          actions: { not: false, values: [ 'sts:AssumeRole' ] },
        }
      ]
    });

    test.done();
  },

  'implicitly knows principal of identity policy for all resource types'(test: Test) {
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
      test.deepEqual(diff.iamChanges.toJson(), {
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

    test.done();
  },

  'policies on an identity object'(test: Test) {
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
      test.deepEqual(diff.iamChanges.toJson(), {
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

    test.done();
  },

  'if policy is attached to multiple roles all are shown'(test: Test) {
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
    test.deepEqual(diff.iamChanges.toJson(), {
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

    test.done();
  },

  'correctly parses Lambda permissions'(test: Test) {
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
    test.deepEqual(diff.iamChanges.toJson(), {
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
    test.done();
  },

  'implicitly knows resource of (queue) resource policy even if * given'(test: Test) {
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
    test.deepEqual(diff.iamChanges.toJson(), {
      statementAdditions: [
        {
          effect: 'Allow',
          resources: { not: false, values: [ '${MyQueue}' ] },
          principals: { not: false, values: [ 'Service:sns.amazonaws.com' ] },
          actions: { not: false, values: [ 'sqs:SendMessage' ] },
        }
      ]
    });

    test.done();
  },

  'finds sole statement removals'(test: Test) {
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
    test.deepEqual(diff.iamChanges.toJson(), {
      statementRemovals: [
        {
          effect: 'Allow',
          resources: { not: false, values: [ '${MyBucket}' ] },
          principals: { not: false, values: [ 'AWS:me' ] },
          actions: { not: false, values: [ 's3:PutObject' ] },
        }
      ]
    });

    test.done();
  },

  'finds one of many statement removals'(test: Test) {
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
    test.deepEqual(diff.iamChanges.toJson(), {
      statementRemovals: [
        {
          effect: 'Allow',
          resources: { not: false, values: [ '${MyBucket}' ] },
          principals: { not: false, values: [ 'AWS:me' ] },
          actions: { not: false, values: [ 's3:PutObject' ] },
        }
      ]
    });

    test.done();
  },

  'finds policy attachments'(test: Test) {
    // WHEN
    const diff = diffTemplate({}, template({
      SomeRole: resource('AWS::IAM::Role', {
        ManagedPolicyArns: ['arn:policy'],
      })
    }));

    // THEN
    test.deepEqual(diff.iamChanges.toJson(), {
      managedPolicyAdditions: [
        {
          identityArn: '${SomeRole}',
          managedPolicyArn: 'arn:policy'
        }
      ]
    });

    test.done();
  },

  'finds policy removals'(test: Test) {
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
    test.deepEqual(diff.iamChanges.toJson(), {
      managedPolicyRemovals: [
        {
          identityArn: '${SomeRole}',
          managedPolicyArn: 'arn:policy'
        }
      ]
    });

    test.done();
  },

  'queuepolicy queue change counts as removal+addition'(test: Test) {
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
    test.deepEqual(diff.iamChanges.toJson(), {
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

    test.done();
  },
};