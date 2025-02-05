#!/usr/bin/env bash

version=${1:-latest}
reset=0.0.0
commit=$(git rev-parse --short HEAD)

# Toolkit package root
cd "$(dirname $(dirname "$0"))"

npm pkg set version=0.0.0-alpha.$commit
npm pkg set dependencies.@aws-cdk/cx-api=$version
npm pkg set dependencies.@aws-cdk/cloudformation-diff=$version
npm pkg set dependencies.@aws-cdk/region-info=$version
yarn package --private
npm pkg set version=$reset
npm pkg set dependencies.@aws-cdk/cx-api=$reset
npm pkg set dependencies.@aws-cdk/cloudformation-diff=$reset
npm pkg set dependencies.@aws-cdk/region-info=$reset
