import unittest
import uuid
from unittest.mock import patch, MagicMock
import boto3
from moto.s3 import mock_s3

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
                    "QueueArn": "arn:aws:sqs:us-east-1:444455556666:old-queue",
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
                    "QueueArn": "arn:aws:sqs:us-east-1:444455556666:new-queue",
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


def setup_s3_bucket():
    s3_client = boto3.client("s3", region_name="us-east-1")
    s3_client.create_bucket(Bucket=bucket_name)
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

    def test_empty_extract_ids(self):
        from src import index
        ids = index.ids([{"Id": "x"}, {}])
        self.assertEqual(["x"], ids)

    @mock_s3
    @patch("urllib.request.urlopen")
    def test_append_to_existing(self, mock_call: MagicMock):
        setup_s3_bucket()
        from src import index

        index.handler(create_event, MockContext())

        mock_call.assert_called()
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
        setup_s3_bucket()
        from src import index

        index.handler(update_event, MockContext())

        s3_client = boto3.client("s3", region_name="us-east-1")
        config = s3_client.get_bucket_notification_configuration(Bucket=bucket_name)
        print(config)


if __name__ == "__main__":
    unittest.main()
