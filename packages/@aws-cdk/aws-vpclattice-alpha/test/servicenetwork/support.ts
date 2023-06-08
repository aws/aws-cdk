import * as path from 'path';
import * as core from 'aws-cdk-lib';

import {
  aws_iam as iam,
  aws_ec2 as ec2,
  aws_lambda,
}
  from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class SupportResources extends Construct {

  public helloWorld: core.aws_lambda.Function;
  public checkHelloWorld: core.aws_lambda.Function;
  public vpc1: ec2.Vpc;
  public vpc2: ec2.Vpc;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.vpc1 = new ec2.Vpc(this, 'VPC1', {
      ipAddresses: ec2.IpAddresses.cidr('10.10.10.0/16'),
      maxAzs: 2,
      natGateways: 0,
    });

    this.vpc2 = new ec2.Vpc(this, 'VPC1', {
      ipAddresses: ec2.IpAddresses.cidr('10.10.20.0/16'),
      maxAzs: 2,
      natGateways: 0,
    });

    const helloRole = new iam.Role(this, 'helloRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    const checkRole = new iam.Role(this, 'checkRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    this.helloWorld = new aws_lambda.Function(this, 'Helloworld', {
      runtime: aws_lambda.Runtime.PYTHON_3_10,
      handler: 'helloWorld.lambda_handler',
      code: aws_lambda.Code.fromAsset(path.join(__dirname, './lambda' )),
      timeout: core.Duration.seconds(15),
      vpc: this.vpc1,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      role: helloRole,
    });

    this.checkHelloWorld = new aws_lambda.Function(this, 'CheckHello', {
      runtime: aws_lambda.Runtime.PYTHON_3_10,
      handler: 'checkhelloWorld.lambda_handler',
      code: aws_lambda.Code.fromAsset(path.join(__dirname, './lambda' )),
      timeout: core.Duration.seconds(15),
      vpc: this.vpc2,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      role: checkRole,
    });

  }
}