import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');
import sns = require('../lib');

class SnsToSqs extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
    super(parent, name, props);

    const topic = new sns.Topic(this, 'MyTopic');

    const fction = new lambda.InlineJavaScriptFunction(this, 'Echo', {
      handler: {
        fn: (event, _context, callback) => {
          // tslint:disable:no-console
          console.log('====================================================');
          console.log(JSON.stringify(event, undefined, 2));
          console.log('====================================================');
          return callback(undefined, event);
        }
      }
    });

    topic.subscribeLambda(fction);
  }
}

const app = new cdk.App(process.argv);

new SnsToSqs(app, 'aws-cdk-sns-lambda');

process.stdout.write(app.run());
