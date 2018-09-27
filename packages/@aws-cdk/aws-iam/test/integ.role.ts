import { App, PolicyStatement, ServicePrincipal, Stack } from "@aws-cdk/cdk";
import { Policy, Role } from "../lib";

const app = new App(process.argv);

const stack = new Stack(app, 'integ-iam-role-1');

const role = new Role(stack, 'TestRole', {
  assumedBy: new ServicePrincipal('sqs.amazonaws.com')
});

role.addToPolicy(new PolicyStatement().addResource('*').addAction('sqs:SendMessage'));

const policy = new Policy(stack, 'HelloPolicy', { policyName: 'Default' });
policy.addStatement(new PolicyStatement().addAction('ec2:*').addResource('*'));
policy.attachToRole(role);

process.stdout.write(app.run());
