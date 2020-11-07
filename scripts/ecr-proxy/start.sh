#!/bin/bash

scriptdir="$(cd $(dirname $0) && pwd)"

port=${$1:-5000}

echo "Adding nginx repository to yum"
cp ${scriptdir}/nginx.repo /etc/yum.repos.d/nginx.repo
yum repolist

ehoc "Installing nginx"
yum install -y nginx


echo "Fetching Amazon ECR token"

ECR_TOKEN=$(aws ecr get-authorization-token --output text --query 'authorizationData[].authorizationToken')
NGINX_CONF=/etc/nginx/conf.d/default.conf

echo "Configuring nginx"
cp ${scriptdir}/nginx.conf ${NGINX_CONF}

sed -i "s|ECR_REGISTRY|${ECR_REGISTRY}|g" ${NGINX_CONF}
sed -i "s|ECR_TOKEN|${ECR_TOKEN}|g" ${NGINX_CONF}
sed -i "s|PROXY_PORT|${port}|g" ${NGINX_CONF}

echo "Using nginx config:"
cat ${NGINX_CONF}

echo "Starting nginx"
nginx
sleep 5

echo "Done"