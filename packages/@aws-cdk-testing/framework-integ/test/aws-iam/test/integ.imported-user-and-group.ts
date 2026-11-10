import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Group, PolicyStatement, User } from 'aws-cdk-lib/aws-iam';

const app = new App();

const principalStack = new Stack(app, 'integ-iam-imported-principal-stack');

const user = new User(principalStack, 'TestUser');
const group = new Group(principalStack, 'TestGroup');

/**
 * Both stacks below import the same user and group and grant them a permission. Each stack gets an
 * inline policy of its own, so the grants made by the first stack survive the deployment of the
 * second one.
 */
const firstStack = new Stack(app, 'integ-iam-imported-principal-1');
firstStack.addStackDependency(principalStack);
const userInFirstStack = User.fromUserName(firstStack, 'User', user.userName);
userInFirstStack.addToPrincipalPolicy(new PolicyStatement({ resources: ['arn:aws:sqs:*:*:firstQueue'], actions: ['sqs:SendMessage'] }));
const groupInFirstStack = Group.fromGroupName(firstStack, 'Group', group.groupName);
groupInFirstStack.addToPrincipalPolicy(new PolicyStatement({ resources: ['arn:aws:sqs:*:*:firstQueue'], actions: ['sqs:SendMessage'] }));

const secondStack = new Stack(app, 'integ-iam-imported-principal-2');
secondStack.addStackDependency(firstStack, 'So that this stack can be tested after both are deployed.');
const userInSecondStack = User.fromUserName(secondStack, 'User', user.userName);
userInSecondStack.addToPrincipalPolicy(new PolicyStatement({ resources: ['arn:aws:sqs:*:*:secondQueue'], actions: ['sqs:SendMessage'] }));
const groupInSecondStack = Group.fromGroupName(secondStack, 'Group', group.groupName);
groupInSecondStack.addToPrincipalPolicy(new PolicyStatement({ resources: ['arn:aws:sqs:*:*:secondQueue'], actions: ['sqs:SendMessage'] }));

const assertionStack = new Stack(app, 'ImportedPrincipalTestAssertions');
assertionStack.addStackDependency(firstStack);
assertionStack.addStackDependency(secondStack);

const test = new integ.IntegTest(app, 'ImportedPrincipalTest', {
  testCases: [principalStack, firstStack, secondStack],
  assertionStack,
});

// Both stacks' inline policies are attached to the same principal, rather than the second one
// having replaced the first
test.assertions
  .awsApiCall('IAM', 'listUserPolicies', { UserName: user.userName })
  .expect(integ.ExpectedResult.objectLike({
    PolicyNames: integ.Match.arrayWith([
      integ.Match.stringLikeRegexp('^Policyintegiamimportedprincipal1User.{8}$'),
      integ.Match.stringLikeRegexp('^Policyintegiamimportedprincipal2User.{8}$'),
    ]),
  }));

test.assertions
  .awsApiCall('IAM', 'listGroupPolicies', { GroupName: group.groupName })
  .expect(integ.ExpectedResult.objectLike({
    PolicyNames: integ.Match.arrayWith([
      integ.Match.stringLikeRegexp('^DefaultPolicyintegiamimportedprincipal1Group.{8}$'),
      integ.Match.stringLikeRegexp('^DefaultPolicyintegiamimportedprincipal2Group.{8}$'),
    ]),
  }));
