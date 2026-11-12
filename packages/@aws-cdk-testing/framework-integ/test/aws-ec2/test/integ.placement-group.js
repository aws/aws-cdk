"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ = __importStar(require("@aws-cdk/integ-tests-alpha"));
const ec2 = __importStar(require("aws-cdk-lib/aws-ec2"));
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
