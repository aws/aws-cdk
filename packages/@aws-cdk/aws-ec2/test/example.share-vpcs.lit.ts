import cdk = require('@aws-cdk/cdk');
import ec2 = require("../lib");

const app = new cdk.App();

interface ConstructThatTakesAVpcProps {
  vpc: ec2.VpcNetworkRef;
}

class ConstructThatTakesAVpc extends cdk.Construct {
  constructor(scope: cdk.Construct, scid: string, _props: ConstructThatTakesAVpcProps) {
    super(scope, scid);
  }
}

/// !show
class Stack1 extends cdk.Stack {
  public readonly vpcProps: ec2.VpcNetworkRefProps;

  constructor(scope: cdk.App, scid: string, props?: cdk.StackProps) {
    super(scope, scid, props);

    const vpc = new ec2.VpcNetwork(this, 'VPC');

    // Export the VPC to a set of properties
    this.vpcProps = vpc.export();
  }
}

interface Stack2Props extends cdk.StackProps {
  vpcProps: ec2.VpcNetworkRefProps;
}

class Stack2 extends cdk.Stack {
  constructor(scope: cdk.App, scid: string, props: Stack2Props) {
    super(scope, scid, props);

    // Import the VPC from a set of properties
    const vpc = ec2.VpcNetworkRef.import(this, 'VPC', props.vpcProps);

    new ConstructThatTakesAVpc(this, 'Construct', {
      vpc
    });
  }
}

const stack1 = new Stack1(app, 'Stack1');
const stack2 = new Stack2(app, 'Stack2', {
  vpcProps: stack1.vpcProps
});
/// !hide

Array.isArray(stack2);

app.run();