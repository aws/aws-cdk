import os
from importlib.metadata import distribution

import ujson


def handler(event, context):
    if ujson.loads('{"status": 200}') != {"status": 200}:
        raise ValueError("Unexpected native JSON parser result")

    expected_tag = os.environ.get("EXPECTED_WHEEL_TAG")
    if expected_tag:
        wheel_metadata = distribution("ujson").read_text("WHEEL")
        tags = [line.rsplit("-", 1)[-1] for line in wheel_metadata.splitlines() if line.startswith("Tag: ")]
        if expected_tag not in tags:
            raise ValueError(f"Expected wheel platform {expected_tag}, found {tags}")

    return 200
