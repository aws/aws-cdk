import { App, Stack, StackProps } from '@aws-cdk/cdk';
import { InlineJavaScriptLambda } from '@aws-cdk/lambda';
import { Topic } from '../lib';

class SnsToSqs extends Stack {
    constructor(parent: App, name: string, props?: StackProps) {
        super(parent, name, props);

        const topic = new Topic(this, 'MyTopic');

        const lambda = new InlineJavaScriptLambda(this, 'Echo', {
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

        topic.subscribeLambda(lambda);
    }
}

const app = new App(process.argv);

new SnsToSqs(app, 'aws-cdk-sns-lambda');

process.stdout.write(app.run());
