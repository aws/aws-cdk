import json
import os
import unittest
import unittest.mock as mock

from boto3.dynamodb.conditions import ConditionExpressionBuilder
from botocore.exceptions import ClientError

from lib.records import DdbRecordKey, TaskInfo, EniInfo, DdbRecord
from lib.records_table import RecordsTableAccessor, update_ddb_record, RecordUpdate
from lib.route53 import Route53RecordSetLocator

THIS_DIR = os.path.abspath(os.path.dirname(__file__))
with open(os.path.join(THIS_DIR, 'fixtures', 'ddb-record.json')) as f:
    DDB_RECORD_ENCODED = json.loads(f.read())


class TestRecordsTable(unittest.TestCase):
    def test_put_tasks_creates_with_optimistic_lock(self):
        # GIVEN
        table_client = mock.Mock()
        table_client.query = mock.Mock(return_value={'Items': []})

        key = DdbRecordKey(cluster_arn='a', service_name='b')
        records_table = RecordsTableAccessor(table_client=table_client)

        running = [TaskInfo(task_arn='TASK1_ARN', enis=[
            EniInfo(eni_id='TASK1_ENI1_ID', public_ipv4='1.1.1.1'),
        ])]

        # WHEN
        records_table.put_update_optimistically(key=key, update=RecordUpdate(running_tasks=running))

        # THEN
        table_client.put_item.assert_called()
        item = table_client.put_item.call_args.kwargs['Item']
        self.assertEqual(item['version'], 1)

        condition_expression = table_client.put_item.call_args.kwargs['ConditionExpression']
        expr, atts, vals = ConditionExpressionBuilder().build_expression(condition_expression)
        self.assertEqual(expr, '(attribute_not_exists(#n0) OR #n1 = :v0)')
        self.assertEqual(atts, {'#n0': 'version', '#n1': 'version'})
        self.assertEqual(vals, {':v0': 0})

    def test_put_tasks_updates_with_optimistic_lock(self):
        # GIVEN
        table_client = mock.Mock()
        table_client.query = mock.Mock(return_value={'Items': [dict(DDB_RECORD_ENCODED)]})

        key = DdbRecordKey(cluster_arn='FOO', service_name='test.myexample.com')
        records_table = RecordsTableAccessor(table_client=table_client)

        running = [TaskInfo(task_arn='TASK1_ARN', enis=[
            EniInfo(eni_id='TASK1_ENI1_ID', public_ipv4='1.1.1.1'),
        ])]

        # WHEN
        records_table.put_update_optimistically(key=key, update=RecordUpdate(running_tasks=running))

        # THEN
        condition_expression = table_client.put_item.call_args.kwargs['ConditionExpression']
        expr, atts, vals = ConditionExpressionBuilder().build_expression(condition_expression)
        self.assertEqual(vals, {':v0': 12})

    def test_put_tasks_retries_optimistically(self):
        # GIVEN
        table_client = mock.Mock()
        table_client.query = mock.Mock(return_value={'Items': []})
        table_client.put_item = mock.Mock(
            side_effect=ClientError({'Error': {
                'Code': 'ConditionalCheckFailedException'
            }}, 'PutItem'))

        records_table = RecordsTableAccessor(table_client=table_client)
        key = DdbRecordKey(cluster_arn='a', service_name='b')

        # WHEN
        with self.assertRaisesRegex(Exception, r'Exceeded maximum retries'):
            records_table.put_update(key=key, update=RecordUpdate())

        # THEN
        self.assertEqual(table_client.query.call_count, records_table.max_attempts)
        self.assertEqual(table_client.put_item.call_count, records_table.max_attempts)

    def test_put_tasks_raises_other_errors(self):
        # GIVEN
        table_client = mock.Mock()
        table_client.query = mock.Mock(return_value={'Items': []})
        table_client.put_item = mock.Mock(side_effect=ClientError({'Error': {'Code': 'SomethingElse'}}, 'PutItem'))

        records_table = RecordsTableAccessor(table_client=table_client)
        key = DdbRecordKey(cluster_arn='a', service_name='b')

        # WHEN
        with self.assertRaisesRegex(Exception, r'SomethingElse'):
            records_table.put_update(key=key, update=RecordUpdate())

        # THEN
        self.assertEqual(table_client.query.call_count, 1)
        self.assertEqual(table_client.put_item.call_count, 1)

    def test_delete(self):
        # GIVEN
        table_client = mock.Mock()
        key = DdbRecordKey(cluster_arn='a', service_name='b')
        records_table = RecordsTableAccessor(table_client=table_client)

        # WHEN
        records_table.delete(key)

        # THEN
        table_client.delete_item.called_with(Key='a#b')

    def test_update_ddb_record(self):
        # GIVEN
        ddb_record = DdbRecord(key=DdbRecordKey(cluster_arn='a', service_name='b'))

        # TASK1->RUNNING, TASK2->RUNNING
        ord1_running = [
            TaskInfo(task_arn='TASK1_ARN', enis=[
                EniInfo(eni_id='TASK1_ENI1_ID', public_ipv4='1.1.1.1'),
            ]),
            TaskInfo(task_arn='TASK2_ARN', enis=[
                EniInfo(eni_id='TASK2_ENI1_ID', public_ipv4='1.1.2.1'),
            ]),
        ]
        # TASK3->STOPPED (out of order)
        ord1_stopped = [
            TaskInfo(task_arn='TASK3_ARN', enis=[
                EniInfo(eni_id='TASK3_ENI1_ID'),
            ]),
        ]

        # TASK1->STOPPED, TASK3->STOPPED (duplicate)
        ord2_stopped = [
            # Expected TASK1 transition to STOPPED
            TaskInfo(task_arn='TASK1_ARN', enis=[
                EniInfo(eni_id='TASK1_ENI1_ID'),
            ]),
            # Duplicate TASK3 transition to STOPPED
            TaskInfo(task_arn='TASK3_ARN', enis=[
                EniInfo(eni_id='TASK3_ENI1_ID'),
            ]),
        ]

        # TASK1->RUNNING (out of order), TASK3->RUNNING (out of order)
        ord3_running = [
            TaskInfo(task_arn='TASK1_ARN', enis=[
                EniInfo(eni_id='TASK1_ENI1_ID', public_ipv4='1.1.1.1'),
            ]),
            TaskInfo(task_arn='TASK3_ARN', enis=[
                EniInfo(eni_id='TASK3_ENI1_ID', public_ipv4='1.1.3.1'),
            ]),
        ]

        # WHEN
        update_ddb_record(ddb_record, RecordUpdate(running_tasks=ord1_running, stopped_tasks=ord1_stopped))
        update_ddb_record(ddb_record, RecordUpdate(stopped_tasks=ord2_stopped))
        update_ddb_record(ddb_record, RecordUpdate(running_tasks=ord3_running))

        # THEN
        self.assertEqual(len(ddb_record.task_info), 3, msg='expected 3 task infos')
        self.assertTrue(ddb_record.task_info['TASK1_ARN'].is_stopped())
        self.assertTrue(not ddb_record.task_info['TASK2_ARN'].is_stopped())
        self.assertTrue(ddb_record.task_info['TASK3_ARN'].is_stopped())

        self.assertFalse('1.1.1.1' in ddb_record.ipv4s,
                         msg='ord3_running should have been ignored because the task previously stopped')
        self.assertEqual(sorted(ddb_record.ipv4s), ['1.1.2.1'])

    def test_update_record_sets(self):
        # GIVEN
        ddb_record = DdbRecord(key=DdbRecordKey(cluster_arn='a', service_name='b'))
        ord1 = [
            Route53RecordSetLocator('a', 'b'),
            Route53RecordSetLocator('a', 'c'),
        ]
        ord2 = [
            Route53RecordSetLocator('a', 'b'),
        ]

        # WHEN
        update_ddb_record(ddb_record, RecordUpdate(record_sets_added=ord1))
        update_ddb_record(ddb_record, RecordUpdate(record_sets_removed=ord2))

        # THEN
        self.assertEqual(len(ddb_record.record_sets), 1)
        self.assertTrue(Route53RecordSetLocator('a', 'c') in ddb_record.record_sets)