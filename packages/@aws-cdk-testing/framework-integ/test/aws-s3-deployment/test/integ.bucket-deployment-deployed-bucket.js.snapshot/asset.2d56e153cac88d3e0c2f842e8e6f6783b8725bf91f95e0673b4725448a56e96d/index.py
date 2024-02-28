import contextlib
import json
import logging
import os
import shutil
import subprocess
import tempfile
from urllib.request import Request, urlopen
from uuid import uuid4
from zipfile import ZipFile

import boto3

logger = logging.getLogger()
logger.setLevel(logging.INFO)

cloudfront = boto3.client('cloudfront')
s3 = boto3.client('s3')

CFN_SUCCESS = "SUCCESS"
CFN_FAILED = "FAILED"
ENV_KEY_MOUNT_PATH = "MOUNT_PATH"
ENV_KEY_SKIP_CLEANUP = "SKIP_CLEANUP"

AWS_CLI_CONFIG_FILE = "/tmp/aws_cli_config"
CUSTOM_RESOURCE_OWNER_TAG = "aws-cdk:cr-owned"

os.putenv('AWS_CONFIG_FILE', AWS_CLI_CONFIG_FILE)

def handler(event, context):

    def cfn_error(message=None):
        if message:
            logger.error("| cfn_error: %s" % message.encode())
        cfn_send(event, context, CFN_FAILED, reason=message, physicalResourceId=event.get('PhysicalResourceId', None))


    try:
        # We are not logging ResponseURL as this is a pre-signed S3 URL, and could be used to tamper
        # with the response CloudFormation sees from this Custom Resource execution.
        logger.info({ key:value for (key, value) in event.items() if key != 'ResponseURL'})

        # cloudformation request type (create/update/delete)
        request_type = event['RequestType']

        # extract resource properties
        props = event['ResourceProperties']
        old_props = event.get('OldResourceProperties', {})
        physical_id = event.get('PhysicalResourceId', None)

        try:
            source_bucket_names = props['SourceBucketNames']
            source_object_keys  = props['SourceObjectKeys']
            source_markers      = props.get('SourceMarkers', None)
            dest_bucket_name    = props['DestinationBucketName']
            dest_bucket_prefix  = props.get('DestinationBucketKeyPrefix', '')
            extract             = props.get('Extract', 'true') == 'true'
            retain_on_delete    = props.get('RetainOnDelete', "true") == "true"
            distribution_id     = props.get('DistributionId', '')
            user_metadata       = props.get('UserMetadata', {})
            system_metadata     = props.get('SystemMetadata', {})
            prune               = props.get('Prune', 'true').lower() == 'true'
            exclude             = props.get('Exclude', [])
            include             = props.get('Include', [])
            sign_content        = props.get('SignContent', 'false').lower() == 'true'

            # backwards compatibility - if "SourceMarkers" is not specified,
            # assume all sources have an empty market map
            if source_markers is None:
                source_markers = [{} for i in range(len(source_bucket_names))]

            default_distribution_path = dest_bucket_prefix
            if not default_distribution_path.endswith("/"):
                default_distribution_path += "/"
            if not default_distribution_path.startswith("/"):
                default_distribution_path = "/" + default_distribution_path
            default_distribution_path += "*"

            distribution_paths = props.get('DistributionPaths', [default_distribution_path])
        except KeyError as e:
            cfn_error("missing request resource property %s. props: %s" % (str(e), props))
            return

        # configure aws cli options after resetting back to the defaults for each request
        if os.path.exists(AWS_CLI_CONFIG_FILE):
                os.remove(AWS_CLI_CONFIG_FILE)
        if sign_content:
                aws_command("configure", "set", "default.s3.payload_signing_enabled", "true")

        # treat "/" as if no prefix was specified
        if dest_bucket_prefix == "/":
            dest_bucket_prefix = ""

        s3_source_zips = list(map(lambda name, key: "s3://%s/%s" % (name, key), source_bucket_names, source_object_keys))
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
            if not bucket_owned(dest_bucket_name, dest_bucket_prefix):
                aws_command("s3", "rm", s3_dest, "--recursive")

        # if we are updating without retention and the destination changed, delete first
        if request_type == "Update" and not retain_on_delete and old_s3_dest != s3_dest:
            if not old_s3_dest:
                logger.warn("cannot delete old resource without old resource properties")
                return

            aws_command("s3", "rm", old_s3_dest, "--recursive")

        if request_type == "Update" or request_type == "Create":
            s3_deploy(s3_source_zips, s3_dest, user_metadata, system_metadata, prune, exclude, include, source_markers, extract)

        if distribution_id:
            cloudfront_invalidate(distribution_id, distribution_paths)

        cfn_send(event, context, CFN_SUCCESS, physicalResourceId=physical_id, responseData={
            # Passing through the ARN sequences dependencees on the deployment
            'DestinationBucketArn': props.get('DestinationBucketArn'),
            'SourceObjectKeys': props.get('SourceObjectKeys'),
        })
    except KeyError as e:
        cfn_error("invalid request. Missing key %s" % str(e))
    except Exception as e:
        logger.exception(e)
        cfn_error(str(e))

#---------------------------------------------------------------------------------------------------
# populate all files from s3_source_zips to a destination bucket
def s3_deploy(s3_source_zips, s3_dest, user_metadata, system_metadata, prune, exclude, include, source_markers, extract):
    # list lengths are equal
    if len(s3_source_zips) != len(source_markers):
        raise Exception("'source_markers' and 's3_source_zips' must be the same length")

    # create a temporary working directory in /tmp or if enabled an attached efs volume
    if ENV_KEY_MOUNT_PATH in os.environ:
        workdir = os.getenv(ENV_KEY_MOUNT_PATH) + "/" + str(uuid4())
        os.mkdir(workdir)
    else:
        workdir = tempfile.mkdtemp()

    logger.info("| workdir: %s" % workdir)

    # create a directory into which we extract the contents of the zip file
    contents_dir=os.path.join(workdir, 'contents')
    os.mkdir(contents_dir)

    try:
        # download the archive from the source and extract to "contents"
        for i in range(len(s3_source_zips)):
            s3_source_zip = s3_source_zips[i]
            markers       = source_markers[i]

            if extract:
                archive=os.path.join(workdir, str(uuid4()))
                logger.info("archive: %s" % archive)
                aws_command("s3", "cp", s3_source_zip, archive)
                logger.info("| extracting archive to: %s\n" % contents_dir)
                logger.info("| markers: %s" % markers)
                extract_and_replace_markers(archive, contents_dir, markers)
            else:
                logger.info("| copying archive to: %s\n" % contents_dir)
                aws_command("s3", "cp", s3_source_zip, contents_dir)

        # sync from "contents" to destination

        s3_command = ["s3", "sync"]

        if prune:
          s3_command.append("--delete")

        if exclude:
          for filter in exclude:
            s3_command.extend(["--exclude", filter])

        if include:
          for filter in include:
            s3_command.extend(["--include", filter])

        s3_command.extend([contents_dir, s3_dest])
        s3_command.extend(create_metadata_args(user_metadata, system_metadata))
        aws_command(*s3_command)
    finally:
        if not os.getenv(ENV_KEY_SKIP_CLEANUP):
            shutil.rmtree(workdir)

#---------------------------------------------------------------------------------------------------
# invalidate files in the CloudFront distribution edge caches
def cloudfront_invalidate(distribution_id, distribution_paths):
    invalidation_resp = cloudfront.create_invalidation(
        DistributionId=distribution_id,
        InvalidationBatch={
            'Paths': {
                'Quantity': len(distribution_paths),
                'Items': distribution_paths
            },
            'CallerReference': str(uuid4()),
        })
    # by default, will wait up to 10 minutes
    cloudfront.get_waiter('invalidation_completed').wait(
        DistributionId=distribution_id,
        Id=invalidation_resp['Invalidation']['Id'])

#---------------------------------------------------------------------------------------------------
# set metadata
def create_metadata_args(raw_user_metadata, raw_system_metadata):
    if len(raw_user_metadata) == 0 and len(raw_system_metadata) == 0:
        return []

    format_system_metadata_key = lambda k: k.lower()
    format_user_metadata_key = lambda k: k.lower()

    system_metadata = { format_system_metadata_key(k): v for k, v in raw_system_metadata.items() }
    user_metadata = { format_user_metadata_key(k): v for k, v in raw_user_metadata.items() }

    flatten = lambda l: [item for sublist in l for item in sublist]
    system_args = flatten([[f"--{k}", v] for k, v in system_metadata.items()])
    user_args = ["--metadata", json.dumps(user_metadata, separators=(',', ':'))] if len(user_metadata) > 0 else []

    return system_args + user_args + ["--metadata-directive", "REPLACE"]

#---------------------------------------------------------------------------------------------------
# executes an "aws" cli command
def aws_command(*args):
    aws="/opt/awscli/aws" # from AwsCliLayer
    logger.info("| aws %s" % ' '.join(args))
    subprocess.check_call([aws] + list(args))

#---------------------------------------------------------------------------------------------------
# sends a response to cloudformation
def cfn_send(event, context, responseStatus, responseData={}, physicalResourceId=None, noEcho=False, reason=None):

    responseUrl = event['ResponseURL']

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
        request = Request(responseUrl, method='PUT', data=bytes(body.encode('utf-8')), headers=headers)
        with contextlib.closing(urlopen(request)) as response:
          logger.info("| status code: " + response.reason)
    except Exception as e:
        logger.error("| unable to send response to CloudFormation")
        logger.exception(e)


#---------------------------------------------------------------------------------------------------
# check if bucket is owned by a custom resource
# if it is then we don't want to delete content
def bucket_owned(bucketName, keyPrefix):
    tag = CUSTOM_RESOURCE_OWNER_TAG
    if keyPrefix != "":
        tag = tag + ':' + keyPrefix
    try:
        request = s3.get_bucket_tagging(
            Bucket=bucketName,
        )
        return any((x["Key"].startswith(tag)) for x in request["TagSet"])
    except Exception as e:
        logger.info("| error getting tags from bucket")
        logger.exception(e)
        return False

# extract archive and replace markers in output files
def extract_and_replace_markers(archive, contents_dir, markers):
    with ZipFile(archive, "r") as zip:
        zip.extractall(contents_dir)

        # replace markers for this source
        for file in zip.namelist():
            file_path = os.path.join(contents_dir, file)
            if os.path.isdir(file_path): continue
            replace_markers(file_path, markers)

def replace_markers(filename, markers):
    # convert the dict of string markers to binary markers
    replace_tokens = dict([(k.encode('utf-8'), v.encode('utf-8')) for k, v in markers.items()])

    outfile = filename + '.new'
    with open(filename, 'rb') as fi, open(outfile, 'wb') as fo:
        for line in fi:
            for token in replace_tokens:
                line = line.replace(token, replace_tokens[token])
            fo.write(line)

    # # delete the original file and rename the new one to the original
    os.remove(filename)
    os.rename(outfile, filename)
    