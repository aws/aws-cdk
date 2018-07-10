import { Test } from 'nodeunit';
import {
  CidrBlock,
  InvalidCidrRangeError,
  InvalidSubnetCountError,
  NetworkBuilder,
  NetworkUtils
} from '../lib/network-util';

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
    },
  IP: {
        "should convert a valid IP Address to an integer"(test: Test) {
          test.strictEqual(NetworkUtils.ipToNum('174.66.173.168'), 2923605416);
          test.done();
        },
        "should throw on invalid IP Address"(test: Test) {
          test.throws(() => {
            NetworkUtils.ipToNum('174.266.173.168');
          }, Error, 'is not valid');
          test.done();
        },
        "should convert a valid IP integer to a staring"(test: Test) {
          test.strictEqual(NetworkUtils.numToIp(2923605416), '174.66.173.168');
          test.done();
        },
        "should throw an error for invalid IP"(test: Test) {
          test.throws(() => {
            NetworkUtils.numToIp(2923605416 * 5);
          }, /is not a valid/);
          test.throws(() => {
            NetworkUtils.numToIp(-1);
          }, /is not a valid/);
          test.done();
        },
    },
  CidrBlock: {
        "should return the next valid subnet from offset IP"(test: Test) {
          const newBlock = CidrBlock.fromOffsetIp('10.0.1.10', 24);
          test.strictEqual(newBlock.cidr, '10.0.2.0/24');
          test.done();
        },
        "maxIp() should return the last usable IP from the CidrBlock"(test: Test) {
          const block = new CidrBlock('10.0.3.0/24');
          test.strictEqual(block.maxIp(), '10.0.3.255');
          test.done();
        },
        "minIp() should return the first usable IP from the CidrBlock"(test: Test) {
          const testValues = [
            ['192.168.0.0/18', '192.168.0.0'],
            ['10.0.3.0/24', '10.0.3.0']
          ];
          for (const answer of testValues) {
            const block = new CidrBlock(answer[0]);
            test.strictEqual(block.minIp(), answer[1]);
          }
          test.done();
        },
        "containsCidr returns true if fully contained"(test: Test) {
          const block = new CidrBlock('10.0.3.0/24');
          const contained = new CidrBlock('10.0.3.0/26');
          test.strictEqual(block.containsCidr(contained), true);
          test.done();
        },
        "containsCidr returns false if not fully contained"(test: Test) {
          const block = new CidrBlock('10.0.3.0/26');
          const notContained = new CidrBlock('10.0.3.0/25');
          test.strictEqual(block.containsCidr(notContained), false);
          test.done();
        },
        "calculateNetmask returns the ip string mask"(test: Test) {
          const netmask = CidrBlock.calculateNetmask(27);
          test.strictEqual(netmask, '255.255.255.224');
          test.done();
        },

    },
  NetworkBuilder: {
        "allows you to carve subnets our of CIDR network"(test: Test) {
          const answers = [
            [
                '192.168.0.0/28',
                '192.168.0.16/28',
                '192.168.0.32/28',
                '192.168.0.128/25',
                '192.168.1.0/25',
                '192.168.4.0/22',
            ],
            [
                '192.168.0.0/24',
                '192.168.1.0/24',
                '192.168.2.0/24',
                '192.168.3.0/25',
                '192.168.3.128/25',
                '192.168.4.0/25',
                '192.168.4.128/28',
                '192.168.4.144/28',
                '192.168.4.160/28',
            ]
          ];
          const wasteful = new NetworkBuilder('192.168.0.0/18');
          const efficient = new NetworkBuilder('192.168.0.0/18');
          wasteful.addSubnets(28, 3);
          wasteful.addSubnets(25, 2);
          wasteful.addSubnets(22, 1);
          efficient.addSubnets(24, 3);
          efficient.addSubnets(25, 3);
          efficient.addSubnets(28, 3);
          const expected = [
            wasteful.subnets.sort(),
            efficient.subnets.sort()
          ];
          for (let i = 0; i < answers.length; i++) {
            test.deepEqual(answers[i].sort(), expected[i]);
          }
          test.done();
        },
        "throws on subnets < 16 or > 28"(test: Test) {
          const builder = new NetworkBuilder('192.168.0.0/18');
          test.throws(() => {
            builder.addSubnet(15);
          }, InvalidCidrRangeError);
          test.throws(() => {
            builder.addSubnet(29);
          }, InvalidCidrRangeError);
          test.done();
        },
        "throws if you add a subnet outside of the cidr"(test: Test) {
          const builder = new NetworkBuilder('192.168.0.0/18');
          const builder2 = new NetworkBuilder('10.0.0.0/21');
          builder.addSubnets(19, 1);
          builder2.addSubnets(24, 8);
          test.throws(() => {
            builder.addSubnet(19);
            builder.addSubnet(28);
          }, /does not fully contain/);
          test.throws(() => {
            builder2.addSubnet(28);
          }, /does not fully contain/);
          test.done();
        }
    }
};
