import { Test } from 'nodeunit';
import { InvalidCidrRangeError, InvalidSubnetCountError, NetworkUtils } from '../lib/network-util';

export = {

    CIDR: {

        "should error when calculating subnets for CIDR range that is too big (10.0.0.0/8)"(test: Test) {
            test.throws(() => {
                NetworkUtils.splitCIDR('10.0.0.0/8', 2);
            }, InvalidCidrRangeError);
            test.done();
        },

        "should error when calculating subnets for CIDR range that is too small (10.0.0.0/32)"(test: Test) {
            test.throws(() => {
                NetworkUtils.splitCIDR('10.0.0.0/32', 2);
            }, InvalidCidrRangeError);
            test.done();
        },

        "should error when trying to split a CIDR range into an unfeasible number of subnets (25 subnets from a /16)"(test: Test) {
            test.throws(() => {
                NetworkUtils.splitCIDR('10.0.0.0/16', 25);
            }, InvalidSubnetCountError);
            test.done();
        },

        "should successfully split a CIDR range into a valid number of subnets (6 subnets from a /16)"(test: Test) {
            test.deepEqual(NetworkUtils.splitCIDR('10.0.0.0/16', 6), [
                '10.0.0.0/19', '10.0.32.0/19',
                '10.0.64.0/19', '10.0.96.0/19',
                '10.0.128.0/19', '10.0.160.0/19'
            ]);
            test.done();
        }

    }

};