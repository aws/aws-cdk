import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
/*
 * Stack verification steps:
 *
 * -- aws stepfunctions describe-state-machine --state-machine-arn <stack-output> has a status of `ACTIVE`
 * -- aws iam get-role-policy --role-name <role-name> --policy-name <policy-name> has all actions mapped to respective resources.
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-integ');

const wait = new sfn.Wait(stack, 'wait time', {
  time: sfn.WaitTime.secondsPath('$.waitSeconds'),
});

const shortWait = new sfn.Wait(stack, 'short wait time', {
  time: sfn.WaitTime.duration(cdk.Duration.seconds(1)),
});

const choice = new sfn.Choice(stack, 'choice', {
  comment: 'this is a comment for the choice state',
});

const success = new sfn.Succeed(stack, 'success');

choice.when(sfn.Condition.isPresent('$.success'), success, {
  comment: 'this is a comment for the when condition',
});
choice.when(sfn.Condition.isPresent('$.noComment'), shortWait);
choice.otherwise(success);
wait.next(choice);
shortWait.next(success);

const role = new iam.Role(stack, 'Role', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
});

const stateMachine = new sfn.StateMachine(stack, 'StateMachine', {
  definitionBody: sfn.DefinitionBody.fromChainable(wait),
  comment: 'a super cool state machine',
});

stateMachine.grantRead(role);
stateMachine.grant(role, 'states:SendTaskSuccess');

app.synth();
