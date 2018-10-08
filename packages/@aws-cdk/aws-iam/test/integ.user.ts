import { App, Stack } from "@aws-cdk/cdk";
import { User } from "../lib";

const app = new App();

const stack = new Stack(app, 'aws-cdk-iam-user');

new User(stack, 'MyUser', {
  userName: 'benisrae',
  password: '1234',
  passwordResetRequired: true
});

app.run();
