set -eu

function log() {
  echo >&2 "| $@"
}

function header() {
  log
  log "============================================================================================"
  log $@
  log "============================================================================================"
}

# This is where build artifacts reside
dist=$(cd ${CDK_DIST:-$PWD} && pwd)

# NPM Workspace. Will have CDK CLI and verdaccio installed into it.
npmws=$(mktemp -d)
export PATH=${npmws}/node_modules/.bin:$PATH

function update_verdaccio_config() {
  local verdaccio_config="$1"
  local proxy="${2:-}"

  cat > "${verdaccio_config}" <<HERE
  storage: ${npmws}/storage
  uplinks:
    npmjs:
      url: https://registry.npmjs.org
      cache: false
  packages:
    '@aws-cdk/*':
      access: \$all
      publish: \$all
    'aws-cdk':
      access: \$all
      publish: \$all
    '**':
      access: \$all
      publish: \$all
      ${proxy}
  max_body_size: '100mb'
  publish:
    allow_offline: true
  logs:
    - {type: stdout, format: pretty, level: error}
HERE

  cat >&2 ${verdaccio_config}
}

function config_npm_verdaccio() {
  log >&2 "configuring npm to use verdaccio"

  export npm_config_userconfig="${dist}/.npmrc"
  echo "registry=http://localhost:4873/" > ${npm_config_userconfig}
  echo "//localhost:4873/:_authToken=none" >> ${npm_config_userconfig}
  echo "" >> ${npm_config_userconfig}
}

function run_verdaccio_with_packages() {
  if [ -n "${VERDACCIO_RUNNING:-}" ]; then
    log >&2 "verdaccio is already running"
    config_npm_verdaccio
    return
  fi

  #------------------------------------------------------------------------------
  # Start a local npm repository and install the CDK from the distribution to it
  #------------------------------------------------------------------------------
  header "Starting local NPM Repository"
  local verdaccio_config="${npmws}/config.yaml"

  if ! which verdaccio; then
    cd $npmws
    npm install --no-save verdaccio
    cd -
  fi

  update_verdaccio_config "${verdaccio_config}"
  verdaccio --config "${verdaccio_config}" &
  local publisher_pid=$!
  trap "echo 'shutting down verdaccio publisher'; kill ${publisher_pid} || true" EXIT
  log >&2 "waiting for publisher verdaccio to start..."
  sleep 1
  log "publisher verdaccio pid: ${publisher_pid}"

  config_npm_verdaccio

  for tgz in "$@"; do
    log "publishing $tgz"
    npm publish $tgz
  done

  kill ${publisher_pid}
  wait ${publisher_pid} || true

  # start consumer verdaccio with npm
  header "Starting verdaccio for consumption (with npm uplink)"
  update_verdaccio_config "${verdaccio_config}" "proxy: npmjs"
  verdaccio --config "${verdaccio_config}" &
  local consumer_pid=$!
  trap "echo 'shutting down verdaccio consumer'; kill ${consumer_pid} || true" EXIT
  log >&2 "waiting for consumer verdaccio to start..."
  sleep 1
  log "consumer verdaccio pid: ${consumer_pid}"

  export VERDACCIO_RUNNING=1
}

# Install CDK CLI, make sure it's on the PATH
function prepare_toolkit() {
  cd $npmws
  if ${IS_CANARY:-false}; then
    # Latest version of toolkit
    npm install aws-cdk
  else
    # Toolkit version that is in the dist directory
    npm install $(ls $dist/js/aws-cdk-*.tgz | grep -E 'aws-cdk-[0-9.]+.tgz')
    verify_installed_cli_version
  fi
  cd -
}

# Make sure that installed CLI matches the build version
#
# Only works in integ mode.
function verify_installed_cli_version() {
  local expected_version="$(node -e "console.log(require('${dist}/build.json').version)")"
  header "Expected CDK version: ${expected_version}"

  # Execute "cdk --version" as a validation that the toolkit is installed
  local actual_version="$(cdk --version | cut -d" " -f1)"

  if [ "${expected_version}" != "${actual_version}" ]; then
    log "Mismatched CDK version. Expected: ${expected_version}, actual: ${actual_version}"
    cdk --version
    exit 1
  else
    log "Verified CDK version is: ${expected_version}"
  fi
}

# In integration test mode, make it so that the local NPM packages are installed
# when 'npm install @aws-cdk/xxx' is run.
#
# In canary mode, do nothing.
function preload_npm_packages() {
  if ${IS_CANARY:-false}; then
    return
  fi

  if [ ! -d "$dist/js" ]; then
    echo "$dist/js not found - expected to have npm build artifacts"
    exit 1
  fi

  run_verdaccio_with_packages $dist/js/*.tgz
}

function prepare_java_packages() {
  if ${IS_CANARY:-false}; then
    return
  fi

  # copy the maven staging repo to the maven local repo and set as M2 home
  # this ensures that the canary builds against the build artifacts, not maven central
  if [ ! -d $dist/java ]; then
    echo "JSII build artifacts missing when running in integration mode" >&2
    exit 1
  fi

  export MAVEN_CONFIG=${MAVEN_CONFIG:-$HOME/.m2}
  rsync -av $dist/java/ ${MAVEN_CONFIG}/repository
}

function prepare_nuget_packages() {
  real_dotnet=$(which dotnet)

  if ${IS_CANARY:-false}; then
    return
  fi

  # JSII build artifacts should be used during integration tests
  # This directory does not exist in canary mode (IS_CANARY=true)
  nuget_source=$dist/dotnet

  if [ ! -d "$nuget_source" ]; then
    echo "JSII build artifacts missing when running in integration mode" >&2
    exit 1
  fi
}

# Hijack the 'dotnet' command to include local sources in integ mode
function dotnet() {
  if [[ "${1:-}" == "build" ]]; then
    shift
    if ${IS_CANARY:-false}; then
      $real_dotnet build \
        --source https://api.nuget.org/v3/index.json \
        "$@"
    else
      $real_dotnet build \
        --source $nuget_source \
        --source https://api.nuget.org/v3/index.json \
        "$@"
    fi
  else
    $real_dotnet "$@"
  fi
}

# pip_install REQUIREMENTS_FILE
function pip_install_r() {
  if ${IS_CANARY:-false}; then
    pip install -r $1
    return
  fi

  pip install $dist/python/*.whl
}
