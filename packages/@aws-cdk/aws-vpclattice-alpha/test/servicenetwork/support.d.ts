import * as core from 'aws-cdk-lib';
import { aws_ec2 as ec2 } from 'aws-cdk-lib';
import { Construct } from 'constructs';
export declare class SupportResources extends Construct {
    helloWorld: core.aws_lambda.Function;
    checkHelloWorld: core.aws_lambda.Function;
    vpc1: ec2.Vpc;
    vpc2: ec2.Vpc;
    constructor(scope: Construct, id: string);
}
