"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const ec2 = require("aws-cdk-lib/aws-ec2");
const app = new aws_cdk_lib_1.App();
const stack = new aws_cdk_lib_1.Stack(app, 'stack');
new ec2.PlacementGroup(stack, 'placementGroupNoProps');
new ec2.PlacementGroup(stack, 'PlacementGroupOnlyPartition', {
    partitions: 5,
});
new ec2.PlacementGroup(stack, 'PlacementGroupOnlySpreadLevel', {
    spreadLevel: ec2.PlacementGroupSpreadLevel.HOST,
});
new ec2.PlacementGroup(stack, 'PlacementGroupOnlyStrategyPartition', {
    strategy: ec2.PlacementGroupStrategy.PARTITION,
});
new ec2.PlacementGroup(stack, 'PlacementGroupOnlyStrategyCluster', {
    strategy: ec2.PlacementGroupStrategy.CLUSTER,
});
new ec2.PlacementGroup(stack, 'PlacementSpreadOnly', {
    strategy: ec2.PlacementGroupStrategy.SPREAD,
});
new ec2.PlacementGroup(stack, 'PlacementSpreadHost', {
    strategy: ec2.PlacementGroupStrategy.SPREAD,
    spreadLevel: ec2.PlacementGroupSpreadLevel.HOST,
});
new ec2.PlacementGroup(stack, 'PlacementSpreadRack', {
    strategy: ec2.PlacementGroupStrategy.SPREAD,
    spreadLevel: ec2.PlacementGroupSpreadLevel.RACK,
});
new integ.IntegTest(app, 'BatchEcsJobDefinitionTest', {
    testCases: [stack],
});
app.synth();
