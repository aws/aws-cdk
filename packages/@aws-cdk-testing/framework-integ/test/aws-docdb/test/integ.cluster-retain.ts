import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as cdk from "aws-cdk-lib";
import { DatabaseCluster } from "aws-cdk-lib/aws-docdb";
import * as integ from "@aws-cdk/integ-tests-alpha";

const app = new cdk.App();

const stack = new cdk.Stack(app, "aws-cdk-docdb-integ-cluster-retain");

const vpc = ec2.Vpc.fromLookup(stack, "VPC", { isDefault: true });
const db = new DatabaseCluster(stack, "Database", {
  masterUser: { username: "clusteradmin" },
  instanceType: ec2.InstanceType.of(
    ec2.InstanceClass.T3,
    ec2.InstanceSize.MEDIUM
  ),
  vpc,
  removalPolicy: cdk.RemovalPolicy.RETAIN,
});

new integ.IntegTest(app, "DocdbTest", {
  testCases: [stack],
});
