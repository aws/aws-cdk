import copy
import json
import os
import unittest
import uuid
from typing import Optional, Dict, Any
from unittest.mock import patch, MagicMock
from urllib.request import Request

import boto3  # type: ignore
from botocore import stub  # type: ignore
from botocore.stub import Stubber
from moto.s3 import mock_s3  # type: ignore

os.environ["AWS_DEFAULT_REGION"] = "us-east-1"
RESPONSE_URL = "https://dummy.com/"
BUCKET_NAME = "fake_bucket"
LAMBDA_ARN = "arn:aws:lambda:us-east-1:35667example:function:CreateThumbnail"
S3_CREATED = "s3:ObjectCreated:*"
S3_CREATED_PUT = "s3:ObjectCreated:Put"
ID_CREATE_BY_CDK = "created-by-cdk"
NOTIFICATION_CONFIGURATION: Dict[str, Any] = {
    "TopicConfigurations": [
        {
            "Id": "existing-notification",
            "TopicArn": "arn:aws:sns:us-east-1:123456789012:MyTopic",
            "Events": [S3_CREATED],
            "Filter": {
                "Key": {
                    "FilterRules": [
                        {"Name": "suffix", "Value": "string"},
                    ]
                }
            },
        },
    ],
    "QueueConfigurations": [
        {
            "Id": ID_CREATE_BY_CDK,
            "QueueArn": "arn:aws:sqs:us-east-1:444455556666:old-queue",
            "Events": [
                "s3:ObjectCreated:Post",
            ],
            "Filter": {
                "Key": {
                    "FilterRules": [
                        {"Name": "suffix", "Value": "string"},
                    ]
                }
            },
        },
    ],
    "LambdaFunctionConfigurations": [
        {
            "Id": "old-function-hash",
            "LambdaFunctionArn": LAMBDA_ARN,
            "Events": [S3_CREATED],
            "Filter": {
                "Key": {
                    "FilterRules": [
                        {"Name": "prefix", "Value": "string"},
                    ]
                }
            },
        },
    ],
}


class MockContext(object):
    function_name = "func_name"
    memory_limit_in_mb = 512
    invoked_function_arn = "func_arn"
    aws_request_id = uuid.uuid4()
    log_stream_name = "log_stream_name"


def setup_s3_bucket(notification_configuration: Optional[Dict]):
    """Using moto to help setup a mock S3 bucket

    Parameters
    ----------
    notification_configuration : Dict, None
        Optional notification configuration
    """
    s3_client = boto3.client("s3", region_name="us-east-1")
    s3_client.create_bucket(Bucket=BUCKET_NAME)
    if notification_configuration:
        s3_client.put_bucket_notification_configuration(
            Bucket=BUCKET_NAME, NotificationConfiguration=copy.deepcopy(notification_configuration)
        )


def make_event(
    request_type: str,
    notification_configuration: Dict,
    old_notification_configuration: Dict = None,
) -> Dict[str, Any]:
    event = {
        "StackId": "StackId",
        "RequestId": "RequestId",
        "LogicalResourceId": "LogicalResourceId",
        "ResponseURL": RESPONSE_URL,
        "RequestType": request_type,
        "ResourceProperties": {"BucketName": BUCKET_NAME, "NotificationConfiguration": notification_configuration},
    }

    if old_notification_configuration:
        event["OldResourceProperties"] = {
            "BucketName": BUCKET_NAME,
            "NotificationConfiguration": old_notification_configuration,
        }

    return event


create_event = make_event(
    request_type="Create",
    notification_configuration={
        "QueueConfigurations": [
            {
                "Id": "my-function-hash",
                "Events": [S3_CREATED],
                "QueueArn": "arn:aws:sqs:us-east-1:444455556666:new-queue",
            }
        ]
    },
)


def assert_notify_cfn(test_case: unittest.TestCase, mock_call, status: str) -> Dict:
    mock_call.assert_called()
    request: Request = mock_call.call_args[0][0]
    test_case.assertIsInstance(request, Request)
    assert request.data is not None
    data = json.loads(request.data.decode())
    test_case.assertEqual(status, data["Status"])
    test_case.assertEqual(RESPONSE_URL, request.full_url)
    return data


def assert_notify_cfn_of_failure(test_case: unittest.TestCase, mock_call) -> Dict:
    return assert_notify_cfn(test_case, mock_call, "FAILED")


def assert_notify_cfn_of_success(test_case: unittest.TestCase, mock_call) -> Dict:
    return assert_notify_cfn(test_case, mock_call, "SUCCESS")


def setup_cfn_stubbed_client(stack_status: str):
    stubbed_client = boto3.client("cloudformation")
    stubber = Stubber(stubbed_client)
    stubber.add_response(
        "describe_stacks",
        expected_params={"StackName": "StackId"},
        service_response={
            "Stacks": [
                {
                    "StackStatus": stack_status,
                    "StackName": "foo",
                    "CreationTime": "1",
                }
            ]
        },
    )
    stubber.activate()
    return stubbed_client


class LambdaTest(unittest.TestCase):
    def test_merge_new_config(self):
        # SCENARIO a s3 bucket with no configured notifications
        # AND the new configuration has no configured notifications
        from src import index

        # GIVEN an empty current_config and an empty new_config
        current_config = {
            "TopicConfigurations": [],
            "QueueConfigurations": [],
            "LambdaFunctionConfigurations": [],
        }
        new_config = current_config.copy()
        old_config = current_config.copy()

        # WHEN merging in get_config
        config = index.get_config(current_config, new_config, old_config, "Update")

        # THEN returns a config equal to new_config
        self.assertEqual(config, new_config)
        self.assertTrue(len(config["TopicConfigurations"]) == 0)
        self.assertTrue(len(config["QueueConfigurations"]) == 0)
        self.assertTrue(len(config["LambdaFunctionConfigurations"]) == 0)
        # AND config is not new_config
        self.assertIsNot(config, new_config)

    def test_merge_in_extend(self):
        from src import index

        # GIVEN an "QueueConfigurations" entry new_config and an empty current_config
        current_config = {
            "TopicConfigurations": [],
            "QueueConfigurations": [],
            "LambdaFunctionConfigurations": [],
        }
        new_config = {
            "TopicConfigurations": [],
            "QueueConfigurations": ["new_entry"],
            "LambdaFunctionConfigurations": [],
        }
        old_config = {}

        # WHEN merging in prepare_config
        config = index.get_config(current_config, new_config, old_config, "Update")

        # THEN the returned config and new_config should be equal
        # AND QueueConfigurations should be extended
        self.assertEqual(config, new_config)
        self.assertIsNot(config, new_config)
        self.assertTrue(len(config["TopicConfigurations"]) == 0)
        self.assertTrue(len(config["QueueConfigurations"]) == 1)
        self.assertEqual("new_entry", config["QueueConfigurations"][0])
        self.assertTrue(len(config["LambdaFunctionConfigurations"]) == 0)

    def test_prepare_config_removes_response_metadata(self):
        # SCENARIO Ensure we remove the "ResponseMetadata" returned by the "get_config" call
        from src import index

        # GIVEN the get_bucket_notification_configuration call
        current_config = {"ResponseMetadata": "foo"}

        # WHEN calling get_config
        config = index.get_config(current_config, {}, {}, "Delete")

        # THEN don't include "ResponseMetadata"
        self.assertNotIn("ResponseMetadata", config)

    def test_prepare_config_set_defaults(self):
        from src import index

        # GIVEN both loaded configuration and new configuration have no default set
        current_config = {}
        new_config = {}
        old_config = {}

        # WHEN calling prepare_config
        config = index.get_config(current_config, new_config, old_config, "Delete")

        # THEN set defaults as [] for all the config types
        expected_config = {
            "TopicConfigurations": [],
            "QueueConfigurations": [],
            "LambdaFunctionConfigurations": [],
        }
        self.assertEqual(expected_config, config)
        self.assertEqual({}, current_config)
        self.assertEqual({}, new_config)
        self.assertEqual({}, old_config)

    @patch("urllib.request.urlopen")
    @patch("builtins.print")
    def test_submit_response_io_failure(self, mock_print: MagicMock, mock_call: MagicMock):
        # SCENARIO There is some kind of error notifying CFN "ResponseURL"
        from src import index

        # GIVEN the "ResponseURL" endpoint is down
        exception_message = "Failed to put"
        mock_call.side_effect = Exception(exception_message)

        # WHEN calling submit_response
        index.submit_response(create_event, MockContext(), "SUCCESS", "")

        # THEN handle the http error
        # AND print error message to the console for debugging
        mock_print.assert_called_with(f"send(..) failed executing request.urlopen(..): {exception_message}")

    @patch("urllib.request.urlopen")
    def test_submit_response(self, mock_call: MagicMock):
        # SCENARIO Sometimes updates to S3 might fail so we want to notify CFN of the error and cause
        from src import index

        # GIVEN we have an error doing the S3 update
        expected_status = "FAILED"
        error_message = "Some s3 error. "
        context = MockContext()

        # WHEN calling submit_response
        index.submit_response(create_event, context, expected_status, error_message)

        # THEN include the "Status" of FAILED and "Reason" in the payload to CFN
        payload = json.loads(mock_call.mock_calls[0].args[0].data.decode())
        self.assertEqual(expected_status, payload["Status"])
        expected_message = f"{error_message}See the details in CloudWatch Log Stream: {context.log_stream_name}"
        self.assertEqual(expected_message, payload["Reason"])

    @mock_s3
    @patch("urllib.request.urlopen")
    def test_no_bucket_found(self, mock_call: MagicMock):
        # SCENARIO We are trying to add a notification to a S3 bucket that does not exist
        from src import index

        # GIVEN a create event bucket notification configuration event
        # for a bucket that does not exist

        # WHEN calling handler
        index.handler(create_event, MockContext())

        # THEN submit a failed to the callback url
        assert_notify_cfn_of_failure(self, mock_call)

    @mock_s3
    @patch("urllib.request.urlopen")
    def test_add_to_new_bucket(self, mock_call: MagicMock):
        # SCENARIO We want to add notifications to a new S3 bucket managed by our CDK stack
        from src import index

        # GIVEN a "NotificationConfiguration" for a newly create bucket
        setup_s3_bucket(notification_configuration=None)

        # WHEN calling the handler
        index.handler(create_event, MockContext())

        # THEN set the "NotificationConfiguration" for this bucket
        s3_client = boto3.client("s3", region_name="us-east-1")
        config = s3_client.get_bucket_notification_configuration(Bucket=BUCKET_NAME)
        queue_configuration_list = config.get("QueueConfigurations")
        self.assertIsNotNone(queue_configuration_list)
        self.assertEqual(1, len(queue_configuration_list))
        queue_configuration = queue_configuration_list[0]
        self.assertEqual("my-function-hash", queue_configuration["Id"])
        self.assertEqual(S3_CREATED, queue_configuration["Events"][0])
        self.assertNotIn("LambdaFunctionConfigurations", config)
        self.assertNotIn("LambdaFunctionConfigurations", config)
        # AND notify CFN of its success
        assert_notify_cfn_of_success(self, mock_call)

    @mock_s3
    @patch("urllib.request.urlopen")
    def test_append_to_existing(self, mock_call: MagicMock):
        # SCENARIO We want to add new notifications to an existing S3 bucket not created by our CDK stack
        from src import index

        # GIVEN a "NotificationConfiguration" for an existing bucket
        # AND the existing bucket has an existing "NotificationConfiguration"
        setup_s3_bucket(notification_configuration=NOTIFICATION_CONFIGURATION)

        # WHEN calling handler
        index.handler(create_event, MockContext())

        # THEN update the bucket "NotificationConfiguration"
        s3_client = boto3.client("s3", region_name="us-east-1")
        config = s3_client.get_bucket_notification_configuration(Bucket=BUCKET_NAME)
        self.assertIn("LambdaFunctionConfigurations", config)
        self.assertIn("TopicConfigurations", config)
        self.assertIn("QueueConfigurations", config)
        # AND the new "QueueConfigurations" should be added
        queue_configuration_list = config["QueueConfigurations"]
        self.assertIsNotNone(queue_configuration_list)
        self.assertEqual(2, len(queue_configuration_list))
        self.assertEqual("my-function-hash", queue_configuration_list[1]["Id"])
        # AND the existing "TopicConfigurations" should be untouched
        topic_configuration_list = config["TopicConfigurations"]
        self.assertEqual(1, len(topic_configuration_list))
        topic_configuration = topic_configuration_list[0]
        self.assertEqual(S3_CREATED, topic_configuration["Events"][0])
        # AND notify CFN of its success
        assert_notify_cfn_of_success(self, mock_call)

    @mock_s3
    @patch("urllib.request.urlopen")
    def test_delete_remove_from_existing(self, mock_call: MagicMock):
        # SCENARIO We want to delete notifications our CDK stack created on an existing S3 bucket
        from src import index

        # GIVEN A bucket with an existing configuration with Id "created-by-cdk" for a "QueueConfigurations"
        setup_s3_bucket(notification_configuration=NOTIFICATION_CONFIGURATION)
        index.cf = setup_cfn_stubbed_client("UPDATE_IN_PROGRESS")
        # AND a "Delete" RequestType with a matching id "created-by-cdk"
        delete_event = make_event(
            request_type="Delete",
            notification_configuration={
                "QueueConfigurations": [
                    {
                        "Events": ["s3:ObjectCreated:Post"],
                        "QueueArn": "arn:aws:sqs:us-east-1:444455556666:old-queue",
                    }
                ]
            },
        )

        # WHEN calling the handler
        index.handler(delete_event, MockContext())

        # THEN the "QueueConfigurations" should be empty
        s3_client = boto3.client("s3", region_name="us-east-1")
        config = s3_client.get_bucket_notification_configuration(Bucket=BUCKET_NAME)
        self.assertNotIn("QueueConfigurations", config)
        # AND keep the other configurations untouched
        self.assertIn("TopicConfigurations", config)
        self.assertEqual(1, len(config["TopicConfigurations"]))
        self.assertIn("LambdaFunctionConfigurations", config)
        self.assertEqual(1, len(config["LambdaFunctionConfigurations"]))
        # AND notify CFN of its success
        assert_notify_cfn_of_success(self, mock_call)

    @mock_s3
    @patch("urllib.request.urlopen")
    def test_delete_when_rollback_in_progress(self, mock_call: MagicMock):
        # SCENARIO Stack is performing a rollback we should not modify the notification when RequestType is "Delete"
        from src import index

        # GIVEN A bucket with an existing configuration
        # AND the stack status is "rollback in progress"
        index.cf = setup_cfn_stubbed_client("ROLLBACK_IN_PROGRESS")
        # AND a "Delete" RequestType
        delete_event = make_event(
            request_type="Delete",
            notification_configuration={
                "QueueConfigurations": [
                    {
                        "Events": ["s3:ObjectCreated:Post"],
                        "QueueArn": "arn:aws:sqs:us-east-1:444455556666:queue",
                    }
                ]
            },
        )

        # WHEN calling the handler
        index.handler(delete_event, MockContext())

        # THEN the "QueueConfigurations" should be left as is (so we don't need any mocks)
        # AND notify CFN of its success
        assert_notify_cfn_of_success(self, mock_call)

    @mock_s3
    @patch("urllib.request.urlopen")
    def test_update_config_for_managed_s3_bucket(self, mock_call: MagicMock):
        # SCENARIO We want to update notifications of a S3 bucket managed by our CDK stack
        from src import index

        # GIVEN A bucket with an existing configuration that matches the old notifications ("old-function-hash")
        setup_s3_bucket(notification_configuration=NOTIFICATION_CONFIGURATION)
        # AND an Update event with the new incoming configuration with Id "new-function-hash"
        update_event = make_event(
            request_type="Update",
            old_notification_configuration={
                "LambdaFunctionConfigurations": [
                    {
                        "Id": "old-function-hash",
                        "LambdaFunctionArn": LAMBDA_ARN,
                        "Events": [S3_CREATED],
                    }
                ]
            },
            notification_configuration={
                "LambdaFunctionConfigurations": [
                    {
                        "Id": "new-function-hash",
                        "LambdaFunctionArn": "arn:aws:lambda:us-east-1:35667example:function:NewCreateThumbnail",
                        "Events": [S3_CREATED],
                    }
                ]
            },
        )

        # WHEN calling the handler
        index.handler(update_event, MockContext())

        # THEN replace Id "old-function-hash" config with new config of "new-function-hash"
        # AND keep the other configurations untouched
        s3_client = boto3.client("s3", region_name="us-east-1")
        config = s3_client.get_bucket_notification_configuration(Bucket=BUCKET_NAME)
        self.assertIsNotNone(config.get("TopicConfigurations"))
        self.assertIsNotNone(config.get("QueueConfigurations"))
        lambda_configs = config.get("LambdaFunctionConfigurations")
        self.assertIsNotNone(lambda_configs)
        self.assertEqual(1, len(lambda_configs))
        lambda_config = lambda_configs[0]
        self.assertEqual("new-function-hash", lambda_config.get("Id"))
        # AND notify CFN of its success
        assert_notify_cfn_of_success(self, mock_call)

    @mock_s3
    @patch("urllib.request.urlopen")
    def test_update_from_older_cdk_version(self, mock_call: MagicMock):
        # SCENARIO We have upgraded to a newer version of CDK, where some of existing managed notification
        from src import index

        # GIVEN A bucket with an existing configuration with Id "old-function-hash"
        setup_s3_bucket(notification_configuration=NOTIFICATION_CONFIGURATION)
        # AND an Update event with a "OldResourceProperties" that matches the target and events of the
        # "ResourceProperties"
        update_event = make_event(
            request_type="Update",
            old_notification_configuration={
                "LambdaFunctionConfigurations": [{"Events": [S3_CREATED], "LambdaFunctionArn": LAMBDA_ARN}]
            },
            notification_configuration={
                "LambdaFunctionConfigurations": [
                    {"Id": "new-function-hash", "Events": [S3_CREATED], "LambdaFunctionArn": LAMBDA_ARN}
                ]
            },
        )

        # WHEN calling the handler
        index.handler(update_event, MockContext())

        # THEN keep the "old-function-hash" as it might been created by the older version of CDK
        # AND keep the other configurations untouched
        s3_client = boto3.client("s3", region_name="us-east-1")
        config = s3_client.get_bucket_notification_configuration(Bucket=BUCKET_NAME)
        self.assertIsNotNone(config.get("TopicConfigurations"))
        self.assertIsNotNone(config.get("QueueConfigurations"))
        lambda_configs = config.get("LambdaFunctionConfigurations")
        self.assertIsNotNone(lambda_configs)
        self.assertEqual(1, len(lambda_configs))
        lambda_config = lambda_configs[0]
        self.assertEqual("new-function-hash", lambda_config.get("Id"))
        # AND notify CFN of its success
        assert_notify_cfn_of_success(self, mock_call)


class ScenarioTest(unittest.TestCase):
    @patch("urllib.request.urlopen")
    def test_current_empty_request_type_create_or_update(self, mock_call: MagicMock):
        from src import index

        for request_type in ["Create", "Update"]:
            # GIVEN Current Config is empty
            current_notification_configuration: Dict = {}
            s3 = boto3.client("s3")
            stubber = stub.Stubber(s3)
            stubber.add_response(
                "get_bucket_notification_configuration", current_notification_configuration, {"Bucket": BUCKET_NAME}
            )

            # WHEN RequestType is Create or Update
            configs = [{"Id": "new-function-hash", "Events": [S3_CREATED], "LambdaFunctionArn": LAMBDA_ARN}]
            old_notification_configuration = (
                {"LambdaFunctionConfigurations": configs} if request_type == "Update" else None
            )
            event = make_event(
                request_type=request_type,
                old_notification_configuration=old_notification_configuration,
                notification_configuration={"LambdaFunctionConfigurations": configs},
            )

            # THEN Put is equal to "New Configuration"
            stubber.add_response(
                "put_bucket_notification_configuration",
                {},
                {
                    "Bucket": BUCKET_NAME,
                    "NotificationConfiguration": {
                        "LambdaFunctionConfigurations": configs,
                        "QueueConfigurations": [],
                        "TopicConfigurations": [],
                    },
                },
            )
            stubber.activate()

            index.s3 = s3
            index.handler(event, MockContext())
            assert_notify_cfn_of_success(self, mock_call)

    @patch("urllib.request.urlopen")
    def test_current_empty_request_type_delete(self, mock_call: MagicMock):
        from src import index

        # Current Config is empty
        current_notification_configuration: Dict = {}
        s3 = boto3.client("s3")
        stubber = stub.Stubber(s3)
        stubber.add_response(
            "get_bucket_notification_configuration", current_notification_configuration, {"Bucket": BUCKET_NAME}
        )
        index.cf = setup_cfn_stubbed_client("UPDATE_IN_PROGRESS")

        # RequestType is Delete
        configs = [{"Id": "new-function-hash", "Events": [S3_CREATED], "LambdaFunctionArn": LAMBDA_ARN}]
        event = make_event(
            request_type="Delete",
            old_notification_configuration={"LambdaFunctionConfigurations": configs},
            notification_configuration={"LambdaFunctionConfigurations": configs},
        )

        # Put is equal to empty
        stubber.add_response(
            "put_bucket_notification_configuration",
            {},
            {
                "Bucket": BUCKET_NAME,
                "NotificationConfiguration": {
                    "LambdaFunctionConfigurations": [],
                    "QueueConfigurations": [],
                    "TopicConfigurations": [],
                },
            },
        )

        stubber.activate()

        index.s3 = s3
        index.handler(event, MockContext())
        assert_notify_cfn_of_success(self, mock_call)

    @patch("urllib.request.urlopen")
    def test_create_duplicate_error(self, mock_call: MagicMock):
        from src import index

        # Current Config is the same as the Create event
        current_configs = [{"Id": "existing-function-hash", "Events": [S3_CREATED], "LambdaFunctionArn": LAMBDA_ARN}]
        current_notification_configuration: Dict = {"LambdaFunctionConfigurations": current_configs}
        s3 = boto3.client("s3")
        stubber = stub.Stubber(s3)
        stubber.add_response(
            "get_bucket_notification_configuration", current_notification_configuration, {"Bucket": BUCKET_NAME}
        )

        # RequestType is Create
        in_config = [{"Events": [S3_CREATED], "LambdaFunctionArn": LAMBDA_ARN}]
        event = make_event(
            request_type="Create",
            notification_configuration={"LambdaFunctionConfigurations": in_config},
        )

        # Put will have a duplicate entry
        stubber.add_client_error(
            "put_bucket_notification_configuration",
            "400",
            "Duplicate error",
            400,
            {},
            {
                "Bucket": BUCKET_NAME,
                "NotificationConfiguration": {
                    "LambdaFunctionConfigurations": [current_configs[0], in_config[0]],
                    "QueueConfigurations": [],
                    "TopicConfigurations": [],
                },
            },
            {},
        )
        stubber.activate()

        index.s3 = s3
        index.handler(event, MockContext())

        # CFN will be notified of the error
        data = assert_notify_cfn_of_failure(self, mock_call)
        self.assertIn("PutBucketNotificationConfiguration operation: Duplicate error.", data["Reason"])

    @patch("urllib.request.urlopen")
    def test_update_remove_entry(self, mock_call: MagicMock):
        from src import index

        # GIVEN Current Config has an "is-managed-by-cdk-arn"
        current_configs = [
            {"Events": [S3_CREATED_PUT], "QueueArn": "not-managed-by-cdk-arn"},
            {"Events": [S3_CREATED_PUT], "QueueArn": "is-managed-by-cdk-arn"},
        ]
        current_notification_configuration: Dict = {"QueueConfigurations": current_configs}
        s3 = boto3.client("s3")
        stubber = stub.Stubber(s3)
        stubber.add_response(
            "get_bucket_notification_configuration", current_notification_configuration, {"Bucket": BUCKET_NAME}
        )

        # WHEN RequestType is Update
        event = make_event(
            request_type="Update",
            old_notification_configuration={
                "QueueConfigurations": [{"Events": [S3_CREATED_PUT], "QueueArn": "is-managed-by-cdk-arn"}]
            },
            notification_configuration={"QueueConfigurations": []},
        )

        # THEN Put will exclude "is-managed-by-cdk-arn"
        stubber.add_response(
            "put_bucket_notification_configuration",
            {},
            {
                "Bucket": BUCKET_NAME,
                "NotificationConfiguration": {
                    "LambdaFunctionConfigurations": [],
                    "QueueConfigurations": [current_configs[0]],
                    "TopicConfigurations": [],
                },
            },
        )
        stubber.activate()

        index.s3 = s3
        index.handler(event, MockContext())
        assert_notify_cfn_of_success(self, mock_call)

    @patch("urllib.request.urlopen")
    def test_update_no_change(self, mock_call: MagicMock):
        # Source: https://github.com/aws/aws-cdk/pull/11773#issuecomment-835807369
        from src import index

        # GIVEN Existing bucket notifications
        # These were deployed by the CDK application.
        s3 = boto3.client("s3")
        stubber = stub.Stubber(s3)
        config_entry = {"Events": [S3_CREATED_PUT], "QueueArn": "queue1-arn"}
        stubber.add_response(
            "get_bucket_notification_configuration",
            {"QueueConfigurations": [config_entry]},
            {"Bucket": BUCKET_NAME},
        )

        # WHEN RequestType is Update
        # Incoming CFN notifications config
        # Since the application hasn't changed, this is the same.
        # AND
        # Previous CFN notifications config
        # Since the existing configuration was deployed by CFN, the old config is the same as the existing
        # configuration.
        event = make_event(
            request_type="Update",
            old_notification_configuration={"QueueConfigurations": [config_entry]},
            notification_configuration={"QueueConfigurations": [config_entry]},
        )

        # THEN Expected notifications config
        # Since the application hasn't changed, the end result should be the same as the existing one.
        stubber.add_response(
            "put_bucket_notification_configuration",
            {},
            {
                "Bucket": BUCKET_NAME,
                "NotificationConfiguration": {
                    "LambdaFunctionConfigurations": [],
                    "QueueConfigurations": [config_entry],
                    "TopicConfigurations": [],
                },
            },
        )
        stubber.activate()

        index.s3 = s3
        index.handler(event, MockContext())
        assert_notify_cfn_of_success(self, mock_call)

    @patch("urllib.request.urlopen")
    def test_delete_to_empty(self, mock_call: MagicMock):
        # Source: https://github.com/aws/aws-cdk/pull/11773#issuecomment-835807369
        from src import index

        # GIVEN Existing bucket notifications
        # These were deployed by the CDK application.
        s3 = boto3.client("s3")
        stubber = stub.Stubber(s3)
        config_entry = {"Events": [S3_CREATED_PUT], "QueueArn": "queue1-arn"}
        stubber.add_response(
            "get_bucket_notification_configuration",
            {"QueueConfigurations": [config_entry]},
            {"Bucket": BUCKET_NAME},
        )
        index.cf = setup_cfn_stubbed_client("DELETE_IN_PROGRESS")

        # WHEN RequestType is Delete
        # Incoming CFN notifications config
        # Since the application hasn't changed, this is the same.
        # AND
        # Previous CFN notifications config
        # Since the existing configuration was deployed by CFN, the old config is the same as the existing
        # configuration.
        event = make_event(
            request_type="Delete",
            old_notification_configuration={"QueueConfigurations": [config_entry]},
            notification_configuration={"QueueConfigurations": [config_entry]},
        )

        # THEN Expected notifications config should result in an empty configuration
        stubber.add_response(
            "put_bucket_notification_configuration",
            {},
            {
                "Bucket": BUCKET_NAME,
                "NotificationConfiguration": {
                    "LambdaFunctionConfigurations": [],
                    "QueueConfigurations": [],
                    "TopicConfigurations": [],
                },
            },
        )
        stubber.activate()

        index.s3 = s3
        index.handler(event, MockContext())
        assert_notify_cfn_of_success(self, mock_call)


if __name__ == "__main__":
    unittest.main()
