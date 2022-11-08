import * as fs from 'fs';
import * as path from 'path';
import { App, Stack, CfnResource } from '@aws-cdk/core';
import { Role, ServicePrincipal, PolicyStatement, Effect, ManagedPolicy, Policy } from '../lib';
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
    const filePath = path.join(assembly.directory, 'iam-policy-report.txt');
    const file = fs.readFileSync(filePath, { encoding: 'utf-8' });
    expect(file).toMatchInlineSnapshot(`
"<missing role> (MyStack/Role)

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

Managed Policies:
[
  \\"arn:(PARTITION):iam::aws:policy/ReadOnlyAccess\\"
]

Identity Policy:"
`);

  });

  test('with created managed policies', () => {
    // GIVEN
    const role = new PrecreatedRole(stack, 'Role', {
      role: sourceRole,
      missing: true,
    });

    // WHEN
    role.addManagedPolicy(new ManagedPolicy(stack, 'MPolicy', {
      statements: [new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['s3:ListBuckets'],
        resources: [`arn:aws:s3:::${someResource.ref}/*`],
      })],
    }));

    // THEN
    const assembly = app.synth();
    const filePath = path.join(assembly.directory, 'iam-policy-report.txt');
    const file = fs.readFileSync(filePath, { encoding: 'utf-8' });
    expect(file).toMatchInlineSnapshot(`
"<missing role> (MyStack/Role)

AssumeRole Policy:

Managed Policies:
[
  \\"(MyStack/MPolicy/Resource.Ref)\\"
]

Identity Policy:"
`);
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
    const filePath = path.join(assembly.directory, 'iam-policy-report.txt');
    const file = fs.readFileSync(filePath, { encoding: 'utf-8' });
    expect(file).toMatchInlineSnapshot(`
"<missing role> (MyStack/Role)

AssumeRole Policy:

Managed Policies:

Identity Policy:
[
  {
    \\"Action\\": \\"s3:GetObject\\",
    \\"Condition\\": {
      \\"StringLike\\": {
        \\"s3:prefix\\": [
          \\"(MyStack/SomeResource.Arn)\\",
          \\"arn:aws:s3:::someBucket/*\\"
        ]
      }
    },
    \\"Effect\\": \\"Allow\\",
    \\"Resource\\": [
      \\"(MyStack/SomeResource.Arn)\\",
      \\"arn:aws:s3:::someBucket/*\\"
    ]
  }
]"
`);

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
    const filePath = path.join(assembly.directory, 'iam-policy-report.txt');
    const file = fs.readFileSync(filePath, { encoding: 'utf-8' });
    expect(file).toMatchInlineSnapshot(`
"<missing role> (MyStack/Role)

AssumeRole Policy:

Managed Policies:

Identity Policy:
[
  {
    \\"Action\\": \\"sns:Publish\\",
    \\"Effect\\": \\"Allow\\",
    \\"Resource\\": \\"arn:aws:sns:(REGION):(ACCOUNT):(MyStack/SomeResource.Ref)\\"
  }
]"
`);

  });

  test('with missing=false', () => {
    // GIVEN
    new PrecreatedRole(stack, 'Role', {
      role: Role.fromRoleName(stack, 'MyRole', 'ImportedRole'),
      missing: false,
    });

    // THEN
    const assembly = app.synth();
    const filePath = path.join(assembly.directory, 'iam-policy-report.txt');
    const file = fs.readFileSync(filePath, { encoding: 'utf-8' });
    expect(file).toMatchInlineSnapshot(`
"<ImportedRole> (MyStack/Role)

AssumeRole Policy:

Managed Policies:

Identity Policy:"
`);
  });
});
