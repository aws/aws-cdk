import { Test } from 'nodeunit';
import { AvailabilityZoneProvider, resolve, SSMParameterProvider, Stack } from '../lib';

export = {
    'AvailabilityZoneProvider returns a list with dummy values if the context is not available'(test: Test) {
        const stack = new Stack(undefined, 'TestStack', { env: { account: '12345', region: 'us-east-1' } });
        const azs = new AvailabilityZoneProvider(stack).availabilityZones;

        test.deepEqual(azs, ['dummy1a', 'dummy1b', 'dummy1c']);
        test.done();
    },

    'AvailabilityZoneProvider will return context list if available'(test: Test) {
        const stack = new Stack(undefined, 'TestStack', { env: { account: '12345', region: 'us-east-1' } });
        const before = new AvailabilityZoneProvider(stack).availabilityZones;
        test.deepEqual(before, [ 'dummy1a', 'dummy1b', 'dummy1c' ]);
        const key = expectedContextKey(stack);

        stack.setContext(key, ['us-east-1a', 'us-east-1b']);

        const azs = new AvailabilityZoneProvider(stack).availabilityZones;
        test.deepEqual(azs, ['us-east-1a', 'us-east-1b']);

        test.done();
    },

    'AvailabilityZoneProvider will complain if not given a list'(test: Test) {
        const stack = new Stack(undefined, 'TestStack', { env: { account: '12345', region: 'us-east-1' } });
        const before = new AvailabilityZoneProvider(stack).availabilityZones;
        test.deepEqual(before, [ 'dummy1a', 'dummy1b', 'dummy1c' ]);
        const key = expectedContextKey(stack);

        stack.setContext(key, 'not-a-list');

        test.throws(
            () => new AvailabilityZoneProvider(stack).availabilityZones
        );

        test.done();
    },

    'SSM parameter provider will return context values if available'(test: Test) {
        const stack = new Stack(undefined, 'TestStack', { env: { account: '12345', region: 'us-east-1' } });
        new SSMParameterProvider(stack).getString('test');
        const key = expectedContextKey(stack);

        stack.setContext(key, 'abc');

        const azs = resolve(new SSMParameterProvider(stack).getString('test'));
        test.deepEqual(azs, 'abc');

        test.done();
    }
};

function firstKey(obj: any): string {
    return Object.keys(obj)[0];
}

/**
 * Get the expected context key from a stack with missing parameters
 */
function expectedContextKey(stack: Stack): string {
    return firstKey(stack.missingContext);
}
