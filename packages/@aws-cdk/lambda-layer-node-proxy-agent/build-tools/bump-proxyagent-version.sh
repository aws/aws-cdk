#!/bin/bash
set -eu
scriptdir=$(cd $(dirname $0) && pwd)

package=proxy-agent

npm show $package version > $scriptdir/../proxyagent.version

echo "Proxy Agent is currently at $(cat $scriptdir/../proxyagent.version)"
