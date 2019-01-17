import cdk = require('@aws-cdk/cdk');
import ec2 = require("../lib");

const app = new cdk.App();

interface ConstructThatTakesAVpcProps {
  vpc: ec2.IVpcNetwork;
}

class ConstructThatTakesAVpc extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, _props: ConstructThatTakesAVpcProps) {
    super(scope, id);
  }
}

/// !show
/**
 * Stack1 creates the VPC
 */
class Stack1 extends cdk.Stack {
  public readonly vpc: ec2.VpcNetwork;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.vpc = new ec2.VpcNetwork(this, 'VPC');
  }
}

interface Stack2Props extends cdk.StackProps {
  vpc: ec2.IVpcNetwork;
}

/**
 * Stack2 consumes the VPC
 */
class Stack2 extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: Stack2Props) {
    super(scope, id, props);

    // Pass the VPC to a construct that needs it
    new ConstructThatTakesAVpc(this, 'Construct', {
      vpc: props.vpc
    });
  }
}

const stack1 = new Stack1(app, 'Stack1');
const stack2 = new Stack2(app, 'Stack2', {
  vpc: stack1.vpc,
});
/// !hide

Array.isArray(stack2);

app.run();