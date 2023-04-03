import * as ec2 from '@aws-cdk/aws-ec2';
import { App, Stack } from '@aws-cdk/core';
export declare function testFixture(): {
    stack: Stack;
    vpc: ec2.Vpc;
    app: App;
};
