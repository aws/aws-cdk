import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as vpcv2 from '@aws-cdk/aws-vpcv2-alpha';

export class VpcExampleStackStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    const vpc = new vpcv2.VpcV2(this, 'testVPCV2', {
      primaryAddressBlock: vpcv2.IpAddresses.ipv4('10.0.0.0/16'),
    })
  }
}
