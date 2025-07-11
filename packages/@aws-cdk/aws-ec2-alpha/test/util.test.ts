import { CidrBlock, CidrBlockIpv6, NetworkUtils, defaultSubnetName } from '../lib/util';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';

describe('Tests for the CidrBlock.rangesOverlap method to check if IPv4 ranges overlap', () =>{
  test('Should return false for non-overlapping IP ranges', () => {
    const testCidr = new CidrBlock('10.0.0.0/16');
    const range1 = ['10.0.0.0', '10.0.15.255'] as [string, string];
    const range2 = ['10.0.128.0', '10.0.143.255'] as [string, string];
    expect(testCidr.rangesOverlap(range1, range2)).toBe(false);
  });

  test('Should return true for overlapping IP ranges', () => {
    const testCidr = new CidrBlock('54.0.0.0/17');
    const range1 = ['54.0.0.0', '54.0.127.255'] as [string, string];
    const range2 = ['54.0.100.0', '54.0.192.255'] as [string, string];
    expect(testCidr.rangesOverlap(range1, range2)).toBe(true);
  });

  test('Should return true for overlapping IP ranges where one range is completely inside the other', () => {
    const testCidr = new CidrBlock('10.0.0.0/16');
    const range1 = ['10.0.0.0', '10.0.127.255'] as [string, string];
    const range2 = ['10.0.64.0', '10.0.65.255'] as [string, string];
    expect(testCidr.rangesOverlap(range1, range2)).toBe(true);
  });

  test('Should return true for overlapping IP ranges where the last IP of one range is the first IP of the other', () => {
    const testCidr = new CidrBlock('10.0.0.0/16');
    const range1 = ['10.0.0.0', '10.0.15.255'] as [string, string];
    const range2 = ['10.0.15.255', '10.0.255.255'] as [string, string];
    expect(testCidr.rangesOverlap(range1, range2)).toBe(true);
  });

  test('Should return false for non-overlapping IP ranges where one range starts immediately after the other ends', () => {
    const testCidr = new CidrBlock('10.0.0.0/16');
    const range1 = ['10.0.0.0', '10.0.15.255'] as [string, string];
    const range2 = ['10.0.16.0', '10.0.19.255'] as [string, string];
    expect(testCidr.rangesOverlap(range1, range2)).toBe(false);
  });

  test('Should return false for non-overlapping IPv6 ranges with prefix', () => {
    const testCidr = new CidrBlockIpv6('2001:db8::/32');
    expect(testCidr.rangesOverlap('2001:db8:8::/56', '2001:db8:9::/56')).toBe(false);
  });

  test('Should return true for overlapping IPv6 ranges with prefix', () => {
    const testCidr = new CidrBlockIpv6('2001:db8::/32');
    expect(testCidr.rangesOverlap('2001:db8::1/64', '2001:db8::1/60')).toBe(true);
  });

  test('valid IPv4 addresses return true', () => {
    const validIps = [
      '192.168.1.1',
      '10.0.0.0',
      '172.16.254.1',
      '0.0.0.0',
      '255.255.255.255',
    ];

    validIps.forEach(ip => {
      expect(NetworkUtils.validIp(ip)).toBe(true);
    });
  });

  test('invalid IP addresses return false', () => {
    const invalidIps = [
      '256.1.2.3', // octet > 255
      '1.2.3.256', // octet > 255
      '1.2.3.4.5',
    ];
    invalidIps.forEach(ip => {
      expect(NetworkUtils.validIp(ip)).toBe(false);
    });
  });
});

describe('defaultSubnetName', () => {
  test('returns correct name for PUBLIC subnet type', () => {
    expect(defaultSubnetName(SubnetType.PUBLIC)).toBe('Public');
  });

  test('returns correct name for PRIVATE_WITH_NAT subnet type', () => {
    expect(defaultSubnetName(SubnetType.PRIVATE_WITH_NAT)).toBe('Private');
  });

  test('returns correct name for PRIVATE_WITH_EGRESS subnet type', () => {
    expect(defaultSubnetName(SubnetType.PRIVATE_WITH_EGRESS)).toBe('Private');
  });

  test('returns correct name for PRIVATE_ISOLATED subnet type', () => {
    expect(defaultSubnetName(SubnetType.PRIVATE_ISOLATED)).toBe('Isolated');
  });

  test('returns undefined for unknown subnet type', () => {
    // Testing with an invalid value to simulate unknown subnet type
    const unknownSubnetType = 'UNKNOWN' as any;
    expect(defaultSubnetName(unknownSubnetType)).toBeUndefined();
  });
});
