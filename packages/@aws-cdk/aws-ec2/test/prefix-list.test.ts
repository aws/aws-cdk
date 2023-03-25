import { Template } from '@aws-cdk/assertions';
import { Stack } from '@aws-cdk/core';
import { AddressFamily, PrefixList } from '../lib/prefix-list';

describe('prefix list', () => {
  test('default empty prefixlist', () => {
    // GIVEN
    const stack = new Stack();
    new PrefixList(stack, 'prefix-list', {
      maxEntries: 100,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::PrefixList', {
      AddressFamily: 'IPv4',
      MaxEntries: 100,
    });
  });
  test('default empty IPv6 prefixlist', () => {
    // GIVEN
    const stack = new Stack();

    new PrefixList(stack, 'prefix-list', {
      maxEntries: 100,
      prefixListName: 'prefix-list',
      addressFamily: AddressFamily.IP_V6,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::PrefixList', {
      AddressFamily: 'IPv6',
      MaxEntries: 100,
      PrefixListName: 'prefix-list',
    });
  });

  test('prefixlist with entries', () => {
    // GIVEN
    const stack = new Stack();
    new PrefixList(stack, 'prefix-list', {
      entries: [
        { cidr: '10.0.0.1/32' },
        { cidr: '10.0.0.2/32', description: 'sample1' },
      ],
      prefixListName: 'prefix-list',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::PrefixList', {
      AddressFamily: 'IPv4',
      MaxEntries: 2,
      Entries: [
        { Cidr: '10.0.0.1/32' },
        { Cidr: '10.0.0.2/32', Description: 'sample1' },
      ],
    });
  });

  test('invalid prefixlist name startwith amazon', () => {
    // GIVEN
    const stack = new Stack();
    expect(() => {
      new PrefixList(stack, 'prefix-list', {
        maxEntries: 100,
        prefixListName: 'com.amazonawsprefix-list',
      });
    }).toThrow('The name cannot start with \'com.amazonaws.\'');
  });

  test('invalid prefixlist-name over 255 characters', () => {
    // GIVEN
    const stack = new Stack();
    expect(() => {
      new PrefixList(stack, 'prefix-list', {
        maxEntries: 100,
        prefixListName: 'a'.repeat(256),
      });
    }).toThrow('Lengths exceeding 255 characters cannot be set.');
  });

});