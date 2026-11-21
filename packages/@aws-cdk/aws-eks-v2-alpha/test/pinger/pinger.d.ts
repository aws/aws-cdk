import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
export interface PingerProps {
    readonly url: string;
    readonly securityGroup?: ec2.SecurityGroup;
    readonly vpc?: ec2.IVpc;
    readonly subnets?: ec2.ISubnet[];
}
export declare class Pinger extends Construct {
    private _resource;
    constructor(scope: Construct, id: string, props: PingerProps);
    get response(): string;
}
