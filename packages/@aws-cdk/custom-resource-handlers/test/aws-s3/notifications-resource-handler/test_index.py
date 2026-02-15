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
            "SkipDestinationValidation": str(False),
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
            "SkipDestinationValidation": str(False),
        },
    }

def make_event_with_skip_destination_validation(request_type: str, managed: bool):
    return {
        "StackId": "StackId",
        "RequestType": request_type,
        "ResourceProperties": {
            "Managed": str(managed),
            "BucketName": "BucketName",
            "NotificationConfiguration": make_notification_configuration(),
            "SkipDestinationValidation": str(True),
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
    @patch('index.s3')
    @patch("index.submit_response")
    def test_create(self, _, mock_s3: MagicMock):
        
        event = make_event("Create", True)

        index.handler(event, {})

        mock_s3.put_bucket_notification_configuration.assert_called_once_with(
            Bucket=event["ResourceProperties"]["BucketName"],
            NotificationConfiguration=event["ResourceProperties"]["NotificationConfiguration"],
            SkipDestinationValidation=False,
        )

    @patch('index.s3')
    @patch("index.submit_response")
    def test_update(self, _, mock_s3: MagicMock):
        
        event = make_event("Update", True)

        index.handler(event, {})

        mock_s3.put_bucket_notification_configuration.assert_called_once_with(
            Bucket=event["ResourceProperties"]["BucketName"],
            NotificationConfiguration=event["ResourceProperties"]["NotificationConfiguration"],
            SkipDestinationValidation=False,
        )

    @patch('index.s3')
    @patch("index.submit_response")
    def test_delete(self, _, mock_s3: MagicMock):
        
        event = make_event("Delete", True)

        index.handler(event, {})

        mock_s3.put_bucket_notification_configuration.assert_called_once_with(
            Bucket=event["ResourceProperties"]["BucketName"],
            NotificationConfiguration={},
            SkipDestinationValidation=False,
        )

    @patch('index.s3')
    @patch("index.submit_response")
    def test_skip_destination_validation(self, _, mock_s3: MagicMock):
        
        event = make_event_with_skip_destination_validation("Create", True)

        index.handler(event, {})

        mock_s3.put_bucket_notification_configuration.assert_called_once_with(
            Bucket=event["ResourceProperties"]["BucketName"],
            NotificationConfiguration=event["ResourceProperties"]["NotificationConfiguration"],
            SkipDestinationValidation=True,
        )


class UnmanagedCleanBucketTest(unittest.TestCase):
    @patch('index.s3')
    @patch("index.submit_response")
    def test_create(self, _, mock_s3: MagicMock):
        
        mock_s3.get_bucket_notification_configuration.return_value = {}

        event = make_event("Create", False)

        index.handler(event, {})

        mock_s3.put_bucket_notification_configuration.assert_called_once_with(
            Bucket=event["ResourceProperties"]["BucketName"],
            NotificationConfiguration=event["ResourceProperties"]["NotificationConfiguration"],
            SkipDestinationValidation=False,
        )

    @patch('index.s3')
    @patch("index.submit_response")
    def test_create_with_eventbridge(self, _, mock_s3: MagicMock):
        
        mock_s3.get_bucket_notification_configuration.return_value = {}

        event = make_event_with_eventbridge("Create", False)

        index.handler(event, {})

        mock_s3.put_bucket_notification_configuration.assert_called_once_with(
            Bucket=event["ResourceProperties"]["BucketName"],
            NotificationConfiguration=event["ResourceProperties"]["NotificationConfiguration"],
            SkipDestinationValidation=False,
        )

    @patch('index.s3')
    @patch("index.submit_response")
    def test_update(self, _, mock_s3: MagicMock):
        
        event = make_event("Update", False)

        # simulate a previous create operation
        current_notifications = make_notification_configuration(f"{event['StackId']}-")
        mock_s3.get_bucket_notification_configuration.return_value = current_notifications

        index.handler(event, {})

        mock_s3.put_bucket_notification_configuration.assert_called_once_with(
            Bucket=event["ResourceProperties"]["BucketName"],
            NotificationConfiguration=merge_notification_configurations(
                current_notifications,
                event["ResourceProperties"]["NotificationConfiguration"]
            ),
            SkipDestinationValidation=False,
        )


    @patch('index.s3')
    @patch("index.submit_response")
    def test_delete_existing_s3_notifications(self, _, mock_s3: MagicMock):

        event = make_event("Update", False)

        # simulate a previous create operation
        current_notifications = make_notification_configuration(f"{event['StackId']}-")
        mock_s3.get_bucket_notification_configuration.return_value = current_notifications

        index.handler(event, {})

        mock_s3.put_bucket_notification_configuration.assert_called_once_with(
            Bucket=event["ResourceProperties"]["BucketName"],
            NotificationConfiguration=merge_notification_configurations(
                current_notifications,
                event["ResourceProperties"]["NotificationConfiguration"]
            ),
            SkipDestinationValidation=False,
        )
        
    @patch('index.s3')
    @patch("index.submit_response")
    def test_update_with_eventbridge(self, _, mock_s3: MagicMock):
        
        event = make_event_with_eventbridge("Update", False)

        # simulate a previous create operation
        current_notifications = make_notification_configuration(f"{event['StackId']}-")
        mock_s3.get_bucket_notification_configuration.return_value = current_notifications

        index.handler(event, {})

        mock_s3.put_bucket_notification_configuration.assert_called_once_with(
            Bucket=event["ResourceProperties"]["BucketName"],
            NotificationConfiguration=merge_notification_configurations(
                current_notifications,
                event["ResourceProperties"]["NotificationConfiguration"]
            ),
            SkipDestinationValidation=False,
        )


    @patch('index.s3')
    @patch("index.submit_response")
    def test_update_with_existing_eventbridge(self, _, mock_s3: MagicMock):
        
        event = make_event("Update", False)

        # simulate a previous create operation
        current_notifications = make_notification_configuration_with_eventbridge(f"{event['StackId']}-")
        mock_s3.get_bucket_notification_configuration.return_value = current_notifications

        index.handler(event, {})

        mock_s3.put_bucket_notification_configuration.assert_called_once_with(
            Bucket=event["ResourceProperties"]["BucketName"],
            NotificationConfiguration=merge_notification_configurations(
                current_notifications,
                event["ResourceProperties"]["NotificationConfiguration"],
            ),
            SkipDestinationValidation=False,
        )

    @patch('index.s3')
    @patch("index.submit_response")
    def test_delete(self, _, mock_s3: MagicMock):
        
        event = make_event("Delete", False)

        # simulate a previous create operation
        current_notifications = make_notification_configuration(f"{event['StackId']}-")
        mock_s3.get_bucket_notification_configuration.return_value = current_notifications

        index.handler(event, {})

        mock_s3.put_bucket_notification_configuration.assert_called_once_with(
            Bucket=event["ResourceProperties"]["BucketName"],
            NotificationConfiguration=make_empty_notification_configuration(),
            SkipDestinationValidation=False,
        )

    @patch('index.s3')
    @patch("index.submit_response")
    def test_delete_with_eventbridge_should_not_remove_eventbridge(self, _, mock_s3: MagicMock):
        
        event = make_event_with_eventbridge("Delete", False)

        # simulate a previous create operation
        current_notifications = make_notification_configuration_with_eventbridge(f"{event['StackId']}-")
        mock_s3.get_bucket_notification_configuration.return_value = current_notifications

        index.handler(event, {})

        mock_s3.put_bucket_notification_configuration.assert_called_once_with(
            Bucket=event["ResourceProperties"]["BucketName"],
            NotificationConfiguration=make_empty_notification_configuration_with_eventbridge(),
            SkipDestinationValidation=False,
        )


class UnmanagedDirtyBucketTest(unittest.TestCase):
    @patch('index.s3')
    @patch("index.submit_response")
    def test_create(self, _, mock_s3: MagicMock):
        
        event = make_event("Create", False)

        # simulate external notifications
        current_notifications = make_notification_configuration()
        mock_s3.get_bucket_notification_configuration.return_value = current_notifications

        index.handler(event, {})

        mock_s3.put_bucket_notification_configuration.assert_called_once_with(
            Bucket=event["ResourceProperties"]["BucketName"],
            NotificationConfiguration=merge_notification_configurations(
                current_notifications,
                event["ResourceProperties"]["NotificationConfiguration"],
            ),
            SkipDestinationValidation=False,
        )

    @patch('index.s3')
    @patch("index.submit_response")
    def test_create_with_eventbridge(self, _, mock_s3: MagicMock):
        
        event = make_event_with_eventbridge("Create", False)

        # simulate external notifications
        current_notifications = make_notification_configuration()
        mock_s3.get_bucket_notification_configuration.return_value = current_notifications

        index.handler(event, {})

        mock_s3.put_bucket_notification_configuration.assert_called_once_with(
            Bucket=event["ResourceProperties"]["BucketName"],
            NotificationConfiguration=merge_notification_configurations(
                current_notifications,
                event["ResourceProperties"]["NotificationConfiguration"],
            ),
            SkipDestinationValidation=False,
        )

    @patch('index.s3')
    @patch("index.submit_response")
    def test_create_with_existing_eventbridge(self, _, mock_s3: MagicMock):

        event = make_event("Create", False)

        # simulate external notifications
        current_notifications = make_notification_configuration_with_eventbridge()
        mock_s3.get_bucket_notification_configuration.return_value = current_notifications

        index.handler(event, {})

        mock_s3.put_bucket_notification_configuration.assert_called_once_with(
            Bucket=event["ResourceProperties"]["BucketName"],
            NotificationConfiguration=merge_notification_configurations(
                current_notifications,
                event["ResourceProperties"]["NotificationConfiguration"],
            ),
            SkipDestinationValidation=False,
        )

    @patch('index.s3')
    @patch("index.submit_response")
    def test_update(self, _, mock_s3: MagicMock):
        
        event = make_event("Update", False)

        # simulate external notifications
        current_notifications = make_notification_configuration()
        mock_s3.get_bucket_notification_configuration.return_value = current_notifications

        index.handler(event, {})

        mock_s3.put_bucket_notification_configuration.assert_called_once_with(
            Bucket=event["ResourceProperties"]["BucketName"],
            NotificationConfiguration=merge_notification_configurations(
                current_notifications,
                event["ResourceProperties"]["NotificationConfiguration"],
            ),
            SkipDestinationValidation=False,
        )

    @patch('index.s3')
    @patch("index.submit_response")
    def test_update_with_eventbridge(self, _, mock_s3: MagicMock):
        
        event = make_event_with_eventbridge("Update", False)

        # simulate external notifications
        current_notifications = make_notification_configuration()
        mock_s3.get_bucket_notification_configuration.return_value = current_notifications

        index.handler(event, {})

        mock_s3.put_bucket_notification_configuration.assert_called_once_with(
            Bucket=event["ResourceProperties"]["BucketName"],
            NotificationConfiguration=merge_notification_configurations(
                current_notifications,
                event["ResourceProperties"]["NotificationConfiguration"],
            ),
            SkipDestinationValidation=False,
        )

    @patch('index.s3')
    @patch("index.submit_response")
    def test_update_without_eventbridge_should_not_remove_existing_eventbridge(self, _, mock_s3: MagicMock):
        event = make_event("Update", False)

        # simulate external notifications
        current_notifications = make_notification_configuration_with_eventbridge()
        mock_s3.get_bucket_notification_configuration.return_value = current_notifications

        index.handler(event, {})
        mock_s3.put_bucket_notification_configuration.assert_called_once_with(
            Bucket=event["ResourceProperties"]["BucketName"],
            NotificationConfiguration=merge_notification_configurations(
                current_notifications,
                event["ResourceProperties"]["NotificationConfiguration"],
            ),
            SkipDestinationValidation=False,
        )

    @patch('index.s3')
    @patch("index.submit_response")
    def test_delete(self, _, mock_s3: MagicMock):
        
        event = make_event("Delete", False)

        # simulate external notifications
        current_notifications = make_notification_configuration()
        mock_s3.get_bucket_notification_configuration.return_value = current_notifications

        index.handler(event, {})

        mock_s3.put_bucket_notification_configuration.assert_called_once_with(
            Bucket=event["ResourceProperties"]["BucketName"],
            NotificationConfiguration=current_notifications,
            SkipDestinationValidation=False,
        )

    @patch('index.s3')
    @patch("index.submit_response")
    def test_delete_with_eventbridge_should_not_remove_eventbridge(self, _, mock_s3: MagicMock):
        
        event = make_event_with_eventbridge("Delete", False)

        # simulate external notifications
        current_notifications = make_notification_configuration_with_eventbridge()
        mock_s3.get_bucket_notification_configuration.return_value = current_notifications

        index.handler(event, {})

        mock_s3.put_bucket_notification_configuration.assert_called_once_with(
            Bucket=event["ResourceProperties"]["BucketName"],
            NotificationConfiguration=current_notifications,
            SkipDestinationValidation=False,
        )


class CfnResponsesTest(unittest.TestCase):
    @patch("index.s3")
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


class NoSuchBucketHandlingTest(unittest.TestCase):
    """Test proper handling of NoSuchBucket errors during delete operations"""

    @patch('index.s3')
    @patch("index.submit_response")
    def test_delete_unmanaged_bucket_not_found_on_get_notification(self, submit_mock: MagicMock, mock_s3: MagicMock):
        """Test that delete succeeds gracefully when bucket doesn't exist during get_bucket_notification"""
        from botocore.exceptions import ClientError
        
        event = make_event("Delete", False)
        
        # Simulate bucket already deleted - get_bucket_notification_configuration raises NoSuchBucket
        mock_s3.get_bucket_notification_configuration.side_effect = ClientError(
            error_response={'Error': {'Code': 'NoSuchBucket', 'Message': 'The specified bucket does not exist'}},
            operation_name='GetBucketNotificationConfiguration'
        )
        
        index.handler(event, {})
        
        # Should call put_bucket_notification_configuration with empty external notifications
        # (which includes empty arrays for each configuration type)
        mock_s3.put_bucket_notification_configuration.assert_called_once_with(
            Bucket="BucketName",
            NotificationConfiguration={
                'TopicConfigurations': [],
                'QueueConfigurations': [], 
                'LambdaFunctionConfigurations': []
            },
            SkipDestinationValidation=False,
        )
        
        # Should report success
        submit_mock.assert_called_once()
        self.assertEqual(submit_mock.call_args_list[0][0][2], "SUCCESS")

    @patch('index.s3')
    @patch("index.submit_response")
    def test_delete_unmanaged_bucket_not_found_on_put_notification(self, submit_mock: MagicMock, mock_s3: MagicMock):
        """Test that delete succeeds gracefully when bucket doesn't exist during put_bucket_notification"""
        from botocore.exceptions import ClientError
        
        event = make_event("Delete", False)
        
        # get_bucket_notification_configuration succeeds (bucket exists initially)
        mock_s3.get_bucket_notification_configuration.return_value = {}
        
        # put_bucket_notification_configuration raises NoSuchBucket (bucket deleted between calls)
        mock_s3.put_bucket_notification_configuration.side_effect = ClientError(
            error_response={'Error': {'Code': 'NoSuchBucket', 'Message': 'The specified bucket does not exist'}},
            operation_name='PutBucketNotificationConfiguration'
        )
        
        index.handler(event, {})
        
        # Should report success since delete is the desired end state
        submit_mock.assert_called_once()
        self.assertEqual(submit_mock.call_args_list[0][0][2], "SUCCESS")

    @patch('index.s3')
    @patch("index.submit_response")
    def test_delete_managed_bucket_not_found(self, submit_mock: MagicMock, mock_s3: MagicMock):
        """Test that delete of managed bucket succeeds gracefully when bucket doesn't exist"""
        from botocore.exceptions import ClientError
        
        event = make_event("Delete", True)
        
        # put_bucket_notification_configuration raises NoSuchBucket
        mock_s3.put_bucket_notification_configuration.side_effect = ClientError(
            error_response={'Error': {'Code': 'NoSuchBucket', 'Message': 'The specified bucket does not exist'}},
            operation_name='PutBucketNotificationConfiguration'
        )
        
        index.handler(event, {})
        
        # Should report success since delete is the desired end state
        submit_mock.assert_called_once()
        self.assertEqual(submit_mock.call_args_list[0][0][2], "SUCCESS")

    @patch('index.s3')
    @patch("index.submit_response")
    def test_create_bucket_not_found_fails(self, submit_mock: MagicMock, mock_s3: MagicMock):
        """Test that create operation fails appropriately when bucket doesn't exist"""
        from botocore.exceptions import ClientError
        
        event = make_event("Create", False)
        
        # get_bucket_notification_configuration succeeds 
        mock_s3.get_bucket_notification_configuration.return_value = {}
        
        # put_bucket_notification_configuration raises NoSuchBucket using proper ClientError
        mock_s3.put_bucket_notification_configuration.side_effect = ClientError(
            error_response={'Error': {'Code': 'NoSuchBucket', 'Message': 'The specified bucket does not exist'}},
            operation_name='PutBucketNotificationConfiguration'
        )
        
        index.handler(event, {})
        
        # Should report failure for create operation
        submit_mock.assert_called_once()
        self.assertEqual(submit_mock.call_args_list[0][0][2], "FAILED")

    @patch('index.s3')
    @patch("index.submit_response")
    def test_update_bucket_not_found_fails(self, submit_mock: MagicMock, mock_s3: MagicMock):
        """Test that update operation fails appropriately when bucket doesn't exist"""
        from botocore.exceptions import ClientError
        
        event = make_event("Update", False)
        event["OldResourceProperties"] = {"NotificationConfiguration": {}}
        
        # get_bucket_notification_configuration succeeds
        mock_s3.get_bucket_notification_configuration.return_value = {}
        
        # put_bucket_notification_configuration raises NoSuchBucket using proper ClientError
        mock_s3.put_bucket_notification_configuration.side_effect = ClientError(
            error_response={'Error': {'Code': 'NoSuchBucket', 'Message': 'The specified bucket does not exist'}},
            operation_name='PutBucketNotificationConfiguration'
        )
        
        index.handler(event, {})
        
        # Should report failure for update operation
        submit_mock.assert_called_once()
        self.assertEqual(submit_mock.call_args_list[0][0][2], "FAILED")


if __name__ == "__main__":
    unittest.main()
