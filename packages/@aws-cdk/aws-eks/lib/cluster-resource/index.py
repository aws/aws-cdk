import subprocess
import os
import json
import logging
import sys

sys.path.insert(0, '/opt/awscli')
import botocore.session
from botocore.vendored import requests

logger = logging.getLogger()
logger.setLevel(logging.INFO)

CFN_SUCCESS = "SUCCESS"
CFN_FAILED = "FAILED"

# these are coming from the kubectl layer
os.environ['PATH'] = '/opt/kubectl:/opt/awscli:' + os.environ['PATH']

outdir = os.environ.get('TEST_OUTDIR', '/tmp')
kubeconfig = os.path.join(outdir, 'kubeconfig')

def handler(event, context):

    def cfn_error(message=None):
        logger.error("| cfn_error: %s" % message)
        cfn_send(event, context, CFN_FAILED, reason=message)

    try:
        logger.info(json.dumps(event))

        stack_id = event['StackId']
        request_id = event['RequestId'] # used to generate cluster name
        request_type = event['RequestType']
        props = event['ResourceProperties']
        old_props = event.get('OldResourceProperties', {})
        physical_id = event.get('PhysicalResourceId', None)
        config = props['Config']

        logger.info(json.dumps(config))

        session = botocore.session.get_session()
        eks = session.create_client('eks');

        # determine cluster name: the it can either be explicitly
        # specified in the resource properties or brought in from
        # the physical id. for "Create" operations, if the cluster
        # name is not created, it is allocated from the request id
        cluster_name=config.get('name', None)
        if cluster_name is None:
            if physical_id: cluster_name = physical_id
            elif request_type == 'Create': cluster_name = "cluster-%s" % request_id
            else: raise Exception("unexpected error. cannot determine cluster name")
        config['name'] = cluster_name
        logger.info("request: %s" % config)

        # delete is a special case
        if request_type == 'Delete':
            logger.info('deleting cluster')
            eks.delete_cluster(name=cluster_name)
            logger.info('waiting for cluster to be deleted...')
            waiter = eks.get_waiter('cluster_deleted')
            waiter.wait(name=cluster_name)
            cfn_send(event, context, CFN_SUCCESS, physicalResourceId=cluster_name)
            return

        if request_type == 'Create':
            logger.info("creating cluster %s" % cluster_name)
            resp = eks.create_cluster(**config)
            logger.info("create response: %s" % resp)
        elif request_type == 'Update':
            logger.info("updating cluster %s" % cluster_name)
            resp = eks.update_cluster_config(**config)
            logger.info("update response: %s" % resp)
        else:
            raise Exception("Invalid request type %s" % request_type)

        # wait for the cluster to become active (13min timeout)
        logger.info('waiting for cluster to become active...')
        waiter = eks.get_waiter('cluster_active')
        waiter.wait(name=cluster_name, WaiterConfig={
            'Delay': 30,
            'MaxAttempts': 26
        })

        resp = eks.describe_cluster(name=cluster_name)
        logger.info("describe response: %s" % resp)
        attrs = {
            'Name': resp['cluster']['name'],
            'Endpoint': resp['cluster']['endpoint'],
            'Arn': resp['cluster']['arn'],
            'CertificateAuthorityData': resp['cluster']['certificateAuthority']['data']
        }
        logger.info("attributes: %s" % attrs)
        cfn_send(event, context, CFN_SUCCESS, responseData=attrs, physicalResourceId=cluster_name)

    except KeyError as e:
        cfn_error("invalid request. Missing '%s'" % str(e))
    except Exception as e:
        logger.exception(e)
        cfn_error(str(e))

def resp_to_attriburtes(resp):
    return


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
