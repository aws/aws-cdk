import json, urllib.request, boto3
from typing import List

s3 = boto3.client("s3")


def handler(event: dict, context):
    try:
        props = event["ResourceProperties"]
        bucket = props["BucketName"]
        in_config = props["NotificationConfiguration"]
        config = prepare_config(s3.get_bucket_notification_configuration(Bucket=bucket), in_config)
        if event["RequestType"] != "Delete":
            config = merge_in_config(config, in_config)
        s3.put_bucket_notification_configuration(Bucket=bucket, NotificationConfiguration=config)
        response_status = "SUCCESS"
    except Exception as e:
        print("Failed to put bucket src configuration:", e)
        response_status = "FAILED"
    submit_response(event, context, response_status)


def prepare_config(config: dict, in_config: dict) -> dict:
    if "ResponseMetadata" in config:
        del config["ResponseMetadata"]
    filter_config(config, "TopicConfigurations", in_config)
    filter_config(config, "QueueConfigurations", in_config)
    filter_config(config, "LambdaFunctionConfigurations", in_config)
    return config


def filter_config(config: dict, config_type: str, in_config: dict):
    in_config.setdefault(config_type, [])
    if config_type not in config:
        return
    configs, in_ids = config[config_type], ids(in_config[config_type])
    config[config_type] = [item for item in configs if item["Id"] not in in_ids]


def ids(in_configs: list) -> List[str]:
    return [item["Id"] for item in in_configs if "Id" in item]


def merge_in_config(config: dict, in_config: dict) -> dict:
    extend_config(config, in_config, "TopicConfigurations")
    extend_config(config, in_config, "QueueConfigurations")
    extend_config(config, in_config, "LambdaFunctionConfigurations")
    return config


def extend_config(config: dict, in_config: dict, config_type: str):
    config.get(config_type, []).extend(in_config[config_type])


def submit_response(event: dict, context, response_status: str):
    response_body = json.dumps(
        {
            "Status": response_status,
            "Reason": f"See the details in CloudWatch Log Stream: {context.log_stream_name}",
            "PhysicalResourceId": event.get("PhysicalResourceId") or event["LogicalResourceId"],
            "StackId": event["StackId"],
            "RequestId": event["RequestId"],
            "LogicalResourceId": event["LogicalResourceId"],
            "NoEcho": False,
        }
    ).encode("utf-8")
    headers = {"content-type": "", "content-length": len(response_body)}
    try:
        req = urllib.request.Request(url=event["ResponseURL"], headers=headers, data=response_body, method="PUT")
        with urllib.request.urlopen(req) as response:
            print(response.read().decode("utf-8"))
        print("Status code: " + response.reason)
    except Exception as e:
        print("send(..) failed executing requests.put(..): " + str(e))
