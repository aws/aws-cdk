import json
import logging
import os
import subprocess
import time
import shlex

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# these are coming from the kubectl layer
os.environ['PATH'] = '/opt/kubectl:/opt/awscli:' + os.environ['PATH']

outdir = os.environ.get('TEST_OUTDIR', '/tmp')
kubeconfig = os.path.join(outdir, 'kubeconfig')


def get_handler(event, context):
    logger.info(json.dumps(dict(event, ResponseURL='...')))

    request_type = event['RequestType']
    props = event['ResourceProperties']

    # resource properties (all required)
    cluster_name  = props['ClusterName']
    role_arn      = props['RoleArn']

    # "log in" to the cluster
    subprocess.check_call([ 'aws', 'eks', 'update-kubeconfig',
        '--role-arn', role_arn,
        '--name', cluster_name,
        '--kubeconfig', kubeconfig
    ])

    if os.path.isfile(kubeconfig):
        os.chmod(kubeconfig, 0o600)

    object_type         = props['ObjectType']
    object_name         = props['ObjectName']
    object_namespace    = props['ObjectNamespace']
    json_path           = props.get('JsonPath', None)
    go_template         = props.get('GoTemplate', None)
    timeout_seconds     = props['TimeoutSeconds']

    # `get` command format from https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
    # There will be exactly one of json_path or go_template
    if json_path is not None:
        # json path should be surrouded with '{}'
        output_arg = "-o=jsonpath={0}".format(shlex.quote("{{{0}}}".format(json_path)))
    else if go_template is not None:
        # go-template string provides its own braces
        output_arg = "-o=go-template={0}".format(shlex.quote(go_template))
    else:
        raise Exception("must provide JsonPath or GoTemplate")

    if request_type == 'Create' or request_type == 'Update':
        output = wait_for_output(['get', '-n', object_namespace, object_type, object_name, output_arg], int(timeout_seconds))
        return {'Data': {'Value': output}}
    elif request_type == 'Delete':
        pass
    else:
        raise Exception("invalid request type %s" % request_type)

def wait_for_output(args, timeout_seconds):

  end_time = time.time() + timeout_seconds
  error = None

  while time.time() < end_time:
    try:
      # the output is surrounded with '', so we unquote
      output = kubectl(args).decode('utf-8')[1:-1]
      if output:
        return output
    except Exception as e:
      error = str(e)
      # also a recoverable error
      if 'NotFound' in error:
        pass
    time.sleep(10)

  raise RuntimeError(f'Timeout waiting for output from kubectl command: {args} (last_error={error})')

def kubectl(args):
    retry = 3
    while retry > 0:
        try:
            cmd = [ 'kubectl', '--kubeconfig', kubeconfig ] + args
            output = subprocess.check_output(cmd, stderr=subprocess.PIPE)
        except subprocess.CalledProcessError as exc:
            output = exc.output + exc.stderr
            if b'i/o timeout' in output and retry > 0:
                logger.info("kubectl timed out, retries left: %s" % retry)
                retry = retry - 1
            else:
                raise Exception(output)
        else:
            logger.info(output)
            return output
