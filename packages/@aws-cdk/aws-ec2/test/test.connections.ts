import { Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { Connections, IConnectable, SecurityGroup, TcpPort, VpcNetwork } from '../lib';

export = {
    'peering between two security groups does not recursive infinitely'(test: Test) {
        // GIVEN
        const stack = new Stack(undefined, 'TestStack', { env: { account: '12345678', region: 'dummy' }});

        const vpc = new VpcNetwork(stack, 'VPC');
        const sg1 = new SecurityGroup(stack, 'SG1', { vpc });
        const sg2 = new SecurityGroup(stack, 'SG2', { vpc });

        const conn1 = new ConnectionsHolder(new Connections(sg1));
        const conn2 = new ConnectionsHolder(new Connections(sg2));

        // WHEN
        conn1.connections.allowTo(conn2, new TcpPort(80), 'Test');

        // THEN
        test.done();
    }
};

class ConnectionsHolder implements IConnectable {
    constructor(public readonly connections: Connections) {
    }
}
