import { App, Construct, Output, Stack, StackProps, Token } from 'aws-cdk';
import { LambdaInlineCode, LambdaRuntime } from 'aws-cdk-lambda';
import { s3 } from 'aws-cdk-resources';
import fs = require('fs');
import { CustomResource, LambdaBackedCustomResource } from '../lib';

interface DemoResourceProps {
    /**
     * Message to echo
     */
    message: string;

    /**
     * Set this to true to fail the CREATE invocation
     */
    failCreate?: boolean;
}

class DemoResource extends CustomResource {
    public readonly response: Token;

    constructor(parent: Construct, name: string, props: DemoResourceProps) {
        super(parent, name, {
            provider: new LambdaBackedCustomResource({
                uuid: 'f7d4f730-4ee1-11e8-9c2d-fa7ae01bbebc',
                lambdaProperties: {
                    // This makes the demo only work as top-level TypeScript program, but that's fine for now
                    code: new LambdaInlineCode(fs.readFileSync('provider.py', { encoding: 'utf-8' })),
                    handler: 'index.main',
                    timeout: 300,
                    runtime: LambdaRuntime.Python27,
                }
            }),
            properties: props
        });

        this.response = this.getAtt('Response');
    }
}

/**
 * A stack that only sets up the CustomResource and shows how to get an attribute from it
 */
class SucceedingStack extends Stack {
    constructor(parent: App, name: string, props?: StackProps) {
        super(parent, name, props);

        const resource = new DemoResource(this, 'DemoResource', {
            message: 'CustomResource says hello',
        });

        // Publish the custom resource output
        new Output(this, 'ResponseMessage', {
            description: 'The message that came back from the Custom Resource',
            value: resource.response
        });
    }
}

/**
 * A stack that sets up a failing CustomResource creation
 */
class FailCreationStack extends Stack {
    constructor(parent: App, name: string, props?: StackProps) {
        super(parent, name, props);

        new DemoResource(this, 'DemoResource', {
            message: 'CustomResource is silent',
            failCreate: true
        });
    }
}

/**
 * A stack that sets up the CustomResource and fails afterwards, to check that cleanup gets
 * done properly.
 */
class FailAfterCreatingStack extends Stack {
    constructor(parent: App, name: string, props?: StackProps) {
        super(parent, name, props);

        const resource = new DemoResource(this, 'DemoResource', {
            message: 'CustomResource says hello',
        });

        // Bucket with an invalid name will fail the deployment and cause a rollback
        const bucket = new s3.BucketResource(this, 'FailingBucket', {
            bucketName: 'hello!@#$^'
        });

        // Make sure the rollback gets triggered only after the custom resource has been fully created.
        bucket.addDependency(resource);
    }
}

const app = new App(process.argv);

new SucceedingStack(app, 'SucceedingStack');
new FailCreationStack(app, 'FailCreationStack');
new FailAfterCreatingStack(app, 'FailAfterCreatingStack');

process.stdout.write(app.run());
