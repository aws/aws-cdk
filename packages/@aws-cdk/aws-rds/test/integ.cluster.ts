import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { DatabaseCluster, DatabaseClusterEngine, Password, Username } from '../lib';

const app = new cdk.App(process.argv);
const stack = new cdk.Stack(app, 'aws-cdk-rds-integ');

const vpc = new ec2.VpcNetwork(stack, 'VPC', { maxAZs: 2 });

const cluster = new DatabaseCluster(stack, 'Database', {
    engine: DatabaseClusterEngine.Aurora,
    masterUser: {
        username: new Username('admin'),
        password: new Password('7959866cacc02c2d243ecfe177464fe6'),
    },
    instanceProps: {
        instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.Burstable2, ec2.InstanceSize.Small),
        vpcPlacement: { usePublicSubnets: true },
        vpc
    }
});

cluster.connections.allowDefaultPortFromAnyIpv4('Open to the world');

process.stdout.write(app.run());
