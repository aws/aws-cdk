#!/bin/bash
#--------------------------------------------------------------------------------
# git bisect helper
#
# In case you need to rebuild the code base to run actual deployments against some code.
#
# First create `/tmp/run-test.sh`:
#
# ```
# #!/bin/bash
# nice npx nx run @aws-cdk-testing/framework-integ:build || exit $BUILD_ERROR
# nice env -C packages/@aws-cdk-testing/framework-integ yarn integ test/aws-s3-deployment/test/integ.bucket-deployment-data.js --force
# ```
#
# Then run:
#
# ```
# $ git bisect start
# $ git bisect bad HEAD
# $ git bisect good <some_old_commit>
# $ git bisect run scripts/bisect-helper.sh /tmp/run-test.sh
# ```
#
# Recovery in case you run into trouble (commit has been marked both bad and good, for example);
#
# ```
# $ git bisect log > /tmp/bisect.log
# $ vim /tmp/bisect.log          # Edit à volonté
# $ git bisect reset
# $ git bisect replay /tmp/bisect.log
# ```
#
#--------------------------------------------------------------------------------
set -eu

# Error code to skip this commit and continue bisecting
export SKIP_COMMIT=125

# Will abort bisect process for a human to fix the build
export BUILD_ERROR=128

cd $(git rev-parse --show-toplevel)

scripts/branch-switched.sh

# Fix some things that pkglint will otherwise complain about and cannot be silenced otherwise
this_year=$(date +%Y)
for dir in packages/awslint "tools/@aws-cdk/cdk-build-tools" "packages/@aws-cdk/custom-resource-handlers"; do
  (
    cd $dir
    for file in NOTICE LICENSE; do
      sed -i.bak -E "s/Copyright 2018-[0-9]+ Amazon/Copyright 2018-${this_year} Amazon/g" $file
    done
    rm *.bak
  )
done

#-------------------------------------------------------------------------------------
# Do the actual test

export CDK_BUILD_SKIP_LINT=true

exitcode=0
eval "$@" || {
  exitcode=$?
}

#-------------------------------------------------------------------------------------

# Cleanup before we switch branches
git reset --hard

# Remove fully untracked files (different from ignored files)
for filename in $(git ls-files --others --exclude-standard); do
  rm -rf $filename
  echo Removed $filename
done

exit $exitcode
