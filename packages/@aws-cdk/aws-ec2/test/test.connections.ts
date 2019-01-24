import { expect, haveResource } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';

import {
  Connections,
  IConnectable,
  SecurityGroup,
  TcpAllPorts,
  TcpPort,
  VpcNetwork
} from "../lib";

export = {
  'peering between two security groups does not recursive infinitely'(test: Test) {
    // GIVEN
    const stack = new Stack(undefined, 'TestStack', { env: { account: '12345678', region: 'dummy' }});

    const vpc = new VpcNetwork(stack, 'VPC');
    const sg1 = new SecurityGroup(stack, 'SG1', { vpc });
    const sg2 = new SecurityGroup(stack, 'SG2', { vpc });

    const conn1 = new SomethingConnectable(new Connections({ securityGroups: [sg1] }));
    const conn2 = new SomethingConnectable(new Connections({ securityGroups: [sg2] }));

    // WHEN
    conn1.connections.allowTo(conn2, new TcpPort(80), 'Test');

    // THEN -- it finishes!
    test.done();
  },

  '(imported) SecurityGroup can be used as target of .allowTo()'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const vpc = new VpcNetwork(stack, 'VPC');
    const sg1 = new SecurityGroup(stack, 'SomeSecurityGroup', { vpc, allowAllOutbound: false });
    const somethingConnectable = new SomethingConnectable(new Connections({ securityGroups: [sg1] }));

    const securityGroup = SecurityGroup.import(stack, 'ImportedSG', { securityGroupId: 'sg-12345' });

    // WHEN
    somethingConnectable.connections.allowTo(securityGroup, new TcpAllPorts(), 'Connect there');

    // THEN: rule to generated security group to connect to imported
    expect(stack).to(haveResource("AWS::EC2::SecurityGroupEgress", {
        GroupId: { "Fn::GetAtt": [ "SomeSecurityGroupEF219AD6", "GroupId" ] },
        IpProtocol: "tcp",
        Description: "Connect there",
        DestinationSecurityGroupId: "sg-12345",
        FromPort: 0,
        ToPort: 65535
    }));

    // THEN: rule to imported security group to allow connections from generated
    expect(stack).to(haveResource("AWS::EC2::SecurityGroupIngress", {
      IpProtocol: "tcp",
      Description: "Connect there",
      FromPort: 0,
      GroupId: "sg-12345",
      SourceSecurityGroupId: { "Fn::GetAtt": [ "SomeSecurityGroupEF219AD6", "GroupId" ] },
      ToPort: 65535
    }));

    test.done();
  },

  'security groups added to connections after rule still gets rule'(test: Test) {
    // GIVEN
    const stack = new Stack(undefined, 'TestStack');
    const vpc = new VpcNetwork(stack, 'VPC');
    const sg1 = new SecurityGroup(stack, 'SecurityGroup1', { vpc, allowAllOutbound: false });
    const sg2 = new SecurityGroup(stack, 'SecurityGroup2', { vpc, allowAllOutbound: false });
    const connections = new Connections({ securityGroups: [sg1] });

    // WHEN
    connections.allowFromAnyIPv4(new TcpPort(88));
    connections.addSecurityGroup(sg2);

    // THEN
    expect(stack).to(haveResource('AWS::EC2::SecurityGroup', {
      GroupDescription: "TestStack/SecurityGroup1",
      SecurityGroupIngress: [
        {
          Description: "from 0.0.0.0/0:88",
          CidrIp: "0.0.0.0/0",
          FromPort: 88,
          ToPort: 88,
          IpProtocol: 'tcp'
        }
      ]
    }));

    expect(stack).to(haveResource('AWS::EC2::SecurityGroup', {
      GroupDescription: "TestStack/SecurityGroup2",
      SecurityGroupIngress: [
        {
          Description: "from 0.0.0.0/0:88",
          CidrIp: "0.0.0.0/0",
          FromPort: 88,
          ToPort: 88,
          IpProtocol: 'tcp'
        }
      ]
    }));

    test.done();
  },

  'when security groups are added to target they also get the rule'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const vpc = new VpcNetwork(stack, 'VPC');
    const sg1 = new SecurityGroup(stack, 'SecurityGroup1', { vpc, allowAllOutbound: false });
    const sg2 = new SecurityGroup(stack, 'SecurityGroup2', { vpc, allowAllOutbound: false });
    const sg3 = new SecurityGroup(stack, 'SecurityGroup3', { vpc, allowAllOutbound: false });
    const connections1 = new Connections({ securityGroups: [sg1] });
    const connections2 = new Connections({ securityGroups: [sg2] });
    const connectable = new SomethingConnectable(connections2);

    // WHEN
    connections1.allowTo(connectable, new TcpPort(88));
    connections2.addSecurityGroup(sg3);

    // THEN
    expect(stack).to(haveResource('AWS::EC2::SecurityGroupIngress', {
      GroupId: { "Fn::GetAtt": [ "SecurityGroup23BE86BB7", "GroupId" ] },
      SourceSecurityGroupId: { "Fn::GetAtt": [ "SecurityGroup1F554B36F", "GroupId" ] },
      FromPort: 88,
      ToPort: 88
    }));

    expect(stack).to(haveResource('AWS::EC2::SecurityGroupIngress', {
      GroupId: { "Fn::GetAtt": [ "SecurityGroup3E5E374B9", "GroupId" ] },
      SourceSecurityGroupId: { "Fn::GetAtt": [ "SecurityGroup1F554B36F", "GroupId" ] },
      FromPort: 88,
      ToPort: 88
    }));

    test.done();
  },

  'multiple security groups allows internally between them'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const vpc = new VpcNetwork(stack, 'VPC');
    const sg1 = new SecurityGroup(stack, 'SecurityGroup1', { vpc, allowAllOutbound: false });
    const sg2 = new SecurityGroup(stack, 'SecurityGroup2', { vpc, allowAllOutbound: false });
    const connections = new Connections({ securityGroups: [sg1] });

    // WHEN
    connections.allowInternally(new TcpPort(88));
    connections.addSecurityGroup(sg2);

    // THEN
    expect(stack).to(haveResource('AWS::EC2::SecurityGroupIngress', {
      GroupId: { "Fn::GetAtt": [ "SecurityGroup1F554B36F", "GroupId" ] },
      SourceSecurityGroupId: { "Fn::GetAtt": [ "SecurityGroup1F554B36F", "GroupId" ] },
      FromPort: 88,
      ToPort: 88
    }));

    test.done();
  },
};

class SomethingConnectable implements IConnectable {
  constructor(public readonly connections: Connections) {
  }
}
