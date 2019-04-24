import events = require('@aws-cdk/aws-events');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');
import targets = require('../../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'lambda-events');

const fn = new lambda.Function(stack, 'MyFunc', {
  runtime: lambda.Runtime.NodeJS610,
  handler: 'index.handler',
  code: lambda.Code.inline(`exports.handler = ${handler.toString()}`)
});

const timer = new events.EventRule(stack, 'Timer', { scheduleExpression: 'rate(1 minute)' });
timer.addTarget(new targets.LambdaFunction(fn));

const timer2 = new events.EventRule(stack, 'Timer2', { scheduleExpression: 'rate(2 minutes)' });
timer2.addTarget(new targets.LambdaFunction(fn));

app.run();

// tslint:disable:no-console
function handler(event: any, _context: any, callback: any) {
  console.log(JSON.stringify(event, undefined, 2));
  return callback();
}
