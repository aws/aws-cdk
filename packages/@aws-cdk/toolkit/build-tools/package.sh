#!/usr/bin/env bash

version=${1:-latest}
reset=0.0.0

# Toolkit package root
cd "$(dirname $(dirname "$0"))"

npm pkg set dependencies.@aws-cdk/cx-api=$version
npm pkg set dependencies.@aws-cdk/cloudformation-diff=$version
npm pkg set dependencies.@aws-cdk/region-info=$version
yarn package --private
npm pkg set dependencies.@aws-cdk/cx-api=$reset
npm pkg set dependencies.@aws-cdk/cloudformation-diff=$reset
npm pkg set dependencies.@aws-cdk/region-info=$reset
