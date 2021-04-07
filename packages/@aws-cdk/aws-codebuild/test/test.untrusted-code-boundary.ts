import { expect, haveResourceLike, arrayWith } from '@aws-cdk/assert-internal';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as codebuild from '../lib';

export = {
  'can attach permissions boundary to Project'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const project = new codebuild.Project(stack, 'Project', {
      source: codebuild.Source.gitHub({ owner: 'a', repo: 'b' }),
    });
    iam.PermissionsBoundary.of(project).apply(new codebuild.UntrustedCodeBoundaryPolicy(stack, 'Boundary'));

    // THEN
    expect(stack).to(haveResourceLike('AWS::IAM::Role', {
      PermissionsBoundary: { Ref: 'BoundaryEA298153' },
    }));

    test.done();
  },

  'can add additional statements Boundary'(test: Test) {
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
    expect(stack).to(haveResourceLike('AWS::IAM::ManagedPolicy', {
      PolicyDocument: {
        Statement: arrayWith({
          Effect: 'Allow',
          Action: 'a:a',
          Resource: 'b',
        }),
      },
    }));

    test.done();
  },
};