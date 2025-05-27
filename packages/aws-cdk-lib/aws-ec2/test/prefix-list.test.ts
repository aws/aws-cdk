import { Template } from '../../assertions';
import * as cxschema from '../../cloud-assembly-schema';
import { CfnParameter, ContextProvider, Stack } from '../../core';
import { AddressFamily, PrefixList } from '../lib/prefix-list';

afterEach(() => {
  jest.restoreAllMocks();
});

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

  test('invalid ipv4', () => {
    // GIVEN
    const stack = new Stack();
    expect(() => {
      new PrefixList(stack, 'prefix-list', {
        entries: [
          { cidr: '10.0.0.1/32' },
          { cidr: '::/0', description: 'sample1' },
        ],
      });
    }).toThrow('Invalid IPv4 address range: ::/0');
  });

  test('invalid ipv6', () => {
    // GIVEN
    const stack = new Stack();
    expect(() => {
      new PrefixList(stack, 'prefix-list', {
        addressFamily: AddressFamily.IP_V6,
        entries: [
          { cidr: '10.0.0.1/32' },
          { cidr: '::/0', description: 'sample1' },
        ],
      });
    }).toThrow('Invalid IPv6 address range: 10.0.0.1/32');
  });

  test('fromLookup returns a correct PrefixList', () => {
    // GIVEN
    const resultObjs = [
      { Identifier: 'pl-deadbeef', PrefixListId: 'pl-deadbeef' },
    ];
    const mock = jest.spyOn(ContextProvider, 'getValue').mockReturnValue({ value: resultObjs });

    // WHEN
    const stack = new Stack(undefined, undefined, { env: { region: 'us-east-1', account: '123456789012' } });
    const prefixList = PrefixList.fromLookup(stack, 'PrefixList', {
      prefixListName: 'com.amazonaws.us-east-1.testprefixlist',
    });

    // THEN
    expect(prefixList.prefixListId).toEqual('pl-deadbeef');
    expect(mock).toHaveBeenCalledWith(stack, {
      provider: cxschema.ContextProvider.CC_API_PROVIDER,
      props: {
        typeName: 'AWS::EC2::PrefixList',
        propertyMatch: {
          PrefixListName: 'com.amazonaws.us-east-1.testprefixlist',
        },
        propertiesToReturn: ['PrefixListId'],
      },
      dummyValue: [
        { PrefixListId: 'pl-xxxxxxxx' },
      ],
    });
  });

  test('fromLookup queries with ownerId and addressFamily', () => {
    // GIVEN
    const resultObjs = [
      { Identifier: 'pl-deadbeef', PrefixListId: 'pl-deadbeef' },
    ];
    const mock = jest.spyOn(ContextProvider, 'getValue').mockReturnValue({ value: resultObjs });

    // WHEN
    const stack = new Stack(undefined, undefined, { env: { region: 'us-east-1', account: '123456789012' } });
    const prefixList = PrefixList.fromLookup(stack, 'PrefixList', {
      prefixListName: 'com.amazonaws.us-east-1.testprefixlist',
      ownerId: '234567890123',
      addressFamily: AddressFamily.IP_V6,
    });

    // THEN
    expect(prefixList.prefixListId).toEqual('pl-deadbeef');
    expect(mock).toHaveBeenCalledWith(stack, {
      provider: cxschema.ContextProvider.CC_API_PROVIDER,
      props: {
        typeName: 'AWS::EC2::PrefixList',
        propertyMatch: {
          PrefixListName: 'com.amazonaws.us-east-1.testprefixlist',
          OwnerId: '234567890123',
          AddressFamily: 'IPv6',
        },
        propertiesToReturn: ['PrefixListId'],
      },
      dummyValue: [
        { PrefixListId: 'pl-xxxxxxxx' },
      ],
    });
  });

  test('fromLookup throws if prefix list name is a token', () => {
    // WHEN
    const stack = new Stack(undefined, undefined, { env: { region: 'us-east-1', account: '123456789012' } });
    const prefixListName = new CfnParameter(stack, 'PrefixListName');

    // THEN
    expect(() => {
      PrefixList.fromLookup(stack, 'PrefixList', { prefixListName: prefixListName.valueAsString });
    }).toThrow('All arguments to look up a managed prefix list must be concrete (no Tokens)');
  });

  test('fromLookup throws if not found', () => {
    // GIVEN
    const resultObjs = [];
    jest.spyOn(ContextProvider, 'getValue').mockReturnValue({ value: resultObjs });

    // WHEN
    const stack = new Stack(undefined, undefined, { env: { region: 'us-east-1', account: '123456789012' } });

    // THEN
    expect(() => {
      PrefixList.fromLookup(stack, 'PrefixList', {
        prefixListName: 'com.amazonaws.us-east-1.missingprefixlist',
      });
    }).toThrow('Could not find any managed prefix lists matching');
  });

  test('fromLookup throws if multiple resources found', () => {
    // GIVEN
    const resultObjs = [{ PrefixListId: 'pl-xxxxxxxx' }, { PrefixListId: 'pl-yyyyyyyy' }];
    jest.spyOn(ContextProvider, 'getValue').mockReturnValue({ value: resultObjs });

    // WHEN
    const stack = new Stack(undefined, undefined, { env: { region: 'us-east-1', account: '123456789012' } });

    // THEN
    expect(() => {
      PrefixList.fromLookup(stack, 'PrefixList', {
        prefixListName: 'com.amazonaws.us-east-1.missingprefixlist',
      });
    }).toThrow('Found 2 managed prefix lists matching');
  });
});
