import json
import os
import unittest
from datetime import datetime

from lib.records import DdbRecordEncoding, TaskInfo, EniInfo

THIS_DIR = os.path.abspath(os.path.dirname(__file__))
with open(os.path.join(THIS_DIR, 'fixtures', 'ddb-record.json')) as f:
    DDB_RECORD_ENCODED = json.loads(f.read())


class TestRecords(unittest.TestCase):
    def test_task_info_stopped_marker(self):
        task_info = TaskInfo(task_arn='a', enis=[])
        task_info.set_stopped_marker()
        self.assertTrue(task_info.is_stopped())

    def test_ddb_record_encoding(self):
        # GIVEN
        ddb_record_encoding = DdbRecordEncoding()

        # WHEN
        ddb_record = ddb_record_encoding.decode(DDB_RECORD_ENCODED)
        ddb_record_reencoded = ddb_record_encoding.encode(ddb_record)

        # THEN
        self.assertEqual(ddb_record.key.cluster_arn, 'CLUSTER_ARN')
        self.assertEqual(ddb_record.key.service_name, 'SERVICE')
        self.assertEqual(sorted(ddb_record.ipv4s), ['1.1.2.1', '1.1.2.2'])
        self.assertEqual(
            ddb_record.task_info['TASK1_ARN'],
            TaskInfo(task_arn='TASK1_ARN', stopped_datetime=datetime(2020, 10, 4, 23, 47, 36, 322158), enis=[
                EniInfo(eni_id='TASK1_ENI1_ID', public_ipv4='1.1.1.1'),
            ]))
        self.assertEqual(
            ddb_record.task_info['TASK2_ARN'],
            TaskInfo(
                task_arn='TASK2_ARN', enis=[
                    EniInfo(eni_id='TASK2_ENI1_ID', public_ipv4='1.1.2.1'),
                    EniInfo(eni_id='TASK2_ENI2_ID', public_ipv4='1.1.2.2'),
                ]))
        self.assertEqual(len(ddb_record.record_sets), 2)

        self.maxDiff = 9999999
        self.assertEqual(ddb_record_reencoded, DDB_RECORD_ENCODED)
