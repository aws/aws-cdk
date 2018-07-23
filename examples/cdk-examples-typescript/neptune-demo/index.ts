import ec2 = require('@aws-cdk/aws-ec2');
import neptune = require('@aws-cdk/aws-neptune');
import rds = require('@aws-cdk/aws-rds');
import cdk = require('@aws-cdk/cdk');

class NeptuneDemoStack extends cdk.Stack {
    constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
        super(parent, name, props);

        const vpc = new ec2.VpcNetwork(this, 'VPC');

        const database = new neptune.NeptuneDatabase(this, 'NeptuneCluster', {
            instances: 3,
            instanceProps: {
                instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.Burstable2, ec2.InstanceSize.Small),
                vpc,
                vpcPlacement: { usePublicSubnets: true },
            },
            masterUser: {
                // This would normally be imported from SSM parmeter store encrypted string,
                // but don't want to overcomplicate the example
                username: new rds.Username('admin'),
                password: new rds.Password('eRSDwst7lpzu'),
            }
        });
        database.connections.allowDefaultPortFrom(new ec2.AnyIPv4(), 'Allow the world to connect');
    }
}

const app = new cdk.App(process.argv);

new NeptuneDemoStack(app, 'NeptuneDemo');

process.stdout.write(app.run());
