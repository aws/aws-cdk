import { Template } from '../../assertions';
import * as ec2 from '../../aws-ec2';
import { RemovalPolicy, Stack } from '../../core';
import * as rds from '../lib';

describe('DatabaseInstanceFromSnapshot', () => {
  test('creates instance from cluster snapshot', () => {
    const stack = new Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

    new rds.DatabaseInstanceFromSnapshot(stack, 'FromSnapshot', {
      snapshotIdentifier: 'test-cluster-snapshot',
      allocatedStorage: 200,
      engine: rds.DatabaseInstanceEngine.mysql({ version: rds.MysqlEngineVersion.VER_8_0_41 }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
      vpc,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::RDS::DBInstance', {
      DBSnapshotIdentifier: 'test-cluster-snapshot',
      Engine: 'mysql',
      EngineVersion: '8.0.41',
      AllocatedStorage: '200',
    });

    template.resourceCountIs('AWS::RDS::DBSubnetGroup', 1);
    template.resourceCountIs('AWS::EC2::SecurityGroup', 1);
  });

  test('instance from snapshot has correct removal policy', () => {
    const stack = new Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

    new rds.DatabaseInstanceFromSnapshot(stack, 'FromSnapshot', {
      snapshotIdentifier: 'test-snapshot',
      engine: rds.DatabaseInstanceEngine.mysql({ version: rds.MysqlEngineVersion.VER_8_0_41 }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL),
      vpc,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const template = Template.fromStack(stack);

    template.hasResource('AWS::RDS::DBInstance', {
      DeletionPolicy: 'Delete',
    });
  });
});
