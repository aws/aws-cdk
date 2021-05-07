import boto3  # type: ignore
import json
import urllib.request
from typing import List

TYPES = [
    ["TopicConfigurations", "TopicArn"],
    ["QueueConfigurations", "QueueArn"],
    ["LambdaFunctionConfigurations", "LambdaFunctionArn"],
]
s3 = boto3.client("s3")


def handler(event: dict, context):
    response_status = "SUCCESS"
    error_message = ""
    try:
        props = event["ResourceProperties"]
        bucket = props["BucketName"]
        config = prepare_config(
            current_config=s3.get_bucket_notification_configuration(Bucket=bucket),
            in_config=props["NotificationConfiguration"],
            old_config=event.get("OldResourceProperties", {}).get("NotificationConfiguration", {}),
            request_type=event["RequestType"],
        )
        s3.put_bucket_notification_configuration(Bucket=bucket, NotificationConfiguration=config)
    except Exception as e:
        print("Failed to put bucket notification configuration:", e)
        response_status = "FAILED"
        error_message = f"Error: {str(e)}. "
    finally:
        submit_response(event, context, response_status, error_message)


def prepare_config(current_config: dict, in_config: dict, old_config: dict, request_type: str) -> dict:
    config: dict = {}
    for config_pair in TYPES:
        config_type, target = config_pair
        in_configs = in_config.get(config_type, [])
        managed_ids = ids(in_configs + old_config.get(config_type, []))
        unmanaged_configs = [item for item in current_config.get(config_type, []) if item["Id"] not in managed_ids]
        if request_type in ["Create", "Update"]:
            unmanaged_configs.extend(find_difference(in_configs, unmanaged_configs, target))
            config[config_type] = unmanaged_configs
        elif request_type == "Delete":
            config[config_type] = find_difference(unmanaged_configs, in_configs, target)
    return config


def ids(configs: List) -> List[str]:
    return [item["Id"] for item in configs if "Id" in item]


def find_difference(destination: List, source: List, target: str) -> List:
    return [
        item
        for item in destination
        if not any(
            item.get("Events") == current_item.get("Events") and item.get(target) == current_item.get(target)
            for current_item in source
        )
    ]


def submit_response(event: dict, context, response_status: str, error_message: str):
    response_body = json.dumps(
        {
            "Status": response_status,
            "Reason": f"{error_message}See the details in CloudWatch Log Stream: {context.log_stream_name}",
            "PhysicalResourceId": event.get("PhysicalResourceId") or event["LogicalResourceId"],
            "StackId": event["StackId"],
            "RequestId": event["RequestId"],
            "LogicalResourceId": event["LogicalResourceId"],
            "NoEcho": False,
        }
    ).encode("utf-8")
    headers = {"content-type": "", "content-length": str(len(response_body))}
    try:
        req = urllib.request.Request(url=event["ResponseURL"], headers=headers, data=response_body, method="PUT")
        with urllib.request.urlopen(req) as response:
            print(response.read().decode("utf-8"))
        print("Status code: " + response.reason)
    except Exception as e:
        print("send(..) failed executing request.urlopen(..): " + str(e))
