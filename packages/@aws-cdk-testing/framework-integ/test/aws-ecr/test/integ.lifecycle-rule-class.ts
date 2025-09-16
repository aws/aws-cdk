import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

/**
 * Integration test for LifecycleRuleClass with L1 construct usage
 *
 * This test validates:
 * 1. LifecycleRuleClass can be instantiated with various configurations
 * 2. toJSON() method produces correct CloudFormation-compatible JSON
 * 3. Integration with CfnRepositoryCreationTemplate works correctly
 * 4. CloudFormation template generation is accurate
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'LifecycleRuleClassTest');

// Test 1: Basic LifecycleRuleClass with CfnRepositoryCreationTemplate
const basicLifecycleRule = new ecr.LifecycleRuleClass({
  rulePriority: 1,
  maxImageCount: 5,
  tagStatus: ecr.TagStatus.TAGGED,
  tagPrefixList: ['prod'],
});

new ecr.CfnRepositoryCreationTemplate(stack, 'BasicTemplate', {
  appliedFor: ['PULL_THROUGH_CACHE'],
  prefix: 'basic-test',
  lifecyclePolicy: JSON.stringify({
    rules: [basicLifecycleRule.toJSON()],
  }),
});

// Test 2: Multiple LifecycleRuleClass instances with different configurations
const multipleRules = [
  new ecr.LifecycleRuleClass({
    rulePriority: 1,
    description: 'Keep production images',
    tagPrefixList: ['prod'],
    maxImageCount: 100,
  }),
  new ecr.LifecycleRuleClass({
    rulePriority: 2,
    description: 'Clean up untagged images',
    tagStatus: ecr.TagStatus.UNTAGGED,
    maxImageAge: cdk.Duration.days(1),
  }),
];

new ecr.CfnRepositoryCreationTemplate(stack, 'MultiRuleTemplate', {
  appliedFor: ['PULL_THROUGH_CACHE'],
  prefix: 'multi-rule-test',
  lifecyclePolicy: JSON.stringify({
    rules: multipleRules.map(rule => rule.toJSON()),
  }),
});

// Test 3: LifecycleRuleClass with age-based rule
const ageBasedRule = new ecr.LifecycleRuleClass({
  rulePriority: 1,
  description: 'Age-based cleanup',
  tagStatus: ecr.TagStatus.ANY,
  maxImageAge: cdk.Duration.days(30),
});

new ecr.CfnRepositoryCreationTemplate(stack, 'AgeBasedTemplate', {
  appliedFor: ['PULL_THROUGH_CACHE'],
  prefix: 'age-based-test',
  lifecyclePolicy: JSON.stringify({
    rules: [ageBasedRule.toJSON()],
  }),
});

// Test 4: Verify backward compatibility - LifecycleRuleClass works with Repository
const repo = new ecr.Repository(stack, 'TestRepo');
const compatibilityRule = new ecr.LifecycleRuleClass({
  rulePriority: 1,
  maxImageCount: 10,
  tagPrefixList: ['test'],
});

repo.addLifecycleRule(compatibilityRule);

new IntegTest(app, 'LifecycleRuleClassIntegTest', {
  testCases: [stack],
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: false,
      },
    },
  },
});
