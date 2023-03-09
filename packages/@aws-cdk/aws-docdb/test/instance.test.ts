import { Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as constructs from 'constructs';
import { DatabaseCluster, DatabaseInstance } from '../lib';

const CLUSTER_INSTANCE_TYPE = ec2.InstanceType.of(ec2.InstanceClass.R5, ec2.InstanceSize.LARGE);
const SINGLE_INSTANCE_TYPE = ec2.InstanceType.of(ec2.InstanceClass.R5, ec2.InstanceSize.XLARGE);
const EXPECTED_SYNTH_INSTANCE_TYPE = `db.${SINGLE_INSTANCE_TYPE}`;

describe('DatabaseInstance', () => {
  test('check that instantiation works', () => {
    // GIVEN
    const stack = testStack();

    // WHEN
    new DatabaseInstance(stack, 'Instance', {
      cluster: stack.cluster,
      instanceType: SINGLE_INSTANCE_TYPE,
    });

    // THEN
    Template.fromStack(stack).hasResource('AWS::DocDB::DBInstance', {
      Properties: {
        DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' },
        DBInstanceClass: EXPECTED_SYNTH_INSTANCE_TYPE,
        AutoMinorVersionUpgrade: true,
      },
      DeletionPolicy: 'Retain',
      UpdateReplacePolicy: 'Retain',
    });
  });

  test.each([
    [undefined, true],
    [true, true],
    [false, false],
  ])('check that autoMinorVersionUpdate works: %p', (given: boolean | undefined, expected: boolean) => {
    // GIVEN
    const stack = testStack();

    // WHEN
    new DatabaseInstance(stack, 'Instance', {
      cluster: stack.cluster,
      instanceType: SINGLE_INSTANCE_TYPE,
      autoMinorVersionUpgrade: given,
    });

    // THEN
    Template.fromStack(stack).hasResource('AWS::DocDB::DBInstance', {
      Properties: {
        DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' },
        DBInstanceClass: EXPECTED_SYNTH_INSTANCE_TYPE,
        AutoMinorVersionUpgrade: expected,
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
      instanceType: SINGLE_INSTANCE_TYPE,
    });
    const exportName = 'DbInstanceEndpoint';

    // WHEN
    new cdk.CfnOutput(stack, exportName, {
      exportName,
      value: instance.instanceEndpoint.socketAddress,
    });

    // THEN
    Template.fromStack(stack).hasOutput(exportName, {
      Export: {
        Name: exportName,
      },
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

  test('check that instanceArn property works', () => {
    // GIVEN
    const stack = testStack();
    const instance = new DatabaseInstance(stack, 'Instance', {
      cluster: stack.cluster,
      instanceType: SINGLE_INSTANCE_TYPE,
    });
    const exportName = 'DbInstanceArn';

    // WHEN
    new cdk.CfnOutput(stack, exportName, {
      exportName,
      value: instance.instanceArn,
    });

    // THEN
    Template.fromStack(stack).hasOutput(exportName, {
      Export: {
        Name: exportName,
      },
      Value: {
        'Fn::Join': [
          '',
          [
            'arn:',
            { Ref: 'AWS::Partition' },
            ':rds:us-test-1:12345:db:',
            { Ref: 'InstanceC1063A87' },
          ],
        ],
      },
    });
  });

  test('check importing works as expected', () => {
    // GIVEN
    const stack = testStack();
    const arnExportName = 'DbInstanceArn';
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
    new cdk.CfnOutput(stack, 'ArnOutput', {
      exportName: arnExportName,
      value: instance.instanceArn,
    });
    new cdk.CfnOutput(stack, 'EndpointOutput', {
      exportName: endpointExportName,
      value: instance.instanceEndpoint.socketAddress,
    });

    // THEN
    Template.fromStack(stack).hasOutput('ArnOutput', {
      Export: {
        Name: arnExportName,
      },
      Value: {
        'Fn::Join': [
          '',
          [
            'arn:',
            { Ref: 'AWS::Partition' },
            `:rds:us-test-1:12345:db:${instanceIdentifier}`,
          ],
        ],
      },
    });
    Template.fromStack(stack).hasOutput('EndpointOutput', {
      Export: {
        Name: endpointExportName,
      },
      Value: `${instanceEndpointAddress}:${port}`,
    });
  });

  test('can enable performance insights on instances', () => {
    // GIVEN
    const stack = testStack();

    // WHEN
    new DatabaseInstance(stack, 'Instance', {
      cluster: stack.cluster,
      instanceType: SINGLE_INSTANCE_TYPE,
      enablePerformanceInsights: true,
    });

    // THEN
    Template.fromStack(stack).hasResource('AWS::DocDB::DBInstance', {
      Properties: {
        EnablePerformanceInsights: true,
      },
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
      masterUser: {
        username: 'admin',
        password: cdk.SecretValue.unsafePlainText('tooshort'),
      },
      instanceType: CLUSTER_INSTANCE_TYPE,
      vpc: this.vpc,
    });
  }
}

function testStack() {
  const stack = new TestStack(undefined, undefined, { env: { account: '12345', region: 'us-test-1' } });
  return stack;
}
