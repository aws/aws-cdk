import json
import os
import unittest

from lib.events import extract_event_task_info

THIS_DIR = os.path.abspath(os.path.dirname(__file__))
with open(os.path.join(THIS_DIR, 'fixtures', 'task_description.json')) as f:
    TASK_DESCRIPTION = json.loads(f.read())


class TestEvents(unittest.TestCase):
    def test_extract_event_task_info(self):
        task_info = extract_event_task_info(TASK_DESCRIPTION)

        self.assertEqual(task_info.task_arn, 'arn:aws:ecs:test-region-1::task/12345678-1234-1234-1234-1234567890AB')
        self.assertTrue(not task_info.is_stopped())

        self.assertEqual(len(task_info.enis), 1)
        self.assertEqual(task_info.enis[0].eni_id, 'eni-abcd')
        self.assertEqual(task_info.enis[0].public_ipv4, None)
