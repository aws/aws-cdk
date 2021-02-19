import boto3, json, urllib.request

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
        s3.put_bucket_notification_configuration(Bucket=bucket, NotificationConfiguration=config)

        response_status = "SUCCESS"
    except Exception as e:
        print("Failed to put bucket notification configuration:", e)
        response_status = "FAILED"

    submit_response(event, context, response_status)


def load_config(bucket: str, in_config: dict) -> dict:
    config = s3.get_bucket_notification_configuration(Bucket=bucket)
    if "ResponseMetadata" in config.keys():
        del config["ResponseMetadata"]
    filter_config(config, in_config, "TopicConfigurations")
    filter_config(config, in_config, "QueueConfigurations")
    filter_config(config, in_config, "LambdaFunctionConfigurations")
    return config


def filter_config(config: dict, in_config: dict, config_type: str):
    # Initilize to an empty list if no existing config exists for the config_type
    in_config.setdefault(config_type, [])

    # Filter out existing config which have id's that match the new including config.
    if config_type in config.keys():
        configs, in_ids = config[config_type], ids(in_config[config_type])
        config[config_type] = [item for item in configs if item["Id"] not in in_ids]


def ids(in_configs: str) -> list:
    return [item["Id"] for item in in_configs if "Id" in item.keys()]


def merge_config(config: dict, in_config: dict) -> dict:
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
