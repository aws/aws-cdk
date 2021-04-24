import json, urllib.request, boto3
from typing import List

s3 = boto3.client("s3")
CONFIG_TYPES = ["TopicConfigurations", "QueueConfigurations", "LambdaFunctionConfigurations"]


def handler(event: dict, context):
    try:
        props = event["ResourceProperties"]
        bucket = props["BucketName"]
        in_config = props["NotificationConfiguration"]
        old_config = event.get("OldResourceProperties", {}).get("NotificationConfiguration", {})
        config = prepare_config(s3.get_bucket_notification_configuration(Bucket=bucket), in_config, old_config)
        if event["RequestType"] != "Delete":
            merge_in_config(config, in_config)
        s3.put_bucket_notification_configuration(Bucket=bucket, NotificationConfiguration=config)
        response_status = "SUCCESS"
        error_message = ""
    except Exception as e:
        print("Failed to put bucket notification configuration:", e)
        response_status = "FAILED"
        error_message = f"Error: {str(e)}. "
    submit_response(event, context, response_status, error_message)


def prepare_config(config: dict, in_config: dict, old_config: dict) -> dict:
    if "ResponseMetadata" in config:
        del config["ResponseMetadata"]
    for config_type in CONFIG_TYPES:
        in_config.setdefault(config_type, [])
        config.setdefault(config_type, [])
        filter_config(config, config_type, in_config, old_config)
    return config


def filter_config(config: dict, config_type: str, in_config: dict, old_config: dict):
    configs, in_ids = config[config_type], ids(in_config[config_type])
    in_ids.extend(ids(old_config.get(config_type, []) if old_config else []))
    config[config_type] = [item for item in configs if item["Id"] not in in_ids]


def ids(configs: list) -> List[str]:
    return [item["Id"] for item in configs if "Id" in item]


def merge_in_config(config: dict, in_config: dict):
    for config_type in CONFIG_TYPES:
        config[config_type].extend(in_config[config_type])


def submit_response(event: dict, context, response_status: str, error_message: str = ""):
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
