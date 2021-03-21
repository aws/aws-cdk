import { App, CfnOutput, SecretValue, Stack } from '@aws-cdk/core';
import { User } from '../lib';

const app = new App();

const stack = new Stack(app, 'aws-cdk-iam-user');

new User(stack, 'MyUser', {
  userName: 'benisrae',
  password: SecretValue.plainText('Test1234567890!'),
  passwordResetRequired: true,
});

const userImportedByArn = User.fromUserArn(stack, 'ImportedUserByArn', 'arn:aws:iam::123456789012:user/rossrhodes');
const userImportedByAttributes = User.fromUserAttributes(stack, 'ImportedUserByAttributes', {
  userArn: 'arn:aws:iam::123456789012:user/johndoe',
});
const userImportedByName = User.fromUserName(stack, 'ImportedUserByName', 'janedoe');

new CfnOutput(stack, 'NameForUserImportedByArn', { value: userImportedByArn.userName });
new CfnOutput(stack, 'NameForUserImportedByAttributes', { value: userImportedByAttributes.userName });
new CfnOutput(stack, 'NameForUserImportedByName', { value: userImportedByName.userName });

app.synth();
