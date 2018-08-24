import ecs = require('@aws-cdk/aws-ecs');
import cdk = require('@aws-cdk/cdk');

class BonjourECS extends cdk.Stack {
    constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
        super(parent, name, props);
        new ecs.Cluster(this, 'DemoCluster');
    }
}

const app = new cdk.App(process.argv);

new BonjourECS(app, 'Goede Morgen');

process.stdout.write(app.run());
