import { arrayWith } from '@aws-cdk/assert-internal';
import '@aws-cdk/assert-internal/jest';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as codebuild from '../lib';

test('can attach permissions boundary to Project', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const project = new codebuild.Project(stack, 'Project', {
    source: codebuild.Source.gitHub({ owner: 'a', repo: 'b' }),
  });
  iam.PermissionsBoundary.of(project).apply(new codebuild.UntrustedCodeBoundaryPolicy(stack, 'Boundary'));

  // THEN
  expect(stack).toHaveResourceLike('AWS::IAM::Role', {
    PermissionsBoundary: { Ref: 'BoundaryEA298153' },
  });
});

test('can add additional statements Boundary', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const project = new codebuild.Project(stack, 'Project', {
    source: codebuild.Source.gitHub({ owner: 'a', repo: 'b' }),
  });
  iam.PermissionsBoundary.of(project).apply(new codebuild.UntrustedCodeBoundaryPolicy(stack, 'Boundary', {
    additionalStatements: [
      new iam.PolicyStatement({
        actions: ['a:a'],
        resources: ['b'],
      }),
    ],
  }));

  // THEN
  expect(stack).toHaveResourceLike('AWS::IAM::ManagedPolicy', {
    PolicyDocument: {
      Statement: arrayWith({
        Effect: 'Allow',
        Action: 'a:a',
        Resource: 'b',
      }),
    },
  });
});