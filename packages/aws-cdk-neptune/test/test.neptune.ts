import { Stack } from 'aws-cdk';
import { Password, Username } from 'aws-cdk-rds';
import { Test } from 'nodeunit';
import { InstanceClass, InstanceSize, InstanceTypePair } from '../../aws-cdk-ec2/lib/instance-types';
import { VpcNetwork } from '../../aws-cdk-ec2/lib/vpc';
import { NeptuneDatabase } from '../lib';

exports = {
    'check that instantiation works'(test: Test) {
        const stack = new Stack();

        const vpc = new VpcNetwork(this, 'VPC');

        new NeptuneDatabase(stack, 'Database', {
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
    }
};