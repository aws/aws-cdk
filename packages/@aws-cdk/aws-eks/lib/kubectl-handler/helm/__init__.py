import json
import logging
import os
import subprocess
import shutil
import zipfile
from urllib.parse import urlparse, unquote

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# these are coming from the kubectl layer
os.environ['PATH'] = '/opt/helm:/opt/awscli:' + os.environ['PATH']

outdir = os.environ.get('TEST_OUTDIR', '/tmp')
kubeconfig = os.path.join(outdir, 'kubeconfig')

def get_chart_asset_from_url(chart_asset_url):
    chart_zip = os.path.join(outdir, 'chart.zip')
    shutil.rmtree(chart_zip, ignore_errors=True)
    subprocess.check_call(['aws', 's3', 'cp', chart_asset_url, chart_zip])
    chart_dir = os.path.join(outdir, 'chart')
    shutil.rmtree(chart_dir, ignore_errors=True)
    os.mkdir(chart_dir)
    with zipfile.ZipFile(chart_zip, 'r') as zip_ref:
        zip_ref.extractall(chart_dir)
    return chart_dir

def helm_handler(event, context):
    logger.info(json.dumps(event))

    request_type = event['RequestType']
    props = event['ResourceProperties']

    # resource properties
    cluster_name     = props['ClusterName']
    role_arn         = props['RoleArn']
    release          = props['Release']
    chart            = props.get('Chart', None)
    chart_asset_url  = props.get('ChartAssetURL', None)
    version          = props.get('Version', None)
    wait             = props.get('Wait', False)
    timeout          = props.get('Timeout', None)
    namespace        = props.get('Namespace', None)
    create_namespace = props.get('CreateNamespace', None)
    repository       = props.get('Repository', None)
    values_text      = props.get('Values', None)

    # "log in" to the cluster
    subprocess.check_call([ 'aws', 'eks', 'update-kubeconfig',
        '--role-arn', role_arn,
        '--name', cluster_name,
        '--kubeconfig', kubeconfig
    ])

    if os.path.isfile(kubeconfig):
        os.chmod(kubeconfig, 0o600)

    # Write out the values to a file and include them with the install and upgrade
    values_file = None
    if not request_type == "Delete" and not values_text is None:
        values = json.loads(values_text)
        values_file = os.path.join(outdir, 'values.yaml')
        with open(values_file, "w") as f:
            f.write(json.dumps(values, indent=2))

    if request_type == 'Create' or request_type == 'Update':
        # Ensure chart or chart_asset_url are set
        if chart == None and chart_asset_url == None:
            raise RuntimeError(f'chart or chartAsset must be specified')

        if chart_asset_url != None:
            assert(chart==None)
            assert(repository==None)
            assert(version==None)
            if not chart_asset_url.startswith('s3://'):
              raise RuntimeError(f'ChartAssetURL must point to as s3 location but is {chart_asset_url}')
            # future work: support versions from s3 assets
            chart = get_chart_asset_from_url(chart_asset_url)

        helm('upgrade', release, chart, repository, values_file, namespace, version, wait, timeout, create_namespace)
    elif request_type == "Delete":
        try:
            helm('uninstall', release, namespace=namespace, timeout=timeout)
        except Exception as e:
            logger.info("delete error: %s" % e)

def helm(verb, release, chart = None, repo = None, file = None, namespace = None, version = None, wait = False, timeout = None, create_namespace = None):
    import subprocess

    cmnd = ['helm', verb, release]
    if not chart is None:
        cmnd.append(chart)
    if verb == 'upgrade':
        cmnd.append('--install')
    if create_namespace:
        cmnd.append('--create-namespace')
    if not repo is None:
        cmnd.extend(['--repo', repo])
    if not file is None:
        cmnd.extend(['--values', file])
    if not version is None:
        cmnd.extend(['--version', version])
    if not namespace is None:
        cmnd.extend(['--namespace', namespace])
    if wait:
        cmnd.append('--wait')
    if not timeout is None:
        cmnd.extend(['--timeout', timeout])
    cmnd.extend(['--kubeconfig', kubeconfig])

    maxAttempts = 3
    retry = maxAttempts
    while retry > 0:
        try:
            output = subprocess.check_output(cmnd, stderr=subprocess.STDOUT, cwd=outdir)
            logger.info(output)
            return
        except subprocess.CalledProcessError as exc:
            output = exc.output
            if b'Broken pipe' in output:
                retry = retry - 1
                logger.info("Broken pipe, retries left: %s" % retry)
            else:
                raise Exception(output)
    raise Exception(f'Operation failed after {maxAttempts} attempts: {output}')
