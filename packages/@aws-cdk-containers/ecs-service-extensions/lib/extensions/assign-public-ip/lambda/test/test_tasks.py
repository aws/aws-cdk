import json
import os
import unittest
import unittest.mock as mock

from lib.tasks import *

THIS_DIR = os.path.abspath(os.path.dirname(__file__))
with open(os.path.join(THIS_DIR, 'fixtures', 'task_description.json')) as f:
    TASK_DESCRIPTION = json.loads(f.read())
with open(os.path.join(THIS_DIR, 'fixtures', 'eni_description.json')) as f:
    ENI_DESCRIPTION = json.loads(f.read())


class TestRunningTasks(unittest.TestCase):
    def test_task_info_stopped_marker(self):
        task_info = TaskInfo(task_arn='a', enis=[])
        task_info.set_stopped_marker()
        self.assertTrue(task_info.is_stopped())

    def test_task_collector(self):
        # GIVEN
        ec2_client = mock.Mock()
        paginator = mock.Mock()
        paginator.paginate = mock.Mock(return_value=[{'NetworkInterfaces': [ENI_DESCRIPTION]}])
        ec2_client.get_paginator = mock.Mock(return_value=paginator)

        collector = RunningTaskCollector(ec2_client=ec2_client)

        # WHEN
        task_info = extract_task_info(TASK_DESCRIPTION)
        collector.collect(task_info)
        collector.fill_eni_info_from_eni_query()

        # THEN
        paginator.paginate.assert_called_with(NetworkInterfaceIds=['eni-abcd'])
        self.assertTrue('1.2.3.4' in collector.get_ips())
