# Helper functions to go with 'run-against-dist'
# NPM Workspace. Will have CDK CLI and verdaccio installed into it.
npmws=/tmp/cdk-rundist
rm -rf $npmws
mkdir -p $npmws

# This script must create 1 or 2 traps, and the 'trap' command will replace
# the previous trap, so get some 'dynamic traps' mechanism in place
TRAPS=()

function run_traps() {
  for cmd in "${TRAPS[@]}"; do
    echo "cleanup: $cmd" >&2
    eval "$cmd"
  done
}

trap run_traps EXIT

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

  #------------------------------------------------------------------------------
  # Start a mock npm repository from the given tarballs
  #------------------------------------------------------------------------------
  header "Starting local NPM Repository (Serving version ${CANDIDATE_VERSION})"

  tarballs_glob="$dist_root/js/*.tgz"

  if [[ -f package.json ]]; then
    echo "Do not run this script in a directory with a package.json! It will most likely break!" >&2
    # Cowardly not running 'exit 1' because I'm not sure I won't mess up the build/canaries by doing so
  fi

  # When using '--daemon', 'npm install' first so the files are permanent, or
  # 'npx' will remove them too soon.
  npm install serve-npm-tarballs
  eval $(npx serve-npm-tarballs --glob "${tarballs_glob}" --daemon)
  TRAPS+=("kill $SERVE_NPM_TARBALLS_PID")
}

function install_cli() {
  echo "Installing CLI aws-cdk@${CANDIDATE_VERSION}"
  (cd ${npmws} && npm install --prefix $npmws aws-cdk@${CANDIDATE_VERSION})
  export PATH=$npmws/node_modules/.bin:$PATH
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

  TRAPS+=('clean_up_nuget_config')

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
