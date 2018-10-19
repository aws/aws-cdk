# unit tests for the s3 bucket deployment lambda handler
import index
import os
import unittest
import json
import sys
import traceback
import logging
from botocore.vendored import requests
from unittest.mock import MagicMock

class TestHandler(unittest.TestCase):
    def setUp(self):
        logger = logging.getLogger()
        logger.addHandler(logging.NullHandler())

        # clean up old aws.out file (from previous runs)
        try: os.remove("aws.out")
        except OSError: pass

    def test_invalid_request(self):
        resp = invoke_handler("Create", {}, expected_status="FAILED")
        self.assertEqual(resp["Reason"], "missing request resource property 'SourceBucketName'")

    def test_create_update(self):
        invoke_handler("Create", {
            "SourceBucketName": "<source-bucket>",
            "SourceObjectKey": "<source-object-key>",
            "DestinationBucketName": "<dest-bucket-name>"
        })

        self.assertAwsCommands(
            "s3 cp s3://<source-bucket>/<source-object-key> archive.zip",
            "s3 sync --delete contents.zip s3://<dest-bucket-name>/"
        )

    def test_create_update_with_dest_key(self):
        invoke_handler("Create", {
            "SourceBucketName": "<source-bucket>",
            "SourceObjectKey": "<source-object-key>",
            "DestinationBucketName": "<dest-bucket-name>",
            "DestinationBucketKeyPrefix": "<dest-key-prefix>"
        })

        self.assertAwsCommands(
            "s3 cp s3://<source-bucket>/<source-object-key> archive.zip",
            "s3 sync --delete contents.zip s3://<dest-bucket-name>/<dest-key-prefix>"
        )

    def test_delete(self):
        invoke_handler("Delete", {
            "SourceBucketName": "<source-bucket>",
            "SourceObjectKey": "<source-object-key>",
            "DestinationBucketName": "<dest-bucket-name>"
        })

        self.assertAwsCommands("s3 rm s3://<dest-bucket-name>/ --recursive")

    def test_delete_with_dest_key(self):
        invoke_handler("Delete", {
            "SourceBucketName": "<source-bucket>",
            "SourceObjectKey": "<source-object-key>",
            "DestinationBucketName": "<dest-bucket-name>",
            "DestinationBucketKeyPrefix": "<dest-key-prefix>"
        })

        self.assertAwsCommands("s3 rm s3://<dest-bucket-name>/<dest-key-prefix> --recursive")

    def test_delete_with_retain(self):
        invoke_handler("Delete", {
            "SourceBucketName": "<source-bucket>",
            "SourceObjectKey": "<source-object-key>",
            "DestinationBucketName": "<dest-bucket-name>",
            "RetainOnDelete": "true"
        })

        # no aws commands (retain)
        self.assertAwsCommands()

    def test_delete_with_retain_explicitly_false(self):
        invoke_handler("Delete", {
            "SourceBucketName": "<source-bucket>",
            "SourceObjectKey": "<source-object-key>",
            "DestinationBucketName": "<dest-bucket-name>",
            "RetainOnDelete": "false"
        })

        self.assertAwsCommands(
            "s3 rm s3://<dest-bucket-name>/ --recursive"
        )

    #
    # update
    #

    def test_update_same_dest(self):
        invoke_handler("Update", {
            "SourceBucketName": "<source-bucket>",
            "SourceObjectKey": "<source-object-key>",
            "DestinationBucketName": "<dest-bucket-name>",
        }, old_resource_props={
            "DestinationBucketName": "<dest-bucket-name>",
        })

        self.assertAwsCommands(
            "s3 cp s3://<source-bucket>/<source-object-key> archive.zip",
            "s3 sync --delete contents.zip s3://<dest-bucket-name>/"
        )

    def test_update_new_dest_retain(self):
        invoke_handler("Update", {
            "SourceBucketName": "<source-bucket>",
            "SourceObjectKey": "<source-object-key>",
            "DestinationBucketName": "<dest-bucket-name>",
        }, old_resource_props={
            "DestinationBucketName": "<dest-bucket-name>",
            "RetainOnDelete": "true"
        })

        self.assertAwsCommands(
            "s3 cp s3://<source-bucket>/<source-object-key> archive.zip",
            "s3 sync --delete contents.zip s3://<dest-bucket-name>/"
        )

    def test_update_new_dest_no_retain_explicit(self):
        invoke_handler("Update", {
            "SourceBucketName": "<source-bucket>",
            "SourceObjectKey": "<source-object-key>",
            "DestinationBucketName": "<new-dest-bucket-name>",
        }, old_resource_props={
            "DestinationBucketName": "<old-dest-bucket-name>",
            "DestinationBucketKeyPrefix": "<old-dest-prefix>",
            "RetainOnDelete": "false"
        })

        self.assertAwsCommands(
            "s3 rm s3://<old-dest-bucket-name>/<old-dest-prefix> --recursive",
            "s3 cp s3://<source-bucket>/<source-object-key> archive.zip",
            "s3 sync --delete contents.zip s3://<new-dest-bucket-name>/"
        )

    def test_update_new_dest_no_retain_implicit(self):
        invoke_handler("Update", {
            "SourceBucketName": "<source-bucket>",
            "SourceObjectKey": "<source-object-key>",
            "DestinationBucketName": "<new-dest-bucket-name>",
        }, old_resource_props={
            "DestinationBucketName": "<old-dest-bucket-name>",
            "DestinationBucketKeyPrefix": "<old-dest-prefix>"
        })

        self.assertAwsCommands(
            "s3 rm s3://<old-dest-bucket-name>/<old-dest-prefix> --recursive",
            "s3 cp s3://<source-bucket>/<source-object-key> archive.zip",
            "s3 sync --delete contents.zip s3://<new-dest-bucket-name>/"
        )

    def test_update_new_dest_prefix_no_retain_implicit(self):
        invoke_handler("Update", {
            "SourceBucketName": "<source-bucket>",
            "SourceObjectKey": "<source-object-key>",
            "DestinationBucketName": "<dest-bucket-name>",
            "DestinationBucketKeyPrefix": "<new-dest-prefix>"
        }, old_resource_props={
            "DestinationBucketName": "<dest-bucket-name>",
        })

        self.assertAwsCommands(
            "s3 rm s3://<dest-bucket-name>/ --recursive",
            "s3 cp s3://<source-bucket>/<source-object-key> archive.zip",
            "s3 sync --delete contents.zip s3://<dest-bucket-name>/<new-dest-prefix>"
        )

    # asserts that a given list of "aws xxx" commands have been invoked (in order)
    def assertAwsCommands(self, *expected):
        actual = read_aws_out()
        self.assertEqual(actual, list(expected))

# ==================================================================================================
# helpers

#
# reads "aws.out" and returns a list of "aws" commands (as strings)
def read_aws_out():
    if not os.path.exists("aws.out"):
        return []

    with open("aws.out") as f:
        return f.read().splitlines()

#
# invokes the handler under test
#   requestType: CloudFormation request type ("Create", "Update", "Delete")
#   resourceProps: map to pass to "ResourceProperties"
#   expected_status: "SUCCESS" or "FAILED"
def invoke_handler(requestType, resourceProps, old_resource_props=None, expected_status='SUCCESS'):
    response_url = '<response-url>'

    event={
        'ResponseURL': response_url,
        'StackId': '<stack-id>',
        'RequestId': '<request-id>',
        'LogicalResourceId': '<logical-resource-id>',
        'RequestType': requestType,
        'ResourceProperties': resourceProps
    }

    if old_resource_props:
        event['OldResourceProperties'] = old_resource_props

    class ContextMock: log_stream_name = 'log_stream'
    class ResponseMock: reason = 'OK'

    context = ContextMock()
    requests.put = MagicMock(return_value=ResponseMock())

    #--------------------
    # invoke the handler
    #--------------------
    index.handler(event, context)

    requests.put.assert_called_once()
    (pos_args, kw_args) = requests.put.call_args

    actual_url = pos_args[0]
    actual_data = kw_args['data']

    if actual_url != response_url:
        raise Exception("Invalid url used for sending CFN response. expected=%s actual=%s" % (response_url, actual_url))

    resp = json.loads(actual_data)

    def assert_field(name, expect=None):
        value=resp.get(name)

        if not expect:
            if not resp.get(name):
                raise Exception("Missing '%s' field from response: %s" % (name, resp))
        elif expect and value != expect:
            raise Exception("Expecting response field '%s' to be '%s' but got '%s'.\n%s" % (name, expect, value, json.dumps(resp, indent=2)))

    assert_field('Status', expected_status)
    assert_field('Reason')
    assert_field('PhysicalResourceId')
    assert_field('StackId', '<stack-id>')
    assert_field('RequestId', '<request-id>')
    assert_field('LogicalResourceId', '<logical-resource-id>')

    return resp

if __name__ == '__main__':
    unittest.main()
