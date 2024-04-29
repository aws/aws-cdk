import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs/lib/construct';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import * as customAspect from 'aws-cdk-lib/core/lib/nodejs-aspect';
/**
 * This test creates a stack and changes termination protection with the setter.
 */

//Dynamo DB
class NodejsAspectTest extends cdk.Stack {

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    new Table(this, 'Table', {
      partitionKey: { name: 'hashKey', type: AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      replicationRegions: ['us-east-2'],
    });
  }
}
const app = new cdk.App();
const stack = new NodejsAspectTest(app, 'NodejsStack', { terminationProtection: false });
customAspect.Runtime.of(stack).add('nodejs18.x');
new IntegTest(app, 'stack', { testCases: [stack] });