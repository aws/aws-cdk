import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import cdk = require('@aws-cdk/cdk');

class BonjourECS extends cdk.Stack {
    constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
        super(parent, name, props);

        // For better iteration speed, it might make sense to put this VPC into
        // a separate stack and import it here. We then have two stacks to
        // deploy, but VPC creation is slow so we'll only have to do that once
        // and can iterate quickly on consuming stacks. Not doing that for now.
        const vpc = new ec2.VpcNetwork(this, 'MyVpc', {
            maxAZs: 2
        });

        new ecs.Cluster(this, 'DemoCluster', {
            vpc
        });
    }
}

const app = new cdk.App(process.argv);

new BonjourECS(app, 'GoedeMorgen');

process.stdout.write(app.run());
