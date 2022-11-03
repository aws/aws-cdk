import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { CustomResource, Token, Duration } from '@aws-cdk/core';
import * as cr from '@aws-cdk/custom-resources';
import { Construct } from 'constructs';

export interface PingerProps {
  readonly securityGroup?: ec2.SecurityGroup;
  readonly vpc?: ec2.IVpc;
  readonly subnets?: ec2.ISubnet[];
}
export class BucketPinger extends Construct {

  private _resource: CustomResource;

  constructor(scope: Construct, id: string, props: PingerProps) {
    super(scope, id);

    const func = new lambda.Function(this, 'Function', {
      code: lambda.Code.fromAsset(`${__dirname}/function`),
      handler: 'index.handler',
      runtime: lambda.Runtime.PYTHON_3_9,
      vpc: props.vpc,
      vpcSubnets: props.subnets ? { subnets: props.subnets } : undefined,
      securityGroups: props.securityGroup ? [props.securityGroup] : undefined,
      timeout: Duration.minutes(1),
    });

    if (!func.role) {
      throw new Error('pinger lambda has no execution role!');
    }

    func.role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['s3:DeleteBucket', 's3:ListBucket'],
      resources: ['arn:aws:s3:::*'],
    }));

    const provider = new cr.Provider(this, 'Provider', {
      onEventHandler: func,
    });

    this._resource = new CustomResource(this, 'Resource', {
      serviceToken: provider.serviceToken,
    });
  }

  public get response() {
    return Token.asString(this._resource.getAtt('Value'));
  }
}
