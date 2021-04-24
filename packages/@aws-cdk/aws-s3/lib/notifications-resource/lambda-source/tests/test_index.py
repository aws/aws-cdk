import json
import unittest
from urllib.request import Request
import uuid
from unittest.mock import patch, MagicMock
import boto3  # type: ignore
from moto.s3 import mock_s3  # type: ignore

bucket_name = "fake_bucket"
create_event = {
    "StackId": "StackId",
    "RequestId": "RequestId",
    "LogicalResourceId": "LogicalResourceId",
    "ResponseURL": "https://dummy.com/",
    "RequestType": "Create",
    "ResourceProperties": {
        "BucketName": bucket_name,
        "NotificationConfiguration": {
            "QueueConfigurations": [
                {
                    "Id": "my-function-hash",
                    "Events": ["s3:ObjectCreated:*"],
                    "QueueArn": "arn:aws:sqs:us-east-1:444455556666:new-queue",
                }
            ]
        },
    },
}
update_event = {
    "StackId": "StackId",
    "RequestId": "RequestId",
    "LogicalResourceId": "LogicalResourceId",
    "ResponseURL": "https://dummy.com/",
    "RequestType": "Update",
    "OldResourceProperties": {
        "BucketName": bucket_name,
        "NotificationConfiguration": {
            "LambdaFunctionConfigurations": [
                {
                    "Id": "old-function-hash",
                    "Events": ["s3:ObjectCreated:*"],
                    "LambdaFunctionArn": "arn:aws:lambda:us-east-1:35667example:function:CreateThumbnail",
                }
            ]
        },
    },
    "ResourceProperties": {
        "BucketName": bucket_name,
        "NotificationConfiguration": {
            "LambdaFunctionConfigurations": [
                {
                    "Id": "new-function-hash",
                    "Events": ["s3:ObjectCreated:*"],
                    "LambdaFunctionArn": "arn:aws:lambda:us-east-1:35667example:function:NewCreateThumbnail",
                }
            ]
        },
    },
}
delete_event = {
    "StackId": "StackId",
    "RequestId": "RequestId",
    "LogicalResourceId": "LogicalResourceId",
    "ResponseURL": "https://dummy.com/",
    "RequestType": "Delete",
    "ResourceProperties": {
        "BucketName": bucket_name,
        "NotificationConfiguration": {
            "QueueConfigurations": [
                {
                    "Id": "created-by-cdk",
                    "Events": ["s3:ObjectCreated:*"],
                    "QueueArn": "arn:aws:sqs:us-east-1:444455556666:old-queue",
                }
            ]
        },
    },
}


class MockContext(object):
    function_name = "func_name"
    memory_limit_in_mb = 512
    invoked_function_arn = "func_arn"
    aws_request_id = uuid.uuid4()
    log_stream_name = "log_stream_name"


def setup_s3_bucket(no_bucket_config: bool = False):
    s3_client = boto3.client("s3", region_name="us-east-1")
    s3_client.create_bucket(Bucket=bucket_name)

    if no_bucket_config:
        return

    s3_client.put_bucket_notification_configuration(
        Bucket=bucket_name,
        NotificationConfiguration={
            "TopicConfigurations": [
                {
                    "Id": "string",
                    "TopicArn": "arn:aws:sns:us-east-1:123456789012:MyTopic",
                    "Events": [
                        "s3:ObjectCreated:*",
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
            "QueueConfigurations": [
                {
                    "Id": "created-by-cdk",
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
                    "LambdaFunctionArn": "arn:aws:lambda:us-east-1:35667example:function:CreateThumbnail",
                    "Events": [
                        "s3:ObjectRemoved:*",
                    ],
                    "Filter": {
                        "Key": {
                            "FilterRules": [
                                {"Name": "prefix", "Value": "string"},
                            ]
                        }
                    },
                },
            ],
        },
    )


class LambdaTest(unittest.TestCase):
    def test_empty_ids(self):
        from src import index
        ids = index.ids([{}])
        self.assertEqual([], ids)

    def test_extract_ids_as_list(self):
        from src import index
        ids = index.ids([{"Id": "x"}, {}])
        self.assertEqual(["x"], ids)

    def test_merge_in_config(self):
        # GIVEN an empty in_config and an empty current_config
        from src import index
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

        # WHEN merging
        config = index.prepare_config(current_config, in_config, old_config, True)

        # THEN config and in_config should be equal
        self.assertIsNot(config, in_config)
        self.assertEqual(config, in_config)
        self.assertTrue(len(config["TopicConfigurations"]) == 0)
        self.assertTrue(len(config["QueueConfigurations"]) == 0)
        self.assertTrue(len(config["LambdaFunctionConfigurations"]) == 0)

    def test_merge_in_extend(self):
        # GIVEN an "QueueConfigurations" entry in_config and an empty config
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

        # WHEN merging
        config = index.prepare_config(current_config, in_config, old_config, True)

        # THEN config and in_config should be equal
        # AND QueueConfigurations should be extended
        self.assertIsNot(config, in_config)
        self.assertEqual(config, in_config)
        self.assertTrue(len(config["TopicConfigurations"]) == 0)
        self.assertTrue(len(config["QueueConfigurations"]) == 1)
        self.assertEqual("new_entry", config["QueueConfigurations"][0])
        self.assertTrue(len(config["LambdaFunctionConfigurations"]) == 0)

    def test_prepare_config_removes_response_metadata(self):
        # Test to ensure we remove the "ResponseMetadata" returned by the
        # get_bucket_notification_configuration call
        from src import index
        current_config = {"ResponseMetadata": "foo"}
        config = index.prepare_config(current_config, {}, {}, False)
        self.assertIsNone(config.get("ResponseMetadata"))

    def test_prepare_config_set_defaults(self):
        # GIVEN both loaded configuration and new configuration have no default set
        from src import index
        current_config = {}
        in_config = {}

        # WHEN calling prepare_config
        config = index.prepare_config(current_config, in_config, {}, False)

        # THEN set defaults as [] for all the config types
        expected_config = {"TopicConfigurations": [], "QueueConfigurations": [], "LambdaFunctionConfigurations": []}
        self.assertEqual(expected_config, config)
        self.assertEqual(config, in_config)

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

    @mock_s3
    @patch("urllib.request.urlopen")
    def test_submit_no_bucket_found(self, mock_call: MagicMock):
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
    def test_append_to_existing(self, mock_call: MagicMock):
        setup_s3_bucket()
        from src import index

        index.handler(create_event, MockContext())

        mock_call.assert_called()
        request: Request = mock_call.call_args[0][0]
        self.assertIsInstance(request, Request)
        assert request.data is not None
        data = json.loads(request.data.decode())
        self.assertEqual("SUCCESS", data["Status"])
        self.assertEqual(create_event["ResponseURL"], request.full_url)

        s3_client = boto3.client("s3", region_name="us-east-1")
        config = s3_client.get_bucket_notification_configuration(Bucket=bucket_name)
        self.assertIsNotNone(config["LambdaFunctionConfigurations"])
        self.assertIsNotNone(config["TopicConfigurations"])

        queue_configuration_list = config["QueueConfigurations"]
        self.assertIsNotNone(queue_configuration_list)
        self.assertEqual(2, len(queue_configuration_list))
        self.assertEqual("my-function-hash", queue_configuration_list[1]["Id"])

    @mock_s3
    @patch("urllib.request.urlopen")
    def test_remove_from_existing(self, _):
        setup_s3_bucket()
        from src import index

        index.handler(delete_event, MockContext())

        s3_client = boto3.client("s3", region_name="us-east-1")
        config = s3_client.get_bucket_notification_configuration(Bucket=bucket_name)
        self.assertIsNotNone(config["TopicConfigurations"])
        self.assertIsNone(config.get("QueueConfigurations"))
        self.assertIsNotNone(config["LambdaFunctionConfigurations"])

    @mock_s3
    @patch("urllib.request.urlopen")
    def test_update_config(self, _):
        # GIVEN A bucket with an existing configuration with Id "old-function-hash"
        # AND an Update event with the new incoming configuration with Id "new-function-hash"
        setup_s3_bucket()
        from src import index

        # WHEN calling the handler
        index.handler(update_event, MockContext())

        # THEN replace Id "old-function-hash" config with new config of "new-function-hash"
        # AND keep the other configurations untouched
        s3_client = boto3.client("s3", region_name="us-east-1")
        config = s3_client.get_bucket_notification_configuration(Bucket=bucket_name)
        self.assertIsNotNone(config.get("TopicConfigurations"))
        self.assertIsNotNone(config.get("QueueConfigurations"))
        lambda_configs = config.get("LambdaFunctionConfigurations")
        self.assertIsNotNone(lambda_configs)
        self.assertEqual(1, len(lambda_configs))
        lambda_config = lambda_configs[0]
        self.assertEqual("new-function-hash", lambda_config.get("Id"))

    @mock_s3
    @patch("urllib.request.urlopen")
    def test_add_to_new_bucket(self, mock_call: MagicMock):
        setup_s3_bucket(no_bucket_config=True)
        from src import index

        index.handler(create_event, MockContext())

        mock_call.assert_called()
        s3_client = boto3.client("s3", region_name="us-east-1")
        config = s3_client.get_bucket_notification_configuration(Bucket=bucket_name)
        self.assertIsNone(config.get("LambdaFunctionConfigurations"))
        self.assertIsNone(config.get("TopicConfigurations"))

        queue_configuration_list = config.get("QueueConfigurations")
        self.assertIsNotNone(queue_configuration_list)
        self.assertEqual(1, len(queue_configuration_list))
        self.assertEqual("my-function-hash", queue_configuration_list[0]["Id"])

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


if __name__ == "__main__":
    unittest.main()
