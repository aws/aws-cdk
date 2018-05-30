import { App, Stack } from 'aws-cdk';
import { InstanceClass, InstanceSize, InstanceTypePair } from '../../aws-cdk-ec2/lib/instance-types';
import { VpcNetwork } from '../../aws-cdk-ec2/lib/vpc';
import { DatabaseCluster, DatabaseClusterEngine, Password, Username } from '../lib';

const app = new App(process.argv);
const stack = new Stack(app, 'aws-cdk-rds-integ');

const vpc = new VpcNetwork(stack, 'VPC', { maxAZs: 2 });

const cluster = new DatabaseCluster(stack, 'Database', {
    engine: DatabaseClusterEngine.Aurora,
    masterUser: {
        username: new Username('admin'),
        password: new Password('7959866cacc02c2d243ecfe177464fe6'),
    },
    instanceProps: {
        instanceType: new InstanceTypePair(InstanceClass.Burstable2, InstanceSize.Small),
        vpcPlacement: { usePublicSubnets: true },
        vpc
    }
});

cluster.connections.allowDefaultPortFromAnyIpv4('Open to the world');

process.stdout.write(app.run());