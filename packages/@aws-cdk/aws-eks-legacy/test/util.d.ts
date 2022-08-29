import * as ec2 from '@aws-cdk/aws-ec2';
import { App, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Cluster } from '../lib';
export declare function testFixture(): {
    stack: Stack;
    vpc: ec2.Vpc;
    app: App;
};
export declare function testFixtureNoVpc(): {
    stack: Stack;
    app: App;
};
export declare function testFixtureCluster(): {
    stack: Stack;
    app: App;
    cluster: Cluster;
};
export declare class TestStack extends Stack {
    constructor(scope: Construct, id: string);
}
