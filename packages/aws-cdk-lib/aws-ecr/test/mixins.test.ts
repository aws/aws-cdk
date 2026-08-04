import { Construct } from 'constructs';
import { Template } from '../../assertions';
import * as cdk from '../../core';
import * as ecr from '../lib';
import { RepositoryAutoDeleteImages } from '../lib/mixins';

class TestConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
  }
}

describe('ECR Mixins', () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack');
  });

  describe('RepositoryAutoDeleteImages', () => {
    test('sets emptyOnDelete on repository', () => {
      const repo = new ecr.CfnRepository(stack, 'Repo');
      repo.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
      repo.with(new RepositoryAutoDeleteImages());

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::ECR::Repository', {
        EmptyOnDelete: true,
      });
    });

    test('removal policy can be set after mixin is applied', () => {
      const repo = new ecr.CfnRepository(stack, 'Repo');
      repo.with(new RepositoryAutoDeleteImages());
      repo.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::ECR::Repository', {
        EmptyOnDelete: true,
      });
    });

    test('can be applied retrospectively to an L2 repository', () => {
      new ecr.Repository(stack, 'Repo', {
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }).with(new RepositoryAutoDeleteImages());

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::ECR::Repository', {
        EmptyOnDelete: true,
      });
    });

    test('does not support non-ECR constructs', () => {
      const construct = new TestConstruct(stack, 'test');
      const mixin = new RepositoryAutoDeleteImages();

      expect(mixin.supports(construct)).toBe(false);
    });
  });
});
