import json
import logging
import os
import re
import subprocess
import shutil
import tempfile
import zipfile
import boto3

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

def is_ecr_public_available(region):
    s = boto3.Session()
    return s.get_partition_for_region(region) == 'aws'

def helm_handler(event, context):
    logger.info(json.dumps(dict(event, ResponseURL='...')))

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
    atomic           = props.get('Atomic', False)
    timeout          = props.get('Timeout', None)
    namespace        = props.get('Namespace', None)
    create_namespace = props.get('CreateNamespace', None)
    repository       = props.get('Repository', None)
    values_text      = props.get('Values', None)
    skip_crds        = props.get('SkipCrds', False)

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

        if repository is not None and repository.startswith('oci://'):
            tmpdir = tempfile.TemporaryDirectory()
            chart_dir = get_chart_from_oci(tmpdir.name, repository, version)
            chart = chart_dir

        helm('upgrade', release, chart, repository, values_file, namespace, version, wait, timeout, create_namespace, atomic=atomic)
    elif request_type == "Delete":
        try:
            helm('uninstall', release, namespace=namespace, wait=wait, timeout=timeout)
        except Exception as e:
            logger.info("delete error: %s" % e)


def get_oci_cmd(repository, version):
    # Generates OCI command based on pattern. Public ECR vs Private ECR are treated differently.
    private_ecr_pattern = 'oci://(?P<registry>\d+\.dkr\.ecr\.(?P<region>[a-z0-9\-]+)\.(?P<domain>[a-z0-9\.-]+))*'
    public_ecr_pattern = 'oci://(?P<registry>public\.ecr\.aws)*'

    private_registry = re.match(private_ecr_pattern, repository).groupdict()
    public_registry = re.match(public_ecr_pattern, repository).groupdict()

    if private_registry['registry'] is not None:
        logger.info("Found AWS private repository")
        cmnd = [
            f"aws ecr get-login-password --region {private_registry['region']} | " \
            f"helm registry login --username AWS --password-stdin {private_registry['registry']}; helm pull {repository} --version {version} --untar"
            ]
    elif public_registry['registry'] is not None:
        logger.info("Found AWS public repository, will use default region as deployment")
        region = os.environ.get('AWS_REGION', 'us-east-1')

        if is_ecr_public_available(region):
            cmnd = [
                f"aws ecr-public get-login-password --region us-east-1 | " \
                f"helm registry login --username AWS --password-stdin {public_registry['registry']}; helm pull {repository} --version {version} --untar"
                ]
        else:
            # `aws ecr-public get-login-password` and `helm registry login` not required as ecr public is not available in current region
            # see https://helm.sh/docs/helm/helm_registry_login/
            cmnd = [f"helm pull {repository} --version {version} --untar"]
    else:
        logger.error("OCI repository format not recognized, falling back to helm pull")
        cmnd = [f"helm pull {repository} --version {version} --untar"]

    return cmnd


def get_chart_from_oci(tmpdir, repository = None, version = None):

    cmnd = get_oci_cmd(repository, version)

    maxAttempts = 3
    retry = maxAttempts
    while retry > 0:
        try:
            logger.info(cmnd)
            output = subprocess.check_output(cmnd, stderr=subprocess.STDOUT, cwd=tmpdir, shell=True)
            logger.info(output)

            # effectively returns "$tmpDir/$lastPartOfOCIUrl", because this is how helm pull saves OCI artifact.
            # Eg. if we have oci://9999999999.dkr.ecr.us-east-1.amazonaws.com/foo/bar/pet-service repository, helm saves artifact under $tmpDir/pet-service
            return os.path.join(tmpdir, repository.rpartition('/')[-1])
        except subprocess.CalledProcessError as exc:
            output = exc.output
            if b'Broken pipe' in output:
                retry = retry - 1
                logger.info("Broken pipe, retries left: %s" % retry)
            else:
                raise Exception(output)
    raise Exception(f'Operation failed after {maxAttempts} attempts: {output}')


def helm(verb, release, chart = None, repo = None, file = None, namespace = None, version = None, wait = False, timeout = None, create_namespace = None, skip_crds = False, atomic = False):
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
    if skip_crds:
        cmnd.append('--skip-crds')
    if not timeout is None:
        cmnd.extend(['--timeout', timeout])
    if atomic:
        cmnd.append('--atomic')    
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
