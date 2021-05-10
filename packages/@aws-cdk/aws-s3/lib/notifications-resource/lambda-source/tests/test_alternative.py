import unittest
from typing import Dict, Any

import boto3  # type: ignore
from moto import mock_s3  # type: ignore

destinations = (
    ("TopicConfigurations", "TopicArn"),
    ("QueueConfigurations", "QueueArn"),
    ("LambdaFunctionConfigurations", "LambdaFunctionArn"),
)


class AlternativeTest(unittest.TestCase):
    @mock_s3
    def test_new(self):
        s3 = boto3.client("s3")
        bucket_name = "foo"
        params = {"Bucket": bucket_name}
        s3.create_bucket(**params)
        notification_configuration = {
            "TopicConfigurations": [
                {
                    "Id": "string",
                    "TopicArn": "arn:aws:sns:us-east-1:123456789012:MyTopic",
                    "Events": ["s3:ObjectCreated:*"],
                    "Filter": {"Key": {"FilterRules": [{"Name": "prefix", "Value": "string"}]}},
                },
            ],
            "QueueConfigurations": [
                {
                    "Id": "string",
                    "QueueArn": "arn:aws:sqs:us-east-1:444455556666:queue1",
                    "Events": ["s3:ObjectCreated:Put"],
                    "Filter": {"Key": {"FilterRules": [{"Name": "suffix", "Value": "string"}]}},
                },
            ],
            "LambdaFunctionConfigurations": [
                {
                    "Id": "string",
                    "LambdaFunctionArn": "arn:aws:lambda:us-east-1:35667example:function:CreateThumbnail",
                    "Events": ["s3:ObjectCreated:Post"],
                    "Filter": {"Key": {"FilterRules": [{"Name": "prefix", "Value": "string"}]}},
                },
            ],
        }
        result = s3.put_bucket_notification_configuration(
            Bucket=bucket_name,
            NotificationConfiguration=notification_configuration,
            ExpectedBucketOwner="string",
        )
        print("Print put:", result)

        request_type = "Create"

        current: Dict = s3.get_bucket_notification_configuration(**params)
        current.pop("ResponseMetadata")
        print("current:", current)

        merged_config: Dict[str, Any] = {}
        for name, arn in destinations:
            print("name:", name)
            current_configs = current.get(name)
            in_configs = notification_configuration.get(name)

            if current_configs is not None:
                if in_configs is not None:
                    for config in current_configs:
                        print(config)
                else:
                    print("Keep existing")
                    merged_config[name] = current_configs

            if in_configs is not None:
                merged_config[name] = in_configs
                continue
            if in_configs is None:
                merged_config[name] = current_configs

            merged_config[name] = current_configs

        self.assertEqual(current, notification_configuration)
