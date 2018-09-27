import events = require('@aws-cdk/aws-events');
import cdk = require('@aws-cdk/cdk');
import lambda = require('../lib');

const app = new cdk.App(process.argv);

const stack = new cdk.Stack(app, 'lambda-events');

const fn = new lambda.Function(stack, 'MyFunc', {
  runtime: lambda.Runtime.NodeJS610,
  handler: 'index.handler',
  code: lambda.Code.inline(`exports.handler = ${handler.toString()}`)
});

const timer = new events.EventRule(stack, 'Timer', { scheduleExpression: 'rate(1 minute)' });
timer.addTarget(fn);

const timer2 = new events.EventRule(stack, 'Timer2', { scheduleExpression: 'rate(2 minutes)' });
timer2.addTarget(fn);

process.stdout.write(app.run());

// tslint:disable:no-console
function handler(event: any, _context: any, callback: any) {
  console.log(JSON.stringify(event, undefined, 2));
  return callback();
}
