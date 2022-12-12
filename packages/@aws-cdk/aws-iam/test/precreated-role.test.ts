import * as fs from 'fs';
import * as path from 'path';
import { Template } from '@aws-cdk/assertions';
import { App, Stack, CfnResource } from '@aws-cdk/core';
import { Role, ServicePrincipal, PolicyStatement, Effect, ManagedPolicy, Policy, PolicyDocument } from '../lib';
import { PrecreatedRole } from '../lib/private/precreated-role';

let app: App;
let stack: Stack;
let someResource: CfnResource;
let sourceRole: Role;
beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'MyStack');
  someResource = new CfnResource(stack, 'SomeResource', {
    type: 'AWS::SomeResource',
    properties: {},
  });
  sourceRole = new Role(stack, 'SourceRole', {
    assumedBy: new ServicePrincipal('sns.amazonaws.com'),
  });
});

describe('precreatedRole report created', () => {
  test('with inline policies', () => {
    const otherStack = new Stack(app, 'OtherStack');
    Role.customizeRoles(otherStack, {
      usePrecreatedRoles: {
        'OtherStack/MyRole': 'other-role-name',
      },
    });

    new Role(otherStack, 'MyRole', {
      assumedBy: new ServicePrincipal('sns.amazonaws.com'),
      inlinePolicies: {
        Doc: new PolicyDocument({
          statements: [new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['sns:Publish'],
            resources: ['*'],
          })],
        }),
      },
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('ReadOnlyAccess'),
      ],
    });

    Template.fromStack(otherStack).resourceCountIs('AWS::IAM::Role', 0);
    const assembly = app.synth();
    const filePath = path.join(assembly.directory, 'iam-policy-report.json');
    const file = fs.readFileSync(filePath, { encoding: 'utf-8' });
    expect(JSON.parse(file)).toEqual({
      roles: [{
        roleConstructPath: 'OtherStack/MyRole',
        roleName: 'other-role-name',
        missing: false,
        assumeRolePolicy: [{
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: {
            Service: 'sns.amazonaws.com',
          },
        }],
        managedPolicyArns: [
          'arn:(PARTITION):iam::aws:policy/ReadOnlyAccess',
        ],
        managedPolicyStatements: [],
        identityPolicyStatements: [{
          Action: 'sns:Publish',
          Effect: 'Allow',
          Resource: '*',
        }],
      }],
    });
  });

  test('with managed policies', () => {
    // GIVEN
    const role = new PrecreatedRole(stack, 'Role', {
      role: sourceRole,
      assumeRolePolicy: sourceRole.assumeRolePolicy,
      missing: true,
    });

    // WHEN
    role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('ReadOnlyAccess'));

    // THEN
    const assembly = app.synth();
    const filePath = path.join(assembly.directory, 'iam-policy-report.json');
    const file = fs.readFileSync(filePath, { encoding: 'utf-8' });
    expect(JSON.parse(file)).toEqual({
      roles: [{
        roleConstructPath: 'MyStack/Role',
        roleName: 'missing role',
        missing: true,
        assumeRolePolicy: [{
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: {
            Service: 'sns.amazonaws.com',
          },
        }],
        managedPolicyArns: [
          'arn:(PARTITION):iam::aws:policy/ReadOnlyAccess',
        ],
        managedPolicyStatements: [],
        identityPolicyStatements: [],
      }],
    });
  });

  test('with addToPolicy', () => {
    // GIVEN
    const role = new PrecreatedRole(stack, 'Role', {
      role: sourceRole,
      missing: true,
    });

    // WHEN
    role.addToPolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['s3:GetObject'],
      conditions: {
        StringLike: {
          's3:prefix': [
            someResource.getAtt('Arn').toString(),
            'arn:aws:s3:::someBucket/*',
          ],
        },
      },
      resources: [
        someResource.getAtt('Arn').toString(),
        'arn:aws:s3:::someBucket/*',
      ],
    }));

    // THEN
    const assembly = app.synth();
    const filePath = path.join(assembly.directory, 'iam-policy-report.json');
    const file = fs.readFileSync(filePath, { encoding: 'utf-8' });
    expect(JSON.parse(file)).toEqual({
      roles: [{
        roleConstructPath: 'MyStack/Role',
        roleName: 'missing role',
        missing: true,
        assumeRolePolicy: [],
        managedPolicyArns: [],
        managedPolicyStatements: [],
        identityPolicyStatements: [
          {
            Action: 's3:GetObject',
            Condition: {
              StringLike: {
                's3:prefix': [
                  '(MyStack/SomeResource.Arn)',
                  'arn:aws:s3:::someBucket/*',
                ],
              },
            },
            Effect: 'Allow',
            Resource: [
              '(MyStack/SomeResource.Arn)',
              'arn:aws:s3:::someBucket/*',
            ],
          },
        ],
      }],

    });
  });

  test('with attachInlinePolicy', () => {
    // GIVEN
    const role = new PrecreatedRole(stack, 'Role', {
      role: sourceRole,
      missing: true,
    });

    // WHEN
    role.attachInlinePolicy(new Policy(stack, 'Policy', {
      statements: [new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['sns:Publish'],
        resources: [`arn:aws:sns:${stack.region}:${stack.account}:${someResource.ref}`],
      })],
    }));

    // THEN
    const assembly = app.synth();
    const filePath = path.join(assembly.directory, 'iam-policy-report.json');
    const file = fs.readFileSync(filePath, { encoding: 'utf-8' });
    expect(JSON.parse(file)).toEqual({
      roles: [{
        roleConstructPath: 'MyStack/Role',
        roleName: 'missing role',
        missing: true,
        assumeRolePolicy: [],
        managedPolicyArns: [],
        managedPolicyStatements: [],
        identityPolicyStatements: [{
          Action: 'sns:Publish',
          Effect: 'Allow',
          Resource: 'arn:aws:sns:(REGION):(ACCOUNT):(MyStack/SomeResource.Ref)',
        }],
      }],
    });
  });

  test('with missing=false', () => {
    // GIVEN
    new PrecreatedRole(stack, 'Role', {
      role: Role.fromRoleName(stack, 'MyRole', 'ImportedRole'),
      missing: false,
    });

    // THEN
    const assembly = app.synth();
    const filePath = path.join(assembly.directory, 'iam-policy-report.json');
    const file = fs.readFileSync(filePath, { encoding: 'utf-8' });
    expect(JSON.parse(file)).toEqual({
      roles: [{
        roleConstructPath: 'MyStack/Role',
        roleName: 'ImportedRole',
        missing: false,
        assumeRolePolicy: [],
        managedPolicyArns: [],
        managedPolicyStatements: [],
        identityPolicyStatements: [],
      }],
    });
  });

  test('with managedPolicies', () => {
    // GIVEN
    const otherApp = new App();
    const otherStack = new Stack(otherApp, 'OtherStack');
    Role.customizeRoles(otherStack, {
      usePrecreatedRoles: {
        'OtherStack/MyRole': 'other-role-name',
      },
    });

    const role = new Role(otherStack, 'MyRole', {
      assumedBy: new ServicePrincipal('sns.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('ReadOnlyAccess'),
        ManagedPolicy.fromManagedPolicyName(otherStack, 'CustomReadPolicy', 'CustomReadOnlyAccess'),
        new ManagedPolicy(otherStack, 'CustomPolicy', {
          statements: [new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['sns:Publish', 's3:GetObject'],
            resources: [someResource.ref],
          })],
        }),
      ],
    });

    new ManagedPolicy(otherStack, 'OtherCustomPolicy', {
      roles: [role],
      statements: [new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['s3:PutObject'],
        resources: [someResource.getAtt('Arn').toString()],
      })],
    });


    // THEN
    const assembly = otherApp.synth();
    const filePath = path.join(assembly.directory, 'iam-policy-report');
    const file = fs.readFileSync(filePath+'.txt', { encoding: 'utf-8' });
    const jsonfile = fs.readFileSync(filePath+'.json', { encoding: 'utf-8' });
    expect(jsonfile).toMatchInlineSnapshot(`
"{
  \\"roles\\": [
    {
      \\"roleConstructPath\\": \\"OtherStack/MyRole\\",
      \\"roleName\\": \\"other-role-name\\",
      \\"missing\\": false,
      \\"assumeRolePolicy\\": [
        {
          \\"Action\\": \\"sts:AssumeRole\\",
          \\"Effect\\": \\"Allow\\",
          \\"Principal\\": {
            \\"Service\\": \\"sns.amazonaws.com\\"
          }
        }
      ],
      \\"managedPolicyArns\\": [
        \\"arn:(PARTITION):iam::aws:policy/ReadOnlyAccess\\",
        \\"arn:(PARTITION):iam::(ACCOUNT):policy/CustomReadOnlyAccess\\"
      ],
      \\"managedPolicyStatements\\": [
        {
          \\"Action\\": \\"s3:PutObject\\",
          \\"Effect\\": \\"Allow\\",
          \\"Resource\\": \\"(MyStack/SomeResource.Arn)\\"
        },
        {
          \\"Action\\": [
            \\"sns:Publish\\",
            \\"s3:GetObject\\"
          ],
          \\"Effect\\": \\"Allow\\",
          \\"Resource\\": \\"(MyStack/SomeResource.Ref)\\"
        }
      ],
      \\"identityPolicyStatements\\": []
    }
  ]
}"
`);
    expect(file).toMatchInlineSnapshot(`
"<other-role-name> (OtherStack/MyRole)

AssumeRole Policy:
[
  {
    \\"Action\\": \\"sts:AssumeRole\\",
    \\"Effect\\": \\"Allow\\",
    \\"Principal\\": {
      \\"Service\\": \\"sns.amazonaws.com\\"
    }
  }
]

Managed Policy ARNs:
[
  \\"arn:(PARTITION):iam::aws:policy/ReadOnlyAccess\\",
  \\"arn:(PARTITION):iam::(ACCOUNT):policy/CustomReadOnlyAccess\\"
]

Managed Policies Statements:
[
  {
    \\"Action\\": \\"s3:PutObject\\",
    \\"Effect\\": \\"Allow\\",
    \\"Resource\\": \\"(MyStack/SomeResource.Arn)\\"
  },
  {
    \\"Action\\": [
      \\"sns:Publish\\",
      \\"s3:GetObject\\"
    ],
    \\"Effect\\": \\"Allow\\",
    \\"Resource\\": \\"(MyStack/SomeResource.Ref)\\"
  }
]

Identity Policy Statements:
NONE"
`);
  });
});
