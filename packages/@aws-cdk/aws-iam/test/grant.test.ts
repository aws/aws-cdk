import { ResourcePart } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import { CfnResource, Construct, Stack } from '@aws-cdk/core';
import * as iam from '../lib';

let stack: Stack;
let resource: CfnResource;
beforeEach(() => {
  stack = new Stack();
  resource = new CfnResource(stack, 'SomeResource', {
    type: 'CDK::Test::SomeResource',
  });
});

describe('IAM grant', () => {
  test('Grant.drop() returns a no-op grant', () => {
    const user = new iam.User(stack, 'poo');
    const grant = iam.Grant.drop(user, 'dropping me');

    expect(grant.success).toBeFalsy();
    expect(grant.principalStatement).toBeUndefined();
    expect(grant.resourceStatement).toBeUndefined();
  });
});

describe('Grant dependencies', () => {
  test('can depend on grant added to role', () => {
    // GIVEN
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('bla.amazonaws.com'),
    });

    // WHEN
    applyGrantWithDependencyTo(role);

    // THEN
    expectDependencyOn('RoleDefaultPolicy5FFB7DAB');
  });

  test('can depend on grant added to role wrapped with conditions', () => {
    // GIVEN
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('bla.amazonaws.com'),
    });

    // WHEN
    applyGrantWithDependencyTo(new iam.PrincipalWithConditions(role, {
      StringEquals: { 'aws:something': 'happy' },
    }));

    // THEN
    expectDependencyOn('RoleDefaultPolicy5FFB7DAB');
  });

  test('can depend on grant added to lazy role', () => {
    // GIVEN
    const role = new iam.LazyRole(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('bla.amazonaws.com'),
    });

    // WHEN
    applyGrantWithDependencyTo(role);
    Array.isArray(role.roleArn); // Force instantiation

    // THEN
    expectDependencyOn('RoleDefaultPolicy5FFB7DAB');
  });

  test('can depend on grant added to resource', () => {
    // WHEN
    iam.Grant.addToPrincipalOrResource({
      actions: ['service:DoAThing'],
      grantee: new iam.ServicePrincipal('bla.amazonaws.com'),
      resourceArns: ['*'],
      resource: new FakeResourceWithPolicy(stack, 'Buckaroo'),
    }).applyBefore(resource);

    // THEN
    expectDependencyOn('BuckarooPolicy74174DA4');
  });

  test('can depend on grant added to principal AND resource', () => {
    // GIVEN
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('bla.amazonaws.com'),
    });

    // WHEN
    iam.Grant.addToPrincipalAndResource({
      actions: ['service:DoAThing'],
      grantee: role,
      resourceArns: ['*'],
      resource: new FakeResourceWithPolicy(stack, 'Buckaroo'),
    }).applyBefore(resource);

    // THEN
    expectDependencyOn('RoleDefaultPolicy5FFB7DAB');
    expectDependencyOn('BuckarooPolicy74174DA4');
  });
});

function applyGrantWithDependencyTo(principal: iam.IPrincipal) {
  iam.Grant.addToPrincipal({
    actions: ['service:DoAThing'],
    grantee: principal,
    resourceArns: ['*'],
  }).applyBefore(resource);
}

function expectDependencyOn(id: string) {
  expect(stack).toHaveResource('CDK::Test::SomeResource', (props: any) => {
    return (props?.DependsOn ?? []).includes(id);
  }, ResourcePart.CompleteDefinition);
}

class FakeResourceWithPolicy extends CfnResource implements iam.IResourceWithPolicy {
  private policy: CfnResource;

  constructor(scope: Construct, id: string) {
    super(scope, id, {
      type: 'CDK::Test::Buckaroo',
    });
    this.policy = new CfnResource(this, 'Policy', {
      type: 'CDK::Test::BuckarooPolicy',
    });
  }

  public addToResourcePolicy(_statement: iam.PolicyStatement): iam.AddToResourcePolicyResult {
    return { statementAdded: true, policyDependable: this.policy };
  }
}