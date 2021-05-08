import copy
import json
import unittest
from typing import Optional, Dict, Any
from urllib.request import Request
import uuid
from unittest.mock import patch, MagicMock
import boto3  # type: ignore
from moto.s3 import mock_s3  # type: ignore

RESPONSE_URL = "https://dummy.com/"
BUCKET_NAME = "fake_bucket"
LAMBDA_ARN = "arn:aws:lambda:us-east-1:35667example:function:CreateThumbnail"
S3_CREATED = "s3:ObjectCreated:*"
ID_CREATE_BY_CDK = "created-by-cdk"
create_event = {
    "StackId": "StackId",
    "RequestId": "RequestId",
    "LogicalResourceId": "LogicalResourceId",
    "ResponseURL": RESPONSE_URL,
    "RequestType": "Create",
    "ResourceProperties": {
        "BucketName": BUCKET_NAME,
        "NotificationConfiguration": {
            "QueueConfigurations": [
                {
                    "Id": "my-function-hash",
                    "Events": [S3_CREATED],
                    "QueueArn": "arn:aws:sqs:us-east-1:444455556666:new-queue",
                }
            ]
        },
    },
}
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


class LambdaTest(unittest.TestCase):
    def assert_notify_cfn_success(self, mock_call):
        mock_call.assert_called()
        request: Request = mock_call.call_args[0][0]
        self.assertIsInstance(request, Request)
        assert request.data is not None
        data = json.loads(request.data.decode())
        self.assertEqual("SUCCESS", data["Status"])
        self.assertEqual(RESPONSE_URL, request.full_url)

    def test_empty_ids(self):
        from src import index

        # GIVEN an empty list
        # WHEN calling ids
        ids = index.ids([{}])
        # THEN return an empty list
        self.assertEqual([], ids)

    def test_extract_ids_as_list(self):
        from src import index

        ids = index.ids([{"Id": "x"}, {}])
        self.assertEqual(["x"], ids)

    def test_merge_in_config(self):
        from src import index

        # GIVEN an empty current_config and an empty in_config
        current_config = {
            "TopicConfigurations": [],
            "QueueConfigurations": [],
            "LambdaFunctionConfigurations": [],
        }
        in_config = {
            "TopicConfigurations": [],
            "QueueConfigurations": [],
            "LambdaFunctionConfigurations": [],
        }
        old_config = {}

        # WHEN merging in prepare_config
        config = index.prepare_config(current_config, in_config, old_config, "Update")

        # THEN returns a config equal to in_config
        self.assertEqual(config, in_config)
        self.assertIsNot(config, in_config)
        self.assertTrue(len(config["TopicConfigurations"]) == 0)
        self.assertTrue(len(config["QueueConfigurations"]) == 0)
        self.assertTrue(len(config["LambdaFunctionConfigurations"]) == 0)

    def test_merge_in_extend(self):
        # GIVEN an "QueueConfigurations" entry in_config and an empty current_config
        from src import index

        current_config = {
            "TopicConfigurations": [],
            "QueueConfigurations": [],
            "LambdaFunctionConfigurations": [],
        }
        in_config = {
            "TopicConfigurations": [],
            "QueueConfigurations": ["new_entry"],
            "LambdaFunctionConfigurations": [],
        }
        old_config = {}

        # WHEN merging in prepare_config
        config = index.prepare_config(current_config, in_config, old_config, "Update")

        # THEN the returned config and in_config should be equal
        # AND QueueConfigurations should be extended
        self.assertEqual(config, in_config)
        self.assertIsNot(config, in_config)
        self.assertTrue(len(config["TopicConfigurations"]) == 0)
        self.assertTrue(len(config["QueueConfigurations"]) == 1)
        self.assertEqual("new_entry", config["QueueConfigurations"][0])
        self.assertTrue(len(config["LambdaFunctionConfigurations"]) == 0)

    def test_prepare_config_removes_response_metadata(self):
        # Test to ensure we remove the "ResponseMetadata" returned by the
        # get_bucket_notification_configuration call
        from src import index

        current_config = {"ResponseMetadata": "foo"}
        config = index.prepare_config(current_config, {}, {}, "Delete")
        self.assertNotIn("ResponseMetadata", config)

    def test_prepare_config_set_defaults(self):
        # GIVEN both loaded configuration and new configuration have no default set
        from src import index

        current_config = {}
        in_config = {}
        old_config = {}

        # WHEN calling prepare_config
        config = index.prepare_config(current_config, in_config, old_config, "Delete")

        # THEN set defaults as [] for all the config types
        expected_config = {
            "TopicConfigurations": [],
            "QueueConfigurations": [],
            "LambdaFunctionConfigurations": [],
        }
        self.assertEqual(expected_config, config)
        self.assertEqual({}, current_config)
        self.assertEqual({}, in_config)
        self.assertEqual({}, old_config)

    @patch("urllib.request.urlopen")
    @patch("builtins.print")
    def test_submit_response_io_failure(self, mock_print: MagicMock, mock_call: MagicMock):
        # GIVEN an http error when notifying CFN
        exception_message = "Failed to put"
        mock_call.side_effect = Exception(exception_message)
        from src import index

        # WHEN calling submit_response
        index.submit_response(create_event, MockContext(), "SUCCESS", "")

        # THEN handle the error
        # AND print error message to the console for debugging
        mock_print.assert_called_with(f"send(..) failed executing request.urlopen(..): {exception_message}")

    @patch("urllib.request.urlopen")
    def test_submit_response(self, mock_call: MagicMock):
        # GIVEN we have an error doing the S3 update
        expected_status = "FAILED"
        error_message = "Some s3 error. "
        context = MockContext()
        expected_message = f"{error_message}See the details in CloudWatch Log Stream: {context.log_stream_name}"
        from src import index

        # WHEN calling submit_response
        index.submit_response(create_event, context, expected_status, error_message)

        # THEN include the status and reason in the payload to CFN
        payload = json.loads(mock_call.mock_calls[0].args[0].data.decode())
        self.assertEqual(expected_status, payload["Status"])
        self.assertEqual(expected_message, payload["Reason"])

    @mock_s3
    @patch("urllib.request.urlopen")
    def test_no_bucket_found(self, mock_call: MagicMock):
        # SCENARIO We are trying to add a notification to a S3 bucket that does not exist
        # GIVEN a create event bucket notification configuration event
        # for a bucket that does not exist
        from src import index

        # WHEN calling handler
        index.handler(create_event, MockContext())

        # THEN submit a failed to the callback url
        mock_call.assert_called()
        request: Request = mock_call.call_args[0][0]
        self.assertIsInstance(request, Request)
        assert request.data is not None
        data = json.loads(request.data.decode())
        self.assertEqual("FAILED", data["Status"])

    @mock_s3
    @patch("urllib.request.urlopen")
    def test_add_to_new_bucket(self, mock_call: MagicMock):
        # SCENARIO We want to add notifications to a new S3 bucket managed by our CDK stack
        # GIVEN a "NotificationConfiguration" for a newly create bucket
        setup_s3_bucket(notification_configuration=None)
        from src import index

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
        self.assert_notify_cfn_success(mock_call)

    @mock_s3
    @patch("urllib.request.urlopen")
    def test_append_to_existing(self, mock_call: MagicMock):
        # SCENARIO We want to add new notifications to an existing S3 bucket not created by our CDK stack
        # GIVEN a "NotificationConfiguration" for an existing bucket
        # AND the existing bucket has an existing "NotificationConfiguration"
        setup_s3_bucket(notification_configuration=NOTIFICATION_CONFIGURATION)
        from src import index

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
        self.assert_notify_cfn_success(mock_call)

    @mock_s3
    @patch("urllib.request.urlopen")
    def test_remove_from_existing(self, mock_call: MagicMock):
        # SCENARIO We want to delete notifications our CDK stack created on an existing S3 bucket
        # GIVEN A bucket with an existing configuration with Id "created-by-cdk" for a "QueueConfigurations"
        setup_s3_bucket(notification_configuration=NOTIFICATION_CONFIGURATION)
        # AND a "Delete" RequestType with a matching id "created-by-cdk"
        delete_event = {
            "StackId": "StackId",
            "RequestId": "RequestId",
            "LogicalResourceId": "LogicalResourceId",
            "ResponseURL": RESPONSE_URL,
            "RequestType": "Delete",
            "ResourceProperties": {
                "BucketName": BUCKET_NAME,
                "NotificationConfiguration": {
                    "QueueConfigurations": [
                        {
                            "Id": ID_CREATE_BY_CDK,
                            "Events": [S3_CREATED],
                            "QueueArn": "arn:aws:sqs:us-east-1:444455556666:old-queue",
                        }
                    ]
                },
            },
        }
        from src import index

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
        self.assert_notify_cfn_success(mock_call)

    @mock_s3
    @patch("urllib.request.urlopen")
    def test_update_config_for_managed_s3_bucket(self, mock_call: MagicMock):
        # SCENARIO We want to update notifications of a S3 bucket managed by our CDK stack
        # GIVEN A bucket with an existing configuration with Id "old-function-hash"
        setup_s3_bucket(notification_configuration=NOTIFICATION_CONFIGURATION)
        # AND an Update event with the new incoming configuration with Id "new-function-hash"
        update_event = {
            "StackId": "StackId",
            "RequestId": "RequestId",
            "LogicalResourceId": "LogicalResourceId",
            "ResponseURL": RESPONSE_URL,
            "RequestType": "Update",
            "OldResourceProperties": {
                "BucketName": BUCKET_NAME,
                "NotificationConfiguration": {
                    "LambdaFunctionConfigurations": [
                        {"Id": "old-function-hash", "Events": [S3_CREATED], "LambdaFunctionArn": LAMBDA_ARN}
                    ]
                },
            },
            "ResourceProperties": {
                "BucketName": BUCKET_NAME,
                "NotificationConfiguration": {
                    "LambdaFunctionConfigurations": [
                        {
                            "Id": "new-function-hash",
                            "Events": [S3_CREATED],
                            "LambdaFunctionArn": "arn:aws:lambda:us-east-1:35667example:function:NewCreateThumbnail",
                        }
                    ]
                },
            },
        }
        from src import index

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
        self.assert_notify_cfn_success(mock_call)

    @mock_s3
    @patch("urllib.request.urlopen")
    def test_update_from_older_cdk_version(self, mock_call: MagicMock):
        # SCENARIO We have upgraded to a newer version of CDK, where some of existing managed notification
        # GIVEN A bucket with an existing configuration with Id "old-function-hash"
        setup_s3_bucket(notification_configuration=NOTIFICATION_CONFIGURATION)
        # AND an Update event with a "OldResourceProperties" that matches the target and events of the
        # "ResourceProperties"
        update_event_cdk_upgrade = {
            "StackId": "StackId",
            "RequestId": "RequestId",
            "LogicalResourceId": "LogicalResourceId",
            "ResponseURL": RESPONSE_URL,
            "RequestType": "Update",
            "OldResourceProperties": {
                "BucketName": BUCKET_NAME,
                "NotificationConfiguration": {
                    "LambdaFunctionConfigurations": [{"Events": [S3_CREATED], "LambdaFunctionArn": LAMBDA_ARN}]
                },
            },
            "ResourceProperties": {
                "BucketName": BUCKET_NAME,
                "NotificationConfiguration": {
                    "LambdaFunctionConfigurations": [
                        {"Id": "new-function-hash", "Events": [S3_CREATED], "LambdaFunctionArn": LAMBDA_ARN}
                    ]
                },
            },
        }
        from src import index

        # WHEN calling the handler
        index.handler(update_event_cdk_upgrade, MockContext())

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
        self.assertEqual("old-function-hash", lambda_config.get("Id"))
        # AND notify CFN of its success
        self.assert_notify_cfn_success(mock_call)


if __name__ == "__main__":
    unittest.main()
