set -eu
init_test_dir=/tmp/cdk-init-test

function setup() {
  rm -rf $init_test_dir
  mkdir -p $init_test_dir
  cd $init_test_dir
}

function log() {
  echo >&2 "| $@"
}

function header() {
  log
  log "============================================================================================"
  log $@
  log "============================================================================================"
}
