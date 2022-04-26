function invokeJest() {
  # Install these dependencies that the tests (written in Jest) need.
  # Only if we're not running from the repo, because if we are the
  # dependencies have already been installed by the containing 'aws-cdk' package's
  # package.json.
  if ! npx --no-install jest --version; then
    echo 'Looks like we need to install jest first. Hold on.' >& 2
    npm install --prefix .. jest jest-junit aws-sdk axios
  fi

  # This must --runInBand because parallelism is arranged for inside the tests
  # themselves and they must run in the same process in order to coordinate to
  # make sure no 2 tests use the same region at the same time.
  npx jest --runInBand --verbose "$@"
}
