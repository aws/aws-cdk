import { App, PolicyStatement, Stack } from "@aws-cdk/cdk";
import { Group, Policy, User } from "../lib";

const app = new App(process.argv);

const stack = new Stack(app, 'integ-iam-role-1');

const g1 = new Group(stack, 'MyGroup');
const g2 = new Group(stack, 'YourGroup');

for (let i = 0; i < 5; ++i) {
  const user = new User(stack, `User${i + 1}`);
  user.addToGroup(g1);
  g2.addUser(user);
}

const policy = new Policy(stack, 'MyPolicy');
policy.attachToGroup(g1);
policy.addStatement(new PolicyStatement().addResource(g2.groupArn).addAction('iam:*'));

process.stdout.write(app.run());
