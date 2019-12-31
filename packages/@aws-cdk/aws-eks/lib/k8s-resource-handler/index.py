import json
import logging
import os
import subprocess

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# these are coming from the kubectl layer
os.environ['PATH'] = '/opt/kubectl:/opt/awscli:' + os.environ['PATH']

outdir = os.environ.get('TEST_OUTDIR', '/tmp')
kubeconfig = os.path.join(outdir, 'kubeconfig')

def handler(event, context):
    logger.info(json.dumps(event))

    request_type = event['RequestType']
    props = event['ResourceProperties']

    # resource properties (all required)
    cluster_name  = props['ClusterName']
    manifest_text = props['Manifest']
    role_arn      = props['RoleArn']

    # "log in" to the cluster
    subprocess.check_call([ 'aws', 'eks', 'update-kubeconfig',
        '--role-arn', role_arn,
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


def kubectl(verb, file):
    retry = 3
    while retry > 0:
        try:
            cmd = ['kubectl', verb, '--kubeconfig', kubeconfig, '-f', file]
            output = subprocess.check_output(cmd, stderr=subprocess.STDOUT)
        except subprocess.CalledProcessError as exc:
            output = exc.output
            if 'i/o timeout' in output and retry > 0:
                logger.info("kubectl timed out, retries left: %s" % retry)
                retry = retry - 1
            else:
                raise Exception(output)
        else:
            logger.info(output)
            return
