#!/bin/bash
#
# If the environment variable S3_BUILD_CACHE is set, download and extract the
# tarball it points to into the directory $HOME/.s3buildcache.
#
set -eu

cachedir=$HOME/.s3buildcache
mkdir -p $cachedir

if [[ "${S3_BUILD_CACHE:-}" = "" ]]; then
    exit 0
fi

echo "🧳 Build cache enabled: ${S3_BUILD_CACHE}"
if ! aws s3 ls ${S3_BUILD_CACHE} > /dev/null; then
    echo "🧳⚠️  Cache not found."
    exit 0
fi

if ! (cd $cachedir && aws s3 cp ${S3_BUILD_CACHE} - | tar xzv); then
    echo "🧳⚠️  Something went wrong fetching the cache. Continuing anyway."
fi

if [ -f "$cachedir/build-info.json" ]; then
    echo "🧳 Cache provenance"
    cat "$cachedir/build-info.json"
else
    echo "🧳⚠️ No provenance attached to cache"
fi
