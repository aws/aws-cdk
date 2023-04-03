"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
const precreated_role_1 = require("../lib/private/precreated-role");
let app;
let stack;
let someResource;
let sourceRole;
beforeEach(() => {
    app = new core_1.App();
    stack = new core_1.Stack(app, 'MyStack');
    someResource = new core_1.CfnResource(stack, 'SomeResource', {
        type: 'AWS::SomeResource',
        properties: {},
    });
    sourceRole = new lib_1.Role(stack, 'SourceRole', {
        assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com'),
    });
});
describe('precreatedRole report created', () => {
    test('with inline policies', () => {
        const otherStack = new core_1.Stack(app, 'OtherStack');
        lib_1.Role.customizeRoles(otherStack, {
            usePrecreatedRoles: {
                'OtherStack/MyRole': 'other-role-name',
            },
        });
        new lib_1.Role(otherStack, 'MyRole', {
            assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com'),
            inlinePolicies: {
                Doc: new lib_1.PolicyDocument({
                    statements: [new lib_1.PolicyStatement({
                            effect: lib_1.Effect.ALLOW,
                            actions: ['sns:Publish'],
                            resources: ['*'],
                        })],
                }),
            },
            managedPolicies: [
                lib_1.ManagedPolicy.fromAwsManagedPolicyName('ReadOnlyAccess'),
            ],
        });
        assertions_1.Template.fromStack(otherStack).resourceCountIs('AWS::IAM::Role', 0);
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
        const role = new precreated_role_1.PrecreatedRole(stack, 'Role', {
            role: sourceRole,
            assumeRolePolicy: sourceRole.assumeRolePolicy,
            missing: true,
        });
        // WHEN
        role.addManagedPolicy(lib_1.ManagedPolicy.fromAwsManagedPolicyName('ReadOnlyAccess'));
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
        const role = new precreated_role_1.PrecreatedRole(stack, 'Role', {
            role: sourceRole,
            missing: true,
        });
        // WHEN
        role.addToPolicy(new lib_1.PolicyStatement({
            effect: lib_1.Effect.ALLOW,
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
        const role = new precreated_role_1.PrecreatedRole(stack, 'Role', {
            role: sourceRole,
            missing: true,
        });
        // WHEN
        role.attachInlinePolicy(new lib_1.Policy(stack, 'Policy', {
            statements: [new lib_1.PolicyStatement({
                    effect: lib_1.Effect.ALLOW,
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
        new precreated_role_1.PrecreatedRole(stack, 'Role', {
            role: lib_1.Role.fromRoleName(stack, 'MyRole', 'ImportedRole'),
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
        const otherApp = new core_1.App();
        const otherStack = new core_1.Stack(otherApp, 'OtherStack');
        lib_1.Role.customizeRoles(otherStack, {
            usePrecreatedRoles: {
                'OtherStack/MyRole': 'other-role-name',
            },
        });
        const role = new lib_1.Role(otherStack, 'MyRole', {
            assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com'),
            managedPolicies: [
                lib_1.ManagedPolicy.fromAwsManagedPolicyName('ReadOnlyAccess'),
                lib_1.ManagedPolicy.fromManagedPolicyName(otherStack, 'CustomReadPolicy', 'CustomReadOnlyAccess'),
                new lib_1.ManagedPolicy(otherStack, 'CustomPolicy', {
                    statements: [new lib_1.PolicyStatement({
                            effect: lib_1.Effect.ALLOW,
                            actions: ['sns:Publish', 's3:GetObject'],
                            resources: [someResource.ref],
                        })],
                }),
            ],
        });
        new lib_1.ManagedPolicy(otherStack, 'OtherCustomPolicy', {
            roles: [role],
            statements: [new lib_1.PolicyStatement({
                    effect: lib_1.Effect.ALLOW,
                    actions: ['s3:PutObject'],
                    resources: [someResource.getAtt('Arn').toString()],
                })],
        });
        // THEN
        const assembly = otherApp.synth();
        const filePath = path.join(assembly.directory, 'iam-policy-report');
        const file = fs.readFileSync(filePath + '.txt', { encoding: 'utf-8' });
        const jsonfile = fs.readFileSync(filePath + '.json', { encoding: 'utf-8' });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlY3JlYXRlZC1yb2xlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwcmVjcmVhdGVkLXJvbGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlCQUF5QjtBQUN6Qiw2QkFBNkI7QUFDN0Isb0RBQStDO0FBQy9DLHdDQUF3RDtBQUN4RCxnQ0FBZ0g7QUFDaEgsb0VBQWdFO0FBRWhFLElBQUksR0FBUSxDQUFDO0FBQ2IsSUFBSSxLQUFZLENBQUM7QUFDakIsSUFBSSxZQUF5QixDQUFDO0FBQzlCLElBQUksVUFBZ0IsQ0FBQztBQUNyQixVQUFVLENBQUMsR0FBRyxFQUFFO0lBQ2QsR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7SUFDaEIsS0FBSyxHQUFHLElBQUksWUFBSyxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNsQyxZQUFZLEdBQUcsSUFBSSxrQkFBVyxDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUU7UUFDcEQsSUFBSSxFQUFFLG1CQUFtQjtRQUN6QixVQUFVLEVBQUUsRUFBRTtLQUNmLENBQUMsQ0FBQztJQUNILFVBQVUsR0FBRyxJQUFJLFVBQUksQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO1FBQ3pDLFNBQVMsRUFBRSxJQUFJLHNCQUFnQixDQUFDLG1CQUFtQixDQUFDO0tBQ3JELENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsUUFBUSxDQUFDLCtCQUErQixFQUFFLEdBQUcsRUFBRTtJQUM3QyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxFQUFFO1FBQ2hDLE1BQU0sVUFBVSxHQUFHLElBQUksWUFBSyxDQUFDLEdBQUcsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUNoRCxVQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRTtZQUM5QixrQkFBa0IsRUFBRTtnQkFDbEIsbUJBQW1CLEVBQUUsaUJBQWlCO2FBQ3ZDO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxVQUFJLENB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QUMsUUFBUSxHQUFDLE9BQU8sRUFBRSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQzFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBdUMxQyxDQUFDLENBQUM7UUFDQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMscUJBQXFCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQXVDdEMsQ0FBQyxDQUFDO0lBQ0QsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0IHsgQXBwLCBTdGFjaywgQ2ZuUmVzb3VyY2UgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IFJvbGUsIFNlcnZpY2VQcmluY2lwYWwsIFBvbGljeVN0YXRlbWVudCwgRWZmZWN0LCBNYW5hZ2VkUG9saWN5LCBQb2xpY3ksIFBvbGljeURvY3VtZW50IH0gZnJvbSAnLi4vbGliJztcbmltcG9ydCB7IFByZWNyZWF0ZWRSb2xlIH0gZnJvbSAnLi4vbGliL3ByaXZhdGUvcHJlY3JlYXRlZC1yb2xlJztcblxubGV0IGFwcDogQXBwO1xubGV0IHN0YWNrOiBTdGFjaztcbmxldCBzb21lUmVzb3VyY2U6IENmblJlc291cmNlO1xubGV0IHNvdXJjZVJvbGU6IFJvbGU7XG5iZWZvcmVFYWNoKCgpID0+IHtcbiAgYXBwID0gbmV3IEFwcCgpO1xuICBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdNeVN0YWNrJyk7XG4gIHNvbWVSZXNvdXJjZSA9IG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ1NvbWVSZXNvdXJjZScsIHtcbiAgICB0eXBlOiAnQVdTOjpTb21lUmVzb3VyY2UnLFxuICAgIHByb3BlcnRpZXM6IHt9LFxuICB9KTtcbiAgc291cmNlUm9sZSA9IG5ldyBSb2xlKHN0YWNrLCAnU291cmNlUm9sZScsIHtcbiAgICBhc3N1bWVkQnk6IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdzbnMuYW1hem9uYXdzLmNvbScpLFxuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgncHJlY3JlYXRlZFJvbGUgcmVwb3J0IGNyZWF0ZWQnLCAoKSA9PiB7XG4gIHRlc3QoJ3dpdGggaW5saW5lIHBvbGljaWVzJywgKCkgPT4ge1xuICAgIGNvbnN0IG90aGVyU3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnT3RoZXJTdGFjaycpO1xuICAgIFJvbGUuY3VzdG9taXplUm9sZXMob3RoZXJTdGFjaywge1xuICAgICAgdXNlUHJlY3JlYXRlZFJvbGVzOiB7XG4gICAgICAgICdPdGhlclN0YWNrL015Um9sZSc6ICdvdGhlci1yb2xlLW5hbWUnLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIG5ldyBSb2xlKG90aGVyU3RhY2ssICdNeVJvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdzbnMuYW1hem9uYXdzLmNvbScpLFxuICAgICAgaW5saW5lUG9saWNpZXM6IHtcbiAgICAgICAgRG9jOiBuZXcgUG9saWN5RG9jdW1lbnQoe1xuICAgICAgICAgIHN0YXRlbWVudHM6IFtuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgICAgIGVmZmVjdDogRWZmZWN0LkFMTE9XLFxuICAgICAgICAgICAgYWN0aW9uczogWydzbnM6UHVibGlzaCddLFxuICAgICAgICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICAgICAgICB9KV0sXG4gICAgICAgIH0pLFxuICAgICAgfSxcbiAgICAgIG1hbmFnZWRQb2xpY2llczogW1xuICAgICAgICBNYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnUmVhZE9ubHlBY2Nlc3MnKSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2sob3RoZXJTdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OklBTTo6Um9sZScsIDApO1xuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4oYXNzZW1ibHkuZGlyZWN0b3J5LCAnaWFtLXBvbGljeS1yZXBvcnQuanNvbicpO1xuICAgIGNvbnN0IGZpbGUgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgsIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSk7XG4gICAgZXhwZWN0KEpTT04ucGFyc2UoZmlsZSkpLnRvRXF1YWwoe1xuICAgICAgcm9sZXM6IFt7XG4gICAgICAgIHJvbGVDb25zdHJ1Y3RQYXRoOiAnT3RoZXJTdGFjay9NeVJvbGUnLFxuICAgICAgICByb2xlTmFtZTogJ290aGVyLXJvbGUtbmFtZScsXG4gICAgICAgIG1pc3Npbmc6IGZhbHNlLFxuICAgICAgICBhc3N1bWVSb2xlUG9saWN5OiBbe1xuICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgICBTZXJ2aWNlOiAnc25zLmFtYXpvbmF3cy5jb20nLFxuICAgICAgICAgIH0sXG4gICAgICAgIH1dLFxuICAgICAgICBtYW5hZ2VkUG9saWN5QXJuczogW1xuICAgICAgICAgICdhcm46KFBBUlRJVElPTik6aWFtOjphd3M6cG9saWN5L1JlYWRPbmx5QWNjZXNzJyxcbiAgICAgICAgXSxcbiAgICAgICAgbWFuYWdlZFBvbGljeVN0YXRlbWVudHM6IFtdLFxuICAgICAgICBpZGVudGl0eVBvbGljeVN0YXRlbWVudHM6IFt7XG4gICAgICAgICAgQWN0aW9uOiAnc25zOlB1Ymxpc2gnLFxuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICB9XSxcbiAgICAgIH1dLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd3aXRoIG1hbmFnZWQgcG9saWNpZXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCByb2xlID0gbmV3IFByZWNyZWF0ZWRSb2xlKHN0YWNrLCAnUm9sZScsIHtcbiAgICAgIHJvbGU6IHNvdXJjZVJvbGUsXG4gICAgICBhc3N1bWVSb2xlUG9saWN5OiBzb3VyY2VSb2xlLmFzc3VtZVJvbGVQb2xpY3ksXG4gICAgICBtaXNzaW5nOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIHJvbGUuYWRkTWFuYWdlZFBvbGljeShNYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnUmVhZE9ubHlBY2Nlc3MnKSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGguam9pbihhc3NlbWJseS5kaXJlY3RvcnksICdpYW0tcG9saWN5LXJlcG9ydC5qc29uJyk7XG4gICAgY29uc3QgZmlsZSA9IGZzLnJlYWRGaWxlU3luYyhmaWxlUGF0aCwgeyBlbmNvZGluZzogJ3V0Zi04JyB9KTtcbiAgICBleHBlY3QoSlNPTi5wYXJzZShmaWxlKSkudG9FcXVhbCh7XG4gICAgICByb2xlczogW3tcbiAgICAgICAgcm9sZUNvbnN0cnVjdFBhdGg6ICdNeVN0YWNrL1JvbGUnLFxuICAgICAgICByb2xlTmFtZTogJ21pc3Npbmcgcm9sZScsXG4gICAgICAgIG1pc3Npbmc6IHRydWUsXG4gICAgICAgIGFzc3VtZVJvbGVQb2xpY3k6IFt7XG4gICAgICAgICAgQWN0aW9uOiAnc3RzOkFzc3VtZVJvbGUnLFxuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgIFNlcnZpY2U6ICdzbnMuYW1hem9uYXdzLmNvbScsXG4gICAgICAgICAgfSxcbiAgICAgICAgfV0sXG4gICAgICAgIG1hbmFnZWRQb2xpY3lBcm5zOiBbXG4gICAgICAgICAgJ2FybjooUEFSVElUSU9OKTppYW06OmF3czpwb2xpY3kvUmVhZE9ubHlBY2Nlc3MnLFxuICAgICAgICBdLFxuICAgICAgICBtYW5hZ2VkUG9saWN5U3RhdGVtZW50czogW10sXG4gICAgICAgIGlkZW50aXR5UG9saWN5U3RhdGVtZW50czogW10sXG4gICAgICB9XSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnd2l0aCBhZGRUb1BvbGljeScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHJvbGUgPSBuZXcgUHJlY3JlYXRlZFJvbGUoc3RhY2ssICdSb2xlJywge1xuICAgICAgcm9sZTogc291cmNlUm9sZSxcbiAgICAgIG1pc3Npbmc6IHRydWUsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgcm9sZS5hZGRUb1BvbGljeShuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGVmZmVjdDogRWZmZWN0LkFMTE9XLFxuICAgICAgYWN0aW9uczogWydzMzpHZXRPYmplY3QnXSxcbiAgICAgIGNvbmRpdGlvbnM6IHtcbiAgICAgICAgU3RyaW5nTGlrZToge1xuICAgICAgICAgICdzMzpwcmVmaXgnOiBbXG4gICAgICAgICAgICBzb21lUmVzb3VyY2UuZ2V0QXR0KCdBcm4nKS50b1N0cmluZygpLFxuICAgICAgICAgICAgJ2Fybjphd3M6czM6Ojpzb21lQnVja2V0LyonLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcmVzb3VyY2VzOiBbXG4gICAgICAgIHNvbWVSZXNvdXJjZS5nZXRBdHQoJ0FybicpLnRvU3RyaW5nKCksXG4gICAgICAgICdhcm46YXdzOnMzOjo6c29tZUJ1Y2tldC8qJyxcbiAgICAgIF0sXG4gICAgfSkpO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4oYXNzZW1ibHkuZGlyZWN0b3J5LCAnaWFtLXBvbGljeS1yZXBvcnQuanNvbicpO1xuICAgIGNvbnN0IGZpbGUgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgsIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSk7XG4gICAgZXhwZWN0KEpTT04ucGFyc2UoZmlsZSkpLnRvRXF1YWwoe1xuICAgICAgcm9sZXM6IFt7XG4gICAgICAgIHJvbGVDb25zdHJ1Y3RQYXRoOiAnTXlTdGFjay9Sb2xlJyxcbiAgICAgICAgcm9sZU5hbWU6ICdtaXNzaW5nIHJvbGUnLFxuICAgICAgICBtaXNzaW5nOiB0cnVlLFxuICAgICAgICBhc3N1bWVSb2xlUG9saWN5OiBbXSxcbiAgICAgICAgbWFuYWdlZFBvbGljeUFybnM6IFtdLFxuICAgICAgICBtYW5hZ2VkUG9saWN5U3RhdGVtZW50czogW10sXG4gICAgICAgIGlkZW50aXR5UG9saWN5U3RhdGVtZW50czogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogJ3MzOkdldE9iamVjdCcsXG4gICAgICAgICAgICBDb25kaXRpb246IHtcbiAgICAgICAgICAgICAgU3RyaW5nTGlrZToge1xuICAgICAgICAgICAgICAgICdzMzpwcmVmaXgnOiBbXG4gICAgICAgICAgICAgICAgICAnKE15U3RhY2svU29tZVJlc291cmNlLkFybiknLFxuICAgICAgICAgICAgICAgICAgJ2Fybjphd3M6czM6Ojpzb21lQnVja2V0LyonLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6IFtcbiAgICAgICAgICAgICAgJyhNeVN0YWNrL1NvbWVSZXNvdXJjZS5Bcm4pJyxcbiAgICAgICAgICAgICAgJ2Fybjphd3M6czM6Ojpzb21lQnVja2V0LyonLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfV0sXG5cbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnd2l0aCBhdHRhY2hJbmxpbmVQb2xpY3knLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCByb2xlID0gbmV3IFByZWNyZWF0ZWRSb2xlKHN0YWNrLCAnUm9sZScsIHtcbiAgICAgIHJvbGU6IHNvdXJjZVJvbGUsXG4gICAgICBtaXNzaW5nOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIHJvbGUuYXR0YWNoSW5saW5lUG9saWN5KG5ldyBQb2xpY3koc3RhY2ssICdQb2xpY3knLCB7XG4gICAgICBzdGF0ZW1lbnRzOiBbbmV3IFBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIGVmZmVjdDogRWZmZWN0LkFMTE9XLFxuICAgICAgICBhY3Rpb25zOiBbJ3NuczpQdWJsaXNoJ10sXG4gICAgICAgIHJlc291cmNlczogW2Bhcm46YXdzOnNuczoke3N0YWNrLnJlZ2lvbn06JHtzdGFjay5hY2NvdW50fToke3NvbWVSZXNvdXJjZS5yZWZ9YF0sXG4gICAgICB9KV0sXG4gICAgfSkpO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4oYXNzZW1ibHkuZGlyZWN0b3J5LCAnaWFtLXBvbGljeS1yZXBvcnQuanNvbicpO1xuICAgIGNvbnN0IGZpbGUgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgsIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSk7XG4gICAgZXhwZWN0KEpTT04ucGFyc2UoZmlsZSkpLnRvRXF1YWwoe1xuICAgICAgcm9sZXM6IFt7XG4gICAgICAgIHJvbGVDb25zdHJ1Y3RQYXRoOiAnTXlTdGFjay9Sb2xlJyxcbiAgICAgICAgcm9sZU5hbWU6ICdtaXNzaW5nIHJvbGUnLFxuICAgICAgICBtaXNzaW5nOiB0cnVlLFxuICAgICAgICBhc3N1bWVSb2xlUG9saWN5OiBbXSxcbiAgICAgICAgbWFuYWdlZFBvbGljeUFybnM6IFtdLFxuICAgICAgICBtYW5hZ2VkUG9saWN5U3RhdGVtZW50czogW10sXG4gICAgICAgIGlkZW50aXR5UG9saWN5U3RhdGVtZW50czogW3tcbiAgICAgICAgICBBY3Rpb246ICdzbnM6UHVibGlzaCcsXG4gICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgIFJlc291cmNlOiAnYXJuOmF3czpzbnM6KFJFR0lPTik6KEFDQ09VTlQpOihNeVN0YWNrL1NvbWVSZXNvdXJjZS5SZWYpJyxcbiAgICAgICAgfV0sXG4gICAgICB9XSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnd2l0aCBtaXNzaW5nPWZhbHNlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgbmV3IFByZWNyZWF0ZWRSb2xlKHN0YWNrLCAnUm9sZScsIHtcbiAgICAgIHJvbGU6IFJvbGUuZnJvbVJvbGVOYW1lKHN0YWNrLCAnTXlSb2xlJywgJ0ltcG9ydGVkUm9sZScpLFxuICAgICAgbWlzc2luZzogZmFsc2UsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGguam9pbihhc3NlbWJseS5kaXJlY3RvcnksICdpYW0tcG9saWN5LXJlcG9ydC5qc29uJyk7XG4gICAgY29uc3QgZmlsZSA9IGZzLnJlYWRGaWxlU3luYyhmaWxlUGF0aCwgeyBlbmNvZGluZzogJ3V0Zi04JyB9KTtcbiAgICBleHBlY3QoSlNPTi5wYXJzZShmaWxlKSkudG9FcXVhbCh7XG4gICAgICByb2xlczogW3tcbiAgICAgICAgcm9sZUNvbnN0cnVjdFBhdGg6ICdNeVN0YWNrL1JvbGUnLFxuICAgICAgICByb2xlTmFtZTogJ0ltcG9ydGVkUm9sZScsXG4gICAgICAgIG1pc3Npbmc6IGZhbHNlLFxuICAgICAgICBhc3N1bWVSb2xlUG9saWN5OiBbXSxcbiAgICAgICAgbWFuYWdlZFBvbGljeUFybnM6IFtdLFxuICAgICAgICBtYW5hZ2VkUG9saWN5U3RhdGVtZW50czogW10sXG4gICAgICAgIGlkZW50aXR5UG9saWN5U3RhdGVtZW50czogW10sXG4gICAgICB9XSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnd2l0aCBtYW5hZ2VkUG9saWNpZXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBvdGhlckFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBvdGhlclN0YWNrID0gbmV3IFN0YWNrKG90aGVyQXBwLCAnT3RoZXJTdGFjaycpO1xuICAgIFJvbGUuY3VzdG9taXplUm9sZXMob3RoZXJTdGFjaywge1xuICAgICAgdXNlUHJlY3JlYXRlZFJvbGVzOiB7XG4gICAgICAgICdPdGhlclN0YWNrL015Um9sZSc6ICdvdGhlci1yb2xlLW5hbWUnLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHJvbGUgPSBuZXcgUm9sZShvdGhlclN0YWNrLCAnTXlSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnc25zLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgIG1hbmFnZWRQb2xpY2llczogW1xuICAgICAgICBNYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnUmVhZE9ubHlBY2Nlc3MnKSxcbiAgICAgICAgTWFuYWdlZFBvbGljeS5mcm9tTWFuYWdlZFBvbGljeU5hbWUob3RoZXJTdGFjaywgJ0N1c3RvbVJlYWRQb2xpY3knLCAnQ3VzdG9tUmVhZE9ubHlBY2Nlc3MnKSxcbiAgICAgICAgbmV3IE1hbmFnZWRQb2xpY3kob3RoZXJTdGFjaywgJ0N1c3RvbVBvbGljeScsIHtcbiAgICAgICAgICBzdGF0ZW1lbnRzOiBbbmV3IFBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgICAgICBlZmZlY3Q6IEVmZmVjdC5BTExPVyxcbiAgICAgICAgICAgIGFjdGlvbnM6IFsnc25zOlB1Ymxpc2gnLCAnczM6R2V0T2JqZWN0J10sXG4gICAgICAgICAgICByZXNvdXJjZXM6IFtzb21lUmVzb3VyY2UucmVmXSxcbiAgICAgICAgICB9KV0sXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIG5ldyBNYW5hZ2VkUG9saWN5KG90aGVyU3RhY2ssICdPdGhlckN1c3RvbVBvbGljeScsIHtcbiAgICAgIHJvbGVzOiBbcm9sZV0sXG4gICAgICBzdGF0ZW1lbnRzOiBbbmV3IFBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIGVmZmVjdDogRWZmZWN0LkFMTE9XLFxuICAgICAgICBhY3Rpb25zOiBbJ3MzOlB1dE9iamVjdCddLFxuICAgICAgICByZXNvdXJjZXM6IFtzb21lUmVzb3VyY2UuZ2V0QXR0KCdBcm4nKS50b1N0cmluZygpXSxcbiAgICAgIH0pXSxcbiAgICB9KTtcblxuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGFzc2VtYmx5ID0gb3RoZXJBcHAuc3ludGgoKTtcbiAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGguam9pbihhc3NlbWJseS5kaXJlY3RvcnksICdpYW0tcG9saWN5LXJlcG9ydCcpO1xuICAgIGNvbnN0IGZpbGUgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgrJy50eHQnLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pO1xuICAgIGNvbnN0IGpzb25maWxlID0gZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoKycuanNvbicsIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSk7XG4gICAgZXhwZWN0KGpzb25maWxlKS50b01hdGNoSW5saW5lU25hcHNob3QoYFxuXCJ7XG4gIFxcXFxcInJvbGVzXFxcXFwiOiBbXG4gICAge1xuICAgICAgXFxcXFwicm9sZUNvbnN0cnVjdFBhdGhcXFxcXCI6IFxcXFxcIk90aGVyU3RhY2svTXlSb2xlXFxcXFwiLFxuICAgICAgXFxcXFwicm9sZU5hbWVcXFxcXCI6IFxcXFxcIm90aGVyLXJvbGUtbmFtZVxcXFxcIixcbiAgICAgIFxcXFxcIm1pc3NpbmdcXFxcXCI6IGZhbHNlLFxuICAgICAgXFxcXFwiYXNzdW1lUm9sZVBvbGljeVxcXFxcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXFxcXFwiQWN0aW9uXFxcXFwiOiBcXFxcXCJzdHM6QXNzdW1lUm9sZVxcXFxcIixcbiAgICAgICAgICBcXFxcXCJFZmZlY3RcXFxcXCI6IFxcXFxcIkFsbG93XFxcXFwiLFxuICAgICAgICAgIFxcXFxcIlByaW5jaXBhbFxcXFxcIjoge1xuICAgICAgICAgICAgXFxcXFwiU2VydmljZVxcXFxcIjogXFxcXFwic25zLmFtYXpvbmF3cy5jb21cXFxcXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBcXFxcXCJtYW5hZ2VkUG9saWN5QXJuc1xcXFxcIjogW1xuICAgICAgICBcXFxcXCJhcm46KFBBUlRJVElPTik6aWFtOjphd3M6cG9saWN5L1JlYWRPbmx5QWNjZXNzXFxcXFwiLFxuICAgICAgICBcXFxcXCJhcm46KFBBUlRJVElPTik6aWFtOjooQUNDT1VOVCk6cG9saWN5L0N1c3RvbVJlYWRPbmx5QWNjZXNzXFxcXFwiXG4gICAgICBdLFxuICAgICAgXFxcXFwibWFuYWdlZFBvbGljeVN0YXRlbWVudHNcXFxcXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFxcXFxcIkFjdGlvblxcXFxcIjogXFxcXFwiczM6UHV0T2JqZWN0XFxcXFwiLFxuICAgICAgICAgIFxcXFxcIkVmZmVjdFxcXFxcIjogXFxcXFwiQWxsb3dcXFxcXCIsXG4gICAgICAgICAgXFxcXFwiUmVzb3VyY2VcXFxcXCI6IFxcXFxcIihNeVN0YWNrL1NvbWVSZXNvdXJjZS5Bcm4pXFxcXFwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcXFxcXCJBY3Rpb25cXFxcXCI6IFtcbiAgICAgICAgICAgIFxcXFxcInNuczpQdWJsaXNoXFxcXFwiLFxuICAgICAgICAgICAgXFxcXFwiczM6R2V0T2JqZWN0XFxcXFwiXG4gICAgICAgICAgXSxcbiAgICAgICAgICBcXFxcXCJFZmZlY3RcXFxcXCI6IFxcXFxcIkFsbG93XFxcXFwiLFxuICAgICAgICAgIFxcXFxcIlJlc291cmNlXFxcXFwiOiBcXFxcXCIoTXlTdGFjay9Tb21lUmVzb3VyY2UuUmVmKVxcXFxcIlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgXFxcXFwiaWRlbnRpdHlQb2xpY3lTdGF0ZW1lbnRzXFxcXFwiOiBbXVxuICAgIH1cbiAgXVxufVwiXG5gKTtcbiAgICBleHBlY3QoZmlsZSkudG9NYXRjaElubGluZVNuYXBzaG90KGBcblwiPG90aGVyLXJvbGUtbmFtZT4gKE90aGVyU3RhY2svTXlSb2xlKVxuXG5Bc3N1bWVSb2xlIFBvbGljeTpcbltcbiAge1xuICAgIFxcXFxcIkFjdGlvblxcXFxcIjogXFxcXFwic3RzOkFzc3VtZVJvbGVcXFxcXCIsXG4gICAgXFxcXFwiRWZmZWN0XFxcXFwiOiBcXFxcXCJBbGxvd1xcXFxcIixcbiAgICBcXFxcXCJQcmluY2lwYWxcXFxcXCI6IHtcbiAgICAgIFxcXFxcIlNlcnZpY2VcXFxcXCI6IFxcXFxcInNucy5hbWF6b25hd3MuY29tXFxcXFwiXG4gICAgfVxuICB9XG5dXG5cbk1hbmFnZWQgUG9saWN5IEFSTnM6XG5bXG4gIFxcXFxcImFybjooUEFSVElUSU9OKTppYW06OmF3czpwb2xpY3kvUmVhZE9ubHlBY2Nlc3NcXFxcXCIsXG4gIFxcXFxcImFybjooUEFSVElUSU9OKTppYW06OihBQ0NPVU5UKTpwb2xpY3kvQ3VzdG9tUmVhZE9ubHlBY2Nlc3NcXFxcXCJcbl1cblxuTWFuYWdlZCBQb2xpY2llcyBTdGF0ZW1lbnRzOlxuW1xuICB7XG4gICAgXFxcXFwiQWN0aW9uXFxcXFwiOiBcXFxcXCJzMzpQdXRPYmplY3RcXFxcXCIsXG4gICAgXFxcXFwiRWZmZWN0XFxcXFwiOiBcXFxcXCJBbGxvd1xcXFxcIixcbiAgICBcXFxcXCJSZXNvdXJjZVxcXFxcIjogXFxcXFwiKE15U3RhY2svU29tZVJlc291cmNlLkFybilcXFxcXCJcbiAgfSxcbiAge1xuICAgIFxcXFxcIkFjdGlvblxcXFxcIjogW1xuICAgICAgXFxcXFwic25zOlB1Ymxpc2hcXFxcXCIsXG4gICAgICBcXFxcXCJzMzpHZXRPYmplY3RcXFxcXCJcbiAgICBdLFxuICAgIFxcXFxcIkVmZmVjdFxcXFxcIjogXFxcXFwiQWxsb3dcXFxcXCIsXG4gICAgXFxcXFwiUmVzb3VyY2VcXFxcXCI6IFxcXFxcIihNeVN0YWNrL1NvbWVSZXNvdXJjZS5SZWYpXFxcXFwiXG4gIH1cbl1cblxuSWRlbnRpdHkgUG9saWN5IFN0YXRlbWVudHM6XG5OT05FXCJcbmApO1xuICB9KTtcbn0pO1xuIl19