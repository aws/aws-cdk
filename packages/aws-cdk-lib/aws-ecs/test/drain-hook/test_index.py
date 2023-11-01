import unittest
import os
import sys
from unittest.mock import patch

os.environ["CLUSTER"] = "my-cluster"

try:
    # this is available only if executed with ./test.sh
    import index
except ModuleNotFoundError as _:
    print(
        "Unable to import index. Use ./test.sh to run these tests. "
        + 'If you want to avoid running them in docker, run "DRAIN_HOOK_TEST_NO_DOCKER=true ./test.sh"'
    )
    sys.exit(1)


def make_event():
    records = []
    records.append({'Sns': {'Message': '{"EC2InstanceId": "i-xxxxxx", "LifecycleHookName": "my-hook", "LifecycleActionToken": "my-token", "AutoScalingGroupName": "my-asg"}'}})
    return {'Records': records}


def make_event_no_instance_id():
    records = []
    records.append({'Sns': {'Message': '{"food": "bar"}'}})
    return {'Records': records}


class DrainHookTest(unittest.TestCase):
    @patch("index.list_container_instances")
    def test_no_instance_id(self, list):
        event = make_event_no_instance_id()
        index.lambda_handler(event, {})
        list.assert_not_called()

    @patch("index.complete_lifecycle_action")
    @patch("index.list_tasks")
    @patch("index.list_container_instances")
    def test_no_instance_arn(self, list, tasks, complete):
        event = make_event()

        list.return_value = []
        index.lambda_handler(event, {})

        list.assert_called_once_with(
            os.environ["CLUSTER"],
            "i-xxxxxx",
        )
        tasks.assert_not_called()
        complete.assert_not_called()

    @patch("index.complete_lifecycle_action")
    @patch("index.describe_container_instances")
    @patch("index.list_tasks")
    @patch("index.list_container_instances")
    def test_no_list_tasks_no_container_instances(self, list, tasks, describe, complete):
        event = make_event()

        list.return_value = ['some-container-instance-arn']
        tasks.return_value = []
        describe.return_value = []
        index.lambda_handler(event, {})

        list.assert_called_once_with(
            os.environ["CLUSTER"],
            "i-xxxxxx",
        )
        tasks.assert_called_once_with(
            os.environ["CLUSTER"],
            'some-container-instance-arn',
        )
        describe.assert_called_once_with(
            os.environ["CLUSTER"],
            'some-container-instance-arn',
        )
        complete.assert_called_once()

    @patch("index.complete_lifecycle_action")
    @patch("index.describe_tasks")
    @patch("index.describe_container_instances")
    @patch("index.list_tasks")
    @patch("index.list_container_instances")
    def test_has_list_tasks_no_describe_tasks(self, list, tasks, describe, describe_tasks, complete):
        event = make_event()

        list.return_value = ['some-container-instance-arn']
        tasks.return_value = ['task-arn']
        describe.return_value = [{'id': 'i-xxxx', 'status': 'TERMINATED', 'runningTasksCount': 0, 'pendingTasksCount': 0}]
        describe_tasks.return_value = []
        index.lambda_handler(event, {})

        list.assert_called_once_with(
            os.environ["CLUSTER"],
            "i-xxxxxx",
        )
        tasks.assert_called_once_with(
            os.environ["CLUSTER"],
            'some-container-instance-arn',
        )
        describe.assert_called_once_with(
            os.environ["CLUSTER"],
            'some-container-instance-arn',
        )
        describe_tasks.assert_called_once_with(
            os.environ["CLUSTER"],
            tasks.return_value,
        )
        complete.assert_called_once()


if __name__ == "__main__":
    unittest.main()
