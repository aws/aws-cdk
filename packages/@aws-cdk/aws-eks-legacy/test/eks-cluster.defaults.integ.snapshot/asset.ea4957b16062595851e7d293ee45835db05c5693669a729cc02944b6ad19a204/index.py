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
        old_config = old_props.get('Config', {})

        def new_cluster_name():
            return "cluster-%s" % request_id

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
            elif request_type == 'Create': cluster_name = new_cluster_name()
            else: raise Exception("unexpected error. cannot determine cluster name")
        config['name'] = cluster_name
        logger.info("request: %s" % config)

        # extract additional options
        resourcesVpcConfig = config.get('resourcesVpcConfig', None)
        roleArn = config.get('roleArn', None)
        version = config.get('version', None)

        def should_replace_cluster():
            logger.info("old config: %s" % json.dumps(old_config))

            old_name = physical_id
            if old_name != cluster_name:
                logger.info("'name' change requires replacement (old=%s, new=%s)" % (old_name, cluster_name))
                return True

            old_resourcesVpcConfig = old_config.get('resourcesVpcConfig', None)
            if old_resourcesVpcConfig != resourcesVpcConfig:
                logger.info("'resourcesVpcConfig' change requires replacement (old=%s, new=%s)" % (old_resourcesVpcConfig, resourcesVpcConfig))
                return True
            
            old_roleArn = old_config.get('roleArn', None)
            if old_roleArn != roleArn:
                logger.info("'roleArn' change requires replacement (old=%s, new=%s)" % (old_roleArn, roleArn))
                return True
            
            return False

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
            # physical_id is always defined for "update"
            logger.info("updating cluster %s" % physical_id)
            current_state = eks.describe_cluster(name=physical_id)['cluster']

            # changes to "name", "resourcesVpcConfig" and "roleArn" all require replacement
            # according to the cloudformation spec, so if one of these change, we basically need to create
            # a new cluster with the new configuration (in this case, if "version" has been changed, the
            # new version will be used by the new cluster).
            if should_replace_cluster():
                # unless we are renaming the cluster, allocate a new cluster name
                if cluster_name == physical_id:
                    cluster_name = new_cluster_name()
                    config['name'] = cluster_name

                logger.info("replacing cluster %s with a new cluster %s" % (physical_id, cluster_name))
                resp = eks.create_cluster(**config)
                logger.info("create (replacement) response: %s" % resp)
            else:
                # version change - we can do that without replacement
                old_version = old_config.get('version', None)
                if (old_version is None) and (version is None):
                    logger.info("no version change")
                else:
                    old_version_actual = current_state['version']
                    if version != old_version_actual:
                        if version is None:
                            raise Exception("Version cannot be changed from a specific value (%s) to undefined" % old_version)

                        resp = eks.update_cluster_version(name=cluster_name,version=version)
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

    except:
        e = sys.exc_info()[1]
        logger.exception(e)
        cfn_error(str(e))

def resp_to_attriburtes(resp):
    return


#---------------------------------------------------------------------------------------------------
# sends a response to cloudformation
def cfn_send(event, context, responseStatus, responseData={}, physicalResourceId=None, noEcho=False, reason=None):

    responseUrl = event['ResponseURL']
    logger.info(responseUrl)

    # use previous PhysicalResourceId if physical resource ID is not specified, otherwise update failures
    # will result in resource replacement
    physicalResourceId = physicalResourceId or event.get('PhysicalResourceId', context.log_stream_name)

    responseBody = {}
    responseBody['Status'] = responseStatus
    responseBody['Reason'] = reason or ('See the details in CloudWatch Log Stream: ' + context.log_stream_name)
    responseBody['PhysicalResourceId'] = physicalResourceId
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
