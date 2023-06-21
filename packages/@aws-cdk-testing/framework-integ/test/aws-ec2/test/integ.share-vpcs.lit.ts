/// !cdk-integ *
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';

const app = new cdk.App();

interface ConstructThatTakesAVpcProps {
  vpc: ec2.IVpc;
}

class ConstructThatTakesAVpc extends Construct {
  constructor(scope: Construct, id: string, _props: ConstructThatTakesAVpcProps) {
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

    this.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);
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

    this.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);
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
