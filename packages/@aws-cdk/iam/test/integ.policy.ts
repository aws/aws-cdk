import { App, PolicyStatement, Stack } from "@aws-cdk/cdk";
import { Policy } from "../lib";
import { User } from "../lib/user";

const app = new App(process.argv);

const stack = new Stack(app, 'aws-cdk-iam-policy');

const user = new User(stack, 'MyUser');

const policy = new Policy(stack, 'HelloPolicy', { policyName: 'Default' });
policy.addStatement(new PolicyStatement().addResource('*').addAction('sqs:SendMessage'));
policy.attachToUser(user);

const policy2 = new Policy(stack, 'GoodbyePolicy');
policy2.addStatement(new PolicyStatement().addResource('*').addAction('lambda:InvokeFunction'));
policy2.attachToUser(user);

process.stdout.write(app.run());
