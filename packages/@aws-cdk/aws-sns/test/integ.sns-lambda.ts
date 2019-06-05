import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');
import sns = require('../lib');

class SnsToSqs extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const topic = new sns.Topic(this, 'MyTopic');

    const fction = new lambda.Function(this, 'Echo', {
      handler: 'index.handler',
      runtime: lambda.Runtime.NodeJS810,
      code: lambda.Code.inline(`exports.handler = ${handler.toString()}`)
    });

    topic.subscribeLambda(fction);
  }
}

const app = new cdk.App();

new SnsToSqs(app, 'aws-cdk-sns-lambda');

app.synth();

function handler(event: any, _context: any, callback: any) {
  // tslint:disable:no-console
  console.log('====================================================');
  console.log(JSON.stringify(event, undefined, 2));
  console.log('====================================================');
  return callback(undefined, event);
}
