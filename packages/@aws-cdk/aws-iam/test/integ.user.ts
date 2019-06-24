import { App, SecretValue, Stack } from "@aws-cdk/core";
import { User } from "../lib";

const app = new App();

const stack = new Stack(app, 'aws-cdk-iam-user');

new User(stack, 'MyUser', {
  userName: 'benisrae',
  password: SecretValue.plainText('1234'),
  passwordResetRequired: true
});

app.synth();
