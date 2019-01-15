import subprocess
import os
import tempfile
import json
import json
import traceback
import logging
import shutil
from uuid import uuid4

from botocore.vendored import requests
from zipfile import ZipFile

logger = logging.getLogger()
logger.setLevel(logging.INFO)

CFN_SUCCESS = "SUCCESS"
CFN_FAILED = "FAILED"

def handler(event, context):

    def cfn_error(message=None):
        logger.error("| cfn_error: %s" % message)
        cfn_send(event, context, CFN_FAILED, reason=message)

    try:
        logger.info(event)

        # cloudformation request type (create/update/delete)
        request_type = event['RequestType']

        # extract resource properties
        props = event['ResourceProperties']
        old_props = event.get('OldResourceProperties', {})
        physical_id = event.get('PhysicalResourceId', None)

        try:
            source_bucket_name = props['SourceBucketName']
            source_object_key  = props['SourceObjectKey']
            dest_bucket_name   = props['DestinationBucketName']
            dest_bucket_prefix = props.get('DestinationBucketKeyPrefix', '')
            retain_on_delete   = props.get('RetainOnDelete', "true") == "true"
        except KeyError as e:
            cfn_error("missing request resource property %s. props: %s" % (str(e), props))
            return

        # treat "/" as if no prefix was specified
        if dest_bucket_prefix == "/":
            dest_bucket_prefix = ""

        s3_source_zip = "s3://%s/%s" % (source_bucket_name, source_object_key)
        s3_dest = "s3://%s/%s" % (dest_bucket_name, dest_bucket_prefix)

        old_s3_dest = "s3://%s/%s" % (old_props.get("DestinationBucketName", ""), old_props.get("DestinationBucketKeyPrefix", ""))

        # obviously this is not
        if old_s3_dest == "s3:///":
            old_s3_dest = None

        logger.info("| s3_dest: %s" % s3_dest)
        logger.info("| old_s3_dest: %s" % old_s3_dest)

        # if we are creating a new resource, allocate a physical id for it
        # otherwise, we expect physical id to be relayed by cloudformation
        if request_type == "Create":
            physical_id = "aws.cdk.s3deployment.%s" % str(uuid4())
        else:
            if not physical_id:
                cfn_error("invalid request: request type is '%s' but 'PhysicalResourceId' is not defined" % request_type)
                return

        # delete or create/update (only if "retain_on_delete" is false)
        if request_type == "Delete" and not retain_on_delete:
            aws_command("s3", "rm", s3_dest, "--recursive")

        # if we are updating without retention and the destination changed, delete first
        if request_type == "Update" and not retain_on_delete and old_s3_dest != s3_dest:
            if not old_s3_dest:
                logger.warn("cannot delete old resource without old resource properties")
                return

            aws_command("s3", "rm", old_s3_dest, "--recursive")

        if request_type == "Update" or request_type == "Create":
            s3_deploy(s3_source_zip, s3_dest)

        cfn_send(event, context, CFN_SUCCESS, physicalResourceId=physical_id)
    except KeyError as e:
        cfn_error("invalid request. Missing key %s" % str(e))
    except Exception as e:
        logger.exception(e)
        cfn_error(str(e))

#---------------------------------------------------------------------------------------------------
# populate all files from s3_source_zip to a destination bucket
def s3_deploy(s3_source_zip, s3_dest):
    # create a temporary working directory
    workdir=tempfile.mkdtemp()
    logger.info("| workdir: %s" % workdir)

    # create a directory into which we extract the contents of the zip file
    contents_dir=os.path.join(workdir, 'contents')
    os.mkdir(contents_dir)

    # download the archive from the source and extract to "contents"
    archive=os.path.join(workdir, 'archive.zip')
    logger.info("| archive: %s" % archive)
    aws_command("s3", "cp", s3_source_zip, archive)
    logger.info("| extracting archive to: %s" % contents_dir)
    with ZipFile(archive, "r") as zip:
      zip.extractall(contents_dir)

    # sync from "contents" to destination
    aws_command("s3", "sync", "--delete", contents_dir, s3_dest)
    shutil.rmtree(workdir)

#---------------------------------------------------------------------------------------------------
# executes an "aws" cli command
def aws_command(*args):
    aws=os.path.join(os.path.dirname(os.path.realpath(__file__)), 'aws')
    logger.info("| aws %s" % ' '.join(args))
    subprocess.check_call(["python3", aws] + list(args))

#---------------------------------------------------------------------------------------------------
# sends a response to cloudformation
def cfn_send(event, context, responseStatus, responseData={}, physicalResourceId=None, noEcho=False, reason=None):

    responseUrl = event['ResponseURL']
    logger.info(responseUrl)

    responseBody = {}
    responseBody['Status'] = responseStatus
    responseBody['Reason'] = reason or ('See the details in CloudWatch Log Stream: ' + context.log_stream_name)
    responseBody['PhysicalResourceId'] = physicalResourceId or context.log_stream_name
    responseBody['StackId'] = event['StackId']
    responseBody['RequestId'] = event['RequestId']
    responseBody['LogicalResourceId'] = event['LogicalResourceId']
    responseBody['NoEcho'] = noEcho
    responseBody['Data'] = responseData

    body = json.dumps(responseBody)
    logger.info("| response body:\n" + body)

    headers = {
        'content-type' : '',
        'content-length' : str(len(body))
    }

    try:
        response = requests.put(responseUrl, data=body, headers=headers)
        logger.info("| status code: " + response.reason)
    except Exception as e:
        logger.error("| unable to send response to CloudFormation")
        logger.exception(e)
