import json
import logging
import urllib.request
from typing import List

import boto3

logging.getLogger().setLevel(logging.INFO)
s3 = boto3.client("s3")


def handler(event: dict, context):
    try:
        props = event["ResourceProperties"]
        in_config = props["NotificationConfiguration"]
        bucket: str = props["BucketName"]

        config = load_config(bucket, in_config)

        if event["RequestType"] != "Delete":
            # For Create and Update we merge in the new config
            config = merge_config(config, in_config)

        # Write out the new bucket configuration
        s3.put_bucket_notification_configuration(
            Bucket=bucket, NotificationConfiguration=config
        )

        response_status = "SUCCESS"
    except Exception as e:
        logging.error("Failed to put bucket notification configuration:", e)
        response_status = "FAILED"

    submit_response(event, context, response_status)


def load_config(bucket: str, in_config: dict) -> dict:
    """
    Loads the existing bucket notification configuration and filters out
    any existing configurations that match by the incoming "Id"

    :param bucket: Bucket name
    :param in_config: Incoming bucket configuration with "Id"s
    :return: Returns a filtered existing configuration
    """
    config = s3.get_bucket_notification_configuration(Bucket=bucket)

    # Remove the ResponseMetadata coming from get configuration response
    if "ResponseMetadata" in config:
        del config["ResponseMetadata"]

    filter_config(config, in_config, "TopicConfigurations")
    filter_config(config, in_config, "QueueConfigurations")
    filter_config(config, in_config, "LambdaFunctionConfigurations")

    return config


def filter_config(existing_config: dict, in_config: dict, config_type: str):
    """
    Filter out any configuration with an "Id" matching the new incoming configuration

    :param existing_config: Existing bucket notification configuration
    :param in_config: New incoming bucket notification
    :param config_type: Type of configuration
    :return:
    """
    # Initialize to an empty list if no existing config exists for the config_type
    in_config.setdefault(config_type, [])

    # Exit early if not existing configuration by the config_type
    if config_type not in existing_config:
        return

    # Filter out existing config which have id's that match the new including config.
    configs, in_ids = existing_config[config_type], ids(in_config[config_type])
    existing_config[config_type] = [
        item for item in configs if item["Id"] not in in_ids
    ]


def ids(in_configs: dict) -> List[str]:
    """
    Get list of declared "Id"s in the incoming configuration

    :param in_configs:
    :return:
    """
    return [item["Id"] for item in in_configs if "Id" in item]


def merge_config(config: dict, in_config: dict) -> dict:
    """
    For "Create" and "Update", we want to merge in the new incoming configuration

    :param config: Existing configuration with matching "Id"s filtered out
    :param in_config: New incoming configuration to merge in
    :return: Returns the updated merged configuration
    """
    extend_config(config, in_config, "TopicConfigurations")
    extend_config(config, in_config, "QueueConfigurations")
    extend_config(config, in_config, "LambdaFunctionConfigurations")
    return config


def extend_config(config: dict, in_config: dict, config_type: str):
    config.get(config_type, []).extend(in_config[config_type])


def submit_response(event: dict, context, response_status: str):
    """
    Submit updated back to cloudformation

    :param event:
    :param context:
    :param response_status:
    :return:
    """
    response_body = json.dumps(
        {
            "Status": response_status,
            "Reason": f"See the details in CloudWatch Log Stream: {context.log_stream_name}",
            "PhysicalResourceId": event.get("PhysicalResourceId")
                                  or event["LogicalResourceId"],
            "StackId": event["StackId"],
            "RequestId": event["RequestId"],
            "LogicalResourceId": event["LogicalResourceId"],
            "NoEcho": False,
        }
    ).encode("utf-8")
    headers = {"content-type": "", "content-length": len(response_body)}
    try:
        req = urllib.request.Request(
            url=event["ResponseURL"], headers=headers, data=response_body, method="PUT"
        )
        with urllib.request.urlopen(req) as response:
            logging.info(response.read().decode("utf-8"))
        logging.info("Status code: " + response.reason)
    except Exception as e:
        logging.error("send(..) failed executing requests.put(..): " + str(e))
