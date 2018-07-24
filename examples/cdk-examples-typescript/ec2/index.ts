import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');

class AppWithVpc extends cdk.Stack {
    constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
        super(parent, name, props);

        const vpc = new ec2.VpcNetwork(this, 'MyVpc');

        const asg = new ec2.AutoScalingGroup(this, 'MyASG', {
            vpc,
            instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.M4, ec2.InstanceSize.XLarge),
            machineImage: new ec2.AmazonLinuxImage()
        });

        const clb = new ec2.ClassicLoadBalancer(this, 'LB', {
            vpc,
            internetFacing: true
        });

        clb.addListener({ externalPort: 80 });
        clb.addTarget(asg);
    }
}

interface MyAppProps extends cdk.StackProps {
    infra: CommonInfrastructure
}

class MyApp extends cdk.Stack {
    constructor(parent: cdk.App, name: string, props: MyAppProps) {
        super(parent, name, props);

        const vpc = ec2.VpcNetwork.import(this, 'VPC', props.infra.vpc);

        const fleet = new ec2.AutoScalingGroup(this, 'MyASG', {
            vpc,
            instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.M4, ec2.InstanceSize.XLarge),
            machineImage: new ec2.AmazonLinuxImage()
        });

        const clb = new ec2.ClassicLoadBalancer(this, 'LB', {
            vpc,
            internetFacing: true
        });

        clb.addListener({ externalPort: 80 });
        clb.addTarget(fleet);
    }
}

class CommonInfrastructure extends cdk.Stack {
    public vpc: ec2.VpcNetworkRefProps;

    constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
        super(parent, name, props);

        const vpc = new ec2.VpcNetwork(this, 'VPC');
        this.vpc = vpc.export();
    }
}

const app = new cdk.App(process.argv);

const infra = new CommonInfrastructure(app, 'infra');

new AppWithVpc(app, 'app-with-vpc');
new MyApp(app, 'my-app', { infra });

process.stdout.write(app.run());
