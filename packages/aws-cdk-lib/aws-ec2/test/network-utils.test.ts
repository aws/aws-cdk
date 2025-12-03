import { UnscopedValidationError } from '../../core';
import {
  CidrBlock,
  InvalidCidrRangeError,
  NetworkBuilder,
  NetworkUtils,
} from '../lib/network-util';

describe('network utils', () => {
  describe('IP', () => {
    test('should convert a valid IP Address to an integer', () => {
      expect(NetworkUtils.ipToNum('174.66.173.168')).toEqual(2923605416);
    });
    test('should throw on invalid IP Address', () => {
      expect(() => {
        NetworkUtils.ipToNum('174.266.173.168');
      }).toThrow('is not valid');
    });
    test('should convert a valid IP integer to a staring', () => {
      expect(NetworkUtils.numToIp(2923605416)).toEqual('174.66.173.168');
    });
    test('should throw an error for invalid IP', () => {
      expect(() => {
        NetworkUtils.numToIp(2923605416 * 5);
      }).toThrow(/is not a valid/);
      expect(() => {
        NetworkUtils.numToIp(-1);
      }).toThrow(/is not a valid/);
    });
    test('validIp returns true if octect is in 0-255', () => {
      const invalidIps = ['255.255.0.0', '0.0.0.0', '1.2.3.4', '10.0.0.0', '255.01.01.255'];
      for (const ip of invalidIps) {
        expect(true).toEqual(NetworkUtils.validIp(ip));
      }
    });
    test('validIp returns false if octect is not in 0-255', () => {
      const invalidIps = ['1.2.3.4.689', '-1.55.22.22', '', ' ', '255.264.1.01'];
      for (const ip of invalidIps) {
        expect(false).toEqual(NetworkUtils.validIp(ip));
      }
    });
  });
  describe('CidrBlock', () => {
    test('throws on misaligned offset IP (numeric form)', () => {
      const num = NetworkUtils.ipToNum('10.0.1.255');
      expect(() => new CidrBlock(num, 24))
        .toThrow(UnscopedValidationError);
    });
    test('nextBlock() returns the next higher CIDR space', () => {
      const testValues = [
        ['192.168.0.0/24', '192.168.1.0/24'],
        ['10.85.7.0/28', '10.85.7.16/28'],
      ];
      for (const value of testValues) {
        const block = new CidrBlock(value[0]);
        expect(block.nextBlock().cidr).toEqual(value[1]);
      }
    });
    test('maxIp() should return the last usable IP from an aligned CidrBlock', () => {
      const testValues = [
        ['10.0.3.0/28', '10.0.3.15'],
      ];
      for (const [cidr, expected] of testValues) {
        const block = new CidrBlock(cidr);
        expect(block.maxIp()).toEqual(expected);
      }
    });
    test('minIp() should return the first usable IP from the CidrBlock', () => {
      const testValues = [
        ['192.168.0.0/18', '192.168.0.0'],
        ['10.0.3.0/24', '10.0.3.0'],
      ];
      for (const answer of testValues) {
        const block = new CidrBlock(answer[0]);
        expect(block.minIp()).toEqual(answer[1]);
      }
    });
    test('containsCidr returns true if fully contained', () => {
      const block = new CidrBlock('10.0.3.0/24');
      const contained = new CidrBlock('10.0.3.0/26');
      expect(block.containsCidr(contained)).toEqual(true);
    });
    test('containsCidr returns false if not fully contained', () => {
      const block = new CidrBlock('10.0.3.0/26');
      const notContained = new CidrBlock('10.0.3.0/25');
      expect(block.containsCidr(notContained)).toEqual(false);
    });
    test('calculateNetmask returns the ip string mask', () => {
      const netmask = CidrBlock.calculateNetmask(27);
      expect(netmask).toEqual('255.255.255.224');
    });
  });
  describe('CidrBlock alignment validation', () => {
    it('throws when you give a misaligned CIDR (string form)', () => {
      expect(() => new CidrBlock('10.0.40.1/19'))
        .toThrow(UnscopedValidationError);
    });

    it('throws when you give a misaligned CIDR (numeric form)', () => {
      const num = NetworkUtils.ipToNum('10.0.40.0');
      expect(() => new CidrBlock(num, 19))
        .toThrow(UnscopedValidationError);
    });

    it('accepts a correctly aligned CIDR (string form)', () => {
      expect(new CidrBlock('10.0.32.0/19').cidr)
        .toBe('10.0.32.0/19');
    });

    it('accepts a correctly aligned CIDR (numeric form)', () => {
      const num = NetworkUtils.ipToNum('10.0.32.0');
      const block = new CidrBlock(num, 19);
      expect(block.cidr).toBe('10.0.32.0/19');
    });
  });
  describe('NetworkBuilder', () => {
    test('allows you to carve subnets our of CIDR network', () => {
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
        ],
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
        efficient.cidrStrings.sort(),
      ];
      for (let i = 0; i < answers.length; i++) {
        expect(answers[i].sort()).toEqual(expected[i]);
      }
    });
    test('throws on subnets < 16 or > 28', () => {
      const builder = new NetworkBuilder('192.168.0.0/18');
      expect(() => {
        builder.addSubnet(15);
      }).toThrow(InvalidCidrRangeError);
      expect(() => {
        builder.addSubnet(29);
      }).toThrow(InvalidCidrRangeError);
    });
    test('throws if you add a subnet outside of the cidr', () => {
      const builder = new NetworkBuilder('192.168.0.0/18');
      const builder2 = new NetworkBuilder('10.0.0.0/21');
      builder.addSubnets(19, 1);
      builder2.addSubnets(24, 8);
      expect(() => {
        builder.addSubnet(19);
        builder.addSubnet(28);
      }).toThrow(/exceeds remaining space/);
      expect(() => {
        builder2.addSubnet(28);
      }).toThrow(/exceeds remaining space/);
    });
    test('maskForRemainingSubnets calcs mask for even split of remaining', () => {
      const builder = new NetworkBuilder('10.0.0.0/24');
      builder.addSubnet(25);
      expect(27).toEqual(builder.maskForRemainingSubnets(3));
      const builder2 = new NetworkBuilder('192.168.176.0/20');
      builder2.addSubnets(22, 2);
      expect(22).toEqual(builder2.maskForRemainingSubnets(2));
      const builder3 = new NetworkBuilder('192.168.0.0/16');
      expect(17).toEqual(builder3.maskForRemainingSubnets(2));
      const builder4 = new NetworkBuilder('10.0.0.0/16');
      expect(18).toEqual(builder4.maskForRemainingSubnets(4));
      const builder5 = new NetworkBuilder('10.0.0.0/16');
      builder5.addSubnets(26, 3);
      builder5.addSubnets(27, 3);
      expect(18).toEqual(builder5.maskForRemainingSubnets(3));
    });
  });
});
