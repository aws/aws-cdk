import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ServiceNetwork } from '../../lib/servicenetwork';


export class ServiceNetworkStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new ServiceNetwork(this, 'ServiceNetwork', { name: 'thing' });
    //new cdk.CfnOutput(this, 'thing', { value: 'blue' });
  }
}
