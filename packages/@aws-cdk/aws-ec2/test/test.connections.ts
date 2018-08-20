import { expect, haveResource } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { Connections, IConnectable, SecurityGroup, SecurityGroupId, SecurityGroupRef, TcpAllPorts, TcpPort, VpcNetwork } from '../lib';

export = {
    'peering between two security groups does not recursive infinitely'(test: Test) {
        // GIVEN
        const stack = new Stack(undefined, 'TestStack', { env: { account: '12345678', region: 'dummy' }});

        const vpc = new VpcNetwork(stack, 'VPC');
        const sg1 = new SecurityGroup(stack, 'SG1', { vpc });
        const sg2 = new SecurityGroup(stack, 'SG2', { vpc });

        const conn1 = new SomethingConnectable(new Connections({ securityGroup: sg1 }));
        const conn2 = new SomethingConnectable(new Connections({ securityGroup: sg2 }));

        // WHEN
        conn1.connections.allowTo(conn2, new TcpPort(80), 'Test');

        // THEN
        test.done();
    },

    '(imported) SecurityGroup can be used as target of .allowTo()'(test: Test) {
        // GIVEN
        const stack = new Stack();
        const vpc = new VpcNetwork(stack, 'VPC');
        const sg1 = new SecurityGroup(stack, 'SomeSecurityGroup', { vpc });
        const somethingConnectable = new SomethingConnectable(new Connections({ securityGroup: sg1 }));

        const securityGroup = SecurityGroupRef.import(stack, 'ImportedSG', { securityGroupId: new SecurityGroupId('sg-12345') });

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
    }
};

class SomethingConnectable implements IConnectable {
    constructor(public readonly connections: Connections) {
    }
}
