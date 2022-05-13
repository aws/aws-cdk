#! /bin/env bash

scriptdir=$(cd $(dirname $0) &>/dev/null && pwd)

cd "${scriptdir}/superchain"
docker_gid="$(getent group docker | awk -F: '{printf "%d", $3}')"
docker build \
  --file Dockerfile \
  --tag superchain-local \
  . \
  --build-arg USER_NAME="$USER" \
  --build-arg USER_ID="$( id -u $USER )" \
  --build-arg GROUP_ID="$( id -g $USER )" \
  --build-arg GROUP_NAME="$USER" \
  --build-arg DOCKER_GID="$docker_gid"

