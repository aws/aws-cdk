import * as ec2 from '@aws-cdk/aws-ec2';
import { App, Stack } from '@aws-cdk/core';
import { Cluster, ClusterProps } from '../lib';
export declare function testFixture(): {
    stack: Stack;
    vpc: ec2.Vpc;
    app: App;
};
export declare function testFixtureNoVpc(): {
    stack: Stack;
    app: App;
};
export declare function testFixtureCluster(props?: Omit<ClusterProps, 'version'>): {
    stack: Stack;
    app: App;
    cluster: Cluster;
};
