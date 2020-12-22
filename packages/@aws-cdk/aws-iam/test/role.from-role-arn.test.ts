import '@aws-cdk/assert/jest';
import { App, CfnElement, Lazy, Stack } from '@aws-cdk/core';
import { AnyPrincipal, ArnPrincipal, IRole, Policy, PolicyStatement, Role } from '../lib';

/* eslint-disable quote-props */

const roleAccount = '123456789012';
const notRoleAccount = '012345678901';

describe('IAM Role.fromRoleArn', () => {
  let app: App;

  beforeEach(() => {
    app = new App();
  });

  let roleStack: Stack;
  let importedRole: IRole;

  describe('imported with a static ARN', () => {
    const roleName = 'MyRole';

    describe('into an env-agnostic stack', () => {
      beforeEach(() => {
        roleStack = new Stack(app, 'RoleStack');
        importedRole = Role.fromRoleArn(roleStack, 'ImportedRole',
          `arn:aws:iam::${roleAccount}:role/${roleName}`);
      });

      test('correctly parses the imported role ARN', () => {
        expect(importedRole.roleArn).toBe(`arn:aws:iam::${roleAccount}:role/${roleName}`);
      });

      test('correctly parses the imported role name', () => {
        expect(importedRole.roleName).toBe(roleName);
      });

      describe('then adding a PolicyStatement to it', () => {
        let addToPolicyResult: boolean;

        beforeEach(() => {
          addToPolicyResult = importedRole.addToPolicy(somePolicyStatement());
        });

        test('returns true', () => {
          expect(addToPolicyResult).toBe(true);
        });

        test("generates a default Policy resource pointing at the imported role's physical name", () => {
          assertRoleHasDefaultPolicy(roleStack, roleName);
        });
      });

      describe('then attaching a Policy to it', () => {
        let policyStack: Stack;

        describe('that belongs to the same stack as the imported role', () => {
          beforeEach(() => {
            importedRole.attachInlinePolicy(somePolicy(roleStack, 'MyPolicy'));
          });

          test('correctly attaches the Policy to the imported role', () => {
            assertRoleHasAttachedPolicy(roleStack, roleName, 'MyPolicy');
          });
        });

        describe('that belongs to a different env-agnostic stack', () => {
          beforeEach(() => {
            policyStack = new Stack(app, 'PolicyStack');
            importedRole.attachInlinePolicy(somePolicy(policyStack, 'MyPolicy'));
          });

          test('correctly attaches the Policy to the imported role', () => {
            assertRoleHasAttachedPolicy(policyStack, roleName, 'MyPolicy');
          });
        });

        describe('that belongs to a targeted stack, with account set to', () => {
          describe('the same account as in the ARN of the imported role', () => {
            beforeEach(() => {
              policyStack = new Stack(app, 'PolicyStack', { env: { account: roleAccount } });
              importedRole.attachInlinePolicy(somePolicy(policyStack, 'MyPolicy'));
            });

            test('correctly attaches the Policy to the imported role', () => {
              assertRoleHasAttachedPolicy(policyStack, roleName, 'MyPolicy');
            });
          });

          describe('a different account than in the ARN of the imported role', () => {
            beforeEach(() => {
              policyStack = new Stack(app, 'PolicyStack', { env: { account: notRoleAccount } });
              importedRole.attachInlinePolicy(somePolicy(policyStack, 'MyPolicy'));
            });

            test('does NOT attach the Policy to the imported role', () => {
              assertPolicyDidNotAttachToRole(policyStack, 'MyPolicy');
            });
          });
        });
      });
    });

    describe('into a targeted stack with account set to', () => {
      describe('the same account as in the ARN the role was imported with', () => {
        beforeEach(() => {
          roleStack = new Stack(app, 'RoleStack', { env: { account: roleAccount } });
          importedRole = Role.fromRoleArn(roleStack, 'ImportedRole',
            `arn:aws:iam::${roleAccount}:role/${roleName}`);
        });

        describe('then adding a PolicyStatement to it', () => {
          let addToPolicyResult: boolean;

          beforeEach(() => {
            addToPolicyResult = importedRole.addToPolicy(somePolicyStatement());
          });

          test('returns true', () => {
            expect(addToPolicyResult).toBe(true);
          });

          test("generates a default Policy resource pointing at the imported role's physical name", () => {
            assertRoleHasDefaultPolicy(roleStack, roleName);
          });
        });

        describe('then attaching a Policy to it', () => {
          describe('that belongs to the same stack as the imported role', () => {
            beforeEach(() => {
              importedRole.attachInlinePolicy(somePolicy(roleStack, 'MyPolicy'));
            });

            test('correctly attaches the Policy to the imported role', () => {
              assertRoleHasAttachedPolicy(roleStack, roleName, 'MyPolicy');
            });
          });

          describe('that belongs to an env-agnostic stack', () => {
            let policyStack: Stack;

            beforeEach(() => {
              policyStack = new Stack(app, 'PolicyStack');
              importedRole.attachInlinePolicy(somePolicy(policyStack, 'MyPolicy'));
            });

            test('correctly attaches the Policy to the imported role', () => {
              assertRoleHasAttachedPolicy(policyStack, roleName, 'MyPolicy');
            });
          });

          describe('that belongs to a targeted stack, with account set to', () => {
            let policyStack: Stack;

            describe('the same account as in the imported role ARN and in the stack the imported role belongs to', () => {
              beforeEach(() => {
                policyStack = new Stack(app, 'PolicyStack', { env: { account: roleAccount } });
                importedRole.attachInlinePolicy(somePolicy(policyStack, 'MyPolicy'));
              });

              test('correctly attaches the Policy to the imported role', () => {
                assertRoleHasAttachedPolicy(policyStack, roleName, 'MyPolicy');
              });
            });

            describe('a different account than in the imported role ARN and in the stack the imported role belongs to', () => {
              beforeEach(() => {
                policyStack = new Stack(app, 'PolicyStack', { env: { account: notRoleAccount } });
                importedRole.attachInlinePolicy(somePolicy(policyStack, 'MyPolicy'));
              });

              test('does NOT attach the Policy to the imported role', () => {
                assertPolicyDidNotAttachToRole(policyStack, 'MyPolicy');
              });
            });
          });
        });
      });

      describe('a different account than in the ARN the role was imported with', () => {
        beforeEach(() => {
          roleStack = new Stack(app, 'RoleStack', { env: { account: notRoleAccount } });
          importedRole = Role.fromRoleArn(roleStack, 'ImportedRole',
            `arn:aws:iam::${roleAccount}:role/${roleName}`);
        });

        describe('then adding a PolicyStatement to it', () => {
          let addToPolicyResult: boolean;

          beforeEach(() => {
            addToPolicyResult = importedRole.addToPolicy(somePolicyStatement());
          });

          test('pretends to succeed', () => {
            expect(addToPolicyResult).toBe(true);
          });

          test("does NOT generate a default Policy resource pointing at the imported role's physical name", () => {
            expect(roleStack).not.toHaveResourceLike('AWS::IAM::Policy');
          });
        });

        describe('then attaching a Policy to it', () => {
          describe('that belongs to the same stack as the imported role', () => {
            beforeEach(() => {
              importedRole.attachInlinePolicy(somePolicy(roleStack, 'MyPolicy'));
            });

            test('does NOT attach the Policy to the imported role', () => {
              assertPolicyDidNotAttachToRole(roleStack, 'MyPolicy');
            });
          });

          describe('that belongs to an env-agnostic stack', () => {
            let policyStack: Stack;

            beforeEach(() => {
              policyStack = new Stack(app, 'PolicyStack');
              importedRole.attachInlinePolicy(somePolicy(policyStack, 'MyPolicy'));
            });

            test('does NOT attach the Policy to the imported role', () => {
              assertPolicyDidNotAttachToRole(policyStack, 'MyPolicy');
            });
          });

          describe('that belongs to a different targeted stack, with account set to', () => {
            let policyStack: Stack;

            describe('the same account as in the ARN of the imported role', () => {
              beforeEach(() => {
                policyStack = new Stack(app, 'PolicyStack', { env: { account: roleAccount } });
                importedRole.attachInlinePolicy(somePolicy(policyStack, 'MyPolicy'));
              });

              test('does NOT attach the Policy to the imported role', () => {
                assertPolicyDidNotAttachToRole(policyStack, 'MyPolicy');
              });
            });

            describe('the same account as in the stack the imported role belongs to', () => {
              beforeEach(() => {
                policyStack = new Stack(app, 'PolicyStack', { env: { account: notRoleAccount } });
                importedRole.attachInlinePolicy(somePolicy(policyStack, 'MyPolicy'));
              });

              test('does NOT attach the Policy to the imported role', () => {
                assertPolicyDidNotAttachToRole(policyStack, 'MyPolicy');
              });
            });

            describe('a third account, different from both the role and scope stack accounts', () => {
              beforeEach(() => {
                policyStack = new Stack(app, 'PolicyStack', { env: { account: 'some-random-account' } });
                importedRole.attachInlinePolicy(somePolicy(policyStack, 'MyPolicy'));
              });

              test('does NOT attach the Policy to the imported role', () => {
                assertPolicyDidNotAttachToRole(policyStack, 'MyPolicy');
              });
            });
          });
        });
      });
    });

    describe('and with mutable=false', () => {
      beforeEach(() => {
        roleStack = new Stack(app, 'RoleStack');
        importedRole = Role.fromRoleArn(roleStack, 'ImportedRole',
          `arn:aws:iam::${roleAccount}:role/${roleName}`, { mutable: false });
      });

      describe('then adding a PolicyStatement to it', () => {
        let addToPolicyResult: boolean;

        beforeEach(() => {
          addToPolicyResult = importedRole.addToPolicy(somePolicyStatement());
        });

        test('pretends to succeed', () => {
          expect(addToPolicyResult).toBe(true);
        });

        test("does NOT generate a default Policy resource pointing at the imported role's physical name", () => {
          expect(roleStack).not.toHaveResourceLike('AWS::IAM::Policy');
        });
      });

      describe('then attaching a Policy to it', () => {
        let policyStack: Stack;

        describe('that belongs to a stack with account equal to the account in the imported role ARN', () => {
          beforeEach(() => {
            policyStack = new Stack(app, 'PolicyStack', { env: { account: roleAccount } });
            importedRole.attachInlinePolicy(somePolicy(policyStack, 'MyPolicy'));
          });

          test('does NOT attach the Policy to the imported role', () => {
            assertPolicyDidNotAttachToRole(policyStack, 'MyPolicy');
          });
        });
      });
    });
  });

  describe('imported with a dynamic ARN', () => {
    const dynamicValue = Lazy.string({ produce: () => 'role-arn' });
    const roleName: any = {
      'Fn::Select': [1,
        {
          'Fn::Split': ['/',
            {
              'Fn::Select': [5,
                { 'Fn::Split': [':', 'role-arn'] }],
            }],
        }],
    };

    describe('into an env-agnostic stack', () => {
      beforeEach(() => {
        roleStack = new Stack(app, 'RoleStack');
        importedRole = Role.fromRoleArn(roleStack, 'ImportedRole', dynamicValue);
      });

      test('correctly parses the imported role ARN', () => {
        expect(importedRole.roleArn).toBe(dynamicValue);
      });

      test('correctly parses the imported role name', () => {
        new Role(roleStack, 'AnyRole', {
          roleName: 'AnyRole',
          assumedBy: new ArnPrincipal(importedRole.roleName),
        });

        expect(roleStack).toHaveResourceLike('AWS::IAM::Role', {
          'AssumeRolePolicyDocument': {
            'Statement': [
              {
                'Action': 'sts:AssumeRole',
                'Effect': 'Allow',
                'Principal': {
                  'AWS': roleName,
                },
              },
            ],
          },
        });
      });

      describe('then adding a PolicyStatement to it', () => {
        let addToPolicyResult: boolean;

        beforeEach(() => {
          addToPolicyResult = importedRole.addToPolicy(somePolicyStatement());
        });

        test('returns true', () => {
          expect(addToPolicyResult).toBe(true);
        });

        test("generates a default Policy resource pointing at the imported role's physical name", () => {
          assertRoleHasDefaultPolicy(roleStack, roleName);
        });
      });

      describe('then attaching a Policy to it', () => {
        let policyStack: Stack;

        describe('that belongs to the same stack as the imported role', () => {
          beforeEach(() => {
            importedRole.attachInlinePolicy(somePolicy(roleStack, 'MyPolicy'));
          });

          test('correctly attaches the Policy to the imported role', () => {
            assertRoleHasAttachedPolicy(roleStack, roleName, 'MyPolicy');
          });
        });

        describe('that belongs to a different env-agnostic stack', () => {
          beforeEach(() => {
            policyStack = new Stack(app, 'PolicyStack');
            importedRole.attachInlinePolicy(somePolicy(policyStack, 'MyPolicy'));
          });

          test('correctly attaches the Policy to the imported role', () => {
            assertRoleHasAttachedPolicy(policyStack, roleName, 'MyPolicy');
          });
        });

        describe('that belongs to a targeted stack', () => {
          beforeEach(() => {
            policyStack = new Stack(app, 'PolicyStack', { env: { account: roleAccount } });
            importedRole.attachInlinePolicy(somePolicy(policyStack, 'MyPolicy'));
          });

          test('correctly attaches the Policy to the imported role', () => {
            assertRoleHasAttachedPolicy(policyStack, roleName, 'MyPolicy');
          });
        });
      });
    });

    describe('into a targeted stack with account set', () => {
      beforeEach(() => {
        roleStack = new Stack(app, 'RoleStack', { env: { account: roleAccount } });
        importedRole = Role.fromRoleArn(roleStack, 'ImportedRole', dynamicValue);
      });

      describe('then adding a PolicyStatement to it', () => {
        let addToPolicyResult: boolean;

        beforeEach(() => {
          addToPolicyResult = importedRole.addToPolicy(somePolicyStatement());
        });

        test('returns true', () => {
          expect(addToPolicyResult).toBe(true);
        });

        test("generates a default Policy resource pointing at the imported role's physical name", () => {
          assertRoleHasDefaultPolicy(roleStack, roleName);
        });
      });

      describe('then attaching a Policy to it', () => {
        let policyStack: Stack;

        describe('that belongs to the same stack as the imported role', () => {
          beforeEach(() => {
            importedRole.attachInlinePolicy(somePolicy(roleStack, 'MyPolicy'));
          });

          test('correctly attaches the Policy to the imported role', () => {
            assertRoleHasAttachedPolicy(roleStack, roleName, 'MyPolicy');
          });
        });

        describe('that belongs to an env-agnostic stack', () => {
          beforeEach(() => {
            policyStack = new Stack(app, 'PolicyStack');
            importedRole.attachInlinePolicy(somePolicy(policyStack, 'MyPolicy'));
          });

          test('correctly attaches the Policy to the imported role', () => {
            assertRoleHasAttachedPolicy(policyStack, roleName, 'MyPolicy');
          });
        });

        describe('that belongs to a different targeted stack, with account set to', () => {
          describe('the same account as the stack the role was imported into', () => {
            beforeEach(() => {
              policyStack = new Stack(app, 'PolicyStack', { env: { account: roleAccount } });
              importedRole.attachInlinePolicy(somePolicy(policyStack, 'MyPolicy'));
            });

            test('correctly attaches the Policy to the imported role', () => {
              assertRoleHasAttachedPolicy(policyStack, roleName, 'MyPolicy');
            });
          });

          describe('a different account than the stack the role was imported into', () => {
            beforeEach(() => {
              policyStack = new Stack(app, 'PolicyStack', { env: { account: notRoleAccount } });
              importedRole.attachInlinePolicy(somePolicy(policyStack, 'MyPolicy'));
            });

            test('correctly attaches the Policy to the imported role', () => {
              assertRoleHasAttachedPolicy(policyStack, roleName, 'MyPolicy');
            });
          });
        });
      });
    });
  });

  describe('imported with the ARN of a service role', () => {
    beforeEach(() => {
      roleStack = new Stack();
    });

    describe('without a service principal in the role name', () => {
      beforeEach(() => {
        importedRole = Role.fromRoleArn(roleStack, 'Role',
          `arn:aws:iam::${roleAccount}:role/service-role/codebuild-role`);
      });

      it("correctly strips the 'service-role' prefix from the role name", () => {
        new Policy(roleStack, 'Policy', {
          statements: [somePolicyStatement()],
          roles: [importedRole],
        });

        expect(roleStack).toHaveResourceLike('AWS::IAM::Policy', {
          'Roles': [
            'codebuild-role',
          ],
        });
      });
    });

    describe('with a service principal in the role name', () => {
      beforeEach(() => {
        importedRole = Role.fromRoleArn(roleStack, 'Role',
          `arn:aws:iam::${roleAccount}:role/aws-service-role/anyservice.amazonaws.com/codebuild-role`);
      });

      it("correctly strips both the 'aws-service-role' prefix and the service principal from the role name", () => {
        new Policy(roleStack, 'Policy', {
          statements: [somePolicyStatement()],
          roles: [importedRole],
        });

        expect(roleStack).toHaveResourceLike('AWS::IAM::Policy', {
          'Roles': [
            'codebuild-role',
          ],
        });
      });
    });
  });
});

function somePolicyStatement() {
  return new PolicyStatement({
    actions: ['s3:*'],
    resources: ['xyz'],
  });
}

function somePolicy(policyStack: Stack, policyName: string) {
  const someRole = new Role(policyStack, 'SomeExampleRole', {
    assumedBy: new AnyPrincipal(),
  });
  const roleResource = someRole.node.defaultChild as CfnElement;
  roleResource.overrideLogicalId('SomeRole'); // force a particular logical ID in the Ref expression

  return new Policy(policyStack, 'MyPolicy', {
    policyName,
    statements: [somePolicyStatement()],
    // need at least one of user/group/role, otherwise validation fails
    roles: [someRole],
  });
}

function assertRoleHasDefaultPolicy(stack: Stack, roleName: string) {
  _assertStackContainsPolicyResource(stack, [roleName], undefined);
}

function assertRoleHasAttachedPolicy(stack: Stack, roleName: string, attachedPolicyName: string) {
  _assertStackContainsPolicyResource(stack, [{ Ref: 'SomeRole' }, roleName], attachedPolicyName);
}

function assertPolicyDidNotAttachToRole(stack: Stack, policyName: string) {
  _assertStackContainsPolicyResource(stack, [{ Ref: 'SomeRole' }], policyName);
}

function _assertStackContainsPolicyResource(stack: Stack, roleNames: any[], nameOfPolicy: string | undefined) {
  const expected: any = {
    PolicyDocument: {
      Statement: [
        {
          Action: 's3:*',
          Effect: 'Allow',
          Resource: 'xyz',
        },
      ],
    },
    Roles: roleNames,
  };
  if (nameOfPolicy) {
    expected.PolicyName = nameOfPolicy;
  }

  expect(stack).toHaveResourceLike('AWS::IAM::Policy', expected);
}
