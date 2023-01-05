import { Template, Match } from '@aws-cdk/assertions';
import { CfnResource, Resource, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
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

  test('can combine two grants', () => {
    // GIVEN
    const role1 = new iam.Role(stack, 'Role1', {
      assumedBy: new iam.ServicePrincipal('bla.amazonaws.com'),
    });
    const role2 = new iam.Role(stack, 'Role2', {
      assumedBy: new iam.ServicePrincipal('bla.amazonaws.com'),
    });

    // WHEN
    const g1 = iam.Grant.addToPrincipal({
      actions: ['service:DoAThing'],
      grantee: role1,
      resourceArns: ['*'],
    });
    const g2 = iam.Grant.addToPrincipal({
      actions: ['service:DoAThing'],
      grantee: role2,
      resourceArns: ['*'],
    });

    (g1.combine(g2)).applyBefore(resource);

    // THEN
    expectDependencyOn('Role1DefaultPolicyD3EF4D0A');
    expectDependencyOn('Role2DefaultPolicy3A7A0A1B');
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
  Template.fromStack(stack).hasResource('CDK::Test::SomeResource', {
    DependsOn: Match.arrayWith([id]),
  });
}

class FakeResourceWithPolicy extends Resource implements iam.IResourceWithPolicy {
  private readonly policy: CfnResource;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.policy = new CfnResource(this, 'Policy', {
      type: 'CDK::Test::BuckarooPolicy',
    });
  }

  public addToResourcePolicy(_statement: iam.PolicyStatement): iam.AddToResourcePolicyResult {
    return { statementAdded: true, policyDependable: this.policy };
  }
}
