import { expect, haveResource } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { ClassicLoadBalancer, LoadBalancingProtocol, VpcNetwork } from '../lib';

export = {
    'test specifying nonstandard port works'(test: Test) {
        const stack = new Stack(undefined, undefined, { env: { account: '1234', region: 'test' }});
        stack.setContext('availability-zones:1234:test', ['test-1a', 'test-1b']);
        const vpc = new VpcNetwork(stack, 'VCP');

        const lb = new ClassicLoadBalancer(stack, 'LB', { vpc });

        lb.addListener({
            externalProtocol: LoadBalancingProtocol.Http,
            externalPort: 8080,
            internalProtocol: LoadBalancingProtocol.Http,
            internalPort: 8080,
        });

        expect(stack).to(haveResource("AWS::ElasticLoadBalancing::LoadBalancer", {
            Listeners: [{
                InstancePort: "8080",
                InstanceProtocol: "http",
                LoadBalancerPort: "8080",
                Protocol: "http"
            }]
        }));

        test.done();
    }
};
