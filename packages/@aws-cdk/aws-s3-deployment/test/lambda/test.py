# unit tests for the s3 bucket deployment lambda handler
import index
import os
import unittest
import json
import sys
import traceback
import logging
import botocore
from botocore.vendored import requests
from botocore.exceptions import ClientError
from unittest.mock import MagicMock
from unittest.mock import patch

# set TEST_AWSCLI_PATH to point to the "aws" stub we have here
scriptdir=os.path.dirname(os.path.realpath(__file__))
os.environ['TEST_AWSCLI_PATH'] = os.path.join(scriptdir, 'aws')

class TestHandler(unittest.TestCase):
    def setUp(self):
        logger = logging.getLogger()

        # clean up old aws.out file (from previous runs)
        try: os.remove("aws.out")
        except OSError: pass

    def test_invalid_request(self):
        resp = invoke_handler("Create", {}, expected_status="FAILED")
        self.assertEqual(resp["Reason"], "missing request resource property 'SourceBucketNames'. props: {}")

    def test_create_update(self):
        invoke_handler("Create", {
            "SourceBucketNames": ["<source-bucket>"],
            "SourceObjectKeys": ["<source-object-key>"],
            "DestinationBucketName": "<dest-bucket-name>"
        })

        self.assertAwsCommands(
            ["s3", "cp", "s3://<source-bucket>/<source-object-key>", "archive.zip"],
            ["s3", "sync", "--delete", "contents.zip", "s3://<dest-bucket-name>/"]
        )

    def test_create_no_delete(self):
        invoke_handler("Create", {
            "SourceBucketNames": ["<source-bucket>"],
            "SourceObjectKeys": ["<source-object-key>"],
            "DestinationBucketName": "<dest-bucket-name>",
            "Prune": "false"
        })

        self.assertAwsCommands(
            ["s3", "cp", "s3://<source-bucket>/<source-object-key>", "archive.zip"],
            ["s3", "sync", "contents.zip", "s3://<dest-bucket-name>/"]
        )

    def test_update_no_delete(self):
        invoke_handler("Update", {
            "SourceBucketNames": ["<source-bucket>"],
            "SourceObjectKeys": ["<source-object-key>"],
            "DestinationBucketName": "<dest-bucket-name>",
            "Prune": "false"
        }, old_resource_props={
            "DestinationBucketName": "<dest-bucket-name>",
        }, physical_id="<physical-id>")

        self.assertAwsCommands(
            ["s3", "cp", "s3://<source-bucket>/<source-object-key>", "archive.zip"],
            ["s3", "sync", "contents.zip", "s3://<dest-bucket-name>/"]
        )

    def test_create_update_multiple_sources(self):
        invoke_handler("Create", {
            "SourceBucketNames": ["<source-bucket1>", "<source-bucket2>"],
            "SourceObjectKeys": ["<source-object-key1>", "<source-object-key2>"],
            "DestinationBucketName": "<dest-bucket-name>"
        })

        # Note: these are different files in real-life. For testing purposes, we hijack
        #       the command to output a static filename, archive.zip
        self.assertAwsCommands(
            ["s3", "cp", "s3://<source-bucket1>/<source-object-key1>", "archive.zip"],
            ["s3", "cp", "s3://<source-bucket2>/<source-object-key2>", "archive.zip"],
            ["s3", "sync", "--delete", "contents.zip", "s3://<dest-bucket-name>/"]
        )

    def test_create_with_backslash_prefix_same_as_no_prefix(self):
        invoke_handler("Create", {
            "SourceBucketNames": ["<source-bucket>"],
            "SourceObjectKeys": ["<source-object-key>"],
            "DestinationBucketName": "<dest-bucket-name>",
            "DestinationBucketKeyPrefix": "/"
        })

        self.assertAwsCommands(
            ["s3", "cp", "s3://<source-bucket>/<source-object-key>", "archive.zip"],
            ["s3", "sync", "--delete", "contents.zip", "s3://<dest-bucket-name>/"]
        )


    def test_create_update_with_dest_key(self):
        invoke_handler("Create", {
            "SourceBucketNames": ["<source-bucket>"],
            "SourceObjectKeys": ["<source-object-key>"],
            "DestinationBucketName": "<dest-bucket-name>",
            "DestinationBucketKeyPrefix": "<dest-key-prefix>"
        })

        self.assertAwsCommands(
            ["s3", "cp", "s3://<source-bucket>/<source-object-key>", "archive.zip"],
            ["s3", "sync", "--delete", "contents.zip", "s3://<dest-bucket-name>/<dest-key-prefix>"]
        )

    def test_create_update_with_metadata(self):
        invoke_handler("Create", {
            "SourceBucketNames": ["<source-bucket>"],
            "SourceObjectKeys": ["<source-object-key>"],
            "DestinationBucketName": "<dest-bucket-name>",
            "DestinationBucketKeyPrefix": "<dest-key-prefix>",
            "UserMetadata": { "best": "game" },
            "SystemMetadata": { "content-type": "text/html", "content-language": "en" }
        })

        self.assertAwsCommands(
            ["s3", "cp", "s3://<source-bucket>/<source-object-key>", "archive.zip"],
            ["s3", "sync", "--delete", "contents.zip", "s3://<dest-bucket-name>/<dest-key-prefix>", "--content-type", "text/html", "--content-language", "en", "--metadata", "{\"best\":\"game\"}", "--metadata-directive", "REPLACE"]
        )

    def test_delete_no_retain(self):
        invoke_handler("Delete", {
            "SourceBucketNames": ["<source-bucket>"],
            "SourceObjectKeys": ["<source-object-key>"],
            "DestinationBucketName": "<dest-bucket-name>",
            "RetainOnDelete": "false"
        }, physical_id="<physicalid>")

        self.assertAwsCommands(["s3", "rm", "s3://<dest-bucket-name>/", "--recursive"])

    def test_delete_with_dest_key(self):
        invoke_handler("Delete", {
            "SourceBucketNames": ["<source-bucket>"],
            "SourceObjectKeys": ["<source-object-key>"],
            "DestinationBucketName": "<dest-bucket-name>",
            "DestinationBucketKeyPrefix": "<dest-key-prefix>",
            "RetainOnDelete": "false"
        }, physical_id="<physicalid>")

        self.assertAwsCommands(["s3", "rm", "s3://<dest-bucket-name>/<dest-key-prefix>", "--recursive"])

    def test_delete_with_retain_explicit(self):
        invoke_handler("Delete", {
            "SourceBucketNames": ["<source-bucket>"],
            "SourceObjectKeys": ["<source-object-key>"],
            "DestinationBucketName": "<dest-bucket-name>",
            "RetainOnDelete": "true"
        }, physical_id="<physicalid>")

        # no aws commands (retain)
        self.assertAwsCommands()

    # RetainOnDelete=true is the default
    def test_delete_with_retain_implicit_default(self):
        invoke_handler("Delete", {
            "SourceBucketNames": ["<source-bucket>"],
            "SourceObjectKeys": ["<source-object-key>"],
            "DestinationBucketName": "<dest-bucket-name>"
        }, physical_id="<physicalid>")

        # no aws commands (retain)
        self.assertAwsCommands()

    def test_delete_with_retain_explicitly_false(self):
        invoke_handler("Delete", {
            "SourceBucketNames": ["<source-bucket>"],
            "SourceObjectKeys": ["<source-object-key>"],
            "DestinationBucketName": "<dest-bucket-name>",
            "RetainOnDelete": "false"
        }, physical_id="<physicalid>")

        self.assertAwsCommands(
            ["s3", "rm", "s3://<dest-bucket-name>/", "--recursive"]
        )

    #
    # update
    #

    def test_update_same_dest(self):
        invoke_handler("Update", {
            "SourceBucketNames": ["<source-bucket>"],
            "SourceObjectKeys": ["<source-object-key>"],
            "DestinationBucketName": "<dest-bucket-name>",
        }, old_resource_props={
            "DestinationBucketName": "<dest-bucket-name>",
        }, physical_id="<physical-id>")

        self.assertAwsCommands(
            ["s3", "cp", "s3://<source-bucket>/<source-object-key>", "archive.zip"],
            ["s3", "sync", "--delete", "contents.zip", "s3://<dest-bucket-name>/"]
        )

    def test_update_same_dest_cf_invalidate(self):
        def mock_make_api_call(self, operation_name, kwarg):
            if operation_name == 'CreateInvalidation':
                assert kwarg['DistributionId'] == '<cf-dist-id>'
                assert kwarg['InvalidationBatch']['Paths']['Quantity'] == 1
                assert kwarg['InvalidationBatch']['Paths']['Items'][0] == '/*'
                return {'Invalidation': {'Id': '<invalidation-id>'}}
            if operation_name == 'GetInvalidation' and kwarg['Id'] == '<invalidation-id>':
                return {'Invalidation': {'Id': '<invalidation-id>', 'Status': 'Completed'}}
            raise ClientError({'Error': {'Code': '500', 'Message': 'Unsupported operation'}}, operation_name)

        with patch('botocore.client.BaseClient._make_api_call', new=mock_make_api_call):
            invoke_handler("Update", {
                "SourceBucketNames": ["<source-bucket>"],
                "SourceObjectKeys": ["<source-object-key>"],
                "DestinationBucketName": "<dest-bucket-name>",
                "DistributionId": "<cf-dist-id>"
            }, old_resource_props={
                "DestinationBucketName": "<dest-bucket-name>",
            }, physical_id="<physical-id>")

    def test_update_same_dest_cf_invalidate_custom_prefix(self):
        def mock_make_api_call(self, operation_name, kwarg):
            if operation_name == 'CreateInvalidation':
                assert kwarg['DistributionId'] == '<cf-dist-id>'
                assert kwarg['InvalidationBatch']['Paths']['Quantity'] == 1
                assert kwarg['InvalidationBatch']['Paths']['Items'][0] == '/<dest-prefix>/*'
                return {'Invalidation': {'Id': '<invalidation-id>'}}
            if operation_name == 'GetInvalidation' and kwarg['Id'] == '<invalidation-id>':
                return {'Invalidation': {'Id': '<invalidation-id>', 'Status': 'Completed'}}
            raise ClientError({'Error': {'Code': '500', 'Message': 'Unsupported operation'}}, operation_name)

        with patch('botocore.client.BaseClient._make_api_call', new=mock_make_api_call):
            invoke_handler("Update", {
                "SourceBucketNames": ["<source-bucket>"],
                "SourceObjectKeys": ["<source-object-key>"],
                "DestinationBucketName": "<dest-bucket-name>",
                "DestinationBucketKeyPrefix": "<dest-prefix>",
                "DistributionId": "<cf-dist-id>"
            }, old_resource_props={
                "DestinationBucketName": "<dest-bucket-name>",
            }, physical_id="<physical-id>")

    def test_update_same_dest_cf_invalidate_custom_paths(self):
        def mock_make_api_call(self, operation_name, kwarg):
            if operation_name == 'CreateInvalidation':
                assert kwarg['DistributionId'] == '<cf-dist-id>'
                assert kwarg['InvalidationBatch']['Paths']['Quantity'] == 2
                assert kwarg['InvalidationBatch']['Paths']['Items'][0] == '/path1/*'
                assert kwarg['InvalidationBatch']['Paths']['Items'][1] == '/path2/*'
                return {'Invalidation': {'Id': '<invalidation-id>'}}
            if operation_name == 'GetInvalidation' and kwarg['Id'] == '<invalidation-id>':
                return {'Invalidation': {'Id': '<invalidation-id>', 'Status': 'Completed'}}
            raise ClientError({'Error': {'Code': '500', 'Message': 'Unsupported operation'}}, operation_name)

        with patch('botocore.client.BaseClient._make_api_call', new=mock_make_api_call):
            invoke_handler("Update", {
                "SourceBucketNames": ["<source-bucket>"],
                "SourceObjectKeys": ["<source-object-key>"],
                "DestinationBucketName": "<dest-bucket-name>",
                "DistributionId": "<cf-dist-id>",
                "DistributionPaths": ["/path1/*", "/path2/*"]
            }, old_resource_props={
                "DestinationBucketName": "<dest-bucket-name>",
            }, physical_id="<physical-id>")

    def test_update_new_dest_retain(self):
        invoke_handler("Update", {
            "SourceBucketNames": ["<source-bucket>"],
            "SourceObjectKeys": ["<source-object-key>"],
            "DestinationBucketName": "<dest-bucket-name>",
        }, old_resource_props={
            "DestinationBucketName": "<dest-bucket-name>",
            "RetainOnDelete": "true"
        }, physical_id="<physical-id>")

        self.assertAwsCommands(
            ["s3", "cp", "s3://<source-bucket>/<source-object-key>", "archive.zip"],
            ["s3", "sync", "--delete", "contents.zip", "s3://<dest-bucket-name>/"]
        )

    def test_update_new_dest_no_retain(self):
        invoke_handler("Update", {
            "SourceBucketNames": ["<source-bucket>"],
            "SourceObjectKeys": ["<source-object-key>"],
            "DestinationBucketName": "<new-dest-bucket-name>",
            "RetainOnDelete": "false"
        }, old_resource_props={
            "DestinationBucketName": "<old-dest-bucket-name>",
            "DestinationBucketKeyPrefix": "<old-dest-prefix>",
            "RetainOnDelete": "false"
        }, physical_id="<physical-id>")

        self.assertAwsCommands(
            ["s3", "rm", "s3://<old-dest-bucket-name>/<old-dest-prefix>", "--recursive"],
            ["s3", "cp", "s3://<source-bucket>/<source-object-key>", "archive.zip"],
            ["s3", "sync", "--delete", "contents.zip", "s3://<new-dest-bucket-name>/"]
        )

    def test_update_new_dest_retain_implicit(self):
        invoke_handler("Update", {
            "SourceBucketNames": ["<source-bucket>"],
            "SourceObjectKeys": ["<source-object-key>"],
            "DestinationBucketName": "<new-dest-bucket-name>",
        }, old_resource_props={
            "DestinationBucketName": "<old-dest-bucket-name>",
            "DestinationBucketKeyPrefix": "<old-dest-prefix>"
        }, physical_id="<physical-id>")

        self.assertAwsCommands(
            ["s3", "cp", "s3://<source-bucket>/<source-object-key>", "archive.zip"],
            ["s3", "sync", "--delete", "contents.zip", "s3://<new-dest-bucket-name>/"]
        )

    def test_update_new_dest_prefix_no_retain(self):
        invoke_handler("Update", {
            "SourceBucketNames": ["<source-bucket>"],
            "SourceObjectKeys": ["<source-object-key>"],
            "DestinationBucketName": "<dest-bucket-name>",
            "DestinationBucketKeyPrefix": "<new-dest-prefix>",
            "RetainOnDelete": "false"
        }, old_resource_props={
            "DestinationBucketName": "<dest-bucket-name>",
            "RetainOnDelete": "false"
        }, physical_id="<physical id>")

        self.assertAwsCommands(
            ["s3", "rm", "s3://<dest-bucket-name>/", "--recursive"],
            ["s3", "cp", "s3://<source-bucket>/<source-object-key>", "archive.zip"],
            ["s3", "sync", "--delete", "contents.zip", "s3://<dest-bucket-name>/<new-dest-prefix>"]
        )

    def test_update_new_dest_prefix_retain_implicit(self):
        invoke_handler("Update", {
            "SourceBucketNames": ["<source-bucket>"],
            "SourceObjectKeys": ["<source-object-key>"],
            "DestinationBucketName": "<dest-bucket-name>",
            "DestinationBucketKeyPrefix": "<new-dest-prefix>"
        }, old_resource_props={
            "DestinationBucketName": "<dest-bucket-name>",
        }, physical_id="<physical id>")

        self.assertAwsCommands(
            ["s3", "cp", "s3://<source-bucket>/<source-object-key>", "archive.zip"],
            ["s3", "sync", "--delete", "contents.zip", "s3://<dest-bucket-name>/<new-dest-prefix>"]
        )

    #
    # physical id
    #

    def test_physical_id_allocated_on_create_and_reused_afterwards(self):
        create_resp = invoke_handler("Create", {
            "SourceBucketNames": ["<source-bucket>"],
            "SourceObjectKeys": ["<source-object-key>"],
            "DestinationBucketName": "<dest-bucket-name>",
        })

        phid = create_resp['PhysicalResourceId']
        self.assertTrue(phid.startswith('aws.cdk.s3deployment'))

        # now issue an update and pass in the physical id. expect the same
        # one to be returned back
        update_resp = invoke_handler("Update", {
            "SourceBucketNames": ["<source-bucket>"],
            "SourceObjectKeys": ["<source-object-key>"],
            "DestinationBucketName": "<new-dest-bucket-name>",
        }, old_resource_props={
            "DestinationBucketName": "<dest-bucket-name>",
        }, physical_id=phid)
        self.assertEqual(update_resp['PhysicalResourceId'], phid)

        # now issue a delete, and make sure this also applies
        delete_resp = invoke_handler("Delete", {
            "SourceBucketNames": ["<source-bucket>"],
            "SourceObjectKeys": ["<source-object-key>"],
            "DestinationBucketName": "<dest-bucket-name>",
            "RetainOnDelete": "false"
        }, physical_id=phid)
        self.assertEqual(delete_resp['PhysicalResourceId'], phid)

    def test_fails_when_physical_id_not_present_in_update(self):
        update_resp = invoke_handler("Update", {
            "SourceBucketNames": ["<source-bucket>"],
            "SourceObjectKeys": ["<source-object-key>"],
            "DestinationBucketName": "<new-dest-bucket-name>",
        }, old_resource_props={
            "DestinationBucketName": "<dest-bucket-name>",
        }, expected_status="FAILED")

        self.assertEqual(update_resp['Reason'], "invalid request: request type is 'Update' but 'PhysicalResourceId' is not defined")

    def test_fails_when_physical_id_not_present_in_delete(self):
        update_resp = invoke_handler("Delete", {
            "SourceBucketNames": ["<source-bucket>"],
            "SourceObjectKeys": ["<source-object-key>"],
            "DestinationBucketName": "<new-dest-bucket-name>",
        }, old_resource_props={
            "DestinationBucketName": "<dest-bucket-name>",
        }, expected_status="FAILED")

        self.assertEqual(update_resp['Reason'], "invalid request: request type is 'Delete' but 'PhysicalResourceId' is not defined")


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
        return [json.loads(l) for l in f.read().splitlines()]

#
# invokes the handler under test
#   requestType: CloudFormation request type ("Create", "Update", "Delete")
#   resourceProps: map to pass to "ResourceProperties"
#   expected_status: "SUCCESS" or "FAILED"
def invoke_handler(requestType, resourceProps, old_resource_props=None, physical_id=None, expected_status='SUCCESS'):
    response_url = 'http://<response-url>'

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

    if physical_id:
        event['PhysicalResourceId'] = physical_id

    class ContextMock: log_stream_name = 'log_stream'
    class ResponseMock:
      reason = 'OK'
      # needed because the context manager calls this
      close = lambda _: _

    context = ContextMock()
    index.urlopen = MagicMock(return_value=ResponseMock())

    #--------------------
    # invoke the handler
    #--------------------
    index.handler(event, context)

    index.urlopen.assert_called_once()
    (pos_args, _) = index.urlopen.call_args

    actual_request = pos_args[0]
    actual_url = actual_request.full_url
    actual_data = actual_request.data
    actual_method = actual_request.method

    if actual_url != response_url:
        raise Exception("Invalid url used for sending CFN response. expected=%s actual=%s" % (response_url, actual_url))

    if actual_method != 'PUT':
        raise Exception("Invalid method used for sending CFN response. expected=PUT actual=%s" % (actual_method,))

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
