/// !cdk-integ *
import * as cdk from '@aws-cdk/core';
import * as constructs from 'constructs';
import * as ec2 from '../lib';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

const app = new cdk.App();

interface ConstructThatTakesAVpcProps {
  vpc: ec2.IVpc;
}

class ConstructThatTakesAVpc extends Construct {
  constructor(scope: constructs.Construct, id: string, _props: ConstructThatTakesAVpcProps) {
    super(scope, id);

    // new ec2.CfnInstance(this, 'Instance', {
    //   subnetId: props.vpc.privateSubnets[0].subnetId,
    //   imageId: new ec2.AmazonLinuxImage().getImage(this).imageId,
    // });
  }
}

/// !show
/**
 * Stack1 creates the VPC
 */
class Stack1 extends cdk.Stack {
  public readonly vpc: ec2.Vpc;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, 'VPC');
  }
}

interface Stack2Props extends cdk.StackProps {
  vpc: ec2.IVpc;
}

/**
 * Stack2 consumes the VPC
 */
class Stack2 extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: Stack2Props) {
    super(scope, id, props);

    // Pass the VPC to a construct that needs it
    new ConstructThatTakesAVpc(this, 'Construct', {
      vpc: props.vpc,
    });
  }
}

const stack1 = new Stack1(app, 'Stack1');
const stack2 = new Stack2(app, 'Stack2', {
  vpc: stack1.vpc,
});
/// !hide

Array.isArray(stack2);

app.synth();
