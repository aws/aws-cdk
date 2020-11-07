#!/bin/bash

########################################################################
# Starts an nginx based reverse proxy to an ECR registry.
# The proxy add the necessary authentication headers needed to connect
# to ECR, allowing it to serve as a registry mirror in a docker daemon configuration.
#
# This is needed because docker does not support authenticated mirrors.
#
# Inspired by https://github.com/moby/moby/issues/30880#issuecomment-279294765
#
# Usage: ./start.sh 111111.dkr.ecr.us-east-1.amazonaws.com 5000
#

set -euo pipefail

scriptdir="$(cd $(dirname $0) && pwd)"

registry=${1}
port=${2}

if ! command -v yum; then
  echo "yum must be installed to run the proxy. Are you sure you meant to run this script?"
  exit 1
fi

if [ -z ${registry} ]; then
  echo "ECR registry must be passed as the first argument. For example: ./start.sh 111111.dkr.ecr.us-east-1.amazonaws.com 5000"
  exit 1
fi

if [ -z ${port} ]; then
  echo "Proxy port must be passed as the second argument. For example: ./start.sh 111111.dkr.ecr.us-east-1.amazonaws.com 5000"
  exit 1
fi

echo "Adding nginx repository to yum"
cp ${scriptdir}/nginx.repo /etc/yum.repos.d/nginx.repo
yum repolist

echo "Installing nginx..."
yum install -y nginx

echo "Configuring Nginx..."
ECR_TOKEN=$(aws ecr get-authorization-token --output text --query 'authorizationData[].authorizationToken')
NGINX_CONF=/etc/nginx/conf.d/default.conf

sed -i "s|ECR_REGISTRY|${registry}|g" ${NGINX_CONF}
sed -i "s|ECR_TOKEN|${ECR_TOKEN}|g" ${NGINX_CONF}
sed -i "s|PROXY_PORT|${port}|g" ${NGINX_CONF}

echo "Starting nginx..."
nginx
timeout 15 sh -c "until cat /var/run/nginx.pid; do echo .; sleep 1; done"

echo "Done"