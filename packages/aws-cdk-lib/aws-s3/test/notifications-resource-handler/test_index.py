from typing import Dict
import unittest
import uuid
import os
import sys
from unittest.mock import MagicMock, patch

# boto needs a region to initialize the client
# even if no calls are executed.
os.environ["AWS_DEFAULT_REGION"] = "us-east-1"

try:
    # this is available only if executed with ./test.sh
    import index
except ModuleNotFoundError as _:
    print(
        "Unable to import index. Use ./test.sh to run these tests. "
        + 'If you want to avoid running them in docker, run "NOTIFICATIONS_RESOURCE_TEST_NO_DOCKER=true ./test.sh"'
    )
    sys.exit(1)

EVENTBRIDGE_CONFIGURATION = 'EventBridgeConfiguration'

CONFIGURATION_TYPES = ["TopicConfigurations", "QueueConfigurations", "LambdaFunctionConfigurations"]


def make_event(request_type: str, managed: bool):
    return {
        "StackId": "StackId",
        "RequestType": request_type,
        "ResourceProperties": {
            "Managed": str(managed),
            "BucketName": "BucketName",
            "NotificationConfiguration": make_notification_configuration(),
        },
    }

def make_event_with_eventbridge(request_type: str, managed: bool):
    return {
        "StackId": "StackId",
        "RequestType": request_type,
        "ResourceProperties": {
            "Managed": str(managed),
            "BucketName": "BucketName",
            "NotificationConfiguration": make_notification_configuration_with_eventbridge(),
        },
    }

def make_notification_configuration(id_prefix: str = None):
    def make_id():
        return f"{id_prefix or ''}{str(uuid.uuid4())}"

    config = {}
    for t in CONFIGURATION_TYPES:
        config[t] = [{"Id": make_id()}]
    return config

def make_notification_configuration_with_eventbridge(id_prefix: str = None):
    return {**make_notification_configuration(id_prefix), **make_eventbridge_configuration()}

def make_eventbridge_configuration():
    return { EVENTBRIDGE_CONFIGURATION: {} }

def make_empty_notification_configuration():
    config = {}
    for t in CONFIGURATION_TYPES:
        config[t] = []
    return config

def make_empty_notification_configuration_with_eventbridge():
    return {**make_empty_notification_configuration(), **make_eventbridge_configuration()}


def merge_notification_configurations(conf1: Dict, conf2: Dict):
    notifications = {}
    for t in CONFIGURATION_TYPES:
        notifications[t] = conf1.get(t, []) + conf2.get(t, [])

    if EVENTBRIDGE_CONFIGURATION in conf1:
        notifications[EVENTBRIDGE_CONFIGURATION] = conf1[EVENTBRIDGE_CONFIGURATION]

    if EVENTBRIDGE_CONFIGURATION in conf2:
        notifications[EVENTBRIDGE_CONFIGURATION] = conf2[EVENTBRIDGE_CONFIGURATION]

    return notifications


class ManagedBucketTest(unittest.TestCase):
    @patch("index.put_bucket_notification_configuration")
    @patch("index.submit_response")
    def test_create(self, _, put: MagicMock):

        event = make_event("Create", True)

        index.handler(event, {})

        put.assert_called_once_with(
            event["ResourceProperties"]["BucketName"],
            event["ResourceProperties"]["NotificationConfiguration"],
        )

    @patch("index.put_bucket_notification_configuration")
    @patch("index.submit_response")
    def test_update(self, _, put):

        event = make_event("Update", True)

        index.handler(event, {})

        put.assert_called_once_with(
            event["ResourceProperties"]["BucketName"],
            event["ResourceProperties"]["NotificationConfiguration"],
        )

    @patch("index.put_bucket_notification_configuration")
    @patch("index.submit_response")
    def test_delete(self, _, put: MagicMock):

        event = make_event("Delete", True)

        index.handler(event, {})

        put.assert_called_once_with(event["ResourceProperties"]["BucketName"], {})


class UnmanagedCleanBucketTest(unittest.TestCase):
    @patch("index.put_bucket_notification_configuration")
    @patch("index.get_bucket_notification_configuration")
    @patch("index.submit_response")
    def test_create(self, _, get: MagicMock, put: MagicMock):

        get.return_value = {}

        event = make_event("Create", False)

        index.handler(event, {})

        put.assert_called_once_with(
            event["ResourceProperties"]["BucketName"],
            event["ResourceProperties"]["NotificationConfiguration"],
        )

    @patch("index.put_bucket_notification_configuration")
    @patch("index.get_bucket_notification_configuration")
    @patch("index.submit_response")
    def test_create_with_eventbridge(self, _, get: MagicMock, put: MagicMock):

        get.return_value = {}

        event = make_event_with_eventbridge("Create", False)

        index.handler(event, {})

        put.assert_called_once_with(
            event["ResourceProperties"]["BucketName"],
            event["ResourceProperties"]["NotificationConfiguration"],
        )

    @patch("index.put_bucket_notification_configuration")
    @patch("index.get_bucket_notification_configuration")
    @patch("index.submit_response")
    def test_update(self, _, get: MagicMock, put: MagicMock):

        event = make_event("Update", False)

        # simulate a previous create operation
        current_notifications = make_notification_configuration(f"{event['StackId']}-")
        get.return_value = current_notifications

        index.handler(event, {})

        put.assert_called_once_with(
            event["ResourceProperties"]["BucketName"],
            event["ResourceProperties"]["NotificationConfiguration"],
        )

    @patch("index.put_bucket_notification_configuration")
    @patch("index.get_bucket_notification_configuration")
    @patch("index.submit_response")
    def test_update_with_eventbridge(self, _, get: MagicMock, put: MagicMock):

        event = make_event_with_eventbridge("Update", False)

        # simulate a previous create operation
        current_notifications = make_notification_configuration(f"{event['StackId']}-")
        get.return_value = current_notifications

        index.handler(event, {})

        put.assert_called_once_with(
            event["ResourceProperties"]["BucketName"],
            event["ResourceProperties"]["NotificationConfiguration"],
        )


    @patch("index.put_bucket_notification_configuration")
    @patch("index.get_bucket_notification_configuration")
    @patch("index.submit_response")
    def test_update_with_existing_eventbridge(self, _, get: MagicMock, put: MagicMock):

        event = make_event("Update", False)

        # simulate a previous create operation
        current_notifications = make_notification_configuration_with_eventbridge(f"{event['StackId']}-")
        get.return_value = current_notifications

        index.handler(event, {})

        put.assert_called_once_with(
            event["ResourceProperties"]["BucketName"],
            merge_notification_configurations(
                make_eventbridge_configuration(),
                event["ResourceProperties"]["NotificationConfiguration"],
            ),
        )

    @patch("index.put_bucket_notification_configuration")
    @patch("index.get_bucket_notification_configuration")
    @patch("index.submit_response")
    def test_delete(self, _, get: MagicMock, put: MagicMock):

        event = make_event("Delete", False)

        # simulate a previous create operation
        current_notifications = make_notification_configuration(f"{event['StackId']}-")
        get.return_value = current_notifications

        index.handler(event, {})

        put.assert_called_once_with(
            event["ResourceProperties"]["BucketName"],
            make_empty_notification_configuration(),
        )

    @patch("index.put_bucket_notification_configuration")
    @patch("index.get_bucket_notification_configuration")
    @patch("index.submit_response")
    def test_delete_with_eventbridge_should_not_remove_eventbridge(self, _, get: MagicMock, put: MagicMock):

        event = make_event_with_eventbridge("Delete", False)

        # simulate a previous create operation
        current_notifications = make_notification_configuration_with_eventbridge(f"{event['StackId']}-")
        get.return_value = current_notifications

        index.handler(event, {})

        put.assert_called_once_with(
            event["ResourceProperties"]["BucketName"],
            make_empty_notification_configuration_with_eventbridge(),
        )


class UnmanagedDirtyBucketTest(unittest.TestCase):
    @patch("index.put_bucket_notification_configuration")
    @patch("index.get_bucket_notification_configuration")
    @patch("index.submit_response")
    def test_create(self, _, get: MagicMock, put: MagicMock):

        event = make_event("Create", False)

        # simulate external notifications
        current_notifications = make_notification_configuration()
        get.return_value = current_notifications

        index.handler(event, {})

        put.assert_called_once_with(
            event["ResourceProperties"]["BucketName"],
            merge_notification_configurations(
                current_notifications,
                event["ResourceProperties"]["NotificationConfiguration"],
            ),
        )

    @patch("index.put_bucket_notification_configuration")
    @patch("index.get_bucket_notification_configuration")
    @patch("index.submit_response")
    def test_create_with_eventbridge(self, _, get: MagicMock, put: MagicMock):

        event = make_event_with_eventbridge("Create", False)

        # simulate external notifications
        current_notifications = make_notification_configuration()
        get.return_value = current_notifications

        index.handler(event, {})

        put.assert_called_once_with(
            event["ResourceProperties"]["BucketName"],
            merge_notification_configurations(
                current_notifications,
                event["ResourceProperties"]["NotificationConfiguration"],
            ),
        )

    @patch("index.put_bucket_notification_configuration")
    @patch("index.get_bucket_notification_configuration")
    @patch("index.submit_response")
    def test_create_with_existing_eventbridge(self, _, get: MagicMock, put: MagicMock):

        event = make_event("Create", False)

        # simulate external notifications
        current_notifications = make_notification_configuration_with_eventbridge()
        get.return_value = current_notifications

        index.handler(event, {})

        put.assert_called_once_with(
            event["ResourceProperties"]["BucketName"],
            merge_notification_configurations(
                current_notifications,
                event["ResourceProperties"]["NotificationConfiguration"],
            ),
        )

    @patch("index.put_bucket_notification_configuration")
    @patch("index.get_bucket_notification_configuration")
    @patch("index.submit_response")
    def test_update(self, _, get: MagicMock, put: MagicMock):

        event = make_event("Update", False)

        # simulate external notifications
        current_notifications = make_notification_configuration()
        get.return_value = current_notifications

        index.handler(event, {})

        put.assert_called_once_with(
            event["ResourceProperties"]["BucketName"],
            merge_notification_configurations(
                current_notifications,
                event["ResourceProperties"]["NotificationConfiguration"],
            ),
        )

    @patch("index.put_bucket_notification_configuration")
    @patch("index.get_bucket_notification_configuration")
    @patch("index.submit_response")
    def test_update_with_eventbridge(self, _, get: MagicMock, put: MagicMock):

        event = make_event_with_eventbridge("Update", False)

        # simulate external notifications
        current_notifications = make_notification_configuration()
        get.return_value = current_notifications

        index.handler(event, {})

        put.assert_called_once_with(
            event["ResourceProperties"]["BucketName"],
            merge_notification_configurations(
                current_notifications,
                event["ResourceProperties"]["NotificationConfiguration"],
            ),
        )

    @patch("index.put_bucket_notification_configuration")
    @patch("index.get_bucket_notification_configuration")
    @patch("index.submit_response")
    def test_update_without_eventbridge_should_not_remove_existing_eventbridge(self, _, get: MagicMock, put: MagicMock):

        event = make_event("Update", False)

        # simulate external notifications
        current_notifications = make_notification_configuration_with_eventbridge()
        get.return_value = current_notifications

        index.handler(event, {})

        put.assert_called_once_with(
            event["ResourceProperties"]["BucketName"],
            merge_notification_configurations(
                current_notifications,
                event["ResourceProperties"]["NotificationConfiguration"],
            ),
        )

    @patch("index.put_bucket_notification_configuration")
    @patch("index.get_bucket_notification_configuration")
    @patch("index.submit_response")
    def test_delete(self, _, get: MagicMock, put: MagicMock):

        event = make_event("Delete", False)

        # simulate external notifications
        current_notifications = make_notification_configuration()
        get.return_value = current_notifications

        index.handler(event, {})

        put.assert_called_once_with(
            event["ResourceProperties"]["BucketName"],
            current_notifications,
        )

    @patch("index.put_bucket_notification_configuration")
    @patch("index.get_bucket_notification_configuration")
    @patch("index.submit_response")
    def test_delete_with_eventbridge_should_not_remove_eventbridge(self, _, get: MagicMock, put: MagicMock):

        event = make_event_with_eventbridge("Delete", False)

        # simulate external notifications
        current_notifications = make_notification_configuration_with_eventbridge()
        get.return_value = current_notifications

        index.handler(event, {})

        put.assert_called_once_with(
            event["ResourceProperties"]["BucketName"],
            current_notifications,
        )


class CfnResponsesTest(unittest.TestCase):
    @patch("index.put_bucket_notification_configuration")
    @patch("index.handle_managed")
    @patch("index.submit_response")
    def test_success(self, submit: MagicMock, *_):

        event = make_event("Create", True)

        index.handler(event, {})

        submit.assert_called_once()
        self.assertEqual(submit.call_args_list[0][0][2], "SUCCESS")

    @patch("index.handle_managed")
    @patch("index.submit_response")
    def test_failure(self, submit: MagicMock, handle_managed: MagicMock):

        event = make_event("Create", True)

        def throw(*_):
            raise RuntimeError("Intentional error for test")

        handle_managed.side_effect = throw

        index.handler(event, {})

        submit.assert_called_once()
        self.assertEqual(submit.call_args_list[0][0][2], "FAILED")


if __name__ == "__main__":
    unittest.main()
