import { App, Stack, StackProps } from '@aws-cdk/core';
import { AnyIPv4, InstanceClass, InstanceSize, InstanceTypePair, VpcNetwork } from '@aws-cdk/ec2';
import { NeptuneDatabase } from '@aws-cdk/neptune';
import { Password, Username } from '@aws-cdk/rds';

class NeptuneDemoStack extends Stack {
    constructor(parent: App, name: string, props?: StackProps) {
        super(parent, name, props);

        const vpc = new VpcNetwork(this, 'VPC');

        const database = new NeptuneDatabase(this, 'NeptuneCluster', {
            instances: 3,
            instanceProps: {
                instanceType: new InstanceTypePair(InstanceClass.Burstable2, InstanceSize.Small),
                vpc,
                vpcPlacement: { usePublicSubnets: true },
            },
            masterUser: {
                // This would normally be imported from SSM parmeter store encrypted string,
                // but don't want to overcomplicate the example
                username: new Username('admin'),
                password: new Password('eRSDwst7lpzu'),
            }
        });
        database.connections.allowDefaultPortFrom(new AnyIPv4(), 'Allow the world to connect');
    }
}

const app = new App(process.argv);

new NeptuneDemoStack(app, 'NeptuneDemo');

process.stdout.write(app.run());
