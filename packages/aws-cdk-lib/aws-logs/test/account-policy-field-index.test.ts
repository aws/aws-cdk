import { Template } from '../../assertions';
import { Stack } from '../../core';
import { AccountPolicy, AccountPolicyDocument, FieldIndexDataSource, FieldIndexPolicy } from '../lib';

describe('account policy - field index', () => {
  test('trivial instantiation with logGroupNamePrefix', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new AccountPolicy(stack, 'AccountPolicy', {
      policyName: 'MyAccountPolicy',
      policy: AccountPolicyDocument.fieldIndex({
        policy: new FieldIndexPolicy({ fields: ['RequestId', 'TransactionId'] }),
        logGroupNamePrefix: '/aws/lambda/',
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::AccountPolicy', {
      PolicyName: 'MyAccountPolicy',
      PolicyType: 'FIELD_INDEX_POLICY',
      PolicyDocument: JSON.stringify({ Fields: ['RequestId', 'TransactionId'] }),
      SelectionCriteria: 'LogGroupNamePrefix = "/aws/lambda/"',
    });
  });

  test('dataSource is rendered as a DataSourceName/DataSourceType expression', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new AccountPolicy(stack, 'AccountPolicy', {
      policyName: 'MyAccountPolicy',
      policy: AccountPolicyDocument.fieldIndex({
        policy: new FieldIndexPolicy({ fields: ['srcAddr'] }),
        dataSource: FieldIndexDataSource.VPC_FLOW_LOGS,
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::AccountPolicy', {
      SelectionCriteria: 'DataSourceName = "amazon_vpc" AND DataSourceType = "flow"',
    });
  });

  test('a custom data source can be constructed directly', () => {
    const dataSource = new FieldIndexDataSource('custom_source', 'custom_type');
    expect(dataSource.name).toEqual('custom_source');
    expect(dataSource.type).toEqual('custom_type');
  });

  test('selectionCriteria escape hatch is passed through as-is', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new AccountPolicy(stack, 'AccountPolicy', {
      policyName: 'MyAccountPolicy',
      policy: AccountPolicyDocument.fieldIndex({
        policy: new FieldIndexPolicy({ fields: ['srcAddr'] }),
        selectionCriteria: 'LogGroupNamePrefix = "/custom/"',
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::AccountPolicy', {
      SelectionCriteria: 'LogGroupNamePrefix = "/custom/"',
    });
  });

  test('logGroupNamePrefix and dataSource cannot both be specified', () => {
    // GIVEN
    const stack = new Stack();

    // THEN
    expect(() => {
      new AccountPolicy(stack, 'AccountPolicy', {
        policyName: 'MyAccountPolicy',
        policy: AccountPolicyDocument.fieldIndex({
          policy: new FieldIndexPolicy({ fields: ['srcAddr'] }),
          logGroupNamePrefix: '/aws/lambda/',
          dataSource: FieldIndexDataSource.VPC_FLOW_LOGS,
        }),
      });
    }).toThrow('only one of logGroupNamePrefix, dataSource, or selectionCriteria can be specified');
  });

  test('logGroupNamePrefix and selectionCriteria cannot both be specified', () => {
    // GIVEN
    const stack = new Stack();

    // THEN
    expect(() => {
      new AccountPolicy(stack, 'AccountPolicy', {
        policyName: 'MyAccountPolicy',
        policy: AccountPolicyDocument.fieldIndex({
          policy: new FieldIndexPolicy({ fields: ['srcAddr'] }),
          logGroupNamePrefix: '/aws/lambda/',
          selectionCriteria: 'LogGroupNamePrefix = "/custom/"',
        }),
      });
    }).toThrow('only one of logGroupNamePrefix, dataSource, or selectionCriteria can be specified');
  });
});
