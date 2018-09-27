import { Test } from 'nodeunit';
import {
  CidrBlock,
  InvalidCidrRangeError,
  NetworkBuilder,
  NetworkUtils
} from '../lib/network-util';

export = {

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
    "validIp returns true if octect is in 0-255"(test: Test) {
      const invalidIps = ['255.255.0.0', '0.0.0.0', '1.2.3.4', '10.0.0.0', '255.01.01.255'];
      for (const ip of invalidIps) {
        test.strictEqual(true, NetworkUtils.validIp(ip));
      }
      test.done();
    },
    "validIp returns false if octect is not in 0-255"(test: Test) {
      const invalidIps = ['1.2.3.4.689', '-1.55.22.22', '', ' ', '255.264.1.01'];
      for (const ip of invalidIps) {
        test.strictEqual(false, NetworkUtils.validIp(ip));
      }
      test.done();
    },
  },
  CidrBlock: {
    "should return the next valid subnet from offset IP"(test: Test) {
      const num = NetworkUtils.ipToNum('10.0.1.255');
      const newBlock = new CidrBlock(num, 24);
      test.strictEqual(newBlock.cidr, '10.0.2.0/24');
      test.done();
    },
    "nextBlock() returns the next higher CIDR space"(test: Test) {
      const testValues = [
        ['192.168.0.0/24', '192.168.1.0/24'],
        ['10.85.7.0/28', '10.85.7.16/28'],
      ];
      for (const value of testValues) {
        const block = new CidrBlock(value[0]);
        test.strictEqual(block.nextBlock().cidr, value[1]);
      }
      test.done();
    },
    "maxIp() should return the last usable IP from the CidrBlock"(test: Test) {
      const testValues = [
        ['10.0.3.0/28', '10.0.3.15'],
        ['10.0.3.1/28', '10.0.3.31'],
        ['10.0.2.254/28', '10.0.3.15'],
      ];
      for (const value of testValues) {
        const block = new CidrBlock(value[0]);
        test.strictEqual(block.maxIp(), value[1]);
      }
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
        wasteful.cidrStrings.sort(),
        efficient.cidrStrings.sort()
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
      }, /exceeds remaining space/);
      test.throws(() => {
        builder2.addSubnet(28);
      }, /exceeds remaining space/);
      test.done();
    },
    "maskForRemainingSubnets calcs mask for even split of remaining"(test: Test) {
      const builder = new NetworkBuilder('10.0.0.0/24');
      builder.addSubnet(25);
      test.strictEqual(27, builder.maskForRemainingSubnets(3));
      const builder2 = new NetworkBuilder('192.168.176.0/20');
      builder2.addSubnets(22, 2);
      test.strictEqual(22, builder2.maskForRemainingSubnets(2));
      const builder3 = new NetworkBuilder('192.168.0.0/16');
      test.strictEqual(17, builder3.maskForRemainingSubnets(2));
      const builder4 = new NetworkBuilder('10.0.0.0/16');
      test.strictEqual(18, builder4.maskForRemainingSubnets(4));
      const builder5 = new NetworkBuilder('10.0.0.0/16');
      builder5.addSubnets(26, 3);
      builder5.addSubnets(27, 3);
      test.strictEqual(18, builder5.maskForRemainingSubnets(3)); test.done();
    }
  }
};
