import ecs = require('@aws-cdk/aws-ecs');
import cdk = require('@aws-cdk/cdk');

class HelloECS extends cdk.Stack {
    constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
        super(parent, name, props);
        new ecs.Cluster(this, 'MyCluster');
    }
}

const app = new cdk.App(process.argv);

new HelloECS(app, 'Hello');

process.stdout.write(app.run());
