import { App, Stack, StackProps } from '@aws-cdk/core';
import {
    AmazonLinuxImage, AutoScalingGroup, ClassicLoadBalancer, InstanceClass, InstanceSize,
    InstanceTypePair, VpcNetwork, VpcNetworkRefProps } from '@aws-cdk/ec2';

class AppWithVpc extends Stack {
    constructor(parent: App, name: string, props?: StackProps) {
        super(parent, name, props);

        const vpc = new VpcNetwork(this, 'MyVpc');

        const asg = new AutoScalingGroup(this, 'MyASG', {
            vpc,
            instanceType: new InstanceTypePair(InstanceClass.M4, InstanceSize.XLarge),
            machineImage: new AmazonLinuxImage()
        });

        const clb = new ClassicLoadBalancer(this, 'LB', {
            vpc,
            internetFacing: true
        });

        clb.addListener({ externalPort: 80 });
        clb.addTarget(asg);
    }
}

interface MyAppProps extends StackProps {
    infra: CommonInfrastructure
}

class MyApp extends Stack {
    constructor(parent: App, name: string, props: MyAppProps) {
        super(parent, name, props);

        const vpc = VpcNetwork.import(this, 'VPC', props.infra.vpc);

        const fleet = new AutoScalingGroup(this, 'MyASG', {
            vpc,
            instanceType: new InstanceTypePair(InstanceClass.M4, InstanceSize.XLarge),
            machineImage: new AmazonLinuxImage()
        });

        const clb = new ClassicLoadBalancer(this, 'LB', {
            vpc,
            internetFacing: true
        });

        clb.addListener({ externalPort: 80 });
        clb.addTarget(fleet);
    }
}

class CommonInfrastructure extends Stack {
    public vpc: VpcNetworkRefProps;

    constructor(parent: App, name: string, props?: StackProps) {
        super(parent, name, props);

        const vpc = new VpcNetwork(this, 'VPC');
        this.vpc = vpc.export();
    }
}

const app = new App(process.argv);

const infra = new CommonInfrastructure(app, 'infra');

new AppWithVpc(app, 'app-with-vpc');
new MyApp(app, 'my-app', { infra });

process.stdout.write(app.run());
