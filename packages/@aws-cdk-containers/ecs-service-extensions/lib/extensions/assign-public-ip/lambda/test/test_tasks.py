import json
import os
import unittest
import unittest.mock as mock
from datetime import datetime

from lib.events import extract_event_task_info
from lib.records import TaskInfo, DdbRecord, DdbRecordKey
from lib.running_task_collector import RunningTaskCollector

THIS_DIR = os.path.abspath(os.path.dirname(__file__))
with open(os.path.join(THIS_DIR, 'fixtures', 'task_description.json')) as f:
    TASK_DESCRIPTION = json.loads(f.read())
with open(os.path.join(THIS_DIR, 'fixtures', 'eni_description.json')) as f:
    ENI_DESCRIPTION = json.loads(f.read())


class TestRunningTasksCollector(unittest.TestCase):
    def test_task_collector(self):
        # GIVEN
        ec2_client = mock.Mock()
        paginator = mock.Mock()
        paginator.paginate = mock.Mock(return_value=[{'NetworkInterfaces': [ENI_DESCRIPTION]}])
        ec2_client.get_paginator = mock.Mock(return_value=paginator)

        reference_record = DdbRecord(key=DdbRecordKey(cluster_arn="A", service_name="B"))
        collector = RunningTaskCollector(ec2_client=ec2_client, reference_record=reference_record)

        # WHEN
        task_info = extract_event_task_info(TASK_DESCRIPTION)
        collector.collect(task_info)
        collector.fill_eni_info_from_eni_query()

        # THEN
        paginator.paginate.assert_called_with(NetworkInterfaceIds=['eni-abcd'])
        self.assertTrue('1.2.3.4' in collector.get_ips())

    def test_task_collector_doesnt_collect_stopped_tasks(self):
        # GIVEN
        ec2_client = mock.Mock()
        paginator = mock.Mock()
        paginator.paginate = mock.Mock(return_value=[{'NetworkInterfaces': [ENI_DESCRIPTION]}])
        ec2_client.get_paginator = mock.Mock(return_value=paginator)

        task_arn = TASK_DESCRIPTION['taskArn']
        task_info = {task_arn: TaskInfo(task_arn=task_arn, enis=[], stopped_datetime=datetime.utcnow())}
        reference_record = DdbRecord(key=DdbRecordKey(cluster_arn="A", service_name="B"), task_info=task_info)
        collector = RunningTaskCollector(ec2_client=ec2_client, reference_record=reference_record)

        # WHEN
        task_info = extract_event_task_info(TASK_DESCRIPTION)
        collector.collect(task_info)

        # THEN
        self.assertEqual(len(collector.tasks), 0)
