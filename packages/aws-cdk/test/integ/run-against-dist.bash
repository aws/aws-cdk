# Helper functions to go with 'run-against-dist'
# NPM Workspace. Will have CDK CLI and verdaccio installed into it.
npmws=/tmp/cdk-rundist
rm -rf $npmws
mkdir -p $npmws

function log() {
  echo >&2 "| $@"
}

function header() {
  log
  log "============================================================================================"
  log $@
  log "============================================================================================"
}

function serve_npm_packages() {
  if [ -n "${SERVE_NPM_TARBALLS_PID:-}" ]; then
    log >&2 "Verdaccio is already running"
    return 1
  fi

  if [ ! -z "${USE_PUBLISHED_FRAMEWORK_VERSION:-}" ]; then

    echo "Testing against latest published versions of the framework"

    # when using latest published framework, only
    # install the cli and its dependencies.

    cli_root=./package

    version=$(node -p "require('${cli_root}/package.json').version")

    # good lord
    echo "Fetching @aws-cdk CLI dependencies from package.json"
    cli_deps=$(node -p "Object.entries(require('${cli_root}/package.json').dependencies).filter(x => x[0].includes('@aws-cdk')).map(x => x[0].replace('@aws-cdk/', '')).join(' ')")

    # tarballs_glob is going to look like "{file,file,...}"
    tarballs_glob="{$dist_root/js/aws-cdk-${version}.tgz"

    for dep in ${cli_deps}; do
      tarball=$dist_root/js/${dep}@${version}.jsii.tgz
      if [ ! -f ${tarball} ]; then
        # not a jsii dependency, the tarball is different...
        tarball=$dist_root/js/aws-cdk-${dep}-${version}.tgz
      fi

      tarballs_glob="${tarballs_glob},${tarball}"
    done

    # manually add cdk-assets since its not prefixed with @aws-cdk and
    # hence isn't picked up from package.json
    echo "Adding cdk-assets to CLI dependencies"
    tarballs_glob="${tarballs_glob},$dist_root/js/cdk-assets-${version}.tgz"

    # manually add @aws-cdk/cfnspec since its a transitive dependency via @aws-cdk/cloudformation-diff
    # hence isn't picked up from package.json
    echo "Adding @aws-cdk/cfnspec to CLI dependencies"
    tarballs_glob="${tarballs_glob},$dist_root/js/aws-cdk-cfnspec-${version}.tgz"

    tarballs_glob="${tarballs_glob}}"
  else

    echo "Testing against local versions of the framework"
    tarballs_glob="$dist_root/js/*.tgz"
  fi

  #------------------------------------------------------------------------------
  # Start a mock npm repository from the given tarballs
  #------------------------------------------------------------------------------
  header "Starting local NPM Repository"

  # When using '--daemon', 'npm install' first so the files are permanent, or
  # 'npx' will remove them too soon.
  npm install serve-npm-tarballs
  eval $(npx serve-npm-tarballs --glob "${tarballs_glob}" --daemon)
  trap "kill $SERVE_NPM_TARBALLS_PID" EXIT
}

# Make sure that installed CLI matches the build version
function verify_installed_cli_version() {
  local expected_version="$(node -e "console.log(require('${dist_root}/build.json').version)")"
  header "Expected CDK version: ${expected_version}"

  log "Found CDK: $(type -p cdk)"

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

function prepare_java_packages() {
  log "Preparing Maven packages..."

  # copy the maven staging repo to the maven local repo and set as M2 home
  # this ensures that the canary builds against the build artifacts, not maven central
  if [ ! -d $dist_root/java ]; then
    echo "Maven packages missing at $dist_root/java" >&2
    exit 1
  fi

  # Rename all maven-metadata.xml* files to maven-metadata-local.xml*
  # This is necessary for Maven to find them correctly after we've rsync'ed
  # them into place:
  # https://github.com/sonatype/sonatype-aether/blob/master/aether-impl/src/main/java/org/sonatype/aether/impl/internal/SimpleLocalRepositoryManager.java#L114
  for f in $(find $dist_root/java -name maven-metadata.xml\*); do
    mv "$f" "$(echo "$f" | sed s/metadata\.xml/metadata-local.xml/)"
  done

  export MAVEN_CONFIG=${MAVEN_CONFIG:-$HOME/.m2}
  rsync -a $dist_root/java/ ${MAVEN_CONFIG}/repository
}

function prepare_nuget_packages() {
  # For NuGet, we wrap the "dotnet" CLI command to use local packages.
  log "Writing new NuGet configuration..."

  local NUGET_SOURCE=$dist_root/dotnet

  if [ ! -d "$NUGET_SOURCE" ]; then
    echo "NuGet packages missing at $NUGET_SOURCE" >&2
    exit 1
  fi

  mkdir -p $HOME/.nuget/NuGet
  if [ -f $HOME/.nuget/NuGet/NuGet.Config ]; then
    echo "⚠️ Saving previous NuGet.Config to $HOME/.nuget/NuGet/NuGet.Config.bak"
    mv $HOME/.nuget/NuGet/NuGet.Config $HOME/.nuget/NuGet/NuGet.Config.bak
  fi

  trap clean_up_nuget_config EXIT

  cat > $HOME/.nuget/NuGet/NuGet.Config <<EOF
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <packageSources>
    <add key="Locally Distributed Packages" value="${NUGET_SOURCE}" />
    <add key="NuGet official package source" value="https://api.nuget.org/v3/index.json" />
  </packageSources>
</configuration>
EOF
}

function clean_up_nuget_config() {
  log "Restoring NuGet configuration"
  if [ -f $HOME/.nuget/NuGet/NuGet.Config.bak ]; then
    log "-> Restoring $HOME/.nuget/NuGet/NuGet.Config from $HOME/.nuget/NuGet/NuGet.Config.bak"
    mv -f $HOME/.nuget/NuGet/NuGet.Config.bak $HOME/.nuget/NuGet/NuGet.Config
  else
    log "-> Removing $HOME/.nuget/NuGet/NuGet.Config"
    rm -f $HOME/.nuget/NuGet/NuGet.Config
  fi
}

# pip_install REQUIREMENTS_FILE
function prepare_python_packages() {
  log "Hijacking 'pip install' command..."

  # We can't use a $PATH hijack, because we'll be creating a venv
  # later which will re-hijack ours with a 'pip' binary. Use a function instead,
  # the real logic will reside in "pip_"

  export PYTHON_WHEELS=$dist_root/python

  if [ ! -d "$PYTHON_WHEELS" ]; then
    echo "Python build artifacts missing at $PYTHON_WHEELS" >&2
    exit 1
  fi

  export -f pip
}

function pip() {
  pip_ "$@"
}
