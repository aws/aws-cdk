import * as cdk from 'aws-cdk-lib';
import type * as constructs from 'constructs';

export class IntegTestBaseStack extends cdk.Stack {
  constructor(scope: constructs.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    cdk.Aspects.of(this).add({
      visit(node: constructs.IConstruct) {
        if (cdk.CfnResource.isCfnResource(node)) {
          node.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
        }
      },
    });
  }
}
