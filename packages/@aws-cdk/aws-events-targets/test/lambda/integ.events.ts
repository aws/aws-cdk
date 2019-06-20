import events = require('@aws-cdk/aws-events');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');
import targets = require('../../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'lambda-events');

const fn = new lambda.Function(stack, 'MyFunc', {
  runtime: lambda.Runtime.Nodejs810,
  handler: 'index.handler',
  code: lambda.Code.inline(`exports.handler = ${handler.toString()}`)
});

const timer = new events.Rule(stack, 'Timer', {
  schedule: events.Schedule.rate(1, events.TimeUnit.Minute),
});
timer.addTarget(new targets.LambdaFunction(fn));

const timer2 = new events.Rule(stack, 'Timer2', {
  schedule: events.Schedule.rate(2, events.TimeUnit.Minute),
});
timer2.addTarget(new targets.LambdaFunction(fn));

app.synth();

// tslint:disable:no-console
function handler(event: any, _context: any, callback: any) {
  console.log(JSON.stringify(event, undefined, 2));
  return callback();
}
