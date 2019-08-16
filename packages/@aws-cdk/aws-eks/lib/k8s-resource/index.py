import subprocess
import os
import json
import logging
import boto3
from uuid import uuid4
from botocore.vendored import requests

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# these are coming from the kubectl layer
os.environ['PATH'] = '/opt/kubectl:/opt/awscli:' + os.environ['PATH']

outdir = os.environ.get('TEST_OUTDIR', '/tmp')
kubeconfig = os.path.join(outdir, 'kubeconfig')

CFN_SUCCESS = "SUCCESS"
CFN_FAILED = "FAILED"

def handler(event, context):

    def cfn_error(message=None):
        logger.error("| cfn_error: %s" % message)
        cfn_send(event, context, CFN_FAILED, reason=message)

    try:
        logger.info(json.dumps(event))

        request_type = event['RequestType']
        props = event['ResourceProperties']
        old_props = event.get('OldResourceProperties', {})
        physical_id = event.get('PhysicalResourceId', None)
        manifest_text = props['Manifest']

        cluster_name = os.environ.get('CLUSTER_NAME', None)
        if cluster_name is None:
            cfn_error("CLUSTER_NAME is missing in environment")
            return

        # "log in" to the cluster
        subprocess.check_call([ 'aws', 'eks', 'update-kubeconfig',
            '--name', cluster_name,
            '--kubeconfig', kubeconfig
        ])

        # write resource manifests in sequence: { r1 }{ r2 }{ r3 } (this is how
        # a stream of JSON objects can be included in a k8s manifest).
        manifest_list = json.loads(manifest_text)
        manifest_file = os.path.join(outdir, 'manifest.yaml')
        with open(manifest_file, "w") as f:
            f.writelines(map(lambda obj: json.dumps(obj), manifest_list))

        logger.info("manifest written to: %s" % manifest_file)

        if request_type == 'Create' or request_type == 'Update':
            kubectl('apply', manifest_file)
        elif request_type == "Delete":
            try:
                kubectl('delete', manifest_file)
            except Exception as e:
                logger.info("delete error: %s" % e)

        # if we are creating a new resource, allocate a physical id for it
        # otherwise, we expect physical id to be relayed by cloudformation
        if request_type == 'Create':
            physical_id = "%s/%s" % (cluster_name, str(uuid4()))
        else:
            if not physical_id:
                cfn_error("invalid request: request type is '%s' but 'PhysicalResourceId' is not defined" % request_type)
                return

        cfn_send(event, context, CFN_SUCCESS, physicalResourceId=physical_id)
        return

    except KeyError as e:
        cfn_error("invalid request. Missing '%s'" % str(e))
    except Exception as e:
        logger.exception(e)
        cfn_error(str(e))

def kubectl(verb, file):
    import subprocess
    try:
        cmnd = ['kubectl', verb, '--kubeconfig', kubeconfig, '-f', file]
        output = subprocess.check_output(cmnd, stderr=subprocess.STDOUT)
    except subprocess.CalledProcessError as exc:
        raise Exception(exc.output)
    else:
        logger.info(output)


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
