import boto3  # type: ignore
import json
import urllib.request
from typing import List

s3 = boto3.client("s3")
CONFIG_TYPES = ["TopicConfigurations", "QueueConfigurations", "LambdaFunctionConfigurations"]


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
            merge=event["RequestType"] != "Delete",
        )
        s3.put_bucket_notification_configuration(Bucket=bucket, NotificationConfiguration=config)
    except Exception as e:
        print("Failed to put bucket notification configuration:", e)
        response_status = "FAILED"
        error_message = f"Error: {str(e)}. "
    finally:
        submit_response(event, context, response_status, error_message)


def prepare_config(current_config: dict, in_config: dict, old_config: dict, merge: bool) -> dict:
    config = {k: v for (k, v) in current_config.items() if k in CONFIG_TYPES}
    for config_type in CONFIG_TYPES:
        config.setdefault(config_type, [])
        in_config.setdefault(config_type, [])
        config[config_type] = find_unmanaged_notifications(config, config_type, in_config, old_config)
        if merge:
            config[config_type].extend(in_config[config_type])
    return config


def find_unmanaged_notifications(config: dict, config_type: str, in_config: dict, old_config: dict) -> List:
    remove_ids = ids(in_config[config_type] + old_config.get(config_type, []))
    return [item for item in config[config_type] if item["Id"] not in remove_ids]


def ids(configs: list) -> List[str]:
    return [item["Id"] for item in configs if "Id" in item]


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
