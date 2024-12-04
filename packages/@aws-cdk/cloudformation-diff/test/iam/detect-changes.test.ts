import * as chalk from 'chalk';
import { fullDiff } from '../../lib';
import { MaybeParsed } from '../../lib/diff/maybe-parsed';
import { IamChangesJson } from '../../lib/iam/iam-changes';
import { deepRemoveUndefined } from '../../lib/util';
import { largeSsoPermissionSet, poldoc, policy, resource, role, template } from '../util';

test('shows new AssumeRolePolicyDocument', () => {
  // WHEN
  const diff = fullDiff({}, template({
    MyRole: role({
      AssumeRolePolicyDocument: poldoc({
        Action: 'sts:AssumeRole',
        Effect: 'Allow',
        Principal: { Service: 'lambda.amazonaws.com' },
      }),
    }),
  }));

  // THEN
  expect(unwrapParsed(diff.iamChanges._toJson())).toEqual({
    statementAdditions: [
      {
        effect: 'Allow',
        resources: { not: false, values: ['${MyRole.Arn}'] },
        principals: { not: false, values: ['Service:lambda.amazonaws.com'] },
        actions: { not: false, values: ['sts:AssumeRole'] },
      },
    ],
  });
});

test('implicitly knows principal of identity policy for all resource types', () => {
  for (const attr of ['Roles', 'Users', 'Groups']) {
    // WHEN
    const diff = fullDiff({}, template({
      MyPolicy: policy({
        [attr]: [{ Ref: 'MyRole' }],
        PolicyDocument: poldoc({
          Effect: 'Allow',
          Action: 's3:DoThatThing',
          Resource: '*',
        }),
      }),
    }));

    // THEN
    expect(unwrapParsed(diff.iamChanges._toJson())).toEqual({
      statementAdditions: [
        {
          effect: 'Allow',
          resources: { not: false, values: ['*'] },
          principals: { not: false, values: ['AWS:${MyRole}'] },
          actions: { not: false, values: ['s3:DoThatThing'] },
        },
      ],
    });
  }
});

test('policies on an identity object', () => {
  for (const resourceType of ['Role', 'User', 'Group']) {
    // WHEN
    const diff = fullDiff({}, template({
      MyIdentity: resource(`AWS::IAM::${resourceType}`, {
        Policies: [
          {
            PolicyName: 'Polly',
            PolicyDocument: poldoc({
              Effect: 'Allow',
              Action: 's3:DoThatThing',
              Resource: '*',
            }),
          },
        ],
      }),
    }));

    // THEN
    expect(unwrapParsed(diff.iamChanges._toJson())).toEqual({
      statementAdditions: [
        {
          effect: 'Allow',
          resources: { not: false, values: ['*'] },
          principals: { not: false, values: ['AWS:${MyIdentity}'] },
          actions: { not: false, values: ['s3:DoThatThing'] },
        },
      ],
    });
  }
});

test('statement is an intrinsic', () => {
  const diff = fullDiff({}, template({
    MyIdentity: resource('AWS::IAM::User', {
      Policies: [
        {
          PolicyName: 'Polly',
          PolicyDocument: poldoc({
            'Fn::If': [
              'SomeCondition',
              {
                Effect: 'Allow',
                Action: 's3:DoThatThing',
                Resource: '*',
              },
              { Ref: 'AWS::NoValue' },
            ],
          }),
        },
      ],
    }),
  }));

  // THEN
  expect(diff.iamChanges._toJson()).toEqual({
    statementAdditions: [
      {
        type: 'unparseable',
        repr: '{"Fn::If":["SomeCondition",{"Effect":"Allow","Action":"s3:DoThatThing","Resource":"*"}]}',
      },
    ],
  });
});

test('if policy is attached to multiple roles all are shown', () => {
  // WHEN
  const diff = fullDiff({}, template({
    MyPolicy: policy({
      Roles: [{ Ref: 'MyRole' }, { Ref: 'ThyRole' }],
      PolicyDocument: poldoc({
        Effect: 'Allow',
        Action: 's3:DoThatThing',
        Resource: '*',
      }),
    }),
  }));

  // THEN
  expect(unwrapParsed(diff.iamChanges._toJson())).toEqual({
    statementAdditions: [
      {
        effect: 'Allow',
        resources: { not: false, values: ['*'] },
        principals: { not: false, values: ['AWS:${MyRole}'] },
        actions: { not: false, values: ['s3:DoThatThing'] },
      },
      {
        effect: 'Allow',
        resources: { not: false, values: ['*'] },
        principals: { not: false, values: ['AWS:${ThyRole}'] },
        actions: { not: false, values: ['s3:DoThatThing'] },
      },
    ],
  });
});

test('correctly parses Lambda permissions', () => {
  // WHEN
  const diff = fullDiff({}, template({
    MyPermission: resource('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      FunctionName: { Ref: 'MyFunction' },
      Principal: 's3.amazonaws.com',
      SourceAccount: { Ref: 'AWS::AccountId' },
      SourceArn: { 'Fn::GetAtt': ['MyBucketF68F3FF0', 'Arn'] },
    }),
  }));

  // THEN
  expect(unwrapParsed(diff.iamChanges._toJson())).toEqual({
    statementAdditions: [
      {
        effect: 'Allow',
        resources: { not: false, values: ['${MyFunction}'] },
        principals: { not: false, values: ['Service:s3.amazonaws.com'] },
        actions: { not: false, values: ['lambda:InvokeFunction'] },
        condition: {
          StringEquals: { 'AWS:SourceAccount': '${AWS::AccountId}' },
          ArnLike: { 'AWS:SourceArn': '${MyBucketF68F3FF0.Arn}' },
        },
      },
    ],
  });
});

test('implicitly knows resource of (queue) resource policy even if * given', () => {
  // WHEN
  const diff = fullDiff({}, template({
    QueuePolicy: resource('AWS::SQS::QueuePolicy', {
      Queues: [{ Ref: 'MyQueue' }],
      PolicyDocument: poldoc({
        Effect: 'Allow',
        Action: 'sqs:SendMessage',
        Resource: '*',
        Principal: { Service: 'sns.amazonaws.com' },
      }),
    }),
  }));

  // THEN
  expect(unwrapParsed(diff.iamChanges._toJson())).toEqual({
    statementAdditions: [
      {
        effect: 'Allow',
        resources: { not: false, values: ['${MyQueue}'] },
        principals: { not: false, values: ['Service:sns.amazonaws.com'] },
        actions: { not: false, values: ['sqs:SendMessage'] },
      },
    ],
  });
});

test('finds sole statement removals', () => {
  // WHEN
  const diff = fullDiff(template({
    BucketPolicy: resource('AWS::S3::BucketPolicy', {
      Bucket: { Ref: 'MyBucket' },
      PolicyDocument: poldoc({
        Effect: 'Allow',
        Action: 's3:PutObject',
        Resource: '*',
        Principal: { AWS: 'me' },
      }),
    }),
  }), {});

  // THEN
  expect(unwrapParsed(diff.iamChanges._toJson())).toEqual({
    statementRemovals: [
      {
        effect: 'Allow',
        resources: { not: false, values: ['${MyBucket}'] },
        principals: { not: false, values: ['AWS:me'] },
        actions: { not: false, values: ['s3:PutObject'] },
      },
    ],
  });
});

test('finds one of many statement removals', () => {
  // WHEN
  const diff = fullDiff(
    template({
      BucketPolicy: resource('AWS::S3::BucketPolicy', {
        Bucket: { Ref: 'MyBucket' },
        PolicyDocument: poldoc({
          Effect: 'Allow',
          Action: 's3:PutObject',
          Resource: '*',
          Principal: { AWS: 'me' },
        }, {
          Effect: 'Allow',
          Action: 's3:LookAtObject',
          Resource: '*',
          Principal: { AWS: 'me' },
        }),
      }),
    }),
    template({
      BucketPolicy: resource('AWS::S3::BucketPolicy', {
        Bucket: { Ref: 'MyBucket' },
        PolicyDocument: poldoc({
          Effect: 'Allow',
          Action: 's3:LookAtObject',
          Resource: '*',
          Principal: { AWS: 'me' },
        }),
      }),
    }));

  // THEN
  expect(unwrapParsed(diff.iamChanges._toJson())).toEqual({
    statementRemovals: [
      {
        effect: 'Allow',
        resources: { not: false, values: ['${MyBucket}'] },
        principals: { not: false, values: ['AWS:me'] },
        actions: { not: false, values: ['s3:PutObject'] },
      },
    ],
  });
});

test('finds policy attachments', () => {
  // WHEN
  const diff = fullDiff({}, template({
    SomeRole: resource('AWS::IAM::Role', {
      ManagedPolicyArns: ['arn:policy'],
    }),
  }));

  // THEN
  expect(unwrapParsed(diff.iamChanges._toJson())).toEqual({
    managedPolicyAdditions: [
      {
        identityArn: '${SomeRole}',
        managedPolicyArn: 'arn:policy',
      },
    ],
  });
});

test('finds policy removals', () => {
  // WHEN
  const diff = fullDiff(
    template({
      SomeRole: resource('AWS::IAM::Role', {
        ManagedPolicyArns: ['arn:policy', 'arn:policy2'],
      }),
    }),
    template({
      SomeRole: resource('AWS::IAM::Role', {
        ManagedPolicyArns: ['arn:policy2'],
      }),
    }));

  // THEN
  expect(unwrapParsed(diff.iamChanges._toJson())).toEqual({
    managedPolicyRemovals: [
      {
        identityArn: '${SomeRole}',
        managedPolicyArn: 'arn:policy',
      },
    ],
  });
});

test('queuepolicy queue change counts as removal+addition', () => {
  // WHEN
  const diff = fullDiff(template({
    QueuePolicy: resource('AWS::SQS::QueuePolicy', {
      Queues: [{ Ref: 'MyQueue1' }],
      PolicyDocument: poldoc({
        Effect: 'Allow',
        Action: 'sqs:SendMessage',
        Resource: '*',
        Principal: { Service: 'sns.amazonaws.com' },
      }),
    }),
  }), template({
    QueuePolicy: resource('AWS::SQS::QueuePolicy', {
      Queues: [{ Ref: 'MyQueue2' }],
      PolicyDocument: poldoc({
        Effect: 'Allow',
        Action: 'sqs:SendMessage',
        Resource: '*',
        Principal: { Service: 'sns.amazonaws.com' },
      }),
    }),
  }));

  // THEN
  expect(unwrapParsed(diff.iamChanges._toJson())).toEqual({
    statementAdditions: [
      {
        effect: 'Allow',
        resources: { not: false, values: ['${MyQueue2}'] },
        principals: { not: false, values: ['Service:sns.amazonaws.com'] },
        actions: { not: false, values: ['sqs:SendMessage'] },
      },
    ],
    statementRemovals: [
      {
        effect: 'Allow',
        resources: { not: false, values: ['${MyQueue1}'] },
        principals: { not: false, values: ['Service:sns.amazonaws.com'] },
        actions: { not: false, values: ['sqs:SendMessage'] },
      },
    ],
  });
});

test('supports Fn::If in the top-level property value of Role', () => {
  // WHEN
  const diff = fullDiff({}, template({
    MyRole: role({
      AssumeRolePolicyDocument: poldoc({
        Action: 'sts:AssumeRole',
        Effect: 'Allow',
        Principal: { Service: 'lambda.amazonaws.com' },
      }),
      ManagedPolicyArns: {
        'Fn::If': [
          'SomeCondition',
          ['then-managed-policy-arn'],
          ['else-managed-policy-arn'],
        ],
      },
    }),
  }));

  // THEN
  expect(unwrapParsed(diff.iamChanges._toJson())).toEqual({
    managedPolicyAdditions: [
      {
        identityArn: '${MyRole}',
        managedPolicyArn: '{"Fn::If":["SomeCondition",["then-managed-policy-arn"],["else-managed-policy-arn"]]}',
      },
    ],
    statementAdditions: [
      {
        effect: 'Allow',
        principals: { not: false, values: ['Service:lambda.amazonaws.com'] },
        actions: { not: false, values: ['sts:AssumeRole'] },
        resources: {
          not: false,
          values: ['${MyRole.Arn}'],
        },
      },
    ],
  });
});

test('supports Fn::If in the elements of an array-typed property of Role', () => {
  // WHEN
  const diff = fullDiff({}, template({
    MyRole: role({
      AssumeRolePolicyDocument: poldoc({
        Action: 'sts:AssumeRole',
        Effect: 'Allow',
        Principal: { Service: 'lambda.amazonaws.com' },
      }),
      Policies: [
        {
          'Fn::If': [
            'SomeCondition',
            {
              PolicyName: 'S3',
              PolicyDocument: poldoc({
                Effect: 'Allow',
                Action: 's3:GetObject',
                Resource: '*',
              }),
            },
            {
              Ref: 'AWS::NoValue',
            },
          ],
        },
      ],
    }),
  }));

  // THEN
  const changedStatements = diff.iamChanges.summarizeStatements();

  // there are 2 rows of changes
  // (one for the AssumeRolePolicyDocument,
  // one for the Policies),
  // plus a row of headers
  expect(changedStatements.length).toBe(3);

  const changedPolicies = changedStatements[2];
  const resourceColumn = 1, principalColumn = 4;

  expect(changedPolicies[resourceColumn]).toContain('{"Fn::If":["SomeCondition",{"PolicyName":"S3","PolicyDocument":{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":"s3:GetObject","Resource":"*"}]}}]}');
  expect(changedPolicies[principalColumn]).toContain('AWS:${MyRole}');
});

test('removal of managedPolicies is detected', () => {
  // WHEN
  const diff = fullDiff(template({
    SomeRole: resource('AWS::IAM::Role', {
      ManagedPolicyArns: ['arn:policy'],
    }),
  }), {});

  // THEN

  const managedPolicySummary = diff.iamChanges.summarizeManagedPolicies();
  expect(managedPolicySummary).toEqual(
    [
      ['', 'Resource', 'Managed Policy ARN'],
      [
        '-',
        '${SomeRole}',
        'arn:policy',
      ].map(s => chalk.red(s)),
    ],
  );
});

test('can summarize ssoPermissionSet changes with PermissionsBoundary.ManagedPolicyArn', () => {
  // WHEN
  const diff = fullDiff({}, template({
    MySsoPermissionSet: resource(
      'AWS::SSO::PermissionSet',
      {
        Name: 'BestName',
        InstanceArn: 'arn:aws:sso:::instance/ssoins-1111111111111111',
        ManagedPolicies: ['arn:aws:iam::aws:policy/AlwaysBeManaging'],
        PermissionsBoundary: { ManagedPolicyArn: 'arn:aws:iam::aws:policy/GreatAtManaging' },
        CustomerManagedPolicyReferences: [],
        InlinePolicy: {},
      },
    ),
  }));

  // THEN
  expect(diff.iamChanges.summarizeSsoPermissionSets()).toEqual(
    [
      ['', 'Resource', 'InstanceArn', 'PermissionSet name', 'PermissionsBoundary', 'CustomerManagedPolicyReferences'],
      [
        '+',
        '${MySsoPermissionSet}',
        'arn:aws:sso:::instance/ssoins-1111111111111111',
        'BestName',
        'ManagedPolicyArn: arn:aws:iam::aws:policy/GreatAtManaging',
        '',
      ].map(s => chalk.green(s)),
    ],
  );
  expect(diff.iamChanges.summarizeManagedPolicies()).toEqual(
    [
      ['', 'Resource', 'Managed Policy ARN'],
      [
        '+',
        '${MySsoPermissionSet}',
        'arn:aws:iam::aws:policy/AlwaysBeManaging',
      ].map(s => chalk.green(s)),
    ],
  );
});

test('can summarize negative ssoPermissionSet changes with PermissionsBoundary.CustomerManagedPolicyReference', () => {
  // WHEN
  const diff = fullDiff(largeSsoPermissionSet(), {});

  // THEN
  const ssoPermSetSummary = diff.iamChanges.summarizeSsoPermissionSets();
  expect(ssoPermSetSummary).toEqual(
    [
      ['', 'Resource', 'InstanceArn', 'PermissionSet name', 'PermissionsBoundary', 'CustomerManagedPolicyReferences'],
      [
        '-',
        '${MySsoPermissionSet}',
        'arn:aws:sso:::instance/ssoins-1111111111111111',
        'PleaseWork',
        'CustomerManagedPolicyReference: {\n  Name: why, Path: {"Fn::If":["SomeCondition","/how","/work"]}\n}',
        'Name: arn:aws:iam::aws:role/Silly, Path: /my\nName: LIFE, Path: ',
      ].map(s => chalk.red(s)),
    ],
  );

  const managedPolicySummary = diff.iamChanges.summarizeManagedPolicies();
  expect(managedPolicySummary).toEqual(
    [
      ['', 'Resource', 'Managed Policy ARN'],
      [
        '-',
        '${MySsoPermissionSet}',
        '{"Fn::If":["SomeCondition",["then-managed-policy-arn"],["else-managed-policy-arn"]]}',
      ].map(s => chalk.red(s)),
    ],
  );

  const iamStatementSummary = diff.iamChanges.summarizeStatements();
  expect(iamStatementSummary).toEqual(
    [
      ['', 'Resource', 'Effect', 'Action', 'Principal', 'Condition'],
      [
        '-',
        '${MySsoPermissionSet.Arn}',
        'Allow',
        'iam:CreateServiceLinkedRole',
        '',
        '',
      ].map(s => chalk.red(s)),
    ],
  );
});

test('can summarize ssoPermissionSet changes with PermissionsBoundary.CustomerManagedPolicyReference', () => {
  // WHEN
  const diff = fullDiff({}, largeSsoPermissionSet());

  // THEN
  expect(diff.iamChanges.summarizeSsoPermissionSets()).toEqual(
    [
      ['', 'Resource', 'InstanceArn', 'PermissionSet name', 'PermissionsBoundary', 'CustomerManagedPolicyReferences'],
      [
        '+',
        '${MySsoPermissionSet}',
        'arn:aws:sso:::instance/ssoins-1111111111111111',
        'PleaseWork',
        'CustomerManagedPolicyReference: {\n  Name: why, Path: {"Fn::If":["SomeCondition","/how","/work"]}\n}',
        'Name: arn:aws:iam::aws:role/Silly, Path: /my\nName: LIFE, Path: ',
      ].map(s => chalk.green(s)),
    ],
  );
  expect(diff.iamChanges.summarizeManagedPolicies()).toEqual(
    [
      ['', 'Resource', 'Managed Policy ARN'],
      [
        '+',
        '${MySsoPermissionSet}',
        '{"Fn::If":["SomeCondition",["then-managed-policy-arn"],["else-managed-policy-arn"]]}',
      ].map(s => chalk.green(s)),
    ],
  );

  const iamStatementSummary = diff.iamChanges.summarizeStatements();
  expect(iamStatementSummary).toEqual(
    [
      ['', 'Resource', 'Effect', 'Action', 'Principal', 'Condition'],
      [
        '+',
        '${MySsoPermissionSet.Arn}',
        'Allow',
        'iam:CreateServiceLinkedRole',
        '',
        '',
      ].map(s => chalk.green(s)),
    ],
  );
});

test('can summarize addition of ssoAssignment', () => {
  // WHEN
  const diff = fullDiff(
    template(resource('', {})),
    template({
      MyAssignment: resource('AWS::SSO::Assignment',
        {
          InstanceArn: 'arn:aws:sso:::instance/ssoins-1111111111111111',
          PermissionSetArn: {
            'Fn::GetAtt': [
              'MyOtherCfnPermissionSet',
              'PermissionSetArn',
            ],
          },
          PrincipalId: '33333333-3333-4444-5555-777777777777',
          PrincipalType: 'USER',
          TargetId: '222222222222',
          TargetType: 'AWS_ACCOUNT',
        }),
    }),
  );

  // THEN
  expect(diff.iamChanges.summarizeManagedPolicies()).toEqual(
    [['', 'Resource', 'Managed Policy ARN']],
  );
  expect(diff.iamChanges.summarizeStatements()).toEqual(
    [['', 'Resource', 'Effect', 'Action', 'Principal', 'Condition']],
  );

  const ssoAssignmentSummary = diff.iamChanges.summarizeSsoAssignments();
  expect(ssoAssignmentSummary).toEqual(
    [
      ['', 'Resource', 'InstanceArn', 'PermissionSetArn', 'PrincipalId', 'PrincipalType', 'TargetId', 'TargetType'],
      [
        '+',
        '${MyAssignment}',
        'arn:aws:sso:::instance/ssoins-1111111111111111',
        '${MyOtherCfnPermissionSet.PermissionSetArn}',
        '33333333-3333-4444-5555-777777777777',
        'USER',
        '222222222222',
        'AWS_ACCOUNT',
      ].map(s => chalk.green(s)),
    ],
  );

});

test('can summarize addition of SsoInstanceACAConfigs', () => {
  // WHEN
  const diff = fullDiff(
    template(resource('', {})),
    template({
      MyIACAConfiguration: resource('AWS::SSO::InstanceAccessControlAttributeConfiguration',
        {
          AccessControlAttributes: [
            { Key: 'first', Value: { Source: ['a'] } },
            { Key: 'second', Value: { Source: ['b'] } },
            { Key: 'third', Value: { Source: ['c'] } },
            { Key: 'fourth', Value: { Source: ['d'] } },
            { Key: 'fifth', Value: { Source: ['e'] } },
            { Key: 'sixth', Value: { Source: ['f'] } },
          ],
          InstanceArn: 'arn:aws:sso:::instance/ssoins-72234e1d20e1e68d',
        }),
    }),
  );

  // THEN
  expect(diff.iamChanges.summarizeManagedPolicies()).toEqual(
    [['', 'Resource', 'Managed Policy ARN']],
  );
  expect(diff.iamChanges.summarizeStatements()).toEqual(
    [['', 'Resource', 'Effect', 'Action', 'Principal', 'Condition']],
  );

  const ssoIACAConfig = diff.iamChanges.summarizeSsoInstanceACAConfigs();
  expect(ssoIACAConfig).toEqual(
    [
      ['', 'Resource', 'InstanceArn', 'AccessControlAttributes'],
      [
        '+',
        '${MyIACAConfiguration}',
        'arn:aws:sso:::instance/ssoins-72234e1d20e1e68d',
        'Key: first, Values: [a]\nKey: second, Values: [b]\nKey: third, Values: [c]\nKey: fourth, Values: [d]\nKey: fifth, Values: [e]\nKey: sixth, Values: [f]',
      ].map(s => chalk.green(s)),
    ],
  );

});

test('can summarize negation of SsoInstanceACAConfigs', () => {
  // WHEN
  const diff = fullDiff(
    template({
      MyIACAConfiguration: resource('AWS::SSO::InstanceAccessControlAttributeConfiguration',
        {
          AccessControlAttributes: [
            { Key: 'first', Value: { Source: ['a'] } },
            { Key: 'second', Value: { Source: ['b'] } },
            { Key: 'third', Value: { Source: ['c'] } },
            { Key: 'fourth', Value: { Source: ['d'] } },
            { Key: 'fifth', Value: { Source: ['e'] } },
            { Key: 'sixth', Value: { Source: ['f'] } },
          ],
          InstanceArn: 'arn:aws:sso:::instance/ssoins-72234e1d20e1e68d',
        }),
    }),
    template(resource('', {})),
  );

  // THEN
  expect(diff.iamChanges.summarizeManagedPolicies()).toEqual(
    [['', 'Resource', 'Managed Policy ARN']],
  );
  expect(diff.iamChanges.summarizeStatements()).toEqual(
    [['', 'Resource', 'Effect', 'Action', 'Principal', 'Condition']],
  );

  const ssoIACAConfig = diff.iamChanges.summarizeSsoInstanceACAConfigs();
  expect(ssoIACAConfig).toEqual(
    [
      ['', 'Resource', 'InstanceArn', 'AccessControlAttributes'],
      [
        '-',
        '${MyIACAConfiguration}',
        'arn:aws:sso:::instance/ssoins-72234e1d20e1e68d',
        'Key: first, Values: [a]\nKey: second, Values: [b]\nKey: third, Values: [c]\nKey: fourth, Values: [d]\nKey: fifth, Values: [e]\nKey: sixth, Values: [f]',
      ].map(s => chalk.red(s)),
    ],
  );

});

test('can summarize negation of ssoAssignment', () => {
  // WHEN
  const diff = fullDiff(
    template({
      MyAssignment: resource('AWS::SSO::Assignment',
        {
          InstanceArn: 'arn:aws:sso:::instance/ssoins-1111111111111111',
          PermissionSetArn: {
            'Fn::GetAtt': [
              'MyOtherCfnPermissionSet',
              'PermissionSetArn',
            ],
          },
          PrincipalId: '33333333-3333-4444-5555-777777777777',
          PrincipalType: 'USER',
          TargetId: '222222222222',
          TargetType: 'AWS_ACCOUNT',
        }),
    }),
    template(resource('', {})),
  );

  // THEN
  expect(diff.iamChanges.summarizeManagedPolicies()).toEqual(
    [['', 'Resource', 'Managed Policy ARN']],
  );
  expect(diff.iamChanges.summarizeStatements()).toEqual(
    [['', 'Resource', 'Effect', 'Action', 'Principal', 'Condition']],
  );

  const ssoAssignmentSummary = diff.iamChanges.summarizeSsoAssignments();
  expect(ssoAssignmentSummary).toEqual(
    [
      ['', 'Resource', 'InstanceArn', 'PermissionSetArn', 'PrincipalId', 'PrincipalType', 'TargetId', 'TargetType'],
      [
        '-',
        '${MyAssignment}',
        'arn:aws:sso:::instance/ssoins-1111111111111111',
        '${MyOtherCfnPermissionSet.PermissionSetArn}',
        '33333333-3333-4444-5555-777777777777',
        'USER',
        '222222222222',
        'AWS_ACCOUNT',
      ].map(s => chalk.red(s)),
    ],
  );
});

/**
 * Assume that all types are parsed, and unwrap them
 */
function unwrapParsed(chg: IamChangesJson) {
  return deepRemoveUndefined({
    managedPolicyAdditions: chg.managedPolicyAdditions?.map(unwrap1),
    managedPolicyRemovals: chg.managedPolicyRemovals?.map(unwrap1),
    statementAdditions: chg.statementAdditions?.map(unwrap1),
    statementRemovals: chg.statementRemovals?.map(unwrap1),
  });

  function unwrap1<A>(x: MaybeParsed<A>): A {
    if (x.type !== 'parsed') {
      throw new Error(`Expected parsed expression, found: "${x.repr}"`);
    }
    return x.value;
  }
}
