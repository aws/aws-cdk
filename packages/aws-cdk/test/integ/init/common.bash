set -eu
init_test_dir="${init_test_dir:=/tmp/cdk-init-test}"

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

function assert_no_hook_files() {
  compgen "\*.hook.\*" || return 0
  echo "'cdk init' left hook files in the template directory!" >&2
  exit 1
}
