import { expect } from '@aws-cdk/assert-internal';
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { AllowListReceiptFilter, ReceiptFilter, ReceiptFilterPolicy } from '../lib';

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

  'can create an allow list filter'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new AllowListReceiptFilter(stack, 'AllowList', {
      ips: [
        '10.0.0.0/16',
        '1.2.3.4',
      ],
    });

    // THEN
    expect(stack).toMatch({
      'Resources': {
        'AllowListBlockAll094C9B97': {
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
        'AllowListAllow10000164654C092': {
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
        'AllowListAllow12345BCAE5C3': {
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
