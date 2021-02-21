import json
import unittest
import uuid
from unittest.mock import patch
import boto3
from moto.s3 import mock_s3

bucket_name = "fake_bucket"
success_event = {
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


class MockContext(object):
    function_name = "func_name"
    memory_limit_in_mb = 512
    invoked_function_arn = "func_arn"
    aws_request_id = uuid.uuid4()
    log_stream_name = "log_stream_name"


class LambdaTest(unittest.TestCase):
    def test_empty_ids(self):
        from src import index
        ids = index.ids([{}])
        self.assertEqual([], ids)

    def test_empty_extract_ids(self):
        from src import index
        ids = index.ids([{"Id": "x"}, {}])
        self.assertEqual(["x"], ids)

    @patch("urllib.request.urlopen")
    @mock_s3
    def test_append_to_existing(self, mock_call):
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
                        "Id": "string",
                        "QueueArn": "arn:aws:sqs:us-east-1:444455556666:queue1",
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
                        "Id": "string",
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
        s3_client.get_bucket_notification_configuration(Bucket=bucket_name)

        from src import index
        index.handler(success_event, MockContext())

        print(mock_call)
        print(type(mock_call))

        config = s3_client.get_bucket_notification_configuration(Bucket=bucket_name)
        queue_configuration_list = config["QueueConfigurations"]

        print(json.dumps(queue_configuration_list, indent=4))

        self.assertEqual(2, len(queue_configuration_list))
        self.assertEqual("my-function-hash", queue_configuration_list[1]["Id"])
        self.assertEqual(True, True)


if __name__ == "__main__":
    unittest.main()
