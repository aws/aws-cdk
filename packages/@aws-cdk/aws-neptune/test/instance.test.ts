import { Template } from '@aws-cdk/assertions';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
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
    Template.fromStack(stack).hasResource('AWS::Neptune::DBInstance', {
      Properties: {
        DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' },
        DBInstanceClass: 'db.r5.large',
      },
      DeletionPolicy: 'Retain',
      UpdateReplacePolicy: 'Retain',
    });
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
    Template.fromStack(stack).hasOutput(exportName, {
      Export: { Name: exportName },
      Value: {
        'Fn::Join': [
          '',
          [
            { 'Fn::GetAtt': ['InstanceC1063A87', 'Endpoint'] },
            ':',
            { 'Fn::GetAtt': ['InstanceC1063A87', 'Port'] },
          ],
        ],
      },
    });
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
    Template.fromStack(stack).hasOutput('EndpointOutput', {
      Export: { Name: endpointExportName },
      Value: `${instanceEndpointAddress}:${port}`,
    });
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
    Template.fromStack(stack).hasResourceProperties('AWS::Neptune::DBInstance', {
      DBParameterGroupName: { Ref: 'ParamsA8366201' },
    });
  });

  test('instance type from CfnParameter', () => {
    // GIVEN
    const stack = testStack();

    const instanceType = new cdk.CfnParameter(stack, 'NeptuneInstaneType', {
      description: 'Instance type of graph database Neptune',
      type: 'String',
      allowedValues: [
        'db.r5.xlarge',
        'db.r5.2xlarge',
        'db.r5.4xlarge',
        'db.r5.8xlarge',
        'db.r5.12xlarge',
      ],
      default: 'db.r5.8xlarge',
    });
    // WHEN
    new DatabaseInstance(stack, 'Instance', {
      cluster: stack.cluster,
      instanceType: InstanceType.of(instanceType.valueAsString),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Neptune::DBInstance', {
      DBInstanceClass: {
        Ref: 'NeptuneInstaneType',
      },
    });
  });

  test('instance type from string throws if missing db prefix', () => {
    expect(() => { InstanceType.of('r5.xlarge');}).toThrowError(/instance type must start with 'db.'/);
  });

  test('metric - constructs metric with correct namespace and dimension and inputs', () => {
    // GIVEN
    const stack = testStack();
    const instance = new DatabaseInstance(stack, 'Instance', {
      cluster: stack.cluster,
      instanceType: InstanceType.R5_LARGE,
    });

    // WHEN
    const metric = instance.metric('SparqlRequestsPerSec');
    new cloudwatch.Alarm(stack, 'Alarm', {
      evaluationPeriods: 1,
      threshold: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_THRESHOLD,
      metric: metric,
    });

    // THEN
    expect(metric).toEqual(new cloudwatch.Metric({
      namespace: 'AWS/Neptune',
      dimensionsMap: {
        DBInstanceIdentifier: instance.instanceIdentifier,
      },
      metricName: 'SparqlRequestsPerSec',
    }));
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      Namespace: 'AWS/Neptune',
      MetricName: 'SparqlRequestsPerSec',
      Dimensions: [
        {
          Name: 'DBInstanceIdentifier',
          Value: stack.resolve(instance.instanceIdentifier),
        },
      ],
      ComparisonOperator: 'LessThanThreshold',
      EvaluationPeriods: 1,
      Threshold: 1,
    });
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
  return new TestStack(undefined, undefined, { env: { account: '12345', region: 'us-test-1' } });
}
