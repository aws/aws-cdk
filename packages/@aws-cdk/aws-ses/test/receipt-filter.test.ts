import { Template } from '@aws-cdk/assertions';
import { Stack } from '@aws-cdk/core';
import { AllowListReceiptFilter, ReceiptFilter, ReceiptFilterPolicy } from '../lib';

/* eslint-disable quote-props */

describe('receipt filter', () => {
  test('can create a receipt filter', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new ReceiptFilter(stack, 'Filter', {
      ip: '1.2.3.4/16',
      receiptFilterName: 'MyFilter',
      policy: ReceiptFilterPolicy.BLOCK,
    });

    // THEN
    Template.fromStack(stack).templateMatches({
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


  });

  test('can create an allow list filter', () => {
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
    Template.fromStack(stack).templateMatches({
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


  });
});
