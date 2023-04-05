import { App, CfnOutput, SecretValue, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { User } from 'aws-cdk-lib/aws-iam';

const app = new App();

const stack = new Stack(app, 'aws-cdk-iam-user');

new User(stack, 'MyUser', {
  userName: 'benisrae',
  password: SecretValue.unsafePlainText('Test1234567890!'),
  passwordResetRequired: true,
});

const userImportedByArn = User.fromUserArn(stack, 'ImportedUserByArn', 'arn:aws:iam::123456789012:user/rossrhodes');
const userImportedByArnWithPath = User.fromUserArn(stack, 'ImportedUserByArnPath', 'arn:aws:iam::123456789012:user/path/johndoe');
const userImportedByArnPathMultiple = User.fromUserArn(stack, 'ImportedUserByArnPathMultiple', 'arn:aws:iam::123456789012:user/p/a/t/h/johndoe');
const userImportedByAttributes = User.fromUserAttributes(stack, 'ImportedUserByAttributes', {
  userArn: 'arn:aws:iam::123456789012:user/johndoe',
});
const userImportedByAttributesPath = User.fromUserAttributes(stack, 'ImportedUserByAttributesPath', {
  userArn: 'arn:aws:iam::123456789012:user/path/johndoe',
});
const userImportedByAttributesPathMultiple = User.fromUserAttributes(stack, 'ImportedUserByAttributesPathMultiple', {
  userArn: 'arn:aws:iam::123456789012:user/p/a/t/h/johndoe',
});
const userImportedByName = User.fromUserName(stack, 'ImportedUserByName', 'janedoe');

new CfnOutput(stack, 'NameForUserImportedByArn', { value: userImportedByArn.userName });
new CfnOutput(stack, 'NameForUserImportedByArnPath', { value: userImportedByArnWithPath.userName });
new CfnOutput(stack, 'NameForUserImportedByArnPathMultiple', { value: userImportedByArnPathMultiple.userName });
new CfnOutput(stack, 'NameForUserImportedByAttributes', { value: userImportedByAttributes.userName });
new CfnOutput(stack, 'NameForUserImportedByAttributesPath', { value: userImportedByAttributesPath.userName });
new CfnOutput(stack, 'NameForUserImportedByAttributesPathMultiple', { value: userImportedByAttributesPathMultiple.userName });
new CfnOutput(stack, 'NameForUserImportedByName', { value: userImportedByName.userName });

new IntegTest(app, 'iam-user-test', {
  testCases: [stack],
});

app.synth();
