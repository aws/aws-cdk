import { expect } from '@aws-cdk/assert-internal';
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { ReceiptFilter, ReceiptFilterPolicy, WhiteListReceiptFilter } from '../lib';

/* eslint-disable quote-props */

export = {
  'can create a receipt filter'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new ReceiptFilter(stack, 'Filter', {
      ip: '1.2.3.4/16',
      receiptFilterName: 'MyFilter',
      policy: ReceiptFilterPolicy.BLOCK,
    });

    // THEN
    expect(stack).toMatch({
      'Resources': {
        'FilterC907D6DA': {
          'Type': 'AWS::SES::ReceiptFilter',
          'Properties': {
            'Filter': {
              'IpFilter': {
                'Cidr': '1.2.3.4/16',
                'Policy': 'Block',
              },
              'Name': 'MyFilter',
            },
          },
        },
      },
    });

    test.done();
  },

  'can create a white list filter'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new WhiteListReceiptFilter(stack, 'WhiteList', {
      ips: [
        '10.0.0.0/16',
        '1.2.3.4',
      ],
    });

    // THEN
    expect(stack).toMatch({
      'Resources': {
        'WhiteListBlockAllAE2CDDFF': {
          'Type': 'AWS::SES::ReceiptFilter',
          'Properties': {
            'Filter': {
              'IpFilter': {
                'Cidr': '0.0.0.0/0',
                'Policy': 'Block',
              },
            },
          },
        },
        'WhiteListAllow1000016F396A7F2': {
          'Type': 'AWS::SES::ReceiptFilter',
          'Properties': {
            'Filter': {
              'IpFilter': {
                'Cidr': '10.0.0.0/16',
                'Policy': 'Allow',
              },
            },
          },
        },
        'WhiteListAllow1234A4DDAD4E': {
          'Type': 'AWS::SES::ReceiptFilter',
          'Properties': {
            'Filter': {
              'IpFilter': {
                'Cidr': '1.2.3.4',
                'Policy': 'Allow',
              },
            },
          },
        },
      },
    });

    test.done();
  },
};
