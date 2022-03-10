#!/bin/bash
#
# If the environment variable S3_BUILD_CACHE is set, compress and upload the
# contents of $HOME/.s3buildcache to it.
#
set -eu

cachedir=$HOME/.s3buildcache
mkdir -p $cachedir

if [[ "${S3_BUILD_CACHE:-}" = "" ]]; then
    exit 0
fi

echo "🧳 Storing build cache at: ${S3_BUILD_CACHE}"

if ! (cd $cachedir && tar czv . | aws s3 cp - ${S3_BUILD_CACHE}); then
    echo "🧳⚠️  Something went wrong storing the cache."
fi

echo "🧳 Finished."
