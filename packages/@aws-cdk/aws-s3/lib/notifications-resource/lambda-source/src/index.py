import boto3  # type: ignore
import json
import urllib.request
from typing import List

s3 = boto3.client("s3")
cf = boto3.client("cloudformation")


def handler(event: dict, context):
    response_status = "SUCCESS"
    error_message = ""
    try:
        props = event["ResourceProperties"]
        bucket = props["BucketName"]
        if is_rollback_in_progress(event):
            return
        s3.put_bucket_notification_configuration(
            Bucket=bucket,
            NotificationConfiguration=get_config(
                current_config=s3.get_bucket_notification_configuration(Bucket=bucket),
                new_config=props["NotificationConfiguration"],
                old_config=event.get("OldResourceProperties", {}).get("NotificationConfiguration", {}),
                request_type=event["RequestType"],
            ),
        )
    except Exception as e:
        print("Failed to put bucket notification configuration:", e)
        response_status = "FAILED"
        error_message = f"Error: {str(e)}. "
    finally:
        submit_response(event, context, response_status, error_message)


def is_rollback_in_progress(event: dict) -> bool:
    if event["RequestType"] != "Delete":
        return False
    result: List = cf.describe_stacks(StackName=event["StackId"]).get("Stacks", [])
    return len(result) == 1 and result[0]["StackStatus"] == "ROLLBACK_IN_PROGRESS"


def get_config(current_config: dict, new_config: dict, old_config: dict, request_type: str) -> dict:
    config: dict = {}
    types = (
        ("TopicConfigurations", "TopicArn"),
        ("QueueConfigurations", "QueueArn"),
        ("LambdaFunctionConfigurations", "LambdaFunctionArn"),
    )
    for config_type, target in types:
        configs = current_config.get(config_type, [])
        in_configs = new_config.get(config_type, [])
        if request_type == "Create":
            configs.extend(in_configs)
            config[config_type] = configs
        elif request_type == "Update":
            configs = find_difference(configs, old_config.get(config_type, []), target)
            configs.extend(in_configs)
            config[config_type] = configs
        elif request_type == "Delete":
            config[config_type] = find_difference(configs, in_configs, target)
    return config


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
