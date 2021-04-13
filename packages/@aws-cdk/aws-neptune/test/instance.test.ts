import { expect as expectCDK, haveOutput, haveResource, ResourcePart } from '@aws-cdk/assert-internal';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as constructs from 'constructs';

import { DatabaseCluster, DatabaseInstance, InstanceType, ParameterGroup } from '../lib';

describe('DatabaseInstance', () => {
  test('check that instantiation works', () => {
    // GIVEN
    const stack = testStack();

    // WHEN
    new DatabaseInstance(stack, 'Instance', {
      cluster: stack.cluster,
      instanceType: InstanceType.R5_LARGE,
    });

    // THEN
    expectCDK(stack).to(haveResource('AWS::Neptune::DBInstance', {
      Properties: {
        DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' },
        DBInstanceClass: 'db.r5.large',
      },
      DeletionPolicy: 'Retain',
      UpdateReplacePolicy: 'Retain',
    }, ResourcePart.CompleteDefinition));
  });

  test('check that the endpoint works', () => {
    // GIVEN
    const stack = testStack();
    const instance = new DatabaseInstance(stack, 'Instance', {
      cluster: stack.cluster,
      instanceType: InstanceType.R5_LARGE,
    });
    const exportName = 'DbInstanceEndpoint';

    // WHEN
    new cdk.CfnOutput(stack, exportName, {
      exportName,
      value: instance.instanceEndpoint.socketAddress,
    });

    // THEN
    expectCDK(stack).to(haveOutput({
      exportName,
      outputValue: {
        'Fn::Join': [
          '',
          [
            { 'Fn::GetAtt': ['InstanceC1063A87', 'Endpoint'] },
            ':',
            { 'Fn::GetAtt': ['InstanceC1063A87', 'Port'] },
          ],
        ],
      },
    }));
  });

  test('check importing works as expected', () => {
    // GIVEN
    const stack = testStack();
    const endpointExportName = 'DbInstanceEndpoint';
    const instanceEndpointAddress = '127.0.0.1';
    const instanceIdentifier = 'InstanceID';
    const port = 8888;

    // WHEN
    const instance = DatabaseInstance.fromDatabaseInstanceAttributes(stack, 'Instance', {
      instanceEndpointAddress,
      instanceIdentifier,
      port,
    });
    new cdk.CfnOutput(stack, 'EndpointOutput', {
      exportName: endpointExportName,
      value: instance.instanceEndpoint.socketAddress,
    });

    // THEN
    expectCDK(stack).to(haveOutput({
      exportName: endpointExportName,
      outputValue: `${instanceEndpointAddress}:${port}`,
    }));
  });

  test('instance with parameter group', () => {
    // GIVEN
    const stack = testStack();

    // WHEN
    const group = new ParameterGroup(stack, 'Params', {
      description: 'bye',
      parameters: {
        param: 'value',
      },
    });
    new DatabaseInstance(stack, 'Instance', {
      cluster: stack.cluster,
      instanceType: InstanceType.R5_LARGE,
      parameterGroup: group,
    });

    // THEN
    expectCDK(stack).to(haveResource('AWS::Neptune::DBInstance', {
      DBParameterGroupName: { Ref: 'ParamsA8366201' },
    }));
  });
});

class TestStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;
  public readonly cluster: DatabaseCluster;

  constructor(scope?: constructs.Construct, id?: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

    this.node.setContext('availability-zones:12345:us-test-1', ['us-test-1a', 'us-test-1b']);

    this.vpc = new ec2.Vpc(this, 'VPC');
    this.cluster = new DatabaseCluster(this, 'Database', {
      instanceType: InstanceType.R5_LARGE,
      vpc: this.vpc,
    });
  }
}

function testStack() {
  const stack = new TestStack(undefined, undefined, { env: { account: '12345', region: 'us-test-1' } });
  return stack;
}