import { Stack } from 'aws-cdk';
import { Test } from 'nodeunit';
import { InstanceClass, InstanceSize, InstanceTypePair } from '../../aws-cdk-ec2/lib/instance-types';
import { VpcNetwork } from '../../aws-cdk-ec2/lib/vpc';
import { DatabaseCluster, DatabaseClusterEngine, DatabaseClusterRef, Password, Username } from '../lib';

exports = {
    'check that instantiation works'(test: Test) {
        const stack = new Stack();

        const vpc = new VpcNetwork(this, 'VPC');

        new DatabaseCluster(stack, 'Database', {
            engine: DatabaseClusterEngine.Aurora,
            masterUser: {
                username: new Username('admin'),
                password: new Password('tooshort'),
            },
            instanceProps: {
                instanceType: new InstanceTypePair(InstanceClass.Burstable2, InstanceSize.Small),
                vpc
            }
        });

        test.done();
    },
    'check that exporting/importing works'(test: Test) {
        const stack1 = new Stack();

        const cluster = new DatabaseCluster(stack1, 'Database', {
            engine: DatabaseClusterEngine.Aurora,
            masterUser: {
                username: new Username('admin'),
                password: new Password('tooshort'),
            },
            instanceProps: {
                instanceType: new InstanceTypePair(InstanceClass.Burstable2, InstanceSize.Small),
                vpc: new VpcNetwork(this, 'VPC')
            }
        });

        const stack2 = new Stack();
        DatabaseClusterRef.import(stack2, 'Database', cluster.export());

        test.done();
    }
};
