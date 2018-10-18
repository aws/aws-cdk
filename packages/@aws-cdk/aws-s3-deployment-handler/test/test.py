import index
import os
import unittest
import json
import sys
import traceback
import logging

class TestHandler(unittest.TestCase):
    def setUp(self):
        logger = logging.getLogger()
        logger.addHandler(logging.NullHandler())

        try:
            os.remove("aws.out")
        except OSError:
            pass

    def test_invalid_request(self):
        resp = invoke_handler("Create", {}, "FAILED")
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

        self.assertAwsCommands("s3 rm s3://<dest-bucket-name>/ --recursive")



    # asserts that a given list of "aws xxx" commands have been invoked (in order)
    def assertAwsCommands(self, *expected):
        argvs = read_aws_out()
        actual = map(lambda argv: ' '.join(argv[1:]), argvs)
        self.assertEqual(actual, list(expected))

# ==================================================================================================
# helpers

def read_aws_out():
    if not os.path.exists("aws.out"):
        return []

    with open("aws.out") as f:
        lines = f.readlines()
        try:
            return map(lambda line: json.loads(line), lines)
        except ValueError:
            traceback.print_exc()
            raise Exception("Unable to parse aws.out as JSON.\n%s" % '\n'.join(lines))

def invoke_handler(requestType, resourceProps, expected_status='SUCCESS'):
    response_url = '<response-url>'

    event={
        'ResponseURL': response_url,
        'StackId': '<stack-id>',
        'RequestId': '<request-id>',
        'LogicalResourceId': '<logical-resource-id>',
        'RequestType': requestType,
        'ResourceProperties': resourceProps
    }

    class ContextMock:
        log_stream_name = 'log_stream'

    class ResponseMock:
        reason = 'OK'

    response=[]

    def http_put(url, data, headers):
        if url != response_url:
            raise Exception("Expected response URL to be %s but got %s\n%s" % (response_url % url, response))

        response.append(data)
        return ResponseMock()

    context=ContextMock()
    index.handler(event, context, http_put=http_put)

    if len(response) != 1:
        raise Exception("Expecting exactly one CloudFormation response to be sent back (got %d)" % len(response))

    resp = json.loads(response[0])

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
