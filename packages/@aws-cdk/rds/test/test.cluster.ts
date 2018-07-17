import { Stack } from '@aws-cdk/cdk';
import { expect, haveResource } from '@aws-cdk/cdk-assert';
import { InstanceClass, InstanceSize, InstanceTypePair } from '@aws-cdk/ec2';
import { VpcNetwork } from '@aws-cdk/ec2';
import { Test } from 'nodeunit';
import { DatabaseCluster, DatabaseClusterEngine, DatabaseClusterRef, Password, Username } from '../lib';

export = {
    'check that instantiation works'(test: Test) {
        // GIVEN
        const stack = testStack();
        const vpc = new VpcNetwork(stack, 'VPC');

        // WHEN
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

        // THEN
        expect(stack).to(haveResource('AWS::RDS::DBCluster', {
            Engine: "aurora",
            DBSubnetGroupName: { Ref: "DatabaseSubnets56F17B9A" },
            MasterUsername: "admin",
            MasterUserPassword: "tooshort",
            VpcSecurityGroupIds: [ {"Fn::GetAtt": ["DatabaseSecurityGroup5C91FDCB", "GroupId"]}]
        }));

        test.done();
    },
    'check that exporting/importing works'(test: Test) {
        // GIVEN
        const stack1 = testStack();
        const stack2 = testStack();

        const cluster = new DatabaseCluster(stack1, 'Database', {
            engine: DatabaseClusterEngine.Aurora,
            masterUser: {
                username: new Username('admin'),
                password: new Password('tooshort'),
            },
            instanceProps: {
                instanceType: new InstanceTypePair(InstanceClass.Burstable2, InstanceSize.Small),
                vpc: new VpcNetwork(stack1, 'VPC')
            }
        });

        // WHEN
        DatabaseClusterRef.import(stack2, 'Database', cluster.export());

        // THEN: No error

        test.done();
    }
};

function testStack() {
    const stack = new Stack(undefined, undefined, { env: { account: '12345', region: 'us-test-1' }});
    stack.setContext('availability-zones:12345:us-test-1', ['us-test-1a', 'us-test-1b']);
    return stack;
}
